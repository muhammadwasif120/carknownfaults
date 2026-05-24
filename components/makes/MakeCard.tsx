import Link from "next/link";
import type { Make } from "@/lib/types";

export function MakeCard({ make }: { make: Make }) {
  return (
    <Link
      href={`/${make.slug}`}
      className="flex flex-col items-center justify-center gap-2 bg-white border border-[#E5E7EB] rounded-lg p-4 hover:shadow-md hover:border-[#CC0000] transition-all group"
    >
      {make.logo_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={make.logo_url} alt={make.name} className="h-10 w-auto object-contain" />
      ) : (
        <div className="h-10 w-10 rounded-full bg-[#F3F4F6] flex items-center justify-center text-[#CC0000] font-bold text-lg">
          {make.name[0]}
        </div>
      )}
      <span className="text-sm font-semibold text-[#111827] group-hover:text-[#CC0000] transition-colors">
        {make.name}
      </span>
      {make.fault_count > 0 && (
        <span className="text-xs text-[#6B7280]">{make.fault_count} faults</span>
      )}
    </Link>
  );
}
