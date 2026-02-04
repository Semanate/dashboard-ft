import { redirect, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
    if (!locals.user) {
        throw redirect(303, '/login');
    }

    const { supabase } = locals;
    const userRole = (locals.user as { role?: string }).role;

    // If the user is not a compliance officer or admin, redirect to dashboard
    if (userRole !== 'compliance_officer' && userRole !== 'admin') {
        throw redirect(303, '/dashboard');
    }

    // Get pending and reviewed SARLAFT forms
    const { data: pendingForms, error: pendingError } = await supabase
        .from('sarlaft_forms')
        .select(`
            id,
            status,
            created_at,
            updated_at,
            type_person_agreement,
            payload,
            user_id,
            reviewed_by,
            review_notes
        `)
        .eq('status', 'submitted')
        .order('created_at', { ascending: false });

    if (pendingError) {
        console.error('Error loading pending forms:', pendingError);
    }

    const { data: reviewedForms, error: reviewedError } = await supabase
        .from('sarlaft_forms')
        .select(`
            id,
            status,
            created_at,
            updated_at,
            type_person_agreement,
            user_id,
            payload,
            reviewed_at,
            reviewed_by,
            review_notes
        `)
        .in('status', ['approved', 'rejected'])
        .order('reviewed_at', { ascending: false })
        .limit(50);

    if (reviewedError) {
        console.error('Error loading reviewed forms:', reviewedError);
    }

    // Statistics
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
        },
        userRole: userRole || ''
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
        const signature = formData.get('signature') as string;

        if (!formId) {
            return fail(400, { error: 'ID de formulario requerido' });
        }

        const { supabase } = locals;
        const isComplianceOfficer = userRole === 'compliance_officer';

        // Get current form data to update payload
        const { data: currentForm, error: fetchError } = await supabase
            .from('sarlaft_forms')
            .select('payload')
            .eq('id', formId)
            .single();

        if (fetchError || !currentForm) {
            return fail(400, { error: 'Formulario no encontrado' });
        }

        let payload = currentForm.payload || {};

        if (isComplianceOfficer) {
            if (!signature) {
                return fail(400, { error: 'La firma es obligatoria para el Oficial de Cumplimiento' });
            }

            // Create verification block
            const verificationBlock = {
                name: (locals.user.user_metadata?.first_name || '') + ' ' + (locals.user.user_metadata?.last_name || ''),
                signature: signature,
                date: new Date().toLocaleDateString('es-CO'),
                time: new Date().toLocaleTimeString('es-CO'),
                auth: 'SI'
            };

            // Update payload with verification
            // Assuming structure based on SarlaftForm type: verification.block1 or similar. 
            // The requirement says "almacenando los datos correspondientes a la validación".
            // We will put it in payload.verification.block1 for now as a primary validation block.
            payload = {
                ...payload,
                verification: {
                    ...payload.verification,
                    block1: verificationBlock
                }
            };
        }

        const { error } = await supabase
            .from('sarlaft_forms')
            .update({
                status: 'approved',
                reviewed_at: new Date().toISOString(),
                reviewed_by: locals.user.id,
                review_notes: notes || null,
                payload: payload
            })
            .eq('id', formId)
            .eq('status', 'submitted'); // Only approve if status is submitted

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
