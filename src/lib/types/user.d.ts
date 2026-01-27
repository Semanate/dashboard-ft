/* eslint-disable @typescript-eslint/no-explicit-any */

import type { Role } from './roles';

export interface AdminUser {
    id: string
    email: string
    name: string | null
    role: Role
    created_at: string
}

export interface UserProfile {
    id: string
    role: Role
    created_at?: string
    updated_at?: string
}

export interface UserWithProfile {
    id: string
    email: string
    role: Role
    created_at: string
    user_metadata?: {
        display_name?: string
        avatar_url?: string
    }
}
