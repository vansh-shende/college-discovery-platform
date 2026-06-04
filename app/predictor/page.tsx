"use client";

import { useState, useEffect, useCallback } from "react";
import CardSkeleton from "../components/CardSkeleton";
import EmptyState from "../components/EmptyState";
import CollegeCard from "../components/CollegeCard";
import type { College, CollegeApiResponse } from "@/app/types";

export default function PredictorPage() {
  const [allColleges, setAllColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [rank, setRank] = useState("");
  const [location, setLocation] = useState("");
  const [course, setCourse] = useState("");
  
  const [results, setResults] = useState<College[]>([]);
  const [searched, setSearched] = useState(false);

  const fetchColleges = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/colleges?limit=50");
      const json: CollegeApiResponse = await res.json();
      if (json.success) {
        setAllColleges(json.data);
      } else {
        setError("Failed to fetch colleges data.");
      }
    } catch {
      setError("An error occurred while loading colleges list. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchColleges();
  }, [fetchColleges]);

  // Extract unique locations and courses for dropdown selections
  const uniqueLocations = [...new Set(allColleges.map((c) => c.location))].sort();
  const uniqueCourses = [...new Set(allColleges.flatMap((c) => c.courses.map((cr) => cr.name)))].sort();

  function handlePredict(e: React.FormEvent) {
    e.preventDefault();
    
    const rankNum = parseInt(rank, 10);
    if (isNaN(rankNum) || rankNum <= 0) return;

    setSearched(true);
    let matched = [...allColleges];

    // Apply Prediction Logic rules
    if (rankNum <= 100) {
      matched = matched.filter((c) => c.ranking <= 3);
    } else if (rankNum <= 500) {
      matched = matched.filter((c) => c.ranking <= 5);
    } else if (rankNum <= 1000) {
      matched = matched.filter((c) => c.ranking <= 8);
    } else {
      matched = matched.filter((c) => c.ranking > 8);
    }

    // Apply optional location filter
    if (location) {
      matched = matched.filter((c) => c.location.toLowerCase() === location.toLowerCase());
    }

    // Apply optional course filter
    if (course) {
      matched = matched.filter((c) =>
        c.courses.some((cr) => cr.name.toLowerCase() === course.toLowerCase())
      );
    }

    // Sort by ranking (best first)
    matched.sort((a, b) => a.ranking - b.ranking);
    setResults(matched);
  }

  function handleReset() {
    setRank("");
    setLocation("");
    setCourse("");
    setResults([]);
    setSearched(false);
  }

  const inputCls =
    "w-full rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 placeholder-slate-400 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/20 disabled:opacity-50 transition-all duration-200";

  const selectCls =
    "w-full rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/20 disabled:opacity-50 appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22none%22%3E%3Cpath%20d%3D%22M7%209l3%203%203-3%22%20stroke%3D%22%236b7280%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')] bg-[size:1.25rem_1.25rem] bg-[position:right_1rem_center] bg-no-repeat pr-10 transition-all duration-200";

  return (
    <div className="space-y-8">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-800 sm:text-3xl">
          College Predictor
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Enter your entrance exam rank and preferences to predict matching top-tier institutions.
        </p>
      </div>

      {/* ── Loading Skeleton (Full Page initial fetch) ───────────────────────── */}
      {loading && (
        <div className="space-y-6">
          <div className="h-44 w-full rounded-2xl bg-slate-50 border border-slate-100 animate-pulse" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        </div>
      )}

      {/* ── Error Boundary ─────────────────────────────────────────────────── */}
      {!loading && error && (
        <EmptyState
          icon="error"
          title="Predictor unavailable"
          description={error}
          actionLabel="Try again"
          onAction={fetchColleges}
        />
      )}

      {/* ── Predictor Form ─────────────────────────────────────────────────── */}
      {!loading && !error && (
        <form onSubmit={handlePredict} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="grid gap-6 sm:grid-cols-3">
            {/* Rank Input */}
            <div className="space-y-1.5">
              <label htmlFor="rank-input" className="text-sm font-semibold text-slate-700">
                Entrance Exam Rank <span className="text-red-500">*</span>
              </label>
              <input
                id="rank-input"
                type="number"
                min="1"
                required
                placeholder="e.g. 250"
                value={rank}
                onChange={(e) => setRank(e.target.value)}
                className={inputCls}
              />
              <p className="text-[11px] text-slate-400">Enter your rank to run recommendations</p>
            </div>

            {/* Location Dropdown */}
            <div className="space-y-1.5">
              <label htmlFor="location-dropdown" className="text-sm font-semibold text-slate-700">
                Preferred Location
              </label>
              <select
                id="location-dropdown"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className={selectCls}
              >
                <option value="">All Locations (No Filter)</option>
                {uniqueLocations.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-slate-400">Optional location filter</p>
            </div>

            {/* Course Dropdown */}
            <div className="space-y-1.5">
              <label htmlFor="course-dropdown" className="text-sm font-semibold text-slate-700">
                Preferred Course
              </label>
              <select
                id="course-dropdown"
                value={course}
                onChange={(e) => setCourse(e.target.value)}
                className={selectCls}
              >
                <option value="">All Courses (No Filter)</option>
                {uniqueCourses.map((crs) => (
                  <option key={crs} value={crs}>
                    {crs}
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-slate-400">Optional discipline filter</p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-slate-100 pt-5">
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-emerald-600 hover:scale-[1.02]"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.637 10.637Z" />
              </svg>
              Predict Colleges
            </button>
            {searched && (
              <button
                type="button"
                onClick={handleReset}
                className="rounded-full px-5 py-2.5 text-sm font-semibold text-slate-500 transition-colors hover:bg-slate-50 hover:text-slate-800"
              >
                Reset Preferences
              </button>
            )}
          </div>
        </form>
      )}

      {/* ── Empty State before search ────────────────────────────────────────── */}
      {!loading && !error && !searched && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
          <div className="rounded-full bg-slate-50 p-4 text-slate-400">
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342" />
            </svg>
          </div>
          <h3 className="mt-4 text-lg font-semibold text-slate-800">Start Your Prediction</h3>
          <p className="mt-1 max-w-sm text-sm text-slate-500">
            Provide your entrance exam rank above to view high-probability matches.
          </p>
        </div>
      )}

      {/* ── Predictions Output ──────────────────────────────────────────────── */}
      {!loading && !error && searched && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-800">
              Predicted Recommendations
            </h2>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-full select-none">
              Found {results.length} Match{results.length === 1 ? "" : "es"}
            </span>
          </div>

          {results.length === 0 ? (
            <EmptyState
              icon="search"
              title="No predictions found"
              description="No colleges fit the criteria. Try loosening your filters or raising your rank threshold."
              actionLabel="Reset Search"
              onAction={handleReset}
            />
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {results.map((c) => (
                <CollegeCard key={c.id} {...c} />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
