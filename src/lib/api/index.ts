import type { ApiResponse } from '$lib/types/api'
import { PUBLIC_EDGE_BASE_URL } from '$env/static/public'

const EDGE_BASE_URL = PUBLIC_EDGE_BASE_URL
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
