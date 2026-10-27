import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { OutrankPageShell } from "@/components/outrank/page-shell";
import { APP_DESCRIPTION, APP_NAME } from "@/lib/constants";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const themeScript = `(() => { try { const saved = localStorage.getItem("outrank-theme"); const dark = saved ? saved === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches; document.documentElement.classList.toggle("dark", dark); } catch {} })();`;

export const metadata: Metadata = { title: APP_NAME, description: APP_DESCRIPTION, icons: { icon: "/icon.svg" } };
export const viewport: Viewport = { themeColor: "#f8f7fb" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html className={`${geistSans.variable} ${geistMono.variable}`} lang="en" suppressHydrationWarning><body><Script id="out-rank-theme" strategy="beforeInteractive">{themeScript}</Script><OutrankPageShell pathname="/">{children}</OutrankPageShell></body></html>;
}
