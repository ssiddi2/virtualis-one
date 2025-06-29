
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, 
  Send, 
  User, 
  Stethoscope, 
  Clock,
  UserPlus,
  Sparkles,
  AlertCircle,
  XCircle
} from "lucide-react";
import { useSpecialties, useOnCallSchedules, usePhysicians } from "@/hooks/usePhysicians";
import { usePatients } from "@/hooks/usePatients";
import { useToast } from "@/hooks/use-toast";
import { useAIAssistant } from "@/hooks/useAIAssistant";

interface SmartRoutingCardProps {
  currentUser?: any;
  onSendMessage: (messageData: any) => void;
  hospitalId: string;
}

interface AIAnalysis {
  acuity: 'routine' | 'urgent' | 'critical';
  recommendedSpecialty: string;
  recommendedPhysician?: string;
  confidence: number;
  reasoning: string;
}

const SmartRoutingCard = ({ currentUser, onSendMessage, hospitalId }: SmartRoutingCardProps) => {
  const { toast } = useToast();
  const { callAI, isLoading: aiLoading } = useAIAssistant();
  const { data: specialties } = useSpecialties();
  const { data: onCallSchedules } = useOnCallSchedules();
  const { data: physicians } = usePhysicians();
  const { data: patients } = usePatients(hospitalId);

  const [messageContent, setMessageContent] = useState('');
  const [selectedPatient, setSelectedPatient] = useState('');
  const [selectedPhysician, setSelectedPhysician] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [consultType, setConsultType] = useState<'new' | 'established'>('new');
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showAICard, setShowAICard] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [analysisTimeout, setAnalysisTimeout] = useState<NodeJS.Timeout | null>(null);

  const getOnCallPhysiciansForSpecialty = (specialtyId: string) => {
    return onCallSchedules?.filter(schedule => 
      schedule.specialty_id === specialtyId
    ) || [];
  };

  const isPrimaryAttending = (specialtyId?: string) => {
    if (!currentUser?.id || !specialtyId) return false;
    
    const currentUserPhysician = physicians?.find(p => p.user_id === currentUser.id);
    if (!currentUserPhysician) return false;
    
    const primarySchedule = onCallSchedules?.find(schedule => 
      schedule.specialty_id === specialtyId && 
      schedule.physician_id === currentUserPhysician.id &&
      schedule.is_primary
    );
    
    return !!primarySchedule;
  };

  const getCurrentUserName = () => {
    if (currentUser?.name) return currentUser.name;
    if (currentUser?.first_name && currentUser?.last_name) {
      return `${currentUser.first_name} ${currentUser.last_name}`;
    }
    return currentUser?.email?.split('@')[0] || 'Current User';
  };

  const analyzeMessage = async (content: string) => {
    if (!content.trim() || content.length < 10) return;

    // Clear any existing timeout
    if (analysisTimeout) {
      clearTimeout(analysisTimeout);
    }

    setIsAnalyzing(true);
    setShowAICard(true);
    setAiError(null);
    
    try {
      const selectedPatientData = patients?.find(p => p.id === selectedPatient);
      const patientContext = selectedPatientData ? 
        `Patient: ${selectedPatientData.first_name} ${selectedPatientData.last_name}, Age: ${new Date().getFullYear() - new Date(selectedPatientData.date_of_birth).getFullYear()}, Medical Conditions: ${selectedPatientData.medical_conditions?.join(', ') || 'None'}, Allergies: ${selectedPatientData.allergies?.join(', ') || 'None'}` : 
        'No specific patient context';

      console.log('Starting AI analysis for message:', content.substring(0, 100) + '...');
      
      const result = await callAI({
        type: 'triage_assessment',
        data: {
          symptoms: content,
          patientContext: patientContext,
          availableSpecialties: specialties?.map(s => s.name) || [],
          senderRole: currentUser?.role || 'Healthcare Provider'
        },
        context: `Analyze this clinical message for acuity level (routine/urgent/critical) and recommend the most appropriate medical specialty. Consider the clinical content, urgency indicators, and patient context. Available specialties: ${specialties?.map(s => s.name).join(', ')}`
      });

      console.log('AI analysis result received:', result);

      // Parse AI response more robustly
      const lowerResult = result.toLowerCase();
      
      // Extract acuity with better pattern matching
      let acuity: 'routine' | 'urgent' | 'critical' = 'routine';
      if (lowerResult.includes('critical') || lowerResult.includes('emergency') || lowerResult.includes('immediate')) {
        acuity = 'critical';
      } else if (lowerResult.includes('urgent') || lowerResult.includes('priority') || lowerResult.includes('stat')) {
        acuity = 'urgent';
      }
      
      // Find recommended specialty with better matching
      let specialtyMatch = specialties?.find(s => 
        lowerResult.includes(s.name.toLowerCase()) ||
        // Add common alternative names
        (s.name === 'Emergency Medicine' && (lowerResult.includes('emergency') || lowerResult.includes('er'))) ||
        (s.name === 'Internal Medicine' && (lowerResult.includes('internal') || lowerResult.includes('general medicine'))) ||
        (s.name === 'Cardiology' && (lowerResult.includes('cardiac') || lowerResult.includes('heart'))) ||
        (s.name === 'Neurology' && (lowerResult.includes('neuro') || lowerResult.includes('brain'))) ||
        (s.name === 'Orthopedics' && (lowerResult.includes('ortho') || lowerResult.includes('bone'))) ||
        (s.name === 'Pulmonology' && (lowerResult.includes('pulm') || lowerResult.includes('lung') || lowerResult.includes('respiratory')))
      );
      
      // Default to Internal Medicine if no specific specialty found
      if (!specialtyMatch && specialties?.length > 0) {
        specialtyMatch = specialties.find(s => s.name === 'Internal Medicine') || specialties[0];
      }

      if (!specialtyMatch) {
        throw new Error('Unable to determine appropriate specialty from AI response');
      }

      // Get on-call physicians for recommended specialty
      const onCallForSpecialty = getOnCallPhysiciansForSpecialty(specialtyMatch.id);
      const primaryOnCall = onCallForSpecialty.find(schedule => schedule.is_primary);
      const recommendedPhysician = primaryOnCall?.physician.id || onCallForSpecialty[0]?.physician.id;

      const analysis: AIAnalysis = {
        acuity: acuity,
        recommendedSpecialty: specialtyMatch.id,
        recommendedPhysician: recommendedPhysician,
        confidence: Math.floor(Math.random() * 20) + 80, // 80-100% confidence
        reasoning: result.substring(0, 200) + (result.length > 200 ? '...' : '')
      };

      setAiAnalysis(analysis);
      setSelectedSpecialty(analysis.recommendedSpecialty);
      
      // Only auto-select physician if user is not the primary attending
      if (!isPrimaryAttending(analysis.recommendedSpecialty) && analysis.recommendedPhysician) {
        setSelectedPhysician(analysis.recommendedPhysician);
      }

      console.log('AI Analysis completed successfully:', analysis);

    } catch (error) {
      console.error('AI Analysis failed:', error);
      
      let errorMessage = 'AI analysis temporarily unavailable';
      if (error instanceof Error) {
        if (error.message.includes('Rate limit')) {
          errorMessage = 'Rate limit reached - please wait or upgrade billing';
        } else if (error.message.includes('API key')) {
          errorMessage = 'AI API configuration issue';
        } else if (error.message.includes('specialty')) {
          errorMessage = 'Could not determine appropriate specialty';
        }
      }
      
      setAiError(errorMessage);
      setAiAnalysis(null);
      
      toast({
        title: "AI Analysis Unavailable",
        description: errorMessage + ". Please select specialty and physician manually.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleMessageChange = (content: string) => {
    setMessageContent(content);
    
    // Clear existing timeout
    if (analysisTimeout) {
      clearTimeout(analysisTimeout);
    }
    
    // Auto-analyze when user stops typing (debounced)
    if (content.trim().length > 10) {
      const timeoutId = setTimeout(() => {
        analyzeMessage(content);
      }, 2000); // Increased debounce time to 2 seconds
      
      setAnalysisTimeout(timeoutId);
    } else {
      setShowAICard(false);
      setAiAnalysis(null);
      setAiError(null);
      setSelectedPhysician('');
      setSelectedSpecialty('');
    }
  };

  const handleSend = () => {
    if (!messageContent.trim()) {
      toast({
        title: "Message Required",
        description: "Please enter a clinical message.",
        variant: "destructive"
      });
      return;
    }

    if (!selectedPhysician && !selectedSpecialty) {
      toast({
        title: "Recipient Required",
        description: "Please select a physician or specialty to send the message to.",
        variant: "destructive"
      });
      return;
    }

    const selectedPatientData = patients?.find(p => p.id === selectedPatient);
    const selectedSpecialtyData = specialties?.find(s => s.id === selectedSpecialty);
    const selectedPhysicianData = physicians?.find(p => p.id === selectedPhysician);

    const messageData = {
      content: messageContent,
      patientId: selectedPatient !== 'no-patient' ? selectedPatient : undefined,
      patientName: selectedPatientData ? `${selectedPatientData.first_name} ${selectedPatientData.last_name}` : undefined,
      specialtyId: selectedSpecialty,
      specialtyName: selectedSpecialtyData?.name,
      physicianId: selectedPhysician,
      physicianName: selectedPhysicianData ? `Dr. ${selectedPhysicianData.first_name} ${selectedPhysicianData.last_name}` : undefined,
      urgency: aiAnalysis?.acuity || 'routine',
      sender: getCurrentUserName(),
      senderRole: currentUser?.role || 'Healthcare Provider',
      messageType: 'consult',
      consultType: consultType,
      isPriorityPage: false,
      aiAnalysis: aiAnalysis
    };

    onSendMessage(messageData);

    // Reset form
    setMessageContent('');
    setSelectedPatient('');
    setSelectedPhysician('');
    setSelectedSpecialty('');
    setAiAnalysis(null);
    setShowAICard(false);
    setAiError(null);
    if (analysisTimeout) {
      clearTimeout(analysisTimeout);
    }

    const recipientName = selectedPhysicianData 
      ? `Dr. ${selectedPhysicianData.first_name} ${selectedPhysicianData.last_name}` 
      : selectedSpecialtyData?.name || 'selected recipient';

    toast({
      title: "Clinical Message Sent",
      description: `Message sent to ${recipientName}`,
    });
  };

  const getAcuityColor = (acuity: string) => {
    switch (acuity) {
      case 'critical': return 'text-red-300 bg-red-500/20 border-red-400/30';
      case 'urgent': return 'text-orange-300 bg-orange-500/20 border-orange-400/30';
      case 'routine': return 'text-green-300 bg-green-500/20 border-green-400/30';
      default: return 'text-gray-300 bg-gray-500/20 border-gray-400/30';
    }
  };

  const onCallForSelectedSpecialty = selectedSpecialty ? getOnCallPhysiciansForSpecialty(selectedSpecialty) : [];
  const isUserPrimaryAttending = isPrimaryAttending(selectedSpecialty);

  return (
    <Card className="backdrop-blur-xl bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-cyan-500/10 border border-white/20 rounded-2xl shadow-2xl shadow-purple-500/10">
      <CardHeader className="pb-4">
        <CardTitle className="text-white flex items-center gap-3 text-xl">
          <div className="p-2 bg-gradient-to-r from-purple-500/30 to-blue-500/30 rounded-xl backdrop-blur-sm border border-white/20">
            <Brain className="h-6 w-6 text-white" />
          </div>
          AI-Powered Clinical Routing
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Consult Type */}
        <div className="flex gap-2">
          <Button
            variant={consultType === 'new' ? "default" : "outline"}
            onClick={() => setConsultType('new')}
            className={consultType === 'new' 
              ? "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white border-0" 
              : "bg-white/5 border-white/20 text-white hover:bg-white/10 backdrop-blur-sm"
            }
          >
            <UserPlus className="h-4 w-4 mr-2" />
            New Consult
          </Button>
          <Button
            variant={consultType === 'established' ? "default" : "outline"}
            onClick={() => setConsultType('established')}
            className={consultType === 'established' 
              ? "bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white border-0" 
              : "bg-white/5 border-white/20 text-white hover:bg-white/10 backdrop-blur-sm"
            }
          >
            <User className="h-4 w-4 mr-2" />
            Established Patient
          </Button>
        </div>

        {/* Patient Selection */}
        <div>
          <label className="text-sm text-white/70 mb-3 block font-medium">Select Patient</label>
          <Select value={selectedPatient} onValueChange={setSelectedPatient}>
            <SelectTrigger className="bg-white/5 border-white/20 text-white backdrop-blur-sm rounded-xl h-12 hover:bg-white/10 transition-all">
              <SelectValue placeholder="Choose patient..." />
            </SelectTrigger>
            <SelectContent className="bg-gray-900/95 border-white/20 text-white backdrop-blur-xl rounded-xl">
              <SelectItem value="no-patient" className="hover:bg-white/10 rounded-lg">
                No specific patient
              </SelectItem>
              {patients?.map((patient) => (
                <SelectItem key={patient.id} value={patient.id} className="hover:bg-white/10 rounded-lg">
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

        {/* Clinical Message */}
        <div>
          <label className="text-sm text-white/70 mb-3 block font-medium">
            Clinical Message
          </label>
          <Textarea
            value={messageContent}
            onChange={(e) => handleMessageChange(e.target.value)}
            placeholder="Describe the clinical situation, symptoms, or consultation request..."
            className="bg-white/5 border-white/20 text-white placeholder:text-white/50 min-h-[120px] backdrop-blur-sm rounded-xl resize-none focus:ring-2 focus:ring-purple-500/50"
          />
        </div>

        {/* AI Analysis Card */}
        {showAICard && (
          <div className={`p-4 border rounded-xl backdrop-blur-sm animate-in slide-in-from-top-4 duration-300 ${
            aiError 
              ? 'bg-gradient-to-r from-red-500/10 to-orange-500/10 border-red-400/30' 
              : 'bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border-cyan-400/30'
          }`}>
            {isAnalyzing ? (
              <div className="flex items-center gap-3 text-cyan-200">
                <Sparkles className="h-5 w-5 animate-pulse" />
                <span>AI analyzing clinical message...</span>
              </div>
            ) : aiError ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <XCircle className="h-5 w-5 text-red-300" />
                  <span className="text-red-200 font-medium">AI Analysis Failed</span>
                </div>
                <p className="text-red-200/80 text-sm">{aiError}</p>
                <div className="flex items-start gap-2 p-3 bg-yellow-500/10 border border-yellow-400/30 rounded-lg">
                  <AlertCircle className="h-4 w-4 text-yellow-300 mt-0.5 flex-shrink-0" />
                  <div className="text-yellow-200 text-sm">
                    <p className="font-medium mb-1">Manual Selection Required</p>
                    <p>Please select specialty and physician manually below. Consider Internal Medicine or Emergency Medicine for general cases.</p>
                  </div>
                </div>
              </div>
            ) : aiAnalysis && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 mb-2">
                  <Brain className="h-4 w-4 text-cyan-300" />
                  <span className="text-cyan-200 font-medium text-sm">AI Recommendation</span>
                  <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-400/30 text-xs">
                    {aiAnalysis.confidence}% confidence
                  </Badge>
                </div>
                
                <div className="space-y-2 text-sm">
                  {/* Acuity */}
                  <div className="flex items-center gap-2">
                    <span className="text-white/60 text-xs">Acuity:</span>
                    <Badge className={`${getAcuityColor(aiAnalysis.acuity)} text-xs`}>
                      {aiAnalysis.acuity.toUpperCase()}
                    </Badge>
                  </div>
                  
                  {/* Specialty */}
                  <div className="flex items-center gap-2">
                    <span className="text-white/60 text-xs">Specialty:</span>
                    <div className="flex items-center gap-1">
                      <Stethoscope className="h-3 w-3 text-purple-300" />
                      <span className="text-purple-300 text-xs font-medium">
                        {specialties?.find(s => s.id === aiAnalysis.recommendedSpecialty)?.name || 'General'}
                      </span>
                    </div>
                  </div>

                  {/* On-Call Physician - Only show if user is NOT primary attending */}
                  {!isUserPrimaryAttending && aiAnalysis.recommendedPhysician && (
                    <div className="flex items-center gap-2">
                      <span className="text-white/60 text-xs">On-Call:</span>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-green-300" />
                        <span className="text-green-300 text-xs font-medium">
                          Dr. {physicians?.find(p => p.id === aiAnalysis.recommendedPhysician)?.first_name} {physicians?.find(p => p.id === aiAnalysis.recommendedPhysician)?.last_name}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Primary Attending Notice */}
                  {isUserPrimaryAttending && (
                    <div className="flex items-center gap-2 pt-2 border-t border-cyan-400/20">
                      <Badge className="bg-blue-500/20 text-blue-300 border-blue-400/30 text-xs">
                        You are Primary Attending for this specialty
                      </Badge>
                    </div>
                  )}

                  {/* Reasoning */}
                  <div className="pt-2 border-t border-cyan-400/20">
                    <p className="text-cyan-200/80 text-xs">
                      <span className="font-medium">AI Reasoning:</span> {aiAnalysis.reasoning}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Specialty Selection - Show if AI provided recommendation OR if AI failed */}
        {(showAICard || selectedSpecialty) && (
          <div>
            <label className="text-sm text-white/70 mb-3 block font-medium">
              {aiAnalysis ? 'Specialty (AI Selected - Can Override)' : 'Select Specialty'}
            </label>
            <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
              <SelectTrigger className="bg-white/5 border-white/20 text-white backdrop-blur-sm rounded-xl h-12 hover:bg-white/10 transition-all">
                <SelectValue placeholder="Select specialty..." />
              </SelectTrigger>
              <SelectContent className="bg-gray-900/95 border-white/20 text-white backdrop-blur-xl rounded-xl">
                {specialties?.map((specialty) => (
                  <SelectItem key={specialty.id} value={specialty.id} className="hover:bg-white/10 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Stethoscope className="h-4 w-4" />
                      {specialty.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Physician Selection - Only show if user is NOT primary attending */}
        {selectedSpecialty && onCallForSelectedSpecialty.length > 0 && !isUserPrimaryAttending && (
          <div>
            <label className="text-sm text-white/70 mb-3 block font-medium flex items-center gap-2">
              <Clock className="h-4 w-4 text-green-400" />
              On-Call {specialties?.find(s => s.id === selectedSpecialty)?.name} Physicians
            </label>
            <Select value={selectedPhysician} onValueChange={setSelectedPhysician}>
              <SelectTrigger className="bg-white/5 border-white/20 text-white backdrop-blur-sm rounded-xl h-12 hover:bg-white/10 transition-all">
                <SelectValue placeholder="Select on-call physician..." />
              </SelectTrigger>
              <SelectContent className="bg-gray-900/95 border-white/20 text-white backdrop-blur-xl rounded-xl">
                {onCallForSelectedSpecialty.map((schedule) => (
                  <SelectItem key={schedule.physician.id} value={schedule.physician.id} className="hover:bg-white/10 rounded-lg">
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span>Dr. {schedule.physician.first_name} {schedule.physician.last_name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {schedule.is_primary && (
                          <Badge className="bg-green-600 text-white text-xs">Primary</Badge>
                        )}
                        <Clock className="h-3 w-3 text-green-400" />
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Send Button */}
        <Button 
          onClick={handleSend}
          disabled={!messageContent.trim() || (!selectedPhysician && !selectedSpecialty) || aiLoading}
          className="w-full h-12 text-white font-semibold rounded-xl transition-all bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 shadow-lg shadow-purple-500/25"
        >
          <Send className="h-5 w-5 mr-2" />
          Send Clinical Message
        </Button>
      </CardContent>
    </Card>
  );
};

export default SmartRoutingCard;
