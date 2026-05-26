import type { Metadata } from "next";
import Script from "next/script";
import { createClient } from "@/lib/supabase/server";
import { SearchBar } from "@/components/search/SearchBar";
import { MakeGrid } from "@/components/makes/MakeGrid";
import { FaultCard } from "@/components/fault/FaultCard";
import { TagChip } from "@/components/ui/TagChip";
import { generateWebsiteSchema } from "@/lib/utils/seo";
import type { Make, Fault, Tag } from "@/lib/types";
import { Search, ShoppingCart, CheckCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Car Known Faults by Make & Model | CKF",
  description:
    "Browse known faults for every car make, model, and variant. Forum-sourced, organised for used car buyers and DIY mechanics.",
};

export const revalidate = 86400;

export default async function HomePage() {
  const supabase = await createClient();

  const [{ data: makes }, { data: recentFaults }, { data: tags }] = await Promise.all([
    supabase.from("makes").select("*").order("name"),
    supabase
      .from("faults")
      .select("*, variants(slug, name, models(slug, name, makes(slug, name)))")
      .eq("published", true)
      .order("created_at", { ascending: false })
      .limit(6),
    supabase.from("tags").select("*").order("name"),
  ]);

  return (
    <>
      <Script
        id="website-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: generateWebsiteSchema() }}
      />

      {/* Hero */}
      <section className="bg-[#111827] text-white py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">Know Before You Buy</h1>
          <p className="text-gray-300 text-lg mb-8">
            Search 50,000+ known faults across every car make and model
          </p>
          <SearchBar
            placeholder='Try "Ford Focus EGR failure" or "BMW 3 Series N47"'
            className="max-w-2xl mx-auto"
          />
          <p className="text-gray-500 text-xs mt-3">
            Example: Ford Focus 1.6 TDCi · VW Golf 2.0 TDI · BMW 320d E90
          </p>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="bg-white py-6 border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-6 sm:gap-12">
            <div className="flex items-center gap-2 text-[#6B7280]">
              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
              <span className="text-sm font-medium">Data corroborated by mechanics</span>
            </div>
            <div className="flex items-center gap-2 text-[#6B7280]">
              <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
              <span className="text-sm font-medium">Official DVSA MOT Data Integrated</span>
            </div>
            <div className="flex items-center gap-2 text-[#6B7280]">
              <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
              <span className="text-sm font-medium">100% Free & Independent</span>
            </div>
          </div>
        </div>
      </section>

      {/* Makes Grid */}
      <section className="max-w-6xl mx-auto px-4 py-14">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-[#111827]">Browse by Make</h2>
          <a href="/makes" className="text-sm text-[#CC0000] font-medium hover:underline">
            View all makes →
          </a>
        </div>
        {makes && <MakeGrid makes={makes as Make[]} />}
      </section>

      {/* How It Works */}
      <section className="bg-[#F3F4F6] py-14 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-[#111827] text-center mb-10">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Search, step: "1. Search", desc: "Enter your car make, model, or a specific fault you're concerned about." },
              { icon: ShoppingCart, step: "2. Browse", desc: "Read detailed fault reports with symptoms, causes, and real-world fix costs." },
              { icon: CheckCircle, step: "3. Buy With Confidence", desc: "Know exactly what to check before handing over any money." },
            ].map(({ icon: Icon, step, desc }) => (
              <div key={step} className="flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-full bg-[#CC0000] text-white flex items-center justify-center mb-4">
                  <Icon size={24} />
                </div>
                <h3 className="font-bold text-[#111827] mb-2">{step}</h3>
                <p className="text-[#374151] text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Faults */}
      {recentFaults && recentFaults.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 py-14">
          <h2 className="text-2xl font-bold text-[#111827] mb-6">Recently Added Faults</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {(recentFaults as any[]).map((fault) => {
              const v = fault.variants;
              const href = v ? `/${v.models?.makes?.slug}/${v.models?.slug}/${v.slug}/${fault.slug}` : "#";
              return <FaultCard key={fault.id} fault={fault} href={href} />;
            })}
          </div>
        </section>
      )}

      {/* Popular Tags */}
      {tags && tags.length > 0 && (
        <section className="bg-[#F3F4F6] py-14 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-[#111827] mb-6">Browse by Component</h2>
            <div className="flex flex-wrap gap-2 justify-center">
              {(tags as Tag[]).map((tag) => (
                <TagChip key={tag.id} name={tag.name} slug={tag.slug} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* SEO text */}
      <section className="max-w-3xl mx-auto px-4 py-14 text-sm text-[#6B7280] leading-relaxed">
        <p>
          Car Known Faults (CKF) is the UK&apos;s most comprehensive database of real-world car problems,
          compiled from forums, owner reports, and independent garage data. Whether you&apos;re buying a
          used Ford Focus, a second-hand BMW 3 Series, or a pre-owned Volkswagen Golf, our database
          covers the known issues you need to watch for. Every fault includes symptoms, root causes,
          DIY fix guides, and estimated repair costs — giving you the knowledge to negotiate, inspect,
          or walk away.
        </p>
      </section>
    </>
  );
}
