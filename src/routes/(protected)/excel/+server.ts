/* eslint-disable @typescript-eslint/no-explicit-any */
import ExcelJS from "exceljs";
import { resolve } from "node:path";
import { json } from "@sveltejs/kit";
import { deepGet, excelMappings } from "$lib/constants";

export async function GET() {
    const pathExcel = resolve("static/forms/FT-GFI-001.xlsx");

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(pathExcel);

    const pages = workbook.worksheets;
    const sheet = pages[0];

    if (!sheet) {
        return json({ error: "Worksheet not found" }, { status: 404 });
    }

    function get(nm: string) {
        const { ranges } = workbook.definedNames.getRanges(nm);

        const firstRange = ranges[0];
        const isValid = !!firstRange && firstRange.includes("!");
        if (!isValid) {
            return "";
        }


        const cell = sheet.getCell(firstRange.split("!")[1]);
        return cell.value?.toString() ?? "";
    }

    const data = {
        title: get("TITLE"),
        version: get("VERSION"),
        date: get("DATE"),
        dateUpdated: get("DATEUPDATED"),

        representativeLegal: {
            firstName: get("REPRESENTATIVELEGALFIRSTNAME"),
            lastName1: get("REPRESENTATIVELEGALLASTNAME1"),
            lastName2: get("REPRESENTATIVELEGALLASTNAME2"),
            typeDoc: get("REPRESENTATIVELEGALTYPEDOC"),
            docNumber: get("REPRESENTATIVELEGALDOCNUMBER"),
            phone: get("REPRESENTATIVELEGALPHONE"),
            email: get("REPRESENTATIVELEGALEMAIL"),
            activitySector: get("REPRESENTATIVELEGALACTIVITYSECTOR"),
            city: get("REPRESENTATIVELEGALCITY"),
            address: get("REPRESENTATIVELEGALADDRESS")
        },

        naturalPerson: {
            firstName: get("NATURALPERSONFIRSTNAME"),
            lastName1: get("NATURALPERSONLASTNAME1"),
            lastName2: get("NATURALPERSONLASTNAME2"),
            typeDoc: get("NATURALPERSONTYPEDOC"),
            docNumber: get("NATURALPERSONDOCNUMBER"),
            phone: get("NATURALPERSONPHONE"),
            activitySector: get("NATURALPERSONACTIVITYSECTOR"),
            address: get("NATURALPERSONADDRESS"),
            dateOfBirth: get("NATURALPERSONDATEOFBIRTH"),
            placeOfBirth: get("NATURALPERSONPLACEOFBIRTH"),
            // email: get("NATURALPERSONEMAIL"),
        },

        juridicalPerson: {
            businessName: get("JURIDICALPERSONBUSINESSNAME"),
            nit: get("JURIDICALPERSONNIT"),
            phone: get("JURIDICALPERSONPHONE"),
            email: get("JURIDICALPERSONEMAIL"),
            activitySector: get("JURIDICALPERSONACTIVITYSECTOR"),
            address: get("JURIDICALPERSONADDRESS"),
            address2: get("JURIDICALPERSONADDRESS2"),
            phone2: get("JURIDICALPERSONPHONE2"),
            constitutionDate: get("JURIDICALPERSONCONSTITUTIONDATE"),
            city: get("JURIDICALPERSONCITY"),
        }
    };

    return json({ data });
}


export async function POST({ request }) {
    try {
        const data = await request.json();

        // Cargar plantilla
        const templatePath = resolve("static/forms/FT-GFI-001.xlsx");
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(templatePath);

        const sheet = workbook.worksheets[0];
        if (!sheet) {
            return json({ error: "Worksheet not found" }, { status: 404 });
        }

        // Helper para rangos con nombre
        function set(name: string, value: any) {
            const { ranges } = workbook.definedNames.getRanges(name);
            if (!ranges || ranges.length === 0) {
                console.log("⚠ Named Range no encontrado:", name);
                return;
            }

            const [sheetName, cellRef] = ranges[0].split("!");

            const targetSheet = workbook.getWorksheet(sheetName.replace(/'/g, ""));
            if (!targetSheet) return;

            targetSheet.getCell(cellRef).value = value;
        }

        for (const namedRange in excelMappings) {
            const mapper = excelMappings[namedRange as keyof typeof excelMappings];

            console.log("Mapping", namedRange, mapper);
            const value =
                typeof mapper === "function"
                    ? mapper(data)
                    : deepGet(data, mapper);

            set(namedRange, value ?? "");
        }

        const buffer = await workbook.xlsx.writeBuffer();

        return new Response(buffer, {
            headers: {
                "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                "Content-Disposition": "attachment; filename=FT-GFI-001-Filled.xlsx"
            }
        });

    } catch (err: any) {
        console.error(err);
        return json({ error: err.message }, { status: 500 });
    }
}
