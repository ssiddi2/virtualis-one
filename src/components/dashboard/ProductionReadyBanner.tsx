import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, Zap, Shield, Brain, Globe } from 'lucide-react';

export const ProductionReadyBanner: React.FC = () => {
  const features = [
    { icon: <Zap className="h-4 w-4" />, text: "Deploy in 15 minutes" },
    { icon: <Brain className="h-4 w-4" />, text: "AI-native workflows" },
    { icon: <Shield className="h-4 w-4" />, text: "HIPAA compliant" },
    { icon: <Globe className="h-4 w-4" />, text: "Multi-hospital ready" }
  ];

  return (
    <Card className="mb-6 border-l-4 border-l-primary bg-gradient-to-r from-primary/5 to-transparent">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <h3 className="font-semibold">Production Ready</h3>
              <Badge variant="secondary" className="text-xs">Live System</Badge>
            </div>
            
            <div className="flex flex-wrap gap-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-1 text-sm text-muted-foreground">
                  {feature.icon}
                  <span>{feature.text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild>
              <a href="mailto:sales@medflow.ai" target="_blank" rel="noopener noreferrer">
                Contact Sales
              </a>
            </Button>
            <Button size="sm" asChild>
              <a href="https://docs.medflow.ai" target="_blank" rel="noopener noreferrer">
                View Docs
              </a>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};