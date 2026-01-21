import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, DollarSign, TrendingUp, AlertTriangle, CheckCircle, Sparkles } from 'lucide-react';
import { useAIAssistant } from '@/hooks/useAIAssistant';
import { cn } from '@/lib/utils';

interface CodeEstimate {
  code: string;
  description: string;
  type: 'icd10' | 'cpt';
  reimbursement?: number;
  confidence?: number;
}

interface RealTimeBillingPreviewProps {
  documentationText: string;
  noteType?: string;
  facilityType?: 'SNF' | 'Hospital' | 'Physician' | 'Home Health';
  minCharacters?: number;
  debounceMs?: number;
  className?: string;
  compact?: boolean;
}

const RealTimeBillingPreview = ({
  documentationText,
  noteType = 'Progress Note',
  facilityType = 'SNF',
  minCharacters = 50,
  debounceMs = 2000,
  className,
  compact = false,
}: RealTimeBillingPreviewProps) => {
  const { callAI, isLoading } = useAIAssistant();
  const [codes, setCodes] = useState<CodeEstimate[]>([]);
  const [totalReimbursement, setTotalReimbursement] = useState(0);
  const [denialRisk, setDenialRisk] = useState<'low' | 'medium' | 'high' | null>(null);
  const [lastAnalyzedLength, setLastAnalyzedLength] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // CPT code reimbursement estimates
  const getReimbursementEstimate = useCallback((cptCode: string): number => {
    const estimates: Record<string, number> = {
      // SNF E/M codes
      '99304': 165, '99305': 215, '99306': 280,
      '99307': 75, '99308': 115, '99309': 155, '99310': 205,
      // Hospital E/M codes
      '99221': 150, '99222': 225, '99223': 300,
      '99231': 65, '99232': 95, '99233': 140,
      '99238': 75, '99239': 110,
      // Physician office E/M codes
      '99211': 25, '99212': 60, '99213': 95, '99214': 140, '99215': 190,
      // Critical care
      '99291': 280, '99292': 140,
      // Procedures
      '97110': 45, '97140': 40, '97530': 50,
    };
    return estimates[cptCode] || 0;
  }, []);

  // Parse AI response for codes
  const parseCodesFromResponse = useCallback((response: string): CodeEstimate[] => {
    const codes: CodeEstimate[] = [];
    
    // Match ICD-10 codes (letter followed by digits, optional decimal)
    const icd10Regex = /([A-TV-Z]\d{2}\.?\d{0,4})\s*[-–:]\s*([^,\n]+)/gi;
    let match;
    while ((match = icd10Regex.exec(response)) !== null) {
      codes.push({
        code: match[1].trim(),
        description: match[2].trim().substring(0, 50),
        type: 'icd10',
        confidence: 0.85,
      });
    }

    // Match CPT codes (5 digits)
    const cptRegex = /(\d{5})\s*[-–:]\s*([^,\n]+)/gi;
    while ((match = cptRegex.exec(response)) !== null) {
      const code = match[1];
      const reimbursement = getReimbursementEstimate(code);
      codes.push({
        code,
        description: match[2].trim().substring(0, 50),
        type: 'cpt',
        reimbursement,
        confidence: 0.9,
      });
    }

    // Deduplicate by code
    const uniqueCodes = codes.reduce((acc, curr) => {
      if (!acc.find(c => c.code === curr.code)) {
        acc.push(curr);
      }
      return acc;
    }, [] as CodeEstimate[]);

    return uniqueCodes.slice(0, 6); // Limit to 6 codes for UI
  }, [getReimbursementEstimate]);

  // Assess denial risk based on documentation
  const assessDenialRisk = useCallback((text: string): 'low' | 'medium' | 'high' => {
    const wordCount = text.split(/\s+/).length;
    const hasAssessment = /assessment|diagnosis|impression/i.test(text);
    const hasPlan = /plan|treatment|follow-up|recommendation/i.test(text);
    const hasMedicalNecessity = /medical necessity|required|indicated|necessary/i.test(text);
    
    let score = 0;
    if (wordCount > 100) score++;
    if (wordCount > 200) score++;
    if (hasAssessment) score++;
    if (hasPlan) score++;
    if (hasMedicalNecessity) score++;
    
    if (score >= 4) return 'low';
    if (score >= 2) return 'medium';
    return 'high';
  }, []);

  // Analyze documentation with AI
  const analyzeDocumentation = useCallback(async () => {
    if (documentationText.length < minCharacters) {
      setCodes([]);
      setTotalReimbursement(0);
      setDenialRisk(null);
      return;
    }

    // Only re-analyze if content changed significantly
    if (Math.abs(documentationText.length - lastAnalyzedLength) < 30 && codes.length > 0) {
      return;
    }

    setIsAnalyzing(true);
    
    try {
      const result = await callAI({
        type: 'snf_billing',
        data: {
          documentation: documentationText,
          noteType,
          facilityType,
        },
      });

      const parsedCodes = parseCodesFromResponse(result);
      setCodes(parsedCodes);
      
      // Calculate total reimbursement from CPT codes
      const total = parsedCodes
        .filter(c => c.type === 'cpt')
        .reduce((sum, c) => sum + (c.reimbursement || 0), 0);
      setTotalReimbursement(total);
      
      // Assess denial risk
      setDenialRisk(assessDenialRisk(documentationText));
      setLastAnalyzedLength(documentationText.length);
    } catch (error) {
      console.error('Error analyzing documentation:', error);
    } finally {
      setIsAnalyzing(false);
    }
  }, [documentationText, minCharacters, noteType, facilityType, callAI, parseCodesFromResponse, assessDenialRisk, lastAnalyzedLength, codes.length]);

  // Debounced analysis
  useEffect(() => {
    if (documentationText.length < minCharacters) {
      setCodes([]);
      setTotalReimbursement(0);
      setDenialRisk(null);
      return;
    }

    const timer = setTimeout(() => {
      analyzeDocumentation();
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [documentationText, minCharacters, debounceMs, analyzeDocumentation]);

  // Don't render if no content
  if (documentationText.length < minCharacters && !isLoading) {
    return null;
  }

  const icd10Codes = codes.filter(c => c.type === 'icd10');
  const cptCodes = codes.filter(c => c.type === 'cpt');

  if (compact) {
    return (
      <div className={cn("flex items-center gap-3 p-2 bg-primary/5 rounded-md border border-primary/20", className)}>
        {isLoading || isAnalyzing ? (
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <Loader2 className="h-3 w-3 animate-spin" />
            <span>Analyzing...</span>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-1.5">
              <DollarSign className="h-3.5 w-3.5 text-green-500" />
              <span className="text-sm font-medium text-green-600">${totalReimbursement}</span>
            </div>
            {cptCodes.length > 0 && (
              <div className="flex items-center gap-1">
                {cptCodes.slice(0, 2).map(code => (
                  <Badge key={code.code} variant="secondary" className="text-xs py-0">
                    {code.code}
                  </Badge>
                ))}
                {cptCodes.length > 2 && (
                  <span className="text-xs text-muted-foreground">+{cptCodes.length - 2}</span>
                )}
              </div>
            )}
            {denialRisk && (
              <Badge 
                variant={denialRisk === 'low' ? 'default' : denialRisk === 'medium' ? 'secondary' : 'destructive'}
                className="text-xs py-0"
              >
                {denialRisk === 'low' ? <CheckCircle className="h-3 w-3 mr-1" /> : 
                 denialRisk === 'high' ? <AlertTriangle className="h-3 w-3 mr-1" /> : null}
                {denialRisk}
              </Badge>
            )}
          </>
        )}
      </div>
    );
  }

  return (
    <Card className={cn("bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20", className)}>
      <CardContent className="p-4 space-y-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-foreground">Real-Time Billing Preview</span>
          </div>
          {(isLoading || isAnalyzing) && (
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Loader2 className="h-3 w-3 animate-spin" />
              <span className="text-xs">Analyzing...</span>
            </div>
          )}
        </div>

        {/* Reimbursement & Risk */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-green-500/10 px-2 py-1 rounded">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="text-lg font-bold text-green-600">${totalReimbursement}</span>
            </div>
            <span className="text-xs text-muted-foreground">Est. Reimbursement</span>
          </div>
          
          {denialRisk && (
            <Badge 
              variant={denialRisk === 'low' ? 'default' : denialRisk === 'medium' ? 'secondary' : 'destructive'}
              className={cn(
                "gap-1",
                denialRisk === 'low' && "bg-green-500/20 text-green-700 hover:bg-green-500/30",
                denialRisk === 'medium' && "bg-yellow-500/20 text-yellow-700 hover:bg-yellow-500/30",
                denialRisk === 'high' && "bg-red-500/20 text-red-700 hover:bg-red-500/30"
              )}
            >
              {denialRisk === 'low' ? <CheckCircle className="h-3 w-3" /> : 
               denialRisk === 'high' ? <AlertTriangle className="h-3 w-3" /> : null}
              Denial Risk: {denialRisk}
            </Badge>
          )}
        </div>

        {/* Code Preview */}
        {codes.length > 0 && (
          <div className="space-y-2">
            {/* ICD-10 Codes */}
            {icd10Codes.length > 0 && (
              <div>
                <span className="text-xs text-muted-foreground mb-1 block">ICD-10 Diagnosis Codes</span>
                <div className="flex flex-wrap gap-1.5">
                  {icd10Codes.map(code => (
                    <Badge 
                      key={code.code} 
                      variant="outline" 
                      className="text-xs bg-blue-500/10 border-blue-500/30 text-blue-700"
                    >
                      {code.code}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            {/* CPT Codes */}
            {cptCodes.length > 0 && (
              <div>
                <span className="text-xs text-muted-foreground mb-1 block">CPT Procedure Codes</span>
                <div className="flex flex-wrap gap-1.5">
                  {cptCodes.map(code => (
                    <Badge 
                      key={code.code} 
                      variant="outline" 
                      className="text-xs bg-purple-500/10 border-purple-500/30 text-purple-700 gap-1"
                    >
                      <span>{code.code}</span>
                      {code.reimbursement && (
                        <span className="text-green-600">${code.reimbursement}</span>
                      )}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !isAnalyzing && codes.length === 0 && documentationText.length >= minCharacters && (
          <div className="text-center py-2 text-muted-foreground text-sm">
            Continue typing to see billing suggestions...
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RealTimeBillingPreview;
