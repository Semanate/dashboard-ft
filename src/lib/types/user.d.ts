/* eslint-disable @typescript-eslint/no-explicit-any */

export interface AdminUser {
    id: string
    email: string
    name: string | null
    role: string
    created_at: string
}
