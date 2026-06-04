# Step Modes

Each `step(...)` call in the recorder takes an optional `{ mode }`
that controls the order of narration vs. action. Picking the right
mode per scene is what keeps audio and visuals aligned.

## The three modes

### `before` (default)

```
[ subtitle appears + narration plays ]  →  [ fn() runs ]
```

Use for **transition steps** — scenes where `fn()` ends with a click
that navigates to a new page. Without `before`, the click happens
early and the speaker keeps describing the old page while the viewer
is already on the new one ("one scene off").

Example:

```js
await step(
    'submit form',
    'Submitting creates the account and drops you into onboarding.',
    async () => {
        await Promise.all([
            page.waitForURL(/\/onboarding\//),
            clickWithCursor(page.getByRole('button', { name: /create account/i })),
        ]);
    },
    // mode: 'before' is the default
);
```

### `during`

```
[ subtitle appears ] ─┬─ narration plays ──┐
                      └─ fn() runs ────────┘  → both must finish
```

Use for **in-place visible actions** — filling a form, scrubbing a
slider, dragging a card. The viewer should watch the action play out
under the narration.

```js
await step(
    'fill register form',
    'Filling in the company, name, email, and password.',
    async () => {
        await fillWithCursor(page.locator('input[name="company_name"]'), 'Acme');
        await fillWithCursor(page.locator('input[name="email"]'), 'me@acme.com');
        // ...
    },
    { mode: 'during' },
);
```

### `after`

```
[ fn() runs ]  →  [ subtitle appears + narration plays ]
```

Use to **describe a state the action just produced**. Rare — usually
`before` on the next scene is cleaner because each scene's caption
then describes the page that's actually visible during it.

## Picking a mode in practice

| Scene shape | Mode |
|---|---|
| Click a button → page navigates | `before` |
| Fill a form / type in a field | `during` |
| Skip / dismiss → page navigates | `before` |
| Hover / open a menu, no nav | `during` |
| Land on a final state (dashboard, success) | `during` (just narrate the now-visible state) |
| Click that triggers a modal you want to describe | `before` (so the click finishes during narration and the modal is visible by the time the speaker reaches the relevant phrase) |

## Why the modes exist

Narration durations vary widely (3-7 s for typical scenes). Actions
also vary (form-fill ~2 s, click+nav ~1.5 s). With a fixed mode the
two will drift apart on long scenes. `before` keeps the speaker's
words tied to the page the viewer sees; `during` lets short actions
play under the narration so dead air doesn't open up.
