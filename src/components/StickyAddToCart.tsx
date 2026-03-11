import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Product } from "@/data/products";

interface Props {
  product: Product;
  qty: number;
  onAdd: () => void;
}

export default function StickyAddToCart({ product, qty, onAdd }: Props) {
  if (product.comingSoon) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur-md p-3 md:hidden shadow-[0_-4px_20px_rgba(0,0,0,0.1)]">
      <div className="mx-auto flex max-w-lg items-center justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">{product.name}</p>
          <p className="text-lg font-bold text-primary">R{(product.price * qty).toLocaleString()}</p>
        </div>
        <Button size="lg" className="gap-2 rounded-full shrink-0 shadow-lg shadow-primary/20" onClick={onAdd}>
          <ShoppingCart className="h-5 w-5" />
          Add to Cart
        </Button>
      </div>
    </div>
  );
}
