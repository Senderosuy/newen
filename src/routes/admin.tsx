import { createFileRoute, Link, Outlet, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Images,
  Newspaper,
  Briefcase,
  Bus,
  Settings,
  LogOut,
  ExternalLink,
} from "lucide-react";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
  head: () => ({
    title: "Panel Admin — NEWEN",
    meta: [{ name: "robots", content: "noindex, nofollow" }],
  }),
});

const NAV_ITEMS = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/carousel", label: "Carrusel", icon: Images },
  { to: "/admin/blog", label: "Blog", icon: Newspaper },
  { to: "/admin/services", label: "Servicios", icon: Briefcase },
  { to: "/admin/fleet", label: "Flota", icon: Bus },
  { to: "/admin/settings", label: "Ajustes", icon: Settings },
] as const;

function AdminLayout() {
  const navigate = useNavigate();
  // undefined = cargando, null = sin sesión
  const [session, setSession] = useState<Session | null | undefined>(undefined);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session === null) navigate({ to: "/login" });
  }, [session, navigate]);

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <p className="text-muted-foreground animate-pulse">Verificando sesión...</p>
      </div>
    );
  }

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/" });
  };

  return (
    <div className="flex min-h-screen bg-muted/30">
      <aside className="w-64 shrink-0 bg-card border-r border-border p-6 flex flex-col gap-6">
        <h1 className="text-xl font-bold px-2">NEWEN Admin</h1>
        <nav className="flex flex-col gap-1">
          {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              activeOptions={{ exact: to === "/admin" }}
              className="flex items-center gap-3 text-left px-4 py-2 rounded-md hover:bg-muted text-sm font-medium transition-colors"
              activeProps={{ className: "bg-primary text-primary-foreground hover:bg-primary" }}
            >
              <Icon size={18} />
              {label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto space-y-2">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-4 py-2 rounded-md hover:bg-muted text-sm font-medium transition-colors text-muted-foreground"
          >
            <ExternalLink size={18} />
            Ver sitio
          </a>
          <Button variant="outline" className="w-full gap-2" onClick={handleLogout}>
            <LogOut size={16} />
            Cerrar sesión
          </Button>
        </div>
      </aside>
      <main className="flex-1 p-6 lg:p-10 overflow-x-hidden">
        <div className="max-w-5xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
