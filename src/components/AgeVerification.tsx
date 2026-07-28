import { useState, useEffect } from "react";
import { AlertTriangle, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { AGE_TOKEN_KEY, AGE_VERIFIED_KEY, hasUnexpiredAgeToken } from "@/lib/age-verification";
import { Analytics } from "@/lib/analytics";

export default function AgeVerification() {
  const [show, setShow] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [dob, setDob] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const verified = localStorage.getItem(AGE_VERIFIED_KEY) === "true";
    const token = localStorage.getItem(AGE_TOKEN_KEY);

    if (!verified || !hasUnexpiredAgeToken(token)) {
      setShow(true);
    }
  }, []);

  const handleConfirm = async () => {
    setError(null);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dob)) {
      setError("Please enter your date of birth.");
      return;
    }
    setSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke("issue-age-token", {
        body: { date_of_birth: dob },
      });

      if (error || !data?.token) {
        setError("We couldn't verify that you're 21 or older.");
        return;
      }

      localStorage.setItem(AGE_VERIFIED_KEY, "true");
      localStorage.setItem(AGE_TOKEN_KEY, data.token);
      Analytics.ageVerified();
      setShow(false);
    } catch (err) {
      console.error("Age verification error:", err);
      toast({
        title: "Verification failed",
        description: "Please try again to continue.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDecline = () => {
    window.location.href = "https://www.google.com";
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-2xl border bg-card p-8 text-center shadow-2xl">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
          <Leaf className="h-7 w-7 text-primary" />
        </div>

        <h2 className="font-display text-2xl font-bold">Age Verification</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          You must be <strong>21 years or older</strong> to enter this site.
        </p>

        <div className="mt-5 text-left">
          <Label htmlFor="age-dob" className="text-xs font-semibold uppercase tracking-wide">
            Date of birth
          </Label>
          <Input
            id="age-dob"
            type="date"
            value={dob}
            max={new Date().toISOString().slice(0, 10)}
            onChange={(e) => setDob(e.target.value)}
            className="mt-1.5"
          />
          {error && <p className="mt-2 text-xs text-destructive">{error}</p>}
        </div>

        <div className="mt-5 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-left">
          <div className="flex items-start gap-2">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
            <div className="text-xs text-muted-foreground space-y-1">
              <p className="font-semibold text-destructive">⚠️ Health & Legal Caution</p>
              <p>CBD products may impair your ability to drive or operate machinery. Use responsibly.</p>
              <p>Keep out of reach of children. Not recommended for pregnant or breastfeeding women.</p>
              <p>By entering, you confirm you are of legal age and agree to our terms of use.</p>
            </div>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <Button variant="outline" className="flex-1" onClick={handleDecline} disabled={submitting}>
            I'm Under 21
          </Button>
          <Button className="flex-1" onClick={handleConfirm} disabled={submitting}>
            {submitting ? "Verifying..." : "Verify & Enter"}
          </Button>
        </div>

        <p className="mt-4 text-[11px] text-muted-foreground">
          This website contains products intended for adults only. By proceeding you accept full responsibility.
        </p>
      </div>
    </div>
  );
}
