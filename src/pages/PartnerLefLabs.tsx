import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Phone, MessageCircle, ArrowLeft, ShieldCheck, FlaskConical, Cigarette, Sparkles, ShoppingCart } from "lucide-react";
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
import { LEFLABS_PRODUCTS } from "@/data/leflabsProducts";
import flowerImg from "@/assets/products/leflabs-indoor-flower.jpg";
import prerollImg from "@/assets/products/leflabs-prerolls.jpg";
import disposableImg from "@/assets/products/leflabs-disposable.jpg";
import cartridgeImg from "@/assets/products/leflabs-cartridge.jpg";

// Official Lëf Labs B2B contact.
const ORDER_PHONE = "0718065754";
const ORDER_PHONE_DISPLAY = "071 806 5754";
const WHATSAPP_NUMBER = "27718065754";
const WHATSAPP_LEAD_MESSAGE =
  "Hi Lëf Labs 👋 I'm a B2B lead from the Tripplefour Shop (tripplefourshophub.online) — I'd like the September 2026 wholesale catalogue / to place an order.";

type LefProduct = {
  name: string;
  caption: string;
  image: string;
};

const lefProducts: LefProduct[] = [
  { name: "Blue Zushi", caption: "4A Indoor · Tier I · R45/kg", image: flowerImg },
  { name: "Rainbow Royale", caption: "4A Indoor · Tier I · R45/kg", image: flowerImg },
  { name: "Animal Runtz", caption: "4A Indoor · BACK in stock", image: flowerImg },
  { name: "Gelato 41", caption: "Indoor · Tier II · R35/kg", image: flowerImg },
  { name: "Purple Panda (Organic)", caption: "Greendoor · Tier III · 4A grade", image: flowerImg },
  { name: "Indoor Moonstick", caption: "1.4g · kief-coated · R65", image: prerollImg },
  { name: "Greenhouse Pre-Roll", caption: "1.4g · glass tube · R30", image: prerollImg },
  { name: "Funk't Cartridge", caption: "NEW supplier · R350 flat", image: disposableImg },
  { name: "Orphan Laboratory", caption: "NEW supplier · R350 flat", image: cartridgeImg },
  { name: "Liquid Gold Cartridge", caption: "Vapes · R350 flat", image: cartridgeImg },
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

const TIERS = [
  {
    key: "4A Indoor · Tier I",
    label: "4A Indoor · Tier I",
    range: "R43–R45/kg",
    blurb: "Full-cycle indoor hydroponic genetics. Floor held at R43 through 10kg and 15kg. 100g minimum.",
    breaks: [["1kg", "R45"], ["2kg", "R44.50"], ["3kg", "R44"], ["4kg", "R43.50"], ["5kg", "R43"], ["10kg", "R43"], ["15kg", "R43"]],
  },
  {
    key: "Indoor · Tier II",
    label: "Indoor · Tier II",
    range: "R28–R35/kg",
    blurb: "Controlled environment, one step below 4A. 5kg floor requires a 50% deposit. 100g minimum.",
    breaks: [["1kg", "R35"], ["5kg", "R28"]],
  },
  {
    key: "Greendoor · Tier III",
    label: "Greendoor Organic Range · Tier III",
    range: "R25–R27/kg",
    blurb: "Light-assisted cultivation with an organic sub-range marked (4A). R0.50/kg reduction per additional kg to the 5kg floor. 250g minimum.",
    breaks: [["1kg", "R27"], ["2kg", "R26.50"], ["3kg", "R26"], ["4kg", "R25.50"], ["5kg", "R25"]],
  },
  {
    key: "Exotic Greenhouse · Tier IV",
    label: "Exotic Greenhouse · Tier IV",
    range: "R18–R24/kg",
    blurb: "Greenhouse exotics plus BT Mids & Pops, stock dependent. 250g minimum.",
    breaks: [["1kg", "R24"], ["5kg", "R18"]],
  },
  {
    key: "Greenhouse · Tier V",
    label: "Greenhouse · Tier V",
    range: "R13–R15/kg",
    blurb: "Everyday range built for volume. 10–15kg by special arrangement only. 250g minimum.",
    breaks: [["1kg", "R15"], ["5kg", "R13"], ["10–15kg", "By arrangement"]],
  },
];

export default function PartnerLefLabs() {
  const telHref = `tel:${ORDER_PHONE}`;
  const waHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    WHATSAPP_LEAD_MESSAGE,
  )}`;

  return (
    <div className="flex min-h-screen flex-col">
      <Helmet>
        <title>Lëf Labs September 2026 Catalogue — Wholesale | Tripplefour</title>
        <meta
          name="description"
          content="Lëf Labs September 2026 wholesale catalogue — 5 flower tiers from R13/kg, pre-rolls, R350 flat vapes and sour edibles. Authorised B2B partners only."
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
                <Badge className="mb-3 bg-accent text-accent-foreground">September 2026 Catalogue</Badge>
                <h1 className="font-display text-4xl font-bold md:text-5xl">
                  Lëf <span className="text-primary">Labs</span>{" "}
                  <span className="text-base font-normal text-muted-foreground">(Pty) Ltd</span>
                </h1>
                <p className="mt-3 max-w-xl text-muted-foreground">
                  One supplier. Full stack. The September Collection — five flower tiers, in-house
                  pre-rolls, a unified R350 vape price point and LëF Labs branded sour edibles.
                  COA on request for every batch. B2B only.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
                    <ShieldCheck className="h-3.5 w-3.5" /> COA on request
                  </span>
                  <span className="rounded-full border border-border px-3 py-1 text-xs font-semibold">5 tiers</span>
                  <span className="rounded-full border border-border px-3 py-1 text-xs font-semibold">Nationwide delivery</span>
                  <span className="rounded-full border border-border px-3 py-1 text-xs font-semibold">No outdoor stocked</span>
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
                  Direct EFT — Absa. Reference generated per order.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* What's new */}
        <section className="px-4 py-12">
          <div className="mx-auto max-w-6xl">
            <SectionHeader
              index="01 — What's new"
              title="New This Month"
              subtitle="The September catalogue is ready. Same pricing structure as always — floors hold through 10–15kg on 4A."
            />
            <div className="grid gap-4 md:grid-cols-3">
              {[
                {
                  t: "Two new vape suppliers",
                  d: "Funk't and Orphan Laboratory join Liquid Gold, Pure Leaf and Dirty Vapes — all at the same flat R350. MOQ 20 units.",
                },
                {
                  t: "Returning strains — BACK",
                  d: "A number of previously under-exposed lines are back in stock across 4A Indoor, Greendoor and Exotic Greenhouse, flagged BACK on the list.",
                },
                {
                  t: "Pricing unchanged",
                  d: "Same tier structure and volume breaks. R43/kg remains the hard 4A floor and is held flat through 10kg and 15kg orders.",
                },
              ].map((c) => (
                <div key={c.t} className="rounded-2xl border-2 border-primary/30 bg-primary/5 p-5">
                  <p className="font-display text-base font-bold">{c.t}</p>
                  <p className="mt-2 text-sm text-muted-foreground">{c.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Quick reference */}
        <section className="border-t border-border bg-secondary/20 px-4 py-12">
          <div className="mx-auto max-w-6xl">
            <SectionHeader
              index="02 — At a glance"
              title="Quick Reference"
              subtitle="Minimum order: 100g on 4A Indoor & Indoor · 250g across the rest of the list. Highest price point R45/kg, floor price from R10/kg."
            />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[
                ["4A Indoor · Tier I", "R43–R45", "Full-cycle indoor hydroponic. 28 strains. Floor held at R43 through 15kg. 100g min."],
                ["Indoor · Tier II", "R28–R35", "Controlled environment, one step below 4A. 20 strains. 5kg floor requires 50% deposit."],
                ["Greendoor · Tier III", "R25–R27", "Light-assisted. Organic sub-range available. 13 strains. 250g min."],
                ["Exotic Greenhouse · Tier IV", "R18–R24", "Greenhouse exotics plus BT Mids & Pops. 9 strains. Stock dependent."],
                ["Greenhouse · Tier V", "R13–R15", "Everyday range. 6 strains. 10–15kg by special arrangement only."],
                ["Pops & Mini Pops", "R15–R25", "Assorted small/medium, or straight small. From 250g bags."],
                ["Pre-Rolls & Moonsticks", "R25–R65", "1.4g in-house rolled. 7 formats across Indoor & Greenhouse. 100 unit min."],
                ["Vapes", "R350/u", "5 lines, one flat price — now with two new suppliers. MOQ 20 units."],
                ["Sour Edibles", "R150–R180", "15mg & 30mg. LëF Labs branded. MOQ 10 packs per flavour."],
                ["Concentrates", "POR", "Dab, honeycomb, crumble, distillate. Custom specs available."],
                ["Untrimmed Bud", "R10/kg", "Seedless, Greendoor-sourced. Not outdoor. 250g min."],
                ["Crush & Shake", "R6/g", "For buyers making their own pre-rolls. Estimates on request."],
              ].map(([t, price, d]) => (
                <div key={t} className="rounded-xl border-2 border-border bg-card p-5">
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">{t}</p>
                  <p className="mt-1 font-mono text-2xl font-bold text-primary">{price}</p>
                  <p className="mt-2 text-sm text-muted-foreground">{d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Catalogue highlights */}
        <section className="px-4 py-12">
          <div className="mx-auto max-w-6xl">
            <SectionHeader
              index="03 — Product range"
              title="Catalogue Highlights"
              subtitle="Representative product photography of the September range. All products available with batch COA on request."
            />
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {lefProducts.map((p) => (
                <LefProductCard key={p.name} p={p} />
              ))}
            </div>
          </div>
        </section>

        {/* Flower tiers */}
        <section className="border-t border-border bg-secondary/20 px-4 py-12">
          <div className="mx-auto max-w-6xl">
            <SectionHeader
              index="04 — Flower tiers"
              title="Five Tiers · Full Strain List"
              subtitle="BACK — returning lines, still in supply, previously under-exposed on pricing, now reintegrated into the current list. Mixed bundles across tiers built on request."
            />
            <div className="space-y-10">
              {TIERS.map((tier) => {
                const strains = LEFLABS_PRODUCTS.filter((p) => p.category === tier.key);
                return (
                  <div key={tier.key}>
                    <div className="flex flex-wrap items-end justify-between gap-3">
                      <div>
                        <h3 className="font-display text-xl font-bold">{tier.label}</h3>
                        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{tier.blurb}</p>
                      </div>
                      <p className="font-mono text-2xl font-bold text-primary">{tier.range}</p>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {tier.breaks.map(([q, p]) => (
                        <div key={q} className="rounded-lg border-2 border-border bg-card px-4 py-2 text-center">
                          <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{q}</p>
                          <p className="font-mono text-sm font-bold">{p}</p>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 overflow-x-auto rounded-xl border border-border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Strain</TableHead>
                            <TableHead className="text-right">Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {strains.map((s) => (
                            <TableRow key={s.id}>
                              <TableCell className="font-semibold">{s.name}</TableCell>
                              <TableCell className="text-right">
                                {s.isBack ? (
                                  <Badge className="bg-accent text-accent-foreground">BACK</Badge>
                                ) : (
                                  <span className="text-muted-foreground">—</span>
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Pops & raw material */}
        <section className="px-4 py-12">
          <div className="mx-auto max-w-6xl">
            <SectionHeader
              index="05 — Production grade & raw material"
              title="Pops, Untrimmed Bud & Crush"
              subtitle="Pops start from 250g bags. Gram weights and mixes available on request."
            />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                ["Pops · Assorted Small/Medium", "R25 each", "Assorted small-to-medium nugs, drawn from any range on the list. From 250g bags."],
                ["Mini Pops · Small Only", "R15 each", "Uniform small nugs only, sourced from Greendoor or Indoor. From 250g bags."],
                ["Untrimmed Bud", "R10/kg", "Fully seedless Greendoor-grown bud, untrimmed. Minimum 250g. Not outdoor."],
                ["Crush & Shake", "R6/g", "For buyers making their own pre-rolls. Estimates available on request."],
              ].map(([t, p, d]) => (
                <div key={t} className="rounded-xl border-2 border-border bg-card p-5">
                  <p className="font-display text-base font-bold">{t}</p>
                  <p className="mt-2 font-mono text-xl font-bold text-primary">{p}</p>
                  <p className="mt-2 text-xs text-muted-foreground">{d}</p>
                </div>
              ))}
            </div>
            <p className="mt-4 rounded-xl border border-dashed border-border p-4 text-xs text-muted-foreground">
              <span className="font-semibold text-foreground">Our position on outdoor:</span> priced close to an
              outdoor price point without being outdoor product — we don't stock outdoor at all. Everything on this
              list, down to this entry point, has been through the same testing process as our top shelf.
            </p>
          </div>
        </section>

        {/* Pre-rolls */}
        <section className="border-t border-border bg-secondary/20 px-4 py-12">
          <div className="mx-auto max-w-6xl">
            <SectionHeader
              index="06 — Pre-rolls & moonsticks"
              title="In-House Production · 1.4g"
              subtitle="1.4g pre-roll joints, hand-rolled from our own in-house flower — nothing outsourced. Minimum order 100 pre-rolls."
            />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { f: "Indoor · Glass Tube", src: "1.4g indoor flower · premium glass tube", price: "R40", icon: Cigarette },
                { f: "Indoor · Plastic Tube", src: "1.4g indoor flower · plastic tube", price: "R39", icon: Cigarette },
                { f: "Greenhouse · Glass Tube", src: "1.4g greenhouse flower · premium glass tube", price: "R30", icon: Cigarette },
                { f: "Greenhouse · Plastic Tube", src: "1.4g greenhouse flower · plastic tube", price: "R27", icon: Cigarette },
                { f: "Greenhouse Pre-Roll", src: "1.4g greenhouse flower · standard format", price: "R25", icon: Cigarette },
                { f: "Indoor Moonstick", src: "1.4g indoor flower · kief-coated · premium", price: "R65", icon: Sparkles },
                { f: "Greenhouse Moonstick", src: "1.4g greenhouse flower · kief-coated", price: "R45", icon: Sparkles },
              ].map(({ f, src, price, icon: Icon }) => (
                <div key={f} className="rounded-xl border-2 border-border bg-card p-5">
                  <Icon className="h-5 w-5 text-primary" />
                  <p className="mt-3 font-display text-base font-bold">{f}</p>
                  <p className="text-xs text-muted-foreground">{src}</p>
                  <p className="mt-3 font-mono text-xl font-bold text-primary">{price}</p>
                  <p className="mt-1 text-[10px] uppercase tracking-widest text-muted-foreground">
                    MOQ 100 units
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Vapes */}
        <section className="px-4 py-12">
          <div className="mx-auto max-w-6xl">
            <SectionHeader
              index="07 — Cartridges"
              title="Vapes · R350 Unified Price Point"
              subtitle="One flat price across every cartridge line we carry — Pure Leaf, Dirty Vapes and Liquid Gold, now joined by two new suppliers: Funk't and Orphan Laboratory. Cleanly sourced, all landing at the same number. MOQ 20 units."
            />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {[
                { line: "Line 01", name: "Liquid Gold", isNew: false },
                { line: "Line 02", name: "Pure Leaf", isNew: false },
                { line: "Line 03", name: "Dirty Vapes", isNew: false },
                { line: "Line 04", name: "Funk't", isNew: true },
                { line: "Line 05", name: "Orphan Laboratory", isNew: true },
              ].map((v) => (
                <div
                  key={v.name}
                  className={`relative rounded-xl border-2 p-5 ${v.isNew ? "border-primary bg-primary/5" : "border-border bg-card"}`}
                >
                  {v.isNew && (
                    <Badge className="absolute -top-2.5 right-3 bg-primary text-primary-foreground">NEW</Badge>
                  )}
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground">
                    {v.line}{v.isNew ? " · New supplier" : ""}
                  </p>
                  <p className="mt-1 font-display text-base font-bold">{v.name}</p>
                  <p className="mt-2 font-mono text-xl font-bold text-primary">R350</p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Cleanly sourced cartridge line, one flat price point.
                  </p>
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              Flavours include Blueberry Blitz · Lucy's Breath · Dante's Donuts · Daffy Duck · Strawberry Kim · Dosido · Blue Dream.
              MOQ 20 units. Available branded with the LëF Labs mark, or white-labelled at a higher price point on request.
            </p>
          </div>
        </section>

        {/* Edibles */}
        <section className="border-t border-border bg-secondary/20 px-4 py-12">
          <div className="mx-auto max-w-6xl">
            <SectionHeader
              index="08 — Edibles"
              title="Sour Edibles · LëF Labs Branded"
              subtitle="LëF Labs edibles, produced in combination with established names in the category. MOQ 10 packs per flavour."
            />
            <div className="grid gap-4 md:grid-cols-2">
              {[
                ["15mg · Standard", "R150/pack", "🍒 Cherry · 🥭 Mango · 🍍 Pineapple · 🍉 Watermelon · 😍 Litchi"],
                ["30mg · Premium", "R180/pack", "🍏 Elderflower Green Apple · 🍒🥤 Cherry Cola"],
              ].map(([t, p, f]) => (
                <div key={t} className="rounded-xl border-2 border-border bg-card p-5">
                  <p className="font-display text-base font-bold">{t}</p>
                  <p className="mt-2 font-mono text-2xl font-bold text-primary">{p}</p>
                  <p className="mt-2 text-sm text-muted-foreground">{f}</p>
                  <p className="mt-2 text-[10px] uppercase tracking-widest text-muted-foreground">
                    MOQ · 10 packs per flavour
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Concentrates */}
        <section className="px-4 py-12">
          <div className="mx-auto max-w-6xl">
            <SectionHeader
              index="09 — Dab · Crush · Distillate"
              title="Concentrates · POR"
              subtitle="Dab — honeycomb and crumble, available across a range of strains and price points on request."
            />
            <div className="overflow-x-auto rounded-xl border border-border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Strains</TableHead>
                    <TableHead className="text-right">Pricing</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-semibold">
                      <span className="inline-flex items-center gap-2">
                        <FlaskConical className="h-3.5 w-3.5 text-primary" /> Dab / Honeycomb / Crumble
                      </span>
                    </TableCell>
                    <TableCell>Skywalker · AK-47 · White Widow · Gorilla Glue</TableCell>
                    <TableCell className="text-right font-mono">POR</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold">
                      <span className="inline-flex items-center gap-2">
                        <FlaskConical className="h-3.5 w-3.5 text-primary" /> Distillate
                      </span>
                    </TableCell>
                    <TableCell>Larger-quantity buyers — ask your rep for the current sheet</TableCell>
                    <TableCell className="text-right font-mono">POR</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-semibold">
                      <span className="inline-flex items-center gap-2">
                        <FlaskConical className="h-3.5 w-3.5 text-primary" /> Crush & Shake
                      </span>
                    </TableCell>
                    <TableCell>For buyers making their own pre-rolls</TableCell>
                    <TableCell className="text-right font-mono">R6/g</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Custom manufacturing to your preferred spec is available. Specials apply on orders over 100g;
              smaller orders carry a fixed fee.
            </p>
          </div>
        </section>

        {/* Ordering Terms */}
        <section className="px-4 pb-16">
          <div className="mx-auto max-w-6xl">
            <SectionHeader index="10 — Ordering terms" title="How to Order" />
            <div className="grid gap-3 rounded-2xl border border-border bg-card p-6 text-sm md:grid-cols-2">
              {[
                ["Minimum order", "100g on 4A Indoor & Indoor · 250g across the rest of the list."],
                ["Volume floors", "R43/kg is the hard 4A floor, held flat through 10kg and 15kg orders."],
                ["Deposits", "The Tier II 5kg floor price requires a 50% deposit, balance due on arrival."],
                ["10–15kg greenhouse", "By special arrangement only, subject to limited availability. Deposit orders take preference."],
                ["Mixed bundles", "Assorted kg split across 4A Indoor and Greendoor (or other combinations) built on request."],
                ["Payment", "Direct EFT into the Lëf Labs Absa account using the reference generated with your order."],
                ["COA", "Available on request for every batch, across every tier."],
                ["Validity", "Pricing valid for September 2026. Updated catalogue issued monthly."],
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
                We serve established, high-demand operators. For sampling, the reserve list, or bespoke
                bundles, contact Lëf Labs via your Tripplefour account representative.
              </p>
              <Button asChild className="mt-4 gap-2">
                <Link to="/partners/lef-labs/order">
                  <ShoppingCart className="h-4 w-4" /> Order the September catalogue
                </Link>
              </Button>
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
