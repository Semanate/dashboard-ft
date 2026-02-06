-- =============================================
-- Migration: Notifications System
-- Date: 2026-02-06
-- Description: Creates notifications table and triggers for compliance forms
-- =============================================

-- 1. Create Notifications Table
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    form_id UUID REFERENCES public.sarlaft_forms(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'read', 'approved')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Enable RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- 3. RLS Policies
-- Users can view their own notifications
-- DROP POLICY IF EXISTS "notifications_select_own" ON public.notifications;
-- CREATE POLICY "notifications_select_own" ON public.notifications
--     FOR SELECT USING (auth.uid() = user_id);

-- Users can update their own notifications (to mark as read)
-- DROP POLICY IF EXISTS "notifications_update_own" ON public.notifications;
-- CREATE POLICY "notifications_update_own" ON public.notifications
--     FOR UPDATE USING (auth.uid() = user_id);

-- 4. Trigger Function
CREATE OR REPLACE FUNCTION public.handle_new_form_notification()
RETURNS TRIGGER AS $$
DECLARE
    officer RECORD;
BEGIN
    -- Trigger on Insert if status is submitted, or Update if status becomes submitted
    IF (TG_OP = 'INSERT' AND NEW.status = 'submitted') OR 
       (TG_OP = 'UPDATE' AND OLD.status != 'submitted' AND NEW.status = 'submitted') THEN
       
        -- Fan-out: Notify all compliance officers
        FOR officer IN SELECT id FROM public.profiles WHERE role = 'compliance_officer' LOOP
            INSERT INTO public.notifications (user_id, form_id, message, status)
            VALUES (
                officer.id, 
                NEW.id, 
                'Tienes un nuevo formulario de cumplimiento esperando revisión.', 
                'pending'
            );
        END LOOP;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Create Trigger
DROP TRIGGER IF EXISTS trg_notify_new_form ON public.sarlaft_forms;
CREATE TRIGGER trg_notify_new_form
    AFTER INSERT OR UPDATE ON public.sarlaft_forms
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_form_notification();

-- 6. Indexes
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_status ON public.notifications(status);
