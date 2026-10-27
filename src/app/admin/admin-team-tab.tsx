"use client";

import { useEffect, useState } from "react";
import {
  ShieldAlert,
  ShieldCheck,
  UserPlus,
  KeyRound,
  User,
  Mail,
  Lock,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Server,
  Sparkles,
} from "lucide-react";

interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: "super_admin" | "moderator" | "auditor";
  createdAt: string;
}

export function AdminTeamTab() {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Form state
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"super_admin" | "moderator" | "auditor">("moderator");

  async function loadAdmins() {
    try {
      const res = await fetch("/api/admin/admins");
      if (res.ok) {
        const data = await res.json();
        setAdmins(data.admins || []);
      }
    } catch {
      // Keep default
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void loadAdmins();
  }, []);

  async function handleCreateAdmin(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      const res = await fetch("/api/admin/admins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password, role }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({ type: "success", text: `Administrator account '${username}' successfully provisioned!` });
        setUsername("");
        setEmail("");
        setPassword("");
        void loadAdmins();
      } else {
        setMessage({ type: "error", text: data.error || "Failed to create administrator account." });
      }
    } catch {
      setMessage({ type: "error", text: "Network error creating administrator." });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-[#121622] via-[#10131b] to-purple-950/20 border border-purple-500/30 shadow-2xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20 mb-2 font-mono">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Sovereign Access Control &amp; RBAC</span>
            </div>
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              <span>Administrator Team &amp; Credentials Portal</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Provision secondary administrators, sovereign moderators, and financial auditors with individual cryptographic access.
            </p>
          </div>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl font-bold self-start sm:self-auto">
            {admins.length} Active System Administrators
          </span>
        </div>
      </div>

      {message && (
        <div
          className={`p-4 rounded-2xl border text-xs flex items-center gap-2.5 font-mono ${
            message.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
              : "bg-rose-500/10 border-rose-500/30 text-rose-300"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form: Provision New Admin (5 cols) */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-[#14171f] border border-white/10 shadow-xl space-y-5">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <UserPlus className="w-4 h-4 text-purple-400" />
            <span>Provision New Administrator</span>
          </div>

          <form onSubmit={handleCreateAdmin} className="space-y-4 text-xs">
            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Admin Username *
              </label>
              <div className="relative">
                <User className="w-3.5 h-3.5 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. alex.moderator"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#0d1017] border border-white/10 text-white font-mono placeholder-slate-500 focus:outline-none focus:border-purple-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Official Email Address *
              </label>
              <div className="relative">
                <Mail className="w-3.5 h-3.5 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@outrank.io"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#0d1017] border border-white/10 text-white font-mono placeholder-slate-500 focus:outline-none focus:border-purple-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Password (min 6 characters) *
              </label>
              <div className="relative">
                <Lock className="w-3.5 h-3.5 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#0d1017] border border-white/10 text-white font-mono placeholder-slate-500 focus:outline-none focus:border-purple-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Role &amp; Permissions Clearance
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
                className="w-full px-3 py-2.5 rounded-xl bg-[#0d1017] border border-white/10 text-white font-mono focus:outline-none focus:border-purple-400 cursor-pointer"
              >
                <option value="moderator">Sovereign Moderator (Products &amp; Claims)</option>
                <option value="super_admin">Super Administrator (Full System Clearance)</option>
                <option value="auditor">Financial Auditor (Read-only Ledger)</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 px-4 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:brightness-110 active:scale-98 transition-all flex items-center justify-center gap-2 shadow-lg shadow-purple-900/30 disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>Provision Credentials</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Table: Active Admin Registry (7 cols) */}
        <div className="lg:col-span-7 rounded-3xl bg-[#14171f] border border-white/10 overflow-hidden shadow-xl">
          <div className="p-4 border-b border-white/10 flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
              Active Authorized Administrators
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              PBKDF2 SHA-512 Hashed
            </span>
          </div>

          {loading ? (
            <div className="py-12 text-center text-xs text-slate-400 font-mono flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-purple-400" />
              <span>Loading administrator registry...</span>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-[#101218] text-slate-400 text-[10px] uppercase border-b border-white/5">
                  <tr>
                    <th className="py-3 px-4">Admin Account</th>
                    <th className="py-3 px-4">Role Clearance</th>
                    <th className="py-3 px-4">Created Date</th>
                    <th className="py-3 px-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {admins.map((adm) => (
                    <tr key={adm.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="py-3.5 px-4 font-bold text-white">
                        <div className="flex items-center gap-2">
                          <User className="w-3.5 h-3.5 text-purple-400" />
                          <span>{adm.username}</span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-normal block mt-0.5">
                          {adm.email}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                            adm.role === "super_admin"
                              ? "bg-purple-500/10 text-purple-300 border-purple-500/30"
                              : adm.role === "auditor"
                              ? "bg-sky-500/10 text-sky-300 border-sky-500/30"
                              : "bg-emerald-500/10 text-emerald-300 border-emerald-500/30"
                          }`}
                        >
                          {adm.role.replace("_", " ")}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                        {new Date(adm.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          Authorized
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
