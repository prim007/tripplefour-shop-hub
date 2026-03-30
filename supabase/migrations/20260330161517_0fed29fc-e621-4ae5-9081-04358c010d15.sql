
CREATE TABLE public.sponsor_inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name text NOT NULL,
  contact_name text NOT NULL,
  contact_email text NOT NULL,
  website_url text,
  product_description text NOT NULL,
  placement_interest text NOT NULL DEFAULT 'banner',
  budget_range text,
  message text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.sponsor_inquiries ENABLE ROW LEVEL SECURITY;

-- Anyone can submit an inquiry (public form)
CREATE POLICY "Anyone can submit sponsor inquiry"
  ON public.sponsor_inquiries
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Only service role can read inquiries
CREATE POLICY "Service role can read inquiries"
  ON public.sponsor_inquiries
  FOR SELECT
  TO public
  USING (auth.role() = 'service_role');
