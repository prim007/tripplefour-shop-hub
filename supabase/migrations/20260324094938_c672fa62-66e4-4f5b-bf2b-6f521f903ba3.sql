
-- Create a SECURITY DEFINER function to look up orders by ref
CREATE OR REPLACE FUNCTION public.get_order_by_ref(p_order_ref text)
RETURNS SETOF orders
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT * FROM orders WHERE order_ref = p_order_ref LIMIT 1;
$$;

-- Drop the overly permissive SELECT policy
DROP POLICY IF EXISTS "Users can read their own orders by ref" ON public.orders;

-- Add a restrictive SELECT policy: only service_role can read orders directly
CREATE POLICY "Service role can read orders"
ON public.orders
FOR SELECT
TO public
USING (auth.role() = 'service_role'::text);
