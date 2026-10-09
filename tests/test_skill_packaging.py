import hashlib
import importlib.util
import json
import os
import subprocess
import tempfile
import unittest
import zipfile
from pathlib import Path


SPEC = importlib.util.spec_from_file_location("package_skills", Path(__file__).resolve().parents[1] / "scripts/package_skills.py")
packager = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(packager)


class PackagingTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.repo = Path(self.temp.name) / "repo"
        self.repo.mkdir()
        self.output = Path(self.temp.name) / "output"
        self.env = {**os.environ, "GIT_CONFIG_GLOBAL": os.devnull, "GIT_CONFIG_NOSYSTEM": "1"}
        self.git("init", "-q")
        self.git("config", "user.name", "Packaging fixture")
        self.git("config", "user.email", "fixture@example.invalid")
        self.description = "A source description with all original trigger words and quoted examples. " * 4
        self.skill = ("---\nname: sample\ndescription: " + json.dumps(self.description) + "\nmetadata:\n  version: 1.0.0\n---\n\n# Sample\n\nRead [guide](references/guide.md) and [template](assets/example.json).\n").encode()
        self.write("skills/sample/SKILL.md", self.skill)
        self.write("skills/sample/references/guide.md", b"# Guide\n\nOriginal quotes and evidence.\n")
        self.write("skills/sample/assets/example.json", b'{"original": true}\n')
        self.write("skills/sample/scripts/run.sh", b"#!/bin/sh\necho sample\n")
        (self.repo / "skills/sample/scripts/run.sh").chmod(0o755)
        self.git("add", ".")
        self.git("update-index", "--chmod=+x", "skills/sample/scripts/run.sh")
        self.write("skills/sample/evals/evals.json", b'{"not_for_install": true}\n')
        self.write("skills/sample/references/__pycache__/fixture.pyc", b"generated")
        self.write("LICENSE", b"MIT License\nCopyright fixture\n")
        self.map = {"sample": {"source_description_sha256": self.hash(self.description.encode()), "description": "Use for the sample workflow and its original trigger examples."}}
        self.write_map()
        self.commit()

    def git(self, *args):
        return subprocess.check_output(["git", "-C", str(self.repo), *args], env=self.env, stderr=subprocess.PIPE)

    def write(self, path, data):
        target = self.repo / path
        target.parent.mkdir(parents=True, exist_ok=True)
        target.write_bytes(data)

    def write_map(self):
        self.write(packager.DESCRIPTION_MAP, json.dumps(self.map).encode())

    def commit(self):
        self.git("add", ".")
        self.git("commit", "-qm", "fixture")

    @staticmethod
    def hash(data):
        return hashlib.sha256(data).hexdigest()

    def archive(self, target="source", **kwargs):
        manifest = packager.build(self.repo, self.output, target=target, **kwargs)
        bundle = manifest["bundles"][0]
        return manifest, bundle, zipfile.ZipFile(self.output / bundle["archive"])

    def test_source_archive_keeps_actual_routes_bytes_and_license(self):
        manifest, bundle, archive = self.archive()
        with archive:
            self.assertEqual(archive.read("sample/SKILL.md"), self.skill)
            for path in ("references/guide.md", "assets/example.json", "scripts/run.sh"):
                self.assertEqual(archive.read("sample/" + path), (self.repo / "skills/sample" / path).read_bytes())
            self.assertEqual(archive.read("sample/LICENSE"), (self.repo / "LICENSE").read_bytes())
            self.assertEqual(archive.getinfo("sample/scripts/run.sh").external_attr >> 16, 0o100755)
            self.assertTrue(all(path.startswith("sample/") for path in archive.namelist()))
            self.assertFalse(any("evals/" in path or "__pycache__/" in path for path in archive.namelist()))
        self.assertEqual(manifest["source_commit"], self.git("rev-parse", "HEAD").decode().strip())
        self.assertIsNone(bundle["description_override"])
        self.assertEqual(bundle["sha256"], self.hash((self.output / bundle["archive"]).read_bytes()))
        self.assertTrue(all(item["source_sha256"] == item["packaged_sha256"] for item in bundle["files"]))

    def test_web_archive_changes_only_description_and_records_exact_hashes(self):
        _, bundle, archive = self.archive("claude-web")
        with archive:
            packaged = archive.read("sample/SKILL.md")
            self.assertEqual(packager.metadata(packaged)["description"], self.map["sample"]["description"])
            self.assertEqual(packaged.split(b"\n---\n", 1)[1], self.skill.split(b"\n---\n", 1)[1])
            for item in bundle["files"]:
                data = archive.read(item["path"])
                self.assertEqual(item["packaged_sha256"], self.hash(data))
                if not item["path"].endswith("/SKILL.md"):
                    self.assertEqual(item["source_sha256"], item["packaged_sha256"])
        skill_item = next(item for item in bundle["files"] if item["path"].endswith("/SKILL.md"))
        self.assertEqual(skill_item["source_sha256"], self.hash(self.skill))
        self.assertEqual(bundle["description_override"], {"original": self.description, "packaged": self.map["sample"]["description"]})

    def test_repeat_builds_are_byte_identical(self):
        self.archive("claude-web")[2].close()
        first = {path.name: path.read_bytes() for path in self.output.iterdir()}
        packager.build(self.repo, self.output, target="claude-web")
        self.assertEqual(first, {path.name: path.read_bytes() for path in self.output.iterdir()})

    def test_frozen_revision_ignores_dirty_worktree_and_untracked_files(self):
        self.write("skills/sample/SKILL.md", b"dirty body")
        self.write("skills/sample/references/secret.md", b"untracked")
        _, _, archive = self.archive()
        with archive:
            self.assertEqual(archive.read("sample/SKILL.md"), self.skill)
            self.assertNotIn("sample/references/secret.md", archive.namelist())

    def test_explicit_old_revision_uses_its_own_descriptions(self):
        old = self.git("rev-parse", "HEAD").decode().strip()
        self.map["sample"]["description"] = "Changed reviewed description."
        self.write_map()
        self.commit()
        _, _, archive = self.archive("claude-web", revision=old)
        with archive:
            self.assertIn(b"original trigger examples", archive.read("sample/SKILL.md"))

    def test_missing_override_fails_before_writing_any_selection(self):
        self.write("skills/other/SKILL.md", b"---\nname: other\ndescription: Other workflow.\n---\n# Other\n")
        self.commit()
        with self.assertRaisesRegex(ValueError, "Missing reviewed"):
            packager.build(self.repo, self.output, target="claude-web")
        self.assertFalse(self.output.exists())

    def test_invalid_overrides_are_rejected(self):
        for description in ("", " ", "x" * 201, "first\nsecond", 42):
            with self.subTest(description=description):
                self.map["sample"]["description"] = description
                self.write_map()
                self.commit()
                with self.assertRaisesRegex(ValueError, "1–200"):
                    packager.build(self.repo, self.output, target="claude-web")

    def test_release_subset_lists_new_and_stale_skills_but_source_is_complete(self):
        self.write("skills/other/SKILL.md", b"---\nname: other\ndescription: Other workflow.\n---\n# Other\n")
        self.write("skills/sample/SKILL.md", self.skill.replace(b"trigger words", b"different triggers"))
        self.commit()
        source = packager.build(self.repo, self.output)
        self.assertEqual([item["skill"] for item in source["bundles"]], ["other", "sample"])
        self.assertEqual(source["omitted"], [])
        web = packager.build(self.repo, self.output, target="claude-web", mapped_only=True)
        self.assertEqual(web["bundles"], [])
        self.assertEqual(web["omitted"], [
            {"skill": "other", "reason": "Missing reviewed web description"},
            {"skill": "sample", "reason": "Source triggers changed; web description needs renewed review"},
        ])
        self.assertTrue((self.output / "other-source.zip").is_file())
        self.assertTrue((self.output / "sample-source.zip").is_file())
        persisted = json.loads((self.output / "claude-web-manifest.json").read_text())
        self.assertEqual(persisted["omitted"], web["omitted"])

    def test_release_subset_keeps_current_reviewed_mappings(self):
        self.write("skills/other/SKILL.md", b"---\nname: other\ndescription: Other workflow.\n---\n# Other\n")
        self.commit()
        web = packager.build(self.repo, self.output, target="claude-web", mapped_only=True)
        self.assertEqual([item["skill"] for item in web["bundles"]], ["sample"])
        self.assertEqual([item["skill"] for item in web["omitted"]], ["other"])

    def test_changed_source_triggers_require_new_review(self):
        self.write("skills/sample/SKILL.md", self.skill.replace(b"trigger words", b"different triggers"))
        self.commit()
        with self.assertRaisesRegex(ValueError, "Stale web description"):
            packager.build(self.repo, self.output, target="claude-web")

    def test_unknown_or_traversal_selection_is_rejected(self):
        for name in ("missing", "../sample", "/sample"):
            with self.subTest(name=name), self.assertRaisesRegex(ValueError, "Unknown or invalid"):
                packager.build(self.repo, self.output, skills=[name])

    def test_selected_subset_does_not_package_other_skill(self):
        self.write("skills/other/SKILL.md", b"---\nname: other\ndescription: Other workflow.\n---\n# Other\n")
        self.commit()
        manifest = packager.build(self.repo, self.output, skills=["sample"])
        self.assertEqual([bundle["skill"] for bundle in manifest["bundles"]], ["sample"])

    def test_tracked_symlink_is_not_followed(self):
        blob = subprocess.check_output(["git", "-C", str(self.repo), "hash-object", "-w", "--stdin"], input=b"../../../../outside", env=self.env).decode().strip()
        self.git("update-index", "--add", "--cacheinfo", "120000," + blob + ",skills/sample/assets/link")
        self.git("commit", "-qm", "symlink fixture")
        with self.assertRaisesRegex(ValueError, "tracked regular file"):
            packager.build(self.repo, self.output)

    def test_configured_size_bound_fails_without_partial_outputs(self):
        with self.assertRaisesRegex(ValueError, "size bound"):
            packager.build(self.repo, self.output, max_bytes=10)
        self.assertFalse(self.output.exists())

    def test_crlf_body_and_quoted_description_are_preserved(self):
        original = self.skill.replace(b"\n", b"\r\n")
        updated = packager.replace_description(original, "Quote: \"hello\" and café.")
        self.assertEqual(packager.metadata(updated)["description"], 'Quote: "hello" and café.')
        self.assertEqual(updated.split(b"\r\n---\r\n", 1)[1], original.split(b"\r\n---\r\n", 1)[1])


if __name__ == "__main__":
    unittest.main()
