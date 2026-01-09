/* eslint-disable @typescript-eslint/no-explicit-any */
import ExcelJS from "exceljs";
import { json } from "@sveltejs/kit";
import { getSarlaftById } from "$lib/api/admin/sarlaft";
import type { RequestHandler } from '@sveltejs/kit';

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

    const { data: sarlaft } = await getSarlaftById(accessToken, id);
    if (!sarlaft) {
      return json({ error: 'Formulario no encontrado' }, { status: 404 });
    }

    /* ================== WORKBOOK ================== */

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('SARLAFT');

    sheet.columns = [
      { width: 25 },
      { width: 25 },
      { width: 25 },
      { width: 30 }
    ];

    let row = 1;

    /* ================== TITLE ================== */

    sheet.mergeCells(`A${row}:D${row}`);
    sheet.getCell(`A${row}`).value = 'FORMULARIO SARLAFT';
    sheet.getCell(`A${row}`).font = { size: 16, bold: true };
    sheet.getCell(`A${row}`).alignment = { horizontal: 'center' };
    row += 2;

    /* ================== INFO GENERAL ================== */

    sheet.mergeCells(`A${row}:D${row}`);
    sheet.getCell(`A${row}`).value = 'INFORMACIÓN GENERAL';
    sheet.getCell(`A${row}`).font = { bold: true };
    sheet.getCell(`A${row}`).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'E5E7EB' }
    };
    row++;

    const infoRows = [
      ['ID Transacción', sarlaft.id],
      ['Estado', sarlaft.status],
      ['Tipo de Persona', sarlaft.typePersonAggrement],
      ['Fecha creación', new Date(sarlaft.created_at).toLocaleString()],
      ['Última actualización', new Date(sarlaft.updated_at).toLocaleString()]
    ];

    infoRows.forEach(([label, value]) => {
      sheet.getCell(`A${row}`).value = label;
      sheet.getCell(`B${row}`).value = value;
      sheet.getCell(`A${row}`).font = { bold: true };
      row++;
    });

    row++;

    /* ================== SOLICITANTE ================== */

    sheet.mergeCells(`A${row}:D${row}`);
    sheet.getCell(`A${row}`).value = 'DATOS DEL SOLICITANTE';
    sheet.getCell(`A${row}`).font = { bold: true };
    sheet.getCell(`A${row}`).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'E5E7EB' }
    };
    row++;

    const p = sarlaft.naturalPerson ?? sarlaft.juridicalPerson;

    const applicantRows = [
      ['Tipo documento', sarlaft.naturalPerson?.docType ?? 'NIT'],
      ['N° identificación', sarlaft.naturalPerson?.docNumber ?? sarlaft.juridicalPerson?.nit],
      ['Nombre / Razón social',
        sarlaft.naturalPerson
          ? `${p.firstName} ${p.lastName}`
          : p.businessName
      ],
      ['Dirección', p.address],
      ['Teléfono', p.phone],
      ['Email', p.email]
    ];

    applicantRows.forEach(([label, value]) => {
      sheet.getCell(`A${row}`).value = label;
      sheet.getCell(`B${row}`).value = value ?? '-';
      sheet.getCell(`A${row}`).font = { bold: true };
      row++;
    });

    row++;

    /* ================== RELACIONES ================== */

    sheet.mergeCells(`A${row}:D${row}`);
    sheet.getCell(`A${row}`).value = 'RELACIONES / ACCIONISTAS / VINCULADOS';
    sheet.getCell(`A${row}`).font = { bold: true };
    sheet.getCell(`A${row}`).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'E5E7EB' }
    };
    row++;

    // Encabezado tabla
    const tableHeader = [
      'Tipo Doc.',
      'N° Identificación',
      'Nombre / Razón social',
      '% Participación'
    ];

    sheet.addRow(tableHeader);
    sheet.getRow(row).eachCell(cell => {
      cell.font = { bold: true };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FEF08A' }
      };
      cell.border = {
        top: { style: 'thin' },
        bottom: { style: 'thin' },
        left: { style: 'thin' },
        right: { style: 'thin' }
      };
    });
    row++;

    if (!sarlaft.relations?.length) {
      sheet.addRow(['-', '-', '-', '-']);
      row++;
    } else {
      sarlaft.relations.forEach(rel => {
        sheet.addRow([
          rel.typeDoc ?? '-',
          rel.docNumber ?? '-',
          rel.socialName ?? '-',
          `${rel.percentageParticipation ?? ''}%`
        ]);
        row++;
      });
    }

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
