#!/usr/bin/env node
// Count the words on a screen and flag jargon, self-praise and weak button
// labels, so a simplification pass can report before and after numbers.
// Part of the cro skill: see references/screen-simplification.md.
// Adapted from scripts/check.py in lodar/caveman-marketing
// (Copyright (c) 2026 5dive, MIT), via #893. License text:
// https://github.com/lodar/caveman-marketing/blob/main/LICENSE
//
//   node scripts/screen-counts.mjs screen.txt
//   node scripts/screen-counts.mjs before.txt after.txt
//
// Each file holds the visible text of one screen, as plain text. A word is a
// run of non-space characters with a letter or a digit in it, so "$24/month"
// is one word and arrows, dashes and emoji are none. A listed word is matched
// whole, with or without a plural "s". A weak button label is a line that
// holds only that label.
//
// Exit 0 when nothing is flagged (in the after screen, with two files), 1 when
// something is, 2 on bad usage. A change in word count is reported, not failed.
// Zero dependencies, Node 18+.
import { readFileSync } from 'node:fs';

// Drawn from the words copywriting (references/ai-tells.md) and copy-editing
// ask to replace with the fact they stand in for, plus "platform" from #1015.
const JARGON = [
  'seamless', 'seamlessly', 'leverage', 'platform', 'robust', 'streamline',
  'empower', 'unlock', 'synergy', 'utilize', 'end-to-end', 'frictionless',
];
const SELF_PRAISE = [
  'world-class', 'best-in-class', 'industry-leading', 'powerful',
  'cutting-edge', 'innovative', 'revolutionary', 'state-of-the-art',
];
// Button labels that do not say what happens next (copywriting, CTA copy).
const WEAK_LABELS = ['submit', 'sign up', 'learn more', 'click here', 'get started'];

const WORD_CHAR = /[\p{L}\p{Nd}]/u;
const HYPHEN = '[\\u2010\\u2011-]';
const termPattern = (terms) =>
  new RegExp(`(?<![\\p{L}\\p{Nd}\\u2010\\u2011-])((?:${terms.map((t) => t.replace(/-/g, HYPHEN)).join('|')})s?)(?![\\p{L}\\p{Nd}\\u2010\\u2011-])`, 'giu');
const JARGON_RE = termPattern(JARGON);
const PRAISE_RE = termPattern(SELF_PRAISE);
// A button label is short; longer lines are not checked as labels.
const MAX_LABEL_LINE = 60;

// Drop leading and trailing characters that are not letters or digits.
function trimEdges(text) {
  const chars = [...text];
  let start = 0;
  let end = chars.length;
  while (start < end && !WORD_CHAR.test(chars[start])) start++;
  while (end > start && !WORD_CHAR.test(chars[end - 1])) end--;
  return chars.slice(start, end).join('');
}

const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`;

function countScreen(text) {
  let words = 0;
  const flagged = [];
  const weak = [];
  text.replace(/^\uFEFF/, '').split(/\r\n|\r|\n/).forEach((line, i) => {
    words += line.split(/\s+/).filter((token) => WORD_CHAR.test(token)).length;
    for (const [re, kind] of [[JARGON_RE, 'jargon'], [PRAISE_RE, 'self-praise']]) {
      for (const match of line.matchAll(re)) flagged.push({ line: i + 1, at: match.index, word: match[1], kind });
    }
    if (line.length <= MAX_LABEL_LINE) {
      const label = trimEdges(line);
      const key = label.toLowerCase().replace(/[\s\u2010\u2011-]+/g, ' ');
      if (WEAK_LABELS.includes(key)) weak.push({ line: i + 1, word: label });
    }
  });
  flagged.sort((a, b) => a.line - b.line || a.at - b.at);
  return { words, flagged, weak };
}

function report(name, counts) {
  console.log(`${name}: ${plural(counts.words, 'word')}, ${plural(counts.flagged.length, 'flagged word')}, ${plural(counts.weak.length, 'weak button label')}`);
  for (const f of counts.flagged) console.log(`  line ${f.line}: "${f.word}" (${f.kind})`);
  for (const w of counts.weak) console.log(`  line ${w.line}: "${w.word}" (weak button label)`);
}

function main(args) {
  if (args.length < 1 || args.length > 2) {
    console.error('usage: node screen-counts.mjs screen.txt | before.txt after.txt');
    return 2;
  }
  let screens;
  try {
    screens = args.map((file) => countScreen(readFileSync(file, 'utf8')));
  } catch (error) {
    console.error(`screen-counts: ${error.message}`);
    return 2;
  }
  if (screens.length === 1) {
    report('screen', screens[0]);
    return screens[0].flagged.length || screens[0].weak.length ? 1 : 0;
  }
  const [before, after] = screens;
  report('before', before);
  report('after', after);
  const diff = after.words - before.words;
  const change = diff < 0 ? plural(-diff, 'fewer word') + ' than'
    : diff > 0 ? plural(diff, 'more word') + ' than' : 'as many words as';
  const left = [];
  if (after.flagged.length) left.push(plural(after.flagged.length, 'flagged word'));
  if (after.weak.length) left.push(plural(after.weak.length, 'weak button label'));
  if (left.length) {
    console.log(`FAIL: after has ${change} before and ${left.join(' and ')}`);
    return 1;
  }
  console.log(`PASS: after has ${change} before and nothing flagged`);
  if (diff > 0) console.log('NOTE: say which added words carry a fact the original was missing');
  return 0;
}

process.exitCode = main(process.argv.slice(2));
