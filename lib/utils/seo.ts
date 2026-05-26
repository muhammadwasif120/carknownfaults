import type { Metadata } from "next";
import type { Fault, Variant, Model, Make } from "@/lib/types";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://carknownfaults.com";
const SITE_NAME = "Car Known Faults";
const SITE_NAME_SHORT = "CKF";
/** Default OG image — 1200×630 branded image at /public/og-default.jpg */
const DEFAULT_OG_IMAGE = `${SITE_URL}/og-default.jpg`;

// ─── Shared Twitter card config ───────────────────────────────────────────────
const twitterBase = {
  card: "summary_large_image" as const,
  site: "@CKFaults",
};

// ─── Fault article pages ──────────────────────────────────────────────────────
export function generateFaultMetadata(
  fault: Fault,
  variant: Variant,
  model: Model,
  make: Make
): Metadata {
  const title = `${make.name} ${model.name} ${variant.name} — ${fault.title} | Symptoms, Fix & Cost`;
  const description = fault.summary.slice(0, 155);
  const url = `${SITE_URL}/${make.slug}/${model.slug}/${variant.slug}/${fault.slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      type: "article",
      images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      ...twitterBase,
      title,
      description,
      images: [DEFAULT_OG_IMAGE],
    },
    robots: { index: true, follow: true },
  };
}

// ─── Variant pages ────────────────────────────────────────────────────────────
export function generateVariantMetadata(
  variant: Variant,
  model: Model,
  make: Make
): Metadata {
  const faultCount = variant.fault_count ?? 0;
  const title = `${make.name} ${model.name} ${variant.name} Known Faults & Problems | ${SITE_NAME_SHORT}`;
  const description =
    faultCount > 0
      ? `${faultCount} known faults for the ${make.name} ${model.name} ${variant.name}. Full symptoms, repair costs, and DIY fix guides.`
      : `Known issues and common problems for the ${make.name} ${model.name} ${variant.name}. Symptoms, causes, and UK repair costs.`;
  const url = `${SITE_URL}/${make.slug}/${model.slug}/${variant.slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      type: "website",
      images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      ...twitterBase,
      title,
      description,
      images: [DEFAULT_OG_IMAGE],
    },
    robots: { index: true, follow: true },
  };
}

// ─── Model pages ──────────────────────────────────────────────────────────────
export function generateModelMetadata(model: Model, make: Make): Metadata {
  const title = `${make.name} ${model.name} Known Faults | All Variants & Problems | ${SITE_NAME_SHORT}`;
  const description = `Complete guide to ${make.name} ${model.name} known faults by engine variant. Diesel and petrol, real costs, real fixes. Used-car buyer intelligence.`;
  const url = `${SITE_URL}/${make.slug}/${model.slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      type: "website",
      images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      ...twitterBase,
      title,
      description,
      images: [DEFAULT_OG_IMAGE],
    },
    robots: { index: true, follow: true },
  };
}

// ─── Make pages ───────────────────────────────────────────────────────────────
export function generateMakeMetadata(make: Make): Metadata {
  const title = `${make.name} Known Faults | Common Problems by Model | ${SITE_NAME_SHORT}`;
  const description = `Every ${make.name} model's known faults listed by variant. Engine problems, gearbox issues, rust, electrics — with UK repair cost estimates.`;
  const url = `${SITE_URL}/${make.slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      type: "website",
      images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      ...twitterBase,
      title,
      description,
      images: [DEFAULT_OG_IMAGE],
    },
    robots: { index: true, follow: true },
  };
}

// ─── Tag pages ────────────────────────────────────────────────────────────────
export function generateTagMetadata(tag: { name: string; slug: string }): Metadata {
  const title = `${tag.name} Car Faults | Common Issues & Fixes | ${SITE_NAME_SHORT}`;
  const description = `Browse all car faults related to ${tag.name}. Symptoms, causes, repair costs, and which makes and models are worst affected.`;
  const url = `${SITE_URL}/tags/${tag.slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      type: "website",
      images: [{ url: DEFAULT_OG_IMAGE, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      ...twitterBase,
      title,
      description,
      images: [DEFAULT_OG_IMAGE],
    },
    robots: { index: true, follow: true },
  };
}

// ─── JSON-LD Schemas ──────────────────────────────────────────────────────────

export function generateWebsiteSchema(): string {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    description:
      "The UK's most comprehensive database of known car faults by make, model, and variant.",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  });
}

export function generateOrganizationSchema(): string {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    description:
      "Independent UK database of real-world car faults for used car buyers and DIY mechanics.",
    areaServed: "GB",
    knowsAbout: [
      "automotive diagnostics",
      "car fault diagnosis",
      "used car buying",
      "MOT failures",
    ],
  });
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

export function generateFaultArticleSchema(
  fault: Fault,
  variant: Variant,
  model: Model,
  make: Make
): string {
  const url = `${SITE_URL}/${make.slug}/${model.slug}/${variant.slug}/${fault.slug}`;
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Article",
    headline: `${make.name} ${model.name} ${variant.name} — ${fault.title}`,
    description: fault.summary,
    url,
    author: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/logo.png` },
    },
    datePublished: (fault as any).created_at ?? new Date().toISOString(),
    dateModified: (fault as any).updated_at ?? new Date().toISOString(),
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    about: {
      "@type": "Product",
      name: `${make.name} ${model.name} ${variant.name}`,
      brand: { "@type": "Brand", name: make.name },
    },
    keywords: [
      `${make.name} ${model.name} known faults`,
      `${make.name} ${model.name} ${variant.name} problems`,
      fault.title,
      "used car faults UK",
    ].join(", "),
  });
}

export function generateFaultHowToSchema(fault: Fault): string {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: `How to diagnose and fix: ${fault.title}`,
    description: fault.summary,
    estimatedCost:
      fault.repair_cost_low != null
        ? {
            "@type": "MonetaryAmount",
            currency: "GBP",
            minValue: fault.repair_cost_low,
            maxValue: fault.repair_cost_high,
          }
        : undefined,
  });
}

export function generateVariantPageSchema(
  variant: Variant,
  model: Model,
  make: Make,
  faults: Fault[]
): string {
  const url = `${SITE_URL}/${make.slug}/${model.slug}/${variant.slug}`;
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${make.name} ${model.name} ${variant.name} Known Faults`,
    description: `${faults.length} known faults for the ${make.name} ${model.name} ${variant.name}.`,
    url,
    numberOfItems: faults.length,
    itemListElement: faults.slice(0, 10).map((f, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: f.title,
      url: `${url}/${f.slug}`,
    })),
  });
}

export function generateMakePageSchema(
  make: Make,
  models: { name: string; slug: string }[]
): string {
  const url = `${SITE_URL}/${make.slug}`;
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${make.name} Known Faults`,
    description: `Known faults for all ${make.name} models.`,
    url,
    about: { "@type": "Brand", name: make.name },
    hasPart: models.map((m) => ({
      "@type": "WebPage",
      name: `${make.name} ${m.name} Known Faults`,
      url: `${SITE_URL}/${make.slug}/${m.slug}`,
    })),
  });
}
