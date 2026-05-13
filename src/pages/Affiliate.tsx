import { useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { toast } from "@/hooks/use-toast";
import { z } from "zod";
import { Sparkles, TrendingUp, ShieldCheck, Zap, Heart } from "lucide-react";

const COMMISSION_PER_VAPE = 58.5;

const applicationSchema = z.object({
  name: z.string().trim().min(2, "Name is too short").max(100),
  email: z.string().trim().email("Invalid email").max(255),
  phone: z.string().trim().max(30).optional().or(z.literal("")),
  social_handle: z.string().trim().min(2, "Required").max(100),
  platforms: z.string().trim().min(2, "Required").max(200),
  follower_count: z.string().trim().max(50).optional().or(z.literal("")),
  audience_description: z.string().trim().max(1000).optional().or(z.literal("")),
});

export default function Affiliate() {
  const [sales, setSales] = useState(20);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    social_handle: "",
    platforms: "",
    follower_count: "",
    audience_description: "",
  });

  const earnings = useMemo(() => sales * COMMISSION_PER_VAPE, [sales]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = applicationSchema.safeParse(form);
    if (!parsed.success) {
      toast({
        title: "Check your details",
        description: parsed.error.issues[0]?.message ?? "Invalid input",
        variant: "destructive",
      });
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("affiliate_applications").insert({
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone || null,
      social_handle: parsed.data.social_handle,
      platforms: parsed.data.platforms,
      follower_count: parsed.data.follower_count || null,
      audience_description: parsed.data.audience_description || null,
    });
    setSubmitting(false);
    if (error) {
      toast({
        title: "Couldn't submit",
        description: "Please try again or DM us on Instagram.",
        variant: "destructive",
      });
      return;
    }
    setSubmitted(true);
    toast({
      title: "🎉 Application received!",
      description: "We'll review and get back to you within 48 hours.",
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet>
        <title>Affiliate Program — Earn R58.50 per Vape | Tripplefour</title>
        <meta
          name="description"
          content="Earn R58.50 commission on every vape sold through your link. Zero inventory, zero risk. Join the Tripple444 affiliate program."
        />
        <link rel="canonical" href="https://tripplefourshophub.online/affiliate" />
        <meta property="og:title" content="Affiliate Program — Earn R58.50 per Vape | Tripplefour" />
        <meta property="og:description" content="Earn R58.50 commission per vape sold. Join the Tripplefour affiliate program." />
        <meta property="og:url" content="https://tripplefourshophub.online/affiliate" />
      </Helmet>

      <Navbar />

      <main className="flex-1">
        {/* HERO */}
        <section className="relative overflow-hidden border-b">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10" />
          <div className="container relative mx-auto px-4 py-16 sm:py-24">
            <div className="mx-auto max-w-3xl text-center space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
                <Sparkles className="h-4 w-4" />
                Affiliate Program
              </div>
              <h1 className="font-display text-4xl font-bold tracking-tight sm:text-6xl">
                Earn <span className="text-primary">R58.50</span> for every vape you sell.
              </h1>
              <p className="text-lg text-muted-foreground sm:text-xl">
                Zero inventory. Zero risk. Just share your link, we handle the rest.
                Built for creators who want passive income from premium products their audience already loves.
              </p>
              <div className="flex flex-wrap justify-center gap-3 pt-4">
                <Button size="lg" asChild>
                  <a href="#apply">Apply now →</a>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <a href="#calculator">See your earnings</a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* BENEFITS */}
        <section className="py-16 sm:py-20">
          <div className="container mx-auto px-4">
            <div className="grid gap-6 sm:grid-cols-3">
              {[
                { icon: ShieldCheck, title: "Zero risk", body: "No inventory, no shipping, no customer service. We handle everything." },
                { icon: TrendingUp, title: "15% commission", body: "R58.50 every time someone buys a vape with your code. Paid monthly." },
                { icon: Zap, title: "Hands-off setup", body: "Get your code in 24h. Drop your link in bio, stories, or DMs." },
              ].map((b) => (
                <div key={b.title} className="rounded-2xl border bg-card p-6 space-y-3">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <b.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-display font-bold text-lg">{b.title}</h3>
                  <p className="text-sm text-muted-foreground">{b.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CALCULATOR */}
        <section id="calculator" className="border-y bg-muted/30 py-16 sm:py-20">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-2xl text-center space-y-3">
              <h2 className="font-display text-3xl font-bold sm:text-4xl">
                How much could you make?
              </h2>
              <p className="text-muted-foreground">
                Slide to estimate your monthly earnings at R58.50 per vape sold.
              </p>
            </div>
            <div className="mx-auto mt-10 max-w-2xl rounded-3xl border bg-card p-6 sm:p-10 shadow-sm">
              <div className="text-center">
                <p className="text-sm uppercase tracking-wider text-muted-foreground">Your monthly payout</p>
                <p className="mt-2 font-display text-5xl font-bold text-primary sm:text-6xl">
                  R{earnings.toLocaleString()}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  from <strong className="text-foreground">{sales}</strong> vape sales
                </p>
              </div>
              <div className="mt-8 space-y-3">
                <Slider
                  value={[sales]}
                  onValueChange={(v) => setSales(v[0])}
                  min={1}
                  max={200}
                  step={1}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>1 sale</span>
                  <span>200 sales</span>
                </div>
              </div>
              <div className="mt-6 grid grid-cols-3 gap-3 text-center">
                {[10, 50, 100].map((n) => (
                  <button
                    key={n}
                    onClick={() => setSales(n)}
                    className="rounded-xl border bg-background p-3 text-sm hover:border-primary transition"
                  >
                    <div className="font-bold">{n} sales</div>
                    <div className="text-xs text-muted-foreground">R{(n * COMMISSION_PER_VAPE).toLocaleString()}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* APPLY */}
        <section id="apply" className="py-16 sm:py-20">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-xl">
              <div className="text-center space-y-3 mb-8">
                <h2 className="font-display text-3xl font-bold sm:text-4xl">Apply to join</h2>
                <p className="text-muted-foreground">
                  Tell us about your audience. We approve creators within 48 hours.
                </p>
              </div>

              {submitted ? (
                <div className="rounded-2xl border bg-card p-8 text-center space-y-3">
                  <Heart className="mx-auto h-10 w-10 text-primary" />
                  <h3 className="font-display text-xl font-bold">Application received!</h3>
                  <p className="text-sm text-muted-foreground">
                    We'll review and email you within 48 hours with your code and dashboard link.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="rounded-2xl border bg-card p-6 sm:p-8 space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label htmlFor="name">Name *</Label>
                      <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} maxLength={100} required />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="email">Email *</Label>
                      <Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} maxLength={255} required />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="phone">WhatsApp / Phone</Label>
                    <Input id="phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} maxLength={30} />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label htmlFor="social_handle">Main handle *</Label>
                      <Input id="social_handle" placeholder="@yourname" value={form.social_handle} onChange={(e) => setForm({ ...form, social_handle: e.target.value })} maxLength={100} required />
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="follower_count">Followers</Label>
                      <Input id="follower_count" placeholder="e.g. 12k" value={form.follower_count} onChange={(e) => setForm({ ...form, follower_count: e.target.value })} maxLength={50} />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="platforms">Platforms *</Label>
                    <Input id="platforms" placeholder="Instagram, TikTok, X..." value={form.platforms} onChange={(e) => setForm({ ...form, platforms: e.target.value })} maxLength={200} required />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="audience_description">Tell us about your audience</Label>
                    <Textarea id="audience_description" rows={4} placeholder="Who follows you? What kind of content do you make?" value={form.audience_description} onChange={(e) => setForm({ ...form, audience_description: e.target.value })} maxLength={1000} />
                  </div>
                  <Button type="submit" disabled={submitting} className="w-full" size="lg">
                    {submitting ? "Submitting..." : "Submit application"}
                  </Button>
                  <p className="text-center text-xs text-muted-foreground">
                    Must be 21+ and based in South Africa.
                  </p>
                </form>
              )}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="border-t bg-muted/30 py-16 sm:py-20">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-2xl">
              <h2 className="font-display text-3xl font-bold sm:text-4xl text-center mb-8">
                Questions
              </h2>
              <Accordion type="single" collapsible className="space-y-2">
                {[
                  {
                    q: "How much do I earn per sale?",
                    a: "R58.50 on every vape (R390) and R48 on every oil (R320) sold through your code or link — that's a flat 15% commission.",
                  },
                  {
                    q: "When and how do I get paid?",
                    a: "Payouts go out monthly via EFT once an order is paid and confirmed. You'll see real-time totals in your dashboard.",
                  },
                  {
                    q: "Do I need to buy or hold any stock?",
                    a: "No. Zero inventory. We ship and handle customer service. You only share your link.",
                  },
                  {
                    q: "How do I track my sales?",
                    a: "Once approved, you get a unique code (e.g. JANE15) and a link like tripplefourshophub.online/?ref=JANE15. Every order made through it is automatically attributed to you.",
                  },
                  {
                    q: "Who can apply?",
                    a: "Creators 21+ based in South Africa with an engaged audience. Niche size matters less than relevance — wellness, lifestyle, music, and nightlife creators do best.",
                  },
                  {
                    q: "How long until I'm approved?",
                    a: "We review every application within 48 hours and email you with your code if approved.",
                  },
                ].map((item, i) => (
                  <AccordionItem key={i} value={`item-${i}`} className="rounded-xl border bg-card px-4">
                    <AccordionTrigger className="text-left font-medium">{item.q}</AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground">{item.a}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}