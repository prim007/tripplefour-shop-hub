import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, Flame, SlidersHorizontal } from "lucide-react";
import { Helmet } from "react-helmet-async";
import { products, type ProductCategory } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import CategoryFilter from "@/components/CategoryFilter";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Analytics } from "@/lib/analytics";

export default function Shop() {
  const [searchParams] = useSearchParams();
  const initialCat = searchParams.get("category") as ProductCategory | null;
  const [selected, setSelected] = useState<ProductCategory | "All">(initialCat || "All");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"default" | "price-low" | "price-high">("default");

  const filtered = useMemo(() => {
    let list = selected === "All" ? products : products.filter((p) => p.category === selected);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q),
      );
    }
    if (sortBy === "price-low") list = [...list].sort((a, b) => a.price - b.price);
    else if (sortBy === "price-high") list = [...list].sort((a, b) => b.price - a.price);
    return list;
  }, [selected, search, sortBy]);

  // Fire view_item_list when the visible product list changes
  useEffect(() => {
    if (!filtered.length) return;
    const listName = selected === "All" ? "Shop — All" : `Shop — ${selected}`;
    Analytics.viewItemList(
      listName,
      filtered.slice(0, 20).map((p) => ({
        item_id: p.id,
        item_name: p.name,
        item_category: p.category,
        price: p.price,
      })),
    );
  }, [selected, sortBy, filtered]);

  // Debounced search event
  useEffect(() => {
    const term = search.trim();
    if (term.length < 2) return;
    const t = window.setTimeout(() => Analytics.search(term), 600);
    return () => window.clearTimeout(t);
  }, [search]);

  return (
    <div className="flex min-h-screen flex-col">
      <Helmet>
        <title>Shop Cannabis Products Online SA | Tripplefour</title>
        <meta name="description" content="Browse CBD infused edibles, vapes, dab & accessories online from R50. Fast delivery to Joburg, Cape Town, Durban & nationwide." />
        <link rel="canonical" href="https://tripplefourshophub.online/shop" />
        <meta property="og:title" content="Shop Cannabis Products Online SA | Tripplefour" />
        <meta property="og:description" content="Browse edibles, vapes, dab & more from R50. Fast delivery across South Africa." />
        <meta property="og:url" content="https://tripplefourshophub.online/shop" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "name": "Shop — Tripplefour",
          "description": "Cannabis infused edibles, vapes, dab & accessories.",
          "url": "https://tripplefourshophub.online/shop",
          "mainEntity": {
            "@type": "ItemList",
            "numberOfItems": filtered.length,
            "itemListElement": filtered.slice(0, 20).map((p, i) => ({
              "@type": "ListItem",
              "position": i + 1,
              "url": `https://tripplefourshophub.online/product/${p.id}`,
              "name": p.name
            }))
          }
        })}</script>
      </Helmet>
      <Navbar />
      <main className="flex-1 px-4 py-6">
        <div className="mx-auto max-w-7xl">
          {/* Header */}
          <div className="border-b border-border/60 pb-8 mb-8">
            <p className="text-[11px] uppercase tracking-[0.32em] text-primary font-semibold mb-3">/ The catalog</p>
            <h1 className="font-display text-3xl md:text-5xl font-bold uppercase">Shop all</h1>
            <p className="mt-3 text-sm text-muted-foreground max-w-xl">
              Edibles, vapes, dab & accessories from R50. Free delivery on orders over R1200. Delivery is free within 3-5km of your location.
            </p>
          </div>

          {/* Search & Sort */}
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 rounded-full"
              />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="rounded-full border bg-background px-4 py-2 text-sm outline-none focus:border-primary"
            >
              <option value="default">Sort: Default</option>
              <option value="price-low">Price: Low → High</option>
              <option value="price-high">Price: High → Low</option>
            </select>
          </div>

          {/* Filters */}
          <div className="mb-6">
            <CategoryFilter selected={selected} onSelect={setSelected} />
          </div>

          {/* Results count */}
          <p className="text-sm text-muted-foreground mb-4">
            {filtered.length} product{filtered.length !== 1 ? "s" : ""} found
          </p>

          {/* Grid */}
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          {filtered.length === 0 && (
            <div className="mt-12 text-center">
              <p className="text-muted-foreground text-lg">No products found</p>
              <p className="text-muted-foreground text-sm mt-1">Try a different search or category</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
