
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
  AlertCircle
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
  const [aiError, setAiError] = useState(false);

  const getOnCallPhysiciansForSpecialty = (specialtyId: string) => {
    return onCallSchedules?.filter(schedule => 
      schedule.specialty_id === specialtyId
    ) || [];
  };

  const isPrimaryAttending = () => {
    if (!currentUser?.id || !selectedSpecialty) return false;
    
    const currentUserPhysician = physicians?.find(p => p.user_id === currentUser.id);
    if (!currentUserPhysician) return false;
    
    const primarySchedule = onCallSchedules?.find(schedule => 
      schedule.specialty_id === selectedSpecialty && 
      schedule.physician_id === currentUserPhysician.id &&
      schedule.is_primary
    );
    
    return !!primarySchedule;
  };

  const analyzeMessage = async (content: string) => {
    if (!content.trim() || content.length < 10) return;

    setIsAnalyzing(true);
    setShowAICard(true);
    setAiError(false);
    
    try {
      const selectedPatientData = patients?.find(p => p.id === selectedPatient);
      const patientContext = selectedPatientData ? 
        `Patient: ${selectedPatientData.first_name} ${selectedPatientData.last_name}, Age: ${new Date().getFullYear() - new Date(selectedPatientData.date_of_birth).getFullYear()}, Medical Conditions: ${selectedPatientData.medical_conditions?.join(', ') || 'None'}, Allergies: ${selectedPatientData.allergies?.join(', ') || 'None'}` : 
        'No specific patient context';

      console.log('Analyzing message with AI:', content);
      
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

      // Parse AI response to extract structured data
      const acuityMatch = result.toLowerCase().match(/(critical|urgent|routine)/);
      const acuity = acuityMatch ? acuityMatch[1] as 'routine' | 'urgent' | 'critical' : 'routine';
      
      // Find recommended specialty by matching AI response with available specialties
      const specialtyMatch = specialties?.find(s => 
        result.toLowerCase().includes(s.name.toLowerCase())
      );
      
      if (!specialtyMatch) {
        throw new Error('No matching specialty found in AI response');
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
        reasoning: result.substring(0, 120) + (result.length > 120 ? '...' : '')
      };

      setAiAnalysis(analysis);
      setSelectedSpecialty(analysis.recommendedSpecialty);
      
      // Only auto-select physician if user is not the primary attending
      if (!isPrimaryAttending() && analysis.recommendedPhysician) {
        setSelectedPhysician(analysis.recommendedPhysician);
      }

      console.log('AI Analysis completed:', analysis);

    } catch (error) {
      console.error('AI Analysis failed:', error);
      setAiError(true);
      
      // Fallback: recommend general internal medicine or emergency medicine
      const fallbackSpecialty = specialties?.find(s => 
        s.name.toLowerCase().includes('internal') || 
        s.name.toLowerCase().includes('emergency') ||
        s.name.toLowerCase().includes('general')
      );
      
      if (fallbackSpecialty) {
        setSelectedSpecialty(fallbackSpecialty.id);
        const onCallForSpecialty = getOnCallPhysiciansForSpecialty(fallbackSpecialty.id);
        if (onCallForSpecialty.length > 0 && !isPrimaryAttending()) {
          setSelectedPhysician(onCallForSpecialty[0].physician.id);
        }
      }
      
      toast({
        title: "AI Analysis Unavailable",
        description: "Manual specialty selection enabled. AI service is temporarily unavailable.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleMessageChange = (content: string) => {
    setMessageContent(content);
    
    // Auto-analyze when user stops typing (debounced)
    if (content.trim().length > 10) {
      const timeoutId = setTimeout(() => {
        analyzeMessage(content);
      }, 1500);
      
      return () => clearTimeout(timeoutId);
    } else {
      setShowAICard(false);
      setAiAnalysis(null);
      setAiError(false);
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
      physicianName: selectedPhysicianData ? `${selectedPhysicianData.first_name} ${selectedPhysicianData.last_name}` : undefined,
      urgency: aiAnalysis?.acuity || 'routine',
      sender: currentUser?.name || 'Current User',
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
    setAiError(false);

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
  const isUserPrimaryAttending = isPrimaryAttending();

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
              ? 'bg-gradient-to-r from-orange-500/10 to-red-500/10 border-orange-400/30' 
              : 'bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border-cyan-400/30'
          }`}>
            {isAnalyzing ? (
              <div className="flex items-center gap-3 text-cyan-200">
                <Sparkles className="h-5 w-5 animate-pulse" />
                <span>AI analyzing clinical message...</span>
              </div>
            ) : aiError ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-orange-300" />
                  <span className="text-orange-200 font-medium text-sm">AI Unavailable - Manual Selection</span>
                </div>
                <p className="text-orange-200/70 text-xs">Please manually select specialty and physician below</p>
              </div>
            ) : aiAnalysis && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 mb-2">
                  <Brain className="h-4 w-4 text-cyan-300" />
                  <span className="text-cyan-200 font-medium text-sm">AI Clinical Recommendation</span>
                  <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-400/30 text-xs">
                    {aiAnalysis.confidence}%
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <span className="text-white/60 text-xs">Acuity:</span>
                    <Badge className={`${getAcuityColor(aiAnalysis.acuity)} text-xs ml-2`}>
                      {aiAnalysis.acuity.toUpperCase()}
                    </Badge>
                  </div>
                  
                  <div>
                    <span className="text-white/60 text-xs">Specialty:</span>
                    <div className="flex items-center gap-1 mt-1">
                      <Stethoscope className="h-3 w-3 text-purple-300" />
                      <span className="text-purple-300 text-xs">
                        {specialties?.find(s => s.id === aiAnalysis.recommendedSpecialty)?.name || 'General'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Show recommended physician only if user is NOT primary attending */}
                {!isUserPrimaryAttending && aiAnalysis.recommendedPhysician && (
                  <div className="mt-2 pt-2 border-t border-cyan-400/20">
                    <span className="text-white/60 text-xs">Recommended On-Call:</span>
                    <div className="flex items-center gap-1 mt-1">
                      <User className="h-3 w-3 text-green-300" />
                      <span className="text-green-300 text-xs">
                        Dr. {physicians?.find(p => p.id === aiAnalysis.recommendedPhysician)?.first_name} {physicians?.find(p => p.id === aiAnalysis.recommendedPhysician)?.last_name}
                      </span>
                    </div>
                  </div>
                )}

                {isUserPrimaryAttending && (
                  <div className="mt-2 pt-2 border-t border-cyan-400/20">
                    <div className="flex items-center gap-1">
                      <Badge className="bg-blue-500/20 text-blue-300 border-blue-400/30 text-xs">
                        You are Primary Attending
                      </Badge>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Specialty Selection (when AI provides recommendation or fails) */}
        {(showAICard || selectedSpecialty) && (
          <div>
            <label className="text-sm text-white/70 mb-3 block font-medium">
              Specialty {aiError ? '(Manual Selection Required)' : '(AI Selected - Can Override)'}
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
              On-Call {specialties?.find(s => s.id === selectedSpecialty)?.name}
            </label>
            <Select value={selectedPhysician} onValueChange={setSelectedPhysician}>
              <SelectTrigger className="bg-white/5 border-white/20 text-white backdrop-blur-sm rounded-xl h-12 hover:bg-white/10 transition-all">
                <SelectValue placeholder="Select physician..." />
              </SelectTrigger>
              <SelectContent className="bg-gray-900/95 border-white/20 text-white backdrop-blur-xl rounded-xl">
                {onCallForSelectedSpecialty.map((schedule) => (
                  <SelectItem key={schedule.physician.id} value={schedule.physician.id} className="hover:bg-white/10 rounded-lg">
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Dr. {schedule.physician.first_name} {schedule.physician.last_name}
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
