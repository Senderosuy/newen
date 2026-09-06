# NEWEN

Sitio web de transporte de pasajeros en Uruguay.

**Producción:** https://newen.com.uy
**Cliente:** Ricardo Fidelim — Newen SRL
**Contacto admin:** newentours@gmail.com

---

## Stack

- **Plataforma de desarrollo:** Lovable (con Lovable Cloud como backend gestionado)
- **Frontend:** React + TypeScript, Vite, TanStack Start/Router (SSR y ruteo por archivos)
- **Estilos y UI:** Tailwind CSS, shadcn/ui (Radix UI), lucide-react, Framer Motion, Embla Carousel

## Dónde corre

Infraestructura de Lovable, con SSL automático. La app pública está en
https://newen.com.uy y el entorno de Lovable en https://newen.lovable.app

## Base de datos

Supabase — PostgreSQL con Row Level Security.

Tablas principales: `carousel_slides`, `services`, `fleet`, `blog_posts`, `site_settings`.

Autenticación: Supabase Auth para el panel admin, sin registro público.
Archivos: Supabase Storage + CDN de Lovable para las fotos.

## Dominios y DNS

`newen.com.uy` — registrado en nic.com.uy, con DNS apuntando a la infraestructura
de Lovable. Renovación automática por débito en cuenta Antel.

## Repositorio

GitHub: `Senderosuy/newen`, rama `main`.

Sincronización bidireccional Lovable ↔ GitHub: cada cambio hecho en Lovable se
commitea acá, y cada push a `main` vuelve a Lovable.

## Cómo se despliega

El despliegue lo maneja Lovable automáticamente al publicar. Para trabajo local
existe el script `sync.bat`.

```sh
git clone https://github.com/Senderosuy/newen
cd newen
npm i
npm run dev
```

## Integraciones

- Supabase (base de datos, auth y storage)
- WhatsApp — el cotizador deriva las consultas al número del cliente

## Dónde están las credenciales

Los accesos a Supabase y Lovable están en el gestor de secretos de Nova.
**No se guardan credenciales en este repositorio ni en el Hub.**

## Quién tiene acceso

Equipo de LatamNova. El cliente accede solo al panel de administración del sitio.

## Decisiones técnicas

Se eligió Lovable para acelerar el desarrollo y permitir que el cliente
administre el contenido sin intervención técnica. Supabase con RLS asegura que
el panel admin solo modifique lo que corresponde.

Todo el contenido del sitio es editable desde el panel: carrusel, flota,
servicios, blog y configuración general.

## Qué se necesita para continuarlo

- Acceso al proyecto en Lovable (ID `d5581269-5674-4b82-bad4-f9ae3114b8b7`)
- Acceso al proyecto de Supabase
- Acceso al repositorio `Senderosuy/newen`
- Node.js y npm para trabajo local

## Funcionalidades

- Landing con carrusel dinámico
- Catálogo de flota con galerías deslizables y lightbox
- Blog con editor de texto enriquecido (Markdown propio)
- Cotizador que deriva a WhatsApp
- Panel de administración completo: carrusel, blog, servicios, flota, configuración
- SEO: meta tags, Open Graph, JSON-LD y sitemap

## Problemas conocidos

Sin registrar por el momento.
