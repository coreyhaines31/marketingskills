# Screen Simplification

Use this when the user asks to simplify an existing page, hero or form, or says it feels busy or cluttered. It adds two checks to the CRO analysis: a three answers test, and counts that make "simpler" checkable. For rewriting the copy itself, use **copywriting** (including the swap test for headlines) and **copy-editing** (what to put in place of vague words).

## Three Answers Test

From the screen alone, without anything the visitor saw before it, answer:

1. **What is it?**
2. **What do I get?**
3. **Where do I act?**

Quote the words on the screen that give each answer. A missing or vague answer is the first gap to fix, before any cutting. Run the test on the original and on the rewrite: the rewrite must answer all three.

## Count Before and After

Count both versions the same way and report the rewrite with the counts.

| Count | What to include |
|---|---|
| Words on screen | Every visible word: headline, body, button and link labels, form placeholders, words inside images. Leave out logos. |
| Filled buttons | Solid, high-contrast buttons. A screen with one job usually needs one. |
| Other exits | Everything else a visitor can click or tap: navigation items, secondary buttons, text links, social icons. |
| Steps before the result | Screens, form steps or clicks between arriving and getting what the screen promised (the download, the booked call, the first report). |

Report it as a table:

| | Before | After |
|---|---|---|
| Words on screen | 64 | 29 |
| Filled buttons | 3 | 1 |
| Other exits | 11 | 4 |
| Steps before the result | 4 | 2 |

The counts make a rewrite checkable. They are not a quota, and there is no fixed word target. Cut what does not help a visitor answer the three questions. Keep facts, prices, warnings and required disclosures even when they cost words, and if a count goes up (a missing price added, say), say why.

## Run the Counts

Save the visible text of each version as plain text, one file per screen, with each button or link label on its own line. `scripts/` is inside this skill's directory: call the script by its full path from the user's project, so the files stay in the project:

```bash
node <skill-dir>/scripts/screen-counts.mjs before.txt after.txt
```

The script prints each screen's word count and flags jargon, self-praise and weak button labels (a line that holds only "Submit", "Learn more" and the like), with line numbers. It exits 1 when the after screen still has a flagged word or weak button label (with one file, when that file has one). A longer rewrite is reported, not failed. Use its word count in the table. Count buttons, exits and steps yourself from the screen, because plain text does not show which lines are buttons. Replace a flagged word with the fact it stood for, not with a synonym.

Method and checker adapted from the 5dive team's caveman-marketing (MIT), via @atorn8's #893.
