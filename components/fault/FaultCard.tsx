import Link from "next/link";
import type { Fault } from "@/lib/types";
import { SeverityBadge } from "./SeverityBadge";

interface FaultCardProps {
  fault: Fault;
  href: string;
}

function costColor(low: number | null): string {
  if (!low) return "text-gray-600";
  if (low < 200) return "text-green-700";
  if (low < 800) return "text-amber-700";
  return "text-red-700";
}

export function FaultCard({ fault, href }: FaultCardProps) {
  return (
    <Link
      href={href}
      className="block bg-white border border-[#E5E7EB] rounded-lg p-5 hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <h3 className="font-semibold text-[#111827] text-base leading-tight">{fault.title}</h3>
        <SeverityBadge severity={fault.severity} />
      </div>

      <div className="flex flex-wrap gap-3 text-xs text-[#6B7280] mb-3">
        {fault.affected_years && <span>{fault.affected_years}</span>}
        {fault.mileage_start && (
          <span>{fault.mileage_start.toLocaleString()}–{fault.mileage_end?.toLocaleString() ?? "+"} miles</span>
        )}
        {fault.repair_cost_low && (
          <span className={`font-medium ${costColor(fault.repair_cost_low)}`}>
            £{fault.repair_cost_low}–£{fault.repair_cost_high}
          </span>
        )}
      </div>

      <p className="text-sm text-[#374151] line-clamp-2">{fault.summary}</p>
    </Link>
  );
}
