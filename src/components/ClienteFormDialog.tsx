import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { ChevronsUpDown, X } from "lucide-react";
import type { Cliente, Produto } from "@/hooks/useClientes";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cliente?: Cliente | null;
  produtos: Produto[];
  onSubmit: (data: {
    nome: string;
    produto: string | null;
    email_super_admin: string | null;
    observacoes: string | null;
    admin_token_reserva: string | null;
    valor_contrato: number | null;
    valor_pago: number | null;
    recorrencia: string | null;
    data_implementacao: string | null;
    data_primeiro_pgto: string | null;
  }) => void;
  loading?: boolean;
}

export function ClienteFormDialog({ open, onOpenChange, cliente, produtos, onSubmit, loading }: Props) {
  const [nome, setNome] = useState("");
  const [selectedProdutos, setSelectedProdutos] = useState<string[]>([]);
  const [email, setEmail] = useState("");
  const [obs, setObs] = useState("");
  const [token, setToken] = useState("");
  const [valorContrato, setValorContrato] = useState("");
  const [valorPago, setValorPago] = useState("");
  const [recorrencia, setRecorrencia] = useState("");
  const [dataImpl, setDataImpl] = useState("");
  const [dataPgto, setDataPgto] = useState("");
  const [popoverOpen, setPopoverOpen] = useState(false);

  useEffect(() => {
    if (cliente) {
      setNome(cliente.nome);
      setSelectedProdutos(cliente.produto ? cliente.produto.split(", ").filter(Boolean) : []);
      setEmail(cliente.email_super_admin || "");
      setObs(cliente.observacoes || "");
      setToken(cliente.admin_token_reserva || "");
      setValorContrato(cliente.valor_contrato?.toString() || "");
      setValorPago(cliente.valor_pago?.toString() || "");
      setRecorrencia(cliente.recorrencia || "");
      setDataImpl(cliente.data_implementacao ? cliente.data_implementacao.split("T")[0] : "");
      setDataPgto(cliente.data_primeiro_pgto ? cliente.data_primeiro_pgto.split("T")[0] : "");
    } else {
      setNome(""); setSelectedProdutos([]); setEmail(""); setObs(""); setToken("");
      setValorContrato(""); setValorPago(""); setRecorrencia("");
      setDataImpl(""); setDataPgto("");
    }
  }, [cliente, open]);

  const toggleProduto = (produto: string) => {
    setSelectedProdutos((prev) =>
      prev.includes(produto) ? prev.filter((p) => p !== produto) : [...prev, produto]
    );
  };

  const removeProduto = (produto: string) => {
    setSelectedProdutos((prev) => prev.filter((p) => p !== produto));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      nome,
      produto: selectedProdutos.length > 0 ? selectedProdutos.join(", ") : null,
      email_super_admin: email || null,
      observacoes: obs || null,
      admin_token_reserva: token || null,
      valor_contrato: valorContrato ? parseFloat(valorContrato) : null,
      valor_pago: valorPago ? parseFloat(valorPago) : null,
      recorrencia: recorrencia || null,
      data_implementacao: dataImpl || null,
      data_primeiro_pgto: dataPgto || null,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg bg-card">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {cliente ? "Editar Cliente" : "Novo Cliente"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome *</Label>
            <Input id="nome" value={nome} onChange={(e) => setNome(e.target.value)} required placeholder="Nome do cliente" />
          </div>
          <div className="space-y-2">
            <Label>Produtos</Label>
            <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  role="combobox"
                  className="w-full justify-between font-normal min-h-[40px] h-auto"
                >
                  {selectedProdutos.length === 0 ? (
                    <span className="text-muted-foreground">Selecione os produtos</span>
                  ) : (
                    <div className="flex flex-wrap gap-1">
                      {selectedProdutos.map((p) => (
                        <Badge key={p} variant="secondary" className="text-xs gap-1">
                          {p}
                          <X
                            className="h-3 w-3 cursor-pointer"
                            onClick={(e) => { e.stopPropagation(); removeProduto(p); }}
                          />
                        </Badge>
                      ))}
                    </div>
                  )}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[--radix-popover-trigger-width] p-2" align="start">
                <div className="space-y-1">
                  {produtos.map((p) => (
                    <label
                      key={p.id}
                      className="flex items-center gap-2 px-2 py-1.5 rounded-sm hover:bg-accent cursor-pointer text-sm"
                    >
                      <Checkbox
                        checked={selectedProdutos.includes(p.produto || "")}
                        onCheckedChange={() => toggleProduto(p.produto || "")}
                      />
                      {p.produto}
                    </label>
                  ))}
                  {produtos.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-2">Nenhum produto cadastrado</p>
                  )}
                </div>
              </PopoverContent>
            </Popover>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email Super Admin</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@empresa.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="token">Token Reserva</Label>
            <Input id="token" value={token} onChange={(e) => setToken(e.target.value)} placeholder="Token de reserva" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="valor_contrato">Valor do Contrato</Label>
              <Input id="valor_contrato" type="number" step="0.01" value={valorContrato} onChange={(e) => setValorContrato(e.target.value)} placeholder="0.00" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="valor_pago">Valor Pago</Label>
              <Input id="valor_pago" type="number" step="0.01" value={valorPago} onChange={(e) => setValorPago(e.target.value)} placeholder="0.00" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="recorrencia">Recorrência</Label>
            <Input id="recorrencia" value={recorrencia} onChange={(e) => setRecorrencia(e.target.value)} placeholder="Mensal, Anual, etc." />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="data_impl">Data de Implementação</Label>
              <Input id="data_impl" type="date" value={dataImpl} onChange={(e) => setDataImpl(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="data_pgto">Data Primeiro Pgto</Label>
              <Input id="data_pgto" type="date" value={dataPgto} onChange={(e) => setDataPgto(e.target.value)} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="obs">Observações</Label>
            <Textarea id="obs" value={obs} onChange={(e) => setObs(e.target.value)} placeholder="Observações sobre o cliente" rows={3} />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button type="submit" disabled={loading || !nome.trim()}>
              {loading ? "Salvando..." : cliente ? "Salvar" : "Criar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
