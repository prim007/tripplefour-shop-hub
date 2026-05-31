import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle2, XCircle, Clock, ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

export default function LefLabsOrderComplete() {
  const [params] = useSearchParams();
  const ref = params.get("ref") || "";
  const status = (params.get("status") || "success").toLowerCase();
  const [now, setNow] = useState(Date.now());

  // Light auto-refresh hint so customer sees up-to-date language while ITN lands.
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 5000);
    return () => clearInterval(t);
  }, []);

  const isCancel = status === "cancel" || status === "cancelled";

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
                Thank you. Your wholesale order has been placed and we are awaiting payment confirmation from PayFast.
              </p>
              {ref && (
                <div className="mt-6 inline-block rounded-xl border-2 border-border bg-card px-6 py-4">
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">Order reference</p>
                  <p className="mt-1 font-mono text-2xl font-bold text-primary">{ref}</p>
                </div>
              )}
              <div className="mt-6 inline-flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="h-3.5 w-3.5" /> Payment status updates within a few seconds of completion ({new Date(now).toLocaleTimeString()})
              </div>
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