import type { ApiResponse } from '$lib/types/api'

const EDGE_BASE_URL = 'http://127.0.0.1:54321/functions/v1'

export async function callEdge<T>(
  path: string,
  accessToken: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {

  const res = await fetch(`${EDGE_BASE_URL}/${path}`, {
    ...options,
    headers: {
      ...(options?.headers ?? {}),
      Authorization: `Bearer ${accessToken}`
    }
  })

  const body = await res.json() as ApiResponse<T>

  if (!res.ok) {
    return {
      success: false,
      data: null,
      error: body.error ?? 'Request failed'
    }
  }

  return body
}
