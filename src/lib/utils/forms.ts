/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Get Values del formData expand
 * @param formData
 */

export function getValues<T>(formData: Record<string, any>): T | any {
    const arr = Object.values(formData);

    // En lugar de JSON.parse(JSON.stringify()), hacemos una copia profunda manual
    // que preserve los objetos File
    const clean = arr.map(obj => {
        const newObj: Record<string, any> = {};
        for (const key in obj) {
            const value = obj[key];
            // Preservar File, FileList y otros objetos especiales
            if (value instanceof File || value instanceof FileList || value instanceof Blob) {
                newObj[key] = value;
            } else if (value && typeof value === 'object' && !Array.isArray(value)) {
                // Para objetos anidados, hacer copia profunda
                newObj[key] = JSON.parse(JSON.stringify(value));
            } else {
                // Para valores primitivos y arrays
                newObj[key] = value;
            }
        }
        return newObj;
    });

    const merged = Object.assign({}, ...clean);
    const fullObject = expand(merged);
    return fullObject;
}

export function getValuesRobust<T>(formData: Record<string, any>): T | any {
    const arr = Object.values(formData);

    function deepClone(obj: any): any {
        if (obj === null || obj === undefined) return obj;

        if (obj instanceof File ||
            obj instanceof FileList ||
            obj instanceof Blob ||
            obj instanceof Date) {
            return obj;
        }

        // Arrays
        if (Array.isArray(obj)) {
            return obj.map(item => deepClone(item));
        }

        // Objetos
        if (typeof obj === 'object') {
            const cloned: Record<string, any> = {};
            for (const key in obj) {
                if (Object.prototype.hasOwnProperty.call(obj, key)) {
                    cloned[key] = deepClone(obj[key]);
                }
            }
            return cloned;
        }

        // Primitivos
        return obj;
    }

    const clean = arr.map(obj => deepClone(obj));
    const merged = Object.assign({}, ...clean);
    const fullObject = expandWithArrays(merged);
    return fullObject;
}

function expandWithArrays(obj: Record<string, any>) {
    const result: any = {};

    for (const key in obj) {
        const value = obj[key];

        const parts = key
            .replace(/\]/g, "")
            .split(/\.|\[/); // soporta dots y [index]

        let current = result;

        parts.forEach((part, index) => {
            const isLast = index === parts.length - 1;
            const nextPart = parts[index + 1];
            const isArrayIndex = /^\d+$/.test(nextPart);

            if (isLast) {
                current[part] = value;
                return;
            }

            if (!(part in current)) {
                current[part] = isArrayIndex ? [] : {};
            }

            current = current[part];
        });
    }

    return result;
}

/**
 * 
 * @param obj 
 * @returns 
 * @description This Expand
 */
function expand(obj: Record<string, any>): any {
    const result: Record<string, any> = {};

    for (const key in obj) {
        const value = obj[key];
        const keys = key.split('.');

        let current = result;
        for (let i = 0; i < keys.length - 1; i++) {
            const k = keys[i];
            if (!current[k]) {
                current[k] = {};
            }
            current = current[k];
        }

        const lastKey = keys[keys.length - 1];
        current[lastKey] = value;
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
export function validateStep(
    index: number,
    categories: any,
    formData: any,
    resolveVisibility: any,
    fieldErrors: Record<number, Record<string, string>>
) {
    const currentCategory = categories[index];
    if (!currentCategory) {
        return { isValid: true, errors: {} as Record<string, string> };
    }
    if (!resolveVisibility(currentCategory)) {
        fieldErrors[index] = {};
        return { isValid: true, errors: {} as Record<string, string> };
    }

    let isValid = true;
    const newErrors: Record<string, string> = {};

    // Function to validate a single field
    const validateField = (field: any) => {
        const value = formData[index]?.[field.name];

        // Better empty check including FileList
        let isEmpty =
            value === null ||
            value === undefined ||
            (typeof value === "string" && value.trim() === "") ||
            (Array.isArray(value) && value.length === 0);

        if (!isEmpty && typeof window !== 'undefined' && value instanceof FileList) {
            isEmpty = value.length === 0;
        }

        if (isEmpty) {
            if (field.required !== false) {
                newErrors[field.name] = "Este campo es requerido";
                isValid = false;
            } else {
                newErrors[field.name] = "";
            }
        } else {
            if (field.type === "number") {
                const n = Number(value);
                if (field.max !== undefined && n > Number(field.max)) {
                    newErrors[field.name] = `El valor máximo es ${field.max}`;
                    isValid = false;
                } else if (field.min !== undefined && n < Number(field.min)) {
                    newErrors[field.name] = `El valor mínimo es ${field.min}`;
                    isValid = false;
                } else {
                    newErrors[field.name] = "";
                }
            } else {
                newErrors[field.name] = "";
            }
        }
    };

    // If the category has fields (old structure)
    if (currentCategory.fields && Array.isArray(currentCategory.fields)) {
        currentCategory.fields.forEach(validateField);
    }

    // If the category has subsections (new structure)
    if (currentCategory.subsections && Array.isArray(currentCategory.subsections)) {
        currentCategory.subsections.forEach((subsection: any) => {
            if (subsection.items && Array.isArray(subsection.items)) {
                subsection.items.forEach((item: any) => {
                    if (item.fields && Array.isArray(item.fields)) {
                        item.fields.forEach(validateField);
                    }
                });
            }
        });
    }

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
    // 1. Verificar null/undefined PRIMERO
    if (obj === null || obj === undefined) {
        return form;
    }

    // 2. Verificar File ANTES que object (File es un objeto!)
    if (obj instanceof File) {
        form.append(parentKey, obj);
        return form;
    }

    // 3. Verificar Blob (por si acaso)
    if (obj instanceof Blob) {
        form.append(parentKey, obj);
        return form;
    }

    // 4. Verificar FileList
    if (obj instanceof FileList) {
        Array.from(obj).forEach((file, index) => {
            form.append(`${parentKey}[${index}]`, file);
        });
        return form;
    }

    // 5. Verificar Date (antes de array/object)
    if (obj instanceof Date) {
        form.append(parentKey, obj.toISOString());
        return form;
    }

    // 6. Ahora sí, arrays
    if (Array.isArray(obj)) {
        obj.forEach((value, index) => {
            toFormData(value, form, `${parentKey}[${index}]`);
        });
        return form;
    }

    // 7. Objetos planos (DESPUÉS de todas las verificaciones especiales)
    if (typeof obj === "object") {
        Object.entries(obj).forEach(([key, value]) => {
            const fullKey = parentKey ? `${parentKey}.${key}` : key;
            toFormData(value, form, fullKey);
        });
        return form;
    }

    // 8. Primitivos (string, number, boolean)
    form.append(parentKey, String(obj));
    return form;
}


