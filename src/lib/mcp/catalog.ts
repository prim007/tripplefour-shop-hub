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
  { id: "dab-1", name: "Dab Concentrate", category: "Dab", price: 350, description: "Premium hemp dab concentrate." },
  { id: "acc-airbuzz-shisha", name: "AirBuzz Dubai Fusion Premium Shisha", category: "Accessories", price: 100, description: "AirBuzz CBD-infused herbal shisha — Dubai Fusion." },
  { id: "acc-t444-cones", name: "TRIPPLE444 108mm Rolling Papers (100 per barrel)", category: "Accessories", price: 150, description: "TRIPPLE444 pre-rolled 108mm cones — 100 per barrel." },
  { id: "acc-hornet-tips", name: "HORNET Natural Hemp & Cotton Rolling Tips and Rolling Paper (50 leaves)", category: "Accessories", price: 165, description: "HORNET perforated hemp & cotton rolling tips, 50 leaves." },
  { id: "acc-hp-cherry-pig", name: "HoneyPuff Hemp Wraps — Honey Cherry Pig", category: "Accessories", price: 145, description: "HoneyPuff organic hemp wraps — Honey Cherry Pig flavour with 2 filter tips." },
  { id: "acc-fruitors-ashtray", name: "Fruitors Skull-Shaped Ashtray Set", category: "Accessories", price: 480, description: "Fruitors 6-piece skull-shaped glass ashtray set." },
  { id: "acc-rickmorty-ashtray", name: "Rick and Morty Round Ashtray Set", category: "Accessories", price: 650, description: "Rick and Morty themed 6-piece round glass ashtray set." },
  { id: "acc-dot-lighter-50", name: "DOT Lighter Box (50pcs)", category: "Accessories", price: 100, description: "DOT-1102 disposable lighters — box of 50." },
  { id: "acc-psych-small-pkg", name: "Psychedelic Graphic Small Packages", category: "Accessories", price: 95, description: "Psychedelic graphic-printed compact storage packages." },
  { id: "acc-hp-rolling-tray", name: "HoneyPuff Rolling Tray", category: "Accessories", price: 100, description: "HoneyPuff branded metal rolling tray." },
  { id: "vp-thalia-ice-cola", name: "Thalia 8000 Puffs 2% Vape — Ice Cola", category: "Vapes", price: 100, description: "Thalia disposable vape — 8000 puffs, 2% nicotine, Ice Cola flavour." },
  { id: "dv-edibles-100mg", name: "Dirty Vapes Edibles Tub 100mg", category: "Edibles", price: 150, description: "Dirty Vapes 'High Life' infused edibles tub — 100mg per tub." },
  { id: "dv-cart-1ml", name: "Dirty Vapes 1ML Cart", category: "Vapes", price: 350, description: "Dirty Vapes 1ML THC cartridge, 510-thread compatible." },
  { id: "dv-switch-2ml", name: "Dirty Vapes 2ML SWITCH", category: "Vapes", price: 900, description: "Dirty Vapes 2ML SWITCH — dual-mode Sativa/Indica reusable pod device." },
  { id: "dv-disposable-1ml", name: "Dirty Vapes 1ML Disposable", category: "Vapes", price: 450, description: "Dirty Vapes 1ML disposable — pre-charged, pre-filled." },
];

export const SITE_URL = "https://tripplefourshophub.online";

export function productUrl(id: string): string {
  return `${SITE_URL}/product/${id}`;
}