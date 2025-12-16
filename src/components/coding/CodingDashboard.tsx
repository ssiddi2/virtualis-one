import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/EnterpriseAuthContext';
import { Brain, Code, FileText, AlertTriangle, CheckCircle, TrendingUp, Clock, DollarSign } from 'lucide-react';

interface CodingRecord {
  id: string;
  patientName: string;
  mrn: string;
  admissionDate: string;
  dischargeDate: string;
  primaryDiagnosis: string;
  coder: string;
  status: 'pending' | 'in progress' | 'completed' | 'query';
  estimatedValue: number;
  codedValue: number | null;
  daysInCoding: number;
  flagged: boolean;
}

const mockCodingRecords: CodingRecord[] = [
  {
    id: '1',
    patientName: 'John Smith',
    mrn: '1234567',
    admissionDate: '2024-03-01',
    dischargeDate: '2024-03-05',
    primaryDiagnosis: 'Pneumonia',
    coder: 'Jane Doe',
    status: 'pending',
    estimatedValue: 5000,
    codedValue: null,
    daysInCoding: 2,
    flagged: false,
  },
  {
    id: '2',
    patientName: 'Alice Johnson',
    mrn: '7654321',
    admissionDate: '2024-03-02',
    dischargeDate: '2024-03-06',
    primaryDiagnosis: 'Heart Failure',
    coder: 'Bob Williams',
    status: 'in progress',
    estimatedValue: 7500,
    codedValue: 6800,
    daysInCoding: 3,
    flagged: true,
  },
  {
    id: '3',
    patientName: 'Robert Brown',
    mrn: '2345678',
    admissionDate: '2024-03-03',
    dischargeDate: '2024-03-07',
    primaryDiagnosis: 'Diabetes',
    coder: 'Jane Doe',
    status: 'completed',
    estimatedValue: 3000,
    codedValue: 3200,
    daysInCoding: 1,
    flagged: false,
  },
  {
    id: '4',
    patientName: 'Emily Davis',
    mrn: '8765432',
    admissionDate: '2024-03-04',
    dischargeDate: '2024-03-08',
    primaryDiagnosis: 'Hypertension',
    coder: 'Bob Williams',
    status: 'query',
    estimatedValue: 4000,
    codedValue: 3800,
    daysInCoding: 4,
    flagged: true,
  },
];

interface CodingDashboardProps {
  hospitalId: string;
}

const CodingDashboard = ({ hospitalId }: CodingDashboardProps) => {
  const { profile } = useAuth();
  const [selectedRecord, setSelectedRecord] = useState<CodingRecord | null>(null);
  const [showAISuggestions, setShowAISuggestions] = useState(true);

  const handleRecordSelect = (record: CodingRecord) => {
    setSelectedRecord(record);
  };

  const handleToggleAISuggestions = () => {
    setShowAISuggestions(!showAISuggestions);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-200 border-yellow-400/30';
      case 'in progress':
        return 'bg-blue-500/20 text-blue-200 border-blue-400/30';
      case 'completed':
        return 'bg-green-500/20 text-green-200 border-green-400/30';
      case 'query':
        return 'bg-red-500/20 text-red-200 border-red-400/30';
      default:
        return 'bg-gray-500/20 text-gray-200 border-gray-400/30';
    }
  };

  return (
    <div className="min-h-screen p-6" style={{
      background: 'linear-gradient(135deg, hsl(225, 70%, 25%) 0%, hsl(220, 65%, 35%) 25%, hsl(215, 60%, 45%) 50%, hsl(210, 55%, 55%) 75%, hsl(205, 50%, 65%) 100%)'
    }}>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Code className="h-12 w-12 text-purple-300 animate-pulse" />
            <div>
              <h1 className="text-4xl font-bold text-white">
                Medical Coding Dashboard
              </h1>
              <p className="text-white/80 text-lg">
                Streamline coding workflows with AI-powered assistance
              </p>
            </div>
          </div>
        </div>

        {/* Toggle AI Suggestions */}
        <div className="flex items-center justify-end">
          <Button
            variant="outline"
            className="bg-transparent border-purple-400/30 text-white hover:bg-purple-500/20"
            onClick={handleToggleAISuggestions}
          >
            <Brain className="h-4 w-4 mr-2" />
            {showAISuggestions ? 'Hide AI Suggestions' : 'Show AI Suggestions'}
          </Button>
        </div>

        {/* Coding Records */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {mockCodingRecords.map((record) => (
            <Card
              key={record.id}
              className="backdrop-blur-xl bg-blue-500/20 border border-blue-300/30 rounded-xl shadow-lg hover:scale-[1.02] transition-all cursor-pointer"
              onClick={() => handleRecordSelect(record)}
            >
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-white">
                  {record.patientName}
                  <Badge className={getStatusColor(record.status)}>
                    {record.status}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-white/70">MRN</p>
                    <p className="text-lg font-semibold text-white">{record.mrn}</p>
                  </div>
                  <div>
                    <p className="text-sm text-white/70">Coder</p>
                    <p className="text-lg font-semibold text-white">{record.coder}</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm text-white/70">
                  <div className="flex justify-between">
                    <span>Admission Date:</span>
                    <span className="text-white">{record.admissionDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Discharge Date:</span>
                    <span className="text-white">{record.dischargeDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Primary Diagnosis:</span>
                    <span className="text-white">{record.primaryDiagnosis}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Estimated Value:</span>
                    <span className="text-white">${record.estimatedValue}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Coded Value:</span>
                    <span className="text-white">{record.codedValue ? `$${record.codedValue}` : 'N/A'}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-yellow-300" />
                    <span className="text-sm text-white">Days in Coding: {record.daysInCoding}</span>
                  </div>
                  {record.flagged && (
                    <AlertTriangle className="h-6 w-6 text-red-400" />
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Selected Record Details */}
        {selectedRecord && (
          <Card className="backdrop-blur-xl bg-blue-500/20 border border-blue-300/30 rounded-xl shadow-lg">
            <CardHeader>
              <CardTitle className="text-white">
                Coding Record Details - {selectedRecord.patientName}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-white/70">MRN</p>
                  <p className="text-lg font-semibold text-white">{selectedRecord.mrn}</p>
                </div>
                <div>
                  <p className="text-sm text-white/70">Coder</p>
                  <p className="text-lg font-semibold text-white">{selectedRecord.coder}</p>
                </div>
              </div>
              <div className="space-y-2 text-sm text-white/70">
                <div className="flex justify-between">
                  <span>Admission Date:</span>
                  <span className="text-white">{selectedRecord.admissionDate}</span>
                </div>
                <div className="flex justify-between">
                  <span>Discharge Date:</span>
                  <span className="text-white">{selectedRecord.dischargeDate}</span>
                </div>
                <div className="flex justify-between">
                  <span>Primary Diagnosis:</span>
                  <span className="text-white">{selectedRecord.primaryDiagnosis}</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Value:</span>
                  <span className="text-white">${selectedRecord.estimatedValue}</span>
                </div>
                <div className="flex justify-between">
                  <span>Coded Value:</span>
                  <span className="text-white">{selectedRecord.codedValue ? `$${selectedRecord.codedValue}` : 'N/A'}</span>
                </div>
              </div>

              {/* AI Suggestions */}
              {showAISuggestions && (
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-white">
                    <Brain className="h-5 w-5 mr-2 inline-block" />
                    AI Coding Suggestions
                  </h3>
                  <div className="p-4 backdrop-blur-sm bg-blue-600/20 border border-blue-400/30 rounded-lg text-white/70">
                    Based on the patient's primary diagnosis of {selectedRecord.primaryDiagnosis}, consider the following codes:
                    <ul className="list-disc pl-5 mt-2">
                      <li>ICD-10: J12.9 - Pneumonia, unspecified organism</li>
                      <li>CPT: 99214 - Office or other outpatient visit</li>
                    </ul>
                    <p className="mt-2">
                      These suggestions are based on common coding practices and should be verified by a qualified coder.
                    </p>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end gap-2">
                <Button variant="outline" className="bg-transparent border-blue-400/30 text-white hover:bg-blue-500/20">
                  <FileText className="h-4 w-4 mr-2" />
                  View Chart
                </Button>
                <Button className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-semibold">
                  <DollarSign className="h-4 w-4 mr-2" />
                  Update Value
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CodingDashboard;
