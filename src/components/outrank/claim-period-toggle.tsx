import { Trophy } from "lucide-react";

export type ClaimPeriod = "all-time" | "today";

type ClaimPeriodToggleProps = {
  period: ClaimPeriod;
  onChange: (period: ClaimPeriod) => void;
};

export function ClaimPeriodToggle({ period, onChange }: ClaimPeriodToggleProps) {
  return (
    <div aria-label="Claim period" className="inline-flex items-center p-1 rounded-full bg-purple-100/90 dark:bg-[#160f33]/90 border border-purple-300 dark:border-purple-500/30 gap-1 select-none shadow-xs" role="group">
      <button
        aria-pressed={period === "all-time"}
        className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
          period === "all-time"
            ? "text-white bg-gradient-to-r from-[#7c3aed] to-[#9333ea] shadow-[0_2px_10px_rgba(147,51,234,0.35)]"
            : "text-purple-700 hover:text-purple-950 dark:text-purple-200/60 dark:hover:text-purple-100"
        }`}
        onClick={() => onChange("all-time")}
        type="button"
      >
        <Trophy className={`w-3.5 h-3.5 ${period === "all-time" ? "text-white" : "text-purple-600 dark:text-purple-300"}`} aria-hidden="true" />
        <span>All-time</span>
      </button>
      <button
        aria-pressed={period === "today"}
        className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
          period === "today"
            ? "text-white bg-gradient-to-r from-[#7c3aed] to-[#9333ea] shadow-[0_2px_10px_rgba(147,51,234,0.35)]"
            : "text-purple-700 hover:text-purple-950 dark:text-purple-200/60 dark:hover:text-purple-100"
        }`}
        onClick={() => onChange("today")}
        type="button"
      >
        <span aria-hidden="true" className={`w-1.5 h-1.5 rounded-full ${period === "today" ? "bg-white" : "bg-purple-600 dark:bg-purple-400"}`} />
        <span>Today</span>
      </button>
    </div>
  );
}
