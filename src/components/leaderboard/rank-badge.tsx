export function RankBadge({ rank }: { rank: number }) {
  const emphasis = rank === 1 ? "border-[var(--accent)] bg-[var(--accent)] text-[#1a100d]" : rank === 2 ? "border-[#c9b29d] bg-[#c9b29d]/15 text-[#e9d6c5]" : rank === 3 ? "border-[#9e754f] bg-[#9e754f]/15 text-[#dcb18b]" : "border-[var(--border)] bg-[var(--surface-raised)] text-[var(--text-secondary)]";
  return <span className={`grid h-9 min-w-9 place-items-center border text-xs font-bold ${emphasis}`}>#{rank}</span>;
}
