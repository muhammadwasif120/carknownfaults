import Link from "next/link";

interface TagChipProps {
  name: string;
  slug: string;
}

export function TagChip({ name, slug }: TagChipProps) {
  return (
    <Link
      href={`/tags/${slug}`}
      className="inline-flex items-center px-3 py-1.5 bg-[#F3F4F6] border border-[#E5E7EB] rounded-full text-sm text-[#374151] hover:bg-[#CC0000] hover:text-white hover:border-[#CC0000] transition-colors"
    >
      {name}
    </Link>
  );
}
