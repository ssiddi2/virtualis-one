
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Database, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  RefreshCw,
  Shield,
  Activity,
  Users,
  FileText
} from 'lucide-react';

interface EMRInitializationStatusProps {
  hospitalId?: string;
}

const EMRInitializationStatus = ({ hospitalId }: EMRInitializationStatusProps) => {
  const [initializationProgress, setInitializationProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');
  const [isInitializing, setIsInitializing] = useState(true);
  const [initializationComplete, setInitializationComplete] = useState(false);

  const initializationSteps = [
    { id: 1, name: 'Connecting to EMR System', icon: Database, duration: 2000 },
    { id: 2, name: 'Authenticating Hospital Credentials', icon: Shield, duration: 1500 },
    { id: 3, name: 'Syncing Patient Data', icon: Users, duration: 3000 },
    { id: 4, name: 'Loading Medical Records', icon: FileText, duration: 2500 },
    { id: 5, name: 'Establishing Real-time Connection', icon: Activity, duration: 1000 },
    { id: 6, name: 'Initialization Complete', icon: CheckCircle, duration: 500 }
  ];

  useEffect(() => {
    if (!hospitalId || initializationComplete) return;

    let stepIndex = 0;
    const totalSteps = initializationSteps.length;
    
    const processStep = () => {
      if (stepIndex < totalSteps) {
        const step = initializationSteps[stepIndex];
        setCurrentStep(step.name);
        setInitializationProgress((stepIndex + 1) / totalSteps * 100);
        
        setTimeout(() => {
          stepIndex++;
          if (stepIndex < totalSteps) {
            processStep();
          } else {
            setIsInitializing(false);
            setInitializationComplete(true);
          }
        }, step.duration);
      }
    };

    processStep();
  }, [hospitalId, initializationComplete]);

  const getStatusColor = () => {
    if (initializationComplete) return 'bg-green-500/20 text-green-200 border-green-400/30';
    if (isInitializing) return 'bg-blue-500/20 text-blue-200 border-blue-400/30';
    return 'bg-yellow-500/20 text-yellow-200 border-yellow-400/30';
  };

  const getStatusIcon = () => {
    if (initializationComplete) return <CheckCircle className="h-4 w-4" />;
    if (isInitializing) return <RefreshCw className="h-4 w-4 animate-spin" />;
    return <Clock className="h-4 w-4" />;
  };

  const handleRetryInitialization = () => {
    setInitializationProgress(0);
    setCurrentStep('');
    setIsInitializing(true);
    setInitializationComplete(false);
  };

  if (!hospitalId) {
    return (
      <Card className="backdrop-blur-xl bg-orange-500/20 border border-orange-300/30 rounded-xl shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <AlertTriangle className="h-5 w-5 text-orange-400" />
            EMR Connection Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <p className="text-white/70 mb-4">No hospital selected</p>
            <Badge className="bg-orange-500/20 text-orange-200 border-orange-400/30">
              Waiting for Hospital Selection
            </Badge>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="backdrop-blur-xl bg-blue-500/20 border border-blue-300/30 rounded-xl shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Database className="h-5 w-5 text-blue-400" />
          EMR System Integration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-white/90">Connection Status</span>
          <Badge className={`${getStatusColor()} flex items-center gap-1`}>
            {getStatusIcon()}
            {initializationComplete ? 'Connected' : isInitializing ? 'Initializing' : 'Pending'}
          </Badge>
        </div>

        {isInitializing && (
          <>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-white/70">Progress</span>
                <span className="text-white/70">{Math.round(initializationProgress)}%</span>
              </div>
              <Progress value={initializationProgress} className="bg-blue-900/30" />
            </div>

            <div className="flex items-center gap-2 text-sm text-white/80">
              <RefreshCw className="h-3 w-3 animate-spin" />
              <span>{currentStep}</span>
            </div>
          </>
        )}

        {initializationComplete && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-white/70">Patients Synced</span>
                <p className="text-white font-medium">247 records</p>
              </div>
              <div>
                <span className="text-white/70">Last Sync</span>
                <p className="text-white font-medium">Just now</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-green-300">
              <CheckCircle className="h-3 w-3" />
              <span>Real-time sync active</span>
            </div>
          </div>
        )}

        {!isInitializing && !initializationComplete && (
          <Button 
            onClick={handleRetryInitialization}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry Connection
          </Button>
        )}

        <div className="pt-2 border-t border-white/20">
          <div className="flex items-center justify-between text-xs text-white/60">
            <span>Hospital ID: {hospitalId.slice(0, 8)}...</span>
            <span>EMR: Epic Integration</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EMRInitializationStatus;
