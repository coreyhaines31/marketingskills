# Risk Policy

What Google treats as link spam, how to check a site before paying for a placement, how to judge a link vendor, and what to do if the profile already has problems. Policy checked against Google Search Central's spam policies, last updated 2026-08-28. Re-check before advising on a borderline case.

## What Google Says

Google defines link spam as creating links "primarily for the purpose of manipulating search rankings." Named examples include:

- Buying or selling links that pass ranking credit, including exchanging goods or services for links and sending a product in exchange for a post with a link
- Excessive link exchanges, and partner pages made only for cross-linking
- Automated programs or services that create links
- Text ads or text links that don't block ranking credit
- Advertorials or native ads with paid links that pass ranking credit
- Links with optimized anchor text in articles, guest posts, or press releases distributed on other sites

Google also says buying and selling links is a normal part of advertising and sponsorship, and that it's not a violation as long as the links carry `rel="sponsored"` or `rel="nofollow"`. Use `rel="ugc"` for user-generated content such as comments and forum posts.

Separately, the **site reputation abuse** policy covers third-party content placed on a strong site mainly to borrow its ranking signals. Paying for an article on a big publisher's "partner content" section to rank a commercial page falls here.

## Paid Placements

Paying for visibility is legitimate. The rule is about ranking credit and disclosure.

| Placement | Inside Google's policy? | What to tell the user |
|---|---|---|
| Sponsored listing in a directory or "best X" list | Yes | Needs a `sponsored` or `nofollow` link and a visible disclosure |
| Newsletter or podcast sponsorship | Yes | Disclose it as sponsored; links in email don't pass ranking credit anyway |
| Free product sent for review | Yes | The reviewer qualifies the link and discloses the relationship (FTC endorsement rules apply in the US) |
| Paid guest post with a followed link | No | Google names it as link spam. The user decides; run the site checks below |
| Paid insertion into an existing article ("niche edit," contextual link) | No | Same. Also check that the sentence reads naturally and the page is on topic |
| Rented link, paid monthly | No | Same. The link disappears when the payment stops, so any effect is temporary |
| Sitewide or footer link package | No | The easiest paid pattern to detect. Higher risk than single placements |
| Private blog network links | No | Don't use |

A sponsored placement can still be worth buying for referral traffic and AI visibility. AI engines read the page whether or not the link passes ranking credit. Judge it on audience and citation value, and never promise the user an SEO lift from it.

## If the User Decides to Buy Followed Links

State the rule and the risk once: a paid followed link is outside Google's policy, Google may ignore it, and a large or obvious pattern can bring a manual action. Then help the user buy carefully. On a marketplace every publisher is a separate site, so run these checks on each site, not on the marketplace as a whole.

1. **Topic fit.** The site and the page cover the user's subject. An off-topic link is the clearest sign of a purchase.
2. **Real traffic.** Organic traffic that is steady or growing in a third-party estimate. Flat or falling traffic on a site that publishes daily suggests the articles are the product.
3. **Outbound links.** Read a few recent posts. Links to unrelated casinos, loans, or supplements mean the site sells to everyone.
4. **The page itself.** For an insertion, the page is indexed, gets visits, and the new sentence fits what's already there.
5. **Anchor text.** Branded or plain-language anchors. Exact-match keyword anchors are the pattern Google names.
6. **Volume and pace.** A few relevant placements over time. Dozens in a week from similar sites form a pattern.
7. **A record.** Log the URL, price, date, and link attribute for every placement, so links can be qualified or removed later.

Measure the result on the target page's rankings and traffic, not on the number of links bought.

## Vetting a Link Vendor

When the user asks whether a link building agency or marketplace is safe, check:

1. **Do they sell "do-follow" links at a price per link or by domain rating?** That's selling ranking credit. Say so: the links are outside Google's policy, and the user decides whether to accept that.
2. **Can they show the placements?** Real outreach produces pages on sites with their own audience and named authors. A list of sites that publish anything for a fee is a network.
3. **Do the sites sell to everyone?** Look for a "write for us" page on every topic, outbound links to unrelated casinos, loans, or supplements, and traffic that's flat or falling.
4. **Is the anchor text yours to choose?** Vendors who let you pick exact-match anchors on guest posts are offering the pattern Google names.
5. **What do they report?** Link counts and domain rating alone, with no rankings or traffic, means the links are the product.

Agencies that sell the work (content, digital PR, outreach on your behalf, and placements they can't guarantee) stay inside the policy.

## If the Profile Already Has Problems

- **Manual action in Search Console:** read the notice under Security & Manual Actions. Remove or qualify the links you control or paid for, document what you couldn't remove, then file a reconsideration request that explains what happened and what changed.
- **No manual action, but a history of bought links:** stop buying, ask for removal or a `sponsored` attribute where you have a contact, and focus on earning links. Google says it ignores most spammy links algorithmically.
- **Disavow:** Google recommends the disavow tool only when there's a manual action, or a large number of paid or spammy links you created that are likely to cause one. Don't disavow links just because a tool scores them as "toxic." A disavow of good links can hurt.
- **Negative SEO worries:** random spammy links pointing at a site are common and usually ignored. Watch for a manual action instead of reacting to every one.

## Disclosure Inside This Repo's Guidance

When a recommendation involves paying a site, a creator, or a vendor, say so plainly and name the requirement (link attribute and audience disclosure). Recommend more than one option, and say when a vendor has a commercial relationship with the person recommending it.
