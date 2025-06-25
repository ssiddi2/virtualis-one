import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, User, Calendar, FileText, Pill, TestTube, ImageIcon, Plus } from "lucide-react";

const PatientChart = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock patient data fetch
    setTimeout(() => {
      setPatient({
        id,
        name: "Sarah Johnson",
        age: 45,
        gender: "Female",
        room: "101",
        complaint: "Chest pain",
        status: "in-progress",
        provider: "Dr. Smith",
        admitTime: "09:30 AM",
        acuity: "high",
        allergies: ["Penicillin", "Shellfish"],
        vitals: {
          temperature: "98.6°F",
          bloodPressure: "140/90",
          heartRate: "88 bpm",
          oxygenSat: "98%"
        }
      });
      setLoading(false);
    }, 1000);
  }, [id]);

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-2xl font-bold text-gray-900">Patient not found</h2>
        <Button onClick={() => navigate("/")} className="mt-4">
          Return to Dashboard
        </Button>
      </div>
    );
  }

  const getAcuityColor = (acuity: string) => {
    switch (acuity) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Button>
        
        <div className="flex-1">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold text-gray-900">{patient.name}</h1>
            <Badge className={getAcuityColor(patient.acuity)}>
              {patient.acuity.toUpperCase()} ACUITY
            </Badge>
          </div>
          <div className="flex items-center gap-6 text-sm text-gray-600 mt-2">
            <span>Age: {patient.age}</span>
            <span>Gender: {patient.gender}</span>
            <span>Room: {patient.room}</span>
            <span>Provider: {patient.provider}</span>
            <span>Admitted: {patient.admitTime}</span>
          </div>
        </div>
      </div>

      {/* Patient Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Chief Complaint</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold">{patient.complaint}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Temperature</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold">{patient.vitals.temperature}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Blood Pressure</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold">{patient.vitals.bloodPressure}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Heart Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-semibold">{patient.vitals.heartRate}</p>
          </CardContent>
        </Card>
      </div>

      {/* Chart Tabs */}
      <Tabs defaultValue="notes" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="notes" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Notes
          </TabsTrigger>
          <TabsTrigger value="orders" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Orders
          </TabsTrigger>
          <TabsTrigger value="results" className="flex items-center gap-2">
            <TestTube className="h-4 w-4" />
            Results
          </TabsTrigger>
          <TabsTrigger value="mar" className="flex items-center gap-2">
            <Pill className="h-4 w-4" />
            MAR
          </TabsTrigger>
          <TabsTrigger value="imaging" className="flex items-center gap-2">
            <ImageIcon className="h-4 w-4" />
            Imaging
          </TabsTrigger>
          <TabsTrigger value="charges" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Charges
          </TabsTrigger>
        </TabsList>

        <TabsContent value="notes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Clinical Notes</CardTitle>
              <CardDescription>Documentation and progress notes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">Initial Assessment</h4>
                    <span className="text-sm text-gray-500">Today, 09:45 AM</span>
                  </div>
                  <p className="text-sm text-gray-700">
                    45-year-old female presents with acute onset chest pain, described as sharp and radiating to left arm. 
                    No shortness of breath. Pain started 2 hours ago while at rest. No previous cardiac history.
                  </p>
                  <p className="text-xs text-gray-500 mt-2">Dr. Smith - Attending Physician</p>
                </div>
                
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <FileText className="h-4 w-4 mr-2" />
                  Add New Note
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Orders</CardTitle>
              <CardDescription>Laboratory, imaging, and medication orders</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">ECG - 12 Lead</h4>
                    <p className="text-sm text-gray-600">STAT</p>
                  </div>
                  <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">Troponin I</h4>
                    <p className="text-sm text-gray-600">Lab - STAT</p>
                  </div>
                  <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
                </div>
                
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  New Order
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="results" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Laboratory Results</CardTitle>
              <CardDescription>Recent lab values and reports</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">No results available yet. Orders are pending.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mar" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Medication Administration Record</CardTitle>
              <CardDescription>Scheduled and PRN medications</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">No medications ordered at this time.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="imaging" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Imaging Studies</CardTitle>
              <CardDescription>Radiology reports and images</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">No imaging studies available.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="charges" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Charge Capture</CardTitle>
              <CardDescription>CPT codes and billing information</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">No charges captured yet for this encounter.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PatientChart;
