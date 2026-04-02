import { useState } from "react";
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
      <Navbar />
      <main className="flex-1 px-4 py-12">
        <div className="mx-auto max-w-5xl">
          {/* Header */}
          <div className="mb-10 text-center">
            <h1 className="font-display text-4xl font-bold">
              <span className="groovy-gradient-text">Our Partners</span>
            </h1>
            <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
              Trusted brands we proudly work with.
            </p>
          </div>

          {/* Partner cards */}
          <div className="mb-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {affiliates.map((item) => (
              <a
                key={item.id}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer nofollow"
                onClick={() => handleClick(item.id, item.name, item.url)}
                className="group relative flex flex-col justify-between rounded-2xl border-2 border-border bg-card p-6 transition-all duration-300 hover:border-primary hover:shadow-lg hover:-translate-y-1"
              >
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
              </a>
            ))}
          </div>

          {/* Sponsorship Pricing */}
          <div className="mb-16">
            <div className="mb-8 text-center">
              <h2 className="font-display text-3xl font-bold">
                <span className="groovy-gradient-text">Advertise With Us</span>
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
                Get your brand in front of thousands of cannabis enthusiasts monthly.
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
