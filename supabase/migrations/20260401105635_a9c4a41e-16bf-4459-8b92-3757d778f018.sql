
CREATE TABLE public.funnel_events (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  session_id text NOT NULL,
  user_id uuid NULL,
  event text NOT NULL CHECK (event IN ('view_product','add_to_cart','begin_checkout','purchase')),
  product_id text NULL,
  meta jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.funnel_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert funnel events"
  ON public.funnel_events FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Service role can read funnel events"
  ON public.funnel_events FOR SELECT
  TO public
  USING (auth.role() = 'service_role'::text);

CREATE INDEX idx_funnel_events_event ON public.funnel_events (event);
CREATE INDEX idx_funnel_events_session ON public.funnel_events (session_id);
CREATE INDEX idx_funnel_events_created ON public.funnel_events (created_at);
