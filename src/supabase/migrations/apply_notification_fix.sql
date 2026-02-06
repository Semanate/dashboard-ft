-- =====================================================
-- APLICAR FIX COMPLETO: Notificaciones Compliance Officer
-- =====================================================
-- Este script aplicará todas las correcciones necesarias
-- Ejecutar TODO este archivo en el SQL Editor de Supabase

BEGIN;

-- =====================================================
-- PASO 1: Limpiar políticas antiguas
-- =====================================================
DROP POLICY IF EXISTS "notifications_select_own" ON notifications;
DROP POLICY IF EXISTS "notifications_update_own" ON notifications;
DROP POLICY IF EXISTS "Users can view own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can view notifications based on role" ON notifications;
DROP POLICY IF EXISTS "Users can insert own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can update own notifications" ON notifications;
DROP POLICY IF EXISTS "Users can update notifications based on role" ON notifications;

-- =====================================================
-- PASO 2: Crear/Actualizar función helper
-- =====================================================
CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS TEXT
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT role
  FROM public.profiles
  WHERE id = auth.uid()
  LIMIT 1;
$$;

-- =====================================================
-- PASO 3: Habilitar RLS (forzar)
-- =====================================================
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- PASO 4: Crear política SELECT
-- =====================================================
CREATE POLICY "Users can view notifications based on role"
ON notifications
FOR SELECT
USING (
  -- Usuario normal ve solo sus notificaciones
  auth.uid() = user_id
  
  OR
  
  -- Oficial de cumplimiento ve TODAS las notificaciones de compliance officers
  (
    public.current_user_role() = 'compliance_officer'
    AND user_id IN (
      SELECT id
      FROM profiles
      WHERE role = 'compliance_officer'
    )
  )
);

-- =====================================================
-- PASO 5: Crear política UPDATE
-- =====================================================
CREATE POLICY "Users can update notifications based on role"
ON notifications
FOR UPDATE
USING (
  -- Usuario normal actualiza solo las suyas
  auth.uid() = user_id
  
  OR
  
  -- Oficial de cumplimiento actualiza cualquier notificación de compliance officers
  (
    public.current_user_role() = 'compliance_officer'
    AND user_id IN (
      SELECT id
      FROM profiles
      WHERE role = 'compliance_officer'
    )
  )
);

-- =====================================================
-- PASO 6: Crear política INSERT (opcional pero recomendado)
-- =====================================================
CREATE POLICY "System can insert notifications"
ON notifications
FOR INSERT
WITH CHECK (true);  -- Permite inserts desde triggers y sistema

-- =====================================================
-- PASO 7: Grant permisos
-- =====================================================
GRANT SELECT, UPDATE ON notifications TO authenticated;
GRANT INSERT ON notifications TO service_role;

COMMIT;

-- =====================================================
-- VERIFICACIÓN POST-APLICACIÓN
-- =====================================================
-- Ejecuta estas queries DESPUÉS de aplicar el script anterior:

-- 1. Verificar RLS está habilitado
-- SELECT tablename, rowsecurity FROM pg_tables WHERE tablename = 'notifications';

-- 2. Ver políticas aplicadas
-- SELECT policyname, cmd FROM pg_policies WHERE tablename = 'notifications';

-- 3. Probar como compliance officer
-- SELECT * FROM notifications ORDER BY created_at DESC LIMIT 10;
