import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import logoLight from "@/assets/logo-light.asset.json";
import logoDark from "@/assets/logo-dark.asset.json";

export function Navbar({ solid = false }: { solid?: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // En páginas sin hero oscuro (ej: blog), el navbar siempre va sólido.
  const isScrolled = solid || scrolled;

  // Con "/#ancla" los links funcionan también desde otras páginas (ej: /blog/...)
  const navLinks = [
    { name: "Inicio", href: "/#inicio" },
    { name: "Servicios", href: "/#servicios" },
    { name: "Flota", href: "/#flota" },
    { name: "Blog", href: "/#blog" },
    { name: "Contacto", href: "/#contacto" },
  ];

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4",
        isScrolled
          ? "bg-background/95 backdrop-blur-md shadow-md py-3"
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img 
            src={isScrolled ? logoLight.url : logoDark.url}
            alt="NEWEN" 
            className="h-10 w-auto object-contain transition-all duration-300"
          />
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className={cn(
                "text-sm font-medium transition-colors",
                isScrolled
                  ? "text-foreground/80 hover:text-primary"
                  : "text-white/90 hover:text-white drop-shadow-sm"
              )}
            >
              {link.name}
            </a>
          ))}
          <Button asChild variant="default" className="bg-primary hover:bg-primary/90">
            <a href="https://wa.me/59899738955" target="_blank" rel="noopener noreferrer">
              Cotizá tu viaje
            </a>
          </Button>
        </div>

        {/* Mobile Toggle */}
        <button
          className={cn("md:hidden", isScrolled ? "text-foreground" : "text-white")}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          "fixed inset-0 bg-background z-40 flex flex-col items-center justify-center gap-8 transition-transform duration-300 md:hidden",
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <button
          className="absolute top-6 right-6 text-foreground"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <X size={32} />
        </button>
        {navLinks.map((link) => (
          <a
            key={link.name}
            href={link.href}
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-2xl font-semibold text-foreground hover:text-primary transition-colors"
          >
            {link.name}
          </a>
        ))}
        <Button size="lg" className="mt-4">
          <a href="https://wa.me/59899738955" target="_blank" rel="noopener noreferrer">
            Cotizá tu viaje
          </a>
        </Button>
      </div>
    </nav>
  );
}
