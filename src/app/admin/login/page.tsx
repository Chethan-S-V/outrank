"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  ShieldAlert,
  Lock,
  KeyRound,
  User,
  AlertCircle,
  Loader2,
  Terminal,
  Activity,
  ArrowRight,
  Sparkles,
  Server,
  Globe2,
} from "lucide-react";

export default function AdminLoginPage() {
  const [authMode, setAuthMode] = useState<"credentials" | "secret">("credentials");
  const [secret, setSecret] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const payload =
        authMode === "secret"
          ? { secret: secret.trim() }
          : { username: username.trim(), password };

      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        router.push("/admin");
        router.refresh();
      } else {
        setError(data.error || "Access denied. Invalid credentials.");
      }
    } catch {
      setError("Network or connection error occurred.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen w-full bg-[#0b0d11] text-slate-100 flex flex-col justify-between p-4 sm:p-8 relative overflow-hidden select-none">
      {/* Background Cybernetic Grid & Ambient Radar Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-25 pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-tr from-sky-500/10 via-purple-500/10 to-indigo-500/10 blur-[120px] pointer-events-none" />

      {/* Top System Security Bar */}
      <header className="relative z-10 max-w-5xl mx-auto w-full flex items-center justify-between text-xs py-2 px-4 rounded-2xl bg-[#14171f]/80 backdrop-blur-md border border-white/5">
        <div className="flex items-center gap-2 font-mono">
          <Terminal className="w-4 h-4 text-[#38bdf8]" />
          <span className="font-extrabold text-white tracking-wide">OUTRANK // SOVEREIGN SECURITY</span>
          <span className="text-[10px] text-slate-500">v2.4.0-PROD</span>
        </div>

        <div className="flex items-center gap-4 text-[11px] font-mono">
          <span className="hidden sm:flex items-center gap-1.5 text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            CLEARANCE LVL 4
          </span>
          <span className="text-slate-400">ENCRYPTION: AES-256</span>
        </div>
      </header>

      {/* Center Authentication Console Terminal */}
      <div className="relative z-10 w-full max-w-md mx-auto my-auto py-8">
        <div className="rounded-3xl bg-[#13161e]/90 backdrop-blur-xl border border-white/10 p-6 sm:p-8 shadow-2xl relative space-y-6">
          {/* Header Icon & Title */}
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-500/20 via-purple-500/20 to-indigo-500/20 border border-[#38bdf8]/30 flex items-center justify-center mx-auto shadow-lg shadow-sky-500/10">
              <ShieldAlert className="w-7 h-7 text-[#38bdf8]" />
            </div>

            <div>
              <h1 className="text-2xl font-black text-white tracking-tight">
                Command Terminal Login
              </h1>
              <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
                Restricted portal for Outrank territorial management, product moderation, and financial telemetry.
              </p>
            </div>
          </div>

          {/* Auth Mode Capsule Switcher */}
          <div className="grid grid-cols-2 p-1 rounded-2xl bg-[#1a1e28] border border-white/5 text-xs font-bold">
            <button
              type="button"
              onClick={() => {
                setAuthMode("credentials");
                setError("");
              }}
              className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                authMode === "credentials"
                  ? "bg-[#38bdf8] text-slate-950 shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Admin Account</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMode("secret");
                setError("");
              }}
              className={`py-2 rounded-xl transition-all flex items-center justify-center gap-1.5 ${
                authMode === "secret"
                  ? "bg-[#38bdf8] text-slate-950 shadow-md"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Master Key</span>
            </button>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="p-3 rounded-2xl border border-rose-500/30 bg-rose-500/10 text-rose-400 text-xs flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {authMode === "secret" ? (
              <div>
                <label
                  htmlFor="admin-secret"
                  className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-300 mb-1.5"
                >
                  Master Secret Key
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    id="admin-secret"
                    type="password"
                    required
                    value={secret}
                    onChange={(e) => setSecret(e.target.value)}
                    placeholder="Enter cryptographic master key..."
                    className="w-full pl-10 pr-4 py-3 rounded-2xl border border-white/10 bg-[#191d26] text-sm text-white font-mono placeholder-slate-500 focus:border-[#38bdf8] focus:outline-none transition-colors"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div>
                  <label
                    htmlFor="admin-username"
                    className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-300 mb-1.5"
                  >
                    Admin Username / Email
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                    <input
                      id="admin-username"
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="e.g. security@outrank.io"
                      className="w-full pl-10 pr-4 py-3 rounded-2xl border border-white/10 bg-[#191d26] text-sm text-white font-mono placeholder-slate-500 focus:border-[#38bdf8] focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="admin-password"
                    className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-300 mb-1.5"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
                    <input
                      id="admin-password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full pl-10 pr-4 py-3 rounded-2xl border border-white/10 bg-[#191d26] text-sm text-white font-mono placeholder-slate-500 focus:border-[#38bdf8] focus:outline-none transition-colors"
                    />
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-2xl font-bold text-xs text-slate-950 bg-gradient-to-r from-[#38bdf8] to-[#7dd3fc] hover:brightness-110 active:scale-98 shadow-xl shadow-sky-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
              ) : (
                <>
                  <span>Authorize &amp; Enter Console</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>

      {/* Bottom Telemetry Status Strip */}
      <footer className="relative z-10 max-w-5xl mx-auto w-full flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 font-mono py-2 px-4 rounded-2xl bg-[#14171f]/80 backdrop-blur-md border border-white/5 gap-2">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-slate-400">
            <Server className="w-3.5 h-3.5 text-sky-400" />
            <span>POSTGRESQL // DRIZZLE LIVE</span>
          </span>
          <span className="flex items-center gap-1.5 text-slate-400">
            <Globe2 className="w-3.5 h-3.5 text-purple-400" />
            <span>360° GEOSPATIAL EARTH READY</span>
          </span>
        </div>

        <div>
          <span>SECURE ACCESS PORTAL · 24-HOUR CRYPTO TOKEN</span>
        </div>
      </footer>
    </main>
  );
}
