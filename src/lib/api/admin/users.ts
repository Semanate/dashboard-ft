import type { AdminUser } from '$lib/types/user'
import { callEdge } from '$lib/api/index'
import type { ApiResponse } from '$lib/types/api'

export function fetchAdminUsers(
    accessToken: string
): Promise<ApiResponse<AdminUser[]>> {
    return callEdge<AdminUser[]>('list-users', accessToken)
}
