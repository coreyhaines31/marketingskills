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
            <span className="text-xs text-slate-500">UK Music Venues — prototype</span>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-6 py-8">{children}</main>
      </body>
    </html>
  );
}
