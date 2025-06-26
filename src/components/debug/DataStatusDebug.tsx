
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { usePatients } from "@/hooks/usePatients";
import { useHospitals } from "@/hooks/useHospitals";
import { useAIAssistant } from "@/hooks/useAIAssistant";
import { useState } from "react";
import { CheckCircle, XCircle, AlertCircle, Database, Brain } from "lucide-react";

const DataStatusDebug = () => {
  const { data: hospitals, isLoading: hospitalsLoading, error: hospitalsError } = useHospitals();
  const { data: patients, isLoading: patientsLoading, error: patientsError } = usePatients();
  const { callAI, isLoading: aiLoading } = useAIAssistant();
  const [aiTestResult, setAiTestResult] = useState<string>('');
  const [aiTestError, setAiTestError] = useState<string>('');

  const testAI = async () => {
    try {
      setAiTestError('');
      setAiTestResult('Testing...');
      const result = await callAI({
        type: 'clinical_note',
        data: { summary: 'Patient presents with chest pain' },
        context: 'Test note generation'
      });
      setAiTestResult(result);
    } catch (error) {
      setAiTestError(error instanceof Error ? error.message : 'Unknown error');
      setAiTestResult('');
    }
  };

  const getStatusIcon = (loading: boolean, error: any, data: any) => {
    if (loading) return <AlertCircle className="h-5 w-5 text-yellow-500" />;
    if (error) return <XCircle className="h-5 w-5 text-red-500" />;
    if (data && data.length > 0) return <CheckCircle className="h-5 w-5 text-green-500" />;
    return <XCircle className="h-5 w-5 text-gray-500" />;
  };

  return (
    <div className="space-y-4">
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <Database className="h-5 w-5" />
            Data Status Check
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Hospitals Status */}
          <div className="flex items-center justify-between p-3 bg-white rounded border">
            <div>
              <h4 className="font-semibold">Hospitals Data</h4>
              <p className="text-sm text-gray-600">
                Loading: {hospitalsLoading ? 'Yes' : 'No'} | 
                Error: {hospitalsError ? 'Yes' : 'No'} | 
                Count: {hospitals?.length || 0}
              </p>
            </div>
            {getStatusIcon(hospitalsLoading, hospitalsError, hospitals)}
          </div>

          {/* Patients Status */}
          <div className="flex items-center justify-between p-3 bg-white rounded border">
            <div>
              <h4 className="font-semibold">Patients Data</h4>
              <p className="text-sm text-gray-600">
                Loading: {patientsLoading ? 'Yes' : 'No'} | 
                Error: {patientsError ? 'Yes' : 'No'} | 
                Count: {patients?.length || 0}
              </p>
            </div>
            {getStatusIcon(patientsLoading, patientsError, patients)}
          </div>

          {/* AI Assistant Status */}
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-white rounded border">
              <div>
                <h4 className="font-semibold flex items-center gap-2">
                  <Brain className="h-4 w-4" />
                  AI Assistant
                </h4>
                <p className="text-sm text-gray-600">
                  Status: {aiLoading ? 'Testing...' : 'Ready'}
                </p>
              </div>
              <Button onClick={testAI} disabled={aiLoading} size="sm">
                Test AI
              </Button>
            </div>
            
            {aiTestResult && (
              <div className="p-3 bg-green-50 border border-green-200 rounded">
                <p className="text-sm font-medium text-green-800">AI Test Result:</p>
                <p className="text-sm text-green-700 mt-1">{aiTestResult.substring(0, 200)}...</p>
              </div>
            )}
            
            {aiTestError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded">
                <p className="text-sm font-medium text-red-800">AI Test Error:</p>
                <p className="text-sm text-red-700 mt-1">{aiTestError}</p>
              </div>
            )}
          </div>

          {/* Quick Data Summary */}
          <div className="p-3 bg-gray-50 rounded">
            <h4 className="font-semibold mb-2">Quick Summary</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Total Hospitals:</span> {hospitals?.length || 0}
              </div>
              <div>
                <span className="font-medium">Total Patients:</span> {patients?.length || 0}
              </div>
              <div>
                <span className="font-medium">Active Patients:</span> {patients?.filter(p => p.status === 'active').length || 0}
              </div>
              <div>
                <span className="font-medium">Sample Hospital:</span> {hospitals?.[0]?.name || 'None'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DataStatusDebug;
