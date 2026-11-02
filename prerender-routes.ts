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
  { name: "Hydro Flower · Tier I", category: "Hydro · Tier I", unit: "per kg (1kg+ price)", price: 45, description: "15 strains · R65 up to 500g, R55 at 750g, R45 from 1kg · 100g min" },
  { name: "Indoor Flower · Tier II", category: "Indoor · Tier II", unit: "per kg (1kg+ price)", price: 35, description: "10 strains · R55 up to 500g, R45 at 750g, R35 from 1kg · 100g min" },
  { name: "Greendoor Flower · Tier III", category: "Greendoor · Tier III", unit: "per kg (1kg+ price)", price: 27, description: "7 strains · R45 up to 500g, R36 at 750g, R27 from 1kg · 250g min" },
  { name: "Exotic Greenhouse Flower · Tier IV", category: "Exotic Greenhouse · Tier IV", unit: "per kg (1kg+ price)", price: 24, description: "22 strains · R44 up to 500g, R34 at 750g, R24 from 1kg · 250g min" },
  { name: "Sungrown Flower · Tier V", category: "Sungrown · Tier V", unit: "per kg (1kg+ price)", price: 15, description: "Unavailable until December, orders open · R35 up to 500g, R25 at 750g, R15 from 1kg" },
  { name: "Pops — Assorted Small/Medium", category: "Pops & Mini Pops", unit: "each", price: 25, description: "From 250g bags" },
  { name: "Mini Pops — Small Only", category: "Pops & Mini Pops", unit: "each", price: 15, description: "From 250g bags" },
  { name: "Untrimmed Bud (Greendoor)", category: "Raw Material", unit: "per kg", price: 10, description: "Fixed price · 2.5kg min · R1,500 delivery" },
  { name: "Trim", category: "Raw Material", unit: "per kg", price: 6, description: "Fixed price · 2kg min · R1,500 delivery" },
  { name: "Indoor Moonstick 1.4g", category: "Pre-Rolls & Moonsticks", unit: "per unit", price: 65, description: "MOQ 100 units" },
  { name: "Greenhouse Pre-Roll 1.4g", category: "Pre-Rolls & Moonsticks", unit: "per unit", price: 25, description: "MOQ 100 units" },
  { name: "Vape Cartridge (6 lines)", category: "Vapes", unit: "per unit", price: 399, description: "Flat price · MOQ 20 units" },
  { name: "Sour Edibles 15mg", category: "Sour Edibles", unit: "per pack", price: 150, description: "MOQ 10 packs per flavour" },
  { name: "Sour Edibles 30mg", category: "Sour Edibles", unit: "per pack", price: 180, description: "MOQ 10 packs per flavour" },
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
    description: "Lëf Labs B2B wholesale: flower from R70/g, pre-rolls R35–R85, vapes R320–R390, distillates R180–R320/g. COA per batch.",
    jsonLd: lefLabsJsonLd,
    bodySnippet: lefLabsPriceTableHtml,
  },
  { path: "/affiliate", title: "Affiliate Program — Earn With Tripplefour", description: "Join the Tripplefour affiliate program and earn commission on every CBD sale." },
  { path: "/dispensaries", title: "Wholesale Portal for Dispensaries SA | Tripplefour", description: "Order CBD stock wholesale in South Africa. Browse the catalogue, request custom items and download a PDF quote instantly." },
  { path: "/cbd-oil-south-africa", title: "CBD Oil South Africa — Buy Online, Legal Guide | Tripplefour", description: "CBD oil in South Africa: what it is, how it's dosed, the legal position under Schedule 0, and where to buy CBD products online with nationwide delivery in ZAR." },
  { path: "/cbd-edibles-south-africa", title: "CBD Edibles South Africa — Gummies, Cookies & Dosage Guide", description: "CBD edibles in South Africa: gummies, cookies and infused cubes explained — mg per serving, onset times, the Schedule 0 legal position, and where to buy online in ZAR." },
  { path: "/donations", title: "Donations & Community Giving | Tripplefour", description: "We accept non-cash donations and give everything to a community home voted for each month." },
  { path: "/privacy-policy", title: "Privacy Policy | Tripplefour", description: "How Tripplefour collects, uses and protects your personal information. POPIA compliant." },
  { path: "/terms-of-service", title: "Terms of Service | Tripplefour", description: "Terms, 21+ age rules and conditions of use for the Tripplefour store." },
  ...products.map<RouteMeta>((p) => ({
    path: `/product/${p.id}`,
    title: clip(`${p.name} — R${p.price} | Tripplefour`, 60),
    description: clip(`${p.desc} From R${p.price}. Fast SA delivery.`, 160),
    ogType: "product",
  })),
];
