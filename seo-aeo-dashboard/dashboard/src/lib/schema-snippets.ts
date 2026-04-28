import type { VenueReport } from "@/types/venue";

/**
 * Generate a copy-paste ready MusicVenue JSON-LD block for a venue.
 * Values are derived from what the scoring engine already knows about the page.
 */
export function generateMusicVenueSchema(v: VenueReport): string {
  const comps = v.aeo_components;
  const geo   = v.geo_components;

  // Pull capacity from findings text if present
  const capacityFinding = (
    geo.entity_clarity?.findings ?? []
  ).find(f => /capacity/i.test(f));
  const capacityMatch = capacityFinding?.match(/(\d[\d,]+)/);
  const capacity = capacityMatch ? parseInt(capacityMatch[1].replace(",", ""), 10) : null;

  // Known Wikidata Q-IDs for venues that have them
  const WIKIDATA: Record<string, string> = {
    "o2-academy-brixton":        "Q1377325",
    "o2-apollo-manchester":      "Q3327064",
    "o2-shepherds-bush-empire":  "Q1372589",
    "edinburgh-corn-exchange":   "Q5348052",
    "o2-academy-birmingham":     "Q4653498",
    "o2-academy-glasgow":        "Q4653504",
    "o2-academy-leeds":          "Q4653506",
    "o2-forum-kentish-town":     "Q5339218",
    "o2-academy-bristol":        "Q16889058",
  };

  const wikidataId = WIKIDATA[v.slug];

  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "MusicVenue",
    "name": v.venue_name,
    "url": v.url,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": extractCity(v),
      "addressCountry": "GB",
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      "description": "Opening hours vary by event — check event listings",
    },
  };

  if (capacity) schema["maximumAttendeeCapacity"] = capacity;

  if (wikidataId) {
    schema["sameAs"] = [
      `https://www.wikidata.org/wiki/${wikidataId}`,
      `https://en.wikipedia.org/wiki/${encodeURIComponent(v.venue_name.replace(/ /g, "_"))}`,
    ];
  }

  // Placeholder event snippet
  schema["event"] = {
    "@type": "Event",
    "name": "REPLACE_WITH_EVENT_NAME",
    "startDate": "REPLACE_WITH_ISO_DATE",
    "location": {
      "@type": "Place",
      "name": v.venue_name,
    },
    "offers": {
      "@type": "Offer",
      "url": v.url,
      "availability": "https://schema.org/InStock",
    },
  };

  return JSON.stringify(schema, null, 2);
}

export function generateFaqSchema(v: VenueReport): string {
  const city = extractCity(v);
  const name = v.venue_name;

  const questions = [
    {
      q: `What is the capacity of ${name}?`,
      a: `[FILL IN CAPACITY] — check the venue information page for the most up-to-date figures.`,
    },
    {
      q: `How do I get to ${name}?`,
      a: `${name} is located in ${city}. [FILL IN transport links — tube/tram/bus routes and nearest station.]`,
    },
    {
      q: `Is ${name} accessible for wheelchair users?`,
      a: `[FILL IN accessibility provision — wheelchair access, hearing loops, accessible toilets, etc.]`,
    },
    {
      q: `What is the age policy at ${name}?`,
      a: `[FILL IN age policy — e.g. 14+, 16+, or 18+ depending on event. Check individual event listings.]`,
    },
    {
      q: `Is there parking near ${name}?`,
      a: `[FILL IN parking information — nearest car parks, cost, distance from venue.]`,
    },
    {
      q: `What bag policy does ${name} operate?`,
      a: `[FILL IN bag policy — maximum size, prohibited items, cloakroom availability.]`,
    },
  ];

  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": questions.map(({ q, a }) => ({
      "@type": "Question",
      "name": q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": a,
      },
    })),
  };

  return JSON.stringify(schema, null, 2);
}

function extractCity(v: VenueReport): string {
  const findings = [
    ...(v.geo_components.entity_clarity?.findings ?? []),
  ].join(" ");
  const cityMatch = findings.match(/\b(London|Manchester|Birmingham|Edinburgh|Bristol|Leeds|Sheffield|Glasgow|Liverpool|Southampton|Oxford|Leicester|Bournemouth|Newcastle)\b/i);
  return cityMatch ? cityMatch[1] : v.region;
}
