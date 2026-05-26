/**
 * robots.ts — generated robots.txt for CKF
 *
 * Strategy:
 *  • All legitimate search crawlers get full access except /admin
 *  • AI training crawlers (scraping without attribution) are blocked
 *  • AI search/answer bots (ChatGPT, Perplexity, Claude, Bing) are allowed —
 *    they drive discovery and referral traffic
 */
import type { MetadataRoute } from "next";

const BASE = process.env.NEXT_PUBLIC_SITE_URL || "https://carknownfaults.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // ── Standard crawlers ──────────────────────────────────────────────────
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/admin/",
          "/api/",
          "/_next/",
        ],
      },

      // ── Google — full access, hint at crawl budget ────────────────────────
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/admin/", "/api/"],
        crawlDelay: 1,
      },

      // ── Bing ──────────────────────────────────────────────────────────────
      {
        userAgent: "Bingbot",
        allow: "/",
        disallow: ["/admin/", "/api/"],
        crawlDelay: 2,
      },

      // ── AI answer engines — allowed (they drive referral traffic) ─────────
      {
        userAgent: "GPTBot",           // OpenAI ChatGPT
        allow: "/",
        disallow: ["/admin/", "/api/"],
      },
      {
        userAgent: "Claude-Web",       // Anthropic Claude
        allow: "/",
        disallow: ["/admin/", "/api/"],
      },
      {
        userAgent: "PerplexityBot",    // Perplexity AI
        allow: "/",
        disallow: ["/admin/", "/api/"],
      },
      {
        userAgent: "YouBot",           // You.com
        allow: "/",
        disallow: ["/admin/", "/api/"],
      },
      {
        userAgent: "CCBot",            // Common Crawl (feeds many AI models)
        allow: "/",
        disallow: ["/admin/", "/api/"],
      },
      {
        userAgent: "anthropic-ai",
        allow: "/",
        disallow: ["/admin/", "/api/"],
      },

      // ── Block pure AI training scrapers (no attribution/referral value) ───
      {
        userAgent: "Bytespider",       // ByteDance
        disallow: ["/"],
      },
      {
        userAgent: "Amazonbot",
        disallow: ["/"],
      },
    ],

    sitemap: `${BASE}/sitemap.xml`,
    host: BASE,
  };
}
