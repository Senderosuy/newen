import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import logoLight from "@/assets/logo-light.asset.json";

// Solo estos emails pueden crear la cuenta admin la primera vez (no hay registro público).
const ALLOWED_ADMIN_EMAILS = ["cristian+newen@senderosgroup.com", "cristian@senderosgroup.com"];

export const Route = createFileRoute("/login")({
  component: LoginPage,
  head: () => ({
    title: "Acceso Admin — NEWEN",
    meta: [{ name: "robots", content: "noindex, nofollow" }],
  }),
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showFirstRun, setShowFirstRun] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/admin" });
    });
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      if (
        error.message.toLowerCase().includes("invalid login credentials") &&
        ALLOWED_ADMIN_EMAILS.includes(email.trim().toLowerCase())
      ) {
        setShowFirstRun(true);
        toast.error("Credenciales inválidas. Si es tu primer acceso, creá la cuenta admin.");
      } else {
        toast.error("Credenciales inválidas.");
      }
      return;
    }
    navigate({ to: "/admin" });
  };

  const handleFirstRun = async () => {
    if (!ALLOWED_ADMIN_EMAILS.includes(email.trim().toLowerCase())) {
      toast.error("Este email no está habilitado como administrador.");
      return;
    }
    if (password.length < 8) {
      toast.error("La contraseña debe tener al menos 8 caracteres.");
      return;
    }
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({ email, password });
    setLoading(false);
    if (error) {
      toast.error(`No se pudo crear la cuenta: ${error.message}`);
      return;
    }
    if (data.session) {
      toast.success("Cuenta admin creada.");
      navigate({ to: "/admin" });
    } else {
      toast.info("Cuenta creada. Revisá tu email para confirmarla y luego iniciá sesión.");
      setShowFirstRun(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary/30 px-6">
      <div className="w-full max-w-md bg-card border border-border rounded-3xl shadow-xl p-8">
        <div className="flex justify-center mb-8">
          <img src={logoLight.url} alt="NEWEN" className="h-12 w-auto object-contain" />
        </div>
        <h1 className="text-2xl font-bold text-center mb-2">Panel de Administración</h1>
        <p className="text-muted-foreground text-sm text-center mb-8">
          Acceso exclusivo para el administrador del sitio.
        </p>
        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>
          <Button type="submit" className="w-full" size="lg" disabled={loading}>
            {loading ? "Ingresando..." : "Iniciar sesión"}
          </Button>
          {showFirstRun && (
            <Button
              type="button"
              variant="outline"
              className="w-full"
              disabled={loading}
              onClick={handleFirstRun}
            >
              Primer acceso: crear cuenta admin
            </Button>
          )}
        </form>
      </div>
    </div>
  );
}
