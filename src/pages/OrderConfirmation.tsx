import { useSearchParams, Link } from "react-router-dom";
import { CheckCircle, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function OrderConfirmation() {
  const [params] = useSearchParams();
  const ref = params.get("ref") || "N/A";
  const payment = params.get("payment") || "eft";

  const copyRef = () => {
    navigator.clipboard.writeText(ref);
    toast({ title: "Copied!", description: "Order reference copied to clipboard." });
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex flex-1 items-center justify-center px-4 py-16">
        <div className="mx-auto max-w-lg text-center">
          <CheckCircle className="mx-auto h-16 w-16 text-primary" />
          <h1 className="mt-4 font-display text-3xl font-bold">Order Placed!</h1>
          <p className="mt-2 text-muted-foreground">
            Thank you for your order. Your reference number is:
          </p>
          <div className="mt-4 inline-flex items-center gap-2 rounded-lg bg-muted px-4 py-2">
            <span className="font-mono text-lg font-bold">{ref}</span>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={copyRef}>
              <Copy className="h-4 w-4" />
            </Button>
          </div>

          <div className="mt-8 rounded-xl border-2 border-green-500/30 bg-green-500/5 p-4 space-y-2 text-left">
            <h4 className="text-sm font-semibold text-green-700 dark:text-green-400 flex items-center gap-1.5">⚡ Immediate Processing</h4>
            <p className="text-sm text-muted-foreground">
              Orders paid <strong className="text-foreground">immediately</strong> will be <strong className="text-foreground">processed immediately</strong> — expect delivery within <strong className="text-foreground">24–48 hours</strong>.
            </p>
          </div>

          {payment === "eft" && (
            <div className="mt-8 rounded-xl border bg-card p-6 text-left">
              <h2 className="font-display text-lg font-semibold">🏦 FNB Banking Details</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Please use your order reference <strong>{ref}</strong> as the payment reference.
              </p>
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Bank</span>
                  <span className="font-medium">FNB / RMB</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Account Holder</span>
                  <span className="font-medium">TRIPPLE444 (Pty) Ltd</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Account Type</span>
                  <span className="font-medium">Gold Business Account</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Account Number</span>
                  <span className="font-mono font-bold">631 827 73870</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Branch Code</span>
                  <span className="font-medium">250 655</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Reference</span>
                  <span className="font-bold text-primary">{ref}</span>
                </div>
              </div>
            </div>
          )}

          {payment === "fnb-pay" && (
            <div className="mt-8 rounded-xl border bg-card p-6 text-left">
              <h2 className="font-display text-lg font-semibold">FNB Pay</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                You will receive payment instructions via email shortly. Alternatively, contact us on WhatsApp with your order reference <strong>{ref}</strong> to complete payment via FNB Pay.
              </p>
              <Button asChild className="mt-4 w-full" variant="outline">
                <a href={`https://wa.me/27645436734?text=${encodeURIComponent(`Hi, I'd like to pay for order ${ref} via FNB Pay`)}`} target="_blank" rel="noopener noreferrer">
                  Contact on WhatsApp
                </a>
              </Button>
            </div>
          )}

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild>
              <Link to="/shop">Continue Shopping</Link>
            </Button>
            <Button asChild variant="outline">
              <a href={`https://wa.me/27645436734?text=${encodeURIComponent(`Hi, I just placed order ${ref}`)}`} target="_blank" rel="noopener noreferrer">
                WhatsApp Us
              </a>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
