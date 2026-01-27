-- Migración para agregar campos de revisión a sarlaft_forms
-- Para el flujo de aprobación por el oficial de cumplimiento

-- Agregar columnas de revisión
ALTER TABLE public.sarlaft_forms 
ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS reviewed_by UUID REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS review_notes TEXT;

-- Crear índice para búsquedas por estado
CREATE INDEX IF NOT EXISTS idx_sarlaft_forms_status ON public.sarlaft_forms(status);

-- Crear índice para búsquedas por revisor
CREATE INDEX IF NOT EXISTS idx_sarlaft_forms_reviewed_by ON public.sarlaft_forms(reviewed_by);

-- Política RLS para que compliance_officer y admin puedan ver todos los formularios
DROP POLICY IF EXISTS "Compliance officers can view all submitted forms" ON public.sarlaft_forms;
CREATE POLICY "Compliance officers can view all submitted forms"
ON public.sarlaft_forms
FOR SELECT
TO authenticated
USING (
    status IN ('submitted', 'approved', 'rejected')
    AND EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.role IN ('compliance_officer', 'admin')
    )
);

-- Política RLS para que compliance_officer y admin puedan actualizar el estado
DROP POLICY IF EXISTS "Compliance officers can update form status" ON public.sarlaft_forms;
CREATE POLICY "Compliance officers can update form status"
ON public.sarlaft_forms
FOR UPDATE
TO authenticated
USING (
    status = 'submitted'
    AND EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.role IN ('compliance_officer', 'admin')
    )
)
WITH CHECK (
    status IN ('approved', 'rejected')
    AND EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.role IN ('compliance_officer', 'admin')
    )
);

-- Función para aprobar formulario
CREATE OR REPLACE FUNCTION public.approve_sarlaft_form(
    p_form_id UUID,
    p_notes TEXT DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_user_role TEXT;
    v_result JSON;
BEGIN
    -- Verificar rol del usuario
    SELECT role INTO v_user_role
    FROM public.profiles
    WHERE id = auth.uid();

    IF v_user_role NOT IN ('compliance_officer', 'admin') THEN
        RETURN json_build_object('success', false, 'error', 'No autorizado');
    END IF;

    -- Actualizar el formulario
    UPDATE public.sarlaft_forms
    SET 
        status = 'approved',
        reviewed_at = NOW(),
        reviewed_by = auth.uid(),
        review_notes = p_notes
    WHERE id = p_form_id AND status = 'submitted';

    IF NOT FOUND THEN
        RETURN json_build_object('success', false, 'error', 'Formulario no encontrado o ya procesado');
    END IF;

    RETURN json_build_object('success', true, 'message', 'Formulario aprobado');
END;
$$;

-- Función para rechazar formulario
CREATE OR REPLACE FUNCTION public.reject_sarlaft_form(
    p_form_id UUID,
    p_notes TEXT
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_user_role TEXT;
BEGIN
    -- Verificar rol del usuario
    SELECT role INTO v_user_role
    FROM public.profiles
    WHERE id = auth.uid();

    IF v_user_role NOT IN ('compliance_officer', 'admin') THEN
        RETURN json_build_object('success', false, 'error', 'No autorizado');
    END IF;

    -- La razón es obligatoria
    IF p_notes IS NULL OR LENGTH(TRIM(p_notes)) < 10 THEN
        RETURN json_build_object('success', false, 'error', 'Debe proporcionar una razón válida');
    END IF;

    -- Actualizar el formulario
    UPDATE public.sarlaft_forms
    SET 
        status = 'rejected',
        reviewed_at = NOW(),
        reviewed_by = auth.uid(),
        review_notes = p_notes
    WHERE id = p_form_id AND status = 'submitted';

    IF NOT FOUND THEN
        RETURN json_build_object('success', false, 'error', 'Formulario no encontrado o ya procesado');
    END IF;

    RETURN json_build_object('success', true, 'message', 'Formulario rechazado');
END;
$$;

COMMENT ON COLUMN public.sarlaft_forms.reviewed_at IS 'Fecha y hora de la revisión';
COMMENT ON COLUMN public.sarlaft_forms.reviewed_by IS 'ID del usuario que revisó el formulario';
COMMENT ON COLUMN public.sarlaft_forms.review_notes IS 'Notas o comentarios del revisor';
