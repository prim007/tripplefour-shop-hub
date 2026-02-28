export type ProductCategory =
  | "Greenhouse Dust"
  | "Greenhouse Strains"
  | "Indoor Dust"
  | "Pre-rolls"
  | "Edibles"
  | "Vapes"
  | "Other";

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  price: number;
  description: string;
  image: string;
  comingSoon?: boolean;
}

export const categories: ProductCategory[] = [
  "Greenhouse Dust",
  "Greenhouse Strains",
  "Indoor Dust",
  "Pre-rolls",
  "Edibles",
  "Vapes",
  "Other",
];

export const products: Product[] = [
  // Greenhouse Dust
  { id: "ghd-50", name: "Greenhouse Dust 50G", category: "Greenhouse Dust", price: 945, description: "Premium greenhouse dust, 50 gram pack. Quality blend for the connoisseur.", image: "/placeholder.svg" },
  { id: "ghd-20", name: "Greenhouse Dust 20G", category: "Greenhouse Dust", price: 595, description: "Premium greenhouse dust, 20 gram pack.", image: "/placeholder.svg" },
  { id: "ghd-10", name: "Greenhouse Dust 10G", category: "Greenhouse Dust", price: 445, description: "Premium greenhouse dust, 10 gram pack.", image: "/placeholder.svg" },
  { id: "ghd-5", name: "Greenhouse Dust 5G", category: "Greenhouse Dust", price: 325, description: "Premium greenhouse dust, 5 gram pack.", image: "/placeholder.svg" },
  { id: "ghd-2", name: "Greenhouse Dust 2G", category: "Greenhouse Dust", price: 255, description: "Premium greenhouse dust, 2 gram pack. Perfect starter size.", image: "/placeholder.svg" },

  // Greenhouse Strains
  { id: "ghs-50", name: "Greenhouse Strains 50G", category: "Greenhouse Strains", price: 1085, description: "Top-shelf greenhouse strains, 50 gram pack.", image: "/placeholder.svg" },
  { id: "ghs-20", name: "Greenhouse Strains 20G", category: "Greenhouse Strains", price: 735, description: "Top-shelf greenhouse strains, 20 gram pack.", image: "/placeholder.svg" },
  { id: "ghs-2", name: "Greenhouse Strains 2G", category: "Greenhouse Strains", price: 260, description: "Top-shelf greenhouse strains, 2 gram pack.", image: "/placeholder.svg" },

  // Indoor Dust
  { id: "ind-10", name: "Indoor Dust 10G", category: "Indoor Dust", price: 500, description: "Premium indoor-grown dust, 10 gram pack.", image: "/placeholder.svg" },
  { id: "ind-2", name: "Indoor Dust 2G", category: "Indoor Dust", price: 315, description: "Premium indoor-grown dust, 2 gram pack.", image: "/placeholder.svg" },
  { id: "ind-1", name: "Indoor Dust 1G", category: "Indoor Dust", price: 255, description: "Premium indoor-grown dust, 1 gram pack.", image: "/placeholder.svg" },

  // Pre-rolls
  { id: "pr-10gh", name: "10 Prerolls Greenhouse", category: "Pre-rolls", price: 535, description: "Pack of 10 greenhouse pre-rolls. Ready to enjoy.", image: "/placeholder.svg" },
  { id: "pr-5gh", name: "5 Prerolls Greenhouse", category: "Pre-rolls", price: 385, description: "Pack of 5 greenhouse pre-rolls.", image: "/placeholder.svg" },
  { id: "pr-1in", name: "Indoor Preroll", category: "Pre-rolls", price: 95, description: "Single indoor pre-roll. Premium quality.", image: "/placeholder.svg" },
  { id: "pr-1gh", name: "1 Preroll Greenhouse", category: "Pre-rolls", price: 75, description: "Single greenhouse pre-roll.", image: "/placeholder.svg" },
  { id: "pr-out", name: "Outdoor Pre-roll", category: "Pre-rolls", price: 55, description: "Single outdoor pre-roll. Great value.", image: "/placeholder.svg" },

  // Edibles
  { id: "ed-lolly5", name: "Lolly Pop 5x", category: "Edibles", price: 500, description: "Pack of 5 cannabis-infused lollipops.", image: "/placeholder.svg" },
  { id: "ed-oreo3", name: "Oreo Caramel Treat 3x", category: "Edibles", price: 215, description: "Pack of 3 Oreo caramel treats, cannabis-infused.", image: "/placeholder.svg" },
  { id: "ed-lolly1", name: "Lolly Pop 1x", category: "Edibles", price: 185, description: "Single cannabis-infused lollipop.", image: "/placeholder.svg" },
  { id: "ed-soda", name: "Sodaze Cannabis Soda", category: "Edibles", price: 60, description: "Flavored cannabis-infused soda by Sodaze.", image: "/placeholder.svg" },

  // Vapes
  { id: "vp-pen", name: "Vape Pen 1ml 91% THC", category: "Vapes", price: 550, description: "1ml vape pen cartridge with 91% THC concentration.", image: "/placeholder.svg" },
  { id: "vp-disp", name: "Disposable Juice 10ml", category: "Vapes", price: 320, description: "10ml disposable vape juice.", image: "/placeholder.svg" },

  // Other
  { id: "ot-moon", name: "Moon Sticks", category: "Other", price: 125, description: "Premium moon sticks for an elevated experience.", image: "/placeholder.svg" },
  { id: "ot-gold", name: "Premium Gold Box", category: "Other", price: 0, description: "Our premium gold box collection. Coming soon!", image: "/placeholder.svg", comingSoon: true },
];

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getProductsByCategory(category: ProductCategory): Product[] {
  return products.filter((p) => p.category === category);
}
