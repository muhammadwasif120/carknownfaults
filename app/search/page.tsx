"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { SearchBar } from "@/components/search/SearchBar";
import { FaultCard } from "@/components/fault/FaultCard";
import { Suspense } from "react";

function SearchResults() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") ?? "";
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!q) { setResults([]); return; }
    setLoading(true);
    fetch(`/api/search?q=${encodeURIComponent(q)}&limit=20`)
      .then((r) => r.json())
      .then((d) => { setResults(d.results ?? []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [q]);

  return (
    <div>
      {q && (
        <p className="text-[#6B7280] mb-6">
          {loading ? "Searching…" : `${results.length} result${results.length !== 1 ? "s" : ""} for "${q}"`}
        </p>
      )}

      {results.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {results.map((fault: any) => {
            const v = fault.variants;
            const href = v
              ? `/${v.models?.makes?.slug}/${v.models?.slug}/${v.slug}/${fault.slug}`
              : "#";
            return <FaultCard key={fault.id} fault={fault} href={href} />;
          })}
        </div>
      ) : (
        !loading && q && (
          <div className="text-center py-16">
            <p className="text-2xl mb-2">🔍</p>
            <p className="text-[#111827] font-semibold text-lg mb-2">No results found</p>
            <p className="text-[#6B7280] text-sm">
              Try searching for a make, model, or fault type.
            </p>
          </div>
        )
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-[#111827] mb-6">Search Faults</h1>
      <div className="mb-8 max-w-2xl">
        <SearchBar placeholder="Search by fault, make, model..." />
      </div>
      <Suspense fallback={<p className="text-[#6B7280]">Loading…</p>}>
        <SearchResults />
      </Suspense>
    </div>
  );
}
