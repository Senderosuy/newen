-- 1. Create Role Enum
DO $$ BEGIN
    CREATE TYPE public.app_role AS ENUM ('admin', 'user');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Create User Roles Table
CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role public.app_role NOT NULL,
    UNIQUE (user_id, role)
);

-- 3. Enable RLS and Grants
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;

-- 4. Create Security Definer Function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- 5. Helper function for triggers to auto-assign roles based on email
CREATE OR REPLACE FUNCTION public.handle_new_user_role()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  allowed_emails TEXT[] := ARRAY['cristian+newen@senderosgroup.com', 'cristian@senderosgroup.com'];
BEGIN
  IF NEW.email = ANY(allowed_emails) THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

-- Trigger to auto-assign admin role on signup
DROP TRIGGER IF EXISTS on_auth_user_created_assign_role ON auth.users;
CREATE TRIGGER on_auth_user_created_assign_role
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_role();

-- Assign admin role to any existing users that match the allowlist
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'::public.app_role
FROM auth.users
WHERE email IN ('cristian+newen@senderosgroup.com', 'cristian@senderosgroup.com')
ON CONFLICT (user_id, role) DO NOTHING;

-- 6. Update RLS Policies for content tables to use roles
-- carousel_slides
DROP POLICY IF EXISTS "Admin CRUD carousel_slides" ON public.carousel_slides;
CREATE POLICY "Admin CRUD carousel_slides" ON public.carousel_slides 
FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- services
DROP POLICY IF EXISTS "Admin CRUD services" ON public.services;
CREATE POLICY "Admin CRUD services" ON public.services 
FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- fleet
DROP POLICY IF EXISTS "Admin CRUD fleet" ON public.fleet;
CREATE POLICY "Admin CRUD fleet" ON public.fleet 
FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- blog_posts
DROP POLICY IF EXISTS "Admin CRUD blog_posts" ON public.blog_posts;
CREATE POLICY "Admin CRUD blog_posts" ON public.blog_posts 
FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- site_settings
DROP POLICY IF EXISTS "Admin CRUD site_settings" ON public.site_settings;
CREATE POLICY "Admin CRUD site_settings" ON public.site_settings 
FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));
