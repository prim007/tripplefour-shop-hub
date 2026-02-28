import { Leaf, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t bg-card">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <Link to="/" className="flex items-center gap-2">
              <Leaf className="h-6 w-6 text-primary" />
              <span className="font-display text-lg font-bold">Tripplefour</span>
            </Link>
            <p className="mt-3 text-sm text-muted-foreground">
              Dispensery we deliver allover. Premium cannabis health products.
            </p>
          </div>
          <div>
            <h4 className="font-display text-sm font-semibold">Quick Links</h4>
            <nav className="mt-3 flex flex-col gap-2">
              <Link to="/shop" className="text-sm text-muted-foreground hover:text-foreground">Shop All</Link>
              <Link to="/cart" className="text-sm text-muted-foreground hover:text-foreground">Cart</Link>
            </nav>
          </div>
          <div>
            <h4 className="font-display text-sm font-semibold">Contact</h4>
            <a
              href="https://wa.me/27645436734"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-2 text-sm text-primary hover:underline"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp Us
            </a>
          </div>
        </div>
        <div className="mt-8 border-t pt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Tripplefour. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
