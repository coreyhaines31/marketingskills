import { citationBandBg } from "@/lib/citations";

interface Props {
  rate: number;
  band: string;
  count: number;
  total: number;
  compact?: boolean;
}

export default function CitationBar({ rate, band, count, total, compact = false }: Props) {
  const fillColor: Record<string, string> = {
    strong:   "bg-emerald-500",
    good:     "bg-blue-500",
    moderate: "bg-amber-400",
    weak:     "bg-orange-400",
    critical: "bg-red-400",
  };
  const fill = fillColor[band] ?? "bg-slate-400";

  if (compact) {
    return (
      <div className="flex items-center gap-2 min-w-[120px]">
        <div className="flex-1 h-1.5 rounded-full bg-slate-100 overflow-hidden">
          <div className={`h-full rounded-full ${fill}`} style={{ width: `${rate}%` }} />
        </div>
        <span className="text-xs font-mono text-slate-600 w-8 text-right">{rate}%</span>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>{count}/{total} prompts</span>
        <span className={`px-1.5 py-0.5 rounded text-xs font-medium ${citationBandBg(band)}`}>
          {band}
        </span>
      </div>
      <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
        <div className={`h-full rounded-full ${fill} transition-all`} style={{ width: `${rate}%` }} />
      </div>
      <p className="text-xs font-mono text-slate-700">{rate}% citation rate</p>
    </div>
  );
}
