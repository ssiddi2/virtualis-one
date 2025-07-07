import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  Database, 
  Brain, 
  CheckCircle, 
  Wifi, 
  Lock,
  Activity,
  Zap,
  Globe,
  Server,
  Settings,
  Eye
} from 'lucide-react';
import { EnhancedHospital } from '@/types/hospital';

interface EMRConnectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  hospital: EnhancedHospital | null;
  onConnectionComplete: () => void;
}

interface ConnectionStage {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  duration: number;
  progress: number;
  status: 'pending' | 'active' | 'complete' | 'error';
}

const EMRConnectionModal: React.FC<EMRConnectionModalProps> = ({
  isOpen,
  onClose,
  hospital,
  onConnectionComplete
}) => {
  const [currentStage, setCurrentStage] = useState(0);
  const [overallProgress, setOverallProgress] = useState(0);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionComplete, setConnectionComplete] = useState(false);

  const connectionStages: ConnectionStage[] = [
    {
      id: 'auth',
      label: 'Authentication',
      description: 'Establishing secure connection protocols',
      icon: <Shield className="h-5 w-5" />,
      duration: 2000,
      progress: 0,
      status: 'pending'
    },
    {
      id: 'handshake',
      label: 'EMR Handshake',
      description: `Connecting to ${hospital?.emrType} systems`,
      icon: <Database className="h-5 w-5" />,
      duration: 3000,
      progress: 0,
      status: 'pending'
    },
    {
      id: 'sync',
      label: 'Data Synchronization',
      description: 'Syncing patient data and medical records',
      icon: <Activity className="h-5 w-5" />,
      duration: 2500,
      progress: 0,
      status: 'pending'
    },
    {
      id: 'ai_calibration',
      label: 'AI Calibration',
      description: 'Initializing Virtualis AI clinical support',
      icon: <Brain className="h-5 w-5" />,
      duration: 2000,
      progress: 0,
      status: 'pending'
    },
    {
      id: 'ready',
      label: 'System Ready',
      description: 'EMR connection established successfully',
      icon: <CheckCircle className="h-5 w-5" />,
      duration: 1000,
      progress: 0,
      status: 'pending'
    }
  ];

  const [stages, setStages] = useState(connectionStages);

  useEffect(() => {
    if (isOpen && hospital && !isConnecting) {
      setIsConnecting(true);
      setCurrentStage(0);
      setOverallProgress(0);
      setConnectionComplete(false);
      
      // Reset all stages
      setStages(connectionStages.map(stage => ({ ...stage, progress: 0, status: 'pending' })));
      
      startConnectionSequence();
    }
  }, [isOpen, hospital]);

  const startConnectionSequence = () => {
    const processStage = (stageIndex: number) => {
      if (stageIndex >= connectionStages.length) {
        setConnectionComplete(true);
        setTimeout(() => {
          onConnectionComplete();
          onClose();
        }, 1500);
        return;
      }

      setCurrentStage(stageIndex);
      
      // Update stage status to active
      setStages(prev => prev.map((stage, index) => ({
        ...stage,
        status: index === stageIndex ? 'active' : index < stageIndex ? 'complete' : 'pending'
      })));

      const stageDuration = connectionStages[stageIndex].duration;
      const progressInterval = 50; // Update every 50ms
      const steps = stageDuration / progressInterval;
      let currentStep = 0;

      const progressTimer = setInterval(() => {
        currentStep++;
        const stageProgress = (currentStep / steps) * 100;
        
        // Update stage progress
        setStages(prev => prev.map((stage, index) => ({
          ...stage,
          progress: index === stageIndex ? Math.min(stageProgress, 100) : 
                   index < stageIndex ? 100 : 0
        })));

        // Update overall progress
        const completedStages = stageIndex;
        const currentStageProgress = stageProgress / 100;
        const totalProgress = ((completedStages + currentStageProgress) / connectionStages.length) * 100;
        setOverallProgress(totalProgress);

        if (currentStep >= steps) {
          clearInterval(progressTimer);
          
          // Mark stage as complete
          setStages(prev => prev.map((stage, index) => ({
            ...stage,
            status: index === stageIndex ? 'complete' : stage.status,
            progress: index === stageIndex ? 100 : stage.progress
          })));
          
          // Move to next stage after a brief pause
          setTimeout(() => processStage(stageIndex + 1), 300);
        }
      }, progressInterval);
    };

    // Start with first stage
    processStage(0);
  };

  if (!hospital) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl p-0 bg-transparent border-0 shadow-none">
        <div className="relative">
          {/* Background particles */}
          <div className="absolute inset-0 overflow-hidden rounded-3xl">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-primary/30 rounded-full animate-float"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 4}s`,
                  animationDuration: `${4 + Math.random() * 2}s`
                }}
              />
            ))}
          </div>

          {/* Main glass card */}
          <div className="relative backdrop-blur-3xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-3xl p-8 shadow-2xl">
            {/* Holographic glow effect */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-primary/10 via-transparent to-virtualis-purple/10 opacity-60" />
            
            {/* Header */}
            <div className="relative z-10 text-center mb-8">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-primary to-virtualis-purple rounded-2xl flex items-center justify-center shadow-lg">
                <Database className="h-8 w-8 text-white" />
              </div>
              
              <h2 className="text-2xl font-bold text-white mb-2">
                Establishing EMR Connection
              </h2>
              <p className="text-white/70 mb-4">
                Connecting to {hospital.name} - {hospital.emrType}
              </p>
              
              {/* Hospital badges */}
              <div className="flex justify-center gap-2 mb-6">
                <Badge className="bg-primary/20 text-primary border-primary/30">
                  <Wifi className="h-3 w-3 mr-1" />
                  {hospital.status}
                </Badge>
                {hospital.virtualisEnabled && (
                  <Badge className="bg-virtualis-purple/20 text-virtualis-purple border-virtualis-purple/30">
                    <Brain className="h-3 w-3 mr-1" />
                    Virtualis AI
                  </Badge>
                )}
                <Badge className="bg-virtualis-gold/20 text-virtualis-gold border-virtualis-gold/30">
                  <Lock className="h-3 w-3 mr-1" />
                  Secure
                </Badge>
              </div>
            </div>

            {/* Overall progress */}
            <div className="relative z-10 mb-8">
              <div className="flex justify-between items-center mb-2">
                <span className="text-white/80 text-sm">Overall Progress</span>
                <span className="text-white font-medium">{Math.round(overallProgress)}%</span>
              </div>
              <Progress 
                value={overallProgress} 
                className="h-3 bg-white/10 border border-white/20"
              />
            </div>

            {/* Connection stages */}
            <div className="relative z-10 space-y-4">
              {stages.map((stage, index) => (
                <div
                  key={stage.id}
                  className={`flex items-center p-4 rounded-xl border transition-all duration-500 ${
                    stage.status === 'active' 
                      ? 'bg-primary/10 border-primary/30 shadow-lg shadow-primary/20' 
                      : stage.status === 'complete'
                      ? 'bg-success/10 border-success/30'
                      : 'bg-white/5 border-white/10'
                  }`}
                >
                  {/* Stage icon */}
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-4 transition-all duration-300 ${
                    stage.status === 'active'
                      ? 'bg-primary text-white animate-pulse-glow'
                      : stage.status === 'complete'
                      ? 'bg-success text-white'
                      : 'bg-white/10 text-white/60'
                  }`}>
                    {stage.status === 'complete' ? <CheckCircle className="h-5 w-5" /> : stage.icon}
                  </div>

                  {/* Stage content */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-white font-medium">{stage.label}</h3>
                      {stage.status === 'active' && (
                        <div className="flex items-center gap-1">
                          <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                          <span className="text-primary text-sm">Connecting...</span>
                        </div>
                      )}
                      {stage.status === 'complete' && (
                        <CheckCircle className="h-4 w-4 text-success" />
                      )}
                    </div>
                    <p className="text-white/60 text-sm mb-2">{stage.description}</p>
                    
                    {/* Stage progress bar */}
                    {(stage.status === 'active' || stage.status === 'complete') && (
                      <Progress 
                        value={stage.progress} 
                        className={`h-1 ${
                          stage.status === 'complete' 
                            ? 'bg-success/20' 
                            : 'bg-primary/20'
                        }`}
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Connection complete state */}
            {connectionComplete && (
              <div className="relative z-10 mt-6 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-success rounded-full flex items-center justify-center animate-bounce-gentle">
                  <CheckCircle className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Connection Established</h3>
                <p className="text-success">EMR system is ready for clinical use</p>
              </div>
            )}

            {/* Neural network visualization */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
              <svg className="w-full h-full" viewBox="0 0 400 300">
                {/* Connection lines */}
                <g stroke="currentColor" strokeWidth="1" fill="none" className="text-primary/30">
                  <path d="M50,50 Q200,100 350,50" className="animate-pulse" />
                  <path d="M50,150 Q200,100 350,150" className="animate-pulse" style={{ animationDelay: '0.5s' }} />
                  <path d="M50,250 Q200,200 350,250" className="animate-pulse" style={{ animationDelay: '1s' }} />
                </g>
                
                {/* Nodes */}
                <g fill="currentColor" className="text-primary/40">
                  <circle cx="50" cy="50" r="3" className="animate-pulse" />
                  <circle cx="200" cy="100" r="4" className="animate-pulse" style={{ animationDelay: '0.2s' }} />
                  <circle cx="350" cy="50" r="3" className="animate-pulse" style={{ animationDelay: '0.4s' }} />
                  <circle cx="50" cy="150" r="3" className="animate-pulse" style={{ animationDelay: '0.6s' }} />
                  <circle cx="350" cy="150" r="3" className="animate-pulse" style={{ animationDelay: '0.8s' }} />
                  <circle cx="50" cy="250" r="3" className="animate-pulse" style={{ animationDelay: '1s' }} />
                  <circle cx="200" cy="200" r="4" className="animate-pulse" style={{ animationDelay: '1.2s' }} />
                  <circle cx="350" cy="250" r="3" className="animate-pulse" style={{ animationDelay: '1.4s' }} />
                </g>
              </svg>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EMRConnectionModal;