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