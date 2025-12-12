import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { format } from 'date-fns';
import { Download, Search, Shield } from 'lucide-react';

export const AuditLogViewer = () => {
  const [search, setSearch] = useState('');

  const { data: logs, isLoading } = useQuery({
    queryKey: ['audit-logs', search],
    queryFn: async () => {
      let query = supabase.from('audit_log').select('*').order('created_at', { ascending: false }).limit(100);
      if (search) query = query.or(`action.ilike.%${search}%,resource_type.ilike.%${search}%`);
      const { data } = await query;
      return data || [];
    },
  });

  const exportCSV = () => {
    if (!logs?.length) return;
    const csv = [Object.keys(logs[0]).join(','), ...logs.map(r => Object.values(r).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'audit_log.csv'; a.click();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-primary" />
          <h2 className="text-xl font-semibold">HIPAA Audit Log</h2>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} className="pl-8 w-64" />
          </div>
          <Button variant="outline" onClick={exportCSV}><Download className="h-4 w-4 mr-1" />Export</Button>
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Timestamp</TableHead><TableHead>User</TableHead><TableHead>Action</TableHead>
            <TableHead>Resource</TableHead><TableHead>Patient ID</TableHead><TableHead>Emergency</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? <TableRow><TableCell colSpan={6}>Loading...</TableCell></TableRow> :
            logs?.map(log => (
              <TableRow key={log.id}>
                <TableCell>{format(new Date(log.created_at), 'PPpp')}</TableCell>
                <TableCell className="font-mono text-xs">{log.user_id?.slice(0, 8)}</TableCell>
                <TableCell><span className={`px-2 py-1 rounded text-xs ${log.action === 'DELETE' ? 'bg-destructive/20' : 'bg-primary/20'}`}>{log.action}</span></TableCell>
                <TableCell>{log.resource_type}</TableCell>
                <TableCell className="font-mono text-xs">{log.patient_id?.slice(0, 8)}</TableCell>
                <TableCell>{log.is_emergency_access ? '⚠️' : '-'}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
};
