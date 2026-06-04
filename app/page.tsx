"use client";

import { useState, useEffect, useCallback } from "react";
import SearchFilterBar from "./components/SearchFilterBar";
import ActiveFilters from "./components/ActiveFilters";
import CollegeCard from "./components/CollegeCard";
import CardSkeleton from "./components/CardSkeleton";
import EmptyState from "./components/EmptyState";
import Pagination from "./components/Pagination";
import type { College, CollegeApiResponse } from "@/app/types";

const LIMIT = 6;

export default function HomePage() {
  const [colleges, setColleges] = useState<College[]>([]);
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [course, setCourse] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [totalCourses, setTotalCourses] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const hasActiveFilters = search.trim() !== "" || location.trim() !== "" || course.trim() !== "";

  const fetchColleges = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (location) params.set("location", location);
      if (course) params.set("course", course);
      params.set("page", page.toString());
      params.set("limit", LIMIT.toString());

      const res = await fetch(`/api/colleges?${params.toString()}`);
      const json: CollegeApiResponse = await res.json();

      if (json.success) {
        setColleges(json.data);
        setTotalPages(json.pagination.totalPages);
        setTotal(json.pagination.total);
        setTotalCourses(json.data.reduce((sum, c) => sum + c.courses.length, 0));
      } else {
        setError("Failed to load colleges.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [search, location, course, page]);

  useEffect(() => { fetchColleges(); }, [fetchColleges]);
  useEffect(() => { setPage(1); }, [search, location, course]);

  function handleResetFilters() { setSearch(""); setLocation(""); setCourse(""); setPage(1); }
  function handleRemoveFilter(key: string) {
    if (key === "search") setSearch("");
    if (key === "location") setLocation("");
    if (key === "course") setCourse("");
  }

  return (
    <div>
      {/* ── Hero Section ─────────────────────────────────────────────────────── */}
      <section className="-mx-4 -mt-8 mb-10 bg-slate-50 px-4 py-14 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-3xl font-bold tracking-tight text-slate-800 sm:text-4xl">
            Find Your Perfect College
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-base text-slate-500">
            Explore top Indian colleges, compare programs, and make informed
            decisions about your future.
          </p>

          {/* Search */}
          <div className="mx-auto mt-8 max-w-2xl">
            <SearchFilterBar
              search={search}
              location={location}
              course={course}
              onSearchChange={setSearch}
              onLocationChange={setLocation}
              onCourseChange={setCourse}
              onReset={handleResetFilters}
              hasActiveFilters={hasActiveFilters}
            />
          </div>
        </div>
      </section>

      {/* ── Statistics ────────────────────────────────────────────────────────── */}
      {!loading && !error && (
        <section className="mb-10 grid grid-cols-2 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 text-center">
            <p className="text-2xl font-bold text-slate-800">{total}</p>
            <p className="mt-1 text-xs font-medium text-slate-500">Total Colleges</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 text-center">
            <p className="text-2xl font-bold text-slate-800">{totalCourses}</p>
            <p className="mt-1 text-xs font-medium text-slate-500">Courses Listed</p>
          </div>
          <div className="col-span-2 rounded-2xl border border-slate-200 bg-white p-5 text-center sm:col-span-1">
            <p className="text-2xl font-bold text-emerald-600">{total > 0 ? "Live" : "—"}</p>
            <p className="mt-1 text-xs font-medium text-slate-500">Platform Status</p>
          </div>
        </section>
      )}

      {/* ── Active Filter Pills ──────────────────────────────────────────────── */}
      <div className="mb-5">
        <ActiveFilters
          filters={[
            { key: "search", label: "Search", value: search },
            { key: "location", label: "Location", value: location },
            { key: "course", label: "Course", value: course },
          ]}
          onRemove={handleRemoveFilter}
          onClearAll={handleResetFilters}
        />
      </div>

      {/* ── Results Header ───────────────────────────────────────────────────── */}
      {!loading && !error && (
        <div className="mb-5 flex items-center justify-between">
          <p className="text-sm text-slate-500">
            Showing <span className="font-semibold text-slate-700">{colleges.length}</span> of{" "}
            <span className="font-semibold text-slate-700">{total}</span> colleges
          </p>
        </div>
      )}

      {/* ── Loading Skeletons ────────────────────────────────────────────────── */}
      {loading && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: LIMIT }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      )}

      {/* ── Error ────────────────────────────────────────────────────────────── */}
      {error && (
        <EmptyState icon="error" title="Something went wrong" description={error} actionLabel="Try again" onAction={fetchColleges} />
      )}

      {/* ── Empty ────────────────────────────────────────────────────────────── */}
      {!loading && !error && colleges.length === 0 && (
        <EmptyState
          icon="search"
          title="No colleges found"
          description="Try adjusting your search terms or removing some filters."
          actionLabel={hasActiveFilters ? "Reset Filters" : undefined}
          onAction={hasActiveFilters ? handleResetFilters : undefined}
        />
      )}

      {/* ── College Grid ─────────────────────────────────────────────────────── */}
      {!loading && !error && colleges.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {colleges.map((c) => <CollegeCard key={c.id} {...c} />)}
        </div>
      )}

      {/* ── Pagination ───────────────────────────────────────────────────────── */}
      {!loading && !error && <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />}
    </div>
  );
}
