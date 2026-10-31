# Crypto and Web3: Teardown Pack

Load this pack for exchanges, wallets, DeFi protocols, layer-1 and layer-2 networks, and NFT or token projects. Crypto is the one industry where much of the growth evidence is public by design: activity is recorded on-chain, and incentive programs are announced openly.

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

- Wallet connection libraries (WalletConnect, RainbowKit, wagmi, ethers, web3.js) in the app's scripts. `teardown.mjs stack` flags WalletConnect; check the app page's source for the others
- "Connect wallet" buttons, `app.` subdomains for the protocol interface, and links to block explorers
- Token tickers, contract addresses, audits, docs on GitBook or Mintlify, and governance forums (often Discourse at `gov.` or `forum.`)
- Community links to Discord, Telegram, and X before any email signup
- `teardown.mjs detect <domain>` flags WalletConnect and wallet and on-chain language; `teardown.mjs subdomains <domain>` shows `app.`, `gov.`, `bridge.`, `stake.` launches by date

## What Drives Growth Here

- **Incentives drive most spikes.** Points programs, airdrops, liquidity mining, and fee rebates bring users fast. The question is how many stay after the incentive ends.
- **Market cycles move everything.** Activity across the whole category rises and falls with prices. Compare the target against peers in the same period before crediting any move.
- **Community is the main owned channel.** Discord, Telegram, and X often matter more than email or search, and founders' accounts carry outsized reach.
- **Integrations are distribution.** Being listed in wallets, aggregators, and other protocols' interfaces brings volume without marketing spend.
- **Exchanges grow on listings and regions.** New token listings, new country licenses, and fiat on-ramps change what users can do.

## Signals to Collect

| Signal | Where or how | What it shows |
|---|---|---|
| ★ On-chain activity over time | Block explorers and public analytics dashboards (Dune, DefiLlama, Token Terminal) | Daily active addresses, transactions, volume, and fees: real usage, not estimates |
| ★ Total value locked (TVL) by day | DefiLlama for DeFi protocols | Deposits over time, by chain. Jumps line up with incentive launches |
| ★ Points and airdrop announcements | The project's blog, docs, X, and governance forum | Dated incentive moves. Each launch, season, and end becomes a move in moves.csv |
| ★ Retention after incentives | On-chain activity in the weeks after a points season or airdrop ends | Whether the incentive bought lasting users or only mercenary activity |
| Governance proposals | The governance forum and voting platform (Snapshot, Tally) | Budgets for growth, grants, incentives, and partnerships, with amounts and dates |
| Ecosystem grants | The foundation's grants page and announcements | Which builders and integrations they fund to grow usage |
| Integration listings | Wallet app directories, aggregators, partner pages | Where they get distribution, and when each listing started |
| Exchange listings | Exchange announcement pages | Dated listings that changed liquidity and reach |
| Referral and affiliate codes | Their referral page; creator links with codes | The reward structure and who promotes them |
| ★ Token unlocks and treasury moves | The token's vesting schedule in docs, and treasury addresses on explorers | Dated supply unlocks and treasury spending; growth pushes often cluster around unlocks |
| Paid attention programs | Creator or KOL rounds, posting leaderboards that reward mentions, ambassador programs | Whether reach on X was bought; label these posts as paid, not organic |
| Community size over time | Discord and Telegram member counts, X followers (Wayback for older counts) | Community growth around launches and incentives |
| Audits and incidents | Audit reports, post-mortems, incident trackers | Exploits and outages that stalled growth |
| Licensing by region | Their legal or regions page; regulator registers | Countries added or exited, dated |

## Going Inside

- Use a wallet the user controls and approves for research. Never ask for seed phrases or private keys, and never sign transactions the user hasn't reviewed.
- Don't move or spend funds without explicit approval, including gas fees.
- Screenshot onboarding: wallet connection, the first-action prompt, the points dashboard, and the referral prompt.
- For exchanges, account creation means identity verification (KYC). Do it only under the user's real identity with approval.
- Never farm an airdrop or points program with multiple wallets, wash trade, or game any incentive. That breaks the program's rules and often the law.

## Rules That Limit Copying

- **Securities rules:** regulators in the US and elsewhere can treat some tokens, yield products, and staking programs as securities, and the US position has been shifting. Copying a token incentive or a yield claim can carry legal risk. Check with counsel.
- **Stablecoins:** the US GENIUS Act (signed July 18, 2025) set federal rules for payment stablecoin issuers, including limits on marketing them as government-backed or insured.
- **Ad platform policies:** Google Ads requires certification for crypto exchange and wallet ads in many countries and bans some products outright. Meta requires prior written permission or a qualifying license for most crypto ads. Both vary by country.
- **Regional rules:** the EU's MiCA framework, the UK FCA's financial promotions regime, and others limit how crypto can be marketed to retail users.
- **Sanctions and KYC rules** limit where exchanges can operate and who they can serve.
- **Influencer disclosure:** paid promotion must be disclosed under FTC rules in the US and similar rules elsewhere.

## Plays That Usually Transfer

| Play | Run it with |
|---|---|
| A referral program with on-chain or account rewards | **referrals** |
| Integration and partner listings that bring distribution | **co-marketing** |
| A founder-led presence on X with build-in-public updates | **social** |
| Docs and guides that rank for "how to" searches in the category | **content-strategy**, **programmatic-seo** |
| A community program with clear roles and recognition | **community-marketing** |
| A launch sequence for new features, chains, or seasons | **launch** |

## Metrics to Ask About

- **Daily and monthly active addresses:** unique wallets interacting with the contracts
- **TVL:** value deposited in the protocol
- **Volume and fees:** trading or transaction volume, and fees earned
- **Retention after incentives:** share of users still active weeks after a program ends
- **Cost per retained user:** incentive spend divided by users still active later
- **Verified accounts:** for exchanges, accounts that finished KYC and funded
