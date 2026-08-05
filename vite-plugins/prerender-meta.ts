import type { Plugin } from "vite";
import { promises as fs } from "node:fs";
import path from "node:path";
import { routes, BASE_URL, type RouteMeta } from "../prerender-routes";

/**
 * Post-build plugin: for each route in prerender-routes.ts, clone
 * dist/index.html into dist/<route>/index.html with per-route <title>,
 * meta description, canonical, og:*, and twitter:* tags rewritten.
 *
 * This is NOT full SSR — the React tree still hydrates client-side.
 * It gives social/AI crawlers (which don't run JS) accurate per-page
 * previews. Lovable hosting serves /shop/index.html when a browser
 * requests /shop, so crawlers see the route-specific head.
 */
export default function prerenderMeta(): Plugin {
  return {
    name: "prerender-meta",
    apply: "build",
    async closeBundle() {
      const outDir = path.resolve(process.cwd(), "dist");
      const indexPath = path.join(outDir, "index.html");
      let baseHtml: string;
      try {
        baseHtml = await fs.readFile(indexPath, "utf8");
      } catch {
        return;
      }

      const blogRoutes = await fetchBlogRoutes();
      const allRoutes = [...routes, ...blogRoutes];

      for (const route of allRoutes) {
        const html = rewriteHead(baseHtml, route);
        const routeDir = path.join(outDir, route.path.replace(/^\//, ""));
        await fs.mkdir(routeDir, { recursive: true });
        await fs.writeFile(path.join(routeDir, "index.html"), html, "utf8");
      }
      // eslint-disable-next-line no-console
      console.log(
        `[prerender-meta] wrote ${allRoutes.length} route snapshots (${blogRoutes.length} blog posts)`
      );
    },
  };
}

/**
 * Build-time fetch of published blog posts so每 /blog/<slug> ships a static
 * HTML snapshot with real title, description, Article JSON-LD and readable
 * body text. Without this, every blog URL served the generic homepage head
 * and empty body, so crawlers had nothing to index.
 */
async function fetchBlogRoutes(): Promise<RouteMeta[]> {
  const url = process.env.VITE_SUPABASE_URL;
  const key = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) {
    // eslint-disable-next-line no-console
    console.warn("[prerender-meta] no backend env vars — skipping blog prerender");
    return [];
  }
  try {
    const res = await fetch(
      `${url}/rest/v1/blog_posts?select=title,slug,excerpt,content,cover_image,published_at&published=eq.true&order=published_at.desc`,
      { headers: { apikey: key, Authorization: `Bearer ${key}` } }
    );
    if (!res.ok) {
      // eslint-disable-next-line no-console
      console.warn(`[prerender-meta] blog fetch failed [${res.status}]: ${await res.text()}`);
      return [];
    }
    const posts = (await res.json()) as {
      title: string;
      slug: string;
      excerpt: string | null;
      content: string;
      cover_image: string | null;
      published_at: string;
    }[];

    return posts.map<RouteMeta>((p) => {
      const pageUrl = `${BASE_URL}/blog/${p.slug}`;
      const desc = clipText(
        (p.excerpt || p.content).replace(/\s+/g, " ").trim(),
        155
      );
      const paragraphs = p.content
        .split(/\n{2,}/)
        .map((s) => s.trim())
        .filter(Boolean);
      return {
        path: `/blog/${p.slug}`,
        title: clipText(`${p.title} | Tripplefour CBD Blog`, 65),
        description: desc,
        ogType: "article",
        ...(p.cover_image ? { ogImage: p.cover_image } : {}),
        jsonLd: {
          "@context": "https://schema.org",
          "@type": "Article",
          headline: p.title,
          datePublished: p.published_at,
          author: { "@type": "Organization", name: "Tripplefour" },
          publisher: { "@type": "Organization", name: "Tripplefour", url: BASE_URL },
          url: pageUrl,
          mainEntityOfPage: pageUrl,
          ...(p.cover_image ? { image: p.cover_image } : {}),
        },
        bodySnippet: `<article id="prerender-article"><h1>${esc(p.title)}</h1>${paragraphs
          .map((t) => `<p>${esc(t)}</p>`)
          .join("")}</article>`,
      };
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn("[prerender-meta] blog prerender skipped:", err);
    return [];
  }
}

function clipText(s: string, n: number): string {
  return s.length > n ? s.slice(0, n - 1) + "…" : s;
}

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function replaceMeta(html: string, attr: "name" | "property", key: string, value: string): string {
  const re = new RegExp(`<meta\\s+${attr}=["']${escapeRegex(key)}["'][^>]*>`, "i");
  const tag = `<meta ${attr}="${key}" content="${escapeHtml(value)}" />`;
  if (re.test(html)) return html.replace(re, tag);
  return html.replace(/<\/head>/i, `  ${tag}\n</head>`);
}

function rewriteHead(html: string, route: RouteMeta): string {
  const url = `${BASE_URL}${route.path}`;
  const type = route.ogType ?? "website";

  let out = html;
  out = out.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(route.title)}</title>`);
  out = replaceMeta(out, "name", "description", route.description);

  const canonicalTag = `<link rel="canonical" href="${escapeHtml(url)}" />`;
  if (/<link[^>]+rel=["']canonical["'][^>]*>/i.test(out)) {
    out = out.replace(/<link[^>]+rel=["']canonical["'][^>]*>/i, canonicalTag);
  } else {
    out = out.replace(/<\/head>/i, `  ${canonicalTag}\n</head>`);
  }

  out = replaceMeta(out, "property", "og:title", route.title);
  out = replaceMeta(out, "property", "og:description", route.description);
  out = replaceMeta(out, "property", "og:type", type);
  out = replaceMeta(out, "property", "og:url", url);
  if (route.ogImage) {
    out = replaceMeta(out, "property", "og:image", route.ogImage);
    out = replaceMeta(out, "name", "twitter:image", route.ogImage);
  }
  out = replaceMeta(out, "name", "twitter:title", route.title);
  out = replaceMeta(out, "name", "twitter:description", route.description);

  if (route.jsonLd) {
    const script = `<script type="application/ld+json">${JSON.stringify(route.jsonLd).replace(/</g, "\\u003c")}</script>`;
    out = out.replace(/<\/head>/i, `  ${script}\n</head>`);
  }

  if (route.bodySnippet) {
    out = out.replace(/<\/body>/i, `${route.bodySnippet}\n</body>`);
  }

  return out;
}
