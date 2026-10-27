import type { ReactNode } from "react";

type PublicPageHeadingProps = { description: string; eyebrow: string; meta?: ReactNode; title: string };

export function PublicPageHeading({ description, eyebrow, meta, title }: PublicPageHeadingProps) {
  return <header className="outrank-public-heading"><p>{eyebrow}</p><h1>{title}</h1><div className="outrank-public-heading-copy"><span>{description}</span>{meta}</div></header>;
}
