import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useEMRCredentials } from '@/hooks/useEMRCredentials';
import { RefreshCw, CloudDownload, CheckCircle2, AlertCircle, Database, Cloud } from 'lucide-react';
import { toast } from 'sonner';

interface EMRSyncPanelProps {
  patientId: string;
  hospitalId: string;
  onDataSynced?: (dataType: string, data: any[]) => void;
}

type SyncStatus = 'idle' | 'syncing' | 'success' | 'error';

const DATA_TYPES = [
  { key: 'labs', label: 'Lab Results', method: 'getLabResults' },
  { key: 'medications', label: 'Medications', method: 'getMedications' },
  { key: 'allergies', label: 'Allergies', method: 'getAllergies' },
  { key: 'conditions', label: 'Conditions', method: 'getConditions' },
  { key: 'vitals', label: 'Vital Signs', method: 'getVitals' },
  { key: 'encounters', label: 'Encounters', method: 'getEncounters' },
  { key: 'immunizations', label: 'Immunizations', method: 'getImmunizations' },
  { key: 'procedures', label: 'Procedures', method: 'getProcedures' },
] as const;

export function EMRSyncPanel({ patientId, hospitalId, onDataSynced }: EMRSyncPanelProps) {
  const emr = useEMRCredentials(hospitalId);
  const [syncStatus, setSyncStatus] = useState<Record<string, SyncStatus>>({});
  const [syncResults, setSyncResults] = useState<Record<string, number>>({});
  const [isFullSync, setIsFullSync] = useState(false);

  const syncDataType = async (dataType: typeof DATA_TYPES[number]) => {
    setSyncStatus(prev => ({ ...prev, [dataType.key]: 'syncing' }));
    
    try {
      const method = emr[dataType.method as keyof typeof emr] as (patientId: string) => Promise<any[]>;
      const data = await method(patientId);
      
      setSyncStatus(prev => ({ ...prev, [dataType.key]: 'success' }));
      setSyncResults(prev => ({ ...prev, [dataType.key]: data?.length || 0 }));
      onDataSynced?.(dataType.key, data);
      
      return data;
    } catch (error: any) {
      setSyncStatus(prev => ({ ...prev, [dataType.key]: 'error' }));
      console.error(`Failed to sync ${dataType.label}:`, error);
      throw error;
    }
  };

  const syncAll = async () => {
    setIsFullSync(true);
    let successCount = 0;
    let errorCount = 0;

    for (const dataType of DATA_TYPES) {
      try {
        await syncDataType(dataType);
        successCount++;
      } catch {
        errorCount++;
      }
    }

    setIsFullSync(false);
    
    if (errorCount === 0) {
      toast.success(`Synced all ${successCount} data types from EMR`);
    } else {
      toast.warning(`Synced ${successCount} types, ${errorCount} failed`);
    }
  };

  const getStatusIcon = (status: SyncStatus) => {
    switch (status) {
      case 'syncing': return <RefreshCw className="h-4 w-4 animate-spin text-primary" />;
      case 'success': return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'error': return <AlertCircle className="h-4 w-4 text-destructive" />;
      default: return <CloudDownload className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <Cloud className="h-5 w-5" />
              EMR Sync
            </CardTitle>
            <CardDescription>Pull patient data from hospital EMR</CardDescription>
          </div>
          <Button onClick={syncAll} disabled={isFullSync} size="sm">
            <RefreshCw className={`h-4 w-4 mr-2 ${isFullSync ? 'animate-spin' : ''}`} />
            Sync All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {DATA_TYPES.map((dataType) => (
            <Button
              key={dataType.key}
              variant="outline"
              size="sm"
              className="justify-between h-auto py-2"
              onClick={() => syncDataType(dataType)}
              disabled={syncStatus[dataType.key] === 'syncing'}
            >
              <span className="text-xs">{dataType.label}</span>
              <div className="flex items-center gap-1">
                {syncResults[dataType.key] !== undefined && (
                  <Badge variant="secondary" className="text-xs px-1">
                    {syncResults[dataType.key]}
                  </Badge>
                )}
                {getStatusIcon(syncStatus[dataType.key] || 'idle')}
              </div>
            </Button>
          ))}
        </div>
        
        <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
          <Database className="h-3 w-3" />
          <span>Local</span>
          <span className="mx-1">→</span>
          <Cloud className="h-3 w-3" />
          <span>EMR</span>
        </div>
      </CardContent>
    </Card>
  );
}
