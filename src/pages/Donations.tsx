import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Heart, Mail, Home, Vote, Package, Ban } from "lucide-react";

export default function Donations() {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Donations — Give Back With Tripplefour</title>
        <meta
          name="description"
          content="We don't accept money donations yet, but we welcome in-kind donations. Each month our community votes on a home to receive everything donated."
        />
        <link rel="canonical" href="https://tripplefourshophub.online/donations" />
        <meta property="og:title" content="Donations — Give Back With Tripplefour" />
        <meta property="og:description" content="We welcome in-kind donations. Each month our community votes on a home to receive everything donated." />
        <meta property="og:url" content="https://tripplefourshophub.online/donations" />
        <meta property="og:type" content="website" />
      </Helmet>
      <Navbar />

      <main className="mx-auto max-w-4xl px-4 sm:px-6 py-16">
        <header className="text-center mb-14">
          <div className="inline-flex items-center gap-2 border border-primary/40 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary mb-6">
            <Heart className="h-3.5 w-3.5" /> Community Giving
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-bold uppercase tracking-tight">
            Donations
          </h1>
          <p className="mt-5 text-lg text-muted-foreground max-w-2xl mx-auto">
            We're open to donations — just not money. Here's how we give back to
            South African homes in need, one month at a time.
          </p>
        </header>

        <section className="grid gap-6 sm:grid-cols-2 mb-12">
          <div className="border border-border p-6">
            <Ban className="h-6 w-6 text-primary mb-3" />
            <h2 className="font-display text-lg font-bold uppercase tracking-wide mb-2">
              No Cash Donations
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Due to the legal and regulatory matters around monetary donations
              in our industry, we do not accept money at this time. We'd rather
              do this the right way than the fast way.
            </p>
          </div>
          <div className="border border-border p-6">
            <Package className="h-6 w-6 text-primary mb-3" />
            <h2 className="font-display text-lg font-bold uppercase tracking-wide mb-2">
              In-Kind Welcome
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              We happily accept any other form of donation — food, clothing,
              blankets, toiletries, school supplies, toys, furniture, or
              anything else a home might need.
            </p>
          </div>
        </section>

        <section className="border border-primary/30 bg-primary/5 p-8 mb-12">
          <div className="flex items-start gap-4">
            <Vote className="h-8 w-8 text-primary shrink-0 mt-1" />
            <div>
              <h2 className="font-display text-2xl font-bold uppercase tracking-tight mb-3">
                Home of the Month
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Every month our community votes to nominate a home — a shelter,
                orphanage, safe house, or care facility. At the end of the
                month, everything that has been donated to Tripplefour is
                delivered to the winning home.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="font-display text-2xl font-bold uppercase tracking-tight mb-6 flex items-center gap-2">
            <Home className="h-6 w-6 text-primary" /> How It Works
          </h2>
          <ol className="space-y-4">
            {[
              "Nominate a home you believe deserves support by emailing us the details.",
              "The community votes on the shortlist each month.",
              "Drop off or arrange collection of your donated items with our team.",
              "At month-end, we hand-deliver everything to the chosen home and share the update with you.",
            ].map((step, i) => (
              <li key={i} className="flex gap-4 border border-border p-4">
                <span className="font-display text-2xl font-bold text-primary">
                  0{i + 1}
                </span>
                <p className="text-sm text-muted-foreground pt-1 leading-relaxed">
                  {step}
                </p>
              </li>
            ))}
          </ol>
        </section>

        <section className="text-center border-t border-border pt-10">
          <h2 className="font-display text-xl font-bold uppercase tracking-tight mb-3">
            Want to donate or nominate a home?
          </h2>
          <p className="text-muted-foreground mb-6">
            Reach out and we'll arrange the details.
          </p>
          <a
            href="mailto:support@tripplefourshophub.online?subject=Donation%20or%20Home%20Nomination"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 text-sm font-semibold uppercase tracking-widest hover:bg-primary/90 transition-colors"
          >
            <Mail className="h-4 w-4" /> Get In Touch
          </a>
        </section>
      </main>

      <Footer />
    </div>
  );
}