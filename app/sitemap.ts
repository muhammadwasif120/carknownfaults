/**
 * Dynamic sitemap — covers every indexable URL in CKF.
 * Pulled from Supabase at build time (ISR, revalidated daily).
 * Google / Bing limit: 50,000 URLs per sitemap file.
 */
import type { MetadataRoute } from "next";
import { createBuildClient } from "@/lib/supabase/build";

const BASE = process.env.NEXT_PUBLIC_SITE_URL || "https://carknownfaults.com";

export const revalidate = 86400; // rebuild sitemap once per day

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const sb = createBuildClient();

  // Fetch all slugs in parallel
  const [
    { data: makes },
    { data: models },
    { data: variants },
    { data: faults },
    { data: tags },
  ] = await Promise.all([
    sb.from("makes").select("slug, updated_at"),
    sb.from("models").select("slug, updated_at, makes(slug)"),
    sb.from("variants").select("slug, updated_at, models(slug, makes(slug))"),
    sb
      .from("faults")
      .select("slug, updated_at, variants(slug, models(slug, makes(slug)))")
      .eq("published", true),
    sb.from("tags").select("slug"),
  ]);

  const now = new Date();

  // ── Static pages ──────────────────────────────────────────────────────────
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: now, changeFrequency: "daily",   priority: 1.0 },
    { url: `${BASE}/makes`,         lastModified: now, changeFrequency: "weekly",  priority: 0.9 },
    { url: `${BASE}/search`,        lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/fault-codes`,   lastModified: now, changeFrequency: "weekly",  priority: 0.7 },
    { url: `${BASE}/guides`,        lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/buyers-guides`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/mot-checks`,    lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/submit`,        lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/about`,         lastModified: now, changeFrequency: "yearly",  priority: 0.4 },
    { url: `${BASE}/privacy`,       lastModified: now, changeFrequency: "yearly",  priority: 0.3 },
    { url: `${BASE}/press`,         lastModified: now, changeFrequency: "yearly",  priority: 0.3 },
  ];

  // ── Make pages (/ford, /volkswagen …) ────────────────────────────────────
  const makePages: MetadataRoute.Sitemap = (makes ?? []).map((m) => ({
    url: `${BASE}/${m.slug}`,
    lastModified: m.updated_at ? new Date(m.updated_at) : now,
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  // ── Model pages (/ford/focus …) ───────────────────────────────────────────
  const modelPages: MetadataRoute.Sitemap = (models ?? []).flatMap((m) => {
    const makeSlug = (m.makes as any)?.slug;
    if (!makeSlug) return [];
    return [
      {
        url: `${BASE}/${makeSlug}/${m.slug}`,
        lastModified: m.updated_at ? new Date(m.updated_at) : now,
        changeFrequency: "weekly" as const,
        priority: 0.8,
      },
      // MOT page per model
      {
        url: `${BASE}/${makeSlug}/${m.slug}/mot`,
        lastModified: now,
        changeFrequency: "monthly" as const,
        priority: 0.6,
      },
    ];
  });

  // ── Variant pages (/ford/focus/1-6-tdci …) ───────────────────────────────
  const variantPages: MetadataRoute.Sitemap = (variants ?? []).flatMap((v) => {
    const model = v.models as any;
    const makeSlug = model?.makes?.slug;
    const modelSlug = model?.slug;
    if (!makeSlug || !modelSlug) return [];
    return [{
      url: `${BASE}/${makeSlug}/${modelSlug}/${v.slug}`,
      lastModified: v.updated_at ? new Date(v.updated_at) : now,
      changeFrequency: "weekly" as const,
      priority: 0.75,
    }];
  });

  // ── Fault article pages (highest SEO value) ───────────────────────────────
  const faultPages: MetadataRoute.Sitemap = (faults ?? []).flatMap((f) => {
    const variant = f.variants as any;
    const model = variant?.models as any;
    const makeSlug = model?.makes?.slug;
    const modelSlug = model?.slug;
    const variantSlug = variant?.slug;
    if (!makeSlug || !modelSlug || !variantSlug) return [];
    return [{
      url: `${BASE}/${makeSlug}/${modelSlug}/${variantSlug}/${f.slug}`,
      lastModified: f.updated_at ? new Date(f.updated_at) : now,
      changeFrequency: "monthly" as const,
      priority: 0.9, // fault articles are the money pages
    }];
  });

  // ── Tag pages (/tags/timing-chain …) ─────────────────────────────────────
  const tagPages: MetadataRoute.Sitemap = (tags ?? []).map((t) => ({
    url: `${BASE}/tags/${t.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.65,
  }));

  const all = [
    ...staticPages,
    ...makePages,
    ...modelPages,
    ...variantPages,
    ...faultPages,
    ...tagPages,
  ];

  console.log(`[sitemap] Generated ${all.length} URLs`);
  return all;
}
