# Plan - Newen Passenger Transport Website

Implement a professional, modern, and responsive website for NEWEN, a Uruguayan passenger transport company. The project includes a public landing page and a private administration panel.

## User Review Required

> [!IMPORTANT]
> The admin panel requires a user to be manually created in the Lovable Cloud Auth dashboard after implementation to log in, as public registration is disabled for security.

## Proposed Changes

### Database & Backend (Lovable Cloud)
- Create `carousel_slides` table for the hero section.
- Create `services` table for dynamic service cards.
- Create `fleet` table for vehicle details and galleries.
- Create `blog_posts` table for news and articles.
- Create `site_settings` table for global configuration (WhatsApp, email, etc.).
- Configure Row Level Security (RLS) and public read access.
- Create a public storage bucket for images.

### Design System
- Update `src/styles.css` with a "Petroleum Blue / Charcoal Grey" palette and amber/green accents.
- Define modern sans-serif typography and smooth scroll animations.
- Implement a floating WhatsApp button.

### Public Landing Page
- **Header**: Fixed (sticky) navigation with anchor links and "Cotizá tu viaje" CTA.
- **Hero**: Full-screen Embla carrusel with dynamic content from the database.
- **Services**: Grid of 4 interactive cards with hover effects.
- **Fleet**: Technical specs and photo galleries for Mercedes-Benz Sprinter and Renault Master.
- **Blog**: Dynamic grid of published articles.
- **Contact/Quote Form**: Form that formats a message and redirects to WhatsApp.
- **Footer**: Brand info and quick links.

### Admin Panel (`/admin`)
- **Authentication**: Protected route using Supabase Auth.
- **Dashboard**: Sidebar navigation for managing content.
- **Modules**:
  - Carousel Manager (CRUD + Image upload).
  - Blog Editor (Rich text + Status management).
  - Services Manager (Edit titles/descriptions).
  - Fleet Manager (Technical specs + Gallery management).
  - Site Settings (Global contact info).

## Technical Details
- **Framework**: TanStack Start v1 (React 19).
- **Styling**: Tailwind CSS v4.
- **Database**: PostgreSQL via Lovable Cloud.
- **Components**: Shadcn/UI for consistent design.
- **Performance**: Lazy loading and skeleton states for database queries.

## Design Directions
- Dark Mode by default or as a primary theme.
- Professional, trustworthy, and premium executive feel.
