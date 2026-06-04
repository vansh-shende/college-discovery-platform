"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const DEMO_USER_ID = "ef06df50-d216-492d-a3c7-ce4c17c71dab";

// Simple in-memory cache to prevent duplicate fetch calls across cards on the same page load
let savedIdsPromise: Promise<string[]> | null = null;
let savedIdsCache: string[] | null = null;

function fetchSavedIds(userId: string): Promise<string[]> {
  if (savedIdsCache) return Promise.resolve(savedIdsCache);
  if (savedIdsPromise) return savedIdsPromise;

  savedIdsPromise = (fetch(`/api/saved?userId=${userId}`)
    .then((res) => res.json())
    .then((json) => {
      if (json.success && Array.isArray(json.data)) {
        const ids = json.data.map((item: any) => item.collegeId) as string[];
        savedIdsCache = ids;
        return ids;
      }
      return [] as string[];
    })
    .catch(() => [] as string[])) as Promise<string[]>;

  return savedIdsPromise;
}

function addToCache(collegeId: string) {
  if (savedIdsCache && !savedIdsCache.includes(collegeId)) {
    savedIdsCache.push(collegeId);
  }
}

function removeFromCache(collegeId: string) {
  if (savedIdsCache) {
    savedIdsCache = savedIdsCache.filter((id) => id !== collegeId);
  }
}

// Allow invalidating the cache (e.g. on navigation or to force a fresh fetch)
export function invalidateSavedCache() {
  savedIdsPromise = null;
  savedIdsCache = null;
}

interface SaveButtonProps {
  collegeId: string;
  className?: string;
  variant?: "default" | "detail";
  initialStatus?: "idle" | "saving" | "saved" | "exists";
}

export default function SaveButton({
  collegeId,
  className = "",
  variant = "default",
  initialStatus,
}: SaveButtonProps) {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "exists">(
    initialStatus || "idle"
  );
  const [isHovered, setIsHovered] = useState(false);

  // If no initial status is specified, fetch the list on mount to see if this college is saved
  useEffect(() => {
    if (initialStatus) return;

    fetchSavedIds(DEMO_USER_ID).then((savedIds) => {
      if (savedIds.includes(collegeId)) {
        setStatus("saved");
      } else {
        setStatus("idle");
      }
    });
  }, [collegeId, initialStatus]);

  async function handleToggleSave(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (status === "saving") return;

    const isCurrentlySaved = status === "saved" || status === "exists";

    setStatus("saving");

    try {
      if (isCurrentlySaved) {
        // DELETE (Unsave)
        const res = await fetch("/api/saved", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: DEMO_USER_ID, collegeId }),
        });

        if (res.ok) {
          removeFromCache(collegeId);
          setStatus("idle");
          // Refresh the page so Server Components (like Saved Colleges page) re-sync
          router.refresh();
        } else {
          setStatus("saved");
        }
      } else {
        // POST (Save)
        const res = await fetch("/api/saved", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: DEMO_USER_ID, collegeId }),
        });

        if (res.status === 201) {
          addToCache(collegeId);
          setStatus("saved");
          router.refresh();
        } else if (res.status === 409) {
          addToCache(collegeId);
          setStatus("exists");
          router.refresh();
        } else {
          setStatus("idle");
        }
      }
    } catch {
      setStatus(isCurrentlySaved ? "saved" : "idle");
    }
  }

  const icons = {
    idle: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
      </svg>
    ),
    saving: (
      <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
      </svg>
    ),
    saved: (
      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
        <path fillRule="evenodd" d="M6.32 2.577a49.255 49.255 0 0 1 11.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 0 1-1.085.67L12 18.089l-7.165 3.583A.75.75 0 0 1 3.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93Z" clipRule="evenodd" />
      </svg>
    ),
    exists: (
      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
        <path fillRule="evenodd" d="M6.32 2.577a49.255 49.255 0 0 1 11.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 0 1-1.085.67L12 18.089l-7.165 3.583A.75.75 0 0 1 3.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93Z" clipRule="evenodd" />
      </svg>
    ),
  };

  const labels = {
    idle: "Save",
    saving: "Saving...",
    saved: "Saved",
    exists: "Saved",
  };

  // Determine current active icon/label based on hover
  const isSavedState = status === "saved" || status === "exists";
  const currentIcon = isSavedState && isHovered ? (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
    </svg>
  ) : icons[status];

  const currentLabel = isSavedState && isHovered ? "Unsave" : labels[status];

  const baseStyles =
    variant === "detail"
      ? "inline-flex items-center justify-center gap-2 rounded-full px-6 py-2.5 text-sm font-medium transition-all duration-200 disabled:cursor-not-allowed select-none border"
      : "inline-flex items-center justify-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 disabled:cursor-not-allowed select-none border";

  const variantStyles = {
    idle:
      variant === "detail"
        ? "bg-emerald-500 text-white border-transparent hover:bg-emerald-600 hover:scale-[1.02]"
        : "border-slate-200 text-slate-600 bg-white hover:border-emerald-300 hover:text-emerald-600 hover:bg-emerald-50/20",
    saving: "bg-slate-50 border-slate-200 text-slate-400 cursor-wait",
    saved: "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200",
    exists: "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200",
  };

  return (
    <button
      onClick={handleToggleSave}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      disabled={status === "saving"}
      className={`${baseStyles} ${variantStyles[status]} ${className}`}
    >
      {currentIcon}
      <span>{currentLabel}</span>
    </button>
  );
}
