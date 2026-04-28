interface Props {
  title: string;
  items: string[];
  accent?: "red" | "amber" | "blue" | "green";
}

const accentClass: Record<NonNullable<Props["accent"]>, string> = {
  red: "border-l-4 border-red-500",
  amber: "border-l-4 border-amber-500",
  blue: "border-l-4 border-blue-500",
  green: "border-l-4 border-green-500",
};

export function RecommendationPanel({ title, items, accent = "blue" }: Props) {
  if (!items.length) return null;
  return (
    <section className={`bg-white rounded-lg p-4 ${accentClass[accent]}`}>
      <h3 className="font-medium text-slate-900 mb-3">{title}</h3>
      <ul className="space-y-2 text-sm text-slate-700">
        {items.map((item, i) => (
          <li key={i} className="leading-relaxed">{item}</li>
        ))}
      </ul>
    </section>
  );
}
