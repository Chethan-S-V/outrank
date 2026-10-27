"use client";

import { useState } from "react";
import { X, Check, Globe, Sparkles, UserPlus } from "lucide-react";

type SocialConnectModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onUserAdded?: (user: { name: string; handle: string; avatarUrl?: string }) => void;
};

export function SocialConnectModal({ isOpen, onClose, onUserAdded }: SocialConnectModalProps) {
  const [activeTab, setActiveTab] = useState<"social" | "custom">("social");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Form fields
  const [name, setName] = useState("");
  const [handle, setHandle] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [twitterHandle, setTwitterHandle] = useState("");
  const [githubHandle, setGithubHandle] = useState("");
  const [discordHandle, setDiscordHandle] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");

  if (!isOpen) return null;

  async function handleSocialQuickConnect(platform: "twitter" | "github" | "discord" | "google" | "linkedin") {
    setLoading(true);
    setError(null);

    // Generate a default handle/email for quick demo simulation if in test mode
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const simulatedProfiles: Record<string, { name: string; handle: string; email: string; avatarUrl: string; bio: string }> = {
      twitter: {
        name: "Twitter Creator",
        handle: `creator_x${randomSuffix}`,
        email: `creator_x${randomSuffix}@outrank.app`,
        avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=x${randomSuffix}`,
        bio: "Building public projects on X / Twitter.",
      },
      github: {
        name: "GitHub Developer",
        handle: `dev_gh${randomSuffix}`,
        email: `dev_gh${randomSuffix}@outrank.app`,
        avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=gh${randomSuffix}`,
        bio: "Open-source contributor & software engineer.",
      },
      discord: {
        name: "Discord Member",
        handle: `discord_user${randomSuffix}`,
        email: `discord${randomSuffix}@outrank.app`,
        avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=dc${randomSuffix}`,
        bio: "Community builder on Discord.",
      },
      google: {
        name: "Google User",
        handle: `user_g${randomSuffix}`,
        email: `google${randomSuffix}@outrank.app`,
        avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=g${randomSuffix}`,
        bio: "Product explorer and backer.",
      },
      linkedin: {
        name: "LinkedIn Professional",
        handle: `pro_li${randomSuffix}`,
        email: `pro${randomSuffix}@outrank.app`,
        avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=li${randomSuffix}`,
        bio: "Technology leader & product innovator.",
      },
    };

    const target = simulatedProfiles[platform];

    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: target.name,
          handle: target.handle,
          email: target.email,
          avatarUrl: target.avatarUrl,
          bio: target.bio,
          provider: platform,
          twitterHandle: platform === "twitter" ? target.handle : undefined,
          githubHandle: platform === "github" ? target.handle : undefined,
          discordHandle: platform === "discord" ? target.handle : undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to connect social account.");
      }

      const registered = data.user;
      localStorage.setItem("outrank_active_user", JSON.stringify(registered));
      setSuccessMessage(`Connected successfully via ${platform.toUpperCase()} as @${registered.handle}!`);
      if (onUserAdded) {
        onUserAdded(registered);
      }
      setTimeout(() => {
        onClose();
      }, 1400);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error connecting account.");
    } finally {
      setLoading(false);
    }
  }

  async function handleCustomSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const cleanHandle = handle.replace(/^@/, "").trim();

    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          handle: cleanHandle,
          email: email.trim(),
          bio: bio.trim(),
          avatarUrl: avatarUrl.trim() || `https://api.dicebear.com/7.x/initials/svg?seed=${cleanHandle}`,
          twitterHandle: twitterHandle.replace(/^@/, "").trim(),
          githubHandle: githubHandle.replace(/^@/, "").trim(),
          discordHandle: discordHandle.trim(),
          linkedinUrl: linkedinUrl.trim(),
          provider: "manual",
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to create user profile.");
      }

      const registered = data.user;
      localStorage.setItem("outrank_active_user", JSON.stringify(registered));
      setSuccessMessage(`Creator profile @${registered.handle} added successfully!`);
      if (onUserAdded) {
        onUserAdded(registered);
      }
      setTimeout(() => {
        onClose();
      }, 1400);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error creating profile.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg overflow-hidden border border-[var(--border-strong)] rounded-2xl bg-[var(--surface)] shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[var(--border)]">
          <div className="flex items-center gap-2.5">
            <div className="grid w-8 h-8 rounded-lg place-items-center bg-[#7446d8]/15 text-[#7446d8] dark:text-[#a278ff]">
              <UserPlus className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[var(--text-primary)]">Add User & Connect Platforms</h2>
              <p className="text-xs text-[var(--text-secondary)]">Link your social media profiles to claim & rank products</p>
            </div>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="p-1 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-hover)] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[var(--border)] bg-[var(--surface-raised)] p-1 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab("social")}
            className={`flex-1 py-2 text-center rounded-lg transition-colors ${
              activeTab === "social"
                ? "bg-[var(--surface)] text-[var(--accent)] shadow-sm font-bold"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            }`}
          >
            Connect Social Platforms
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("custom")}
            className={`flex-1 py-2 text-center rounded-lg transition-colors ${
              activeTab === "custom"
                ? "bg-[var(--surface)] text-[var(--accent)] shadow-sm font-bold"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            }`}
          >
            Add Maker Profile
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {error ? (
            <div className="p-3 mb-4 text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-xl">
              {error}
            </div>
          ) : null}

          {successMessage ? (
            <div className="flex items-center gap-2 p-3 mb-4 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
              <Check className="w-4 h-4" />
              <span>{successMessage}</span>
            </div>
          ) : null}

          {activeTab === "social" ? (
            <div className="space-y-3">
              <p className="text-xs text-[var(--text-secondary)] mb-4">
                Choose a social platform to quickly authenticate and create your Outrank creator profile:
              </p>

              {/* Twitter / X */}
              <button
                type="button"
                disabled={loading}
                onClick={() => handleSocialQuickConnect("twitter")}
                className="w-full flex items-center justify-between px-4 py-3 border border-[var(--border)] rounded-xl bg-[var(--surface)] hover:bg-[var(--surface-hover)] hover:border-black dark:hover:border-white transition-all text-sm font-medium text-[var(--text-primary)]"
              >
                <div className="flex items-center gap-3">
                  <span className="font-bold text-base">𝕏</span>
                  <span>Continue with Twitter / X</span>
                </div>
                <span className="text-xs text-[var(--text-muted)]">Connect →</span>
              </button>

              {/* GitHub */}
              <button
                type="button"
                disabled={loading}
                onClick={() => handleSocialQuickConnect("github")}
                className="w-full flex items-center justify-between px-4 py-3 border border-[var(--border)] rounded-xl bg-[var(--surface)] hover:bg-[var(--surface-hover)] hover:border-[#7446d8] transition-all text-sm font-medium text-[var(--text-primary)]"
              >
                <div className="flex items-center gap-3">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                  <span>Continue with GitHub</span>
                </div>
                <span className="text-xs text-[var(--text-muted)]">Connect →</span>
              </button>

              {/* Discord */}
              <button
                type="button"
                disabled={loading}
                onClick={() => handleSocialQuickConnect("discord")}
                className="w-full flex items-center justify-between px-4 py-3 border border-[var(--border)] rounded-xl bg-[var(--surface)] hover:bg-[var(--surface-hover)] hover:border-[#5865F2] transition-all text-sm font-medium text-[var(--text-primary)]"
              >
                <div className="flex items-center gap-3">
                  <svg className="w-4 h-4 fill-[#5865F2]" viewBox="0 0 24 24">
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                  </svg>
                  <span>Continue with Discord</span>
                </div>
                <span className="text-xs text-[var(--text-muted)]">Connect →</span>
              </button>

              {/* Google */}
              <button
                type="button"
                disabled={loading}
                onClick={() => handleSocialQuickConnect("google")}
                className="w-full flex items-center justify-between px-4 py-3 border border-[var(--border)] rounded-xl bg-[var(--surface)] hover:bg-[var(--surface-hover)] hover:border-amber-500 transition-all text-sm font-medium text-[var(--text-primary)]"
              >
                <div className="flex items-center gap-3">
                  <Globe className="w-4 h-4 text-emerald-500" />
                  <span>Continue with Google</span>
                </div>
                <span className="text-xs text-[var(--text-muted)]">Connect →</span>
              </button>

              {/* LinkedIn */}
              <button
                type="button"
                disabled={loading}
                onClick={() => handleSocialQuickConnect("linkedin")}
                className="w-full flex items-center justify-between px-4 py-3 border border-[var(--border)] rounded-xl bg-[var(--surface)] hover:bg-[var(--surface-hover)] hover:border-[#0A66C2] transition-all text-sm font-medium text-[var(--text-primary)]"
              >
                <div className="flex items-center gap-3">
                  <span className="font-bold text-sm text-[#0A66C2]">in</span>
                  <span>Continue with LinkedIn</span>
                </div>
                <span className="text-xs text-[var(--text-muted)]">Connect →</span>
              </button>
            </div>
          ) : (
            <form onSubmit={handleCustomSubmit} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">
                    Full Name *
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Alex Rivera"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-[var(--border)] rounded-lg bg-[var(--surface)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">
                    Username / Handle *
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. alex_rivera"
                    value={handle}
                    onChange={(e) => setHandle(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-[var(--border)] rounded-lg bg-[var(--surface)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">
                  Contact Email *
                </label>
                <input
                  required
                  type="email"
                  placeholder="alex@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-[var(--border)] rounded-lg bg-[var(--surface)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[var(--text-secondary)] mb-1">
                  Bio / Tagline (optional)
                </label>
                <input
                  type="text"
                  placeholder="Indie Maker & Developer"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-[var(--border)] rounded-lg bg-[var(--surface)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
                />
              </div>

              {/* Social Handles Section */}
              <div className="pt-2 border-t border-[var(--border)]">
                <p className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)] mb-2">
                  Social Media Links
                </p>
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[11px] text-[var(--text-secondary)] mb-0.5">Twitter / X</label>
                    <input
                      type="text"
                      placeholder="@handle"
                      value={twitterHandle}
                      onChange={(e) => setTwitterHandle(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs border border-[var(--border)] rounded-lg bg-[var(--surface)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-[var(--text-secondary)] mb-0.5">GitHub</label>
                    <input
                      type="text"
                      placeholder="username"
                      value={githubHandle}
                      onChange={(e) => setGithubHandle(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs border border-[var(--border)] rounded-lg bg-[var(--surface)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-[var(--text-secondary)] mb-0.5">Discord Handle</label>
                    <input
                      type="text"
                      placeholder="username#0000"
                      value={discordHandle}
                      onChange={(e) => setDiscordHandle(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs border border-[var(--border)] rounded-lg bg-[var(--surface)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-[var(--text-secondary)] mb-0.5">LinkedIn URL</label>
                    <input
                      type="url"
                      placeholder="https://linkedin.com/in/..."
                      value={linkedinUrl}
                      onChange={(e) => setLinkedinUrl(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs border border-[var(--border)] rounded-lg bg-[var(--surface)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-[var(--text-secondary)] mb-0.5">Avatar URL</label>
                    <input
                      type="url"
                      placeholder="https://..."
                      value={avatarUrl}
                      onChange={(e) => setAvatarUrl(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs border border-[var(--border)] rounded-lg bg-[var(--surface)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-4 py-2.5 rounded-xl bg-gradient-to-r from-[#7446d8] to-[#5e34bd] text-white text-xs font-bold hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{loading ? "Registering..." : "Add Creator Profile"}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
