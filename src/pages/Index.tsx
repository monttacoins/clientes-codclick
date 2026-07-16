import { useState } from "react";
import { useClientes, useProdutos, useUsuarios } from "@/hooks/useClientes";
import { FinanceiroSection } from "@/components/FinanceiroSection";
import { ProdutosSection } from "@/components/ProdutosSection";
import { UsuariosSection } from "@/components/UsuariosSection";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package, DollarSign, Users2, Users, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

type TabKey = "produtos" | "financeiro" | "usuarios";

export default function Index() {
  const { data: clientes } = useClientes();
  const { data: produtos = [] } = useProdutos();
  const { data: usuarios = [] } = useUsuarios();
  const { signOut, user } = useAuth();

  const [activeTab, setActiveTab] = useState<TabKey>("financeiro");

  const tabs: { key: TabKey; label: string; icon: React.ReactNode }[] = [
    { key: "produtos", label: "Produtos", icon: <Package className="h-4 w-4" /> },
    { key: "financeiro", label: "Financeiro", icon: <DollarSign className="h-4 w-4" /> },
    { key: "usuarios", label: "Usuários", icon: <Users2 className="h-4 w-4" /> },
  ];

  return (
    <div className="min-h-screen bg-[#0f0f1a] text-gray-100">
      <header className="border-b border-white/5 bg-[#13132b]">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">Painel Admin</h1>
            <p className="text-sm text-gray-400 mt-0.5">Gerencie produtos, financeiro e usuários</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline text-xs text-gray-500 mr-1">{user?.email}</span>
            <Link to="/clientes">
              <Button variant="outline" className="border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/10 gap-2">
                <Users className="h-4 w-4" /> Clientes
              </Button>
            </Link>
            <Button
              variant="outline"
              onClick={signOut}
              className="border-white/10 text-gray-300 hover:bg-white/5 gap-2"
            >
              <LogOut className="h-4 w-4" /> Sair
            </Button>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6">
          <nav className="flex gap-1 -mb-px">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.key
                    ? "border-indigo-500 text-indigo-400"
                    : "border-transparent text-gray-500 hover:text-gray-300 hover:border-white/10"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        {activeTab === "produtos" && (
          <ProdutosSection clientes={clientes ?? []} />
        )}

        {activeTab === "financeiro" && (
          <FinanceiroSection clientes={clientes ?? []} usuarios={usuarios} />
        )}

        {activeTab === "usuarios" && (
          <UsuariosSection />
        )}
      </main>
    </div>
  );
}
