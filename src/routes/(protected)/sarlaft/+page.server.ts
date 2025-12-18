import { fail, redirect } from '@sveltejs/kit';
import { supabase } from '$lib/db/client';
import { ErrorCodes } from '$lib/constants/error.codes.js';
import { createFormSarlaftPayload, getUserSarlaftPayload } from '$lib/api/admin/sarlaft.js';
import type { FormDataType } from '$lib/types';

export const load = async ({ cookies }) => {
    const accessToken = cookies.get("sb-access-token");
    if (!accessToken) {
        throw redirect(303, '/login');
    }

    const { data: { user } } = await supabase.auth.getUser(accessToken);
    const dataSarlaft = await getUserSarlaftPayload(accessToken, { includePayload: false });

    console.log('Data Sarlaft in load function:', dataSarlaft);
    if (!dataSarlaft.success) {

        throw fail(500, { error: 'Error al obtener los formularios Sarlaft' });
    }

    return { user, sarlaftForms: dataSarlaft.data };
};

// export const actions = {
//     createForm: async ({ request, cookies }) => {
//         const accessToken = cookies.get("sb-access-token");
//         if (!accessToken) {
//             return fail(401, { error: 'No autorizado' });
//         }
//         console.log("entre")

//         const body = await request.json();

//         if (!body || Object.keys(body).length === 0) {
//             return fail(400, {
//                 ...ErrorCodes.MISSING_FIELDS, message: ErrorCodes.MISSING_FIELDS.message.replace('${message}', 'obligatorios')
//             });
//         }


//         try {
//             const response = await createFormSarlaftPayload(accessToken, body as unknown as FormDataType);

//             if (!response.success) {
//                 return fail(500, { error: 'Error al crear el formulario Sarlaft' });
//             }

//             return { success: true };
//         } catch (err) {
//             console.error('Exception creating Sarlaft form:', err);
//             return fail(500, { error: 'Error interno del servidor' });
//         }
//     }

// };
