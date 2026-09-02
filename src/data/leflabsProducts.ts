// Lëf Labs wholesale order list — SEPTEMBER 2026 CATALOGUE.
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

const tier1 = (id: string, name: string, back = false): LefLabsProduct => ({
  id: `lef-4a-${id}`,
  name,
  category: "4A Indoor · Tier I",
  description: "Full-cycle indoor hydroponic. Floor R43/kg held through 10–15kg. 100g min.",
  unit: "per kg (1kg list)",
  price: 45,
  isBack: back,
});

const tier2 = (id: string, name: string, back = false): LefLabsProduct => ({
  id: `lef-ind-${id}`,
  name,
  category: "Indoor · Tier II",
  description: "Controlled-environment indoor, one step below 4A. R28/kg at 5kg (50% deposit). 100g min.",
  unit: "per kg (1kg list)",
  price: 35,
  isBack: back,
});

const tier3 = (id: string, name: string, opts: { back?: boolean; organic?: boolean } = {}): LefLabsProduct => ({
  id: `lef-gd-${id}`,
  name: opts.organic ? `${name} (Organic · 4A)` : name,
  category: "Greendoor · Tier III",
  description: "Light-assisted cultivation. R25/kg at 5kg. 250g min.",
  unit: "per kg (1kg list)",
  price: 27,
  isBack: opts.back,
});

const tier4 = (id: string, name: string, back = false): LefLabsProduct => ({
  id: `lef-ex-${id}`,
  name,
  category: "Exotic Greenhouse · Tier IV",
  description: "Greenhouse exotics plus BT Mids & Pops. R18/kg at 5kg. 250g min.",
  unit: "per kg (1kg list)",
  price: 24,
  isBack: back,
});

const tier5 = (id: string, name: string): LefLabsProduct => ({
  id: `lef-gh-${id}`,
  name,
  category: "Greenhouse · Tier V",
  description: "Everyday range. R13/kg at 5kg; 10–15kg by arrangement. 250g min.",
  unit: "per kg (1kg list)",
  price: 15,
});

export const LEFLABS_PRODUCTS: LefLabsProduct[] = [
  // ── TIER I · 4A INDOOR · R45–R43/kg
  tier1("blue-zushi", "Blue Zushi"),
  tier1("pure-michigan", "Pure Michigan"),
  tier1("rainbow-royale", "Rainbow Royale"),
  tier1("bcp", "BCP"),
  tier1("guerilla-glue", "Guerilla Glue"),
  tier1("jack-herer", "Jack Herer"),
  tier1("blue-dream", "Blue Dream"),
  tier1("gorilla-zkittlez", "Gorilla Zkittlez"),
  tier1("divine-kush-breath", "Divine Kush Breath"),
  tier1("jungle-diamonds", "Jungle Diamonds"),
  tier1("divinity", "Divinity"),
  tier1("cold-snap", "Cold Snap"),
  tier1("cream-mandarin-diesel", "Cream Mandarin Diesel"),
  tier1("alien-terminal", "Alien Terminal"),
  tier1("jamaican-wedding", "Jamaican Wedding"),
  tier1("citradelic-sunset", "Citradelic Sunset"),
  tier1("garlic-sherbet", "Garlic Sherbet"),
  tier1("blueberry-blitz", "Blueberry Blitz"),
  tier1("dank-wafers", "Dank Wafers"),
  tier1("persimmons", "Persimmons"),
  tier1("tart-pops", "Tart Pops", true),
  tier1("dip-stix", "Dip Stix", true),
  tier1("chem-5", "Chem 5", true),
  tier1("animal-runtz", "Animal Runtz", true),
  tier1("lemon-silver-haze", "Lemon Silver Haze", true),
  tier1("guava-bomba", "Guava Bomba", true),
  tier1("purple-ghost-candy", "Purple Ghost Candy", true),
  tier1("planet-of-the-grapes", "Planet of the Grapes", true),

  // ── TIER II · INDOOR · R35–R28/kg
  tier2("atomic-jelly", "Atomic Jelly"),
  tier2("nightwalker", "Nightwalker"),
  tier2("gelato-41", "Gelato 41"),
  tier2("apples-bananas", "Apples & Bananas"),
  tier2("wedding", "Wedding"),
  tier2("nanaglue", "NanaGlue"),
  tier2("chocolope", "ChocoLope"),
  tier2("king-bling", "King Bling"),
  tier2("sapphire-blue", "Sapphire Blue"),
  tier2("runts", "Runts"),
  tier2("candy-pane", "Candy Pane"),
  tier2("huckleberry-frost", "Huckleberry Frost"),
  tier2("colorado-nightshifter", "Colorado Nightshifter"),
  tier2("tropicana-banana", "Tropicana Banana"),
  tier2("peanut-butter-jelly-cake", "Peanut Butter Jelly Cake"),
  tier2("jamaican-wedding", "Jamaican Wedding"),
  tier2("strawberry-lemonade", "Strawberry Lemonade"),
  tier2("juicy-j", "Juicy J"),
  tier2("violet-cake", "Violet Cake"),
  tier2("wedding-cake", "Wedding Cake"),

  // ── TIER III · GREENDOOR · R27–R25/kg
  tier3("x7m", "X7M"),
  tier3("strwadawg", "Strwadawg"),
  tier3("zwich-pave", "Zwich Pavé"),
  tier3("garlic-fusion", "Garlic Fusion"),
  tier3("nag", "Nag"),
  tier3("facade", "Facade"),
  tier3("gg42", "GG42"),
  tier3("sour-diesel-chemdawg", "Sour Diesel Chemdawg"),
  tier3("rs11", "RS11", { back: true }),
  tier3("papaya", "Papaya", { back: true }),
  tier3("purple-panda", "Purple Panda", { organic: true }),
  tier3("slurry-boss", "Slurry Boss", { organic: true }),
  tier3("ice-cream", "Ice Cream", { organic: true }),

  // ── TIER IV · EXOTIC GREENHOUSE · R24–R18/kg
  tier4("black-cherry-tart", "Black Cherry Tart"),
  tier4("blunicorn", "Blunicorn"),
  tier4("vibranium", "Vibranium"),
  tier4("breakpad-breath", "Breakpad Breath"),
  tier4("dirty-banana", "Dirty Banana"),
  tier4("cheese", "Cheese"),
  tier4("zkittlez-pop", "Zkittlez Pop"),
  tier4("kimbo-kush", "Kimbo Kush", true),
  tier4("endgame", "Endgame", true),

  // ── TIER V · GREENHOUSE · R15–R13/kg
  tier5("cherry-paloma", "Cherry Paloma"),
  tier5("kush-mintz", "Kush Mintz"),
  tier5("dosidos", "Dosidos"),
  tier5("mk-ultra", "MK Ultra"),
  tier5("zeppelin", "Zeppelin"),
  tier5("facility-surplus", "Facility Surplus"),

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

  // ── VAPES · R350 FLAT · MOQ 20
  {
    id: "lef-vp-liquid-gold",
    name: "Liquid Gold Cartridge",
    category: "Vapes · R350 Flat",
    description: "Cleanly sourced cartridge line, one flat price point. MOQ 20 units.",
    unit: "per unit",
    price: 350,
  },
  {
    id: "lef-vp-pure-leaf",
    name: "Pure Leaf Cartridge",
    category: "Vapes · R350 Flat",
    description: "Cleanly sourced cartridge line, one flat price point. MOQ 20 units.",
    unit: "per unit",
    price: 350,
  },
  {
    id: "lef-vp-dirty-vapes",
    name: "Dirty Vapes Cartridge",
    category: "Vapes · R350 Flat",
    description: "Cleanly sourced cartridge line, one flat price point. MOQ 20 units.",
    unit: "per unit",
    price: 350,
  },
  {
    id: "lef-vp-funkt",
    name: "Funk't Cartridge",
    category: "Vapes · R350 Flat",
    description: "New supplier this month. Cleanly sourced, same flat price point. MOQ 20 units.",
    unit: "per unit",
    price: 350,
    isNew: true,
  },
  {
    id: "lef-vp-orphan-laboratory",
    name: "Orphan Laboratory Cartridge",
    category: "Vapes · R350 Flat",
    description: "New supplier this month. Cleanly sourced, same flat price point. MOQ 20 units.",
    unit: "per unit",
    price: 350,
    isNew: true,
  },

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
