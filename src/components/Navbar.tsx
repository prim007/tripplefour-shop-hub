import { Link } from "react-router-dom";
import { Menu, ExternalLink, User, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useState } from "react";
import GeoBanner from "@/components/GeoBanner";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop" },
  { to: "/blog", label: "Blog" },
  { to: "/partners", label: "Partners" },
  { to: "/affiliate", label: "Earn 💸" },
  { to: "/donations", label: "Donate" },
];

export default function Navbar() {
  const { user, signOut } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/70 backdrop-blur-xl supports-[backdrop-filter]:bg-background/40">
      <GeoBanner />
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="font-display text-lg sm:text-xl font-bold tracking-tight uppercase text-foreground">
            Tripple<span className="text-primary">four</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="px-3 py-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
          <a
            href="https://cuddles-ai.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 px-3 py-2 text-xs font-semibold uppercase tracking-widest text-primary transition-colors hover:text-primary-glow"
          >
            Cuddles AI <ExternalLink className="h-3 w-3" />
          </a>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="ml-1" aria-label="Account menu">
                  <User className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem className="text-xs text-muted-foreground cursor-default">
                  {user.email}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => signOut()} className="text-destructive">
                  <LogOut className="h-3.5 w-3.5 mr-1.5" /> Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/auth">
              <Button variant="ghost" size="sm" className="ml-1 text-xs uppercase tracking-widest">
                Sign In
              </Button>
            </Link>
          )}

        </nav>

        {/* Mobile nav */}
        <div className="flex items-center gap-1 md:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open navigation menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 bg-background">
              <nav className="mt-10 flex flex-col gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setOpen(false)}
                    className="border-b border-border/60 py-4 text-base font-display font-semibold uppercase tracking-widest text-foreground transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                ))}
                <a
                  href="https://cuddles-ai.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-1 border-b border-border/60 py-4 text-base font-display font-semibold uppercase tracking-widest text-primary"
                >
                  Cuddles AI <ExternalLink className="h-4 w-4" />
                </a>
                {user ? (
                  <>
                    <div className="py-2 text-xs text-muted-foreground truncate">{user.email}</div>
                    <button
                      onClick={() => { signOut(); setOpen(false); }}
                      className="flex items-center gap-1.5 py-4 text-base font-display font-semibold uppercase tracking-widest text-destructive"
                    >
                      <LogOut className="h-4 w-4" /> Sign out
                    </button>
                  </>
                ) : (
                  <Link
                    to="/auth"
                    onClick={() => setOpen(false)}
                    className="py-4 text-base font-display font-semibold uppercase tracking-widest text-primary"
                  >
                    Sign In
                  </Link>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
