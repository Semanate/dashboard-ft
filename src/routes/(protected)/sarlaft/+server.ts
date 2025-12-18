import { createFormSarlaftPayload } from '$lib/api/admin/sarlaft';
import { json } from '@sveltejs/kit';
import { getUserSarlaftPayload } from '$lib/api/admin/sarlaft';

export const POST = async ({ request, cookies }) => {
    const accessToken = cookies.get('sb-access-token');
    if (!accessToken) {
        return json({ error: 'No autorizado' }, { status: 401 });
    }

    const payload = await request.json();
    const response = await createFormSarlaftPayload(
        accessToken,
        payload
    );

    return json(response);
};

export const GET = async ({ cookies }) => {
    const accessToken = cookies.get('sb-access-token');
    if (!accessToken) {
        return json({ error: 'No autorizado' }, { status: 401 });
    }

    const dataSarlaft = await getUserSarlaftPayload(accessToken, { includePayload: false });
    return json(dataSarlaft);
}