import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Phone, MessageCircle, ArrowLeft, ShieldCheck, Leaf, FlaskConical, Cigarette, Sparkles, ShoppingCart } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Official Lëf Labs B2B contact.
const ORDER_PHONE = "0718065754";
const ORDER_PHONE_DISPLAY = "071 806 5754";
const WHATSAPP_NUMBER = "27718065754";
const WHATSAPP_LEAD_MESSAGE =
  "Hi Lëf Labs 👋 I'm a B2B lead from the Tripplefour Shop (tripplefourshophub.online) — I'd like wholesale info / to place an order.";

type LefProduct = {
  name: string;
  caption: string;
  image: string;
};

const lefProducts: LefProduct[] = [
  { name: "Animal Runtz", caption: "Indoor • Hybrid • Sweet / Fruity", image: flowerImg },
  { name: "Lemon Silver Haze", caption: "Indoor • Sativa • Citrus / Earthy", image: flowerImg },
  { name: "Guava Bomba", caption: "Indoor • Hybrid • Tropical / Floral", image: flowerImg },
  { name: "Purple Ghost Candy", caption: "Indoor • Indica • Berry / Candy", image: flowerImg },
  { name: "Jack Herer", caption: "Tunnel AAA • Sativa • Spicy / Pine", image: flowerImg },
  { name: "Planet of the Grapes", caption: "Tunnel AAA • Indica • Grape / Earthy", image: flowerImg },
  { name: "Gorilla Skittles", caption: "Tunnel AAA • Hybrid • Sweet / Diesel", image: flowerImg },
  { name: "Moon Stick Pre-Roll", caption: "1g indoor + kief coat • Premium", image: prerollImg },
  { name: "Liquid Gold Disposable", caption: "0.5ml / 1ml • THC distillate", image: disposableImg },
  { name: "Pure Leaf Cartridge", caption: "1ml 510 • Full spectrum", image: cartridgeImg },
];

const LefProductCard = ({ p }: { p: LefProduct }) => (
  <div className="group overflow-hidden rounded-xl border-2 border-border bg-card transition-all hover:border-primary hover:-translate-y-1">
    <div className="relative aspect-square overflow-hidden bg-secondary/30">
      <img
        src={p.image}
        alt={`${p.name} — ${p.caption} wholesale product from Lëf Labs`}
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        loading="lazy"
        width={1024}
        height={1024}
      />
    </div>
    <div className="p-3">
      <p className="font-display text-sm font-bold leading-tight">{p.name}</p>
      <p className="mt-1 text-xs text-muted-foreground">{p.caption}</p>
    </div>
  </div>
);


const SectionHeader = ({
  index,
  title,
  subtitle,
}: {
  index: string;
  title: string;
  subtitle?: string;
}) => (
  <div className="mb-6">
    <p className="text-xs uppercase tracking-widest text-muted-foreground">/ {index}</p>
    <h2 className="mt-1 font-display text-2xl font-bold md:text-3xl">{title}</h2>
    {subtitle && (
      <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{subtitle}</p>
    )}
  </div>
);

export default function PartnerLefLabs() {
  const telHref = `tel:${ORDER_PHONE}`;
  const waHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    WHATSAPP_LEAD_MESSAGE,
  )}`;

  return (
    <div className="flex min-h-screen flex-col">
      <Helmet>
        <title>Lëf Labs — Wholesale Partner | Tripplefour</title>
        <meta
          name="description"
          content="Lëf Labs wholesale catalogue — COA-certified indoor & tunnel flower, pre-rolls, distillates and vapes. Authorised B2B partner of Tripplefour."
        />
        <link rel="canonical" href="https://tripplefourshophub.online/partners/lef-labs" />
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
                <Badge className="mb-3 bg-accent text-accent-foreground">Wholesale Partner</Badge>
                <h1 className="font-display text-4xl font-bold md:text-5xl">
                  Lëf <span className="text-primary">Labs</span>{" "}
                  <span className="text-base font-normal text-muted-foreground">(Pty) Ltd</span>
                </h1>
                <p className="mt-3 max-w-xl text-muted-foreground">
                  Wholesale Product Catalogue — Issue May 2026. For authorised B2B partners
                  only. Every batch carries a full Certificate of Analysis (COA) covering
                  cannabinoid potency, terpene profile, heavy metals, microbial and pesticide
                  testing.
                </p>
                <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
                  <ShieldCheck className="h-3.5 w-3.5" /> COA certified — every batch
                </div>
              </div>

              <div className="flex flex-col gap-2 md:items-end">
                <p className="text-xs uppercase tracking-widest text-muted-foreground">
                  B2B enquiries
                </p>
                <p className="font-display text-2xl font-bold text-primary">
                  {ORDER_PHONE_DISPLAY}
                </p>
                <div className="flex gap-2">
                  <Button asChild size="sm" className="gap-2">
                    <Link to="/partners/lef-labs/order">
                      <ShoppingCart className="h-4 w-4" /> Order Online
                    </Link>
                  </Button>
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
                </div>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  Pay securely via PayFast
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Supply Partners */}
        <section className="px-4 py-12">
          <div className="mx-auto max-w-6xl">
            <SectionHeader
              index="01 — Supply chain"
              title="Supply Partners"
              subtitle="Four certified cultivation and product partners. Each brings a distinct capability to the supply chain. All operate under documented quality standards."
            />
            <div className="overflow-x-auto rounded-xl border border-border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Partner</TableHead>
                    <TableHead>Origin</TableHead>
                    <TableHead>Facility</TableHead>
                    <TableHead>Speciality</TableHead>
                    <TableHead>COA</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-semibold">Partner A</TableCell>
                    <TableCell>Netherlands-heritage genetics</TableCell>
                    <TableCell>Indoor hydroponic, controlled environment</TableCell>
                    <TableCell>Premium exotic cultivars, pre-roll grade flower</TableCell>
                    <TableCell><Badge variant="secondary">Full panel</Badge></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold">Partner B</TableCell>
                    <TableCell>Local certified tunnel cultivation</TableCell>
                    <TableCell>Tunnel AAA / A, high-volume</TableCell>
                    <TableCell>Bud-size tiered supply, flower + pre-rolls</TableCell>
                    <TableCell><Badge variant="secondary">Full panel</Badge></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold">Partner C</TableCell>
                    <TableCell>Pretoria-based, SA-assembled</TableCell>
                    <TableCell>Indoor grow tech infrastructure</TableCell>
                    <TableCell>LED horticultural systems, grow facility enablement</TableCell>
                    <TableCell><Badge variant="secondary">Facility certified</Badge></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold">Partner D</TableCell>
                    <TableCell>West Rand, Gauteng</TableCell>
                    <TableCell>Vape manufacturing, distillate extraction</TableCell>
                    <TableCell>Liquid Gold vapes, Pure Leaf vapes, distillate</TableCell>
                    <TableCell><Badge variant="secondary">Full panel</Badge></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </div>
        </section>

        {/* Product placeholders */}
        <section className="border-t border-border bg-secondary/20 px-4 py-12">
          <div className="mx-auto max-w-6xl">
            <SectionHeader
              index="02 — Product range"
              title="Catalogue Highlights"
              subtitle="Visual placeholders — final product photography pending. All products available with batch COA on request."
            />
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {productPlaceholders.map((p) => (
                <ProductPlaceholder key={p.name} p={p} />
              ))}
            </div>
          </div>
        </section>

        {/* Indoor cultivars */}
        <section className="px-4 py-12">
          <div className="mx-auto max-w-6xl">
            <SectionHeader
              index="03 — Indoor cultivars"
              title="Partner A · Netherlands-Heritage Genetics"
              subtitle="Premium indoor hydroponic cultivation. Exotic genetics selected for terpene complexity, potency consistency and shelf visual appeal."
            />
            <div className="overflow-x-auto rounded-xl border border-border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Strain</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Notes</TableHead>
                    <TableHead className="text-right">Single-Nug /g</TableHead>
                    <TableHead className="text-right">Multi-Nug /g</TableHead>
                    <TableHead className="text-right">Popcorn /g</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    ["Animal Runtz", "Hybrid", "Sweet / Fruity"],
                    ["Lemon Silver Haze", "Sativa", "Citrus / Earthy"],
                    ["Guava Bomba", "Hybrid", "Tropical / Floral"],
                    ["Purple Ghost Candy", "Indica", "Berry / Candy"],
                  ].map(([s, t, n]) => (
                    <TableRow key={s}>
                      <TableCell className="font-semibold">{s}</TableCell>
                      <TableCell>{t}</TableCell>
                      <TableCell>{n}</TableCell>
                      <TableCell className="text-right font-mono">R120</TableCell>
                      <TableCell className="text-right font-mono">R100</TableCell>
                      <TableCell className="text-right font-mono">R80</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </section>

        {/* Tunnel cultivars */}
        <section className="px-4 py-12">
          <div className="mx-auto max-w-6xl">
            <SectionHeader
              index="04 — Tunnel cultivars"
              title="Partner B · Certified Tunnel-Grown"
              subtitle="Three bud-size tiers per strain. Consistent cannabinoid profiles, full COA per batch."
            />
            <div className="overflow-x-auto rounded-xl border border-border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Strain</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Notes</TableHead>
                    <TableHead className="text-right">Single /g</TableHead>
                    <TableHead className="text-right">Double /g</TableHead>
                    <TableHead className="text-right">Multi /g</TableHead>
                    <TableHead className="text-right">Popcorn /g</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    ["Jack Herer", "Sativa", "Spicy / Pine", "R70", "R60", "R40", "R25"],
                    ["Planet of the Grapes", "Indica", "Grape / Earthy", "R70", "R60", "R40", "R25"],
                    ["Gorilla Skittles", "Hybrid", "Sweet / Diesel", "R70", "R60", "R40", "R25"],
                    ["Cheese", "Hybrid", "Sharp / Savoury", "R40", "R32", "R27", "R20"],
                    ["Kimbo Kush", "Indica", "Coffee / Earthy", "R40", "R32", "R27", "R20"],
                    ["Endgame", "Hybrid", "Fuel / Sweet", "R40", "R32", "R27", "R20"],
                  ].map(([s, t, n, a, b, c, d]) => (
                    <TableRow key={s}>
                      <TableCell className="font-semibold">{s}</TableCell>
                      <TableCell>{t}</TableCell>
                      <TableCell>{n}</TableCell>
                      <TableCell className="text-right font-mono">{a}</TableCell>
                      <TableCell className="text-right font-mono">{b}</TableCell>
                      <TableCell className="text-right font-mono">{c}</TableCell>
                      <TableCell className="text-right font-mono">{d}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </section>

        {/* Pre-rolls */}
        <section className="border-t border-border bg-secondary/20 px-4 py-12">
          <div className="mx-auto max-w-6xl">
            <SectionHeader
              index="05 — Pre-rolls"
              title="Machine-Rolled · COA-Backed Flower"
              subtitle="All pre-rolls use COA-documented flower. Popcorn-nug input for standard; indoor flower for premium and infused formats."
            />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { f: "Standard 1g", src: "Tunnel popcorn blend", from: "R35", to: "R20", icon: Cigarette },
                { f: "Premium 1g", src: "Indoor multi-nug", from: "R55", to: "R34", icon: Cigarette },
                { f: "Moon Stick (infused)", src: "Indoor + kief coat", from: "R85", to: "R55", icon: Sparkles },
                { f: "Mini 5-Pack (5×0.5g)", src: "Tunnel blend", from: "R80", to: "R50", icon: Cigarette },
              ].map(({ f, src, from, to, icon: Icon }) => (
                <div key={f} className="rounded-xl border-2 border-border bg-card p-5">
                  <Icon className="h-5 w-5 text-primary" />
                  <p className="mt-3 font-display text-base font-bold">{f}</p>
                  <p className="text-xs text-muted-foreground">{src}</p>
                  <div className="mt-3 flex items-baseline gap-1">
                    <span className="font-mono text-xl font-bold text-primary">{to}</span>
                    <span className="text-xs text-muted-foreground">— {from}</span>
                  </div>
                  <p className="mt-1 text-[10px] uppercase tracking-widest text-muted-foreground">
                    Bulk → list price
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Distillates */}
        <section className="px-4 py-12">
          <div className="mx-auto max-w-6xl">
            <SectionHeader
              index="06 — Distillates & concentrates"
              title="Partner D · Extraction Lab"
              subtitle="THC and CBD distillates, live resin, wax and rosin. All products carry COA covering potency, residual solvent screening and heavy metal testing."
            />
            <div className="overflow-x-auto rounded-xl border border-border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Purity</TableHead>
                    <TableHead className="text-right">1–5g /g</TableHead>
                    <TableHead className="text-right">10g /g</TableHead>
                    <TableHead className="text-right">50g /g</TableHead>
                    <TableHead className="text-right">100g /g</TableHead>
                    <TableHead className="text-right">250g /g</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    ["THC Distillate", "90–95%", "R280", "R240", "R200", "R175", "R150"],
                    ["CBD Distillate", "80–90%", "R180", "R150", "R120", "R100", "R85"],
                    ["Full Spectrum Distillate", "70–80%", "R160", "R135", "R110", "R90", "R75"],
                    ["Live Resin", "65–80%", "R320", "R270", "R230", "R195", "R165"],
                    ["Wax / Shatter", "70–85%", "R220", "R185", "R155", "R130", "R110"],
                    ["Rosin (solventless)", "60–75%", "R380", "R320", "R270", "R230", "R195"],
                    ["Kief", "40–60%", "R120", "R100", "R80", "R65", "R55"],
                  ].map(([p, pur, ...rest]) => (
                    <TableRow key={p}>
                      <TableCell className="font-semibold">
                        <span className="inline-flex items-center gap-2">
                          <FlaskConical className="h-3.5 w-3.5 text-primary" /> {p}
                        </span>
                      </TableCell>
                      <TableCell>{pur}</TableCell>
                      {rest.map((v, i) => (
                        <TableCell key={i} className="text-right font-mono">{v}</TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              500g+ distillate orders require a forward purchase agreement with 50% deposit.
              1kg+ pricing on application.
            </p>
          </div>
        </section>

        {/* Vapes */}
        <section className="border-t border-border bg-secondary/20 px-4 py-12">
          <div className="mx-auto max-w-6xl">
            <SectionHeader
              index="07 — Vape products"
              title="Liquid Gold + Pure Leaf"
              subtitle="Two premium vape lines from the West Rand partner. Liquid Gold: distillate-based, high-potency. Pure Leaf: terpene-rich, full-spectrum."
            />
            <div className="overflow-x-auto rounded-xl border border-border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Volume</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">1–5</TableHead>
                    <TableHead className="text-right">10</TableHead>
                    <TableHead className="text-right">25</TableHead>
                    <TableHead className="text-right">50</TableHead>
                    <TableHead className="text-right">100+</TableHead>
                    <TableHead>MOQ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    ["Liquid Gold Disposable", "0.5ml", "THC distillate", "R320", "R290", "R265", "R245", "R220", "5"],
                    ["Liquid Gold Disposable", "1ml", "THC distillate", "R480", "R440", "R400", "R370", "R340", "5"],
                    ["Liquid Gold Cartridge", "1ml 510", "THC distillate", "R380", "R345", "R315", "R290", "R265", "5"],
                    ["Pure Leaf Disposable", "1ml", "Full spectrum", "R400", "R400", "R380", "R360", "R340", "5"],
                    ["Pure Leaf Cartridge", "1ml 510", "Full spectrum", "R400", "R380", "R360", "R340", "R320", "5"],
                    ["Pure Leaf Mini Disposable", "0.5ml", "Full spectrum", "R260", "R240", "R220", "R200", "R185", "5"],
                  ].map((row, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-semibold">{row[0]}</TableCell>
                      <TableCell>{row[1]}</TableCell>
                      <TableCell>{row[2]}</TableCell>
                      {row.slice(3, 8).map((v, j) => (
                        <TableCell key={j} className="text-right font-mono">{v}</TableCell>
                      ))}
                      <TableCell>{row[8]}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </section>

        {/* Preferred Partner Programme */}
        <section className="px-4 py-12">
          <div className="mx-auto max-w-6xl">
            <SectionHeader
              index="08 — Preferred Partner Programme"
              title="Subscription-Style B2B Supply"
              subtitle="Commit to a monthly minimum. Receive guaranteed delivery, dedicated account support and usage analytics. You focus on your customers — Lëf Labs handles your stock."
            />
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {[
                { tier: "Standard", min: "R5,250", disc: "List price", del: "3–5 business days", terms: "EFT on order" },
                { tier: "Partner", min: "R15,750", disc: "8% off list", del: "Bi-weekly guaranteed", terms: "EFT on order", popular: true },
                { tier: "Chain", min: "R52,000", disc: "15% off list", del: "Priority schedule", terms: "30-day net (approved)" },
                { tier: "Anchor", min: "POA", disc: "Fully negotiated", del: "Custom schedule", terms: "Custom terms" },
              ].map((t) => (
                <div
                  key={t.tier}
                  className={`relative flex flex-col rounded-2xl border-2 p-5 ${
                    t.popular ? "border-primary bg-primary/5" : "border-border bg-card"
                  }`}
                >
                  {t.popular && (
                    <Badge className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground">
                      Most Popular
                    </Badge>
                  )}
                  <p className="font-display text-lg font-bold">{t.tier}</p>
                  <p className="mt-2 text-xs uppercase tracking-widest text-muted-foreground">
                    Monthly minimum
                  </p>
                  <p className="font-mono text-2xl font-bold text-primary">{t.min}</p>
                  <div className="mt-3 space-y-1.5 text-sm text-muted-foreground">
                    <p><span className="text-foreground font-medium">Discount:</span> {t.disc}</p>
                    <p><span className="text-foreground font-medium">Delivery:</span> {t.del}</p>
                    <p><span className="text-foreground font-medium">Terms:</span> {t.terms}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Ordering Terms */}
        <section className="px-4 pb-16">
          <div className="mx-auto max-w-6xl">
            <SectionHeader index="09 — Ordering terms" title="How to Order" />
            <div className="grid gap-3 rounded-2xl border border-border bg-card p-6 text-sm md:grid-cols-2">
              {[
                ["Minimum first order", "R2,000 excluding delivery"],
                ["Sample policy", "Complimentary sample packs for new partners on request. COA provided with every sample."],
                ["Deposits", "50% deposit on all first orders. Balance on delivery."],
                ["Delivery", "Gauteng: 1–3 business days. CPT/DBN: 2–5 business days. Nationwide courier available."],
                ["5kg+ / 10kg+ orders", "Forward purchase agreement required. Pricing on application."],
                ["Bespoke pricing", "Available on request for chain, anchor and export-scale clients."],
                ["Validity", "Pricing valid for May 2026. Updated catalogue issued 1st of each month."],
              ].map(([k, v]) => (
                <div key={k} className="border-b border-border pb-3 last:border-0">
                  <p className="text-xs font-semibold uppercase tracking-widest text-primary">{k}</p>
                  <p className="mt-1 text-muted-foreground">{v}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-2xl border-2 border-dashed border-primary/30 bg-primary/5 p-6 text-center">
              <p className="font-display text-lg font-bold">B2B / Wholesale enquiries</p>
              <p className="mt-1 text-sm text-muted-foreground">
                For wholesale pricing, sample packs, or to join the Preferred Partner Programme,
                contact Lëf Labs via your Tripplefour account representative.
              </p>
              <p className="mt-3 text-[11px] text-muted-foreground">
                For authorised B2B wholesale partners only. All activity within the framework
                of applicable South African regulations. All prices in ZAR. COA documentation
                available on request for every batch.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}