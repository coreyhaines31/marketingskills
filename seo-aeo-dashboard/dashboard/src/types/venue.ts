export type Band = "critical" | "weak" | "moderate" | "good" | "strong";

export interface Component {
  score: number;
  weighted: number;
  findings: string[];
}

export interface VenueReport {
  venue_name: string;
  slug: string;
  url: string;
  region: string;
  geo_score: number;
  aeo_score: number;
  geo_band: Band;
  aeo_band: Band;
  geo_components: Record<string, Component>;
  aeo_components: Record<string, Component>;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  quick_wins: string[];
  priority_fixes: string[];
  schema_recommendations: string[];
  content_recommendations: string[];
  internal_linking_recommendations: string[];
  crawl_errors: string[];
}

export const AEO_LABELS: Record<string, string> = {
  structured_data: "Structured Data",
  faq_qa_content: "FAQ / Q&A",
  heading_semantic: "Headings",
  internal_linking: "Internal Links",
  page_speed_proxy: "Page Speed",
  content_clarity: "Content Clarity",
};

export const GEO_LABELS: Record<string, string> = {
  entity_clarity: "Entity Clarity",
  content_chunking: "Chunking",
  topical_completeness: "Topical Coverage",
  external_corroboration: "Corroboration",
  structured_data_richness: "Schema Richness",
  prompt_relevance: "Prompt Relevance",
};
