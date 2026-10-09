#!/usr/bin/env python3
"""Build deterministic, single-skill ZIPs from a frozen Git revision."""

import argparse
import hashlib
import io
import json
import re
import subprocess
import sys
import zipfile
from pathlib import Path, PurePosixPath


DESCRIPTION_MAP = "scripts/claude-web-descriptions.json"
SKILL_NAME = re.compile(r"[a-z0-9]+(?:-[a-z0-9]+)*")
EXCLUDED_PARTS = {"evals", "__pycache__", "node_modules", ".cache", ".DS_Store"}


def git(repo, *args):
    return subprocess.check_output(["git", "-C", str(repo), *args], stderr=subprocess.PIPE)


def sha256(data):
    return hashlib.sha256(data).hexdigest()


def metadata(data):
    text = data.decode("utf-8")
    front = re.match(r"\A---\r?\n(.*?)\r?\n---(?:\r?\n|$)", text, re.S)
    if not front:
        raise ValueError("SKILL.md is missing YAML frontmatter")
    fields = {}
    for key in ("name", "description"):
        matches = list(re.finditer(r"^" + key + r":[ \t]*(.*)$", front[1], re.M))
        if len(matches) != 1:
            raise ValueError(f"SKILL.md requires one single-line {key}")
        value = matches[0][1].rstrip("\r").strip()
        if value.startswith('"'):
            value = json.loads(value)
        elif value.startswith("'") and value.endswith("'"):
            value = value[1:-1].replace("''", "'")
        elif not value or value.startswith(("|", ">")):
            raise ValueError(f"Unsupported {key} scalar; use a single-line value")
        if not isinstance(value, str) or not value.strip():
            raise ValueError(f"SKILL.md {key} must be nonempty text")
        fields[key] = value
    return fields


def replace_description(data, description):
    # Replace only the top-level metadata line; retain body and other bytes.
    front_end = re.search(rb"\r?\n---(?:\r?\n|$)", data[3:])
    if not front_end:
        raise ValueError("SKILL.md is missing closing frontmatter")
    boundary = front_end.end() + 3
    replacement = ("description: " + json.dumps(description, ensure_ascii=False)).encode()
    head, count = re.subn(rb"(?m)^description:[^\r\n]*", lambda _: replacement, data[:boundary])
    if count != 1:
        raise ValueError("SKILL.md requires one description")
    return head + data[boundary:]


def tree_files(repo, revision):
    files = {}
    for record in git(repo, "ls-tree", "-r", "-z", revision, "--", "skills", "LICENSE").split(b"\0"):
        if not record:
            continue
        entry, raw_path = record.split(b"\t", 1)
        mode, kind, object_id = entry.decode().split()
        path = raw_path.decode("utf-8")
        files[path] = (mode, kind, object_id)
    return files


def build(repo, output, target="source", skills=None, revision="HEAD", descriptions=None, max_bytes=30_000_000, mapped_only=False):
    if max_bytes <= 0:
        raise ValueError("The per-bundle size bound must be positive")
    if mapped_only and target != "claude-web":
        raise ValueError("Mapped-only selection is specific to the Claude web target")
    commit = git(repo, "rev-parse", "--verify", "--end-of-options", revision + "^{commit}").decode().strip()
    files = tree_files(repo, commit)
    available = {p.split("/")[1] for p in files if p.count("/") == 2 and p.endswith("/SKILL.md")}
    selected = sorted(set(skills) if skills else available)
    if not selected:
        raise ValueError("No skills selected")
    for name in selected:
        if not SKILL_NAME.fullmatch(name) or len(name) > 64 or name not in available:
            raise ValueError(f"Unknown or invalid skill: {name}")
    license_entry = files.get("LICENSE")
    if not license_entry or license_entry[0] not in {"100644", "100755"}:
        raise ValueError("A tracked regular LICENSE file is required")
    license_data = git(repo, "cat-file", "blob", license_entry[2])

    overrides = {}
    map_hash = None
    if target == "claude-web":
        raw_map = Path(descriptions).read_bytes() if descriptions else git(repo, "show", f"{commit}:{DESCRIPTION_MAP}")
        map_hash = sha256(raw_map)
        overrides = json.loads(raw_map)
        if not isinstance(overrides, dict):
            raise ValueError("Web descriptions must be a skill-keyed object")
    elif target != "source":
        raise ValueError(f"Unknown target: {target}")

    bundles = []
    omitted = []
    artifacts = {}
    for name in selected:
        prefix = f"skills/{name}/"
        resources = {}
        for path, (mode, kind, object_id) in files.items():
            if not path.startswith(prefix):
                continue
            relative = path[len(prefix):]
            parts = PurePosixPath(relative).parts
            if any(part in EXCLUDED_PARTS for part in parts):
                continue
            if relative != "SKILL.md" and parts[0] not in {"references", "scripts", "assets"}:
                continue
            if "\\" in relative or ":" in relative or any(part in {".", ".."} for part in parts):
                raise ValueError(f"Unsafe resource path: {path}")
            if mode not in {"100644", "100755"} or kind != "blob":
                raise ValueError(f"Resource must be a tracked regular file: {path}")
            resources[relative] = (git(repo, "cat-file", "blob", object_id), mode, path)
        original = resources["SKILL.md"][0]
        fields = metadata(original)
        if fields["name"] != name:
            raise ValueError(f"Skill name does not match folder: {name}")
        override = None
        if target == "claude-web":
            override = overrides.get(name)
            if not isinstance(override, dict):
                if mapped_only:
                    omitted.append({"skill": name, "reason": "Missing reviewed web description"})
                    continue
                raise ValueError(f"Missing reviewed web description: {name}")
            short = override.get("description")
            if not isinstance(short, str) or not 1 <= len(short) <= 200 or not short.strip() or "\n" in short or "\r" in short:
                raise ValueError(f"Web description must be 1–200 characters: {name}")
            if override.get("source_description_sha256") != sha256(fields["description"].encode()):
                if mapped_only:
                    omitted.append({"skill": name, "reason": "Source triggers changed; web description needs renewed review"})
                    continue
                raise ValueError(f"Stale web description; review changed source triggers: {name}")
            resources["SKILL.md"] = (replace_description(original, short), resources["SKILL.md"][1], prefix + "SKILL.md")
        resources["LICENSE"] = (license_data, "100644", "LICENSE")
        uncompressed_bytes = sum(len(item[0]) for item in resources.values())
        if uncompressed_bytes > max_bytes:
            raise ValueError(f"Bundle exceeds the configured uncompressed size bound: {name}")
        stream = io.BytesIO()
        inventory = []
        with zipfile.ZipFile(stream, "w", compression=zipfile.ZIP_DEFLATED, compresslevel=9) as archive:
            for relative, (data, mode, source_path) in sorted(resources.items()):
                entry = zipfile.ZipInfo(f"{name}/{relative}", date_time=(1980, 1, 1, 0, 0, 0))
                entry.create_system = 3
                entry.external_attr = (0o100755 if mode == "100755" else 0o100644) << 16
                entry.compress_type = zipfile.ZIP_DEFLATED
                archive.writestr(entry, data, compresslevel=9)
                source_data = original if relative == "SKILL.md" else data
                inventory.append({"path": entry.filename, "source_path": source_path, "source_sha256": sha256(source_data), "packaged_sha256": sha256(data)})
        filename = f"{name}-{target}.zip"
        artifacts[filename] = stream.getvalue()
        bundles.append({"skill": name, "archive": filename, "sha256": sha256(artifacts[filename]), "uncompressed_bytes": uncompressed_bytes, "description_override": {"original": fields["description"], "packaged": override["description"]} if override else None, "files": inventory})

    manifest = {"format_version": 1, "source_commit": commit, "target": target, "web_description_map_sha256": map_hash, "mapped_only": mapped_only, "omitted": omitted, "bundles": bundles}
    # Validate every selection before writing any artifact; incomplete web maps
    # must not leave a plausible but partial release on disk.
    output = Path(output)
    output.mkdir(parents=True, exist_ok=True)
    for filename, data in artifacts.items():
        (output / filename).write_bytes(data)
    (output / f"{target}-manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    return manifest


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--repo", type=Path, default=Path(__file__).resolve().parent.parent)
    parser.add_argument("--output", type=Path, required=True)
    parser.add_argument("--target", choices=("source", "claude-web"), default="source")
    parser.add_argument("--skill", action="append", help="Select one skill; repeat for several. Default: all.")
    parser.add_argument("--ref", default="HEAD", help="Frozen Git revision to package; default HEAD.")
    parser.add_argument("--web-descriptions", type=Path, help="Explicit local override map instead of the selected revision's map.")
    parser.add_argument("--mapped-only", action="store_true", help="Explicitly omit new/stale web mappings and list them in the manifest; source builds remain complete.")
    parser.add_argument("--max-uncompressed-bytes", type=int, default=30_000_000, help="Local per-bundle size bound, including LICENSE; not a verified web upload limit.")
    args = parser.parse_args()
    try:
        manifest = build(args.repo, args.output, args.target, args.skill, args.ref, args.web_descriptions, args.max_uncompressed_bytes, args.mapped_only)
    except (ValueError, OSError, subprocess.CalledProcessError) as error:
        parser.exit(1, f"Packaging failed: {error}\n")
    print(f"Built {len(manifest['bundles'])} {args.target} ZIPs from {manifest['source_commit']}")
    for item in manifest["omitted"]:
        print(f"Omitted {item['skill']}: {item['reason']}")


if __name__ == "__main__":
    main()
