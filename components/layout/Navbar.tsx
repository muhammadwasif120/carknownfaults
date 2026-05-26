"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { SearchBar } from "@/components/search/SearchBar";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-[#E5E7EB] shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center gap-4">
        {/* Logo */}
        <Link href="/" className="flex-shrink-0 flex flex-col leading-none">
          <span className="text-2xl font-bold text-[#CC0000] tracking-tight">CKF</span>
          <span className="text-[10px] text-[#6B7280] -mt-0.5">Car Known Faults</span>
        </Link>

        {/* Desktop search */}
        <div className="hidden md:flex flex-1 mx-4">
          <SearchBar className="w-full" />
        </div>

        {/* Desktop CTA */}
        <Link
          href="/submit"
          className="hidden md:inline-flex items-center px-4 py-2 border border-[#CC0000] text-[#CC0000] text-sm font-semibold rounded-lg hover:bg-[#CC0000] hover:text-white transition-colors flex-shrink-0"
        >
          Submit a Fault
        </Link>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden ml-auto p-2 text-[#374151]"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="md:hidden border-t border-[#E5E7EB] px-4 py-4 space-y-3 bg-white">
          <SearchBar />
          <Link
            href="/submit"
            onClick={() => setMobileOpen(false)}
            className="block w-full text-center px-4 py-2 border border-[#CC0000] text-[#CC0000] text-sm font-semibold rounded-lg"
          >
            Submit a Fault
          </Link>
          <nav className="flex flex-col gap-2 text-sm font-medium text-[#374151]">
            <Link href="/makes" onClick={() => setMobileOpen(false)}>All Makes</Link>
            <Link href="/buyers-guides" onClick={() => setMobileOpen(false)}>Buyer's Guides</Link>
            <Link href="/mot-checks" onClick={() => setMobileOpen(false)}>MOT Pass Rates</Link>
            <Link href="/fault-codes" onClick={() => setMobileOpen(false)}>OBD-II Codes</Link>
            <Link href="/about" onClick={() => setMobileOpen(false)}>About</Link>
          </nav>
        </div>
      )}
    </header>
  );
}
