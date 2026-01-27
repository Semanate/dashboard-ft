import { redirect, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
    if (!locals.user) {
        throw redirect(303, '/login');
    }

    const { supabase } = locals;
    const userRole = (locals.user as { role?: string }).role;

    // Solo compliance_officer y admin pueden ver esta página
    if (userRole !== 'compliance_officer' && userRole !== 'admin') {
        throw redirect(303, '/dashboard');
    }

    // Obtener formularios pendientes de revisión (status = submitted)
    const { data: pendingForms, error: pendingError } = await supabase
        .from('sarlaft_forms')
        .select(`
            id,
            status,
            created_at,
            updated_at,
            "typePersonAggrement",
            "naturalPerson",
            "juridicalPerson",
            user_id,
            profiles!sarlaft_forms_user_id_fkey (
                id,
                first_name,
                last_name,
                email
            )
        `)
        .eq('status', 'submitted')
        .order('created_at', { ascending: false });

    if (pendingError) {
        console.error('Error loading pending forms:', pendingError);
    }

    // Obtener historial de formularios ya revisados (approved/rejected)
    const { data: reviewedForms, error: reviewedError } = await supabase
        .from('sarlaft_forms')
        .select(`
            id,
            status,
            created_at,
            updated_at,
            "typePersonAggrement",
            "naturalPerson",
            "juridicalPerson",
            user_id,
            reviewed_at,
            reviewed_by,
            review_notes,
            profiles!sarlaft_forms_user_id_fkey (
                id,
                first_name,
                last_name,
                email
            )
        `)
        .in('status', ['approved', 'rejected'])
        .order('reviewed_at', { ascending: false })
        .limit(50);

    if (reviewedError) {
        console.error('Error loading reviewed forms:', reviewedError);
    }

    // Estadísticas
    const { count: totalPending } = await supabase
        .from('sarlaft_forms')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'submitted');

    const { count: totalApproved } = await supabase
        .from('sarlaft_forms')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'approved');

    const { count: totalRejected } = await supabase
        .from('sarlaft_forms')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'rejected');

    return {
        pendingForms: pendingForms || [],
        reviewedForms: reviewedForms || [],
        stats: {
            pending: totalPending || 0,
            approved: totalApproved || 0,
            rejected: totalRejected || 0
        }
    };
};

export const actions: Actions = {
    approve: async ({ request, locals }) => {
        if (!locals.user) {
            return fail(401, { error: 'No autorizado' });
        }

        const userRole = (locals.user as { role?: string }).role;
        if (userRole !== 'compliance_officer' && userRole !== 'admin') {
            return fail(403, { error: 'No tiene permisos para aprobar formularios' });
        }

        const formData = await request.formData();
        const formId = formData.get('formId') as string;
        const notes = formData.get('notes') as string;

        if (!formId) {
            return fail(400, { error: 'ID de formulario requerido' });
        }

        const { supabase } = locals;

        const { error } = await supabase
            .from('sarlaft_forms')
            .update({
                status: 'approved',
                reviewed_at: new Date().toISOString(),
                reviewed_by: locals.user.id,
                review_notes: notes || null
            })
            .eq('id', formId)
            .eq('status', 'submitted'); // Solo aprobar si está en submitted

        if (error) {
            console.error('Error approving form:', error);
            return fail(500, { error: 'Error al aprobar el formulario' });
        }

        return { success: true, message: 'Formulario aprobado exitosamente' };
    },

    reject: async ({ request, locals }) => {
        if (!locals.user) {
            return fail(401, { error: 'No autorizado' });
        }

        const userRole = (locals.user as { role?: string }).role;
        if (userRole !== 'compliance_officer' && userRole !== 'admin') {
            return fail(403, { error: 'No tiene permisos para rechazar formularios' });
        }

        const formData = await request.formData();
        const formId = formData.get('formId') as string;
        const notes = formData.get('notes') as string;

        if (!formId) {
            return fail(400, { error: 'ID de formulario requerido' });
        }

        if (!notes || notes.trim().length < 10) {
            return fail(400, { error: 'Debe proporcionar una razón para el rechazo (mínimo 10 caracteres)' });
        }

        const { supabase } = locals;

        const { error } = await supabase
            .from('sarlaft_forms')
            .update({
                status: 'rejected',
                reviewed_at: new Date().toISOString(),
                reviewed_by: locals.user.id,
                review_notes: notes
            })
            .eq('id', formId)
            .eq('status', 'submitted'); // Solo rechazar si está en submitted

        if (error) {
            console.error('Error rejecting form:', error);
            return fail(500, { error: 'Error al rechazar el formulario' });
        }

        return { success: true, message: 'Formulario rechazado' };
    }
};
