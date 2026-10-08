# Waterfall Enrichment and Cache Reuse

Load this when a prospect list needs multiple data providers, repeated lookups, or a credit budget. Keep the prospecting skill's ICP, source lineage, contact verification, and compliance rules. This is a workflow design, not a new API or a promise of coverage.

## Define the Success Condition Before Calling Providers

For each missing field, specify the required input, acceptable output, freshness, and maximum cost. A nonempty response is insufficient: a guessed address, a wrong-company match, or an old job title may fail the acceptance rule.

Example: find a published business contact for an ICP-fit account, then verify deliverability separately. A provider returning a name alone has not completed that task. Do not expand to personal emails simply because work-email providers found nothing.

Order providers by fit for this field, observed coverage, cost, and latency. There is no universal Hunter/Apollo/FullEnrich order. Use the user's existing connected tools; a manual public-source lookup is also a valid step.

## Run a Waterfall, Not Every Provider

1. Normalize the inputs and check existing verified CRM fields.
2. Read the exact cache entry for the first provider lookup.
3. If no reusable entry exists, perform that lookup within the authorized budget.
4. Validate the returned identity and field; record source and retrieval time.
5. Stop when the acceptance rule is satisfied. Otherwise advance to the next suitable provider.
6. If all steps return no acceptable result, retain the row as unresolved with a reason. Do not fill blanks with invented values.

| Lookup outcome | Next action |
|---|---|
| Fresh, accepted result | Reuse it; stop this field's waterfall |
| Genuine no-match | Advance; optionally cache the no-match briefly |
| Wrong entity or invalid output | Record rejection; advance if another source can resolve it |
| Authentication/permission error | Repair the connection; do not label the contact nonexistent |
| Rate limit, timeout, provider outage | Respect provider retry guidance and budget; defer or use an authorized independent source |
| Missing required input | Resolve identity first; another identical empty-input call will not help |

Apply conditions per row. An already verified contact should not spend credits discovering the same field again. Dependent steps wait for the preceding result; independent missing fields may run concurrently within provider limits.

For Clay, configure the provider sequence, inputs, and run conditions using its [waterfall documentation](https://university.clay.com/docs/building-a-data-waterfall). Its [workflow guidance](https://university.clay.com/docs/enrichment-in-workflows) distinguishes publishing a setup from running it and spending credits. Other tools need their own documented execution semantics.

## Exact Cache Keys

Use a structured key with these dimensions:

```text
workspace/account + provider + endpoint/version + normalized inputs + requested fields/options
```

Keep account scope separate even when two customers query the same domain. Normalize domains consistently (case, URL host, trailing dot); remove URL paths only for domain-based lookups. Preserve distinctions a provider treats as meaningful: person versus company, subdomain, country, filters, and email local-part rules. A company-name fuzzy match is not an exact cache hit.

Store status, accepted fields, entity identifiers, source, fetched time, expiry, and validation outcome. Never store API keys in keys or result logs. Restrict access to contact data and honor deletion/retention requirements.

- **Fresh accepted hit:** reuse without another charged call.
- **Expired hit:** refresh fields that require current evidence; label any provisional stale data explicitly.
- **Miss:** fetch the provider; a cache endpoint's documented 404 may mean only that the cache has no entry, not that the provider found no company.
- **Negative hit:** apply a separate, usually shorter expiry; changing inputs invalidates the match.
- **Error:** keep operational failures distinct from no-match records.

Merge accepted fields with provenance instead of overwriting verified CRM data with nulls or weaker matches. For concurrent duplicate lookups, reuse one in-flight request where supported; guard the final write so a late weaker result cannot replace a newer verified one.

## Deliverable and Pilot

Return a table with row identity, missing field, provider order, acceptance rule, cache decision, source/date, result, verification status, cost, and unresolved reason. Track cost per accepted field and verified contact, cache reuse, no-match rate, invalid-match rate, and sampled accuracy. Report actual measured savings; a cache does not guarantee a particular reduction.

Pilot on representative rows before a broad run: fresh hit, expired hit, true no-match, ambiguous company, provider failure, and duplicate input. Compare with a single-provider control under the same acceptance rule and budget. Pass qualified rows to cold-email only after contact verification; use the revops inbound-routing playbook for live form submissions.

Patterns adapted from eliasstravik's MIT-licensed GTM engineering toolkit. This playbook works with existing providers or manual research.
