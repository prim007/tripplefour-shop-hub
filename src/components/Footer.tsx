import { Leaf, MessageCircle, Instagram, Facebook, Youtube, Music2, Twitter } from "lucide-react";
import { Link } from "react-router-dom";

const socials = [
  { href: "https://www.instagram.com/tripple444canny", label: "Instagram", Icon: Instagram },
  { href: "https://www.tiktok.com/@tripple444canny", label: "TikTok", Icon: Music2 },
  { href: "https://www.facebook.com/tripple444canny", label: "Facebook", Icon: Facebook },
  { href: "https://x.com/tripple444canny", label: "X (Twitter)", Icon: Twitter },
  { href: "https://www.youtube.com/@tripple444canny", label: "YouTube", Icon: Youtube },
];

export default function Footer() {
  return (
    <footer className="border-t bg-card relative overflow-hidden">
      {/* Decorative peace sign */}
      <div className="pointer-events-none absolute -right-10 -bottom-10 text-[180px] opacity-[0.03] animate-spin-slow">☮</div>

      <div className="mx-auto max-w-7xl px-4 py-12 relative z-10">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <Link to="/" className="flex items-center gap-2 group">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                <Leaf className="h-5 w-5 text-primary" />
              </div>
              <span className="font-display text-lg font-bold">Tripplefour</span>
              <span className="text-sm">☮️</span>
            </Link>
            <p className="mt-3 text-sm text-muted-foreground">
              Dispensery we deliver allover. Premium cannabis health products. Stay groovy 🌿
            </p>
          </div>
          <div>
            <h4 className="font-display text-sm font-semibold">Quick Links</h4>
            <nav className="mt-3 flex flex-col gap-2">
              <Link to="/shop" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Shop All</Link>
              <Link to="/cart" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Cart</Link>
              <Link to="/blog" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Blog</Link>
              <Link to="/affiliate" className="text-sm text-primary hover:text-foreground transition-colors font-medium">Become an Affiliate 💸</Link>
            </nav>
          </div>
          <div>
            <h4 className="font-display text-sm font-semibold">Legal</h4>
            <nav className="mt-3 flex flex-col gap-2">
              <Link to="/privacy-policy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</Link>
              <Link to="/terms-of-service" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Terms of Service</Link>
            </nav>
          </div>
          <div>
            <h4 className="font-display text-sm font-semibold">Contact</h4>
            <a
              href="https://wa.me/27645436734"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm text-primary transition-all hover:bg-primary/5 hover:scale-105"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp Us ✌️
            </a>
            <div className="mt-4">
              <h4 className="font-display text-sm font-semibold mb-2">Follow @tripple444canny</h4>
              <div className="flex flex-wrap gap-2">
                {socials.map(({ href, label, Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    title={label}
                    className="flex h-9 w-9 items-center justify-center rounded-full border text-muted-foreground transition-all hover:text-primary hover:bg-primary/5 hover:scale-110"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t pt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Tripplefour. All rights reserved. ☮️ Peace, Love & Cannabis 🌿
        </div>
      </div>
    </footer>
  );
}
