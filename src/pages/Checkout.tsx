import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle, Clock, Truck, AlertTriangle, Tag, Loader2, Shield, Heart, Download } from "lucide-react";
import { downloadInvoicePdf, type InvoiceItem } from "@/lib/invoicePdf";
import { Analytics } from "@/lib/analytics";
import { AGE_TOKEN_KEY } from "@/lib/age-verification";
import { trackFunnel } from "@/lib/funnel";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getStoredAffiliateCode } from "@/lib/affiliate";
import { saveAbandonedCart, markCartOrdered } from "@/lib/abandonedCart";

// Client-side promo lookup for optimistic UI. The server (create-order)
// re-validates the code and re-computes the discount — this table is display
// only and cannot grant a discount the server won't honor.
const PROMO_CODES: Record<string, number> = {
  WELCOME5: 5,
  WELCOME10: 5,
};
const validatePromo = async (code: string) => {
  const key = code.trim().toUpperCase();
  const pct = PROMO_CODES[key];
  if (!pct) {
    return { valid: false, error: "Invalid promo code.", discount_percent: 0 };
  }
  return { valid: true, error: "", discount_percent: pct };
};

// Keep in sync with create-order edge function.
const FREE_SHIPPING_THRESHOLD = 1200;

interface DeliveryZone {
  id: string;
  zone_name: string;
  min_km: number;
  max_km: number;
  fee: number;
}

type CheckoutStep = "details" | "awaiting-payment" | "confirmed";

export default function Checkout() {
  const { items, totalPrice, clearCart } = useCart();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "" });
  const [zones, setZones] = useState<DeliveryZone[]>([]);
  const [zonesState, setZonesState] = useState<"loading" | "ready" | "empty" | "error">("loading");
  const [zonesReload, setZonesReload] = useState(0);
  const [selectedZone, setSelectedZone] = useState<DeliveryZone | null>(null);
  const [step, setStep] = useState<CheckoutStep>("details");
  const [orderId, setOrderId] = useState<string | null>(null);
  const [orderRef, setOrderRef] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoValidating, setPromoValidating] = useState(false);
  const [promoError, setPromoError] = useState("");
  const [serverTotal, setServerTotal] = useState<number | null>(null);
  const [serverDiscount, setServerDiscount] = useState(0);
  const [serverDeliveryFee, setServerDeliveryFee] = useState<number | null>(null);
  const [deliveryZoneName, setDeliveryZoneName] = useState("");
  const [statusToken, setStatusToken] = useState("");
  const [affiliateCode, setAffiliateCode] = useState("");
  // Snapshot of the ordered items so the invoice still works after the cart clears
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([]);
  const [invoiceSubtotal, setInvoiceSubtotal] = useState(0);
  const [downloadingInvoice, setDownloadingInvoice] = useState(false);

  // Pre-fill affiliate code from stored ?ref= URL param
  useEffect(() => {
    const stored = getStoredAffiliateCode();
    if (stored) setAffiliateCode(stored);
  }, []);

  // Abandoned-cart capture: debounced upsert while user is filling details
  useEffect(() => {
    if (!user || step !== "details") return;
    if (items.length === 0) return;
    if (!form.email.trim()) return;
    const t = window.setTimeout(() => {
      saveAbandonedCart({
        userId: user.id,
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        items: items.map((i) => ({
          id: i.product.id,
          name: i.product.name,
          quantity: i.quantity,
          price: i.product.price,
        })),
        subtotal: totalPrice,
      });
    }, 1500);
    return () => window.clearTimeout(t);
  }, [user, step, form.name, form.email, form.phone, items, totalPrice]);

  const discountAmount = Math.round(totalPrice * (promoDiscount / 100));
  const subtotalAfterDiscount = totalPrice - discountAmount;
  const rawDeliveryFee = selectedZone?.fee ?? 0;
  const deliveryFee = subtotalAfterDiscount >= FREE_SHIPPING_THRESHOLD ? 0 : rawDeliveryFee;
  const grandTotal = subtotalAfterDiscount + deliveryFee;
  // Delivery pricing is server data — never silently fall back to R0.
  const deliveryUnavailable = zonesState !== "ready" || !selectedZone;

  // GA4 items[] payload built from the cart
  const gaItems = items.map((it) => ({
    item_id: it.product.id,
    item_name: it.product.name,
    item_category: it.product.category,
    price: it.product.price,
    quantity: it.quantity,
  }));

  // Fire add_shipping_info when delivery zone is selected
  useEffect(() => {
    if (!selectedZone || items.length === 0) return;
    Analytics.addShippingInfo(gaItems, selectedZone.zone_name, grandTotal);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedZone?.id]);

  // Pre-fill email from auth
  useEffect(() => {
    if (user?.email && !form.email) {
      setForm((prev) => ({ ...prev, email: user.email! }));
    }
  }, [user]);


  useEffect(() => {
    let cancelled = false;
    setZonesState("loading");
    supabase
      .from("delivery_zones")
      .select("*")
      .order("min_km", { ascending: true })
      .then(({ data, error }) => {
        if (cancelled) return;
        if (error) {
          console.error("Failed to load delivery zones:", error);
          setZones([]);
          setSelectedZone(null);
          setZonesState("error");
          return;
        }
        const rows = data ?? [];
        setZones(rows);
        if (rows.length === 0) {
          setSelectedZone(null);
          setZonesState("empty");
          return;
        }
        setSelectedZone((prev) => prev ?? rows[0]);
        setZonesState("ready");
      });
    return () => {
      cancelled = true;
    };
  }, [zonesReload]);

  // Poll payment status through token-protected edge function
  useEffect(() => {
    if (!orderId || !orderRef || !statusToken || step !== "awaiting-payment") return;

    const interval = setInterval(async () => {
      try {
        const { data, error } = await supabase.functions.invoke("get-order-status", {
          body: {
            order_ref: orderRef,
            status_token: statusToken,
          },
        });

        if (!error && data?.payment_status === "confirmed") {
          setStep("confirmed");
          clearCart();
          Analytics.purchase(orderRef, serverTotal || grandTotal, gaItems, {
            shipping: serverDeliveryFee ?? deliveryFee,
            coupon: promoApplied ? promoCode : undefined,
          });
          trackFunnel("purchase", undefined, { order_ref: orderRef, total: serverTotal || grandTotal });
        }
      } catch (e) {
        console.error("Poll error:", e);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [orderId, orderRef, statusToken, step, clearCart, serverTotal, grandTotal]);

  // Redirect to auth if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth?redirect=/checkout", { replace: true });
    }
  }, [authLoading, user, navigate]);

  if (authLoading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex flex-1 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!user) return null;

  if (items.length === 0 && step === "details") {
    navigate("/cart");
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleApplyPromo = async () => {
    const code = promoCode.trim();
    if (!code) return;
    setPromoValidating(true);
    setPromoError("");
    try {
      const result = await validatePromo(code);
      if (result.valid) {
        setPromoDiscount(result.discount_percent);
        setPromoApplied(true);
        Analytics.promoCodeApplied(code, result.discount_percent);
        toast({ title: "Promo applied!", description: `${result.discount_percent}% discount applied.` });
      } else {
        setPromoError(result.error || "Invalid promo code");
        setPromoDiscount(0);
        setPromoApplied(false);
      }
    } catch {
      setPromoError("Failed to validate promo code");
    } finally {
      setPromoValidating(false);
    }
  };

  const handleRemovePromo = () => {
    setPromoCode("");
    setPromoDiscount(0);
    setPromoApplied(false);
    setPromoError("");
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const name = form.name.trim();
    const email = form.email.trim();
    const phone = form.phone.trim();
    const address = form.address.trim();

    if (!name || !email || !phone || !address) {
      toast({ title: "Missing fields", description: "Please fill in all fields.", variant: "destructive" });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({ title: "Invalid email", description: "Please enter a valid email address.", variant: "destructive" });
      return;
    }

    const phoneClean = phone.replace(/[\s\-()]/g, "");
    if (!/^\+?\d{9,15}$/.test(phoneClean)) {
      toast({ title: "Invalid phone", description: "Please enter a valid phone number.", variant: "destructive" });
      return;
    }

    if (name.length > 100 || email.length > 255 || address.length > 300) {
      toast({ title: "Input too long", description: "Please shorten your inputs.", variant: "destructive" });
      return;
    }

    if (zonesState === "error" || zonesState === "empty") {
      toast({
        title: "Checkout unavailable",
        description: "Delivery pricing could not be loaded, so we can't place your order. Please retry in a moment.",
        variant: "destructive",
      });
      return;
    }

    if (!selectedZone) {
      toast({ title: "Select delivery zone", description: "Please select your delivery area.", variant: "destructive" });
      return;
    }

    const ageToken = localStorage.getItem(AGE_TOKEN_KEY);
    if (!ageToken) {
      toast({
        title: "Age verification required",
        description: "Please complete age verification before placing an order.",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);

    const orderItems = items.map((i) => ({
      id: i.product.id,
      name: i.product.name,
      quantity: i.quantity,
    }));

    try {
      // Create order via server-side edge function (prices + age token validated server-side)
      const { data: result, error } = await supabase.functions.invoke("create-order", {
        body: {
          customer_name: name,
          customer_email: email,
          customer_phone: phone,
          delivery_address: address,
          delivery_zone_id: selectedZone.id,
          items: orderItems,
          promo_code: promoApplied ? promoCode.trim() : undefined,
          age_token: ageToken,
          affiliate_code: affiliateCode.trim() || undefined,
        },
      });

      if (error || !result?.id) {
        toast({ title: "Error", description: result?.error || "Failed to place order. Please try again.", variant: "destructive" });
        setSubmitting(false);
        return;
      }

      setOrderId(result.id);
      setOrderRef(result.order_ref);
      setServerTotal(result.total);
      setServerDiscount(result.discount || 0);
      setServerDeliveryFee(result.delivery_fee ?? null);
      setDeliveryZoneName(result.delivery_zone_name || selectedZone.zone_name);
      setStatusToken(result.status_token || "");
      setInvoiceItems(
        items.map((i) => ({ name: i.product.name, quantity: i.quantity, price: i.product.price })),
      );
      setInvoiceSubtotal(totalPrice);
      Analytics.beginCheckout(gaItems, result.total, promoApplied ? promoCode : undefined);
      Analytics.addPaymentInfo(gaItems, "eft_or_payfast", result.total);
      trackFunnel("begin_checkout", undefined, { total: result.total, method: "eft", items: items.length });

      setStep("awaiting-payment");
      setSubmitting(false);
      // Mark this user's abandoned-cart row as ordered so it drops off the recovery list
      if (user) markCartOrdered(user.id).catch(() => {});
    } catch (err) {
      console.error("Order submission error:", err);
      toast({ title: "Error", description: "Failed to place order. Please try again.", variant: "destructive" });
      setSubmitting(false);
    }
  };

  const displayTotal = serverTotal ?? grandTotal;
  const displayDiscount = serverTotal ? serverDiscount : discountAmount;
  const displayDeliveryFee = serverDeliveryFee ?? deliveryFee;

  const handleDownloadInvoice = async (status: "unpaid" | "paid") => {
    setDownloadingInvoice(true);
    try {
      const filename = await downloadInvoicePdf({
        orderRef,
        date: new Date(),
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        status,
        customerName: form.name.trim(),
        customerEmail: form.email.trim(),
        customerPhone: form.phone.trim(),
        deliveryAddress: form.address.trim(),
        deliveryZoneName: deliveryZoneName || selectedZone?.zone_name || null,
        items: invoiceItems,
        subtotal: invoiceSubtotal,
        discount: displayDiscount,
        deliveryFee: displayDeliveryFee,
        total: displayTotal,
      });
      toast({ title: "Invoice ready", description: filename });
    } catch (err) {
      console.error("Invoice generation failed", err);
      toast({
        title: "Could not generate invoice",
        description: "Please try again in a moment.",
        variant: "destructive",
      });
    }
    setDownloadingInvoice(false);
  };

  // Step: Payment confirmed
  if (step === "confirmed") {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex flex-1 items-center justify-center px-4 py-16">
          <div className="mx-auto max-w-lg text-center space-y-6">
            <CheckCircle className="mx-auto h-16 w-16 text-primary" />
            <h1 className="font-display text-3xl font-bold">Payment Received!</h1>
            <p className="text-muted-foreground">
              Your payment for order <strong className="font-mono text-foreground">{orderRef}</strong> has been confirmed.
            </p>
            <div className="rounded-xl border-2 border-primary/30 bg-primary/5 p-6 text-left space-y-3">
              <div className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-primary" />
                <h2 className="font-display text-lg font-semibold">Delivery Information</h2>
              </div>
              <p className="text-sm text-muted-foreground">
                Expect delivery in the next <strong className="text-foreground">24 – 48 hours</strong>.
              </p>
              <div className="rounded-lg border border-accent/30 bg-accent/5 p-3 space-y-2">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-accent mt-0.5 shrink-0" />
                  <p className="text-xs text-muted-foreground">
                    If you are not going to be around, please have another person on standby to receive the delivery on your behalf.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                onClick={() => handleDownloadInvoice("paid")}
                size="lg"
                variant="outline"
                disabled={downloadingInvoice}
                className="w-full gap-2"
              >
                <Download className="h-4 w-4" />
                {downloadingInvoice ? "Preparing…" : "Download invoice (PDF)"}
              </Button>
              <Button onClick={() => navigate("/shop")} size="lg" className="w-full">
                Continue Shopping
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Step: Awaiting payment
  if (step === "awaiting-payment") {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex flex-1 items-center justify-center px-4 py-16">
          <div className="mx-auto max-w-lg space-y-6">
            <div className="text-center space-y-3">
              <Clock className="mx-auto h-14 w-14 text-accent animate-pulse" />
              <h1 className="font-display text-3xl font-bold">Awaiting Payment</h1>
              <p className="text-muted-foreground">
                Please make your EFT payment using the details below. Once we confirm your payment, this page will automatically update.
              </p>
            </div>

            <div className="rounded-xl border bg-card p-5 space-y-3">
              <h2 className="font-display text-base font-semibold">Order Reference</h2>
              <p className="font-mono text-xl font-bold text-primary text-center">{orderRef}</p>
            </div>

            <div className="rounded-xl border-2 border-primary/30 bg-primary/5 p-5 space-y-3">
              <h3 className="font-display text-base font-semibold flex items-center gap-2">
                🏦 FNB Banking Details
              </h3>
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Bank</span><span className="font-medium">FNB</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Account Holder</span><span className="font-medium">P.M</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Account Type</span><span className="font-medium">Savings</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Account Number</span><span className="font-mono font-bold">63203398862</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Branch Code</span><span className="font-medium">250 655</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Reference</span><span className="font-bold text-primary">{orderRef}</span></div>
              </div>
            </div>

            <div className="rounded-xl border bg-card p-5">
              <h3 className="font-display text-base font-semibold">Payment Summary</h3>
              <div className="mt-3 space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>R{totalPrice.toLocaleString()}</span></div>
                {displayDiscount > 0 && (
                  <div className="flex justify-between text-primary">
                    <span>Discount</span>
                    <span>-R{displayDiscount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between"><span className="text-muted-foreground">Delivery ({deliveryZoneName || selectedZone?.zone_name})</span><span>R{displayDeliveryFee.toLocaleString()}</span></div>
                <Separator className="my-2" />
                <div className="flex justify-between font-bold text-base"><span>Total to Pay</span><span className="text-primary">R{displayTotal.toLocaleString()}</span></div>
              </div>
            </div>

            <div className="rounded-xl border-2 border-green-500/30 bg-green-500/5 p-4 space-y-2">
              <h4 className="text-sm font-semibold text-green-700 dark:text-green-400 flex items-center gap-1.5">⚡ Immediate Processing</h4>
              <p className="text-sm text-muted-foreground">
                Orders paid <strong className="text-foreground">immediately</strong> will be <strong className="text-foreground">processed immediately</strong> — expect delivery within <strong className="text-foreground">24–48 hours</strong>.
              </p>
            </div>

            <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 space-y-2">
              <h4 className="text-sm font-semibold text-destructive flex items-center gap-1.5">⚠️ Important</h4>
              <ul className="text-xs text-muted-foreground space-y-1 list-disc pl-4">
                <li>Use <strong>{orderRef}</strong> as your payment reference</li>
                <li>Payment must be made immediately — orders without payment will <strong>NOT</strong> be processed</li>
                <li>This page will update automatically once payment is confirmed</li>
              </ul>
            </div>

            <Button
              onClick={() => handleDownloadInvoice("unpaid")}
              disabled={downloadingInvoice}
              className="w-full gap-2"
              size="lg"
            >
              <Download className="h-4 w-4" />
              {downloadingInvoice ? "Preparing invoice…" : "Download invoice (PDF)"}
            </Button>

            <Button asChild variant="outline" className="w-full">
              <a href={`https://wa.me/27645436734?text=${encodeURIComponent(`Hi, I just placed order ${orderRef} and made payment of R${displayTotal}`)}`} target="_blank" rel="noopener noreferrer">
                Notify us on WhatsApp
              </a>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Step: Fill in details
  return (
    <div className="flex min-h-screen flex-col">
      <Helmet>
        <title>Checkout | Tripplefour</title>
        <meta name="description" content="Complete your Tripplefour order — fast nationwide delivery." />
        <link rel="canonical" href="https://tripplefourshophub.online/checkout" />
        <meta name="robots" content="noindex, follow" />
        <meta property="og:title" content="Checkout | Tripplefour" />
        <meta property="og:description" content="Complete your Tripplefour order." />
        <meta property="og:url" content="https://tripplefourshophub.online/checkout" />
      </Helmet>
      <Navbar />
      <main className="flex-1 px-4 py-8">
        <div className="mx-auto max-w-5xl">
          <h1 className="font-display text-3xl font-bold">Checkout</h1>

          <form onSubmit={handleSubmitOrder} className="mt-8 grid gap-8 md:grid-cols-3">
            <div className="space-y-5 md:col-span-2">
              <h2 className="font-display text-lg font-semibold">Your Details</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" name="name" value={form.name} onChange={handleChange} placeholder="John Doe" required maxLength={100} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="john@example.com" required maxLength={255} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" name="phone" value={form.phone} onChange={handleChange} placeholder="072 123 4567" required maxLength={20} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Delivery Address</Label>
                  <Input id="address" name="address" value={form.address} onChange={handleChange} placeholder="123 Main St, Joburg" required maxLength={300} />
                </div>
              </div>

              <Separator />

              <h2 className="font-display text-lg font-semibold">Delivery Zone</h2>
              <p className="text-sm text-muted-foreground">Select the area closest to your delivery address. Delivery fee is calculated based on distance from Joburg CBD.</p>
              {zonesState === "loading" && (
                <div className="flex items-center gap-2 rounded-xl border-2 border-dashed border-border p-4 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" /> Loading delivery zones…
                </div>
              )}

              {(zonesState === "error" || zonesState === "empty") && (
                <div className="rounded-xl border-2 border-destructive/40 bg-destructive/5 p-4 space-y-2">
                  <p className="flex items-center gap-2 font-semibold text-destructive">
                    <AlertTriangle className="h-4 w-4" />
                    {zonesState === "error" ? "Delivery options unavailable" : "No delivery zones are currently active"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {zonesState === "error"
                      ? "We couldn't load delivery pricing, so we can't quote your order right now. Please retry — orders cannot be placed without a confirmed delivery fee."
                      : "Delivery is temporarily closed. Please try again later or contact support on WhatsApp."}
                  </p>
                  <Button type="button" variant="outline" size="sm" onClick={() => setZonesReload((n) => n + 1)}>
                    Retry
                  </Button>
                </div>
              )}

              {zonesState === "ready" && (
                <div className="grid gap-3 sm:grid-cols-2">
                  {zones.map((zone) => (
                    <button
                      key={zone.id}
                      type="button"
                      onClick={() => setSelectedZone(zone)}
                      className={`rounded-xl border-2 p-4 text-left transition-colors ${
                        selectedZone?.id === zone.id ? "border-primary bg-primary/5" : "border-border"
                      }`}
                    >
                      <p className="font-semibold">{zone.zone_name}</p>
                      <p className="text-sm text-muted-foreground">{zone.min_km}–{zone.max_km} km</p>
                      <p className="mt-1 font-bold text-primary">R{zone.fee}</p>
                    </button>
                  ))}
                </div>
              )}

              <Separator />

              {/* Payment Method */}
              <div className="space-y-3">
                <h2 className="font-display text-lg font-semibold flex items-center gap-2">
                  <Shield className="h-5 w-5" /> Payment Method
                </h2>
                <div className="rounded-xl border-2 border-primary bg-primary/5 p-4">
                  <p className="font-semibold">🏦 Manual EFT</p>
                  <p className="text-xs text-muted-foreground">Direct bank transfer to FNB. Banking details will be shown after placing your order.</p>
                </div>
              </div>

              <Separator />

              {/* Promo Code Section */}
              <div className="space-y-3">
                <h2 className="font-display text-lg font-semibold flex items-center gap-2">
                  <Tag className="h-5 w-5" /> Promo Code
                </h2>
                {promoApplied ? (
                  <div className="flex items-center gap-3 rounded-lg border border-primary/30 bg-primary/5 px-4 py-3">
                    <CheckCircle className="h-5 w-5 text-primary shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-primary">{promoDiscount}% discount applied</p>
                      <p className="text-xs text-muted-foreground">Code: {promoCode}</p>
                    </div>
                    <Button type="button" variant="ghost" size="sm" onClick={handleRemovePromo}>Remove</Button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Input
                      value={promoCode}
                      onChange={(e) => { setPromoCode(e.target.value); setPromoError(""); }}
                      placeholder="Enter promo code"
                      maxLength={30}
                    />
                    <Button type="button" variant="outline" onClick={handleApplyPromo} disabled={promoValidating || !promoCode.trim()}>
                      {promoValidating ? <Loader2 className="h-4 w-4 animate-spin" /> : "Apply"}
                    </Button>
                  </div>
                )}
                {promoError && <p className="text-sm text-destructive">{promoError}</p>}
              </div>

              <Separator />

              {/* Affiliate / Creator Code */}
              <div className="space-y-3">
                <h2 className="font-display text-lg font-semibold flex items-center gap-2">
                  <Heart className="h-5 w-5 text-primary" /> Creator / Affiliate Code <span className="text-xs font-normal text-muted-foreground">(optional)</span>
                </h2>
                <p className="text-xs text-muted-foreground">
                  Heard about us from a creator? Drop their code so they get credit for your order. ❤️
                </p>
                <Input
                  value={affiliateCode}
                  onChange={(e) => setAffiliateCode(e.target.value.toUpperCase().slice(0, 32))}
                  placeholder="e.g. CANNYQUEEN"
                  maxLength={32}
                  className="font-mono uppercase"
                />
              </div>
            </div>

            {/* Order Summary */}
            <div className="space-y-4">
              <div className="rounded-xl border bg-card p-5 space-y-4 sticky top-24">
                <h2 className="font-display text-lg font-semibold">Order Summary</h2>
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex justify-between text-sm">
                      <span>{item.product.name} × {item.quantity}</span>
                      <span className="font-medium">R{(item.product.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
                <Separator />
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>R{totalPrice.toLocaleString()}</span></div>
                  {promoApplied && discountAmount > 0 && (
                    <div className="flex justify-between text-primary">
                      <span>Discount ({promoDiscount}%)</span>
                      <span>-R{discountAmount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Delivery</span>
                    {deliveryUnavailable ? (
                      <span className="text-destructive">Unavailable</span>
                    ) : (
                      <span>R{deliveryFee.toLocaleString()}</span>
                    )}
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-base">
                    <span>Total</span>
                    {deliveryUnavailable ? (
                      <span className="text-destructive text-sm">Cannot be quoted</span>
                    ) : (
                      <span className="text-primary">R{grandTotal.toLocaleString()}</span>
                    )}
                  </div>
                </div>
                <Button type="submit" className="w-full" size="lg" disabled={submitting || deliveryUnavailable}>
                  {submitting ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Placing Order...</>
                  ) : deliveryUnavailable ? (
                    <><AlertTriangle className="mr-2 h-4 w-4" /> Checkout unavailable</>
                  ) : (
                    <><Shield className="mr-2 h-4 w-4" /> Place Order</>
                  )}
                </Button>
                {deliveryUnavailable && (
                  <p className="text-xs text-center text-destructive">
                    {zonesState === "loading"
                      ? "Loading delivery pricing…"
                      : zonesState === "ready"
                        ? "Select a delivery zone to continue."
                        : "We can't confirm your delivery fee, so checkout is paused. Retry above."}
                  </p>
                )}
                <p className="text-xs text-center text-muted-foreground">Prices verified server-side for your protection</p>
              </div>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
