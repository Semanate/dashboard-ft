/* eslint-disable @typescript-eslint/no-explicit-any */


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