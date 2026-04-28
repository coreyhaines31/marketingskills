import historyData from "../../../data/score_history.json";

export interface ScoreSnapshot {
  date: string;
  week: number;
  aeo_score: number;
  geo_score: number;
}

const history = historyData as Record<string, ScoreSnapshot[]>;

export function getVenueHistory(slug: string): ScoreSnapshot[] {
  return history[slug] ?? [];
}

export function getScoreDeltas(slug: string): { aeo: number; geo: number } | null {
  const snaps = getVenueHistory(slug);
  if (snaps.length < 2) return null;
  const first = snaps[0];
  const last = snaps[snaps.length - 1];
  return {
    aeo: Math.round((last.aeo_score - first.aeo_score) * 10) / 10,
    geo: Math.round((last.geo_score - first.geo_score) * 10) / 10,
  };
}
