#!/usr/bin/env node
// Flag content in skill and tool files that a reviewer reading the rendered
// markdown on GitHub would not see (issue #931).
//
//   node scripts/check-hidden-content.mjs            # scan skills/ and tools/, exit 1 on findings
//   node scripts/check-hidden-content.mjs --warn     # report findings but exit 0
//   node scripts/check-hidden-content.mjs <path>...  # scan only these files or directories
//
// Rules:
//   html-comment       an HTML comment (<!--) in a markdown file, wherever it is. Comments
//                      inside code blocks are visible, but reporting them all keeps the check
//                      free of markdown-parsing gaps; allowlist the ones that are fine.
//   link-comment       a `[//]: # (...)` or `[//]: <> (...)` link reference, which GitHub does not render
//   blank-run          more than 20 blank lines in a row (lines holding only whitespace or
//                      invisible characters count as blank)
//   invisible-unicode  zero-width, bidi-control, filler, variation-selector-supplement,
//                      Unicode tag or control characters
//   pipe-to-shell      a downloaded script run by a shell or interpreter:
//                      `curl ... | sh`, `wget ... | sudo bash`, `bash <(curl ...)`, `sh -c "$(curl ...)"`,
//                      `eval "$(curl ...)"`, `source <(curl ...)`, `iex (iwr ...)`
//   exfil-webhook      a webhook-catcher or tunnel URL (Discord/Slack webhooks, Telegram bots,
//                      webhook.site, requestbin, ngrok, ...)
//   exfil-secret       a line (with the next one) that asks to send something to a URL or
//                      email address and names a secret, or a curl/wget upload of a secret file
//   long-line          a line over 100,000 characters (not scanned further)
//   nul-byte           a NUL byte in a text file (git and GitHub then show the diff as binary)
//   symlink            a symbolic link (its target is outside what the check scans)
//
// Legitimate hits go in scripts/hidden-content-allowlist.json as
// { "path": "<repo-relative file>", "rule": "<rule>", "line": "<the flagged line, trimmed>", "reason": "<why it is safe>" }.
// `line` is the whole flagged line from the file, trimmed (the printed text may be shortened).
// An entry covers a finding only when that line is exactly `line` and the hit comes from the
// line alone: a comment that continues past it, or a hit that needs the next line, is still
// reported. blank-run, nul-byte and symlink findings cannot be allowlisted.

import { readFileSync, readdirSync, lstatSync, existsSync } from "node:fs";
import { resolve, dirname, relative, extname, sep } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, "..");
const ALLOWLIST = resolve(HERE, "hidden-content-allowlist.json");
const MAX_BLANK_LINES = 20;
const MAX_LINE_LENGTH = 100000;
const MARKDOWN = new Set([".md", ".markdown", ".mdx"]);
// Files with these extensions may hold NUL bytes legitimately and are not read.
const BINARY = new Set([".png", ".jpg", ".jpeg", ".gif", ".webp", ".ico", ".pdf", ".zip", ".gz", ".woff", ".woff2", ".ttf", ".otf", ".mp3", ".mp4", ".mov", ".webm", ".wasm",
  ".avif", ".bmp", ".wav", ".ogg", ".tar", ".tgz", ".7z", ".jar", ".docx", ".xlsx", ".pptx"]);

// Rules an allowlist entry may name. blank-run, nul-byte and symlink findings have no line
// text to match and are never allowlisted: fix the file instead.
const ALLOWLISTABLE = new Set(["html-comment", "link-comment", "invisible-unicode", "pipe-to-shell", "exfil-webhook", "exfil-secret", "long-line"]);

// Zero-width and invisible formatting (soft hyphen, combining grapheme joiner, Mongolian
// vowel separator, ZWSP/ZWNJ/ZWJ, LRM/RLM, word joiner, invisible operators, BOM), bidi
// controls, blank-looking fillers (Hangul fillers, braille blank), variation selectors
// FE00-FE0E (FE0F is left out: it is part of ordinary emoji) and their supplement, and the
// tag block used to smuggle ASCII text. C0 control characters other than tab, and DEL, are
// included too (an ESC sequence can hide text in a terminal).
const INVISIBLE_CLASS = "[\\u0001-\\u0008\\u000B\\u000C\\u000E-\\u001F\\u007F\\u00AD\\u034F\\u061C\\u115F\\u1160\\u17B4\\u17B5\\u180B-\\u180E\\u200B-\\u200F\\u202A-\\u202E\\u2060-\\u2064\\u2066-\\u206F\\u2800\\u3164\\uFE00-\\uFE0E\\uFEFF\\uFFA0\\uFFF9-\\uFFFB\\u{E0000}-\\u{E007F}\\u{E0100}-\\u{E01EF}]";
const INVISIBLE = new RegExp(INVISIBLE_CLASS, "u");
const INVISIBLE_ALL = new RegExp(INVISIBLE_CLASS, "gu");
// For blank-run, a line holding only these, whitespace or U+FE0F looks empty.
const BLANK_LOOKING = /[\uFE0F\s]/g;

const FETCH = "\\b(?:curl|wget|iwr|irm|Invoke-WebRequest|Invoke-RestMethod)\\b";
// The optional path prefix (/bin/, /usr/local/bin/) is bounded so long lines stay linear.
const PATH_PREFIX = "(?:[\\w.~-]{0,40}\\/){0,6}";
const SHELL = `${PATH_PREFIX}(?:ba|z|da|k|fi)?sh`;
const RUNNER = `${SHELL}|python[0-9.]*(?!\\s+-m\\s+json\\.tool)|node(?!\\s+-[ep]\\b)|perl|ruby|iex|Invoke-Expression`;
const PIPE_TO_SHELL = [
  new RegExp(`${FETCH}[^\\n]{0,500}?\\|\\s*(?:sudo\\b[^|\\n]{0,80}?\\s)?(?:${RUNNER})\\b`, "i"),
  new RegExp(`(?:^|[\\s;&|(\`'"])(?:${SHELL}|source|\\.)\\s+<\\(\\s*(?:curl|wget)\\b`, "i"),
  new RegExp(`\\beval\\s+["']?\\$\\(\\s*(?:curl|wget)\\b`, "i"),
  new RegExp(`\\b(?:iex|Invoke-Expression)\\s*\\(\\s*(?:iwr|irm|Invoke-WebRequest|Invoke-RestMethod|\\(?\\s*New-Object)\\b`, "i"),
  new RegExp(`(?:^|[\\s;&|(\`'"])(?:${RUNNER})\\s+-c\\s+["']?\\$\\(\\s*(?:curl|wget)\\b`, "i"),
];
const WEBHOOK = /(?:discord(?:app)?\.com\/api\/webhooks|hooks\.slack\.com\/services|api\.telegram\.org\/bot|webhook\.site|requestbin\.(?:com|net)|pipedream\.net|beeceptor\.com|ngrok(?:-free)?\.(?:io|app|dev)|burpcollaborator\.net|oastify\.com|interact\.sh|oast\.(?:fun|me|pro|site|live))/i;
const SEND_VERB = /\b(?:send|post|upload|forward|e-?mail|exfiltrate|transmit)\b/i;
const DESTINATION = /\bto\b.{0,200}?(?:https?:\/\/|[\w.+-]+@[\w-]+\.\w)/i;
const ANY_DESTINATION = /https?:\/\/|[\w.+-]+@[\w-]+\.\w/;
const SECRET_WORDS = /(?:\.env\b|\bapi[_ -]?keys?\b|\btokens?\b|\bsecrets?\b|\bcredentials?\b|\bpasswords?\b|\bprivate[_ -]keys?\b|\bssh keys?\b|id_rsa|\.ssh\/|\.aws\/)/i;
const SECRET_ENV = /\b[A-Z0-9]+(?:_[A-Z0-9]+)*_(?:API_KEY|KEY|TOKEN|SECRET|PASSWORD)\b/;
const hasSecret = (s) => SECRET_WORDS.test(s) || SECRET_ENV.test(s);
const UPLOAD = /\b(?:curl|wget)\b.{0,300}?(?:\s-d|\s--data(?:-binary|-raw|-urlencode)?|\s-F|\s--form|\s-T|\s--upload-file|\s--post-file)[=\s@"'.~/$]/;
const SECRET_FILE = /(?:\.env\b|id_rsa|\.ssh\/|\.aws\/|\.npmrc|\.netrc|credentials)/i;

const toRepoPath = (abs) => relative(ROOT, abs).split(sep).join("/");
const describe = (ch) => `U+${ch.codePointAt(0).toString(16).toUpperCase().padStart(4, "0")}`;
const snippet = (line) => line.trim().slice(0, 120);

function scanText(text, { markdown }) {
  const findings = [];
  const lines = text.replace(/\r\n?/g, "\n").split("\n");
  if (lines.at(-1) === "") lines.pop(); // the final newline does not start another line
  let blankStart = -1;
  let inComment = false;

  lines.forEach((raw, i) => {
    const n = i + 1;
    const line = i === 0 ? raw.replace(/^\uFEFF/, "") : raw;

    if (line.replace(INVISIBLE_ALL, "").replace(BLANK_LOOKING, "") === "") {
      if (blankStart === -1) blankStart = n;
    } else {
      if (blankStart !== -1 && n - blankStart > MAX_BLANK_LINES) {
        findings.push({ rule: "blank-run", line: blankStart, detail: `${n - blankStart} blank lines in a row` });
      }
      blankStart = -1;
    }

    if (line.length > MAX_LINE_LENGTH) {
      findings.push({ rule: "long-line", line: n, detail: `${line.length} characters` });
      return;
    }

    const invisible = line.match(INVISIBLE);
    if (invisible) findings.push({ rule: "invisible-unicode", line: n, detail: `${describe(invisible[0])} at column ${invisible.index + 1}` });

    const next = lines[i + 1] && lines[i + 1].length <= MAX_LINE_LENGTH ? lines[i + 1] : "";
    // A command continued with a trailing backslash is checked joined to its next line.
    const logical = /\\\s*$/.test(line) ? `${line.replace(/\\\s*$/, " ")}${next}` : line;
    if (PIPE_TO_SHELL.some((re) => re.test(logical))) {
      findings.push({ rule: "pipe-to-shell", line: n, detail: snippet(line), singleLine: logical === line });
    }
    if (WEBHOOK.test(line)) findings.push({ rule: "exfil-webhook", line: n, detail: snippet(line) });
    const pair = `${line} ${next}`;
    const asksAlone = SEND_VERB.test(line) && DESTINATION.test(line) && hasSecret(line);
    const asksWithNext = SEND_VERB.test(line) && DESTINATION.test(pair) && hasSecret(pair);
    const uploadsSecret = UPLOAD.test(line) && SECRET_FILE.test(line);
    if (asksWithNext || uploadsSecret) {
      // Only a hit that this line produces on its own, with nothing relevant on the next line,
      // can be allowlisted by matching this line.
      const nextAdds = hasSecret(next) || ANY_DESTINATION.test(next);
      findings.push({ rule: "exfil-secret", line: n, detail: snippet(line), singleLine: (asksAlone || uploadsSecret) && !nextAdds });
    }

    if (!markdown) return;
    if (/^ {0,3}(?:>\s*)*\[[^\]]*\]:\s*(?:#|<>)(?:\s|$)/.test(line)) findings.push({ rule: "link-comment", line: n, detail: snippet(line) });
    let rest = line;
    while (rest.length) {
      if (inComment) {
        const end = rest.indexOf("-->");
        if (end === -1) break;
        inComment = false;
        rest = rest.slice(end + 3);
      } else {
        const start = rest.indexOf("<!--");
        if (start === -1) break;
        // `<!-->` and `<!--->` are complete (empty) comments.
        const empty = rest.startsWith("<!-->", start) || rest.startsWith("<!--->", start);
        rest = rest.slice(start + (empty ? (rest.startsWith("<!-->", start) ? 5 : 6) : 4));
        inComment = !empty;
        findings.push({ rule: "html-comment", line: n, detail: snippet(line), singleLine: empty || rest.includes("-->") });
      }
    }
  });

  if (blankStart !== -1 && lines.length + 1 - blankStart > MAX_BLANK_LINES) {
    findings.push({ rule: "blank-run", line: blankStart, detail: `${lines.length + 1 - blankStart} blank lines at end of file` });
  }
  return findings;
}

function loadAllowlist() {
  if (!existsSync(ALLOWLIST)) return [];
  let entries;
  try {
    entries = JSON.parse(readFileSync(ALLOWLIST, "utf8"));
  } catch (err) {
    throw new Error(`${toRepoPath(ALLOWLIST)}: not valid JSON (${err.message})`);
  }
  if (!Array.isArray(entries)) throw new Error(`${toRepoPath(ALLOWLIST)}: must be a JSON array`);
  for (const e of entries) {
    if (!e || !e.path || !e.rule || !e.line || !e.reason) {
      throw new Error(`${toRepoPath(ALLOWLIST)}: every entry needs path, rule, line and reason`);
    }
    if (!ALLOWLISTABLE.has(e.rule)) throw new Error(`${toRepoPath(ALLOWLIST)}: rule "${e.rule}" cannot be allowlisted`);
  }
  return entries;
}

function scanFile(abs, results, seen) {
  if (seen.has(abs)) return;
  seen.add(abs);
  const path = toRepoPath(abs);
  const stat = lstatSync(abs);
  if (stat.isSymbolicLink()) {
    results.push({ path, rule: "symlink", line: 1, detail: "symbolic links are not followed", text: "" });
    return;
  }
  if (stat.isDirectory()) {
    for (const d of readdirSync(abs)) if (d !== ".git") scanFile(resolve(abs, d), results, seen);
    return;
  }
  if (!stat.isFile()) return;
  const ext = extname(abs).toLowerCase();
  if (BINARY.has(ext)) return;
  const buf = readFileSync(abs);
  if (buf.includes(0)) {
    results.push({ path, rule: "nul-byte", line: 1, detail: "NUL byte in a text file", text: "" });
    return;
  }
  const text = buf.toString("utf8");
  const lines = text.replace(/\r\n?/g, "\n").split("\n");
  for (const f of scanText(text, { markdown: MARKDOWN.has(ext) })) {
    results.push({ path, ...f, text: (lines[f.line - 1] ?? "").replace(/^\uFEFF/, "").trim() });
  }
}

// GitHub workflow command escaping.
const escapeData = (s) => s.replace(/%/g, "%25").replace(/\r/g, "%0D").replace(/\n/g, "%0A");
const escapeProperty = (s) => escapeData(s).replace(/:/g, "%3A").replace(/,/g, "%2C");
// Plain output: show control characters as \xNN so a file name or line cannot start a
// workflow command of its own.
const printable = (s) => s.replace(/[\u0000-\u001F\u007F]/g, (c) => `\\x${c.charCodeAt(0).toString(16).padStart(2, "0")}`);

function main() {
  const args = process.argv.slice(2);
  const warnOnly = args.includes("--warn");
  const targets = args.filter((a) => a !== "--warn");
  const roots = targets.length ? targets.map((t) => resolve(t)) : ["skills", "tools"].map((d) => resolve(ROOT, d));
  const missing = targets.length ? targets.filter((t) => !existsSync(resolve(t))) : roots.every((r) => !existsSync(r)) ? ["skills/", "tools/"] : [];
  if (missing.length) {
    console.error(`No such file or directory: ${missing.join(", ")}`);
    return 2;
  }

  let allow;
  try {
    allow = loadAllowlist();
  } catch (err) {
    console.error(err.message);
    return 2;
  }
  const allowed = (f) => f.singleLine !== false && allow.some((e) => e.path === f.path && e.rule === f.rule && e.line === f.text);
  const found = [];
  const seen = new Set();
  for (const root of roots) if (existsSync(root)) scanFile(root, found, seen);
  const results = found.filter((f) => !allowed(f));

  const annotate = process.env.GITHUB_ACTIONS === "true";
  for (const r of results) {
    const msg = `${r.rule}: ${r.detail}`;
    if (annotate) console.log(`::${warnOnly ? "warning" : "error"} file=${escapeProperty(r.path)},line=${r.line}::${escapeData(printable(msg))}`);
    console.error(printable(`${r.path}:${r.line}: ${msg}`));
  }
  if (!results.length) {
    console.log("No hidden content found.");
    return 0;
  }
  console.error(`\n${results.length} finding(s). Fix them, or add a reviewed entry to ${toRepoPath(ALLOWLIST)}.`);
  return warnOnly ? 0 : 1;
}

process.exitCode = main();
