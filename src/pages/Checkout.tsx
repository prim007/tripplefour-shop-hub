import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle, Clock, Truck, AlertTriangle } from "lucide-react";
import { Analytics } from "@/lib/analytics";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

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
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "" });
  const [zones, setZones] = useState<DeliveryZone[]>([]);
  const [selectedZone, setSelectedZone] = useState<DeliveryZone | null>(null);
  const [step, setStep] = useState<CheckoutStep>("details");
  const [orderId, setOrderId] = useState<string | null>(null);
  const [orderRef, setOrderRef] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);

  const deliveryFee = selectedZone?.fee ?? 0;
  const grandTotal = totalPrice + deliveryFee;

  // Fetch delivery zones
  useEffect(() => {
    supabase
      .from("delivery_zones")
      .select("*")
      .order("min_km", { ascending: true })
      .then(({ data }) => {
        if (data) setZones(data);
      });
  }, []);

  // Realtime: listen for payment confirmation
  useEffect(() => {
    if (!orderId || step !== "awaiting-payment") return;

    const channel = supabase
      .channel(`order-${orderId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "orders",
          filter: `id=eq.${orderId}`,
        },
        (payload) => {
          const updated = payload.new as any;
          if (updated.payment_status === "confirmed") {
            setStep("confirmed");
            clearCart();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [orderId, step, clearCart]);

  if (items.length === 0 && step === "details") {
    navigate("/cart");
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

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

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({ title: "Invalid email", description: "Please enter a valid email address.", variant: "destructive" });
      return;
    }

    // Validate phone (SA format, digits and spaces only)
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

    setSubmitting(true);
    const ref = `TF-${Date.now().toString(36).toUpperCase()}`;

    const orderItems = items.map((i) => ({
      id: i.product.id,
      name: i.product.name,
      price: i.product.price,
      quantity: i.quantity,
    }));

    const { data, error } = await supabase
      .from("orders")
      .insert({
        order_ref: ref,
        customer_name: name,
        customer_email: email,
        customer_phone: phone,
        delivery_address: address,
        delivery_zone_id: selectedZone.id,
        delivery_fee: deliveryFee,
        subtotal: totalPrice,
        total: grandTotal,
        items: orderItems,
        payment_method: "eft",
        payment_status: "pending",
        status: "pending",
      })
      .select()
      .single();

    if (error) {
      toast({ title: "Error", description: "Failed to place order. Please try again.", variant: "destructive" });
      setSubmitting(false);
      return;
    }

    setOrderId(data.id);
    setOrderRef(ref);
    setStep("awaiting-payment");
    setSubmitting(false);
    Analytics.beginCheckout(grandTotal);
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
                <div className="flex justify-between"><span className="text-muted-foreground">Delivery ({selectedZone?.zone_name})</span><span>R{deliveryFee.toLocaleString()}</span></div>
                <Separator className="my-2" />
                <div className="flex justify-between font-bold text-base"><span>Total to Pay</span><span className="text-primary">R{grandTotal.toLocaleString()}</span></div>
              </div>
            </div>

            <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 space-y-2">
              <h4 className="text-sm font-semibold text-destructive flex items-center gap-1.5">⚠️ Important</h4>
              <ul className="text-xs text-muted-foreground space-y-1 list-disc pl-4">
                <li>Use <strong>{orderRef}</strong> as your payment reference</li>
                <li>Payment must be made immediately — orders without payment will NOT be processed</li>
                <li>This page will update automatically once payment is confirmed</li>
              </ul>
            </div>

            <Button asChild variant="outline" className="w-full">
              <a href={`https://wa.me/27645436734?text=${encodeURIComponent(`Hi, I just placed order ${orderRef} and made payment of R${grandTotal}`)}`} target="_blank" rel="noopener noreferrer">
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
                    <p className="mt-1 text-xs text-muted-foreground">{zone.min_km} – {zone.max_km} km from CBD</p>
                    <p className="mt-1 text-sm font-bold text-primary">R{zone.fee.toLocaleString()}</p>
                  </button>
                ))}
              </div>

              <Button type="submit" size="lg" className="w-full" disabled={submitting || !selectedZone}>
                {!selectedZone ? "Select a delivery zone to continue" : `Place Order — R${grandTotal.toLocaleString()}`}
              </Button>
            </div>

            {/* Order Summary Sidebar */}
            <div className="rounded-xl border bg-card p-5">
              <h2 className="font-display text-lg font-semibold">Order Summary</h2>
              <div className="mt-4 space-y-3">
                {items.map((item) => (
                  <div key={item.product.id} className="flex justify-between text-sm">
                    <span>{item.quantity}x {item.product.name}</span>
                    <span className="font-medium">R{(item.product.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <Separator className="my-3" />
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>R{totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Delivery</span>
                  <span>{selectedZone ? `R${deliveryFee.toLocaleString()}` : "—"}</span>
                </div>
              </div>
              <Separator className="my-3" />
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span className="text-primary">R{grandTotal.toLocaleString()}</span>
              </div>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
