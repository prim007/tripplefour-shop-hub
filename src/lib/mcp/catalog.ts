// Static product catalog snapshot for MCP tools. Kept import-safe
// (no image imports, no env reads, no I/O at module top level) so it
// can be evaluated both by the build-time MCP extractor and the Deno
// edge function cold start. Keep in sync with src/data/products.ts.

export type CatalogProduct = {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  comingSoon?: boolean;
};

export const catalog: CatalogProduct[] = [
  { id: "ed-cube40", name: "Edible Cube 40mg", category: "Edibles", price: 60, description: "Hemp-infused edible cube, 40mg per piece." },
  { id: "ed-chocchip-cookies", name: "Tripple444 ChocChip Cookies (10 Pack)", category: "Edibles", price: 165, description: "Tripple444 infused chocolate chip cookies — 10 cookies per pack." },
  { id: "ed-icecream", name: "Infused Ice Cream", category: "Edibles", price: 0, description: "Delicious infused ice cream. Coming soon!", comingSoon: true },
  { id: "vp-disp", name: "Disposable Juice 10ml", category: "Vapes", price: 390, description: "10ml disposable vape juice." },
  { id: "vp-lz-toffee", name: "Liquid Zol Toffee Popcorn", category: "Vapes", price: 390, description: "Disposable THC vape — Toffee Popcorn flavour." },
  { id: "vp-lz-cherry", name: "Liquid Zol Cherry Heat", category: "Vapes", price: 390, description: "Disposable THC vape — Cherry Heat Ignition." },
  { id: "vp-lz-peach", name: "Liquid Zol Peach", category: "Vapes", price: 390, description: "Disposable THC vape — Peach Revolution." },
  { id: "vp-lz-blueberry", name: "Liquid Zol Blueberry", category: "Vapes", price: 390, description: "Disposable THC vape — Neon Blueberry Smash." },
  { id: "vp-lz-greenapple", name: "Liquid Zol Green Apple", category: "Vapes", price: 390, description: "Disposable THC vape — Green Apple Fury." },
  { id: "vp-lz-oil", name: "Liquid Zol Concentrated Oil", category: "Vapes", price: 320, description: "Concentrated THC oil for vaping." },
  { id: "dab-1", name: "Dab Concentrate", category: "Dab", price: 350, description: "Premium hemp dab concentrate." },
  { id: "acc-hp-100bill", name: "HoneyPuff $100 Bill Rolling Papers (Box of 24)", category: "Accessories", price: 55, description: "HoneyPuff $100 Bill rolling papers — 24 booklets per box." },
  { id: "acc-airbuzz-shisha", name: "AirBuzz Dubai Fusion Premium Shisha", category: "Accessories", price: 100, description: "AirBuzz CBD-infused herbal shisha — Dubai Fusion." },
  { id: "dv-edibles-100mg", name: "Dirty Vapes Edibles Tub 100mg", category: "Edibles", price: 150, description: "Dirty Vapes 'High Life' infused edibles tub — 100mg per tub." },
  { id: "dv-cart-1ml", name: "Dirty Vapes 1ML Cart", category: "Vapes", price: 350, description: "Dirty Vapes 1ML THC cartridge, 510-thread compatible." },
  { id: "dv-switch-2ml", name: "Dirty Vapes 2ML SWITCH", category: "Vapes", price: 900, description: "Dirty Vapes 2ML SWITCH — dual-mode Sativa/Indica reusable pod device." },
  { id: "dv-disposable-1ml", name: "Dirty Vapes 1ML Disposable", category: "Vapes", price: 450, description: "Dirty Vapes 1ML disposable — pre-charged, pre-filled." },
];

export const SITE_URL = "https://tripplefourshophub.online";

export function productUrl(id: string): string {
  return `${SITE_URL}/product/${id}`;
}