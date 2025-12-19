/* eslint-disable @typescript-eslint/no-explicit-any */
export function getByPath(obj: any, path: string): any {
    if (!obj || !path) return "";

    return path
        .replace(/\[(\d+)\]/g, ".$1")
        .split(".")
        .reduce((acc, key) => {
            if (acc && acc[key] !== undefined && acc[key] !== null) {
                return acc[key];
            }
            return "";
        }, obj);
}


export function mapPayloadToFlatObject(
    payload: any,
    mappings: Record<string, string | Function>
) {
    const result: Record<string, any> = {};

    for (const [key, resolver] of Object.entries(mappings)) {
        if (typeof resolver === "string") {
            result[key] = getByPath(payload, resolver) ?? "";
        } else if (typeof resolver === "function") {
            result[key] = resolver(payload);
        } else {
            result[key] = "";
        }
    }

    return result;
}
