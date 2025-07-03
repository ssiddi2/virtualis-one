import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  AlertTriangle,
  TestTube,
  Calendar
} from 'lucide-react';

interface LabValue {
  value: number;
  unit: string;
  timestamp: string;
  status: 'normal' | 'high' | 'low' | 'critical';
  referenceRange: string;
}

interface LabTest {
  name: string;
  code: string;
  values: LabValue[];
}

const EpicLabResultsTable = ({ patientId }: { patientId?: string }) => {
  const [selectedTimeFrame, setSelectedTimeFrame] = useState('7d');

  // Comprehensive lab data organized by panels
  const mockLabData: LabTest[] = [
    // CBC with Differential
    {
      name: 'WBC',
      code: 'WBC',
      values: [
        { value: 8.2, unit: 'K/μL', timestamp: '2024-01-15T08:00:00Z', status: 'normal', referenceRange: '4.5-11.0' },
        { value: 12.5, unit: 'K/μL', timestamp: '2024-01-14T08:00:00Z', status: 'high', referenceRange: '4.5-11.0' },
        { value: 15.8, unit: 'K/μL', timestamp: '2024-01-13T08:00:00Z', status: 'critical', referenceRange: '4.5-11.0' },
        { value: 18.2, unit: 'K/μL', timestamp: '2024-01-12T08:00:00Z', status: 'critical', referenceRange: '4.5-11.0' },
      ]
    },
    {
      name: 'RBC',
      code: 'RBC',
      values: [
        { value: 4.5, unit: 'M/μL', timestamp: '2024-01-15T08:00:00Z', status: 'normal', referenceRange: '4.2-5.4' },
        { value: 3.8, unit: 'M/μL', timestamp: '2024-01-14T08:00:00Z', status: 'low', referenceRange: '4.2-5.4' },
        { value: 3.2, unit: 'M/μL', timestamp: '2024-01-13T08:00:00Z', status: 'low', referenceRange: '4.2-5.4' },
        { value: 3.0, unit: 'M/μL', timestamp: '2024-01-12T08:00:00Z', status: 'low', referenceRange: '4.2-5.4' },
      ]
    },
    {
      name: 'Hemoglobin',
      code: 'HGB',
      values: [
        { value: 12.8, unit: 'g/dL', timestamp: '2024-01-15T08:00:00Z', status: 'normal', referenceRange: '12.0-16.0' },
        { value: 11.2, unit: 'g/dL', timestamp: '2024-01-14T08:00:00Z', status: 'low', referenceRange: '12.0-16.0' },
        { value: 10.1, unit: 'g/dL', timestamp: '2024-01-13T08:00:00Z', status: 'low', referenceRange: '12.0-16.0' },
        { value: 9.8, unit: 'g/dL', timestamp: '2024-01-12T08:00:00Z', status: 'low', referenceRange: '12.0-16.0' },
      ]
    },
    {
      name: 'Hematocrit',
      code: 'HCT',
      values: [
        { value: 38.5, unit: '%', timestamp: '2024-01-15T08:00:00Z', status: 'normal', referenceRange: '36-46' },
        { value: 33.2, unit: '%', timestamp: '2024-01-14T08:00:00Z', status: 'low', referenceRange: '36-46' },
        { value: 30.1, unit: '%', timestamp: '2024-01-13T08:00:00Z', status: 'low', referenceRange: '36-46' },
        { value: 29.8, unit: '%', timestamp: '2024-01-12T08:00:00Z', status: 'low', referenceRange: '36-46' },
      ]
    },
    {
      name: 'Platelets',
      code: 'PLT',
      values: [
        { value: 245, unit: 'K/μL', timestamp: '2024-01-15T08:00:00Z', status: 'normal', referenceRange: '150-450' },
        { value: 289, unit: 'K/μL', timestamp: '2024-01-14T08:00:00Z', status: 'normal', referenceRange: '150-450' },
        { value: 312, unit: 'K/μL', timestamp: '2024-01-13T08:00:00Z', status: 'normal', referenceRange: '150-450' },
        { value: 298, unit: 'K/μL', timestamp: '2024-01-12T08:00:00Z', status: 'normal', referenceRange: '150-450' },
      ]
    },
    {
      name: 'Neutrophils',
      code: 'NEUT',
      values: [
        { value: 65, unit: '%', timestamp: '2024-01-15T08:00:00Z', status: 'normal', referenceRange: '50-70' },
        { value: 82, unit: '%', timestamp: '2024-01-14T08:00:00Z', status: 'high', referenceRange: '50-70' },
        { value: 88, unit: '%', timestamp: '2024-01-13T08:00:00Z', status: 'high', referenceRange: '50-70' },
        { value: 90, unit: '%', timestamp: '2024-01-12T08:00:00Z', status: 'high', referenceRange: '50-70' },
      ]
    },
    
    // Basic Metabolic Panel (BMP)
    {
      name: 'Sodium',
      code: 'NA',
      values: [
        { value: 138, unit: 'mmol/L', timestamp: '2024-01-15T08:00:00Z', status: 'normal', referenceRange: '136-145' },
        { value: 142, unit: 'mmol/L', timestamp: '2024-01-14T08:00:00Z', status: 'normal', referenceRange: '136-145' },
        { value: 140, unit: 'mmol/L', timestamp: '2024-01-13T08:00:00Z', status: 'normal', referenceRange: '136-145' },
        { value: 139, unit: 'mmol/L', timestamp: '2024-01-12T08:00:00Z', status: 'normal', referenceRange: '136-145' },
      ]
    },
    {
      name: 'Potassium',
      code: 'K',
      values: [
        { value: 4.2, unit: 'mmol/L', timestamp: '2024-01-15T08:00:00Z', status: 'normal', referenceRange: '3.5-5.1' },
        { value: 2.8, unit: 'mmol/L', timestamp: '2024-01-14T08:00:00Z', status: 'critical', referenceRange: '3.5-5.1' },
        { value: 3.1, unit: 'mmol/L', timestamp: '2024-01-13T08:00:00Z', status: 'low', referenceRange: '3.5-5.1' },
        { value: 2.9, unit: 'mmol/L', timestamp: '2024-01-12T08:00:00Z', status: 'low', referenceRange: '3.5-5.1' },
      ]
    },
    {
      name: 'Chloride',
      code: 'CL',
      values: [
        { value: 102, unit: 'mmol/L', timestamp: '2024-01-15T08:00:00Z', status: 'normal', referenceRange: '98-107' },
        { value: 105, unit: 'mmol/L', timestamp: '2024-01-14T08:00:00Z', status: 'normal', referenceRange: '98-107' },
        { value: 103, unit: 'mmol/L', timestamp: '2024-01-13T08:00:00Z', status: 'normal', referenceRange: '98-107' },
        { value: 104, unit: 'mmol/L', timestamp: '2024-01-12T08:00:00Z', status: 'normal', referenceRange: '98-107' },
      ]
    },
    {
      name: 'CO2',
      code: 'CO2',
      values: [
        { value: 24, unit: 'mmol/L', timestamp: '2024-01-15T08:00:00Z', status: 'normal', referenceRange: '22-28' },
        { value: 20, unit: 'mmol/L', timestamp: '2024-01-14T08:00:00Z', status: 'low', referenceRange: '22-28' },
        { value: 19, unit: 'mmol/L', timestamp: '2024-01-13T08:00:00Z', status: 'low', referenceRange: '22-28' },
        { value: 18, unit: 'mmol/L', timestamp: '2024-01-12T08:00:00Z', status: 'low', referenceRange: '22-28' },
      ]
    },
    {
      name: 'BUN',
      code: 'BUN',
      values: [
        { value: 18, unit: 'mg/dL', timestamp: '2024-01-15T08:00:00Z', status: 'normal', referenceRange: '7-20' },
        { value: 24, unit: 'mg/dL', timestamp: '2024-01-14T08:00:00Z', status: 'high', referenceRange: '7-20' },
        { value: 28, unit: 'mg/dL', timestamp: '2024-01-13T08:00:00Z', status: 'high', referenceRange: '7-20' },
        { value: 32, unit: 'mg/dL', timestamp: '2024-01-12T08:00:00Z', status: 'high', referenceRange: '7-20' },
      ]
    },
    {
      name: 'Creatinine',
      code: 'CREAT',
      values: [
        { value: 1.1, unit: 'mg/dL', timestamp: '2024-01-15T08:00:00Z', status: 'normal', referenceRange: '0.7-1.3' },
        { value: 1.4, unit: 'mg/dL', timestamp: '2024-01-14T08:00:00Z', status: 'high', referenceRange: '0.7-1.3' },
        { value: 1.6, unit: 'mg/dL', timestamp: '2024-01-13T08:00:00Z', status: 'high', referenceRange: '0.7-1.3' },
        { value: 1.8, unit: 'mg/dL', timestamp: '2024-01-12T08:00:00Z', status: 'high', referenceRange: '0.7-1.3' },
      ]
    },
    {
      name: 'Glucose',
      code: 'GLU',
      values: [
        { value: 95, unit: 'mg/dL', timestamp: '2024-01-15T08:00:00Z', status: 'normal', referenceRange: '70-99' },
        { value: 135, unit: 'mg/dL', timestamp: '2024-01-14T08:00:00Z', status: 'high', referenceRange: '70-99' },
        { value: 142, unit: 'mg/dL', timestamp: '2024-01-13T08:00:00Z', status: 'high', referenceRange: '70-99' },
        { value: 128, unit: 'mg/dL', timestamp: '2024-01-12T08:00:00Z', status: 'high', referenceRange: '70-99' },
      ]
    },
    
    // Comprehensive Metabolic Panel (CMP) additions
    {
      name: 'Total Protein',
      code: 'TP',
      values: [
        { value: 7.2, unit: 'g/dL', timestamp: '2024-01-15T08:00:00Z', status: 'normal', referenceRange: '6.0-8.3' },
        { value: 6.8, unit: 'g/dL', timestamp: '2024-01-14T08:00:00Z', status: 'normal', referenceRange: '6.0-8.3' },
        { value: 6.5, unit: 'g/dL', timestamp: '2024-01-13T08:00:00Z', status: 'normal', referenceRange: '6.0-8.3' },
        { value: 6.2, unit: 'g/dL', timestamp: '2024-01-12T08:00:00Z', status: 'normal', referenceRange: '6.0-8.3' },
      ]
    },
    {
      name: 'Albumin',
      code: 'ALB',
      values: [
        { value: 4.1, unit: 'g/dL', timestamp: '2024-01-15T08:00:00Z', status: 'normal', referenceRange: '3.5-5.0' },
        { value: 3.2, unit: 'g/dL', timestamp: '2024-01-14T08:00:00Z', status: 'low', referenceRange: '3.5-5.0' },
        { value: 3.0, unit: 'g/dL', timestamp: '2024-01-13T08:00:00Z', status: 'low', referenceRange: '3.5-5.0' },
        { value: 2.8, unit: 'g/dL', timestamp: '2024-01-12T08:00:00Z', status: 'low', referenceRange: '3.5-5.0' },
      ]
    },
    {
      name: 'Total Bilirubin',
      code: 'TBIL',
      values: [
        { value: 0.8, unit: 'mg/dL', timestamp: '2024-01-15T08:00:00Z', status: 'normal', referenceRange: '0.3-1.2' },
        { value: 2.1, unit: 'mg/dL', timestamp: '2024-01-14T08:00:00Z', status: 'high', referenceRange: '0.3-1.2' },
        { value: 2.8, unit: 'mg/dL', timestamp: '2024-01-13T08:00:00Z', status: 'high', referenceRange: '0.3-1.2' },
        { value: 3.2, unit: 'mg/dL', timestamp: '2024-01-12T08:00:00Z', status: 'high', referenceRange: '0.3-1.2' },
      ]
    },
    {
      name: 'ALT',
      code: 'ALT',
      values: [
        { value: 28, unit: 'U/L', timestamp: '2024-01-15T08:00:00Z', status: 'normal', referenceRange: '7-35' },
        { value: 85, unit: 'U/L', timestamp: '2024-01-14T08:00:00Z', status: 'high', referenceRange: '7-35' },
        { value: 112, unit: 'U/L', timestamp: '2024-01-13T08:00:00Z', status: 'high', referenceRange: '7-35' },
        { value: 128, unit: 'U/L', timestamp: '2024-01-12T08:00:00Z', status: 'high', referenceRange: '7-35' },
      ]
    },
    {
      name: 'AST',
      code: 'AST',
      values: [
        { value: 32, unit: 'U/L', timestamp: '2024-01-15T08:00:00Z', status: 'normal', referenceRange: '8-40' },
        { value: 92, unit: 'U/L', timestamp: '2024-01-14T08:00:00Z', status: 'high', referenceRange: '8-40' },
        { value: 118, unit: 'U/L', timestamp: '2024-01-13T08:00:00Z', status: 'high', referenceRange: '8-40' },
        { value: 135, unit: 'U/L', timestamp: '2024-01-12T08:00:00Z', status: 'high', referenceRange: '8-40' },
      ]
    },
    
    // Additional important labs
    {
      name: 'Magnesium',
      code: 'MG',
      values: [
        { value: 2.1, unit: 'mg/dL', timestamp: '2024-01-15T08:00:00Z', status: 'normal', referenceRange: '1.7-2.2' },
        { value: 1.4, unit: 'mg/dL', timestamp: '2024-01-14T08:00:00Z', status: 'low', referenceRange: '1.7-2.2' },
        { value: 1.2, unit: 'mg/dL', timestamp: '2024-01-13T08:00:00Z', status: 'low', referenceRange: '1.7-2.2' },
        { value: 1.1, unit: 'mg/dL', timestamp: '2024-01-12T08:00:00Z', status: 'low', referenceRange: '1.7-2.2' },
      ]
    },
    {
      name: 'Phosphorus',
      code: 'PHOS',
      values: [
        { value: 3.8, unit: 'mg/dL', timestamp: '2024-01-15T08:00:00Z', status: 'normal', referenceRange: '2.5-4.5' },
        { value: 2.1, unit: 'mg/dL', timestamp: '2024-01-14T08:00:00Z', status: 'low', referenceRange: '2.5-4.5' },
        { value: 1.9, unit: 'mg/dL', timestamp: '2024-01-13T08:00:00Z', status: 'low', referenceRange: '2.5-4.5' },
        { value: 1.8, unit: 'mg/dL', timestamp: '2024-01-12T08:00:00Z', status: 'low', referenceRange: '2.5-4.5' },
      ]
    },
    
    // Cardiac markers
    {
      name: 'Troponin I',
      code: 'TROP-I',
      values: [
        { value: 0.02, unit: 'ng/mL', timestamp: '2024-01-15T08:00:00Z', status: 'normal', referenceRange: '<0.04' },
        { value: 0.8, unit: 'ng/mL', timestamp: '2024-01-14T08:00:00Z', status: 'critical', referenceRange: '<0.04' },
        { value: 1.2, unit: 'ng/mL', timestamp: '2024-01-13T08:00:00Z', status: 'critical', referenceRange: '<0.04' },
        { value: 1.8, unit: 'ng/mL', timestamp: '2024-01-12T08:00:00Z', status: 'critical', referenceRange: '<0.04' },
      ]
    },
    {
      name: 'Troponin T',
      code: 'TROP-T',
      values: [
        { value: 0.01, unit: 'ng/mL', timestamp: '2024-01-15T08:00:00Z', status: 'normal', referenceRange: '<0.01' },
        { value: 0.15, unit: 'ng/mL', timestamp: '2024-01-14T08:00:00Z', status: 'critical', referenceRange: '<0.01' },
        { value: 0.22, unit: 'ng/mL', timestamp: '2024-01-13T08:00:00Z', status: 'critical', referenceRange: '<0.01' },
        { value: 0.28, unit: 'ng/mL', timestamp: '2024-01-12T08:00:00Z', status: 'critical', referenceRange: '<0.01' },
      ]
    },
    
    // Coagulation studies
    {
      name: 'PT',
      code: 'PT',
      values: [
        { value: 12.5, unit: 'sec', timestamp: '2024-01-15T08:00:00Z', status: 'normal', referenceRange: '11-13' },
        { value: 18.2, unit: 'sec', timestamp: '2024-01-14T08:00:00Z', status: 'high', referenceRange: '11-13' },
        { value: 22.1, unit: 'sec', timestamp: '2024-01-13T08:00:00Z', status: 'high', referenceRange: '11-13' },
        { value: 25.8, unit: 'sec', timestamp: '2024-01-12T08:00:00Z', status: 'high', referenceRange: '11-13' },
      ]
    },
    {
      name: 'INR',
      code: 'INR',
      values: [
        { value: 1.1, unit: '', timestamp: '2024-01-15T08:00:00Z', status: 'normal', referenceRange: '0.8-1.1' },
        { value: 1.8, unit: '', timestamp: '2024-01-14T08:00:00Z', status: 'high', referenceRange: '0.8-1.1' },
        { value: 2.2, unit: '', timestamp: '2024-01-13T08:00:00Z', status: 'high', referenceRange: '0.8-1.1' },
        { value: 2.6, unit: '', timestamp: '2024-01-12T08:00:00Z', status: 'high', referenceRange: '0.8-1.1' },
      ]
    },
    {
      name: 'PTT',
      code: 'PTT',
      values: [
        { value: 28, unit: 'sec', timestamp: '2024-01-15T08:00:00Z', status: 'normal', referenceRange: '25-35' },
        { value: 42, unit: 'sec', timestamp: '2024-01-14T08:00:00Z', status: 'high', referenceRange: '25-35' },
        { value: 48, unit: 'sec', timestamp: '2024-01-13T08:00:00Z', status: 'high', referenceRange: '25-35' },
        { value: 52, unit: 'sec', timestamp: '2024-01-12T08:00:00Z', status: 'high', referenceRange: '25-35' },
      ]
    },
  ];

  const getValueColor = (status: string) => {
    switch (status) {
      case 'critical': return 'lab-value-critical';
      case 'high': return 'lab-value-high';
      case 'low': return 'lab-value-low';
      default: return 'lab-value-normal';
    }
  };

  const getTrendIcon = (values: LabValue[]) => {
    if (values.length < 2) return <Minus className="h-3 w-3 text-white/40" />;
    const latest = values[0].value;
    const previous = values[1].value;
    
    if (latest > previous) return <TrendingUp className="h-3 w-3 text-red-400" />;
    if (latest < previous) return <TrendingDown className="h-3 w-3 text-blue-400" />;
    return <Minus className="h-3 w-3 text-white/40" />;
  };

  const uniqueDates = Array.from(
    new Set(mockLabData.flatMap(test => test.values.map(v => v.timestamp)))
  ).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  return (
    <Card className="clinical-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <TestTube className="h-5 w-5" />
            Laboratory Results - Epic Style
          </CardTitle>
          <div className="flex gap-2">
            <Button 
              size="sm"
              onClick={() => setSelectedTimeFrame('7d')}
              className={`quick-action-btn ${selectedTimeFrame === '7d' ? 'quick-action-primary' : 'quick-action-secondary'}`}
            >
              7 Days
            </Button>
            <Button 
              size="sm"
              onClick={() => setSelectedTimeFrame('30d')}
              className={`quick-action-btn ${selectedTimeFrame === '30d' ? 'quick-action-primary' : 'quick-action-secondary'}`}
            >
              30 Days
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Critical Values Alert */}
        <div className="mb-4 p-3 bg-red-900/20 border border-red-400/30 rounded-lg">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-red-400" />
            <span className="text-red-200 font-semibold">Critical Values:</span>
            <span className="text-red-200">
              K: 2.8 mmol/L (Critical Low), WBC: 15.8 K/μL (Critical High)
            </span>
          </div>
        </div>

        {/* Date Headers */}
        <div className="mb-4 flex items-center gap-4 text-white/70">
          <Calendar className="h-4 w-4" />
          <span className="text-sm">Latest results from {new Date(uniqueDates[0]).toLocaleDateString()}</span>
        </div>

        {/* Epic-Style Lab Table */}
        <div className="overflow-x-auto">
          <table className="epic-lab-table">
            <thead>
              <tr>
                <th className="text-left">Test</th>
                <th className="text-left">Reference Range</th>
                <th className="text-center">Trend</th>
                {uniqueDates.map(date => (
                  <th key={date} className="text-center min-w-[120px]">
                    {new Date(date).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit'
                    })}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {mockLabData.map((test) => (
                <tr key={test.code}>
                  <td>
                    <div>
                      <span className="font-medium text-white">{test.name}</span>
                      <span className="text-white/60 text-xs ml-2">({test.code})</span>
                    </div>
                  </td>
                  <td className="text-white/80 text-sm">
                    {test.values[0]?.referenceRange} {test.values[0]?.unit}
                  </td>
                  <td className="text-center">
                    {getTrendIcon(test.values)}
                  </td>
                  {uniqueDates.map(date => {
                    const value = test.values.find(v => v.timestamp === date);
                    return (
                      <td key={date} className="text-center">
                        {value ? (
                          <div className="flex flex-col items-center">
                            <span className={`font-medium ${getValueColor(value.status)}`}>
                              {value.value}
                            </span>
                            <span className="text-xs text-white/60">{value.unit}</span>
                            {value.status !== 'normal' && (
                              <Badge 
                                className={`text-xs mt-1 ${
                                  value.status === 'critical' ? 'bg-red-600' :
                                  value.status === 'high' ? 'bg-orange-600' :
                                  'bg-blue-600'
                                } text-white`}
                              >
                                {value.status.toUpperCase()}
                              </Badge>
                            )}
                          </div>
                        ) : (
                          <span className="text-white/40">-</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Lab Interpretation Notes */}
        <div className="mt-6 space-y-3">
          <h4 className="text-white font-medium">Clinical Interpretation:</h4>
          <div className="space-y-2 text-sm">
            <div className="p-3 bg-white/5 rounded border border-white/20">
              <p className="text-white/90">
                <span className="font-medium text-red-300">Electrolyte Imbalance:</span> Critical hypokalemia (K: 2.8) requires immediate attention. Consider cardiac monitoring and potassium replacement.
              </p>
            </div>
            <div className="p-3 bg-white/5 rounded border border-white/20">
              <p className="text-white/90">
                <span className="font-medium text-orange-300">Leukocytosis:</span> Elevated WBC trend suggests possible infection or inflammatory process. Monitor for clinical signs.
              </p>
            </div>
            <div className="p-3 bg-white/5 rounded border border-white/20">
              <p className="text-white/90">
                <span className="font-medium text-blue-300">Renal Function:</span> Rising BUN/Creatinine indicates declining kidney function. Consider nephrology consultation.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EpicLabResultsTable;