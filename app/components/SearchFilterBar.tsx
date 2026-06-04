"use client";

import { useState } from "react";

interface SearchFilterBarProps {
  search: string;
  location: string;
  course: string;
  onSearchChange: (value: string) => void;
  onLocationChange: (value: string) => void;
  onCourseChange: (value: string) => void;
  onReset: () => void;
  hasActiveFilters: boolean;
}

export default function SearchFilterBar({
  search,
  location,
  course,
  onSearchChange,
  onLocationChange,
  onCourseChange,
  onReset,
  hasActiveFilters,
}: SearchFilterBarProps) {
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="space-y-3">
      {/* Main search bar — pill shaped */}
      <div className="relative">
        <svg
          className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
          fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
        </svg>
        <input
          id="search-colleges"
          type="text"
          placeholder="Search colleges by name or description..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full rounded-full border border-slate-200 bg-white py-3 pl-12 pr-5 text-sm text-slate-800 placeholder-slate-400 shadow-sm transition-all focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/20"
        />
      </div>

      {/* Filter row */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        {/* Desktop filters */}
        <div className="hidden gap-2 sm:flex">
          <input
            id="filter-location"
            type="text"
            placeholder="📍 Location"
            value={location}
            onChange={(e) => onLocationChange(e.target.value)}
            className="w-36 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 placeholder-slate-400 transition-all focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/20"
          />
          <input
            id="filter-course"
            type="text"
            placeholder="🎓 Course"
            value={course}
            onChange={(e) => onCourseChange(e.target.value)}
            className="w-36 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 placeholder-slate-400 transition-all focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/20"
          />
          {hasActiveFilters && (
            <button
              onClick={onReset}
              className="rounded-full px-4 py-2 text-sm font-medium text-slate-400 transition-colors hover:bg-slate-50 hover:text-slate-600"
            >
              Reset
            </button>
          )}
        </div>

        {/* Mobile filter toggle */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 sm:hidden"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
          </svg>
          Filters
          {hasActiveFilters && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-bold text-white">!</span>
          )}
        </button>
      </div>

      {/* Mobile expanded filters */}
      {showFilters && (
        <div className="flex flex-col gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4 sm:hidden">
          <div>
            <label htmlFor="filter-location-mobile" className="mb-1 block text-xs font-medium text-slate-500">Location</label>
            <input
              id="filter-location-mobile"
              type="text"
              placeholder="e.g. Delhi, Mumbai..."
              value={location}
              onChange={(e) => onLocationChange(e.target.value)}
              className="w-full rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 placeholder-slate-400 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/20"
            />
          </div>
          <div>
            <label htmlFor="filter-course-mobile" className="mb-1 block text-xs font-medium text-slate-500">Course</label>
            <input
              id="filter-course-mobile"
              type="text"
              placeholder="e.g. Computer Science..."
              value={course}
              onChange={(e) => onCourseChange(e.target.value)}
              className="w-full rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 placeholder-slate-400 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/20"
            />
          </div>
          {hasActiveFilters && (
            <button
              onClick={() => { onReset(); setShowFilters(false); }}
              className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-500 hover:bg-white"
            >
              Reset All
            </button>
          )}
        </div>
      )}
    </div>
  );
}
