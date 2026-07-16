import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Loader2, LogIn, UserPlus } from "lucide-react";

export default function AuthPage() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [token, setToken] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!authLoading && user) navigate("/", { replace: true });
  }, [user, authLoading, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) {
      toast({ title: "Erro ao entrar", description: error.message, variant: "destructive" });
      return;
    }
    navigate("/", { replace: true });
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);

    // Validate token first
    const { data: valid, error: rpcErr } = await (supabase.rpc as any)("check_token", { _token: token.trim() });
    if (rpcErr) {
      setBusy(false);
      toast({ title: "Erro ao validar token", description: rpcErr.message, variant: "destructive" });
      return;
    }
    if (!valid) {
      setBusy(false);
      toast({ title: "Token inválido", description: "Token não encontrado ou já utilizado.", variant: "destructive" });
      return;
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: { token: token.trim(), full_name: fullName },
      },
    });
    setBusy(false);

    if (error) {
      toast({ title: "Erro ao cadastrar", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Conta criada!", description: "Você já pode entrar." });
    setMode("login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f0f1a] px-4 py-10">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-white tracking-tight">Painel Admin</h1>
          <p className="text-gray-400 text-sm mt-1">
            {mode === "login" ? "Acesse sua conta" : "Crie sua conta com um token de acesso"}
          </p>
        </div>

        <Card className="bg-[#13132b] border-white/5">
          <CardContent className="p-6">
            <div className="flex gap-2 mb-6 p-1 bg-white/5 rounded-lg">
              <button
                type="button"
                onClick={() => setMode("login")}
                className={`flex-1 py-2 text-sm rounded-md transition ${
                  mode === "login" ? "bg-indigo-600 text-white" : "text-gray-400 hover:text-white"
                }`}
              >
                Entrar
              </button>
              <button
                type="button"
                onClick={() => setMode("signup")}
                className={`flex-1 py-2 text-sm rounded-md transition ${
                  mode === "signup" ? "bg-indigo-600 text-white" : "text-gray-400 hover:text-white"
                }`}
              >
                Cadastrar
              </button>
            </div>

            <form onSubmit={mode === "login" ? handleLogin : handleSignup} className="space-y-4">
              {mode === "signup" && (
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-gray-300">Nome completo</Label>
                  <Input
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    className="bg-white/5 border-white/10 text-white"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-300">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-300">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>

              {mode === "signup" && (
                <div className="space-y-2">
                  <Label htmlFor="token" className="text-gray-300">Token de acesso</Label>
                  <Input
                    id="token"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    required
                    placeholder="Cole seu token"
                    className="bg-white/5 border-white/10 text-white"
                  />
                  <p className="text-xs text-gray-500">Necessário um token válido e não utilizado.</p>
                </div>
              )}

              <Button type="submit" disabled={busy} className="w-full bg-indigo-600 hover:bg-indigo-500 gap-2">
                {busy ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : mode === "login" ? (
                  <><LogIn className="h-4 w-4" /> Entrar</>
                ) : (
                  <><UserPlus className="h-4 w-4" /> Criar conta</>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
