import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import type { Product } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { useCartDrawer } from "@/context/CartDrawerContext";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { trackFunnel } from "@/lib/funnel";
import { Analytics } from "@/lib/analytics";

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const { addItem } = useCart();
  const { open } = useCartDrawer();

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.comingSoon) return;
    addItem(product);
    trackFunnel("add_to_cart", product.id, { name: product.name, value: product.price, source: "card" });
    Analytics.selectItem("Shop card", { item_id: product.id, item_name: product.name, item_category: product.category, price: product.price });
    Analytics.addToCart(product.id, product.name, product.price, 1, product.category);
    toast({ title: "Added to cart", description: `${product.name} added.` });
    open();
  };

  return (
    <Link to={`/product/${product.id}`} className="group block">
      <div className="relative aspect-square overflow-hidden bg-secondary/40 hairline-border">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        {product.comingSoon ? (
          <div className="absolute inset-0 flex items-center justify-center bg-background/70 backdrop-blur-sm">
            <Badge variant="secondary" className="text-[10px] uppercase tracking-widest">Coming Soon</Badge>
          </div>
        ) : (
          <button
            onClick={handleAdd}
            aria-label={`Add ${product.name} to cart`}
            className="absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center bg-background/90 text-foreground opacity-0 backdrop-blur transition-all duration-300 group-hover:opacity-100 hover:bg-primary hover:text-primary-foreground"
          >
            <Plus className="h-4 w-4" />
          </button>
        )}
      </div>
      <div className="mt-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{product.category}</p>
          <h3 className="mt-0.5 font-display text-sm font-semibold leading-snug line-clamp-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
        </div>
        <span className="shrink-0 font-display text-sm font-bold text-foreground">
          {product.comingSoon ? "TBA" : `R${product.price.toLocaleString()}`}
        </span>
      </div>
    </Link>
  );
}
