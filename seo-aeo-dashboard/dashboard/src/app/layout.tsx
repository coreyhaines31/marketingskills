import "./globals.css";
import Link from "next/link";
import type { ReactNode } from "react";

export const metadata = {
  title: "AEO + GEO Dashboard | UK Music Venues",
  description: "Generative & Answer Engine Optimisation scoring for UK music venues.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="/" className="font-semibold text-lg text-slate-900">
              AEO + GEO Dashboard
            </Link>
            <nav className="flex items-center gap-6">
              <Link href="/" className="text-sm text-slate-600 hover:text-slate-900">Overview</Link>
              <Link href="/action-plan" className="text-sm text-slate-600 hover:text-slate-900">Action Plan</Link>
              <Link href="/benchmarking" className="text-sm text-slate-600 hover:text-slate-900">Benchmarking</Link>
              <span className="text-xs text-slate-400">UK Music Venues — prototype</span>
            </nav>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-6 py-8">{children}</main>
      </body>
    </html>
  );
}
