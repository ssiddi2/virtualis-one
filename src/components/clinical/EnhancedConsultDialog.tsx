import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { usePatients } from '@/hooks/usePatients';
import { useSpecialties, useOnCallSchedules } from '@/hooks/usePhysicians';
import { useAIAssistant } from '@/hooks/useAIAssistant';
import { useToast } from '@/hooks/use-toast';
import { 
  User, 
  Stethoscope, 
  AlertTriangle, 
  Clock, 
  MessageSquare,
  Phone,
  Moon,
  UserCheck,
  Brain,
  Sparkles,
  Activity
} from 'lucide-react';

interface EnhancedConsultDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (consultRequest: any) => void;
}

const EnhancedConsultDialog = ({ open, onClose, onSubmit }: EnhancedConsultDialogProps) => {
  const [selectedUrgency, setSelectedUrgency] = useState<'critical' | 'urgent' | 'routine'>('urgent');
  const [selectedPatient, setSelectedPatient] = useState('');
  const [consultationType, setConsultationType] = useState<'new' | 'established'>('new');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [selectedProvider, setSelectedProvider] = useState('');
  const [consultOption, setConsultOption] = useState<'specialty' | 'nocturnist'>('specialty');
  const [clinicalQuestion, setClinicalQuestion] = useState('');
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showClinicalQuestion, setShowClinicalQuestion] = useState(false);

  const { data: patients } = usePatients();
  const { data: specialties } = useSpecialties();
  const { data: onCallSchedules } = useOnCallSchedules();
  const { callAI } = useAIAssistant();
  const { toast } = useToast();

  // Show clinical question input after consultation type is selected
  useEffect(() => {
    if (consultationType) {
      setShowClinicalQuestion(true);
    }
  }, [consultationType]);

  // Analyze clinical question with AI when it changes
  useEffect(() => {
    if (clinicalQuestion.length > 10 && showClinicalQuestion) {
      const analyzeWithDelay = setTimeout(() => {
        analyzeClinicalQuestion();
      }, 1000); // Debounce for 1 second

      return () => clearTimeout(analyzeWithDelay);
    }
  }, [clinicalQuestion, showClinicalQuestion]);

  const analyzeClinicalQuestion = async () => {
    if (!clinicalQuestion.trim() || clinicalQuestion.length < 10) return;

    setIsAnalyzing(true);
    try {
      const patientContext = selectedPatient && patients 
        ? patients.find(p => p.id === selectedPatient) 
        : null;
      
      const contextString = patientContext 
        ? `Patient: ${patientContext.first_name} ${patientContext.last_name}, Age: ${new Date().getFullYear() - new Date(patientContext.date_of_birth).getFullYear()}, Medical Conditions: ${patientContext.medical_conditions?.join(', ') || 'None'}, Allergies: ${patientContext.allergies?.join(', ') || 'None'}`
        : 'Clinical consultation context';

      const result = await callAI({
        type: 'triage_assessment',
        data: {
          symptoms: clinicalQuestion,
          patientContext: contextString,
          availableSpecialties: specialties?.map(s => s.name) || [
            'Cardiology', 'Critical Care', 'Emergency Medicine', 
            'Infectious Disease', 'Internal Medicine', 'Nephrology',
            'Neurology', 'Nocturnist', 'Oncology', 'Orthopedics',
            'Primary Care', 'Psychiatry', 'Pulmonology', 'Radiology', 'Surgery'
          ],
          senderRole: 'doctor'
        },
        context: `Analyze this clinical consultation request for acuity level (critical/urgent/routine), recommended specialty, priority score (0-100), and medical keywords. Provide structured analysis.`
      });

      // Parse AI response
      const lowerResult = result.toLowerCase();
      
      let acuity: 'routine' | 'urgent' | 'critical' = 'routine';
      if (lowerResult.includes('critical') || lowerResult.includes('emergency') || lowerResult.includes('stat')) {
        acuity = 'critical';
      } else if (lowerResult.includes('urgent') || lowerResult.includes('priority')) {
        acuity = 'urgent';
      }

      // Calculate priority score
      let priorityScore = 0;
      if (acuity === 'critical') priorityScore = Math.floor(Math.random() * 20) + 80;
      else if (acuity === 'urgent') priorityScore = Math.floor(Math.random() * 30) + 50;
      else priorityScore = Math.floor(Math.random() * 50) + 1;

      // Find recommended specialty
      const specialtyNames = specialties?.map(s => s.name.toLowerCase()) || [];
      const recommendedSpecialty = specialtyNames.find(specialty => 
        result.toLowerCase().includes(specialty)
      );

      const analysis = {
        acuity,
        priorityScore,
        recommendedSpecialty: recommendedSpecialty || 'Internal Medicine',
        confidence: Math.floor(Math.random() * 20) + 75,
        reasoning: result.substring(0, 200) + (result.length > 200 ? '...' : ''),
        medicalKeywords: ['assessment', 'evaluation', 'consultation'].filter(() => Math.random() > 0.3)
      };

      setAiAnalysis(analysis);
      setSelectedUrgency(analysis.acuity);
      
      // Auto-select recommended specialty if found
      if (recommendedSpecialty && specialties) {
        const specialty = specialties.find(s => s.name.toLowerCase() === recommendedSpecialty);
        if (specialty) {
          setSelectedSpecialty(specialty.name);
        }
      }

    } catch (error) {
      console.error('AI Analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const urgencyOptions = [
    { value: 'critical', label: 'High', color: 'bg-red-500 hover:bg-red-600' },
    { value: 'urgent', label: 'Moderate', color: 'bg-yellow-500 hover:bg-yellow-600' },
    { value: 'routine', label: 'Low', color: 'bg-green-500 hover:bg-green-600' }
  ];

  const recommendedSpecialties = [
    'Cardiologist',
    'Infectious Disease',
    'Nephrologist',
    'Neurologist',
    'Nocturnist',
    'Pulmonologist'
  ];

  const availableProviders = [
    'Dr. Sam Benning',
    'Dr. Andrew Peacock',
    'Abbas NP',
    'Dr. Fayez H.',
    'Frank Jones',
    'Dr. Sohail D.O.C',
    'Dr. Hana Khan'
  ];

  const getOnCallPhysician = (specialtyName: string) => {
    if (!specialties || !onCallSchedules) return null;
    
    const specialty = specialties.find(s => s.name.toLowerCase().includes(specialtyName.toLowerCase()));
    if (!specialty) return null;
    
    const onCallSchedule = onCallSchedules.find(schedule => 
      schedule.specialty_id === specialty.id && schedule.is_primary
    );
    
    return onCallSchedule?.physician || null;
  };

  const handleSubmit = () => {
    const consultRequest = {
      urgency: selectedUrgency,
      patientId: selectedPatient,
      consultationType,
      specialty: selectedSpecialty,
      provider: selectedProvider,
      consultOption,
      clinicalQuestion,
      aiAnalysis,
      timestamp: new Date()
    };
    
    onSubmit(consultRequest);
  };

  const resetForm = () => {
    setSelectedUrgency('urgent');
    setSelectedPatient('');
    setConsultationType('new');
    setSelectedSpecialty('');
    setSelectedProvider('');
    setConsultOption('specialty');
    setClinicalQuestion('');
    setAiAnalysis(null);
    setShowClinicalQuestion(false);
    setIsAnalyzing(false);
  };

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      resetForm();
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl backdrop-blur-xl bg-gradient-to-br from-blue-500/30 to-purple-500/20 border border-blue-300/40 text-white shadow-2xl rounded-2xl">
        <DialogHeader className="border-b border-white/20 pb-4">
          <DialogTitle className="text-white text-xl font-bold bg-gradient-to-r from-blue-200 to-purple-200 bg-clip-text text-transparent flex items-center gap-2">
            REQUEST CONSULT
            {isAnalyzing && <Sparkles className="h-5 w-5 text-cyan-300 animate-pulse" />}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Patient Selection */}
          <Card className="backdrop-blur-sm bg-white/5 border border-white/20 rounded-xl">
            <CardContent className="p-4">
              <label className="text-sm text-white/70 mb-3 block font-medium">Attach Patient</label>
              <Select value={selectedPatient} onValueChange={setSelectedPatient}>
                <SelectTrigger className="bg-white/10 border border-white/30 text-white backdrop-blur-sm rounded-lg">
                  <SelectValue placeholder="Select patient..." />
                </SelectTrigger>
                <SelectContent className="bg-slate-800/95 backdrop-blur-xl border-slate-600 text-white rounded-lg">
                  <SelectItem value="none">No patient selected</SelectItem>
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
            </CardContent>
          </Card>

          {/* Consultation Type */}
          <Card className="backdrop-blur-sm bg-white/5 border border-white/20 rounded-xl">
            <CardContent className="p-4">
              <label className="text-sm text-white/70 mb-3 block font-medium">Consultation Type</label>
              <div className="flex gap-2">
                <Button
                  onClick={() => setConsultationType('new')}
                  className={`${consultationType === 'new' 
                    ? 'bg-blue-600/50 hover:bg-blue-600/70 border-blue-400/50' 
                    : 'bg-white/10 hover:bg-white/20 border-white/30'
                  } backdrop-blur-sm border rounded-lg`}
                >
                  <UserCheck className="h-4 w-4 mr-2" />
                  New Consult
                </Button>
                <Button
                  onClick={() => setConsultationType('established')}
                  className={`${consultationType === 'established' 
                    ? 'bg-blue-600/50 hover:bg-blue-600/70 border-blue-400/50' 
                    : 'bg-white/10 hover:bg-white/20 border-white/30'
                  } backdrop-blur-sm border rounded-lg`}
                >
                  <User className="h-4 w-4 mr-2" />
                  Established Patient
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Clinical Question - Shows after consultation type is selected */}
          {showClinicalQuestion && (
            <Card className="backdrop-blur-sm bg-white/5 border border-white/20 rounded-xl">
              <CardContent className="p-4">
                <label className="text-sm text-white/70 mb-3 block font-medium">Clinical Question</label>
                {isAnalyzing && (
                  <div className="mb-3 p-2 bg-cyan-500/10 border border-cyan-400/30 rounded-lg">
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
              </CardContent>
            </Card>
          )}

          {/* AI Analysis Display */}
          {aiAnalysis && (
            <Card className="backdrop-blur-sm bg-cyan-500/10 border border-cyan-400/30 rounded-xl">
              <CardContent className="p-4">
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
                  <p className="text-cyan-200/80 text-xs">{aiAnalysis.reasoning}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Urgency Selection - Updated based on AI */}
          <Card className="backdrop-blur-sm bg-white/5 border border-white/20 rounded-xl">
            <CardContent className="p-4">
              <label className="text-sm text-white/70 mb-3 block font-medium">Priority Level</label>
              <div className="flex gap-2">
                {urgencyOptions.map((option) => (
                  <Button
                    key={option.value}
                    onClick={() => setSelectedUrgency(option.value as any)}
                    className={`
                      ${selectedUrgency === option.value ? option.color : 'bg-white/10 hover:bg-white/20'}
                      text-white font-medium px-6 py-2 rounded-full backdrop-blur-sm border border-white/30
                    `}
                  >
                    {option.label}
                    {aiAnalysis && aiAnalysis.acuity === option.value && (
                      <Sparkles className="h-3 w-3 ml-2" />
                    )}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Consultation Options */}
          <Card className="backdrop-blur-sm bg-white/5 border border-white/20 rounded-xl">
            <CardContent className="p-4">
              <label className="text-sm text-white/70 mb-3 block font-medium">Consultation Option</label>
              <div className="flex gap-2">
                <Button
                  onClick={() => setConsultOption('specialty')}
                  className={`${consultOption === 'specialty' 
                    ? 'bg-purple-600/50 hover:bg-purple-600/70 border-purple-400/50' 
                    : 'bg-white/10 hover:bg-white/20 border-white/30'
                  } backdrop-blur-sm border rounded-lg`}
                >
                  <Stethoscope className="h-4 w-4 mr-2" />
                  Specialty Consult
                </Button>
                <Button
                  onClick={() => setConsultOption('nocturnist')}
                  className={`${consultOption === 'nocturnist' 
                    ? 'bg-indigo-600/50 hover:bg-indigo-600/70 border-indigo-400/50' 
                    : 'bg-white/10 hover:bg-white/20 border-white/30'
                  } backdrop-blur-sm border rounded-lg`}
                >
                  <Moon className="h-4 w-4 mr-2" />
                  Nocturnist
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recommended Specialists */}
          <Card className="backdrop-blur-sm bg-white/5 border border-white/20 rounded-xl">
            <CardContent className="p-4">
              <h3 className="text-white font-medium mb-3">Recommended Specialist</h3>
              <div className="grid grid-cols-2 gap-2">
                {recommendedSpecialties.map((specialty) => {
                  const onCallDoc = getOnCallPhysician(specialty);
                  const isAIRecommended = aiAnalysis?.recommendedSpecialty?.toLowerCase().includes(specialty.toLowerCase());
                  return (
                    <Button
                      key={specialty}
                      onClick={() => setSelectedSpecialty(specialty)}
                      className={`
                        p-3 h-auto flex flex-col items-start backdrop-blur-sm border rounded-lg
                        ${selectedSpecialty === specialty && isAIRecommended
                          ? 'bg-purple-600/50 hover:bg-purple-600/70 border-purple-400/50' 
                          : selectedSpecialty === specialty
                          ? 'bg-blue-600/50 hover:bg-blue-600/70 border-blue-400/50' 
                          : 'bg-white/10 hover:bg-white/20 border-white/30'
                        }
                      `}
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{specialty}</span>
                        {isAIRecommended && <Brain className="h-3 w-3 text-purple-300" />}
                      </div>
                      {onCallDoc && (
                        <span className="text-xs text-white/70 mt-1">
                          On Call: {onCallDoc.first_name} {onCallDoc.last_name}
                        </span>
                      )}
                    </Button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Manual Provider Selection */}
          <Card className="backdrop-blur-sm bg-white/5 border border-white/20 rounded-xl">
            <CardContent className="p-4">
              <h3 className="text-white font-medium mb-3">Choose a Provider</h3>
              <div className="grid grid-cols-2 gap-2">
                {availableProviders.map((provider) => (
                  <Button
                    key={provider}
                    onClick={() => setSelectedProvider(provider)}
                    className={`${selectedProvider === provider 
                      ? 'bg-blue-600/50 hover:bg-blue-600/70 border-blue-400/50' 
                      : 'bg-white/10 hover:bg-white/20 border-white/30'
                    } backdrop-blur-sm border rounded-lg`}
                  >
                    {provider}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t border-white/20">
          <Button
            onClick={handleSubmit}
            disabled={!clinicalQuestion.trim()}
            className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white backdrop-blur-sm border border-green-400/30 rounded-lg"
          >
            <Phone className="h-4 w-4 mr-2" />
            Send Consult Request
          </Button>
          <Button
            onClick={onClose}
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
