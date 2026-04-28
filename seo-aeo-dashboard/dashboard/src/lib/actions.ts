import venueData from "../../../data/venues_sample.json";
import type { VenueReport } from "@/types/venue";

export type ActionCategory = "schema" | "faq" | "content" | "linking";
export type ActionPriority  = "critical" | "high" | "medium";
export type ActionEffort    = "quick" | "medium" | "substantial";

interface ActionTemplate {
  id: string;
  title: string;
  description: string;
  category: ActionCategory;
  priority: ActionPriority;
  aeoImpactPerVenue: number;
  geoImpactPerVenue: number;
  effort: ActionEffort;
  effortLabel: string;
  check: (v: VenueReport) => boolean;
}

export interface ActionItem {
  id: string;
  title: string;
  description: string;
  category: ActionCategory;
  priority: ActionPriority;
  aeoImpactPerVenue: number;
  geoImpactPerVenue: number;
  effort: ActionEffort;
  effortLabel: string;
  affectedVenues: { slug: string; name: string; region: string }[];
  totalAeoImpact: number;
  totalGeoImpact: number;
}

export interface ActionSummary {
  totalFixInstances: number;
  criticalFixInstances: number;
  estimatedAeoUplift: number;
  estimatedGeoUplift: number;
  venuesWithCritical: number;
}

const venues = venueData as VenueReport[];

function comp(v: VenueReport, engine: "aeo" | "geo", key: string): number {
  const components = engine === "aeo" ? v.aeo_components : v.geo_components;
  return (components as Record<string, { score: number }>)[key]?.score ?? 0;
}

const TEMPLATES: ActionTemplate[] = [
  {
    id: "schema-musicvenue",
    title: "Implement MusicVenue + Event + FAQPage JSON-LD",
    description:
      "Replace generic LocalBusiness with MusicVenue schema. Add maximumAttendeeCapacity, geo coordinates, openingHoursSpecification, and sameAs (Wikidata/Wikipedia). Add Event schema per listed gig and FAQPage once FAQ content exists.",
    category: "schema",
    priority: "critical",
    aeoImpactPerVenue: 14,
    geoImpactPerVenue: 10,
    effort: "quick",
    effortLabel: "~30 min / venue",
    check: v => comp(v, "aeo", "structured_data") < 50,
  },
  {
    id: "faq-content",
    title: "Build FAQ section + FAQPage schema",
    description:
      "Add 6–8 Q&A pairs covering capacity, transport options, accessibility provision, age/bag policy, and ticket collection. Wrap in FAQPage JSON-LD. Directly targets the highest-weight AEO gap across the portfolio.",
    category: "faq",
    priority: "high",
    aeoImpactPerVenue: 12,
    geoImpactPerVenue: 6,
    effort: "medium",
    effortLabel: "~2 hrs / venue",
    check: v => comp(v, "aeo", "faq_qa_content") < 30,
  },
  {
    id: "entity-completeness",
    title: "Complete entity data (capacity, address, phone)",
    description:
      "Ensure venue capacity, full postal address, telephone, and city appear on-page and match schema values exactly. This is the single biggest driver of GEO entity clarity and Knowledge Graph inclusion.",
    category: "content",
    priority: "high",
    aeoImpactPerVenue: 6,
    geoImpactPerVenue: 12,
    effort: "quick",
    effortLabel: "~15 min / venue",
    check: v => comp(v, "geo", "entity_clarity") < 70,
  },
  {
    id: "topical-coverage",
    title: "Cover all 6 key venue topics on the page",
    description:
      "Ensure each venue page explicitly addresses: identity & brand, capacity, venue history/character, accessibility provision, transport links, and upcoming events. Each missing topic reduces LLM topical completeness score by ~16 points.",
    category: "content",
    priority: "high",
    aeoImpactPerVenue: 5,
    geoImpactPerVenue: 10,
    effort: "medium",
    effortLabel: "~1 hr / venue",
    check: v => comp(v, "geo", "topical_completeness") < 80,
  },
  {
    id: "sameAs-links",
    title: "Add Wikidata / Wikipedia sameAs to schema",
    description:
      "Add sameAs property pointing to the venue's Wikidata entity (Q-number) and Wikipedia article where they exist. Boosts external corroboration score — the primary signal LLMs use to verify venue identity.",
    category: "schema",
    priority: "medium",
    aeoImpactPerVenue: 4,
    geoImpactPerVenue: 8,
    effort: "quick",
    effortLabel: "~10 min / venue",
    check: v => comp(v, "geo", "external_corroboration") < 70,
  },
  {
    id: "content-depth",
    title: "Expand venue page copy to 400–600 words",
    description:
      "Target 400–600 words of well-structured body copy covering venue history, atmosphere, notable past performances, and practical visitor info. Directly improves content clarity (30% AEO weight) and content chunking GEO score.",
    category: "content",
    priority: "medium",
    aeoImpactPerVenue: 8,
    geoImpactPerVenue: 5,
    effort: "substantial",
    effortLabel: "~3 hrs / venue",
    check: v => comp(v, "aeo", "content_clarity") < 70,
  },
  {
    id: "internal-linking",
    title: "Link to venue-info, accessibility, and getting-here sub-pages",
    description:
      "Add explicit anchor links from the main venue page to venue information, accessibility, and getting-here pages. Improves crawlability, distributes link equity, and signals content depth to answer engines.",
    category: "linking",
    priority: "medium",
    aeoImpactPerVenue: 3,
    geoImpactPerVenue: 2,
    effort: "quick",
    effortLabel: "~10 min / venue",
    check: v => comp(v, "aeo", "internal_linking") < 70,
  },
];

export function getActionPlan(): ActionItem[] {
  const priorityOrder: Record<ActionPriority, number> = { critical: 0, high: 1, medium: 2 };

  return TEMPLATES
    .map(t => {
      const affected = venues.filter(v => t.check(v));
      return {
        id: t.id,
        title: t.title,
        description: t.description,
        category: t.category,
        priority: t.priority,
        aeoImpactPerVenue: t.aeoImpactPerVenue,
        geoImpactPerVenue: t.geoImpactPerVenue,
        effort: t.effort,
        effortLabel: t.effortLabel,
        affectedVenues: affected.map(v => ({
          slug: v.slug,
          name: v.venue_name,
          region: v.region,
        })),
        totalAeoImpact: affected.length * t.aeoImpactPerVenue,
        totalGeoImpact: affected.length * t.geoImpactPerVenue,
      };
    })
    .sort((a, b) => {
      if (priorityOrder[a.priority] !== priorityOrder[b.priority])
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      return b.totalAeoImpact - a.totalAeoImpact;
    });
}

export function getActionSummary(): ActionSummary {
  const items = getActionPlan();
  return {
    totalFixInstances: items.reduce((s, i) => s + i.affectedVenues.length, 0),
    criticalFixInstances: items
      .filter(i => i.priority === "critical")
      .reduce((s, i) => s + i.affectedVenues.length, 0),
    estimatedAeoUplift: items.reduce((s, i) => s + i.totalAeoImpact, 0),
    estimatedGeoUplift: items.reduce((s, i) => s + i.totalGeoImpact, 0),
    venuesWithCritical: new Set(
      items
        .filter(i => i.priority === "critical")
        .flatMap(i => i.affectedVenues.map(v => v.slug))
    ).size,
  };
}
