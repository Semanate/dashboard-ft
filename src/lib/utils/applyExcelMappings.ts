/* eslint-disable @typescript-eslint/no-explicit-any */

import { deepGet, excelMappings } from "$lib/constants";

export function applyExcelMappings(workbook: any, formData: any) {
    function set(name: string, value: any) {
        const ranges = workbook.definedNames.getRanges(name);
        if (!ranges?.length) return;

        const [sheetName, cellRef] = ranges[0].split("!");
        const sheet = workbook.getWorksheet(sheetName.replace(/'/g, ""));
        sheet?.getCell(cellRef).setValue(value);
    }

    for (const namedRange in excelMappings) {
        const mapper = excelMappings[namedRange as keyof typeof excelMappings];
        const value =
            typeof mapper === "function"
                ? mapper(formData)
                : deepGet(formData, mapper);

        if (value !== undefined && value !== null) {
            set(namedRange, value);
        }
    }
}
