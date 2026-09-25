# Ecommerce platforms: Shopify, WooCommerce, and the rest

Load this when the conversion is a purchase and the store runs on a platform. It covers what actually works on each platform right now, what recently stopped working (with dates, because "my tracking died" increasingly has a calendar explanation), and the mechanics that apply to every store regardless of platform.

## The mechanics every store shares

The order record is the source of truth. Everything below follows from using it properly.

- **Deduplication is mandatory, not optional.** Nearly every ecommerce setup ends up with two senders for the same purchase (a browser pixel and a server event, or a platform's native channel and an app someone installed). Both fire, both count, revenue doubles. Every pair of senders must share an event ID per purchase (Meta deduplicates on `event_id` + event name; GA4 on `transaction_id`), or one of the senders must be removed. When auditing overcounting, inventory the senders before touching any tag.
- **Value correctness is where trust dies quietly.** Decide once whether reported value includes tax and shipping, apply it identically on every sender, and check the currency. Multi-currency stores can report the shopper's presentment currency to one platform and the store currency to another, which makes ROAS wrong in both directions at once.
- **Item IDs must match the merchant feed.** Dynamic remarketing and Shopping campaigns join purchase item data against the product feed. IDs that do not match (variant ID sent where the feed carries the parent product ID, or vice versa) break the join silently; campaigns keep running on less data and nothing errors.
- **Platforms optimise on the funnel, not just the purchase.** View item, add to cart, and begin checkout feed bidding and retargeting. A purchase-only setup works but underfeeds the algorithms.
- **Refunds are an asymmetry, not a setting.** Google Ads supports conversion adjustments (restate for partial refunds, retract for full ones; gclid and gbraid only, and a retracted conversion can never be adjusted again). GA4 has a standard `refund` event. Meta has no refund mechanism at all. Almost nobody wires any of this up, so "are refunds adjusted anywhere?" is a legitimate audit question whose usual answer is no. Consequences in `discrepancies.md`.

## Shopify

### The deprecation calendar (check this first in any audit)

Shopify removed the places people pasted tracking code for a decade, on these dates, verified against Shopify's own developer documentation:

| Date | What stopped |
|---|---|
| 1 Feb 2025 | Apps can no longer create script tags scoped to the order status page |
| 28 Aug 2025 | Script tags and Additional Scripts stop on Thank you and Order status pages, **Plus stores** |
| **26 Aug 2026** | The same stop for **all remaining stores**, applied by auto-upgrade whether or not the merchant migrated |
| 1 Mar 2027 | Storefront script tags stop on the storefront proper (the next wave) |

The failure is silent. Checkout works, the thank-you page renders, only the tags are gone. **Any Shopify store whose conversion tracking "just stopped" in late August 2026 should be checked for this before anything else.** The one-minute check is whether the missing tag lived in checkout's Additional Scripts or came from an app that customised the order pages. Most tracking guides on the internet still teach the dead method, so a user following a recent-looking tutorial can build an already-broken setup today.

### What works now

- **The native channels, first.** The Google & YouTube channel installs the Google tag, configures purchase conversion tracking, and sends Enhanced Conversions with hashed checkout data. The Facebook & Instagram channel at the "Maximum" data-sharing setting sends purchases server-side via CAPI. For a store whose destinations are Google Ads and Meta, this is complete, free, and maintained by Shopify, and the honest recommendation is to lead with it. See `server-side.md` for the other options and when a third-party tool earns its fee (other destinations, funnel depth, parameter control, agency multi-store needs).
- **Web pixels, for everything else.** Custom pixels are added in the admin under Settings, then Customer events, and subscribe to standard events (`page_viewed`, `product_viewed`, `product_added_to_cart`, `checkout_started`, `checkout_completed`). Apps ship app pixels through the same API. This is the only supported way to run your own tracking code through checkout and the order pages.
- **Know the sandbox before debugging it.** Pixels run sandboxed (custom pixels in a lax sandbox, app pixels strict), with controlled access to browser APIs. Scripts that assume full page access can behave differently inside a pixel than they did in a theme. When a tag misbehaves in a pixel, check the platform's pixel-specific install docs before assuming the tag is wrong.
- **Checkout events are trustworthy.** `checkout_completed` fires on the platform's own order flow, so the fire-on-confirmed-success rule is satisfied by construction. The lead-gen problem of inferring success does not exist here.

### Auditing a Shopify store

1. Date the breakage against the calendar above.
2. Inventory the senders: native channels connected, app pixels installed, custom pixels defined, any legacy theme code. Overcounting on Shopify is almost always two of these firing for the same purchase without dedup.
3. Check value settings per sender (tax and shipping in or out, presentment versus store currency).
4. Verify with a real low-value test order if policy allows, or the platform's test surfaces, and refund it afterwards (noting the refund will not reach Meta).

## WooCommerce

### Two checkouts, two behaviours

WooCommerce currently ships two checkout architectures, and tracking advice must fork on which one the store runs. The classic shortcode checkout renders through PHP templates and fires the hooks and jQuery events a decade of plugins depend on. The Blocks checkout (default for new installs since WooCommerce 8.3) renders through React and does not fire many of them, which quietly breaks older tracking plugins and homemade jQuery listeners. A store that redesigned its checkout and lost tracking usually crossed this line.

Version changes matter here too. WooCommerce 10.9 (June 2026) moved draft-order creation to near place-order time, which broke integrations that relied on an order existing early in checkout. When a WooCommerce site's tracking stopped, ask what updated that week; the answer is often in the changelog.

### What works now

- **Hook the order, not the page.** The server-side order hooks (`woocommerce_payment_complete`, and `woocommerce_thankyou` as the page-side companion) fire regardless of which checkout renders. Anything keyed on them survives both architectures and every front-end redesign. This is the purest form of reading the order record.
- **Guard the thank-you page.** The thank-you URL gets refreshed, bookmarked, and revisited. The production-grade pattern is to record a tracked flag in order meta the first time tracking fires for an order and check it before firing again, so every order counts exactly once. Any thank-you-page-based tag without such a guard overcounts.
- **The plugin route.** Official platform plugins exist for Google and Meta, and independent plugins (Conversion Bridge is a current multi-integration example spanning WooCommerce, Easy Digital Downloads, and dozens of form and membership plugins) handle detection and sending across the WordPress ecosystem. Server-side coverage differs per plugin and shifts between versions, so verify what a given plugin actually sends server-side in its current documentation rather than assuming. The same order-hook and dedup rules apply to whatever the plugin ships.
- **Caching is a real failure mode.** Aggressive page caching can serve stale checkout and thank-you markup that breaks dynamic tracking. When tracking works logged in and fails logged out, suspect the cache.
- **Easy Digital Downloads** follows the same shape with its own hooks (`edd_update_payment_status` for the order lifecycle, `edd_refund_order` for refunds).

### Auditing a WooCommerce store

1. Which checkout, classic or Blocks? Everything downstream depends on it.
2. What updated recently (WooCommerce core, the tracking plugin, the theme)?
3. Where does the purchase event originate, a page template, a plugin, or an order hook? Page-origin tracking gets the double-fire and cache checks; hook-origin tracking mostly needs the dedup and value checks.
4. Same sender inventory and value checks as Shopify.

## Other platforms, briefly

- **BigCommerce, Squarespace Commerce, Wix Stores** and similar hosted carts vary in how much script access and which native integrations they offer, and their details shift often enough that this file does not attempt to freeze them. Apply the shared mechanics above (identify the order-confirmed moment the platform exposes, inventory senders, dedup, value correctness), check the platform's current documentation for its supported tracking surface, and treat any paste-a-pixel-ID field as browser-side with all the usual losses.
- **Custom-built stores** are the cleanest case, not the hardest. The backend already knows the order; send conversions from the order-confirmation webhook or handler via the platform APIs or a server-side container (`server-side.md`), attach the click IDs captured at landing, and dedup against any browser pixel that also fires. The fire-on-confirmed-success rule is trivially satisfiable and there is no platform in the way.
