import { deleteSarlaftById, getUserSarlaftPayload, invokeCreateSarlaft } from '$lib/api/admin/sarlaft';
import { json } from '@sveltejs/kit';

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

export const GET = async ({ cookies, url }) => {
    const accessToken = cookies.get('sb-access-token');
    if (!accessToken) {
        return json({ error: 'No autorizado' }, { status: 401 });
    }

    // Get query parameters
    const status = url.searchParams.get('status') || undefined;
    const limit = parseInt(url.searchParams.get('limit') || '100');
    const offset = parseInt(url.searchParams.get('offset') || '0');

    const data = await getUserSarlaftPayload(accessToken, { 
        includePayload: true, 
        limit, 
        offset,
        status 
    });

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