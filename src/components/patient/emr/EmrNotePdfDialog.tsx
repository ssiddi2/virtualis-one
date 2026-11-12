import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react';
import { callEmr } from '@/lib/emrProxy';

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  hospitalId: string;
  patientId: string;
  note: { id: string; type: string; sourceId?: string | null; date?: string | null } | null;
}

const toBlobUrl = (b64: string) => {
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return URL.createObjectURL(new Blob([bytes], { type: 'application/pdf' }));
};

// Shows one note's PDF exactly as the hospital EMR stores it. Fetched only when opened.
export const EmrNotePdfDialog = ({ open, onOpenChange, hospitalId, patientId, note }: Props) => {
  const [url, setUrl] = useState<string | null>(null);
  const [state, setState] = useState<'idle' | 'loading' | 'error' | 'none'>('idle');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!open || !note) return;
    let cancelled = false;
    let created: string | null = null;
    setUrl(null); setState('loading');
    callEmr<{ data?: string; error?: string }>(hospitalId, 'get_note_pdf', { patientId, noteId: note.id })
      .then((r) => {
        if (cancelled) return;
        if (r.kind === 'unavailable') { setState('error'); setMessage('The hospital connection is unavailable right now.'); return; }
        if (r.kind !== 'ok' || !r.data?.data) { setState('none'); return; }
        created = toBlobUrl(r.data.data);
        setUrl(created); setState('idle');
      })
      .catch((e) => { if (!cancelled) { setState('error'); setMessage((e as Error).message); } });
    return () => { cancelled = true; if (created) URL.revokeObjectURL(created); };
  }, [open, note, hospitalId, patientId]);

  const fileName = `${note?.sourceId || note?.id || 'note'}.pdf`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>{note?.type || 'Note'}{note?.sourceId ? ` • ${note.sourceId}` : ''}</DialogTitle>
          <DialogDescription>The PDF as stored in the hospital EMR.</DialogDescription>
        </DialogHeader>
        {state === 'loading' && (
          <div className="flex items-center justify-center gap-2 py-24 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" /> Loading PDF from the EMR…
          </div>
        )}
        {state === 'none' && <p className="py-12 text-center text-muted-foreground">This note has no PDF attached.</p>}
        {state === 'error' && <p className="py-12 text-center text-critical">Couldn't load the PDF: {message}</p>}
        {url && (
          <>
            <iframe title={fileName} src={url} className="w-full h-[70vh] rounded-md border border-border/40 bg-muted/30" />
            <div className="flex justify-end">
              <Button asChild size="sm" variant="secondary">
                <a href={url} download={fileName}><Download className="h-4 w-4 mr-1" /> Download PDF</a>
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
