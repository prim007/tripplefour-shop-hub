-- 1. Tighten funnel_events INSERT policy so user_id can't be spoofed
DROP POLICY "Anyone can insert funnel events" ON public.funnel_events;

CREATE POLICY "Anyone can insert funnel events"
  ON public.funnel_events FOR INSERT
  TO public
  WITH CHECK (user_id IS NULL OR user_id = auth.uid());
