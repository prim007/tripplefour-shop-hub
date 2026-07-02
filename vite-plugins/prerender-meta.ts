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

      for (const route of routes) {
        const html = rewriteHead(baseHtml, route);
        const routeDir = path.join(outDir, route.path.replace(/^\//, ""));
        await fs.mkdir(routeDir, { recursive: true });
        await fs.writeFile(path.join(routeDir, "index.html"), html, "utf8");
      }
      // eslint-disable-next-line no-console
      console.log(`[prerender-meta] wrote ${routes.length} route snapshots`);
    },
  };
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
