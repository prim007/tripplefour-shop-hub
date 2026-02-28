import { Link } from "react-router-dom";
import { ArrowRight, Leaf, Truck, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { products, categories } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const featured = products.filter((p) => !p.comingSoon).slice(0, 4);

const Index = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden bg-primary px-4 py-24 text-primary-foreground md:py-32">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-accent" />
            <div className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-accent" />
          </div>
          <div className="relative mx-auto max-w-7xl text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-foreground/10">
              <Leaf className="h-8 w-8" />
            </div>
            <h1 className="font-display text-4xl font-extrabold tracking-tight md:text-6xl">
              Tripplefour
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-lg opacity-90 md:text-xl">
              Dispensery we deliver allover — Premium cannabis health products at your doorstep.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button asChild size="lg" variant="secondary" className="gap-2 text-base">
                <Link to="/shop">
                  Shop Now <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="gap-2 border-primary-foreground/30 text-base text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground">
                <a href="https://wa.me/27645436734" target="_blank" rel="noopener noreferrer">
                  WhatsApp Us
                </a>
              </Button>
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
