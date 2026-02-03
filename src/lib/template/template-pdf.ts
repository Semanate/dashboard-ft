import { PDF } from '@libpdf/core';
import { calculateCardHeight, loadFont, type CardLayout } from './utils';
import {
  Cursor,
  sectionTitle,
  field,
  twoCols,
  ensurePageSpace,
  drawModernCard,
  drawHeader,
  drawSectionDivider,
  drawSignatureBlock,
  drawPageFooter,
  drawHighlightBox,
  theme,
  PAGE,
} from './utils-pdf';
import type { SarlaftForm } from '$lib/types';
import POPPINS from '$lib/assets/fonts/Poppins-Regular.ttf?url';
import POPPINS_BOLD from '$lib/assets/fonts/Poppins-Bold.ttf?url';


export async function generateSarlaftPdf(data: SarlaftForm, fetchFn: typeof fetch
) {
  const pdf = PDF.create();
  let page = pdf.addPage({ size: 'a4' });
  const cursor = new Cursor();

  // Load fonts
  const poppinsBytes = await loadFont(fetchFn, POPPINS);
  const poppinsBoldBytes = await loadFont(fetchFn, POPPINS_BOLD);
  const font = await pdf.embedFont(poppinsBytes);
  const fontBold = await pdf.embedFont(poppinsBoldBytes);

  /* ================== HEADER ================== */

  cursor.down(10);
  drawHeader(page, cursor, {
    title: 'FORMULARIO SARLAFT',
    subtitle: 'Sistema de Administración del Riesgo de Lavado de Activos y Financiación del Terrorismo',
    documentId: '1231',
    font,
    fontBold,
  });

  cursor.down(20);

  /* ================== INFORMACIÓN GENERAL ================== */

  page = ensurePageSpace(pdf, page, cursor, 120);
  sectionTitle(page, cursor, 'Información General', fontBold);

  const typePerson = data.typePersonAggrement === 'NAT' ? 'Natural' : 'Jurídica';

  const rows = [
    { left: data.status, right: typePerson },
    {
      left: new Date(data.created_at).toLocaleDateString('es-CO'),
      right: new Date(data.updated_at).toLocaleDateString('es-CO'),
    },
  ];

  const cardLayout: CardLayout = {
    fontSizeLabel: 8,
    fontSizeValue: 10,
    lineHeight: 14,
    columnWidth: 200,
    paddingTop: 16,
    paddingBottom: 16,
    rowGap: 14,
  };

  const cardHeight = calculateCardHeight(rows, font, cardLayout);

  page = ensurePageSpace(pdf, page, cursor, cardHeight + 30);
  const infoY = cursor.y;

  // Modern card with accent
  drawModernCard(page, 50, cursor.y, PAGE.contentWidth, cardHeight, {
    variant: 'accent',
    accentColor: theme.primary,
    backgroundColor: theme.cardBgAlt,
  });

  cursor.y = infoY - cardLayout.paddingTop;

  twoCols(
    page,
    cursor,
    () => {
      field(page, cursor, 'Estado', data.status, font);
      field(page, cursor, 'Fecha de creación', new Date(data.created_at).toLocaleDateString('es-CO'), font);
    },
    () => {
      field(page, cursor, 'Tipo de Persona', typePerson, font);
      field(page, cursor, 'Última actualización', new Date(data.updated_at).toLocaleDateString('es-CO'), font);
    }
  );

  cursor.down(25);

  /* ================== DATOS SOLICITANTE ================== */

  page = ensurePageSpace(pdf, page, cursor, 60);
  sectionTitle(page, cursor, 'Datos del Solicitante', fontBold);

  if (typePerson === 'Natural') {
    const p = data.naturalPerson;

    const fullName = `${p.firstName} ${p.lastName1} ${p.lastName2}`;
    const rowsPerson = [
      { left: fullName, right: p.typeDoc + p.docNumber },
      { left: p.email ?? '–', right: p.phone ?? '–' },
      { left: p.dateOfBirth ?? '–', right: p.placeOfBirth ?? '–' },
      { left: p.activitySector ?? '–', right: p.city ?? '–' },
    ];

    const h = calculateCardHeight(rowsPerson, font, cardLayout);
    page = ensurePageSpace(pdf, page, cursor, h + 30);

    const y = cursor.y;
    drawModernCard(page, 50, y, PAGE.contentWidth, h, {
      variant: 'bordered',
      backgroundColor: theme.white,
    });

    cursor.y = y - cardLayout.paddingTop;

    twoCols(
      page,
      cursor,
      () => {
        field(page, cursor, 'Nombre Completo', fullName, font);
        field(page, cursor, 'Correo Electrónico', p.email ?? '–', font);
        field(page, cursor, 'Fecha de Nacimiento', p.dateOfBirth, font);
        field(page, cursor, 'Sector de Actividad', p.activitySector, font);
      },
      () => {
        field(page, cursor, 'Documento', p.typeDoc + p.docNumber, font);
        field(page, cursor, 'Teléfono', p.phone, font);
        field(page, cursor, 'Lugar de Nacimiento', p.placeOfBirth, font);
        field(page, cursor, 'Ciudad', p.city, font);
      }
    );
  } else {
    const j = data.juridicalPerson;

    const rowsJuridical = [
      { left: j.businessName, right: j.nit },
      { left: j.email, right: j.phone },
      { left: j.address, right: j.address2 ?? '–' },
      { left: j.activitySector, right: j.city },
    ];

    const h = calculateCardHeight(rowsJuridical, font, cardLayout);
    page = ensurePageSpace(pdf, page, cursor, h + 30);

    const y = cursor.y;
    drawModernCard(page, 50, y, PAGE.contentWidth, h, {
      variant: 'bordered',
      backgroundColor: theme.white,
    });

    cursor.y = y - cardLayout.paddingTop;

    twoCols(
      page,
      cursor,
      () => {
        field(page, cursor, 'Razón Social', j.businessName, font);
        field(page, cursor, 'Correo Electrónico', j.email, font);
        field(page, cursor, 'Dirección Principal', j.address, font);
        field(page, cursor, 'Sector de Actividad', j.activitySector, font);
      },
      () => {
        field(page, cursor, 'NIT', j.nit, font);
        field(page, cursor, 'Teléfono', j.phone, font);
        field(page, cursor, 'Dirección Alterna', j.address2 ?? '–', font);
        field(page, cursor, 'Ciudad', j.city, font);
      }
    );
  }

  cursor.down(25);

  /* ================== RELACIONES ================== */

  if (data.relations?.length) {
    page = ensurePageSpace(pdf, page, cursor, 60);
    sectionTitle(page, cursor, 'Relaciones / Vinculados', fontBold);

    for (const rel of data.relations) {
      const rowsRel = [
        { left: rel.socialName, right: rel.typeDoc + rel.docNumber },
        { left: rel.activityAdminResource, right: `${rel.percentageParticipation}%` },
        { left: rel.activityReputationGradePublic, right: '' },
      ];

      const h = calculateCardHeight(rowsRel, font, cardLayout);
      page = ensurePageSpace(pdf, page, cursor, h + 20);

      const y = cursor.y;
      drawModernCard(page, 50, cursor.y, PAGE.contentWidth, h, {
        variant: 'highlight',
        accentColor: theme.warning,
        backgroundColor: theme.warningBg,
      });

      cursor.y = y - cardLayout.paddingTop;

      twoCols(
        page,
        cursor,
        () => {
          field(page, cursor, 'Nombre / Razón Social', rel.socialName, font);
          field(page, cursor, 'Actividad / Recurso', rel.activityAdminResource, font);
          field(page, cursor, 'Reputación Pública', rel.activityReputationGradePublic, font);
        },
        () => {
          field(page, cursor, 'Documento', rel.typeDoc + rel.docNumber, font);
          field(page, cursor, '% Participación', `${rel.percentageParticipation}%`, font);
        }
      );

      cursor.down(15);
    }
  }

  /* ================== PEP ================== */

  if (data.pep) {
    const pep = data.pep;
    const rowsPep = [
      { left: pep.managePublicResources ? 'SI' : 'NO', right: pep.publicPower ? 'SI' : 'NO' },
      { left: pep.relation ? 'SI' : 'NO', right: pep.relationName ?? '–' },
      { left: pep.taxObligations ? 'SI' : 'NO', right: '' },
    ];

    const h = calculateCardHeight(rowsPep, font, cardLayout);
    page = ensurePageSpace(pdf, page, cursor, h + 50);

    cursor.down(10);
    sectionTitle(page, cursor, 'Persona Expuesta Políticamente (PEP)', fontBold, 13, 'left', {
      accentColor: theme.danger,
    });

    const y = cursor.y;
    drawModernCard(page, 50, cursor.y, PAGE.contentWidth, h, {
      variant: 'accent',
      accentColor: theme.danger,
      backgroundColor: theme.dangerBg,
    });

    cursor.y = y - cardLayout.paddingTop;

    twoCols(
      page,
      cursor,
      () => {
        field(page, cursor, 'Maneja Recursos Públicos', pep.managePublicResources ? 'SÍ' : 'NO', font);
        field(page, cursor, 'Tiene Relación con PEP', pep.relation ? 'SÍ' : 'NO', font);
        field(page, cursor, 'Obligaciones Tributarias', pep.taxObligations ? 'SÍ' : 'NO', font);
      },
      () => {
        field(page, cursor, 'Ejerce Poder Público', pep.publicPower ? 'SÍ' : 'NO', font);
        field(page, cursor, 'Nombre del Relacionado', pep.relationName ?? '–', font);
      }
    );

    cursor.down(20);
  }

  if (data?.accountEntityFinancials?.length) {
    /* ================== ENTIDADES FINANCIERAS ================== */

    page = ensurePageSpace(pdf, page, cursor, 60);
    sectionTitle(page, cursor, 'Entidades Financieras', fontBold, 13, 'left', {
      accentColor: theme.info,
    });

    for (const acc of data.accountEntityFinancials) {
      const rowsAcc = [
        { left: acc.accountType, right: acc.accountNumber },
        { left: acc.accountNameEntity, right: '' },
      ];

      const hAcc = calculateCardHeight(rowsAcc, font, cardLayout);
      page = ensurePageSpace(pdf, page, cursor, hAcc + 20);

      const y = cursor.y;
      drawModernCard(page, 50, cursor.y, PAGE.contentWidth, hAcc, {
        variant: 'bordered',
        backgroundColor: theme.white,
      });
      cursor.y = y - cardLayout.paddingTop;

      twoCols(
        page,
        cursor,
        () => field(page, cursor, 'Tipo de Cuenta', acc.accountType, font),
        () => field(page, cursor, 'Entidad Financiera', acc.accountNameEntity, font)
      );

      cursor.down(15);
    }
  }

  if (data?.foreignCurrency?.management) {
    /* ================== MONEDA EXTRANJERA ================== */

    page = ensurePageSpace(pdf, page, cursor, 80);
    sectionTitle(page, cursor, 'Operaciones en Moneda Extranjera', fontBold);

    // Highlight box for important info
    drawHighlightBox(
      page,
      cursor,
      `Realiza operaciones en moneda extranjera: ${data.foreignCurrency.management ? 'SÍ' : 'NO'}`,
      font,
      { type: 'info' }
    );

    if (data.foreignCurrency.products?.length) {
      for (const prod of data.foreignCurrency.products) {
        const rowsFx = [
          { left: prod.type, right: prod.entity },
          { left: prod.country, right: prod.currency },
        ];

        const hFx = calculateCardHeight(rowsFx, font, cardLayout);
        page = ensurePageSpace(pdf, page, cursor, hFx + 20);

        const y = cursor.y;
        drawModernCard(page, 50, cursor.y, PAGE.contentWidth, hFx, {
          variant: 'bordered',
          backgroundColor: theme.cardBgAlt,
        });
        cursor.y = y - cardLayout.paddingTop;

        twoCols(
          page,
          cursor,
          () => field(page, cursor, 'Tipo de Producto', prod.type, font),
          () => field(page, cursor, 'Entidad', prod.entity, font)
        );

        cursor.down(15);
      }
    }
  }

  cursor.down(20);

  if (data.pepAuthorization?.block1?.signature != null) {
    page = ensurePageSpace(pdf, page, cursor, 180);
    sectionTitle(page, cursor, 'Verificación – Bloque 1', fontBold, 13, 'left', {
      accentColor: theme.success,
    });

    const pepAuth = data.pepAuthorization.block1;
    const base64 = pepAuth.signature;
    const autorized = pepAuth.auth ? 'SÍ' : 'NO';
    const date = pepAuth.date + ' ' + pepAuth.time;
    const signatureImage = await pdf.embedPng(
      Uint8Array.from(atob(base64.split(',')[1]), (c) => c.charCodeAt(0))
    );

    const rowsFx = [
      { left: pepAuth.name, right: autorized },
      { left: date, right: pepAuth.signature },
      { left: date, right: pepAuth.signature },
      { left: date, right: pepAuth.signature },
    ];

    const hFx = calculateCardHeight(rowsFx, font, cardLayout);
    page = ensurePageSpace(pdf, page, cursor, hFx + 20);

    const y = cursor.y;
    drawModernCard(page, 50, cursor.y, PAGE.contentWidth, hFx, {
      variant: 'accent',
      accentColor: theme.success,
      backgroundColor: theme.successBg,
    });
    cursor.y = y - cardLayout.paddingTop;

    twoCols(
      page,
      cursor,
      () => field(page, cursor, 'Nombre', pepAuth.name, font),
      () => field(page, cursor, 'Autorizado', autorized, font)
    );

    const sigWidth = 180;
    const sigHeight = 90;

    twoCols(
      page,
      cursor,
      () => field(page, cursor, 'Fecha y Hora', date, font),
      () => {
        field(page, cursor, 'Firma Digital', '', font);
        page.drawImage(signatureImage, {
          x: cursor.x,
          y: cursor.y - sigHeight,
          width: sigWidth,
          height: sigHeight,
        });
        return sigHeight;
      }
    );

    cursor.down(sigHeight + 20);
  }

  if (data?.signature?.signature) {
    /* ================== FIRMA FINAL ================== */
    const base64 = data.signature.signature;

    page = ensurePageSpace(pdf, page, cursor, 180);

    drawSectionDivider(page, cursor, { style: 'gradient' });

    sectionTitle(page, cursor, 'Firma del Documento', fontBold);

    const signatureImage = await pdf.embedPng(
      Uint8Array.from(atob(base64.split(',')[1]), (c) => c.charCodeAt(0))
    );

    drawSignatureBlock(page, cursor, {
      signatureImage,
      name: data.signature.name,
      document: data.signature.document,
      title: 'Firma Autorizada',
      font,
      width: 180,
      height: 70,
    });

    cursor.down(100);
  }
  page = ensurePageSpace(pdf, page, cursor, 80);
  sectionTitle(page, cursor, 'Documentos Soporte', font);

  Object.entries(data.supportingDocuments).forEach(([key, value]) => {
    field(page, cursor, key, value ? 'Adjunto' : 'No adjunto', font);
  });
  drawPageFooter(page, {
    pageNumber: 1,
    companyName: 'Documento SARLAFT - Confidencial',
    font,
  });

  const bytes = await pdf.save();
  return bytes;
}
