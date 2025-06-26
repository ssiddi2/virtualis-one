import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Clock, User, AlertCircle, Brain, Stethoscope, Activity } from "lucide-react";
import { useAIAssistant } from "@/hooks/useAIAssistant";
import { usePatients } from "@/hooks/usePatients";
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

interface ERPatientTrackerProps {
  hospitalId?: string | null;
}

const ERPatientTracker = ({ hospitalId }: ERPatientTrackerProps) => {
  const navigate = useNavigate();
  const { callAI, isLoading } = useAIAssistant();
  const { data: realPatients } = usePatients(hospitalId || undefined);
  const [patients, setPatients] = useState<Patient[]>([]);

  useEffect(() => {
    if (!hospitalId) {
      setPatients([]);
      return;
    }

    // Convert real patient data to ER tracker format with realistic ER scenarios
    const convertToERPatients = (realPatients: any[]) => {
      return realPatients.map((patient, index) => {
        const age = new Date().getFullYear() - new Date(patient.date_of_birth).getFullYear();
        const complaints = {
          '11111111-1111-1111-1111-111111111111': [
            'Chest pain, shortness of breath',
            'Abdominal pain, nausea',
            'Difficulty breathing, fatigue',
            'Pregnancy complications, bleeding'
          ],
          '22222222-2222-2222-2222-222222222222': [
            'Acute stroke symptoms, confusion',
            'Joint pain, swelling',
            'Multiple trauma, consciousness',
            'Psychiatric emergency, agitation'
          ],
          '33333333-3333-3333-3333-333333333333': [
            'Severe abdominal pain, weight loss',
            'Eating disorder, malnutrition',
            'Neck mass, difficulty swallowing',
            'Severe burns, pain'
          ],
          '44444444-4444-4444-4444-444444444444': [
            'Chest pain, cardiac symptoms',
            'Fever, infection symptoms',
            'Psychiatric crisis, hallucinations',
            'Pregnancy, high blood pressure'
          ],
          '55555555-5555-5555-5555-555555555555': [
            'Chest pain, heart palpitations',
            'Shortness of breath, swelling',
            'Chest tightness, dizziness',
            'Heart failure symptoms, fatigue'
          ]
        };

        const statuses = ['waiting', 'in-progress', 'discharge-ready'] as const;
        const acuities = ['low', 'medium', 'high'] as const;
        const providers = ['Dr. Smith', 'Dr. Johnson', 'Dr. Williams', 'Dr. Brown'];
        
        const hospitalComplaints = complaints[hospitalId as keyof typeof complaints] || complaints['11111111-1111-1111-1111-111111111111'];
        
        return {
          id: patient.id,
          name: `${patient.first_name} ${patient.last_name}`,
          age,
          room: patient.room_number || `ER-${100 + index}`,
          complaint: hospitalComplaints[index % hospitalComplaints.length],
          status: statuses[index % statuses.length],
          provider: providers[index % providers.length],
          admitTime: new Date(patient.admission_date || new Date()).toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true 
          }),
          acuity: acuities[index % acuities.length],
          vitals: {
            bp: `${120 + (index * 10)}/${80 + (index * 5)}`,
            hr: 70 + (index * 8),
            temp: 98.6 + (index * 0.3),
            o2sat: 98 - (index * 2)
          }
        };
      });
    };

    if (realPatients && realPatients.length > 0) {
      const erPatients = convertToERPatients(realPatients);
      setPatients(erPatients);
    }
  }, [realPatients, hospitalId]);

  const getAITriageAssessment = async (patient: Patient) => {
    try {
      const patientData = `
        Patient: ${patient.name}, Age: ${patient.age}
        Chief Complaint: ${patient.complaint}
        Vitals: BP ${patient.vitals?.bp}, HR ${patient.vitals?.hr}, Temp ${patient.vitals?.temp}°F, O2 Sat ${patient.vitals?.o2sat}%
        Current Acuity: ${patient.acuity}
        Current Status: ${patient.status}
        Room: ${patient.room}
        Provider: ${patient.provider}
      `;

      console.log('Requesting AI clinical note for:', patient.name);

      const result = await callAI({
        type: 'clinical_note',
        data: { summary: patientData },
        context: 'Emergency Department triage assessment and clinical documentation'
      });

      console.log('AI clinical assessment received:', result);

      toast.success(`AI clinical assessment completed for ${patient.name}`);
      
      console.log('AI Clinical Assessment for', patient.name, ':', result);

    } catch (error) {
      console.error('AI triage error:', error);
      toast.error(`Failed to generate AI clinical assessment for ${patient.name}`);
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

  const mockHospitalNames = {
    '77777777-7777-7777-7777-777777777777': 'Atlantic Medical Center',
    '11111111-1111-1111-1111-111111111111': 'Metropolitan General Hospital',
    '22222222-2222-2222-2222-222222222222': 'Riverside Medical Center',
    '33333333-3333-3333-3333-333333333333': 'Sunset Community Hospital',
    '44444444-4444-4444-4444-444444444444': 'Bay Area Medical Complex',
    '55555555-5555-5555-5555-555555555555': 'Texas Heart Institute'
  };

  const hospitalName = hospitalId ? mockHospitalNames[hospitalId as keyof typeof mockHospitalNames] : 'All Hospitals';

  if (!hospitalId) {
    return (
      <div className="min-h-screen bg-[#0a1628] p-6 flex items-center justify-center">
        <Card className="bg-[#1a2332] border-[#2a3441] text-white">
          <CardContent className="p-8 text-center">
            <Stethoscope className="h-16 w-16 text-blue-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No Hospital Selected</h3>
            <p className="text-white/70 mb-4">
              Please select a hospital from the EMR Dashboard to view patient data.
            </p>
            <Button onClick={() => navigate('/emr')} className="bg-blue-600 hover:bg-blue-700">
              Go to EMR Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a1628] p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Emergency Department Patient Tracker
        </h1>
        <p className="text-white/70">
          {hospitalName} - Real-time patient tracking with AI-powered clinical assistance
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
            AI-Enhanced Patient Tracker Board - {hospitalName}
          </CardTitle>
          <CardDescription className="text-white/70">
            Real-time patient status with AI-powered clinical assistance ({patients.length} patients)
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
                        AI Clinical Note
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
                        AI Clinical Note
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
