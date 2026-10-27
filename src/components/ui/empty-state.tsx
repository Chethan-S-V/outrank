import Link from "next/link";
import { OutrankMark } from "@/components/branding/outrank-mark";

export function EmptyState({ title, description, actionHref, actionLabel }: { title: string; description: string; actionHref?: string; actionLabel?: string }) {
  return <div className="border border-dashed border-[var(--border)] bg-[var(--surface)] px-6 py-12 text-center"><div className="mx-auto mb-4 grid h-11 w-11 place-items-center border border-[var(--accent)]/40 bg-[var(--accent)]/10 text-[var(--accent)]"><OutrankMark className="h-7 w-7" /></div><h2 className="text-lg font-semibold text-[var(--text-primary)]">{title}</h2><p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[var(--text-secondary)]">{description}</p>{actionHref && actionLabel ? <Link className="mt-5 inline-flex bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-[#1a100d]" href={actionHref}>{actionLabel}</Link> : null}</div>;
}
