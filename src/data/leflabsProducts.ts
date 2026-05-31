// Lëf Labs wholesale order list.
// IMPORTANT: Prices MUST match `supabase/functions/create-leflabs-order/index.ts`.
// The Edge Function is the source of truth — frontend prices are display only.

export type LefLabsProduct = {
  id: string;
  name: string;
  category: string;
  description: string;
  unit: string; // e.g. "per gram", "per unit"
  price: number; // ZAR
};

export const LEFLABS_PRODUCTS: LefLabsProduct[] = [
  // Indoor flower (per gram, list price)
  { id: "lef-ind-animal-runtz", name: "Animal Runtz", category: "Indoor Flower", description: "Hybrid · Sweet / Fruity · COA per batch", unit: "per gram", price: 120 },
  { id: "lef-ind-lemon-silver-haze", name: "Lemon Silver Haze", category: "Indoor Flower", description: "Sativa · Citrus / Earthy · COA per batch", unit: "per gram", price: 120 },
  { id: "lef-ind-guava-bomba", name: "Guava Bomba", category: "Indoor Flower", description: "Hybrid · Tropical / Floral · COA per batch", unit: "per gram", price: 120 },
  { id: "lef-ind-purple-ghost-candy", name: "Purple Ghost Candy", category: "Indoor Flower", description: "Indica · Berry / Candy · COA per batch", unit: "per gram", price: 120 },

  // Tunnel AAA flower (per gram, single-nug list)
  { id: "lef-tun-jack-herer", name: "Jack Herer (Tunnel AAA)", category: "Tunnel Flower", description: "Sativa · Spicy / Pine · single-nug grade", unit: "per gram", price: 70 },
  { id: "lef-tun-planet-grapes", name: "Planet of the Grapes (Tunnel AAA)", category: "Tunnel Flower", description: "Indica · Grape / Earthy · single-nug grade", unit: "per gram", price: 70 },
  { id: "lef-tun-gorilla-skittles", name: "Gorilla Skittles (Tunnel AAA)", category: "Tunnel Flower", description: "Hybrid · Sweet / Diesel · single-nug grade", unit: "per gram", price: 70 },

  // Pre-rolls
  { id: "lef-pr-standard-1g", name: "Standard Pre-Roll 1g", category: "Pre-Rolls", description: "Tunnel popcorn blend · COA-backed", unit: "per unit", price: 35 },
  { id: "lef-pr-premium-1g", name: "Premium Pre-Roll 1g", category: "Pre-Rolls", description: "Indoor multi-nug · COA-backed", unit: "per unit", price: 55 },
  { id: "lef-pr-moon-stick", name: "Moon Stick Pre-Roll (infused)", category: "Pre-Rolls", description: "Indoor flower + kief coat · premium", unit: "per unit", price: 85 },

  // Vapes
  { id: "lef-vp-liquid-gold-1ml", name: "Liquid Gold Disposable 1ml", category: "Vapes", description: "THC distillate · Partner D extraction", unit: "per unit", price: 390 },
  { id: "lef-vp-pure-leaf-1ml", name: "Pure Leaf 510 Cartridge 1ml", category: "Vapes", description: "Full spectrum · 510 thread", unit: "per unit", price: 320 },

  // Distillates (per gram, list)
  { id: "lef-dist-thc-1g", name: "THC Distillate 1g", category: "Distillates", description: "90–95% purity · COA + solvent screening", unit: "per gram", price: 280 },
  { id: "lef-dist-cbd-1g", name: "CBD Distillate 1g", category: "Distillates", description: "80–90% purity · COA + solvent screening", unit: "per gram", price: 180 },
  { id: "lef-dist-live-resin-1g", name: "Live Resin 1g", category: "Distillates", description: "65–80% potency · solvent-screened", unit: "per gram", price: 320 },
];

export const LEFLABS_PRODUCT_MAP: Record<string, LefLabsProduct> = Object.fromEntries(
  LEFLABS_PRODUCTS.map((p) => [p.id, p])
);