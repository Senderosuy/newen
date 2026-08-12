# Security Hardening: Admin Access and RLS

Fix the security vulnerability where any authenticated user could gain administrative control by implementing server-side role checks using Supabase RLS and a secure user-roles table.

## User Experience
- No visible change for authorized administrators.
- Unauthorized users (e.g., someone who signs up without being on the allowlist) will be blocked from accessing the admin dashboard and performing any database operations.
- Enhanced security provides peace of mind that the site's content and settings are protected.

## Technical Details

### 1. Database Schema
- **Create `public.app_role` enum**: `('admin', 'user')`.
- **Create `public.user_roles` table**: Links `auth.users(id)` to `app_role`.
- **Create `public.has_role` function**: A security-definer function to check roles without recursive RLS issues.
- **Grants**: Ensure `authenticated` can read `user_roles` and `service_role` has full access.

### 2. RLS Policy Updates
- Replace "Admin CRUD" policies that used `authenticated` with policies that use `public.has_role(auth.uid(), 'admin')`.
- Tables affected: `carousel_slides`, `services`, `fleet`, `blog_posts`, `site_settings`.

### 3. Application Logic
- **`src/routes/login.tsx`**: Update the `handleFirstRun` logic to not just sign up the user but also ensure their email is on the `ALLOWED_ADMIN_EMAILS` list before allowing admin-level operations (though RLS will now enforce this).
- **Admin Verification**: Add a server-side or more robust client-side check in `src/routes/admin.tsx` to verify the user has the 'admin' role before rendering the layout.

### 4. Migration Script
A single SQL migration will:
1. Initialize the roles system.
2. Seed the initial admin user's role (if the user already exists).
3. Update all existing table policies to be role-aware.
