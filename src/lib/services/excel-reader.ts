import ExcelJS from "exceljs";

export async function readSARLAFTExcel(path: string) {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(path);

    const sheet = workbook.getWorksheet(1);

    return {
        representante: {
            nombres: sheet.getCell("B5").value?.toString() ?? "",
            apellido1: sheet.getCell("C5").value?.toString() ?? "",
            apellido2: sheet.getCell("D5").value?.toString() ?? "",
            ciudad: sheet.getCell("B6").value?.toString() ?? "",
        },
        juridica: {
            razonSocial: sheet.getCell("B15").value?.toString() ?? "",
            nit: sheet.getCell("C15").value?.toString() ?? "",
            actividad: sheet.getCell("B16").value?.toString() ?? ""
        },
        // Puedes agregar todos los campos que necesites...
    };
}
