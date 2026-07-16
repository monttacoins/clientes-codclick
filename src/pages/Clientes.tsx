import { useState } from "react";
import { useClientes, useProdutos, useCreateCliente, useUpdateCliente, useDeleteCliente } from "@/hooks/useClientes";
import type { Cliente } from "@/hooks/useClientes";
import { ClienteFormDialog } from "@/components/ClienteFormDialog";
import { ClienteDetailModal } from "@/components/ClienteDetailModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Plus, Search, Pencil, Trash2, Users, Package, Eye, EyeOff, Copy, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const PRODUCT_COLORS: Record<string, string> = {
  "GoodZap Básico": "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  "GoodZap Avançado": "bg-blue-500/15 text-blue-400 border-blue-500/30",
  "ClickPrato": "bg-amber-500/15 text-amber-400 border-amber-500/30",
  "CPS": "bg-purple-500/15 text-purple-400 border-purple-500/30",
};

export default function Clientes() {
  const { data: clientes, isLoading } = useClientes();
  const { data: produtos = [] } = useProdutos();
  const createCliente = useCreateCliente();
  const updateCliente = useUpdateCliente();
  const deleteCliente = useDeleteCliente();

  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Cliente | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [visibleTokens, setVisibleTokens] = useState<Set<number>>(new Set());
  const [detailCliente, setDetailCliente] = useState<Cliente | null>(null);

  const filtered = clientes?.filter((c) =>
    c.nome.toLowerCase().includes(search.toLowerCase()) ||
    c.produto?.toLowerCase().includes(search.toLowerCase()) ||
    c.email_super_admin?.toLowerCase().includes(search.toLowerCase())
  ) ?? [];

  const toggleToken = (id: number) => {
    setVisibleTokens((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const copyToken = (token: string) => {
    navigator.clipboard.writeText(token);
    toast.success("Token copiado!");
  };

  const handleSubmit = async (data: Parameters<typeof createCliente.mutateAsync>[0]) => {
    try {
      if (editing) {
        await updateCliente.mutateAsync({ id: editing.id, ...data });
        toast.success("Cliente atualizado!");
      } else {
        await createCliente.mutateAsync(data);
        toast.success("Cliente criado!");
      }
      setDialogOpen(false);
      setEditing(null);
    } catch (err: any) {
      toast.error(err.message || "Erro ao salvar");
    }
  };

  const handleDelete = async () => {
    if (deleteId === null) return;
    try {
      await deleteCliente.mutateAsync(deleteId);
      toast.success("Cliente removido!");
    } catch (err: any) {
      toast.error(err.message || "Erro ao remover");
    }
    setDeleteId(null);
  };

  return (
    <div className="min-h-screen bg-[#0f0f1a] text-gray-100">
      <header className="border-b border-white/5 bg-[#13132b]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <Link to="/">
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-white/10 shrink-0">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white truncate">Clientes</h1>
              <p className="text-xs sm:text-sm text-gray-400 mt-0.5 hidden sm:block">Gerencie seus clientes e credenciais</p>
            </div>
          </div>
          <Button onClick={() => { setEditing(null); setDialogOpen(true); }} className="bg-indigo-600 hover:bg-indigo-500 text-white gap-2 shrink-0" size="sm">
            <Plus className="h-4 w-4" /> <span className="hidden sm:inline">Novo Cliente</span><span className="sm:hidden">Novo</span>
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8 space-y-4 sm:space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-[#1a1a35] border-white/5">
            <CardContent className="flex items-center gap-4 p-5">
              <div className="h-11 w-11 rounded-lg bg-indigo-600/20 flex items-center justify-center">
                <Users className="h-5 w-5 text-indigo-400" />
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider">Clientes</p>
                <p className="text-2xl font-bold text-white">{clientes?.length ?? 0}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-[#1a1a35] border-white/5">
            <CardContent className="flex items-center gap-4 p-5">
              <div className="h-11 w-11 rounded-lg bg-emerald-600/20 flex items-center justify-center">
                <Package className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider">Produtos</p>
                <p className="text-2xl font-bold text-white">{produtos.length}</p>
              </div>
            </CardContent>
          </Card>
          {produtos.map((p) => {
            const count = clientes?.filter((c) => c.produto?.split(", ").includes(p.produto || "")).length ?? 0;
            return (
              <Card key={p.id} className="bg-[#1a1a35] border-white/5">
                <CardContent className="flex items-center gap-4 p-5">
                  <div className="h-11 w-11 rounded-lg bg-amber-600/20 flex items-center justify-center">
                    <Package className="h-5 w-5 text-amber-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wider">{p.produto}</p>
                    <p className="text-2xl font-bold text-white">{count}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Table */}
        <Card className="bg-[#1a1a35] border-white/5">
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 gap-3">
            <CardTitle className="text-lg text-white">Clientes</CardTitle>
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Buscar cliente, produto ou email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 bg-[#0f0f1a] border-white/10 text-gray-200 placeholder:text-gray-500"
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex items-center justify-center py-16 text-gray-400">Carregando...</div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                <Users className="h-10 w-10 mb-3 opacity-40" />
                <p>Nenhum cliente encontrado</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/5 hover:bg-transparent">
                      <TableHead className="text-gray-400">Nome</TableHead>
                      <TableHead className="text-gray-400">Produto</TableHead>
                      <TableHead className="text-gray-400 hidden md:table-cell">Email Admin</TableHead>
                      <TableHead className="text-gray-400 hidden lg:table-cell">Token</TableHead>
                      <TableHead className="text-gray-400 hidden lg:table-cell">Observações</TableHead>
                      <TableHead className="text-gray-400 text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filtered.map((c) => (
                      <TableRow key={c.id} className="border-white/5 hover:bg-white/[0.02] cursor-pointer" onClick={() => setDetailCliente(c)}>
                        <TableCell className="font-medium text-white">{c.nome}</TableCell>
                        <TableCell>
                          {c.produto ? (
                            <div className="flex flex-wrap gap-1">
                              {c.produto.split(", ").map((prod) => (
                                <Badge key={prod} variant="outline" className={PRODUCT_COLORS[prod] || "bg-gray-500/15 text-gray-400 border-gray-500/30"}>
                                  {prod}
                                </Badge>
                              ))}
                            </div>
                          ) : (
                            <span className="text-gray-500">—</span>
                          )}
                        </TableCell>
                        <TableCell className="text-gray-300 hidden md:table-cell">{c.email_super_admin || "—"}</TableCell>
                        <TableCell className="hidden lg:table-cell">
                          {c.admin_token_reserva ? (
                            <div className="flex items-center gap-1.5">
                              <code className="text-xs bg-black/30 px-2 py-0.5 rounded font-mono text-gray-300 max-w-[120px] truncate">
                                {visibleTokens.has(c.id) ? c.admin_token_reserva : "••••••••"}
                              </code>
                              <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-500 hover:text-gray-300" onClick={(e) => { e.stopPropagation(); toggleToken(c.id); }}>
                                {visibleTokens.has(c.id) ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                              </Button>
                              <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-500 hover:text-gray-300" onClick={(e) => { e.stopPropagation(); copyToken(c.admin_token_reserva!); }}>
                                <Copy className="h-3 w-3" />
                              </Button>
                            </div>
                          ) : (
                            <span className="text-gray-500">—</span>
                          )}
                        </TableCell>
                        <TableCell className="text-gray-400 max-w-[200px] truncate hidden lg:table-cell">{c.observacoes || "—"}</TableCell>
                        <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex justify-end gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-white hover:bg-white/10" onClick={() => { setEditing(c); setDialogOpen(true); }}>
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-red-400 hover:bg-red-500/10" onClick={() => setDeleteId(c.id)}>
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      <ClienteFormDialog
        open={dialogOpen}
        onOpenChange={(open) => { setDialogOpen(open); if (!open) setEditing(null); }}
        cliente={editing}
        produtos={produtos}
        onSubmit={handleSubmit}
        loading={createCliente.isPending || updateCliente.isPending}
      />

      <ClienteDetailModal
        open={detailCliente !== null}
        onOpenChange={(open) => { if (!open) setDetailCliente(null); }}
        cliente={detailCliente}
      />

      <AlertDialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent className="bg-[#1a1a35] border-white/10">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              Tem certeza que deseja remover este cliente? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-white/10 text-gray-300 hover:bg-white/5">Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-500 text-white">Remover</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
