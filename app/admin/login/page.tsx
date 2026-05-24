"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/admin` },
    });
    if (error) { setError(error.message); return; }
    setSent(true);
  }

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F3F4F6]">
        <div className="bg-white rounded-xl p-8 max-w-md w-full text-center shadow">
          <p className="text-2xl mb-2">📧</p>
          <h1 className="text-xl font-bold text-[#111827] mb-2">Check your email</h1>
          <p className="text-[#6B7280] text-sm">
            A magic link has been sent to <strong>{email}</strong>. Click it to access the admin area.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F3F4F6]">
      <div className="bg-white rounded-xl p-8 max-w-md w-full shadow">
        <div className="text-center mb-6">
          <span className="text-3xl font-bold text-[#CC0000]">CKF</span>
          <p className="text-[#6B7280] text-sm mt-1">Admin Access</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#111827] mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-[#E5E7EB] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#CC0000]"
              placeholder="admin@carknownfaults.com"
            />
          </div>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full py-2.5 bg-[#CC0000] text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
          >
            Send Magic Link
          </button>
        </form>
      </div>
    </div>
  );
}
