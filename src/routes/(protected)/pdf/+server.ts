import type { RequestHandler } from '@sveltejs/kit';
import { getSarlaftById } from '$lib/api/admin/sarlaft';
import { Buffer } from 'buffer';
import { generateSarlaftPdf } from '$lib/template/template-pdf';

/* ================== ENDPOINT ================== */

export const POST: RequestHandler = async ({ request, cookies, fetch }) => {
  const { id } = await request.json();
  const accessToken = cookies.get('sb-access-token');

  if (!id || !accessToken) {
    return new Response('Unauthorized', { status: 401 });
  }

  const sarlaft = await getSarlaftById(accessToken, id).then(r => r.data);

  if (!sarlaft) {
    return new Response('Not found', { status: 404 });
  }


  const pdfBytes = await generateSarlaftPdf(sarlaft, fetch);

  const buffer = Buffer.from(pdfBytes);

  return new Response(buffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="SARLAFT_${id}.pdf"`,
      'Content-Length': pdfBytes.length.toString()
    }
  });
};
