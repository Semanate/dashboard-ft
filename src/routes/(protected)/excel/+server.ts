/* eslint-disable @typescript-eslint/no-explicit-any */
import ExcelJS from "exceljs";
import { resolve } from "node:path";
import { json } from "@sveltejs/kit";
import { getSarlaftById } from "$lib/api/admin/sarlaft";
import type { RequestHandler } from '@sveltejs/kit';


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

export const POST: RequestHandler = async ({ request, cookies }) => {
    try {
        const accessToken = cookies.get('sb-access-token');
        if (!accessToken) {
            return json({ error: 'No autorizado' }, { status: 401 });
        }

        const { id } = await request.json();
        if (!id) {
            return json({ error: 'ID requerido' }, { status: 400 });
        }

        const response = await getSarlaftById(accessToken, id);
        const sarlaft = response.data;

        if (!sarlaft) {
            return json({ error: 'Formulario no encontrado' }, { status: 404 });
        }

        /* ================== WORKBOOK ================== */

        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet('SARLAFT');

        /* ================== HEADER ================== */

        const headers = [
            'ID Transacción',
            'Tipo documento',
            'N° identificación',
            'Nombre / Razón social',
            'Dirección',
            'Teléfono',
            'Email',
            'Tipo documento accionista',
            'N° identificación',
            'Nombre / Razón social',
            'ETC'
        ];

        sheet.addRow(headers);

        const headerRow = sheet.getRow(1);
        headerRow.eachCell(cell => {
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFFF00' } // amarillo
            };
            cell.font = { bold: true };
            cell.alignment = { vertical: 'middle', horizontal: 'center' };
            cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            };
        });

        /* ================== DATA ================== */

        const baseRow = {
            id: sarlaft.id,
            tipoDoc: sarlaft.naturalPerson?.docType ?? sarlaft.juridicalPerson?.nitType,
            doc: sarlaft.naturalPerson?.docNumber ?? sarlaft.juridicalPerson?.nit,
            nombre:
                sarlaft.naturalPerson
                    ? `${sarlaft.naturalPerson.firstName} ${sarlaft.naturalPerson.lastName}`
                    : sarlaft.juridicalPerson?.businessName,
            direccion:
                sarlaft.naturalPerson?.address ??
                sarlaft.juridicalPerson?.address,
            telefono:
                sarlaft.naturalPerson?.phone ??
                sarlaft.juridicalPerson?.phone,
            email:
                sarlaft.naturalPerson?.email ??
                sarlaft.juridicalPerson?.email
        };

        /* === Si no hay relaciones, igual sacamos una fila === */
        if (!sarlaft.relations?.length) {
            sheet.addRow([
                baseRow.id,
                baseRow.tipoDoc,
                baseRow.doc,
                baseRow.nombre,
                baseRow.direccion,
                baseRow.telefono,
                baseRow.email,
                '',
                '',
                '',
                ''
            ]);
        }

        /* === Relaciones / accionistas === */
        sarlaft.relations?.forEach(rel => {
            sheet.addRow([
                baseRow.id,
                baseRow.tipoDoc,
                baseRow.doc,
                baseRow.nombre,
                baseRow.direccion,
                baseRow.telefono,
                baseRow.email,
                rel.typeDoc ?? '',
                rel.docNumber ?? '',
                rel.socialName ?? '',
                `${rel.percentageParticipation ?? ''}%`
            ]);
        });

        /* ================== STYLES ================== */

        sheet.eachRow((row, rowNumber) => {
            if (rowNumber === 1) return;

            row.eachCell(cell => {
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                };
                cell.alignment = { vertical: 'middle', horizontal: 'left' };
            });
        });

        sheet.columns.forEach(col => {
            col.width = 22;
        });

        /* ================== RESPONSE ================== */

        const buffer = await workbook.xlsx.writeBuffer();

        return new Response(buffer, {
            headers: {
                'Content-Type':
                    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'Content-Disposition': `attachment; filename=SARLAFT_${sarlaft.id}.xlsx`
            }
        });
    } catch (err: any) {
        console.error('Error generating Excel:', err);
        return json({ error: err.message }, { status: 500 });
    }
};