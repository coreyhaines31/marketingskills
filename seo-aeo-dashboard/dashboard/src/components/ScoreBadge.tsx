import { bandColor } from "@/lib/data";
import type { Band } from "@/types/venue";

export function ScoreBadge({ score, band, label }: { score: number; band: Band; label: string }) {
  return (
    <div className="flex flex-col items-start gap-1">
      <span className="text-xs uppercase tracking-wide text-slate-500">{label}</span>
      <div className="flex items-center gap-2">
        <span className="text-3xl font-semibold text-slate-900">{score.toFixed(1)}</span>
        <span className={`px-2 py-0.5 rounded text-xs font-medium ${bandColor[band]}`}>{band}</span>
      </div>
    </div>
  );
}
