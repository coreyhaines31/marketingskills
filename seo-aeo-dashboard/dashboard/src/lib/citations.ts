import citationData from "../../../data/citation_results.json";

export interface CitationResult {
  citation_count: number;
  citation_rate: number;
  citation_band: string;
  cited_by_prompts: string[];
  missed_by_prompts: string[];
}

export interface CitationPrompt {
  id: string;
  text: string;
  venues_cited: string[];
}

export interface CitationMeta {
  run_date: string;
  model: string;
  total_prompts: number;
}

const data = citationData as {
  run_date: string;
  model: string;
  total_prompts: number;
  venues: Record<string, CitationResult>;
  prompts: CitationPrompt[];
};

export const citationMeta: CitationMeta = {
  run_date: data.run_date,
  model: data.model,
  total_prompts: data.total_prompts,
};

export function getVenueCitations(slug: string): CitationResult | null {
  return data.venues[slug] ?? null;
}

export function getPromptDetails(promptIds: string[]): CitationPrompt[] {
  return data.prompts.filter(p => promptIds.includes(p.id));
}

export function getAllCitations(): Record<string, CitationResult> {
  return data.venues;
}

export function citationBandColor(band: string): string {
  const map: Record<string, string> = {
    strong:   "text-emerald-600",
    good:     "text-blue-600",
    moderate: "text-amber-600",
    weak:     "text-orange-500",
    critical: "text-red-600",
  };
  return map[band] ?? "text-slate-500";
}

export function citationBandBg(band: string): string {
  const map: Record<string, string> = {
    strong:   "bg-emerald-100 text-emerald-800",
    good:     "bg-blue-100 text-blue-800",
    moderate: "bg-amber-100 text-amber-800",
    weak:     "bg-orange-100 text-orange-700",
    critical: "bg-red-100 text-red-700",
  };
  return map[band] ?? "bg-slate-100 text-slate-600";
}
