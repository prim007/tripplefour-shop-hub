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
}

export const BASE_URL = "https://tripplefourshophub.online";

const clip = (s: string, n: number) => (s.length > n ? s.slice(0, n - 1) + "…" : s);

const products: { id: string; name: string; price: number; desc: string }[] = [
  { id: "ed-cube40", name: "Edible Cube 40mg", price: 60, desc: "Hemp-infused edible cube, 40mg per piece." },
  { id: "ed-chocchip-cookies", name: "Tripple444 ChocChip Cookies (10 Pack)", price: 165, desc: "Infused choc chip cookies — 10 per pack, resealable pouch." },
  { id: "vp-disp", name: "Disposable Juice 10ml", price: 390, desc: "10ml disposable vape juice." },
  { id: "vp-lz-toffee", name: "Liquid Zol Toffee Popcorn", price: 390, desc: "Disposable THC vape — Toffee Popcorn." },
  { id: "vp-lz-cherry", name: "Liquid Zol Cherry Heat", price: 390, desc: "Disposable THC vape — Cherry Heat Ignition." },
  { id: "vp-lz-peach", name: "Liquid Zol Peach", price: 390, desc: "Disposable THC vape — Peach Revolution." },
  { id: "vp-lz-blueberry", name: "Liquid Zol Blueberry", price: 390, desc: "Disposable THC vape — Neon Blueberry Smash." },
  { id: "vp-lz-greenapple", name: "Liquid Zol Green Apple", price: 390, desc: "Disposable THC vape — Green Apple Fury." },
  { id: "vp-lz-oil", name: "Liquid Zol Concentrated Oil", price: 320, desc: "Concentrated THC oil for vaping." },
  { id: "dab-1", name: "Dab Concentrate", price: 350, desc: "Premium hemp dab concentrate." },
  { id: "acc-hp-100bill", name: "HoneyPuff $100 Bill Rolling Papers", price: 55, desc: "Novelty rolling papers, 24 booklets per box." },
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
  { path: "/partners/lef-labs", title: "Lëf Labs — Partner Store | Tripplefour", description: "Shop Lëf Labs premium CBD & THC products with direct-to-door delivery in SA." },
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
