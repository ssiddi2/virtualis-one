
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { usePatients } from '@/hooks/usePatients';
import { useSpecialties, useOnCallSchedules, usePhysicians } from '@/hooks/usePhysicians';
import { useAIAssistant } from '@/hooks/useAIAssistant';
import { useToast } from '@/hooks/use-toast';
import { 
  User, 
  Stethoscope, 
  AlertTriangle, 
  Moon,
  UserCheck,
  Brain,
  Sparkles,
  Activity,
  Phone
} from 'lucide-react';

interface EnhancedConsultDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (consultRequest: any) => void;
}

const EnhancedConsultDialog = ({ open, onClose, onSubmit }: EnhancedConsultDialogProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedPatient, setSelectedPatient] = useState('');
  const [consultationType, setConsultationType] = useState<'new' | 'established'>('');
  const [clinicalQuestion, setClinicalQuestion] = useState('');
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState('');

  const { data: patients } = usePatients();
  const { data: specialties } = useSpecialties();
  const { data: onCallSchedules } = useOnCallSchedules();
  const { data: physicians } = usePhysicians();
  const { callAI } = useAIAssistant();
  const { toast } = useToast();

  // Analyze clinical question with AI
  const analyzeClinicalQuestion = async () => {
    if (!clinicalQuestion.trim() || clinicalQuestion.length < 10) return;

    setIsAnalyzing(true);
    try {
      const patientContext = selectedPatient && patients 
        ? patients.find(p => p.id === selectedPatient) 
        : null;
      
      const contextString = patientContext 
        ? `Patient: ${patientContext.first_name} ${patientContext.last_name}, Age: ${new Date().getFullYear() - new Date(patientContext.date_of_birth).getFullYear()}`
        : 'Clinical consultation context';

      // Mock AI analysis for demo
      const analysisResult = {
        acuity: Math.random() > 0.7 ? 'critical' : Math.random() > 0.4 ? 'urgent' : 'routine',
        priorityScore: Math.floor(Math.random() * 100),
        recommendedSpecialty: ['Cardiology', 'Critical Care', 'Internal Medicine', 'Neurology'][Math.floor(Math.random() * 4)],
        confidence: Math.floor(Math.random() * 30) + 70,
        reasoning: 'Based on clinical presentation and patient history, this consultation requires specialist evaluation.'
      };

      setAiAnalysis(analysisResult);
      setCurrentStep(3);
    } catch (error) {
      console.error('AI Analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmit = () => {
    const consultRequest = {
      patientId: selectedPatient,
      consultationType,
      clinicalQuestion,
      aiAnalysis,
      selectedProvider,
      timestamp: new Date()
    };
    
    onSubmit(consultRequest);
    resetForm();
  };

  const resetForm = () => {
    setCurrentStep(1);
    setSelectedPatient('');
    setConsultationType('');
    setClinicalQuestion('');
    setAiAnalysis(null);
    setSelectedProvider('');
    setIsAnalyzing(false);
    onClose();
  };

  const onCallPhysicians = onCallSchedules?.slice(0, 3) || [];
  const nocturnists = physicians?.filter(p => 
    p.specialty?.name.toLowerCase().includes('nocturnist')
  ).slice(0, 2) || [];
  const primaryAttending = physicians?.find(p => 
    p.specialty?.name.toLowerCase().includes('internal medicine')
  ) || physicians?.[0];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl backdrop-blur-xl bg-gradient-to-br from-blue-500/30 to-purple-500/20 border border-blue-300/40 text-white shadow-2xl rounded-2xl">
        <DialogHeader className="border-b border-white/20 pb-4">
          <DialogTitle className="text-white text-xl font-bold bg-gradient-to-r from-blue-200 to-purple-200 bg-clip-text text-transparent flex items-center gap-2">
            REQUEST CONSULT
            {isAnalyzing && <Sparkles className="h-5 w-5 text-cyan-300 animate-pulse" />}
          </DialogTitle>
        </DialogHeader>

        <Card className="backdrop-blur-sm bg-white/5 border border-white/20 rounded-xl">
          <CardContent className="p-6 space-y-6">
            {/* Step 1: Patient Selection */}
            {currentStep >= 1 && (
              <div className="space-y-3">
                <label className="text-sm text-white/70 font-medium">Step 1: Select Patient</label>
                <Select value={selectedPatient} onValueChange={setSelectedPatient}>
                  <SelectTrigger className="bg-white/10 border border-white/30 text-white backdrop-blur-sm rounded-lg">
                    <SelectValue placeholder="Choose patient..." />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800/95 backdrop-blur-xl border-slate-600 text-white rounded-lg">
                    {patients?.map((patient) => (
                      <SelectItem key={patient.id} value={patient.id}>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          {patient.first_name} {patient.last_name} - {patient.mrn}
                          {patient.room_number && ` (Room ${patient.room_number})`}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Step 2: Consultation Type */}
            {currentStep >= 1 && selectedPatient && (
              <div className="space-y-3">
                <label className="text-sm text-white/70 font-medium">Step 2: Consultation Type</label>
                <div className="flex gap-2">
                  <Button
                    onClick={() => {setConsultationType('new'); setCurrentStep(2);}}
                    className={`${consultationType === 'new' 
                      ? 'bg-blue-600/50 hover:bg-blue-600/70 border-blue-400/50' 
                      : 'bg-white/10 hover:bg-white/20 border-white/30'
                    } backdrop-blur-sm border rounded-lg`}
                  >
                    <UserCheck className="h-4 w-4 mr-2" />
                    New Consult
                  </Button>
                  <Button
                    onClick={() => {setConsultationType('established'); setCurrentStep(2);}}
                    className={`${consultationType === 'established' 
                      ? 'bg-blue-600/50 hover:bg-blue-600/70 border-blue-400/50' 
                      : 'bg-white/10 hover:bg-white/20 border-white/30'
                    } backdrop-blur-sm border rounded-lg`}
                  >
                    <User className="h-4 w-4 mr-2" />
                    Established Patient
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Clinical Question */}
            {currentStep >= 2 && consultationType && (
              <div className="space-y-3">
                <label className="text-sm text-white/70 font-medium">Step 3: Reason for Consultation</label>
                {isAnalyzing && (
                  <div className="p-2 bg-cyan-500/10 border border-cyan-400/30 rounded-lg">
                    <div className="flex items-center gap-2 text-cyan-200 text-sm">
                      <Activity className="h-4 w-4 animate-pulse" />
                      <span>AI analyzing clinical question...</span>
                    </div>
                  </div>
                )}
                <Textarea
                  value={clinicalQuestion}
                  onChange={(e) => setClinicalQuestion(e.target.value)}
                  placeholder="Describe the clinical situation and specific question..."
                  className="bg-white/10 border border-white/30 text-white placeholder:text-white/60 min-h-[100px] backdrop-blur-sm rounded-lg"
                />
                {clinicalQuestion.length > 10 && !aiAnalysis && (
                  <Button
                    onClick={analyzeClinicalQuestion}
                    disabled={isAnalyzing}
                    className="bg-purple-600/50 hover:bg-purple-600/70 border border-purple-400/30 backdrop-blur-sm rounded-lg"
                  >
                    <Brain className="h-4 w-4 mr-2" />
                    Analyze with AI
                  </Button>
                )}
              </div>
            )}

            {/* Step 4: AI Analysis Results */}
            {aiAnalysis && (
              <div className="space-y-4">
                <div className="p-4 bg-cyan-500/10 border border-cyan-400/30 rounded-xl">
                  <div className="flex items-center gap-2 mb-3">
                    <Brain className="h-5 w-5 text-cyan-300" />
                    <span className="text-cyan-200 font-medium">AI Recommendation</span>
                    <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-400/30 text-xs">
                      {aiAnalysis.confidence}% confidence
                    </Badge>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-white/70">Recommended Priority:</span>
                      <Badge className={`${aiAnalysis.acuity === 'critical' ? 'bg-red-500/20 text-red-300' : 
                        aiAnalysis.acuity === 'urgent' ? 'bg-yellow-500/20 text-yellow-300' : 
                        'bg-green-500/20 text-green-300'} border border-current/30`}>
                        {aiAnalysis.acuity.toUpperCase()} - Score: {aiAnalysis.priorityScore}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-white/70">Recommended Specialty:</span>
                      <Badge className="bg-purple-500/20 text-purple-300 border-purple-400/30">
                        {aiAnalysis.recommendedSpecialty}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Available Providers */}
                <div className="space-y-3">
                  <label className="text-sm text-white/70 font-medium">Step 4: Select Provider</label>
                  
                  {/* On-Call Specialists */}
                  {onCallPhysicians.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm text-green-300 font-medium flex items-center gap-2">
                        <Stethoscope className="h-4 w-4" />
                        On-Call Specialists
                      </h4>
                      {onCallPhysicians.map((schedule) => (
                        <div
                          key={schedule.id}
                          className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                            selectedProvider === schedule.physician.id
                              ? 'bg-green-600/20 border-green-500'
                              : 'bg-white/5 border-white/20 hover:border-green-500/50'
                          }`}
                          onClick={() => setSelectedProvider(schedule.physician.id)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Stethoscope className="h-4 w-4 text-green-400" />
                              <span className="font-medium">
                                {schedule.physician.first_name} {schedule.physician.last_name}
                              </span>
                              <Badge className="bg-green-600/20 text-green-300 border-green-400/30 text-xs">
                                {schedule.specialty.name}
                              </Badge>
                            </div>
                            <span className="text-sm text-white/70">{schedule.physician.phone}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Nocturnist */}
                  {nocturnists.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm text-indigo-300 font-medium flex items-center gap-2">
                        <Moon className="h-4 w-4" />
                        Nocturnist
                      </h4>
                      {nocturnists.map((physician) => (
                        <div
                          key={physician.id}
                          className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                            selectedProvider === physician.id
                              ? 'bg-indigo-600/20 border-indigo-500'
                              : 'bg-white/5 border-white/20 hover:border-indigo-500/50'
                          }`}
                          onClick={() => setSelectedProvider(physician.id)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Moon className="h-4 w-4 text-indigo-400" />
                              <span className="font-medium">
                                {physician.first_name} {physician.last_name}
                              </span>
                              <Badge className="bg-indigo-600/20 text-indigo-300 border-indigo-400/30 text-xs">
                                On Call Tonight
                              </Badge>
                            </div>
                            <span className="text-sm text-white/70">{physician.phone}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Primary Attending */}
                  {primaryAttending && (
                    <div className="space-y-2">
                      <h4 className="text-sm text-blue-300 font-medium flex items-center gap-2">
                        <UserCheck className="h-4 w-4" />
                        Primary Attending
                      </h4>
                      <div
                        className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                          selectedProvider === primaryAttending.id
                            ? 'bg-blue-600/20 border-blue-500'
                            : 'bg-white/5 border-white/20 hover:border-blue-500/50'
                        }`}
                        onClick={() => setSelectedProvider(primaryAttending.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <UserCheck className="h-4 w-4 text-blue-400" />
                            <span className="font-medium">
                              {primaryAttending.first_name} {primaryAttending.last_name}
                            </span>
                            <Badge className="bg-blue-600/20 text-blue-300 border-blue-400/30 text-xs">
                              Primary Attending
                            </Badge>
                          </div>
                          <span className="text-sm text-white/70">{primaryAttending.phone}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t border-white/20">
          <Button
            onClick={handleSubmit}
            disabled={!selectedPatient || !consultationType || !clinicalQuestion.trim() || !selectedProvider}
            className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white backdrop-blur-sm border border-green-400/30 rounded-lg"
          >
            <Phone className="h-4 w-4 mr-2" />
            Send Consult Request
          </Button>
          <Button
            onClick={resetForm}
            className="bg-white/10 hover:bg-white/20 border border-white/30 text-white backdrop-blur-sm rounded-lg"
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EnhancedConsultDialog;
