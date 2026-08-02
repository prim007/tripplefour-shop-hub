import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Building2, Download, Loader2, Minus, Plus, ShieldCheck, ShoppingCart, Trash2, Truck } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { AGE_TOKEN_KEY, AGE_VERIFIED_KEY, hasUnexpiredAgeToken } from "@/lib/age-verification";
import { products, categories, type Product } from "@/data/products";
import logoUrl from "@/assets/tripple444-logo.png";

const BANK = {
  accountName: "P.M",
  bank: "FNB",
  branchCode: "250655",
  accountNumber: "63203398862",
  accountType: "Cheque",
};

const orderable: Product[] = products.filter((p) => !p.comingSoon && p.price > 0);

interface DeliveryZone {
  id: string;
  zone_name: string;
  min_km: number;
  max_km: number;
  fee: number;
}

export default function Dispensaries() {
  const [qty, setQty] = useState<Record<string, number>>({});
  const [customRequests, setCustomRequests] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [orderRef, setOrderRef] = useState<string | null>(null);
  const [zones, setZones] = useState<DeliveryZone[]>([]);
  const [zoneId, setZoneId] = useState<string>("");
  const [form, setForm] = useState({
    business_name: "",
    contact_name: "",
    email: "",
    phone: "",
    delivery_address: "",
    delivery_city: "",
    delivery_suburb: "",
    delivery_postal_code: "",
    notes: "",
  });

  useEffect(() => {
    supabase
      .from("delivery_zones")
      .select("id, zone_name, min_km, max_km, fee")
      .order("min_km", { ascending: true })
      .then(({ data }) => setZones((data as DeliveryZone[]) ?? []));
  }, []);

  const selectedZone = useMemo(() => zones.find((z) => z.id === zoneId) ?? null, [zones, zoneId]);
  const deliveryFee = selectedZone ? Number(selectedZone.fee) : 0;

  const lines = useMemo(
    () =>
      orderable
        .filter((p) => (qty[p.id] ?? 0) > 0)
        .map((p) => ({ product: p, quantity: qty[p.id] })),
    [qty],
  );
  const subtotal = useMemo(
    () => lines.reduce((sum, l) => sum + l.product.price * l.quantity, 0),
    [lines],
  );
  const total = subtotal + deliveryFee;

  const fullAddress = () =>
    [form.delivery_address, form.delivery_suburb, form.delivery_city, form.delivery_postal_code]
      .map((v) => v.trim())
      .filter(Boolean)
      .join(", ");

  const setQuantity = (id: string, value: number) =>
    setQty((prev) => ({ ...prev, [id]: Math.max(0, Math.min(1000, Math.floor(value) || 0)) }));

  const loadLogo = async (): Promise<string | null> => {
    try {
      const res = await fetch(logoUrl);
      const blob = await res.blob();
      return await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(typeof reader.result === "string" ? reader.result : null);
        reader.onerror = () => resolve(null);
        reader.readAsDataURL(blob);
      });
    } catch {
      return null;
    }
  };

  const buildPdf = async (ref: string | null) => {
    try {
    const doc = new jsPDF();
    const pageW = doc.internal.pageSize.getWidth();

    // Header band with logo
    doc.setFillColor(13, 13, 13);
    doc.rect(0, 0, pageW, 34, "F");
    const logo = await loadLogo();
    if (logo) {
      try {
        doc.addImage(logo, "PNG", 14, 7, 44, 22);
      } catch {
        /* ignore logo failure */
      }
    }
    doc.setTextColor(212, 175, 55);
    doc.setFontSize(16);
    doc.text("WHOLESALE ORDER", pageW - 14, 17, { align: "right" });
    doc.setTextColor(235, 235, 235);
    doc.setFontSize(9);
    doc.text("TRIPPLEFOUR · tripplefourshophub.online", pageW - 14, 25, { align: "right" });

    doc.setTextColor(20, 20, 20);
    doc.setFontSize(10);
    doc.text(`Date: ${new Date().toLocaleDateString("en-ZA")}`, 14, 44);
    doc.text(`Reference: ${ref ?? "QUOTE (not yet submitted)"}`, 14, 50);

    doc.text(
      [
        `Business: ${form.business_name || "-"}`,
        `Contact: ${form.contact_name || "-"}`,
        `Email: ${form.email || "-"}`,
        `Phone: ${form.phone || "-"}`,
        `Delivery address: ${fullAddress() || "-"}`,
        `Delivery zone: ${selectedZone ? `${selectedZone.zone_name} (${selectedZone.min_km}-${selectedZone.max_km}km) — R${Number(selectedZone.fee).toFixed(2)}` : "Not selected"}`,
      ],
      14,
      60,
    );

    autoTable(doc, {
      startY: 92,
      head: [["Product", "Category", "Unit (R)", "Qty", "Line total (R)"]],
      body: lines.length
        ? lines.map((l) => [
        l.product.name,
        l.product.category,
        l.product.price.toFixed(2),
        String(l.quantity),
        (l.product.price * l.quantity).toFixed(2),
          ])
        : [["No items selected yet", "-", "-", "-", "-"]],
      styles: { fontSize: 9 },
      headStyles: { fillColor: [13, 13, 13], textColor: [212, 175, 55] },
    });

    // @ts-expect-error lastAutoTable is added by jspdf-autotable
    let y = (doc.lastAutoTable?.finalY ?? 80) + 10;
    doc.setFontSize(12);
    doc.setFontSize(10);
    doc.text(`Subtotal: R${subtotal.toFixed(2)}`, 14, y);
    y += 6;
    doc.text(`Delivery fee: R${deliveryFee.toFixed(2)}`, 14, y);
    y += 8;
    doc.setFontSize(12);
    doc.text(`Order total: R${total.toFixed(2)}`, 14, y);
    y += 10;

    if (customRequests.trim()) {
      doc.setFontSize(10);
      doc.text("Special / custom requests (quoted separately):", 14, y);
      y += 6;
      doc.text(doc.splitTextToSize(customRequests.trim(), 180), 14, y);
      y += 6 + doc.splitTextToSize(customRequests.trim(), 180).length * 5;
    }

    if (y > 215) {
      doc.addPage();
      y = 24;
    }

    // Banking details block
    doc.setDrawColor(212, 175, 55);
    doc.setFillColor(250, 247, 236);
    doc.roundedRect(14, y, pageW - 28, 56, 2, 2, "FD");
    doc.setFontSize(11);
    doc.setTextColor(13, 13, 13);
    doc.text("EFT BANKING DETAILS", 20, y + 9);
    doc.setFontSize(10);
    const rows: [string, string][] = [
      ["Account name", BANK.accountName],
      ["Bank", BANK.bank],
      ["Branch code", BANK.branchCode],
      ["Account no.", BANK.accountNumber],
      ["Type", BANK.accountType],
      ["Reference", ref ?? "Your DISP-XXXXXXXX order code"],
    ];
    rows.forEach(([label, value], i) => {
      const ry = y + 17 + i * 6.5;
      doc.setTextColor(90, 90, 90);
      doc.text(label, 20, ry);
      doc.setTextColor(13, 13, 13);
      doc.text(String(value), 70, ry);
    });

    doc.setFontSize(8);
    doc.setTextColor(120, 120, 120);
    doc.text(
      "Orders are dispatched once payment reflects. Use your order reference as the EFT payment reference.",
      14,
      y + 64,
    );

    const filename = `tripplefour-wholesale-${ref ?? "quote"}.pdf`;
    try {
      doc.save(filename);
    } catch {
      const url = URL.createObjectURL(doc.output("blob"));
      window.open(url, "_blank");
    }
    toast({ title: "PDF ready", description: `Downloaded ${filename}` });
    } catch (err) {
      console.error("PDF generation failed", err);
      toast({
        title: "Could not generate PDF",
        description: "Please try again, or open the site in a new tab and retry.",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async () => {
    if (!form.business_name || !form.contact_name || !form.email || !form.phone || !form.delivery_address || !form.delivery_city) {
      toast({ title: "Missing details", description: "Please complete all required fields.", variant: "destructive" });
      return;
    }
    if (!zoneId) {
      toast({ title: "Select a delivery area", description: "Choose the delivery zone closest to you so we can calculate the fee.", variant: "destructive" });
      return;
    }
    if (lines.length === 0 && !customRequests.trim()) {
      toast({ title: "Nothing selected", description: "Pick products or add a custom request.", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    try {
      const ageToken = localStorage.getItem(AGE_TOKEN_KEY);
      if (!hasUnexpiredAgeToken(ageToken)) {
        toast({
          title: "Age verification required",
          description: "Please confirm you are 21 or older, then submit again.",
          variant: "destructive",
        });
        localStorage.removeItem(AGE_TOKEN_KEY);
        localStorage.removeItem(AGE_VERIFIED_KEY);
        window.location.reload();
        return;
      }
      const { data, error } = await supabase.functions.invoke("create-dispensary-order", {
        body: {
          ...form,
          delivery_address: fullAddress(),
          delivery_zone_id: zoneId,
          items: lines.map((l) => ({ id: l.product.id, quantity: l.quantity })),
          custom_requests: customRequests,
          age_token: ageToken,
        },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      setOrderRef(data.order_ref);
      toast({ title: "Order submitted", description: `Reference ${data.order_ref}. Use it as your EFT reference.` });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Please try again.";
      toast({ title: "Could not submit order", description: message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Helmet>
        <title>Dispensary Wholesale Orders | Tripplefour</title>
        <meta
          name="description"
          content="Wholesale ordering portal for South African dispensaries. Browse the Tripplefour catalogue, build an order, download a PDF and pay by EFT."
        />
        <link rel="canonical" href="https://tripplefourshophub.online/dispensaries" />
      </Helmet>

      <Navbar />

      <main className="flex-1 bg-secondary/20">
        <section className="border-b border-border bg-background">
          <div className="mx-auto max-w-6xl px-4 py-8">
            <Badge className="mb-2 bg-accent text-accent-foreground">Trade Portal</Badge>
            <h1 className="font-display text-3xl font-bold uppercase md:text-4xl">
              Dispensary <span className="text-primary">Wholesale Orders</span>
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              Enter your dispensary details, pick what you need from the catalogue, request anything we don't
              stock yet, download your order as a PDF and pay by EFT into our FNB account.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-8">
          <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
            <div className="space-y-8">
              <div className="rounded-xl border-2 border-border bg-card p-5">
                <h2 className="mb-4 font-display text-xl font-bold">Dispensary details</h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <Label htmlFor="business_name">Dispensary / business name *</Label>
                    <Input id="business_name" maxLength={120} value={form.business_name}
                      onChange={(e) => setForm({ ...form, business_name: e.target.value })} />
                  </div>
                  <div>
                    <Label htmlFor="contact_name">Contact person *</Label>
                    <Input id="contact_name" maxLength={100} value={form.contact_name}
                      onChange={(e) => setForm({ ...form, contact_name: e.target.value })} />
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input id="email" type="email" maxLength={255} value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })} />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone *</Label>
                    <Input id="phone" type="tel" maxLength={25} value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                  </div>
                  <div className="sm:col-span-2">
                    <Label htmlFor="delivery_address">Delivery address *</Label>
                    <Textarea id="delivery_address" rows={2} maxLength={500} value={form.delivery_address}
                      onChange={(e) => setForm({ ...form, delivery_address: e.target.value })} />
                  </div>
                  <div>
                    <Label htmlFor="delivery_suburb">Suburb</Label>
                    <Input id="delivery_suburb" maxLength={80} value={form.delivery_suburb}
                      onChange={(e) => setForm({ ...form, delivery_suburb: e.target.value })} />
                  </div>
                  <div>
                    <Label htmlFor="delivery_city">City / town *</Label>
                    <Input id="delivery_city" maxLength={80} value={form.delivery_city}
                      onChange={(e) => setForm({ ...form, delivery_city: e.target.value })} />
                  </div>
                  <div>
                    <Label htmlFor="delivery_postal_code">Postal code</Label>
                    <Input id="delivery_postal_code" inputMode="numeric" maxLength={10} value={form.delivery_postal_code}
                      onChange={(e) => setForm({ ...form, delivery_postal_code: e.target.value })} />
                  </div>
                  <div>
                    <Label htmlFor="delivery_zone">Delivery area *</Label>
                    <Select value={zoneId} onValueChange={setZoneId}>
                      <SelectTrigger id="delivery_zone" aria-label="Delivery area">
                        <SelectValue placeholder="Select your delivery area" />
                      </SelectTrigger>
                      <SelectContent className="bg-popover">
                        {zones.map((z) => (
                          <SelectItem key={z.id} value={z.id}>
                            {z.zone_name} ({z.min_km}–{z.max_km}km) — R{Number(z.fee).toFixed(2)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="sm:col-span-2">
                    <Label htmlFor="notes">Order notes (optional)</Label>
                    <Textarea id="notes" rows={2} maxLength={300} value={form.notes}
                      onChange={(e) => setForm({ ...form, notes: e.target.value })} />
                  </div>
                </div>
              </div>

              <div>
                <h2 className="mb-4 font-display text-xl font-bold">Catalogue</h2>
                <div className="space-y-8">
                  {categories.map((cat) => {
                    const items = orderable.filter((p) => p.category === cat);
                    if (items.length === 0) return null;
                    return (
                      <div key={cat}>
                        <h3 className="mb-3 font-display text-lg font-bold uppercase text-primary">{cat}</h3>
                        <div className="grid gap-3 sm:grid-cols-2">
                          {items.map((p) => (
                            <div key={p.id} className="flex items-center gap-3 rounded-xl border-2 border-border bg-card p-4">
                              <img
                                src={p.image}
                                alt={p.name}
                                loading="lazy"
                                decoding="async"
                                className="h-16 w-16 shrink-0 rounded-lg border border-border bg-secondary/40 object-cover"
                              />
                              <div className="min-w-0 flex-1">
                                <p className="font-display text-sm font-bold leading-tight">{p.name}</p>
                                <p className="mt-1 font-mono text-sm font-bold text-primary">R{p.price.toFixed(2)}</p>
                              </div>
                              <div className="flex shrink-0 flex-col items-center gap-1 sm:flex-row">
                                <Button size="icon" variant="outline" className="h-8 w-8" aria-label={`Decrease ${p.name}`}
                                  onClick={() => setQuantity(p.id, (qty[p.id] ?? 0) - 1)}>
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <Input
                                  aria-label={`Quantity for ${p.name}`}
                                  className="h-8 w-14 text-center font-mono"
                                  inputMode="numeric"
                                  value={qty[p.id] ?? 0}
                                  onChange={(e) => setQuantity(p.id, Number(e.target.value))}
                                />
                                <Button size="icon" variant="outline" className="h-8 w-8" aria-label={`Increase ${p.name}`}
                                  onClick={() => setQuantity(p.id, (qty[p.id] ?? 0) + 1)}>
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-xl border-2 border-dashed border-border bg-card p-5">
                <h2 className="font-display text-xl font-bold">Need something we don't stock?</h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  List the products, brands, quantities and packs you'd like us to source. We'll quote you separately.
                </p>
                <Textarea
                  className="mt-3"
                  rows={4}
                  maxLength={1000}
                  aria-label="Custom product requests"
                  placeholder="e.g. 20 x 1g live resin carts, bulk grinders, branded stash jars…"
                  value={customRequests}
                  onChange={(e) => setCustomRequests(e.target.value)}
                />
              </div>
            </div>

            <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
              <div className="rounded-xl border-2 border-border bg-card p-5">
                <div className="mb-3 flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5 text-primary" />
                  <h2 className="font-display text-lg font-bold">Your order</h2>
                  <span className="ml-auto text-xs text-muted-foreground">{lines.length} line item(s)</span>
                </div>

                {lines.length === 0 ? (
                  <p className="py-6 text-center text-sm text-muted-foreground">No products selected yet.</p>
                ) : (
                  <ul className="space-y-2">
                    {lines.map((l) => (
                      <li key={l.product.id} className="flex items-center gap-2 rounded-lg bg-secondary/40 p-2">
                        <img
                          src={l.product.image}
                          alt={l.product.name}
                          loading="lazy"
                          className="h-9 w-9 shrink-0 rounded-md object-cover"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold">{l.product.name}</p>
                          <p className="font-mono text-xs text-muted-foreground">
                            R{l.product.price.toFixed(2)} × {l.quantity} = R{(l.product.price * l.quantity).toFixed(2)}
                          </p>
                        </div>
                        <Button size="icon" variant="ghost" className="h-7 w-7 text-destructive"
                          aria-label={`Remove ${l.product.name}`} onClick={() => setQuantity(l.product.id, 0)}>
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </li>
                    ))}
                  </ul>
                )}

                <div className="mt-4 space-y-1.5 border-t border-border pt-3">
                  <div className="flex items-baseline justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-mono">R{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex items-baseline justify-between text-sm">
                    <span className="flex items-center gap-1.5 text-muted-foreground">
                      <Truck className="h-3.5 w-3.5" />
                      {selectedZone ? selectedZone.zone_name : "Delivery (select area)"}
                    </span>
                    <span className="font-mono">R{deliveryFee.toFixed(2)}</span>
                  </div>
                  <div className="flex items-baseline justify-between border-t border-border pt-2">
                    <span className="text-sm font-semibold">Order total</span>
                    <span className="font-mono text-lg font-bold">R{total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <Button onClick={handleSubmit} disabled={submitting} className="w-full gap-2" size="lg">
                    {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
                    {submitting ? "Submitting…" : "Submit wholesale order"}
                  </Button>
                  <Button variant="outline" className="w-full gap-2" onClick={() => { void buildPdf(orderRef); }}>
                    <Download className="h-4 w-4" /> Download order PDF
                  </Button>
                </div>

                {orderRef && (
                  <div className="mt-4 rounded-lg border border-primary/40 bg-primary/5 p-3 text-sm">
                    <p className="font-semibold">Order received</p>
                    <p className="mt-1 text-muted-foreground">
                      Reference: <span className="font-mono font-bold text-primary">{orderRef}</span> — use this as
                      your EFT payment reference.
                    </p>
                  </div>
                )}
              </div>

              <div className="rounded-xl border-2 border-dashed border-border bg-card p-5">
                <div className="mb-3 flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-primary" />
                  <h2 className="font-display text-lg font-bold">EFT banking details</h2>
                </div>
                <dl className="grid grid-cols-[120px_1fr] gap-y-1.5 text-sm">
                  <dt className="text-muted-foreground">Account name</dt>
                  <dd className="font-semibold">{BANK.accountName}</dd>
                  <dt className="text-muted-foreground">Bank</dt>
                  <dd className="font-semibold">{BANK.bank}</dd>
                  <dt className="text-muted-foreground">Branch code</dt>
                  <dd className="font-mono font-semibold">{BANK.branchCode}</dd>
                  <dt className="text-muted-foreground">Account no.</dt>
                  <dd className="font-mono font-semibold">{BANK.accountNumber}</dd>
                  <dt className="text-muted-foreground">Type</dt>
                  <dd className="font-semibold">{BANK.accountType}</dd>
                  <dt className="text-muted-foreground">Reference</dt>
                  <dd className="font-semibold">
                    Your <span className="font-mono text-primary">DISP-XXXXXXXX</span> order code
                  </dd>
                </dl>
                <p className="mt-3 text-[11px] text-muted-foreground">
                  Stock is reserved once proof of payment reflects. Custom requests are quoted before payment.
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