import { useSearchParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { CheckCircle, XCircle, Loader2, Truck, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/context/CartContext";
import { trackFunnel } from "@/lib/funnel";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

type PaymentStatus = "checking" | "confirmed" | "pending" | "failed";

export default function PaymentReturn() {
  const [params] = useSearchParams();
  const ref = params.get("ref") || "";
  const cancelled = params.get("cancelled") === "1";
  const { clearCart } = useCart();
  const [status, setStatus] = useState<PaymentStatus>(cancelled ? "failed" : "checking");

  useEffect(() => {
    if (cancelled || !ref) return;

    // Poll for payment confirmation (ITN may take a few seconds)
    let attempts = 0;
    const maxAttempts = 12; // 60 seconds

    const poll = setInterval(async () => {
      attempts++;
      try {
        const { data } = await supabase.functions.invoke("get-order-status", {
          body: { order_ref: ref },
        });

        if (data?.payment_status === "confirmed") {
          setStatus("confirmed");
          clearCart();
          clearInterval(poll);
        } else if (data?.payment_status === "failed") {
          setStatus("failed");
          clearInterval(poll);
        } else if (attempts >= maxAttempts) {
          // After 60s, assume payment is processing
          setStatus("pending");
          clearCart();
          clearInterval(poll);
        }
      } catch {
        if (attempts >= maxAttempts) {
          setStatus("pending");
          clearCart();
          clearInterval(poll);
        }
      }
    }, 5000);

    return () => clearInterval(poll);
  }, [ref, cancelled, clearCart]);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex flex-1 items-center justify-center px-4 py-16">
        <div className="mx-auto max-w-lg text-center space-y-6">
          {status === "checking" && (
            <>
              <Loader2 className="mx-auto h-16 w-16 text-primary animate-spin" />
              <h1 className="font-display text-3xl font-bold">Confirming Payment...</h1>
              <p className="text-muted-foreground">
                We're verifying your payment for order <strong className="font-mono text-foreground">{ref}</strong>. This may take a moment.
              </p>
            </>
          )}

          {status === "confirmed" && (
            <>
              <CheckCircle className="mx-auto h-16 w-16 text-primary" />
              <h1 className="font-display text-3xl font-bold">Payment Successful! 🎉</h1>
              <p className="text-muted-foreground">
                Your payment for order <strong className="font-mono text-foreground">{ref}</strong> has been confirmed.
              </p>
              <div className="rounded-xl border-2 border-primary/30 bg-primary/5 p-6 text-left space-y-3">
                <div className="flex items-center gap-2">
                  <Truck className="h-5 w-5 text-primary" />
                  <h2 className="font-display text-lg font-semibold">Delivery Information</h2>
                </div>
                <p className="text-sm text-muted-foreground">
                  Expect delivery in the next <strong className="text-foreground">24 – 48 hours</strong>.
                </p>
                <div className="rounded-lg border border-accent/30 bg-accent/5 p-3">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-accent mt-0.5 shrink-0" />
                    <p className="text-xs text-muted-foreground">
                      Please ensure you or someone you trust is available to receive the delivery.
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}

          {status === "pending" && (
            <>
              <CheckCircle className="mx-auto h-16 w-16 text-accent" />
              <h1 className="font-display text-3xl font-bold">Payment Processing</h1>
              <p className="text-muted-foreground">
                Your payment for order <strong className="font-mono text-foreground">{ref}</strong> is being processed. You'll receive a confirmation email shortly.
              </p>
              <div className="rounded-xl border-2 border-green-500/30 bg-green-500/5 p-4 text-left">
                <h4 className="text-sm font-semibold text-green-700 dark:text-green-400">⚡ Almost there!</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Your order has been placed and delivery will be dispatched within <strong className="text-foreground">24–48 hours</strong> once payment clears.
                </p>
              </div>
            </>
          )}

          {status === "failed" && (
            <>
              <XCircle className="mx-auto h-16 w-16 text-destructive" />
              <h1 className="font-display text-3xl font-bold">
                {cancelled ? "Payment Cancelled" : "Payment Failed"}
              </h1>
              <p className="text-muted-foreground">
                {cancelled
                  ? "You cancelled the payment. Your order has not been processed."
                  : "There was an issue with your payment. Please try again or contact us."}
              </p>
            </>
          )}

          <div className="flex flex-wrap justify-center gap-3 pt-4">
            <Button asChild>
              <Link to="/shop">Continue Shopping</Link>
            </Button>
            {(status === "failed" || status === "confirmed" || status === "pending") && (
              <Button asChild variant="outline">
                <a
                  href={`https://wa.me/27645436734?text=${encodeURIComponent(`Hi, regarding order ${ref}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  WhatsApp Us
                </a>
              </Button>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
