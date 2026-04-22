import { Link } from "react-router-dom";
import { ArrowRight, Leaf, Truck, Shield, Clock, Sparkles, Flame, Zap } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { products, categories } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Autoplay from "embla-carousel-autoplay";

import banner1 from "@/assets/banners/banner-1.jpg";
import banner2 from "@/assets/banners/banner-2.jpg";
import banner3 from "@/assets/banners/banner-3.jpg";
import banner4 from "@/assets/banners/banner-4.jpg";

const banners = [
  { src: banner1, alt: "Premium cannabis buds with golden trichomes" },
  { src: banner2, alt: "Cannabis pre-rolls, edibles and vape products" },
  { src: banner3, alt: "Greenhouse cannabis cultivation" },
  { src: banner4, alt: "Cannabis wellness tinctures and oils" },
];

const vapeIds = ["vp-disp", "vp-lz-toffee", "vp-lz-cherry", "vp-lz-peach", "vp-lz-blueberry", "vp-lz-greenapple", "vp-lz-oil"];
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
    q: "What cannabis products do you sell?",
    a: "We stock a full range of cannabis infused products: edibles (gummies & brownies), Liquid Zol vape cartridges, dab concentrates, and accessories. All products are tested for quality and delivered across South Africa.",
  },
  {
    q: "Is it legal to order cannabis in South Africa?",
    a: "South Africa's Constitutional Court ruled in 2018 that private use, possession, and cultivation of cannabis by adults is legal. We operate within the bounds of personal-use provisions.",
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
        <title>Cannabis Infused Products Online South Africa | Delivery Joburg & Nationwide | Tripplefour</title>
        <meta name="description" content="Buy cannabis infused products online in South Africa — edibles, vapes, dab concentrates & more from R50. Fast delivery to Johannesburg, Cape Town, Durban & nationwide. Order now, pay on delivery." />
        <link rel="canonical" href="https://tripplefourshophub.online/" />
      </Helmet>
      <Navbar />
      <main className="flex-1">
        {/* Urgency ticker */}
        <div className="bg-primary text-primary-foreground py-2 overflow-hidden">
          <div className="flex items-center justify-center gap-2 text-sm font-semibold animate-pulse text-center px-4">
            <Flame className="h-4 w-4 shrink-0" />
            <span>🔥 Use code <strong className="font-mono">WELCOME10</strong> for 10% off · Same-day dispatch before 2PM 🛒</span>
            <Flame className="h-4 w-4 shrink-0" />
          </div>
        </div>

        {/* Hero with Carousel */}
        <section className="relative w-full overflow-hidden h-[480px] sm:h-[520px] md:h-[560px] lg:h-[600px]">
          <div className="absolute inset-0 w-full h-full">
            <Carousel
              opts={{ loop: true, align: "start" }}
              plugins={[Autoplay({ delay: 4000, stopOnInteraction: false })]}
              className="h-full w-full"
            >
              <CarouselContent className="-ml-0 h-full w-full">
                {banners.map((b, i) => (
                  <CarouselItem key={i} className="pl-0 h-full basis-full shrink-0 grow-0">
                    <img
                      src={b.src}
                      alt={b.alt}
                      className="block h-full w-full object-cover object-center"
                      loading={i === 0 ? "eager" : "lazy"}
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
            <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-transparent" />
            <div className="absolute inset-0 groovy-gradient opacity-30 mix-blend-overlay" />

            {/* Bouncing groovy emoji accents — lightweight GPU-only transforms */}
            <span aria-hidden="true" className="pointer-events-none absolute top-[15%] left-[8%] text-4xl md:text-5xl drop-shadow-lg animate-bounce-around will-change-transform">🍪</span>
            <span aria-hidden="true" className="pointer-events-none absolute top-[20%] right-[10%] text-4xl md:text-5xl drop-shadow-lg animate-float-slow will-change-transform" style={{ animationDelay: "0.5s" }}>✨</span>
            <span aria-hidden="true" className="pointer-events-none absolute bottom-[18%] left-[12%] text-3xl md:text-4xl drop-shadow-lg animate-float-slow will-change-transform" style={{ animationDelay: "1s" }}>🌿</span>
            <span aria-hidden="true" className="pointer-events-none absolute bottom-[22%] right-[8%] text-4xl md:text-5xl drop-shadow-lg animate-bounce-around will-change-transform" style={{ animationDelay: "1.5s" }}>💨</span>
          </div>

          <div className="relative mx-auto flex h-full max-w-7xl flex-col items-center justify-center px-4 py-8 text-center md:py-12">
            {/* Delivery promise badge */}
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/90 backdrop-blur px-4 py-1.5 text-xs md:text-sm font-bold text-primary-foreground shadow-lg mb-4">
              <Truck className="h-3.5 w-3.5" /> 24–48hr Delivery · Joburg & Nationwide
            </div>

<h1 className="font-display text-3xl font-extrabold tracking-tight drop-shadow-lg md:text-5xl text-white leading-tight">
              Cannabis Infused Products.<br className="hidden md:block" />
              <span className="groovy-gradient-text bg-clip-text">Not Just Cannabis.</span>
            </h1>
            <p className="mx-auto mt-3 max-w-xl text-base opacity-95 drop-shadow-md md:text-lg text-white/90">
              Edibles · Vapes · Dab · Pre-rolls — from <strong className="text-white">R50</strong>. Pay by EFT, delivered to your door.
            </p>

            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Button
                asChild
                size="lg"
                className="gap-2 text-lg px-8 py-6 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-xl shadow-primary/40 transition-transform hover:scale-105 font-bold"
              >
                <Link to="/shop">
                  <Sparkles className="h-5 w-5" /> Shop Now <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="gap-2 rounded-full bg-white/10 backdrop-blur border-white/40 text-white text-base hover:bg-white/20 font-semibold"
              >
                <a href="https://wa.me/27645436734" target="_blank" rel="noopener noreferrer">
                  💬 WhatsApp Order
                </a>
              </Button>
            </div>

            {/* Trust badges */}
            <div className="mt-6 flex flex-wrap justify-center gap-x-5 gap-y-2 text-white/90 text-xs md:text-sm font-medium">
              <span className="flex items-center gap-1.5"><Shield className="h-4 w-4" /> Quality Tested</span>
              <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> Same-Day Dispatch</span>
              <span className="flex items-center gap-1.5"><Leaf className="h-4 w-4" /> 100% Discreet</span>
            </div>

            {/* First-order code teaser */}
            <p className="mt-4 text-xs md:text-sm text-white/80">
              ✨ New here? Use code <strong className="font-mono text-white bg-white/15 px-2 py-0.5 rounded">WELCOME10</strong> for 10% off
            </p>
          </div>
        </section>

        {/* Wavy divider */}
        <div className="relative -mt-1">
          <svg viewBox="0 0 1440 60" className="w-full fill-background" preserveAspectRatio="none">
            <path d="M0,30 C360,60 720,0 1080,30 C1260,45 1380,30 1440,30 L1440,60 L0,60 Z" />
          </svg>
        </div>

        {/* 🔥 BEST SELLERS — moved immediately after hero */}
        <section className="px-4 py-10 relative">
          <div className="mx-auto max-w-7xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Flame className="h-6 w-6 text-destructive" />
                <h2 className="font-display text-2xl font-bold md:text-3xl">
                  Best Sellers
                </h2>
              </div>
              <Button asChild variant="outline" className="gap-1 rounded-full transition-transform hover:scale-105">
                <Link to="/shop">View All <ArrowRight className="h-4 w-4" /></Link>
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {bestSellers.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>

        {/* Budget Picks — low price entry point */}
        {budgetPicks.length > 0 && (
          <section className="px-4 py-10 bg-secondary/30">
            <div className="mx-auto max-w-7xl">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Zap className="h-6 w-6 text-primary" />
                  <h2 className="font-display text-2xl font-bold md:text-3xl">
                    Under R100
                  </h2>
                </div>
                <Button asChild variant="outline" className="gap-1 rounded-full transition-transform hover:scale-105">
                  <Link to="/shop">Shop All <ArrowRight className="h-4 w-4" /></Link>
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {budgetPicks.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Categories */}
        <section className="px-4 py-12">
          <div className="mx-auto max-w-7xl">
            <h2 className="font-display text-2xl font-bold md:text-3xl text-center mb-6">
              <span className="groovy-gradient-text">Browse Categories</span>
            </h2>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {categories.map((cat, i) => (
                <Link
                  key={cat}
                  to={`/shop?category=${encodeURIComponent(cat)}`}
                  className="group relative overflow-hidden rounded-2xl border-2 border-border bg-card p-5 text-center transition-all duration-300 hover:border-primary hover:shadow-lg hover:-translate-y-1"
                >
                  <div className="absolute inset-0 groovy-gradient opacity-0 transition-opacity duration-300 group-hover:opacity-10" />
                  <span className="text-3xl block mb-2 transition-transform duration-300 group-hover:scale-125">
                    {["🍪", "✨", "🌸", "🎒", "🔥"][i % 5]}
                  </span>
                  <span className="text-sm font-semibold font-display">{cat}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Trust Features */}
        <section className="px-4 py-10 bg-secondary/30">
          <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-3">
            {[
              { icon: Truck, title: "Delivery Nationwide", desc: "Johannesburg, Cape Town, Durban & all of SA" },
              { icon: Shield, title: "Quality Guaranteed", desc: "Every product tested before it reaches you" },
              { icon: Leaf, title: "Natural & Organic", desc: "Premium cannabis for health & wellness" },
            ].map((f) => (
              <div
                key={f.title}
                className="group flex items-start gap-4 rounded-2xl border-2 border-border bg-card p-5 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-primary/40"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 transition-colors group-hover:bg-primary/20">
                  <f.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-display text-sm font-semibold">{f.title}</h3>
                  <p className="text-xs text-muted-foreground">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ Section for SEO */}
        <section className="px-4 py-12">
          <div className="mx-auto max-w-3xl">
            <h2 className="font-display text-2xl font-bold md:text-3xl text-center mb-6">
              <span className="groovy-gradient-text">Frequently Asked Questions</span>
            </h2>
            <Accordion type="single" collapsible className="w-full">
              {FAQ_ITEMS.map((faq, i) => (
                <AccordionItem key={i} value={`faq-${i}`}>
                  <AccordionTrigger className="text-left font-display font-semibold">
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

        {/* CTA banner */}
        <section className="groovy-gradient py-8 text-center text-white relative overflow-hidden">
          <h2 className="font-display text-2xl md:text-3xl font-bold relative z-10 drop-shadow-lg">
            Order Now — Prices from R50 🌿
          </h2>
          <p className="mt-2 text-base opacity-90 relative z-10">Buy cannabis infused products online · Pay by EFT or cash · Delivered to your door across South Africa</p>
          <div className="mt-4 flex flex-wrap justify-center gap-3 relative z-10">
            <Button
              asChild
              size="lg"
              variant="secondary"
              className="rounded-full transition-transform hover:scale-105"
            >
              <Link to="/shop">Shop Now</Link>
            </Button>
            <Button
              asChild
              size="lg"
              className="rounded-full bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm transition-transform hover:scale-105"
            >
              <a href="https://wa.me/27645436734" target="_blank" rel="noopener noreferrer">
                WhatsApp Us
              </a>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
