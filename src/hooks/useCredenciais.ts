import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Credencial {
  id: number;
  created_at: string;
  cliente_id: number;
  tipo: string;
  perfil: string | null;
  login: string | null;
  senha: string | null;
  hospedagem: string | null;
  url: string | null;
  link_perfil: string | null;
  campos_customizados: Record<string, string> | null;
}

export function useCredenciais(clienteId: number | null) {
  return useQuery({
    queryKey: ["admin_credenciais", clienteId],
    enabled: clienteId !== null,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("admin_credenciais")
        .select("*")
        .eq("cliente_id", clienteId!)
        .order("tipo", { ascending: true });
      if (error) throw error;
      return data as unknown as Credencial[];
    },
  });
}

export function useCreateCredencial() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (cred: Omit<Credencial, "id" | "created_at">) => {
      const { data, error } = await supabase
        .from("admin_credenciais")
        .insert(cred as any)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (_d, vars) => qc.invalidateQueries({ queryKey: ["admin_credenciais", vars.cliente_id] }),
  });
}

export function useUpdateCredencial() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, cliente_id, ...updates }: Partial<Credencial> & { id: number; cliente_id: number }) => {
      const { data, error } = await supabase
        .from("admin_credenciais")
        .update(updates as any)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (_d, vars) => qc.invalidateQueries({ queryKey: ["admin_credenciais", vars.cliente_id] }),
  });
}

export function useDeleteCredencial() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, cliente_id }: { id: number; cliente_id: number }) => {
      const { error } = await supabase
        .from("admin_credenciais")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: (_d, vars) => qc.invalidateQueries({ queryKey: ["admin_credenciais", vars.cliente_id] }),
  });
}
