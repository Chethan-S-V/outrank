"use client";

import { useState, useEffect } from "react";
import {
  Mail,
  Send,
  Building,
  Users,
  Copy,
  Check,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  Search,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export type InvitationRow = {
  id: string;
  email: string;
  name: string;
  type: string;
  websiteUrl: string | null;
  categorySlug: string | null;
  inviteCode: string;
  status: string;
  personalNote: string | null;
  sentAt: Date | string;
};

const CATEGORY_OPTIONS = [
  { slug: "coding-dev-tools", name: "Coding & Developer Tools" },
  { slug: "ott-streaming", name: "OTT & Streaming Platforms" },
  { slug: "social-media", name: "Social Media & Creators" },
  { slug: "ai-agents", name: "AI & Autonomous Agents" },
  { slug: "productivity", name: "Productivity & SaaS" },
  { slug: "gaming-esports", name: "Gaming & Esports" },
  { slug: "fintech-banking", name: "Fintech & Banking" },
  { slug: "ecommerce-retail", name: "E-Commerce & Retail" },
  { slug: "education-edtech", name: "Education & EdTech" },
  { slug: "design", name: "Design & Creative" },
  { slug: "crypto-web3", name: "Crypto, DeFi & Web3" },
  { slug: "cybersecurity", name: "Cybersecurity & Privacy" },
  { slug: "news-media", name: "News, Media & Podcasts" },
  { slug: "health-fitness", name: "Health & Fitness" },
  { slug: "mobile-apps", name: "Mobile & Desktop Apps" },
  { slug: "hardware-iot", name: "Hardware & IoT" },
  { slug: "marketing", name: "Marketing & Growth" },
  { slug: "other", name: "Other Platforms" },
];

export function AdminInvitationsTab() {
  const [invitations, setInvitations] = useState<InvitationRow[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [searchFilter, setSearchFilter] = useState("");

  // Form State
  const [targetType, setTargetType] = useState<"company" | "creator">("company");
  const [mode, setMode] = useState<"single" | "bulk">("single");

  // Single mode state
  const [singleName, setSingleName] = useState("");
  const [singleEmail, setSingleEmail] = useState("");
  const [singleWebsite, setSingleWebsite] = useState("");
  const [singleCategory, setSingleCategory] = useState("coding-dev-tools");
  const [singleNote, setSingleNote] = useState("");

  // Bulk mode state
  const [bulkList, setBulkList] = useState("");
  const [bulkCategory, setBulkCategory] = useState("coding-dev-tools");

  // Copy tracking state
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Load existing invitations
  async function loadInvitations() {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/invitations");
      if (res.ok) {
        const data = await res.json();
        setInvitations(data.invitations || []);
      }
    } catch {
      // Graceful
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadInvitations();
  }, []);

  // When domain is typed, provide suggested corporate email addresses
  const domainSuggestions =
    targetType === "company" && singleWebsite && singleWebsite.includes(".")
      ? (() => {
          try {
            const clean = singleWebsite.replace(/^(https?:\/\/)?(www\.)?/, "").replace(/\/.*$/, "");
            return [`partners@${clean}`, `team@${clean}`, `contact@${clean}`, `press@${clean}`];
          } catch {
            return [];
          }
        })()
      : [];

  async function handleSendSingle(e: React.FormEvent) {
    e.preventDefault();
    if (!singleEmail.trim()) {
      setFeedback("Please enter an email address.");
      return;
    }

    setIsSending(true);
    setFeedback("Dispatching official VIP invitation...");

    try {
      const res = await fetch("/api/admin/invitations/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targets: [
            {
              email: singleEmail.trim(),
              name: singleName.trim() || singleEmail.split("@")[0],
              type: targetType,
              websiteUrl: singleWebsite.trim() || undefined,
              categorySlug: singleCategory,
            },
          ],
          personalNote: singleNote.trim() || undefined,
          targetType,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setFeedback(`Official invitation sent to ${singleEmail}!`);
        setSingleName("");
        setSingleEmail("");
        setSingleWebsite("");
        setSingleNote("");
        loadInvitations();
      } else {
        setFeedback(`Error: ${data.error || "Failed to send invitation."}`);
      }
    } catch {
      setFeedback("Network error dispatching invitation.");
    } finally {
      setIsSending(false);
    }
  }

  async function handleSendBulk(e: React.FormEvent) {
    e.preventDefault();
    if (!bulkList.trim()) {
      setFeedback("Please paste at least one email address or domain.");
      return;
    }

    setIsSending(true);
    setFeedback("Processing and dispatching bulk invitations...");

    try {
      const res = await fetch("/api/admin/invitations/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bulkList: bulkList.trim(),
          targetType,
          categorySlug: bulkCategory,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setFeedback(data.message || `Dispatched ${data.sentCount} invitations!`);
        setBulkList("");
        loadInvitations();
      } else {
        setFeedback(`Error: ${data.error || "Failed to dispatch bulk invitations."}`);
      }
    } catch {
      setFeedback("Network error dispatching bulk invitations.");
    } finally {
      setIsSending(false);
    }
  }

  function handleCopyInviteLink(invite: InvitationRow) {
    const baseUrl = typeof window !== "undefined" ? window.location.origin : "https://outrank.world";
    const link = `${baseUrl}/claim/preview?websiteUrl=${encodeURIComponent(invite.websiteUrl || `https://${invite.email.split("@")[1]}`)}&name=${encodeURIComponent(invite.name)}&invite=${invite.inviteCode}`;
    navigator.clipboard.writeText(link);
    setCopiedId(invite.id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  const filteredInvites = invitations.filter((i) => {
    const q = searchFilter.toLowerCase();
    return (
      i.name.toLowerCase().includes(q) ||
      i.email.toLowerCase().includes(q) ||
      (i.websiteUrl && i.websiteUrl.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-8 animate-in fade-in">
      {/* Top Section Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-purple-950/30 via-[#14171f] to-sky-950/30 border border-white/10 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              GLOBAL OUTREACH ENGINE
            </span>
          </div>
          <h2 className="text-xl font-black text-white tracking-tight">
            Invite Leading Companies &amp; Top Creators
          </h2>
          <p className="text-xs text-slate-400 max-w-2xl">
            Dispatch personalized, official VIP invitations to company executives and viral creators.
            Recipients receive a customized VIP claim link to easily secure their sovereign rank on Outrank.
          </p>
        </div>

        {/* Target Persona Selector */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white/5 border border-white/10 shrink-0">
          <button
            type="button"
            onClick={() => setTargetType("company")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              targetType === "company"
                ? "bg-[#38bdf8] text-slate-950 shadow-md shadow-sky-500/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Building className="w-4 h-4" />
            <span>Companies &amp; Startups</span>
          </button>
          <button
            type="button"
            onClick={() => setTargetType("creator")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              targetType === "creator"
                ? "bg-purple-500 text-white shadow-md shadow-purple-500/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Creators &amp; Influencers</span>
          </button>
        </div>
      </div>

      {feedback && (
        <div className="p-3.5 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-xs text-purple-200 font-mono flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>{feedback}</span>
          </div>
          <button
            onClick={() => setFeedback("")}
            className="text-slate-400 hover:text-white text-xs cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Grid: Outreach Dispatch Form & Live Letter Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form (7 cols) */}
        <div className="lg:col-span-7 rounded-3xl bg-[#14171f] border border-white/10 p-6 sm:p-7 shadow-xl space-y-5">
          {/* Dispatch Mode Tabs */}
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#38bdf8]" />
              <h3 className="font-bold text-sm text-white">
                {targetType === "company" ? "Company Invitation" : "Creator Invitation"}
              </h3>
            </div>

            <div className="flex items-center gap-1 p-0.5 rounded-xl bg-white/5 border border-white/10 text-xs">
              <button
                type="button"
                onClick={() => setMode("single")}
                className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  mode === "single" ? "bg-white/10 text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                Single Target
              </button>
              <button
                type="button"
                onClick={() => setMode("bulk")}
                className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  mode === "bulk" ? "bg-white/10 text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                Bulk Email List
              </button>
            </div>
          </div>

          {/* Mode 1: Single Target Invitation */}
          {mode === "single" ? (
            <form onSubmit={handleSendSingle} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    {targetType === "company" ? "Company / Product Name *" : "Creator / Channel Name *"}
                  </label>
                  <input
                    type="text"
                    required
                    value={singleName}
                    onChange={(e) => setSingleName(e.target.value)}
                    placeholder={targetType === "company" ? "e.g. Linear, Netflix, Supabase" : "e.g. MKBHD, @coders.world"}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-[#38bdf8] text-xs text-white focus:outline-none font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Official Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={singleEmail}
                    onChange={(e) => setSingleEmail(e.target.value)}
                    placeholder="e.g. partners@company.com or founder@..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-[#38bdf8] text-xs text-white focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Website or Social Profile URL
                </label>
                <input
                  type="text"
                  value={singleWebsite}
                  onChange={(e) => setSingleWebsite(e.target.value)}
                  placeholder="https://company.com or instagram.com/user"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-[#38bdf8] text-xs text-white focus:outline-none font-mono"
                />

                {/* Smart Corporate Suggestions */}
                {domainSuggestions.length > 0 && !singleEmail && (
                  <div className="flex items-center gap-1.5 flex-wrap mt-2">
                    <span className="text-[10px] text-slate-500 font-mono">Suggested inboxes:</span>
                    {domainSuggestions.map((sug) => (
                      <button
                        key={sug}
                        type="button"
                        onClick={() => setSingleEmail(sug)}
                        className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/5 hover:bg-white/10 text-sky-400 border border-white/5 cursor-pointer"
                      >
                        {sug}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Target Platform Category
                </label>
                <select
                  value={singleCategory}
                  onChange={(e) => setSingleCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#101218] border border-white/10 focus:border-[#38bdf8] text-xs text-white focus:outline-none font-semibold cursor-pointer"
                >
                  {CATEGORY_OPTIONS.map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Custom VIP Note (Optional)
                </label>
                <textarea
                  rows={2}
                  value={singleNote}
                  onChange={(e) => setSingleNote(e.target.value)}
                  placeholder="e.g. We have reserved #1 rank on the Outrank Leaderboard for your official team."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:border-[#38bdf8] text-xs text-white focus:outline-none font-medium resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end">
                <button
                  type="submit"
                  disabled={isSending}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs text-slate-950 bg-[#38bdf8] hover:bg-[#0284c7] active:scale-95 transition-all shadow-lg shadow-sky-500/20 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSending ? "Dispatching Invitation..." : "Send Official Invitation"}</span>
                </button>
              </div>
            </form>
          ) : (
            /* Mode 2: Bulk List Inviter */
            <form onSubmit={handleSendBulk} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  List of Official Emails or Company Domains (One per line) *
                </label>
                <textarea
                  rows={6}
                  required
                  value={bulkList}
                  onChange={(e) => setBulkList(e.target.value)}
                  placeholder={`partners@netflix.com\nteam@linear.app\ncontact@cursor.com\nv0.dev\nsupabase.com\npress@openai.com`}
                  className="w-full p-3.5 rounded-xl bg-white/5 border border-white/10 focus:border-[#38bdf8] text-xs text-white font-mono focus:outline-none resize-none leading-relaxed"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Enter emails or company web domains. Outrank will automatically match and resolve corporate inboxes for recognized domains.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Default Platform Category
                </label>
                <select
                  value={bulkCategory}
                  onChange={(e) => setBulkCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#101218] border border-white/10 focus:border-[#38bdf8] text-xs text-white focus:outline-none font-semibold cursor-pointer"
                >
                  {CATEGORY_OPTIONS.map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end">
                <button
                  type="submit"
                  disabled={isSending}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-xs text-slate-950 bg-[#38bdf8] hover:bg-[#0284c7] active:scale-95 transition-all shadow-lg shadow-sky-500/20 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSending ? "Dispatching Bulk Invitations..." : "Dispatch Batch Invitations"}</span>
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Right: Live Holographic Email Invitation Letter Preview (5 cols) */}
        <div className="lg:col-span-5 rounded-3xl bg-[#14171f] border border-white/10 p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <span className="text-xs font-bold text-[#38bdf8] uppercase tracking-wider flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5" />
              Live Email Letter Preview
            </span>
            <span className="text-[10px] text-slate-400 font-mono">HTML VIP Template</span>
          </div>

          {/* Letter Body Simulation */}
          <div className="rounded-2xl border border-white/10 bg-[#0c0e14] p-5 space-y-4 text-xs font-sans leading-relaxed text-slate-300 shadow-inner">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-purple-500 to-sky-500 flex items-center justify-center text-white text-[10px] font-black">
                  O
                </div>
                <span className="font-bold text-white text-sm">OUTRANK WORLD</span>
              </div>
              <span className="text-[10px] text-emerald-400 font-mono font-bold">OFFICIAL VIP INVITATION</span>
            </div>

            <div>
              <p className="font-semibold text-white">
                Dear {singleName || (targetType === "company" ? "Executive Leadership" : "Creator")},
              </p>
              <p className="mt-2 text-slate-400">
                You have been formally nominated to showcase{" "}
                <span className="text-white font-bold">{singleName || "your platform"}</span> on the global Outrank Leaderboard.
              </p>
              <p className="mt-2 text-slate-400">
                Outrank hosts over 10,000+ daily software engineers, founders, and investors tracking sovereign top-tier products worldwide.
              </p>
            </div>

            {singleNote && (
              <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-200 text-[11px] italic">
                "{singleNote}"
              </div>
            )}

            <div className="pt-2 text-center">
              <div className="inline-block px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-sky-500 text-white font-bold text-xs shadow-md">
                Claim Sovereign Rank &rarr;
              </div>
              <p className="text-[10px] text-slate-500 mt-2 font-mono">
                One-click VIP verification token included.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Sent Invitations History & Audit Table */}
      <div className="rounded-3xl bg-[#14171f] border border-white/10 p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <h3 className="font-bold text-sm text-white">
              Sent Invitations Log ({invitations.length})
            </h3>
            <button
              onClick={loadInvitations}
              disabled={isLoading}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
              <span>Refresh</span>
            </button>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Filter by name, email, or domain..."
              className="pl-8 pr-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-[#38bdf8] font-medium"
            />
          </div>
        </div>

        {filteredInvites.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-xs">
            {isLoading ? "Loading invitations..." : "No invitations sent yet. Dispatch an invitation above to invite companies and creators!"}
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-white/5">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-[#101218] text-slate-400 uppercase font-mono text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Entity</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Dispatched At</th>
                  <th className="py-3 px-4 text-right">VIP Link Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredInvites.map((inv) => (
                  <tr key={inv.id} className="hover:bg-white/[0.02]">
                    <td className="py-3 px-4">
                      <div className="font-bold text-white">{inv.name}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{inv.email}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          inv.type === "company"
                            ? "bg-sky-500/10 text-sky-400 border border-sky-500/30"
                            : "bg-purple-500/10 text-purple-400 border border-purple-500/30"
                        }`}
                      >
                        {inv.type === "company" ? "Company" : "Creator"}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-400 text-[11px]">
                      {inv.categorySlug || "General"}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                        {inv.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">
                      {new Date(inv.sentAt).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleCopyInviteLink(inv)}
                        className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-200 text-xs font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        {copiedId === inv.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400">Copied Link!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy VIP Link</span>
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
