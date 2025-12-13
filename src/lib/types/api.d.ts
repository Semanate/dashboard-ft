/* eslint-disable @typescript-eslint/no-explicit-any */

export interface ApiResponse<T> {
    success: boolean
    data: T | null
    error?: string
    message?: string
    meta?: Record<string, any>
}
