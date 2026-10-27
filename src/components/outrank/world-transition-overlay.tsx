"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Globe } from "lucide-react";

type WorldTransitionOverlayProps = {
  isActive: boolean;
  onComplete: () => void;
};

export function WorldTransitionOverlay({ isActive, onComplete }: WorldTransitionOverlayProps) {
  const router = useRouter();
  const [phase, setPhase] = useState<"idle" | "revolving" | "completing">("idle");

  useEffect(() => {
    if (isActive) {
      setPhase("revolving");
      // Pre-navigate
      router.prefetch("/global");

      const navTimer = setTimeout(() => {
        router.push("/global");
      }, 700);

      const completeTimer = setTimeout(() => {
        setPhase("completing");
        onComplete();
        setPhase("idle");
      }, 1000);

      return () => {
        clearTimeout(navTimer);
        clearTimeout(completeTimer);
      };
    } else {
      setPhase("idle");
    }
  }, [isActive, router, onComplete]);

  if (!isActive && phase === "idle") return null;

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 backdrop-blur-2xl transition-opacity duration-300 pointer-events-auto"
    >
      {/* Ambient background glows */}
      <div className="absolute w-[500px] h-[500px] rounded-full bg-emerald-500/15 blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute w-[400px] h-[400px] rounded-full bg-purple-500/15 blur-[100px] pointer-events-none" />

      {/* 360 Revolving Globe Container */}
      <div className="relative flex flex-col items-center">
        {/* Revolving Ring 1 */}
        <div className="absolute -inset-6 rounded-full border border-emerald-500/30 animate-[spin_3s_linear_infinite] [border-dasharray:10_5]" />
        {/* Revolving Ring 2 (tilted) */}
        <div className="absolute -inset-10 rounded-full border border-cyan-400/20 animate-[spin_5s_linear_infinite_reverse]" style={{ transform: "rotateX(60deg)" }} />

        {/* Central 360 Revolving Globe Icon */}
        <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-gradient-to-tr from-emerald-950 via-[#131d24] to-[#1e1b4b] border-2 border-emerald-400/50 flex items-center justify-center shadow-2xl shadow-emerald-500/30 animate-[spin_1.2s_cubic-bezier(0.25,1,0.5,1)]">
          <Globe className="w-16 h-16 sm:w-20 sm:h-20 text-emerald-400 drop-shadow-[0_0_20px_rgba(52,211,153,0.8)]" />
          <div className="absolute inset-0 rounded-full bg-radial from-transparent via-emerald-400/10 to-emerald-500/30 pointer-events-none" />
        </div>

        {/* Heading & Revolving Telemetry */}
        <div className="mt-8 text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>360° Planetary Alignment</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Entering Global Country & State Leaderboard
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 font-mono">
            Loading all world countries, official flags & states...
          </p>
        </div>
      </div>
    </div>
  );
}
