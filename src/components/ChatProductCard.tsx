import { ShoppingCart, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { getProductById } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { useCartDrawer } from "@/context/CartDrawerContext";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Analytics } from "@/lib/analytics";

interface ChatProductCardProps {
  productId: string;
}

export default function ChatProductCard({ productId }: ChatProductCardProps) {
  const product = getProductById(productId);
  const { addItem } = useCart();
  const { open: openDrawer } = useCartDrawer();

  if (!product || product.comingSoon) return null;

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1);
    Analytics.addToCart(product.id, product.name, product.price);
    trackEvent("chat_product_added", { item_id: product.id, item_name: product.name, source: "cuddles_ai" });
    toast({ title: "Added to cart! 🛒", description: `${product.name} — R${product.price}` });
    openDrawer();
  };

  return (
    <div className="my-2 rounded-xl border border-primary/20 bg-background overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <Link to={`/product/${product.id}`} className="flex gap-3 p-2.5">
        <img
          src={product.image}
          alt={product.name}
          className="h-16 w-16 rounded-lg object-cover shrink-0"
        />
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-muted-foreground">{product.category}</p>
          <p className="font-semibold text-sm truncate">{product.name}</p>
          <p className="text-primary font-bold text-sm">R{product.price.toLocaleString()}</p>
        </div>
      </Link>
      <div className="flex gap-2 px-2.5 pb-2.5">
        <Button size="sm" className="flex-1 gap-1.5 h-8 text-xs rounded-lg" onClick={handleAdd}>
          <ShoppingCart className="h-3.5 w-3.5" /> Add to Cart
        </Button>
        <Button size="sm" variant="outline" className="gap-1.5 h-8 text-xs rounded-lg" asChild>
          <Link to={`/product/${product.id}`}>
            <ExternalLink className="h-3.5 w-3.5" /> View
          </Link>
        </Button>
      </div>
    </div>
  );
}
