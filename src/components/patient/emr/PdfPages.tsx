import { useEffect, useRef, useState } from 'react';
import * as pdfjs from 'pdfjs-dist';
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;

// Draws each PDF page onto a canvas. Chrome's built-in viewer is blocked inside
// the embedded preview, so the app renders the pages itself.
export const PdfPages = ({ bytes }: { bytes: Uint8Array }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const host = ref.current;
    if (!host) return;
    let cancelled = false;
    host.replaceChildren();
    setError(null);
    const task = pdfjs.getDocument({ data: bytes.slice() });
    task.promise.then(async (doc) => {
      const width = host.clientWidth || 800;
      for (let n = 1; n <= doc.numPages && !cancelled; n++) {
        const page = await doc.getPage(n);
        const base = page.getViewport({ scale: 1 });
        const scale = width / base.width;
        const viewport = page.getViewport({ scale: scale * window.devicePixelRatio });
        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        canvas.style.width = `${width}px`;
        canvas.className = 'block bg-card shadow rounded-sm mb-4';
        canvas.setAttribute('aria-label', `Page ${n}`);
        host.appendChild(canvas);
        await page.render({ canvasContext: canvas.getContext('2d')!, viewport }).promise;
      }
    }).catch((e) => { if (!cancelled) setError((e as Error).message); });
    return () => { cancelled = true; task.destroy(); };
  }, [bytes]);

  if (error) return <p className="py-12 text-center text-critical">Couldn't display the PDF: {error}</p>;
  return <div ref={ref} />;
};
