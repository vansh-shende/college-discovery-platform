"use client";

import Link from "next/link";
import SaveButton from "./SaveButton";
import CollegeBanner from "./CollegeBanner";
import type { College } from "@/app/types";

export default function CollegeCard({
  id,
  name,
  location,
  ranking,
  description,
  courses,
  imageUrl, // Added for future manual usage
}: College & { imageUrl?: string }) {
  return (
    <div className="card-hover flex flex-col rounded-2xl border border-slate-200 bg-white">
      {/* Banner */}
      <CollegeBanner name={name} ranking={ranking} variant="card" imageUrl={imageUrl} />

      <div className="flex flex-1 flex-col p-6">
        {/* Header */}
        <div className="mb-3">
          <h3 className="truncate text-base font-semibold text-slate-800">{name}</h3>
          <div className="mt-1.5 flex items-center gap-1 text-sm text-slate-500">
            <svg className="h-3.5 w-3.5 shrink-0 text-slate-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 0 1 15 0Z" />
            </svg>
            <span className="truncate">{location}</span>
          </div>
        </div>

      {/* Description */}
      <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-slate-500">
        {description}
      </p>

      {/* Meta */}
      <div className="mb-4 flex items-center gap-3">
        <span className="inline-flex items-center gap-1 rounded-full bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600">
          <svg className="h-3 w-3 text-slate-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342" />
          </svg>
          {courses.length} {courses.length === 1 ? "course" : "courses"}
        </span>
      </div>

      {/* Course tags */}
      <div className="mb-5 flex flex-wrap gap-1.5">
        {courses.slice(0, 2).map((c) => (
          <span key={c.id} className="rounded-full bg-slate-50 px-2.5 py-0.5 text-xs text-slate-500">
            {c.name}
          </span>
        ))}
        {courses.length > 2 && (
          <span className="rounded-full bg-slate-50 px-2.5 py-0.5 text-xs text-slate-400">
            +{courses.length - 2} more
          </span>
        )}
      </div>

      {/* Actions */}
      <div className="mt-auto flex gap-2">
        <Link
          href={`/college/${id}`}
          className="flex-1 rounded-full bg-emerald-500 py-2.5 text-center text-sm font-medium text-white transition-colors hover:bg-emerald-600"
        >
          View Details
        </Link>
        <SaveButton collegeId={id} />
      </div>
      </div>
    </div>
  );
}
