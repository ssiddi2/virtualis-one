import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TestTube, TrendingUp, TrendingDown } from 'lucide-react';

const EpicLabResultsVertical = ({ patientId }: { patientId?: string }) => {
  // Comprehensive lab data with multiple dates
  const labData = {
    'All Results': {
      'Glucose': {
        values: { '2024-01-15': '185', '2024-01-14': '142', '2024-01-13': '95' },
        unit: 'mg/dL',
        reference: '70-99',
        status: 'critical'
      },
      'Sodium': {
        values: { '2024-01-15': '142', '2024-01-14': '141', '2024-01-13': '139' },
        unit: 'mEq/L',
        reference: '136-145',
        status: 'normal'
      },
      'Potassium': {
        values: { '2024-01-15': '2.8', '2024-01-14': '2.9', '2024-01-13': '3.2' },
        unit: 'mEq/L',
        reference: '3.5-5.0',
        status: 'critical'
      },
      'Creatinine': {
        values: { '2024-01-15': '1.8', '2024-01-14': '1.2', '2024-01-13': '0.9' },
        unit: 'mg/dL',
        reference: '0.6-1.2',
        status: 'high'
      },
      'Hemoglobin': {
        values: { '2024-01-15': '11.2', '2024-01-14': '11.8', '2024-01-13': '12.1' },
        unit: 'g/dL',
        reference: '12.0-16.0',
        status: 'low'
      },
      'WBC': {
        values: { '2024-01-15': '12.5', '2024-01-14': '9.1', '2024-01-13': '8.2' },
        unit: 'K/µL',
        reference: '4.0-11.0',
        status: 'high'
      },
      'Platelet Count': {
        values: { '2024-01-15': '285', '2024-01-14': '291', '2024-01-13': '298' },
        unit: 'K/µL',
        reference: '150-450',
        status: 'normal'
      },
      'Troponin I': {
        values: { '2024-01-15': '0.08', '2024-01-14': '0.05', '2024-01-13': '0.02' },
        unit: 'ng/mL',
        reference: '<0.04',
        status: 'high'
      }
    },
    'CBC w/ Diff': {
      'WBC': {
        values: { '2024-01-15': '12.5', '2024-01-14': '9.1', '2024-01-13': '8.2' },
        unit: 'K/µL',
        reference: '4.0-11.0',
        status: 'high'
      },
      'RBC': {
        values: { '2024-01-15': '4.2', '2024-01-14': '4.3', '2024-01-13': '4.1' },
        unit: 'M/µL',
        reference: '4.2-5.4',
        status: 'normal'
      },
      'Hemoglobin': {
        values: { '2024-01-15': '11.2', '2024-01-14': '11.8', '2024-01-13': '12.1' },
        unit: 'g/dL',
        reference: '12.0-16.0',
        status: 'low'
      },
      'Hematocrit': {
        values: { '2024-01-15': '33.5', '2024-01-14': '35.1', '2024-01-13': '36.2' },
        unit: '%',
        reference: '36.0-48.0',
        status: 'low'
      },
      'Platelet Count': {
        values: { '2024-01-15': '285', '2024-01-14': '291', '2024-01-13': '298' },
        unit: 'K/µL',
        reference: '150-450',
        status: 'normal'
      }
    },
    'Basic Metabolic Panel': {
      'Glucose': {
        values: { '2024-01-15': '185', '2024-01-14': '142', '2024-01-13': '95' },
        unit: 'mg/dL',
        reference: '70-99',
        status: 'critical'
      },
      'Sodium': {
        values: { '2024-01-15': '142', '2024-01-14': '141', '2024-01-13': '139' },
        unit: 'mEq/L',
        reference: '136-145',
        status: 'normal'
      },
      'Potassium': {
        values: { '2024-01-15': '2.8', '2024-01-14': '2.9', '2024-01-13': '3.2' },
        unit: 'mEq/L',
        reference: '3.5-5.0',
        status: 'critical'
      },
      'Chloride': {
        values: { '2024-01-15': '98', '2024-01-14': '99', '2024-01-13': '101' },
        unit: 'mEq/L',
        reference: '98-107',
        status: 'normal'
      },
      'CO2': {
        values: { '2024-01-15': '22', '2024-01-14': '23', '2024-01-13': '24' },
        unit: 'mEq/L',
        reference: '22-28',
        status: 'normal'
      }
    },
    'Cardiac Markers': {
      'Troponin I': {
        values: { '2024-01-15': '0.08', '2024-01-14': '0.05', '2024-01-13': '0.02' },
        unit: 'ng/mL',
        reference: '<0.04',
        status: 'high'
      },
      'CK-MB': {
        values: { '2024-01-15': '12.5', '2024-01-14': '8.1', '2024-01-13': '3.2' },
        unit: 'ng/mL',
        reference: '0.0-6.3',
        status: 'high'
      },
      'BNP': {
        values: { '2024-01-15': '890', '2024-01-14': '567', '2024-01-13': '245' },
        unit: 'pg/mL',
        reference: '<100',
        status: 'critical'
      }
    }
  };

  const [activePanel, setActivePanel] = useState('All Results');
  const dates = ['2024-01-15', '2024-01-14', '2024-01-13'];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return 'text-red-400 font-bold';
      case 'high': return 'text-red-300 font-semibold';
      case 'low': return 'text-blue-300 font-semibold';
      case 'normal': return 'text-green-300';
      default: return 'text-white';
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'critical': return 'bg-red-600 text-white';
      case 'high': return 'bg-orange-600 text-white';
      case 'low': return 'bg-blue-600 text-white';
      case 'normal': return 'bg-green-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  const getTrend = (testData: { values: Record<string, string> }) => {
    const values = Object.values(testData.values) as string[];
    const latest = parseFloat(values[0]);
    const previous = parseFloat(values[1]);
    
    if (latest > previous) {
      return <TrendingUp className="h-4 w-4 text-red-400" />;
    } else if (latest < previous) {
      return <TrendingDown className="h-4 w-4 text-blue-400" />;
    }
    return null;
  };

  const currentData = labData[activePanel as keyof typeof labData] || {};

  interface LabTest {
    values: Record<string, string>;
    unit: string;
    reference: string;
    status: string;
  }

  return (
    <div className="space-y-4">
      {/* Lab Panel Navigation */}
      <Card className="clinical-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-white flex items-center gap-2">
            <TestTube className="h-5 w-5" />
            Laboratory Results - Epic Format
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-4">
            {Object.keys(labData).map((panel) => (
              <Button
                key={panel}
                onClick={() => setActivePanel(panel)}
                className={`text-sm ${
                  activePanel === panel 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white/10 text-white/80 hover:bg-white/20'
                }`}
              >
                {panel}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Vertical Lab Results Table */}
      <Card className="clinical-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-white text-lg">{activePanel}</CardTitle>
          <p className="text-white/70 text-sm">Test names as rows, dates as columns (Epic format)</p>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <div className="min-w-full">
            <table className="epic-lab-table w-full">
              <thead>
                <tr>
                  <th className="text-white text-left sticky left-0 bg-blue-900/50 z-10">Test Name</th>
                  <th className="text-white text-center">Reference Range</th>
                  <th className="text-white text-center">Status</th>
                  <th className="text-white text-center">Trend</th>
                  {dates.map((date) => (
                    <th key={date} className="text-white text-center min-w-[120px]">
                      {new Date(date).toLocaleDateString()}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Object.entries(currentData).map(([testName, testData]) => {
                  const test = testData as LabTest;
                  return (
                    <tr key={testName} className="border-b border-white/10 hover:bg-white/5">
                      <td className="text-white font-medium py-3 sticky left-0 bg-blue-900/30 z-10">
                        {testName}
                        <div className="text-xs text-white/60">{test.unit}</div>
                      </td>
                      <td className="text-white/70 text-center py-3">{test.reference}</td>
                      <td className="text-center py-3">
                        <Badge className={getStatusBadgeColor(test.status)}>
                          {test.status.toUpperCase()}
                        </Badge>
                      </td>
                      <td className="text-center py-3">
                        {getTrend(test)}
                      </td>
                      {dates.map((date) => (
                        <td key={date} className={`text-center py-3 font-semibold ${getStatusColor(test.status)}`}>
                          {test.values[date] || '-'}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          {Object.keys(currentData).length === 0 && (
            <div className="text-center py-8 text-white/60">
              <TestTube className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No lab results available for this panel</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Summary Statistics */}
      <Card className="clinical-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-white text-sm">Lab Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-red-400">
                {Object.values(currentData).filter(test => (test as LabTest).status === 'critical').length}
              </p>
              <p className="text-white/70 text-xs">Critical</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-orange-400">
                {Object.values(currentData).filter(test => (test as LabTest).status === 'high').length}
              </p>
              <p className="text-white/70 text-xs">High</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-400">
                {Object.values(currentData).filter(test => (test as LabTest).status === 'low').length}
              </p>
              <p className="text-white/70 text-xs">Low</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-400">
                {Object.values(currentData).filter(test => (test as LabTest).status === 'normal').length}
              </p>
              <p className="text-white/70 text-xs">Normal</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EpicLabResultsVertical;