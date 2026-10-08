# Single-skill release ZIPs

Release assets provide a download path for people using Claude without a terminal-based agent. Each ZIP contains one named skill folder, its instructions, authored references/scripts/assets, and the repository's MIT license. Evals, caches, untracked files, and the rest of the repository are excluded.

## Use a release asset in Claude

1. Open the [latest release](https://github.com/coreyhaines31/marketingskills/releases/latest) and choose `<name>-claude-web.zip` for the task you need. `claude-web-manifest.json` lists any skills omitted because their short descriptions need review; a source ZIP for an omitted skill is not a replacement web upload.
2. Review the skill's instructions and any scripts before enabling it.
3. In Claude, open **Customize → Skills → + Create skill → Upload a skill** and select the ZIP. Your account or organization must permit skills and code execution.
4. Enable the skill and try a task that matches its description. Check that Claude uses the intended skill and resources.

The ZIP has the single-folder structure in [Claude's custom skill guide](https://support.claude.com/en/articles/12512198-how-to-create-custom-skills). It has not been verified by uploading to a live account. Available account permissions, upload limits, and invocation behavior still need checking in the target client. A `.skill` extension is not required or claimed compatible by this builder.

Installing one archive does not install other skills, local CLI tools, MCP servers, credentials, or marketing context. Related-skill and tool instructions remain dependencies. Use the existing [terminal installation options](../README.md#installation) when you need the complete library and local tooling. API skills have a separate execution environment and cannot make live external API calls; do not assume these archives grant that capability.

## Two explicit targets

- **`source`**: `<name>-source.zip` preserves the original `SKILL.md` and resource bytes. Its long source description may exceed Claude web's documented metadata limit; this target is not presented as a web-ready upload.
- **`claude-web`**: `<name>-claude-web.zip` changes only the YAML `description` line, using the reviewed entry in `scripts/claude-web-descriptions.json`. The markdown body, other metadata, and all packaged resources remain unchanged. The short description changes discovery wording; review it rather than assuming the original trigger list survives verbatim.

The current web guide documents a 200-character description limit, while the [Agent Skills specification](https://agentskills.io/specification) and [API guide](https://platform.claude.com/docs/en/build-with-claude/skills-guide) allow 1024. Overrides are explicit, not automatic truncation. Each override records a hash of the original description; changed triggers require renewed review.

## Build locally

Python 3 and Git are the only build requirements. Builds read tracked resources from a frozen commit, never dirty or untracked working files:

```bash
python3 scripts/package_skills.py --target source --skill cro --output /tmp/marketing-skill-zips
python3 scripts/package_skills.py --target claude-web --skill cro --output /tmp/marketing-skill-zips
python3 scripts/package_skills.py --target source --ref v2.11.18 --output /tmp/marketing-release-zips
python3 -m unittest discover -s tests -p test_skill_packaging.py -v
```

Omit `--skill` to select every skill, or repeat it for a subset. A strict web build rejects missing, oversized, or stale description overrides before writing artifacts. Use a fresh output directory for a release; old files from previous selections are not deleted automatically.

The release workflow explicitly uses `--mapped-only` for the web target. New skills without an override and skills whose source triggers changed are omitted from that target, with reasons in the manifest, newly created release notes, and workflow summary. Source ZIPs still include every skill. Invalid reviewed overrides (for example, over 200 characters) fail the build. This keeps unrelated releases working while making an incomplete web catalog visible. A maintainer can add or revise an override only after reviewing the current trigger wording, then update its `source_description_sha256` from the decoded source description.

On a re-run, the workflow packages the existing tag's frozen commit and replaces only the named ZIP/manifest assets. It preserves an existing release's notes rather than overwriting editorial changes; the attached manifest is the authoritative omission report for that case. No tag is moved and no upload or release operation is performed by the local builder.

Manifests record the source commit, archive SHA-256, original and packaged file hashes, exact description changes, and uncompressed byte counts. The default 30,000,000-byte per-bundle bound is a local build safeguard, **not a verified Claude web upload limit**. The API's documented limit is separate. Use `--max-uncompressed-bytes` to change the local bound after checking your target's requirements.

Archive ordering, timestamps, and file modes are fixed for repeatable builds in the same Python/zlib environment. Executable script modes are retained. Symlinks and unsafe resource paths are rejected rather than followed. Neither building nor testing uploads a skill or runs a marketing tool.
