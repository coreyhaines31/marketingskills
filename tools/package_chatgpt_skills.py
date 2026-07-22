#!/usr/bin/env python3
"""Validate and package Agent Skills for ChatGPT upload.

Each generated ZIP contains one skill and places SKILL.md at the archive root.
"""

from __future__ import annotations

import argparse
import re
import sys
import zipfile
from pathlib import Path
from typing import Iterable


IGNORED_NAMES = {
    ".DS_Store",
    "Thumbs.db",
}

IGNORED_PARTS = {
    "__pycache__",
    ".git",
}


class SkillValidationError(ValueError):
    """Raised when a skill does not satisfy the minimum package rules."""


def parse_frontmatter(skill_md: Path) -> dict[str, str]:
    text = skill_md.read_text(encoding="utf-8")
    if not text.startswith("---"):
        raise SkillValidationError(f"{skill_md}: missing YAML frontmatter")

    parts = text.split("---", 2)
    if len(parts) < 3:
        raise SkillValidationError(f"{skill_md}: incomplete YAML frontmatter")

    values: dict[str, str] = {}
    for raw_line in parts[1].splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#") or ":" not in line:
            continue
        key, value = line.split(":", 1)
        values[key.strip()] = value.strip().strip('"').strip("'")

    return values


def validate_skill(skill_dir: Path) -> None:
    if not skill_dir.is_dir():
        raise SkillValidationError(f"Skill directory not found: {skill_dir}")

    skill_md = skill_dir / "SKILL.md"
    if not skill_md.is_file():
        raise SkillValidationError(f"{skill_dir.name}: SKILL.md not found")

    frontmatter = parse_frontmatter(skill_md)
    name = frontmatter.get("name", "")
    description = frontmatter.get("description", "")

    if not name:
        raise SkillValidationError(f"{skill_dir.name}: frontmatter name is required")
    if name != skill_dir.name:
        raise SkillValidationError(
            f"{skill_dir.name}: frontmatter name must match the directory; found {name!r}"
        )
    if not re.fullmatch(r"[a-z0-9]+(?:-[a-z0-9]+)*", name):
        raise SkillValidationError(
            f"{skill_dir.name}: name must use lowercase letters, numbers, and hyphens"
        )
    if not description:
        raise SkillValidationError(
            f"{skill_dir.name}: frontmatter description is required"
        )
    if len(description) > 1024:
        raise SkillValidationError(
            f"{skill_dir.name}: description exceeds 1024 characters"
        )


def should_include(path: Path) -> bool:
    if path.name in IGNORED_NAMES:
        return False
    if any(part in IGNORED_PARTS for part in path.parts):
        return False
    return not path.is_symlink()


def iter_skill_files(skill_dir: Path) -> Iterable[Path]:
    for path in sorted(skill_dir.rglob("*")):
        if path.is_file() and should_include(path.relative_to(skill_dir)):
            yield path


def package_skill(skill_dir: Path, output_dir: Path) -> Path:
    validate_skill(skill_dir)
    output_dir.mkdir(parents=True, exist_ok=True)
    destination = output_dir / f"{skill_dir.name}.zip"

    files = list(iter_skill_files(skill_dir))
    if not files:
        raise SkillValidationError(f"{skill_dir.name}: no packageable files found")

    with zipfile.ZipFile(
        destination,
        mode="w",
        compression=zipfile.ZIP_DEFLATED,
        compresslevel=9,
    ) as archive:
        for source in files:
            archive.write(source, arcname=source.relative_to(skill_dir).as_posix())

    with zipfile.ZipFile(destination, mode="r") as archive:
        names = set(archive.namelist())
        if "SKILL.md" not in names:
            raise SkillValidationError(
                f"{skill_dir.name}: generated archive is missing root SKILL.md"
            )

    return destination


def discover_skills(skills_dir: Path) -> list[Path]:
    return sorted(
        path
        for path in skills_dir.iterdir()
        if path.is_dir() and (path / "SKILL.md").is_file()
    )


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description="Validate and package Agent Skills for ChatGPT upload."
    )
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument(
        "--skill",
        nargs="+",
        metavar="NAME",
        help="One or more skill directory names to package.",
    )
    group.add_argument(
        "--all",
        action="store_true",
        help="Package every valid skill in the repository.",
    )
    parser.add_argument(
        "--output",
        type=Path,
        default=None,
        help="Output directory. Default: dist/chatgpt",
    )
    return parser


def main() -> int:
    args = build_parser().parse_args()
    repo_root = Path(__file__).resolve().parents[1]
    skills_dir = repo_root / "skills"
    output_dir = args.output or (repo_root / "dist" / "chatgpt")

    if not skills_dir.is_dir():
        print(f"error: skills directory not found: {skills_dir}", file=sys.stderr)
        return 2

    if args.all:
        targets = discover_skills(skills_dir)
    else:
        targets = [skills_dir / name for name in args.skill]

    if not targets:
        print("error: no skills found", file=sys.stderr)
        return 2

    created: list[Path] = []
    errors: list[str] = []

    for skill_dir in targets:
        try:
            destination = package_skill(skill_dir, output_dir)
            created.append(destination)
            print(f"created: {destination.relative_to(repo_root)}")
        except (OSError, SkillValidationError, zipfile.BadZipFile) as exc:
            errors.append(str(exc))
            print(f"error: {exc}", file=sys.stderr)

    print(f"\nPackaged {len(created)} skill(s).")
    if errors:
        print(f"Failed {len(errors)} skill(s).", file=sys.stderr)
        return 1

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
