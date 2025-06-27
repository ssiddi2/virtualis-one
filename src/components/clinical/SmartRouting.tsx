
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Brain, 
  Stethoscope, 
  Clock, 
  AlertTriangle, 
  CheckCircle,
  Phone,
  MessageSquare
} from "lucide-react";
import { useAIAssistant } from "@/hooks/useAIAssistant";
import { useToast } from "@/hooks/use-toast";
import type { Provider } from "./ProviderDirectory";

interface SmartRoutingProps {
  messageContent: string;
  patientData?: any;
  onSpecialtyRecommendation: (specialty: string) => void;
  onProviderRecommendation: (provider: Provider) => void;
}

interface RoutingRecommendation {
  recommendedSpecialty: string;
  urgencyLevel: 'routine' | 'urgent' | 'critical';
  confidence: number;
  reasoning: string;
  suggestedProviders: Provider[];
  alternativeSpecialties: string[];
}

const SmartRouting = ({ 
  messageContent, 
  patientData, 
  onSpecialtyRecommendation,
  onProviderRecommendation 
}: SmartRoutingProps) => {
  const { callAI, isLoading } = useAIAssistant();
  const { toast } = useToast();
  const [recommendation, setRecommendation] = useState<RoutingRecommendation | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Mock on-call providers - in real implementation, this would come from your database
  const mockOnCallProviders: Provider[] = [
    {
      id: '1',
      name: 'Dr. Sarah Johnson',
      specialty: 'Cardiology',
      role: 'attending',
      department: 'Cardiac Unit',
      isOnCall: true,
      status: 'available',
      phone: '(555) 123-4567',
      pager: '1234',
      responseTime: '< 5 min',
      rating: 4.8
    },
    {
      id: '2',
      name: 'Dr. Michael Chen',
      specialty: 'Emergency Medicine',
      role: 'attending',
      department: 'Emergency Department',
      isOnCall: true,
      status: 'busy',
      phone: '(555) 234-5678',
      pager: '2345',
      responseTime: '< 10 min',
      rating: 4.9
    },
    {
      id: '3',
      name: 'Dr. Emily Rodriguez',
      specialty: 'Pulmonology',
      role: 'attending',
      department: 'Respiratory Unit',
      isOnCall: true,
      status: 'available',
      phone: '(555) 345-6789',
      responseTime: '< 15 min',
      rating: 4.7
    }
  ];

  const analyzeRoutingNeeds = async () => {
    if (!messageContent) return;

    setIsAnalyzing(true);
    
    try {
      console.log('Analyzing routing needs for message:', messageContent);
      
      const result = await callAI({
        type: 'triage_assessment',
        data: { 
          symptoms: messageContent,
          patientData: patientData || {}
        },
        context: `Clinical message routing analysis. Analyze the message content and recommend the most appropriate medical specialty for consultation. Consider urgency level and provide reasoning.`
      });

      console.log('AI routing analysis result:', result);

      // Parse AI response to determine specialty recommendation
      const lowerResult = result.toLowerCase();
      let recommendedSpecialty = 'Internal Medicine';
      let urgencyLevel: 'routine' | 'urgent' | 'critical' = 'routine';
      
      // Specialty detection
      if (lowerResult.includes('cardio') || lowerResult.includes('heart') || lowerResult.includes('chest pain')) {
        recommendedSpecialty = 'Cardiology';
      } else if (lowerResult.includes('respir') || lowerResult.includes('lung') || lowerResult.includes('breathing')) {
        recommendedSpecialty = 'Pulmonology';
      } else if (lowerResult.includes('neuro') || lowerResult.includes('brain') || lowerResult.includes('stroke')) {
        recommendedSpecialty = 'Neurology';
      } else if (lowerResult.includes('orthop') || lowerResult.includes('bone') || lowerResult.includes('fracture')) {
        recommendedSpecialty = 'Orthopedics';
      } else if (lowerResult.includes('emergency') || lowerResult.includes('trauma')) {
        recommendedSpecialty = 'Emergency Medicine';
      }

      // Urgency detection
      if (lowerResult.includes('critical') || lowerResult.includes('emergency') || lowerResult.includes('immediate')) {
        urgencyLevel = 'critical';
      } else if (lowerResult.includes('urgent') || lowerResult.includes('priority')) {
        urgencyLevel = 'urgent';
      }

      // Find matching on-call providers
      const suggestedProviders = mockOnCallProviders.filter(provider => 
        provider.specialty === recommendedSpecialty || 
        (urgencyLevel === 'critical' && provider.specialty === 'Emergency Medicine')
      );

      const routingRecommendation: RoutingRecommendation = {
        recommendedSpecialty,
        urgencyLevel,
        confidence: 85,
        reasoning: `Based on the clinical content analysis, ${recommendedSpecialty} consultation is recommended due to the nature of the symptoms described.`,
        suggestedProviders,
        alternativeSpecialties: ['Internal Medicine', 'Emergency Medicine']
      };

      setRecommendation(routingRecommendation);
      
      toast({
        title: "Smart Routing Complete",
        description: `Recommended specialty: ${recommendedSpecialty} (${urgencyLevel} priority)`,
      });

    } catch (error) {
      console.error('Error analyzing routing needs:', error);
      toast({
        title: "Analysis Error",
        description: "Failed to analyze routing needs. Using fallback recommendations.",
        variant: "destructive"
      });
      
      // Fallback recommendation
      setRecommendation({
        recommendedSpecialty: 'Internal Medicine',
        urgencyLevel: 'routine',
        confidence: 50,
        reasoning: 'Fallback recommendation due to analysis error',
        suggestedProviders: mockOnCallProviders.filter(p => p.specialty === 'Internal Medicine'),
        alternativeSpecialties: ['Emergency Medicine']
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    if (messageContent && messageContent.length > 10) {
      analyzeRoutingNeeds();
    }
  }, [messageContent]);

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'critical': return 'bg-red-600 text-white';
      case 'urgent': return 'bg-yellow-600 text-white';
      case 'routine': return 'bg-green-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  const getUrgencyIcon = (urgency: string) => {
    switch (urgency) {
      case 'critical': return <AlertTriangle className="h-4 w-4" />;
      case 'urgent': return <Clock className="h-4 w-4" />;
      case 'routine': return <CheckCircle className="h-4 w-4" />;
      default: return <CheckCircle className="h-4 w-4" />;
    }
  };

  if (isAnalyzing) {
    return (
      <Card className="bg-[#1a2332] border-[#2a3441] text-white">
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-400 animate-pulse" />
            <span className="text-sm">Analyzing message for smart routing...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!recommendation) {
    return null;
  }

  return (
    <Card className="bg-[#1a2332] border-[#2a3441] text-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-purple-400" />
          Smart Routing Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Primary Recommendation */}
        <div className="p-3 bg-[#0f1922] rounded-lg border border-purple-500/20">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Stethoscope className="h-4 w-4 text-purple-400" />
              <span className="font-medium">Recommended Specialty</span>
            </div>
            <Badge className={`${getUrgencyColor(recommendation.urgencyLevel)}`}>
              {getUrgencyIcon(recommendation.urgencyLevel)}
              <span className="ml-1">{recommendation.urgencyLevel.toUpperCase()}</span>
            </Badge>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold text-purple-300">
                {recommendation.recommendedSpecialty}
              </span>
              <Badge className="bg-blue-600/20 border-blue-400/30 text-blue-300">
                {recommendation.confidence}% confidence
              </Badge>
            </div>
            
            <p className="text-sm text-white/70">{recommendation.reasoning}</p>
            
            <Button
              onClick={() => onSpecialtyRecommendation(recommendation.recommendedSpecialty)}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              Route to {recommendation.recommendedSpecialty}
            </Button>
          </div>
        </div>

        {/* On-Call Providers */}
        {recommendation.suggestedProviders.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-white/80 flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Available On-Call Providers
            </h4>
            
            {recommendation.suggestedProviders.map((provider) => (
              <div
                key={provider.id}
                className="p-2 bg-[#0f1922] rounded border border-green-500/20"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-green-300">{provider.name}</p>
                    <p className="text-xs text-white/60">
                      {provider.specialty} • {provider.responseTime}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      onClick={() => onProviderRecommendation(provider)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <MessageSquare className="h-3 w-3 mr-1" />
                      Message
                    </Button>
                    {provider.phone && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-green-600 text-green-400 hover:bg-green-600"
                      >
                        <Phone className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Alternative Specialties */}
        {recommendation.alternativeSpecialties.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-white/80">Alternative Specialties</h4>
            <div className="flex flex-wrap gap-2">
              {recommendation.alternativeSpecialties.map((specialty) => (
                <Button
                  key={specialty}
                  variant="outline"
                  size="sm"
                  onClick={() => onSpecialtyRecommendation(specialty)}
                  className="border-[#2a3441] text-white/70 hover:bg-[#2a3441]"
                >
                  {specialty}
                </Button>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SmartRouting;
