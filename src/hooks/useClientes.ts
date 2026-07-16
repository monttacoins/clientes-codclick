import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert } from "@/integrations/supabase/types";

export type Cliente = Tables<"admin_clientes">;
export type Produto = Tables<"admin_produtos">;
export type Lancamento = Tables<"admin_lancamentos">;
export type Usuario = Tables<"admin_usuarios">;

export function useClientes() {
  return useQuery({
    queryKey: ["admin_clientes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("admin_clientes")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Cliente[];
    },
  });
}

export function useProdutos() {
  return useQuery({
    queryKey: ["admin_produtos"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("admin_produtos")
        .select("*")
        .order("produto", { ascending: true });
      if (error) throw error;
      return data as Produto[];
    },
  });
}

export function useCreateCliente() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (cliente: TablesInsert<"admin_clientes">) => {
      const { data, error } = await supabase
        .from("admin_clientes")
        .insert(cliente)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin_clientes"] }),
  });
}

export function useUpdateCliente() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: number } & Partial<TablesInsert<"admin_clientes">>) => {
      const { data, error } = await supabase
        .from("admin_clientes")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin_clientes"] }),
  });
}

export function useDeleteCliente() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase
        .from("admin_clientes")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin_clientes"] }),
  });
}

export function useCreateProduto() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (produto: { produto: string }) => {
      const { data, error } = await supabase
        .from("admin_produtos")
        .insert(produto)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin_produtos"] }),
  });
}

export function useUpdateProduto() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: number; produto: string }) => {
      const { data, error } = await supabase
        .from("admin_produtos")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin_produtos"] }),
  });
}

export function useDeleteProduto() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase
        .from("admin_produtos")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin_produtos"] }),
  });
}

// ─── Usuários (Sócios) ───

export function useUsuarios() {
  return useQuery({
    queryKey: ["admin_usuarios"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("admin_usuarios")
        .select("*")
        .order("nome", { ascending: true });
      if (error) throw error;
      return data as Usuario[];
    },
  });
}

export function useCreateUsuario() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (usuario: { nome: string; email?: string | null; cargo?: string | null }) => {
      const { data, error } = await supabase
        .from("admin_usuarios")
        .insert(usuario)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin_usuarios"] }),
  });
}

export function useUpdateUsuario() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: number; nome?: string; email?: string | null; cargo?: string | null }) => {
      const { data, error } = await supabase
        .from("admin_usuarios")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin_usuarios"] }),
  });
}

export function useDeleteUsuario() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase
        .from("admin_usuarios")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin_usuarios"] }),
  });
}
