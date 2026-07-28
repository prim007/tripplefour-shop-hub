CREATE POLICY "Service role manages wholesale partners"
ON public.wholesale_partners
FOR ALL
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

GRANT ALL ON public.wholesale_partners TO service_role;