import { Link } from "react-router-dom";
import { ShoppingCart, Truck, CheckCircle2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import CartItemRow from "@/components/CartItem";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const FREE_SHIPPING_THRESHOLD = 800;

export default function Cart() {
  const { items, totalPrice, clearCart } = useCart();
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - totalPrice);
  const progress = Math.min(100, (totalPrice / FREE_SHIPPING_THRESHOLD) * 100);
  const qualifies = totalPrice >= FREE_SHIPPING_THRESHOLD;

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 px-4 py-8">
        <div className="mx-auto max-w-3xl">
          <h1 className="font-display text-3xl font-bold">Your Cart</h1>

          {items.length === 0 ? (
            <div className="mt-16 text-center">
              <ShoppingCart className="mx-auto h-16 w-16 text-muted-foreground/40" />
              <p className="mt-4 text-lg text-muted-foreground">Your cart is empty</p>
              <Button asChild className="mt-6">
                <Link to="/shop">Start Shopping</Link>
              </Button>
            </div>
          ) : (
            <>
              {/* Free shipping progress bar — proven AOV booster */}
              <div className="mt-6 rounded-2xl border-2 border-primary/30 bg-primary/5 p-4">
                <div className="flex items-center gap-2 mb-2">
                  {qualifies ? (
                    <>
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                      <p className="text-sm font-semibold text-primary">🎉 You unlocked FREE delivery!</p>
                    </>
                  ) : (
                    <>
                      <Truck className="h-5 w-5 text-primary" />
                      <p className="text-sm font-semibold">
                        Add <span className="text-primary">R{remaining.toLocaleString()}</span> more for FREE delivery
                      </p>
                    </>
                  )}
                </div>
                <Progress value={progress} className="h-2" />
                {!qualifies && (
                  <Button asChild variant="link" size="sm" className="mt-1 h-auto p-0 text-xs">
                    <Link to="/shop">Browse more products →</Link>
                  </Button>
                )}
              </div>

              <div className="mt-6">
                {items.map((item) => (
                  <CartItemRow key={item.product.id} item={item} />
                ))}
              </div>
              <Separator className="my-4" />
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold">Total</span>
                <span className="text-2xl font-bold text-primary">R{totalPrice.toLocaleString()}</span>
              </div>
              <div className="mt-6 flex gap-3">
                <Button variant="outline" onClick={clearCart}>Clear Cart</Button>
                <Button asChild className="flex-1">
                  <Link to="/checkout">Proceed to Checkout</Link>
                </Button>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
