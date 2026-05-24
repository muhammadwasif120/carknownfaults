import type { Fault } from "@/lib/types";
import { SeverityBadge } from "./SeverityBadge";

const difficultyLabel: Record<string, string> = {
  easy: "Easy",
  moderate: "Moderate",
  hard: "Hard",
  professional_only: "Professional Only",
};

export function FaultSummaryBox({ fault }: { fault: Fault }) {
  return (
    <div className="bg-[#F3F4F6] border border-[#E5E7EB] rounded-lg p-5 grid grid-cols-2 md:grid-cols-4 gap-4">
      <div>
        <p className="text-xs text-[#6B7280] uppercase tracking-wide mb-1">Severity</p>
        <SeverityBadge severity={fault.severity} />
      </div>
      <div>
        <p className="text-xs text-[#6B7280] uppercase tracking-wide mb-1">DIY Difficulty</p>
        <p className="font-semibold text-[#111827] text-sm">
          {fault.diy_difficulty ? difficultyLabel[fault.diy_difficulty] : "—"}
        </p>
      </div>
      <div>
        <p className="text-xs text-[#6B7280] uppercase tracking-wide mb-1">Est. Cost</p>
        <p className="font-semibold text-[#111827] text-sm">
          {fault.repair_cost_low
            ? `£${fault.repair_cost_low}–£${fault.repair_cost_high}`
            : "Varies"}
        </p>
      </div>
      <div>
        <p className="text-xs text-[#6B7280] uppercase tracking-wide mb-1">OBD Codes</p>
        {fault.obd_codes?.length ? (
          <div className="flex flex-wrap gap-1">
            {fault.obd_codes.map((code) => (
              <code
                key={code}
                className="text-xs bg-white border border-[#E5E7EB] rounded px-1.5 py-0.5 font-mono"
              >
                {code}
              </code>
            ))}
          </div>
        ) : (
          <p className="text-sm text-[#6B7280]">None</p>
        )}
      </div>
    </div>
  );
}
