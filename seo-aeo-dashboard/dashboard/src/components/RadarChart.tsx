"use client";

import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart as RC, ResponsiveContainer } from "recharts";

export interface RadarPoint {
  metric: string;
  score: number;
}

export function RadarChart({ data, color = "#2563eb", title }: { data: RadarPoint[]; color?: string; title: string }) {
  return (
    <div className="bg-white rounded-lg border border-slate-200 p-4">
      <h3 className="text-sm font-medium text-slate-700 mb-2">{title}</h3>
      <div style={{ height: 280 }}>
        <ResponsiveContainer width="100%" height="100%">
          <RC data={data} outerRadius="75%">
            <PolarGrid stroke="#e2e8f0" />
            <PolarAngleAxis dataKey="metric" tick={{ fill: "#475569", fontSize: 11 }} />
            <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: "#94a3b8", fontSize: 10 }} />
            <Radar dataKey="score" stroke={color} fill={color} fillOpacity={0.35} />
          </RC>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
