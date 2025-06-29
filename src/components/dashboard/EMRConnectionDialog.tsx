
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Database, 
  Wifi, 
  Shield, 
  CheckCircle, 
  Loader2,
  Server,
  Key,
  Lock,
  Activity
} from 'lucide-react';

interface EMRConnectionDialogProps {
  isOpen: boolean;
  hospitalName: string;
  emrType: string;
  onComplete: () => void;
}

const EMRConnectionDialog = ({ 
  isOpen, 
  hospitalName, 
  emrType, 
  onComplete 
}: EMRConnectionDialogProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  const connectionSteps = [
    { 
      id: 1, 
      name: 'Initializing Connection', 
      icon: Wifi, 
      description: 'Establishing secure tunnel to EMR system' 
    },
    { 
      id: 2, 
      name: 'Authentication', 
      icon: Key, 
      description: 'Verifying FHIR R4 credentials and permissions' 
    },
    { 
      id: 3, 
      name: 'Security Handshake', 
      icon: Shield, 
      description: 'Enabling HIPAA-compliant encryption protocols' 
    },
    { 
      id: 4, 
      name: 'Data Sync', 
      icon: Database, 
      description: 'Synchronizing patient data and clinical workflows' 
    },
    { 
      id: 5, 
      name: 'System Ready', 
      icon: CheckCircle, 
      description: 'EMR system successfully connected and active' 
    }
  ];

  useEffect(() => {
    if (!isOpen) return;

    const timer = setInterval(() => {
      setCurrentStep(prev => {
        const nextStep = prev + 1;
        setProgress((nextStep / connectionSteps.length) * 100);
        
        if (nextStep >= connectionSteps.length) {
          setTimeout(() => {
            onComplete();
          }, 1000);
          clearInterval(timer);
          return nextStep;
        }
        return nextStep;
      });
    }, 800);

    return () => clearInterval(timer);
  }, [isOpen, onComplete, connectionSteps.length]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6" style={{
      background: 'rgba(10, 22, 40, 0.95)',
      backdropFilter: 'blur(8px)'
    }}>
      <Card className="backdrop-blur-xl bg-blue-500/20 border border-blue-300/30 rounded-2xl shadow-2xl max-w-lg w-full animate-scale-in">
        <CardHeader className="text-center pb-4">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 backdrop-blur-sm bg-blue-600/30 rounded-xl border border-blue-400/30">
              <Database className="h-8 w-8 text-blue-300" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-white mb-2">
            Connecting to EMR System
          </CardTitle>
          <div className="space-y-2">
            <h3 className="text-lg text-white">{hospitalName}</h3>
            <Badge className="bg-blue-500/20 text-blue-200 border border-blue-400/30">
              <Server className="h-3 w-3 mr-1" />
              {emrType} System
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-white/70">Connection Progress</span>
              <span className="text-white font-medium">{Math.round(progress)}%</span>
            </div>
            <Progress 
              value={progress} 
              className="h-2 bg-blue-900/50"
            />
          </div>

          {/* Connection Steps */}
          <div className="space-y-3">
            {connectionSteps.map((step, index) => {
              const StepIcon = step.icon;
              const isActive = index === currentStep;
              const isCompleted = index < currentStep;
              const isPending = index > currentStep;

              return (
                <div 
                  key={step.id}
                  className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-300 ${
                    isActive 
                      ? 'bg-blue-600/30 border border-blue-400/40 scale-105' 
                      : isCompleted 
                      ? 'bg-green-600/20 border border-green-400/30' 
                      : 'bg-blue-500/10 border border-blue-400/20'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${
                    isActive 
                      ? 'bg-blue-500/30 animate-pulse' 
                      : isCompleted 
                      ? 'bg-green-500/30' 
                      : 'bg-gray-500/20'
                  }`}>
                    {isActive ? (
                      <Loader2 className="h-4 w-4 text-blue-300 animate-spin" />
                    ) : isCompleted ? (
                      <CheckCircle className="h-4 w-4 text-green-300" />
                    ) : (
                      <StepIcon className="h-4 w-4 text-gray-400" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className={`font-medium ${
                      isActive ? 'text-white' : isCompleted ? 'text-green-300' : 'text-white/60'
                    }`}>
                      {step.name}
                    </div>
                    <div className={`text-xs ${
                      isActive ? 'text-blue-200' : isCompleted ? 'text-green-200' : 'text-white/40'
                    }`}>
                      {step.description}
                    </div>
                  </div>

                  {isActive && (
                    <Activity className="h-4 w-4 text-blue-300 animate-pulse" />
                  )}
                </div>
              );
            })}
          </div>

          {/* Security Notice */}
          <div className="flex items-center gap-2 p-3 backdrop-blur-sm bg-green-600/20 border border-green-400/30 rounded-lg">
            <Lock className="h-4 w-4 text-green-300" />
            <div className="text-sm text-green-200">
              <span className="font-medium">Secure Connection:</span> All data is encrypted end-to-end and HIPAA compliant
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EMRConnectionDialog;
