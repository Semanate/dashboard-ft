import { json } from '@sveltejs/kit';

export async function POST({ request, cookies }) {
    const { access_token, refresh_token } = await request.json();

    if (access_token) {
        cookies.set("sb-access-token", access_token, {
            path: "/",
            httpOnly: true,
            sameSite: "lax",
            secure: false, // Set true in prod
            maxAge: 60 * 60 * 24 * 7
        });
    }
    if (refresh_token) {
        cookies.set("sb-refresh-token", refresh_token, {
            path: "/",
            httpOnly: true,
            sameSite: "lax",
            secure: false, // Set true in prod
            maxAge: 60 * 60 * 24 * 30
        });
    }

    return json({ success: true });
}
