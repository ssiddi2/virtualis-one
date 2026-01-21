import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export interface CodeSuggestion {
  code: string;
  description: string;
  confidence: number;
  type: 'icd10' | 'cpt';
  category?: string;
  reimbursement?: number;
}

export interface PendingCharge {
  id: string;
  patientId: string;
  patientName: string;
  codes: CodeSuggestion[];
  totalEstimate: number;
  denialRisk: 'low' | 'medium' | 'high';
  facilityType: FacilityType;
  documentationType: string;
  createdAt: Date;
  status: 'pending' | 'submitted' | 'posted' | 'denied';
  noteContent?: string;
}

export interface BillingSession {
  date: Date;
  totalCharges: number;
  totalEstimate: number;
  submittedCount: number;
  pendingCount: number;
}

export type FacilityType = 'snf' | 'hospital' | 'physician' | 'home_health' | 'outpatient';
export type PayerType = 'medicare_a' | 'medicare_b' | 'medicaid' | 'commercial' | 'self_pay';

export interface RCMAnalysis {
  codes: CodeSuggestion[];
  estimatedReimbursement: number;
  denialRisk: 'low' | 'medium' | 'high';
  denialReasons: string[];
  documentationGaps: string[];
  improvementSuggestions: string[];
  isAnalyzing: boolean;
}

interface RCMContextType {
  // State
  pendingCharges: PendingCharge[];
  currentSession: BillingSession;
  currentAnalysis: RCMAnalysis | null;
  isAnalyzing: boolean;
  isPanelOpen: boolean;
  selectedFacilityType: FacilityType;
  selectedPayerType: PayerType;
  
  // Actions
  analyzeDocumentation: (content: string, documentationType: string, patientId: string, patientName: string) => Promise<RCMAnalysis>;
  addPendingCharge: (charge: Omit<PendingCharge, 'id' | 'createdAt'>) => void;
  removePendingCharge: (id: string) => void;
  submitCharges: (chargeIds: string[]) => Promise<void>;
  submitAllPending: () => Promise<void>;
  clearAnalysis: () => void;
  setFacilityType: (type: FacilityType) => void;
  setPayerType: (type: PayerType) => void;
  openPanel: () => void;
  closePanel: () => void;
  togglePanel: () => void;
}

const RCMContext = createContext<RCMContextType | undefined>(undefined);

export const useRCM = () => {
  const context = useContext(RCMContext);
  if (!context) {
    throw new Error('useRCM must be used within an RCMProvider');
  }
  return context;
};

// Optional hook that doesn't throw - useful for components that may be outside provider
export const useRCMOptional = () => {
  return useContext(RCMContext);
};

interface RCMProviderProps {
  children: ReactNode;
}

export const RCMProvider: React.FC<RCMProviderProps> = ({ children }) => {
  const [pendingCharges, setPendingCharges] = useState<PendingCharge[]>([]);
  const [currentAnalysis, setCurrentAnalysis] = useState<RCMAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [selectedFacilityType, setSelectedFacilityType] = useState<FacilityType>('snf');
  const [selectedPayerType, setSelectedPayerType] = useState<PayerType>('medicare_a');

  // Calculate current session stats
  const currentSession: BillingSession = {
    date: new Date(),
    totalCharges: pendingCharges.length,
    totalEstimate: pendingCharges.reduce((sum, c) => sum + c.totalEstimate, 0),
    submittedCount: pendingCharges.filter(c => c.status === 'submitted').length,
    pendingCount: pendingCharges.filter(c => c.status === 'pending').length,
  };

  const analyzeDocumentation = useCallback(async (
    content: string,
    documentationType: string,
    patientId: string,
    patientName: string
  ): Promise<RCMAnalysis> => {
    setIsAnalyzing(true);
    
    try {
      // Import supabase dynamically to avoid circular deps
      const { supabase } = await import('@/integrations/supabase/client');
      
      const { data, error } = await supabase.functions.invoke('ai-assistant', {
        body: {
          type: 'universal_billing',
          data: {
            documentation: content,
            noteType: documentationType,
            patientName,
            facilityType: selectedFacilityType,
            payerType: selectedPayerType
          }
        }
      });

      if (error) throw error;

      // Parse AI response into structured data
      const codes = parseCodesFromResponse(data?.result || '');
      const totalReimbursement = codes
        .filter(c => c.type === 'cpt')
        .reduce((sum, c) => sum + (c.reimbursement || 0), 0);
      
      const denialAssessment = assessDenialRisk(content, codes);

      const analysis: RCMAnalysis = {
        codes,
        estimatedReimbursement: totalReimbursement,
        denialRisk: denialAssessment.level,
        denialReasons: denialAssessment.reasons,
        documentationGaps: findDocumentationGaps(content, documentationType),
        improvementSuggestions: generateImprovementSuggestions(content, codes),
        isAnalyzing: false
      };

      setCurrentAnalysis(analysis);
      return analysis;
    } catch (err) {
      console.error('RCM analysis error:', err);
      // Return empty analysis on error
      const emptyAnalysis: RCMAnalysis = {
        codes: [],
        estimatedReimbursement: 0,
        denialRisk: 'medium',
        denialReasons: ['Unable to analyze documentation'],
        documentationGaps: [],
        improvementSuggestions: [],
        isAnalyzing: false
      };
      setCurrentAnalysis(emptyAnalysis);
      return emptyAnalysis;
    } finally {
      setIsAnalyzing(false);
    }
  }, [selectedFacilityType, selectedPayerType]);

  const addPendingCharge = useCallback((charge: Omit<PendingCharge, 'id' | 'createdAt'>) => {
    const newCharge: PendingCharge = {
      ...charge,
      id: `charge-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date()
    };
    setPendingCharges(prev => [...prev, newCharge]);
  }, []);

  const removePendingCharge = useCallback((id: string) => {
    setPendingCharges(prev => prev.filter(c => c.id !== id));
  }, []);

  const submitCharges = useCallback(async (chargeIds: string[]) => {
    // Update status to submitted
    setPendingCharges(prev => 
      prev.map(c => 
        chargeIds.includes(c.id) ? { ...c, status: 'submitted' as const } : c
      )
    );
    // In production, this would call a billing API
  }, []);

  const submitAllPending = useCallback(async () => {
    const pendingIds = pendingCharges.filter(c => c.status === 'pending').map(c => c.id);
    await submitCharges(pendingIds);
  }, [pendingCharges, submitCharges]);

  const clearAnalysis = useCallback(() => {
    setCurrentAnalysis(null);
  }, []);

  const setFacilityType = useCallback((type: FacilityType) => {
    setSelectedFacilityType(type);
  }, []);

  const setPayerType = useCallback((type: PayerType) => {
    setSelectedPayerType(type);
  }, []);

  const openPanel = useCallback(() => setIsPanelOpen(true), []);
  const closePanel = useCallback(() => setIsPanelOpen(false), []);
  const togglePanel = useCallback(() => setIsPanelOpen(prev => !prev), []);

  const value: RCMContextType = {
    pendingCharges,
    currentSession,
    currentAnalysis,
    isAnalyzing,
    isPanelOpen,
    selectedFacilityType,
    selectedPayerType,
    analyzeDocumentation,
    addPendingCharge,
    removePendingCharge,
    submitCharges,
    submitAllPending,
    clearAnalysis,
    setFacilityType,
    setPayerType,
    openPanel,
    closePanel,
    togglePanel
  };

  return (
    <RCMContext.Provider value={value}>
      {children}
    </RCMContext.Provider>
  );
};

// Helper functions

function parseCodesFromResponse(response: string): CodeSuggestion[] {
  const codes: CodeSuggestion[] = [];
  
  // Parse ICD-10 codes
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

  // Parse CPT codes
  const cptPattern = /(9\d{4})\s*[-–:]\s*([^\n]+)/g;
  while ((match = cptPattern.exec(response)) !== null) {
    const cptCode = match[1];
    codes.push({
      code: cptCode,
      description: match[2].trim(),
      confidence: 0.90,
      type: 'cpt',
      reimbursement: getReimbursementEstimate(cptCode)
    });
  }

  // Add default E/M code if none found
  if (!codes.some(c => c.type === 'cpt')) {
    codes.push({
      code: '99213',
      description: 'Office/outpatient visit, established patient, low complexity',
      confidence: 0.75,
      type: 'cpt',
      reimbursement: 110
    });
  }

  return codes;
}

function getReimbursementEstimate(cptCode: string): number {
  const estimates: Record<string, number> = {
    '99211': 45, '99212': 76, '99213': 110, '99214': 165, '99215': 224,
    '99221': 195, '99222': 275, '99223': 385,
    '99231': 85, '99232': 145, '99233': 210,
    '99304': 185, '99305': 245, '99306': 315,
    '99307': 65, '99308': 95, '99309': 125, '99310': 175,
    '99315': 110, '99316': 145,
    '99341': 125, '99342': 175, '99343': 225, '99344': 295, '99345': 365,
    '99347': 85, '99348': 125, '99349': 165, '99350': 225
  };
  return estimates[cptCode] || 100;
}

function assessDenialRisk(content: string, codes: CodeSuggestion[]): { level: 'low' | 'medium' | 'high'; reasons: string[] } {
  const reasons: string[] = [];
  let riskScore = 0;

  // Check for common denial triggers
  if (content.length < 200) {
    reasons.push('Documentation may be too brief');
    riskScore += 2;
  }

  if (!content.toLowerCase().includes('assessment') && !content.toLowerCase().includes('impression')) {
    reasons.push('Missing clear assessment/impression');
    riskScore += 2;
  }

  if (!content.toLowerCase().includes('plan')) {
    reasons.push('Missing treatment plan');
    riskScore += 1;
  }

  if (codes.filter(c => c.type === 'icd10').length === 0) {
    reasons.push('No diagnosis codes identified');
    riskScore += 3;
  }

  // Check for medical necessity language
  const necessityKeywords = ['medical necessity', 'required', 'necessary', 'indicated', 'appropriate'];
  if (!necessityKeywords.some(kw => content.toLowerCase().includes(kw))) {
    reasons.push('Consider adding medical necessity language');
    riskScore += 1;
  }

  let level: 'low' | 'medium' | 'high' = 'low';
  if (riskScore >= 5) level = 'high';
  else if (riskScore >= 2) level = 'medium';

  return { level, reasons };
}

function findDocumentationGaps(content: string, documentationType: string): string[] {
  const gaps: string[] = [];
  const lowerContent = content.toLowerCase();

  // Common required elements
  if (!lowerContent.includes('date') && !lowerContent.includes('time')) {
    gaps.push('Date and time of service');
  }

  if (!lowerContent.includes('vital') && !lowerContent.includes('bp') && !lowerContent.includes('blood pressure')) {
    gaps.push('Vital signs');
  }

  if (documentationType.includes('snf') || documentationType.includes('nursing')) {
    if (!lowerContent.includes('functional')) {
      gaps.push('Functional status assessment');
    }
    if (!lowerContent.includes('rug') && !lowerContent.includes('pdpm')) {
      gaps.push('PDPM/RUG classification elements');
    }
  }

  return gaps;
}

function generateImprovementSuggestions(content: string, codes: CodeSuggestion[]): string[] {
  const suggestions: string[] = [];

  // Check if higher E/M code might be justified
  const hasHighComplexity = content.toLowerCase().includes('multiple') || 
                            content.toLowerCase().includes('complex') ||
                            content.toLowerCase().includes('severe');
  
  const currentEM = codes.find(c => c.code.startsWith('992'));
  if (hasHighComplexity && currentEM && ['99213', '99232', '99308'].includes(currentEM.code)) {
    suggestions.push('Documentation complexity may support higher E/M level');
  }

  // Suggest additional documentation
  if (!content.toLowerCase().includes('time')) {
    suggestions.push('Add time spent documentation for potential time-based billing');
  }

  if (codes.filter(c => c.type === 'icd10').length < 3) {
    suggestions.push('Consider documenting additional comorbidities to support medical necessity');
  }

  return suggestions;
}

export default RCMProvider;
