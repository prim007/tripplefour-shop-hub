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

// Placeholder affiliate entries — replace URLs with real affiliate links
export const affiliates: AffiliateLink[] = [
  {
    id: "aff-storz",
    name: "Storz & Bickel",
    description:
      "German-engineered desktop and portable vaporizers — the gold standard for dry herb vaping.",
    category: "Vaporizers & Devices",
    url: "#",
    cta: "Shop Vaporizers",
    featured: true,
  },
  {
    id: "aff-pax",
    name: "PAX Vaporizers",
    description:
      "Sleek, pocket-sized vaporizers with app-controlled temperature and session settings.",
    category: "Vaporizers & Devices",
    url: "#",
    cta: "View PAX Range",
  },
  {
    id: "aff-marshydro",
    name: "Mars Hydro",
    description:
      "Industry-leading LED grow lights and grow tent kits for home cultivators.",
    category: "Growing Equipment",
    url: "#",
    cta: "Browse Grow Lights",
    featured: true,
  },
  {
    id: "aff-acinfinity",
    name: "AC Infinity",
    description:
      "Smart ventilation fans, carbon filters, and climate controllers for indoor grows.",
    category: "Growing Equipment",
    url: "#",
    cta: "Shop Climate Gear",
  },
  {
    id: "aff-dutchie",
    name: "Dutchie POS",
    description:
      "All-in-one point-of-sale, e-commerce, and payments platform built for dispensaries.",
    category: "SaaS & POS Tools",
    url: "#",
    cta: "Request Demo",
    featured: true,
  },
  {
    id: "aff-canix",
    name: "Canix",
    description:
      "Seed-to-sale tracking and compliance software for cannabis operators.",
    category: "SaaS & POS Tools",
    url: "#",
    cta: "Learn More",
  },
  {
    id: "aff-sana",
    name: "Sana Packaging",
    description:
      "Sustainable, ocean-plastic and hemp-based packaging for cannabis brands.",
    category: "Packaging & Supplies",
    url: "#",
    cta: "Explore Packaging",
  },
  {
    id: "aff-session",
    name: "Session Goods",
    description:
      "Beautifully designed smoking accessories — pipes, trays, and storage.",
    category: "Lifestyle & Accessories",
    url: "#",
    cta: "Shop Accessories",
    featured: true,
  },
];
