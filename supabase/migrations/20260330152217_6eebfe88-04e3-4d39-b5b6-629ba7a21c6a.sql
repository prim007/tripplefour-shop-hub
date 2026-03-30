-- Add missing DELETE policy for orders (service_role only)
CREATE POLICY "Service role can delete orders"
  ON public.orders
  FOR DELETE
  TO public
  USING (auth.role() = 'service_role'::text);

-- Add missing DELETE policy for email_unsubscribe_tokens (service_role only)
CREATE POLICY "Service role can delete unsubscribe tokens"
  ON public.email_unsubscribe_tokens
  FOR DELETE
  TO public
  USING (auth.role() = 'service_role'::text);