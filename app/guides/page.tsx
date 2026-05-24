import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Car Buying Guides | CKF",
  description: "Practical guides for used car buyers — what to check, common red flags, and how to negotiate.",
};

export default function GuidesPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-[#111827] mb-4">Car Buying Guides</h1>
      <p className="text-[#374151] mb-8">
        In-depth guides to help you buy a used car with confidence.
      </p>
      <p className="text-[#6B7280] text-sm">Guides coming soon.</p>
    </div>
  );
}
