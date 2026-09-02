// Strain photography for the Lëf Labs catalogue.
// Keys are LefLabsProduct ids. Strains without a photo fall back to a placeholder.
import jackHerer from "@/assets/strains/jack-herer.jpg.asset.json";
import blueDream from "@/assets/strains/blue-dream.jpg.asset.json";
import gorillaZkittlez from "@/assets/strains/gorilla-zkittlez.jpg.asset.json";
import lemonSilverHaze from "@/assets/strains/lemon-silver-haze.jpg.asset.json";
import planetOfTheGrapes from "@/assets/strains/planet-of-the-grapes.jpg.asset.json";

export const STRAIN_IMAGES: Record<string, string> = {
  "lef-4a-jack-herer": jackHerer.url,
  "lef-4a-blue-dream": blueDream.url,
  "lef-4a-gorilla-zkittlez": gorillaZkittlez.url,
  "lef-4a-lemon-silver-haze": lemonSilverHaze.url,
  "lef-4a-planet-of-the-grapes": planetOfTheGrapes.url,
};

export function strainImage(id: string): string | undefined {
  return STRAIN_IMAGES[id];
}
