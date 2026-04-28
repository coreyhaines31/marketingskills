import Link from "next/link";
import { getActionPlan, getActionSummary } from "@/lib/actions";
import ActionPlanView from "@/components/ActionPlanView";

export default function ActionPlan() {
  const items   = getActionPlan();
  const summary = getActionSummary();

  return (
    <div className="space-y-8">
      <div>
        <Link href="/" className="text-sm text-blue-600 hover:underline">← Portfolio overview</Link>
        <h1 className="text-2xl font-semibold text-slate-900 mt-3">Priority Action Plan</h1>
        <p className="text-sm text-slate-500 mt-1">
          {items.length} fix types across the 20-venue portfolio, ranked by estimated AEO impact.
          Implement in order to close the competitor gap as efficiently as possible.
        </p>
      </div>

      {/* Summary stat cards */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <SummaryCard
          label="Fix instances"
          value={summary.totalFixInstances}
          sub="total across portfolio"
          color="slate"
        />
        <SummaryCard
          label="Critical fixes"
          value={summary.criticalFixInstances}
          sub={`${summary.venuesWithCritical} venues affected`}
          color="red"
        />
        <SummaryCard
          label="Est. AEO uplift"
          value={`+${summary.estimatedAeoUplift}`}
          sub="pts if all fixes applied"
          color="indigo"
        />
        <SummaryCard
          label="Est. GEO uplift"
          value={`+${summary.estimatedGeoUplift}`}
          sub="pts if all fixes applied"
          color="emerald"
        />
      </section>

      <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 text-sm text-blue-800">
        <strong>How to use this:</strong> Work through fixes top-to-bottom.{" "}
        Click <em>▼ show</em> on any row to see affected venues and link directly to their detail pages.
        Critical fixes deliver the highest per-venue AEO gain; complete these across all affected venues
        before moving to High or Medium priority items.
      </div>

      <ActionPlanView items={items} />
    </div>
  );
}

function SummaryCard({
  label, value, sub, color,
}: {
  label: string;
  value: string | number;
  sub: string;
  color: "slate" | "red" | "indigo" | "emerald";
}) {
  const styles = {
    slate:   { card: "bg-white border-slate-200",     value: "text-slate-900" },
    red:     { card: "bg-red-50 border-red-200",       value: "text-red-700"   },
    indigo:  { card: "bg-indigo-50 border-indigo-200", value: "text-indigo-700"},
    emerald: { card: "bg-emerald-50 border-emerald-200", value: "text-emerald-700" },
  }[color];

  return (
    <div className={`rounded-lg border p-4 ${styles.card}`}>
      <p className="text-xs text-slate-500 uppercase tracking-wide">{label}</p>
      <p className={`text-3xl font-bold mt-1 ${styles.value}`}>{value}</p>
      <p className="text-xs text-slate-400 mt-1">{sub}</p>
    </div>
  );
}
