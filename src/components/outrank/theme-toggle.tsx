"use client";

import { Moon, Sun } from "lucide-react";

type ThemeMode = "dark" | "light";

function setTheme(theme: ThemeMode) {
  document.documentElement.classList.toggle("dark", theme === "dark");
  localStorage.setItem("outrank-theme", theme);
}

export function ThemeToggle() {
  return (
    <div aria-label="Color theme" className="outrank-theme-controls" role="group">
      <button
        aria-label="Switch to light theme"
        className="outrank-theme-choice outrank-theme-choice-light"
        onClick={() => setTheme("light")}
        type="button"
      >
        <Sun className="w-4 h-4 text-amber-500" aria-hidden="true" />
      </button>
      <button
        aria-label="Switch to dark theme"
        className="outrank-theme-choice outrank-theme-choice-dark"
        onClick={() => setTheme("dark")}
        type="button"
      >
        <Moon className="w-4 h-4 text-violet-300" aria-hidden="true" />
      </button>
    </div>
  );
}
