-- Remove insecure SECURITY DEFINER order lookup RPC
DROP FUNCTION IF EXISTS public.get_order_by_ref(text);

-- Restrict order creation to backend service role only
DROP POLICY IF EXISTS "Anyone can create orders" ON public.orders;
CREATE POLICY "Service role can create orders"
ON public.orders
FOR INSERT
TO public
WITH CHECK (auth.role() = 'service_role'::text);

-- Harden SECURITY DEFINER functions with fixed search_path
ALTER FUNCTION public.enqueue_email(text, jsonb)
SET search_path = public, pg_catalog;

ALTER FUNCTION public.read_email_batch(text, integer, integer)
SET search_path = public, pg_catalog;

ALTER FUNCTION public.delete_email(text, bigint)
SET search_path = public, pg_catalog;

ALTER FUNCTION public.move_to_dlq(text, text, bigint, jsonb)
SET search_path = public, pg_catalog;