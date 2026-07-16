import { useState } from "react";
import { useProdutos, useCreateProduto, useUpdateProduto, useDeleteProduto } from "@/hooks/useClientes";
import type { Produto, Cliente } from "@/hooks/useClientes";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Package, Search, Users } from "lucide-react";

interface Props {
  clientes: Cliente[];
}

export function ProdutosSection({ clientes }: Props) {
  const { data: produtos = [], isLoading } = useProdutos();
  const createProduto = useCreateProduto();
  const updateProduto = useUpdateProduto();
  const deleteProduto = useDeleteProduto();

  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Produto | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [nome, setNome] = useState("");

  const filtered = produtos.filter((p) =>
    p.produto?.toLowerCase().includes(search.toLowerCase())
  );

  const getClientCount = (produtoNome: string) =>
    clientes.filter((c) => c.produto?.split(", ").includes(produtoNome)).length;

  const openCreate = () => {
    setEditing(null);
    setNome("");
    setDialogOpen(true);
  };

  const openEdit = (p: Produto) => {
    setEditing(p);
    setNome(p.produto || "");
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim()) return;
    try {
      if (editing) {
        await updateProduto.mutateAsync({ id: editing.id, produto: nome.trim() });
        toast.success("Produto atualizado!");
      } else {
        await createProduto.mutateAsync({ produto: nome.trim() });
        toast.success("Produto criado!");
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
      await deleteProduto.mutateAsync(deleteId);
      toast.success("Produto removido!");
    } catch (err: any) {
      toast.error(err.message || "Erro ao remover");
    }
    setDeleteId(null);
  };

  return (
    <div className="space-y-6">
      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-[#1a1a35] border-white/5">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="h-11 w-11 rounded-lg bg-emerald-600/20 flex items-center justify-center">
              <Package className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider">Total Produtos</p>
              <p className="text-2xl font-bold text-white">{produtos.length}</p>
            </div>
          </CardContent>
        </Card>
        {filtered.slice(0, 3).map((p) => (
          <Card key={p.id} className="bg-[#1a1a35] border-white/5">
            <CardContent className="flex items-center gap-4 p-5">
              <div className="h-11 w-11 rounded-lg bg-indigo-600/20 flex items-center justify-center">
                <Users className="h-5 w-5 text-indigo-400" />
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider truncate max-w-[140px]">{p.produto}</p>
                <p className="text-2xl font-bold text-white">{getClientCount(p.produto || "")}</p>
                <p className="text-xs text-gray-500">clientes</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Table */}
      <Card className="bg-[#1a1a35] border-white/5">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle className="text-lg text-white">Produtos</CardTitle>
          <div className="flex items-center gap-3">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Buscar produto..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 bg-[#0f0f1a] border-white/10 text-gray-200 placeholder:text-gray-500"
              />
            </div>
            <Button onClick={openCreate} className="bg-indigo-600 hover:bg-indigo-500 text-white gap-2">
              <Plus className="h-4 w-4" /> Novo Produto
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-16 text-gray-400">Carregando...</div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <Package className="h-10 w-10 mb-3 opacity-40" />
              <p>Nenhum produto encontrado</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-white/5 hover:bg-transparent">
                  <TableHead className="text-gray-400">Produto</TableHead>
                  <TableHead className="text-gray-400">ID</TableHead>
                  <TableHead className="text-gray-400">Clientes Vinculados</TableHead>
                  <TableHead className="text-gray-400">Criado em</TableHead>
                  <TableHead className="text-gray-400 text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((p) => {
                  const count = getClientCount(p.produto || "");
                  return (
                    <TableRow key={p.id} className="border-white/5 hover:bg-white/[0.02]">
                      <TableCell className="font-medium text-white">
                        <Badge variant="outline" className="bg-emerald-500/15 text-emerald-400 border-emerald-500/30">
                          {p.produto || "—"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <code className="text-xs text-gray-500 font-mono">{p.produto_id?.slice(0, 8)}...</code>
                      </TableCell>
                      <TableCell>
                        <span className={count > 0 ? "text-indigo-400 font-semibold" : "text-gray-500"}>
                          {count}
                        </span>
                      </TableCell>
                      <TableCell className="text-gray-400 text-sm">
                        {new Date(p.created_at).toLocaleDateString("pt-BR")}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-white hover:bg-white/10" onClick={() => openEdit(p)}>
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-red-400 hover:bg-red-500/10" onClick={() => setDeleteId(p.id)}>
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Form Dialog */}
      <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) setEditing(null); }}>
        <DialogContent className="sm:max-w-md bg-card">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              {editing ? "Editar Produto" : "Novo Produto"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="produto-nome">Nome do Produto *</Label>
              <Input
                id="produto-nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
                placeholder="Ex: GoodZap Básico"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
              <Button type="submit" disabled={createProduto.isPending || updateProduto.isPending || !nome.trim()}>
                {(createProduto.isPending || updateProduto.isPending) ? "Salvando..." : editing ? "Salvar" : "Criar"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent className="bg-[#1a1a35] border-white/10">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              Tem certeza que deseja remover este produto? Clientes que utilizam este produto não serão afetados.
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
