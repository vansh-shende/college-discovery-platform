export default function CardSkeleton() {
  return (
    <div className="flex flex-col rounded-2xl border border-slate-200 bg-white">
      <div className="skeleton h-40 w-full rounded-t-2xl rounded-b-none" />
      <div className="flex flex-1 flex-col p-6">
        <div className="mb-3 flex items-start justify-between">
          <div className="flex-1 pr-3">
            <div className="skeleton h-5 w-3/4" />
            <div className="skeleton mt-2 h-3.5 w-1/2" />
          </div>
        </div>
        <div className="mb-4 space-y-2">
          <div className="skeleton h-3.5 w-full" />
          <div className="skeleton h-3.5 w-5/6" />
        </div>
        <div className="mb-5 flex gap-2">
          <div className="skeleton h-6 w-16 rounded-full" />
          <div className="skeleton h-6 w-20 rounded-full" />
        </div>
        <div className="mt-auto flex gap-2">
          <div className="skeleton h-10 flex-1 rounded-full" />
          <div className="skeleton h-10 w-24 rounded-full" />
        </div>
      </div>
    </div>
  );
}
