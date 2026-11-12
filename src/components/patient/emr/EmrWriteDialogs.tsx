import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { AlertTriangle, Loader2, Send, Eye } from 'lucide-react';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/EnterpriseAuthContext';
import {
  EMR_NOTE_TYPES, EMR_ORDER_PRIORITIES, EMR_ORDER_TYPES, useSendEmrNote, useSendEmrOrder,
} from '@/hooks/useEmrWriteback';
import { buildNotePdf, pdfBase64 } from '@/lib/notePdf';

export interface EmrChartPatient {
  id: string;
  firstName: string;
  lastName: string;
  mrn?: string;
  dob?: string;
}

interface BaseProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  hospitalId: string;
  hospitalName?: string;
  patient: EmrChartPatient;
}

const newId = () => crypto.randomUUID();
const stamp = (d = new Date()) => {
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
};

const NotSetUp = () => (
  <div className="flex items-start gap-2 rounded-md border border-warning/40 bg-warning/10 p-3 text-sm">
    <AlertTriangle className="h-4 w-4 mt-0.5 text-warning shrink-0" />
    <p>Sending to the EMR isn't switched on yet — the hospital connection is still being set up. Nothing was sent.</p>
  </div>
);

export function PlaceEmrOrderDialog({ open, onOpenChange, hospitalId, hospitalName, patient }: BaseProps) {
  const send = useSendEmrOrder(hospitalId);
  const [requestId, setRequestId] = useState(newId);
  const [orderType, setOrderType] = useState<(typeof EMR_ORDER_TYPES)[number]>('Imaging');
  const [priority, setPriority] = useState<(typeof EMR_ORDER_PRIORITIES)[number]>('routine');
  const [orderName, setOrderName] = useState('');
  const [indication, setIndication] = useState('');
  const [details, setDetails] = useState('');
  const [notSetUp, setNotSetUp] = useState(false);

  useEffect(() => {
    if (open) {
      setRequestId(newId()); setOrderType('Imaging'); setPriority('routine');
      setOrderName(''); setIndication(''); setDetails(''); setNotSetUp(false); send.reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const canSend = orderName.trim() && indication.trim() && !send.isPending;

  const submit = async () => {
    setNotSetUp(false);
    try {
      const r = await send.mutateAsync({
        clientRequestId: requestId, patientId: patient.id, orderType, priority,
        orderName: orderName.trim(), indication: indication.trim(), details: details.trim(),
      });
      if (r.kind === 'unavailable') { setNotSetUp(true); return; }
      toast.success(`Order sent to ${hospitalName || 'the'} EMR`, { description: `${orderName.trim()} • ${r.sourceId}` });
      onOpenChange(false);
    } catch (e) {
      toast.error((e as Error).message || 'Order could not be sent');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Place order</DialogTitle>
          <DialogDescription>
            {patient.firstName} {patient.lastName} • MRN {patient.mrn || '—'} — signed and sent to {hospitalName || 'the hospital'} EMR.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label>Order type</Label>
              <Select value={orderType} onValueChange={(v) => setOrderType(v as typeof orderType)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{EMR_ORDER_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="grid gap-1.5">
              <Label>Priority</Label>
              <Select value={priority} onValueChange={(v) => setPriority(v as typeof priority)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {EMR_ORDER_PRIORITIES.map((p) => <SelectItem key={p} value={p}>{p === 'urgent' ? 'Urgent' : 'Routine'}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="emr-order-name">Order</Label>
            <Input id="emr-order-name" value={orderName} onChange={(e) => setOrderName(e.target.value)} maxLength={200}
              placeholder={orderType === 'Imaging' ? 'e.g. CT Head without contrast' : 'e.g. Speech-language pathology evaluation'} />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="emr-order-indication">Indication</Label>
            <Textarea id="emr-order-indication" value={indication} onChange={(e) => setIndication(e.target.value)} maxLength={1000} rows={2} />
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="emr-order-details">Details (optional)</Label>
            <Textarea id="emr-order-details" value={details} onChange={(e) => setDetails(e.target.value)} maxLength={2000} rows={2} />
          </div>
          {notSetUp && <NotSetUp />}
        </div>
        <DialogFooter>
          <Button variant="secondary" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={!canSend}>
            {send.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
            Sign &amp; send
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function WriteEmrNoteDialog({
  open, onOpenChange, hospitalId, hospitalName, patient, location,
}: BaseProps & { location?: string }) {
  const { profile } = useAuth();
  const send = useSendEmrNote(hospitalId);
  const [requestId, setRequestId] = useState(newId);
  const [noteType, setNoteType] = useState<'CN' | 'PN'>('PN');
  const [title, setTitle] = useState('Progress Note');
  const [body, setBody] = useState('');
  const [notSetUp, setNotSetUp] = useState(false);

  useEffect(() => {
    if (open) {
      setRequestId(newId()); setNoteType('PN'); setTitle('Progress Note'); setBody(''); setNotSetUp(false); send.reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const author = [profile?.first_name, profile?.last_name].filter(Boolean).join(' ') || profile?.email || 'Clinician';

  const makePdf = () => {
    const now = stamp();
    return buildNotePdf({
      title: title.trim() || 'Clinical Note',
      headerLines: [
        `Patient: ${patient.firstName} ${patient.lastName}   MRN: ${patient.mrn || '-'}   DOB: ${patient.dob || '-'}`,
        `Location: ${location || '-'}   Date: ${now}   Author: ${author}`,
      ],
      body: body.trim(),
      footer: `Electronically signed by ${author}, ${now}.`,
    });
  };

  const preview = () => {
    const url = URL.createObjectURL(makePdf().output('blob'));
    window.open(url, '_blank', 'noopener');
    setTimeout(() => URL.revokeObjectURL(url), 60_000);
  };

  const submit = async () => {
    setNotSetUp(false);
    try {
      const r = await send.mutateAsync({
        clientRequestId: requestId, patientId: patient.id, noteType, noteData: pdfBase64(makePdf()),
      });
      if (r.kind === 'unavailable') { setNotSetUp(true); return; }
      toast.success(`Note sent to ${hospitalName || 'the'} EMR`, { description: `${title.trim()} • ${r.sourceId}` });
      onOpenChange(false);
    } catch (e) {
      toast.error((e as Error).message || 'Note could not be sent');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Write note</DialogTitle>
          <DialogDescription>
            {patient.firstName} {patient.lastName} • MRN {patient.mrn || '—'} — signed as {author} and sent to {hospitalName || 'the hospital'} EMR as a PDF.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1.5">
              <Label>Note type</Label>
              <Select value={noteType} onValueChange={(v) => {
                const t = EMR_NOTE_TYPES.find((n) => n.code === v)!;
                const prev = EMR_NOTE_TYPES.find((n) => n.code === noteType)!;
                setNoteType(t.code);
                if (!title.trim() || title === prev.title) setTitle(t.title);
              }}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{EMR_NOTE_TYPES.map((n) => <SelectItem key={n.code} value={n.code}>{n.label}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="emr-note-title">Title</Label>
              <Input id="emr-note-title" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={120} />
            </div>
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor="emr-note-body">Note</Label>
            <Textarea id="emr-note-body" value={body} onChange={(e) => setBody(e.target.value)} rows={14}
              placeholder={'Subjective:\n\nObjective:\n\nAssessment and plan:'} className="font-mono text-sm" />
          </div>
          {notSetUp && <NotSetUp />}
        </div>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="ghost" onClick={preview} disabled={!body.trim()}>
            <Eye className="h-4 w-4 mr-2" /> Preview PDF
          </Button>
          <Button variant="secondary" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={!body.trim() || send.isPending}>
            {send.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
            Sign &amp; send
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
