import Link from "next/link";

export function SidebarRisingVisual() {
  return (
    <div className="outrank-sidebar-rising border border-[var(--border)] rounded-2xl bg-gradient-to-b from-purple-50/60 to-white dark:from-purple-950/20 dark:to-[var(--surface)] p-3 overflow-hidden shadow-sm">
      <div className="relative w-full h-24 mb-2 flex items-center justify-center">
        <svg fill="none" viewBox="0 0 160 100" className="w-full h-full drop-shadow-[0_4px_12px_rgba(116,70,216,0.25)]">
          <defs>
            <linearGradient id="side-rising-grad" x1="20" y1="20" x2="140" y2="90" gradientUnits="userSpaceOnUse">
              <stop stopColor="#A855F7" />
              <stop offset="1" stopColor="#6D28D9" />
            </linearGradient>
          </defs>

          {/* 3D Isometric Steps */}
          <path d="M30 65 L50 55 L50 90 L30 100 Z" fill="#7E22CE" />
          <path d="M50 55 L70 65 L70 100 L50 90 Z" fill="#6B21A8" />
          <path d="M30 65 L50 55 L70 65 L50 75 Z" fill="#9333EA" />

          <path d="M60 45 L85 32 L85 90 L60 103 Z" fill="#9333EA" />
          <path d="M85 32 L110 45 L110 103 L85 90 Z" fill="#7E22CE" />
          <path d="M60 45 L85 32 L110 45 L85 58 Z" fill="#A855F7" />

          <path d="M95 25 L125 10 L125 90 L95 105 Z" fill="#A855F7" />
          <path d="M125 10 L155 25 L155 105 L125 90 Z" fill="#9333EA" />
          <path d="M95 25 L125 10 L155 25 L125 40 Z" fill="#C084FC" />

          {/* Glowing Crown on Top */}
          <g transform="translate(112, -4) scale(0.65)">
            <path
              d="M5 25 L10 5 L18 17 L25 2 L32 17 L40 5 L45 25 Z"
              fill="#DDD6FE"
              stroke="#A855F7"
              strokeWidth="1.5"
            />
            <circle cx="10" cy="5" r="2.5" fill="#FFFFFF" />
            <circle cx="25" cy="2" r="3" fill="#FFFFFF" />
            <circle cx="40" cy="5" r="2.5" fill="#FFFFFF" />
          </g>
        </svg>
      </div>

      <Link
        href="/daily"
        className="outrank-sidebar-rising-cta flex items-center justify-between px-3 py-2 rounded-xl bg-white dark:bg-[var(--surface-raised)] border border-[var(--border)] hover:border-[#7446d8] transition-colors"
      >
        <span className="text-xs font-semibold text-[var(--text-primary)]">
          Discover what&apos;s rising.
        </span>
        <span className="w-6 h-6 rounded-full bg-[#7446d8] text-white flex items-center justify-center text-xs font-bold shrink-0">
          ↑
        </span>
      </Link>
    </div>
  );
}
