import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { products, type ProductCategory } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import CategoryFilter from "@/components/CategoryFilter";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Shop() {
  const [searchParams] = useSearchParams();
  const initialCat = searchParams.get("category") as ProductCategory | null;
  const [selected, setSelected] = useState<ProductCategory | "All">(initialCat || "All");

  const filtered = selected === "All" ? products : products.filter((p) => p.category === selected);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 px-4 py-8">
        <div className="mx-auto max-w-7xl">
          <h1 className="font-display text-3xl font-bold">Shop</h1>
          <p className="mt-1 text-muted-foreground">Browse our full range of cannabis health products</p>
          <div className="mt-6">
            <CategoryFilter selected={selected} onSelect={setSelected} />
          </div>
          <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          {filtered.length === 0 && (
            <p className="mt-12 text-center text-muted-foreground">No products in this category.</p>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
