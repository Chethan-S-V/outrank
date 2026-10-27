"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Globe,
  MapPin,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Compass,
} from "lucide-react";

export function PlaygroundExperience() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [originLocation, setOriginLocation] = useState("Hoskote Taluk, Karnataka, India [13.0716° N, 77.7983° E]");

  useEffect(() => {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
      if (tz.includes("Kolkata") || tz.includes("Calcutta") || tz.includes("Asia")) {
        setOriginLocation("Hoskote Taluk, Karnataka, India [13.0716° N, 77.7983° E]");
      } else if (tz.includes("New_York") || tz.includes("America/New_York")) {
        setOriginLocation("New York, United States [40.7128° N, 74.0060° W]");
      } else if (tz.includes("London") || tz.includes("Europe/London")) {
        setOriginLocation("London, United Kingdom [51.5074° N, 0.1278° W]");
      } else if (tz.includes("Tokyo") || tz.includes("Asia/Tokyo")) {
        setOriginLocation("Tokyo, Japan [35.6762° N, 139.6503° E]");
      } else if (tz.includes("Europe")) {
        setOriginLocation("Central Europe [52.5200° N, 13.4050° E]");
      }
    } catch {
      // Default to Hoskote Taluk
    }
  }, []);

  const handleNotify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setIsSubscribed(true);
  };

  return (
    <div className="w-full max-w-3xl mx-auto py-12 px-4 sm:px-6">
      <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-8 sm:p-12 text-center shadow-lg space-y-6">
        {/* Status Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 text-xs font-semibold border border-purple-500/20">
          <span className="w-2 h-2 rounded-full bg-purple-500 inline-block animate-pulse" />
          <span>3D World Territory Playground · Upcoming</span>
        </div>

        {/* Clean Central Globe Icon */}
        <div className="flex justify-center">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-purple-50 dark:bg-purple-950/40 border border-purple-500/30 flex items-center justify-center text-[#7446d8] dark:text-[#a278ff] shadow-sm">
            <Globe className="w-10 h-10 sm:w-12 sm:h-12 stroke-[1.5]" />
          </div>
        </div>

        {/* Title and Description */}
        <div className="space-y-3 max-w-xl mx-auto">
          <h1 className="text-2xl sm:text-4xl font-extrabold text-[var(--text-primary)] tracking-tight">
            Global 3D Earth Territory Grid
          </h1>
          <p className="text-sm sm:text-base text-[var(--text-secondary)] leading-relaxed">
            An interactive full-Earth territory map with organic boundary expansion, pin-to-claim virtual territory, and regional visibility rankings is currently under active development.
          </p>
        </div>

        {/* Clean Origin Lock Badge */}
        <div className="max-w-md mx-auto p-3.5 rounded-2xl bg-[var(--surface-raised)] border border-[var(--border)] flex items-center justify-between text-xs text-left gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
              <MapPin className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                Origin Lock (Demonstration Region)
              </span>
              <span className="font-semibold text-[var(--text-primary)] text-xs truncate block">
                {originLocation}
              </span>
            </div>
          </div>
          <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-[10px] uppercase shrink-0">
            Locked
          </span>
        </div>

        {/* Notification form */}
        <div className="max-w-md mx-auto pt-2">
          {isSubscribed ? (
            <div className="p-3.5 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-xs font-semibold flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>Thank you. You will be notified the moment the playground launches!</span>
            </div>
          ) : (
            <form onSubmit={handleNotify} className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email to get notified on launch..."
                className="flex-1 px-4 py-2.5 rounded-xl bg-[var(--surface-raised)] border border-[var(--border)] text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-purple-500"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-[#7446d8] to-[#9333ea] hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-1.5 shrink-0"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Get Notified</span>
              </button>
            </form>
          )}

          <div className="mt-6">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-[var(--accent)] hover:underline font-semibold"
            >
              <span>Return to Live Leaderboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
