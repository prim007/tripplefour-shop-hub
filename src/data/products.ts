import ediblesImg from "@/assets/products/edibles.jpg";
import edibleCubeImg from "@/assets/products/edible-cube.jpg";
import vapesImg from "@/assets/products/vapes.jpg";
import otherImg from "@/assets/products/other.jpg";
import dispJuice10mlImg from "@/assets/products/disposable-juice-10ml.jpeg";
import liquidZolToffeeImg from "@/assets/products/liquid-zol-toffee-popcorn.png";
import liquidZolCherryImg from "@/assets/products/liquid-zol-cherry-heat.png";
import liquidZolPeachImg from "@/assets/products/liquid-zol-peach.png";
import liquidZolBlueberryImg from "@/assets/products/liquid-zol-blueberry.png";
import liquidZolGreenAppleImg from "@/assets/products/liquid-zol-green-apple.png";
import liquidZolOilImg from "@/assets/products/liquid-zol-concentrated-oil.jpeg";
import honeypuff100BillImg from "@/assets/products/honeypuff-100-bill-rolling-papers.png";


export type ProductCategory =
  | "Edibles"
  | "Vapes"
  | "Dab"
  | "Accessories"
  | "CBD Products";

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
  "Edibles",
  "Vapes",
  "Dab",
  "Accessories",
  "CBD Products",
];

const categoryImages: Record<ProductCategory, string> = {
  "Edibles": ediblesImg,
  "Vapes": vapesImg,
  "Dab": otherImg,
  "Accessories": otherImg,
  "CBD Products": otherImg,
};

export const products: Product[] = [
  // Edibles
  { id: "ed-cube40", name: "Edible Cube 40mg", category: "Edibles", price: 60, description: "Hemp-infused edible cube, 40mg per piece.", image: edibleCubeImg },
  { id: "ed-soda", name: "Sodaze Infused Soda", category: "Edibles", price: 60, description: "Flavored infused soda by Sodaze.", image: categoryImages["Edibles"] },
  { id: "ed-icecream", name: "Infused Ice Cream", category: "Edibles", price: 0, description: "Delicious infused ice cream. Coming soon!", image: categoryImages["Edibles"], comingSoon: true },

  // Vapes
  { id: "vp-disp", name: "Disposable Juice 10ml", category: "Vapes", price: 390, description: "10ml disposable vape juice.", image: dispJuice10mlImg },
  { id: "vp-lz-toffee", name: "Liquid Zol Toffee Popcorn", category: "Vapes", price: 390, description: "Disposable THC vape — Toffee Popcorn flavour. Caramel revolution with rich taste and big vapor.", image: liquidZolToffeeImg },
  { id: "vp-lz-cherry", name: "Liquid Zol Cherry Heat", category: "Vapes", price: 390, description: "Disposable THC vape — Cherry Heat Ignition. Premium edition with rich taste and big vapor.", image: liquidZolCherryImg },
  { id: "vp-lz-peach", name: "Liquid Zol Peach", category: "Vapes", price: 390, description: "Disposable THC vape — Peach Revolution. Premium edition with rich taste and big vapor.", image: liquidZolPeachImg },
  { id: "vp-lz-blueberry", name: "Liquid Zol Blueberry", category: "Vapes", price: 390, description: "Disposable THC vape — Neon Blueberry Smash. Premium edition with rich taste and big vapor.", image: liquidZolBlueberryImg },
  { id: "vp-lz-greenapple", name: "Liquid Zol Green Apple", category: "Vapes", price: 390, description: "Disposable THC vape — Green Apple Fury. Flavour explosion with rich taste and big vapor.", image: liquidZolGreenAppleImg },
  { id: "vp-lz-oil", name: "Liquid Zol Concentrated Oil", category: "Vapes", price: 320, description: "Concentrated THC oil for vaping. Premium quality extract.", image: liquidZolOilImg },

  // Dab
  { id: "dab-1", name: "Dab Concentrate", category: "Dab", price: 350, description: "Premium hemp dab concentrate.", image: categoryImages["Dab"] },

  // Accessories
  { id: "acc-hp-100bill", name: "HoneyPuff $100 Bill Rolling Papers (Box of 24)", category: "Accessories", price: 55, description: "HoneyPuff $100 Bill rolling papers — novelty holographic dollar-bill design. One box contains 24 individual booklets. Slow-burning, premium quality papers perfect for everyday rolling.", image: honeypuff100BillImg },
];

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getProductsByCategory(category: ProductCategory): Product[] {
  return products.filter((p) => p.category === category);
}
