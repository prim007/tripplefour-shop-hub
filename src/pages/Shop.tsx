import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, Flame, SlidersHorizontal } from "lucide-react";
import { products, type ProductCategory } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import CategoryFilter from "@/components/CategoryFilter";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";

export default function Shop() {
  const [searchParams] = useSearchParams();
  const initialCat = searchParams.get("category") as ProductCategory | null;
  const [selected, setSelected] = useState<ProductCategory | "All">(initialCat || "All");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"default" | "price-low" | "price-high">("default");

  let filtered = selected === "All" ? products : products.filter((p) => p.category === selected);

  if (search.trim()) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
    );
  }

  if (sortBy === "price-low") {
    filtered = [...filtered].sort((a, b) => a.price - b.price);
  } else if (sortBy === "price-high") {
    filtered = [...filtered].sort((a, b) => b.price - a.price);
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 px-4 py-6">
        <div className="mx-auto max-w-7xl">
          {/* Header with urgency */}
          <div className="rounded-2xl groovy-gradient p-6 text-white mb-6">
            <h1 className="font-display text-2xl font-bold md:text-3xl">Buy Cannabis Online — Shop All Products</h1>
            <p className="mt-1 text-white/80 text-sm">
              Prices from R50 · Free delivery over R500 · Dispatched within 24hrs
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
