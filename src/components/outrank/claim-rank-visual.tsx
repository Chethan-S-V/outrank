export function ClaimRankVisual() {
  return (
    <div aria-hidden="true" className="outrank-claim-visual pointer-events-none select-none">
      <span className="outrank-claim-particle outrank-claim-particle-one" />
      <span className="outrank-claim-particle outrank-claim-particle-two" />
      <span className="outrank-claim-particle outrank-claim-particle-three" />
      <svg fill="none" viewBox="0 0 360 260" className="w-full h-auto drop-shadow-[0_10px_25px_rgba(147,51,234,0.35)]">
        <defs>
          <linearGradient id="pedestal-grad" x1="100" y1="50" x2="260" y2="240" gradientUnits="userSpaceOnUse">
            <stop stopColor="#A855F7" />
            <stop offset="0.6" stopColor="#7E22CE" />
            <stop offset="1" stopColor="#3B0764" />
          </linearGradient>
          <linearGradient id="arrow-glow" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#C084FC" />
            <stop offset="1" stopColor="#6366F1" />
          </linearGradient>
        </defs>

        {/* 3D Isometric Pedestals */}
        <g opacity="0.9">
          {/* Step 3 (left, lowest) */}
          <path d="M120 180 L160 160 L160 230 L120 250 Z" fill="#6B21A8" />
          <path d="M160 160 L200 180 L200 250 L160 230 Z" fill="#581C87" />
          <path d="M120 180 L160 160 L200 180 L160 200 Z" fill="#9333EA" />

          {/* Step 2 (middle) */}
          <path d="M165 140 L210 115 L210 230 L165 250 Z" fill="#7E22CE" />
          <path d="M210 115 L255 140 L255 250 L210 230 Z" fill="#6B21A8" />
          <path d="M165 140 L210 115 L255 140 L210 165 Z" fill="#A855F7" />

          {/* Step 1 (tallest, right) */}
          <path d="M215 90 L265 60 L265 240 L215 260 Z" fill="#9333EA" />
          <path d="M265 60 L315 90 L315 260 L265 240 Z" fill="#7E22CE" />
          <path d="M215 90 L265 60 L315 90 L265 120 Z" fill="#C084FC" />
        </g>

        {/* Glowing Purple Crown on Tallest Pedestal (no SVG filter bounding box) */}
        <g transform="translate(240, 20) scale(1.15)">
          <path
            d="M5 25 L10 5 L18 17 L25 2 L32 17 L40 5 L45 25 Z"
            fill="#DDD6FE"
            stroke="#C084FC"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path d="M5 25 L45 25 L43 30 L7 30 Z" fill="#A855F7" />
          <circle cx="10" cy="5" r="2" fill="#FFFFFF" />
          <circle cx="25" cy="2" r="2.5" fill="#FFFFFF" />
          <circle cx="40" cy="5" r="2" fill="#FFFFFF" />
        </g>

        {/* Right Swooping Purple Arrow */}
        <path
          d="M260 210 Q310 170 330 110"
          stroke="url(#arrow-glow)"
          strokeWidth="6"
          strokeLinecap="round"
          fill="none"
          opacity="0.85"
        />
        <path
          d="M320 100 L335 106 L332 122"
          stroke="#C084FC"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />

        {/* Floating Sparkles */}
        <path d="M70 120 L73 110 L76 120 L86 123 L76 126 L73 136 L70 126 L60 123 Z" fill="#E9D5FF" opacity="0.7" />
        <path d="M320 60 L322 53 L324 60 L331 62 L324 64 L322 71 L320 64 L313 62 Z" fill="#E9D5FF" opacity="0.8" />
        <path d="M170 50 L171 45 L173 50 L178 51 L173 53 L171 58 L170 53 L165 51 Z" fill="#DDD6FE" opacity="0.6" />
      </svg>
    </div>
  );
}
