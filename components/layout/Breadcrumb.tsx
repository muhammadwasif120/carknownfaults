import Link from "next/link";
import type { BreadcrumbItem } from "@/lib/types";
import { generateBreadcrumbSchema } from "@/lib/utils/seo";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://carknownfaults.com";

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  const schemaItems = items.map((item, i) => ({
    name: item.label,
    url: item.href ? `${SITE_URL}${item.href}` : `${SITE_URL}/`,
  }));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: generateBreadcrumbSchema(schemaItems) }}
      />
      <nav aria-label="Breadcrumb" className="text-sm text-[#6B7280]">
        <ol className="flex flex-wrap items-center gap-1">
          {items.map((item, i) => (
            <li key={i} className="flex items-center gap-1">
              {i > 0 && <span>/</span>}
              {item.href && i < items.length - 1 ? (
                <Link href={item.href} className="hover:text-[#CC0000] transition-colors">
                  {item.label}
                </Link>
              ) : (
                <span className={i === items.length - 1 ? "text-[#111827] font-medium" : ""}>
                  {item.label}
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
