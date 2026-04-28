import Link from "next/link";
import { notFound } from "next/navigation";
import { competitors } from "@/lib/competitors";
import { generateMusicVenueSchema, generateFaqSchema } from "@/lib/schema-snippets";
import { ScoreBadge } from "@/components/ScoreBadge";
import { RadarChart } from "@/components/RadarChart";
import { RecommendationPanel } from "@/components/RecommendationPanel";
import SchemaSnippet from "@/components/SchemaSnippet";
import { AEO_LABELS, GEO_LABELS } from "@/types/venue";
import type { VenueReport } from "@/types/venue";

export function generateStaticParams() {
  return competitors.map(v => ({ slug: v.slug }));
}

export default function CompetitorDetail({ params }: { params: { slug: string } }) {
  const v = competitors.find(c => c.slug === params.slug) as VenueReport | undefined;
  if (!v) notFound();

  const aeoRadar = Object.entries(v.aeo_components).map(([k, c]) => ({
    metric: AEO_LABELS[k] ?? k,
    score: c.score,
  }));
  const geoRadar = Object.entries(v.geo_components).map(([k, c]) => ({
    metric: GEO_LABELS[k] ?? k,
    score: c.score,
  }));

  const musicVenueSchema = generateMusicVenueSchema(v);
  const faqSchema        = generateFaqSchema(v);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/benchmarking" className="text-sm text-blue-600 hover:underline">← Benchmarking</Link>
        <span className="text-slate-300">·</span>
        <span className="px-2 py-0.5 rounded bg-orange-100 text-orange-700 text-xs font-medium">Competitor</span>
      </div>

      <section className="bg-white rounded-lg border border-slate-200 p-6">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">{v.venue_name}</h1>
            <p className="text-sm text-slate-500">{v.region}</p>
            <a href={v.url} target="_blank" rel="noreferrer" className="text-xs text-blue-600 hover:underline">{v.url}</a>
          </div>
          <div className="flex gap-6">
            <ScoreBadge score={v.aeo_score} band={v.aeo_band} label="AEO score" />
            <ScoreBadge score={v.geo_score} band={v.geo_band} label="GEO score" />
          </div>
        </div>
        <p className="text-sm text-slate-700 leading-relaxed">{v.summary}</p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <RadarChart title="AEO breakdown" data={aeoRadar} color="#2563eb" />
        <RadarChart title="GEO breakdown" data={geoRadar} color="#9333ea" />
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ComponentList title="AEO components" components={v.aeo_components} labels={AEO_LABELS} />
        <ComponentList title="GEO components" components={v.geo_components} labels={GEO_LABELS} />
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <RecommendationPanel title="Strengths" items={v.strengths} accent="green" />
        <RecommendationPanel title="Weaknesses" items={v.weaknesses} accent="red" />
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-medium text-slate-900">Schema code snippets</h2>
          <p className="text-xs text-slate-500 mt-1">What this competitor should implement to reach their score ceiling.</p>
        </div>
        <SchemaSnippet title="MusicVenue schema" code={musicVenueSchema} />
        <SchemaSnippet title="FAQPage schema" code={faqSchema} />
      </section>
    </div>
  );
}

function ComponentList({
  title, components, labels,
}: {
  title: string;
  components: Record<string, { score: number; weighted: number; findings: string[] }>;
  labels: Record<string, string>;
}) {
  return (
    <div className="bg-white rounded-lg border border-slate-200 p-4">
      <h3 className="text-sm font-medium text-slate-700 mb-3">{title}</h3>
      <ul className="space-y-3">
        {Object.entries(components).map(([k, c]) => (
          <li key={k} className="border-b border-slate-100 pb-2 last:border-0">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-800">{labels[k] ?? k}</span>
              <span className={`font-mono text-sm ${c.score < 30 ? "text-red-600" : c.score < 60 ? "text-amber-600" : "text-emerald-600"}`}>
                {c.score}
              </span>
            </div>
            {c.findings.length > 0 && (
              <p className="text-xs text-slate-500 mt-1">{c.findings[0]}</p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
