import { useState } from "react";
import { ExternalLink, Star, Filter } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  affiliates,
  affiliateCategories,
  type AffiliateCategory,
} from "@/data/affiliates";
import { Analytics } from "@/lib/analytics";

export default function Partners() {
  const [activeCategory, setActiveCategory] = useState<AffiliateCategory | "All">("All");

  const filtered =
    activeCategory === "All"
      ? affiliates
      : affiliates.filter((a) => a.category === activeCategory);

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
              <span className="groovy-gradient-text">Recommended Tools & Partners</span>
            </h1>
            <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
              Hand-picked products, platforms, and gear trusted by cultivators,
              dispensaries, and enthusiasts worldwide.
            </p>
          </div>

          {/* Category filter */}
          <div className="mb-8 flex flex-wrap items-center justify-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Button
              variant={activeCategory === "All" ? "default" : "outline"}
              size="sm"
              className="rounded-full"
              onClick={() => setActiveCategory("All")}
            >
              All
            </Button>
            {affiliateCategories.map((cat) => (
              <Button
                key={cat}
                variant={activeCategory === cat ? "default" : "outline"}
                size="sm"
                className="rounded-full"
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </Button>
            ))}
          </div>

          {/* Grid */}
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((item) => (
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

          {/* Sponsor CTA */}
          <div className="mt-16 rounded-2xl border-2 border-dashed border-primary/30 bg-primary/5 p-8 text-center">
            <h3 className="font-display text-xl font-bold">
              Want your brand featured here?
            </h3>
            <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">
              We offer sponsored placements, banner ads, and content
              partnerships. Reach thousands of cannabis enthusiasts monthly.
              Fill in the form below and we'll get back to you within 48 hours.
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
