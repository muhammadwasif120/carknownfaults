"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import type { Fault } from "@/lib/types";

interface SearchSuggestion {
  fault: Fault & {
    variants: { slug: string; name: string; models: { slug: string; name: string; makes: { slug: string; name: string } } };
  };
}

interface SearchBarProps {
  placeholder?: string;
  className?: string;
}

export function SearchBar({ placeholder = "Search for a car fault...", className = "" }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<SearchSuggestion["fault"][]>([]);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (query.length < 2) { setSuggestions([]); setOpen(false); return; }

    debounceRef.current = setTimeout(async () => {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}&limit=5`);
      if (res.ok) {
        const data = await res.json();
        setSuggestions(data.results ?? []);
        setOpen(true);
      }
    }, 300);
  }, [query]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (query.trim()) {
      setOpen(false);
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  }

  function getFaultHref(fault: SearchSuggestion["fault"]) {
    const { variants: v } = fault;
    return `/${v.models.makes.slug}/${v.models.slug}/${v.slug}/${fault.slug}`;
  }

  return (
    <div ref={wrapperRef} className={`relative ${className}`}>
      <form onSubmit={handleSubmit} className="flex items-center bg-white border border-[#E5E7EB] rounded-lg overflow-hidden shadow-sm">
        <span className="pl-4 text-[#6B7280]">
          <Search size={18} />
        </span>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="flex-1 px-3 py-3 text-[#374151] placeholder-[#6B7280] outline-none bg-transparent text-sm"
          aria-label="Search faults"
        />
        <button
          type="submit"
          className="px-5 py-3 bg-[#CC0000] text-white text-sm font-semibold hover:bg-red-700 transition-colors"
        >
          Search
        </button>
      </form>

      {open && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#E5E7EB] rounded-lg shadow-lg z-50 overflow-hidden">
          {suggestions.map((fault) => (
            <button
              key={fault.id}
              onClick={() => { setOpen(false); router.push(getFaultHref(fault)); }}
              className="w-full text-left px-4 py-3 hover:bg-[#F3F4F6] transition-colors border-b border-[#E5E7EB] last:border-0"
            >
              <p className="text-sm font-medium text-[#111827]">{fault.title}</p>
              <p className="text-xs text-[#6B7280] mt-0.5">
                {fault.variants?.models?.makes?.name} › {fault.variants?.models?.name} › {fault.variants?.name}
              </p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
