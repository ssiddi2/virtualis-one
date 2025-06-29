
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
  Activity,
  Zap
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
      name: 'Neural Link', 
      icon: Zap, 
      description: 'Establishing quantum tunnel to EMR core' 
    },
    { 
      id: 2, 
      name: 'Authentication', 
      icon: Key, 
      description: 'FHIR R4 biometric verification' 
    },
    { 
      id: 3, 
      name: 'Encryption', 
      icon: Shield, 
      description: 'Military-grade HIPAA protocols active' 
    },
    { 
      id: 4, 
      name: 'Sync Complete', 
      icon: CheckCircle, 
      description: 'All systems operational' 
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
          }, 800);
          clearInterval(timer);
          return nextStep;
        }
        return nextStep;
      });
    }, 600);

    return () => clearInterval(timer);
  }, [isOpen, onComplete, connectionSteps.length]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6" style={{
      background: 'rgba(5, 15, 35, 0.98)',
      backdropFilter: 'blur(12px)'
    }}>
      <Card className="backdrop-blur-2xl bg-gradient-to-br from-blue-500/30 to-purple-500/20 border border-cyan-300/40 rounded-3xl shadow-2xl max-w-md w-full animate-scale-in overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 animate-pulse" />
        
        <CardHeader className="text-center pb-6 relative z-10">
          <div className="flex items-center justify-center mb-6">
            <div className="relative p-4">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-2xl blur-lg animate-pulse" />
              <div className="relative p-4 backdrop-blur-sm bg-cyan-500/20 rounded-2xl border border-cyan-300/30">
                <Database className="h-10 w-10 text-cyan-300" />
              </div>
            </div>
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-cyan-200 to-blue-200 bg-clip-text text-transparent mb-2">
            NEURAL LINK ACTIVE
          </CardTitle>
          <div className="space-y-2">
            <h3 className="text-lg text-white font-medium">{hospitalName}</h3>
            <Badge className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-200 border border-cyan-400/30 px-3 py-1">
              <Server className="h-3 w-3 mr-1" />
              {emrType} CORE
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6 relative z-10">
          {/* Futuristic Progress Bar */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-cyan-200 font-medium">SYNC PROGRESS</span>
              <span className="text-white font-bold">{Math.round(progress)}%</span>
            </div>
            <div className="relative">
              <div className="h-2 bg-slate-800/50 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full transition-all duration-300 relative"
                  style={{ width: `${progress}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse rounded-full" />
                </div>
              </div>
            </div>
          </div>

          {/* Streamlined Connection Steps */}
          <div className="space-y-3">
            {connectionSteps.map((step, index) => {
              const StepIcon = step.icon;
              const isActive = index === currentStep;
              const isCompleted = index < currentStep;

              return (
                <div 
                  key={step.id}
                  className={`flex items-center gap-4 p-3 rounded-xl transition-all duration-500 ${
                    isActive 
                      ? 'bg-gradient-to-r from-cyan-500/30 to-blue-500/20 border border-cyan-400/50 scale-105 shadow-lg shadow-cyan-500/20' 
                      : isCompleted 
                      ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/10 border border-green-400/30' 
                      : 'bg-slate-800/20 border border-slate-600/30'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${
                    isActive 
                      ? 'bg-cyan-500/30 shadow-lg shadow-cyan-500/30' 
                      : isCompleted 
                      ? 'bg-green-500/30' 
                      : 'bg-slate-600/20'
                  }`}>
                    {isActive ? (
                      <Loader2 className="h-5 w-5 text-cyan-300 animate-spin" />
                    ) : isCompleted ? (
                      <CheckCircle className="h-5 w-5 text-green-300" />
                    ) : (
                      <StepIcon className="h-5 w-5 text-slate-400" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className={`font-bold ${
                      isActive ? 'text-cyan-200' : isCompleted ? 'text-green-300' : 'text-slate-400'
                    }`}>
                      {step.name}
                    </div>
                    <div className={`text-xs ${
                      isActive ? 'text-cyan-300' : isCompleted ? 'text-green-200' : 'text-slate-500'
                    }`}>
                      {step.description}
                    </div>
                  </div>

                  {isActive && (
                    <Activity className="h-4 w-4 text-cyan-300 animate-pulse" />
                  )}
                </div>
              );
            })}
          </div>

          {/* Security Badge */}
          <div className="flex items-center gap-3 p-3 backdrop-blur-sm bg-gradient-to-r from-green-600/20 to-emerald-600/10 border border-green-400/30 rounded-xl">
            <Lock className="h-5 w-5 text-green-300" />
            <div className="text-sm">
              <span className="font-bold text-green-200">QUANTUM ENCRYPTION:</span>
              <span className="text-green-300 ml-1">Military-grade HIPAA compliance active</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EMRConnectionDialog;
