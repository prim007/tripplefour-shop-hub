// Lëf Labs wholesale order list — OCTOBER 2026 CATALOGUE.
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
};

export const LEFLABS_PRODUCTS: LefLabsProduct[] = [
  // ── HYDRO · TIER I · R45/kg list
  { id: "lef-hy-iron-grip", name: "Iron Grip", category: "Hydro · Tier I", description: "Full-cycle indoor hydroponic. R0.50/kg steps to the R43/kg floor at 5kg, held through 10–15kg. 100g min.", unit: "per kg (1kg list)", price: 45 },
  { id: "lef-hy-candy-cartel", name: "Candy Cartel", category: "Hydro · Tier I", description: "Full-cycle indoor hydroponic. R0.50/kg steps to the R43/kg floor at 5kg, held through 10–15kg. 100g min.", unit: "per kg (1kg list)", price: 45 },
  { id: "lef-hy-redline", name: "Redline", category: "Hydro · Tier I", description: "Full-cycle indoor hydroponic. R0.50/kg steps to the R43/kg floor at 5kg, held through 10–15kg. 100g min.", unit: "per kg (1kg list)", price: 45 },
  { id: "lef-hy-blue-vault", name: "Blue Vault", category: "Hydro · Tier I", description: "Full-cycle indoor hydroponic. R0.50/kg steps to the R43/kg floor at 5kg, held through 10–15kg. 100g min.", unit: "per kg (1kg list)", price: 45 },
  { id: "lef-hy-nutcracker", name: "Nutcracker", category: "Hydro · Tier I", description: "Full-cycle indoor hydroponic. R0.50/kg steps to the R43/kg floor at 5kg, held through 10–15kg. 100g min.", unit: "per kg (1kg list)", price: 45 },
  { id: "lef-hy-permafrost", name: "Permafrost", category: "Hydro · Tier I", description: "Full-cycle indoor hydroponic. R0.50/kg steps to the R43/kg floor at 5kg, held through 10–15kg. 100g min.", unit: "per kg (1kg list)", price: 45 },
  { id: "lef-hy-purple-parve", name: "Purple Parve", category: "Hydro · Tier I", description: "Full-cycle indoor hydroponic. R0.50/kg steps to the R43/kg floor at 5kg, held through 10–15kg. 100g min.", unit: "per kg (1kg list)", price: 45 },
  { id: "lef-hy-marshmallow-mimosa", name: "Marshmallow Mimosa", category: "Hydro · Tier I", description: "Full-cycle indoor hydroponic. R0.50/kg steps to the R43/kg floor at 5kg, held through 10–15kg. 100g min.", unit: "per kg (1kg list)", price: 45 },
  { id: "lef-hy-galaxy-exotica", name: "Galaxy Exotica", category: "Hydro · Tier I", description: "Full-cycle indoor hydroponic. R0.50/kg steps to the R43/kg floor at 5kg, held through 10–15kg. 100g min.", unit: "per kg (1kg list)", price: 45 },
  { id: "lef-hy-bubblegum-glue", name: "Bubblegum Glue", category: "Hydro · Tier I", description: "Full-cycle indoor hydroponic. R0.50/kg steps to the R43/kg floor at 5kg, held through 10–15kg. 100g min.", unit: "per kg (1kg list)", price: 45 },
  { id: "lef-hy-durban-poison", name: "Durban Poison", category: "Hydro · Tier I", description: "Full-cycle indoor hydroponic. R0.50/kg steps to the R43/kg floor at 5kg, held through 10–15kg. 100g min.", unit: "per kg (1kg list)", price: 45 },
  { id: "lef-hy-mandarin-orange", name: "Mandarin Orange", category: "Hydro · Tier I", description: "Full-cycle indoor hydroponic. R0.50/kg steps to the R43/kg floor at 5kg, held through 10–15kg. 100g min.", unit: "per kg (1kg list)", price: 45 },
  { id: "lef-hy-rainbow-skittles", name: "Rainbow Skittles", category: "Hydro · Tier I", description: "Full-cycle indoor hydroponic. R0.50/kg steps to the R43/kg floor at 5kg, held through 10–15kg. 100g min.", unit: "per kg (1kg list)", price: 45 },
  { id: "lef-hy-guava-bomb", name: "Guava Bomb", category: "Hydro · Tier I", description: "Full-cycle indoor hydroponic. R0.50/kg steps to the R43/kg floor at 5kg, held through 10–15kg. 100g min.", unit: "per kg (1kg list)", price: 45 },
  { id: "lef-hy-black-cherry-pie", name: "Black Cherry Pie", category: "Hydro · Tier I", description: "Full-cycle indoor hydroponic. R0.50/kg steps to the R43/kg floor at 5kg, held through 10–15kg. 100g min.", unit: "per kg (1kg list)", price: 45 },

  // ── INDOOR · TIER II · R35/kg list
  { id: "lef-ind-atomic-jelly", name: "Atomic Jelly", category: "Indoor · Tier II", description: "Indoor-grown, one step below Hydro. R28/kg at 5kg (50% deposit). 100g min.", unit: "per kg (1kg list)", price: 35 },
  { id: "lef-ind-nightwalker", name: "Nightwalker", category: "Indoor · Tier II", description: "Indoor-grown, one step below Hydro. R28/kg at 5kg (50% deposit). 100g min.", unit: "per kg (1kg list)", price: 35 },
  { id: "lef-ind-gelato-41", name: "Gelato 41", category: "Indoor · Tier II", description: "Indoor-grown, one step below Hydro. R28/kg at 5kg (50% deposit). 100g min.", unit: "per kg (1kg list)", price: 35 },
  { id: "lef-ind-apples-bananas", name: "Apples & Bananas", category: "Indoor · Tier II", description: "Indoor-grown, one step below Hydro. R28/kg at 5kg (50% deposit). 100g min.", unit: "per kg (1kg list)", price: 35 },
  { id: "lef-ind-wedding", name: "Wedding", category: "Indoor · Tier II", description: "Indoor-grown, one step below Hydro. R28/kg at 5kg (50% deposit). 100g min.", unit: "per kg (1kg list)", price: 35 },
  { id: "lef-ind-nanaglue", name: "NanaGlue", category: "Indoor · Tier II", description: "Indoor-grown, one step below Hydro. R28/kg at 5kg (50% deposit). 100g min.", unit: "per kg (1kg list)", price: 35 },
  { id: "lef-ind-chocolope", name: "ChocoLope", category: "Indoor · Tier II", description: "Indoor-grown, one step below Hydro. R28/kg at 5kg (50% deposit). 100g min.", unit: "per kg (1kg list)", price: 35 },
  { id: "lef-ind-king-bling", name: "King Bling", category: "Indoor · Tier II", description: "Indoor-grown, one step below Hydro. R28/kg at 5kg (50% deposit). 100g min.", unit: "per kg (1kg list)", price: 35 },
  { id: "lef-ind-sapphire-blue", name: "Sapphire Blue", category: "Indoor · Tier II", description: "Indoor-grown, one step below Hydro. R28/kg at 5kg (50% deposit). 100g min.", unit: "per kg (1kg list)", price: 35 },
  { id: "lef-ind-runts", name: "Runts", category: "Indoor · Tier II", description: "Indoor-grown, one step below Hydro. R28/kg at 5kg (50% deposit). 100g min.", unit: "per kg (1kg list)", price: 35 },

  // ── GREENDOOR · TIER III · R27/kg list
  { id: "lef-gd-carnaval", name: "Carnaval", category: "Greendoor · Tier III", description: "Light-assisted cultivation. R0.50/kg steps to R25/kg at 5kg. 250g min.", unit: "per kg (1kg list)", price: 27 },
  { id: "lef-gd-dusk-run", name: "Dusk Run", category: "Greendoor · Tier III", description: "Light-assisted cultivation. R0.50/kg steps to R25/kg at 5kg. 250g min.", unit: "per kg (1kg list)", price: 27 },
  { id: "lef-gd-copper-triangle", name: "Copper Triangle", category: "Greendoor · Tier III", description: "Light-assisted cultivation. R0.50/kg steps to R25/kg at 5kg. 250g min.", unit: "per kg (1kg list)", price: 27 },
  { id: "lef-gd-static-peach", name: "Static Peach", category: "Greendoor · Tier III", description: "Light-assisted cultivation. R0.50/kg steps to R25/kg at 5kg. 250g min.", unit: "per kg (1kg list)", price: 27 },
  { id: "lef-gd-static-crimson", name: "Static Crimson", category: "Greendoor · Tier III", description: "Light-assisted cultivation. R0.50/kg steps to R25/kg at 5kg. 250g min.", unit: "per kg (1kg list)", price: 27 },
  { id: "lef-gd-prism-trail", name: "Prism Trail", category: "Greendoor · Tier III", description: "Light-assisted cultivation. R0.50/kg steps to R25/kg at 5kg. 250g min.", unit: "per kg (1kg list)", price: 27 },
  { id: "lef-gd-the-vow", name: "The Vow", category: "Greendoor · Tier III", description: "Light-assisted cultivation. R0.50/kg steps to R25/kg at 5kg. 250g min.", unit: "per kg (1kg list)", price: 27 },

  // ── EXOTIC GREENHOUSE · TIER IV · R24/kg list
  { id: "lef-ex-black-cherry-tart", name: "Black Cherry Tart", category: "Exotic Greenhouse · Tier IV", description: "Greenhouse exotics & organics plus BT Mids & Pops. R18/kg at 5kg. 250g min.", unit: "per kg (1kg list)", price: 24 },
  { id: "lef-ex-breakpad-breath", name: "Breakpad Breath", category: "Exotic Greenhouse · Tier IV", description: "Greenhouse exotics & organics plus BT Mids & Pops. R18/kg at 5kg. 250g min.", unit: "per kg (1kg list)", price: 24 },
  { id: "lef-ex-zkittlez-pop", name: "Zkittlez Pop", category: "Exotic Greenhouse · Tier IV", description: "Greenhouse exotics & organics plus BT Mids & Pops. R18/kg at 5kg. 250g min.", unit: "per kg (1kg list)", price: 24 },
  { id: "lef-ex-x7m", name: "X7M", category: "Exotic Greenhouse · Tier IV", description: "Greenhouse exotics & organics plus BT Mids & Pops. R18/kg at 5kg. 250g min.", unit: "per kg (1kg list)", price: 24 },
  { id: "lef-ex-garlic-fusion", name: "Garlic Fusion", category: "Exotic Greenhouse · Tier IV", description: "Greenhouse exotics & organics plus BT Mids & Pops. R18/kg at 5kg. 250g min.", unit: "per kg (1kg list)", price: 24 },
  { id: "lef-ex-gg42", name: "GG42", category: "Exotic Greenhouse · Tier IV", description: "Greenhouse exotics & organics plus BT Mids & Pops. R18/kg at 5kg. 250g min.", unit: "per kg (1kg list)", price: 24 },
  { id: "lef-ex-papaya", name: "Papaya", category: "Exotic Greenhouse · Tier IV", description: "Greenhouse exotics & organics plus BT Mids & Pops. R18/kg at 5kg. 250g min.", unit: "per kg (1kg list)", price: 24, isBack: true },
  { id: "lef-ex-ice-cream", name: "Ice Cream (Organic)", category: "Exotic Greenhouse · Tier IV", description: "Greenhouse exotics & organics plus BT Mids & Pops. R18/kg at 5kg. 250g min.", unit: "per kg (1kg list)", price: 24 },
  { id: "lef-ex-blunicorn", name: "Blunicorn", category: "Exotic Greenhouse · Tier IV", description: "Greenhouse exotics & organics plus BT Mids & Pops. R18/kg at 5kg. 250g min.", unit: "per kg (1kg list)", price: 24 },
  { id: "lef-ex-dirty-banana", name: "Dirty Banana", category: "Exotic Greenhouse · Tier IV", description: "Greenhouse exotics & organics plus BT Mids & Pops. R18/kg at 5kg. 250g min.", unit: "per kg (1kg list)", price: 24 },
  { id: "lef-ex-kimbo-kush", name: "Kimbo Kush", category: "Exotic Greenhouse · Tier IV", description: "Greenhouse exotics & organics plus BT Mids & Pops. R18/kg at 5kg. 250g min.", unit: "per kg (1kg list)", price: 24, isBack: true },
  { id: "lef-ex-strwadawg", name: "Strwadawg", category: "Exotic Greenhouse · Tier IV", description: "Greenhouse exotics & organics plus BT Mids & Pops. R18/kg at 5kg. 250g min.", unit: "per kg (1kg list)", price: 24 },
  { id: "lef-ex-nag", name: "Nag", category: "Exotic Greenhouse · Tier IV", description: "Greenhouse exotics & organics plus BT Mids & Pops. R18/kg at 5kg. 250g min.", unit: "per kg (1kg list)", price: 24 },
  { id: "lef-ex-sour-diesel-chemdawg", name: "Sour Diesel Chemdawg", category: "Exotic Greenhouse · Tier IV", description: "Greenhouse exotics & organics plus BT Mids & Pops. R18/kg at 5kg. 250g min.", unit: "per kg (1kg list)", price: 24 },
  { id: "lef-ex-purple-panda", name: "Purple Panda (Organic)", category: "Exotic Greenhouse · Tier IV", description: "Greenhouse exotics & organics plus BT Mids & Pops. R18/kg at 5kg. 250g min.", unit: "per kg (1kg list)", price: 24 },
  { id: "lef-ex-vibranium", name: "Vibranium", category: "Exotic Greenhouse · Tier IV", description: "Greenhouse exotics & organics plus BT Mids & Pops. R18/kg at 5kg. 250g min.", unit: "per kg (1kg list)", price: 24 },
  { id: "lef-ex-cheese", name: "Cheese", category: "Exotic Greenhouse · Tier IV", description: "Greenhouse exotics & organics plus BT Mids & Pops. R18/kg at 5kg. 250g min.", unit: "per kg (1kg list)", price: 24 },
  { id: "lef-ex-endgame", name: "Endgame", category: "Exotic Greenhouse · Tier IV", description: "Greenhouse exotics & organics plus BT Mids & Pops. R18/kg at 5kg. 250g min.", unit: "per kg (1kg list)", price: 24, isBack: true },
  { id: "lef-ex-zwich-pave", name: "Zwich Pavé", category: "Exotic Greenhouse · Tier IV", description: "Greenhouse exotics & organics plus BT Mids & Pops. R18/kg at 5kg. 250g min.", unit: "per kg (1kg list)", price: 24 },
  { id: "lef-ex-facade", name: "Facade", category: "Exotic Greenhouse · Tier IV", description: "Greenhouse exotics & organics plus BT Mids & Pops. R18/kg at 5kg. 250g min.", unit: "per kg (1kg list)", price: 24 },
  { id: "lef-ex-rs11", name: "RS11", category: "Exotic Greenhouse · Tier IV", description: "Greenhouse exotics & organics plus BT Mids & Pops. R18/kg at 5kg. 250g min.", unit: "per kg (1kg list)", price: 24, isBack: true },
  { id: "lef-ex-slurry-boss", name: "Slurry Boss (Organic)", category: "Exotic Greenhouse · Tier IV", description: "Greenhouse exotics & organics plus BT Mids & Pops. R18/kg at 5kg. 250g min.", unit: "per kg (1kg list)", price: 24 },

  // ── SUNGROWN · TIER V · R15/kg list
  { id: "lef-sg-sunup-blend", name: "Sunup Blend", category: "Sungrown · Tier V", description: "Everyday range. R13/kg at 5kg; 10–15kg by arrangement. 250g min.", unit: "per kg (1kg list)", price: 15 },
  { id: "lef-sg-fifty-fifty", name: "Fifty/Fifty", category: "Sungrown · Tier V", description: "Everyday range. R13/kg at 5kg; 10–15kg by arrangement. 250g min.", unit: "per kg (1kg list)", price: 15 },
  { id: "lef-sg-carnaval", name: "Carnaval", category: "Sungrown · Tier V", description: "Everyday range. R13/kg at 5kg; 10–15kg by arrangement. 250g min.", unit: "per kg (1kg list)", price: 15 },
  { id: "lef-sg-dusk-run", name: "Dusk Run", category: "Sungrown · Tier V", description: "Everyday range. R13/kg at 5kg; 10–15kg by arrangement. 250g min.", unit: "per kg (1kg list)", price: 15 },
  { id: "lef-sg-the-vow", name: "The Vow", category: "Sungrown · Tier V", description: "Everyday range. R13/kg at 5kg; 10–15kg by arrangement. 250g min.", unit: "per kg (1kg list)", price: 15 },
  { id: "lef-sg-scarlett-siren", name: "Scarlett Siren", category: "Sungrown · Tier V", description: "Everyday range. R13/kg at 5kg; 10–15kg by arrangement. 250g min.", unit: "per kg (1kg list)", price: 15 },

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
    description: "Fully seedless Greendoor-grown bud, untrimmed. Not outdoor. Minimum 250g.",
    unit: "per kg",
    price: 10,
  },
  {
    id: "lef-raw-crush-shake",
    name: "Crush & Shake",
    category: "Raw Material",
    description: "For buyers rolling their own pre-rolls. Estimates on request.",
    unit: "per gram",
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
  { id: "lef-vp-liquid-gold", name: "Liquid Gold Cartridge", category: "Vapes · R399 Flat", description: "One flat price across all six lines. Flavours: Blueberry Blitz, Lucy's Breath, Dante's Donuts, Daffy Duck, Strawberry Kim, Dosido, Blue Dream. MOQ 20 units.", unit: "per unit", price: 399 },
  { id: "lef-vp-pure-leaf", name: "Pure Leaf Cartridge", category: "Vapes · R399 Flat", description: "One flat price across all six lines. Flavours: Blueberry Blitz, Lucy's Breath, Dante's Donuts, Daffy Duck, Strawberry Kim, Dosido, Blue Dream. MOQ 20 units.", unit: "per unit", price: 399 },
  { id: "lef-vp-dirty-vapes", name: "Dirty Vapes Cartridge", category: "Vapes · R399 Flat", description: "One flat price across all six lines. Flavours: Blueberry Blitz, Lucy's Breath, Dante's Donuts, Daffy Duck, Strawberry Kim, Dosido, Blue Dream. MOQ 20 units.", unit: "per unit", price: 399 },
  { id: "lef-vp-funkt", name: "Funk't Cartridge", category: "Vapes · R399 Flat", description: "One flat price across all six lines. Flavours: Blueberry Blitz, Lucy's Breath, Dante's Donuts, Daffy Duck, Strawberry Kim, Dosido, Blue Dream. MOQ 20 units.", unit: "per unit", price: 399 },
  { id: "lef-vp-leflabs", name: "LëF Labs Vapes Cartridge", category: "Vapes · R399 Flat", description: "One flat price across all six lines. Flavours: Blueberry Blitz, Lucy's Breath, Dante's Donuts, Daffy Duck, Strawberry Kim, Dosido, Blue Dream. MOQ 20 units.", unit: "per unit", price: 399, isNew: true },
  { id: "lef-vp-kush-tells", name: "Kush & Tells Cartridge", category: "Vapes · R399 Flat", description: "One flat price across all six lines. Flavours: Blueberry Blitz, Lucy's Breath, Dante's Donuts, Daffy Duck, Strawberry Kim, Dosido, Blue Dream. MOQ 20 units.", unit: "per unit", price: 399, isNew: true },

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
