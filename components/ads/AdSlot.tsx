"use client";

import { useEffect } from "react";

interface AdSlotProps {
  slot: string;
  format: "rectangle" | "leaderboard" | "halfpage";
}

const formatDimensions: Record<AdSlotProps["format"], string> = {
  rectangle: "min-h-[250px]",
  leaderboard: "min-h-[90px]",
  halfpage: "min-h-[600px]",
};

export function AdSlot({ slot, format }: AdSlotProps) {
  const adsenseId = process.env.NEXT_PUBLIC_ADSENSE_ID;

  useEffect(() => {
    if (adsenseId) {
      try {
        // @ts-expect-error adsbygoogle is injected by AdSense script
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch {}
    }
  }, [adsenseId]);

  if (!adsenseId) return null;

  return (
    <div className={`${formatDimensions[format]} flex flex-col items-center justify-center`}>
      <p className="text-xs text-[#6B7280] mb-1">Advertisement</p>
      <ins
        className="adsbygoogle block"
        style={{ display: "block" }}
        data-ad-client={adsenseId}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
