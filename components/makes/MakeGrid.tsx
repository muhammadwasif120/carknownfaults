import type { Make } from "@/lib/types";
import { MakeCard } from "./MakeCard";

export function MakeGrid({ makes }: { makes: Make[] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
      {makes.map((make) => (
        <MakeCard key={make.id} make={make} />
      ))}
    </div>
  );
}
