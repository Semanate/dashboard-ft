/* eslint-disable @typescript-eslint/no-explicit-any */
import ExcelJS from "exceljs";
import { resolve } from "node:path";
import { json } from "@sveltejs/kit";

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
        //Document Info
        // set("TITLE", data.title);
        // set("VERSION", data.version);
        set("DATE", data.date);
        set("CITY", data.city);
        set("TYPE_DOCUMENT", data.typeDocument);
        // set("DATEUPDATED", data.dateUpdated);

        // Legal Representative
        set("REPRESENTATIVELEGALFIRSTNAME", data.representative.firstName);
        set("REPRESENTATIVELEGALLASTNAME1", data.representative.lastName1);
        set("REPRESENTATIVELEGALLASTNAME2", data.representative.lastName2);
        set("REPRESENTATIVELEGALTYPEDOC", "CC.        CE.  X      PS.");
        set("REPRESENTATIVELEGALDOCNUMBER", data.representative.docNumber);
        set("REPRESENTATIVELEGALPHONE", data.representative.phone);
        set("REPRESENTATIVELEGALEMAIL", data.representative.email);
        set("REPRESENTATIVELEGALACTIVITYSECTOR", data.representative.activitySector);
        set("REPRESENTATIVELEGALCITY", data.representative.city);
        set("REPRESENTATIVELEGALADDRESS", data.representative.address);
        //Nautral Person
        set("NATURALPERSONFIRSTNAME", data.naturalPerson.firstName);
        set("NATURALPERSONLASTNAME1", data.naturalPerson.lastName1);
        set("NATURALPERSONLASTNAME2", data.naturalPerson.lastName2);
        set("NATURALPERSONTYPEDOC", "CC.        CE.  X      PS.");
        set("NATURALPERSONDOCNUMBER", data.naturalPerson.docNumber);
        set("NATURALPERSONDATEOFBIRTH", data.naturalPerson.dateOfBirth);
        set("NATURALPERSONACTIVITYSECTOR", data.naturalPerson.activitySector);
        set("NATURALPERSONPLACEOFBIRTH", data.naturalPerson.placeOfBirth);
        set("NATURALPERSONPHONE", data.naturalPerson.phone);
        set("NATURALPERSONADDRESS", data.naturalPerson.address);
        //Juridical Person
        set("JURIDICALPERSONBUSINESSNAME", data.juridicalPerson.businessName);
        set("JURIDICALPERSONNIT", data.juridicalPerson.nit);
        set("JURIDICALPERSONPHONE", data.juridicalPerson.phone);
        set("JURIDICALPERSONEMAIL", data.juridicalPerson.email);
        set("JURIDICALPERSONEMAIL2", data.juridicalPerson.email2);
        set("JURIDICALPERSONADDRESS", data.juridicalPerson.address);
        set("JURIDICALPERSONADDRESS2", data.juridicalPerson.address2);
        set("JURIDICALPERSONPHONE2", data.juridicalPerson.phone2);
        set("JURIDICALPERSONCITY", data.juridicalPerson.city);



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
