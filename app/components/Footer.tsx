import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-100 bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 text-lg font-bold text-slate-800">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500 text-xs text-white">
                C
              </span>
              CollegeDiscover
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-slate-500">
              India&apos;s trusted platform to discover, compare, and choose the
              right college for your future.
            </p>
          </div>

          {/* Explore */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Explore
            </h4>
            <ul className="mt-4 space-y-2.5">
              <li>
                <Link href="/" className="text-sm text-slate-600 transition-colors hover:text-emerald-600">
                  Browse Colleges
                </Link>
              </li>
              <li>
                <Link href="/compare" className="text-sm text-slate-600 transition-colors hover:text-emerald-600">
                  Compare Colleges
                </Link>
              </li>
              <li>
                <Link href="/predictor" className="text-sm text-slate-600 transition-colors hover:text-emerald-600">
                  College Predictor
                </Link>
              </li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Account
            </h4>
            <ul className="mt-4 space-y-2.5">
              <li>
                <Link href="/saved" className="text-sm text-slate-600 transition-colors hover:text-emerald-600">
                  Saved Colleges
                </Link>
              </li>
            </ul>
          </div>

          {/* Built With */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Built With
            </h4>
            <ul className="mt-4 space-y-2.5">
              <li className="text-sm text-slate-500">Next.js 16</li>
              <li className="text-sm text-slate-500">TypeScript</li>
              <li className="text-sm text-slate-500">PostgreSQL (Neon)</li>
              <li className="text-sm text-slate-500">Prisma ORM</li>
              <li className="text-sm text-slate-500">Tailwind CSS v4</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-slate-200 pt-6">
          <p className="text-center text-xs text-slate-400">
            © {new Date().getFullYear()} CollegeDiscover — Built for educational purposes.
          </p>
        </div>
      </div>
    </footer>
  );
}
