# Question-to-reference routing

Load this small index when selecting a reference. Open only the relevant bundled
local Markdown file for the question; add another when the task crosses scopes.
Do not load the entire directory or fetch GitHub copies of installed references.

Sizes below are approximate thousands of tokens, estimated from character count
divided by four and rounded up to 0.1k on 2026-10-04. They indicate reading cost,
not a model-specific tokenizer measurement, and change when the files change.

| When the user asks | Open locally | Approx. tokens |
|---|---|---:|
| Should we buy traffic before we know customer payback? | [payback-period.md](payback-period.md) | 1.5k |
| Can we afford ads on our lowest-priced plan? | [payback-period.md](payback-period.md) | 1.5k |
| Our cheap leads never become pipeline. What should we inspect? | [b2b-paid-playbook.md](b2b-paid-playbook.md) | 2.0k |
| Which B2B funnel stage deserves the next budget increase? | [b2b-paid-playbook.md](b2b-paid-playbook.md) | 2.0k |
| Should this Meta ad be killed, retained, or scaled? | [meta-decision-system.md](meta-decision-system.md) | 3.9k |
| How many Meta ads should stay active in a small account? | [meta-decision-system.md](meta-decision-system.md) | 3.9k |
| Is falling Meta reach evidence of creative fatigue? | [meta-decision-system.md](meta-decision-system.md) | 3.9k |
| How should we choose LinkedIn bids and audience size? | [linkedin-b2b-playbook.md](linkedin-b2b-playbook.md) | 2.2k |
| How do we evaluate LinkedIn thought leader ads? | [linkedin-b2b-playbook.md](linkedin-b2b-playbook.md) | 2.2k |
| Which search intent should we fund first? | [google-search-playbook.md](google-search-playbook.md) | 2.5k |
| How should negatives and match types change account structure? | [google-search-playbook.md](google-search-playbook.md) | 2.5k |
| Can Performance Max replace our search campaign? | [google-search-playbook.md](google-search-playbook.md) | 2.5k |
| How can channels reach a fixed list of target accounts? | [abm-playbook.md](abm-playbook.md) | 1.8k |
| Write Google responsive search ads with valid output limits. | [rsa-output-spec.md](rsa-output-spec.md) | 1.0k |
| Grade this account when exports omit important evidence. | [audit-guardrails.md](audit-guardrails.md) | 1.8k |
| Which benchmarks may be quoted to a client? | [audit-guardrails.md](audit-guardrails.md) | 1.8k |
| Do disclosed search terms account for all wasted spend? | [reading-google-ads-data.md](reading-google-ads-data.md) | 2.2k |
| Are zero conversions enough to pause this low-volume campaign? | [reading-google-ads-data.md](reading-google-ads-data.md) | 2.2k |
| Audit Shopping, Merchant Center, and PMax together. | [google-ads-audit-checklist.md](google-ads-audit-checklist.md) | 2.4k |
| Map competitor creative and reviews into testable personas. | [creative-research-automation.md](creative-research-automation.md) | 2.2k |
| How should audiences and exclusions be configured? | [audience-targeting.md](audience-targeting.md) | 1.6k |
| How do we configure and verify conversion tracking? | [conversion-tracking.md](conversion-tracking.md) | 2.8k |
| What must be checked before launching on this platform? | [platform-setup-checklists.md](platform-setup-checklists.md) | 2.0k |
| Draft an initial ad concept using a copy framework. | [ad-copy-templates.md](ad-copy-templates.md) | 1.3k |

## Evidence and scope

Live-account recommendations require the matching operational playbook plus
[audit-guardrails.md](audit-guardrails.md). This index supplies routing, not
account evidence, spend permission, or a universal benchmark. If the export,
conversion definition, attribution window, or account access is missing, state
what is unknown before recommending an action. For bulk creative iteration use
`ad-creative`; for landing-page conversion work use `cro`.
