
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
  Heart,
  UserCheck,
  FileCheck
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
      name: 'Establishing Connection', 
      icon: Heart, 
      description: 'Connecting to hospital healthcare systems' 
    },
    { 
      id: 2, 
      name: 'Verifying Credentials', 
      icon: UserCheck, 
      description: 'Authenticating healthcare professional access' 
    },
    { 
      id: 3, 
      name: 'Securing Patient Data', 
      icon: Shield, 
      description: 'Ensuring HIPAA-compliant data protection' 
    },
    { 
      id: 4, 
      name: 'Ready for Patient Care', 
      icon: CheckCircle, 
      description: 'All clinical systems are now accessible' 
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
    }, 800);

    return () => clearInterval(timer);
  }, [isOpen, onComplete, connectionSteps.length]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6" style={{
      background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.1) 0%, rgba(249, 115, 22, 0.1) 25%, rgba(59, 130, 246, 0.1) 50%, rgba(147, 51, 234, 0.1) 100%)',
      backdropFilter: 'blur(20px)'
    }}>
      <Card className="relative overflow-hidden max-w-md w-full shadow-2xl border-0" style={{
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.1) 100%)',
        backdropFilter: 'blur(20px)',
        borderRadius: '24px'
      }}>
        {/* Animated background gradient */}
        <div 
          className="absolute inset-0 opacity-30 animate-pulse"
          style={{
            background: 'linear-gradient(45deg, rgba(251, 191, 36, 0.3) 0%, rgba(249, 115, 22, 0.3) 25%, rgba(59, 130, 246, 0.2) 50%, rgba(147, 51, 234, 0.2) 100%)',
            animation: 'gradient-shift 3s ease-in-out infinite alternate'
          }}
        />
        
        <CardHeader className="text-center pb-6 relative z-10">
          <div className="flex items-center justify-center mb-6">
            <div className="relative p-4">
              <div 
                className="absolute inset-0 rounded-2xl blur-lg animate-pulse"
                style={{
                  background: 'linear-gradient(45deg, rgba(251, 191, 36, 0.6) 0%, rgba(249, 115, 22, 0.6) 100%)'
                }}
              />
              <div 
                className="relative p-4 rounded-2xl border border-white/30"
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(10px)'
                }}
              >
                <Database className="h-10 w-10 text-white" />
              </div>
            </div>
          </div>
          <CardTitle 
            className="text-2xl font-bold mb-2 text-white"
            style={{
              textShadow: '0 2px 4px rgba(0,0,0,0.3)'
            }}
          >
            CONNECTING TO HOSPITAL
          </CardTitle>
          <div className="space-y-2">
            <h3 className="text-lg text-white font-medium" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}>
              {hospitalName}
            </h3>
            <Badge 
              className="px-3 py-1 text-white border border-white/30"
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)'
              }}
            >
              <Server className="h-3 w-3 mr-1" />
              {emrType} Healthcare System
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6 relative z-10">
          {/* Progress Bar */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-white font-medium" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}>
                CONNECTION PROGRESS
              </span>
              <span className="text-white font-bold" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}>
                {Math.round(progress)}%
              </span>
            </div>
            <div className="relative">
              <div 
                className="h-3 rounded-full overflow-hidden border border-white/20"
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(10px)'
                }}
              >
                <div 
                  className="h-full rounded-full transition-all duration-500 relative"
                  style={{ 
                    width: `${progress}%`,
                    background: 'linear-gradient(90deg, rgba(251, 191, 36, 0.8) 0%, rgba(249, 115, 22, 0.8) 100%)'
                  }}
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse rounded-full" />
                </div>
              </div>
            </div>
          </div>

          {/* Connection Steps */}
          <div className="space-y-3">
            {connectionSteps.map((step, index) => {
              const StepIcon = step.icon;
              const isActive = index === currentStep;
              const isCompleted = index < currentStep;

              return (
                <div 
                  key={step.id}
                  className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-500 border ${
                    isActive 
                      ? 'border-white/40 scale-105 shadow-lg' 
                      : isCompleted 
                      ? 'border-green-400/30' 
                      : 'border-white/20'
                  }`}
                  style={{
                    background: isActive 
                      ? 'linear-gradient(135deg, rgba(251, 191, 36, 0.3) 0%, rgba(249, 115, 22, 0.2) 100%)'
                      : isCompleted 
                      ? 'rgba(34, 197, 94, 0.1)' 
                      : 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)'
                  }}
                >
                  <div 
                    className={`p-2 rounded-lg ${
                      isActive 
                        ? 'shadow-lg' 
                        : isCompleted 
                        ? '' 
                        : ''
                    }`}
                    style={{
                      background: isActive 
                        ? 'rgba(251, 191, 36, 0.3)' 
                        : isCompleted 
                        ? 'rgba(34, 197, 94, 0.3)' 
                        : 'rgba(255, 255, 255, 0.2)',
                      backdropFilter: 'blur(5px)'
                    }}
                  >
                    {isActive ? (
                      <Loader2 className="h-5 w-5 text-white animate-spin" />
                    ) : isCompleted ? (
                      <CheckCircle className="h-5 w-5 text-green-300" />
                    ) : (
                      <StepIcon className="h-5 w-5 text-white/70" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className={`font-bold ${
                      isActive ? 'text-white' : isCompleted ? 'text-green-300' : 'text-white/70'
                    }`} style={{ textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}>
                      {step.name}
                    </div>
                    <div className={`text-xs ${
                      isActive ? 'text-white/90' : isCompleted ? 'text-green-200' : 'text-white/50'
                    }`} style={{ textShadow: '0 1px 2px rgba(0,0,0,0.2)' }}>
                      {step.description}
                    </div>
                  </div>

                  {isActive && (
                    <Activity className="h-4 w-4 text-white animate-pulse" />
                  )}
                </div>
              );
            })}
          </div>

          {/* Security Badge */}
          <div 
            className="flex items-center gap-3 p-3 rounded-xl border border-green-400/30"
            style={{
              background: 'rgba(34, 197, 94, 0.1)',
              backdropFilter: 'blur(10px)'
            }}
          >
            <Lock className="h-5 w-5 text-green-300" />
            <div className="text-sm">
              <span className="font-bold text-green-200" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}>
                PATIENT DATA SECURITY:
              </span>
              <span className="text-green-300 ml-1" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.2)' }}>
                HIPAA-compliant encryption active
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <style jsx>{`
        @keyframes gradient-shift {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default EMRConnectionDialog;
