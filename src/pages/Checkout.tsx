import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle, Clock, Truck, AlertTriangle, Tag, Loader2, Shield } from "lucide-react";
import { Analytics } from "@/lib/analytics";
import { AGE_TOKEN_KEY } from "@/lib/age-verification";
import { trackFunnel } from "@/lib/funnel";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const PROMO_URL = "https://rcigcarkcpinnniddxcm.supabase.co/functions/v1/validate-promo-code";

const validatePromo = async (code: string) => {
  const res = await fetch(PROMO_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code, action: "validate" }),
  });
  return res.json();
};

interface DeliveryZone {
  id: string;
  zone_name: string;
  min_km: number;
  max_km: number;
  fee: number;
}

type CheckoutStep = "details" | "awaiting-payment" | "redirecting-payfast" | "confirmed";

export default function Checkout() {
  const { items, totalPrice, clearCart } = useCart();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "" });
  const [zones, setZones] = useState<DeliveryZone[]>([]);
  const [selectedZone, setSelectedZone] = useState<DeliveryZone | null>(null);
  const [step, setStep] = useState<CheckoutStep>("details");
  const [orderId, setOrderId] = useState<string | null>(null);
  const [orderRef, setOrderRef] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"payfast" | "eft">("payfast");
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

  const discountAmount = Math.round(totalPrice * (promoDiscount / 100));
  const deliveryFee = selectedZone?.fee ?? 0;
  const grandTotal = totalPrice - discountAmount + deliveryFee;

  // Pre-fill email from auth
  useEffect(() => {
    if (user?.email && !form.email) {
      setForm((prev) => ({ ...prev, email: user.email! }));
    }
  }, [user]);


  useEffect(() => {
    supabase
      .from("delivery_zones")
      .select("*")
      .order("min_km", { ascending: true })
      .then(({ data }) => {
        if (data) {
          setZones(data);
          if (data.length > 0 && !selectedZone) {
            setSelectedZone(data[0]);
          }
        }
      });
  }, []);

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
          Analytics.purchase(orderRef, serverTotal || grandTotal);
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
      Analytics.beginCheckout(result.total);
      trackFunnel("begin_checkout", undefined, { total: result.total, method: paymentMethod, items: items.length });

      if (paymentMethod === "payfast") {
        // Redirect to Payfast
        setStep("redirecting-payfast");
        try {
          const { data: pfData, error: pfError } = await supabase.functions.invoke("payfast-payment", {
            body: { order_id: result.id },
          });

          if (pfError || !pfData?.payfast_url) {
            toast({ title: "Payment error", description: "Failed to initiate payment. Please try EFT instead.", variant: "destructive" });
            setStep("awaiting-payment");
            setSubmitting(false);
            return;
          }

          // Create and submit a form to Payfast
          const form = document.createElement("form");
          form.method = "POST";
          form.action = pfData.payfast_url;
          for (const [key, value] of Object.entries(pfData.payfast_data)) {
            const input = document.createElement("input");
            input.type = "hidden";
            input.name = key;
            input.value = value as string;
            form.appendChild(input);
          }
          document.body.appendChild(form);
          form.submit();
          return;
        } catch {
          toast({ title: "Payment error", description: "Failed to redirect to payment. Falling back to EFT.", variant: "destructive" });
          setStep("awaiting-payment");
          setSubmitting(false);
          return;
        }
      }

      setStep("awaiting-payment");
      setSubmitting(false);
    } catch (err) {
      console.error("Order submission error:", err);
      toast({ title: "Error", description: "Failed to place order. Please try again.", variant: "destructive" });
      setSubmitting(false);
    }
  };

  const displayTotal = serverTotal ?? grandTotal;
  const displayDiscount = serverTotal ? serverDiscount : discountAmount;
  const displayDeliveryFee = serverDeliveryFee ?? deliveryFee;

  // Step: Redirecting to Payfast
  if (step === "redirecting-payfast") {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex flex-1 items-center justify-center px-4 py-16">
          <div className="mx-auto max-w-lg text-center space-y-6">
            <Loader2 className="mx-auto h-16 w-16 text-primary animate-spin" />
            <h1 className="font-display text-3xl font-bold">Redirecting to Payment...</h1>
            <p className="text-muted-foreground">
              You're being redirected to Payfast to complete your payment securely.
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

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
            <Button onClick={() => navigate("/shop")} size="lg" className="w-full">
              Continue Shopping
            </Button>
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
                <div className="flex justify-between"><span className="text-muted-foreground">Bank</span><span className="font-medium">FNB / RMB</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Account Holder</span><span className="font-medium">TRIPPLE444 (Pty) Ltd</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Account Type</span><span className="font-medium">Gold Business Account</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Account Number</span><span className="font-mono font-bold">631 827 73870</span></div>
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

              <Separator />

              {/* Payment Method */}
              <div className="space-y-3">
                <h2 className="font-display text-lg font-semibold flex items-center gap-2">
                  <Shield className="h-5 w-5" /> Payment Method
                </h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("payfast")}
                    className={`rounded-xl border-2 p-4 text-left transition-colors ${
                      paymentMethod === "payfast" ? "border-primary bg-primary/5" : "border-border"
                    }`}
                  >
                    <p className="font-semibold">💳 Payfast</p>
                    <p className="text-xs text-muted-foreground">Card, EFT, SnapScan, Mobicred</p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("eft")}
                    className={`rounded-xl border-2 p-4 text-left transition-colors ${
                      paymentMethod === "eft" ? "border-primary bg-primary/5" : "border-border"
                    }`}
                  >
                    <p className="font-semibold">🏦 Manual EFT</p>
                    <p className="text-xs text-muted-foreground">Direct bank transfer to FNB</p>
                  </button>
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
                  <div className="flex justify-between"><span className="text-muted-foreground">Delivery</span><span>R{deliveryFee.toLocaleString()}</span></div>
                  <Separator />
                  <div className="flex justify-between font-bold text-base"><span>Total</span><span className="text-primary">R{grandTotal.toLocaleString()}</span></div>
                </div>
                <Button type="submit" className="w-full" size="lg" disabled={submitting}>
                  {submitting ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Placing Order...</>
                  ) : (
                    <><Shield className="mr-2 h-4 w-4" /> Place Order</>
                  )}
                </Button>
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
