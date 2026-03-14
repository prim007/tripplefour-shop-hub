import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Zap } from "lucide-react";
import type { Product } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { useCartDrawer } from "@/context/CartDrawerContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const { addItem } = useCart();
  const { open } = useCartDrawer();
  const navigate = useNavigate();

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    if (product.comingSoon) return;
    addItem(product);
    toast({ title: "Added to cart ✌️", description: `${product.name} added.` });
    open();
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    if (product.comingSoon) return;
    addItem(product);
    navigate("/checkout");
  };

  return (
    <Link to={`/product/${product.id}`}>
      <Card className="group overflow-hidden rounded-2xl border-2 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-primary/30">
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
          <div className="absolute inset-0 groovy-gradient opacity-0 transition-opacity duration-300 group-hover:opacity-10" />
          {product.comingSoon && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/70 backdrop-blur-sm">
              <Badge variant="secondary" className="text-sm rounded-full px-4">Coming Soon ✨</Badge>
            </div>
          )}
        </div>
        <CardContent className="p-4">
          <p className="text-xs font-medium text-muted-foreground">{product.category}</p>
          <h3 className="mt-1 font-display text-base font-semibold leading-tight">{product.name}</h3>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-lg font-bold text-primary">
              {product.comingSoon ? "TBA" : `R${product.price.toLocaleString()}`}
            </span>
            {!product.comingSoon && (
              <Button size="sm" onClick={handleAdd} className="gap-1 rounded-full transition-transform hover:scale-105">
                <ShoppingCart className="h-4 w-4" />
                Add
              </Button>
            )}
          </div>
          {!product.comingSoon && (
            <Button
              size="sm"
              variant="secondary"
              onClick={handleBuyNow}
              className="mt-2 w-full gap-1 rounded-full text-xs font-semibold"
            >
              <Zap className="h-3.5 w-3.5" />
              Buy Now
            </Button>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
