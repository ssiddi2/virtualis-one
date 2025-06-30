
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Download, 
  Filter, 
  Search, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle,
  CheckCircle,
  Calendar,
  ArrowUpDown
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface LabResult {
  id: string;
  testName: string;
  value: string;
  referenceRange: string;
  unit: string;
  status: 'normal' | 'high' | 'low' | 'critical';
  date: string;
  time: string;
  orderedBy: string;
  trending?: 'up' | 'down' | 'stable';
}

interface LabDataTableProps {
  patientId?: string;
}

const LabDataTable = ({ patientId }: LabDataTableProps) => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof LabResult>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Comprehensive mock lab data
  const labResults: LabResult[] = [
    {
      id: '1',
      testName: 'Hemoglobin',
      value: '14.2',
      referenceRange: '12.0-15.5',
      unit: 'g/dL',
      status: 'normal',
      date: '2024-01-15',
      time: '08:30',
      orderedBy: 'Dr. Johnson',
      trending: 'stable'
    },
    {
      id: '2',
      testName: 'White Blood Cell Count',
      value: '11.2',
      referenceRange: '4.5-11.0',
      unit: 'K/uL',
      status: 'high',
      date: '2024-01-15',
      time: '08:30',
      orderedBy: 'Dr. Johnson',
      trending: 'up'
    },
    {
      id: '3',
      testName: 'Glucose',
      value: '180',
      referenceRange: '70-100',
      unit: 'mg/dL',
      status: 'critical',
      date: '2024-01-15',
      time: '08:30',
      orderedBy: 'Dr. Johnson',
      trending: 'up'
    },
    {
      id: '4',
      testName: 'Creatinine',
      value: '1.2',
      referenceRange: '0.7-1.3',
      unit: 'mg/dL',
      status: 'normal',
      date: '2024-01-15',
      time: '08:30',
      orderedBy: 'Dr. Johnson',
      trending: 'stable'
    },
    {
      id: '5',
      testName: 'Total Cholesterol',
      value: '220',
      referenceRange: '<200',
      unit: 'mg/dL',
      status: 'high',
      date: '2024-01-12',
      time: '07:45',
      orderedBy: 'Dr. Smith',
      trending: 'down'
    },
    {
      id: '6',
      testName: 'HDL Cholesterol',
      value: '45',
      referenceRange: '>40',
      unit: 'mg/dL',
      status: 'normal',
      date: '2024-01-12',
      time: '07:45',
      orderedBy: 'Dr. Smith',
      trending: 'stable'
    },
    {
      id: '7',
      testName: 'LDL Cholesterol',
      value: '140',
      referenceRange: '<100',
      unit: 'mg/dL',
      status: 'high',
      date: '2024-01-12',
      time: '07:45',
      orderedBy: 'Dr. Smith',
      trending: 'down'
    },
    {
      id: '8',
      testName: 'Triglycerides',
      value: '175',
      referenceRange: '<150',
      unit: 'mg/dL',
      status: 'high',
      date: '2024-01-12',
      time: '07:45',
      orderedBy: 'Dr. Smith',
      trending: 'stable'
    },
    {
      id: '9',
      testName: 'Troponin I',
      value: '0.02',
      referenceRange: '<0.04',
      unit: 'ng/mL',
      status: 'normal',
      date: '2024-01-14',
      time: '14:20',
      orderedBy: 'Dr. Wilson',
      trending: 'stable'
    },
    {
      id: '10',
      testName: 'BUN',
      value: '18',
      referenceRange: '7-20',
      unit: 'mg/dL',
      status: 'normal',
      date: '2024-01-15',
      time: '08:30',
      orderedBy: 'Dr. Johnson',
      trending: 'stable'
    }
  ];

  const filteredAndSortedResults = labResults
    .filter(result => {
      const matchesSearch = result.testName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           result.orderedBy.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterStatus === 'all' || result.status === filterStatus;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      const direction = sortDirection === 'asc' ? 1 : -1;
      return aValue < bValue ? -direction : aValue > bValue ? direction : 0;
    });

  const handleSort = (field: keyof LabResult) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'critical':
        return <Badge className="virtualis-badge error">Critical</Badge>;
      case 'high':
        return <Badge className="virtualis-badge warning">High</Badge>;
      case 'low':
        return <Badge className="virtualis-badge warning">Low</Badge>;
      case 'normal':
        return <Badge className="virtualis-badge success">Normal</Badge>;
      default:
        return <Badge className="virtualis-badge">Unknown</Badge>;
    }
  };

  const getTrendingIcon = (trending?: string) => {
    switch (trending) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-red-400" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-green-400" />;
      case 'stable':
        return <CheckCircle className="h-4 w-4 text-blue-400" />;
      default:
        return null;
    }
  };

  const exportToCSV = () => {
    const headers = ['Test Name', 'Value', 'Unit', 'Reference Range', 'Status', 'Date', 'Time', 'Ordered By', 'Trending'];
    const csvContent = [
      headers.join(','),
      ...filteredAndSortedResults.map(result => [
        result.testName,
        result.value,
        result.unit,
        result.referenceRange,
        result.status,
        result.date,
        result.time,
        result.orderedBy,
        result.trending || 'N/A'
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lab-results-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Lab Results Exported",
      description: `Exported ${filteredAndSortedResults.length} lab results to CSV`,
    });
  };

  const exportToExcel = () => {
    const headers = ['Test Name', 'Value', 'Unit', 'Reference Range', 'Status', 'Date', 'Time', 'Ordered By', 'Trending'];
    const excelContent = [
      headers.join('\t'),
      ...filteredAndSortedResults.map(result => [
        result.testName,
        result.value,
        result.unit,
        result.referenceRange,
        result.status,
        result.date,
        result.time,
        result.orderedBy,
        result.trending || 'N/A'
      ].join('\t'))
    ].join('\n');

    const blob = new Blob([excelContent], { type: 'application/vnd.ms-excel' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lab-results-${new Date().toISOString().split('T')[0]}.xls`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Lab Results Exported",
      description: `Exported ${filteredAndSortedResults.length} lab results to Excel`,
    });
  };

  return (
    <Card className="virtualis-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <Calendar className="h-5 w-5 text-cyan-300" />
            Laboratory Results ({filteredAndSortedResults.length})
          </CardTitle>
          <div className="flex gap-2">
            <Button onClick={exportToCSV} size="sm" className="virtualis-button">
              <Download className="h-4 w-4 mr-2" />
              CSV
            </Button>
            <Button onClick={exportToExcel} size="sm" className="virtualis-button">
              <Download className="h-4 w-4 mr-2" />
              Excel
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filters and Search */}
        <div className="flex gap-4 items-center">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
              <Input
                placeholder="Search tests or providers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="virtualis-input pl-10"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant={filterStatus === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterStatus('all')}
              className="text-white"
            >
              All
            </Button>
            <Button
              variant={filterStatus === 'critical' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterStatus('critical')}
              className="text-white"
            >
              Critical
            </Button>
            <Button
              variant={filterStatus === 'high' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterStatus('high')}
              className="text-white"
            >
              Abnormal
            </Button>
            <Button
              variant={filterStatus === 'normal' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterStatus('normal')}
              className="text-white"
            >
              Normal
            </Button>
          </div>
        </div>

        {/* Excel-like Table */}
        <div className="border border-white/20 rounded-lg overflow-hidden">
          <Table>
            <TableHeader className="bg-slate-700/30">
              <TableRow className="border-white/20">
                <TableHead 
                  className="text-white cursor-pointer hover:bg-white/10"
                  onClick={() => handleSort('testName')}
                >
                  <div className="flex items-center gap-2">
                    Test Name
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead 
                  className="text-white cursor-pointer hover:bg-white/10"
                  onClick={() => handleSort('value')}
                >
                  <div className="flex items-center gap-2">
                    Value
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead className="text-white">Unit</TableHead>
                <TableHead className="text-white">Reference Range</TableHead>
                <TableHead 
                  className="text-white cursor-pointer hover:bg-white/10"
                  onClick={() => handleSort('status')}
                >
                  <div className="flex items-center gap-2">
                    Status
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead 
                  className="text-white cursor-pointer hover:bg-white/10"
                  onClick={() => handleSort('date')}
                >
                  <div className="flex items-center gap-2">
                    Date/Time
                    <ArrowUpDown className="h-4 w-4" />
                  </div>
                </TableHead>
                <TableHead className="text-white">Ordered By</TableHead>
                <TableHead className="text-white">Trend</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAndSortedResults.map((result, index) => (
                <TableRow 
                  key={result.id} 
                  className={`border-white/10 hover:bg-white/5 ${
                    index % 2 === 0 ? 'bg-slate-800/20' : 'bg-slate-800/10'
                  }`}
                >
                  <TableCell className="text-white font-medium">
                    <div className="flex items-center gap-2">
                      {result.status === 'critical' && (
                        <AlertTriangle className="h-4 w-4 text-red-400" />
                      )}
                      {result.testName}
                    </div>
                  </TableCell>
                  <TableCell className={`font-mono ${
                    result.status === 'critical' ? 'text-red-400 font-bold' :
                    result.status === 'high' || result.status === 'low' ? 'text-yellow-400' :
                    'text-white'
                  }`}>
                    {result.value}
                  </TableCell>
                  <TableCell className="text-white/80">{result.unit}</TableCell>
                  <TableCell className="text-white/80 font-mono">{result.referenceRange}</TableCell>
                  <TableCell>{getStatusBadge(result.status)}</TableCell>
                  <TableCell className="text-white/80">
                    <div>
                      <div>{result.date}</div>
                      <div className="text-xs text-white/60">{result.time}</div>
                    </div>
                  </TableCell>
                  <TableCell className="text-white/80">{result.orderedBy}</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center">
                      {getTrendingIcon(result.trending)}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {filteredAndSortedResults.length === 0 && (
          <div className="text-center py-8 text-white/60">
            No lab results found matching your criteria
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LabDataTable;
