
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Clock, User, AlertCircle, Brain, Stethoscope, Activity } from "lucide-react";
import { useAIAssistant } from "@/hooks/useAIAssistant";
import { toast } from "sonner";

interface Patient {
  id: string;
  name: string;
  age: number;
  room: string;
  complaint: string;
  status: 'waiting' | 'in-progress' | 'discharge-ready';
  provider: string;
  admitTime: string;
  acuity: 'low' | 'medium' | 'high';
  vitals?: {
    bp: string;
    hr: number;
    temp: number;
    o2sat: number;
  };
}

const ERPatientTracker = () => {
  const navigate = useNavigate();
  const { callAI, isLoading } = useAIAssistant();
  const [patients, setPatients] = useState<Patient[]>([]);

  useEffect(() => {
    // Mock patient data with vitals
    setPatients([
      {
        id: "1",
        name: "Sarah Johnson",
        age: 45,
        room: "ER-101",
        complaint: "Chest pain, shortness of breath",
        status: "in-progress",
        provider: "Dr. Smith",
        admitTime: "09:30 AM",
        acuity: "high",
        vitals: { bp: "160/95", hr: 102, temp: 99.2, o2sat: 94 }
      },
      {
        id: "2", 
        name: "Michael Brown",
        age: 32,
        room: "ER-102",
        complaint: "Ankle injury from sports",
        status: "waiting",
        provider: "Dr. Johnson",
        admitTime: "10:15 AM",
        acuity: "low",
        vitals: { bp: "120/80", hr: 75, temp: 98.6, o2sat: 99 }
      },
      {
        id: "3",
        name: "Emily Davis",
        age: 28,
        room: "ER-103",
        complaint: "Severe headache, photophobia",
        status: "discharge-ready",
        provider: "Dr. Smith",
        admitTime: "08:45 AM",
        acuity: "medium",
        vitals: { bp: "135/85", hr: 88, temp: 100.1, o2sat: 98 }
      },
      {
        id: "4",
        name: "Robert Wilson",
        age: 67,
        room: "ER-104",
        complaint: "Shortness of breath, chest tightness",
        status: "in-progress",
        provider: "Dr. Johnson",
        admitTime: "11:00 AM",
        acuity: "high",
        vitals: { bp: "180/100", hr: 110, temp: 98.8, o2sat: 91 }
      },
      {
        id: "5",
        name: "Lisa Garcia",
        age: 34,
        room: "Triage",
        complaint: "Abdominal pain, nausea",
        status: "waiting",
        provider: "Unassigned",
        admitTime: "11:30 AM",
        acuity: "medium",
        vitals: { bp: "125/82", hr: 92, temp: 99.8, o2sat: 97 }
      }
    ]);
  }, []);

  const getAITriageAssessment = async (patient: Patient) => {
    try {
      const patientData = `
        Patient: ${patient.name}, Age: ${patient.age}
        Chief Complaint: ${patient.complaint}
        Vitals: BP ${patient.vitals?.bp}, HR ${patient.vitals?.hr}, Temp ${patient.vitals?.temp}°F, O2 Sat ${patient.vitals?.o2sat}%
        Current Acuity: ${patient.acuity}
      `;

      const result = await callAI({
        type: 'diagnosis_support',
        data: { symptoms: patientData },
        context: 'Emergency Room triage assessment'
      });

      toast.success(`AI triage assessment generated for ${patient.name}`);
      
      // Show AI assessment in a dialog or update patient data
      console.log('AI Triage Assessment:', result);
    } catch (error) {
      console.error('AI triage error:', error);
      toast.error('Failed to generate AI triage assessment');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'waiting':
        return 'bg-blue-100 text-blue-800';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'discharge-ready':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getAcuityColor = (acuity: string) => {
    switch (acuity) {
      case 'high':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low':
        return 'text-green-600 bg-green-50 border-green-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getVitalAlert = (vitals: Patient['vitals']) => {
    if (!vitals) return null;
    
    const alerts = [];
    if (vitals.o2sat < 95) alerts.push('Low O2');
    if (vitals.hr > 100) alerts.push('Tachycardia');
    if (vitals.temp > 100.4) alerts.push('Fever');
    if (parseInt(vitals.bp.split('/')[0]) > 140) alerts.push('Hypertension');
    
    return alerts.length > 0 ? alerts.join(', ') : null;
  };

  const groupedPatients = {
    waiting: patients.filter(p => p.status === 'waiting'),
    'in-progress': patients.filter(p => p.status === 'in-progress'),
    'discharge-ready': patients.filter(p => p.status === 'discharge-ready')
  };

  return (
    <div className="min-h-screen bg-[#0a1628] p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Emergency Department Patient Tracker
        </h1>
        <p className="text-white/70">
          Real-time patient tracking with AI-powered triage assistance
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="bg-[#1a2332] border-[#2a3441] text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
            <User className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{patients.length}</div>
            <p className="text-xs text-white/60">Currently in ED</p>
          </CardContent>
        </Card>
        
        <Card className="bg-[#1a2332] border-[#2a3441] text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Acuity</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-400">
              {patients.filter(p => p.acuity === 'high').length}
            </div>
            <p className="text-xs text-white/60">Critical patients</p>
          </CardContent>
        </Card>

        <Card className="bg-[#1a2332] border-[#2a3441] text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Waiting</CardTitle>
            <Clock className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-400">
              {groupedPatients.waiting.length}
            </div>
            <p className="text-xs text-white/60">In queue</p>
          </CardContent>
        </Card>

        <Card className="bg-[#1a2332] border-[#2a3441] text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ready to Discharge</CardTitle>
            <Activity className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">
              {groupedPatients['discharge-ready'].length}
            </div>
            <p className="text-xs text-white/60">Can be discharged</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-[#1a2332] border-[#2a3441]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Stethoscope className="h-5 w-5" />
            AI-Enhanced Patient Tracker Board
          </CardTitle>
          <CardDescription className="text-white/70">
            Real-time patient status with AI-powered triage assistance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Waiting Column */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-blue-400">Waiting ({groupedPatients.waiting.length})</h3>
              </div>
              <div className="space-y-3">
                {groupedPatients.waiting.map((patient) => (
                  <Card 
                    key={patient.id} 
                    className="p-4 bg-[#0f1922] border-[#2a3441] hover:border-[#3a4451] transition-all cursor-pointer"
                    onClick={() => navigate(`/patient/${patient.id}`)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-medium text-white">{patient.name}</h4>
                        <p className="text-sm text-white/60">Age {patient.age} • {patient.room}</p>
                      </div>
                      <Badge className={`${getAcuityColor(patient.acuity)} text-xs border`}>
                        {patient.acuity.toUpperCase()}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-white/80 mb-3">{patient.complaint}</p>
                    
                    {patient.vitals && (
                      <div className="bg-[#0a1628] p-2 rounded text-xs text-white/70 mb-3">
                        <div className="grid grid-cols-2 gap-1">
                          <span>BP: {patient.vitals.bp}</span>
                          <span>HR: {patient.vitals.hr}</span>
                          <span>Temp: {patient.vitals.temp}°F</span>
                          <span>O2: {patient.vitals.o2sat}%</span>
                        </div>
                        {getVitalAlert(patient.vitals) && (
                          <div className="text-red-400 mt-1 font-medium">
                            ⚠️ {getVitalAlert(patient.vitals)}
                          </div>
                        )}
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-xs text-white/50">
                        <Clock className="h-3 w-3" />
                        {patient.admitTime}
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          getAITriageAssessment(patient);
                        }}
                        disabled={isLoading}
                        className="bg-blue-600/20 border-blue-400 text-blue-400 hover:bg-blue-600/30"
                      >
                        <Brain className="h-3 w-3 mr-1" />
                        AI Triage
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* In Progress Column */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-yellow-400">In Progress ({groupedPatients['in-progress'].length})</h3>
              </div>
              <div className="space-y-3">
                {groupedPatients['in-progress'].map((patient) => (
                  <Card 
                    key={patient.id} 
                    className="p-4 bg-[#0f1922] border-[#2a3441] hover:border-[#3a4451] transition-all cursor-pointer"
                    onClick={() => navigate(`/patient/${patient.id}`)}
                  >
                    {/* Similar structure as waiting column but with different styling */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-medium text-white">{patient.name}</h4>
                        <p className="text-sm text-white/60">Age {patient.age} • {patient.room}</p>
                      </div>
                      <Badge className={`${getAcuityColor(patient.acuity)} text-xs border`}>
                        {patient.acuity.toUpperCase()}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-white/80 mb-2">{patient.complaint}</p>
                    <p className="text-sm text-blue-400 mb-3">{patient.provider}</p>
                    
                    {patient.vitals && (
                      <div className="bg-[#0a1628] p-2 rounded text-xs text-white/70 mb-3">
                        <div className="grid grid-cols-2 gap-1">
                          <span>BP: {patient.vitals.bp}</span>
                          <span>HR: {patient.vitals.hr}</span>
                          <span>Temp: {patient.vitals.temp}°F</span>
                          <span>O2: {patient.vitals.o2sat}%</span>
                        </div>
                        {getVitalAlert(patient.vitals) && (
                          <div className="text-red-400 mt-1 font-medium">
                            ⚠️ {getVitalAlert(patient.vitals)}
                          </div>
                        )}
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-xs text-white/50">
                        <Clock className="h-3 w-3" />
                        {patient.admitTime}
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          getAITriageAssessment(patient);
                        }}
                        disabled={isLoading}
                        className="bg-blue-600/20 border-blue-400 text-blue-400 hover:bg-blue-600/30"
                      >
                        <Brain className="h-3 w-3 mr-1" />
                        AI Review
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Discharge Ready Column */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-green-400">Discharge Ready ({groupedPatients['discharge-ready'].length})</h3>
              </div>
              <div className="space-y-3">
                {groupedPatients['discharge-ready'].map((patient) => (
                  <Card 
                    key={patient.id} 
                    className="p-4 bg-[#0f1922] border-[#2a3441] hover:border-[#3a4451] transition-all cursor-pointer"
                    onClick={() => navigate(`/patient/${patient.id}`)}
                  >
                    {/* Similar structure with green accent */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="font-medium text-white">{patient.name}</h4>
                        <p className="text-sm text-white/60">Age {patient.age} • {patient.room}</p>
                      </div>
                      <Badge className="bg-green-100 text-green-800 text-xs">
                        READY
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-white/80 mb-2">{patient.complaint}</p>
                    <p className="text-sm text-blue-400 mb-3">{patient.provider}</p>
                    
                    <div className="flex items-center justify-between text-xs text-white/50">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {patient.admitTime}
                      </span>
                      <Badge className="bg-green-500 text-white">
                        Ready
                      </Badge>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ERPatientTracker;
