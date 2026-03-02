import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

type PaymentMethod = "eft" | "fnb-pay";

export default function Checkout() {
  const { items, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [payment, setPayment] = useState<PaymentMethod>("eft");
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "" });
  const [submitting, setSubmitting] = useState(false);

  if (items.length === 0) {
    navigate("/cart");
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.phone.trim() || !form.address.trim()) {
      toast({ title: "Missing fields", description: "Please fill in all fields.", variant: "destructive" });
      return;
    }
    setSubmitting(true);

    const orderRef = `TF-${Date.now().toString(36).toUpperCase()}`;

    // Build mailto for email notification
    const orderLines = items.map((i) => `${i.quantity}x ${i.product.name} - R${(i.product.price * i.quantity).toLocaleString()}`).join("\n");
    const body = `New Order: ${orderRef}\n\nCustomer: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone}\nAddress: ${form.address}\n\nItems:\n${orderLines}\n\nTotal: R${totalPrice.toLocaleString()}\nPayment: ${payment === "eft" ? "Manual EFT" : "FNB Pay"}`;

    // Open mailto (will open user's email client)
    const mailtoLink = `mailto:?subject=${encodeURIComponent(`Tripplefour Order ${orderRef}`)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoLink, "_blank");

    clearCart();
    navigate(`/order-confirmation?ref=${orderRef}&payment=${payment}`);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 px-4 py-8">
        <div className="mx-auto max-w-5xl">
          <h1 className="font-display text-3xl font-bold">Checkout</h1>

          <form onSubmit={handleSubmit} className="mt-8 grid gap-8 md:grid-cols-3">
            {/* Customer Details */}
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

              <h2 className="font-display text-lg font-semibold">Payment Method</h2>
              <div className="grid gap-3 sm:grid-cols-2">
              <button
                  type="button"
                  onClick={() => setPayment("eft")}
                  className={`rounded-xl border-2 p-4 text-left transition-colors ${payment === "eft" ? "border-primary bg-primary/5" : "border-border"}`}
                >
                  <p className="font-semibold">Manual EFT / Bank Transfer</p>
                  <p className="mt-1 text-xs text-muted-foreground">Pay directly into our FNB Gold Business Account</p>
                </button>
                <button
                  type="button"
                  onClick={() => setPayment("fnb-pay")}
                  className={`rounded-xl border-2 p-4 text-left transition-colors ${payment === "fnb-pay" ? "border-primary bg-primary/5" : "border-border"}`}
                >
                  <p className="font-semibold">FNB Pay</p>
                  <p className="mt-1 text-xs text-muted-foreground">Pay online via FNB payment gateway</p>
                </button>
              </div>

              {payment === "eft" && (
                <div className="rounded-xl border-2 border-primary/30 bg-primary/5 p-5 space-y-3">
                  <h3 className="font-display text-base font-semibold flex items-center gap-2">
                    🏦 FNB Banking Details
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Transfer the total amount below and use your <strong>order reference</strong> (shown after placing your order) as the payment reference.
                  </p>
                  <div className="space-y-1.5 text-sm">
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
                  </div>

                  <div className="mt-3 rounded-lg border border-destructive/30 bg-destructive/5 p-3 space-y-2">
                    <h4 className="text-sm font-semibold text-destructive flex items-center gap-1.5">
                      ⚠️ Important Payment Instructions
                    </h4>
                    <ul className="text-xs text-muted-foreground space-y-1 list-disc pl-4">
                      <li>Include your <strong>full name</strong> and <strong>exact delivery location</strong> as payment reference</li>
                      <li>A <strong>delivery fee of R50 – R100</strong> will be added depending on your location</li>
                      <li>Orders are processed within <strong>24 hours</strong> of confirmed payment</li>
                      <li className="text-destructive font-medium">Payment must be made immediately — orders without immediate payment will NOT be processed</li>
                    </ul>
                  </div>
                </div>
              )}

              <Button type="submit" size="lg" className="w-full" disabled={submitting}>
                Place Order — R{totalPrice.toLocaleString()}
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
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span className="text-primary">R{totalPrice.toLocaleString()}</span>
              </div>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
