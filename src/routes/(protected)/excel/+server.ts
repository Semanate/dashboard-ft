/* eslint-disable @typescript-eslint/no-explicit-any */
import ExcelJS from "exceljs";
import { resolve } from "node:path";
import { json } from "@sveltejs/kit";
import type { FormDataType } from "$lib/types";
import { getSarlaftById } from "$lib/api/admin/sarlaft";
import { applyExcelMappings } from "$lib/utils/applyExcelMappings";

// Función para formatear valores monetarios
function formatCurrency(value: number): string {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
    }).format(value);
}

// Función para formatear fechas
function formatDate(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CO');
}

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
            dateOfBirth: get("NATURALPERSONDATEOFBIRTH"),
            placeOfBirth: get("NATURALPERSONPLACEOFBIRTH"),
            phone: get("NATURALPERSONPHONE"),
            email: get("NATURALPERSONEMAIL"),
            activitySector: get("NATURALPERSONACTIVITYSECTOR"),
            city: get("NATURALPERSONCITY"),
            address: get("NATURALPERSONADDRESS"),

            // Nuevos campos SARLAFT
            nationality: get("NATURALPERSONNATIONALITY"),
            gender: get("NATURALPERSONGENDER"),
            civilStatus: get("NATURALPERSONCIVILSTATUS"),
            cellPhone: get("NATURALPERSONCELLPHONE"),
            country: get("NATURALPERSONCOUNTRY"),
            postalCode: get("NATURALPERSONPOSTALCODE"),
        },

        // Nueva información financiera SARLAFT
        financialInfo: {
            monthlyIncome: get("FINANCIALMONTHLYINCOME"),
            otherIncome: get("FINANCIALOTIERINCOME"),
            monthlyExpenses: get("FINANCIALMONTHLYEXPENSES"),
            assets: get("FINANCIALASSETS"),
            liabilities: get("FINANCIALLIABILITIES"),
            patrimony: get("FINANCIALPATRIMONY"),
            incomeSource: get("FINANCIALINCOMESOURCE"),
            incomeSourceDescription: get("FINANCIALINCOMEDESCRPTION"),
            operationCurrency: get("FINANCIALCURRENCY"),
        },

        // Nueva información laboral SARLAFT
        laboralInfo: {
            company: get("LABORALCOMPANY"),
            position: get("LABORALPOSITION"),
            workTime: get("LABORALWORKTIME"),
            companyAddress: get("LABORALCOMPANYADDRESS"),
            companyCity: get("LABORALCOMPANYCITY"),
            companyCountry: get("LABORALCOMPANYCOUNTRY"),
            companyPhone: get("LABORALCOMPANYPHONE"),
            economicActivity: get("LABORALECONOMICACTIVITY"),
            taxRegime: get("LABORALTAXREGIME"),
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
        },

        // Información PEP ampliada
        pep: {
            managePublicResources: get("PEPMANAGEPUBLIC"),
            publicPower: get("PEPPUBLICPOWER"),
            relation: get("PEPRELATION"),
            relationName: get("PEPRELATIONNAME"),
            taxObligations: get("PEPTAXOBLIGATIONS"),
        },

        // Autorizaciones
        authorizations: {
            dataProcessing: get("AUTHDATA"),
            dataProcessingDate: get("AUTHDATADATE"),
            centralConsultation: get("AUTHCENTRAL"),
            centralConsultationDate: get("AUTHCENTRALDATE"),
            emailCommunication: get("AUTHEMAIL"),
            truthDeclaration: get("AUTHTRUTH"),
            truthDeclarationDate: get("AUTHTRUTHDATE"),
        }
    };

    return json({ data });
}

export async function POST({ request, cookies }) {
    try {
        const accessToken = cookies.get("sb-access-token");
        if (!accessToken) {
            return json({ error: "No autorizado" }, { status: 401 });
        }

        const payload = await request.json();

        const response = await getSarlaftById(accessToken, payload.id);
        const formData = response.data;

        if (!formData?.values) {
            return json({ error: "Formulario inválido" }, { status: 400 });
        }

        return json({ formData });
        // const templatePath = resolve("static/forms/FT-GFI-001.xlsx");
        // const workbook = new ExcelJS.Workbook();
        // await workbook.xlsx.readFile(templatePath);

        // const sheet = workbook.worksheets[0];
        // if (!sheet) {
        //     return json({ error: "Worksheet not found" }, { status: 404 });
        // }

        // function set(name: string, value: any) {
        //     const { ranges } = workbook.definedNames.getRanges(name);
        //     if (!ranges || ranges.length === 0) return;

        //     const [sheetName, cellRef] = ranges[0].split("!");
        //     const targetSheet = workbook.getWorksheet(sheetName.replace(/'/g, ""));
        //     if (!targetSheet) return;

        //     targetSheet.getCell(cellRef).value = value;
        // }

        // for (const [namedRange, value] of Object.entries(formData.values)) {
        //     if (value !== undefined && value !== null) {
        //         set(namedRange, value);
        //     }
        // }

        // const buffer = await workbook.xlsx.writeBuffer();

        // return new Response(buffer, {
        //     headers: {
        //         "Content-Type":
        //             "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        //         "Content-Disposition": `attachment; filename=SARLAFT_${formData.id}.xlsx`,
        //     },
        // });
    } catch (err: any) {
        console.error("Error generating Excel:", err);
        return json({ error: err.message }, { status: 500 });
    }
}
