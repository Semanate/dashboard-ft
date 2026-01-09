import PDFDocument from 'pdfkit';
import type { RequestHandler } from '@sveltejs/kit';
import { getSarlaftById } from '$lib/api/admin/sarlaft';
import { Buffer } from 'buffer';

/* ================== HELPERS ================== */

function safe(value?: string | number) {
  if (value === undefined || value === null) return '-';
  if (typeof value === 'string' && value.trim() === '') return '-';
  return String(value);
}

function sectionTitle(doc: PDFDocument, title: string) {
  doc
    .moveDown(1.5)
    .fontSize(13)
    .fillColor('#111827')
    .text(title)
    .moveDown(0.5);
}

function field(doc: PDFDocument, label: string, value?: string) {
  doc
    .fontSize(9)
    .fillColor('#6B7280')
    .text(label);

  doc
    .fontSize(10)
    .fillColor('#111827')
    .text(safe(value), { paragraphGap: 10 });
}

function twoCols(
  doc: PDFDocument,
  left: () => void,
  right: () => void
) {
  const y = doc.y;

  doc.x = 70;
  left();

  doc.y = y;
  doc.x = 320;
  right();

  doc.x = 50;
  doc.y += 5;
}

function drawCard(
  doc: PDFDocument,
  x: number,
  y: number,
  w: number,
  h: number
) {
  doc
    .roundedRect(x, y, w, h, 6)
    .lineWidth(1)
    .stroke('#D1D5DB');
}

function ensurePage(doc: PDFDocument) {
  if (doc.y > 720) {
    doc.addPage();
  }
}

/* ================== ENDPOINT ================== */

export const POST: RequestHandler = async ({ request, cookies }) => {
  const { id } = await request.json();
  const accessToken = cookies.get('sb-access-token');

  if (!id || !accessToken) {
    return new Response('Unauthorized', { status: 401 });
  }

  const sarlaft = await getSarlaftById(accessToken, id).then(r => r.data);

  if (!sarlaft) {
    return new Response('Not found', { status: 404 });
  }

  const doc = new PDFDocument({
    size: 'A4',
    margin: 50,
    bufferPages: true
  });

  const chunks: Buffer[] = [];
  doc.on('data', d => chunks.push(d));

  /* ================== HEADER ================== */

  doc
    .fontSize(18)
    .fillColor('#111827')
    .text('FORMULARIO SARLAFT', { align: 'center' });

  doc
    .moveDown(0.3)
    .fontSize(10)
    .fillColor('#6B7280')
    .text(
      'Sistema de Administración del Riesgo de Lavado de Activos y Financiación del Terrorismo',
      { align: 'center' }
    );

  doc.moveDown(0.8);

  doc
    .fontSize(9)
    .fillColor('#374151')
    .text(`ID: ${sarlaft.id}`, { align: 'center' });

  doc.moveDown(2);

  /* ================== INFORMACIÓN GENERAL ================== */

  sectionTitle(doc, 'Información General');

  const infoY = doc.y;
  drawCard(doc, 50, infoY, 495, 90);
  doc.y = infoY + 12;

  twoCols(
    doc,
    () => {
      field(doc, 'Estado', sarlaft.status);
      field(doc, 'Fecha de creación', new Date(sarlaft.created_at).toLocaleString());
    },
    () => {
      field(doc, 'Tipo de Persona', sarlaft.typePersonAggrement);
      field(doc, 'Última actualización', new Date(sarlaft.updated_at).toLocaleString());
    }
  );

  doc.y = infoY + 100;

  /* ================== PERSONA NATURAL ================== */

  if (sarlaft.naturalPerson) {
    ensurePage(doc);
    sectionTitle(doc, 'Datos del Solicitante');

    const y = doc.y;
    drawCard(doc, 50, y, 495, 110);
    doc.y = y + 12;

    const p = sarlaft.naturalPerson;

    twoCols(
      doc,
      () => {
        field(doc, 'Nombre', `${p.firstName} ${p.lastName}`);
        field(doc, 'Correo', p.email);
      },
      () => {
        field(doc, 'Documento', `${p.docType} ${p.docNumber}`);
        field(doc, 'Teléfono', p.phone);
      }
    );

    doc.y = y + 120;
  }

  /* ================== RELACIONES ================== */

  if (sarlaft.relations?.length) {
    ensurePage(doc);
    sectionTitle(doc, 'Relaciones / Vinculados');

    sarlaft.relations.forEach((rel, i) => {
      ensurePage(doc);

      const y = doc.y;
      drawCard(doc, 50, y, 495, 90);
      doc.y = y + 10;

      doc
        .fontSize(10)
        .fillColor('#111827')
        .text(`Vinculado ${i + 1}`, 70);

      doc.moveDown(0.3);

      twoCols(
        doc,
        () => {
          field(doc, 'Documento', `${rel.typeDoc} ${rel.docNumber}`);
          field(doc, 'Actividad / Recurso', rel.activityAdminResource);
        },
        () => {
          field(doc, 'Razón Social / Nombre', safe(rel.socialName));
          field(
            doc,
            '% Participación',
            rel.percentageParticipation !== undefined
              ? `${rel.percentageParticipation}%`
              : '-'
          );
        }
      );

      doc.y = y + 100;
    });
  }

  /* ================== FIRMA ================== */

  if (sarlaft.signature) {
    ensurePage(doc);
    sectionTitle(doc, 'Firma del Solicitante');

    const y = doc.y;
    drawCard(doc, 50, y, 495, 120);
    doc.y = y + 12;

    twoCols(
      doc,
      () => {
        field(doc, 'Nombre', sarlaft.signature.name);
      },
      () => {
        field(doc, 'Documento', sarlaft.signature.document);
      }
    );

    if (sarlaft.signature.signature?.startsWith('data:image')) {
      const img = Buffer.from(
        sarlaft.signature.signature.split(',')[1],
        'base64'
      );

      doc.image(img, 70, doc.y + 10, { width: 150 });
    }

    doc.y = y + 130;
  }

  /* ================== FOOTER ================== */

  const range = doc.bufferedPageRange();
  for (let i = range.start; i < range.start + range.count; i++) {
    doc.switchToPage(i);
    doc
      .fontSize(8)
      .fillColor('#6B7280')
      .text(
        `Página ${i - range.start + 1} de ${range.count}`,
        0,
        780,
        { align: 'center' }
      );
  }

  doc.end();

  const buffer = await new Promise<Buffer>(resolve => {
    doc.on('end', () => resolve(Buffer.concat(chunks)));
  });

  return new Response(buffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="SARLAFT_${id}.pdf"`,
      'Content-Length': buffer.length.toString()
    }
  });
};
