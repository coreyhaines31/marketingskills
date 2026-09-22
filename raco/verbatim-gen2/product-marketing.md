# Product Marketing Context: Verbatim Gen2 RTU

**Document version:** v1
**Last updated:** 2026-09-22
**Status:** Auto-drafted from the `gen2-agent` firmware (v1.10.4, released 2026-09-14) and the RMC codebase. The electronics repo (`gen2-hardware`) is empty, so **every physical spec (enclosure, power input, certifications, temperature range, battery runtime) is unconfirmed**. Sections marked **[VALIDATE]** need input from engineering, sales, or customers. See [../claims-and-evidence.md](../claims-and-evidence.md) for sources and claims we must not make yet.

Companion software context: [../raco-monitoring-center/product-marketing.md](../raco-monitoring-center/product-marketing.md)

## Product Overview

**One-liner:** A remote monitoring RTU for lift stations and remote water sites that sends alarms over cellular and switches to satellite when cellular fails.

**What it does:** The Verbatim Gen2 watches up to 20 digital inputs, 8 analog inputs, and 4 pulse counters at a site, plus its own power, battery, signal, and temperature. It sends status and alarms to RACO Monitoring Center (RMC), which calls, texts, and emails the on-call crew. If an alarm cannot get out on cellular, the unit sends it over satellite. It can also run 4 relays, and it can read alarm bits from a PLC over EtherNet/IP or Modbus TCP.

**Product category:** Cellular RTU / remote alarm unit for water and wastewater ("lift station monitor", "pump station alarm", "cellular alarm dialer", "satellite RTU").

**Product type:** Industrial IoT hardware sold with an RMC service subscription. Configured and monitored only through RMC (app.racoman.com); there is no local setup app.

**Business model:** Hardware purchase plus per-RTU RMC service plan. [VALIDATE list price, whether cellular/satellite data is bundled, and any satellite surcharge]

**Naming:** [VALIDATE] The name varies across sources: "Verbatim Gen2" (RMC UI), "Verbatim Gen 2" (firmware display name), "Verbatim Gen2 RTU" (EtherNet/IP identity), "Verbatim Next" (RMC README, code name). Pick one customer-facing name and a model number. This doc uses **Verbatim Gen2**.

## Target Audience

**Target companies:** Same as RMC: municipal water and sewer utilities, sanitation districts, county public works. Best fit is a system with remote lift stations or tanks where phone lines are going away, cellular is weak in spots, or SCADA does not reach. Also existing RACO AlarmAgent Gen1 and legacy Verbatim dialer customers. [VALIDATE size band]

**Decision-makers:** Superintendent and operators pick it; director approves; SCADA integrator or electrician installs and may specify. [VALIDATE]

**Primary use case:** Put one box in a lift station control panel so that high level, pump fail, and power fail alarms reach a person, even when the cell network is down.

**Jobs to be done:**
- "Get alarms out of a remote station, even when cellular fails."
- "Tell me when station power is lost, and keep reporting on battery."
- "Add call-out to the PLC I already have, without rebuilding SCADA."
- "Let me set it up and change it from the office."

**Use cases:**
- Lift station: high wet well, pump fail, seal fail, power fail, intrusion (digital inputs); wet well level (4-20 mA analog); pump runtime and starts.
- Flow and totals from pulse outputs (4 counter inputs) or analog flow rate.
- PLC-equipped stations: read up to 1000 Modbus TCP bits or up to 495 EtherNet/IP bits as alarm points.
- Relay actions on alarm or on a daily schedule.
- Upgrade path for AlarmAgent Gen1 (10 inputs, 2 relays) and landline Verbatim dialers.

## Personas

| Persona | Cares about | Challenge | Value we promise |
|---------|-------------|-----------|------------------|
| **Operator (user)** | Alarms that work; knowing the unit is healthy | Dead phone lines, weak cell signal, no idea if the dialer is still working | Status screen and LEDs on the unit, built-in health alarms (power, battery, signal), satellite backup |
| **Superintendent (champion)** | Coverage at every station, fewer site visits | Mixed old dialers, some stations with no signal | One device type for every station, set up and changed from RMC, 7 days of offline buffering |
| **Director (decision maker)** | Risk, budget, long service life | Replacing copper lines, justifying new hardware | Cellular plus satellite path, one vendor for box and software, RACO support line [VALIDATE warranty and support terms] |
| **Integrator / electrician / I&C tech (technical influencer)** | Easy wiring, standard protocols, fits the panel | Tight panels, PLC tag mapping, site IT rules | 4-20 mA and digital inputs, EtherNet/IP adapter and Modbus TCP server, IP allow list, Studio 5000 tag import in RMC, on-unit health screen and satellite self-test [VALIDATE mounting, terminal type, power input] |

## Problems & Pain Points

**Core problem:** A station alarm is only useful if it reaches someone. Copper phone lines are going away, and cellular has dead zones and outages, often during the storms when stations fail.

**Why alternatives fall short:**
- Landline dialers lose their phone line and give no remote view. [VALIDATE]
- Cellular-only monitors go silent in a cell outage or dead zone.
- Adding stations to SCADA means radio or network work and integrator time.

**What it costs them:** Missed alarms during outages, overflows, pump damage, extra site visits to check dialers. [VALIDATE with a field example]

**Emotional tension:** "Is the dialer even working?" Not knowing until something goes wrong.

## Competitive Landscape

[VALIDATE all of this section. No competitor names appear in any repo. This is a hypothesis for sales to correct.]

**Direct:** Other cellular lift station RTUs sold with a cloud service (for example Mission Communications, OmniSite, Sensaphone). Falls short because: [VALIDATE per competitor: satellite backup, input count, PLC protocols, data plan terms].

**Secondary:** PLC plus SCADA plus alarm dialer software. Falls short because: cost and network work for each small station.

**Indirect:** Landline voice dialers (including RACO's own legacy Verbatim), manual rounds. Falls short because: phone lines retired, no remote view, no history.

## Differentiation

**Key differentiators:**
- **Automatic satellite backup for alarms.** If an alarm does not send on cellular in about 2 minutes, the unit switches to satellite (Blues Starnote NTN) for 30 minutes, then tries cellular again. Only alarms and events go over satellite. [Satellite delays device commands from RMC by 30+ minutes; say "alarm backup", not "full satellite connectivity"]
- **High I/O count in one unit:** 20 digital, 8 analog (4-20 mA default, voltage option), 4 pulse counters, 4 relays, plus built-in power, battery, signal, and temperature channels.
- **PLC integration built in:** EtherNet/IP adapter (up to 495 bit tags) and Modbus TCP server (up to 1000 bit tags), with IP allow list and heartbeat.
- **Keeps working through power loss:** power-fail alarm (30 s delay), battery backup with low battery alarms at 15% and 5%, safe shutdown near empty, and automatic restart when power returns. [VALIDATE battery runtime]
- **Holds data through outages:** events queue on the unit for up to 7 days and send oldest first when the link returns.
- **Installer-friendly:** OLED status screen, POWER / COMMS / ALERT LEDs (COMMS shows cyan on satellite), one-button System Health screen and satellite self-test.
- **Set up from the office:** all configuration from RMC, including per-channel trip and return delays, NO/NC, scaling, alarm or status-only mode, arm/disarm, relay schedules.
- **Updates over the air:** firmware updates through the cloud with two firmware slots and a check that the new version runs before it is marked good. [Do not claim "signed firmware" or automatic rollback until engineering confirms]
- **Location built in:** GPS and cell/Wi-Fi location, set from RMC, for the fleet map.

**How we do it differently:** RACO designs the RTU, the firmware, and the cloud software together, so the device and RMC share one setup model and one support line.

**Why that's better:** Alarms get out in more conditions, fewer site visits to check or change settings, one vendor to call.

**Why customers choose us:** [VALIDATE with win/loss data]

## Objections

| Objection | Response |
|-----------|----------|
| "No cell signal at that station." | Alarms fall back to satellite. [VALIDATE: offer a site coverage check; confirm satellite sky-view needs] |
| "What happens when power goes out?" | Power-fail alarm after 30 s, runs on battery, low battery alarms, restarts on its own. [VALIDATE runtime hours] |
| "Will it work with our PLC?" | EtherNet/IP adapter or Modbus TCP server over Ethernet. Serial Modbus RTU is not supported. |
| "Is it certified?" | [VALIDATE: FCC, carrier/PTCRB, UL/CSA, enclosure rating. No evidence in repos. Do not answer until engineering confirms.] |
| "Can we configure it on site?" | Setup is done in RMC from any browser. The unit screen shows health and runs a satellite test. No laptop cable needed. |
| "What does satellite cost?" | [VALIDATE] |

**Anti-persona:**
- Sites that need local control logic or safety interlocks (not a PLC, not a safety device).
- Buyers who need serial Modbus RTU, external temperature probes, or a local voice dialer or siren (not in the firmware).
- Buyers who need an offline, no-cloud system (the unit is configured only through RMC).

## Switching Dynamics

**Push:** Copper line retirement, missed alarm during a cell outage, aging AlarmAgent Gen1 fleet and alarmagent.com shutdown, dialers with no remote view.

**Pull:** Satellite backup, more I/O per box, PLC protocols, remote setup, health channels on every unit.

**Habit:** Existing dialers still pass a test call. Panel space and wiring already set. Budget for replacement not approved.

**Anxiety:** Install effort at live stations, coverage, subscription cost, new hardware reliability, whether the old unit's wiring maps over. [VALIDATE: publish a Gen1-to-Gen2 wiring map]

## Customer Language

**How they describe the problem:** [VALIDATE: collect verbatim from support and sales]
- "[verbatim]"

**How they describe us:** [VALIDATE]
- "[verbatim]"

**Words to use:** RTU, lift station, pump station, alarm, satellite backup, power fail, battery backup, 4-20 mA, dry contact [VALIDATE that inputs are rated dry contact], pulse, relay, EtherNet/IP, Modbus TCP, over the air updates.

**Words to avoid:** "never goes offline", "guaranteed", "SCADA replacement", "controller", "signed firmware", "unhackable", "rugged" or "NEMA 4X" (until the enclosure is confirmed), "Verbatim Next" (internal code name), "LTE-M" or a carrier name (until engineering confirms the modem).

**Glossary:**
| Term | Meaning |
|------|---------|
| Channel | One input or output (digital, analog, totalizer/counter, relay). |
| Health channels | Built-in channels for external power, battery %, signal bars, and board temperature. |
| Squelch | Temporarily silence alarms from the unit or one channel. |
| Satellite self-test | Button-started test that confirms the satellite path works. |
| Notehub / Notecard | Blues cellular module and cloud service the unit uses to reach RMC (internal detail; avoid in buyer copy). |

## Brand Voice

Same as RMC. Calm, plain, and dependable; direct and specific; sentence case. For hardware copy, lead with what the unit does at the station, then the spec. Keep specs in tables. Visual identity: Navy #11163B, Cyan #14D9F2, Urbanist Bold and HK Grotesk for print and web.

## Proof Points

**Metrics:** [VALIDATE: units shipped, alarm delivery rate, satellite fallback events. None in repo.]

**Customers:** [VALIDATE: pilot sites and permission to name them]

**Testimonials:**
> "[quote]" - [name, title, utility] [VALIDATE]

**Value themes:**
| Theme | Proof |
|-------|-------|
| Alarms get out | Cellular with automatic satellite fallback for alarms; 7-day offline queue |
| One box per station | 20 DI, 8 AI, 4 counters, 4 relays, plus health channels |
| Works with PLCs | EtherNet/IP adapter (495 bits), Modbus TCP server (1000 bits) |
| Rides through power loss | Power-fail alarm, battery alarms, auto restart |
| Less windshield time | All setup from RMC; OTA firmware updates |

## Spec Sheet Draft

| Item | Value | Source / status |
|------|-------|-----------------|
| Digital inputs | 20, NO/NC configurable | Firmware. [VALIDATE voltage/dry contact rating] |
| Analog inputs | 8, 4-20 mA default, voltage option | Firmware. [VALIDATE resolution, input impedance] |
| Pulse/counter inputs | 4 | Firmware. [VALIDATE max frequency] |
| Relay outputs | 4 | Firmware. [VALIDATE contact rating] |
| Built-in channels | External power, battery %, signal, board temperature | Firmware |
| Ethernet | 1 port (DHCP or static). Second port reserved | Firmware |
| PLC protocols | EtherNet/IP adapter; Modbus TCP server | Firmware |
| Cellular | Blues Notecard. Terms mention LTE-M, NB-IoT, CAT-M1 | [VALIDATE model and bands] |
| Satellite | Blues Starnote (NTN), alarms and events only | Firmware. [VALIDATE service plan] |
| Local interface | OLED screen, 3 RGB LEDs, 1 button | Firmware |
| Offline buffer | 7 days | Firmware |
| Status interval | 15 min default, set from RMC; real-time updates down to 5 s | Firmware |
| Battery | 12 V class, low alarms at 15% and 5% | Firmware inference. [VALIDATE chemistry, capacity, runtime] |
| Power input | [VALIDATE] | No source |
| Enclosure / mounting | [VALIDATE] | No source |
| Operating temperature | [VALIDATE] | No source |
| Certifications | [VALIDATE] | No source |
| Firmware updates | Over the air, dual slot | Firmware |

## Goals

**Business goal:** [VALIDATE] Launch Gen2 as the default RACO RTU, move AlarmAgent Gen1 and landline Verbatim customers to it, and grow RMC subscriptions.

**Conversion action:** [VALIDATE] Request a quote or site assessment.

**Current metrics:** [VALIDATE]

## Changelog
*Newest first. One line per revision: what changed and why.*
- v1 (2026-09-22) - Initial context, auto-drafted from gen2-agent firmware v1.10.4 and RMC. Hardware specs left open because gen2-hardware is empty.
