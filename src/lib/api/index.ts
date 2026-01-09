import type { ApiResponse } from '$lib/types/api'
import { browser } from '$app/environment'
import { env } from '$env/dynamic/private'

export function edgeBaseUrl() {
  return browser
    ? env.PUBLIC_EDGE_BASE_URL
    : env.EDGE_INTERNAL_URL
}

const EDGE_BASE_URL = edgeBaseUrl();
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
  try {
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
  catch (error) {
    console.error("Error response:", error);
    return {
      success: false,
      data: null,
      error: 'Invalid JSON response'
    }
  }

}
