import { Link } from "react-router-dom";
import { ArrowRight, Leaf, Truck, Shield, Clock, AlertTriangle } from "lucide-react";
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

const Index = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero with Carousel */}
        <section className="relative overflow-hidden bg-primary text-primary-foreground">
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
            {/* Dark overlay for text readability */}
            <div className="absolute inset-0 bg-black/60" />
          </div>

          <div className="relative mx-auto max-w-7xl px-4 py-28 text-center md:py-40">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-foreground/10 backdrop-blur-sm">
              <Leaf className="h-8 w-8" />
            </div>
            <h1 className="font-display text-4xl font-extrabold tracking-tight drop-shadow-lg md:text-6xl">
              Tripplefour
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-lg opacity-90 drop-shadow-md md:text-xl">
              Dispensery we deliver allover — Premium cannabis health products at your doorstep.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button asChild size="lg" variant="secondary" className="gap-2 text-base">
                <Link to="/shop">
                  Shop Now <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" className="gap-2 bg-accent text-base text-accent-foreground hover:bg-accent/90 shadow-lg shadow-accent/30 font-semibold">
                <a href="https://wa.me/27645436734" target="_blank" rel="noopener noreferrer">
                  WhatsApp Us
                </a>
              </Button>
            </div>
          </div>
        </section>

        {/* Important Notices */}
        <section className="border-b bg-destructive/5 px-4 py-4">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-primary" />
              <span><strong>Delivery Fee:</strong> R50 – R100 depending on location</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              <span>Orders processed within <strong>24 hours</strong> of payment</span>
            </div>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              <span><strong>Immediate payment required</strong> — no payment, no order</span>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="border-b bg-card px-4 py-12">
          <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-3">
            {[
              { icon: Truck, title: "Delivery Nationwide", desc: "We deliver allover South Africa" },
              { icon: Shield, title: "Quality Guaranteed", desc: "Premium tested products" },
              { icon: Leaf, title: "Natural & Organic", desc: "Cannabis health & wellness" },
            ].map((f) => (
              <div key={f.title} className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <f.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-display text-sm font-semibold">{f.title}</h3>
                  <p className="text-sm text-muted-foreground">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Categories */}
        <section className="px-4 py-16">
          <div className="mx-auto max-w-7xl">
            <h2 className="font-display text-2xl font-bold md:text-3xl">Browse Categories</h2>
            <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
              {categories.map((cat) => (
                <Link
                  key={cat}
                  to={`/shop?category=${encodeURIComponent(cat)}`}
                  className="group rounded-xl border bg-card p-5 text-center transition-colors hover:border-primary hover:bg-primary/5"
                >
                  <Leaf className="mx-auto mb-2 h-6 w-6 text-primary opacity-60 transition-opacity group-hover:opacity-100" />
                  <span className="text-sm font-medium">{cat}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="bg-muted/50 px-4 py-16">
          <div className="mx-auto max-w-7xl">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-2xl font-bold md:text-3xl">Featured Products</h2>
              <Button asChild variant="ghost" className="gap-1">
                <Link to="/shop">View All <ArrowRight className="h-4 w-4" /></Link>
              </Button>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
              {featured.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
