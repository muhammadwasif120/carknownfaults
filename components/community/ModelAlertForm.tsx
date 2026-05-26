"use client";

import { useState } from "react";

interface ModelAlertFormProps {
  modelId: string;
  makeName: string;
  modelName: string;
}

export function ModelAlertForm({ modelId, makeName, modelName }: ModelAlertFormProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, modelId }),
      });

      const data = await res.json();
      if (res.ok) {
        setStatus("success");
        setMessage(data.message === "Already subscribed" ? "You are already subscribed to alerts for this model." : "Success! You will now receive alerts for this model.");
        setEmail("");
      } else {
        throw new Error(data.error || "Failed to subscribe");
      }
    } catch (err: any) {
      setStatus("error");
      setMessage(err.message);
    }
  };

  return (
    <div className="bg-[#111827] rounded-2xl p-8 mb-16 text-center shadow-xl relative overflow-hidden">
      {/* Background Graphic */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#CC0000] rounded-full blur-[100px] opacity-20 pointer-events-none"></div>
      
      <div className="relative z-10 max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-white mb-2">
          Own a {makeName} {modelName}?
        </h2>
        <p className="text-gray-400 mb-6">
          Enter your email to get a critical alert if a severe new fault or recall is discovered for this specific car. No spam, ever.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={status === "loading" || status === "success"}
            placeholder="Enter your email address"
            className="flex-grow px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-[#CC0000] focus:ring-1 focus:ring-[#CC0000] disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={status === "loading" || status === "success"}
            className="px-6 py-3 bg-[#CC0000] text-white font-semibold rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 whitespace-nowrap"
          >
            {status === "loading" ? "Subscribing..." : status === "success" ? "Subscribed!" : "Get Alerts"}
          </button>
        </form>

        {message && (
          <p className={`mt-4 text-sm font-medium ${status === "success" ? "text-green-400" : "text-red-400"}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
