type OutrankMarkProps = {
  className?: string;
};

export function OutrankMark({ className = "h-8 w-8" }: OutrankMarkProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 36 36"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="outrank-logo-grad" x1="4" y1="32" x2="32" y2="4" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6366f1" />
          <stop offset="0.5" stopColor="#8b5cf6" />
          <stop offset="1" stopColor="#a855f7" />
        </linearGradient>
      </defs>
      <path
        d="M6 28L15 19L21 25L32 10"
        stroke="url(#outrank-logo-grad)"
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M23 10H32V19"
        stroke="url(#outrank-logo-grad)"
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
