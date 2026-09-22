# Product Marketing Context: RACO Monitoring Center (RMC)

**Document version:** v1
**Last updated:** 2026-09-22
**Status:** Auto-drafted from the `raco-monitoring-center` and `rmc-rtuapi` codebases. Sections marked **[VALIDATE]** are hypotheses or gaps that need input from sales, support, or customers. See [../claims-and-evidence.md](../claims-and-evidence.md) for sources and the list of claims we must not make yet.

Companion hardware context: [../verbatim-gen2/product-marketing.md](../verbatim-gen2/product-marketing.md)

## Product Overview

**One-liner:** Cloud monitoring and alarm notification for remote water and wastewater sites. When a lift station goes wrong, the right person gets a call, a text, or an email until someone acknowledges it.

**What it does:** RMC shows live and historical data from RACO RTUs installed at lift stations, treatment plants, tanks, and other remote sites. When a sensor is not normal, it works through a notification group (in order or all at once) by voice call, SMS, and email, and keeps repeating until someone acknowledges. Operators can also change device settings, run relay outputs on a schedule or on alarm, and read PLC data over EtherNet/IP or Modbus TCP, all from a browser.

**Product category:** Remote monitoring and alarm notification for water/wastewater (the shelf buyers search on: "lift station monitoring", "pump station alarm", "remote alarm dialer", "cellular RTU monitoring"). It sits next to SCADA, not in place of it.

**Product type:** B2B SaaS web app (desktop and mobile browser), sold with RACO hardware. Also accepts third-party devices through the RACO Public API (BYOD).

**Business model:** Hardware sale plus a per-RTU service subscription. [VALIDATE] What we can see in code and legal terms:
- Each RTU has a Service Plan with an active/inactive state.
- Every account includes 1 year of data retention at no extra cost. An Extended Retention add-on gives 3 or 5 years, sold on 1, 3, or 5 year terms "at the rates published on RACO's website".
- Fees come from an Order Form. Terms are a "Municipal & Utility Version".
- Legacy AlarmAgent Gen1 real-time channel reporting is an extra-cost option.
- No price list exists in the repo. Price points, bundles, and contract length must come from sales.

## Target Audience

**Target companies:**
- Municipal water and sewer utilities, sanitation districts, county public works departments (core buyers; these are ADA Title II public entities).
- Small to mid-size systems that have remote lift stations and tanks but no full SCADA reach to every site, or SCADA with gaps. [VALIDATE size band, e.g. population served or station count]
- Secondary: private industrial sites with remote equipment (the product works for "any equipment that needs to be monitored"). Terms limit use to "business, industrial, utility, and municipal use".

**Decision-makers:** Operators and superintendents (primary ICP). Utility or public works directors sign off. Council, board, or finance approve spend for larger buys. SCADA integrators and consulting engineers influence spec. [VALIDATE who signs at typical deal size]

**Primary use case:** Know right away when a remote lift station or pump site has a problem (high wet well, pump fail, power loss, comms loss), and make sure a person on call responds, without driving out to check.

**Jobs to be done:**
- "Wake the right person when a station alarms, and keep calling until someone owns it."
- "Show me, from my phone or desk, which sites need action now and which are fine."
- "Let me change setpoints, delays, and relays without a truck roll."
- "Give me pump runtime, starts, and flow history so I can plan maintenance and answer questions from management or regulators."

**Use cases:**
- Lift station high wet well and pump fail alarms, with on-call rotation.
- Power fail and battery alarms at remote sites.
- Tank level and flow monitoring with daily totals (Flow Meter module).
- Duplex pump runtime and starts per day (Duplex Pump Metrics module).
- Adding alarm notification to an existing PLC over EtherNet/IP or Modbus TCP, including Rockwell Studio 5000 tag import (behind a feature flag at time of writing).
- Scheduled or alarm-driven relay control (for example, start a backup, reset a device), with a clear note that it is not a safety interlock.
- Replacing or retiring legacy alarmagent.com and AlarmAgent Gen1 units in one portal.

## Personas

| Persona | Cares about | Challenge | Value we promise |
|---------|-------------|-----------|------------------|
| **Operator (user)** | Getting the call, knowing what is wrong before driving out, not getting blamed for a miss | Nuisance alarms at 2 a.m., vague "station alarm" messages, landline dialers that fail | A clear call or text that says which site and which sensor, one-tap acknowledge from the message, snooze when already on the way |
| **Superintendent (champion)** | No missed alarms, on-call coverage, less windshield time, records | Tracking who responded, keeping the call list current, too many sites for the crew | One screen for all sites, notification groups that escalate until someone acknowledges, a delivery log that shows who was contacted and when |
| **Utility / public works director (decision maker)** | Risk (overflows, violations, public complaints), budget, staff limits | Aging dialers and phone lines, SSO exposure, retiring staff who know every site | Fewer surprises, audit trail, remote access that does not depend on one person |
| **Finance / council (financial buyer)** | Predictable cost, procurement rules, grant fit | Capital vs. operating budget, justifying subscriptions | [VALIDATE] Per-site subscription vs. cost of a truck roll or an overflow event |
| **SCADA integrator / I&C tech / consulting engineer (technical influencer)** | Standard protocols, no conflicts with existing SCADA, IT security | Adding alarm notification to PLCs without rebuilding SCADA | EtherNet/IP adapter and Modbus TCP, IP allow list, CSV tag import, no change to the control system |

## Problems & Pain Points

**Core problem:** Remote stations fail when nobody is there. If the alarm does not reach a person who acts, the result is a sewer overflow, a flooded dry well, a burned-out pump, or a regulator call.

**Why alternatives fall short:**
- Phone-line autodialers depend on copper lines that carriers are retiring, and they give little record of who was called. [VALIDATE with field quotes]
- Full SCADA to every small station costs too much and needs radio or network work. [VALIDATE]
- Daily site rounds use staff time and still miss problems between visits.
- Some cellular monitors rely on one network path. Gen2 adds satellite as a backup path for alarms (see Gen2 context).

**What it costs them:** Overtime and truck rolls, pump damage, overflow cleanup, fines and consent-decree exposure, and public trust. [VALIDATE with a real customer cost example]

**Emotional tension:** Fear of the alarm that did not come through. Fatigue from nuisance calls. Worry about being the name on the incident report.

## Competitive Landscape

[VALIDATE all of this section. No competitor names appear in the codebase. The list below is a market hypothesis for sales to confirm or correct.]

**Direct:** Other cellular lift station monitoring services with their own RTUs and a cloud portal (for example Mission Communications, OmniSite, Sensaphone). Falls short because: [VALIDATE per competitor: price per site, notification flexibility, PLC integration, satellite backup, contract lock-in].

**Secondary:** SCADA with an alarm dialer add-on (for example WIN-911 or a built-in HMI alarm call-out). Falls short because: needs network reach to every site and in-house SCADA skills; small stations often sit outside it.

**Indirect:** Landline voice autodialers (including RACO's own legacy Verbatim dialers), manual daily rounds, and "call the non-emergency line" from neighbors. Falls short because: phone lines are being retired, no dashboard, no history, no remote setup.

## Differentiation

**Key differentiators:**
- Escalation that keeps going until someone acknowledges: sequential or blast groups, per-contact delay, repeat until acknowledged (up to 48 hours or 100 passes), with a guard that warns when "No one will be called if an alarm fires".
- Acknowledge the way the operator is already working: keypad on the voice call (9 to acknowledge, 7 to snooze), one-tap link in the SMS or email, swipe on mobile, or the web.
- Delivery proof per message: "Delivered", "Send failed", or accepted but not confirmed. Superintendents can see who was reached.
- Operator-first home screen: what needs action now, acknowledged but still not normal, repeat offenders, sites offline.
- Remote configuration with pending-change tracking ("Changes will be sent to the device when it reconnects").
- PLC alarm notification over EtherNet/IP and Modbus TCP with Studio 5000 tag import, without touching SCADA. [Behind a feature flag; confirm GA before external claims]
- One portal for old and new RACO hardware (AlarmAgent Gen1, Verbatim Gen2) plus third-party devices through the Public API.
- Built for WCAG 2.2 AA, Section 508, and ADA Title II, which matters to public buyers. [Do not distribute the VPAT; it is an internal draft]

**How we do it differently:** RACO makes both the RTU and the software, and has built remote alarm equipment for water sites since 2003 (AlarmAgent). The software is designed around one rule: "An operator must never misread a status."

**Why that's better:** Fewer missed alarms, less time driving to check on sites, and a record of who was notified.

**Why customers choose us:** [VALIDATE with win/loss notes. Likely candidates: long RACO track record in water, US-based support by phone, satellite backup on Gen2, lower cost than SCADA expansion.]

## Objections

| Objection | Response |
|-----------|----------|
| "We already have SCADA." | RMC is not a SCADA replacement. It adds call-out and remote visibility for sites SCADA does not reach, and can read PLC tags over EtherNet/IP or Modbus TCP to send alarms. |
| "Cellular is not reliable at our stations." | Gen2 falls back to satellite for alarms when cellular fails. Offline data queues on the device for up to 7 days. [Confirm coverage check offer from sales] |
| "Another subscription?" | [VALIDATE] Compare the per-site cost with one truck roll or one overflow event. 1 year of data retention is included. |
| "What if the alarm call does not get through?" | Groups repeat until someone acknowledges. Every message shows delivery status. RACO also monitors delivery failures internally. |
| "Is it secure?" | Sign-in through Auth0, optional company phone access code, IP allow list for PLC connections. [Do not claim MFA until the setting is exposed in the UI] |
| "Our crew won't learn a new app." | Operators can acknowledge from the phone call or a text link without opening the app. Setup checklist and guided tips for admins. |

**Anti-persona:**
- Anyone who needs a control system, safety interlock, or life-safety alarm. The product and Terms say it is "supplemental" and "Not a replacement for SCADA, safety interlocks, or operator supervision".
- Consumer or residential users (Terms restrict to business, industrial, utility, and municipal use).
- Sites that need serial Modbus RTU polling today (not implemented).
- Buyers who need push notifications, pager, or fax today (not implemented).

## Switching Dynamics

**Push:** Copper phone lines retired or failing, a missed alarm or overflow event, no record of who was called, retiring staff, auditors or regulators asking for response records. [VALIDATE]

**Pull:** Calls that say which site and which sensor, acknowledge from the phone, one dashboard for every station, remote setup, satellite backup, pump and flow data.

**Habit:** "The old dialer still works." Call lists kept on paper or in one person's head. Budget cycles that favor keeping what is paid for. Existing contracts with another vendor.

**Anxiety:** Migration effort and downtime at live stations, cellular coverage at remote sites, subscription cost growth, data ownership, learning curve for the crew.

## Customer Language

**How they describe the problem:** [VALIDATE: collect verbatim quotes from support calls, sales notes, and user interviews. None exist in the repo.]
- "[verbatim]"

**How they describe us:** [VALIDATE]
- "[verbatim]"

**Words to use:** alarm, acknowledge, snooze, lift station, pump station, wet well, site, RTU, notification group, on call, "sensor is not normal", return to normal, runtime, starts, flow, satellite backup, remote setup.

**Words to avoid:**
- "Replaces SCADA", "control system", "safety system", "guaranteed delivery", "never miss an alarm" (conflicts with the Terms and in-app disclaimers).
- "In violation" in customer copy (the product changed this to "sensor is not normal").
- Red, amber, or green for anything that is not alarm state in product visuals.
- Hype words: revolutionary, cutting-edge, seamless, game-changing.
- "Call tree" in customer copy; the UI says "Notification Group".

**Glossary:**
| Term | Meaning |
|------|---------|
| RTU | Remote terminal unit. The RACO device at the site. |
| Channel | One input or output on an RTU (digital, analog, totalizer, relay). |
| Notification Group | The ordered list of people contacted for an alarm. Sequential or Blast. |
| Acknowledge | A person takes ownership. Notifications stop. |
| Snooze | Pause notifications for 30 minutes. |
| Abandoned | Alarm stopped notifying without an acknowledgement (for example, RTU disarmed or limit reached). |
| Armed / Disarmed | Whether the RTU sends alarms. |
| Status only | A channel that is recorded but never alarms. |
| Asset | A physical thing at a site (pump, wet well, generator, tank) linked to RTU channels. |
| HMI module | A built-in view, such as Flow Meter or Duplex Pump Metrics. |
| Industrial Networks | PLC connections over EtherNet/IP or Modbus TCP. |
| BYOD | Bring your own device. Third-party hardware connected through the RACO Public API. |

## Brand Voice

**Tone:** Calm, plain, and dependable. The reader may be on call at night. Say what happened and what to do.

**Style:** Direct and specific. Short sentences. Sentence case. No period at the end of headlines. Empty states say what is missing and the next step. Errors give a plain headline and a way to retry.

**Personality:** Dependable, practical, field-savvy, honest about limits, low-key.

**Visual identity:** Navy #11163B (primary), Cyan #14D9F2 (accent, never text on white), Dark Grey #4F4F4F, Light Grey #F6F6F6. Brand fonts for marketing and print: Urbanist Bold (headings), HK Grotesk (body). The product UI uses Inter. Wordmark: clear space equal to the mark height, minimum height 20 px. Source: RACO Brand Book (Dec 2021) and `documentation/design-system/` in RMC.

## Proof Points

**Metrics:** [VALIDATE: sites monitored, alarms delivered per month, median acknowledge time, uptime. None are in the repo. Pull from production data before use.]

**Customers:** [VALIDATE: need written permission before naming any utility.]

**Testimonials:**
> "[quote]" - [name, title, utility] [VALIDATE]

**Value themes:**
| Theme | Proof |
|-------|-------|
| Alarms reach a person | Repeat until acknowledged; delivery status per message; setup checklist blocks empty groups |
| Know what needs action now | Operator home: active, unacknowledged over 15 min, longest-standing, repeat offenders, offline |
| Fewer truck rolls | Remote setpoints, delays, arm/disarm, relay control; pending changes sent on reconnect |
| Works with what you have | EtherNet/IP and Modbus TCP PLC connections; Gen1 and Gen2 in one portal; Public API for other devices |
| Long track record in water | RACO has built remote alarm equipment since 2003 (AlarmAgent Gen1) [VALIDATE company founding year for broader claims] |

## Goals

**Business goal:** [VALIDATE] Grow active RTU subscriptions in water/wastewater and move AlarmAgent Gen1 customers to Verbatim Gen2 on RMC before alarmagent.com shuts down.

**Conversion action:** [VALIDATE] Request a demo or quote. Secondary: contact RACO support at 800-449-4536 or racoman.com/support.

**Current metrics:** [VALIDATE] Unknown. PostHog product analytics is in place in RMC (see `PRODUCT-ANALYTICS-SPEC.md`); marketing metrics live in HubSpot.

## Changelog
*Newest first. One line per revision: what changed and why.*
- v1 (2026-09-22) - Initial context, auto-drafted from the RMC and RACO Public API codebases.
