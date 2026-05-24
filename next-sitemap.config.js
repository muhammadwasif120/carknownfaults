/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://carknownfaults.com",
  generateRobotsTxt: true,
  robotsTxtOptions: {
    rules: [{ userAgent: "*", allow: "/", disallow: "/admin" }],
    additionalSitemaps: [
      `${process.env.NEXT_PUBLIC_SITE_URL || "https://carknownfaults.com"}/sitemap.xml`,
    ],
  },
  exclude: ["/admin", "/admin/*", "/api/*"],
};
