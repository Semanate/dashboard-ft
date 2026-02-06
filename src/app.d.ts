// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
import type { SupabaseClient, User } from '@supabase/supabase-js';
import type { Role } from '$lib/types/roles';

declare global {
	namespace App {
		interface Error {
			message: string;
			code?: string;
		}

		interface Locals {
			user: (User & { role: Role }) | null;
			accessToken: string | null;
			refreshToken: string | null;
			supabase: SupabaseClient;
		}

		interface PageData {
			user?: User & { role: Role };
		}

		// interface PageState {}
		// interface Platform {}
	}
}


export { };
