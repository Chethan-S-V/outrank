type StatCardProps = { icon: "categories" | "products" | "supporters" | "visitors"; label: string; value: number | null };

export function StatCard({ icon, label, value }: StatCardProps) {
  const iconText = icon === "products" ? "□" : icon === "categories" ? "▦" : icon === "supporters" ? "♡" : "◉";

  const formattedValue = value === null ? "—" : new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 }).format(value);

  return <div className="outrank-stat-card"><span aria-hidden="true" className="outrank-stat-icon">{iconText}</span><strong>{formattedValue}</strong><span>{label}</span></div>;
}
