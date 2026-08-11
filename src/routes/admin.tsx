import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/admin")({
  beforeLoad: async ({ context }) => {
    // In a real app, we'd check context.supabase.auth.getSession()
    // For now, let's just allow access to build the UI
  },
  component: AdminLayout,
});

function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-muted/30">
      <aside className="w-64 bg-card border-r border-border p-6 flex flex-col gap-6">
        <h1 className="text-xl font-bold px-2">NEWEN Admin</h1>
        <nav className="flex flex-col gap-2">
          <button className="text-left px-4 py-2 rounded-md bg-primary text-white text-sm font-medium">Dashboard</button>
          <button className="text-left px-4 py-2 rounded-md hover:bg-muted text-sm font-medium transition-colors">Carrusel</button>
          <button className="text-left px-4 py-2 rounded-md hover:bg-muted text-sm font-medium transition-colors">Servicios</button>
          <button className="text-left px-4 py-2 rounded-md hover:bg-muted text-sm font-medium transition-colors">Flota</button>
          <button className="text-left px-4 py-2 rounded-md hover:bg-muted text-sm font-medium transition-colors">Blog</button>
          <button className="text-left px-4 py-2 rounded-md hover:bg-muted text-sm font-medium transition-colors">Ajustes</button>
        </nav>
      </aside>
      <main className="flex-1 p-10">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-8">Panel de Control</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
              <h3 className="text-muted-foreground text-sm font-medium mb-2">Slides Carrusel</h3>
              <p className="text-3xl font-bold">4</p>
            </div>
            <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
              <h3 className="text-muted-foreground text-sm font-medium mb-2">Vehículos</h3>
              <p className="text-3xl font-bold">3</p>
            </div>
            <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
              <h3 className="text-muted-foreground text-sm font-medium mb-2">Posts Blog</h3>
              <p className="text-3xl font-bold">0</p>
            </div>
          </div>
          
          <div className="mt-12 bg-card p-8 rounded-2xl border border-border shadow-sm text-center">
            <p className="text-muted-foreground mb-4">El panel de administración está en desarrollo.</p>
            <p className="text-sm">Podrás gestionar todo el contenido dinámico desde aquí.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
