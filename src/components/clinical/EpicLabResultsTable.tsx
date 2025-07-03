import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TestTube } from 'lucide-react';

const EpicLabResultsTable = ({ patientId }: { patientId?: string }) => {
  // Comprehensive lab panels with historical data
  const labPanels = {
    'CBC w/ Diff': [
      { testName: 'White Blood Cell Count', value: '12.5', unit: 'K/µL', reference: '4.0-11.0', status: 'high', date: '2024-01-15 08:30', history: ['8.2', '9.1', '12.5'] },
      { testName: 'Red Blood Cell Count', value: '4.2', unit: 'M/µL', reference: '4.2-5.4', status: 'normal', date: '2024-01-15 08:30', history: ['4.1', '4.3', '4.2'] },
      { testName: 'Hemoglobin', value: '11.2', unit: 'g/dL', reference: '12.0-16.0', status: 'low', date: '2024-01-15 08:30', history: ['12.1', '11.8', '11.2'] },
      { testName: 'Hematocrit', value: '33.5', unit: '%', reference: '36.0-48.0', status: 'low', date: '2024-01-15 08:30', history: ['36.2', '35.1', '33.5'] },
      { testName: 'Platelet Count', value: '285', unit: 'K/µL', reference: '150-450', status: 'normal', date: '2024-01-15 08:30', history: ['298', '291', '285'] }
    ],
    'Basic Metabolic Panel': [
      { testName: 'Glucose', value: '185', unit: 'mg/dL', reference: '70-99', status: 'critical', date: '2024-01-15 08:30', history: ['95', '142', '185'] },
      { testName: 'Sodium', value: '142', unit: 'mEq/L', reference: '136-145', status: 'normal', date: '2024-01-15 08:30', history: ['139', '141', '142'] },
      { testName: 'Potassium', value: '2.8', unit: 'mEq/L', reference: '3.5-5.0', status: 'critical', date: '2024-01-15 08:30', history: ['3.2', '2.9', '2.8'] },
      { testName: 'Chloride', value: '98', unit: 'mEq/L', reference: '98-107', status: 'normal', date: '2024-01-15 08:30', history: ['101', '99', '98'] },
      { testName: 'CO2', value: '22', unit: 'mEq/L', reference: '22-28', status: 'normal', date: '2024-01-15 08:30', history: ['24', '23', '22'] }
    ],
    'Comprehensive Metabolic Panel': [
      { testName: 'Creatinine', value: '1.8', unit: 'mg/dL', reference: '0.6-1.2', status: 'high', date: '2024-01-15 08:30', history: ['0.9', '1.2', '1.8'] },
      { testName: 'BUN', value: '28', unit: 'mg/dL', reference: '7-20', status: 'high', date: '2024-01-15 08:30', history: ['15', '22', '28'] },
      { testName: 'eGFR', value: '42', unit: 'mL/min/1.73m²', reference: '>60', status: 'low', date: '2024-01-15 08:30', history: ['85', '65', '42'] },
      { testName: 'Total Protein', value: '7.2', unit: 'g/dL', reference: '6.0-8.3', status: 'normal', date: '2024-01-15 08:30', history: ['6.8', '7.1', '7.2'] },
      { testName: 'Albumin', value: '3.1', unit: 'g/dL', reference: '3.5-5.0', status: 'low', date: '2024-01-15 08:30', history: ['3.8', '3.4', '3.1'] }
    ],
    'Cardiac Markers': [
      { testName: 'Troponin I', value: '0.08', unit: 'ng/mL', reference: '<0.04', status: 'high', date: '2024-01-15 08:30', history: ['0.02', '0.05', '0.08'] },
      { testName: 'CK-MB', value: '12.5', unit: 'ng/mL', reference: '0.0-6.3', status: 'high', date: '2024-01-15 08:30', history: ['3.2', '8.1', '12.5'] },
      { testName: 'BNP', value: '890', unit: 'pg/mL', reference: '<100', status: 'critical', date: '2024-01-15 08:30', history: ['245', '567', '890'] }
    ],
    'Coagulation': [
      { testName: 'PT', value: '15.2', unit: 'sec', reference: '11.0-13.0', status: 'high', date: '2024-01-15 08:30', history: ['12.1', '13.8', '15.2'] },
      { testName: 'INR', value: '1.8', unit: '', reference: '0.8-1.2', status: 'high', date: '2024-01-15 08:30', history: ['1.0', '1.4', '1.8'] },
      { testName: 'aPTT', value: '42', unit: 'sec', reference: '25-35', status: 'high', date: '2024-01-15 08:30', history: ['28', '36', '42'] }
    ]
  };

  const [activePanel, setActivePanel] = useState('CBC w/ Diff');
  const [showTrending, setShowTrending] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return 'text-red-500 font-bold';
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

  return (
    <div className="space-y-4">
      {/* Lab Panel Navigation */}
      <Card className="clinical-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-white flex items-center gap-2">
            <TestTube className="h-5 w-5" />
            Laboratory Results
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-4">
            {Object.keys(labPanels).map((panel) => (
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
            <Button
              onClick={() => setShowTrending(!showTrending)}
              className={`text-sm ml-auto ${
                showTrending 
                  ? 'bg-green-600 text-white' 
                  : 'bg-white/10 text-white/80 hover:bg-white/20'
              }`}
            >
              {showTrending ? 'Hide Trending' : 'Show Trending'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lab Results Table */}
      <Card className="clinical-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-white text-lg">{activePanel}</CardTitle>
        </CardHeader>
        <CardContent className="max-h-96 overflow-y-auto">
          <table className="epic-lab-table">
            <thead>
              <tr>
                <th className="text-white">Test</th>
                <th className="text-white">Current Value</th>
                <th className="text-white">Reference Range</th>
                <th className="text-white">Status</th>
                {showTrending && <th className="text-white">Trending (Last 3)</th>}
                <th className="text-white">Date/Time</th>
              </tr>
            </thead>
            <tbody>
              {labPanels[activePanel as keyof typeof labPanels]?.map((lab, index) => (
                <tr key={index}>
                  <td className="text-white font-medium">{lab.testName}</td>
                  <td className={`font-semibold ${getStatusColor(lab.status)}`}>
                    {lab.value} {lab.unit}
                  </td>
                  <td className="text-white/70">{lab.reference}</td>
                  <td>
                    <Badge className={getStatusBadgeColor(lab.status)}>
                      {lab.status.toUpperCase()}
                    </Badge>
                  </td>
                  {showTrending && (
                    <td className="text-white/80">
                      <div className="flex gap-1 text-xs">
                        {lab.history.map((val, i) => (
                          <span key={i} className={i === lab.history.length - 1 ? 'font-bold text-white' : 'text-white/60'}>
                            {val}{i < lab.history.length - 1 ? ' → ' : ''}
                          </span>
                        ))}
                      </div>
                    </td>
                  )}
                  <td className="text-white/70">{lab.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
};

export default EpicLabResultsTable;