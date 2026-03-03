import greenhouseDustImg from "@/assets/products/greenhouse-dust.jpg";
import greenhouseStrainsImg from "@/assets/products/greenhouse-strains.jpg";
import indoorDustImg from "@/assets/products/indoor-dust.jpg";
import prerollsImg from "@/assets/products/prerolls.jpg";
import ediblesImg from "@/assets/products/edibles.jpg";
import edibleCubeImg from "@/assets/products/edible-cube.jpg";
import vapesImg from "@/assets/products/vapes.jpg";
import otherImg from "@/assets/products/other.jpg";

export type ProductCategory =
  | "Pre-rolls"
  | "Greenhouse Dust"
  | "Greenhouse Strains"
  | "Indoor Dust"
  | "Edibles"
  | "Vapes"
  | "Dab"
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
  "Pre-rolls",
  "Greenhouse Dust",
  "Greenhouse Strains",
  "Indoor Dust",
  "Edibles",
  "Vapes",
  "Dab",
  "Other",
];

const categoryImages: Record<ProductCategory, string> = {
  "Pre-rolls": prerollsImg,
  "Greenhouse Dust": greenhouseDustImg,
  "Greenhouse Strains": greenhouseStrainsImg,
  "Indoor Dust": indoorDustImg,
  "Edibles": ediblesImg,
  "Vapes": vapesImg,
  "Dab": otherImg,
  "Other": otherImg,
};

export const products: Product[] = [
  // Pre-rolls
  { id: "pr-4gh", name: "4 Prerolls Greenhouse", category: "Pre-rolls", price: 165, description: "Pack of 4 greenhouse pre-rolls.", image: categoryImages["Pre-rolls"] },
  { id: "pr-1in", name: "Indoor Preroll", category: "Pre-rolls", price: 90, description: "Single indoor pre-roll. Premium quality.", image: categoryImages["Pre-rolls"] },
  { id: "pr-1gh", name: "1 Preroll Greenhouse", category: "Pre-rolls", price: 75, description: "Single greenhouse pre-roll.", image: categoryImages["Pre-rolls"] },
  { id: "pr-out", name: "Outdoor Pre-roll", category: "Pre-rolls", price: 50, description: "Single outdoor pre-roll. Great value.", image: categoryImages["Pre-rolls"] },

  // Small Banky Bags
  { id: "sb-out5", name: "Small Banky Bag Outdoor 5G", category: "Other", price: 80, description: "Small banky bag with 5 grams of outdoor.", image: categoryImages["Other"] },
  { id: "sb-swazi", name: "Small Banky Bag Swazi", category: "Other", price: 60, description: "Small banky bag of Swazi.", image: categoryImages["Other"] },

  // Greenhouse Dust
  { id: "ghd-50", name: "Greenhouse Dust 50G", category: "Greenhouse Dust", price: 945, description: "Premium greenhouse dust, 50 gram pack. Quality blend for the connoisseur.", image: categoryImages["Greenhouse Dust"] },
  { id: "ghd-20", name: "Greenhouse Dust 20G", category: "Greenhouse Dust", price: 595, description: "Premium greenhouse dust, 20 gram pack.", image: categoryImages["Greenhouse Dust"] },
  { id: "ghd-10", name: "Greenhouse Dust 10G", category: "Greenhouse Dust", price: 445, description: "Premium greenhouse dust, 10 gram pack.", image: categoryImages["Greenhouse Dust"] },
  { id: "ghd-5", name: "Greenhouse Dust 5G", category: "Greenhouse Dust", price: 325, description: "Premium greenhouse dust, 5 gram pack.", image: categoryImages["Greenhouse Dust"] },
  { id: "ghd-2", name: "Greenhouse Dust 2G", category: "Greenhouse Dust", price: 255, description: "Premium greenhouse dust, 2 gram pack. Perfect starter size.", image: categoryImages["Greenhouse Dust"] },

  // Greenhouse Strains
  { id: "ghs-50", name: "Greenhouse Strains 50G", category: "Greenhouse Strains", price: 1085, description: "Top-shelf greenhouse strains, 50 gram pack.", image: categoryImages["Greenhouse Strains"] },
  { id: "ghs-20", name: "Greenhouse Strains 20G", category: "Greenhouse Strains", price: 735, description: "Top-shelf greenhouse strains, 20 gram pack.", image: categoryImages["Greenhouse Strains"] },
  { id: "ghs-2", name: "Greenhouse Strains 2G", category: "Greenhouse Strains", price: 260, description: "Top-shelf greenhouse strains, 2 gram pack.", image: categoryImages["Greenhouse Strains"] },

  // Indoor Dust
  { id: "ind-10", name: "Indoor Dust 10G", category: "Indoor Dust", price: 500, description: "Premium indoor-grown dust, 10 gram pack.", image: categoryImages["Indoor Dust"] },
  { id: "ind-2", name: "Indoor Dust 2G", category: "Indoor Dust", price: 315, description: "Premium indoor-grown dust, 2 gram pack.", image: categoryImages["Indoor Dust"] },
  { id: "ind-1", name: "Indoor Dust 1G", category: "Indoor Dust", price: 255, description: "Premium indoor-grown dust, 1 gram pack.", image: categoryImages["Indoor Dust"] },

  // Edibles
  { id: "ed-oreo3", name: "Oreo Caramel Treat 3x", category: "Edibles", price: 215, description: "Pack of 3 Oreo caramel treats, cannabis-infused.", image: categoryImages["Edibles"] },
  { id: "ed-soda", name: "Sodaze Cannabis Soda", category: "Edibles", price: 60, description: "Flavored cannabis-infused soda by Sodaze.", image: categoryImages["Edibles"] },

  // Vapes
  { id: "vp-pen", name: "Vape Pen 1ml 91% THC", category: "Vapes", price: 550, description: "1ml vape pen cartridge with 91% THC concentration.", image: categoryImages["Vapes"] },
  { id: "vp-disp", name: "Disposable Juice 10ml", category: "Vapes", price: 320, description: "10ml disposable vape juice.", image: categoryImages["Vapes"] },

  // Dab
  { id: "dab-1", name: "Dab Concentrate 1G", category: "Dab", price: 350, description: "Premium cannabis dab concentrate, 1 gram.", image: categoryImages["Dab"] },

  // Other
  { id: "ot-moon", name: "Moon Sticks", category: "Other", price: 125, description: "Premium moon sticks for an elevated experience.", image: categoryImages["Other"] },
  { id: "ot-gold", name: "Premium Gold Box", category: "Other", price: 0, description: "Our premium gold box collection. Coming soon!", image: categoryImages["Other"], comingSoon: true },
];

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getProductsByCategory(category: ProductCategory): Product[] {
  return products.filter((p) => p.category === category);
}
