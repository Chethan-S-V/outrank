"use client";

import Image, { type ImageLoaderProps } from "next/image";
import { useState, useEffect } from "react";

function directLogoLoader({ src }: ImageLoaderProps) {
  return src;
}

export function ProductLogo({ name, src }: { name: string; src: string | null }) {
  const [imgSrc, setImgSrc] = useState<string | null>(src);
  const [errorCount, setErrorCount] = useState(0);

  // Synchronize state immediately when src prop changes live in customization form
  useEffect(() => {
    setImgSrc(src);
    setErrorCount(0);
  }, [src]);

  const cleanSeed = encodeURIComponent(name.replace(/^@/, "").trim() || "creator");
  const fallbackAvatar = name.startsWith("@")
    ? `https://api.dicebear.com/7.x/bottts/svg?seed=${cleanSeed}`
    : `https://api.dicebear.com/7.x/identicon/svg?seed=${cleanSeed}`;

  const currentSrc = imgSrc || fallbackAvatar;

  function handleError() {
    if (errorCount === 0 && imgSrc && imgSrc !== fallbackAvatar) {
      setErrorCount(1);
      setImgSrc(fallbackAvatar);
    } else {
      setErrorCount(2);
    }
  }

  if (errorCount < 2 && currentSrc) {
    return (
      <div className="w-12 h-12 rounded-xl border border-[var(--border)] bg-white dark:bg-purple-950/20 p-1 flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
        <Image
          alt={`${name} logo`}
          className="w-full h-full object-contain rounded-lg"
          height={48}
          loader={directLogoLoader}
          onError={handleError}
          src={currentSrc}
          unoptimized
          width={48}
        />
      </div>
    );
  }

  // Consistent letter avatar with purple/indigo brand tone
  return (
    <div
      aria-hidden="true"
      className="w-12 h-12 rounded-xl border border-[var(--border)] bg-gradient-to-tr from-[#7446d8] to-[#9333ea] text-white flex items-center justify-center text-lg font-black shrink-0 shadow-sm"
    >
      {name.replace(/^@/, "").slice(0, 1).toUpperCase()}
    </div>
  );
}
