/* eslint-disable @typescript-eslint/no-explicit-any */
import { callEdge } from '$lib/api/index'
import type { ApiResponse } from '$lib/types/api'


export async function invokeCreateSarlaft(
    accessToken: string,
    formData: FormData
): Promise<ApiResponse<any>> {

    for (const pair of formData.entries()) {
        // console.log(`${pair[0]}: ${pair[1]}`);
        if (pair[1] instanceof File) {
            console.log(`It's a file with name: ${pair[1].name}`);
        }
    }


    return callEdge<any>('create-sarlaft', accessToken, {
        method: 'POST',
        body: formData 
    });
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

export function getSarlaftById(
    accessToken: string,
    sarlaftId: string
): Promise<ApiResponse<any>> {
    return callEdge<any>(`get-sarlaft`, accessToken, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'x-sarlaft-id': sarlaftId
        },
    });
}

export function deleteSarlaftById(
    accessToken: string,
    sarlaftId: string
): Promise<ApiResponse<void>> {
    return callEdge<void>(`delete-sarlaft`, accessToken, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'x-sarlaft-id': sarlaftId
        },
    });
}
