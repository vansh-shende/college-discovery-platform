import Link from "next/link";
import SaveButton from "../../components/SaveButton";
import CollegeBanner from "../../components/CollegeBanner";
import type { College } from "@/app/types";
import prisma from "@/src/lib/prisma";

export const dynamic = "force-dynamic";

async function getCollege(id: string): Promise<College | null> {
  try {
    const data = await prisma.college.findUnique({
      where: { id },
      include: {
        courses: {
          select: {
            id: true,
            name: true,
            fees: true,
            duration: true,
          },
        },
      },
    });
    return data as any;
  } catch { return null; }
}

function fmt(amount: number): string {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount);
}

export default async function CollegeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const college = await getCollege(id);

  if (!college) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <svg className="mb-4 h-12 w-12 text-slate-300" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
        </svg>
        <h1 className="text-xl font-bold text-slate-800">College Not Found</h1>
        <p className="mt-2 text-sm text-slate-500">The college you&apos;re looking for doesn&apos;t exist or has been removed.</p>
        <Link href="/" className="mt-5 inline-flex items-center rounded-full bg-emerald-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-600">
          ← Back to Colleges
        </Link>
      </div>
    );
  }

  const avgFees = college.courses.length > 0 ? college.courses.reduce((s, c) => s + c.fees, 0) / college.courses.length : 0;
  const minD = Math.min(...college.courses.map((c) => c.duration));
  const maxD = Math.max(...college.courses.map((c) => c.duration));
  const dur = minD === maxD ? `${minD} ${minD === 1 ? "year" : "years"}` : `${minD}–${maxD} years`;

  return (
    <div>
      {/* Breadcrumb */}
      <nav className="mb-8 flex items-center gap-2 text-sm text-slate-500">
        <Link href="/" className="transition-colors hover:text-emerald-600">Colleges</Link>
        <svg className="h-3.5 w-3.5 text-slate-300" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
        </svg>
        <span className="font-medium text-slate-700">{college.name}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main */}
        <div className="space-y-8 lg:col-span-2">
          {/* Header */}
          <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
            {/* @ts-ignore: imageUrl is allowed for future manual usage */}
            <CollegeBanner name={college.name} ranking={college.ranking} variant="detail" imageUrl={(college as any).imageUrl} />
            <div className="p-6 sm:p-8">
              <div className="flex flex-wrap items-start gap-3">
                <div className="min-w-0 flex-1">
                  <h1 className="text-2xl font-bold text-slate-800">{college.name}</h1>
                  <div className="mt-2 flex items-center gap-1.5 text-sm text-slate-500">
                    <svg className="h-4 w-4 shrink-0 text-slate-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 0 1 15 0Z" />
                    </svg>
                    {college.location}
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400">About</h2>
                <p className="leading-relaxed text-slate-600">{college.description}</p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { label: "Ranking", value: `#${college.ranking}` },
              { label: "Programs", value: college.courses.length },
              { label: "Avg. Fees", value: fmt(avgFees) },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl border border-slate-200 bg-white p-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{s.label}</p>
                <p className="mt-1.5 text-2xl font-bold text-slate-800">{s.value}</p>
              </div>
            ))}
          </div>

          {/* Courses */}
          <div className="rounded-2xl border border-slate-200 bg-white">
            <div className="border-b border-slate-100 px-6 py-5">
              <h2 className="text-lg font-semibold text-slate-800">Courses Offered</h2>
              <p className="mt-0.5 text-sm text-slate-500">
                {college.courses.length} {college.courses.length === 1 ? "program" : "programs"} available
                {college.courses.length > 0 && ` · Duration: ${dur}`}
              </p>
            </div>
            {college.courses.length === 0 ? (
              <div className="p-6 text-center text-sm text-slate-500">No courses listed.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/60">
                      <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Course Name</th>
                      <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Annual Fees</th>
                      <th className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    {college.courses.map((c, i) => (
                      <tr key={c.id} className={`border-b border-slate-50 transition-colors hover:bg-slate-50/50 ${i % 2 !== 0 ? "bg-slate-50/30" : ""}`}>
                        <td className="px-6 py-3.5 font-medium text-slate-800">{c.name}</td>
                        <td className="px-6 py-3.5 text-slate-600">{fmt(c.fees)}</td>
                        <td className="px-6 py-3.5 text-slate-600">{c.duration} {c.duration === 1 ? "year" : "years"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 lg:sticky lg:top-20">
            <h3 className="text-sm font-semibold text-slate-800">Interested in this college?</h3>
            <p className="mt-1 text-xs text-slate-500">Save it to your list for quick access later.</p>
            <div className="mt-4">
              <SaveButton collegeId={college.id} variant="detail" className="w-full" />
            </div>
            <div className="mt-4 border-t border-slate-100 pt-4">
              <Link href="/compare" className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-slate-200 bg-white py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25a2.25 2.25 0 0 1-2.25-2.25v-2.25Z" />
                </svg>
                Compare Colleges
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <h3 className="mb-4 text-sm font-semibold text-slate-800">Quick Info</h3>
            <dl className="space-y-3">
              {[
                { label: "Location", value: college.location },
                { label: "Ranking", value: `#${college.ranking}` },
                { label: "Programs", value: college.courses.length },
              ].map((item) => (
                <div key={item.label} className="flex justify-between text-sm">
                  <dt className="text-slate-500">{item.label}</dt>
                  <dd className="font-medium text-slate-800">{item.value}</dd>
                </div>
              ))}
              {college.courses.length > 0 && (
                <>
                  <div className="flex justify-between text-sm">
                    <dt className="text-slate-500">Fee Range</dt>
                    <dd className="font-medium text-slate-800">{fmt(Math.min(...college.courses.map((c) => c.fees)))} – {fmt(Math.max(...college.courses.map((c) => c.fees)))}</dd>
                  </div>
                  <div className="flex justify-between text-sm">
                    <dt className="text-slate-500">Duration</dt>
                    <dd className="font-medium text-slate-800">{dur}</dd>
                  </div>
                </>
              )}
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
