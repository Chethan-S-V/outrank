import { OutrankMark } from "./outrank-mark";

export function OutrankLogo({ compact = false }: { compact?: boolean }) {
  return (
    <span className="flex items-center gap-2.5 text-[var(--text-primary)]">
      <span className="grid h-8 w-8 place-items-center border border-[var(--accent)]/45 bg-[var(--accent)]/10 text-[var(--accent)]">
        <OutrankMark className="h-6 w-6" />
      </span>
      {compact ? null : <span className="text-base font-semibold tracking-[0.01em]">Outrank</span>}
    </span>
  );
}
