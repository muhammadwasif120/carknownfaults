import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About CKF | Car Known Faults",
  description:
    "Learn how Car Known Faults (CKF) collects and verifies real-world car fault data to help used car buyers.",
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-[#111827] mb-6">About Car Known Faults</h1>

      <div className="prose prose-slate max-w-none space-y-6 text-[#374151]">
        <p className="text-lg">
          Car Known Faults (CKF) is an independent database of real-world vehicle problems, compiled
          from owner forums, enthusiast communities, and independent garage reports across the UK.
        </p>

        <h2 className="text-xl font-bold text-[#111827]">Our Mission</h2>
        <p>
          Used car buying is one of the most expensive decisions most people make. Yet the information
          needed to make a good decision — what goes wrong, how often, and what it costs to fix — is
          scattered across hundreds of forums, buried in YouTube comments, or locked behind expensive
          reports.
        </p>
        <p>
          CKF puts this knowledge in one place, structured and searchable, so that anyone can walk
          into a used car purchase with the same knowledge as an experienced mechanic.
        </p>

        <h2 className="text-xl font-bold text-[#111827]">The Data</h2>
        <p>
          All fault reports are compiled from publicly available community sources and structured by
          our editorial team. We include symptoms, root causes, DIY fix guides, and estimated repair
          costs based on real quotes from independent garages.
        </p>
        <p>
          Costs are indicative estimates only — always get a quote from a qualified mechanic before
          proceeding with any repair.
        </p>

        <h2 className="text-xl font-bold text-[#111827]">Who We Are</h2>
        <p>
          CKF is operated by Two Bit Digital Ltd, a small UK software company. We are not affiliated
          with any car manufacturer, garage chain, or parts retailer.
        </p>

        <h2 className="text-xl font-bold text-[#111827]">Submit a Fault</h2>
        <p>
          Know about a fault that is not in our database?{" "}
          <a href="/submit" className="text-[#CC0000] hover:underline">
            Submit it here
          </a>{" "}
          and help fellow car buyers.
        </p>
      </div>
    </div>
  );
}
