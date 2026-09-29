import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Minus, Plus, ShoppingCart, Trash2, ShieldCheck, Loader2, Building2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import StrainThumb from "@/components/StrainThumb";
import { LEFLABS_PRODUCTS, LEFLABS_PRODUCT_MAP, type LefLabsProduct } from "@/data/leflabsProducts";
import { useAuth } from "@/context/AuthContext";

type CartItem = { id: string; quantity: number };

const CATEGORIES = Array.from(new Set(LEFLABS_PRODUCTS.map((p) => p.category)));

export default function LefLabsOrder() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (!authLoading && !user) {
      toast({
        title: "Sign in required",
        description: "Wholesale ordering is for verified partners. Please sign in to continue.",
      });
      navigate(`/auth?redirect=${encodeURIComponent("/partners/lef-labs/order")}`);
    }
  }, [authLoading, user, navigate]);

  const [cart, setCart] = useState<CartItem[]>([]);
  const [submitting, setSubmitting] = useState(false);
  // Lëf Labs is EFT-only (ABSA account on their page). PayFast is not enabled.
  const paymentMethod = "eft" as const;
  const [form, setForm] = useState({
    business_name: "",
    contact_name: "",
    email: "",
    phone: "",
    delivery_address: "",
    notes: "",
  });

  const subtotal = useMemo(
    () => cart.reduce((sum, ci) => sum + (LEFLABS_PRODUCT_MAP[ci.id]?.price ?? 0) * ci.quantity, 0),
    [cart]
  );

  const addToCart = (p: LefLabsProduct) => {
    setCart((prev) => {
      const existing = prev.find((ci) => ci.id === p.id);
      if (existing) return prev.map((ci) => (ci.id === p.id ? { ...ci, quantity: ci.quantity + 1 } : ci));
      return [...prev, { id: p.id, quantity: 1 }];
    });
  };

  const updateQty = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((ci) => (ci.id === id ? { ...ci, quantity: ci.quantity + delta } : ci))
        .filter((ci) => ci.quantity > 0)
    );
  };

  const removeItem = (id: string) => setCart((prev) => prev.filter((ci) => ci.id !== id));

  const handleCheckout = async () => {
    if (!user) {
      navigate(`/auth?redirect=${encodeURIComponent("/partners/lef-labs/order")}`);
      return;
    }
    if (cart.length === 0) {
      toast({ title: "Cart is empty", description: "Add at least one product to continue.", variant: "destructive" });
      return;
    }
    if (!form.business_name || !form.contact_name || !form.email || !form.phone || !form.delivery_address) {
      toast({ title: "Missing details", description: "Please fill in all required fields.", variant: "destructive" });
      return;
    }

    setSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke("create-leflabs-order", {
        body: {
          ...form,
          items: cart,
          payment_method: paymentMethod,
        },
      });
      if (error) throw error;

      if (!data?.order_ref) throw new Error("Invalid response from server");
      navigate(`/partners/lef-labs/order-complete?ref=${encodeURIComponent(data.order_ref)}&method=eft`);
    } catch (err: any) {
      console.error(err);
      toast({
        title: "Could not place order",
        description: err?.message || "Please try again or contact support.",
        variant: "destructive",
      });
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Helmet>
        <title>Order Online — Lëf Labs October 2026 Catalogue | Tripplefour</title>
        <meta name="description" content="Lëf Labs B2B wholesale order portal — October 2026 catalogue. Authorised partners only." />
        <meta name="robots" content="noindex, follow" />
      </Helmet>

      <Navbar />

      <main className="flex-1 bg-secondary/20">
        <section className="border-b border-border bg-background">
          <div className="mx-auto max-w-6xl px-4 py-8">
            <Link
              to="/partners/lef-labs"
              className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-muted-foreground hover:text-primary"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Lëf Labs catalogue
            </Link>
            <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
              <div>
                <Badge className="mb-2 bg-accent text-accent-foreground">October 2026 Catalogue</Badge>
                <h1 className="font-display text-3xl font-bold md:text-4xl">
                  Order Online — <span className="text-primary">Direct EFT Checkout</span>
                </h1>
                <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
                  New this month: Hydro replaces 4A Indoor (15 strains), a brand-new 7-strain Greendoor line-up,
                  Exotic Greenhouse now 22 strains, Sungrown replaces Greenhouse, and six vape lines at a flat R399.
                  COA on request for every batch.
                </p>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-3 py-1.5 text-xs font-semibold text-primary">
                <ShieldCheck className="h-3.5 w-3.5" /> COA on request · B2B only
              </div>
            </div>
          </div>
        </section>


        <section className="mx-auto max-w-6xl px-4 py-8">
          <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
            {/* Product grid */}
            <div className="space-y-8">
              {CATEGORIES.map((cat) => (
                <div key={cat}>
                  <h2 className="mb-3 font-display text-xl font-bold">{cat}</h2>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {LEFLABS_PRODUCTS.filter((p) => p.category === cat).map((p) => (
                      <div key={p.id} className="flex items-center justify-between gap-3 rounded-xl border-2 border-border bg-card p-4">
                        <StrainThumb id={p.id} name={p.name} />
                        <div className="min-w-0 flex-1">
                          <p className="font-display font-bold leading-tight">
                            {p.name}
                            {p.isBack && <Badge className="ml-2 bg-accent text-accent-foreground align-middle text-[10px]">BACK</Badge>}
                            {p.isNew && <Badge className="ml-2 bg-primary text-primary-foreground align-middle text-[10px]">NEW</Badge>}
                          </p>
                          <p className="mt-0.5 text-xs text-muted-foreground">{p.description}</p>
                          <p className="mt-2 font-mono text-sm font-bold text-primary">
                            R{p.price.toFixed(2)} <span className="text-xs font-normal text-muted-foreground">/ {p.unit}</span>
                          </p>
                        </div>
                        <Button size="sm" onClick={() => addToCart(p)} className="shrink-0 gap-1">
                          <Plus className="h-4 w-4" /> Add
                        </Button>
                      </div>
                    ))}

                  </div>
                </div>
              ))}
            </div>

            {/* Cart + checkout */}
            <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
              <div className="rounded-xl border-2 border-border bg-card p-5">
                <div className="mb-3 flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5 text-primary" />
                  <h3 className="font-display text-lg font-bold">Your Order</h3>
                  <span className="ml-auto text-xs text-muted-foreground">{cart.length} line item(s)</span>
                </div>

                {cart.length === 0 ? (
                  <p className="py-6 text-center text-sm text-muted-foreground">No items yet. Add products from the list.</p>
                ) : (
                  <ul className="space-y-2.5">
                    {cart.map((ci) => {
                      const p = LEFLABS_PRODUCT_MAP[ci.id];
                      if (!p) return null;
                      return (
                        <li key={ci.id} className="flex items-center gap-2 rounded-lg bg-secondary/40 p-2">
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold">{p.name}</p>
                            <p className="font-mono text-xs text-muted-foreground">R{p.price.toFixed(2)} × {ci.quantity}</p>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button size="icon" variant="outline" className="h-7 w-7" onClick={() => updateQty(ci.id, -1)}>
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-6 text-center font-mono text-sm">{ci.quantity}</span>
                            <Button size="icon" variant="outline" className="h-7 w-7" onClick={() => updateQty(ci.id, 1)}>
                              <Plus className="h-3 w-3" />
                            </Button>
                            <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive" onClick={() => removeItem(ci.id)}>
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}

                <div className="mt-4 border-t border-border pt-3">
                  <div className="flex items-baseline justify-between">
                    <span className="text-sm text-muted-foreground">Subtotal</span>
                    <span className="font-mono text-lg font-bold">R{subtotal.toFixed(2)}</span>
                  </div>
                  <p className="mt-1 text-[11px] text-muted-foreground">Delivery arranged separately. Volume floors and minimums apply per tier — your rep confirms final pricing.</p>
                </div>
              </div>

              <div className="rounded-xl border-2 border-border bg-card p-5 space-y-3">
                <h3 className="font-display text-lg font-bold">B2B Details</h3>
                <div>
                  <Label htmlFor="business_name">Business name *</Label>
                  <Input id="business_name" value={form.business_name} maxLength={120}
                    onChange={(e) => setForm({ ...form, business_name: e.target.value })} />
                </div>
                <div>
                  <Label htmlFor="contact_name">Contact name *</Label>
                  <Input id="contact_name" value={form.contact_name} maxLength={100}
                    onChange={(e) => setForm({ ...form, contact_name: e.target.value })} />
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input id="email" type="email" value={form.email} maxLength={255}
                    onChange={(e) => setForm({ ...form, email: e.target.value })} />
                </div>
                <div>
                  <Label htmlFor="phone">Phone *</Label>
                  <Input id="phone" type="tel" value={form.phone} maxLength={25}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                </div>
                <div>
                  <Label htmlFor="delivery_address">Delivery address *</Label>
                  <Textarea id="delivery_address" value={form.delivery_address} maxLength={500} rows={3}
                    onChange={(e) => setForm({ ...form, delivery_address: e.target.value })} />
                </div>
                <div>
                  <Label htmlFor="notes">Order notes (optional)</Label>
                  <Textarea id="notes" value={form.notes} maxLength={300} rows={2}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })} />
                </div>

                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-widest text-muted-foreground">Payment method</Label>
                  <div className="rounded-lg border-2 border-primary bg-primary/5 p-3">
                    <p className="font-display text-sm font-bold">Direct EFT — Absa</p>
                    <p className="mt-0.5 text-[11px] text-muted-foreground">
                      Pay into the Lëf Labs Absa account using the reference we generate for your order.
                    </p>
                  </div>
                </div>

                <Button onClick={handleCheckout} disabled={submitting || cart.length === 0} className="w-full gap-2" size="lg">
                  {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
                  {submitting ? "Creating order…" : `Place R${subtotal.toFixed(2)} order (EFT)`}
                </Button>
                <p className="text-[11px] text-muted-foreground text-center">
                  We'll generate a unique reference for your Absa deposit.
                </p>
              </div>

              {/* EFT alternative — Lëf Labs banking details */}
              <div className="rounded-xl border-2 border-dashed border-border bg-card p-5">
                <div className="mb-3 flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-primary" />
                  <h3 className="font-display text-lg font-bold">Lëf Labs Banking Details</h3>
                </div>
                <p className="text-xs text-muted-foreground">
                  Place the order above to receive a unique reference. Use that reference (not the product name) when paying into the account below — it tells us which order to dispatch.
                </p>
                <dl className="mt-3 grid grid-cols-[120px_1fr] gap-y-1.5 text-sm">
                  <dt className="text-muted-foreground">Account name</dt>
                  <dd className="font-semibold">Lëf Labs</dd>
                  <dt className="text-muted-foreground">Bank</dt>
                  <dd className="font-semibold">Absa</dd>
                  <dt className="text-muted-foreground">Branch code</dt>
                  <dd className="font-mono font-semibold">632005</dd>
                  <dt className="text-muted-foreground">Account no.</dt>
                  <dd className="font-mono font-semibold">4078121856</dd>
                  <dt className="text-muted-foreground">Type</dt>
                  <dd className="font-semibold">Cheque</dd>
                  <dt className="text-muted-foreground">Reference</dt>
                  <dd className="font-semibold">Your <span className="font-mono text-primary">LEF-XXXXXXXXXX</span> order code</dd>
                </dl>
                <p className="mt-3 text-[11px] text-muted-foreground">
                  Orders ship once payment reflects (typically 1 business day for EFT).
                </p>
              </div>
            </aside>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}