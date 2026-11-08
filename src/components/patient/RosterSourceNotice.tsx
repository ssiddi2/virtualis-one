import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Radio, AlertTriangle, Database } from 'lucide-react';
import type { RosterSource } from '@/hooks/useHospitalPatients';

interface Props {
  source: RosterSource;
  hospitalName?: string;
  error?: Error | null;
  onRetry?: () => void;
}

// Tells the user where the patient list comes from, and why it is empty when
// the hospital's EMR can't be reached. Never falls back to placeholder people.
const RosterSourceNotice = ({ source, hospitalName, error, onRetry }: Props) => {
  if (error) {
    return (
      <div className="clinical-card p-4 flex items-center justify-between gap-4 border-critical/40">
        <div className="flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 text-critical" />
          <div>
            <p className="font-medium text-foreground">Couldn't load patients from {hospitalName || 'the hospital'} EMR</p>
            <p className="text-sm text-muted-foreground">{error.message}</p>
          </div>
        </div>
        {onRetry && <Button size="sm" variant="secondary" onClick={onRetry}>Try again</Button>}
      </div>
    );
  }
  if (source === 'unavailable') {
    return (
      <div className="clinical-card p-4 flex items-center gap-3 border-warning/40">
        <AlertTriangle className="h-5 w-5 text-warning" />
        <p className="text-foreground">EMR connection unavailable — the {hospitalName || 'hospital'} connection is still being set up.</p>
      </div>
    );
  }
  if (source === 'unsupported') {
    return (
      <div className="clinical-card p-4 flex items-center gap-3">
        <AlertTriangle className="h-5 w-5 text-warning" />
        <p className="text-foreground">This connection is for connection testing only and has no patient list.</p>
      </div>
    );
  }
  if (source === 'fhir') {
    return (
      <Badge className="gap-1.5 bg-success text-success-foreground hover:bg-success">
        <Radio className="h-3.5 w-3.5" /> Live from {hospitalName || 'hospital'} EMR
      </Badge>
    );
  }
  return (
    <Badge variant="secondary" className="gap-1.5">
      <Database className="h-3.5 w-3.5" /> Local demo records
    </Badge>
  );
};

export default RosterSourceNotice;
