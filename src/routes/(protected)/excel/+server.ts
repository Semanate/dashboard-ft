/* eslint-disable @typescript-eslint/no-explicit-any */
import ExcelJS from "exceljs";
import { resolve } from "node:path";
import { json } from "@sveltejs/kit";
import { deepGet, excelMappings } from "$lib/constants";
import type { FormDataType } from "$lib/types";

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

export async function POST({ request }: { request: Request }) {
    try {
        const formData: FormDataType = await request.json();

        const templatePath = resolve("static/forms/FT-GFI-001.xlsx");
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(templatePath);

        const sheet = workbook.worksheets[0];
        if (!sheet) {
            return json({ error: "Worksheet not found" }, { status: 404 });
        }

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

        // Mapear todos los campos del formulario SARLAFT a las celdas de Excel
        
        // Información básica
        set("DATE", formatDate(formData.date));
        set("CITY", formData.city);
        set("TYPEDOCUMENT", formData.typeDocument);

        // Representante legal
        if (formData.representative) {
            set("REPRESENTATIVELEGALFIRSTNAME", formData.representative.firstName);
            set("REPRESENTATIVELEGALLASTNAME1", formData.representative.lastName1);
            set("REPRESENTATIVELEGALLASTNAME2", formData.representative.lastName2);
            set("REPRESENTATIVELEGALTYPEDOC", formData.representative.typeDoc);
            set("REPRESENTATIVELEGALDOCNUMBER", formData.representative.docNumber);
            set("REPRESENTATIVELEGALPHONE", formData.representative.phone);
            set("REPRESENTATIVELEGALEMAIL", formData.representative.email);
            set("REPRESENTATIVELEGALACTIVITYSECTOR", formData.representative.activitySector);
            set("REPRESENTATIVELEGALCITY", formData.representative.city);
            set("REPRESENTATIVELEGALADDRESS", formData.representative.address);
        }

        // Persona natural
        if (formData.naturalPerson) {
            set("NATURALPERSONFIRSTNAME", formData.naturalPerson.firstName);
            set("NATURALPERSONLASTNAME1", formData.naturalPerson.lastName1);
            set("NATURALPERSONLASTNAME2", formData.naturalPerson.lastName2);
            set("NATURALPERSONTYPEDOC", formData.naturalPerson.typeDoc);
            set("NATURALPERSONDOCNUMBER", formData.naturalPerson.docNumber);
            set("NATURALPERSONDATEOFBIRTH", formatDate(formData.naturalPerson.dateOfBirth));
            set("NATURALPERSONPLACEOFBIRTH", formData.naturalPerson.placeOfBirth);
            set("NATURALPERSONPHONE", formData.naturalPerson.phone);
            set("NATURALPERSONEMAIL", formData.naturalPerson.email);
            set("NATURALPERSONACTIVITYSECTOR", formData.naturalPerson.activitySector);
            set("NATURALPERSONCITY", formData.naturalPerson.city);
            set("NATURALPERSONADDRESS", formData.naturalPerson.address);
            
            // Nuevos campos SARLAFT
            set("NATURALPERSONNATIONALITY", formData.naturalPerson.nationality);
            set("NATURALPERSONGENDER", formData.naturalPerson.gender);
            set("NATURALPERSONCIVILSTATUS", formData.naturalPerson.civilStatus);
            set("NATURALPERSONCELLPHONE", formData.naturalPerson.cellPhone);
            set("NATURALPERSONCOUNTRY", formData.naturalPerson.country);
            set("NATURALPERSONPOSTALCODE", formData.naturalPerson.postalCode);
        }

        // Información financiera SARLAFT
        if (formData.financialInfo) {
            set("FINANCIALMONTHLYINCOME", formatCurrency(formData.financialInfo.monthlyIncome));
            set("FINANCIALOTIERINCOME", formatCurrency(formData.financialInfo.otherIncome));
            set("FINANCIALMONTHLYEXPENSES", formatCurrency(formData.financialInfo.monthlyExpenses));
            set("FINANCIALASSETS", formatCurrency(formData.financialInfo.assets));
            set("FINANCIALLIABILITIES", formatCurrency(formData.financialInfo.liabilities));
            set("FINANCIALPATRIMONY", formatCurrency(formData.financialInfo.patrimony));
            set("FINANCIALINCOMESOURCE", formData.financialInfo.incomeSource);
            set("FINANCIALINCOMEDESCRPTION", formData.financialInfo.incomeSourceDescription);
            set("FINANCIALCURRENCY", formData.financialInfo.operationCurrency);
        }

        // Información laboral SARLAFT
        if (formData.laboralInfo) {
            set("LABORALCOMPANY", formData.laboralInfo.company);
            set("LABORALPOSITION", formData.laboralInfo.position);
            set("LABORALWORKTIME", formData.laboralInfo.workTime);
            set("LABORALCOMPANYADDRESS", formData.laboralInfo.companyAddress);
            set("LABORALCOMPANYCITY", formData.laboralInfo.companyCity);
            set("LABORALCOMPANYCOUNTRY", formData.laboralInfo.companyCountry);
            set("LABORALCOMPANYPHONE", formData.laboralInfo.companyPhone);
            set("LABORALECONOMICACTIVITY", formData.laboralInfo.economicActivity);
            set("LABORALTAXREGIME", formData.laboralInfo.taxRegime);
        }

        // Persona jurídica
        if (formData.juridicalPerson) {
            set("JURIDICALPERSONBUSINESSNAME", formData.juridicalPerson.businessName);
            set("JURIDICALPERSONNIT", formData.juridicalPerson.nit);
            set("JURIDICALPERSONPHONE", formData.juridicalPerson.phone);
            set("JURIDICALPERSONEMAIL", formData.juridicalPerson.email);
            set("JURIDICALPERSONACTIVITYSECTOR", formData.juridicalPerson.activitySector);
            set("JURIDICALPERSONADDRESS", formData.juridicalPerson.address);
            set("JURIDICALPERSONADDRESS2", formData.juridicalPerson.address2);
            set("JURIDICALPERSONPHONE2", formData.juridicalPerson.phone2);
            set("JURIDICALPERSONCITY", formData.juridicalPerson.city);
        }

        // PEP - Ampliar con nuevos campos SARLAFT
        if (formData.pep) {
            set("PEPMANAGEPUBLIC", formData.pep.managePublicResources);
            set("PEPPUBLICPOWER", formData.pep.publicPower);
            set("PEPRELATION", formData.pep.relation);
            set("PEPRELATIONNAME", formData.pep.relationName);
            set("PEPTAXOBLIGATIONS", formData.pep.taxObligations);
            
            // Nuevos campos PEP SARLAFT
            set("PEPISPEP", formData.pep.isPep ? "SÍ" : "NO");
            set("PEPRELATED", formData.pep.pepRelated ? "SÍ" : "NO");
            set("PEPDETAILS", formData.pep.pepDetails);
            set("PEPCRIMINAL", formData.pep.criminalInvestigations ? "SÍ" : "NO");
            set("PEPCRIMINALDETAILS", formData.pep.investigationDetails);
            set("PEPTAXHAVEN", formData.pep.taxHavenOperations ? "SÍ" : "NO");
            set("PEPTAXHAVENDETAILS", formData.pep.taxHavenDetails);
            set("PEPTHIRDPARTY", formData.pep.thirdPartyResources ? "SÍ" : "NO");
            set("PEPTHIRDPARTYDETAILS", formData.pep.thirdPartyDetails);
            set("PEPUIF", formData.pep.uifReports ? "SÍ" : "NO");
            set("PEPUIFDETAILS", formData.pep.uifDetails);
            set("PEPHIGHRISK", formData.pep.highRiskActivities ? "SÍ" : "NO");
            set("PEPRISKDETAILS", formData.pep.riskDetails);
        }

        // Transacciones en efectivo
        if (formData.cashTransactions) {
            set("CASHHANDLES", formData.cashTransactions.handlesCash ? "SÍ" : "NO");
            set("CASHMAXAMOUNT", formatCurrency(formData.cashTransactions.maxAmount || 0));
            set("CASHFREQUENCY", formData.cashTransactions.frequency);
        }

        // Referencias comerciales
        if (formData.commercialReferences) {
            formData.commercialReferences.forEach((ref, index) => {
                set(`COMMREF${index + 1}ENTITY`, ref.entity);
                set(`COMMREF${index + 1}PHONE`, ref.phone);
                set(`COMMREF${index + 1}PRODUCT`, ref.productType);
                set(`COMMREF${index + 1}TIME`, ref.relationshipTime);
            });
        }

        // Referencias personales
        if (formData.personalReferences) {
            formData.personalReferences.forEach((ref, index) => {
                set(`PERSREF${index + 1}NAME`, ref.name);
                set(`PERSREF${index + 1}PHONE`, ref.phone);
                set(`PERSREF${index + 1}RELATIONSHIP`, ref.relationship);
                set(`PERSREF${index + 1}TIME`, ref.knowledgeTime);
            });
        }

        // Autorizaciones
        if (formData.authorizations) {
            set("AUTHDATA", formData.authorizations.dataProcessing ? "SÍ" : "NO");
            set("AUTHDATADATE", formatDate(formData.authorizations.dataProcessingDate || ""));
            set("AUTHCENTRAL", formData.authorizations.centralConsultation ? "SÍ" : "NO");
            set("AUTHCENTRALDATE", formatDate(formData.authorizations.centralConsultationDate || ""));
            set("AUTHEMAIL", formData.authorizations.emailCommunication ? "SÍ" : "NO");
            set("AUTHTRUTH", formData.authorizations.truthDeclaration ? "SÍ" : "NO");
            set("AUTHTRUTHDATE", formatDate(formData.authorizations.truthDeclarationDate || ""));
        }

        // Firma y fechas
        if (formData.signature) {
            set("SIGNATURENAME", formData.signature.name);
            set("SIGNATUREDOCUMENT", formData.signature.document);
            set("SIGNATUREDATE", formatDate(formData.signature.signatureDate || ""));
        }

        // Usar mappings existentes para otros campos compatibles
        for (const namedRange in excelMappings) {
            const mapper = excelMappings[namedRange as keyof typeof excelMappings];
            
            try {
                const value = typeof mapper === "function" ? mapper(formData) : deepGet(formData, mapper);
                if (value !== undefined && value !== null) {
                    set(namedRange, value);
                }
            } catch (error) {
                console.log("Error mapping field:", namedRange, error);
            }
        }

        const buffer = await workbook.xlsx.writeBuffer();

        return new Response(buffer, {
            headers: {
                "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                "Content-Disposition": `attachment; filename=SARLAFT_${formatDate(formData.date)}_${formData.naturalPerson?.firstName || 'Formulario'}.xlsx`
            }
        });

    } catch (err: any) {
        console.error("Error generating Excel:", err);
        return json({ error: err.message }, { status: 500 });
    }
}