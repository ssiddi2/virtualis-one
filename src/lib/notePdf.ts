import { jsPDF } from 'jspdf';

// Text-only clinical note PDF matching the LiveMed samples:
// US Letter, Helvetica-Bold 14 title, Helvetica 10 body with 14pt line spacing, 1" margins.
export interface NotePdfInput {
  title: string;
  headerLines: string[];
  body: string;
  footer?: string;
}

const PAGE_W = 612;
const PAGE_H = 792;
const MARGIN = 72;
const LINE = 14;

// Standard PDF fonts only cover basic Latin; swap common typographic characters.
const plain = (s: string) =>
  s.replace(/[\u2018\u2019]/g, "'").replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2013\u2014]/g, '-').replace(/\u2026/g, '...').replace(/\u00A0/g, ' ');

export function buildNotePdf({ title, headerLines, body, footer }: NotePdfInput): jsPDF {
  const doc = new jsPDF({ unit: 'pt', format: 'letter' });
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text(plain(title), MARGIN, PAGE_H - 740);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  const source = [...headerLines, '', ...body.split(/\r?\n/), ...(footer ? ['', footer] : [])];
  const lines = source.flatMap((l) => {
    const t = plain(l).trimEnd();
    return t ? (doc.splitTextToSize(t, PAGE_W - MARGIN * 2) as string[]) : [''];
  });

  let y = PAGE_H - 712;
  for (const line of lines) {
    if (y > PAGE_H - MARGIN) {
      doc.addPage();
      y = MARGIN;
    }
    if (line) doc.text(line, MARGIN, y);
    y += LINE;
  }
  return doc;
}

/** Base64 of the PDF bytes (no data: prefix), as sent in noteData. */
export function pdfBase64(doc: jsPDF): string {
  const uri = doc.output('datauristring');
  return uri.slice(uri.indexOf(',') + 1);
}
