import { useState, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useCredenciais, useCreateCredencial, useUpdateCredencial, useDeleteCredencial, type Credencial } from "@/hooks/useCredenciais";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Eye, EyeOff, Facebook, Instagram, Globe, Key, X, Copy } from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clienteId: number | null;
  clienteNome: string;
}

interface TipoConfig {
  key: string;
  label: string;
  icon: any;
  color: string;
  bgColor: string;
  builtinFields: string[];
  isCustom: boolean;
}

const BUILTIN_TIPOS: TipoConfig[] = [
  { key: "facebook", label: "Facebook", icon: Facebook, color: "text-blue-400", bgColor: "bg-blue-600/20", builtinFields: ["perfil", "link_perfil", "login", "senha"], isCustom: false },
  { key: "instagram", label: "Instagram", icon: Instagram, color: "text-pink-400", bgColor: "bg-pink-600/20", builtinFields: ["perfil", "login", "senha"], isCustom: false },
  { key: "site", label: "Site", icon: Globe, color: "text-emerald-400", bgColor: "bg-emerald-600/20", builtinFields: ["hospedagem", "url", "perfil", "login", "senha"], isCustom: false },
];

const FIELD_LABELS: Record<string, string> = {
  perfil: "Perfil", login: "Login", senha: "Senha", hospedagem: "Hospedagem", url: "URL", link_perfil: "Link do Perfil",
};

type FormData = Omit<Credencial, "id" | "created_at">;

const emptyForm = (tipo: string, clienteId: number, campos?: Record<string, string>): FormData => ({
  cliente_id: clienteId,
  tipo,
  perfil: "", login: "", senha: "", hospedagem: "", url: "", link_perfil: "",
  campos_customizados: campos || {},
});

export function CredenciaisModal({ open, onOpenChange, clienteId, clienteNome }: Props) {
  const { data: credenciais = [], isLoading } = useCredenciais(clienteId);
  const createCred = useCreateCredencial();
  const updateCred = useUpdateCredencial();
  const deleteCred = useDeleteCredencial();

  const [editingId, setEditingId] = useState<number | null>(null);
  const [addingTipo, setAddingTipo] = useState<string | null>(null);
  const [form, setForm] = useState<FormData | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: number; tipo: string } | null>(null);
  const [visiblePasswords, setVisiblePasswords] = useState<Set<number>>(new Set());
  const [showNewTypeDialog, setShowNewTypeDialog] = useState(false);
  const [newTypeName, setNewTypeName] = useState("");
  const [newTypeFields, setNewTypeFields] = useState<string[]>([""]);

  const togglePassword = (id: number) => {
    setVisiblePasswords((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  // Derive custom types from existing credentials
  const allTipos = useMemo((): TipoConfig[] => {
    const builtinKeys = new Set(BUILTIN_TIPOS.map(t => t.key));
    const customTypesMap = new Map<string, string[]>();

    credenciais.forEach(c => {
      if (!builtinKeys.has(c.tipo) && !customTypesMap.has(c.tipo)) {
        const fields = c.campos_customizados ? Object.keys(c.campos_customizados) : [];
        customTypesMap.set(c.tipo, fields);
      }
    });

    const customTypes: TipoConfig[] = Array.from(customTypesMap.entries()).map(([key, fields]) => ({
      key, label: key, icon: Key, color: "text-amber-400", bgColor: "bg-amber-600/20",
      builtinFields: fields, isCustom: true,
    }));

    return [...BUILTIN_TIPOS, ...customTypes];
  }, [credenciais]);

  const startAdd = (tipo: string) => {
    if (!clienteId) return;
    const config = allTipos.find(t => t.key === tipo);
    setEditingId(null);
    setAddingTipo(tipo);
    if (config?.isCustom) {
      const campos: Record<string, string> = {};
      config.builtinFields.forEach(f => campos[f] = "");
      setForm(emptyForm(tipo, clienteId, campos));
    } else {
      setForm(emptyForm(tipo, clienteId));
    }
  };

  const startEdit = (cred: Credencial) => {
    setAddingTipo(null);
    setEditingId(cred.id);
    setForm({
      cliente_id: cred.cliente_id, tipo: cred.tipo,
      perfil: cred.perfil || "", login: cred.login || "",
      senha: cred.senha || "", hospedagem: cred.hospedagem || "",
      url: cred.url || "", link_perfil: cred.link_perfil || "",
      campos_customizados: cred.campos_customizados || {},
    });
  };

  const cancelEdit = () => { setEditingId(null); setAddingTipo(null); setForm(null); };

  const handleSave = async () => {
    if (!form || !clienteId) return;
    try {
      if (editingId) {
        await updateCred.mutateAsync({ id: editingId, ...form });
        toast.success("Credencial atualizada!");
      } else {
        await createCred.mutateAsync(form);
        toast.success("Credencial adicionada!");
      }
      cancelEdit();
    } catch (err: any) {
      toast.error(err.message || "Erro ao salvar");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget || !clienteId) return;
    try {
      await deleteCred.mutateAsync({ id: deleteTarget.id, cliente_id: clienteId });
      toast.success("Credencial removida!");
    } catch (err: any) {
      toast.error(err.message || "Erro ao remover");
    }
    setDeleteTarget(null);
  };

  const updateField = (field: string, value: string) => {
    setForm((prev) => prev ? { ...prev, [field]: value } : prev);
  };

  const updateCustomField = (field: string, value: string) => {
    setForm((prev) => prev ? {
      ...prev,
      campos_customizados: { ...prev.campos_customizados, [field]: value },
    } : prev);
  };

  const handleCreateNewType = () => {
    if (!clienteId || !newTypeName.trim()) return;
    const fields = newTypeFields.filter(f => f.trim());
    if (fields.length === 0) { toast.error("Adicione pelo menos um campo"); return; }

    const tipo = newTypeName.trim();
    const campos: Record<string, string> = {};
    fields.forEach(f => campos[f.trim()] = "");

    setEditingId(null);
    setAddingTipo(tipo);
    setForm(emptyForm(tipo, clienteId, campos));
    setShowNewTypeDialog(false);
    setNewTypeName("");
    setNewTypeFields([""]);
  };

  const groupedByTipo = allTipos.map((t) => ({
    ...t,
    items: credenciais.filter((c) => c.tipo === t.key),
  }));

  return (
    <>
      <Dialog open={open} onOpenChange={(o) => { if (!o) cancelEdit(); onOpenChange(o); }}>
        <DialogContent className="sm:max-w-2xl bg-[#1a1a35] border-white/10 text-gray-100 max-h-[90vh] overflow-y-auto mx-2 sm:mx-auto">
          <DialogHeader>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <DialogTitle className="text-lg sm:text-xl font-bold text-white">Credenciais — {clienteNome}</DialogTitle>
              <Button size="sm" onClick={() => setShowNewTypeDialog(true)} className="bg-amber-600 hover:bg-amber-500 text-white gap-1 shrink-0">
                <Plus className="h-3.5 w-3.5" /> Nova Credencial
              </Button>
            </div>
          </DialogHeader>

          {isLoading ? (
            <div className="flex items-center justify-center py-8 text-gray-400">Carregando...</div>
          ) : (
            <div className="space-y-4">
              {groupedByTipo.map((grupo) => {
                const Icon = grupo.icon;
                return (
                  <Card key={grupo.key} className="bg-[#13132b] border-white/5">
                    <CardHeader className="flex flex-row items-center justify-between py-3 px-4">
                      <CardTitle className="flex items-center gap-2 text-base">
                        <div className={`h-8 w-8 rounded-md ${grupo.bgColor} flex items-center justify-center`}>
                          <Icon className={`h-4 w-4 ${grupo.color}`} />
                        </div>
                        <span className="text-white">{grupo.label}</span>
                      </CardTitle>
                      <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white gap-1"
                        onClick={() => startAdd(grupo.key)}
                        disabled={addingTipo !== null || editingId !== null}>
                        <Plus className="h-3.5 w-3.5" /> Adicionar
                      </Button>
                    </CardHeader>
                    <CardContent className="px-4 pb-4 space-y-3">
                      {grupo.items.length === 0 && addingTipo !== grupo.key && (
                        <p className="text-sm text-gray-500 text-center py-2">Nenhuma credencial cadastrada</p>
                      )}

                      {grupo.items.map((cred) => (
                        editingId === cred.id && form ? (
                          <CredencialForm key={cred.id} config={grupo} form={form}
                            onChange={updateField} onChangeCustom={updateCustomField}
                            onSave={handleSave} onCancel={cancelEdit} saving={updateCred.isPending} />
                        ) : (
                          <CredencialCard key={cred.id} cred={cred} config={grupo}
                            showPassword={visiblePasswords.has(cred.id)}
                            onTogglePassword={() => togglePassword(cred.id)}
                            onEdit={() => startEdit(cred)}
                            onDelete={() => setDeleteTarget({ id: cred.id, tipo: grupo.label })} />
                        )
                      ))}

                      {addingTipo === grupo.key && form && (
                        <CredencialForm config={grupo} form={form}
                          onChange={updateField} onChangeCustom={updateCustomField}
                          onSave={handleSave} onCancel={cancelEdit} saving={createCred.isPending} />
                      )}
                    </CardContent>
                  </Card>
                );
              })}

              {/* Show card for new type being added that doesn't exist yet */}
              {addingTipo && !allTipos.find(t => t.key === addingTipo) && form && (
                <Card className="bg-[#13132b] border-white/5">
                  <CardHeader className="flex flex-row items-center justify-between py-3 px-4">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <div className="h-8 w-8 rounded-md bg-amber-600/20 flex items-center justify-center">
                        <Key className="h-4 w-4 text-amber-400" />
                      </div>
                      <span className="text-white">{addingTipo}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-4 pb-4 space-y-3">
                    <CredencialForm
                      config={{ key: addingTipo, label: addingTipo, icon: Key, color: "text-amber-400", bgColor: "bg-amber-600/20", builtinFields: Object.keys(form.campos_customizados || {}), isCustom: true }}
                      form={form} onChange={updateField} onChangeCustom={updateCustomField}
                      onSave={handleSave} onCancel={cancelEdit} saving={createCred.isPending} />
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* New Type Dialog */}
      <Dialog open={showNewTypeDialog} onOpenChange={setShowNewTypeDialog}>
        <DialogContent className="sm:max-w-md bg-[#1a1a35] border-white/10 text-gray-100">
          <DialogHeader>
            <DialogTitle className="text-white">Nova Credencial Personalizada</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1">
              <Label className="text-xs text-gray-400">Nome da credencial</Label>
              <Input value={newTypeName} onChange={(e) => setNewTypeName(e.target.value)}
                placeholder="Ex: Google Ads, API, Painel..."
                className="bg-black/30 border-white/10 text-gray-200 h-9 text-sm" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-gray-400">Campos</Label>
              {newTypeFields.map((field, i) => (
                <div key={i} className="flex gap-2">
                  <Input value={field}
                    onChange={(e) => {
                      const next = [...newTypeFields];
                      next[i] = e.target.value;
                      setNewTypeFields(next);
                    }}
                    placeholder="Nome do campo (ex: API Key, Token, Usuário...)"
                    className="bg-black/30 border-white/10 text-gray-200 h-8 text-sm" />
                  {newTypeFields.length > 1 && (
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-red-400 shrink-0"
                      onClick={() => setNewTypeFields(newTypeFields.filter((_, j) => j !== i))}>
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
              ))}
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white gap-1 text-xs"
                onClick={() => setNewTypeFields([...newTypeFields, ""])}>
                <Plus className="h-3 w-3" /> Adicionar campo
              </Button>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button size="sm" variant="outline" onClick={() => setShowNewTypeDialog(false)}
                className="border-white/10 text-gray-300 hover:bg-white/5">Cancelar</Button>
              <Button size="sm" onClick={handleCreateNewType}
                className="bg-amber-600 hover:bg-amber-500 text-white">Criar</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <AlertDialog open={deleteTarget !== null} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <AlertDialogContent className="bg-[#1a1a35] border-white/10">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              Tem certeza que deseja remover esta credencial de {deleteTarget?.tipo}?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-white/10 text-gray-300 hover:bg-white/5">Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-500 text-white">Remover</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

/* ─── Display Card ─── */
function CopyBtn({ value }: { value: string | null | undefined }) {
  if (!value) return null;
  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-5 w-5 text-gray-500 hover:text-gray-200 shrink-0"
      onClick={(e) => {
        e.stopPropagation();
        navigator.clipboard.writeText(value);
        toast.success("Copiado!");
      }}
      title="Copiar"
    >
      <Copy className="h-3 w-3" />
    </Button>
  );
}

function CredencialCard({ cred, config, showPassword, onTogglePassword, onEdit, onDelete }: {
  cred: Credencial; config: TipoConfig; showPassword: boolean;
  onTogglePassword: () => void; onEdit: () => void; onDelete: () => void;
}) {
  const customFields = cred.campos_customizados || {};
  const isPasswordField = (name: string) => ["senha", "password", "secret", "token", "api key", "apikey"].some(k => name.toLowerCase().includes(k));

  return (
    <div className="rounded-lg bg-white/[0.03] border border-white/5 p-3 space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-sm">
          {!config.isCustom && (
            <>
              {config.key === "site" && cred.hospedagem && (
                <div className="flex items-center gap-1"><span className="text-gray-500 text-xs">Hospedagem:</span> <span className="text-gray-200">{cred.hospedagem}</span><CopyBtn value={cred.hospedagem} /></div>
              )}
              {config.key === "site" && cred.url && (
                <div className="flex items-center gap-1"><span className="text-gray-500 text-xs">URL:</span> <a href={cred.url.startsWith("http") ? cred.url : `https://${cred.url}`} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline truncate">{cred.url}</a><CopyBtn value={cred.url} /></div>
              )}
              {cred.perfil && <div className="flex items-center gap-1"><span className="text-gray-500 text-xs">Perfil:</span> <span className="text-gray-200">{cred.perfil}</span><CopyBtn value={cred.perfil} /></div>}
              {config.key === "facebook" && cred.link_perfil && (
                <div className="flex items-center gap-1"><span className="text-gray-500 text-xs">Link do Perfil:</span> <a href={cred.link_perfil.startsWith("http") ? cred.link_perfil : `https://${cred.link_perfil}`} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline truncate">{cred.link_perfil}</a><CopyBtn value={cred.link_perfil} /></div>
              )}
              {cred.login && <div className="flex items-center gap-1"><span className="text-gray-500 text-xs">Login:</span> <span className="text-gray-200">{cred.login}</span><CopyBtn value={cred.login} /></div>}
              {cred.senha && (
                <div className="flex items-center gap-1">
                  <span className="text-gray-500 text-xs">Senha:</span>
                  <code className="text-xs text-gray-300 bg-black/30 px-1.5 py-0.5 rounded">{showPassword ? cred.senha : "••••••••"}</code>
                  <Button variant="ghost" size="icon" className="h-5 w-5 text-gray-500 hover:text-gray-300" onClick={onTogglePassword}>
                    {showPassword ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                  </Button>
                  <CopyBtn value={cred.senha} />
                </div>
              )}
            </>
          )}
          {config.isCustom && Object.entries(customFields).map(([key, val]) => (
            val ? (
              <div key={key} className="flex items-center gap-1">
                <span className="text-gray-500 text-xs capitalize">{key}:</span>
                {isPasswordField(key) ? (
                  <>
                    <code className="text-xs text-gray-300 bg-black/30 px-1.5 py-0.5 rounded">{showPassword ? val : "••••••••"}</code>
                    <Button variant="ghost" size="icon" className="h-5 w-5 text-gray-500 hover:text-gray-300" onClick={onTogglePassword}>
                      {showPassword ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                    </Button>
                    <CopyBtn value={val} />
                  </>
                ) : (
                  <>
                    <span className="text-gray-200">{val}</span>
                    <CopyBtn value={val} />
                  </>
                )}
              </div>
            ) : null
          ))}
        </div>
        <div className="flex gap-1 ml-2 shrink-0">
          <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-400 hover:text-white hover:bg-white/10" onClick={onEdit}>
            <Pencil className="h-3 w-3" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-400 hover:text-red-400 hover:bg-red-500/10" onClick={onDelete}>
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
}

/* ─── Edit/Add Form ─── */
function CredencialForm({ config, form, onChange, onChangeCustom, onSave, onCancel, saving }: {
  config: TipoConfig; form: FormData;
  onChange: (field: string, value: string) => void;
  onChangeCustom: (field: string, value: string) => void;
  onSave: () => void; onCancel: () => void; saving: boolean;
}) {
  return (
    <div className="rounded-lg bg-white/[0.05] border border-indigo-500/30 p-3 space-y-3">
      {!config.isCustom && (
        <>
          {config.key === "site" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs text-gray-400">Hospedagem</Label>
                <Input value={form.hospedagem || ""} onChange={(e) => onChange("hospedagem", e.target.value)} placeholder="Ex: Hostgator" className="bg-black/30 border-white/10 text-gray-200 h-8 text-sm" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-gray-400">URL</Label>
                <Input value={form.url || ""} onChange={(e) => onChange("url", e.target.value)} placeholder="https://..." className="bg-black/30 border-white/10 text-gray-200 h-8 text-sm" />
              </div>
            </div>
          )}
          {config.builtinFields.includes("perfil") && (
            <div className="space-y-1">
              <Label className="text-xs text-gray-400">Perfil</Label>
              <Input value={form.perfil || ""} onChange={(e) => onChange("perfil", e.target.value)} placeholder="@perfil" className="bg-black/30 border-white/10 text-gray-200 h-8 text-sm" />
            </div>
          )}
          {config.builtinFields.includes("link_perfil") && (
            <div className="space-y-1">
              <Label className="text-xs text-gray-400">Link do Perfil</Label>
              <Input value={form.link_perfil || ""} onChange={(e) => onChange("link_perfil", e.target.value)} placeholder="https://facebook.com/..." className="bg-black/30 border-white/10 text-gray-200 h-8 text-sm" />
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs text-gray-400">Login</Label>
              <Input value={form.login || ""} onChange={(e) => onChange("login", e.target.value)} placeholder="email ou usuário" className="bg-black/30 border-white/10 text-gray-200 h-8 text-sm" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-gray-400">Senha</Label>
              <Input value={form.senha || ""} onChange={(e) => onChange("senha", e.target.value)} placeholder="••••••" className="bg-black/30 border-white/10 text-gray-200 h-8 text-sm" />
            </div>
          </div>
        </>
      )}
      {config.isCustom && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {config.builtinFields.map((field) => (
            <div key={field} className="space-y-1">
              <Label className="text-xs text-gray-400 capitalize">{field}</Label>
              <Input value={(form.campos_customizados || {})[field] || ""}
                onChange={(e) => onChangeCustom(field, e.target.value)}
                placeholder={field}
                className="bg-black/30 border-white/10 text-gray-200 h-8 text-sm" />
            </div>
          ))}
        </div>
      )}
      <div className="flex justify-end gap-2 pt-1">
        <Button size="sm" variant="outline" onClick={onCancel} className="border-white/10 text-gray-300 hover:bg-white/5 h-7 text-xs">Cancelar</Button>
        <Button size="sm" onClick={onSave} disabled={saving} className="bg-indigo-600 hover:bg-indigo-500 text-white h-7 text-xs">
          {saving ? "Salvando..." : "Salvar"}
        </Button>
      </div>
    </div>
  );
}
