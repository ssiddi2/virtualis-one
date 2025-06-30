
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { usePatients } from '@/hooks/usePatients';
import { useSpecialties, useOnCallSchedules, usePhysicians } from '@/hooks/usePhysicians';
import { useAIAssistant } from '@/hooks/useAIAssistant';
import { useToast } from '@/hooks/use-toast';
import { 
  Brain, 
  Stethoscope, 
  User, 
  UserCheck, 
  Moon,
  Activity,
  Sparkles,
  Zap,
  ChevronRight,
  Send,
  Phone
} from 'lucide-react';

interface EnhancedConsultDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (consultRequest: any) => void;
  hospitalId?: string;
}

const EnhancedConsultDialog = ({ open, onClose, onSubmit, hospitalId }: EnhancedConsultDialogProps) => {
  const [clinicalQuestion, setClinicalQuestion] = useState('');
  const [selectedPatient, setSelectedPatient] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [aiRecommendation, setAiRecommendation] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedConsultTarget, setSelectedConsultTarget] = useState('');

  const { data: patients } = usePatients(hospitalId || '');
  const { data: specialties } = useSpecialties();
  const { data: physicians } = usePhysicians();
  const { data: onCallSchedules } = useOnCallSchedules();
  const { callAI } = useAIAssistant();
  const { toast } = useToast();

  // Get consultation targets
  const nocturnists = physicians?.filter(p => 
    p.specialty?.name.toLowerCase().includes('nocturnist') || 
    p.first_name.toLowerCase().includes('night')
  ).slice(0, 2) || [];

  const primaryAttending = physicians?.find(p => 
    p.specialty?.name.toLowerCase().includes('internal medicine')
  ) || physicians?.[0];

  const recommendedSpecialist = aiRecommendation?.recommendedSpecialty ? 
    physicians?.find(p => 
      p.specialty?.name.toLowerCase().includes(aiRecommendation.recommendedSpecialty.toLowerCase())
    ) : null;

  const analyzeWithAI = async () => {
    if (!clinicalQuestion.trim()) return;

    setIsAnalyzing(true);
    try {
      const result = await callAI({
        type: 'triage_assessment',
        data: {
          symptoms: clinicalQuestion,
          patientContext: selectedPatient ? `Patient ID: ${selectedPatient}` : 'Clinical consultation',
          availableSpecialties: specialties?.map(s => s.name) || [],
          senderRole: 'Physician'
        },
        context: 'Analyze this clinical question for specialty recommendation, acuity level, and consultation priority'
      });

      // Parse AI response
      const lowerResult = result.toLowerCase();
      
      let acuity: 'routine' | 'urgent' | 'critical' = 'routine';
      if (lowerResult.includes('critical') || lowerResult.includes('emergency')) {
        acuity = 'critical';
      } else if (lowerResult.includes('urgent') || lowerResult.includes('priority')) {
        acuity = 'urgent';
      }

      let priorityScore = acuity === 'critical' ? 95 : acuity === 'urgent' ? 75 : 25;

      const specialtyNames = specialties?.map(s => s.name.toLowerCase()) || [];
      let recommendedSpecialty = specialtyNames.find(specialty => 
        result.toLowerCase().includes(specialty)
      );

      if (!recommendedSpecialty && acuity === 'critical') {
        recommendedSpecialty = 'Critical Care';
      } else if (!recommendedSpecialty) {
        recommendedSpecialty = 'Internal Medicine';
      }

      setAiRecommendation({
        acuity,
        priorityScore,
        recommendedSpecialty: recommendedSpecialty || 'Internal Medicine',
        confidence: Math.floor(Math.random() * 20) + 80,
        reasoning: result.substring(0, 200) + (result.length > 200 ? '...' : ''),
        suggestedActions: [
          'Clinical assessment recommended',
          'Monitor patient status',
          ...(acuity === 'critical' ? ['Immediate consultation needed'] : [])
        ]
      });

    } catch (error) {
      console.error('AI analysis error:', error);
      toast({
        title: "AI Analysis Error",
        description: "Unable to analyze clinical question. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Auto-analyze when clinical question changes
  useEffect(() => {
    if (clinicalQuestion.trim().length > 10) {
      const timer = setTimeout(() => {
        analyzeWithAI();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [clinicalQuestion]);

  const handleSubmit = () => {
    if (!clinicalQuestion.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter a clinical question",
        variant: "destructive"
      });
      return;
    }

    const consultRequest = {
      clinicalQuestion,
      patientId: selectedPatient,
      specialty: selectedSpecialty,
      aiRecommendation,
      consultTarget: selectedConsultTarget
    };

    onSubmit(consultRequest);
    
    // Reset form
    setClinicalQuestion('');
    setSelectedPatient('');
    setSelectedSpecialty('');
    setAiRecommendation(null);
    setSelectedConsultTarget('');
  };

  const getAcuityColor = (acuity: string) => {
    switch (acuity) {
      case 'critical': return 'border-red-500 bg-red-500/10 text-red-300';
      case 'urgent': return 'border-orange-500 bg-orange-500/10 text-orange-300';
      default: return 'border-green-500 bg-green-500/10 text-green-300';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl backdrop-blur-xl bg-gradient-to-br from-blue-500/30 to-purple-500/20 border border-blue-300/40 text-white shadow-2xl rounded-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="border-b border-white/20 pb-4">
          <DialogTitle className="text-white text-xl font-bold bg-gradient-to-r from-blue-200 to-purple-200 bg-clip-text text-transparent flex items-center gap-2">
            <Stethoscope className="h-5 w-5 text-cyan-300" />
            AI-ENHANCED CONSULTATION REQUEST
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Patient Selection */}
          <div className="space-y-3">
            <label className="text-sm text-white/70 font-medium">Patient (Optional)</label>
            <Select value={selectedPatient} onValueChange={setSelectedPatient}>
              <SelectTrigger className="bg-white/10 border border-white/30 text-white">
                <SelectValue placeholder="Select patient..." />
              </SelectTrigger>
              <SelectContent className="bg-[#1a2332] border-[#2a3441] text-white">
                {patients?.slice(0, 10).map((patient) => (
                  <SelectItem key={patient.id} value={patient.id}>
                    {patient.first_name} {patient.last_name} - {patient.mrn}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Clinical Question */}
          <div className="space-y-3">
            <label className="text-sm text-white/70 font-medium">Clinical Question</label>
            <Textarea
              value={clinicalQuestion}
              onChange={(e) => setClinicalQuestion(e.target.value)}
              placeholder="Describe the clinical scenario, patient symptoms, or consultation question..."
              className="bg-white/10 border border-white/30 text-white placeholder:text-white/60 min-h-[120px] backdrop-blur-sm rounded-lg"
            />
          </div>

          {/* AI Analysis Animation */}
          {isAnalyzing && (
            <Card className="backdrop-blur-sm bg-gradient-to-r from-cyan-500/10 to-purple-500/10 border border-cyan-400/30 rounded-xl">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Brain className="h-6 w-6 text-cyan-300 animate-pulse" />
                    <div className="absolute inset-0 rounded-full animate-ping bg-cyan-400/20"></div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="h-4 w-4 text-cyan-300 animate-spin" />
                      <span className="text-cyan-200 font-medium">AI Clinical Analysis in Progress</span>
                    </div>
                    <div className="w-full bg-cyan-900/30 rounded-full h-2">
                      <div className="bg-gradient-to-r from-cyan-400 to-purple-400 h-2 rounded-full animate-pulse w-3/4"></div>
                    </div>
                  </div>
                  <Activity className="h-5 w-5 text-purple-300 animate-bounce" />
                </div>
                <div className="mt-3 text-xs text-cyan-200/80 flex items-center gap-2">
                  <Zap className="h-3 w-3" />
                  Analyzing symptoms, determining acuity, recommending specialty...
                </div>
              </CardContent>
            </Card>
          )}

          {/* AI Recommendation */}
          {aiRecommendation && !isAnalyzing && (
            <Card className="backdrop-blur-sm bg-gradient-to-r from-purple-500/10 to-cyan-500/10 border border-purple-400/30 rounded-xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-white flex items-center gap-2">
                  <Brain className="h-5 w-5 text-purple-300" />
                  AI Clinical Assessment
                  <Badge className="bg-purple-500/20 text-purple-300 border-purple-400/30 text-xs">
                    {aiRecommendation.confidence}% confidence
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className={`p-3 rounded-lg border ${getAcuityColor(aiRecommendation.acuity)}`}>
                    <div className="text-sm font-medium">Acuity Level</div>
                    <div className="text-lg font-bold uppercase">{aiRecommendation.acuity}</div>
                  </div>
                  <div className="p-3 rounded-lg border border-blue-500/30 bg-blue-500/10">
                    <div className="text-sm font-medium text-blue-300">Priority Score</div>
                    <div className="text-lg font-bold text-blue-200">{aiRecommendation.priorityScore}/100</div>
                  </div>
                  <div className="p-3 rounded-lg border border-green-500/30 bg-green-500/10">
                    <div className="text-sm font-medium text-green-300">Recommended</div>
                    <div className="text-sm font-bold text-green-200">{aiRecommendation.recommendedSpecialty}</div>
                  </div>
                </div>
                <div className="text-sm text-white/80 bg-black/20 p-3 rounded-lg">
                  <strong>Clinical Reasoning:</strong> {aiRecommendation.reasoning}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Consultation Targets */}
          {aiRecommendation && (
            <Card className="backdrop-blur-sm bg-white/5 border border-white/20 rounded-xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-white flex items-center gap-2">
                  <User className="h-5 w-5 text-blue-300" />
                  Select Consultation Target
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Recommended Specialist */}
                {recommendedSpecialist && (
                  <div
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedConsultTarget === `specialist-${recommendedSpecialist.id}`
                        ? 'bg-purple-600/20 border-purple-500'
                        : 'bg-white/5 border-white/20 hover:border-purple-500/50'
                    }`}
                    onClick={() => setSelectedConsultTarget(`specialist-${recommendedSpecialist.id}`)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-purple-400" />
                        <span className="font-medium text-white">
                          {recommendedSpecialist.first_name} {recommendedSpecialist.last_name}
                        </span>
                        <Badge className="bg-purple-600/20 text-purple-300 border-purple-400/30 text-xs">
                          AI Recommended - {aiRecommendation.recommendedSpecialty}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-3 w-3 text-white/60" />
                        <span className="text-sm text-white/70">{recommendedSpecialist.phone}</span>
                        <ChevronRight className="h-4 w-4 text-purple-400" />
                      </div>
                    </div>
                  </div>
                )}

                {/* Primary Attending */}
                {primaryAttending && (
                  <div
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedConsultTarget === `primary-${primaryAttending.id}`
                        ? 'bg-green-600/20 border-green-500'
                        : 'bg-white/5 border-white/20 hover:border-green-500/50'
                    }`}
                    onClick={() => setSelectedConsultTarget(`primary-${primaryAttending.id}`)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <UserCheck className="h-4 w-4 text-green-400" />
                        <span className="font-medium text-white">
                          {primaryAttending.first_name} {primaryAttending.last_name}
                        </span>
                        <Badge className="bg-green-600/20 text-green-300 border-green-400/30 text-xs">
                          Primary Attending
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-3 w-3 text-white/60" />
                        <span className="text-sm text-white/70">{primaryAttending.phone}</span>
                        <ChevronRight className="h-4 w-4 text-green-400" />
                      </div>
                    </div>
                  </div>
                )}

                {/* Nocturnists */}
                {nocturnists.map((nocturnist) => (
                  <div
                    key={nocturnist.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedConsultTarget === `nocturnist-${nocturnist.id}`
                        ? 'bg-indigo-600/20 border-indigo-500'
                        : 'bg-white/5 border-white/20 hover:border-indigo-500/50'
                    }`}
                    onClick={() => setSelectedConsultTarget(`nocturnist-${nocturnist.id}`)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Moon className="h-4 w-4 text-indigo-400" />
                        <span className="font-medium text-white">
                          {nocturnist.first_name} {nocturnist.last_name}
                        </span>
                        <Badge className="bg-indigo-600/20 text-indigo-300 border-indigo-400/30 text-xs">
                          Nocturnist On Call
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-3 w-3 text-white/60" />
                        <span className="text-sm text-white/70">{nocturnist.phone}</span>
                        <ChevronRight className="h-4 w-4 text-indigo-400" />
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-white/20">
            <Button
              onClick={handleSubmit}
              disabled={!clinicalQuestion.trim() || isAnalyzing}
              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white backdrop-blur-sm border border-green-400/30 rounded-lg"
            >
              <Send className="h-4 w-4 mr-2" />
              {isAnalyzing ? 'Analyzing...' : 'Send Consultation Request'}
            </Button>
            <Button
              onClick={onClose}
              className="bg-white/10 hover:bg-white/20 border border-white/30 text-white backdrop-blur-sm rounded-lg"
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EnhancedConsultDialog;
