"use client";

type VerifiedBadgeProps = {
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
  showText?: boolean;
};

export function VerifiedBadge({
  size = "sm",
  className = "",
  showText = false,
}: VerifiedBadgeProps) {
  const sizeMap = {
    xs: { icon: "w-3.5 h-3.5", box: "w-3.5 h-3.5", text: "text-[10px]" },
    sm: { icon: "w-4 h-4", box: "w-4 h-4", text: "text-xs" },
    md: { icon: "w-5 h-5", box: "w-5 h-5", text: "text-xs" },
    lg: { icon: "w-6 h-6", box: "w-6 h-6", text: "text-sm" },
  };

  const dimensions = sizeMap[size] || sizeMap.sm;

  return (
    <span
      aria-label="Verified Sovereign Identity"
      title="Outrank Verified: Authenticated Creator / Product Identity"
      className={`inline-flex items-center gap-1.5 shrink-0 align-middle ${className}`}
    >
      {/* Sleek Scalloped Seal with Modern Gradient */}
      <svg
        className={`${dimensions.icon} drop-shadow-[0_1px_4px_rgba(147,51,234,0.4)] transition-transform hover:scale-110`}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="verified-grad" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
            <stop stopColor="#38bdf8" />
            <stop offset="0.45" stopColor="#818cf8" />
            <stop offset="1" stopColor="#a855f7" />
          </linearGradient>
        </defs>
        {/* 12-point scalloped verified badge */}
        <path
          d="M12 2L14.39 4.39L17.77 4.13L18.89 7.33L22 8.76L21.46 12.14L23.23 15.02L20.5 17.06L20.24 20.44L17.04 21.56L15.61 24.67L12.23 24.13L9.35 25.9L7.31 23.17L3.93 22.91L2.81 19.71L-0.3 18.28L0.24 14.9L-1.53 12.02L1.2 9.98L1.46 6.6L4.66 5.48L6.09 2.37L9.47 2.91L12 2Z"
          transform="scale(0.85) translate(2, 2)"
          fill="url(#verified-grad)"
        />
        {/* Crisp checkmark */}
        <path
          d="M9 12.5L11.2 14.7L15.5 9.5"
          stroke="white"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {showText && (
        <span className={`font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-indigo-400 to-purple-400 ${dimensions.text}`}>
          Verified
        </span>
      )}
    </span>
  );
}
