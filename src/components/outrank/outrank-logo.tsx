import { OutrankMark } from "@/components/branding/outrank-mark";

type OutrankLogoProps = { compact?: boolean };

export function OutrankLogo({ compact = false }: OutrankLogoProps) {
  return <span className="outrank-logo"><span className="outrank-logo-mark"><OutrankMark className="h-8 w-8" /></span>{compact ? null : <span className="outrank-logo-name">Outrank</span>}</span>;
}
