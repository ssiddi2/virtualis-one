
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calculator, 
  TrendingUp, 
  DollarSign, 
  Clock, 
  Users,
  Target,
  Zap,
  Brain
} from 'lucide-react';

const ROICalculator = () => {
  const [formData, setFormData] = useState({
    monthlyRevenue: 2500000,
    avgCodingTime: 45,
    numberOfCoders: 8,
    denialRate: 12,
    avgDaysAR: 45,
    documentationTime: 30
  });

  const [results, setResults] = useState<any>(null);

  const calculateROI = () => {
    // AI Feature Savings Calculations
    const aiCodingSavings = (formData.avgCodingTime * 0.30 * formData.numberOfCoders * 22 * 8 * 25); // 30% time reduction
    const denialReduction = (formData.monthlyRevenue * (formData.denialRate / 100) * 0.25 * 12); // 25% denial reduction
    const arImprovement = (formData.monthlyRevenue * (formData.avgDaysAR / 365) * 0.15 * 12); // 15% AR improvement
    const documentationSavings = (formData.documentationTime * 0.40 * 150 * 12 * 45); // 40% documentation time reduction

    const totalAnnualSavings = aiCodingSavings + denialReduction + arImprovement + documentationSavings;
    const virtualisAnnualCost = 180000; // Estimated annual cost
    const netROI = ((totalAnnualSavings - virtualisAnnualCost) / virtualisAnnualCost) * 100;
    const paybackMonths = (virtualisAnnualCost / (totalAnnualSavings / 12));

    setResults({
      aiCodingSavings,
      denialReduction,
      arImprovement,
      documentationSavings,
      totalAnnualSavings,
      virtualisAnnualCost,
      netROI,
      paybackMonths
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: parseFloat(value) || 0
    }));
  };

  return (
    <div className="space-y-6">
      <Card className="backdrop-blur-xl bg-blue-500/20 border border-blue-300/30">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Virtualis AI ROI Calculator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Input Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-white/70 text-sm mb-2">Monthly Revenue ($)</label>
              <Input
                type="number"
                value={formData.monthlyRevenue}
                onChange={(e) => handleInputChange('monthlyRevenue', e.target.value)}
                className="bg-blue-600/20 border-blue-400/30 text-white"
              />
            </div>
            <div>
              <label className="block text-white/70 text-sm mb-2">Avg Coding Time (min/chart)</label>
              <Input
                type="number"
                value={formData.avgCodingTime}
                onChange={(e) => handleInputChange('avgCodingTime', e.target.value)}
                className="bg-blue-600/20 border-blue-400/30 text-white"
              />
            </div>
            <div>
              <label className="block text-white/70 text-sm mb-2">Number of Coders</label>
              <Input
                type="number"
                value={formData.numberOfCoders}
                onChange={(e) => handleInputChange('numberOfCoders', e.target.value)}
                className="bg-blue-600/20 border-blue-400/30 text-white"
              />
            </div>
            <div>
              <label className="block text-white/70 text-sm mb-2">Current Denial Rate (%)</label>
              <Input
                type="number"
                value={formData.denialRate}
                onChange={(e) => handleInputChange('denialRate', e.target.value)}
                className="bg-blue-600/20 border-blue-400/30 text-white"
              />
            </div>
            <div>
              <label className="block text-white/70 text-sm mb-2">Avg Days in A/R</label>
              <Input
                type="number"
                value={formData.avgDaysAR}
                onChange={(e) => handleInputChange('avgDaysAR', e.target.value)}
                className="bg-blue-600/20 border-blue-400/30 text-white"
              />
            </div>
            <div>
              <label className="block text-white/70 text-sm mb-2">Documentation Time (min/patient)</label>
              <Input
                type="number"
                value={formData.documentationTime}
                onChange={(e) => handleInputChange('documentationTime', e.target.value)}
                className="bg-blue-600/20 border-blue-400/30 text-white"
              />
            </div>
          </div>

          <Button 
            onClick={calculateROI}
            className="w-full bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700"
          >
            Calculate ROI
          </Button>

          {/* Results */}
          {results && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="bg-green-500/20 border border-green-300/30">
                  <CardContent className="p-4 text-center">
                    <Brain className="h-8 w-8 text-green-300 mx-auto mb-2" />
                    <p className="text-sm text-white/70">AI Coding Savings</p>
                    <p className="text-xl font-bold text-white">${results.aiCodingSavings.toLocaleString()}</p>
                  </CardContent>
                </Card>

                <Card className="bg-blue-500/20 border border-blue-300/30">
                  <CardContent className="p-4 text-center">
                    <Target className="h-8 w-8 text-blue-300 mx-auto mb-2" />
                    <p className="text-sm text-white/70">Denial Reduction</p>
                    <p className="text-xl font-bold text-white">${results.denialReduction.toLocaleString()}</p>
                  </CardContent>
                </Card>

                <Card className="bg-purple-500/20 border border-purple-300/30">
                  <CardContent className="p-4 text-center">
                    <Clock className="h-8 w-8 text-purple-300 mx-auto mb-2" />
                    <p className="text-sm text-white/70">A/R Improvement</p>
                    <p className="text-xl font-bold text-white">${results.arImprovement.toLocaleString()}</p>
                  </CardContent>
                </Card>

                <Card className="bg-yellow-500/20 border border-yellow-300/30">
                  <CardContent className="p-4 text-center">
                    <Zap className="h-8 w-8 text-yellow-300 mx-auto mb-2" />
                    <p className="text-sm text-white/70">Documentation Savings</p>
                    <p className="text-xl font-bold text-white">${results.documentationSavings.toLocaleString()}</p>
                  </CardContent>
                </Card>
              </div>

              {/* Summary Results */}
              <Card className="bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-300/30">
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                    <div>
                      <DollarSign className="h-12 w-12 text-green-300 mx-auto mb-2" />
                      <p className="text-sm text-white/70">Total Annual Savings</p>
                      <p className="text-3xl font-bold text-white">${results.totalAnnualSavings.toLocaleString()}</p>
                    </div>
                    <div>
                      <TrendingUp className="h-12 w-12 text-blue-300 mx-auto mb-2" />
                      <p className="text-sm text-white/70">ROI Percentage</p>
                      <p className="text-3xl font-bold text-white">{results.netROI.toFixed(1)}%</p>
                    </div>
                    <div>
                      <Clock className="h-12 w-12 text-purple-300 mx-auto mb-2" />
                      <p className="text-sm text-white/70">Payback Period</p>
                      <p className="text-3xl font-bold text-white">{results.paybackMonths.toFixed(1)} months</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Value Proposition */}
              <Card className="bg-purple-500/20 border border-purple-300/30">
                <CardContent className="p-4">
                  <h3 className="text-white font-semibold mb-3">Key Value Propositions</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Badge className="bg-green-500/20 text-green-200 border-green-400/30">
                        ✓ 30% Reduction in Coding Time
                      </Badge>
                      <Badge className="bg-blue-500/20 text-blue-200 border-blue-400/30">
                        ✓ 25% Fewer Claim Denials
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <Badge className="bg-purple-500/20 text-purple-200 border-purple-400/30">
                        ✓ 15% Faster A/R Collection
                      </Badge>
                      <Badge className="bg-yellow-500/20 text-yellow-200 border-yellow-400/30">
                        ✓ 40% Less Documentation Time
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ROICalculator;
