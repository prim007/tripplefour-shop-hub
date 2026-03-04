import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ShoppingCart, Minus, Plus } from "lucide-react";
import { useState, useEffect } from "react";
import { getProductById, products } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { Analytics } from "@/lib/analytics";
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const product = getProductById(id || "");
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);

  useEffect(() => {
    if (product) {
      Analytics.viewItem(product.id, product.name, product.price);
    }
  }, [product]);

  if (!product) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <h1 className="font-display text-2xl font-bold">Product not found</h1>
            <Button asChild className="mt-4"><Link to="/shop">Back to Shop</Link></Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id && !p.comingSoon)
    .slice(0, 4);

  const handleAdd = () => {
    addItem(product, qty);
    Analytics.addToCart(product.id, product.name, product.price * qty);
    toast({ title: "Added to cart", description: `${qty}x ${product.name} added.` });
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 px-4 py-8">
        <div className="mx-auto max-w-7xl">
          <Button asChild variant="ghost" size="sm" className="mb-4 gap-1">
            <Link to="/shop"><ArrowLeft className="h-4 w-4" /> Back to Shop</Link>
          </Button>

          <div className="grid gap-8 md:grid-cols-2">
            <div className="aspect-square overflow-hidden rounded-2xl bg-muted">
              <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
              {product.comingSoon && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/70">
                  <Badge variant="secondary">Coming Soon</Badge>
                </div>
              )}
            </div>

            <div className="flex flex-col justify-center">
              <p className="text-sm font-medium text-muted-foreground">{product.category}</p>
              <h1 className="mt-1 font-display text-3xl font-bold">{product.name}</h1>
              <p className="mt-3 text-muted-foreground">{product.description}</p>
              <p className="mt-4 text-3xl font-bold text-primary">
                {product.comingSoon ? "Price TBA" : `R${product.price.toLocaleString()}`}
              </p>

              {!product.comingSoon && (
                <div className="mt-6 flex items-center gap-4">
                  <div className="flex items-center gap-2 rounded-lg border p-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setQty(Math.max(1, qty - 1))}>
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-8 text-center font-medium">{qty}</span>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setQty(qty + 1)}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button size="lg" className="gap-2" onClick={handleAdd}>
                    <ShoppingCart className="h-5 w-5" /> Add to Cart
                  </Button>
                </div>
              )}
            </div>
          </div>

          {related.length > 0 && (
            <section className="mt-16">
              <h2 className="font-display text-xl font-bold">Related Products</h2>
              <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
                {related.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
