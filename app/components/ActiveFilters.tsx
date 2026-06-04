"use client";

interface Filter {
  key: string;
  label: string;
  value: string;
}

interface ActiveFiltersProps {
  filters: Filter[];
  onRemove: (key: string) => void;
  onClearAll: () => void;
}

export default function ActiveFilters({ filters, onRemove, onClearAll }: ActiveFiltersProps) {
  const active = filters.filter((f) => f.value.trim() !== "");
  if (active.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs font-medium text-slate-400">Filters:</span>
      {active.map((f) => (
        <span
          key={f.key}
          className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700"
        >
          <span className="text-emerald-400">{f.label}:</span>
          {f.value}
          <button
            onClick={() => onRemove(f.key)}
            className="ml-0.5 inline-flex h-3.5 w-3.5 items-center justify-center rounded-full text-emerald-400 hover:bg-emerald-200 hover:text-emerald-700"
            aria-label={`Remove ${f.label} filter`}
          >
            <svg className="h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </span>
      ))}
      {active.length > 1 && (
        <button onClick={onClearAll} className="text-xs font-medium text-slate-400 hover:text-slate-600">
          Clear all
        </button>
      )}
    </div>
  );
}
