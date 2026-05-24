interface CostTableProps {
  costLow: number;
  costHigh: number;
}

export function CostTable({ costLow, costHigh }: CostTableProps) {
  const rows = [
    { label: "DIY (parts only)", low: Math.round(costLow * 0.4), high: Math.round(costHigh * 0.4) },
    { label: "Independent Garage", low: costLow, high: costHigh },
    { label: "Main Dealership", low: Math.round(costLow * 1.6), high: Math.round(costHigh * 1.6) },
  ];

  return (
    <div className="overflow-hidden rounded-lg border border-[#E5E7EB]">
      <table className="w-full text-sm">
        <thead className="bg-[#F3F4F6]">
          <tr>
            <th className="text-left px-4 py-3 font-semibold text-[#111827]">Repair Option</th>
            <th className="text-right px-4 py-3 font-semibold text-[#111827]">Est. Cost (GBP)</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#E5E7EB]">
          {rows.map((row) => (
            <tr key={row.label} className="bg-white">
              <td className="px-4 py-3 text-[#374151]">{row.label}</td>
              <td className="px-4 py-3 text-right font-medium text-[#111827]">
                £{row.low}–£{row.high}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
