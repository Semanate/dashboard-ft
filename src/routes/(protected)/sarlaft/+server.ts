import { createFormSarlaftPayload } from '$lib/api/admin/sarlaft';
import { json } from '@sveltejs/kit';

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
    console.log('Response from createFormSarlaftPayload:', response);

    return json(response);
};