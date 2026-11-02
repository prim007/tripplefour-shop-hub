// Lëf Labs wholesale order list — NOVEMBER 2026 CATALOGUE.
// IMPORTANT: Prices MUST match `supabase/functions/create-leflabs-order/index.ts`.
// The Edge Function is the source of truth — frontend prices are display only.

export type LefLabsProduct = {
  id: string;
  name: string;
  category: string;
  description: string;
  unit: string; // e.g. "per kg", "per unit", "per pack"
  price: number; // ZAR (1kg / single-unit list price)
  isBack?: boolean; // returning line, back in stock this month
  isNew?: boolean; // new this month
  isPreorder?: boolean; // unavailable now — orders open for a later month
};

export const LEFLABS_PRODUCTS: LefLabsProduct[] = [
  // ── HYDRO · TIER I · R45/kg from 1kg
  { id: "lef-hy-steel-clamp", name: "Steel Clamp", category: "Hydro · Tier I", description: "Full-cycle indoor hydroponic. R65 up to 500g · R55 at 750g · R45 from 1kg (hard floor). 100g min.", unit: "per kg (1kg+ price)", price: 45 },
  { id: "lef-hy-sugar-syndicate", name: "Sugar Syndicate", category: "Hydro · Tier I", description: "Full-cycle indoor hydroponic. R65 up to 500g · R55 at 750g · R45 from 1kg (hard floor). 100g min.", unit: "per kg (1kg+ price)", price: 45 },
  { id: "lef-hy-crimson-limit", name: "Crimson Limit", category: "Hydro · Tier I", description: "Full-cycle indoor hydroponic. R65 up to 500g · R55 at 750g · R45 from 1kg (hard floor). 100g min.", unit: "per kg (1kg+ price)", price: 45 },
  { id: "lef-hy-cobalt-cellar", name: "Cobalt Cellar", category: "Hydro · Tier I", description: "Full-cycle indoor hydroponic. R65 up to 500g · R55 at 750g · R45 from 1kg (hard floor). 100g min.", unit: "per kg (1kg+ price)", price: 45 },
  { id: "lef-hy-walnut-splitter", name: "Walnut Splitter", category: "Hydro · Tier I", description: "Full-cycle indoor hydroponic. R65 up to 500g · R55 at 750g · R45 from 1kg (hard floor). 100g min.", unit: "per kg (1kg+ price)", price: 45 },
  { id: "lef-hy-glacier-rime", name: "Glacier Rime", category: "Hydro · Tier I", description: "Full-cycle indoor hydroponic. R65 up to 500g · R55 at 750g · R45 from 1kg (hard floor). 100g min.", unit: "per kg (1kg+ price)", price: 45 },
  { id: "lef-hy-amethyst-calm", name: "Amethyst Calm", category: "Hydro · Tier I", description: "Full-cycle indoor hydroponic. R65 up to 500g · R55 at 750g · R45 from 1kg (hard floor). 100g min.", unit: "per kg (1kg+ price)", price: 45 },
  { id: "lef-hy-cloud-spritz", name: "Cloud Spritz", category: "Hydro · Tier I", description: "Full-cycle indoor hydroponic. R65 up to 500g · R55 at 750g · R45 from 1kg (hard floor). 100g min.", unit: "per kg (1kg+ price)", price: 45 },
  { id: "lef-hy-nebula-rare", name: "Nebula Rare", category: "Hydro · Tier I", description: "Full-cycle indoor hydroponic. R65 up to 500g · R55 at 750g · R45 from 1kg (hard floor). 100g min.", unit: "per kg (1kg+ price)", price: 45 },
  { id: "lef-hy-chewy-taffy", name: "Chewy Taffy", category: "Hydro · Tier I", description: "Full-cycle indoor hydroponic. R65 up to 500g · R55 at 750g · R45 from 1kg (hard floor). 100g min.", unit: "per kg (1kg+ price)", price: 45 },
  { id: "lef-hy-natal-thunder", name: "Natal Thunder", category: "Hydro · Tier I", description: "Full-cycle indoor hydroponic. R65 up to 500g · R55 at 750g · R45 from 1kg (hard floor). 100g min.", unit: "per kg (1kg+ price)", price: 45 },
  { id: "lef-hy-satsuma-zest", name: "Satsuma Zest", category: "Hydro · Tier I", description: "Full-cycle indoor hydroponic. R65 up to 500g · R55 at 750g · R45 from 1kg (hard floor). 100g min.", unit: "per kg (1kg+ price)", price: 45 },
  { id: "lef-hy-spectrum-drops", name: "Spectrum Drops", category: "Hydro · Tier I", description: "Full-cycle indoor hydroponic. R65 up to 500g · R55 at 750g · R45 from 1kg (hard floor). 100g min.", unit: "per kg (1kg+ price)", price: 45 },
  { id: "lef-hy-tropic-grenade", name: "Tropic Grenade", category: "Hydro · Tier I", description: "Full-cycle indoor hydroponic. R65 up to 500g · R55 at 750g · R45 from 1kg (hard floor). 100g min.", unit: "per kg (1kg+ price)", price: 45 },
  { id: "lef-hy-obsidian-cherry", name: "Obsidian Cherry", category: "Hydro · Tier I", description: "Full-cycle indoor hydroponic. R65 up to 500g · R55 at 750g · R45 from 1kg (hard floor). 100g min.", unit: "per kg (1kg+ price)", price: 45 },

  // ── INDOOR · TIER II · R35/kg from 1kg
  { id: "lef-ind-fission-jam", name: "Fission Jam", category: "Indoor · Tier II", description: "Indoor-grown, one step below Hydro. R55 up to 500g · R45 at 750g · R35 from 1kg. 5kg+ needs a 50% deposit. 100g min.", unit: "per kg (1kg+ price)", price: 35 },
  { id: "lef-ind-moonstalker", name: "Moonstalker", category: "Indoor · Tier II", description: "Indoor-grown, one step below Hydro. R55 up to 500g · R45 at 750g · R35 from 1kg. 5kg+ needs a 50% deposit. 100g min.", unit: "per kg (1kg+ price)", price: 35 },
  { id: "lef-ind-affogato-14", name: "Affogato 14", category: "Indoor · Tier II", description: "Indoor-grown, one step below Hydro. R55 up to 500g · R45 at 750g · R35 from 1kg. 5kg+ needs a 50% deposit. 100g min.", unit: "per kg (1kg+ price)", price: 35 },
  { id: "lef-ind-orchard-split", name: "Orchard Split", category: "Indoor · Tier II", description: "Indoor-grown, one step below Hydro. R55 up to 500g · R45 at 750g · R35 from 1kg. 5kg+ needs a 50% deposit. 100g min.", unit: "per kg (1kg+ price)", price: 35 },
  { id: "lef-ind-bridal-layer", name: "Bridal Layer", category: "Indoor · Tier II", description: "Indoor-grown, one step below Hydro. R55 up to 500g · R45 at 750g · R35 from 1kg. 5kg+ needs a 50% deposit. 100g min.", unit: "per kg (1kg+ price)", price: 35 },
  { id: "lef-ind-plantain-bond", name: "Plantain Bond", category: "Indoor · Tier II", description: "Indoor-grown, one step below Hydro. R55 up to 500g · R45 at 750g · R35 from 1kg. 5kg+ needs a 50% deposit. 100g min.", unit: "per kg (1kg+ price)", price: 35 },
  { id: "lef-ind-cocoa-cantaloupe", name: "Cocoa Cantaloupe", category: "Indoor · Tier II", description: "Indoor-grown, one step below Hydro. R55 up to 500g · R45 at 750g · R35 from 1kg. 5kg+ needs a 50% deposit. 100g min.", unit: "per kg (1kg+ price)", price: 35 },
  { id: "lef-ind-monarch-chain", name: "Monarch Chain", category: "Indoor · Tier II", description: "Indoor-grown, one step below Hydro. R55 up to 500g · R45 at 750g · R35 from 1kg. 5kg+ needs a 50% deposit. 100g min.", unit: "per kg (1kg+ price)", price: 35 },
  { id: "lef-ind-lapis-lagoon", name: "Lapis Lagoon", category: "Indoor · Tier II", description: "Indoor-grown, one step below Hydro. R55 up to 500g · R45 at 750g · R35 from 1kg. 5kg+ needs a 50% deposit. 100g min.", unit: "per kg (1kg+ price)", price: 35 },
  { id: "lef-ind-pastel-pebbles", name: "Pastel Pebbles", category: "Indoor · Tier II", description: "Indoor-grown, one step below Hydro. R55 up to 500g · R45 at 750g · R35 from 1kg. 5kg+ needs a 50% deposit. 100g min.", unit: "per kg (1kg+ price)", price: 35 },

  // ── GREENDOOR · TIER III · R27/kg from 1kg
  { id: "lef-gd-fiesta-parade", name: "Fiesta Parade", category: "Greendoor · Tier III", description: "Light-assisted cultivation. R45 up to 500g · R36 at 750g · R27 from 1kg. 250g min.", unit: "per kg (1kg+ price)", price: 27 },
  { id: "lef-gd-twilight-sprint", name: "Twilight Sprint", category: "Greendoor · Tier III", description: "Light-assisted cultivation. R45 up to 500g · R36 at 750g · R27 from 1kg. 250g min.", unit: "per kg (1kg+ price)", price: 27 },
  { id: "lef-gd-bronze-delta", name: "Bronze Delta", category: "Greendoor · Tier III", description: "Light-assisted cultivation. R45 up to 500g · R36 at 750g · R27 from 1kg. 250g min.", unit: "per kg (1kg+ price)", price: 27 },
  { id: "lef-gd-spark-apricot", name: "Spark Apricot", category: "Greendoor · Tier III", description: "Light-assisted cultivation. R45 up to 500g · R36 at 750g · R27 from 1kg. 250g min.", unit: "per kg (1kg+ price)", price: 27 },
  { id: "lef-gd-voltage-crimson", name: "Voltage Crimson", category: "Greendoor · Tier III", description: "Light-assisted cultivation. R45 up to 500g · R36 at 750g · R27 from 1kg. 250g min.", unit: "per kg (1kg+ price)", price: 27 },
  { id: "lef-gd-aurora-path", name: "Aurora Path", category: "Greendoor · Tier III", description: "Light-assisted cultivation. R45 up to 500g · R36 at 750g · R27 from 1kg. 250g min.", unit: "per kg (1kg+ price)", price: 27 },
  { id: "lef-gd-the-pledge", name: "The Pledge", category: "Greendoor · Tier III", description: "Light-assisted cultivation. R45 up to 500g · R36 at 750g · R27 from 1kg. 250g min.", unit: "per kg (1kg+ price)", price: 27 },

  // ── EXOTIC GREENHOUSE · TIER IV · R24/kg from 1kg
  { id: "lef-ex-sable-cherry-tart", name: "Sable Cherry Tart", category: "Exotic Greenhouse · Tier IV", description: "Greenhouse exotics & organics plus BT Mids & Pops. R44 up to 500g · R34 at 750g · R24 from 1kg. 250g min.", unit: "per kg (1kg+ price)", price: 24 },
  { id: "lef-ex-interval-breath", name: "Interval Breath", category: "Exotic Greenhouse · Tier IV", description: "Greenhouse exotics & organics plus BT Mids & Pops. R44 up to 500g · R34 at 750g · R24 from 1kg. 250g min.", unit: "per kg (1kg+ price)", price: 24 },
  { id: "lef-ex-fruitburst-pop", name: "Fruitburst Pop", category: "Exotic Greenhouse · Tier IV", description: "Greenhouse exotics & organics plus BT Mids & Pops. R44 up to 500g · R34 at 750g · R24 from 1kg. 250g min.", unit: "per kg (1kg+ price)", price: 24 },
  { id: "lef-ex-mach-seven", name: "Mach Seven", category: "Exotic Greenhouse · Tier IV", description: "Greenhouse exotics & organics plus BT Mids & Pops. R44 up to 500g · R34 at 750g · R24 from 1kg. 250g min.", unit: "per kg (1kg+ price)", price: 24 },
  { id: "lef-ex-allium-blend", name: "Allium Blend", category: "Exotic Greenhouse · Tier IV", description: "Greenhouse exotics & organics plus BT Mids & Pops. R44 up to 500g · R34 at 750g · R24 from 1kg. 250g min.", unit: "per kg (1kg+ price)", price: 24 },
  { id: "lef-ex-titan-glue", name: "Titan Glue", category: "Exotic Greenhouse · Tier IV", description: "Greenhouse exotics & organics plus BT Mids & Pops. R44 up to 500g · R34 at 750g · R24 from 1kg. 250g min.", unit: "per kg (1kg+ price)", price: 24 },
  { id: "lef-ex-pawpaw-punch", name: "Pawpaw Punch", category: "Exotic Greenhouse · Tier IV", description: "Greenhouse exotics & organics plus BT Mids & Pops. R44 up to 500g · R34 at 750g · R24 from 1kg. 250g min.", unit: "per kg (1kg+ price)", price: 24, isBack: true },
  { id: "lef-ex-vanilla-frost-cream", name: "Vanilla Frost Cream (Organic)", category: "Exotic Greenhouse · Tier IV", description: "Greenhouse exotics & organics plus BT Mids & Pops. R44 up to 500g · R34 at 750g · R24 from 1kg. 250g min.", unit: "per kg (1kg+ price)", price: 24 },
  { id: "lef-ex-indigo-pegasus", name: "Indigo Pegasus", category: "Exotic Greenhouse · Tier IV", description: "Greenhouse exotics & organics plus BT Mids & Pops. R44 up to 500g · R34 at 750g · R24 from 1kg. 250g min.", unit: "per kg (1kg+ price)", price: 24 },
  { id: "lef-ex-muddy-banoffee", name: "Muddy Banoffee", category: "Exotic Greenhouse · Tier IV", description: "Greenhouse exotics & organics plus BT Mids & Pops. R44 up to 500g · R34 at 750g · R24 from 1kg. 250g min.", unit: "per kg (1kg+ price)", price: 24 },
  { id: "lef-ex-bongo-kush", name: "Bongo Kush", category: "Exotic Greenhouse · Tier IV", description: "Greenhouse exotics & organics plus BT Mids & Pops. R44 up to 500g · R34 at 750g · R24 from 1kg. 250g min.", unit: "per kg (1kg+ price)", price: 24, isBack: true },
  { id: "lef-ex-bramble-hound", name: "Bramble Hound", category: "Exotic Greenhouse · Tier IV", description: "Greenhouse exotics & organics plus BT Mids & Pops. R44 up to 500g · R34 at 750g · R24 from 1kg. 250g min.", unit: "per kg (1kg+ price)", price: 24 },
  { id: "lef-ex-steed", name: "Steed", category: "Exotic Greenhouse · Tier IV", description: "Greenhouse exotics & organics plus BT Mids & Pops. R44 up to 500g · R34 at 750g · R24 from 1kg. 250g min.", unit: "per kg (1kg+ price)", price: 24 },
  { id: "lef-ex-sour-fuel-hound", name: "Sour Fuel Hound", category: "Exotic Greenhouse · Tier IV", description: "Greenhouse exotics & organics plus BT Mids & Pops. R44 up to 500g · R34 at 750g · R24 from 1kg. 250g min.", unit: "per kg (1kg+ price)", price: 24 },
  { id: "lef-ex-orchid-bear", name: "Orchid Bear (Organic)", category: "Exotic Greenhouse · Tier IV", description: "Greenhouse exotics & organics plus BT Mids & Pops. R44 up to 500g · R34 at 750g · R24 from 1kg. 250g min.", unit: "per kg (1kg+ price)", price: 24 },
  { id: "lef-ex-starmetal", name: "Starmetal", category: "Exotic Greenhouse · Tier IV", description: "Greenhouse exotics & organics plus BT Mids & Pops. R44 up to 500g · R34 at 750g · R24 from 1kg. 250g min.", unit: "per kg (1kg+ price)", price: 24 },
  { id: "lef-ex-cheddar-cloud", name: "Cheddar Cloud", category: "Exotic Greenhouse · Tier IV", description: "Greenhouse exotics & organics plus BT Mids & Pops. R44 up to 500g · R34 at 750g · R24 from 1kg. 250g min.", unit: "per kg (1kg+ price)", price: 24 },
  { id: "lef-ex-final-round", name: "Final Round", category: "Exotic Greenhouse · Tier IV", description: "Greenhouse exotics & organics plus BT Mids & Pops. R44 up to 500g · R34 at 750g · R24 from 1kg. 250g min.", unit: "per kg (1kg+ price)", price: 24, isBack: true },
  { id: "lef-ex-cobblestone-swirl", name: "Cobblestone Swirl", category: "Exotic Greenhouse · Tier IV", description: "Greenhouse exotics & organics plus BT Mids & Pops. R44 up to 500g · R34 at 750g · R24 from 1kg. 250g min.", unit: "per kg (1kg+ price)", price: 24 },
  { id: "lef-ex-veneer", name: "Veneer", category: "Exotic Greenhouse · Tier IV", description: "Greenhouse exotics & organics plus BT Mids & Pops. R44 up to 500g · R34 at 750g · R24 from 1kg. 250g min.", unit: "per kg (1kg+ price)", price: 24 },
  { id: "lef-ex-pastel-sorbet-11", name: "Pastel Sorbet 11", category: "Exotic Greenhouse · Tier IV", description: "Greenhouse exotics & organics plus BT Mids & Pops. R44 up to 500g · R34 at 750g · R24 from 1kg. 250g min.", unit: "per kg (1kg+ price)", price: 24, isBack: true },
  { id: "lef-ex-slush-chief", name: "Slush Chief (Organic)", category: "Exotic Greenhouse · Tier IV", description: "Greenhouse exotics & organics plus BT Mids & Pops. R44 up to 500g · R34 at 750g · R24 from 1kg. 250g min.", unit: "per kg (1kg+ price)", price: 24 },

  // ── SUNGROWN · TIER V · R15/kg from 1kg
  { id: "lef-sg-dawn-mix", name: "Dawn Mix", category: "Sungrown · Tier V", description: "Unavailable until December — orders open, send us your numbers. R35 up to 500g · R25 at 750g · R15 from 1kg. 250g min.", unit: "per kg (1kg+ price)", price: 15, isPreorder: true },
  { id: "lef-sg-even-split", name: "Even Split", category: "Sungrown · Tier V", description: "Unavailable until December — orders open, send us your numbers. R35 up to 500g · R25 at 750g · R15 from 1kg. 250g min.", unit: "per kg (1kg+ price)", price: 15, isPreorder: true },
  { id: "lef-sg-fiesta-parade", name: "Fiesta Parade", category: "Sungrown · Tier V", description: "Unavailable until December — orders open, send us your numbers. R35 up to 500g · R25 at 750g · R15 from 1kg. 250g min.", unit: "per kg (1kg+ price)", price: 15, isPreorder: true },
  { id: "lef-sg-twilight-sprint", name: "Twilight Sprint", category: "Sungrown · Tier V", description: "Unavailable until December — orders open, send us your numbers. R35 up to 500g · R25 at 750g · R15 from 1kg. 250g min.", unit: "per kg (1kg+ price)", price: 15, isPreorder: true },
  { id: "lef-sg-the-pledge", name: "The Pledge", category: "Sungrown · Tier V", description: "Unavailable until December — orders open, send us your numbers. R35 up to 500g · R25 at 750g · R15 from 1kg. 250g min.", unit: "per kg (1kg+ price)", price: 15, isPreorder: true },
  { id: "lef-sg-ruby-beacon", name: "Ruby Beacon", category: "Sungrown · Tier V", description: "Unavailable until December — orders open, send us your numbers. R35 up to 500g · R25 at 750g · R15 from 1kg. 250g min.", unit: "per kg (1kg+ price)", price: 15, isPreorder: true },

  // ── POPS & MINI POPS
  {
    id: "lef-pop-assorted",
    name: "Pops — Assorted Small/Medium",
    category: "Pops & Mini Pops",
    description: "Assorted small-to-medium nugs drawn from any range on the list. From 250g bags.",
    unit: "each",
    price: 25,
  },
  {
    id: "lef-pop-mini",
    name: "Mini Pops — Small Only (Greendoor / Indoor)",
    category: "Pops & Mini Pops",
    description: "Uniform small nugs only, sourced from Greendoor or Indoor. From 250g bags.",
    unit: "each",
    price: 15,
  },

  // ── RAW MATERIAL
  {
    id: "lef-raw-untrimmed",
    name: "Untrimmed Bud (Greendoor)",
    category: "Raw Material",
    description: "Fully seedless Greendoor-grown bud, untrimmed. Not outdoor. Fixed price, minimum 2.5kg. Raw material delivery R1,500 per order.",
    unit: "per kg",
    price: 10,
  },
  {
    id: "lef-raw-crush-shake",
    name: "Trim",
    category: "Raw Material",
    description: "For buyers making their own pre-rolls. Fixed price, minimum 2kg. Raw material delivery R1,500 per order.",
    unit: "per kg",
    price: 6,
  },

  // ── PRE-ROLLS & MOONSTICKS · 1.4g · MOQ 100
  {
    id: "lef-pr-indoor-glass",
    name: "Indoor Pre-Roll · Glass Tube",
    category: "Pre-Rolls & Moonsticks",
    description: "1.4g indoor flower · premium glass tube. MOQ 100 units.",
    unit: "per unit",
    price: 40,
  },
  {
    id: "lef-pr-indoor-plastic",
    name: "Indoor Pre-Roll · Plastic Tube",
    category: "Pre-Rolls & Moonsticks",
    description: "1.4g indoor flower · plastic tube. MOQ 100 units.",
    unit: "per unit",
    price: 39,
  },
  {
    id: "lef-pr-gh-glass",
    name: "Greenhouse Pre-Roll · Glass Tube",
    category: "Pre-Rolls & Moonsticks",
    description: "1.4g greenhouse flower · premium glass tube. MOQ 100 units.",
    unit: "per unit",
    price: 30,
  },
  {
    id: "lef-pr-gh-plastic",
    name: "Greenhouse Pre-Roll · Plastic Tube",
    category: "Pre-Rolls & Moonsticks",
    description: "1.4g greenhouse flower · plastic tube. MOQ 100 units.",
    unit: "per unit",
    price: 27,
  },
  {
    id: "lef-pr-gh-standard",
    name: "Greenhouse Pre-Roll · Standard",
    category: "Pre-Rolls & Moonsticks",
    description: "1.4g greenhouse flower · standard format. MOQ 100 units.",
    unit: "per unit",
    price: 25,
  },
  {
    id: "lef-pr-moonstick-indoor",
    name: "Indoor Moonstick",
    category: "Pre-Rolls & Moonsticks",
    description: "1.4g indoor flower · kief-coated · premium format. MOQ 100 units.",
    unit: "per unit",
    price: 65,
  },
  {
    id: "lef-pr-moonstick-gh",
    name: "Greenhouse Moonstick",
    category: "Pre-Rolls & Moonsticks",
    description: "1.4g greenhouse flower · kief-coated. MOQ 100 units.",
    unit: "per unit",
    price: 45,
  },

  // ── VAPES · R399 FLAT · MOQ 20
  { id: "lef-vp-liquid-gold", name: "Liquid Gold Cartridge", category: "Vapes · R399 Flat", description: "One flat price across all six lines. Flavours: Bilberry Rush, Maeve's Breath, Dario's Doughnuts, Dizzy Mallard, Strawberry Kai, Square Dance, Azure Reverie. MOQ 20 units.", unit: "per unit", price: 399 },
  { id: "lef-vp-pure-leaf", name: "Pure Leaf Cartridge", category: "Vapes · R399 Flat", description: "One flat price across all six lines. Flavours: Bilberry Rush, Maeve's Breath, Dario's Doughnuts, Dizzy Mallard, Strawberry Kai, Square Dance, Azure Reverie. MOQ 20 units.", unit: "per unit", price: 399 },
  { id: "lef-vp-dirty-vapes", name: "Dirty Vapes Cartridge", category: "Vapes · R399 Flat", description: "One flat price across all six lines. Flavours: Bilberry Rush, Maeve's Breath, Dario's Doughnuts, Dizzy Mallard, Strawberry Kai, Square Dance, Azure Reverie. MOQ 20 units.", unit: "per unit", price: 399 },
  { id: "lef-vp-funkt", name: "Funk't Cartridge", category: "Vapes · R399 Flat", description: "One flat price across all six lines. Flavours: Bilberry Rush, Maeve's Breath, Dario's Doughnuts, Dizzy Mallard, Strawberry Kai, Square Dance, Azure Reverie. MOQ 20 units.", unit: "per unit", price: 399 },
  { id: "lef-vp-leflabs", name: "LëF Labs Vapes Cartridge", category: "Vapes · R399 Flat", description: "One flat price across all six lines. Flavours: Bilberry Rush, Maeve's Breath, Dario's Doughnuts, Dizzy Mallard, Strawberry Kai, Square Dance, Azure Reverie. MOQ 20 units.", unit: "per unit", price: 399 },
  { id: "lef-vp-kush-tells", name: "Kush & Tells Cartridge", category: "Vapes · R399 Flat", description: "One flat price across all six lines. Flavours: Bilberry Rush, Maeve's Breath, Dario's Doughnuts, Dizzy Mallard, Strawberry Kai, Square Dance, Azure Reverie. MOQ 20 units.", unit: "per unit", price: 399 },

  // ── SOUR EDIBLES
  {
    id: "lef-ed-sour-15mg",
    name: "Sour Edibles 15mg — Standard",
    category: "Sour Edibles",
    description: "Cherry · Mango · Pineapple · Watermelon · Litchi. MOQ 10 packs per flavour.",
    unit: "per pack",
    price: 150,
  },
  {
    id: "lef-ed-sour-30mg",
    name: "Sour Edibles 30mg — Premium",
    category: "Sour Edibles",
    description: "Elderflower Green Apple · Cherry Cola. MOQ 10 packs per flavour.",
    unit: "per pack",
    price: 180,
  },
];

export const LEFLABS_PRODUCT_MAP: Record<string, LefLabsProduct> = Object.fromEntries(
  LEFLABS_PRODUCTS.map((p) => [p.id, p])
);
