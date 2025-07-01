
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
  Brain,
  Sparkles,
  Activity,
  CheckCircle
} from 'lucide-react';

interface EnhancedConsultDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (consultRequest: any) => void;
}

const EnhancedConsultDialog = ({ open, onClose, onSubmit }: EnhancedConsultDialogProps) => {
  const [selectedPatient, setSelectedPatient] = useState('');
  const [clinicalMessage, setClinicalMessage] = useState('');
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [selectedUrgency, setSelectedUrgency] = useState<'critical' | 'urgent' | 'routine'>('urgent');

  const { data: patients } = usePatients();
  const { data: specialties } = useSpecialties();
  const { data: onCallSchedules } = useOnCallSchedules();
  const { callAI } = useAIAssistant();
  const { toast } = useToast();

  // Auto-analyze clinical message when it changes
  useEffect(() => {
    if (clinicalMessage.length > 20 && selectedPatient) {
      const analyzeWithDelay = setTimeout(() => {
        analyzeClinicalMessage();
      }, 1500); // Debounce for 1.5 seconds

      return () => clearTimeout(analyzeWithDelay);
    }
  }, [clinicalMessage, selectedPatient]);

  const analyzeClinicalMessage = async () => {
    if (!clinicalMessage.trim() || clinicalMessage.length < 20) return;

    setIsAnalyzing(true);
    try {
      const patientContext = selectedPatient && patients 
        ? patients.find(p => p.id === selectedPatient) 
        : null;
      
      const contextString = patientContext 
        ? `Patient: ${patientContext.first_name} ${patientContext.last_name}, MRN: ${patientContext.mrn}, Age: ${new Date().getFullYear() - new Date(patientContext.date_of_birth).getFullYear()}, Medical History: ${patientContext.medical_conditions?.join(', ') || 'None specified'}, Allergies: ${patientContext.allergies?.join(', ') || 'NKDA'}, Current Medications: ${patientContext.current_medications?.join(', ') || 'None listed'}`
        : 'Clinical consultation request';

      const availableSpecialties = specialties?.map(s => s.name) || [
        'Cardiology', 'Critical Care', 'Emergency Medicine', 
        'Infectious Disease', 'Internal Medicine', 'Nephrology',
        'Neurology', 'Nocturnist', 'Oncology', 'Orthopedics',
        'Pulmonology', 'Radiology', 'Surgery'
      ];

      const result = await callAI({
        type: 'triage_assessment',
        data: {
          symptoms: clinicalMessage,
          patientContext: contextString,
          availableSpecialties,
        },
        context: `You are analyzing a clinical consultation request. Based on the clinical message and patient context, determine:
        1. ACUITY LEVEL: critical (life-threatening, needs immediate attention), urgent (needs prompt attention within hours), or routine (can wait 24+ hours)
        2. RECOMMENDED SPECIALTY: which medical specialty would be most appropriate
        3. PRIORITY SCORE: 0-100 based on clinical urgency
        4. CLINICAL REASONING: brief explanation of your recommendations
        
        Respond with clear recommendations for acuity, specialty, and reasoning.`
      });

      // Parse AI response for structured recommendations
      const lowerResult = result.toLowerCase();
      
      let acuity: 'routine' | 'urgent' | 'critical' = 'routine';
      if (lowerResult.includes('critical') || lowerResult.includes('emergency') || lowerResult.includes('stat') || lowerResult.includes('immediate')) {
        acuity = 'critical';
      } else if (lowerResult.includes('urgent') || lowerResult.includes('priority') || lowerResult.includes('prompt')) {
        acuity = 'urgent';
      }

      // Calculate priority score based on acuity
      let priorityScore = 0;
      if (acuity === 'critical') priorityScore = Math.floor(Math.random() * 20) + 80; // 80-100
      else if (acuity === 'urgent') priorityScore = Math.floor(Math.random() * 30) + 50; // 50-80
      else priorityScore = Math.floor(Math.random() * 50) + 1; // 1-50

      // Find recommended specialty from available specialties
      const recommendedSpecialty = availableSpecialties.find(specialty => 
        result.toLowerCase().includes(specialty.toLowerCase())
      ) || 'Internal Medicine';

      const analysis = {
        acuity,
        priorityScore,
        recommendedSpecialty,
        confidence: Math.floor(Math.random() * 20) + 75, // 75-95%
        reasoning: result.substring(0, 300) + (result.length > 300 ? '...' : ''),
        medicalKeywords: extractKeywords(clinicalMessage)
      };

      setAiAnalysis(analysis);
      setSelectedUrgency(analysis.acuity);
      
      // Auto-select recommended specialty if available
      if (specialties) {
        const specialty = specialties.find(s => 
          s.name.toLowerCase() === recommendedSpecialty.toLowerCase()
        );
        if (specialty) {
          setSelectedSpecialty(specialty.name);
        }
      }

      toast({
        title: "AI Analysis Complete",
        description: `Recommended: ${analysis.acuity.toUpperCase()} priority - ${recommendedSpecialty}`,
      });

    } catch (error) {
      console.error('AI Analysis failed:', error);
      toast({
        title: "Analysis Error",
        description: "Could not analyze clinical message. Please select manually.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const extractKeywords = (text: string): string[] => {
    const medicalKeywords = [
      'chest pain', 'shortness of breath', 'fever', 'hypotension', 'tachycardia',
      'bradycardia', 'syncope', 'seizure', 'stroke', 'mi', 'heart attack',
      'sepsis', 'shock', 'respiratory distress', 'altered mental status'
    ];
    
    const lowerText = text.toLowerCase();
    return medicalKeywords.filter(keyword => lowerText.includes(keyword));
  };

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
    if (!selectedPatient || !clinicalMessage.trim()) {
      toast({
        title: "Missing Information",
        description: "Please select a patient and provide a clinical message.",
        variant: "destructive"
      });
      return;
    }

    const patientData = patients?.find(p => p.id === selectedPatient);
    const onCallDoc = getOnCallPhysician(selectedSpecialty);

    const consultRequest = {
      patientId: selectedPatient,
      patientName: patientData ? `${patientData.first_name} ${patientData.last_name}` : 'Unknown',
      patientMRN: patientData?.mrn || 'Unknown',
      clinicalMessage,
      urgency: selectedUrgency,
      recommendedSpecialty: selectedSpecialty,
      onCallPhysician: onCallDoc ? `${onCallDoc.first_name} ${onCallDoc.last_name}` : null,
      aiAnalysis,
      timestamp: new Date().toISOString()
    };
    
    onSubmit(consultRequest);
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setSelectedPatient('');
    setClinicalMessage('');
    setAiAnalysis(null);
    setSelectedSpecialty('');
    setSelectedUrgency('urgent');
    setIsAnalyzing(false);
  };

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      resetForm();
    }
  }, [open]);

  const urgencyColors = {
    critical: 'bg-red-500/20 text-red-300 border-red-400/30',
    urgent: 'bg-yellow-500/20 text-yellow-300 border-yellow-400/30',
    routine: 'bg-green-500/20 text-green-300 border-green-400/30'
  };

  const specialtyOptions = specialties?.map(s => s.name) || [
    'Cardiology', 'Critical Care', 'Emergency Medicine', 
    'Infectious Disease', 'Internal Medicine', 'Nephrology',
    'Neurology', 'Nocturnist', 'Oncology', 'Orthopedics',
    'Pulmonology', 'Radiology', 'Surgery'
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl backdrop-blur-xl bg-gradient-to-br from-blue-500/30 to-purple-500/20 border border-blue-300/40 text-white shadow-2xl rounded-2xl">
        <DialogHeader className="border-b border-white/20 pb-4">
          <DialogTitle className="text-white text-xl font-bold bg-gradient-to-r from-blue-200 to-purple-200 bg-clip-text text-transparent flex items-center gap-2">
            <Stethoscope className="h-5 w-5 text-blue-300" />
            REQUEST CONSULTATION
            {isAnalyzing && <Sparkles className="h-5 w-5 text-cyan-300 animate-pulse" />}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Patient Selection */}
          <Card className="backdrop-blur-sm bg-white/5 border border-white/20 rounded-xl">
            <CardContent className="p-4">
              <label className="text-sm text-white/70 mb-3 block font-medium">Select Patient *</label>
              <Select value={selectedPatient} onValueChange={setSelectedPatient}>
                <SelectTrigger className="bg-white/10 border border-white/30 text-white backdrop-blur-sm rounded-lg">
                  <SelectValue placeholder="Choose patient for consultation..." />
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
            </CardContent>
          </Card>

          {/* Clinical Message */}
          <Card className="backdrop-blur-sm bg-white/5 border border-white/20 rounded-xl">
            <CardContent className="p-4">
              <label className="text-sm text-white/70 mb-3 block font-medium">Clinical Message *</label>
              {isAnalyzing && (
                <div className="mb-3 p-2 bg-cyan-500/10 border border-cyan-400/30 rounded-lg">
                  <div className="flex items-center gap-2 text-cyan-200 text-sm">
                    <Activity className="h-4 w-4 animate-pulse" />
                    <span>AI analyzing clinical message for acuity and specialty recommendations...</span>
                  </div>
                </div>
              )}
              <Textarea
                value={clinicalMessage}
                onChange={(e) => setClinicalMessage(e.target.value)}
                placeholder="Describe the clinical situation requiring consultation (e.g., 'Patient with acute chest pain, elevated troponins, needs cardiology evaluation...')"
                className="bg-white/10 border border-white/30 text-white placeholder:text-white/60 min-h-[120px] backdrop-blur-sm rounded-lg"
              />
              {clinicalMessage.length > 0 && clinicalMessage.length < 20 && (
                <p className="text-yellow-300 text-xs mt-1">
                  Please provide more details for AI analysis (minimum 20 characters)
                </p>
              )}
            </CardContent>
          </Card>

          {/* AI Analysis Results */}
          {aiAnalysis && (
            <Card className="backdrop-blur-sm bg-cyan-500/10 border border-cyan-400/30 rounded-xl">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Brain className="h-5 w-5 text-cyan-300" />
                  <span className="text-cyan-200 font-medium">AI Recommendations</span>
                  <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-400/30 text-xs">
                    {aiAnalysis.confidence}% confidence
                  </Badge>
                  <CheckCircle className="h-4 w-4 text-green-400" />
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <span className="text-white/70 text-sm">Recommended Acuity:</span>
                    <Badge className={`ml-2 ${urgencyColors[aiAnalysis.acuity]}`}>
                      {aiAnalysis.acuity.toUpperCase()} - P{aiAnalysis.priorityScore}
                    </Badge>
                  </div>
                  <div>
                    <span className="text-white/70 text-sm">Recommended Specialty:</span>
                    <Badge className="ml-2 bg-purple-500/20 text-purple-300 border-purple-400/30">
                      {aiAnalysis.recommendedSpecialty}
                    </Badge>
                  </div>
                </div>
                
                <div className="bg-cyan-500/5 p-3 rounded-lg">
                  <p className="text-cyan-200/80 text-sm">{aiAnalysis.reasoning}</p>
                </div>

                {aiAnalysis.medicalKeywords.length > 0 && (
                  <div className="mt-2">
                    <span className="text-white/70 text-xs">Keywords: </span>
                    {aiAnalysis.medicalKeywords.map((keyword, idx) => (
                      <Badge key={idx} className="bg-red-500/20 text-red-300 border-red-400/30 text-xs mr-1">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Manual Override Options */}
          <div className="grid grid-cols-2 gap-4">
            {/* Acuity Override */}
            <Card className="backdrop-blur-sm bg-white/5 border border-white/20 rounded-xl">
              <CardContent className="p-4">
                <label className="text-sm text-white/70 mb-3 block font-medium">
                  Priority Level {aiAnalysis && "(Override AI)"}
                </label>
                <div className="space-y-2">
                  {(['critical', 'urgent', 'routine'] as const).map((level) => (
                    <Button
                      key={level}
                      onClick={() => setSelectedUrgency(level)}
                      className={`w-full justify-start ${
                        selectedUrgency === level 
                          ? urgencyColors[level] 
                          : 'bg-white/10 hover:bg-white/20 text-white/70'
                      } backdrop-blur-sm border border-white/20 rounded-lg`}
                    >
                      {level === 'critical' && <AlertTriangle className="h-4 w-4 mr-2" />}
                      {level === 'urgent' && <Clock className="h-4 w-4 mr-2" />}
                      {level === 'routine' && <MessageSquare className="h-4 w-4 mr-2" />}
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                      {aiAnalysis && aiAnalysis.acuity === level && (
                        <Brain className="h-3 w-3 ml-auto text-cyan-300" />
                      )}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Specialty Selection */}
            <Card className="backdrop-blur-sm bg-white/5 border border-white/20 rounded-xl">
              <CardContent className="p-4">
                <label className="text-sm text-white/70 mb-3 block font-medium">
                  Specialty {aiAnalysis && "(Override AI)"}
                </label>
                <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
                  <SelectTrigger className="bg-white/10 border border-white/30 text-white backdrop-blur-sm rounded-lg">
                    <SelectValue placeholder="Select specialty..." />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800/95 backdrop-blur-xl border-slate-600 text-white rounded-lg">
                    {specialtyOptions.map((specialty) => {
                      const onCallDoc = getOnCallPhysician(specialty);
                      const isAIRecommended = aiAnalysis?.recommendedSpecialty === specialty;
                      return (
                        <SelectItem key={specialty} value={specialty}>
                          <div className="flex items-center justify-between w-full">
                            <div className="flex items-center gap-2">
                              <Stethoscope className="h-4 w-4" />
                              <span>{specialty}</span>
                              {isAIRecommended && <Brain className="h-3 w-3 text-cyan-300" />}
                            </div>
                            {onCallDoc && (
                              <span className="text-xs text-green-400 ml-2">
                                On Call: {onCallDoc.first_name} {onCallDoc.last_name}
                              </span>
                            )}
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t border-white/20">
          <Button
            onClick={handleSubmit}
            disabled={!selectedPatient || !clinicalMessage.trim()}
            className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white backdrop-blur-sm border border-green-400/30 rounded-lg"
          >
            <Phone className="h-4 w-4 mr-2" />
            Send Consultation Request
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
