-- =============================================
-- Migración: Tablas de Permisos por Rol
-- Fecha: 2026-01-27
-- Descripción: Crea las tablas para gestionar permisos dinámicos por rol
-- =============================================

-- Tabla de permisos disponibles en el sistema
CREATE TABLE IF NOT EXISTS public.permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    module VARCHAR(100) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de relación entre roles y permisos
CREATE TABLE IF NOT EXISTS public.role_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role public.user_role NOT NULL,
    permission_id UUID NOT NULL REFERENCES public.permissions(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(role, permission_id)
);

-- Índices para mejorar rendimiento
CREATE INDEX IF NOT EXISTS idx_permissions_code ON public.permissions(code);
CREATE INDEX IF NOT EXISTS idx_permissions_module ON public.permissions(module);
CREATE INDEX IF NOT EXISTS idx_role_permissions_role ON public.role_permissions(role);
CREATE INDEX IF NOT EXISTS idx_role_permissions_permission ON public.role_permissions(permission_id);

-- Trigger para actualizar updated_at en permissions
CREATE OR REPLACE FUNCTION public.update_permissions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_permissions_updated_at ON public.permissions;
CREATE TRIGGER trigger_permissions_updated_at
    BEFORE UPDATE ON public.permissions
    FOR EACH ROW
    EXECUTE FUNCTION public.update_permissions_updated_at();

-- =============================================
-- Insertar permisos del sistema
-- =============================================

INSERT INTO public.permissions (code, name, description, module) VALUES
    -- Dashboard
    ('view_dashboard', 'Ver Dashboard', 'Permite acceder al panel principal', 'dashboard'),
    
    -- Usuarios
    ('view_users', 'Ver Usuarios', 'Permite ver la lista de usuarios', 'users'),
    ('manage_users', 'Gestionar Usuarios', 'Permite crear, editar y eliminar usuarios', 'users'),
    ('update_user_roles', 'Actualizar Roles', 'Permite cambiar el rol de los usuarios', 'users'),
    
    -- SARLAFT
    ('view_sarlaft', 'Ver SARLAFT', 'Permite ver formularios SARLAFT propios', 'sarlaft'),
    ('create_sarlaft', 'Crear SARLAFT', 'Permite crear nuevos formularios SARLAFT', 'sarlaft'),
    ('edit_sarlaft', 'Editar SARLAFT', 'Permite editar formularios SARLAFT', 'sarlaft'),
    ('delete_sarlaft', 'Eliminar SARLAFT', 'Permite eliminar formularios SARLAFT', 'sarlaft'),
    ('approve_sarlaft', 'Aprobar SARLAFT', 'Permite aprobar o rechazar formularios SARLAFT', 'sarlaft'),
    ('view_all_sarlaft', 'Ver Todos los SARLAFT', 'Permite ver todos los formularios SARLAFT del sistema', 'sarlaft'),
    
    -- Noticias
    ('view_news', 'Ver Noticias', 'Permite ver las noticias publicadas', 'news'),
    ('manage_news', 'Gestionar Noticias', 'Permite crear, editar y eliminar noticias', 'news'),
    
    -- Reportes
    ('view_reports', 'Ver Reportes', 'Permite acceder a los reportes del sistema', 'reports'),
    ('export_reports', 'Exportar Reportes', 'Permite exportar reportes a diferentes formatos', 'reports'),
    
    -- Configuración
    ('view_settings', 'Ver Configuración', 'Permite ver la configuración del sistema', 'settings'),
    ('manage_settings', 'Gestionar Configuración', 'Permite modificar la configuración del sistema', 'settings'),
    
    -- Perfil
    ('view_profile', 'Ver Perfil', 'Permite ver el perfil propio', 'profile'),
    ('edit_profile', 'Editar Perfil', 'Permite editar el perfil propio', 'profile')
ON CONFLICT (code) DO NOTHING;

-- =============================================
-- Asignar permisos a cada rol
-- =============================================

-- Función auxiliar para asignar permisos
CREATE OR REPLACE FUNCTION public.assign_permission_to_role(
    p_role public.user_role,
    p_permission_code VARCHAR(100)
)
RETURNS VOID AS $$
DECLARE
    v_permission_id UUID;
BEGIN
    SELECT id INTO v_permission_id FROM public.permissions WHERE code = p_permission_code;
    IF v_permission_id IS NOT NULL THEN
        INSERT INTO public.role_permissions (role, permission_id)
        VALUES (p_role, v_permission_id)
        ON CONFLICT (role, permission_id) DO NOTHING;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- =============================================
-- Permisos para ADMIN (todos los permisos)
-- =============================================
SELECT public.assign_permission_to_role('admin'::public.user_role, 'view_dashboard');
SELECT public.assign_permission_to_role('admin'::public.user_role, 'view_users');
SELECT public.assign_permission_to_role('admin'::public.user_role, 'manage_users');
SELECT public.assign_permission_to_role('admin'::public.user_role, 'update_user_roles');
SELECT public.assign_permission_to_role('admin'::public.user_role, 'view_sarlaft');
SELECT public.assign_permission_to_role('admin'::public.user_role, 'create_sarlaft');
SELECT public.assign_permission_to_role('admin'::public.user_role, 'edit_sarlaft');
SELECT public.assign_permission_to_role('admin'::public.user_role, 'delete_sarlaft');
SELECT public.assign_permission_to_role('admin'::public.user_role, 'approve_sarlaft');
SELECT public.assign_permission_to_role('admin'::public.user_role, 'view_all_sarlaft');
SELECT public.assign_permission_to_role('admin'::public.user_role, 'view_news');
SELECT public.assign_permission_to_role('admin'::public.user_role, 'manage_news');
SELECT public.assign_permission_to_role('admin'::public.user_role, 'view_reports');
SELECT public.assign_permission_to_role('admin'::public.user_role, 'export_reports');
SELECT public.assign_permission_to_role('admin'::public.user_role, 'view_settings');
SELECT public.assign_permission_to_role('admin'::public.user_role, 'manage_settings');
SELECT public.assign_permission_to_role('admin'::public.user_role, 'view_profile');
SELECT public.assign_permission_to_role('admin'::public.user_role, 'edit_profile');

-- =============================================
-- Permisos para USER (permisos básicos)
-- =============================================
SELECT public.assign_permission_to_role('user'::public.user_role, 'view_dashboard');
SELECT public.assign_permission_to_role('user'::public.user_role, 'view_sarlaft');
SELECT public.assign_permission_to_role('user'::public.user_role, 'create_sarlaft');
SELECT public.assign_permission_to_role('user'::public.user_role, 'edit_sarlaft');
SELECT public.assign_permission_to_role('user'::public.user_role, 'view_news');
SELECT public.assign_permission_to_role('user'::public.user_role, 'view_profile');
SELECT public.assign_permission_to_role('user'::public.user_role, 'edit_profile');

-- =============================================
-- Permisos para COMPLIANCE_OFFICER (oficial de cumplimiento)
-- =============================================
SELECT public.assign_permission_to_role('compliance_officer'::public.user_role, 'view_dashboard');
SELECT public.assign_permission_to_role('compliance_officer'::public.user_role, 'view_users');
SELECT public.assign_permission_to_role('compliance_officer'::public.user_role, 'view_sarlaft');
SELECT public.assign_permission_to_role('compliance_officer'::public.user_role, 'create_sarlaft');
SELECT public.assign_permission_to_role('compliance_officer'::public.user_role, 'edit_sarlaft');
SELECT public.assign_permission_to_role('compliance_officer'::public.user_role, 'delete_sarlaft');
SELECT public.assign_permission_to_role('compliance_officer'::public.user_role, 'approve_sarlaft');
SELECT public.assign_permission_to_role('compliance_officer'::public.user_role, 'view_all_sarlaft');
SELECT public.assign_permission_to_role('compliance_officer'::public.user_role, 'view_news');
SELECT public.assign_permission_to_role('compliance_officer'::public.user_role, 'view_reports');
SELECT public.assign_permission_to_role('compliance_officer'::public.user_role, 'export_reports');
SELECT public.assign_permission_to_role('compliance_officer'::public.user_role, 'view_profile');
SELECT public.assign_permission_to_role('compliance_officer'::public.user_role, 'edit_profile');

-- =============================================
-- Funciones para consultar permisos
-- =============================================

-- Función para verificar si un rol tiene un permiso específico
CREATE OR REPLACE FUNCTION public.role_has_permission(
    p_role public.user_role,
    p_permission_code VARCHAR(100)
)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 
        FROM public.role_permissions rp
        JOIN public.permissions p ON p.id = rp.permission_id
        WHERE rp.role = p_role AND p.code = p_permission_code
    );
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- Función para obtener todos los permisos de un rol
CREATE OR REPLACE FUNCTION public.get_role_permissions(p_role public.user_role)
RETURNS TABLE (
    permission_code VARCHAR(100),
    permission_name VARCHAR(255),
    module VARCHAR(100)
) AS $$
BEGIN
    RETURN QUERY
    SELECT p.code, p.name, p.module
    FROM public.role_permissions rp
    JOIN public.permissions p ON p.id = rp.permission_id
    WHERE rp.role = p_role
    ORDER BY p.module, p.code;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- Función para verificar si el usuario actual tiene un permiso
CREATE OR REPLACE FUNCTION public.current_user_has_permission(p_permission_code VARCHAR(100))
RETURNS BOOLEAN AS $$
DECLARE
    v_role public.user_role;
BEGIN
    SELECT role INTO v_role FROM public.profiles WHERE id = auth.uid();
    IF v_role IS NULL THEN
        RETURN FALSE;
    END IF;
    RETURN public.role_has_permission(v_role, p_permission_code);
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- Función para obtener los permisos del usuario actual
CREATE OR REPLACE FUNCTION public.get_current_user_permissions()
RETURNS TABLE (
    permission_code VARCHAR(100),
    permission_name VARCHAR(255),
    module VARCHAR(100)
) AS $$
DECLARE
    v_role public.user_role;
BEGIN
    SELECT role INTO v_role FROM public.profiles WHERE id = auth.uid();
    IF v_role IS NOT NULL THEN
        RETURN QUERY SELECT * FROM public.get_role_permissions(v_role);
    END IF;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

-- =============================================
-- Políticas RLS para las tablas de permisos
-- =============================================

ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;

-- Todos los usuarios autenticados pueden ver los permisos
CREATE POLICY "permissions_select_policy" ON public.permissions
FOR SELECT TO authenticated
USING (true);

-- Solo admin puede modificar permisos
CREATE POLICY "permissions_admin_policy" ON public.permissions
FOR ALL TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- Todos los usuarios autenticados pueden ver la relación rol-permisos
CREATE POLICY "role_permissions_select_policy" ON public.role_permissions
FOR SELECT TO authenticated
USING (true);

-- Solo admin puede modificar la relación rol-permisos
CREATE POLICY "role_permissions_admin_policy" ON public.role_permissions
FOR ALL TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- =============================================
-- Permisos de ejecución de funciones
-- =============================================

GRANT EXECUTE ON FUNCTION public.role_has_permission(public.user_role, VARCHAR) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_role_permissions(public.user_role) TO authenticated;
GRANT EXECUTE ON FUNCTION public.current_user_has_permission(VARCHAR) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_current_user_permissions() TO authenticated;
GRANT EXECUTE ON FUNCTION public.assign_permission_to_role(public.user_role, VARCHAR) TO service_role;

-- =============================================
-- Comentarios para documentación
-- =============================================

COMMENT ON TABLE public.permissions IS 'Catálogo de permisos disponibles en el sistema';
COMMENT ON TABLE public.role_permissions IS 'Relación entre roles y sus permisos asignados';
COMMENT ON FUNCTION public.role_has_permission IS 'Verifica si un rol tiene un permiso específico';
COMMENT ON FUNCTION public.get_role_permissions IS 'Obtiene todos los permisos de un rol';
COMMENT ON FUNCTION public.current_user_has_permission IS 'Verifica si el usuario autenticado tiene un permiso';
COMMENT ON FUNCTION public.get_current_user_permissions IS 'Obtiene todos los permisos del usuario autenticado';
