# Claims and Evidence: RMC and Verbatim Gen2

**Last updated:** 2026-09-22

This file backs the two product marketing context docs. It records where each claim comes from, the claims we must not make yet, and the open questions to close. Update it when a source changes.

## Sources reviewed

| Source | What it gave us | Snapshot |
|--------|-----------------|----------|
| `RACO-Manufacturing/raco-monitoring-center` | RMC features, UI copy, Terms of Service text, roles, design system and brand rules, roadmap notes | 2026-09-22 |
| `RACO-Manufacturing/rmc-rtuapi` | RACO Public API (BYOD) scope | 2026-09-22 |
| `RACO-Manufacturing/gen2-agent` | Verbatim Gen2 firmware capabilities, I/O counts, comms behavior | v1.10.4 (2026-09-14) |
| `RACO-Manufacturing/gen2-hardware` | Nothing. Repo holds only a one-line README | 2026-09-17 initial commit |

## Verified claims (safe to use)

| Claim | Evidence |
|-------|----------|
| Notifications by voice call, SMS, and email | RMC `ContactMethod.cs`, Escalator notifiers |
| Groups repeat until acknowledged, up to 48 hours or 100 passes | RMC `ui/components/groups/group-editor.tsx` |
| Sequential or Blast notification groups | RMC group editor |
| Acknowledge from the phone keypad, SMS/email link, mobile swipe, or web | RMC `documentation/voice-notification-workflow.mermaid`, `app/ack/[id]/page.tsx` |
| Snooze is 30 minutes | RMC alarm UI |
| Delivery status per message | RMC `ui/components/alarms/delivery-status.ts` |
| Setup checklist warns "No one will be called if an alarm fires" | RMC `notification-setup-checklist.tsx` |
| Operator and Fleet home views | RMC `documentation/HomeDashboard.md` |
| Flow Meter and Duplex Pump Metrics modules | RMC `ui/components/hmi/types.ts` |
| Relay schedule and alarm-driven control | RMC `output-editor.tsx`; Gen2 `src/relay.cpp` |
| 1 year data retention included; 3 or 5 year add-on | RMC Terms of Service, section 11.1 |
| RMC supports AlarmAgent Gen1, Verbatim Gen2, and API devices | RMC `README.md` |
| AlarmAgent Gen1 built since 2003 | RMC `README.md` |
| WCAG 2.2 AA, Section 508, ADA Title II as the design target | RMC `documentation/accessibility/` |
| Gen2: 20 digital, 8 analog, 4 counter inputs, 4 relays | Gen2 `src/sensor.cpp`, `src/relay.cpp` |
| Gen2: health channels for power, battery, signal, temperature | Gen2 `src/sensor.cpp` |
| Gen2: satellite fallback for alarms after about 120 s cellular failure, 30 min on satellite | Gen2 `src/device.cpp`, `docs/images/cell-ntn-switch-logic.png` |
| Gen2: 7-day offline queue | Gen2 `CHANGELOG.md` 1.10.1 |
| Gen2: EtherNet/IP adapter up to 495 bits; Modbus TCP server up to 1000 bits | Gen2 `include/ethernet_ip_adapter.h`, `include/modbus.h` |
| Gen2: OTA firmware updates, dual slot | Gen2 `src/firmware_update.cpp` |
| Gen2: OLED screen, 3 LEDs, 1 button, satellite self-test | Gen2 `src/display.cpp`, `CHANGELOG.md` 1.10.1 |
| Support phone 800-449-4536 | Gen2 `src/display.cpp` |

## Do not claim yet

| Claim | Why |
|-------|-----|
| "Replaces SCADA", "safety system", "guaranteed alarm delivery", "never miss an alarm" | Terms call RMC "supplemental"; in-app notice says "Not a replacement for SCADA, safety interlocks, or operator supervision" |
| MFA / two-factor sign-in | Field exists in code, no UI exposes it |
| Push notifications, pager, fax | Not implemented (README mentions pager and fax as a plan) |
| Custom roles | Supported in data model only, no UI |
| Dealer, reseller, or integrator portal | No such tier in product |
| Industrial Networks (PLC) as generally available | Behind feature flag `industrial-monitoring-enabled` |
| Public API output control | Endpoints commented out in the spec |
| Serial Modbus RTU / RS-485 | Config field only, no polling code |
| External temperature probes | Only the on-board sensor is read |
| Local voice dialer, siren, keypad, BLE, phone app for setup | Not in firmware |
| Signed or encrypted firmware updates | Firmware uses MD5 only; code notes it is not secure |
| "Dry contact" inputs | Firmware reads digital inputs through an ADC; rating not confirmed |
| Any certification (FCC, PTCRB, carrier, UL/CSA), enclosure rating (NEMA/IP), operating temperature, power input, battery runtime | No hardware source |
| Specific carrier or LTE category | Firmware does not name them; Terms list LTE-M, NB-IoT, CAT-M1 as possible services |
| Full satellite connectivity | Only alarms and events use satellite; commands from RMC wait 30+ minutes |
| Customer names, metrics, testimonials | None found; need permission and data |
| Distributing the VPAT | Internal draft marked "must not be distributed" |

## Open questions (owner in brackets is a suggestion)

1. Customer-facing product name and model number for Gen2. "Verbatim Gen2", "Verbatim Gen 2", or other? [Product]
2. Where are the Gen2 electronics files, datasheet, and compliance reports? The `gen2-hardware` repo is empty. [Engineering]
3. Pricing: hardware list price, per-RTU monthly or annual fee, what the fee includes (cellular data, satellite), contract term. [Sales]
4. Top 3 competitors lost to and won against, and why. [Sales]
5. 5 to 10 verbatim customer quotes about the problem and about RACO. [Support, Sales]
6. Size band of the best-fit utility (population served or station count). [Sales]
7. Who signs the purchase at a typical deal size, and is it a bid, a sole-source, or a co-op contract? [Sales]
8. Is there a Gen1 to Gen2 migration offer and a date for the alarmagent.com shutdown? [Product]
9. When does Industrial Networks leave the feature flag? [Product]
10. Proof points: sites monitored, alarms delivered, median acknowledge time, uptime. [Engineering, from production data]
11. Temperature alarm defaults disagree (changelog 140/158 F vs code 122/140 F). Not a marketing claim, but flag for engineering. [Engineering]
