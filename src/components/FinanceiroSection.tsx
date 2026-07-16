import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { DollarSign, TrendingUp, TrendingDown, Plus, Pencil, Trash2, Wallet, ArrowUpCircle, ArrowDownCircle, Users } from "lucide-react";
import { toast } from "sonner";
import { format, startOfMonth, endOfMonth, subMonths, startOfYear } from "date-fns";
import { useLancamentos, useCreateLancamento, useUpdateLancamento, useDeleteLancamento } from "@/hooks/useLancamentos";
import type { Lancamento } from "@/hooks/useLancamentos";
import type { Cliente, Usuario } from "@/hooks/useClientes";

const CATEGORIAS = [
  "Pagamento de Cliente",
  "Pro-labore",
  "Ferramentas/Software",
  "Impostos",
  "Marketing",
  "Diversos",
] as const;

type PeriodoFilter = "mes_atual" | "mes_anterior" | "ano" | "todos" | "personalizado";

interface Props {
  clientes: Cliente[];
  usuarios: Usuario[];
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
}

const emptyForm = {
  data: format(new Date(), "yyyy-MM-dd"),
  descricao: "",
  categoria: "Diversos" as string,
  valor: "",
  tipo: "entrada" as string,
  status: "pendente" as string,
  cliente_id: "" as string,
  usuario_id: "" as string,
  is_prolabore: false,
  observacoes: "",
};

function filterByPeriod(items: Lancamento[], periodo: PeriodoFilter, customStart: string, customEnd: string) {
  const now = new Date();
  if (periodo === "mes_atual") {
    const start = format(startOfMonth(now), "yyyy-MM-dd");
    const end = format(endOfMonth(now), "yyyy-MM-dd");
    return items.filter((l) => l.data >= start && l.data <= end);
  } else if (periodo === "mes_anterior") {
    const prev = subMonths(now, 1);
    const start = format(startOfMonth(prev), "yyyy-MM-dd");
    const end = format(endOfMonth(prev), "yyyy-MM-dd");
    return items.filter((l) => l.data >= start && l.data <= end);
  } else if (periodo === "ano") {
    const start = format(startOfYear(now), "yyyy-MM-dd");
    return items.filter((l) => l.data >= start);
  } else if (periodo === "personalizado") {
    return items.filter((l) => {
      if (customStart && l.data < customStart) return false;
      if (customEnd && l.data > customEnd) return false;
      return true;
    });
  }
  return items;
}

function PeriodFilter({
  periodo,
  setPeriodo,
  customStart,
  setCustomStart,
  customEnd,
  setCustomEnd,
  className,
}: {
  periodo: PeriodoFilter;
  setPeriodo: (v: PeriodoFilter) => void;
  customStart: string;
  setCustomStart: (v: string) => void;
  customEnd: string;
  setCustomEnd: (v: string) => void;
  className?: string;
}) {
  return (
    <div className={`flex flex-wrap gap-3 items-end ${className ?? ""}`}>
      <Select value={periodo} onValueChange={(v) => setPeriodo(v as PeriodoFilter)}>
        <SelectTrigger className="w-48 bg-[#1a1a35] border-white/10 text-gray-200">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-[#1a1a35] border-white/10">
          <SelectItem value="mes_atual">Mês Atual</SelectItem>
          <SelectItem value="mes_anterior">Mês Anterior</SelectItem>
          <SelectItem value="ano">Este Ano</SelectItem>
          <SelectItem value="todos">Todos</SelectItem>
          <SelectItem value="personalizado">Período Personalizado</SelectItem>
        </SelectContent>
      </Select>
      {periodo === "personalizado" && (
        <>
          <div className="space-y-1">
            <Label className="text-xs text-gray-400">De</Label>
            <Input
              type="date"
              value={customStart}
              onChange={(e) => setCustomStart(e.target.value)}
              className="w-40 bg-[#1a1a35] border-white/10 text-gray-200"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-gray-400">Até</Label>
            <Input
              type="date"
              value={customEnd}
              onChange={(e) => setCustomEnd(e.target.value)}
              className="w-40 bg-[#1a1a35] border-white/10 text-gray-200"
            />
          </div>
        </>
      )}
    </div>
  );
}

export function FinanceiroSection({ clientes, usuarios }: Props) {
  const { data: lancamentos = [], isLoading } = useLancamentos();
  const createLancamento = useCreateLancamento();
  const updateLancamento = useUpdateLancamento();
  const deleteLancamento = useDeleteLancamento();

  const [periodo, setPeriodo] = useState<PeriodoFilter>("mes_atual");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");
  const [categoriaFilter, setCategoriaFilter] = useState("todas");

  const [userPeriodo, setUserPeriodo] = useState<PeriodoFilter>("mes_atual");
  const [userCustomStart, setUserCustomStart] = useState("");
  const [userCustomEnd, setUserCustomEnd] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingLanc, setEditingLanc] = useState<Lancamento | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm);

  const openNew = () => {
    setEditingLanc(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (l: Lancamento) => {
    setEditingLanc(l);
    setForm({
      data: l.data,
      descricao: l.descricao,
      categoria: l.categoria,
      valor: l.valor.toString(),
      tipo: l.tipo,
      status: l.status,
      cliente_id: l.cliente_id?.toString() ?? "",
      usuario_id: l.usuario_id?.toString() ?? "",
      is_prolabore: l.is_prolabore,
      observacoes: l.observacoes ?? "",
    });
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    if (!form.descricao.trim() || !form.valor) {
      toast.error("Preencha descrição e valor");
      return;
    }
    const payload = {
      data: form.data,
      descricao: form.descricao.trim(),
      categoria: form.categoria,
      valor: parseFloat(form.valor),
      tipo: form.tipo,
      status: form.status,
      cliente_id: form.cliente_id && form.cliente_id !== "none" ? parseInt(form.cliente_id) : null,
      usuario_id: form.usuario_id && form.usuario_id !== "none" ? parseInt(form.usuario_id) : null,
      is_prolabore: form.is_prolabore,
      observacoes: form.observacoes.trim() || null,
    };
    try {
      if (editingLanc) {
        await updateLancamento.mutateAsync({ id: editingLanc.id, ...payload });
        toast.success("Lançamento atualizado!");
      } else {
        await createLancamento.mutateAsync(payload);
        toast.success("Lançamento criado!");
      }
      setModalOpen(false);
    } catch (err: any) {
      toast.error(err.message || "Erro ao salvar");
    }
  };

  const handleDelete = async () => {
    if (deleteId === null) return;
    try {
      await deleteLancamento.mutateAsync(deleteId);
      toast.success("Lançamento removido!");
    } catch (err: any) {
      toast.error(err.message || "Erro ao remover");
    }
    setDeleteId(null);
  };

  // 1. FILTRAGEM PARA O BALANÇO GERAL (EMPRESA)
  const filtered = useMemo(() => {
    let items = filterByPeriod(lancamentos, periodo, customStart, customEnd);
    if (categoriaFilter !== "todas") {
      items = items.filter((l) => l.categoria === categoriaFilter);
    }
    return items;
  }, [lancamentos, periodo, customStart, customEnd, categoriaFilter]);

  const receitasGeral = filtered
    .filter((l) => l.tipo === "entrada")
    .reduce((s, l) => s + l.valor, 0);

  const despesasOperacionaisGeral = filtered
    .filter((l) => l.tipo === "saida" && !l.is_prolabore)
    .reduce((s, l) => s + l.valor, 0);

  const prolaboreGeral = filtered
    .filter((l) => l.is_prolabore)
    .reduce((s, l) => s + l.valor, 0);

  const totalSaidasGeral = despesasOperacionaisGeral + prolaboreGeral;
  const saldoCaixaGeral = receitasGeral - totalSaidasGeral;
  const lucroLiquidoGeral = receitasGeral - despesasOperacionaisGeral - prolaboreGeral;

  // 2. FILTRAGEM PARA O BALANÇO POR USUÁRIO (SÓCIO)
  const userFilteredItems = useMemo(() => {
    return filterByPeriod(lancamentos, userPeriodo, userCustomStart, userCustomEnd);
  }, [lancamentos, userPeriodo, userCustomStart, userCustomEnd]);

  const userBalances = useMemo(() => {
    return usuarios.map((u) => {
      const userLancs = userFilteredItems.filter((l) => l.usuario_id === u.id);
      
      // Para o sócio, o que é Pro-labore na empresa vira Entrada no bolso dele
      const entradasSocio = userLancs
        .filter((l) => l.is_prolabore || l.tipo === "entrada")
        .reduce((s, l) => s + l.valor, 0);

      // Saídas comuns (quando o sócio paga algo do bolso dele para a empresa, se houver)
      // Aqui filtramos o que é tipo SAÍDA mas NÃO é Pro-labore (pois pro-labore agora é entrada dele)
      const saidasSocio = userLancs
        .filter((l) => l.tipo === "saida" && !l.is_prolabore)
        .reduce((s, l) => s + l.valor, 0);

      return { ...u, entradasSocio, saidasSocio, totalCount: userLancs.length };
    });
  }, [usuarios, userFilteredItems]);

  const stats = [
    {
      label: "Saldo em Caixa",
      value: formatCurrency(saldoCaixaGeral),
      icon: Wallet,
      iconBg: saldoCaixaGeral >= 0 ? "bg-emerald-600/20" : "bg-red-600/20",
      iconColor: saldoCaixaGeral >= 0 ? "text-emerald-400" : "text-red-400",
      valueColor: saldoCaixaGeral >= 0 ? "text-emerald-400" : "text-red-400",
    },
    {
      label: "Entradas",
      value: formatCurrency(receitasGeral),
      icon: TrendingUp,
      iconBg: "bg-emerald-600/20",
      iconColor: "text-emerald-400",
      valueColor: "text-emerald-400",
    },
    {
      label: "Total Saídas",
      value: formatCurrency(totalSaidasGeral),
      icon: TrendingDown,
      iconBg: "bg-red-600/20",
      iconColor: "text-red-400",
      valueColor: "text-red-400",
    },
  ];

  const getClienteName = (id: number | null) => {
    if (!id) return "—";
    return clientes.find((c) => c.id === id)?.nome ?? "—";
  };

  const getUsuarioName = (id: number | null) => {
    if (!id) return "—";
    return usuarios.find((u) => u.id === id)?.nome ?? "—";
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">Financeiro</h2>
        <Button onClick={openNew} className="bg-indigo-600 hover:bg-indigo-500 text-white gap-2">
          <Plus className="h-4 w-4" /> Novo Lançamento
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((s) => (
          <Card key={s.label} className="bg-[#1a1a35] border-white/5">
            <CardContent className="flex items-center gap-4 p-5">
              <div className={`h-11 w-11 rounded-lg ${s.iconBg} flex items-center justify-center`}>
                <s.icon className={`h-5 w-5 ${s.iconColor}`} />
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider">{s.label}</p>
                <p className={`text-2xl font-bold ${s.valueColor ?? "text-white"}`}>{s.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex flex-wrap gap-3 items-end">
        <PeriodFilter
          periodo={periodo}
          setPeriodo={setPeriodo}
          customStart={customStart}
          setCustomStart={setCustomStart}
          customEnd={customEnd}
          setCustomEnd={setCustomEnd}
        />
        <Select value={categoriaFilter} onValueChange={setCategoriaFilter}>
          <SelectTrigger className="w-52 bg-[#1a1a35] border-white/10 text-gray-200">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-[#1a1a35] border-white/10">
            <SelectItem value="todas">Todas Categorias</SelectItem>
            {CATEGORIAS.map((c) => (
              <SelectItem key={c} value={c}>{c}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card className="bg-[#1a1a35] border-white/5">
        <CardHeader>
          <CardTitle className="text-base text-white">Lançamentos</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-12 text-gray-400">Carregando...</div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
              <DollarSign className="h-10 w-10 mb-3 opacity-40" />
              <p>Nenhum lançamento encontrado</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-white/5 hover:bg-transparent">
                    <TableHead className="text-gray-400">Data</TableHead>
                    <TableHead className="text-gray-400">Descrição</TableHead>
                    <TableHead className="text-gray-400">Categoria</TableHead>
                    <TableHead className="text-gray-400">Cliente</TableHead>
                    <TableHead className="text-gray-400">Usuário</TableHead>
                    <TableHead className="text-gray-400 text-right">Valor</TableHead>
                    <TableHead className="text-gray-400">Status</TableHead>
                    <TableHead className="text-gray-400">Tipo</TableHead>
                    <TableHead className="text-gray-400 text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((l) => (
                    <TableRow key={l.id} className="border-white/5 hover:bg-white/[0.02]">
                      <TableCell className="text-gray-300">
                        {format(new Date(l.data + "T00:00:00"), "dd/MM/yyyy")}
                      </TableCell>
                      <TableCell className="font-medium text-white">
                        <div className="flex items-center gap-2">
                          {l.descricao}
                          {l.is_prolabore && (
                            <Badge variant="outline" className="bg-amber-500/15 text-amber-400 border-amber-500/30 text-[10px]">
                              Pro-labore
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-300">{l.categoria}</TableCell>
                      <TableCell className="text-gray-300">{getClienteName(l.cliente_id)}</TableCell>
                      <TableCell className="text-gray-300">{getUsuarioName(l.usuario_id)}</TableCell>
                      <TableCell className={`text-right font-medium ${l.tipo === "entrada" ? "text-emerald-400" : "text-red-400"}`}>
                        {l.tipo === "entrada" ? "+" : "−"} {formatCurrency(l.valor)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={l.status === "pago"
                            ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                            : "bg-yellow-500/15 text-yellow-400 border-yellow-500/30"
                          }
                        >
                          {l.status === "pago" ? "Pago" : "Pendente"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          {l.tipo === "entrada" ? (
                            <ArrowUpCircle className="h-4 w-4 text-emerald-400" />
                          ) : (
                            <ArrowDownCircle className="h-4 w-4 text-red-400" />
                          )}
                          <span className={l.tipo === "entrada" ? "text-emerald-400" : "text-red-400"}>
                            {l.tipo === "entrada" ? "Entrada" : "Saída"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-white hover:bg-white/10" onClick={() => openEdit(l)}>
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-red-400 hover:bg-red-500/10" onClick={() => setDeleteId(l.id)}>
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

      <Card className="bg-[#1a1a35] border-white/5">
        <CardContent className="flex items-center justify-between p-5">
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider">Lucro Líquido (após Pro-labore)</p>
            <p className={`text-2xl font-bold ${lucroLiquidoGeral >= 0 ? "text-emerald-400" : "text-red-400"}`}>
              {formatCurrency(lucroLiquidoGeral)}
            </p>
          </div>
          <div className="text-right text-sm text-gray-400 space-y-1">
            <p>Entradas: {formatCurrency(receitasGeral)}</p>
            <p>Saídas Operacionais: {formatCurrency(despesasOperacionaisGeral)}</p>
            <p>Pro-labore Total: {formatCurrency(prolaboreGeral)}</p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-[#1a1a35] border-white/5">
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-base text-white flex items-center gap-2">
              <Users className="h-5 w-5 text-indigo-400" />
              Balanço por Sócio (Visão de Recebimento)
            </CardTitle>
            <PeriodFilter
              periodo={userPeriodo}
              setPeriodo={setUserPeriodo}
              customStart={userCustomStart}
              setCustomStart={setUserCustomStart}
              customEnd={userCustomEnd}
              setCustomEnd={setUserCustomEnd}
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {usuarios.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
              <Users className="h-10 w-10 mb-3 opacity-40" />
              <p>Nenhum usuário cadastrado</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-white/5 hover:bg-transparent">
                    <TableHead className="text-gray-400">Sócio</TableHead>
                    <TableHead className="text-gray-400">Cargo</TableHead>
                    <TableHead className="text-gray-400 text-right">Recebidos (Pro-labore)</TableHead>
                    <TableHead className="text-gray-400 text-right">Gastos/Saídas</TableHead>
                    <TableHead className="text-gray-400 text-right">Saldo Final</TableHead>
                    <TableHead className="text-gray-400 text-center">Qtd.</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {userBalances.map((u) => {
                    const saldo = u.entradasSocio - u.saidasSocio;
                    return (
                      <TableRow key={u.id} className="border-white/5 hover:bg-white/[0.02]">
                        <TableCell className="font-medium text-white">{u.nome}</TableCell>
                        <TableCell className="text-gray-300">{u.cargo ?? "—"}</TableCell>
                        <TableCell className="text-right text-emerald-400 font-medium">
                          {formatCurrency(u.entradasSocio)}
                        </TableCell>
                        <TableCell className="text-right text-red-400 font-medium">
                          {formatCurrency(u.saidasSocio)}
                        </TableCell>
                        <TableCell className={`text-right font-bold ${saldo >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                          {formatCurrency(saldo)}
                        </TableCell>
                        <TableCell className="text-center text-gray-300">{u.totalCount}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de criação/edição */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="bg-[#1a1a35] border-white/10 max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-white">{editingLanc ? "Editar Lançamento" : "Novo Lançamento"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-gray-300">Data</Label>
                <Input type="date" value={form.data} onChange={(e) => setForm({ ...form, data: e.target.value })} className="bg-[#0f0f1a] border-white/10 text-gray-200" />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-300">Valor</Label>
                <Input type="number" step="0.01" placeholder="0,00" value={form.valor} onChange={(e) => setForm({ ...form, valor: e.target.value })} className="bg-[#0f0f1a] border-white/10 text-gray-200" />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-gray-300">Descrição</Label>
              <Input value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} placeholder="Descrição do lançamento" className="bg-[#0f0f1a] border-white/10 text-gray-200" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-gray-300">Categoria</Label>
                <Select value={form.categoria} onValueChange={(v) => setForm({ ...form, categoria: v })}>
                  <SelectTrigger className="bg-[#0f0f1a] border-white/10 text-gray-200"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-[#1a1a35] border-white/10">
                    {CATEGORIAS.map((c) => (<SelectItem key={c} value={c}>{c}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-gray-300">Tipo</Label>
                <Select value={form.tipo} onValueChange={(v) => setForm({ ...form, tipo: v })}>
                  <SelectTrigger className="bg-[#0f0f1a] border-white/10 text-gray-200"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-[#1a1a35] border-white/10">
                    <SelectItem value="entrada">Entrada</SelectItem>
                    <SelectItem value="saida">Saída</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-gray-300">Status</Label>
                <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                  <SelectTrigger className="bg-[#0f0f1a] border-white/10 text-gray-200"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-[#1a1a35] border-white/10">
                    <SelectItem value="pago">Pago</SelectItem>
                    <SelectItem value="pendente">Pendente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-gray-300">Cliente</Label>
                <Select value={form.cliente_id} onValueChange={(v) => setForm({ ...form, cliente_id: v })}>
                  <SelectTrigger className="bg-[#0f0f1a] border-white/10 text-gray-200"><SelectValue placeholder="Nenhum" /></SelectTrigger>
                  <SelectContent className="bg-[#1a1a35] border-white/10">
                    <SelectItem value="none">Nenhum</SelectItem>
                    {clientes.map((c) => (<SelectItem key={c.id} value={c.id.toString()}>{c.nome}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-gray-300">Usuário</Label>
              <Select value={form.usuario_id} onValueChange={(v) => setForm({ ...form, usuario_id: v })}>
                <SelectTrigger className="bg-[#0f0f1a] border-white/10 text-gray-200"><SelectValue placeholder="Nenhum" /></SelectTrigger>
                <SelectContent className="bg-[#1a1a35] border-white/10">
                  <SelectItem value="none">Nenhum</SelectItem>
                  {usuarios.map((u) => (<SelectItem key={u.id} value={u.id.toString()}>{u.nome}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="is_prolabore" checked={form.is_prolabore} onCheckedChange={(v) => setForm({ ...form, is_prolabore: !!v })} />
              <Label htmlFor="is_prolabore" className="text-gray-300">Marcar como Pro-labore</Label>
            </div>
            <div className="space-y-2">
              <Label className="text-gray-300">Observações</Label>
              <Textarea value={form.observacoes} onChange={(e) => setForm({ ...form, observacoes: e.target.value })} placeholder="Observações opcionais" className="bg-[#0f0f1a] border-white/10 text-gray-200" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setModalOpen(false)} className="border-white/10 text-gray-300 hover:bg-white/5">Cancelar</Button>
            <Button onClick={handleSubmit} className="bg-indigo-600 hover:bg-indigo-500 text-white" disabled={createLancamento.isPending || updateLancamento.isPending}>
              {editingLanc ? "Salvar" : "Criar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de exclusão */}
      <AlertDialog open={deleteId !== null} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent className="bg-[#1a1a35] border-white/10">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-400">
              Tem certeza que deseja remover este lançamento? Esta ação não pode ser desfeita.
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
