# Healthcare: Teardown Pack

Load this pack when the target is a clinic, dental or dermatology practice, med spa, telehealth or digital health company, or a medtech or pharma brand. Growth here runs through trust, insurance, and regulation. Tracking is restricted, ad claims are policed, and the patient journey often involves a referral, a payer, or a prescriber.

## Contents
- How to recognize it
- What drives growth here
- Signals to collect
- Going inside
- Rules that limit copying
- Plays that usually transfer
- Metrics to ask about

---

## How to Recognize It

- Booking widgets from scheduling platforms (Zocdoc, NexHealth, Solutionreach, Jane, Healthie) and "book an appointment" as the main CTA.
- Insurance pages ("insurances we accept"), provider bio pages with credentials, and location pages per clinic.
- Telehealth patterns: an intake quiz before pricing, "prescribed by a licensed provider", state availability lists, and subscription pricing.
- Pharma and medtech patterns: "Important Safety Information" blocks, "Indication" sections, HCP vs patient site splits (`/hcp`, `hcp.` subdomains found by `teardown.mjs subdomains`).
- Consent-heavy analytics: server-side tagging, HIPAA-compliant analytics tools, and few or no ad pixels on logged-in or intake pages. `teardown.mjs detect <domain>` and `teardown.mjs stack <domain>` show this.

## What Drives Growth Here

- **Who decides varies.** In clinics, patients choose. In specialty care, referring doctors choose. In pharma, prescribers and payers choose. Find which one the target markets to before judging its channels.
- **Insurance and price shape demand.** Cash-pay businesses (med spas, telehealth, cosmetic dental) market like ecommerce. In-network practices grow through payer directories, referrals, and local search.
- **Trust signals convert.** Provider credentials, reviews, before/after galleries where allowed, and condition content written or reviewed by clinicians.
- **Tracking is constrained.** After HHS issued guidance on tracking technologies (December 2022, revised March 2024), many providers removed pixels. A federal court vacated part of that guidance in June 2024 (*AHA v. Becerra*), but HIPAA still bars sending patient information to ad platforms, and the FTC has acted against health apps for the same thing. Meta also restricts lower-funnel conversion events for many health and wellness advertisers. Missing pixels or missing purchase events may be compliance, not a lack of paid ads.
- **Telehealth grows like DTC with a clinical gate:** paid social, influencers, quizzes, and subscriptions, limited by state licensing and prescribing rules.

## Signals to Collect

| Signal | Where or how | What it shows |
|---|---|---|
| Location and provider count over time | Wayback captures of location and provider directory pages | Expansion pace and acquisitions; each wave is a move in moves.csv |
| Condition and treatment page library | `teardown.mjs site` and `sitemap-growth` | Their SEO engine; when each family launched |
| ★ Medical reviewer bylines | Read condition pages for "medically reviewed by" and author credentials | How they build credibility for health searches |
| Reviews per location | Official Places API or manual reads; Healthgrades, Zocdoc, Vitals profiles | Review velocity; spikes are review campaigns |
| Payer and directory listings | Insurance pages, Zocdoc and insurer directories | Which networks they're in and where patients find them |
| ★ Pixel removal or consent changes | `teardown.mjs stack <domain>` over time | When they changed tracking, which can explain a dip in reported paid performance |
| Ad library presence and claims | `teardown.mjs ads` and `sc-ads`; Meta and Google libraries | Which treatments they advertise and how they phrase claims within policy |
| Intake quiz flow | Walk the public quiz up to the point of entering health data | Segmentation, qualification, and price reveal timing |
| State availability changes | Wayback of the "where we're available" page | Licensing expansion; each new state is a move |
| Influencer and creator content | Search social for the brand and #ad or #sponsored | Telehealth and aesthetics creator programs |
| Clinical trials and approvals | ClinicalTrials.gov, FDA announcements, press releases | Pipeline and launch timing for medtech and pharma |
| ★ Provider records | The NPPES NPI Registry (public search and API) by organization name and location | Providers tied to the organization and when each was enumerated, a check on provider-count claims and new-location hiring |
| State licensing for telehealth | State medical board license lookups for the target's clinicians | Which states they can actually serve, and when each license was issued |
| ★ Open payments to physicians | CMS Open Payments database | Which doctors a pharma or device company pays for speaking and consulting, a proxy for prescriber marketing |

## Going Inside

- **Never book an appointment you won't keep.** A no-show costs a practice a real slot and may block a real patient. Only book if the user actually wants the care.
- **Never enter real or fake health information.** Stop intake quizzes before the health questions, or use questions that don't require personal health data. Don't create a patient record.
- With approval, it's fine to: read public pricing, call the front desk to ask about pricing, insurance, and availability under the user's real name, and record response speed and the scheduling flow.
- For telehealth, walk the funnel to the checkout or medical intake and stop. Screenshot pricing, plans, and the subscription terms.

## Rules That Limit Copying

- **HIPAA and HHS tracking guidance:** covered entities can't send protected health information to ad platforms through pixels. Copying a competitor's tracking setup can create violations. Check with counsel.
- **FTC Health Breach Notification Rule** applies to many health apps that aren't covered by HIPAA.
- **FDA and FTC split the work.** The FDA governs prescription drug and restricted device advertising: fair balance, Important Safety Information, and approved indications only. The FTC covers over-the-counter drugs, supplements, most devices, and health claims in general. In September 2025 the FDA began a broad enforcement push on drug ads, including social media and influencer posts, and it has warned telehealth companies against marketing compounded drugs as if they were approved products.
- **FTC substantiation:** health claims need competent and reliable scientific evidence. Before/after claims need typical-result context.
- **Platform policies:** Google's healthcare and medicines policy requires certification for some categories (online pharmacies, addiction services). Meta restricts targeting and personal health assertions ("Are you struggling with...").
- **Controlled substances:** prescribing them through telehealth falls under DEA rules whose temporary flexibilities have been extended several times. Check the current status before copying a telehealth model.
- **State rules:** medical advertising, corporate practice of medicine, and telehealth licensing vary by state. Check with counsel.

## Plays That Usually Transfer

| Play | Run it with |
|---|---|
| Condition and treatment page library with clinician review | **content-strategy**, **programmatic-seo** |
| Provider and location pages with schema | **schema**, **site-architecture** |
| Review program after visits, within platform rules | **referrals** |
| Intake quiz that segments and reveals price | **lead-magnets**, **cro** |
| Compliant ad creative with claim substantiation | **ad-creative**, **ads** |
| Server-side, consent-aware conversion tracking | **conversion-tracking**, **analytics** |
| Referral relationships with referring providers, with no payment or gifts tied to referrals unless counsel clears them (Anti-Kickback Statute, Stark Law) | **co-marketing**, **sales-enablement** |

## Metrics to Ask About

- **Cost per booked appointment:** spend divided by kept appointments, not form fills.
- **Show rate:** share of booked appointments kept.
- **New patient volume:** per location per month.
- **Patient lifetime value:** visits or subscription months times margin.
- **Referral share:** patients from referring providers vs self-referred.
- **Intake completion rate:** for telehealth, quiz start to paid consult.
- **Retention:** subscription churn for telehealth, recall rate for practices.
