"use client";

import { useEffect, useState } from "react";

export function PlatformStatus() {
  const [onlineCount, setOnlineCount] = useState<number>(1);
  const [visitorsToday, setVisitorsToday] = useState<number>(1);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
    const tabId = "tab_" + Math.random().toString(36).slice(2, 9);
    const now = new Date();
    const dateKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
    const dailyKey = `outrank_real_visitors_${dateKey}`;
    const sessionKey = `outrank_visited_session_${dateKey}`;

    // 1. Real Daily Visitors Tracking
    try {
      const alreadyCountedInSession = sessionStorage.getItem(sessionKey);
      let count = parseInt(localStorage.getItem(dailyKey) || "0", 10);

      if (!alreadyCountedInSession) {
        count += 1;
        localStorage.setItem(dailyKey, String(count));
        sessionStorage.setItem(sessionKey, "true");
      }
      setVisitorsToday(Math.max(1, count));
    } catch {
      setVisitorsToday(1);
    }

    // 2. Real Live Online Heartbeat Tracking across tabs & windows
    const HEARTBEAT_KEY = "outrank_live_tab_heartbeats";
    const HEARTBEAT_WINDOW_MS = 8000;

    function recordHeartbeat() {
      try {
        const raw = localStorage.getItem(HEARTBEAT_KEY);
        const map: Record<string, number> = raw ? JSON.parse(raw) : {};
        const currentTime = Date.now();

        // Update current tab timestamp
        map[tabId] = currentTime;

        // Prune stale heartbeats older than 8s
        const active: Record<string, number> = {};
        for (const [id, timestamp] of Object.entries(map)) {
          if (currentTime - timestamp < HEARTBEAT_WINDOW_MS) {
            active[id] = timestamp;
          }
        }

        localStorage.setItem(HEARTBEAT_KEY, JSON.stringify(active));
        const activeTabs = Object.keys(active).length;
        setOnlineCount(Math.max(1, activeTabs));
      } catch {
        setOnlineCount(1);
      }
    }

    recordHeartbeat();
    const interval = setInterval(recordHeartbeat, 3000);

    const handleUnload = () => {
      try {
        const raw = localStorage.getItem(HEARTBEAT_KEY);
        if (raw) {
          const map: Record<string, number> = JSON.parse(raw);
          delete map[tabId];
          localStorage.setItem(HEARTBEAT_KEY, JSON.stringify(map));
        }
      } catch {}
    };

    window.addEventListener("beforeunload", handleUnload);

    return () => {
      clearInterval(interval);
      window.removeEventListener("beforeunload", handleUnload);
      handleUnload();
    };
  }, []);

  return (
    <div className="outrank-platform-status flex items-center gap-1.5 text-[11px] font-medium text-[var(--text-muted)] whitespace-nowrap">
      <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block" />
        <span>{mounted ? onlineCount : 1} online</span>
      </span>
      <span className="text-[var(--border-strong)]">·</span>
      <span>{mounted ? visitorsToday.toLocaleString() : 1} visitor{visitorsToday === 1 ? "" : "s"} today</span>
    </div>
  );
}
