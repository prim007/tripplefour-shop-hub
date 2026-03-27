CREATE POLICY "Service role can update orders"
ON public.orders
FOR UPDATE
TO public
USING (auth.role() = 'service_role'::text)
WITH CHECK (auth.role() = 'service_role'::text);