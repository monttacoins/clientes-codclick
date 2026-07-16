
-- Add unique constraint on admin_empresas.empresa_id
ALTER TABLE public.admin_empresas
ADD CONSTRAINT admin_empresas_empresa_id_unique UNIQUE (empresa_id);

-- Add foreign key from admin_clientes.empresa_id to admin_empresas.empresa_id
ALTER TABLE public.admin_clientes
ADD CONSTRAINT fk_admin_clientes_empresa
FOREIGN KEY (empresa_id) REFERENCES public.admin_empresas(empresa_id);
