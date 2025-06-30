
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Database, 
  Shield, 
  CheckCircle, 
  Loader2,
  Server,
  Activity,
  HeartPulse,
  Stethoscope,
  Brain,
  Wifi
} from 'lucide-react';

interface EMRConnectionSimulationProps {
  hospitalName: string;
  emrType: string;
  onComplete: () => void;
}

const EMRConnectionSimulation = ({ 
  hospitalName, 
  emrType, 
  onComplete 
}: EMRConnectionSimulationProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const simulationSteps = [
    { 
      name: 'Healthcare Network Authentication', 
      icon: Stethoscope, 
      description: 'Establishing secure clinical credentials',
      duration: 1500
    },
    { 
      name: 'Medical Data Synchronization', 
      icon: HeartPulse, 
      description: 'Connecting to patient care systems',
      duration: 2000
    },
    { 
      name: 'Clinical AI Integration', 
      icon: Brain, 
      description: 'Activating intelligent care support',
      duration: 1800
    },
    { 
      name: 'Healthcare System Ready', 
      icon: CheckCircle, 
      description: 'All clinical workflows operational',
      duration: 1000
    }
  ];

  useEffect(() => {
    const runSimulation = async () => {
      for (let i = 0; i < simulationSteps.length; i++) {
        setCurrentStep(i);
        setProgress(((i + 1) / simulationSteps.length) * 100);
        
        await new Promise(resolve => setTimeout(resolve, simulationSteps[i].duration));
      }
      
      setIsComplete(true);
      setTimeout(() => {
        onComplete();
      }, 1000);
    };

    runSimulation();
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6" style={{
      background: 'rgba(5, 15, 35, 0.98)',
      backdropFilter: 'blur(12px)'
    }}>
      <Card className="backdrop-blur-2xl bg-gradient-to-br from-blue-500/30 to-purple-500/20 border border-cyan-300/40 rounded-3xl shadow-2xl max-w-lg w-full animate-scale-in overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 animate-pulse" />
        
        <CardHeader className="text-center pb-6 relative z-10">
          <div className="flex items-center justify-center mb-6">
            <div className="relative p-4">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-2xl blur-lg animate-pulse" />
              <div className="relative p-4 backdrop-blur-sm bg-cyan-500/20 rounded-2xl border border-cyan-300/30">
                <Database className="h-12 w-12 text-cyan-300" />
              </div>
            </div>
          </div>
          
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-cyan-200 to-blue-200 bg-clip-text text-transparent mb-2">
            HEALTHCARE NETWORK
          </CardTitle>
          <CardTitle className="text-xl font-bold bg-gradient-to-r from-cyan-200 to-blue-200 bg-clip-text text-transparent mb-4">
            CONNECTION SIMULATION
          </CardTitle>
          
          <div className="space-y-2">
            <h3 className="text-lg text-white font-medium">{hospitalName}</h3>
            <div className="flex items-center justify-center gap-2">
              <Badge className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-200 border border-cyan-400/30 px-3 py-1">
                <Server className="h-3 w-3 mr-1" />
                {emrType} CLINICAL SYSTEM
              </Badge>
              <Badge className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-200 border border-green-400/30 px-3 py-1">
                <Shield className="h-3 w-3 mr-1" />
                SIMULATION MODE
              </Badge>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6 relative z-10">
          {/* Demo Data Display */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="text-center p-3 backdrop-blur-sm bg-blue-600/20 border border-blue-400/30 rounded-lg">
              <div className="text-2xl font-bold text-cyan-300">2,847</div>
              <div className="text-xs text-cyan-200">Demo Patients</div>
            </div>
            <div className="text-center p-3 backdrop-blur-sm bg-purple-600/20 border border-purple-400/30 rounded-lg">
              <div className="text-2xl font-bold text-purple-300">42</div>
              <div className="text-xs text-purple-200">Care Providers</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-cyan-200 font-medium">SYSTEM SIMULATION</span>
              <span className="text-white font-bold">{Math.round(progress)}%</span>
            </div>
            <div className="relative">
              <div className="h-3 bg-slate-800/50 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 rounded-full transition-all duration-500 relative"
                  style={{ width: `${progress}%` }}
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse rounded-full" />
                </div>
              </div>
            </div>
          </div>

          {/* Simulation Steps */}
          <div className="space-y-3">
            {simulationSteps.map((step, index) => {
              const StepIcon = step.icon;
              const isActive = index === currentStep && !isComplete;
              const isCompleted = index < currentStep || isComplete;

              return (
                <div 
                  key={index}
                  className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-500 ${
                    isActive 
                      ? 'bg-gradient-to-r from-cyan-500/30 to-blue-500/20 border border-cyan-400/50 scale-105 shadow-lg shadow-cyan-500/20' 
                      : isCompleted 
                      ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/10 border border-green-400/30' 
                      : 'bg-slate-800/20 border border-slate-600/30'
                  }`}
                >
                  <div className={`p-3 rounded-lg ${
                    isActive 
                      ? 'bg-cyan-500/30 shadow-lg shadow-cyan-500/30' 
                      : isCompleted 
                      ? 'bg-green-500/30' 
                      : 'bg-slate-600/20'
                  }`}>
                    {isActive ? (
                      <Loader2 className="h-6 w-6 text-cyan-300 animate-spin" />
                    ) : isCompleted ? (
                      <CheckCircle className="h-6 w-6 text-green-300" />
                    ) : (
                      <StepIcon className="h-6 w-6 text-slate-400" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className={`font-bold text-lg ${
                      isActive ? 'text-cyan-200' : isCompleted ? 'text-green-300' : 'text-slate-400'
                    }`}>
                      {step.name}
                    </div>
                    <div className={`text-sm ${
                      isActive ? 'text-cyan-300' : isCompleted ? 'text-green-200' : 'text-slate-500'
                    }`}>
                      {step.description}
                    </div>
                  </div>

                  {isActive && (
                    <Activity className="h-5 w-5 text-cyan-300 animate-pulse" />
                  )}
                </div>
              );
            })}
          </div>

          {/* Status Message */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-4 backdrop-blur-sm bg-gradient-to-r from-blue-600/20 to-cyan-600/10 border border-blue-400/30 rounded-xl">
              <Wifi className="h-6 w-6 text-blue-300" />
              <div>
                <div className="font-bold text-blue-200 text-lg">CLINICAL DEMONSTRATION MODE</div>
                <div className="text-blue-300 text-sm">Simulating healthcare system integration • Educational purposes only</div>
              </div>
            </div>
            
            {isComplete && (
              <div className="flex items-center justify-center p-3 bg-green-500/10 border border-green-400/30 rounded-lg">
                <span className="text-green-300 font-medium">✓ Simulation Complete - Ready for Healthcare Workflows</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EMRConnectionSimulation;
