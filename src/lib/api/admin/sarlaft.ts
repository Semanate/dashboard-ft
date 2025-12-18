/* eslint-disable @typescript-eslint/no-explicit-any */
import { callEdge } from '$lib/api/index'
import type { FormDataType } from '$lib/types'
import type { ApiResponse } from '$lib/types/api'


export function createFormSarlaftPayload(accessToken: string, formData: FormDataType): Promise<ApiResponse<any>> {
    return callEdge<any>('create-sarlaft', accessToken, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
    })


}

export function getUserSarlaftPayload(
    accessToken: string,
    options?: {
        limit?: number;
        offset?: number;
        status?: string;
        typePersonAggrement?: string;
        includePayload?: boolean;
    }
): Promise<ApiResponse<{ items: any[]; total: number }>> {
    const params = new URLSearchParams();
    if (options?.limit !== undefined) params.append('limit', options.limit.toString());
    if (options?.offset !== undefined) params.append('offset', options.offset.toString());
    if (options?.status) params.append('status', options.status);
    if (options?.typePersonAggrement) params.append('typePersonAggrement', options.typePersonAggrement);
    if (options?.includePayload) params.append('includePayload', 'true');
    const queryString = params.toString() ? `?${params.toString()}` : '';

    return callEdge<{ items: any[]; total: number }>('get-user-sarlaft' + queryString, accessToken, {
        method: 'GET',
    });
}
