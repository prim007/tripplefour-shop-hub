-- Affiliates: each influencer/partner has a unique code
CREATE TABLE public.affiliates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  social_handle TEXT,
  commission_percent NUMERIC NOT NULL DEFAULT 15,
  active BOOLEAN NOT NULL DEFAULT true,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_affiliates_code ON public.affiliates (code);

ALTER TABLE public.affiliates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role manages affiliates"
  ON public.affiliates FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Anyone can look up a code (to validate at checkout) — read-only minimal info via edge fn anyway
CREATE POLICY "Public can read active affiliate codes"
  ON public.affiliates FOR SELECT
  USING (active = true);

CREATE TRIGGER update_affiliates_updated_at
BEFORE UPDATE ON public.affiliates
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Referrals: one row per order that used an affiliate code
CREATE TABLE public.affiliate_referrals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  affiliate_id UUID NOT NULL REFERENCES public.affiliates(id) ON DELETE CASCADE,
  order_id UUID NOT NULL UNIQUE,
  order_ref TEXT NOT NULL,
  order_subtotal NUMERIC NOT NULL,
  commission_percent NUMERIC NOT NULL,
  commission_amount NUMERIC NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- pending | confirmed | paid | cancelled
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_referrals_affiliate ON public.affiliate_referrals (affiliate_id);
CREATE INDEX idx_referrals_status ON public.affiliate_referrals (status);

ALTER TABLE public.affiliate_referrals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role manages referrals"
  ON public.affiliate_referrals FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE TRIGGER update_referrals_updated_at
BEFORE UPDATE ON public.affiliate_referrals
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Add affiliate_code column to orders for quick lookup
ALTER TABLE public.orders ADD COLUMN affiliate_code TEXT;
CREATE INDEX idx_orders_affiliate_code ON public.orders (affiliate_code) WHERE affiliate_code IS NOT NULL;