import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables, TablesInsert } from "@/integrations/supabase/types";

export type Lancamento = Tables<"admin_lancamentos">;

export function useLancamentos() {
  return useQuery({
    queryKey: ["admin_lancamentos"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("admin_lancamentos")
        .select("*")
        .order("data", { ascending: false });
      if (error) throw error;
      return data as Lancamento[];
    },
  });
}

export function useCreateLancamento() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (lancamento: TablesInsert<"admin_lancamentos">) => {
      const { data, error } = await supabase
        .from("admin_lancamentos")
        .insert(lancamento)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin_lancamentos"] }),
  });
}

export function useUpdateLancamento() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: number } & Partial<TablesInsert<"admin_lancamentos">>) => {
      const { data, error } = await supabase
        .from("admin_lancamentos")
        .update(updates)
        .eq("id", id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin_lancamentos"] }),
  });
}

export function useDeleteLancamento() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase
        .from("admin_lancamentos")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin_lancamentos"] }),
  });
}
