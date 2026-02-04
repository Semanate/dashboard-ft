import { fail } from '@sveltejs/kit';
import { createSupabaseClient } from '$lib/db/client';

export const actions = {
    default: async ({ request, url }) => {
        const formData = await request.formData();
        const email = formData.get('email')?.toString();

        if (!email) {
            return fail(400, {
                error: true,
                message: 'El correo electrónico es obligatorio'
            });
        }

        const supabase = createSupabaseClient();

        try {
            const { error: supabaseError } =
                await supabase.auth.resetPasswordForEmail(email, {
                    redirectTo: `${url.origin}/update-password`
                });

            if (supabaseError) {
                console.log(supabaseError);
                console.error(
                    'Cant request reset pass:',
                    supabaseError.message
                );

                return fail(500, {
                    error: true,
                    message:
                        'Error al enviar el correo de recuperación. Inténtalo de nuevo.'
                });
            }
        } catch (err: unknown) {
            const message =
                err instanceof Error ? err.message : String(err);

            console.error('Cant request reset pass:', message);

            return fail(500, {
                error: true,
                message:
                    'Error al enviar el correo de recuperación. Inténtalo de nuevo.'
            });
        }

        return {
            success: true,
            message: 'Se ha enviado un enlace de recuperación a tu correo.'
        };
    }
};
