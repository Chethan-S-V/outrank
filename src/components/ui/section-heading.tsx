import type { ReactNode } from "react";

export function SectionHeading({ eyebrow, title, children }: { eyebrow?: string; title: string; children?: ReactNode }) {
  return <div className="max-w-2xl space-y-3"><p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700">{eyebrow}</p><h2 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">{title}</h2>{children ? <div className="text-sm leading-6 text-slate-600">{children}</div> : null}</div>;
}
