-- =============================================
-- Migración: Sistema de Roles y Permisos
-- Fecha: 2026-01-27
-- Descripción: Implementa los roles admin, user y compliance_officer
-- =============================================

-- Primero, eliminar todas las políticas que dependen de la columna role
DROP POLICY IF EXISTS "Profiles read access" ON public.profiles;
DROP POLICY IF EXISTS "Profiles update by admin" ON public.profiles;
DROP POLICY IF EXISTS "Admin update profiles" ON public.profiles;
DROP POLICY IF EXISTS "profiles_select_policy" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_role_policy" ON public.profiles;

-- Crear tipo ENUM para roles (más eficiente y seguro que TEXT)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE public.user_role AS ENUM ('admin', 'user', 'compliance_officer');
    END IF;
END $$;

-- Agregar columna temporal para migrar datos
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS role_new public.user_role;

-- Migrar datos existentes
UPDATE public.profiles 
SET role_new = CASE 
    WHEN role = 'admin' THEN 'admin'::public.user_role
    WHEN role = 'compliance_officer' THEN 'compliance_officer'::public.user_role
    ELSE 'user'::public.user_role
END
WHERE role_new IS NULL;

-- Si la columna role existe como text, la renombramos y creamos la nueva
DO $$
BEGIN
    -- Verificar si role es de tipo text
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'profiles' 
        AND column_name = 'role' 
        AND data_type = 'text'
    ) THEN
        -- Eliminar la columna role antigua
        ALTER TABLE public.profiles DROP COLUMN IF EXISTS role;
        -- Renombrar role_new a role
        ALTER TABLE public.profiles RENAME COLUMN role_new TO role;
    ELSE
        -- Si role_new existe pero role ya es del tipo correcto, eliminar role_new
        ALTER TABLE public.profiles DROP COLUMN IF EXISTS role_new;
    END IF;
END $$;

-- Establecer valor por defecto para role
ALTER TABLE public.profiles 
ALTER COLUMN role SET DEFAULT 'user'::public.user_role;

-- Asegurar que role no sea null
ALTER TABLE public.profiles 
ALTER COLUMN role SET NOT NULL;

-- =============================================
-- Funciones de verificación de roles
-- =============================================

-- Función para verificar si el usuario actual es admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid()
        AND role = 'admin'::public.user_role
    );
$$;

-- Función para verificar si el usuario actual es oficial de cumplimiento
CREATE OR REPLACE FUNCTION public.is_compliance_officer()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid()
        AND role = 'compliance_officer'::public.user_role
    );
$$;

-- Función para verificar si el usuario actual tiene uno de los roles especificados
CREATE OR REPLACE FUNCTION public.has_role(allowed_roles public.user_role[])
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid()
        AND role = ANY(allowed_roles)
    );
$$;

-- Función para obtener el rol del usuario actual
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS public.user_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT role FROM public.profiles
    WHERE id = auth.uid();
$$;

-- Función para verificar si puede ver todos los SARLAFT (admin y compliance_officer)
CREATE OR REPLACE FUNCTION public.can_view_all_sarlaft()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT public.has_role(ARRAY['admin', 'compliance_officer']::public.user_role[]);
$$;

-- Función para verificar si puede aprobar SARLAFT (solo compliance_officer y admin)
CREATE OR REPLACE FUNCTION public.can_approve_sarlaft()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT public.has_role(ARRAY['admin', 'compliance_officer']::public.user_role[]);
$$;

-- =============================================
-- Políticas RLS actualizadas
-- =============================================

-- Política: Usuarios pueden ver su propio perfil, admin y compliance_officer pueden ver todos
CREATE POLICY "profiles_select_policy" ON public.profiles
FOR SELECT USING (
    id = auth.uid() 
    OR public.is_admin() 
    OR public.is_compliance_officer()
);

-- Política: Solo admin puede actualizar roles
CREATE POLICY "profiles_update_role_policy" ON public.profiles
FOR UPDATE USING (
    public.is_admin()
);

-- =============================================
-- Permisos
-- =============================================

GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_compliance_officer() TO authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(public.user_role[]) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_user_role() TO authenticated;
GRANT EXECUTE ON FUNCTION public.can_view_all_sarlaft() TO authenticated;
GRANT EXECUTE ON FUNCTION public.can_approve_sarlaft() TO authenticated;

-- =============================================
-- Comentarios para documentación
-- =============================================

COMMENT ON TYPE public.user_role IS 'Roles de usuario: admin (administrador), user (usuario normal), compliance_officer (oficial de cumplimiento)';
COMMENT ON FUNCTION public.is_admin() IS 'Verifica si el usuario autenticado actual es administrador';
COMMENT ON FUNCTION public.is_compliance_officer() IS 'Verifica si el usuario autenticado actual es oficial de cumplimiento';
COMMENT ON FUNCTION public.has_role(public.user_role[]) IS 'Verifica si el usuario autenticado tiene alguno de los roles especificados';
COMMENT ON FUNCTION public.get_user_role() IS 'Obtiene el rol del usuario autenticado actual';
COMMENT ON FUNCTION public.can_view_all_sarlaft() IS 'Verifica si el usuario puede ver todos los registros SARLAFT';
COMMENT ON FUNCTION public.can_approve_sarlaft() IS 'Verifica si el usuario puede aprobar registros SARLAFT';
