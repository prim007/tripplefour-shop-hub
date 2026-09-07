import ediblesImg from "@/assets/products/edibles-dark.jpg";
import edibleCubeImg from "@/assets/products/edible-cube.jpg";
import vapesImg from "@/assets/products/vapes-dark.jpg";
import dabImg from "@/assets/products/dab-dark.jpg";
import accessoriesImg from "@/assets/products/accessories-dark.jpg";
import cbdImg from "@/assets/products/cbd-dark.jpg";
import dirtyVapesEdiblesImg from "@/assets/products/dirty-vapes-edibles-high-life.jpg";
import dirtyVapesCart1mlImg from "@/assets/products/dirty-vapes-cart-1ml.jpg";
import dirtyVapesSwitch2mlImg from "@/assets/products/dirty-vapes-switch-2ml.jpg";
import dirtyVapesDisposable1mlImg from "@/assets/products/dirty-vapes-disposable-1ml.jpg";
import airbuzzShishaAsset from "@/assets/products/airbuzz-dubai-fusion-shisha.png.asset.json";

import t444ConesAsset from "@/assets/products/tripple444-108mm-cones.png.asset.json";
import hornetTipsAsset from "@/assets/products/hornet-hemp-cotton-tips.png.asset.json";
import hpCherryPigAsset from "@/assets/products/honeypuff-honey-cherry-pig.png.asset.json";
import fruitorsAshtrayAsset from "@/assets/products/fruitors-skull-ashtray-set.png.asset.json";
import rickMortyAshtrayAsset from "@/assets/products/rick-morty-ashtray-set.png.asset.json";
import dotLighterAsset from "@/assets/products/dot-lighter-box-50.png.asset.json";
import psychSmallPkgAsset from "@/assets/products/psychedelic-small-packages.png.asset.json";
import hpRollingTrayAsset from "@/assets/products/honeypuff-rolling-tray.png.asset.json";
import thaliaIceColaAsset from "@/assets/products/thalia-8000-ice-cola.png.asset.json";
import owlFitKitAsset from "@/assets/products/owlfit-rolling-kit.jpg.asset.json";
import sihoGrinderAsset from "@/assets/products/siho-wood-grinder.jpg.asset.json";
import q6LighterAsset from "@/assets/products/q6-lighter-box-25.jpg.asset.json";


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
  "Dab": dabImg,
  "Accessories": accessoriesImg,
  "CBD Products": cbdImg,
};

export const products: Product[] = [
  // === Featured new arrivals (top of catalog) ===
  { id: "acc-t444-cones", name: "TRIPPLE444 108mm Rolling Papers (100 per barrel)", category: "Accessories", price: 150, description: "TRIPPLE444 pre-rolled 108mm cones — 100 unbleached natural cones per barrel. Slow, even burn with a smooth draw.", image: t444ConesAsset.url },
  { id: "acc-owlfit-kit", name: "OwlFit Rolling Kit (Hard Case)", category: "Accessories", price: 650, description: "OwlFit premium rolling kit in a lockable hard carry case — rolling tray, cone filler, storage tubes, pre-rolled cones, tamper and tools. Complete kit, everything in one place.", image: owlFitKitAsset.url },
  { id: "acc-siho-grinder", name: "SIHO Wood-Finish Crusher (4-Piece Grinder)", category: "Accessories", price: 105, description: "SIHO 4-piece grinder with a wood-finish body — sharp diamond teeth, magnetic lid, pollen screen and kief catcher.", image: sihoGrinderAsset.url },
  { id: "acc-q6-lighter-25", name: "Q6 MR.RAM Lighter Box (25pcs)", category: "Accessories", price: 250, description: "Q6 MR.RAM high quality disposable lighters — full box of 25 pieces with collectible printed designs.", image: q6LighterAsset.url },
  { id: "acc-hornet-tips", name: "HORNET Natural Hemp & Cotton Rolling Tips and Rolling Paper (50 leaves)", category: "Accessories", price: 165, description: "HORNET perforated natural hemp & cotton rolling tips — 50 leaves of finest quality filter paper. Perfect roach for a cleaner smoke.", image: hornetTipsAsset.url },
  { id: "acc-hp-cherry-pig", name: "HoneyPuff Hemp Wraps — Honey Cherry Pig", category: "Accessories", price: 175, description: "HoneyPuff organic hemp wraps in Honey Cherry Pig flavour. Tobacco-free, nicotine-free, GMO-free with 2 filter tips per pack.", image: hpCherryPigAsset.url },
  { id: "acc-fruitors-ashtray", name: "Fruitors Skull-Shaped Ashtray Set", category: "Accessories", price: 650, description: "Fruitors 6-piece skull-shaped glass ashtray set in a vibrant collectible box. Heavy-duty glass with bold fruit character graphics.", image: fruitorsAshtrayAsset.url },
  { id: "acc-rickmorty-ashtray", name: "Rick and Morty Round Ashtray Set", category: "Accessories", price: 650, description: "Rick and Morty themed round glass ashtray set — 6 psychedelic printed ashtrays in a collector's box. Solid glass, premium finish.", image: rickMortyAshtrayAsset.url },
  { id: "acc-dot-lighter-50", name: "DOT Lighter Box (50pcs)", category: "Accessories", price: 100, description: "DOT-1102 classic disposable lighters — full box of 50 pieces. Reliable flame, everyday essential.", image: dotLighterAsset.url },
  { id: "acc-psych-small-pkg", name: "Psychedelic Graphic Small Packages", category: "Accessories", price: 95, description: "Compact psychedelic graphic-printed storage packages. Vibrant collectible artwork, perfect pocket-size stash.", image: psychSmallPkgAsset.url },
  { id: "acc-hp-rolling-tray", name: "HoneyPuff Rolling Tray", category: "Accessories", price: 100, description: "HoneyPuff branded metal rolling tray — smooth surface, raised edges. Compact size perfect for on-the-go rolling.", image: hpRollingTrayAsset.url },
  { id: "vp-thalia-ice-cola", name: "Thalia 8000 Puffs 2% Vape — Ice Cola", category: "Vapes", price: 100, description: "Thalia disposable vape — 8000 puffs, 2% nicotine strength, Ice Cola flavour. Refreshing icy cola hit with long-lasting battery.", image: thaliaIceColaAsset.url },

  // Edibles
  { id: "ed-cube40", name: "Edible Cube 40mg", category: "Edibles", price: 60, description: "Hemp-infused edible cube, 40mg per piece.", image: edibleCubeImg },
  
  { id: "ed-icecream", name: "Infused Ice Cream", category: "Edibles", price: 0, description: "Delicious infused ice cream. Coming soon!", image: categoryImages["Edibles"], comingSoon: true },

  // Vapes

  // Dab
  { id: "dab-1", name: "Dab Concentrate", category: "Dab", price: 350, description: "Premium hemp dab concentrate.", image: categoryImages["Dab"] },

  // Accessories
  { id: "acc-airbuzz-shisha", name: "AirBuzz Dubai Fusion Premium Shisha", category: "Accessories", price: 100, description: "AirBuzz CBD-infused premium flavoured herbal shisha — Dubai Fusion. Smooth herbal blend with natural flavours, less than 0.25% THC. Manufactured by AirBuzz.", image: airbuzzShishaAsset.url },

  // Dirty Vapes (partner)
  { id: "dv-edibles-100mg", name: "Dirty Vapes Edibles Tub 100mg", category: "Edibles", price: 150, description: "Dirty Vapes 'High Life' infused edibles tub — 100mg per tub. Soft, sugar-coated gummy cubes with smooth onset. Partner product by Dirty Vapes.", image: dirtyVapesEdiblesImg },
  { id: "dv-cart-1ml", name: "Dirty Vapes 1ML Cart", category: "Vapes", price: 350, description: "Dirty Vapes 1ML THC cartridge — premium oil, smooth pulls. 510-thread compatible. Partner product by Dirty Vapes.", image: dirtyVapesCart1mlImg },
  { id: "dv-switch-2ml", name: "Dirty Vapes 2ML SWITCH", category: "Vapes", price: 900, description: "Dirty Vapes 2ML SWITCH device — dual-mode Sativa/Indica switch with 2ML of premium THC oil. Reusable pod device. Partner product by Dirty Vapes.", image: dirtyVapesSwitch2mlImg },
  { id: "dv-disposable-1ml", name: "Dirty Vapes 1ML Disposable", category: "Vapes", price: 450, description: "Dirty Vapes 1ML disposable — pre-charged, pre-filled, ready to rip. Bold flavours, premium oil. Partner product by Dirty Vapes.", image: dirtyVapesDisposable1mlImg },
];

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getProductsByCategory(category: ProductCategory): Product[] {
  return products.filter((p) => p.category === category);
}
