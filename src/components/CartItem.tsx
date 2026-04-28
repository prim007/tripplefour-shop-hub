import { Minus, Plus, Trash2 } from "lucide-react";
import type { CartItem as CartItemType } from "@/context/CartContext";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Analytics } from "@/lib/analytics";

interface Props {
  item: CartItemType;
}

export default function CartItem({ item }: Props) {
  const { updateQuantity, removeItem } = useCart();
  const { product, quantity } = item;

  return (
    <div className="flex items-center gap-4 border-b py-4">
      <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
        <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
      </div>
      <div className="flex-1">
        <h4 className="font-display text-sm font-semibold">{product.name}</h4>
        <p className="text-xs text-muted-foreground">{product.category}</p>
        <p className="mt-1 font-bold text-primary">R{product.price.toLocaleString()}</p>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => updateQuantity(product.id, quantity - 1)}
        >
          <Minus className="h-3 w-3" />
        </Button>
        <span className="w-8 text-center text-sm font-medium">{quantity}</span>
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          onClick={() => updateQuantity(product.id, quantity + 1)}
        >
          <Plus className="h-3 w-3" />
        </Button>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => {
          Analytics.removeFromCart(product.id, product.name, product.price, quantity);
          removeItem(product.id);
        }}
      >
        <Trash2 className="h-4 w-4 text-destructive" />
      </Button>
    </div>
  );
}
