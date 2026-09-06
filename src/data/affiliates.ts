export interface AffiliateLink {
  id: string;
  name: string;
  description: string;
  category: AffiliateCategory;
  url: string;
  logo?: string;
  cta: string;
  featured?: boolean;
}

export type AffiliateCategory =
  | "Vaporizers & Devices"
  | "Growing Equipment"
  | "SaaS & POS Tools"
  | "Packaging & Supplies"
  | "Lifestyle & Accessories";

export const affiliateCategories: AffiliateCategory[] = [
  "Vaporizers & Devices",
  "Growing Equipment",
  "Lifestyle & Accessories",
  "Packaging & Supplies",
  "SaaS & POS Tools",
];

export const affiliates: AffiliateLink[] = [
  {
    id: "aff-dirtyvapes",
    name: "Dirty Vapes",
    description:
      "Bold, hard-hitting THC carts, disposables and infused edibles. Brain Cake, End Game, High Life — Dirty Vapes brings the heat.",
    category: "Vaporizers & Devices",
    url: "/partners/dirty-vapes",
    cta: "Shop Dirty Vapes",
    featured: true,
  },
  {
    id: "aff-leflabs",
    name: "Lëf Labs",
    description:
      "COA-certified B2B wholesale supply — premium indoor & tunnel flower, pre-rolls, distillates, and Liquid Gold + Pure Leaf vape lines.",
    category: "Vaporizers & Devices",
    url: "/partners/lef-labs",
    cta: "View Lëf Labs Catalogue",
    featured: true,
  },
  {
    id: "aff-daggaspot",
    name: "DaggaSpot",
    description:
      "Find cannabis spots, dispensaries and lounges near you — a South African directory mapping the local dagga scene so you always know where the nearest plug is.",
    category: "Lifestyle & Accessories",
    url: "https://daggaspot.co.za",
    cta: "Visit DaggaSpot",
  },
];

export interface SponsorTier {
  name: string;
  priceZAR: number;
  priceUSD: number;
  priceEUR: number;
  priceGBP: number;
  period: string;
  features: string[];
  popular?: boolean;
}

export const sponsorTiers: SponsorTier[] = [
  {
    name: "Starter",
    priceZAR: 499,
    priceUSD: 27,
    priceEUR: 25,
    priceGBP: 22,
    period: "/month",
    features: [
      "Logo on Partners page",
      "Basic listing with description",
      "Link to your website",
    ],
  },
  {
    name: "Growth",
    priceZAR: 999,
    priceUSD: 55,
    priceEUR: 50,
    priceGBP: 43,
    period: "/month",
    features: [
      "Everything in Starter",
      "Featured badge & priority placement",
      "Banner ad on Shop page",
      "Monthly analytics report",
    ],
    popular: true,
  },
  {
    name: "Premium",
    priceZAR: 1999,
    priceUSD: 110,
    priceEUR: 100,
    priceGBP: 86,
    period: "/month",
    features: [
      "Everything in Growth",
      "Sponsored blog article",
      "Homepage banner rotation",
      "Social media shout-out",
      "Dedicated account manager",
    ],
  },
];
