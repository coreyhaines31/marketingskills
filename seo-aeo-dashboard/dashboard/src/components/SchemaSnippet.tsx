"use client";

import { useState } from "react";

interface Props {
  title: string;
  code: string;
  note?: string;
}

export default function SchemaSnippet({ title, code, note }: Props) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(
      `<script type="application/ld+json">\n${code}\n</script>`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="rounded-lg border border-slate-200 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50 border-b border-slate-200">
        <span className="text-xs font-medium text-slate-700">{title}</span>
        <button
          onClick={copy}
          className={`text-xs px-3 py-1 rounded font-medium transition-colors ${
            copied
              ? "bg-emerald-100 text-emerald-700"
              : "bg-white border border-slate-300 text-slate-600 hover:border-blue-400 hover:text-blue-600"
          }`}
        >
          {copied ? "✓ Copied!" : "Copy <script> tag"}
        </button>
      </div>
      {note && (
        <div className="px-4 py-2 bg-amber-50 border-b border-amber-100 text-xs text-amber-700">
          {note}
        </div>
      )}
      <pre className="text-xs text-slate-700 bg-slate-900 text-green-300 p-4 overflow-x-auto leading-relaxed max-h-72 overflow-y-auto">
        <code>{`<script type="application/ld+json">\n${code}\n</script>`}</code>
      </pre>
    </div>
  );
}
