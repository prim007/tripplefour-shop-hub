// Static per-route metadata for build-time prerendering.
// Social/AI crawlers (Facebook, WhatsApp, LinkedIn, Slack, OpenAI, Perplexity)
// don't execute JS, so they only see the HTML shipped for each URL.
// Keep in sync with routes in src/App.tsx and products in src/data/products.ts.

export interface RouteMeta {
  path: string;
  title: string;
  description: string;
  ogImage?: string;
  ogType?: string;
  /** Raw JSON to embed as <script type="application/ld+json">. */
  jsonLd?: unknown;
  /** Raw HTML injected before </body> so JS-less crawlers can read structured content (e.g. price lists). */
  bodySnippet?: string;
}

export const BASE_URL = "https://tripplefourshophub.online";

const clip = (s: string, n: number) => (s.length > n ? s.slice(0, n - 1) + "…" : s);

// Lëf Labs wholesale price list — mirrors src/data/leflabsProducts.ts.
// Duplicated here (not imported) to keep the build config free of runtime deps.
const lefLabsProducts: { name: string; category: string; unit: string; price: number; description: string }[] = [
  { name: "Animal Runtz", category: "Indoor Flower", unit: "per gram", price: 120, description: "Hybrid · Sweet / Fruity · COA per batch" },
  { name: "Lemon Silver Haze", category: "Indoor Flower", unit: "per gram", price: 120, description: "Sativa · Citrus / Earthy · COA per batch" },
  { name: "Guava Bomba", category: "Indoor Flower", unit: "per gram", price: 120, description: "Hybrid · Tropical / Floral · COA per batch" },
  { name: "Purple Ghost Candy", category: "Indoor Flower", unit: "per gram", price: 120, description: "Indica · Berry / Candy · COA per batch" },
  { name: "Jack Herer (Tunnel AAA)", category: "Tunnel Flower", unit: "per gram", price: 70, description: "Sativa · Spicy / Pine · single-nug grade" },
  { name: "Planet of the Grapes (Tunnel AAA)", category: "Tunnel Flower", unit: "per gram", price: 70, description: "Indica · Grape / Earthy · single-nug grade" },
  { name: "Gorilla Skittles (Tunnel AAA)", category: "Tunnel Flower", unit: "per gram", price: 70, description: "Hybrid · Sweet / Diesel · single-nug grade" },
  { name: "Standard Pre-Roll 1g", category: "Pre-Rolls", unit: "per unit", price: 35, description: "Tunnel popcorn blend · COA-backed" },
  { name: "Premium Pre-Roll 1g", category: "Pre-Rolls", unit: "per unit", price: 55, description: "Indoor multi-nug · COA-backed" },
  { name: "Moon Stick Pre-Roll (infused)", category: "Pre-Rolls", unit: "per unit", price: 85, description: "Indoor flower + kief coat · premium" },
  { name: "Liquid Gold Disposable 1ml", category: "Vapes", unit: "per unit", price: 390, description: "THC distillate · Partner D extraction" },
  { name: "Pure Leaf 510 Cartridge 1ml", category: "Vapes", unit: "per unit", price: 320, description: "Full spectrum · 510 thread" },
  { name: "THC Distillate 1g", category: "Distillates", unit: "per gram", price: 280, description: "90–95% purity · COA + solvent screening" },
  { name: "CBD Distillate 1g", category: "Distillates", unit: "per gram", price: 180, description: "80–90% purity · COA + solvent screening" },
  { name: "Live Resin 1g", category: "Distillates", unit: "per gram", price: 320, description: "65–80% potency · solvent-screened" },
];

const escHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const lefLabsCategories = Array.from(new Set(lefLabsProducts.map((p) => p.category)));

const lefLabsPriceTableHtml = `
<section id="prerender-price-list" aria-label="Lëf Labs wholesale price list" style="position:absolute;left:-9999px;top:auto;width:1px;height:1px;overflow:hidden;">
  <h2>Lëf Labs Wholesale Price List (ZAR)</h2>
  ${lefLabsCategories
    .map(
      (cat) => `
  <h3>${escHtml(cat)}</h3>
  <table>
    <thead><tr><th>Product</th><th>Description</th><th>Unit</th><th>Price (ZAR)</th></tr></thead>
    <tbody>
      ${lefLabsProducts
        .filter((p) => p.category === cat)
        .map(
          (p) =>
            `<tr><td>${escHtml(p.name)}</td><td>${escHtml(p.description)}</td><td>${escHtml(p.unit)}</td><td>R${p.price.toFixed(2)}</td></tr>`
        )
        .join("")}
    </tbody>
  </table>`
    )
    .join("")}
</section>`.trim();

const lefLabsJsonLd = {
  "@context": "https://schema.org",
  "@type": "OfferCatalog",
  name: "Lëf Labs Wholesale Price List",
  itemListElement: lefLabsProducts.map((p) => ({
    "@type": "Offer",
    itemOffered: { "@type": "Product", name: p.name, category: p.category, description: p.description },
    price: p.price.toFixed(2),
    priceCurrency: "ZAR",
    eligibleQuantity: { "@type": "QuantitativeValue", unitText: p.unit },
    availability: "https://schema.org/InStock",
  })),
};

const products: { id: string; name: string; price: number; desc: string }[] = [
  { id: "ed-cube40", name: "Edible Cube 40mg", price: 60, desc: "Hemp-infused edible cube, 40mg per piece." },
  { id: "ed-chocchip-cookies", name: "Tripple444 ChocChip Cookies (10 Pack)", price: 165, desc: "Infused choc chip cookies — 10 per pack, resealable pouch." },
  { id: "dab-1", name: "Dab Concentrate", price: 350, desc: "Premium hemp dab concentrate." },
  { id: "acc-airbuzz-shisha", name: "AirBuzz Dubai Fusion Shisha", price: 100, desc: "CBD-infused herbal shisha, <0.25% THC." },
  { id: "dv-edibles-100mg", name: "Dirty Vapes Edibles Tub 100mg", price: 150, desc: "Sugar-coated infused gummy cubes, 100mg per tub." },
  { id: "dv-cart-1ml", name: "Dirty Vapes 1ML Cart", price: 350, desc: "1ML THC cartridge, 510-thread compatible." },
  { id: "dv-switch-2ml", name: "Dirty Vapes 2ML SWITCH", price: 900, desc: "Dual-mode Sativa/Indica device with 2ML premium THC oil." },
  { id: "dv-disposable-1ml", name: "Dirty Vapes 1ML Disposable", price: 450, desc: "Pre-charged 1ML disposable, bold flavours." },
];

export const routes: RouteMeta[] = [
  { path: "/shop", title: "Shop CBD Products SA — Edibles, Vapes & Dab | Tripplefour", description: "Shop CBD infused edibles, vapes, dab & accessories online in South Africa. Fast delivery nationwide." },
  { path: "/blog", title: "CBD Blog SA — News & Guides | Tripplefour", description: "Latest CBD news, guides & tips for South Africa. Edibles, vapes, legal updates and more." },
  { path: "/partners", title: "Partners — Trusted CBD Brands SA | Tripplefour", description: "Meet the CBD & vape brands we partner with across South Africa." },
  { path: "/partners/dirty-vapes", title: "Dirty Vapes — Partner Store | Tripplefour", description: "Shop Dirty Vapes THC carts, disposables & edibles online in South Africa." },
  {
    path: "/partners/lef-labs",
    title: "Lëf Labs Wholesale Price List — Flower, Vapes, Distillates | Tripplefour",
    description: "Lëf Labs B2B wholesale: indoor & tunnel flower from R70/g, pre-rolls R35–R85, vapes R320–R390, distillates R180–R320/g. COA per batch.",
    jsonLd: lefLabsJsonLd,
    bodySnippet: lefLabsPriceTableHtml,
  },
  { path: "/affiliate", title: "Affiliate Program — Earn With Tripplefour", description: "Join the Tripplefour affiliate program and earn commission on every CBD sale." },
  { path: "/privacy-policy", title: "Privacy Policy | Tripplefour", description: "How Tripplefour collects, uses and protects your personal information. POPIA compliant." },
  { path: "/terms-of-service", title: "Terms of Service | Tripplefour", description: "Terms, 21+ age rules and conditions of use for the Tripplefour store." },
  ...products.map<RouteMeta>((p) => ({
    path: `/product/${p.id}`,
    title: clip(`${p.name} — R${p.price} | Tripplefour`, 60),
    description: clip(`${p.desc} From R${p.price}. Fast SA delivery.`, 160),
    ogType: "product",
  })),
];
