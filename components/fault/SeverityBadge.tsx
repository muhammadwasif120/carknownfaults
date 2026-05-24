import type { Severity } from "@/lib/types";
import { cn } from "@/components/ui/cn";

const config: Record<Severity, { label: string; className: string }> = {
  critical: { label: "Critical", className: "bg-red-100 text-red-800 border-red-200" },
  severe:   { label: "Severe",   className: "bg-orange-100 text-orange-800 border-orange-200" },
  moderate: { label: "Moderate", className: "bg-amber-100 text-amber-800 border-amber-200" },
  minor:    { label: "Minor",    className: "bg-green-100 text-green-800 border-green-200" },
};

export function SeverityBadge({ severity }: { severity: Severity }) {
  const { label, className } = config[severity] ?? config.minor;
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wide border",
        className
      )}
    >
      {label}
    </span>
  );
}
