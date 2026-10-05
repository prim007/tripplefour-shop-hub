import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Phone, MessageCircle, ArrowLeft, Mail } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { products } from "@/data/products";

// Official Dirty Vapes business contacts.
const ORDER_PHONE = "0742624491";
const ORDER_PHONE_DISPLAY = "074 262 4491";
const ORDER_EMAIL = "dirtyvapessa@gmail.com";
// SA country code 27, drop leading 0.
const WHATSAPP_NUMBER = "27742624491";
const WHATSAPP_LEAD_MESSAGE =
  "Hi Dirty Vapes 👋 I'm a lead from the Tripplefour Shop (tripplefourshophub.online) — I'd like to place an order / get more info on your range.";

export default function PartnerDirtyVapes() {
  const dirtyVapesProducts = products.filter((p) => p.id.startsWith("dv-"));
  const telHref = `tel:${ORDER_PHONE}`;
  const mailHref = `mailto:${ORDER_EMAIL}?subject=${encodeURIComponent(
    "Order enquiry — lead from Tripplefour Shop",
  )}&body=${encodeURIComponent(WHATSAPP_LEAD_MESSAGE)}`;
  const waHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    WHATSAPP_LEAD_MESSAGE,
  )}`;

  return (
    <div className="flex min-h-screen flex-col">
      <Helmet>
        <title>Dirty Vapes — Partner Store | Tripplefour</title>
        <meta
          name="description"
          content="Shop Dirty Vapes — premium THC carts, disposables, SWITCH devices and infused edibles. Exclusive partner brand on Tripplefour."
        />
        <link rel="canonical" href="https://tripplefourshophub.online/partners/dirty-vapes" />
        <meta property="og:title" content="Dirty Vapes — Partner Store | Tripplefour" />
        <meta property="og:description" content="Premium THC carts, disposables, SWITCH devices and infused edibles from Dirty Vapes on Tripplefour." />
        <meta property="og:url" content="https://tripplefourshophub.online/partners/dirty-vapes" />
        <meta property="og:type" content="website" />
        <meta name="robots" content="noindex, follow" />
      </Helmet>

      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="border-b border-border bg-secondary/30">
          <div className="mx-auto max-w-6xl px-4 py-12">
            <Link
              to="/partners"
              className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-muted-foreground hover:text-primary"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Partners
            </Link>

            <div className="mt-6 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
              <div>
                <Badge className="mb-3 bg-accent text-accent-foreground">Partner Brand</Badge>
                <h1 className="font-display text-4xl font-bold md:text-5xl">
                  Dirty <span className="text-primary">Vapes</span>
                </h1>
                <p className="mt-3 max-w-xl text-muted-foreground">
                  Bold, hard-hitting THC carts, disposables, SWITCH pod devices and infused
                  edibles. Exclusive B2B partner range — available to order direct.
                </p>
              </div>

              <div className="flex flex-col gap-2 md:items-end">
                <p className="text-xs uppercase tracking-widest text-muted-foreground">
                  Place an order
                </p>
                <p className="font-display text-2xl font-bold text-primary">
                  {ORDER_PHONE_DISPLAY}
                </p>
                <a
                  href={mailHref}
                  className="text-xs text-muted-foreground hover:text-primary"
                >
                  {ORDER_EMAIL}
                </a>
                <div className="flex gap-2">
                  <Button asChild size="sm" className="gap-2">
                    <a href={telHref}>
                      <Phone className="h-4 w-4" /> Call
                    </a>
                  </Button>
                  <Button asChild size="sm" variant="outline" className="gap-2">
                    <a
                      href={waHref}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <MessageCircle className="h-4 w-4" /> WhatsApp
                    </a>
                  </Button>
                  <Button asChild size="sm" variant="outline" className="gap-2">
                    <a href={mailHref}>
                      <Mail className="h-4 w-4" /> Email
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Products */}
        <section className="px-4 py-12">
          <div className="mx-auto max-w-6xl">
            <div className="mb-8 flex items-end justify-between">
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground">
                  / 01 — The drop
                </p>
                <h2 className="mt-1 font-display text-2xl font-bold">Dirty Vapes range</h2>
              </div>
              <p className="hidden text-sm text-muted-foreground md:block">
                {dirtyVapesProducts.length} products
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {dirtyVapesProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>

            <div className="mt-12 rounded-2xl border-2 border-dashed border-primary/30 bg-primary/5 p-6 text-center">
              <p className="font-display text-lg font-bold">B2B / Bulk orders</p>
              <p className="mt-1 text-sm text-muted-foreground">
                For wholesale pricing or bulk orders, contact Dirty Vapes directly at{" "}
                <span className="font-semibold text-foreground">{ORDER_PHONE_DISPLAY}</span>.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}