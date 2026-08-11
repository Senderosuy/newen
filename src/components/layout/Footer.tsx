import { Link } from "@tanstack/react-router"
import { Mail, Phone } from "lucide-react"
import type { SiteSettings } from "@/types"
import logoDark from "@/assets/logo-dark.asset.json";

export function Footer({ settings }: { settings: SiteSettings | null }) {
  return (
    <footer className="bg-primary text-white py-16 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="space-y-6">
          <Link to="/" className="inline-block">
            <img 
              src={logoDark.url}
              alt="NEWEN" 
              className="h-12 w-auto object-contain"
            />
          </Link>
          <p className="text-white/80 text-sm leading-relaxed">
            Transporte de pasajeros premium en Uruguay. Viajes ejecutivos, turismo y eventos sociales con el mejor servicio del mercado.
          </p>
        </div>

        <div>
          <h4 className="font-bold text-lg mb-6">Enlaces Rápidos</h4>
          <ul className="space-y-4 text-white/80 text-sm">
            <li><a href="#inicio" className="hover:text-white transition-colors">Inicio</a></li>
            <li><a href="#servicios" className="hover:text-white transition-colors">Servicios</a></li>
            <li><a href="#flota" className="hover:text-white transition-colors">Flota</a></li>
            <li><a href="#blog" className="hover:text-white transition-colors">Blog</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-lg mb-6">Contacto</h4>
          <ul className="space-y-4 text-white/80 text-sm">
            <li className="flex items-center gap-2"><Phone size={16} /> {settings?.phone || "+598 99 738 955"}</li>
            <li className="flex items-center gap-2"><Mail size={16} /> {settings?.email || "contacto@newen.com.uy"}</li>
            <li className="flex items-center gap-2 text-white/80"><span className="font-semibold">Web:</span> newen.com.uy</li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold text-lg mb-6">Legal</h4>
          <ul className="space-y-4 text-white/80 text-sm">
            <li><Link to="/" className="hover:text-white transition-colors">Política de Privacidad</Link></li>
            <li><Link to="/" className="hover:text-white transition-colors">Términos y Condiciones</Link></li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto pt-16 mt-16 border-t border-white/10 text-center text-white/60 text-xs">
        <p>© {new Date().getFullYear()} NEWEN. Todos los derechos reservados. Desarrollado por <a href="https://latamnova.io" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors underline decoration-white/20 underline-offset-2">LatamNova Group System SAS</a>.</p>
      </div>
    </footer>
  )
}
