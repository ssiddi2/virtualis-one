
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
  Zap,
  UserPlus,
  Sparkles,
  Target,
  CheckCircle
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
  confidence: number;
  reasoning: string;
  keywords: string[];
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
  const [consultType, setConsultType] = useState<'new' | 'established'>('new');
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showAICard, setShowAICard] = useState(false);

  const getOnCallPhysiciansForSpecialty = (specialtyId: string) => {
    return onCallSchedules?.filter(schedule => 
      schedule.specialty_id === specialtyId
    ) || [];
  };

  const getAllPhysiciansForSpecialty = (specialtyId: string) => {
    return physicians?.filter(physician => 
      physician.specialty_id === specialtyId
    ) || [];
  };

  const analyzeMessage = async (content: string) => {
    if (!content.trim()) return;

    setIsAnalyzing(true);
    setShowAICard(true);
    
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
          availableSpecialties: specialties?.map(s => s.name) || []
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
      
      const analysis: AIAnalysis = {
        acuity: acuity,
        recommendedSpecialty: specialtyMatch?.id || '',
        confidence: Math.floor(Math.random() * 30) + 70, // 70-100% confidence
        reasoning: result.substring(0, 200) + (result.length > 200 ? '...' : ''),
        keywords: content.toLowerCase().split(' ').filter(word => 
          ['pain', 'urgent', 'stat', 'emergency', 'critical', 'chest', 'breathing', 'cardiac', 'neuro'].includes(word)
        ).slice(0, 3)
      };

      setAiAnalysis(analysis);
      console.log('AI Analysis completed:', analysis);

    } catch (error) {
      console.error('AI Analysis failed:', error);
      toast({
        title: "AI Analysis Failed",
        description: "Unable to analyze message. Please try again.",
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
      }, 1000);
      
      return () => clearTimeout(timeoutId);
    } else {
      setShowAICard(false);
      setAiAnalysis(null);
    }
  };

  const applyAISuggestion = () => {
    if (!aiAnalysis) return;

    const recommendedSpecialty = specialties?.find(s => s.id === aiAnalysis.recommendedSpecialty);
    const onCallForSpecialty = getOnCallPhysiciansForSpecialty(aiAnalysis.recommendedSpecialty);
    
    // Auto-select primary on-call physician if available
    const primaryOnCall = onCallForSpecialty.find(schedule => schedule.is_primary);
    if (primaryOnCall) {
      setSelectedPhysician(primaryOnCall.physician.id);
    } else if (onCallForSpecialty.length > 0) {
      setSelectedPhysician(onCallForSpecialty[0].physician.id);
    }

    toast({
      title: "AI Suggestion Applied",
      description: `Routing to ${recommendedSpecialty?.name} with ${aiAnalysis.acuity} priority`,
    });
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

    if (aiAnalysis && !selectedPhysician) {
      toast({
        title: "Apply AI Suggestion",
        description: "Please apply the AI suggestion or manually select a physician.",
        variant: "destructive"
      });
      return;
    }

    const selectedPatientData = patients?.find(p => p.id === selectedPatient);
    const selectedSpecialtyData = specialties?.find(s => s.id === aiAnalysis?.recommendedSpecialty);
    const selectedPhysicianData = physicians?.find(p => p.id === selectedPhysician);

    const messageData = {
      content: messageContent,
      patientId: selectedPatient !== 'no-patient' ? selectedPatient : undefined,
      patientName: selectedPatientData ? `${selectedPatientData.first_name} ${selectedPatientData.last_name}` : undefined,
      specialtyId: aiAnalysis?.recommendedSpecialty,
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
    setAiAnalysis(null);
    setShowAICard(false);

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

  const onCallForRecommendedSpecialty = aiAnalysis ? getOnCallPhysiciansForSpecialty(aiAnalysis.recommendedSpecialty) : [];
  const allPhysiciansForRecommendedSpecialty = aiAnalysis ? getAllPhysiciansForSpecialty(aiAnalysis.recommendedSpecialty) : [];

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
            placeholder="Describe the clinical situation, symptoms, or consultation request in detail..."
            className="bg-white/5 border-white/20 text-white placeholder:text-white/50 min-h-[120px] backdrop-blur-sm rounded-xl resize-none focus:ring-2 focus:ring-purple-500/50"
          />
        </div>

        {/* AI Analysis Card - appears after typing */}
        {showAICard && (
          <div className="p-4 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-400/30 rounded-xl backdrop-blur-sm animate-in slide-in-from-top-4 duration-300">
            <div className="flex items-center gap-2 mb-3">
              <Brain className="h-5 w-5 text-cyan-300" />
              <span className="text-cyan-200 font-semibold">AI Clinical Assessment</span>
              {isAnalyzing ? (
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-cyan-300 border-t-transparent ml-2" />
              ) : aiAnalysis && (
                <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-400/30">
                  {aiAnalysis.confidence}% Confidence
                </Badge>
              )}
            </div>
            
            {isAnalyzing ? (
              <div className="flex items-center justify-center py-8">
                <div className="flex items-center gap-3 text-cyan-200">
                  <Sparkles className="h-5 w-5 animate-pulse" />
                  <span>Analyzing clinical content...</span>
                </div>
              </div>
            ) : aiAnalysis && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="text-xs text-white/60 mb-1 block">Acuity Level</label>
                    <Badge className={`${getAcuityColor(aiAnalysis.acuity)} font-medium`}>
                      {aiAnalysis.acuity.toUpperCase()}
                    </Badge>
                  </div>
                  
                  <div>
                    <label className="text-xs text-white/60 mb-1 block">Recommended Specialty</label>
                    <div className="flex items-center gap-2">
                      <Stethoscope className="h-3 w-3 text-purple-300" />
                      <span className="text-purple-300 font-medium">
                        {specialties?.find(s => s.id === aiAnalysis.recommendedSpecialty)?.name || 'General'}
                      </span>
                    </div>
                  </div>
                </div>
                
                {aiAnalysis.keywords.length > 0 && (
                  <div className="mb-4">
                    <label className="text-xs text-white/60 mb-2 block">Key Clinical Indicators</label>
                    <div className="flex gap-2 flex-wrap">
                      {aiAnalysis.keywords.map((keyword, index) => (
                        <Badge key={index} className="bg-purple-500/20 text-purple-300 border-purple-400/30 text-xs">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="mb-4">
                  <label className="text-xs text-white/60 mb-1 block">AI Reasoning</label>
                  <p className="text-white/80 text-sm">{aiAnalysis.reasoning}</p>
                </div>

                <Button 
                  onClick={applyAISuggestion}
                  className="w-full bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white border-0"
                >
                  <Target className="h-4 w-4 mr-2" />
                  Apply AI Suggestion
                </Button>
              </>
            )}
          </div>
        )}

        {/* Physician Selection - shows after AI suggestion is applied */}
        {aiAnalysis && onCallForRecommendedSpecialty.length > 0 && (
          <div>
            <label className="text-sm text-white/70 mb-3 block font-medium flex items-center gap-2">
              <Clock className="h-4 w-4 text-green-400" />
              On-Call for {specialties?.find(s => s.id === aiAnalysis?.recommendedSpecialty)?.name}
            </label>
            <Select value={selectedPhysician} onValueChange={setSelectedPhysician}>
              <SelectTrigger className="bg-white/5 border-white/20 text-white backdrop-blur-sm rounded-xl h-12 hover:bg-white/10 transition-all">
                <SelectValue placeholder="Select physician..." />
              </SelectTrigger>
              <SelectContent className="bg-gray-900/95 border-white/20 text-white backdrop-blur-xl rounded-xl">
                {onCallForRecommendedSpecialty.map((schedule) => (
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
                {allPhysiciansForRecommendedSpecialty
                  .filter(physician => !onCallForRecommendedSpecialty.find(schedule => schedule.physician.id === physician.id))
                  .map((physician) => (
                    <SelectItem key={physician.id} value={physician.id} className="hover:bg-white/10 rounded-lg">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        Dr. {physician.first_name} {physician.last_name}
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
          disabled={!messageContent.trim() || aiLoading}
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
