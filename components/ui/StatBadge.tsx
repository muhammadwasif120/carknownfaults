interface StatBadgeProps {
  value: string | number;
  label: string;
}

export function StatBadge({ value, label }: StatBadgeProps) {
  return (
    <div className="bg-[#F3F4F6] border border-[#E5E7EB] rounded-lg px-4 py-3 text-center">
      <p className="text-2xl font-bold text-[#CC0000]">{value}</p>
      <p className="text-xs text-[#6B7280] mt-0.5">{label}</p>
    </div>
  );
}
