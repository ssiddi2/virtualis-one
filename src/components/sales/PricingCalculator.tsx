import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { 
  Calculator, 
  TrendingUp, 
  Users, 
  Building2, 
  CheckCircle,
  DollarSign,
  Zap,
  Shield
} from 'lucide-react';

interface PricingTier {
  name: string;
  basePrice: number;
  maxProviders: number;
  features: string[];
  popular?: boolean;
}

const pricingTiers: PricingTier[] = [
  {
    name: 'Starter',
    basePrice: 99,
    maxProviders: 25,
    features: [
      'Core EMR functionality',
      'AI clinical assistant',
      'Basic analytics',
      'HIPAA compliance',
      'Email support',
      'Mobile app access'
    ]
  },
  {
    name: 'Professional',
    basePrice: 149,
    maxProviders: 100,
    features: [
      'Everything in Starter',
      'Advanced AI features',
      'Custom workflows',
      'Advanced analytics',
      'Priority support',
      'API access',
      'Multi-department support'
    ],
    popular: true
  },
  {
    name: 'Enterprise',
    basePrice: 199,
    maxProviders: 1000,
    features: [
      'Everything in Professional',
      'Multi-hospital management',
      'Custom integrations',
      'Dedicated support',
      'Training & onboarding',
      'SLA guarantees',
      'White-label options'
    ]
  }
];

export const PricingCalculator: React.FC = () => {
  const [providerCount, setProviderCount] = useState([50]);
  const [bedCount, setBedCount] = useState('');
  const [currentEMRCost, setCurrentEMRCost] = useState('');
  const [includeImplementation, setIncludeImplementation] = useState(true);
  const [showROI, setShowROI] = useState(false);

  const count = providerCount[0];
  
  const selectedTier = pricingTiers.find(tier => count <= tier.maxProviders) || pricingTiers[2];
  
  const monthlyTotal = count * selectedTier.basePrice;
  const annualTotal = monthlyTotal * 12;
  const implementationCost = includeImplementation ? Math.min(5000, count * 100) : 0;
  const firstYearTotal = annualTotal + implementationCost;

  // ROI Calculations
  const currentAnnualCost = parseFloat(currentEMRCost) || 0;
  const annualSavings = Math.max(0, currentAnnualCost - annualTotal);
  const efficiencyGains = count * 2000; // $2000 per provider per year in efficiency
  const totalAnnualBenefit = annualSavings + efficiencyGains;
  const roi = currentAnnualCost > 0 ? ((totalAnnualBenefit - annualTotal) / annualTotal) * 100 : 0;

  useEffect(() => {
    setShowROI(currentAnnualCost > 0);
  }, [currentAnnualCost]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            MedFlow AI Pricing Calculator
          </CardTitle>
          <p className="text-muted-foreground">
            Calculate your investment and ROI for MedFlow AI deployment
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Provider Count Slider */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label className="text-base font-medium">Number of Providers</Label>
              <Badge variant="outline" className="text-lg font-bold">
                {count} providers
              </Badge>
            </div>
            <Slider
              value={providerCount}
              onValueChange={setProviderCount}
              max={500}
              min={1}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>1</span>
              <span>250</span>
              <span>500+</span>
            </div>
          </div>

          {/* Additional Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bedCount">Hospital Bed Count (optional)</Label>
              <Input
                id="bedCount"
                type="number"
                value={bedCount}
                onChange={(e) => setBedCount(e.target.value)}
                placeholder="200"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="currentCost">Current Annual EMR Cost (optional)</Label>
              <Input
                id="currentCost"
                type="number"
                value={currentEMRCost}
                onChange={(e) => setCurrentEMRCost(e.target.value)}
                placeholder="500000"
              />
            </div>
          </div>

          {/* Implementation Toggle */}
          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div>
              <Label htmlFor="implementation" className="text-base font-medium">
                Include Implementation Services
              </Label>
              <p className="text-sm text-muted-foreground">
                White-glove setup and training ({formatCurrency(implementationCost)})
              </p>
            </div>
            <Switch
              id="implementation"
              checked={includeImplementation}
              onCheckedChange={setIncludeImplementation}
            />
          </div>
        </CardContent>
      </Card>

      {/* Selected Tier Display */}
      <Card className={selectedTier.popular ? 'border-primary shadow-md' : ''}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              {selectedTier.name} Plan
            </CardTitle>
            {selectedTier.popular && (
              <Badge className="bg-primary">Most Popular</Badge>
            )}
          </div>
          <p className="text-muted-foreground">
            Recommended for your organization size
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Features */}
            <div className="md:col-span-2">
              <h4 className="font-medium mb-3">Included Features</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {selectedTier.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Pricing */}
            <div className="space-y-4">
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-sm text-muted-foreground">Monthly Total</div>
                <div className="text-2xl font-bold">{formatCurrency(monthlyTotal)}</div>
                <div className="text-xs text-muted-foreground">
                  {formatCurrency(selectedTier.basePrice)}/provider/month
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Annual cost:</span>
                  <span className="font-medium">{formatCurrency(annualTotal)}</span>
                </div>
                {includeImplementation && (
                  <div className="flex justify-between">
                    <span>Implementation:</span>
                    <span className="font-medium">{formatCurrency(implementationCost)}</span>
                  </div>
                )}
                <div className="flex justify-between border-t pt-2 font-bold">
                  <span>First year total:</span>
                  <span>{formatCurrency(firstYearTotal)}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ROI Analysis */}
      {showROI && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800">
              <TrendingUp className="h-5 w-5" />
              ROI Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-white rounded-lg">
                <div className="text-sm text-muted-foreground">Current Annual Cost</div>
                <div className="text-lg font-bold">{formatCurrency(currentAnnualCost)}</div>
              </div>
              <div className="text-center p-3 bg-white rounded-lg">
                <div className="text-sm text-muted-foreground">MedFlow AI Cost</div>
                <div className="text-lg font-bold">{formatCurrency(annualTotal)}</div>
              </div>
              <div className="text-center p-3 bg-white rounded-lg">
                <div className="text-sm text-muted-foreground">Efficiency Gains</div>
                <div className="text-lg font-bold text-green-600">+{formatCurrency(efficiencyGains)}</div>
              </div>
              <div className="text-center p-3 bg-green-100 rounded-lg">
                <div className="text-sm text-muted-foreground">Annual ROI</div>
                <div className="text-xl font-bold text-green-700">{roi.toFixed(0)}%</div>
              </div>
            </div>
            
            <div className="mt-4 p-4 bg-white rounded-lg">
              <h4 className="font-medium mb-2">ROI Breakdown</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Annual software savings:</span>
                  <span className="font-medium text-green-600">+{formatCurrency(annualSavings)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Provider efficiency gains:</span>
                  <span className="font-medium text-green-600">+{formatCurrency(efficiencyGains)}</span>
                </div>
                <div className="flex justify-between border-t pt-2 font-bold">
                  <span>Total annual benefit:</span>
                  <span className="text-green-600">+{formatCurrency(totalAnnualBenefit)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* CTA */}
      <Card>
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <h3 className="text-xl font-bold">Ready to Get Started?</h3>
            <p className="text-muted-foreground">
              Start your 30-day free trial today. No credit card required.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button size="lg" className="bg-green-600 hover:bg-green-700">
                <Zap className="h-4 w-4 mr-2" />
                Start Free Trial
              </Button>
              <Button variant="outline" size="lg">
                Schedule Demo Call
              </Button>
            </div>
            <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Shield className="h-3 w-3" />
                <span>HIPAA Compliant</span>
              </div>
              <div className="flex items-center gap-1">
                <DollarSign className="h-3 w-3" />
                <span>No Setup Fees</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                <span>Cancel Anytime</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};