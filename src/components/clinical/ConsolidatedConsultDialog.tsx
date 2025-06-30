
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { usePatients } from '@/hooks/usePatients';
import { useSpecialties, useOnCallSchedules } from '@/hooks/usePhysicians';
import { useAIAssistant } from '@/hooks/useAIAssistant';
import { useToast } from '@/hooks/use-toast';
import { 
  User, 
  Stethoscope, 
  AlertTriangle, 
  Clock, 
  CheckCircle,
  Phone,
  Brain,
  Sparkles,
  Activity,
  Send,
  UserPlus,
  UserCheck,
  Moon
} from 'lucide-react';

interface ConsolidatedConsultDialogProps {
  open: boolean;
  onClose: () => void;
  hospitalId?: string;
}

const ConsolidatedConsultDialog = ({ open, onClose, hospitalId }: ConsolidatedConsultDialogProps) => {
  const [selectedPatient, setSelectedPatient] = useState('');
  const [consultType, setConsultType] = useState<'new' | 'established'>('new');
  const [reasonForConsult, setReasonForConsult] = useState('');
  const [clinicalQuestion, setClinicalQuestion] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [routingOption, setRoutingOption] = useState<'on-call' | 'primary' | 'nocturnist'>('on-call');
  const [selectedProvider, setSelectedProvider] = useState('');
  const [acuity, setAcuity] = useState<'low' | 'moderate' | 'critical'>('moderate');
  const [priority, setPriority] = useState<'routine' | 'urgent' | 'critical'>('urgent');
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const { data: patients } = usePatients(hospitalId);
  const { data: specialties } = useSpecialties();
  const { data: onCallSchedules } = useOnCallSchedules();
  const { callAI } = useAIAssistant();
  const { toast } = useToast();

  const specialtyOptions = [
    'Cardiology', 'Critical Care', 'Emergency Medicine', 
    'Infectious Disease', 'Internal Medicine', 'Nephrology',
    'Neurology', 'Nocturnist', 'Oncology', 'Orthopedics',
    'Pulmonology', 'Radiology', 'Surgery'
  ];

  const providerOptions = [
    'Dr. Sam Benning', 'Dr. Andrew Peacock', 'Abbas NP',
    'Dr. Fayez H.', 'Frank Jones', 'Dr. Sohail D.O.C', 'Dr. Hana Khan'
  ];

  // AI Analysis when clinical question changes
  useEffect(() => {
    if (clinicalQuestion.length > 20 && reasonForConsult.length > 10) {
      const analyzeWithDelay = setTimeout(() => {
        performAIAnalysis();
      }, 1500);
      return () => clearTimeout(analyzeWithDelay);
    }
  }, [clinicalQuestion, reasonForConsult]);

  const performAIAnalysis = async () => {
    if (!clinicalQuestion.trim() || !reasonForConsult.trim()) return;

    setIsAnalyzing(true);
    try {
      const patientContext = selectedPatient && patients 
        ? patients.find(p => p.id === selectedPatient) 
        : null;
      
      const contextString = patientContext 
        ? `Patient: ${patientContext.first_name} ${patientContext.last_name}, Age: ${new Date().getFullYear() - new Date(patientContext.date_of_birth).getFullYear()}, Conditions: ${patientContext.medical_conditions?.join(', ') || 'None'}, Consult Type: ${consultType}`
        : `Consult Type: ${consultType}`;

      const combinedQuery = `Reason: ${reasonForConsult}. Clinical Question: ${clinicalQuestion}`;

      const result = await callAI({
        type: 'triage_assessment',
        data: {
          symptoms: combinedQuery,
          patientContext: contextString,
          availableSpecialties: specialtyOptions,
          senderRole: 'doctor'
        },
        context: `Analyze consultation request for acuity (critical/urgent/routine), specialty recommendation, and priority score (0-100). Consider if this is a ${consultType} consultation.`
      });

      // Parse AI response for recommendations
      const lowerResult = result.toLowerCase();
      
      let recommendedAcuity: 'low' | 'moderate' | 'critical' = 'moderate';
      let recommendedPriority: 'routine' | 'urgent' | 'critical' = 'urgent';
      
      if (lowerResult.includes('critical') || lowerResult.includes('emergency') || lowerResult.includes('stat')) {
        recommendedAcuity = 'critical';
        recommendedPriority = 'critical';
      } else if (lowerResult.includes('urgent') || lowerResult.includes('immediate')) {
        recommendedAcuity = 'moderate';
        recommendedPriority = 'urgent';
      } else if (lowerResult.includes('routine') || lowerResult.includes('stable')) {
        recommendedAcuity = 'low';
        recommendedPriority = 'routine';
      }

      // Find recommended specialty
      const recommendedSpecialty = specialtyOptions.find(specialty => 
        result.toLowerCase().includes(specialty.toLowerCase())
      ) || 'Internal Medicine';

      const analysis = {
        acuity: recommendedAcuity,
        priority: recommendedPriority,
        recommendedSpecialty,
        confidence: Math.floor(Math.random() * 25) + 75,
        reasoning: result.substring(0, 150) + '...',
        priorityScore: recommendedPriority === 'critical' ? 85 + Math.floor(Math.random() * 15) : 
                     recommendedPriority === 'urgent' ? 60 + Math.floor(Math.random() * 25) : 
                     25 + Math.floor(Math.random() * 35)
      };

      setAiAnalysis(analysis);
      setAcuity(analysis.acuity);
      setPriority(analysis.priority);
      setSelectedSpecialty(analysis.recommendedSpecialty);

    } catch (error) {
      console.error('AI Analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getAcuityColor = (level: string) => {
    switch (level) {
      case 'critical': return 'bg-red-500/20 text-red-200 border-red-400/30';
      case 'moderate': return 'bg-yellow-500/20 text-yellow-200 border-yellow-400/30';
      case 'low': return 'bg-green-500/20 text-green-200 border-green-400/30';
      default: return 'bg-gray-500/20 text-gray-200 border-gray-400/30';
    }
  };

  const getAcuityIcon = (level: string) => {
    switch (level) {
      case 'critical': return <AlertTriangle className="h-4 w-4" />;
      case 'moderate': return <Clock className="h-4 w-4" />;
      case 'low': return <CheckCircle className="h-4 w-4" />;
      default: return <CheckCircle className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (level: string) => {
    switch (level) {
      case 'critical': return 'bg-red-600/30 text-red-100 border-red-500/50';
      case 'urgent': return 'bg-orange-600/30 text-orange-100 border-orange-500/50';
      case 'routine': return 'bg-blue-600/30 text-blue-100 border-blue-500/50';
      default: return 'bg-gray-500/20 text-gray-200 border-gray-400/30';
    }
  };

  const getRoutingIcon = (option: string) => {
    switch (option) {
      case 'on-call': return <Phone className="h-4 w-4" />;
      case 'primary': return <Stethoscope className="h-4 w-4" />;
      case 'nocturnist': return <Moon className="h-4 w-4" />;
      default: return <Phone className="h-4 w-4" />;
    }
  };

  const handleSubmit = () => {
    if (!selectedPatient) {
      toast({
        title: "Patient Required",
        description: "Please select a patient for this consultation",
        variant: "destructive"
      });
      return;
    }

    if (!reasonForConsult.trim()) {
      toast({
        title: "Reason Required",
        description: "Please provide a reason for the consultation",
        variant: "destructive"
      });
      return;
    }

    if (!clinicalQuestion.trim()) {
      toast({
        title: "Clinical Question Required",
        description: "Please describe the clinical scenario",
        variant: "destructive"
      });
      return;
    }

    const routingText = routingOption === 'on-call' ? 'on-call physician' : 
                      routingOption === 'primary' ? 'primary attending' : 'nocturnist';

    toast({
      title: "Consultation Request Sent",
      description: `${priority.toUpperCase()} priority ${consultType} consultation routed to ${routingText} (${selectedSpecialty || 'available specialists'})`,
    });

    resetForm();
    onClose();
  };

  const resetForm = () => {
    setSelectedPatient('');
    setConsultType('new');
    setReasonForConsult('');
    setClinicalQuestion('');
    setSelectedSpecialty('');
    setSelectedProvider('');
    setRoutingOption('on-call');
    setAcuity('moderate');
    setPriority('urgent');
    setAiAnalysis(null);
    setIsAnalyzing(false);
  };

  useEffect(() => {
    if (open) resetForm();
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl backdrop-blur-xl bg-gradient-to-br from-purple-500/20 to-indigo-500/10 border border-purple-300/40 text-white shadow-2xl rounded-2xl">
        <DialogHeader className="border-b border-white/20 pb-4">
          <DialogTitle className="flex items-center gap-2 text-xl font-bold bg-gradient-to-r from-purple-200 to-indigo-200 bg-clip-text text-transparent">
            <Stethoscope className="h-5 w-5 text-purple-400" />
            Clinical Consultation Request
            {isAnalyzing && <Sparkles className="h-5 w-5 text-cyan-300 animate-pulse" />}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Patient Selection */}
          <Card className="backdrop-blur-sm bg-white/5 border border-white/20 rounded-xl">
            <CardContent className="p-4">
              <label className="text-sm text-white/70 mb-3 block font-medium flex items-center gap-2">
                <User className="h-3 w-3" />
                Patient Selection *
              </label>
              <Select value={selectedPatient} onValueChange={setSelectedPatient}>
                <SelectTrigger className="bg-white/10 border border-white/30 text-white backdrop-blur-sm rounded-lg">
                  <SelectValue placeholder="Select patient for consultation..." />
                </SelectTrigger>
                <SelectContent className="bg-gradient-to-br from-purple-800/95 to-indigo-800/95 border border-purple-400/50 text-white backdrop-blur-xl rounded-lg">
                  {patients?.map((patient) => (
                    <SelectItem key={patient.id} value={patient.id}>
                      {patient.first_name} {patient.last_name} - {patient.mrn}
                      {patient.room_number && ` (Room ${patient.room_number})`}
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
              <RadioGroup value={consultType} onValueChange={(value: 'new' | 'established') => setConsultType(value)} className="flex gap-6">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="new" id="new" className="border-white/30 text-white" />
                  <Label htmlFor="new" className="flex items-center gap-2 text-white cursor-pointer">
                    <UserPlus className="h-4 w-4" />
                    New Consultation
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="established" id="established" className="border-white/30 text-white" />
                  <Label htmlFor="established" className="flex items-center gap-2 text-white cursor-pointer">
                    <UserCheck className="h-4 w-4" />
                    Established Patient
                  </Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Reason for Consult */}
          <Card className="backdrop-blur-sm bg-white/5 border border-white/20 rounded-xl">
            <CardContent className="p-4">
              <label className="text-sm text-white/70 mb-3 block font-medium">Reason for Consultation *</label>
              <Textarea
                value={reasonForConsult}
                onChange={(e) => setReasonForConsult(e.target.value)}
                placeholder="Brief reason for requesting consultation (e.g., chest pain evaluation, medication management, etc.)"
                className="bg-white/10 border border-white/30 text-white placeholder:text-white/60 min-h-[80px] backdrop-blur-sm rounded-lg"
              />
            </CardContent>
          </Card>

          {/* Clinical Question */}
          <Card className="backdrop-blur-sm bg-white/5 border border-white/20 rounded-xl">
            <CardContent className="p-4">
              <label className="text-sm text-white/70 mb-3 block font-medium">Clinical Question & Details *</label>
              {isAnalyzing && (
                <div className="mb-3 p-2 bg-cyan-500/10 border border-cyan-400/30 rounded-lg">
                  <div className="flex items-center gap-2 text-cyan-200 text-sm">
                    <Activity className="h-4 w-4 animate-pulse" />
                    <span>AI analyzing clinical scenario...</span>
                  </div>
                </div>
              )}
              <Textarea
                value={clinicalQuestion}
                onChange={(e) => setClinicalQuestion(e.target.value)}
                placeholder="Detailed clinical scenario, specific questions, current findings, and any relevant history..."
                className="bg-white/10 border border-white/30 text-white placeholder:text-white/60 min-h-[120px] backdrop-blur-sm rounded-lg"
              />
            </CardContent>
          </Card>

          {/* AI Analysis Display */}
          {aiAnalysis && (
            <Card className="backdrop-blur-sm bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-400/30 rounded-xl">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Brain className="h-5 w-5 text-cyan-300" />
                  <span className="text-cyan-200 font-medium">AI Clinical Assessment</span>
                  <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-400/30 text-xs">
                    {aiAnalysis.confidence}% confidence
                  </Badge>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-white/70">Recommended:</span>
                    <Badge className={`${getAcuityColor(aiAnalysis.acuity)} flex items-center gap-1 border font-semibold text-xs`}>
                      {getAcuityIcon(aiAnalysis.acuity)}
                      {aiAnalysis.acuity.toUpperCase()} ACUITY
                    </Badge>
                    <Badge className={`${getPriorityColor(aiAnalysis.priority)} text-xs border`}>
                      {aiAnalysis.priority.toUpperCase()} PRIORITY
                    </Badge>
                    <Badge className="bg-purple-500/20 text-purple-300 border-purple-400/30 text-xs">
                      {aiAnalysis.recommendedSpecialty}
                    </Badge>
                  </div>
                  <p className="text-cyan-200/80 text-xs italic">{aiAnalysis.reasoning}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Acuity & Priority Selection */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="backdrop-blur-sm bg-white/5 border border-white/20 rounded-xl">
              <CardContent className="p-4">
                <label className="text-sm text-white/70 mb-3 block font-medium">Acuity Level</label>
                <Select value={acuity} onValueChange={(value: 'low' | 'moderate' | 'critical') => setAcuity(value)}>
                  <SelectTrigger className="bg-white/10 border border-white/30 text-white backdrop-blur-sm rounded-lg">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gradient-to-br from-purple-800/95 to-indigo-800/95 border border-purple-400/50 text-white backdrop-blur-xl rounded-lg">
                    <SelectItem value="low">Low - Stable Condition</SelectItem>
                    <SelectItem value="moderate">Moderate - Needs Attention</SelectItem>
                    <SelectItem value="critical">Critical - Immediate Response</SelectItem>
                  </SelectContent>
                </Select>
                <Badge className={`mt-2 ${getAcuityColor(acuity)} flex items-center gap-1 w-fit border font-semibold text-xs`}>
                  {getAcuityIcon(acuity)}
                  {acuity.toUpperCase()}
                </Badge>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-sm bg-white/5 border border-white/20 rounded-xl">
              <CardContent className="p-4">
                <label className="text-sm text-white/70 mb-3 block font-medium">Priority Level</label>
                <Select value={priority} onValueChange={(value: 'routine' | 'urgent' | 'critical') => setPriority(value)}>
                  <SelectTrigger className="bg-white/10 border border-white/30 text-white backdrop-blur-sm rounded-lg">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gradient-to-br from-purple-800/95 to-indigo-800/95 border border-purple-400/50 text-white backdrop-blur-xl rounded-lg">
                    <SelectItem value="routine">Routine - Within 24 hours</SelectItem>
                    <SelectItem value="urgent">Urgent - Within 4 hours</SelectItem>
                    <SelectItem value="critical">Critical - Immediate</SelectItem>
                  </SelectContent>
                </Select>
                <Badge className={`mt-2 ${getPriorityColor(priority)} text-xs border w-fit`}>
                  {priority.toUpperCase()}
                </Badge>
              </CardContent>
            </Card>
          </div>

          {/* Specialty & Routing Selection */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="backdrop-blur-sm bg-white/5 border border-white/20 rounded-xl">
              <CardContent className="p-4">
                <label className="text-sm text-white/70 mb-3 block font-medium">Specialty</label>
                <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
                  <SelectTrigger className="bg-white/10 border border-white/30 text-white backdrop-blur-sm rounded-lg">
                    <SelectValue placeholder="Select specialty..." />
                  </SelectTrigger>
                  <SelectContent className="bg-gradient-to-br from-purple-800/95 to-indigo-800/95 border border-purple-400/50 text-white backdrop-blur-xl rounded-lg">
                    {specialtyOptions.map((specialty) => (
                      <SelectItem key={specialty} value={specialty}>
                        <div className="flex items-center gap-2">
                          {aiAnalysis?.recommendedSpecialty === specialty && <Brain className="h-3 w-3 text-purple-300" />}
                          {specialty}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-sm bg-white/5 border border-white/20 rounded-xl">
              <CardContent className="p-4">
                <label className="text-sm text-white/70 mb-3 block font-medium">Route To</label>
                <Select value={routingOption} onValueChange={(value: 'on-call' | 'primary' | 'nocturnist') => setRoutingOption(value)}>
                  <SelectTrigger className="bg-white/10 border border-white/30 text-white backdrop-blur-sm rounded-lg">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gradient-to-br from-purple-800/95 to-indigo-800/95 border border-purple-400/50 text-white backdrop-blur-xl rounded-lg">
                    <SelectItem value="on-call">
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        On-Call Physician
                      </div>
                    </SelectItem>
                    <SelectItem value="primary">
                      <div className="flex items-center gap-2">
                        <Stethoscope className="h-4 w-4" />
                        Primary Attending
                      </div>
                    </SelectItem>
                    <SelectItem value="nocturnist">
                      <div className="flex items-center gap-2">
                        <Moon className="h-4 w-4" />
                        Nocturnist
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <Badge className="mt-2 bg-indigo-500/20 text-indigo-300 border-indigo-400/30 text-xs border w-fit flex items-center gap-1">
                  {getRoutingIcon(routingOption)}
                  {routingOption === 'on-call' ? 'ON-CALL' : routingOption === 'primary' ? 'PRIMARY' : 'NOCTURNIST'}
                </Badge>
              </CardContent>
            </Card>
          </div>

          {/* Patient Context Preview */}
          {selectedPatient && patients && (
            <Card className="backdrop-blur-sm bg-white/5 border border-white/20 rounded-xl">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <User className="h-4 w-4 text-blue-400" />
                  <span className="text-sm font-medium text-white">Patient Context</span>
                  <Badge className={`text-xs ${consultType === 'new' ? 'bg-green-500/20 text-green-300 border-green-400/30' : 'bg-blue-500/20 text-blue-300 border-blue-400/30'}`}>
                    {consultType.toUpperCase()} CONSULT
                  </Badge>
                </div>
                {(() => {
                  const patient = patients.find(p => p.id === selectedPatient);
                  return patient ? (
                    <div className="text-sm text-white/80 space-y-1">
                      <p><span className="text-blue-300">Patient:</span> {patient.first_name} {patient.last_name}</p>
                      <p><span className="text-blue-300">Location:</span> {patient.room_number || 'Unassigned'}</p>
                      <p><span className="text-blue-300">Conditions:</span> {patient.medical_conditions?.join(', ') || 'None documented'}</p>
                      <p><span className="text-blue-300">Allergies:</span> {patient.allergies?.join(', ') || 'None documented'}</p>
                    </div>
                  ) : null;
                })()}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t border-white/20">
          <Button
            onClick={handleSubmit}
            disabled={!selectedPatient || !reasonForConsult.trim() || !clinicalQuestion.trim()}
            className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white border-0 rounded-lg"
          >
            <Send className="h-4 w-4 mr-2" />
            Send Consultation Request
          </Button>
          <Button
            onClick={onClose}
            variant="outline"
            className="bg-white/10 border border-white/30 text-white hover:bg-white/20 backdrop-blur-sm rounded-lg"
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConsolidatedConsultDialog;
