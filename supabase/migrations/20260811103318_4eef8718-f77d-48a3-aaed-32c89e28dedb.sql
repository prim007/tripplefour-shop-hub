ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS invoice_status text NOT NULL DEFAULT 'unpaid',
  ADD COLUMN IF NOT EXISTS invoice_due_date date,
  ADD COLUMN IF NOT EXISTS invoice_paid_at timestamp with time zone;

ALTER TABLE public.orders
  ADD CONSTRAINT orders_invoice_status_check
  CHECK (invoice_status IN ('unpaid','paid','overdue'));

UPDATE public.orders
SET invoice_status = 'paid',
    invoice_paid_at = COALESCE(invoice_paid_at, updated_at)
WHERE payment_status = 'confirmed';

UPDATE public.orders
SET invoice_due_date = (created_at + interval '7 days')::date
WHERE invoice_due_date IS NULL;

ALTER TABLE public.orders
  ALTER COLUMN invoice_due_date SET DEFAULT (now() + interval '7 days')::date;