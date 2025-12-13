import type { AdminUser } from '$lib/types/user'
import { callEdge } from '$lib/api/index'
import type { ApiResponse } from '$lib/types/api'

export function fetchAdminUsers(
    accessToken: string
): Promise<ApiResponse<AdminUser[]>> {
    return callEdge<AdminUser[]>('list-users', accessToken)
}
export function updateUserRole(
    accessToken: string,
    userId: string,
    role: string
): Promise<ApiResponse<void>> {
    return callEdge<void>('update-user-role', accessToken, { userId, role })
}