import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import SponsorInquiryForm from "@/components/SponsorInquiryForm";
import { ExternalLink, Star, Check } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { affiliates, sponsorTiers } from "@/data/affiliates";
import { Analytics } from "@/lib/analytics";

type Currency = "ZAR" | "USD" | "EUR" | "GBP";
const currencySymbols: Record<Currency, string> = {
  ZAR: "R",
  USD: "$",
  EUR: "€",
  GBP: "£",
};

export default function Partners() {
  const [currency, setCurrency] = useState<Currency>("ZAR");

  const getPrice = (tier: (typeof sponsorTiers)[0]) => {
    switch (currency) {
      case "USD": return tier.priceUSD;
      case "EUR": return tier.priceEUR;
      case "GBP": return tier.priceGBP;
      default: return tier.priceZAR;
    }
  };

  const handleClick = (id: string, name: string, url: string) => {
    Analytics.affiliateClick(id, name, url);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Helmet>
        <title>Partners & Sponsors | Tripplefour</title>
        <meta name="description" content="Partner with Tripplefour — South Africa's growing CBD infused products brand. Explore sponsorship tiers and affiliate opportunities." />
        <link rel="canonical" href="https://tripplefourshophub.online/partners" />
        <meta property="og:title" content="Partners & Sponsors | Tripplefour" />
        <meta property="og:description" content="Partner with Tripplefour — sponsorship tiers and affiliate opportunities for SA brands." />
        <meta property="og:url" content="https://tripplefourshophub.online/partners" />
        <meta property="og:title" content="Partners & Sponsors | Tripplefour" />
        <meta property="og:description" content="Partner with Tripplefour — South Africa's growing CBD brand. Sponsorship tiers & affiliate opportunities." />
        <meta property="og:url" content="https://tripplefourshophub.online/partners" />
      </Helmet>
      <Navbar />
      <main className="flex-1 px-4 py-12">
        <div className="mx-auto max-w-5xl">
          {/* Header */}
          <div className="mb-10 text-center">
            <h1 className="font-display text-4xl font-bold">
              <span className="text-primary">Our Partners</span>
            </h1>
            <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
              Trusted brands we proudly work with.
            </p>
          </div>

          {/* Partner cards */}
          <div className="mb-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {affiliates.map((item) => {
              const isInternal = item.url.startsWith("/");
              const cardClass =
                "group relative flex flex-col justify-between rounded-2xl border-2 border-border bg-card p-6 transition-all duration-300 hover:border-primary hover:shadow-lg hover:-translate-y-1";
              const inner = (
                <>
                {item.featured && (
                  <Badge className="absolute -top-2.5 right-4 gap-1 bg-accent text-accent-foreground">
                    <Star className="h-3 w-3" /> Featured
                  </Badge>
                )}
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    {item.category}
                  </p>
                  <h3 className="mt-1 font-display text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                    {item.name}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </div>
                <div className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                  {item.cta} <ExternalLink className="h-3.5 w-3.5" />
                </div>
                </>
              );
              return isInternal ? (
                <Link
                  key={item.id}
                  to={item.url}
                  onClick={() => handleClick(item.id, item.name, item.url)}
                  className={cardClass}
                >
                  {inner}
                </Link>
              ) : (
                <a
                  key={item.id}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  onClick={() => handleClick(item.id, item.name, item.url)}
                  className={cardClass}
                >
                  {inner}
                </a>
              );
            })}
          </div>

          {/* Sponsorship Pricing */}
          <div className="mb-16">
            <div className="mb-8 text-center">
              <h2 className="font-display text-3xl font-bold">
                <span className="text-primary">Advertise With Us</span>
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
                Get your brand in front of thousands of CBD enthusiasts monthly.
                Affordable plans for every budget.
              </p>

              {/* Currency selector */}
              <div className="mt-4 inline-flex items-center gap-1 rounded-full border border-border p-1">
                {(["ZAR", "USD", "EUR", "GBP"] as Currency[]).map((c) => (
                  <button
                    key={c}
                    onClick={() => setCurrency(c)}
                    className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                      currency === c
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {sponsorTiers.map((tier) => (
                <div
                  key={tier.name}
                  className={`relative flex flex-col rounded-2xl border-2 p-6 transition-all ${
                    tier.popular
                      ? "border-primary bg-primary/5 shadow-lg scale-[1.02]"
                      : "border-border bg-card"
                  }`}
                >
                  {tier.popular && (
                    <Badge className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground">
                      Most Popular
                    </Badge>
                  )}
                  <h3 className="font-display text-lg font-bold">{tier.name}</h3>
                  <div className="mt-3 flex items-baseline gap-1">
                    <span className="font-display text-4xl font-bold text-primary">
                      {currencySymbols[currency]}{getPrice(tier)}
                    </span>
                    <span className="text-sm text-muted-foreground">{tier.period}</span>
                  </div>
                  <ul className="mt-5 flex-1 space-y-2.5">
                    {tier.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Partnership Terms & Conditions */}
          <div className="mb-16">
            <h2 className="font-display text-2xl font-bold mb-6 text-center">
              <span className="text-primary">Partnership Terms &amp; Conditions</span>
            </h2>
            <div className="space-y-4 text-sm text-muted-foreground leading-relaxed rounded-2xl border border-border bg-card p-6">
              <p><strong className="text-foreground">1. Agreement Duration:</strong> All sponsorship packages run on a month-to-month basis unless a longer term is agreed upon in writing. Either party may cancel with 14 days written notice before the next billing cycle.</p>
              <p><strong className="text-foreground">2. Payment Terms:</strong> Payment is due upfront before your campaign goes live. We accept EFT, PayFast, PayPal, and cryptocurrency. Invoices are issued on request.</p>
              <p><strong className="text-foreground">3. Content Guidelines:</strong> All partner content must comply with South African advertising standards. Tripplefour reserves the right to reject or remove any content that is misleading, offensive, or not aligned with our brand values.</p>
              <p><strong className="text-foreground">4. Brand Representation:</strong> Partners may not imply endorsement by Tripplefour beyond the agreed sponsorship placement. Use of our logo or brand name requires prior written approval.</p>
              <p><strong className="text-foreground">5. Performance &amp; Reporting:</strong> Starter and Growth partners receive basic analytics. Premium partners receive detailed monthly reports including impressions, clicks, and engagement metrics.</p>
              <p><strong className="text-foreground">6. Liability:</strong> Tripplefour is not liable for the performance, quality, or legality of any partner products or services. Partners are solely responsible for their own offerings and compliance with applicable laws.</p>
              <p><strong className="text-foreground">7. Refunds:</strong> Sponsorship fees are non-refundable once the campaign is live. If Tripplefour is unable to deliver the agreed placement, a pro-rata refund or credit will be issued.</p>
              <p><strong className="text-foreground">8. Modifications:</strong> Tripplefour reserves the right to update these partnership terms at any time. Partners will be notified of any material changes via email.</p>
              <p className="text-xs pt-2 border-t border-border">By submitting a sponsor inquiry below, you acknowledge that you have read and agree to these partnership terms.</p>
            </div>
          </div>

          {/* Sponsor Inquiry Form */}
          <div className="rounded-2xl border-2 border-dashed border-primary/30 bg-primary/5 p-8 text-center">
            <h3 className="font-display text-xl font-bold">
              Ready to get started?
            </h3>
            <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">
              Fill in the form below and we'll get back to you within 48 hours
              with everything you need to launch your campaign.
            </p>
            <div className="mt-6">
              <SponsorInquiryForm />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
