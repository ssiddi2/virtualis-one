import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Calculator, 
  DollarSign, 
  TrendingUp, 
  AlertCircle,
  CheckCircle2,
  Clock,
  Activity,
  FileText
} from 'lucide-react';

interface SNFBillingCalculatorProps {
  patientId?: string;
  onCalculate?: (result: BillingCalculation) => void;
}

interface BillingCalculation {
  pdpmCategory: string;
  estimatedDailyRate: number;
  therapyMinutes: {
    pt: number;
    ot: number;
    st: number;
    total: number;
  };
  rugCategory: string;
  medicareStatus: 'Part A' | 'Part B' | 'Private Pay';
  projectedStayRevenue: number;
  recommendations: string[];
}

const SNFBillingCalculator = ({ patientId, onCalculate }: SNFBillingCalculatorProps) => {
  // PDPM Components
  const [ptClassification, setPtClassification] = useState('');
  const [otClassification, setOtClassification] = useState('');
  const [stClassification, setStClassification] = useState('');
  const [nursingClassification, setNursingClassification] = useState('');
  const [nta, setNta] = useState('');
  const [cognitiveStatus, setCognitiveStatus] = useState('');
  
  // Therapy Minutes
  const [ptMinutes, setPtMinutes] = useState(0);
  const [otMinutes, setOtMinutes] = useState(0);
  const [stMinutes, setStMinutes] = useState(0);
  
  // Stay Details
  const [projectedLOS, setProjectedLOS] = useState(20);
  const [medicareStatus, setMedicareStatus] = useState<'Part A' | 'Part B' | 'Private Pay'>('Part A');
  
  const [calculation, setCalculation] = useState<BillingCalculation | null>(null);

  // PDPM Classification Options
  const ptOtClassifications = [
    { value: 'TA', label: 'TA - Non-Rehab Plus Extensive Services', rate: 27.55 },
    { value: 'TB', label: 'TB - Rehab Plus Extensive Services', rate: 45.32 },
    { value: 'TC', label: 'TC - Rehab High', rate: 54.87 },
    { value: 'TD', label: 'TD - Rehab Medium', rate: 41.23 },
    { value: 'TE', label: 'TE - Rehab Low', rate: 32.15 },
    { value: 'TF', label: 'TF - Rehab Very Low', rate: 24.89 },
    { value: 'TG', label: 'TG - Non-Rehab', rate: 18.45 },
  ];

  const stClassifications = [
    { value: 'SA', label: 'SA - Non-Rehab', rate: 0 },
    { value: 'SB', label: 'SB - Aphasia', rate: 32.45 },
    { value: 'SC', label: 'SC - Cognitive Impairment', rate: 28.67 },
    { value: 'SD', label: 'SD - Swallowing Disorder', rate: 35.12 },
  ];

  const nursingClassifications = [
    { value: 'ES3', label: 'ES3 - Extensive Services', rate: 98.50 },
    { value: 'ES2', label: 'ES2 - Clinically Complex', rate: 85.30 },
    { value: 'ES1', label: 'ES1 - Special Care High', rate: 72.45 },
    { value: 'HDE2', label: 'HDE2 - Special Care Low', rate: 65.20 },
    { value: 'HDE1', label: 'HDE1 - Behavioral', rate: 58.90 },
    { value: 'CA2', label: 'CA2 - Reduced Physical Function', rate: 48.75 },
    { value: 'CA1', label: 'CA1 - Low Intensity', rate: 35.60 },
  ];

  const ntaClassifications = [
    { value: 'A', label: 'NTA A - Highest', rate: 78.50 },
    { value: 'B', label: 'NTA B - High', rate: 54.30 },
    { value: 'C', label: 'NTA C - Medium', rate: 32.15 },
    { value: 'D', label: 'NTA D - Low', rate: 18.90 },
    { value: 'E', label: 'NTA E - Lowest', rate: 8.45 },
    { value: 'F', label: 'NTA F - None', rate: 0 },
  ];

  const calculateBilling = () => {
    // Get rates based on selections
    const ptRate = ptOtClassifications.find(c => c.value === ptClassification)?.rate || 0;
    const otRate = ptOtClassifications.find(c => c.value === otClassification)?.rate || 0;
    const stRate = stClassifications.find(c => c.value === stClassification)?.rate || 0;
    const nursingRate = nursingClassifications.find(c => c.value === nursingClassification)?.rate || 0;
    const ntaRate = ntaClassifications.find(c => c.value === nta)?.rate || 0;

    // Calculate daily rate (simplified PDPM calculation)
    const dailyRate = ptRate + otRate + stRate + nursingRate + ntaRate;
    
    // Apply variable per diem adjustment (simplified)
    const adjustedDailyRate = dailyRate * (projectedLOS <= 20 ? 1.0 : 0.98);

    // Determine RUG category based on therapy minutes
    const totalMinutes = ptMinutes + otMinutes + stMinutes;
    let rugCategory = 'Low';
    if (totalMinutes >= 720) rugCategory = 'Ultra High';
    else if (totalMinutes >= 500) rugCategory = 'Very High';
    else if (totalMinutes >= 325) rugCategory = 'High';
    else if (totalMinutes >= 150) rugCategory = 'Medium';

    // Generate recommendations
    const recommendations: string[] = [];
    
    if (totalMinutes < 500 && (ptClassification.includes('C') || otClassification.includes('C'))) {
      recommendations.push('Consider increasing therapy minutes to match high rehab classification');
    }
    
    if (!stClassification || stClassification === 'SA') {
      recommendations.push('Evaluate patient for speech therapy needs - may increase reimbursement');
    }
    
    if (nursingClassification && !nursingClassification.startsWith('ES')) {
      recommendations.push('Review for extensive services that may warrant higher nursing classification');
    }

    if (projectedLOS > 20) {
      recommendations.push('Variable per diem adjustment applies after day 20 - optimize therapy before then');
    }

    if (medicareStatus === 'Part A' && projectedLOS >= 100) {
      recommendations.push('Approaching Medicare Part A benefit exhaustion - plan transition to Part B or private pay');
    }

    const result: BillingCalculation = {
      pdpmCategory: `${ptClassification}-${otClassification}-${stClassification}-${nursingClassification}`,
      estimatedDailyRate: adjustedDailyRate,
      therapyMinutes: {
        pt: ptMinutes,
        ot: otMinutes,
        st: stMinutes,
        total: totalMinutes
      },
      rugCategory,
      medicareStatus,
      projectedStayRevenue: adjustedDailyRate * projectedLOS,
      recommendations
    };

    setCalculation(result);
    if (onCalculate) {
      onCalculate(result);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* PDPM Classification */}
        <Card className="bg-slate-800/50 border border-slate-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-base flex items-center gap-2">
              <Calculator className="h-4 w-4 text-blue-400" />
              PDPM Classification
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-slate-300">PT Classification</Label>
                <Select value={ptClassification} onValueChange={setPtClassification}>
                  <SelectTrigger className="bg-slate-700 text-white border-slate-600">
                    <SelectValue placeholder="Select PT class" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-600">
                    {ptOtClassifications.map((c) => (
                      <SelectItem key={c.value} value={c.value} className="text-white">
                        {c.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label className="text-slate-300">OT Classification</Label>
                <Select value={otClassification} onValueChange={setOtClassification}>
                  <SelectTrigger className="bg-slate-700 text-white border-slate-600">
                    <SelectValue placeholder="Select OT class" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-600">
                    {ptOtClassifications.map((c) => (
                      <SelectItem key={c.value} value={c.value} className="text-white">
                        {c.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-slate-300">SLP Classification</Label>
                <Select value={stClassification} onValueChange={setStClassification}>
                  <SelectTrigger className="bg-slate-700 text-white border-slate-600">
                    <SelectValue placeholder="Select SLP class" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-600">
                    {stClassifications.map((c) => (
                      <SelectItem key={c.value} value={c.value} className="text-white">
                        {c.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label className="text-slate-300">Nursing Classification</Label>
                <Select value={nursingClassification} onValueChange={setNursingClassification}>
                  <SelectTrigger className="bg-slate-700 text-white border-slate-600">
                    <SelectValue placeholder="Select nursing class" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-600">
                    {nursingClassifications.map((c) => (
                      <SelectItem key={c.value} value={c.value} className="text-white">
                        {c.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label className="text-slate-300">NTA (Non-Therapy Ancillary)</Label>
              <Select value={nta} onValueChange={setNta}>
                <SelectTrigger className="bg-slate-700 text-white border-slate-600">
                  <SelectValue placeholder="Select NTA level" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  {ntaClassifications.map((c) => (
                    <SelectItem key={c.value} value={c.value} className="text-white">
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Therapy Minutes & Stay Details */}
        <Card className="bg-slate-800/50 border border-slate-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-base flex items-center gap-2">
              <Activity className="h-4 w-4 text-green-400" />
              Therapy & Stay Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label className="text-slate-300">PT Minutes/Week</Label>
                <Input
                  type="number"
                  value={ptMinutes}
                  onChange={(e) => setPtMinutes(Number(e.target.value))}
                  className="bg-slate-700 text-white border-slate-600"
                />
              </div>
              <div>
                <Label className="text-slate-300">OT Minutes/Week</Label>
                <Input
                  type="number"
                  value={otMinutes}
                  onChange={(e) => setOtMinutes(Number(e.target.value))}
                  className="bg-slate-700 text-white border-slate-600"
                />
              </div>
              <div>
                <Label className="text-slate-300">ST Minutes/Week</Label>
                <Input
                  type="number"
                  value={stMinutes}
                  onChange={(e) => setStMinutes(Number(e.target.value))}
                  className="bg-slate-700 text-white border-slate-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-slate-300">Projected Length of Stay (Days)</Label>
                <Input
                  type="number"
                  value={projectedLOS}
                  onChange={(e) => setProjectedLOS(Number(e.target.value))}
                  className="bg-slate-700 text-white border-slate-600"
                />
              </div>
              <div>
                <Label className="text-slate-300">Payer Status</Label>
                <Select value={medicareStatus} onValueChange={(v) => setMedicareStatus(v as any)}>
                  <SelectTrigger className="bg-slate-700 text-white border-slate-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-600">
                    <SelectItem value="Part A" className="text-white">Medicare Part A</SelectItem>
                    <SelectItem value="Part B" className="text-white">Medicare Part B</SelectItem>
                    <SelectItem value="Private Pay" className="text-white">Private Pay / Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button 
              onClick={calculateBilling} 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Calculator className="h-4 w-4 mr-2" />
              Calculate Reimbursement
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Results */}
      {calculation && (
        <div className="space-y-4">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-br from-green-900/30 to-emerald-900/20 border border-green-500/30">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <DollarSign className="h-8 w-8 text-green-400" />
                  <div>
                    <p className="text-green-200/80 text-sm">Daily Rate</p>
                    <p className="text-2xl font-bold text-white">${calculation.estimatedDailyRate.toFixed(2)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-900/30 to-indigo-900/20 border border-blue-500/30">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-8 w-8 text-blue-400" />
                  <div>
                    <p className="text-blue-200/80 text-sm">Projected Stay Revenue</p>
                    <p className="text-2xl font-bold text-white">${calculation.projectedStayRevenue.toFixed(2)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-900/30 to-violet-900/20 border border-purple-500/30">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Activity className="h-8 w-8 text-purple-400" />
                  <div>
                    <p className="text-purple-200/80 text-sm">RUG Category</p>
                    <p className="text-2xl font-bold text-white">{calculation.rugCategory}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-amber-900/30 to-orange-900/20 border border-amber-500/30">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Clock className="h-8 w-8 text-amber-400" />
                  <div>
                    <p className="text-amber-200/80 text-sm">Total Therapy/Week</p>
                    <p className="text-2xl font-bold text-white">{calculation.therapyMinutes.total} min</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recommendations */}
          {calculation.recommendations.length > 0 && (
            <Card className="bg-amber-900/20 border border-amber-500/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-amber-300 text-base flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  Revenue Optimization Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {calculation.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start gap-2 text-white/80">
                      <CheckCircle2 className="h-4 w-4 text-amber-400 mt-0.5 flex-shrink-0" />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Detailed Breakdown */}
          <Card className="bg-slate-800/50 border border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-base flex items-center gap-2">
                <FileText className="h-4 w-4" />
                PDPM Component Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                <div className="p-3 bg-slate-700/50 rounded-lg">
                  <p className="text-slate-400">PT Component</p>
                  <p className="text-white font-medium">{ptClassification || 'Not set'}</p>
                </div>
                <div className="p-3 bg-slate-700/50 rounded-lg">
                  <p className="text-slate-400">OT Component</p>
                  <p className="text-white font-medium">{otClassification || 'Not set'}</p>
                </div>
                <div className="p-3 bg-slate-700/50 rounded-lg">
                  <p className="text-slate-400">SLP Component</p>
                  <p className="text-white font-medium">{stClassification || 'Not set'}</p>
                </div>
                <div className="p-3 bg-slate-700/50 rounded-lg">
                  <p className="text-slate-400">Nursing Component</p>
                  <p className="text-white font-medium">{nursingClassification || 'Not set'}</p>
                </div>
                <div className="p-3 bg-slate-700/50 rounded-lg">
                  <p className="text-slate-400">NTA Component</p>
                  <p className="text-white font-medium">{nta || 'Not set'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default SNFBillingCalculator;
