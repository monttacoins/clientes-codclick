
-- RLS for admin_clientes
ALTER TABLE public.admin_clientes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public all on admin_clientes"
ON public.admin_clientes FOR ALL
TO public
USING (true)
WITH CHECK (true);

-- RLS for admin_produtos
ALTER TABLE public.admin_produtos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public all on admin_produtos"
ON public.admin_produtos FOR ALL
TO public
USING (true)
WITH CHECK (true);
