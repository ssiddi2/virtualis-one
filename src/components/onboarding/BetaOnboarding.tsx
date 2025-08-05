import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Building2, 
  Users, 
  Phone, 
  Mail, 
  MapPin, 
  CheckCircle,
  Sparkles,
  Shield,
  Clock,
  ArrowRight
} from 'lucide-react';

interface BetaSignupData {
  hospitalName: string;
  hospitalType: string;
  bedCount: string;
  location: string;
  contactName: string;
  contactTitle: string;
  contactEmail: string;
  contactPhone: string;
  currentEMR: string;
  painPoints: string;
  timeline: string;
  providerCount: string;
}

export const BetaOnboarding: React.FC = () => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [data, setData] = useState<BetaSignupData>({
    hospitalName: '',
    hospitalType: '',
    bedCount: '',
    location: '',
    contactName: '',
    contactTitle: '',
    contactEmail: '',
    contactPhone: '',
    currentEMR: '',
    painPoints: '',
    timeline: '',
    providerCount: ''
  });
  
  const { toast } = useToast();

  const updateData = (field: keyof BetaSignupData, value: string) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (step < 3) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // In production, send to your CRM/email service
      console.log('Beta signup data:', data);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Welcome to MedFlow AI Beta! 🚀",
        description: "We'll contact you within 24 hours to schedule your demo and setup.",
      });
      
      setStep(4); // Success step
    } catch (error) {
      toast({
        title: "Submission Error",
        description: "Please try again or contact sales@medflow.ai",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPricing = () => {
    const count = parseInt(data.providerCount) || 0;
    if (count <= 25) return { tier: 'Starter', price: 99 };
    if (count <= 100) return { tier: 'Professional', price: 149 };
    return { tier: 'Enterprise', price: 199 };
  };

  if (step === 4) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center">
          <CardContent className="pt-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Welcome to the Beta!</h2>
            <p className="text-muted-foreground mb-6">
              Thank you for joining MedFlow AI. We'll be in touch within 24 hours to get you started.
            </p>
            <div className="space-y-2 text-sm">
              <p>🎯 Your estimated pricing: <strong>${getPricing().price}/provider/month</strong></p>
              <p>⚡ Setup time: <strong>15 minutes</strong></p>
              <p>🛡️ HIPAA compliance: <strong>Included</strong></p>
            </div>
            <Button 
              className="w-full mt-6" 
              onClick={() => window.location.href = '/dashboard'}
            >
              Explore Demo Environment
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary/5 to-secondary/5">
      <Card className="max-w-2xl w-full">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              <Sparkles className="h-3 w-3 mr-1" />
              Beta Access
            </Badge>
          </div>
          <CardTitle className="text-2xl">Join MedFlow AI Beta</CardTitle>
          <p className="text-muted-foreground">
            Be among the first hospitals to experience AI-native EMR technology
          </p>
          
          <div className="flex justify-center gap-2 mt-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={`h-2 w-8 rounded-full ${
                  i <= step ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Hospital Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="hospitalName">Hospital Name *</Label>
                  <Input
                    id="hospitalName"
                    value={data.hospitalName}
                    onChange={(e) => updateData('hospitalName', e.target.value)}
                    placeholder="General Hospital"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="hospitalType">Hospital Type *</Label>
                  <Select value={data.hospitalType} onValueChange={(value) => updateData('hospitalType', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="critical-access">Critical Access Hospital</SelectItem>
                      <SelectItem value="community">Community Hospital</SelectItem>
                      <SelectItem value="teaching">Teaching Hospital</SelectItem>
                      <SelectItem value="specialty">Specialty Hospital</SelectItem>
                      <SelectItem value="network">Hospital Network</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bedCount">Bed Count *</Label>
                  <Select value={data.bedCount} onValueChange={(value) => updateData('bedCount', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-25">1-25 beds</SelectItem>
                      <SelectItem value="26-50">26-50 beds</SelectItem>
                      <SelectItem value="51-100">51-100 beds</SelectItem>
                      <SelectItem value="101-200">101-200 beds</SelectItem>
                      <SelectItem value="201-500">201-500 beds</SelectItem>
                      <SelectItem value="500+">500+ beds</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    value={data.location}
                    onChange={(e) => updateData('location', e.target.value)}
                    placeholder="City, State"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Users className="h-5 w-5" />
                Contact & Current Setup
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contactName">Contact Name *</Label>
                  <Input
                    id="contactName"
                    value={data.contactName}
                    onChange={(e) => updateData('contactName', e.target.value)}
                    placeholder="John Smith"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="contactTitle">Title *</Label>
                  <Input
                    id="contactTitle"
                    value={data.contactTitle}
                    onChange={(e) => updateData('contactTitle', e.target.value)}
                    placeholder="CIO, CMO, etc."
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Email *</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={data.contactEmail}
                    onChange={(e) => updateData('contactEmail', e.target.value)}
                    placeholder="john@hospital.com"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="contactPhone">Phone *</Label>
                  <Input
                    id="contactPhone"
                    value={data.contactPhone}
                    onChange={(e) => updateData('contactPhone', e.target.value)}
                    placeholder="(555) 123-4567"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="currentEMR">Current EMR</Label>
                  <Select value={data.currentEMR} onValueChange={(value) => updateData('currentEMR', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select EMR" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="epic">Epic</SelectItem>
                      <SelectItem value="cerner">Cerner</SelectItem>
                      <SelectItem value="meditech">Meditech</SelectItem>
                      <SelectItem value="allscripts">Allscripts</SelectItem>
                      <SelectItem value="athenahealth">athenahealth</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                      <SelectItem value="none">No EMR</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="providerCount">Provider Count *</Label>
                  <Input
                    id="providerCount"
                    type="number"
                    value={data.providerCount}
                    onChange={(e) => updateData('providerCount', e.target.value)}
                    placeholder="25"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Requirements & Timeline
              </h3>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="painPoints">Current Pain Points</Label>
                  <Textarea
                    id="painPoints"
                    value={data.painPoints}
                    onChange={(e) => updateData('painPoints', e.target.value)}
                    placeholder="Tell us about your current challenges with documentation, efficiency, or technology..."
                    rows={3}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="timeline">Implementation Timeline</Label>
                  <Select value={data.timeline} onValueChange={(value) => updateData('timeline', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="When would you like to go live?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="immediate">Immediately (within 2 weeks)</SelectItem>
                      <SelectItem value="month">Within 1 month</SelectItem>
                      <SelectItem value="quarter">Within 3 months</SelectItem>
                      <SelectItem value="planning">Just planning ahead</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Card className="bg-muted/50">
                  <CardContent className="pt-4">
                    <h4 className="font-semibold mb-2">Your Estimated Pricing</h4>
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-lg font-bold">{getPricing().tier} Plan</div>
                        <div className="text-sm text-muted-foreground">
                          For {data.providerCount || '—'} providers
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold">${getPricing().price}</div>
                        <div className="text-sm text-muted-foreground">/provider/month</div>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t text-sm">
                      <div className="flex items-center gap-1">
                        <Shield className="h-3 w-3" />
                        <span>30-day free trial • No setup fees • Cancel anytime</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          <div className="flex justify-between pt-4">
            {step > 1 && (
              <Button variant="outline" onClick={prevStep}>
                Previous
              </Button>
            )}
            
            <div className="ml-auto">
              {step < 3 ? (
                <Button 
                  onClick={nextStep}
                  disabled={
                    (step === 1 && (!data.hospitalName || !data.hospitalType || !data.bedCount || !data.location)) ||
                    (step === 2 && (!data.contactName || !data.contactTitle || !data.contactEmail || !data.contactPhone || !data.providerCount))
                  }
                >
                  Continue
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button 
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isSubmitting ? 'Submitting...' : 'Join Beta Program'}
                  <Sparkles className="h-4 w-4 ml-2" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};