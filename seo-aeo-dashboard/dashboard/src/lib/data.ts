import venuesJson from "../../../data/venues_sample.json";
import type { Band, VenueReport } from "@/types/venue";

export const venues = venuesJson as VenueReport[];

export const getVenue = (slug: string) => venues.find(v => v.slug === slug);

export const regions = Array.from(new Set(venues.map(v => v.region))).sort();

export const averages = {
  aeo: venues.reduce((s, v) => s + v.aeo_score, 0) / Math.max(venues.length, 1),
  geo: venues.reduce((s, v) => s + v.geo_score, 0) / Math.max(venues.length, 1),
};

export const topOpportunities = (() => {
  const items: { venue: string; slug: string; component: string; score: number; type: "AEO" | "GEO" }[] = [];
  for (const v of venues) {
    for (const [k, c] of Object.entries(v.aeo_components)) {
      if (c.score < 30) items.push({ venue: v.venue_name, slug: v.slug, component: k, score: c.score, type: "AEO" });
    }
    for (const [k, c] of Object.entries(v.geo_components)) {
      if (c.score < 30) items.push({ venue: v.venue_name, slug: v.slug, component: k, score: c.score, type: "GEO" });
    }
  }
  return items.sort((a, b) => a.score - b.score).slice(0, 8);
})();

export const bandColor: Record<Band, string> = {
  critical: "bg-band-critical text-white",
  weak: "bg-band-weak text-white",
  moderate: "bg-band-moderate text-black",
  good: "bg-band-good text-white",
  strong: "bg-band-strong text-white",
};
