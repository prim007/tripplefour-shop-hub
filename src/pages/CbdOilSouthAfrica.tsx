import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Leaf, ShieldCheck, Truck, Droplet, ArrowRight } from "lucide-react";
import { products } from "@/data/products";

const URL = "https://tripplefourshophub.online/cbd-oil-south-africa";
const TITLE = "CBD Oil South Africa — Buy Online, Legal Guide | Tripplefour";
const DESC =
  "CBD oil in South Africa: what it is, how it's dosed, the legal position under Schedule 0, and where to buy CBD products online with nationwide delivery in ZAR.";

const faqs = [
  {
    q: "Is CBD oil legal in South Africa?",
    a: "Yes, within limits. Low-dose CBD preparations were excluded from the stricter schedules by the Department of Health, so general-health CBD products containing a maximum daily dose of 20 mg CBD are sold as Schedule 0. Higher-dose or medicinal-claim products fall under Schedule 4 and need a prescription. Always check the label and the certificate of analysis.",
  },
  {
    q: "How much CBD oil should I take?",
    a: "Start low and go slow. Many first-time users begin at the low end of the label's serving, hold it under the tongue, and stay on that amount for several days before adjusting. Speak to a healthcare professional if you take chronic medication.",
  },
  {
    q: "Will CBD oil make me high?",
    a: "CBD is non-intoxicating. Products sold as general-health CBD in South Africa are limited to trace THC, so they don't produce the high associated with THC products.",
  },
  {
    q: "Do you deliver CBD across South Africa?",
    a: "Yes. Tripplefour delivers nationwide across South Africa, priced in Rands. Delivery fees start at R70 and are calculated by distance at checkout. You must be 21 or older to order.",
  },
];

export default function CbdOilSouthAfrica() {
  const related = products.filter((p) => p.category === "CBD Products" || p.category === "Edibles").slice(0, 4);

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
      { "@type": "ListItem", position: 2, name: "CBD Oil South Africa", item: URL },
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
              <Leaf className="h-3.5 w-3.5" aria-hidden="true" /> South Africa · ZAR
            </div>
            <h1 className="font-display text-4xl font-bold uppercase tracking-tight sm:text-5xl">
              CBD Oil in South Africa
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
              A plain-language guide to CBD oil for South African buyers — what it is, how it's
              dosed, where it sits legally, and how to order CBD products from Tripplefour with
              nationwide delivery.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to="/shop">
                  Shop CBD products <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/blog">Read the blog</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="px-4 py-14">
          <div className="mx-auto grid max-w-4xl gap-6 sm:grid-cols-3">
            {[
              { icon: Droplet, h: "What it is", p: "CBD (cannabidiol) is a non-intoxicating compound from the cannabis plant, usually carried in an oil and taken sublingually or added to edibles." },
              { icon: ShieldCheck, h: "Legal position", p: "General-health CBD up to 20 mg per daily dose is sold as Schedule 0 in South Africa. Higher-dose and medicinal-claim products need a prescription." },
              { icon: Truck, h: "Getting it", p: "We ship nationwide in South Africa. Delivery is quoted by distance from R70 and everything is priced in Rands. Buyers must be 21+." },
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
              How South Africans use CBD oil
            </h2>
            <div className="mt-5 space-y-4 text-muted-foreground leading-relaxed">
              <p>
                CBD oil is most often taken sublingually — a measured serving held under the tongue
                for roughly a minute before swallowing. People also mix it into food or drink, though
                that slows onset. Because everyone responds differently, the usual approach is to
                start at the lowest serving on the label and keep it constant for several days before
                deciding whether to adjust.
              </p>
              <p>
                CBD is not a medicine unless it is registered as one. We don't make health claims
                about our products. If you're pregnant, breastfeeding, or on chronic medication,
                speak to a healthcare professional before starting.
              </p>
              <h3 className="font-display pt-2 text-lg font-bold uppercase tracking-wide text-foreground">
                What to check before buying
              </h3>
              <ul className="list-disc space-y-2 pl-5">
                <li>A certificate of analysis (COA) for the batch, showing cannabinoid content.</li>
                <li>The stated CBD milligrams per serving, and the total per bottle or pack.</li>
                <li>THC content — general-health CBD products are limited to trace amounts.</li>
                <li>A South African seller, so you avoid customs problems and pay in Rands.</li>
              </ul>
            </div>
          </div>
        </section>

        {related.length > 0 && (
          <section className="border-t border-border px-4 py-14">
            <div className="mx-auto max-w-5xl">
              <h2 className="font-display text-2xl font-bold uppercase tracking-tight">
                CBD products in our shop
              </h2>
              <p className="mt-2 text-muted-foreground">
                Browse CBD-infused products available for delivery across South Africa.
              </p>
              <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {related.map((p) => (
                  <li key={p.id} className="border border-border">
                    <Link to={`/product/${p.id}`} className="block">
                      <img
                        src={p.image}
                        alt={`${p.name} — CBD product available in South Africa`}
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
              CBD oil questions, answered
            </h2>
            <dl className="mt-6 space-y-6">
              {faqs.map((f) => (
                <div key={f.q} className="border border-border p-6">
                  <dt className="font-display text-base font-bold uppercase tracking-wide">{f.q}</dt>
                  <dd className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.a}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-10">
              <Button asChild size="lg">
                <Link to="/shop">
                  Browse the shop <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
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
