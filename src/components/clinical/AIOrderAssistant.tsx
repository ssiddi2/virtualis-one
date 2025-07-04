import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Brain, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Sparkles,
  TrendingUp,
  Shield
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AIOrderSuggestion {
  id: string;
  type: 'medication' | 'lab' | 'imaging' | 'nursing';
  title: string;
  description: string;
  reasoning: string;
  priority: 'high' | 'medium' | 'low';
  confidence: number;
  interactions?: string[];
  contraindications?: string[];
}

interface AIOrderAssistantProps {
  patientId: string;
  patientData?: any;
  onAcceptSuggestion: (suggestion: AIOrderSuggestion) => void;
}

const AIOrderAssistant: React.FC<AIOrderAssistantProps> = ({ 
  patientId, 
  patientData, 
  onAcceptSuggestion 
}) => {
  const [suggestions, setSuggestions] = useState<AIOrderSuggestion[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [lastAnalysis, setLastAnalysis] = useState<Date | null>(null);
  const { toast } = useToast();

  // Mock AI suggestions generation
  const generateAISuggestions = async () => {
    setIsAnalyzing(true);
    
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const mockSuggestions: AIOrderSuggestion[] = [
      {
        id: '1',
        type: 'lab',
        title: 'CBC with Differential',
        description: 'Complete blood count to monitor white cell response',
        reasoning: 'Patient presents with fever and elevated WBC on admission. Follow-up CBC recommended to monitor response to antibiotics.',
        priority: 'high',
        confidence: 92,
        interactions: []
      },
      {
        id: '2',
        type: 'medication',
        title: 'Acetaminophen 650mg PO',
        description: 'Pain management and fever reduction',
        reasoning: 'Patient reports pain level 6/10 and has persistent low-grade fever. Acetaminophen is safe with current medications.',
        priority: 'medium',
        confidence: 88,
        interactions: [],
        contraindications: []
      },
      {
        id: '3',
        type: 'imaging',
        title: 'Chest X-ray PA/Lateral',
        description: 'Rule out pneumonia given symptoms',
        reasoning: 'Patient has productive cough, fever, and crackles on exam. CXR indicated to rule out pneumonia.',
        priority: 'high',
        confidence: 85,
        interactions: []
      },
      {
        id: '4',
        type: 'nursing',
        title: 'Vital signs q4h',
        description: 'Monitor temperature and respiratory status',
        reasoning: 'Given fever and respiratory symptoms, closer monitoring of vital signs is warranted.',
        priority: 'medium',
        confidence: 90,
        interactions: []
      }
    ];

    setSuggestions(mockSuggestions);
    setLastAnalysis(new Date());
    setIsAnalyzing(false);

    toast({
      title: "AI Analysis Complete",
      description: `Generated ${mockSuggestions.length} evidence-based order suggestions`,
    });
  };

  useEffect(() => {
    // Auto-generate suggestions on component mount
    generateAISuggestions();
  }, [patientId]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-600/20 text-red-300 border-red-400/30';
      case 'medium': return 'bg-yellow-600/20 text-yellow-300 border-yellow-400/30';
      case 'low': return 'bg-green-600/20 text-green-300 border-green-400/30';
      default: return 'bg-gray-600/20 text-gray-300 border-gray-400/30';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'medication': return '💊';
      case 'lab': return '🧪';
      case 'imaging': return '📱';
      case 'nursing': return '❤️';
      default: return '📋';
    }
  };

  const handleAcceptSuggestion = (suggestion: AIOrderSuggestion) => {
    onAcceptSuggestion(suggestion);
    setSuggestions(prev => prev.filter(s => s.id !== suggestion.id));
    
    toast({
      title: "Order Added",
      description: `${suggestion.title} has been added to pending orders`,
    });
  };

  return (
    <Card className="clinical-card">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-blue-400" />
            <CardTitle className="text-white text-lg">AI Order Assistant</CardTitle>
            <Sparkles className="h-4 w-4 text-yellow-400" />
          </div>
          <div className="flex items-center gap-2">
            {lastAnalysis && (
              <span className="text-white/60 text-sm">
                Last analysis: {lastAnalysis.toLocaleTimeString()}
              </span>
            )}
            <Button
              size="sm"
              onClick={generateAISuggestions}
              disabled={isAnalyzing}
              className="bg-blue-600/20 border border-blue-400/30 text-white hover:bg-blue-500/30"
            >
              {isAnalyzing ? (
                <>
                  <Clock className="h-4 w-4 mr-1 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <TrendingUp className="h-4 w-4 mr-1" />
                  Refresh Analysis
                </>
              )}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {isAnalyzing && (
          <Alert className="bg-blue-900/20 border-blue-400/30">
            <Brain className="h-4 w-4 text-blue-400" />
            <AlertDescription className="text-blue-200">
              AI is analyzing patient data, current medications, lab results, and clinical guidelines to generate personalized order recommendations...
            </AlertDescription>
          </Alert>
        )}

        {suggestions.length === 0 && !isAnalyzing && (
          <div className="text-center text-white/60 py-8">
            <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg mb-2">No AI suggestions available</p>
            <p className="text-sm">Click "Refresh Analysis" to generate new recommendations</p>
          </div>
        )}

        {suggestions.map((suggestion) => (
          <Card key={suggestion.id} className="bg-white/5 border border-white/20">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">{getTypeIcon(suggestion.type)}</span>
                  <div>
                    <h4 className="text-white font-medium">{suggestion.title}</h4>
                    <p className="text-white/70 text-sm">{suggestion.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getPriorityColor(suggestion.priority)}>
                    {suggestion.priority.toUpperCase()}
                  </Badge>
                  <Badge className="bg-blue-600/20 text-blue-300 border-blue-400/30">
                    {suggestion.confidence}% confidence
                  </Badge>
                </div>
              </div>

              <div className="bg-white/5 rounded-lg p-3 mb-3">
                <h5 className="text-white font-medium text-sm mb-1 flex items-center gap-1">
                  <Brain className="h-3 w-3" />
                  AI Reasoning
                </h5>
                <p className="text-white/80 text-sm">{suggestion.reasoning}</p>
              </div>

              {suggestion.interactions && suggestion.interactions.length > 0 && (
                <Alert className="bg-yellow-900/20 border-yellow-400/30 mb-3">
                  <AlertTriangle className="h-4 w-4 text-yellow-400" />
                  <AlertDescription className="text-yellow-200 text-sm">
                    <strong>Drug Interactions:</strong> {suggestion.interactions.join(', ')}
                  </AlertDescription>
                </Alert>
              )}

              {suggestion.contraindications && suggestion.contraindications.length > 0 && (
                <Alert className="bg-red-900/20 border-red-400/30 mb-3">
                  <Shield className="h-4 w-4 text-red-400" />
                  <AlertDescription className="text-red-200 text-sm">
                    <strong>Contraindications:</strong> {suggestion.contraindications.join(', ')}
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => handleAcceptSuggestion(suggestion)}
                  className="bg-green-600/80 hover:bg-green-600 text-white"
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Accept & Order
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="bg-gray-600/20 border-gray-400/30 text-white hover:bg-gray-500/30"
                >
                  Review Later
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </CardContent>
    </Card>
  );
};

export default AIOrderAssistant;