import { Link } from "react-router-dom";
import { ArrowRight, Leaf, Truck, Shield, Clock, AlertTriangle, Sparkles } from "lucide-react";
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

const featured = products.filter((p) => !p.comingSoon).slice(0, 4);

const vibes = ["☮️", "🌿", "✌️", "🌻", "🍃", "💚"];

const Index = () => {
  return (
    <div className="flex min-h-screen flex-col overflow-hidden">
      <Navbar />
      <main className="flex-1">
        {/* Hero with Carousel */}
        <section className="relative overflow-hidden">
          {/* Banner Carousel */}
          <div className="absolute inset-0">
            <Carousel
              opts={{ loop: true, align: "start" }}
              plugins={[Autoplay({ delay: 4000, stopOnInteraction: false })]}
              className="h-full"
            >
              <CarouselContent className="-ml-0 h-full">
                {banners.map((b, i) => (
                  <CarouselItem key={i} className="pl-0 h-full">
                    <img
                      src={b.src}
                      alt={b.alt}
                      className="h-full w-full object-cover"
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
            {/* Groovy overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-transparent" />
            <div className="absolute inset-0 groovy-gradient opacity-30 mix-blend-overlay" />
          </div>

          <div className="relative mx-auto max-w-7xl px-4 py-32 text-center md:py-44">
            {/* Floating emojis */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              {vibes.map((v, i) => (
                <span
                  key={i}
                  className="absolute text-3xl opacity-20 animate-float"
                  style={{
                    left: `${15 + i * 14}%`,
                    top: `${20 + (i % 3) * 25}%`,
                    animationDelay: `${i * 0.7}s`,
                  }}
                >
                  {v}
                </span>
              ))}
            </div>

            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/20 backdrop-blur-md animate-groovy-pulse">
              <Leaf className="h-10 w-10 text-primary-foreground drop-shadow-lg" />
            </div>
            <h1 className="font-display text-5xl font-extrabold tracking-tight drop-shadow-lg md:text-7xl text-white">
              Tripplefour
            </h1>
            <p className="groovy-gradient-text mx-auto mt-2 text-xl font-display md:text-2xl">
              ✌️ If it's from the ground, it is sound ✌️
            </p>
            <p className="mx-auto mt-4 max-w-xl text-lg opacity-90 drop-shadow-md md:text-xl text-white/90">
              Dispensery we deliver allover — Premium cannabis health products at your doorstep.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button
                asChild
                size="lg"
                className="gap-2 text-base rounded-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-xl shadow-primary/30 transition-transform hover:scale-105"
              >
                <Link to="/shop">
                  <Sparkles className="h-4 w-4" /> Shop Now <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                className="gap-2 rounded-full bg-accent text-base text-accent-foreground hover:bg-accent/90 shadow-xl shadow-accent/30 font-semibold transition-transform hover:scale-105"
              >
                <a href="https://wa.me/27645436734" target="_blank" rel="noopener noreferrer">
                  ☮️ WhatsApp Us
                </a>
              </Button>
            </div>
          </div>
        </section>

        {/* Wavy divider */}
        <div className="relative -mt-1">
          <svg viewBox="0 0 1440 60" className="w-full fill-background" preserveAspectRatio="none">
            <path d="M0,30 C360,60 720,0 1080,30 C1260,45 1380,30 1440,30 L1440,60 L0,60 Z" />
          </svg>
        </div>

        {/* Important Notices - with groovy styling */}
        <section className="px-4 py-4 relative">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-6 text-sm">
            {[
              { icon: Truck, text: <><strong>Delivery Fee:</strong> R50 – R100 depending on location</>, color: "text-primary" },
              { icon: Clock, text: <>Orders processed within <strong>24 hours</strong> of payment</>, color: "text-primary" },
              { icon: AlertTriangle, text: <><strong>Immediate payment required</strong> — no payment, no order</>, color: "text-destructive" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2 rounded-full border bg-card px-4 py-2 shadow-sm animate-fade-in" style={{ animationDelay: `${i * 0.15}s` }}>
                <item.icon className={`h-4 w-4 ${item.color}`} />
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Features - Groovy cards */}
        <section className="px-4 py-14 relative peace-bg overflow-hidden">
          <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-3">
            {[
              { icon: Truck, title: "Delivery Nationwide 🚚", desc: "We deliver allover South Africa", delay: 0 },
              { icon: Shield, title: "Quality Guaranteed 🌟", desc: "Premium tested products", delay: 0.1 },
              { icon: Leaf, title: "Natural & Organic 🌿", desc: "Cannabis health & wellness", delay: 0.2 },
            ].map((f) => (
              <div
                key={f.title}
                className="group flex items-start gap-4 rounded-2xl border-2 border-border bg-card p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-primary/40 animate-fade-in"
                style={{ animationDelay: `${f.delay}s` }}
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 transition-colors group-hover:bg-primary/20">
                  <f.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-display text-base font-semibold">{f.title}</h3>
                  <p className="text-sm text-muted-foreground">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Categories - Groovy grid */}
        <section className="px-4 py-16 bg-secondary/30">
          <div className="mx-auto max-w-7xl">
            <h2 className="font-display text-3xl font-bold md:text-4xl text-center">
              <span className="groovy-gradient-text">Browse Categories</span> 🌻
            </h2>
            <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
              {categories.map((cat, i) => (
                <Link
                  key={cat}
                  to={`/shop?category=${encodeURIComponent(cat)}`}
                  className="group relative overflow-hidden rounded-2xl border-2 border-border bg-card p-6 text-center transition-all duration-300 hover:border-primary hover:shadow-lg hover:-translate-y-1 animate-fade-in"
                  style={{ animationDelay: `${i * 0.08}s` }}
                >
                  <div className="absolute inset-0 groovy-gradient opacity-0 transition-opacity duration-300 group-hover:opacity-10" />
                  <span className="text-3xl block mb-2 transition-transform duration-300 group-hover:scale-125">
                    {["🌿", "🌱", "💨", "🍪", "✨", "🌸", "🔥", "🍃"][i % 8]}
                  </span>
                  <span className="text-sm font-semibold font-display">{cat}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="px-4 py-16 relative">
          <div className="mx-auto max-w-7xl">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-display text-3xl font-bold md:text-4xl">
                <span className="groovy-gradient-text">Featured</span> ✨
              </h2>
              <Button asChild variant="outline" className="gap-1 rounded-full transition-transform hover:scale-105">
                <Link to="/shop">View All <ArrowRight className="h-4 w-4" /></Link>
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
              {featured.map((product, i) => (
                <div key={product.id} className="animate-fade-in" style={{ animationDelay: `${i * 0.1}s` }}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Vibes banner */}
        <section className="groovy-gradient py-10 text-center text-white relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <span className="text-[200px] opacity-10 animate-spin-slow">☮</span>
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold relative z-10 drop-shadow-lg">
            Stay Groovy, Stay Green 🌿
          </h2>
          <p className="mt-2 text-lg opacity-90 relative z-10">Premium cannabis for the conscious soul</p>
          <Button
            asChild
            size="lg"
            variant="secondary"
            className="mt-6 rounded-full relative z-10 transition-transform hover:scale-105"
          >
            <Link to="/shop">Explore the Shop ✌️</Link>
          </Button>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
