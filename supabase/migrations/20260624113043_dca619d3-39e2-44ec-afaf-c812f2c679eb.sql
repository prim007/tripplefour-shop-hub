CREATE TABLE public.wholesale_partners (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  approved_by UUID,
  approved_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT ON public.wholesale_partners TO authenticated;
GRANT ALL ON public.wholesale_partners TO service_role;

ALTER TABLE public.wholesale_partners ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Partners can view their own approval"
  ON public.wholesale_partners
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE TRIGGER update_wholesale_partners_updated_at
  BEFORE UPDATE ON public.wholesale_partners
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();