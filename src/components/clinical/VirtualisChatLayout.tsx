import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/components/auth/AuthProvider';
import { useToast } from '@/hooks/use-toast';
import VirtualisChatWithPatients from './VirtualisChatWithPatients';
import VirtualisChat from './VirtualisChat';
import FloatingActionButton from './FloatingActionButton';
import MessageDialog from './MessageDialog';
import ConsultDialog from './ConsultDialog';
import { 
  Brain,
  MessageSquare,
  Users,
  User,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';

interface VirtualisChatLayoutProps {
  hospitalId?: string;
}

const VirtualisChatLayout = ({ hospitalId }: VirtualisChatLayoutProps) => {
  const { profile, user } = useAuth();
  const { toast } = useToast();
  const [chatMode, setChatMode] = useState<'patient-threads' | 'general-chat'>('patient-threads');
  const [messageDialogOpen, setMessageDialogOpen] = useState(false);
  const [consultDialogOpen, setConsultDialogOpen] = useState(false);

  // Debug logging
  console.log('VirtualisChatLayout - hospitalId:', hospitalId);
  console.log('VirtualisChatLayout - profile:', profile);
  console.log('VirtualisChatLayout - user:', user);

  const toggleChatMode = () => {
    const newMode = chatMode === 'patient-threads' ? 'general-chat' : 'patient-threads';
    setChatMode(newMode);
    
    toast({
      title: `Switched to ${newMode === 'patient-threads' ? 'Patient Threading' : 'General Chat'} Mode`,
      description: newMode === 'patient-threads' 
        ? 'Conversations are now organized by patient context'
        : 'General clinical communication and team chat'
    });
  };

  const handleMessageClick = () => {
    console.log('Opening message dialog');
    setMessageDialogOpen(true);
  };

  const handleConsultClick = () => {
    console.log('Opening consult dialog');
    setConsultDialogOpen(true);
  };

  if (!hospitalId) {
    console.log('No hospital ID provided, showing selection message');
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
              Please select a hospital to access Virtualis Chat
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  console.log('Rendering VirtualisChatLayout with hospitalId:', hospitalId);

  return (
    <div className="min-h-screen" style={{
      background: 'linear-gradient(135deg, hsl(225, 70%, 25%) 0%, hsl(220, 65%, 35%) 25%, hsl(215, 60%, 45%) 50%, hsl(210, 55%, 55%) 75%, hsl(205, 50%, 65%) 100%)'
    }}>
      {/* Header with Mode Toggle */}
      <div className="p-4 backdrop-blur-xl bg-blue-500/20 border-b border-blue-300/30">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 backdrop-blur-sm bg-blue-600/30 rounded-lg border border-blue-400/30">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Virtualis Chat</h1>
              <p className="text-white/70 text-sm">
                {chatMode === 'patient-threads' 
                  ? 'Patient-Centered Communication & Threading' 
                  : 'General Clinical Communication & Team Chat'
                }
              </p>
            </div>
          </div>

          {/* Mode Toggle */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 backdrop-blur-sm bg-blue-600/20 border border-blue-400/30 rounded-lg p-2">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-white" />
                <span className="text-white text-sm">Patient Threads</span>
              </div>
              
              <Button
                onClick={toggleChatMode}
                className="bg-transparent hover:bg-blue-500/30 p-1 h-8 w-12 border-0"
              >
                {chatMode === 'patient-threads' ? (
                  <ToggleRight className="h-6 w-6 text-green-400" />
                ) : (
                  <ToggleLeft className="h-6 w-6 text-white/60" />
                )}
              </Button>
              
              <div className="flex items-center gap-2">
                <span className="text-white text-sm">General Chat</span>
                <Users className="h-4 w-4 text-white" />
              </div>
            </div>

            <Badge className={`${
              chatMode === 'patient-threads' 
                ? 'bg-green-500/20 text-green-200 border-green-400/30' 
                : 'bg-blue-500/20 text-blue-200 border-blue-400/30'
            }`}>
              {chatMode === 'patient-threads' ? 'Patient Mode' : 'Team Mode'}
            </Badge>
          </div>
        </div>
      </div>

      {/* Chat Interface */}
      {chatMode === 'patient-threads' ? (
        <VirtualisChatWithPatients hospitalId={hospitalId} />
      ) : (
        <VirtualisChat hospitalId={hospitalId} currentUser={profile || user} />
      )}

      {/* Floating Action Button */}
      <FloatingActionButton
        onMessageClick={handleMessageClick}
        onConsultClick={handleConsultClick}
      />

      {/* Dialogs */}
      <MessageDialog
        open={messageDialogOpen}
        onClose={() => setMessageDialogOpen(false)}
        hospitalId={hospitalId}
      />

      <ConsultDialog
        open={consultDialogOpen}
        onClose={() => setConsultDialogOpen(false)}
        hospitalId={hospitalId}
      />
    </div>
  );
};

export default VirtualisChatLayout;
