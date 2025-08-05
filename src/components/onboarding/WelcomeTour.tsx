import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, ChevronLeft, Sparkles, Brain, Clock, Shield } from 'lucide-react';

interface WelcomeTourProps {
  isOpen: boolean;
  onClose: () => void;
  userRole?: string;
}

const tourSteps = [
  {
    title: "Welcome to Virtualis",
    content: "AI-powered clinical workflow assistant designed for modern healthcare teams. Get intelligent support in seconds.",
    icon: <Sparkles className="h-8 w-8 text-primary" />,
    features: ["Instant deployment", "AI-powered workflows", "Zero IT overhead"]
  },
  {
    title: "AI Clinical Assistant",
    content: "Your intelligent clinical copilot is always ready. Use Ctrl+Space anywhere to get AI-powered insights, documentation help, and clinical decision support.",
    icon: <Brain className="h-8 w-8 text-primary" />,
    features: ["Smart documentation", "Clinical decision support", "Voice commands"]
  },
  {
    title: "Lightning Fast Workflows",
    content: "Everything you need in one unified interface. Patient charts, orders, documentation, billing, and analytics - all optimized for speed.",
    icon: <Clock className="h-8 w-8 text-primary" />,
    features: ["Sub-200ms response times", "Mobile-optimized", "Intuitive design"]
  },
  {
    title: "Enterprise Security",
    content: "HIPAA compliant out of the box with enterprise-grade security, audit trails, and data protection.",
    icon: <Shield className="h-8 w-8 text-primary" />,
    features: ["HIPAA compliant", "End-to-end encryption", "Audit logging"]
  }
];

export const WelcomeTour: React.FC<WelcomeTourProps> = ({ isOpen, onClose, userRole }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const complete = () => {
    localStorage.setItem('virtualis_tour_completed', 'true');
    onClose();
  };

  const step = tourSteps[currentStep];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {step.icon}
            {step.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-muted-foreground">{step.content}</p>
          
          <div className="space-y-2">
            {step.features.map((feature, index) => (
              <div key={index} className="flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">
                  ✓
                </Badge>
                <span className="text-sm">{feature}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-4">
            <div className="flex gap-1">
              {tourSteps.map((_, index) => (
                <div
                  key={index}
                  className={`h-2 w-2 rounded-full ${
                    index === currentStep ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              ))}
            </div>

            <div className="flex gap-2">
              {currentStep > 0 && (
                <Button variant="outline" size="sm" onClick={prevStep}>
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Back
                </Button>
              )}
              
              {currentStep < tourSteps.length - 1 ? (
                <Button size="sm" onClick={nextStep}>
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              ) : (
                <Button size="sm" onClick={complete}>
                  Get Started
                  <Sparkles className="h-4 w-4 ml-1" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};