import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle2, XCircle, Clock, ArrowLeft, Building2, Copy } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

export default function LefLabsOrderComplete() {
  const [params] = useSearchParams();
  const ref = params.get("ref") || "";
  const status = (params.get("status") || "success").toLowerCase();
  const method = (params.get("method") || "").toLowerCase();
  const [now, setNow] = useState(Date.now());

  // Light auto-refresh hint so customer sees up-to-date language while ITN lands.
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 5000);
    return () => clearInterval(t);
  }, []);

  const isCancel = status === "cancel" || status === "cancelled";
  const isEft = method === "eft";

  const copy = async (value: string, label: string) => {
    try {
      await navigator.clipboard.writeText(value);
      toast({ title: "Copied", description: `${label} copied to clipboard.` });
    } catch {
      toast({ title: "Copy failed", description: "Please copy manually.", variant: "destructive" });
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Helmet>
        <title>Order {isCancel ? "Cancelled" : "Received"} — Lëf Labs | Tripplefour</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <Navbar />

      <main className="flex-1 bg-secondary/20">
        <section className="mx-auto max-w-2xl px-4 py-16 text-center">
          {isCancel ? (
            <>
              <XCircle className="mx-auto h-16 w-16 text-destructive" />
              <h1 className="mt-4 font-display text-3xl font-bold">Payment cancelled</h1>
              <p className="mt-2 text-muted-foreground">
                Your PayFast payment was cancelled and no charge was made.
                {ref && <> Order reference <span className="font-mono font-bold">{ref}</span> remains pending.</>}
              </p>
            </>
          ) : (
            <>
              <CheckCircle2 className="mx-auto h-16 w-16 text-primary" />
              <h1 className="mt-4 font-display text-3xl font-bold">Order received</h1>
              <p className="mt-2 text-muted-foreground">
                {isEft
                  ? "Thank you. Your wholesale order is reserved. Complete payment via EFT using the details below — the order ships once funds reflect."
                  : "Thank you. Your wholesale order has been placed and we are awaiting payment confirmation from PayFast."}
              </p>
              {ref && (
                <div className="mt-6 inline-block rounded-xl border-2 border-border bg-card px-6 py-4">
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">Order reference</p>
                  <p className="mt-1 font-mono text-2xl font-bold text-primary">{ref}</p>
                  {isEft && (
                    <Button size="sm" variant="outline" className="mt-2 gap-1.5" onClick={() => copy(ref, "Reference")}>
                      <Copy className="h-3.5 w-3.5" /> Copy reference
                    </Button>
                  )}
                </div>
              )}
              {!isEft && (
                <div className="mt-6 inline-flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" /> Payment status updates within a few seconds of completion ({new Date(now).toLocaleTimeString()})
                </div>
              )}

              {isEft && ref && (
                <div className="mt-6 rounded-xl border-2 border-dashed border-primary/40 bg-card p-5 text-left">
                  <div className="mb-3 flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-primary" />
                    <h2 className="font-display text-lg font-bold">ABSA Banking Details — Lëf Labs</h2>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Pay into the account below using <strong>{ref}</strong> as the deposit reference.
                    This is how we link your payment to your order — please don't change it.
                  </p>
                  <dl className="mt-4 grid grid-cols-[140px_1fr] gap-y-2 text-sm">
                    <dt className="text-muted-foreground">Account name</dt>
                    <dd className="font-semibold">Lëf Labs</dd>
                    <dt className="text-muted-foreground">Bank</dt>
                    <dd className="font-semibold">Absa</dd>
                    <dt className="text-muted-foreground">Branch code</dt>
                    <dd className="font-mono font-semibold">632005</dd>
                    <dt className="text-muted-foreground">Account no.</dt>
                    <dd className="font-mono font-semibold flex items-center gap-2">
                      4078121856
                      <button type="button" onClick={() => copy("4078121856", "Account number")} className="text-primary hover:underline">
                        <Copy className="h-3.5 w-3.5" />
                      </button>
                    </dd>
                    <dt className="text-muted-foreground">Type</dt>
                    <dd className="font-semibold">Cheque</dd>
                    <dt className="text-muted-foreground">Reference *</dt>
                    <dd className="font-mono font-bold text-primary flex items-center gap-2">
                      {ref}
                      <button type="button" onClick={() => copy(ref, "Reference")} className="text-primary hover:underline">
                        <Copy className="h-3.5 w-3.5" />
                      </button>
                    </dd>
                  </dl>
                  <p className="mt-4 text-[11px] text-muted-foreground">
                    Email proof of payment to <a href="mailto:admin@cuddles-ai.com" className="underline">admin@cuddles-ai.com</a> to speed up reconciliation. Orders typically ship within 1 business day of payment reflecting.
                  </p>
                </div>
              )}
            </>
          )}

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button asChild>
              <Link to="/partners/lef-labs/order"><ArrowLeft className="mr-2 h-4 w-4" /> Place another order</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/partners/lef-labs">Back to catalogue</Link>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}