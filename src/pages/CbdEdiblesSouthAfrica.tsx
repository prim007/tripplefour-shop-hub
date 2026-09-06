import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Cookie, ShieldCheck, Truck, Clock, ArrowRight } from "lucide-react";
import { products } from "@/data/products";

const URL = "https://tripplefourshophub.online/cbd-edibles-south-africa";
const TITLE = "CBD Edibles South Africa — Gummies, Cookies & Dosage Guide";
const DESC =
  "CBD edibles in South Africa: gummies, cookies and infused cubes explained — mg per serving, onset times, the Schedule 0 legal position, and where to buy online in ZAR.";

const faqs = [
  {
    q: "Are CBD edibles legal in South Africa?",
    a: "Low-dose CBD preparations sold for general health are treated as Schedule 0 in South Africa, with a maximum daily dose of 20 mg CBD. Higher-dose products and anything sold with a medicinal claim fall under Schedule 4 and need a prescription. Check the label and the batch certificate of analysis before you buy.",
  },
  {
    q: "How long do CBD edibles take to work?",
    a: "Edibles pass through digestion first, so onset is slower than oils or vapes — commonly 45 to 90 minutes, and longer on a full stomach. The effect then tends to last longer. Wait at least two hours before considering more.",
  },
  {
    q: "How many milligrams should I start with?",
    a: "Start with the smallest portion on the pack — often half a gummy or a quarter of a cookie — and keep that amount for a few days before adjusting. Splitting a 40 mg cube into quarters is a common way to find a comfortable serving.",
  },
  {
    q: "Will CBD edibles make me high?",
    a: "CBD itself is non-intoxicating. THC-infused edibles are a different product and are clearly labelled as such in our shop, so read the product page before ordering.",
  },
  {
    q: "Do you deliver edibles across South Africa?",
    a: "Yes. We deliver nationwide, priced in Rands. Delivery is quoted by distance from R70 at checkout, and you must be 21 or older to order.",
  },
];

export default function CbdEdiblesSouthAfrica() {
  const edibles = products.filter((p) => p.category === "Edibles" && !p.comingSoon).slice(0, 4);

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://tripplefourshophub.online/" },
      { "@type": "ListItem", position: 2, name: "CBD Edibles South Africa", item: URL },
    ],
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Helmet>
        <title>{TITLE}</title>
        <meta name="description" content={DESC} />
        <link rel="canonical" href={URL} />
        <meta property="og:title" content={TITLE} />
        <meta property="og:description" content={DESC} />
        <meta property="og:url" content={URL} />
        <meta property="og:type" content="article" />
        <meta name="twitter:title" content={TITLE} />
        <meta name="twitter:description" content={DESC} />
        <script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbJsonLd)}</script>
      </Helmet>

      <Navbar />

      <main className="flex-1">
        <section className="border-b border-border px-4 py-14 sm:py-20">
          <div className="mx-auto max-w-4xl">
            <div className="mb-6 inline-flex items-center gap-2 border border-primary/40 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary">
              <Cookie className="h-3.5 w-3.5" aria-hidden="true" /> South Africa · ZAR
            </div>
            <h1 className="font-display text-4xl font-bold uppercase tracking-tight sm:text-5xl">
              CBD Edibles in South Africa
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
              Gummies, cookies and infused cubes explained for South African buyers — how servings
              are measured, how long they take to kick in, where they sit legally, and how to order
              with nationwide delivery.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to="/shop">
                  Shop edibles <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/cbd-oil-south-africa">CBD oil guide</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="px-4 py-14">
          <div className="mx-auto grid max-w-4xl gap-6 sm:grid-cols-3">
            {[
              { icon: Cookie, h: "What they are", p: "Food products infused with a measured amount of cannabinoid — gummy cubes, baked cookies and chocolate-style bites, labelled in milligrams per piece." },
              { icon: Clock, h: "Onset & duration", p: "Digestion first means 45–90 minutes before you feel anything, and a longer tail than oils or vapes. Never re-dose inside two hours." },
              { icon: ShieldCheck, h: "Legal position", p: "General-health CBD up to 20 mg per daily dose sits at Schedule 0. THC-infused edibles are labelled separately and are strictly 21+." },
            ].map(({ icon: Icon, h, p }) => (
              <div key={h} className="border border-border p-6">
                <Icon className="mb-3 h-6 w-6 text-primary" aria-hidden="true" />
                <h2 className="font-display mb-2 text-lg font-bold uppercase tracking-wide">{h}</h2>
                <p className="text-sm leading-relaxed text-muted-foreground">{p}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="border-t border-border px-4 py-14">
          <div className="mx-auto max-w-4xl">
            <h2 className="font-display text-2xl font-bold uppercase tracking-tight">
              Types of edibles and how they're dosed
            </h2>
            <div className="mt-6 overflow-x-auto">
              <table className="w-full border border-border text-left text-sm">
                <thead>
                  <tr className="bg-muted/40">
                    <th className="border-b border-border p-3 font-display uppercase tracking-wide">Type</th>
                    <th className="border-b border-border p-3 font-display uppercase tracking-wide">Typical strength</th>
                    <th className="border-b border-border p-3 font-display uppercase tracking-wide">Notes</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  <tr>
                    <td className="border-b border-border p-3">Gummies / infused cubes</td>
                    <td className="border-b border-border p-3">Sold per tub or per piece</td>
                    <td className="border-b border-border p-3">Easy to split; the most predictable way to start small.</td>
                  </tr>
                  <tr>
                    <td className="border-b border-border p-3">Baked goods (cookies, brownies)</td>
                    <td className="border-b border-border p-3">Per cookie or per pack</td>
                    <td className="border-b border-border p-3">Strength can vary piece to piece — start with a quarter.</td>
                  </tr>
                  <tr>
                    <td className="p-3">Drinks and infusions</td>
                    <td className="p-3">Per bottle</td>
                    <td className="p-3">Faster than baked goods, still slower than oil under the tongue.</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="mt-6 space-y-4 leading-relaxed text-muted-foreground">
              <h3 className="font-display pt-2 text-lg font-bold uppercase tracking-wide text-foreground">
                What to check before buying
              </h3>
              <ul className="list-disc space-y-2 pl-5">
                <li>Milligrams per piece and per pack, printed on the label.</li>
                <li>Whether the product is CBD or THC infused — they are not interchangeable.</li>
                <li>A batch certificate of analysis showing cannabinoid content.</li>
                <li>A South African seller, so you pay in Rands and skip customs risk.</li>
                <li>Storage: keep edibles sealed, cool and well away from children and pets.</li>
              </ul>
              <p>
                We don't make health claims about these products. If you're pregnant,
                breastfeeding, or on chronic medication, speak to a healthcare professional first.
              </p>
            </div>
          </div>
        </section>

        {edibles.length > 0 && (
          <section className="border-t border-border px-4 py-14">
            <div className="mx-auto max-w-5xl">
              <h2 className="font-display text-2xl font-bold uppercase tracking-tight">
                Edibles in our shop
              </h2>
              <p className="mt-2 text-muted-foreground">
                Infused edibles in stock now, delivered across South Africa.
              </p>
              <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {edibles.map((p) => (
                  <li key={p.id} className="border border-border">
                    <Link to={`/product/${p.id}`} className="block">
                      <img
                        src={p.image}
                        alt={`${p.name} — infused edible available in South Africa`}
                        loading="lazy"
                        className="aspect-[4/3] w-full object-cover"
                      />
                      <div className="p-4">
                        <h3 className="font-display text-sm font-bold uppercase tracking-wide">{p.name}</h3>
                        <p className="mt-1 text-sm text-primary">R{p.price}</p>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        <section className="border-t border-border px-4 py-14">
          <div className="mx-auto max-w-4xl">
            <h2 className="font-display text-2xl font-bold uppercase tracking-tight">
              Edibles questions, answered
            </h2>
            <dl className="mt-6 space-y-6">
              {faqs.map((f) => (
                <div key={f.q} className="border border-border p-6">
                  <dt className="font-display text-base font-bold uppercase tracking-wide">{f.q}</dt>
                  <dd className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.a}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-10 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to="/shop">
                  Browse the shop <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/cbd-oil-south-africa">
                  <Truck className="mr-2 h-4 w-4" aria-hidden="true" /> CBD oil guide
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
