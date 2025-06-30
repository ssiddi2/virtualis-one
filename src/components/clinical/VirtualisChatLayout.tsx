
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MessageSquare, Users } from 'lucide-react';
import VirtualisChat from './VirtualisChat';
import VirtualisChatWithPatients from './VirtualisChatWithPatients';
import { useAuth } from '@/components/auth/AuthProvider';

interface VirtualisChatLayoutProps {
  hospitalId?: string;
}

const VirtualisChatLayout = ({ hospitalId }: VirtualisChatLayoutProps) => {
  const { profile, user } = useAuth();
  const [chatMode, setChatMode] = useState<'general' | 'patients'>('general');

  // Use passed hospitalId or fall back to auth context
  const effectiveHospitalId = hospitalId || profile?.hospital_id || user?.user_metadata?.hospital_id;

  console.log('VirtualisChatLayout - Effective Hospital ID:', effectiveHospitalId);

  // Show loading state if we don't have a hospital ID yet
  if (!effectiveHospitalId) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{
        background: 'linear-gradient(135deg, hsl(225, 70%, 25%) 0%, hsl(220, 65%, 35%) 25%, hsl(215, 60%, 45%) 50%, hsl(210, 55%, 55%) 75%, hsl(205, 50%, 65%) 100%)'
      }}>
        <Card className="backdrop-blur-xl bg-blue-500/20 border border-blue-300/30 rounded-xl shadow-lg max-w-md">
          <CardHeader>
            <CardTitle className="text-white text-center">Loading Chat...</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-white/70 text-center">
              Setting up your clinical chat environment...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{
      background: 'linear-gradient(135deg, hsl(225, 70%, 25%) 0%, hsl(220, 65%, 35%) 25%, hsl(215, 60%, 45%) 50%, hsl(210, 55%, 55%) 75%, hsl(205, 50%, 65%) 100%)'
    }}>
      {/* Header */}
      <div className="p-6 border-b border-white/20">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.history.back()}
                className="text-white hover:bg-white/20"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-white">Virtualis Chat</h1>
                <p className="text-white/70">AI-Powered Clinical Communication</p>
              </div>
            </div>

            {/* Mode Toggle */}
            <div className="flex gap-2">
              <Button
                variant={chatMode === 'general' ? 'default' : 'outline'}
                onClick={() => setChatMode('general')}
                className={chatMode === 'general' 
                  ? "bg-blue-600 hover:bg-blue-700 text-white" 
                  : "bg-transparent border-blue-400/30 text-white hover:bg-blue-500/20"
                }
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                General Chat
              </Button>
              <Button
                variant={chatMode === 'patients' ? 'default' : 'outline'}
                onClick={() => setChatMode('patients')}
                className={chatMode === 'patients' 
                  ? "bg-purple-600 hover:bg-purple-700 text-white" 
                  : "bg-transparent border-purple-400/30 text-white hover:bg-purple-500/20"
                }
              >
                <Users className="h-4 w-4 mr-2" />
                Patient Threads
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Content */}
      <div className="flex-1">
        {chatMode === 'general' ? (
          <VirtualisChat hospitalId={effectiveHospitalId} />
        ) : (
          <VirtualisChatWithPatients hospitalId={effectiveHospitalId} />
        )}
      </div>
    </div>
  );
};

export default VirtualisChatLayout;
