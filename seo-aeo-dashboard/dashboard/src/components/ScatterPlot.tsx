"use client";

import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
  Label,
} from "recharts";
import type { PlotPoint } from "@/lib/competitors";

interface Props {
  data: PlotPoint[];
}

const PORTFOLIO_COLOR  = "#3b82f6"; // blue-500
const COMPETITOR_COLOR = "#f97316"; // orange-500

function CustomTooltip({ active, payload }: { active?: boolean; payload?: { payload: PlotPoint }[] }) {
  if (!active || !payload?.length) return null;
  const p = payload[0].payload;
  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-xs shadow-lg">
      <p className="font-semibold text-white mb-1">{p.name}</p>
      <p className="text-gray-400">{p.region}</p>
      <div className="flex gap-3 mt-1">
        <span className="text-indigo-400">AEO {p.aeo}</span>
        <span className="text-emerald-400">GEO {p.geo}</span>
      </div>
      <p className={`mt-1 ${p.type === "portfolio" ? "text-blue-400" : "text-orange-400"}`}>
        {p.type === "portfolio" ? "O2 / AMG portfolio" : "Competitor"}
      </p>
    </div>
  );
}

export default function ScatterPlot({ data }: Props) {
  const portfolioData  = data.filter(d => d.type === "portfolio");
  const competitorData = data.filter(d => d.type === "competitor");

  return (
    <ResponsiveContainer width="100%" height={420}>
      <ScatterChart margin={{ top: 16, right: 24, bottom: 32, left: 24 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
        <XAxis
          type="number"
          dataKey="aeo"
          domain={[0, 100]}
          tick={{ fill: "#9ca3af", fontSize: 12 }}
          tickLine={false}
          axisLine={{ stroke: "#374151" }}
          name="AEO score"
        >
          <Label value="AEO score →" position="insideBottom" offset={-16} fill="#6b7280" fontSize={12} />
        </XAxis>
        <YAxis
          type="number"
          dataKey="geo"
          domain={[0, 100]}
          tick={{ fill: "#9ca3af", fontSize: 12 }}
          tickLine={false}
          axisLine={false}
          width={36}
          name="GEO score"
        >
          <Label value="GEO score" angle={-90} position="insideLeft" offset={16} fill="#6b7280" fontSize={12} />
        </YAxis>
        <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: "3 3" }} />
        <Legend
          verticalAlign="top"
          align="right"
          wrapperStyle={{ fontSize: 12, paddingBottom: 8 }}
          formatter={(value) => (
            <span style={{ color: "#d1d5db" }}>{value}</span>
          )}
        />

        {/* Quadrant reference lines */}
        <ReferenceLine x={50} stroke="#374151" strokeDasharray="4 4" />
        <ReferenceLine y={50} stroke="#374151" strokeDasharray="4 4" />

        <Scatter
          name="O2 / AMG portfolio"
          data={portfolioData}
          fill={PORTFOLIO_COLOR}
          opacity={0.8}
          r={6}
        />
        <Scatter
          name="Competitor"
          data={competitorData}
          fill={COMPETITOR_COLOR}
          opacity={0.85}
          r={7}
        />
      </ScatterChart>
    </ResponsiveContainer>
  );
}
