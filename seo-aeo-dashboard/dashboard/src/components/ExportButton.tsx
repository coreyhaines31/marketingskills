"use client";

import type { VenueReport } from "@/types/venue";
import type { CitationResult } from "@/lib/citations";

interface Props {
  venues: VenueReport[];
  citations: Record<string, CitationResult>;
}

export default function ExportButton({ venues, citations }: Props) {
  function download() {
    const headers = [
      "Venue", "Slug", "Region", "URL",
      "AEO Score", "AEO Band",
      "GEO Score", "GEO Band",
      "Citation Rate (%)", "Citation Band", "Citations / 12 prompts",
      "AEO: Structured Data", "AEO: FAQ / Q&A", "AEO: Headings",
      "AEO: Internal Links", "AEO: Page Speed", "AEO: Content Clarity",
      "GEO: Entity Clarity", "GEO: Chunking", "GEO: Topical Coverage",
      "GEO: Corroboration", "GEO: Schema Richness", "GEO: Prompt Relevance",
    ];

    const rows = venues.map(v => {
      const c = citations[v.slug];
      return [
        v.venue_name, v.slug, v.region, v.url,
        v.aeo_score, v.aeo_band,
        v.geo_score, v.geo_band,
        c?.citation_rate ?? "", c?.citation_band ?? "", c?.citation_count ?? "",
        v.aeo_components.structured_data?.score   ?? "",
        v.aeo_components.faq_qa_content?.score    ?? "",
        v.aeo_components.heading_semantic?.score  ?? "",
        v.aeo_components.internal_linking?.score  ?? "",
        v.aeo_components.page_speed_proxy?.score  ?? "",
        v.aeo_components.content_clarity?.score   ?? "",
        v.geo_components.entity_clarity?.score          ?? "",
        v.geo_components.content_chunking?.score        ?? "",
        v.geo_components.topical_completeness?.score    ?? "",
        v.geo_components.external_corroboration?.score  ?? "",
        v.geo_components.structured_data_richness?.score ?? "",
        v.geo_components.prompt_relevance?.score        ?? "",
      ].map(cell => {
        const s = String(cell);
        return s.includes(",") || s.includes('"') ? `"${s.replace(/"/g, '""')}"` : s;
      }).join(",");
    });

    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = `aeo-geo-scores-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <button
      onClick={download}
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded border border-slate-300 bg-white text-sm text-slate-600 hover:border-slate-400 hover:text-slate-900 transition-colors"
    >
      ↓ Export CSV
    </button>
  );
}
