/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Get Values del formData expand
 * @param formData
 */
export function getValues<T>(formData: Record<string, any>): T | any {
    const arr = Object.values(formData);
    const clean = JSON.parse(JSON.stringify(arr));
    const merged = Object.assign({}, ...clean);
    const fullObject = expand(merged);
    return fullObject;
}

/**
 * 
 * @param obj 
 * @returns 
 * @description This Expand
 */
export function expand(obj: any) {
    const result: any = {};

    for (const key in obj) {
        const parts = key.split(".");
        let ref = result;

        parts.forEach((part, i) => {
            const arrayMatch = part.match(/(.*)\[(\d+)\]/);

            if (arrayMatch) {
                const name = arrayMatch[1];
                const index = Number(arrayMatch[2]);

                ref[name] = ref[name] || [];
                ref[name][index] = ref[name][index] || {};

                if (i === parts.length - 1) {
                    ref[name][index] = obj[key];
                } else {
                    ref = ref[name][index];
                }
            } else {
                if (i === parts.length - 1) {
                    ref[part] = obj[key];
                } else {
                    ref[part] = ref[part] || {};
                    ref = ref[part];
                }
            }
        });
    }

    return result;
}


/**
 * * @param index
 * * @param categories
 * * @param formData
 * * @param resolveVisibility
 * * @param fieldErrors
 * * @returns
 * @description This function validates a specific step in a multi-step form by checking if required fields are filled out. It takes into account the visibility of the step and updates the fieldErrors object with any validation errors found.
 */
export function validateStep(index: number, categories: any, formData: any, resolveVisibility: any, fieldErrors: Record<number, Record<string, string>>) {
    const currentCategory = categories[index];
    if (!currentCategory) {
        return { isValid: true, errors: {} as Record<string, string> };
    }

    if (!resolveVisibility(currentCategory)) {
        fieldErrors[index] = {};
        return { isValid: true, errors: {} as Record<string, string> };
    }

    // if ((currentCategory.isVisible(values) ?? true) === false) {
    //   fieldErrors[index] = {};
    //   return { isValid: true, errors: {} as Record<string, string> };
    // }

    let isValid = true;
    const newErrors: Record<string, string> = {};

    currentCategory.fields.forEach((field: any) => {
        if (field.required === false || field.type === "file") {
            newErrors[field.name] = "";
            return;
        }

        const value = formData[index]?.[field.name];
        const isEmpty =
            value === null ||
            value === undefined ||
            (typeof value === "string" && value.trim() === "") ||
            (Array.isArray(value) && value.length === 0);

        if (isEmpty) {
            newErrors[field.name] = "Este campo es requerido";
            isValid = false;
        } else {
            newErrors[field.name] = "";
        }
    });

    fieldErrors[index] = newErrors;

    return { isValid, errors: newErrors };
}
/**
 * @param visibleIndexes
 * @param categories
 * @param formData
 * @param resolveVisibility
 * @param fieldErrors
 * @returns boolean
 * @description This function checks if all steps in the visibleIndexes array are valid by validating each step using the validateStep function.
 */

export function isValid(visibleIndexes: number[], categories: any, formData: any, resolveVisibility: any, fieldErrors: Record<number, Record<string, string>>): boolean {
    return visibleIndexes.every((realIndex) => validateStep(realIndex, categories, formData, resolveVisibility, fieldErrors).isValid);
}


export function toFormData(obj: any, form = new FormData(), parentKey = "") {
    if (obj === null || obj === undefined) return form;

    if (obj instanceof File) {
        form.append(parentKey, obj);
        return form;
    }

    if (Array.isArray(obj)) {
        obj.forEach((value, index) => {
            toFormData(value, form, `${parentKey}[${index}]`);
        });
        return form;
    }

    if (typeof obj === "object") {
        Object.entries(obj).forEach(([key, value]) => {
            const fullKey = parentKey ? `${parentKey}.${key}` : key;
            toFormData(value, form, fullKey);
        });
        return form;
    }

    form.append(parentKey, String(obj));
    return form;
}

