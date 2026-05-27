import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle, Clock, Lock, Package, RefreshCw, MessageCircle, X } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AdminAffiliates from "@/components/AdminAffiliates";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Order {
  id: string;
  order_ref: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  delivery_address: string;
  delivery_fee: number;
  subtotal: number;
  total: number;
  items: any[];
  payment_method: string;
  payment_status: string;
  status: string;
  created_at: string;
}

interface AbandonedCart {
  id: string;
  customer_name: string | null;
  customer_email: string;
  customer_phone: string | null;
  items: { id: string; name: string; quantity: number; price: number }[];
  subtotal: number;
  last_activity_at: string;
}

export default function Admin() {
  const [authenticated, setAuthenticated] = useState(false);
  const [adminKey, setAdminKey] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [confirming, setConfirming] = useState<string | null>(null);
  const [carts, setCarts] = useState<AbandonedCart[]>([]);
  const [cartsLoading, setCartsLoading] = useState(false);

  const login = async () => {
    if (!adminKey.trim()) return;
    setLoading(true);
    const ok = await fetchOrders(adminKey);
    if (ok) {
      setAuthenticated(true);
      fetchAbandonedCarts(adminKey);
    } else {
      toast({ title: "Invalid key", description: "Access denied.", variant: "destructive" });
    }
    setLoading(false);
  };

  const fetchOrders = async (key?: string): Promise<boolean> => {
    setLoading(true);
    try {
      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-orders?action=list`;
      const response = await fetch(url, {
        headers: {
          "x-admin-key": key || adminKey,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to fetch");
      const data = await response.json();
      setOrders(data);
      setLoading(false);
      return true;
    } catch {
      setLoading(false);
      return false;
    }
  };

  const confirmPayment = async (orderId: string, orderRef: string) => {
    if (!window.confirm(`Mark order ${orderRef} as PAID? The customer's awaiting-payment screen will auto-update within ~5 seconds.`)) {
      return;
    }
    setConfirming(orderId);
    try {
      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-orders?action=confirm-payment`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "x-admin-key": adminKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ order_id: orderId }),
      });

      if (!response.ok) throw new Error("Failed");
      toast({ title: "✅ Marked as paid", description: `Order ${orderRef} confirmed. Customer will be notified automatically.` });
      fetchOrders();
    } catch {
      toast({ title: "Error", description: "Failed to mark order as paid.", variant: "destructive" });
    }
    setConfirming(null);
  };

  const fetchAbandonedCarts = async (key?: string) => {
    setCartsLoading(true);
    try {
      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-orders?action=list-abandoned-carts`;
      const res = await fetch(url, { headers: { "x-admin-key": key || adminKey } });
      if (!res.ok) throw new Error("failed");
      setCarts(await res.json());
    } catch {
      toast({ title: "Error", description: "Failed to load abandoned carts.", variant: "destructive" });
    }
    setCartsLoading(false);
  };

  const dismissCart = async (id: string) => {
    try {
      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-orders?action=dismiss-abandoned-cart`;
      await fetch(url, {
        method: "POST",
        headers: { "x-admin-key": adminKey, "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      setCarts((prev) => prev.filter((c) => c.id !== id));
    } catch {
      toast({ title: "Error", description: "Failed to dismiss.", variant: "destructive" });
    }
  };

  const whatsappLink = (cart: AbandonedCart) => {
    const phone = (cart.customer_phone || "").replace(/[^\d]/g, "");
    // Default to ZA international format if user typed local
    const normalized = phone.startsWith("0") ? `27${phone.slice(1)}` : phone;
    const itemsList = cart.items.map((i) => `• ${i.quantity}x ${i.name}`).join("\n");
    const msg =
      `Hey${cart.customer_name ? " " + cart.customer_name.split(" ")[0] : ""}! 👋\n\n` +
      `It's Tripplefour — you left these in your cart:\n\n${itemsList}\n\n` +
      `Total: R${Number(cart.subtotal).toLocaleString()}\n\n` +
      `Want me to complete the order for you? Pay by EFT and we'll deliver in 24–48h.\n` +
      `Or finish online here: https://tripplefourshophub.online/checkout`;
    return `https://wa.me/${normalized}?text=${encodeURIComponent(msg)}`;
  };

  if (!authenticated) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex flex-1 items-center justify-center px-4 py-16">
          <div className="mx-auto w-full max-w-sm space-y-6">
            <div className="text-center space-y-2">
              <Lock className="mx-auto h-12 w-12 text-muted-foreground" />
              <h1 className="font-display text-2xl font-bold">Admin Access</h1>
              <p className="text-sm text-muted-foreground">Enter your admin key to manage orders.</p>
            </div>
            <div className="space-y-3">
              <Label htmlFor="admin-key">Admin Key</Label>
              <Input
                id="admin-key"
                type="password"
                value={adminKey}
                onChange={(e) => setAdminKey(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && login()}
                placeholder="Enter admin secret key"
              />
              <Button onClick={login} className="w-full">Login</Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 px-4 py-8">
        <div className="mx-auto max-w-5xl">
          <div className="flex items-center justify-between">
            <h1 className="font-display text-3xl font-bold">Admin Dashboard</h1>
          </div>

          <Tabs defaultValue="orders" className="mt-6">
            <TabsList>
              <TabsTrigger value="orders">Orders</TabsTrigger>
              <TabsTrigger value="abandoned">
                Abandoned {carts.length > 0 && <span className="ml-1.5 rounded-full bg-accent/20 px-1.5 text-[10px]">{carts.length}</span>}
              </TabsTrigger>
              <TabsTrigger value="affiliates">Affiliates</TabsTrigger>
            </TabsList>

            <TabsContent value="orders" className="mt-4">
              <div className="flex justify-end mb-3">
                <Button variant="outline" size="sm" onClick={() => fetchOrders()} disabled={loading}>
                  <RefreshCw className={`h-4 w-4 mr-1 ${loading ? "animate-spin" : ""}`} />
                  Refresh
                </Button>
              </div>
              <div className="space-y-4">
            {orders.length === 0 && !loading && (
              <div className="text-center py-12 text-muted-foreground">
                <Package className="mx-auto h-12 w-12 mb-3" />
                <p>No orders yet.</p>
              </div>
            )}

            {orders.map((order) => (
              <div key={order.id} className="rounded-xl border bg-card p-5 space-y-3">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-mono text-sm font-bold">{order.order_ref}</p>
                    <p className="text-xs text-muted-foreground">{new Date(order.created_at).toLocaleString()}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {order.payment_status === "confirmed" ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                        <CheckCircle className="h-3 w-3" /> Paid
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
                        <Clock className="h-3 w-3" /> Pending
                      </span>
                    )}
                  </div>
                </div>

                <Separator />

                <div className="grid gap-2 text-sm sm:grid-cols-2">
                  <div><span className="text-muted-foreground">Customer:</span> {order.customer_name}</div>
                  <div><span className="text-muted-foreground">Phone:</span> {order.customer_phone}</div>
                  <div><span className="text-muted-foreground">Email:</span> {order.customer_email}</div>
                  <div><span className="text-muted-foreground">Address:</span> {order.delivery_address}</div>
                </div>

                <div className="text-sm">
                  <span className="text-muted-foreground">Items: </span>
                  {(order.items as any[]).map((i: any) => `${i.quantity}x ${i.name}`).join(", ")}
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="text-sm space-x-4">
                    <span>Subtotal: <strong>R{Number(order.subtotal).toLocaleString()}</strong></span>
                    <span>Delivery: <strong>R{Number(order.delivery_fee).toLocaleString()}</strong></span>
                    <span className="text-primary font-bold">Total: R{Number(order.total).toLocaleString()}</span>
                  </div>

                  {order.payment_status !== "confirmed" && (
                    <Button
                      size="sm"
                      onClick={() => confirmPayment(order.id, order.order_ref)}
                      disabled={confirming === order.id}
                    >
                      <CheckCircle className="h-4 w-4 mr-1.5" />
                      {confirming === order.id ? "Marking..." : "Mark as Paid"}
                    </Button>
                  )}
                </div>
              </div>
            ))}
              </div>
            </TabsContent>

            <TabsContent value="affiliates" className="mt-4">
              <AdminAffiliates adminKey={adminKey} />
            </TabsContent>

            <TabsContent value="abandoned" className="mt-4">
              <div className="flex justify-between items-center mb-3">
                <p className="text-sm text-muted-foreground">
                  Carts idle &gt; 30 min. Tap WhatsApp to recover.
                </p>
                <Button variant="outline" size="sm" onClick={() => fetchAbandonedCarts()} disabled={cartsLoading}>
                  <RefreshCw className={`h-4 w-4 mr-1 ${cartsLoading ? "animate-spin" : ""}`} />
                  Refresh
                </Button>
              </div>
              <div className="space-y-4">
                {carts.length === 0 && !cartsLoading && (
                  <div className="text-center py-12 text-muted-foreground">
                    <Package className="mx-auto h-12 w-12 mb-3" />
                    <p>No abandoned carts. Nice.</p>
                  </div>
                )}
                {carts.map((cart) => (
                  <div key={cart.id} className="rounded-xl border bg-card p-5 space-y-3">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold">{cart.customer_name || "(no name)"}</p>
                        <p className="text-xs text-muted-foreground">
                          Last activity: {new Date(cart.last_activity_at).toLocaleString()}
                        </p>
                      </div>
                      <span className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
                        <Clock className="h-3 w-3" /> Idle
                      </span>
                    </div>
                    <Separator />
                    <div className="grid gap-2 text-sm sm:grid-cols-2">
                      <div><span className="text-muted-foreground">Email:</span> {cart.customer_email}</div>
                      <div><span className="text-muted-foreground">Phone:</span> {cart.customer_phone || "—"}</div>
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">Items: </span>
                      {cart.items.map((i) => `${i.quantity}x ${i.name}`).join(", ")}
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <span className="text-primary font-bold">
                        R{Number(cart.subtotal).toLocaleString()}
                      </span>
                      <div className="flex gap-2">
                        {cart.customer_phone && (
                          <Button asChild size="sm">
                            <a href={whatsappLink(cart)} target="_blank" rel="noopener noreferrer">
                              <MessageCircle className="h-4 w-4 mr-1.5" />
                              WhatsApp recovery
                            </a>
                          </Button>
                        )}
                        <Button size="sm" variant="ghost" onClick={() => dismissCart(cart.id)}>
                          <X className="h-4 w-4 mr-1.5" />
                          Dismiss
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
}
