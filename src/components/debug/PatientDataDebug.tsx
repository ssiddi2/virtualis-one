
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usePatients } from "@/hooks/usePatients";
import { useHospitals } from "@/hooks/useHospitals";
import { Button } from "@/components/ui/button";
import { RefreshCw, Database } from "lucide-react";

const PatientDataDebug = () => {
  const { data: allPatients, isLoading: patientsLoading, error: patientsError, refetch: refetchPatients } = usePatients();
  const { data: hospitals, isLoading: hospitalsLoading, error: hospitalsError, refetch: refetchHospitals } = useHospitals();

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Data Debug Panel
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Hospitals Debug */}
        <div className="border rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Hospitals Data</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetchHospitals()}
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
          </div>
          
          <div className="space-y-2 text-sm">
            <p><strong>Loading:</strong> {hospitalsLoading ? 'Yes' : 'No'}</p>
            <p><strong>Error:</strong> {hospitalsError ? hospitalsError.message : 'None'}</p>
            <p><strong>Count:</strong> {hospitals?.length || 0}</p>
            {hospitals && hospitals.length > 0 && (
              <div>
                <strong>Sample Hospital:</strong>
                <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto">
                  {JSON.stringify(hospitals[0], null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>

        {/* Patients Debug */}
        <div className="border rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Patients Data</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetchPatients()}
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
          </div>
          
          <div className="space-y-2 text-sm">
            <p><strong>Loading:</strong> {patientsLoading ? 'Yes' : 'No'}</p>
            <p><strong>Error:</strong> {patientsError ? patientsError.message : 'None'}</p>
            <p><strong>Count:</strong> {allPatients?.length || 0}</p>
            <p><strong>Active Patients:</strong> {allPatients?.filter(p => p.status === 'active').length || 0}</p>
            {allPatients && allPatients.length > 0 && (
              <div>
                <strong>Sample Patient:</strong>
                <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto">
                  {JSON.stringify(allPatients[0], null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>

        {/* Data Relationships */}
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4">Data Relationships</h3>
          <div className="space-y-2 text-sm">
            {hospitals?.map(hospital => (
              <div key={hospital.id} className="bg-gray-50 p-2 rounded">
                <strong>{hospital.name}:</strong> {allPatients?.filter(p => p.hospital_id === hospital.id).length || 0} patients
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PatientDataDebug;
