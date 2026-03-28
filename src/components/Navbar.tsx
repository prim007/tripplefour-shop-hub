import { Link } from "react-router-dom";
import { ShoppingCart, Menu, Leaf, ExternalLink, User, LogOut } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useState } from "react";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop" },
  { to: "/blog", label: "Blog" },
  { to: "/cart", label: "Cart" },
];

export default function Navbar() {
  const { totalItems } = useCart();
  const { user, signOut } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 transition-colors group-hover:bg-primary/20">
            <Leaf className="h-5 w-5 text-primary animate-wiggle" />
          </div>
          <span className="font-display text-xl font-bold tracking-tight text-foreground">
            Tripplefour
          </span>
          <span className="text-xs">☮️</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-all hover:text-foreground hover:bg-primary/5"
            >
              {link.label}
            </Link>
          ))}
          <a
            href="https://cuddles-ai.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium text-primary transition-all hover:bg-primary/5"
          >
            Cuddles AI <ExternalLink className="h-3 w-3" />
          </a>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="rounded-full ml-1">
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
              <Button variant="outline" size="sm" className="rounded-full ml-1">
                Sign In
              </Button>
            </Link>
          )}

          <Link to="/cart" className="relative ml-2">
            <Button variant="outline" size="icon" className="rounded-full transition-transform hover:scale-110">
              <ShoppingCart className="h-5 w-5" />
            </Button>
            {totalItems > 0 && (
              <Badge className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full p-0 text-[10px] animate-groovy-pulse">
                {totalItems}
              </Badge>
            )}
          </Link>
        </nav>

        {/* Mobile nav */}
        <div className="flex items-center gap-2 md:hidden">
          <Link to="/cart" className="relative">
            <Button variant="outline" size="icon" className="rounded-full">
              <ShoppingCart className="h-5 w-5" />
            </Button>
            {totalItems > 0 && (
              <Badge className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full p-0 text-[10px]">
                {totalItems}
              </Badge>
            )}
          </Link>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64">
              <nav className="mt-8 flex flex-col gap-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setOpen(false)}
                    className="rounded-xl px-4 py-3 text-lg font-display font-medium text-foreground transition-colors hover:bg-primary/5"
                  >
                    {link.label}
                  </Link>
                ))}
                <a
                  href="https://cuddles-ai.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-1 rounded-xl px-4 py-3 text-lg font-display font-medium text-primary"
                >
                  Cuddles AI <ExternalLink className="h-4 w-4" />
                </a>
                {user ? (
                  <>
                    <div className="px-4 py-2 text-xs text-muted-foreground truncate">{user.email}</div>
                    <button
                      onClick={() => { signOut(); setOpen(false); }}
                      className="flex items-center gap-1.5 rounded-xl px-4 py-3 text-lg font-display font-medium text-destructive hover:bg-destructive/5"
                    >
                      <LogOut className="h-4 w-4" /> Sign out
                    </button>
                  </>
                ) : (
                  <Link
                    to="/auth"
                    onClick={() => setOpen(false)}
                    className="rounded-xl px-4 py-3 text-lg font-display font-medium text-primary hover:bg-primary/5"
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
