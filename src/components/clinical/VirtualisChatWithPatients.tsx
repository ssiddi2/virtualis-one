
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import PatientThreadManager from './PatientThreadManager';
import PatientChatInterface from './PatientChatInterface';
import { Brain, MessageSquare } from 'lucide-react';

interface PatientThread {
  id: string;
  patientId: string;
  patientName: string;
  mrn: string;
  roomNumber?: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  acuity: 'critical' | 'urgent' | 'routine';
  participants: string[];
  messageCount: number;
  isActive: boolean;
}

interface VirtualisChatWithPatientsProps {
  hospitalId: string;
}

const VirtualisChatWithPatients = ({ hospitalId }: VirtualisChatWithPatientsProps) => {
  const { profile, user } = useAuth();
  const [selectedThread, setSelectedThread] = useState<PatientThread | null>(null);

  const handleThreadSelect = (thread: PatientThread) => {
    setSelectedThread(thread);
  };

  if (!hospitalId) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{
        background: 'linear-gradient(135deg, hsl(225, 70%, 25%) 0%, hsl(220, 65%, 35%) 25%, hsl(215, 60%, 45%) 50%, hsl(210, 55%, 55%) 75%, hsl(205, 50%, 65%) 100%)'
      }}>
        <Card className="backdrop-blur-xl bg-blue-500/20 border border-blue-300/30 rounded-xl shadow-lg max-w-md">
          <CardHeader>
            <CardTitle className="text-white text-center">No Hospital Selected</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-white/70 text-center">
              Please select a hospital to access patient threading in Virtualis Chat
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex" style={{
      background: 'linear-gradient(135deg, hsl(225, 70%, 25%) 0%, hsl(220, 65%, 35%) 25%, hsl(215, 60%, 45%) 50%, hsl(210, 55%, 55%) 75%, hsl(205, 50%, 65%) 100%)'
    }}>
      {/* Patient Thread Sidebar */}
      <PatientThreadManager
        hospitalId={hospitalId}
        onThreadSelect={handleThreadSelect}
        activeThreadId={selectedThread?.id}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedThread ? (
          <PatientChatInterface
            thread={selectedThread}
            currentUser={profile || user}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-white">
              <div className="p-4 backdrop-blur-sm bg-blue-600/30 rounded-lg border border-blue-400/30 mb-4 inline-block">
                <Brain className="h-12 w-12 text-blue-300 mx-auto mb-2" />
                <MessageSquare className="h-8 w-8 text-white mx-auto" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Patient-Centered Communication</h2>
              <p className="text-white/70 max-w-md">
                Select a patient thread from the sidebar to start AI-powered clinical conversations 
                organized by patient context, medical history, and care team collaboration.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VirtualisChatWithPatients;
