import type { Metadata } from "next";
import type { Fault, Variant, Model, Make } from "@/lib/types";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://carknownfaults.com";
const SITE_NAME = "CKF";

export function generateFaultMetadata(
  fault: Fault,
  variant: Variant,
  model: Model,
  make: Make
): Metadata {
  const title = `${make.name} ${model.name} ${variant.name} ${fault.title} | Symptoms, Fix & Cost | ${SITE_NAME}`;
  const description = fault.summary.slice(0, 155);
  const url = `${SITE_URL}/${make.slug}/${model.slug}/${variant.slug}/${fault.slug}`;

  return {
    title,
    description,
    openGraph: { title, description, url, siteName: SITE_NAME, type: "article" },
    alternates: { canonical: url },
  };
}

export function generateVariantMetadata(
  variant: Variant,
  model: Model,
  make: Make
): Metadata {
  const title = `${make.name} ${model.name} ${variant.name} Known Faults | ${SITE_NAME}`;
  const description = `${variant.fault_count} known faults for the ${make.name} ${model.name} ${variant.name}. Browse symptoms, causes and fixes.`;
  const url = `${SITE_URL}/${make.slug}/${model.slug}/${variant.slug}`;

  return {
    title,
    description,
    openGraph: { title, description, url, siteName: SITE_NAME },
    alternates: { canonical: url },
  };
}

export function generateModelMetadata(model: Model, make: Make): Metadata {
  const title = `${make.name} ${model.name} Known Faults | All Variants & Problems | ${SITE_NAME}`;
  const description = `Complete list of ${make.name} ${model.name} known faults by variant. Includes all engine types — diesel and petrol.`;
  const url = `${SITE_URL}/${make.slug}/${model.slug}`;

  return {
    title,
    description,
    openGraph: { title, description, url, siteName: SITE_NAME },
    alternates: { canonical: url },
  };
}

export function generateMakeMetadata(make: Make): Metadata {
  const title = `${make.name} Known Faults | Common Problems by Model | ${SITE_NAME}`;
  const description = `${make.name} known faults listed by model. Browse common problems and repair costs.`;
  const url = `${SITE_URL}/${make.slug}`;

  return {
    title,
    description,
    openGraph: { title, description, url, siteName: SITE_NAME },
    alternates: { canonical: url },
  };
}

export function generateBreadcrumbSchema(
  items: { name: string; url: string }[]
): string {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  });
}

export function generateFaultHowToSchema(fault: Fault): string {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: `How to fix: ${fault.title}`,
    description: fault.summary,
    estimatedCost: fault.repair_cost_low
      ? {
          "@type": "MonetaryAmount",
          currency: "GBP",
          minValue: fault.repair_cost_low,
          maxValue: fault.repair_cost_high,
        }
      : undefined,
  });
}

export function generateWebsiteSchema(): string {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Car Known Faults",
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: `${SITE_URL}/search?q={search_term_string}` },
      "query-input": "required name=search_term_string",
    },
  });
}
