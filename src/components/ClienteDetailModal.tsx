import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CredenciaisModal } from "@/components/CredenciaisModal";
import type { Cliente } from "@/hooks/useClientes";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Mail, Key, Building2, Calendar, DollarSign, RefreshCw, FileText, ShieldCheck } from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cliente: Cliente | null;
}

const PRODUCT_COLORS: Record<string, string> = {
  "GoodZap Básico": "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  "GoodZap Avançado": "bg-blue-500/15 text-blue-400 border-blue-500/30",
  "ClickPrato": "bg-amber-500/15 text-amber-400 border-amber-500/30",
  "CPS": "bg-purple-500/15 text-purple-400 border-purple-500/30",
};

function formatDate(dateStr: string | null) {
  if (!dateStr) return "—";
  try {
    return format(new Date(dateStr), "dd/MM/yyyy", { locale: ptBR });
  } catch {
    return "—";
  }
}

function formatCurrency(value: number | null) {
  if (value === null || value === undefined) return "—";
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
}

function InfoRow({ icon: Icon, label, children }: { icon: React.ElementType; label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 py-2.5">
      <div className="h-8 w-8 rounded-md bg-white/5 flex items-center justify-center shrink-0 mt-0.5">
        <Icon className="h-4 w-4 text-gray-400" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-gray-500 uppercase tracking-wider">{label}</p>
        <div className="text-sm text-gray-200 mt-0.5">{children}</div>
      </div>
    </div>
  );
}

export function ClienteDetailModal({ open, onOpenChange, cliente }: Props) {
  const [credenciaisOpen, setCredenciaisOpen] = useState(false);

  if (!cliente) return null;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-lg bg-[#1a1a35] border-white/10 text-gray-100 max-h-[90vh] overflow-y-auto mx-2 sm:mx-auto">
          <DialogHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <DialogTitle className="text-lg sm:text-xl font-bold text-white">{cliente.nome}</DialogTitle>
            <Button
              variant="outline"
              size="sm"
              className="border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/10 gap-1.5 shrink-0"
              onClick={() => setCredenciaisOpen(true)}
            >
              <ShieldCheck className="h-4 w-4" />
              Credenciais
            </Button>
          </DialogHeader>

          <div className="space-y-1">
            <InfoRow icon={Building2} label="Produtos">
              {cliente.produto ? (
                <div className="flex flex-wrap gap-1">
                  {cliente.produto.split(", ").map((prod) => (
                    <Badge key={prod} variant="outline" className={PRODUCT_COLORS[prod] || "bg-gray-500/15 text-gray-400 border-gray-500/30"}>
                      {prod}
                    </Badge>
                  ))}
                </div>
              ) : "—"}
            </InfoRow>

            <Separator className="bg-white/5" />
            <InfoRow icon={Mail} label="Email Super Admin">{cliente.email_super_admin || "—"}</InfoRow>
            <Separator className="bg-white/5" />
            <InfoRow icon={Key} label="Token Reserva">
              {cliente.admin_token_reserva ? (
                <code className="text-xs bg-black/30 px-2 py-0.5 rounded font-mono text-gray-300 break-all">{cliente.admin_token_reserva}</code>
              ) : "—"}
            </InfoRow>
            <Separator className="bg-white/5" />
            <InfoRow icon={DollarSign} label="Valor do Contrato">{formatCurrency(cliente.valor_contrato)}</InfoRow>
            <Separator className="bg-white/5" />
            <InfoRow icon={RefreshCw} label="Recorrência">{cliente.recorrencia || "—"}</InfoRow>
            <Separator className="bg-white/5" />
            <InfoRow icon={Calendar} label="Data de Implementação">{formatDate(cliente.data_implementacao)}</InfoRow>
            <Separator className="bg-white/5" />
            <InfoRow icon={Calendar} label="Data do Primeiro Pagamento">{formatDate(cliente.data_primeiro_pgto)}</InfoRow>
            <Separator className="bg-white/5" />
            <InfoRow icon={DollarSign} label="Valor Pago">{formatCurrency(cliente.valor_pago)}</InfoRow>
            <Separator className="bg-white/5" />
            <InfoRow icon={FileText} label="Observações">
              <p className="whitespace-pre-wrap">{cliente.observacoes || "—"}</p>
            </InfoRow>
          </div>
        </DialogContent>
      </Dialog>

      <CredenciaisModal
        open={credenciaisOpen}
        onOpenChange={setCredenciaisOpen}
        clienteId={cliente.id}
        clienteNome={cliente.nome}
      />
    </>
  );
}
