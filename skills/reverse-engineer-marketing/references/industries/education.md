# Education: Teardown Pack

Load this pack for edtech products, online courses and cohort programs, bootcamps, and colleges and schools. Education is a considered, high-anxiety purchase with long cycles, seasonal intakes, and strict rules on outcome claims, so the funnel runs through info sessions, advisors, financing, and proof of results.

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

- "Apply now", "Request info", "Book an info session", or "Next cohort starts" as the main calls to action.
- Program pages with start dates, tuition, and financing; syllabus or curriculum downloads behind a form.
- Enrollment CRM and application tools in the page source or on subdomains (`apply.`, `admissions.`, `learn.`, `courses.`), visible through `teardown.mjs stack` and `teardown.mjs subdomains`.
- Course platforms behind course pages (Teachable, Thinkific, Kajabi, Podia, Maven), visible in page scripts or as raw CNAME targets on subdomains like `learn.` and `academy.` in `teardown.mjs dns`.
- For schools and colleges: `.edu` domains, accreditation statements, and outcomes or consumer information pages.
- `teardown.mjs detect <domain>` flags these together as education.

## What Drives Growth Here

- **Intakes are seasonal.** Enrollment spikes before each cohort or term start, so the traffic curve has a sawtooth shape. Compare intake to intake, not month to month.
- **The info session is the conversion step.** Webinars, open houses, and advisor calls move most applicants. Count how often they run and what they offer at the end.
- **Financing unlocks the price.** Payment plans, loans, income share agreements, employer sponsorship, and scholarships often line up with growth more than ads do.
- **Outcomes are the product.** Job placement reports, salary claims, and student stories carry the marketing, and they're tightly regulated.
- **Partnerships bring demand.** Employer, university, and platform partnerships (course marketplaces, workforce programs) can deliver whole cohorts.

## Signals to Collect

| Signal | Where or how | What it shows |
|---|---|---|
| ★ Cohort start dates over time | Wayback captures of program and calendar pages, read by hand (`history` only tracks prices) | How often they launch cohorts and how that cadence grew; each new intake becomes a move in moves.csv |
| Tuition and financing history | `teardown.mjs history <tuition page url>` and Wayback captures of financing pages | Price changes and when payment plans, ISAs, or loan partners appeared |
| ★ Outcomes reports | Published placement or outcomes reports, and their archived versions | What they claim, how they measure it, and whether the method changed |
| Info session and webinar cadence | Event pages, registration pages, and their archives | How often they run the main conversion event |
| Scholarship and discount campaigns | Archived homepage banners via `teardown.mjs hero` and scholarship pages | Deadline-driven promotions tied to each intake |
| New programs and tracks | `teardown.mjs sitemap-growth <domain>` for new program paths | When they expanded into new subjects; first appearance becomes a move |
| Employer and university partners | Partner pages and press releases, with dates | Partnership-driven enrollment channels |
| Course marketplace presence | Their listings on course marketplaces and learning platforms | Whether third-party marketplaces feed them students |
| Paid ads | `teardown.mjs sc-ads` and ad libraries, filtered for intake deadlines | Seasonal spend pattern and which outcomes they lead with |
| ★ Student reviews and community | Review sites for courses and bootcamps, Reddit threads, alumni groups | Real outcomes, complaints, and what drives referrals |
| Free content and lead magnets | Free courses, mini-courses, challenges, and syllabus downloads | The top of the enrollment funnel |
| For colleges: public data | Federal data such as the College Scorecard and IPEDS in the US | Enrollment, costs, and completion over years, as real numbers |
| ★ State disclosures for private schools | State regulator filings, such as California's School Performance Fact Sheets and annual reports for schools approved by the Bureau for Private Postsecondary Education | Completion and placement rates on the regulator's terms, to check against marketing claims |

## Going Inside

- **Request info and attend an info session** with approval, under the user's real name. Record the email and SMS sequence by day, how fast an advisor follows up, the questions they ask, and the offer at the end of the session.
- **Start an application** only if the user approves, and stop before submitting. Note the steps, the essay or assessment, and any application fee.
- **Free courses or trials:** take them and log the upsell path to the paid program.
- **Guardrails:** don't book advisor calls you won't attend, and don't submit applications under a false identity; admissions teams and small course creators lose real time.

## Rules That Limit Copying

- **Outcome and earnings claims:** the FTC polices job placement and salary claims, and in 2021 it sent for-profit schools a notice of penalty offenses on earnings and job claims, which makes violations finable. Many states regulate private postsecondary schools and bootcamps, including what they can advertise (California's Bureau for Private Postsecondary Education is one).
- **Accreditation:** only accredited institutions can claim accreditation, and some terms ("degree", "university") are protected in many jurisdictions.
- **Financing:** loans and income share agreements fall under lending rules. A 2021 CFPB consent order treated income share agreements as private education loans, which brings disclosure duties. Check with counsel before copying a financing offer.
- **Student privacy:** FERPA (US) and similar laws protect student records; testimonials need consent.
- **Recruiting rules:** schools that take federal student aid (Title IV) can't pay recruiters per enrollment, which shapes their sales team and lead-vendor deals.

## Plays That Usually Transfer

| Play | Run it with |
|---|---|
| A recurring info session or live workshop as the main conversion step | **events** |
| A free mini-course or challenge that leads into the paid program | **lead-magnets** |
| An intake-based launch with a deadline and scholarship | **launch**, **offers** |
| An outcomes page with a clear, honest method | **copywriting**, **product-marketing** |
| Program pages per career or skill, built from real curricula | **programmatic-seo** |
| An advisor follow-up sequence by email and SMS | **emails**, **sms** |
| An alumni referral program | **referrals** |

## Metrics to Ask About

- **Lead to applicant rate:** inquiries that start an application.
- **Applicant to enrolled rate:** applications that become paid enrollments.
- **Info session show rate and conversion:** registrants who attend, and attendees who apply.
- **Cost per enrollment:** marketing spend per enrolled student.
- **Completion rate:** enrolled students who finish.
- **Outcome rate:** graduates who reach the promised outcome, by the published method.
- **Cohort fill rate:** seats filled per intake.
