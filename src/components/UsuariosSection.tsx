import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Plus, Pencil, Trash2, Users2, Search } from "lucide-react";
import { toast } from "sonner";
import { useUsuarios, useCreateUsuario, useUpdateUsuario, useDeleteUsuario } from "@/hooks/useClientes";
import type { Usuario } from "@/hooks/useClientes";

const emptyForm = { nome: "", email: "", cargo: "" };

export function UsuariosSection() {
  const { data: usuarios = [], isLoading } = useUsuarios();
  const createUsuario = useCreateUsuario();
  const updateUsuario = useUpdateUsuario();
  const deleteUsuario = useDeleteUsuario();

  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Usuario | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);

  const filtered = usuarios.filter((u) =>
    u.nome.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase()) ||
    u.cargo?.toLowerCase().includes(search.toLowerCase())
  );

  const openNew = () => { setEditing(null); setForm(emptyForm); setModalOpen(true); };
  const openEdit = (u: Usuario) => {
    setEditing(u);
    setForm({ nome: u.nome, email: u.email ?? "", cargo: u.cargo ?? "" });
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    if (!form.nome.trim()) { toast.error("Nome é obrigatório"); return; }
    const payload = { nome: form.nome.trim(), email: form.email.trim() || null, cargo: form.cargo.trim() || null };
    try {
      if (editing) {
        await updateUsuario.mutateAsync({ id: editing.id, ...payload });
        toast.success("Usuário atualizado!");
      } else {
        await createUsuario.mutateAsync(payload);
        toast.success("Usuário criado!");
      }
      setModalOpen(false);
    } catch (err: any) {
      toast.error(err.message || "Erro ao salvar");
    }
  };

  const handleDelete = async () => {
    if (deleteId === null) return;
    try {
      await deleteUsuario.mutateAsync(deleteId);
      toast.success("Usuário removido!");
    } catch (err: any) {
      toast.error(err.message || "Erro ao remover");
    }
    setDeleteId(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">Usuários / Sócios</h2>
        <Button onClick={openNew} className="bg-indigo-600 hover:bg-indigo-500 text-white gap-2">
          <Plus className="h-4 w-4" /> Novo Usuário
        </Button>
      </div>

      <Card className="bg-[#1a1a35] border-white/5">
        <CardContent className="flex items-center gap-4 p-5">
          <div className="h-11 w-11 rounded-lg bg-violet-600/20 flex items-center justify-center">
            <Users2 className="h-5 w-5 text-violet-400" />
          </div>
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider">Total de Usuários</p>
            <p className="text-2xl font-bold text-white">{usuarios.length}</p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-[#1a1a35] border-white/5">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle className="text-base text-white">Usuários</CardTitle>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input placeholder="Buscar..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 bg-[#0f0f1a] border-white/10 text-gray-200 placeholder:text-gray-500" />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-12 text-gray-400">Carregando...</div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
              <Users2 className="h-10 w-10 mb-3 opacity-40" />
              <p>Nenhum usuário encontrado</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-white/5 hover:bg-transparent">
                  <TableHead className="text-gray-400">Nome</TableHead>
                  <TableHead className="text-gray-400">Email</TableHead>
                  <TableHead className="text-gray-400">Cargo</TableHead>
                  <TableHead className="text-gray-400 text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((u) => (
                  <TableRow key={u.id} className="border-white/5 hover:bg-white/[0.02]">
                    <TableCell className="font-medium text-white">{u.nome}</TableCell>
                    <TableCell className="text-gray-300">{u.email || "—"}</TableCell>
                    <TableCell className="text-gray-300">{u.cargo || "—"}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-white hover:bg-white/10" onClick={() => openEdit(u)}>
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-red-400 hover:bg-red-500/10" onClick={() => setDeleteId(u.id)}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="bg-[#1a1a35] border-white/10 text-gray-100 sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white">{editing ? "Editar Usuário" : "Novo Usuário"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-gray-300">Nome *</Label>
              <Input value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} className="bg-[#0f0f1a] border-white/10 text-gray-200" />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-300">Email</Label>
              <Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="bg-[#0f0f1a] border-white/10 text-gray-200" />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-300">Cargo</Label>
              <Input value={form.cargo} onChange={(e) => setForm({ ...form, cargo: e.target.value })} placeholder="Ex: Sócio, Gerente..." className="bg-[#0f0f1a] border-white/10 text-gray-200" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)} className="border-white/10 text-gray-300 hover:bg-white/5">Cancelar</Button>
            <Button onClick={handleSubmit} disabled={createUsuario.isPending || updateUsuario.isPending} className="bg-indigo-600 hover:bg-indigo-500 text-white">
              {editing ? "Salvar" : "Criar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent className="bg-[#1a1a35] border-white/10">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">Tem certeza que deseja remover este usuário?</AlertDialogDescription>
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
