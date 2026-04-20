import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle, Clock, Lock, Package, RefreshCw } from "lucide-react";
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

export default function Admin() {
  const [authenticated, setAuthenticated] = useState(false);
  const [adminKey, setAdminKey] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [confirming, setConfirming] = useState<string | null>(null);

  const login = () => {
    if (!adminKey.trim()) return;
    setAuthenticated(true);
    fetchOrders(adminKey);
  };

  const fetchOrders = async (key?: string) => {
    setLoading(true);
    try {
      const res = await supabase.functions.invoke("admin-orders", {
        headers: { "x-admin-key": key || adminKey },
        body: null,
        method: "GET",
      });

      // Use query param approach instead
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
    } catch {
      toast({ title: "Error", description: "Failed to load orders.", variant: "destructive" });
    }
    setLoading(false);
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
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
}
