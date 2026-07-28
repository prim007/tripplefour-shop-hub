DROP POLICY IF EXISTS "Anyone can submit affiliate application" ON public.affiliate_applications;
CREATE POLICY "Anyone can submit affiliate application"
ON public.affiliate_applications
FOR INSERT
TO anon, authenticated
WITH CHECK (
  length(btrim(name)) BETWEEN 1 AND 120
  AND length(email) BETWEEN 5 AND 254
  AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  AND length(btrim(social_handle)) BETWEEN 1 AND 120
  AND length(platforms) BETWEEN 1 AND 200
  AND (phone IS NULL OR length(phone) <= 32)
  AND (follower_count IS NULL OR length(follower_count) <= 50)
  AND (audience_description IS NULL OR length(audience_description) <= 2000)
  AND status = 'new'
  AND notes IS NULL
);

DROP POLICY IF EXISTS "Anyone can submit sponsor inquiry" ON public.sponsor_inquiries;
CREATE POLICY "Anyone can submit sponsor inquiry"
ON public.sponsor_inquiries
FOR INSERT
TO anon, authenticated
WITH CHECK (
  length(btrim(company_name)) BETWEEN 1 AND 160
  AND length(btrim(contact_name)) BETWEEN 1 AND 120
  AND length(contact_email) BETWEEN 5 AND 254
  AND contact_email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  AND (website_url IS NULL OR length(website_url) <= 500)
  AND length(product_description) BETWEEN 1 AND 4000
  AND placement_interest IN ('banner','sponsored_post','product_listing','newsletter','other')
  AND (budget_range IS NULL OR length(budget_range) <= 100)
  AND (message IS NULL OR length(message) <= 4000)
);