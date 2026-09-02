import { MessageCircle, Instagram, Facebook, Youtube, Music2, Twitter } from "lucide-react";
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
    <footer className="border-t border-border/60 bg-background relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-14 relative z-10">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <Link to="/" className="flex items-center gap-2 group">
              <span className="font-display text-xl font-bold uppercase tracking-tight">
                Tripple<span className="text-primary">four</span>
              </span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground max-w-xs">
              Premium CBD infused products. Discreet delivery across South Africa.
            </p>
          </div>
          <div>
            <h3 className="font-display text-xs uppercase tracking-widest text-muted-foreground">Shop</h3>
            <nav className="mt-4 flex flex-col gap-2.5">
              <Link to="/shop" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Shop All</Link>
              <Link to="/cart" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Cart</Link>
              <Link to="/blog" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Blog</Link>
              <Link to="/cbd-oil-south-africa" className="text-sm text-muted-foreground hover:text-foreground transition-colors">CBD Oil South Africa</Link>
              <Link to="/affiliate" className="text-sm text-primary hover:text-primary-glow transition-colors font-medium">Become an Affiliate</Link>
            </nav>
          </div>
          <div>
            <h3 className="font-display text-xs uppercase tracking-widest text-muted-foreground">Legal</h3>
            <nav className="mt-4 flex flex-col gap-2.5">
              <Link to="/privacy-policy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</Link>
              <Link to="/terms-of-service" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Terms of Service</Link>
            </nav>
          </div>
          <div>
            <h3 className="font-display text-xs uppercase tracking-widest text-muted-foreground">Contact</h3>
            <a
              href="https://wa.me/27645436734"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 border border-border px-4 py-2 text-sm text-foreground transition-colors hover:border-primary hover:text-primary"
            >
              <MessageCircle className="h-4 w-4" /> WhatsApp Us
            </a>
            <div className="mt-5">
              <h3 className="font-display text-xs uppercase tracking-widest text-muted-foreground mb-3">Follow</h3>
              <div className="flex flex-wrap gap-2">
                {socials.map(({ href, label, Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    title={label}
                    className="flex h-9 w-9 items-center justify-center border border-border text-muted-foreground transition-colors hover:text-primary hover:border-primary"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-border/60 pt-6 text-center text-xs text-muted-foreground tracking-wider">
          © 2025 TRIPPLEFOUR · ALL RIGHTS RESERVED
        </div>
      </div>
    </footer>
  );
}
