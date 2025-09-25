import { useEffect, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Circle, Server, Shield, Database, Brain, Activity, Wifi } from "lucide-react";
import { cn } from "@/lib/utils";

export interface EnhancedHospital {
  id: string;
  name: string;
  location: string;
  status: string;
  emrType: string;
  lastSync: string;
  patientCount: number;
  bedCount: number;
  occupancyRate: number;
  departments: string[];
  metrics: {
    avgWaitTime: number;
    avgLOS: number;
    readmissionRate: number;
    patientSatisfaction: number;
    erVolume: number;
    surgicalVolume: number;
    diagnosticVolume: number;
  };
}

interface EMRConnectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  hospital: EnhancedHospital;
  onConnectionComplete: () => void;
}

interface ConnectionStage {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  duration: number;
  progress: number;
  status: "pending" | "active" | "completed";
}

const EMRConnectionModal = ({ isOpen, onClose, hospital, onConnectionComplete }: EMRConnectionModalProps) => {
  const [currentStage, setCurrentStage] = useState(0);
  const [overallProgress, setOverallProgress] = useState(0);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionComplete, setConnectionComplete] = useState(false);
  const [stages, setStages] = useState<ConnectionStage[]>([]);

  const connectionStages: ConnectionStage[] = [
    {
      id: "auth",
      label: "Authentication",
      description: "Verifying credentials with " + hospital.emrType,
      icon: <Shield className="w-5 h-5" />,
      duration: 2000,
      progress: 0,
      status: "pending"
    },
    {
      id: "handshake",
      label: "EMR Handshake",
      description: "Establishing secure connection",
      icon: <Server className="w-5 h-5" />,
      duration: 1500,
      progress: 0,
      status: "pending"
    },
    {
      id: "sync",
      label: "Data Synchronization",
      description: "Syncing patient records and clinical data",
      icon: <Database className="w-5 h-5" />,
      duration: 3000,
      progress: 0,
      status: "pending"
    },
    {
      id: "ai",
      label: "AI Integration",
      description: "Initializing Virtualis AI modules",
      icon: <Brain className="w-5 h-5" />,
      duration: 2500,
      progress: 0,
      status: "pending"
    },
    {
      id: "verify",
      label: "Verification",
      description: "Confirming system integration",
      icon: <CheckCircle className="w-5 h-5" />,
      duration: 1000,
      progress: 0,
      status: "pending"
    }
  ];

  useEffect(() => {
    if (isOpen && hospital) {
      setStages(connectionStages);
      setIsConnecting(true);
      setConnectionComplete(false);
      setCurrentStage(0);
      setOverallProgress(0);
      startConnectionSequence();
    }
  }, [isOpen, hospital]);

  const startConnectionSequence = async () => {
    for (let i = 0; i < connectionStages.length; i++) {
      await processStage(i);
    }
    
    setTimeout(() => {
      setConnectionComplete(true);
      setIsConnecting(false);
      setTimeout(() => {
        onConnectionComplete();
      }, 1500);
    }, 500);
  };

  const processStage = (stageIndex: number) => {
    return new Promise((resolve) => {
      setCurrentStage(stageIndex);
      
      // Update stage status to active
      setStages(prev => prev.map((stage, idx) => ({
        ...stage,
        status: idx < stageIndex ? "completed" : idx === stageIndex ? "active" : "pending"
      })));

      const stage = connectionStages[stageIndex];
      const progressInterval = 50;
      const progressStep = 100 / (stage.duration / progressInterval);
      let currentProgress = 0;

      const interval = setInterval(() => {
        currentProgress += progressStep;
        
        if (currentProgress >= 100) {
          currentProgress = 100;
          clearInterval(interval);
          
          // Update stage status to completed
          setStages(prev => prev.map((s, idx) => ({
            ...s,
            status: idx <= stageIndex ? "completed" : s.status,
            progress: idx === stageIndex ? 100 : s.progress
          })));
          
          // Update overall progress
          const newOverallProgress = ((stageIndex + 1) / connectionStages.length) * 100;
          setOverallProgress(newOverallProgress);
          
          setTimeout(() => resolve(true), 200);
        } else {
          setStages(prev => prev.map((s, idx) => ({
            ...s,
            progress: idx === stageIndex ? currentProgress : s.progress
          })));
        }
      }, progressInterval);
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <div className="relative">
          {/* Background animation */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 rounded-lg animate-pulse" />
          
          <div className="relative space-y-6 p-6">
            {/* Header */}
            <div className="text-center space-y-2">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                {connectionComplete ? (
                  <CheckCircle className="w-8 h-8 text-primary animate-in zoom-in duration-300" />
                ) : (
                  <Wifi className="w-8 h-8 text-primary animate-pulse" />
                )}
              </div>
              <h2 className="text-2xl font-bold">
                {connectionComplete ? "Connection Established" : `Connecting to ${hospital.name}`}
              </h2>
              <p className="text-muted-foreground">
                {connectionComplete 
                  ? `Successfully integrated with ${hospital.emrType} EMR system`
                  : `Establishing secure connection with ${hospital.emrType} EMR system`
                }
              </p>
            </div>

            {/* Overall Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Overall Progress</span>
                <span className="font-medium">{Math.round(overallProgress)}%</span>
              </div>
              <Progress value={overallProgress} className="h-2" />
            </div>

            {/* Connection Stages */}
            <div className="space-y-3">
              {stages.map((stage, idx) => (
                <div
                  key={stage.id}
                  className={cn(
                    "flex items-start gap-3 p-3 rounded-lg transition-all duration-300",
                    stage.status === "active" && "bg-primary/5 border border-primary/20",
                    stage.status === "completed" && "bg-green-500/5"
                  )}
                >
                  <div className="mt-0.5">
                    {stage.status === "completed" ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : stage.status === "active" ? (
                      <div className="relative">
                        <Circle className="w-5 h-5 text-primary animate-pulse" />
                        <Activity className="w-3 h-3 text-primary absolute top-1 left-1 animate-ping" />
                      </div>
                    ) : (
                      <Circle className="w-5 h-5 text-muted-foreground/50" />
                    )}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className={cn(
                        "font-medium text-sm",
                        stage.status === "pending" && "text-muted-foreground"
                      )}>
                        {stage.label}
                      </p>
                      {stage.status === "active" && (
                        <span className="text-xs text-primary font-medium">
                          {Math.round(stage.progress)}%
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{stage.description}</p>
                    {stage.status === "active" && (
                      <Progress value={stage.progress} className="h-1 mt-2" />
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Connection Details */}
            {connectionComplete && (
              <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Connection Type</p>
                  <p className="font-medium">HL7 FHIR R4</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Latency</p>
                  <p className="font-medium">52ms</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Records Synced</p>
                  <p className="font-medium">{hospital.patientCount.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Security</p>
                  <p className="font-medium text-green-600">HIPAA Compliant</p>
                </div>
              </div>
            )}

            {/* Neural Network Animation */}
            <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <circle cx="20" cy="20" r="3" fill="currentColor" className="animate-pulse" />
                <circle cx="80" cy="20" r="3" fill="currentColor" className="animate-pulse delay-100" />
                <circle cx="50" cy="50" r="4" fill="currentColor" className="animate-pulse delay-200" />
                <circle cx="20" cy="80" r="3" fill="currentColor" className="animate-pulse delay-300" />
                <circle cx="80" cy="80" r="3" fill="currentColor" className="animate-pulse delay-400" />
                <line x1="20" y1="20" x2="50" y2="50" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
                <line x1="80" y1="20" x2="50" y2="50" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
                <line x1="20" y1="80" x2="50" y2="50" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
                <line x1="80" y1="80" x2="50" y2="50" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
              </svg>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EMRConnectionModal;