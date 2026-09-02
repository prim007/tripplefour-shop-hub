import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import SponsorInquiryForm from "@/components/SponsorInquiryForm";
import { ExternalLink, Star, Check, Mail } from "lucide-react";
import Navbar from "@/components/Navbar";
import FloatingLeaves from "@/components/FloatingLeaves";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { affiliates } from "@/data/affiliates";
import { Analytics } from "@/lib/analytics";

export default function Partners() {
  const handleClick = (id: string, name: string, url: string) => {
    Analytics.affiliateClick(id, name, url);
  };

  return (
    <div className="relative flex min-h-screen flex-col">
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
      <FloatingLeaves />
      <Navbar />
      <main className="relative z-10 flex-1 px-4 py-12">
        <div className="mx-auto max-w-5xl">
          {/* Header */}
          <div className="mb-10 text-center">
            <h1 className="font-display text-4xl font-bold">
              <span className="text-primary">Tripplefour CBD Partners and Sponsorships</span>
            </h1>
            <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
              Trusted brands we proudly work with.
            </p>
          </div>

          {/* Partner cards */}
          <h2 className="sr-only">Trusted Partner Brands</h2>
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

          {/* What You Get */}
          <div className="mb-16">
            <div className="mb-8 text-center">
              <h2 className="font-display text-3xl font-bold">
                <span className="text-primary">What You Get As A Partner</span>
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
                We're selective about who we work with. Approved partners get real estate on our site, direct customer reach, and a seamless ordering flow.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {[
                {
                  title: "Your Products On Our Site",
                  desc: "Full listings with images, descriptions, pricing and category placement — visible to our entire customer base.",
                },
                {
                  title: "Your Own Dedicated Page",
                  desc: "A branded partner page showcasing your story, product range and unique selling points — like our Dirty Vapes and Lëf Labs pages.",
                },
                {
                  title: "Direct WhatsApp Integration",
                  desc: "Customers can message you directly through a WhatsApp button on your page — no middleman, no delay, real conversations.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="flex flex-col rounded-2xl border-2 border-border bg-card p-6"
                >
                  <Check className="h-6 w-6 text-primary" />
                  <h3 className="mt-3 font-display text-lg font-bold">{item.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Partnership Rules & Requirements */}
          <div className="mb-16">
            <h2 className="font-display text-2xl font-bold mb-6 text-center">
              <span className="text-primary">Partnership Rules &amp; Requirements</span>
            </h2>
            <div className="space-y-4 text-sm text-muted-foreground leading-relaxed rounded-2xl border border-border bg-card p-6">
              <p><strong className="text-foreground">1. Samples First — Non-Negotiable:</strong> Before any product is listed on Tripplefour, suppliers must send us physical samples of every item they want featured. We test, review and verify quality in-house. No samples, no listing.</p>
              <p><strong className="text-foreground">2. Product Rules &amp; Documentation:</strong> Partners must provide full product information — ingredients, THC/CBD content, dosage guidelines, lab reports (COAs where applicable), usage instructions, storage requirements, and any warnings or contraindications. Incomplete submissions will be returned.</p>
              <p><strong className="text-foreground">3. Compliance:</strong> All products must comply with South African law and advertising standards. Products aimed at anyone under 21, unregulated pharmaceuticals, or anything misrepresented will be rejected outright.</p>
              <p><strong className="text-foreground">4. Quality &amp; Consistency:</strong> The samples you send must match the product customers receive. Any deviation in quality, potency or presentation will result in immediate removal from the platform.</p>
              <p><strong className="text-foreground">5. Fulfilment &amp; WhatsApp Response:</strong> Partners are responsible for fulfilling orders and responding to WhatsApp enquiries in a reasonable time frame (within 24 hours during business days). Slow or absent responses will affect your placement.</p>
              <p><strong className="text-foreground">6. Brand Representation:</strong> Partners may not imply endorsement by Tripplefour beyond the agreed placement. Use of our logo or brand name requires prior written approval.</p>
              <p><strong className="text-foreground">7. Liability:</strong> Tripplefour is not liable for the performance, quality, or legality of any partner products or services. Partners are solely responsible for their own offerings and compliance with applicable laws.</p>
              <p><strong className="text-foreground">8. Removal Rights:</strong> Tripplefour reserves the right to remove any partner, product or page at any time for breach of these rules, customer complaints, or brand-fit reasons.</p>
              <p><strong className="text-foreground">9. Modifications:</strong> These partnership rules may be updated at any time. Active partners will be notified of any material changes via email.</p>
              <p className="text-xs pt-2 border-t border-border">By submitting an inquiry below, you acknowledge that you have read and agree to these partnership rules and requirements.</p>
            </div>
          </div>

          {/* Partnership Disclosure */}
          <div className="mb-16 rounded-2xl border border-border bg-card p-6">
            <h2 className="font-display text-xl font-bold mb-3 text-center">
              <span className="text-primary">A Note on Marketing &amp; Advertising</span>
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed text-center max-w-3xl mx-auto">
              Building visibility for new products takes time and collaboration. We will work hand in hand with you to understand your brand and find the best way to present it to our audience. If additional paid advertising is required to push products further, this can be arranged separately — at the cost of your company — to help reach more people faster.
            </p>
          </div>

          {/* Sponsor Inquiry Form */}
          <div className="rounded-2xl border-2 border-dashed border-primary/30 bg-primary/5 p-8 text-center">
            <h3 className="font-display text-xl font-bold">
              Want to work with us?
            </h3>
            <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">
              Fill in the form below or email us directly at{" "}
              <a href="mailto:support@tripplefourshophub.online" className="font-semibold text-primary hover:underline">
                support@tripplefourshophub.online
              </a>
              . We'll reply within 48 hours with next steps for sending your samples.
            </p>
            <a
              href="mailto:support@tripplefourshophub.online?subject=Tripplefour%20Partnership%20Inquiry"
              className="mt-4 inline-flex items-center gap-2 rounded-full border border-primary/40 bg-background px-4 py-2 text-sm font-semibold text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
            >
              <Mail className="h-4 w-4" /> support@tripplefourshophub.online
            </a>
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
