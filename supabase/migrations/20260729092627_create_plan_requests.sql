CREATE TABLE public.plan_requests (
  id uuid primary key default gen_random_uuid(),
  plan text not null,
  full_name text not null,
  phone text not null,
  contact_email text not null,
  message text not null,
  requested_price numeric,
  created_at timestamptz not null default now()
);
GRANT INSERT ON public.plan_requests TO anon, authenticated;
GRANT SELECT, DELETE ON public.plan_requests TO authenticated;
GRANT ALL ON public.plan_requests TO service_role;
ALTER TABLE public.plan_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a valid plan request"
  ON public.plan_requests FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    length(trim(plan)) BETWEEN 1 AND 60
    AND length(trim(full_name)) BETWEEN 1 AND 120
    AND length(trim(phone)) BETWEEN 3 AND 30
    AND length(trim(contact_email)) BETWEEN 3 AND 200
    AND length(trim(message)) BETWEEN 1 AND 4000
    AND (requested_price IS NULL OR requested_price >= 0)
  );

CREATE POLICY "Admins can read plan requests"
  ON public.plan_requests FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete plan requests"
  ON public.plan_requests FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
