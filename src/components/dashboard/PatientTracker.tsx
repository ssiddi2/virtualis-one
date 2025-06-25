
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Clock, User, AlertCircle } from "lucide-react";

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
}

const PatientTracker = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState<Patient[]>([]);

  useEffect(() => {
    // Mock patient data
    setPatients([
      {
        id: "1",
        name: "Sarah Johnson",
        age: 45,
        room: "101",
        complaint: "Chest pain",
        status: "in-progress",
        provider: "Dr. Smith",
        admitTime: "09:30 AM",
        acuity: "high"
      },
      {
        id: "2", 
        name: "Michael Brown",
        age: 32,
        room: "102",
        complaint: "Ankle injury",
        status: "waiting",
        provider: "Dr. Johnson",
        admitTime: "10:15 AM",
        acuity: "low"
      },
      {
        id: "3",
        name: "Emily Davis",
        age: 28,
        room: "103",
        complaint: "Severe headache",
        status: "discharge-ready",
        provider: "Dr. Smith",
        admitTime: "08:45 AM",
        acuity: "medium"
      },
      {
        id: "4",
        name: "Robert Wilson",
        age: 67,
        room: "104",
        complaint: "Shortness of breath",
        status: "in-progress",
        provider: "Dr. Johnson",
        admitTime: "11:00 AM",
        acuity: "high"
      },
      {
        id: "5",
        name: "Lisa Garcia",
        age: 34,
        room: "Waiting",
        complaint: "Stomach pain",
        status: "waiting",
        provider: "Unassigned",
        admitTime: "11:30 AM",
        acuity: "medium"
      }
    ]);
  }, []);

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
        return 'text-red-600';
      case 'medium':
        return 'text-yellow-600';
      case 'low':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  const groupedPatients = {
    waiting: patients.filter(p => p.status === 'waiting'),
    'in-progress': patients.filter(p => p.status === 'in-progress'),
    'discharge-ready': patients.filter(p => p.status === 'discharge-ready')
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Patient Tracker Board
        </CardTitle>
        <CardDescription>Real-time patient status and care progression</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Waiting Column */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-blue-700">Waiting Room</h3>
              <Badge variant="secondary">{groupedPatients.waiting.length}</Badge>
            </div>
            <div className="space-y-3">
              {groupedPatients.waiting.map((patient) => (
                <Card 
                  key={patient.id} 
                  className="p-4 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => navigate(`/patient/${patient.id}`)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-medium">{patient.name}</h4>
                      <p className="text-sm text-gray-600">Age {patient.age}</p>
                    </div>
                    <AlertCircle className={`h-4 w-4 ${getAcuityColor(patient.acuity)}`} />
                  </div>
                  <p className="text-sm text-gray-700 mb-2">{patient.complaint}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {patient.admitTime}
                    </span>
                    <Badge className={getStatusColor(patient.status)}>
                      Waiting
                    </Badge>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* In Progress Column */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-yellow-700">In Progress</h3>
              <Badge variant="secondary">{groupedPatients['in-progress'].length}</Badge>
            </div>
            <div className="space-y-3">
              {groupedPatients['in-progress'].map((patient) => (
                <Card 
                  key={patient.id} 
                  className="p-4 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => navigate(`/patient/${patient.id}`)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-medium">{patient.name}</h4>
                      <p className="text-sm text-gray-600">Room {patient.room}</p>
                    </div>
                    <AlertCircle className={`h-4 w-4 ${getAcuityColor(patient.acuity)}`} />
                  </div>
                  <p className="text-sm text-gray-700 mb-2">{patient.complaint}</p>
                  <p className="text-sm text-blue-600 mb-2">{patient.provider}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {patient.admitTime}
                    </span>
                    <Badge className={getStatusColor(patient.status)}>
                      In Progress
                    </Badge>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Discharge Ready Column */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-green-700">Discharge Ready</h3>
              <Badge variant="secondary">{groupedPatients['discharge-ready'].length}</Badge>
            </div>
            <div className="space-y-3">
              {groupedPatients['discharge-ready'].map((patient) => (
                <Card 
                  key={patient.id} 
                  className="p-4 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => navigate(`/patient/${patient.id}`)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-medium">{patient.name}</h4>
                      <p className="text-sm text-gray-600">Room {patient.room}</p>
                    </div>
                    <AlertCircle className={`h-4 w-4 ${getAcuityColor(patient.acuity)}`} />
                  </div>
                  <p className="text-sm text-gray-700 mb-2">{patient.complaint}</p>
                  <p className="text-sm text-blue-600 mb-2">{patient.provider}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {patient.admitTime}
                    </span>
                    <Badge className={getStatusColor(patient.status)}>
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
  );
};

export default PatientTracker;
