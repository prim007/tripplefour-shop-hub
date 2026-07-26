import { Link } from "react-router-dom";
import { ArrowRight, Truck, Shield, Clock } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { products, categories } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import heroImg from "@/assets/banners/hero-dark-1.jpg";
import heroImg3 from "@/assets/banners/hero-dark-3.jpg";
import edibleCatImg from "@/assets/products/edibles-dark.jpg";
import vapesCatImg from "@/assets/products/vapes-dark.jpg";
import dabCatImg from "@/assets/products/dab-dark.jpg";
import accessoriesCatImg from "@/assets/products/accessories-dark.jpg";
import cbdCatImg from "@/assets/products/cbd-dark.jpg";

const categoryHero: Record<string, string> = {
  "Edibles": edibleCatImg,
  "Vapes": vapesCatImg,
  "Dab": dabCatImg,
  "Accessories": accessoriesCatImg,
  "CBD Products": cbdCatImg,
};

const vapeIds = ["vp-thalia-ice-cola", "dv-cart-1ml", "dv-disposable-1ml", "dv-switch-2ml"];
const bestSellers = [
  ...products.filter((p) => vapeIds.includes(p.id)),
  ...products.filter((p) => !p.comingSoon && !vapeIds.includes(p.id)).slice(0, 1),
].slice(0, 8);
const budgetPicks = products.filter((p) => !p.comingSoon && p.price <= 100).slice(0, 4);

const FAQ_ITEMS = [
  {
    q: "Where do you deliver in South Africa?",
    a: "We deliver nationwide across South Africa — Johannesburg, Cape Town, Durban, Pretoria, Port Elizabeth, Bloemfontein, Soweto, and everywhere in between. Delivery fees range from R50 to R100 depending on your location.",
  },
  {
    q: "How long does delivery take?",
    a: "Orders are processed within 24 hours of confirmed payment. Delivery typically takes 1–3 business days depending on your city. Johannesburg and Pretoria orders often arrive next day.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept EFT (bank transfer) and cash on delivery in select areas. Payment must be confirmed before your order is dispatched — no payment, no order.",
  },
  {
    q: "What CBD products do you sell?",
    a: "We stock a full range of CBD infused products: edibles (gummies & brownies), vape cartridges & disposables, dab concentrates, and accessories. All products are tested for quality and delivered across South Africa.",
  },
  {
    q: "Is it legal to order CBD products in South Africa?",
    a: "South Africa's Constitutional Court ruled in 2018 that private use, possession, and cultivation of CBD products by adults is legal. We operate within the bounds of personal-use provisions.",
  },
  {
    q: "How do I track my order?",
    a: "After payment confirmation, you'll receive an order reference via WhatsApp or email. You can contact us anytime on WhatsApp at +27 64 543 6734 for updates on your delivery.",
  },
];

const Index = () => {
  return (
    <div className="flex min-h-screen flex-col overflow-hidden">
      <Helmet>
        <title>CBD Products Online SA — From R50 | Tripplefour</title>
        <meta name="description" content="Buy CBD infused edibles, vapes & dab online in South Africa from R50. Fast delivery to Joburg, Cape Town, Durban & nationwide." />
        <link rel="canonical" href="https://tripplefourshophub.online/" />
        <meta property="og:title" content="CBD Products Online SA — From R50 | Tripplefour" />
        <meta property="og:description" content="Buy CBD infused edibles, vapes & dab online in South Africa from R50. Fast delivery nationwide." />
        <meta property="og:url" content="https://tripplefourshophub.online/" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Store",
          "name": "Tripplefour",
          "description": "Buy CBD infused products online in South Africa — edibles, vapes, dab concentrates & accessories from R50",
          "url": "https://tripplefourshophub.online",
          "telephone": "+27645436734",
          "areaServed": { "@type": "Country", "name": "South Africa" },
          "address": { "@type": "PostalAddress", "addressCountry": "ZA" },
          "priceRange": "R50 - R1085",
          "paymentAccepted": "Cash, EFT",
          "currenciesAccepted": "ZAR"
        })}</script>
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": FAQ_ITEMS.map((it) => ({
            "@type": "Question",
            "name": it.q,
            "acceptedAnswer": { "@type": "Answer", "text": it.a }
          }))
        })}</script>
      </Helmet>
      <Navbar />
      <main className="flex-1">
        {/* Marquee strip */}
        <div className="border-b border-border/60 bg-background overflow-hidden">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 py-2.5 flex items-center justify-center gap-3 text-[11px] uppercase tracking-[0.18em] text-muted-foreground font-medium">
            <span>Free Delivery Over R1200</span>
            <span className="text-border">·</span>
            <span>Use <span className="text-primary font-semibold">WELCOME10</span> for 10% Off</span>
            <span className="hidden sm:inline text-border">·</span>
            <span className="hidden sm:inline">Same-Day Dispatch Before 2PM</span>
          </div>
        </div>

        {/* HERO — large, dark, dropstore-style */}
        <section className="relative w-full overflow-hidden">
          <div className="relative h-[80vh] min-h-[560px] max-h-[820px] w-full">
            <img
              src={heroImg}
              alt="Tripplefour premium CBD infused products on dark slate"
              className="absolute inset-0 h-full w-full object-cover"
              width={1920}
              height={1080}
              fetchPriority="high"
              decoding="async"
            />
            {/* gradient masks for legibility */}
            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />

            <div className="relative mx-auto flex h-full max-w-7xl flex-col justify-end px-4 sm:px-6 pb-16 md:pb-24">
              <p className="text-[11px] uppercase tracking-[0.32em] text-primary font-semibold mb-4">
                / Tripplefour — South Africa
              </p>
              <h1 className="font-display text-balance text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-[0.95] uppercase max-w-4xl">
                Premium <span className="warm-gradient-text">CBD Infused</span> products.
              </h1>
              <p className="mt-6 max-w-xl text-base md:text-lg text-muted-foreground">
                Edibles, vapes, dab and accessories — built for the discerning. Discreet delivery across South Africa from R50.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Button asChild size="lg" className="h-12 px-8 rounded-none uppercase tracking-widest text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary-glow">
                  <Link to="/shop">Shop the drop <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
                <Button asChild size="lg" variant="ghost" className="h-12 px-6 rounded-none uppercase tracking-widest text-xs font-semibold border border-border hover:border-primary hover:text-primary">
                  <a href="https://wa.me/27645436734" target="_blank" rel="noopener noreferrer">WhatsApp order</a>
                </Button>
              </div>
              <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-2 text-[11px] uppercase tracking-widest text-muted-foreground">
                <span className="flex items-center gap-2"><Truck className="h-3.5 w-3.5 text-primary" /> Nationwide</span>
                <span className="flex items-center gap-2"><Shield className="h-3.5 w-3.5 text-primary" /> Quality Tested</span>
                <span className="flex items-center gap-2"><Clock className="h-3.5 w-3.5 text-primary" /> 24h Dispatch</span>
              </div>
            </div>
          </div>
        </section>

        {/* BEST SELLERS */}
        <section className="px-4 sm:px-6 py-20 border-t border-border/60">
          <div className="mx-auto max-w-7xl">
            <div className="flex items-end justify-between mb-10 gap-4">
              <div>
                <p className="text-[11px] uppercase tracking-[0.32em] text-primary font-semibold mb-2">/ 01 — The drop</p>
                <h2 className="font-display text-3xl md:text-5xl font-bold uppercase">Best sellers</h2>
              </div>
              <Link to="/shop" className="hidden sm:inline-flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">
                View all <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
              {bestSellers.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>

        {/* CATEGORIES — large dropstore-style image tiles */}
        <section className="px-4 sm:px-6 py-20 border-t border-border/60">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10">
              <p className="text-[11px] uppercase tracking-[0.32em] text-primary font-semibold mb-2">/ 02 — Browse</p>
              <h2 className="font-display text-3xl md:text-5xl font-bold uppercase">Categories</h2>
            </div>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
              {categories.map((cat) => (
                <Link
                  key={cat}
                  to={`/shop?category=${encodeURIComponent(cat)}`}
                  className="group relative aspect-[3/4] overflow-hidden hairline-border bg-secondary/40"
                >
                  <img
                    src={categoryHero[cat]}
                    alt={`${cat} — Tripplefour`}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-4">
                    <p className="font-display text-base md:text-lg font-bold uppercase tracking-tight">{cat}</p>
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground mt-1 group-hover:text-primary transition-colors">Shop →</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* SECONDARY HERO */}
        <section className="relative h-[60vh] min-h-[400px] overflow-hidden border-t border-border/60">
          <img src={heroImg3} alt="TRIPPLEFOUR matte black box with dropper" className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent" />
          <div className="relative mx-auto flex h-full max-w-7xl flex-col justify-center px-4 sm:px-6">
            <p className="text-[11px] uppercase tracking-[0.32em] text-primary font-semibold mb-3">/ Manifesto</p>
            <h2 className="font-display text-3xl md:text-5xl font-bold uppercase max-w-2xl text-balance">
              Crafted in South Africa. Delivered discreetly.
            </h2>
            <p className="mt-4 max-w-xl text-muted-foreground">
              Every Tripplefour product is hand-checked, batch-tested and packed in matte black. Pay by EFT, get it tomorrow.
            </p>
          </div>
        </section>

        {/* UNDER R100 */}
        {budgetPicks.length > 0 && (
          <section className="px-4 sm:px-6 py-20 border-t border-border/60">
            <div className="mx-auto max-w-7xl">
              <div className="flex items-end justify-between mb-10 gap-4">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.32em] text-primary font-semibold mb-2">/ 03 — Entry</p>
                  <h2 className="font-display text-3xl md:text-5xl font-bold uppercase">Under R100</h2>
                </div>
                <Link to="/shop" className="hidden sm:inline-flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">
                  Shop all <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4">
                {budgetPicks.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* FAQ */}
        <section className="px-4 sm:px-6 py-20 border-t border-border/60">
          <div className="mx-auto max-w-3xl">
            <p className="text-[11px] uppercase tracking-[0.32em] text-primary font-semibold mb-2 text-center">/ Help</p>
            <h2 className="font-display text-3xl md:text-5xl font-bold uppercase text-center mb-10">
              Frequently asked
            </h2>
            <Accordion type="single" collapsible className="w-full">
              {FAQ_ITEMS.map((faq, i) => (
                <AccordionItem key={i} value={`faq-${i}`} className="border-border/60">
                  <AccordionTrigger className="text-left font-display font-semibold uppercase tracking-wide text-sm md:text-base">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* CTA */}
        <section className="px-4 sm:px-6 py-24 border-t border-border/60 text-center">
          <p className="text-[11px] uppercase tracking-[0.32em] text-primary font-semibold mb-4">/ Order today</p>
          <h2 className="font-display text-3xl md:text-6xl font-bold uppercase max-w-3xl mx-auto text-balance">
            From R50. Delivered to your door.
          </h2>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" className="h-12 px-8 rounded-none uppercase tracking-widest text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary-glow">
              <Link to="/shop">Shop now <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
            <Button asChild size="lg" variant="ghost" className="h-12 px-6 rounded-none uppercase tracking-widest text-xs font-semibold border border-border hover:border-primary hover:text-primary">
              <a href="https://wa.me/27645436734" target="_blank" rel="noopener noreferrer">WhatsApp us</a>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
