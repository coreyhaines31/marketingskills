"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { bandColor, regions } from "@/lib/data";
import { getAllCitations, citationBandBg } from "@/lib/citations";
import CitationBar from "@/components/CitationBar";
import type { VenueReport } from "@/types/venue";

const citations = getAllCitations();

export function VenueTable({ venues }: { venues: VenueReport[] }) {
  const [region, setRegion] = useState<string>("All");
  const [minScore, setMinScore] = useState<number>(0);

  const rows = useMemo(() => {
    return venues
      .filter(v => region === "All" || v.region === region)
      .filter(v => Math.min(v.aeo_score, v.geo_score) >= minScore)
      .sort((a, b) => b.aeo_score + b.geo_score - (a.aeo_score + a.geo_score));
  }, [venues, region, minScore]);

  return (
    <div>
      <div className="flex flex-wrap gap-4 mb-4 items-end">
        <div>
          <label className="block text-xs text-slate-500 mb-1">Region</label>
          <select
            value={region}
            onChange={e => setRegion(e.target.value)}
            className="border border-slate-300 rounded px-2 py-1 text-sm bg-white"
          >
            <option value="All">All regions</option>
            {regions.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs text-slate-500 mb-1">Min combined score: {minScore}</label>
          <input
            type="range"
            min={0}
            max={100}
            value={minScore}
            onChange={e => setMinScore(Number(e.target.value))}
            className="w-48"
          />
        </div>
        <div className="text-xs text-slate-500 ml-auto">{rows.length} venues</div>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg border border-slate-200">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <th className="text-left px-4 py-3 font-medium">Venue</th>
              <th className="text-left px-4 py-3 font-medium">Region</th>
              <th className="text-right px-4 py-3 font-medium">AEO</th>
              <th className="text-right px-4 py-3 font-medium">GEO</th>
              <th className="text-left px-4 py-3 font-medium">LLM citation</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {rows.map(v => {
              const c = citations[v.slug];
              return (
                <tr key={v.slug} className="border-t border-slate-100 hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-900">{v.venue_name}</td>
                  <td className="px-4 py-3 text-slate-600">{v.region}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex items-center gap-2">
                      <span className="font-mono">{v.aeo_score.toFixed(1)}</span>
                      <span className={`px-1.5 py-0.5 rounded text-xs ${bandColor[v.aeo_band]}`}>{v.aeo_band}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex items-center gap-2">
                      <span className="font-mono">{v.geo_score.toFixed(1)}</span>
                      <span className={`px-1.5 py-0.5 rounded text-xs ${bandColor[v.geo_band]}`}>{v.geo_band}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {c ? (
                      <CitationBar
                        rate={c.citation_rate}
                        band={c.citation_band}
                        count={c.citation_count}
                        total={12}
                        compact
                      />
                    ) : (
                      <span className="text-xs text-slate-400">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/venue/${v.slug}`} className="text-blue-600 hover:underline text-xs">
                      Details →
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
