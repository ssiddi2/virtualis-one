
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  FlaskConical, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Download
} from 'lucide-react';

interface LabResult {
  test: string;
  value: string;
  unit: string;
  reference: string;
  status: 'normal' | 'high' | 'low' | 'critical';
  trend?: 'up' | 'down' | 'stable';
  timestamp: string;
}

interface LabResultsSpreadsheetProps {
  patientId: string;
}

const LabResultsSpreadsheet = ({ patientId }: LabResultsSpreadsheetProps) => {
  // Mock lab data
  const labPanels = {
    CBC: [
      { test: 'WBC', value: '12.5', unit: 'K/uL', reference: '4.5-11.0', status: 'high' as const, trend: 'up' as const, timestamp: '2024-01-15 08:30' },
      { test: 'RBC', value: '4.2', unit: 'M/uL', reference: '4.2-5.4', status: 'normal' as const, trend: 'stable' as const, timestamp: '2024-01-15 08:30' },
      { test: 'Hemoglobin', value: '13.8', unit: 'g/dL', reference: '12.0-15.5', status: 'normal' as const, trend: 'stable' as const, timestamp: '2024-01-15 08:30' },
      { test: 'Hematocrit', value: '41.2', unit: '%', reference: '36.0-46.0', status: 'normal' as const, trend: 'stable' as const, timestamp: '2024-01-15 08:30' },
      { test: 'Platelets', value: '185', unit: 'K/uL', reference: '150-450', status: 'normal' as const, trend: 'stable' as const, timestamp: '2024-01-15 08:30' }
    ],
    CMP: [
      { test: 'Glucose', value: '145', unit: 'mg/dL', reference: '70-100', status: 'high' as const, trend: 'up' as const, timestamp: '2024-01-15 08:30' },
      { test: 'BUN', value: '25', unit: 'mg/dL', reference: '7-20', status: 'high' as const, trend: 'up' as const, timestamp: '2024-01-15 08:30' },
      { test: 'Creatinine', value: '1.2', unit: 'mg/dL', reference: '0.6-1.2', status: 'normal' as const, trend: 'stable' as const, timestamp: '2024-01-15 08:30' },
      { test: 'Sodium', value: '140', unit: 'mmol/L', reference: '136-145', status: 'normal' as const, trend: 'stable' as const, timestamp: '2024-01-15 08:30' },
      { test: 'Potassium', value: '4.1', unit: 'mmol/L', reference: '3.5-5.1', status: 'normal' as const, trend: 'stable' as const, timestamp: '2024-01-15 08:30' },
      { test: 'Chloride', value: '102', unit: 'mmol/L', reference: '98-107', status: 'normal' as const, trend: 'stable' as const, timestamp: '2024-01-15 08:30' }
    ],
    Cardiac: [
      { test: 'Troponin I', value: '0.85', unit: 'ng/mL', reference: '<0.04', status: 'critical' as const, trend: 'up' as const, timestamp: '2024-01-15 08:30' },
      { test: 'CK-MB', value: '12.5', unit: 'ng/mL', reference: '<6.3', status: 'high' as const, trend: 'up' as const, timestamp: '2024-01-15 08:30' },
      { test: 'BNP', value: '890', unit: 'pg/mL', reference: '<100', status: 'critical' as const, trend: 'up' as const, timestamp: '2024-01-15 08:30' }
    ]
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return 'bg-red-500/20 text-red-200 border-red-400/30';
      case 'high': return 'bg-orange-500/20 text-orange-200 border-orange-400/30';
      case 'low': return 'bg-yellow-500/20 text-yellow-200 border-yellow-400/30';
      case 'normal': return 'bg-green-500/20 text-green-200 border-green-400/30';
      default: return 'bg-gray-500/20 text-gray-200 border-gray-400/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'critical': return <AlertTriangle className="h-3 w-3" />;
      case 'high': return <TrendingUp className="h-3 w-3" />;
      case 'low': return <TrendingDown className="h-3 w-3" />;
      case 'normal': return <CheckCircle className="h-3 w-3" />;
      default: return <Clock className="h-3 w-3" />;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-3 w-3 text-red-400" />;
      case 'down': return <TrendingDown className="h-3 w-3 text-blue-400" />;
      default: return <div className="h-3 w-3 rounded-full bg-gray-400"></div>;
    }
  };

  const renderLabPanel = (panelName: string, results: LabResult[]) => (
    <Card key={panelName} className="backdrop-blur-xl bg-white/5 border border-white/20 text-white">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <FlaskConical className="h-5 w-5 text-blue-400" />
          {panelName}
          <Badge className="ml-auto bg-blue-500/20 text-blue-200 border-blue-400/30">
            {new Date(results[0]?.timestamp).toLocaleDateString()}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/20">
                <th className="text-left py-2 px-1 text-sm font-medium text-white/70">Test</th>
                <th className="text-center py-2 px-1 text-sm font-medium text-white/70">Value</th>
                <th className="text-center py-2 px-1 text-sm font-medium text-white/70">Unit</th>
                <th className="text-center py-2 px-1 text-sm font-medium text-white/70">Reference</th>
                <th className="text-center py-2 px-1 text-sm font-medium text-white/70">Status</th>
                <th className="text-center py-2 px-1 text-sm font-medium text-white/70">Trend</th>
              </tr>
            </thead>
            <tbody>
              {results.map((result, index) => (
                <tr key={index} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                  <td className="py-3 px-1 text-sm font-medium text-white">{result.test}</td>
                  <td className="py-3 px-1 text-center text-sm font-bold text-white">{result.value}</td>
                  <td className="py-3 px-1 text-center text-sm text-white/70">{result.unit}</td>
                  <td className="py-3 px-1 text-center text-sm text-white/60">{result.reference}</td>
                  <td className="py-3 px-1 text-center">
                    <Badge className={`${getStatusColor(result.status)} flex items-center gap-1 text-xs w-fit mx-auto`}>
                      {getStatusIcon(result.status)}
                      {result.status.toUpperCase()}
                    </Badge>
                  </td>
                  <td className="py-3 px-1 text-center">
                    {result.trend && getTrendIcon(result.trend)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Laboratory Results</h2>
        <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
          <Download className="h-4 w-4 mr-2" />
          Export Results
        </Button>
      </div>
      
      <div className="grid gap-6">
        {Object.entries(labPanels).map(([panelName, results]) => 
          renderLabPanel(panelName, results)
        )}
      </div>
    </div>
  );
};

export default LabResultsSpreadsheet;
