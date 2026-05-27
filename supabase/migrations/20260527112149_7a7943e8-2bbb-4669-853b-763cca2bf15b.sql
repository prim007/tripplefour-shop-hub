CREATE TABLE public.abandoned_carts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE,
  customer_name text,
  customer_email text NOT NULL,
  customer_phone text,
  items jsonb NOT NULL DEFAULT '[]'::jsonb,
  subtotal numeric NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'active',
  last_activity_at timestamptz NOT NULL DEFAULT now(),
  recovered_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE ON public.abandoned_carts TO authenticated;
GRANT ALL ON public.abandoned_carts TO service_role;

ALTER TABLE public.abandoned_carts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage their own abandoned cart - select"
  ON public.abandoned_carts FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users manage their own abandoned cart - insert"
  ON public.abandoned_carts FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users manage their own abandoned cart - update"
  ON public.abandoned_carts FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Service role full access abandoned_carts"
  ON public.abandoned_carts FOR ALL
  TO public
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE INDEX idx_abandoned_carts_status_activity
  ON public.abandoned_carts (status, last_activity_at DESC);

CREATE TRIGGER trg_abandoned_carts_updated
  BEFORE UPDATE ON public.abandoned_carts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();