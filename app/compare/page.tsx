"use client";

import { useState, useEffect, useCallback } from "react";
import EmptyState from "../components/EmptyState";
import CollegeBanner from "../components/CollegeBanner";
import type { College, CollegeApiResponse } from "@/app/types";

export default function ComparePage() {
  const [allColleges, setAllColleges] = useState<College[]>([]);
  const [selectedColleges, setSelectedColleges] = useState<College[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchColleges = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      // Fetch up to 50 colleges (highest allowed by Zod query limit) to get the full list
      const res = await fetch("/api/colleges?limit=50");
      const json: CollegeApiResponse = await res.json();
      if (json.success) {
        setAllColleges(json.data);
      } else {
        setError("Failed to fetch colleges list.");
      }
    } catch {
      setError("An error occurred while fetching colleges. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchColleges();
  }, [fetchColleges]);

  const filteredColleges = allColleges.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleSelect = (college: College) => {
    const isSelected = selectedColleges.some((s) => s.id === college.id);
    if (isSelected) {
      setSelectedColleges(selectedColleges.filter((s) => s.id !== college.id));
    } else {
      if (selectedColleges.length >= 3) return;
      setSelectedColleges([...selectedColleges, college]);
    }
  };

  const clearSelection = () => setSelectedColleges([]);

  return (
    <div className="space-y-8">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800 sm:text-3xl">
            Compare Colleges
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Compare key metrics and offerings side-by-side to make the right choice.
          </p>
        </div>
        {selectedColleges.length > 0 && (
          <button
            onClick={clearSelection}
            className="self-start rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-800"
          >
            Clear Selection
          </button>
        )}
      </div>

      {/* ── Loading State ───────────────────────────────────────────────────── */}
      {loading && (
        <div className="space-y-6">
          <div className="h-10 w-full max-w-md rounded-full bg-slate-100 animate-pulse" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-32 rounded-2xl border border-slate-100 bg-slate-50/50 p-4 space-y-3 animate-pulse">
                <div className="h-4 w-3/4 rounded bg-slate-200" />
                <div className="h-3.5 w-1/2 rounded bg-slate-200" />
                <div className="h-8 w-20 rounded-full bg-slate-200 pt-2" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Error State ─────────────────────────────────────────────────────── */}
      {!loading && error && (
        <EmptyState
          icon="error"
          title="Unable to load colleges"
          description={error}
          actionLabel="Try again"
          onAction={fetchColleges}
        />
      )}

      {/* ── Card Selector Grid ───────────────────────────────────────────────── */}
      {!loading && !error && allColleges.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="relative w-full max-w-md">
              <span className="absolute inset-y-0 left-3.5 flex items-center text-slate-400">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.637 10.637Z" />
                </svg>
              </span>
              <input
                type="text"
                placeholder="Search colleges to compare..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-full border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-700 placeholder-slate-400 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/20"
              />
            </div>
            <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full select-none">
              Selected: {selectedColleges.length}/3
            </span>
          </div>

          {filteredColleges.length === 0 ? (
            <p className="text-sm text-slate-400 py-6">No colleges match your search term.</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {filteredColleges.map((c) => {
                const isSelected = selectedColleges.some((s) => s.id === c.id);
                const isDisabled = !isSelected && selectedColleges.length >= 3;

                return (
                  <div
                    key={c.id}
                    onClick={() => !isDisabled && toggleSelect(c)}
                    className={`group relative flex flex-col justify-between rounded-2xl border p-4 transition-all duration-200 select-none
                      ${isSelected
                        ? "border-emerald-500 bg-emerald-50/10 shadow-sm ring-1 ring-emerald-500 cursor-pointer"
                        : isDisabled
                          ? "border-slate-200 bg-slate-50/50 opacity-60 cursor-not-allowed"
                          : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm cursor-pointer"
                      }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold text-slate-800 line-clamp-1 group-hover:text-slate-900">
                          {c.name}
                        </h3>
                        <span className="shrink-0 rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-600">
                          #{c.ranking}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 line-clamp-1">{c.location}</p>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-[11px] text-slate-400">
                        {c.courses.length} {c.courses.length === 1 ? "course" : "courses"}
                      </span>
                      {isSelected ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500 px-2.5 py-1 text-xs font-semibold text-white">
                          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                          </svg>
                          Selected
                        </span>
                      ) : isDisabled ? (
                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-400">
                          Limit reached
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-600 transition-colors group-hover:border-emerald-300 group-hover:text-emerald-600 group-hover:bg-emerald-50/10">
                          <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                          </svg>
                          Compare
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ── Empty State when nothing is selected ──────────────────────────────── */}
      {!loading && !error && selectedColleges.length === 0 && (
        <div className="mt-4">
          <EmptyState
            icon="compare"
            title="No colleges selected"
            description="Choose up to 3 colleges from the selector above to compare their details side by side."
          />
        </div>
      )}

      {/* ── Comparison Table ─────────────────────────────────────────────────── */}
      {!loading && !error && selectedColleges.length > 0 && (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-200">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/50">
                  <th className="w-1/4 min-w-[180px] p-6 text-xs font-bold uppercase tracking-wider text-slate-400 align-bottom">
                    Comparison Metrics
                  </th>
                  {selectedColleges.map((c) => (
                    <th key={c.id} className="w-1/4 p-6 align-top">
                      <div className="group relative space-y-3">
                        {/* Banner Image Container */}
                        <div className="h-28 overflow-hidden rounded-xl">
                          {/* @ts-ignore: imageUrl allowed for manual insertion */}
                          <CollegeBanner name={c.name} variant="card" imageUrl={(c as any).imageUrl} />
                        </div>
                        {/* Name & Remove */}
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-semibold text-slate-800 line-clamp-2">{c.name}</h4>
                          <button
                            onClick={() => toggleSelect(c)}
                            className="inline-flex shrink-0 h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                            aria-label={`Remove ${c.name}`}
                          >
                            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </th>
                  ))}
                  {/* Fill empty table columns up to 3 */}
                  {Array.from({ length: 3 - selectedColleges.length }).map((_, idx) => (
                    <th key={idx} className="w-1/4 p-6 align-bottom border-l border-slate-100 bg-slate-50/10">
                      <div className="flex h-36 flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 p-4 text-center">
                        <span className="text-xs text-slate-400">Select another college</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {/* ── Location Row ── */}
                <tr className="hover:bg-slate-50/20 transition-colors">
                  <td className="p-6 font-semibold text-slate-500">Location</td>
                  {selectedColleges.map((c) => (
                    <td key={c.id} className="p-6 text-slate-700">
                      {c.location}
                    </td>
                  ))}
                  {Array.from({ length: 3 - selectedColleges.length }).map((_, idx) => (
                    <td key={idx} className="p-6 bg-slate-50/10 border-l border-slate-100" />
                  ))}
                </tr>

                {/* ── Ranking Row ── */}
                <tr className="hover:bg-slate-50/20 transition-colors">
                  <td className="p-6 font-semibold text-slate-500">National Ranking</td>
                  {selectedColleges.map((c) => (
                    <td key={c.id} className="p-6">
                      <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">
                        #{c.ranking}
                      </span>
                    </td>
                  ))}
                  {Array.from({ length: 3 - selectedColleges.length }).map((_, idx) => (
                    <td key={idx} className="p-6 bg-slate-50/10 border-l border-slate-100" />
                  ))}
                </tr>

                {/* ── Courses Count Row ── */}
                <tr className="hover:bg-slate-50/20 transition-colors">
                  <td className="p-6 font-semibold text-slate-500">Available Courses</td>
                  {selectedColleges.map((c) => (
                    <td key={c.id} className="p-6 text-slate-800 font-semibold">
                      {c.courses.length} Program{c.courses.length === 1 ? "" : "s"}
                    </td>
                  ))}
                  {Array.from({ length: 3 - selectedColleges.length }).map((_, idx) => (
                    <td key={idx} className="p-6 bg-slate-50/10 border-l border-slate-100" />
                  ))}
                </tr>

                {/* ── Description Row ── */}
                <tr className="hover:bg-slate-50/20 transition-colors">
                  <td className="p-6 font-semibold text-slate-500">About / Description</td>
                  {selectedColleges.map((c) => (
                    <td key={c.id} className="p-6 text-xs leading-relaxed text-slate-600 max-w-[250px]">
                      {c.description}
                    </td>
                  ))}
                  {Array.from({ length: 3 - selectedColleges.length }).map((_, idx) => (
                    <td key={idx} className="p-6 bg-slate-50/10 border-l border-slate-100" />
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
