import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import type { Product } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const { addItem } = useCart();

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    if (product.comingSoon) return;
    addItem(product);
    toast({ title: "Added to cart", description: `${product.name} added.` });
  };

  return (
    <Link to={`/product/${product.id}`}>
      <Card className="group overflow-hidden transition-shadow hover:shadow-lg">
        <div className="relative aspect-square overflow-hidden bg-muted">
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
          {product.comingSoon && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/70">
              <Badge variant="secondary" className="text-sm">Coming Soon</Badge>
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
              <Button size="sm" onClick={handleAdd} className="gap-1">
                <ShoppingCart className="h-4 w-4" />
                Add
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
