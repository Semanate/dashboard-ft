import { deleteSarlaftById, invokeCreateSarlaft } from '$lib/api/admin/sarlaft';
import { json } from '@sveltejs/kit';
import { getUserSarlaftPayload } from '$lib/api/admin/sarlaft';

export const POST = async ({ request, cookies }) => {
    const accessToken = cookies.get('sb-access-token');
    if (!accessToken) {
        return json({ error: 'No autorizado' }, { status: 401 });
    }

    const formData = await request.formData();
    
    const response = await invokeCreateSarlaft(accessToken, formData);

    return json(response);
};

export const GET = async ({ cookies }) => {
    const accessToken = cookies.get('sb-access-token');
    if (!accessToken) {
        return json({ error: 'No autorizado' }, { status: 401 });
    }

    const dataSarlaft = await getUserSarlaftPayload(accessToken, { includePayload: true, limit: 100, offset: 0 });
    return json(dataSarlaft);
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