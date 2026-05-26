"use client";

import { useState } from "react";
import { CheckCircle, UploadCloud } from "lucide-react";
import { createClient } from "@supabase/supabase-js";

export default function SubmitPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const form = e.currentTarget;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    // Handle image upload if present
    const imageFile = formData.get("image") as File;
    if (imageFile && imageFile.size > 0) {
      try {
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
        const { error: uploadError } = await supabase.storage.from("submissions").upload(fileName, imageFile);
        
        if (!uploadError) {
          data.image_url = supabase.storage.from("submissions").getPublicUrl(fileName).data.publicUrl;
        }
      } catch (err) {
        console.error("Image upload failed", err);
      }
    }
    
    await fetch("/api/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setSubmitted(true);
    setLoading(false);
  }

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-[#111827] mb-2">Thank you!</h1>
        <p className="text-[#374151]">
          Your fault submission has been received. Our team will review it and add it to the database.
        </p>
        <a href="/" className="mt-6 inline-block text-[#CC0000] hover:underline">
          Back to home
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-[#111827] mb-2">Submit a Fault</h1>
      <p className="text-[#6B7280] mb-8">
        Know about a fault that is not in our database? Share it and help other buyers.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#111827] mb-1">Make *</label>
            <input name="make" required placeholder="e.g. Ford" className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#CC0000]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#111827] mb-1">Model *</label>
            <input name="model" required placeholder="e.g. Focus" className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#CC0000]" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#111827] mb-1">Variant / Engine</label>
            <input name="variant" placeholder="e.g. Mk2 1.6 TDCi" className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#CC0000]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#111827] mb-1">Year Range</label>
            <input name="year_range" placeholder="e.g. 2005-2010" className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#CC0000]" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#111827] mb-1">Fault Title *</label>
          <input name="title" required placeholder="e.g. EGR Valve Failure" className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#CC0000]" />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#111827] mb-1">Description *</label>
          <textarea
            name="description"
            required
            rows={5}
            placeholder="Describe the symptoms, what causes it, and how you found out about it..."
            className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#CC0000] resize-y"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#111827] mb-1">Severity (your estimate)</label>
          <select name="severity" className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#CC0000]">
            <option value="">Select severity</option>
            <option value="minor">Minor — easily fixed or lived with</option>
            <option value="moderate">Moderate — common, budget for it</option>
            <option value="severe">Severe — major fault, price down</option>
            <option value="critical">Critical — safety risk, avoid</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#111827] mb-1">OBD Codes (if known)</label>
          <input name="obd_codes" placeholder="e.g. P0401, P0403" className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#CC0000]" />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#111827] mb-1">Upload Photo (optional)</label>
          <div className="flex items-center gap-3">
             <input type="file" name="image" accept="image/*" className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#CC0000] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-[#CC0000] hover:file:bg-red-100" />
          </div>
          <p className="text-xs text-gray-500 mt-1">Provide a photo of the broken part or dashboard warning.</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#111827] mb-1">Your Email (optional)</label>
          <input name="email" type="email" placeholder="For follow-up only, never published" className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#CC0000]" />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-[#CC0000] text-white font-semibold rounded-lg hover:bg-red-700 transition-colors disabled:opacity-60"
        >
          {loading ? "Submitting…" : "Submit Fault"}
        </button>
      </form>
    </div>
  );
}
