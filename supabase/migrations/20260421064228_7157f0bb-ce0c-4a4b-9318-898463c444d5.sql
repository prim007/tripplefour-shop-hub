CREATE TABLE public.affiliate_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  social_handle text NOT NULL,
  platforms text NOT NULL,
  follower_count text,
  audience_description text,
  status text NOT NULL DEFAULT 'new',
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.affiliate_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit affiliate application"
  ON public.affiliate_applications FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Service role can read applications"
  ON public.affiliate_applications FOR SELECT
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role can update applications"
  ON public.affiliate_applications FOR UPDATE
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

CREATE TRIGGER update_affiliate_applications_updated_at
  BEFORE UPDATE ON public.affiliate_applications
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();