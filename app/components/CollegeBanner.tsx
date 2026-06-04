"use client";

import Image from "next/image";
import { useState } from "react";

/**
 * Deterministic hash from a string → stable integer seed.
 * Same college name always produces the same image.
 */
function hashSeed(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

/** Get initials from a college name (max 2 chars). */
function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter((w) => w.length > 0)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

/** Gradient palette seeded by name for visual variety. */
const GRADIENTS = [
  "from-emerald-400 to-teal-500",
  "from-sky-400 to-blue-500",
  "from-violet-400 to-purple-500",
  "from-amber-400 to-orange-500",
  "from-rose-400 to-pink-500",
  "from-cyan-400 to-emerald-500",
  "from-indigo-400 to-blue-600",
  "from-fuchsia-400 to-purple-600",
];

interface CollegeBannerProps {
  name: string;
  ranking?: number;
  /** "card" = 160px tall, "detail" = 240px tall */
  variant?: "card" | "detail";
  /** Optional manual image URL. If not provided, shows a premium fallback gradient. */
  imageUrl?: string;
}

export default function CollegeBanner({
  name,
  ranking,
  variant = "card",
  imageUrl,
}: CollegeBannerProps) {
  const [imgError, setImgError] = useState(false);

  const seed = hashSeed(name);
  const gradientIdx = seed % GRADIENTS.length;
  const gradient = GRADIENTS[gradientIdx];
  const initials = getInitials(name);

  const height = variant === "detail" ? "h-56 sm:h-64" : "h-40";

  return (
    <div className={`banner-zoom relative ${height} w-full overflow-hidden ${variant === "card" ? "rounded-t-2xl" : "rounded-2xl"}`}>
      {imageUrl && !imgError ? (
        <Image
          src={imageUrl}
          alt={`${name} campus`}
          fill
          sizes={variant === "detail" ? "(max-width: 768px) 100vw, 66vw" : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"}
          className="banner-zoom-img object-cover"
          onError={() => setImgError(true)}
          priority={variant === "detail"}
        />
      ) : (
        <div className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${gradient}`}>
          <span className={`font-bold text-white/90 ${variant === "detail" ? "text-5xl" : "text-3xl"}`}>
            {initials}
          </span>
        </div>
      )}

      {/* Gradient overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

      {/* Ranking badge overlay */}
      {ranking && (
        <div className="absolute right-3 top-3">
          <span className="rounded-full bg-white/90 px-2.5 py-1 text-xs font-bold text-slate-800 shadow-sm backdrop-blur-sm">
            #{ranking}
          </span>
        </div>
      )}
    </div>
  );
}
