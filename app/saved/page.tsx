import Link from "next/link";
import EmptyState from "../components/EmptyState";
import CollegeBanner from "../components/CollegeBanner";
import SaveButton from "../components/SaveButton";
import type { SavedItem } from "@/app/types";
import prisma from "@/src/lib/prisma";

export const dynamic = "force-dynamic";

const DEMO_USER_ID = "ef06df50-d216-492d-a3c7-ce4c17c71dab";

async function getSavedColleges(): Promise<SavedItem[]> {
  try {
    const data = await prisma.savedItem.findMany({
      where: { userId: DEMO_USER_ID },
      include: {
        college: {
          select: {
            id: true,
            name: true,
            location: true,
            ranking: true,
            description: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return data as any;
  } catch { return []; }
}

export default async function SavedPage() {
  const savedItems = await getSavedColleges();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Saved Colleges</h1>
        <p className="mt-1 text-sm text-slate-500">Your bookmarked colleges for quick access</p>
      </div>

      {savedItems.length === 0 && (
        <EmptyState
          icon="bookmark"
          title="No saved colleges yet"
          description="Browse colleges and save the ones you like to compare them later."
          actionLabel="Browse Colleges"
          actionHref="/"
        />
      )}

      {savedItems.length > 0 && (
        <>
          <p className="mb-5 text-sm text-slate-500">
            <span className="font-semibold text-slate-700">{savedItems.length}</span> saved{" "}
            {savedItems.length === 1 ? "college" : "colleges"}
          </p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {savedItems.map((item) => (
              <div key={item.id} className="card-hover flex flex-col rounded-2xl border border-slate-200 bg-white">
                {/* @ts-ignore: imageUrl is allowed for future manual usage */}
                <CollegeBanner name={item.college.name} ranking={item.college.ranking} variant="card" imageUrl={(item.college as any).imageUrl} />
                <div className="flex flex-1 flex-col p-6">
                <div className="mb-3">
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-base font-semibold text-slate-800">{item.college.name}</h3>
                    <div className="mt-1.5 flex items-center gap-1 text-sm text-slate-500">
                      <svg className="h-3.5 w-3.5 shrink-0 text-slate-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 0 1 15 0Z" />
                      </svg>
                      <span className="truncate">{item.college.location}</span>
                    </div>
                  </div>
                </div>

                <p className="mb-4 line-clamp-2 text-sm leading-relaxed text-slate-500">{item.college.description}</p>

                <div className="mt-auto flex items-center justify-between gap-4">
                  <span className="text-xs text-slate-400">
                    Saved {new Date(item.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </span>
                  <div className="flex gap-2 shrink-0">
                    <Link
                      href={`/college/${item.collegeId}`}
                      className="rounded-full bg-emerald-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-600 flex items-center"
                    >
                      View Details
                    </Link>
                    <SaveButton collegeId={item.collegeId} initialStatus="saved" />
                  </div>
                </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
