# Reference Guide: Mastering MarTech Specifications & Campaign PRDs

This reference guide serves as the companion documentation for the `create-spec` skill. It provides deep-dive frameworks, standard checklists, and operational mental models that AI agents and growth teams use to execute the steps demanded in `SKILL.md`.

---

## 1. The Strategic Alignment Framework

Before detailing schemas or integrations, a marketing specification must clarify the core business growth lever. This guide builds on the foundational context derived from your local `.agents/product-marketing.md` file to outline exactly how tactical features solve growth bottlenecks.

### 1.1 Crafting the Growth Hypothesis

Every technical marketing asset should be treated as an experiment designed to shift a core performance indicator (KPI). When documenting your hypothesis, utilize this standardized structure:

- **Current Friction State:** What data bottleneck, tracking blind spot, or funnel leak currently exists? (e.g., _"We are experiencing a 65% drop-off at our pricing selection screen due to cognitive overload."_)
- **Proposed Technical Intervention:** What technical asset, tracking deployment, or calculator flow are you injecting?
- **Expected Quantitative Yield:** What exact conversion lift, cost reduction, or pipeline acceleration metric do you expect to achieve?

### 1.2 Defining Scope and Out-of-Scope Boundaries

To maintain velocity and avoid scope creep during deployment, use a clear structural table to establish strict capability criteria:

| In-Scope Tasks                                                                          | Out-of-Scope Tasks                                                                      | Operational Rationale                                                                            |
| :-------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------------- |
| Core technical architecture, event data layers, and third-party API webhook structures. | Modifying primary product codebase, refactoring underlying user authentication engines. | Restricts project footprint to the marketing technology stack, ensuring faster deployment loops. |
| Client-side form tracking, cookie compliance mapping, and routing logic.                | Native database layout re-indexing or server performance adjustments.                   | Preserves core engineering resources for product features while optimizing marketing data flows. |

---

## 2. MarTech Pipeline Architecture

A specification is fundamentally a data routing blueprint. Modern growth engineering relies on multi-layered architectures that move event data safely from a user's web interaction down to operational dashboards and CRM workflows.

### 2.1 The Standard Growth Stack Topology

When detailing your data flows, follow the industry-standard progression tracking map:

1. **The Client-Side Interaction Layer:** The landing page form, interactive element, or script listener capturing the raw input event.
2. **The Tag Management & Consent Engine:** Tools like Google Tag Manager or OneTrust that evaluate privacy consent states before evaluating tracking pixels.
3. **The Customer Data Platform (CDP):** An infrastructure engine (like Segment or RudderStack) that ingests the client-side event token and normalizes the payload.
4. **The Downstream Execution Destinies:** The secondary platforms receiving the normalized data stream server-side:
   - **Product/UI Performance:** Tools like Mixpanel or Amplitude tracking interface velocity.
   - **Sales Lifecycle & CRM Automation:** Central databases like HubSpot, Salesforce, or Customer.io powering email sequences and account routing.
   - **Paid Network Attribution:** Server-side tracking arrays like Meta Conversions API or Google Enhanced Conversions mapping ad attribution.

---

## 3. Analytics Instrumentation & Event Mapping

A robust specification leaves zero ambiguity for the teams implementing tracking pixels. Every event must be mapped out completely across a standardized tracking matrix.

### 3.1 Event Naming Best Practices

- **Object-Action Framework:** Always use the `object_action` syntax in lowercase, using underscores instead of spaces (e.g., `lead_form_submitted`, `pricing_modal_opened`). Avoid mixing casing systems (like camelCase) across the same documentation.
- **Data Properties Typing:** For every property passed with an event, declare its exact data type (`string`, `boolean`, `integer`, `array`) and provide explicit validation limits.

### 3.2 Lead Scoring Implementation Models

When building automatic lead qualification rules, translate abstract marketing goals into clean algebraic execution steps. For example, computing priority lead scores ($S_L$) can combine corporate size indexes ($C$), past session behavior indexes ($N$), and external social validation percentages ($A$) to route opportunities directly to active sales queues:

$$S_L = (w_1 \cdot C) + (w_2 \cdot N) + (w_3 \cdot A)$$

Ensure that the constant weights balance out cleanly ($w_1 + w_2 + w_3 = 1.0$) to guarantee clear, reliable lead evaluation values across your operational software channels.

---

## 4. Edge Case & Failure Mitigation Checklist

A technical document becomes truly production-ready when it maps out system behavior during unforeseen operational failures. Always address the following three exception categories:

### 4.1 Data & Tracking Obstacles

- **Cookie/Consent Rejection:** If a visitor opts out of tracking cookies, detail the fallback engine. Data processing should continue entirely in the browser memory state to allow the tool to function, while eliminating all persistent tracking storage logs or analytical network pings.
- **Incomplete Form Recovery:** Specify how the user interface caches unsubmitted data if a user accidentally reloads their screen mid-journey.

### 4.2 Network & Platform Degradation

- **API Ingestion Outages:** When external endpoints (like HubSpot or an active CRM) return HTTP rate limits (`429`) or server faults (`500`), the data pipeline must buffer payloads into background cache queues (such as Redis queues) using an exponential backoff retry loop.
- **Graceful Script Failures:** Ensure that if an external tracking script fails to load due to a user's ad-blocker configuration, the core interface elements degrade smoothly without freezing the checkout screen or breaking form action scripts.

---

## 5. Document Checklist for Stakeholder Review

Before finalizing a marketing technical specification or campaign PRD for distribution, review your document layout against this standard operational checklist:

- [ ] **Word Alignment:** Document utilizes semantic headings (`#`, `##`, `###`) exclusively for hierarchical structure, ensuring an auto-generated Table of Contents mapping in Word.
- [ ] **No Placeholders:** All template options, fake links, or bracketed variables like `[TBD]` are entirely populated with explicit, realistic domain-specific definitions.
- [ ] **Data Symmetry:** Every data field property established in the Section 3 data schema is matched accurately with validation constraints inside Section 4 and exception cases inside Section 8.
- [ ] **Zero Code Proximity:** The document details system routing contracts, event properties, and configuration architectures without breaking down code assets or creating specific developer tickets.
