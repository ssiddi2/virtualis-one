import { useState, useEffect } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { useRCMOptional, FacilityType, PayerType, CodeSuggestion } from '@/contexts/RCMContext';
import { 
  DollarSign, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles, 
  FileText,
  Building2,
  Stethoscope,
  Home,
  Hospital,
  Copy,
  Send,
  TrendingUp,
  Shield,
  Lightbulb,
  X
} from 'lucide-react';

interface UniversalBillingPanelProps {
  isOpen?: boolean;
  onClose?: () => void;
  noteContent?: string;
  documentationType?: string;
  patientId?: string;
  patientName?: string;
  // For standalone use without RCM context
  standalone?: boolean;
}

const facilityOptions: { value: FacilityType; label: string; icon: React.ElementType }[] = [
  { value: 'snf', label: 'Skilled Nursing Facility', icon: Building2 },
  { value: 'hospital', label: 'Hospital/Acute Care', icon: Hospital },
  { value: 'physician', label: 'Physician Office', icon: Stethoscope },
  { value: 'home_health', label: 'Home Health', icon: Home },
  { value: 'outpatient', label: 'Outpatient', icon: Building2 }
];

const payerOptions: { value: PayerType; label: string }[] = [
  { value: 'medicare_a', label: 'Medicare Part A' },
  { value: 'medicare_b', label: 'Medicare Part B' },
  { value: 'medicaid', label: 'Medicaid' },
  { value: 'commercial', label: 'Commercial Insurance' },
  { value: 'self_pay', label: 'Self Pay' }
];

const UniversalBillingPanel = ({
  isOpen: externalIsOpen,
  onClose: externalOnClose,
  noteContent = '',
  documentationType = 'progress_note',
  patientId = '',
  patientName = 'Unknown Patient',
  standalone = false
}: UniversalBillingPanelProps) => {
  const { toast } = useToast();
  const rcm = useRCMOptional();
  
  // Use RCM context if available, otherwise manage locally
  const isOpen = externalIsOpen ?? rcm?.isPanelOpen ?? false;
  const onClose = externalOnClose ?? rcm?.closePanel ?? (() => {});
  
  const [selectedCodes, setSelectedCodes] = useState<Set<string>>(new Set());
  const [localFacilityType, setLocalFacilityType] = useState<FacilityType>('snf');
  const [localPayerType, setLocalPayerType] = useState<PayerType>('medicare_a');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [localAnalysis, setLocalAnalysis] = useState<{
    codes: CodeSuggestion[];
    estimatedReimbursement: number;
    denialRisk: 'low' | 'medium' | 'high';
    denialReasons: string[];
    improvementSuggestions: string[];
  } | null>(null);

  const facilityType = rcm?.selectedFacilityType ?? localFacilityType;
  const payerType = rcm?.selectedPayerType ?? localPayerType;
  const analysis = rcm?.currentAnalysis ?? localAnalysis;

  // Auto-analyze when content changes
  useEffect(() => {
    if (isOpen && noteContent && noteContent.length > 50) {
      handleAnalyze();
    }
  }, [isOpen, noteContent]);

  // Auto-select all codes when analysis completes
  useEffect(() => {
    if (analysis?.codes) {
      setSelectedCodes(new Set(analysis.codes.map(c => c.code)));
    }
  }, [analysis?.codes]);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    try {
      if (rcm) {
        await rcm.analyzeDocumentation(noteContent, documentationType, patientId, patientName);
      } else {
        // Standalone analysis using AI assistant
        const { supabase } = await import('@/integrations/supabase/client');
        const { data, error } = await supabase.functions.invoke('ai-assistant', {
          body: {
            type: 'snf_billing',
            data: {
              documentation: noteContent,
              noteType: documentationType,
              patientName,
              facilityType: localFacilityType
            }
          }
        });

        if (!error && data?.result) {
          // Parse response into codes
          const codes = parseCodesFromResponse(data.result);
          const totalReimbursement = codes
            .filter(c => c.type === 'cpt')
            .reduce((sum, c) => sum + (c.reimbursement || 0), 0);

          setLocalAnalysis({
            codes,
            estimatedReimbursement: totalReimbursement,
            denialRisk: noteContent.length < 200 ? 'high' : noteContent.length < 500 ? 'medium' : 'low',
            denialReasons: noteContent.length < 200 ? ['Documentation may be too brief'] : [],
            improvementSuggestions: ['Consider adding time-based documentation']
          });
        }
      }
    } catch (err) {
      console.error('Analysis error:', err);
      toast({
        title: 'Analysis Error',
        description: 'Failed to analyze documentation',
        variant: 'destructive'
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const toggleCode = (code: string) => {
    const newSelected = new Set(selectedCodes);
    if (newSelected.has(code)) {
      newSelected.delete(code);
    } else {
      newSelected.add(code);
    }
    setSelectedCodes(newSelected);
  };

  const getSelectedTotal = () => {
    if (!analysis?.codes) return 0;
    return analysis.codes
      .filter(c => selectedCodes.has(c.code) && c.type === 'cpt')
      .reduce((sum, c) => sum + (c.reimbursement || 0), 0);
  };

  const handleSubmitCharges = () => {
    const selectedCodesList = analysis?.codes?.filter(c => selectedCodes.has(c.code)) || [];
    
    if (rcm) {
      rcm.addPendingCharge({
        patientId,
        patientName,
        codes: selectedCodesList,
        totalEstimate: getSelectedTotal(),
        denialRisk: analysis?.denialRisk || 'medium',
        facilityType,
        documentationType,
        status: 'pending'
      });
    }

    toast({
      title: 'Charges Submitted',
      description: `${selectedCodesList.length} codes added to billing queue • Est. $${getSelectedTotal().toFixed(2)}`,
    });
    
    onClose();
  };

  const copyToClipboard = () => {
    const selectedCodesList = analysis?.codes?.filter(c => selectedCodes.has(c.code)) || [];
    const text = selectedCodesList.map(c => `${c.code}: ${c.description}`).join('\n');
    navigator.clipboard.writeText(text);
    toast({ title: 'Copied to clipboard' });
  };

  const getDenialRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-green-500/20 text-green-300 border-green-400/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-300 border-yellow-400/30';
      case 'high': return 'bg-red-500/20 text-red-300 border-red-400/30';
      default: return 'bg-slate-500/20 text-slate-300 border-slate-400/30';
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full sm:max-w-xl bg-slate-900 border-slate-700 p-0">
        <SheetHeader className="p-6 pb-4 border-b border-slate-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-green-500/30 to-emerald-500/30 rounded-xl">
                <DollarSign className="h-6 w-6 text-green-400" />
              </div>
              <div>
                <SheetTitle className="text-white text-lg">AI Billing Generator</SheetTitle>
                <p className="text-sm text-slate-400 mt-0.5">{patientName}</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="text-slate-400 hover:text-white">
              <X className="h-5 w-5" />
            </Button>
          </div>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-180px)]">
          <div className="p-6 space-y-6">
            {/* Facility & Payer Selection */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm text-slate-400">Facility Type</label>
                <Select 
                  value={facilityType} 
                  onValueChange={(v: FacilityType) => rcm ? rcm.setFacilityType(v) : setLocalFacilityType(v)}
                >
                  <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-600">
                    {facilityOptions.map(opt => (
                      <SelectItem key={opt.value} value={opt.value} className="text-white">
                        <div className="flex items-center gap-2">
                          <opt.icon className="h-4 w-4" />
                          {opt.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm text-slate-400">Primary Payer</label>
                <Select 
                  value={payerType} 
                  onValueChange={(v: PayerType) => rcm ? rcm.setPayerType(v) : setLocalPayerType(v)}
                >
                  <SelectTrigger className="bg-slate-800 border-slate-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-600">
                    {payerOptions.map(opt => (
                      <SelectItem key={opt.value} value={opt.value} className="text-white">
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Analyze Button */}
            {(!analysis || isAnalyzing) && (
              <Button 
                onClick={handleAnalyze} 
                disabled={isAnalyzing || !noteContent}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
              >
                {isAnalyzing ? (
                  <>
                    <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                    Analyzing Documentation...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate Billing Codes
                  </>
                )}
              </Button>
            )}

            {/* Analysis Results */}
            {analysis && !isAnalyzing && (
              <Tabs defaultValue="codes" className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-slate-800">
                  <TabsTrigger value="codes" className="data-[state=active]:bg-slate-700">
                    <FileText className="h-4 w-4 mr-1" />
                    Codes
                  </TabsTrigger>
                  <TabsTrigger value="risk" className="data-[state=active]:bg-slate-700">
                    <Shield className="h-4 w-4 mr-1" />
                    Risk
                  </TabsTrigger>
                  <TabsTrigger value="optimize" className="data-[state=active]:bg-slate-700">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    Optimize
                  </TabsTrigger>
                </TabsList>

                {/* Codes Tab */}
                <TabsContent value="codes" className="space-y-4 mt-4">
                  {/* Summary Card */}
                  <Card className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-400/30">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-green-200">Estimated Reimbursement</p>
                          <p className="text-3xl font-bold text-white">${getSelectedTotal().toFixed(2)}</p>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${getDenialRiskColor(analysis.denialRisk)}`}>
                          {analysis.denialRisk === 'low' && <CheckCircle2 className="h-4 w-4 inline mr-1" />}
                          {analysis.denialRisk === 'medium' && <AlertTriangle className="h-4 w-4 inline mr-1" />}
                          {analysis.denialRisk === 'high' && <AlertTriangle className="h-4 w-4 inline mr-1" />}
                          {analysis.denialRisk.toUpperCase()} Risk
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* ICD-10 Codes */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-slate-300 flex items-center gap-2">
                      <Badge className="bg-blue-500/20 text-blue-300 border-blue-400/30">ICD-10</Badge>
                      Diagnosis Codes
                    </h4>
                    {analysis.codes?.filter(c => c.type === 'icd10').map((code) => (
                      <Card key={code.code} className="bg-slate-800/50 border-slate-700 hover:bg-slate-800 transition-colors">
                        <CardContent className="p-3 flex items-center gap-3">
                          <Checkbox 
                            checked={selectedCodes.has(code.code)}
                            onCheckedChange={() => toggleCode(code.code)}
                            className="border-blue-400"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-blue-400 font-medium">{code.code}</span>
                              <Progress value={code.confidence * 100} className="w-16 h-1" />
                              <span className="text-xs text-slate-500">{Math.round(code.confidence * 100)}%</span>
                            </div>
                            <p className="text-sm text-slate-300 mt-0.5">{code.description}</p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* CPT Codes */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-slate-300 flex items-center gap-2">
                      <Badge className="bg-green-500/20 text-green-300 border-green-400/30">CPT</Badge>
                      Procedure Codes
                    </h4>
                    {analysis.codes?.filter(c => c.type === 'cpt').map((code) => (
                      <Card key={code.code} className="bg-slate-800/50 border-slate-700 hover:bg-slate-800 transition-colors">
                        <CardContent className="p-3 flex items-center gap-3">
                          <Checkbox 
                            checked={selectedCodes.has(code.code)}
                            onCheckedChange={() => toggleCode(code.code)}
                            className="border-green-400"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-green-400 font-medium">{code.code}</span>
                              <Badge className="bg-slate-700 text-slate-300 text-xs">
                                ${code.reimbursement?.toFixed(0) || '0'}
                              </Badge>
                            </div>
                            <p className="text-sm text-slate-300 mt-0.5">{code.description}</p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                {/* Risk Tab */}
                <TabsContent value="risk" className="space-y-4 mt-4">
                  <Card className={`${getDenialRiskColor(analysis.denialRisk)} border`}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center gap-2">
                        {analysis.denialRisk === 'low' && <CheckCircle2 className="h-5 w-5" />}
                        {analysis.denialRisk !== 'low' && <AlertTriangle className="h-5 w-5" />}
                        Denial Risk: {analysis.denialRisk.toUpperCase()}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {analysis.denialReasons && analysis.denialReasons.length > 0 ? (
                        <ul className="space-y-2">
                          {analysis.denialReasons.map((reason, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm">
                              <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                              {reason}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm">Documentation appears complete with low denial risk.</p>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Optimize Tab */}
                <TabsContent value="optimize" className="space-y-4 mt-4">
                  <Card className="bg-purple-500/20 border-purple-400/30">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center gap-2 text-purple-200">
                        <Lightbulb className="h-5 w-5" />
                        Optimization Suggestions
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {analysis.improvementSuggestions && analysis.improvementSuggestions.length > 0 ? (
                        <ul className="space-y-3">
                          {analysis.improvementSuggestions.map((suggestion, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-purple-100">
                              <TrendingUp className="h-4 w-4 mt-0.5 flex-shrink-0 text-purple-400" />
                              {suggestion}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-purple-100">Documentation is well-optimized for billing.</p>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            )}
          </div>
        </ScrollArea>

        {/* Footer Actions */}
        {analysis && !isAnalyzing && (
          <div className="p-4 border-t border-slate-700 bg-slate-900/50 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                onClick={copyToClipboard}
                className="border-slate-600 text-slate-300 hover:bg-slate-800"
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
              <Button 
                onClick={handleSubmitCharges}
                disabled={selectedCodes.size === 0}
                className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
              >
                <Send className="h-4 w-4 mr-2" />
                Submit {selectedCodes.size} Codes • ${getSelectedTotal().toFixed(2)}
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

// Helper function for standalone use
function parseCodesFromResponse(response: string): CodeSuggestion[] {
  const codes: CodeSuggestion[] = [];
  
  const icd10Pattern = /([A-Z]\d{2}(?:\.\d{1,4})?)\s*[-–:]\s*([^\n]+)/gi;
  let match;
  while ((match = icd10Pattern.exec(response)) !== null) {
    codes.push({
      code: match[1].toUpperCase(),
      description: match[2].trim(),
      confidence: 0.85,
      type: 'icd10'
    });
  }

  const cptPattern = /(9\d{4})\s*[-–:]\s*([^\n]+)/g;
  while ((match = cptPattern.exec(response)) !== null) {
    const cptCode = match[1];
    codes.push({
      code: cptCode,
      description: match[2].trim(),
      confidence: 0.90,
      type: 'cpt',
      reimbursement: getCPTReimbursement(cptCode)
    });
  }

  if (!codes.some(c => c.type === 'cpt')) {
    codes.push({
      code: '99213',
      description: 'Office/outpatient visit, established patient',
      confidence: 0.75,
      type: 'cpt',
      reimbursement: 110
    });
  }

  return codes;
}

function getCPTReimbursement(code: string): number {
  const rates: Record<string, number> = {
    '99211': 45, '99212': 76, '99213': 110, '99214': 165, '99215': 224,
    '99304': 185, '99305': 245, '99306': 315,
    '99307': 65, '99308': 95, '99309': 125, '99310': 175
  };
  return rates[code] || 100;
}

export default UniversalBillingPanel;
