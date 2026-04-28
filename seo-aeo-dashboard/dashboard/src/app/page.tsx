import Link from "next/link";
import { averages, topOpportunities, venues } from "@/lib/data";
import { getAllCitations } from "@/lib/citations";
import { ScoreBadge } from "@/components/ScoreBadge";
import { VenueTable } from "@/components/VenueTable";
import ExportButton from "@/components/ExportButton";
import { AEO_LABELS, GEO_LABELS } from "@/types/venue";

export default function OverviewPage() {
  const aeoBand   = bandFor(averages.aeo);
  const geoBand   = bandFor(averages.geo);
  const citations = getAllCitations();

  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-2xl font-semibold text-slate-900 mb-1">Portfolio Overview</h1>
        <p className="text-sm text-slate-600">{venues.length} UK music venues — average scores across the portfolio.</p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <ScoreBadge score={averages.aeo} band={aeoBand} label="Avg. AEO score" />
          <p className="text-xs text-slate-500 mt-3">Answer Engine Optimisation — readiness for featured snippets, voice search.</p>
        </div>
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <ScoreBadge score={averages.geo} band={geoBand} label="Avg. GEO score" />
          <p className="text-xs text-slate-500 mt-3">Generative Engine Optimisation — likelihood of LLM citation.</p>
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-slate-900">Venue comparison</h2>
          <ExportButton venues={venues} citations={citations} />
        </div>
        <VenueTable venues={venues} />
      </section>

      <section>
        <h2 className="text-lg font-medium text-slate-900 mb-4">Top opportunities</h2>
        <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="text-left px-4 py-2 font-medium">Venue</th>
                <th className="text-left px-4 py-2 font-medium">Component</th>
                <th className="text-left px-4 py-2 font-medium">Type</th>
                <th className="text-right px-4 py-2 font-medium">Score</th>
              </tr>
            </thead>
            <tbody>
              {topOpportunities.map((o, i) => (
                <tr key={i} className="border-t border-slate-100">
                  <td className="px-4 py-2">
                    <Link href={`/venue/${o.slug}`} className="text-blue-600 hover:underline">{o.venue}</Link>
                  </td>
                  <td className="px-4 py-2 text-slate-700">
                    {(o.type === "AEO" ? AEO_LABELS : GEO_LABELS)[o.component] ?? o.component}
                  </td>
                  <td className="px-4 py-2 text-slate-600">{o.type}</td>
                  <td className="px-4 py-2 text-right font-mono text-red-600">{o.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function bandFor(n: number): "critical" | "weak" | "moderate" | "good" | "strong" {
  if (n < 30) return "critical";
  if (n < 50) return "weak";
  if (n < 70) return "moderate";
  if (n < 85) return "good";
  return "strong";
}
