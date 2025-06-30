
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Send, Brain, User, Zap, Target, Cpu, Stethoscope, BookOpen, TrendingUp, Clock } from 'lucide-react';
import { usePatients } from '@/hooks/usePatients';
import { useToast } from '@/hooks/use-toast';

interface ConsultDialogProps {
  open: boolean;
  onClose: () => void;
  hospitalId?: string;
}

type Priority = 'routine' | 'urgent' | 'critical';

const ConsultDialog = ({ open, onClose, hospitalId }: ConsultDialogProps) => {
  const { toast } = useToast();
  const { data: patients } = usePatients(hospitalId);
  const [consultation, setConsultation] = useState('');
  const [selectedPatient, setSelectedPatient] = useState('none');
  const [priority, setPriority] = useState<Priority>('routine');
  const [specialty, setSpecialty] = useState('auto');
  const [aiRecommendations, setAiRecommendations] = useState<any[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const specialties = [
    'Cardiology',
    'Pulmonology', 
    'Neurology',
    'Emergency Medicine',
    'Surgery',
    'Internal Medicine',
    'Orthopedics',
    'Radiology',
    'Pathology',
    'Anesthesiology'
  ];

  // Simulate AI analysis when consultation text changes
  useEffect(() => {
    if (consultation.length > 50) {
      setIsAnalyzing(true);
      const timer = setTimeout(() => {
        setAiRecommendations([
          {
            specialty: 'Cardiology',
            confidence: 85,
            reasoning: 'Chest pain, shortness of breath patterns suggest cardiac evaluation',
            urgency: 'urgent',
            expectedResponse: '15-30 minutes'
          },
          {
            specialty: 'Emergency Medicine',
            confidence: 72,
            reasoning: 'Acute presentation requires immediate assessment',
            urgency: 'critical',
            expectedResponse: '5-10 minutes'
          }
        ]);
        setIsAnalyzing(false);
      }, 1500);
      return () => clearTimeout(timer);
    } else {
      setAiRecommendations([]);
    }
  }, [consultation]);

  const handleConsult = () => {
    console.log('Consult initiated');
    if (!consultation.trim()) {
      toast({
        title: "Clinical Input Required",
        description: "Please describe the clinical scenario for consultation",
        variant: "destructive"
      });
      return;
    }

    const priorityConfig = getPriorityConfig(priority);
    const recommendedSpecialty = aiRecommendations.length > 0 ? aiRecommendations[0].specialty : specialty;

    toast({
      title: "AI Consultation Initiated",
      description: `${priorityConfig.label} consultation routed to ${recommendedSpecialty}${selectedPatient !== 'none' ? ' for selected patient' : ''}`,
    });

    // Reset form
    setConsultation('');
    setSelectedPatient('none');
    setPriority('routine');
    setSpecialty('auto');
    setAiRecommendations([]);
    onClose();
  };

  const getPriorityConfig = (level: Priority) => {
    switch (level) {
      case 'critical':
        return {
          color: 'bg-red-500/20 text-red-200 border-red-400/30',
          icon: <Zap className="h-3 w-3" />,
          label: 'CRITICAL',
          description: 'Immediate specialist attention'
        };
      case 'urgent':
        return {
          color: 'bg-yellow-500/20 text-yellow-200 border-yellow-400/30',
          icon: <Target className="h-3 w-3" />,
          label: 'URGENT',
          description: 'Specialist response within 30 minutes'
        };
      case 'routine':
        return {
          color: 'bg-green-500/20 text-green-200 border-green-400/30',
          icon: <Clock className="h-3 w-3" />,
          label: 'ROUTINE',
          description: 'Standard consultation timeline'
        };
    }
  };

  const priorityConfig = getPriorityConfig(priority);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl backdrop-blur-xl bg-gradient-to-br from-purple-500/20 to-indigo-500/10 border border-purple-300/40 text-white shadow-2xl rounded-2xl">
        <DialogHeader className="border-b border-white/20 pb-4">
          <DialogTitle className="flex items-center gap-2 text-xl font-bold bg-gradient-to-r from-purple-200 to-indigo-200 bg-clip-text text-transparent">
            <Brain className="h-5 w-5 text-purple-400" />
            AI-Powered Clinical Consultation
          </DialogTitle>
          <DialogDescription className="text-white/70">
            Advanced clinical analysis with intelligent specialty routing and evidence-based recommendations
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Priority and Patient Selection Row */}
          <div className="grid grid-cols-2 gap-4">
            {/* Priority Classification */}
            <div className="space-y-2">
              <label className="text-sm text-white/70 font-medium flex items-center gap-2">
                <Target className="h-3 w-3" />
                Consultation Priority
              </label>
              <Select value={priority} onValueChange={(value: Priority) => setPriority(value)}>
                <SelectTrigger className="bg-white/10 border border-white/30 text-white backdrop-blur-sm rounded-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gradient-to-br from-purple-800/95 to-indigo-800/95 border border-purple-400/50 text-white backdrop-blur-xl rounded-lg">
                  <SelectItem value="routine">
                    <div className="flex items-center gap-2">
                      <Clock className="h-3 w-3" />
                      Routine Consultation
                    </div>
                  </SelectItem>
                  <SelectItem value="urgent">
                    <div className="flex items-center gap-2">
                      <Target className="h-3 w-3" />
                      Urgent Consultation
                    </div>
                  </SelectItem>
                  <SelectItem value="critical">
                    <div className="flex items-center gap-2">
                      <Zap className="h-3 w-3" />
                      Critical Consultation
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              <Badge className={`${priorityConfig.color} flex items-center gap-1 w-fit border`}>
                {priorityConfig.icon}
                <span>{priorityConfig.label}</span>
              </Badge>
            </div>

            {/* Patient Selection */}
            <div className="space-y-2">
              <label className="text-sm text-white/70 font-medium flex items-center gap-2">
                <User className="h-3 w-3" />
                Patient Context
              </label>
              <Select value={selectedPatient} onValueChange={setSelectedPatient}>
                <SelectTrigger className="bg-white/10 border border-white/30 text-white backdrop-blur-sm rounded-lg">
                  <SelectValue placeholder="Select patient..." />
                </SelectTrigger>
                <SelectContent className="bg-gradient-to-br from-purple-800/95 to-indigo-800/95 border border-purple-400/50 text-white backdrop-blur-xl rounded-lg">
                  <SelectItem value="none">No patient selected</SelectItem>
                  {patients?.map((patient) => (
                    <SelectItem key={patient.id} value={patient.id}>
                      {patient.first_name} {patient.last_name} - {patient.mrn}
                      {patient.room_number && ` (Room ${patient.room_number})`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Clinical Input */}
          <div className="space-y-2">
            <label className="text-sm text-white/70 font-medium flex items-center gap-2">
              <Stethoscope className="h-3 w-3" />
              Clinical Consultation Request
            </label>
            <Textarea
              value={consultation}
              onChange={(e) => setConsultation(e.target.value)}
              placeholder="Describe the clinical scenario requiring consultation...

Examples:
• 65-year-old male with acute chest pain, diaphoresis, ST elevation in leads II, III, aVF
• Post-operative patient with declining respiratory function, increased oxygen requirements
• Complex medication interactions requiring specialist review"
              className="bg-white/10 border border-white/30 text-white placeholder:text-white/60 min-h-[120px] backdrop-blur-sm rounded-lg"
            />
            <div className="flex items-center gap-2 mt-2">
              <Brain className="h-3 w-3 text-purple-300" />
              <p className="text-xs text-white/60">
                {isAnalyzing ? "Analyzing clinical content..." : "AI Analysis: Pattern Recognition → Differential Diagnosis → Specialty Matching → Expert Routing"}
              </p>
            </div>
          </div>

          {/* AI Recommendations */}
          {aiRecommendations.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Brain className="h-4 w-4 text-purple-400" />
                <span className="text-sm font-medium text-white">AI Recommendations</span>
                <Badge className="bg-purple-500/20 text-purple-200 border border-purple-400/30 text-xs">
                  <TrendingUp className="h-2 w-2 mr-1" />
                  Evidence-Based
                </Badge>
              </div>
              
              <div className="grid gap-2">
                {aiRecommendations.map((rec, index) => (
                  <Card key={index} className="backdrop-blur-xl bg-white/5 border border-white/20 rounded-xl">
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                            <Stethoscope className="h-4 w-4 text-white" />
                          </div>
                          <div>
                            <h3 className="font-medium text-white">{rec.specialty}</h3>
                            <p className="text-xs text-white/60">Expected response: {rec.expectedResponse}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={`text-xs border ${
                            rec.urgency === 'critical' ? 'bg-red-500/20 text-red-200 border-red-400/30' :
                            rec.urgency === 'urgent' ? 'bg-yellow-500/20 text-yellow-200 border-yellow-400/30' :
                            'bg-green-500/20 text-green-200 border-green-400/30'
                          }`}>
                            {rec.urgency.toUpperCase()}
                          </Badge>
                          <Badge className="bg-blue-500/20 text-blue-200 border border-blue-400/30">
                            {rec.confidence}% Match
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-white/80">{rec.reasoning}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Manual Specialty Selection */}
          <div className="space-y-2">
            <label className="text-sm text-white/70 font-medium flex items-center gap-2">
              <BookOpen className="h-3 w-3" />
              Specialty Override (Optional)
            </label>
            <Select value={specialty} onValueChange={setSpecialty}>
              <SelectTrigger className="bg-white/10 border border-white/30 text-white backdrop-blur-sm rounded-lg">
                <SelectValue placeholder="Auto-detect optimal specialty..." />
              </SelectTrigger>
              <SelectContent className="bg-gradient-to-br from-purple-800/95 to-indigo-800/95 border border-purple-400/50 text-white backdrop-blur-xl rounded-lg">
                <SelectItem value="auto">
                  <div className="flex items-center gap-2">
                    <Brain className="h-3 w-3" />
                    AI Auto-Detection
                  </div>
                </SelectItem>
                {specialties.map((spec) => (
                  <SelectItem key={spec} value={spec}>
                    {spec}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Patient Context Preview */}
          {selectedPatient !== 'none' && patients && (
            <div className="p-3 backdrop-blur-xl bg-white/5 border border-white/20 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <User className="h-4 w-4 text-blue-400" />
                <span className="text-sm font-medium text-white">Patient Context Integration</span>
              </div>
              {(() => {
                const patient = patients.find(p => p.id === selectedPatient);
                return patient ? (
                  <div className="text-sm text-white/80 space-y-1">
                    <p><span className="text-blue-300">Patient:</span> {patient.first_name} {patient.last_name}</p>
                    <p><span className="text-blue-300">Location:</span> {patient.room_number || 'Unassigned'}</p>
                    <p><span className="text-blue-300">Conditions:</span> {patient.medical_conditions?.join(', ') || 'None documented'}</p>
                    <p><span className="text-blue-300">Allergies:</span> {patient.allergies?.join(', ') || 'None documented'}</p>
                    <p><span className="text-blue-300">Current Meds:</span> {patient.current_medications?.join(', ') || 'None documented'}</p>
                  </div>
                ) : null;
              })()}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4 border-t border-white/20">
            <Button
              onClick={handleConsult}
              className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white border-0 rounded-lg"
            >
              <Send className="h-4 w-4 mr-2" />
              Initiate AI Consultation
            </Button>
            <Button
              onClick={onClose}
              variant="outline"
              className="bg-white/10 border border-white/30 text-white hover:bg-white/20 backdrop-blur-sm rounded-lg"
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConsultDialog;
