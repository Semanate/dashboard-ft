import { deleteSarlaftById, getUserSarlaftPayload, invokeCreateSarlaft } from '$lib/api/admin/sarlaft';
import { json } from '@sveltejs/kit';
import { supabase } from '$lib/db/client.js';

export const POST = async ({ request, cookies }) => {
    const accessToken = cookies.get('sb-access-token');
    if (!accessToken) {
        return json({ error: 'No autorizado' }, { status: 401 });
    }

    const formData = await request.formData();
    const { success, error } = await invokeCreateSarlaft(accessToken, formData);

    if (!success) {
        return json({ error, }, { status: 500 });
    }
    return json({ success });
};

export const GET = async ({ cookies }) => {
    const accessToken = cookies.get('sb-access-token');
    if (!accessToken) {
        return json({ error: 'No autorizado' }, { status: 401 });
    }

    const data = await getUserSarlaftPayload(accessToken, { includePayload: true, limit: 100, offset: 0 });

    if (!data.success) {
        return json({ error: 'Error al obtener los formularios' }, { status: 500 });
    }


    return json(data);
}

export const DELETE = async ({ request, cookies }) => {
    const accessToken = cookies.get('sb-access-token');
    if (!accessToken) {
        return json({ error: 'No autorizado' }, { status: 401 });
    }
    const { id } = await request.json();
    if (!id) {
        return json({ error: 'ID requerido' }, { status: 400 });
    }

    const deleteResult = await deleteSarlaftById(accessToken, id);
    if (!deleteResult.success) {
        return json({ error: 'Error al eliminar el formulario' }, { status: 500 });
    }

    return json({ success: true, message: `Formulario con ID ${id} eliminado.` });
};