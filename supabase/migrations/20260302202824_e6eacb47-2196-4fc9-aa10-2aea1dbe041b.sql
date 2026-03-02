
-- Delivery zones: predefined distance-based fees from Joburg CBD
CREATE TABLE public.delivery_zones (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  zone_name TEXT NOT NULL,
  min_km INTEGER NOT NULL DEFAULT 0,
  max_km INTEGER NOT NULL,
  fee NUMERIC(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.delivery_zones ENABLE ROW LEVEL SECURITY;

-- Everyone can read delivery zones
CREATE POLICY "Anyone can view delivery zones"
ON public.delivery_zones FOR SELECT
USING (true);

-- Orders table
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_ref TEXT NOT NULL UNIQUE,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  delivery_address TEXT NOT NULL,
  delivery_zone_id UUID REFERENCES public.delivery_zones(id),
  delivery_fee NUMERIC(10,2) NOT NULL DEFAULT 50,
  subtotal NUMERIC(10,2) NOT NULL,
  total NUMERIC(10,2) NOT NULL,
  items JSONB NOT NULL DEFAULT '[]',
  payment_method TEXT NOT NULL DEFAULT 'eft',
  payment_status TEXT NOT NULL DEFAULT 'pending',
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Anyone can insert orders (no auth required for guest checkout)
CREATE POLICY "Anyone can create orders"
ON public.orders FOR INSERT
WITH CHECK (true);

-- Anyone can read their own order by order_ref (we'll filter in app)
CREATE POLICY "Anyone can view orders"
ON public.orders FOR SELECT
USING (true);

-- Only service role can update (admin via edge function)
-- No direct update policy for anon users

-- Enable realtime for orders
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;

-- Seed delivery zones
INSERT INTO public.delivery_zones (zone_name, min_km, max_km, fee) VALUES
  ('Joburg CBD & Surrounds', 0, 10, 50),
  ('Greater Joburg', 11, 25, 75),
  ('Joburg Outskirts', 26, 50, 100),
  ('Pretoria & Far Areas', 51, 80, 150),
  ('Extended Delivery', 81, 150, 200);

-- Timestamp trigger for orders
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_orders_updated_at
BEFORE UPDATE ON public.orders
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
