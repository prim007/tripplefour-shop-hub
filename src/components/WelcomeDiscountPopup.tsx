import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { X, Sparkles, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { trackEvent } from "@/lib/analytics";

const STORAGE_KEY = "welcome-popup-dismissed";
const PROMO_CODE = "WELCOME10";
const DISCOUNT = 10;
const TIMER_MS = 20_000;

export default function WelcomeDiscountPopup() {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY)) return;

    let triggered = false;
    const trigger = (source: string) => {
      if (triggered) return;
      triggered = true;
      setOpen(true);
      trackEvent("welcome_popup_shown", { source });
    };

    const timer = setTimeout(() => trigger("timer"), TIMER_MS);

    const onMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) trigger("exit_intent");
    };
    document.addEventListener("mouseleave", onMouseLeave);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  const dismiss = () => {
    setOpen(false);
    localStorage.setItem(STORAGE_KEY, "1");
    trackEvent("welcome_popup_dismissed");
  };

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(PROMO_CODE);
      setCopied(true);
      trackEvent("welcome_popup_code_copied", { code: PROMO_CODE });
      toast({ title: "Code copied! 🎉", description: `Use ${PROMO_CODE} at checkout for ${DISCOUNT}% off` });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({ title: "Tap and hold to copy", description: PROMO_CODE });
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 animate-fade-in"
      onClick={dismiss}
      role="dialog"
      aria-modal="true"
      aria-labelledby="welcome-popup-title"
    >
      <div
        className="relative w-full max-w-md overflow-hidden rounded-3xl border-2 border-primary/30 bg-card p-6 shadow-2xl animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={dismiss}
          className="absolute right-3 top-3 rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="text-center space-y-3">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full groovy-gradient">
            <Sparkles className="h-7 w-7 text-white" />
          </div>
          <h2 id="welcome-popup-title" className="font-display text-2xl font-bold leading-tight">
            Welcome, friend! 🌿
          </h2>
          <p className="text-sm text-muted-foreground">
            Get <strong className="text-primary text-base">{DISCOUNT}% OFF</strong> your first order — delivered to your door across South Africa.
          </p>

          <button
            onClick={copyCode}
            className="group mx-auto flex w-full max-w-xs items-center justify-between gap-2 rounded-xl border-2 border-dashed border-primary/50 bg-primary/5 px-4 py-3 transition-colors hover:bg-primary/10"
          >
            <span className="font-mono text-lg font-bold tracking-wider text-primary">{PROMO_CODE}</span>
            {copied ? (
              <Check className="h-5 w-5 text-primary" />
            ) : (
              <Copy className="h-5 w-5 text-muted-foreground group-hover:text-primary" />
            )}
          </button>

          <Button
            asChild
            size="lg"
            className="w-full rounded-full font-semibold shadow-lg shadow-primary/30"
            onClick={() => {
              localStorage.setItem(STORAGE_KEY, "1");
              trackEvent("welcome_popup_cta_clicked");
            }}
          >
            <Link to="/shop">Shop Now & Save</Link>
          </Button>

          <button
            onClick={dismiss}
            className="text-xs text-muted-foreground underline-offset-4 hover:underline"
          >
            No thanks
          </button>
        </div>
      </div>
    </div>
  );
}
