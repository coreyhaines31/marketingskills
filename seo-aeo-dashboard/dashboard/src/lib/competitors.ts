import competitorData from "../../../data/competitors_sample.json";
import venueData from "../../../data/venues_sample.json";
import type { VenueReport } from "@/types/venue";

export const competitors = competitorData as VenueReport[];
export const portfolio  = venueData    as VenueReport[];

export type VenueType = "portfolio" | "competitor";

export interface PlotPoint {
  slug: string;
  name: string;
  region: string;
  aeo: number;
  geo: number;
  type: VenueType;
  aeo_band: string;
  geo_band: string;
}

export function getAllPlotPoints(): PlotPoint[] {
  const portfolioPoints: PlotPoint[] = portfolio.map(v => ({
    slug: v.slug,
    name: v.venue_name,
    region: v.region,
    aeo: v.aeo_score,
    geo: v.geo_score,
    type: "portfolio",
    aeo_band: v.aeo_band,
    geo_band: v.geo_band,
  }));

  const competitorPoints: PlotPoint[] = competitors.map(v => ({
    slug: v.slug,
    name: v.venue_name,
    region: v.region,
    aeo: v.aeo_score,
    geo: v.geo_score,
    type: "competitor",
    aeo_band: v.aeo_band,
    geo_band: v.geo_band,
  }));

  return [...portfolioPoints, ...competitorPoints];
}

export function getMarketAverages() {
  const avg = (arr: number[]) =>
    Math.round((arr.reduce((a, b) => a + b, 0) / arr.length) * 10) / 10;

  return {
    portfolio: {
      aeo: avg(portfolio.map(v => v.aeo_score)),
      geo: avg(portfolio.map(v => v.geo_score)),
    },
    competitors: {
      aeo: avg(competitors.map(v => v.aeo_score)),
      geo: avg(competitors.map(v => v.geo_score)),
    },
  };
}

export function getTopCompetitors(n = 5): VenueReport[] {
  return [...competitors]
    .sort((a, b) => (b.aeo_score + b.geo_score) - (a.aeo_score + a.geo_score))
    .slice(0, n);
}
