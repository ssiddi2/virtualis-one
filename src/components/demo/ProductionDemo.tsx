import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Sparkles, 
  Brain, 
  Clock, 
  Shield, 
  Zap, 
  CheckCircle, 
  Users,
  Building2,
  TrendingUp,
  Globe
} from 'lucide-react';

export const ProductionDemo: React.FC = () => {
  const [selectedDemo, setSelectedDemo] = useState<string>('overview');

  const features = [
    {
      id: 'ai-native',
      title: 'AI-Native Workflows',
      description: 'Built from the ground up with AI at the core',
      icon: <Brain className="h-8 w-8" />,
      metrics: ['97% accuracy', '3x faster documentation', '60% fewer clicks'],
      color: 'bg-purple-500'
    },
    {
      id: 'speed',
      title: 'Lightning Fast Performance',
      description: 'Sub-200ms response times with optimized architecture',
      icon: <Zap className="h-8 w-8" />,
      metrics: ['<200ms response', '99.9% uptime', '10x faster than legacy'],
      color: 'bg-yellow-500'
    },
    {
      id: 'security',
      title: 'Enterprise Security',
      description: 'HIPAA compliant with enterprise-grade protection',
      icon: <Shield className="h-8 w-8" />,
      metrics: ['HIPAA compliant', 'SOC 2 certified', 'End-to-end encryption'],
      color: 'bg-green-500'
    },
    {
      id: 'deployment',
      title: 'Rapid Deployment',
      description: 'Go live in days, not months',
      icon: <Globe className="h-8 w-8" />,
      metrics: ['15-min setup', 'Zero IT overhead', 'Cloud-native'],
      color: 'bg-blue-500'
    }
  ];

  const useCases = [
    {
      title: 'Critical Access Hospitals',
      description: '25-50 beds, limited IT resources',
      benefits: ['Instant deployment', 'No IT team required', 'Full EMR functionality'],
      pricing: '$99/provider/month'
    },
    {
      title: 'Community Hospitals',
      description: '50-200 beds, growing organizations',
      benefits: ['Scalable architecture', 'Multi-department support', 'Advanced analytics'],
      pricing: '$149/provider/month'
    },
    {
      title: 'Hospital Networks',
      description: '200+ beds, multi-facility operations',
      benefits: ['Enterprise features', 'Network management', 'Custom integrations'],
      pricing: '$199/provider/month'
    }
  ];

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">MedFlow AI Production Demo</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Experience the first AI-native EMR platform designed for modern healthcare teams
        </p>
        <div className="flex items-center justify-center gap-2">
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Production Ready
          </Badge>
          <Badge variant="secondary">Live System</Badge>
          <Badge variant="secondary">HIPAA Compliant</Badge>
        </div>
      </div>

      <Tabs value={selectedDemo} onValueChange={setSelectedDemo} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="use-cases">Use Cases</TabsTrigger>
          <TabsTrigger value="pricing">Pricing</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <Card key={feature.id} className="relative overflow-hidden">
                <CardHeader className="pb-3">
                  <div className={`inline-flex p-2 rounded-lg ${feature.color} text-white w-fit`}>
                    {feature.icon}
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{feature.description}</p>
                  <div className="space-y-2">
                    {feature.metrics.map((metric, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        <span>{metric}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Why Choose MedFlow AI?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Sparkles className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h4 className="font-medium">AI-First Architecture</h4>
                      <p className="text-sm text-muted-foreground">Unlike legacy EMRs with bolted-on AI, we built intelligence into every workflow from day one.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h4 className="font-medium">Instant Deployment</h4>
                      <p className="text-sm text-muted-foreground">Go live in 15 minutes with zero IT overhead. No servers, no maintenance, no headaches.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <TrendingUp className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h4 className="font-medium">Proven ROI</h4>
                      <p className="text-sm text-muted-foreground">Hospitals see 40% faster documentation, 60% reduction in administrative tasks, and improved patient satisfaction.</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-primary">99.9%</div>
                  <div className="text-sm text-muted-foreground">Uptime SLA</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-primary">&lt;200ms</div>
                  <div className="text-sm text-muted-foreground">Response Time</div>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <div className="text-2xl font-bold text-primary">15min</div>
                  <div className="text-sm text-muted-foreground">Setup Time</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="features" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  AI Clinical Assistant
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Smart documentation with voice commands</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Clinical decision support</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Ambient listening (Ctrl+Space)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Predictive analytics</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Performance & Speed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Sub-200ms response times</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Mobile-optimized interface</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Offline capability</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Auto-scaling infrastructure</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="use-cases" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {useCases.map((useCase, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    {useCase.title}
                  </CardTitle>
                  <p className="text-muted-foreground">{useCase.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {useCase.benefits.map((benefit, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm">{benefit}</span>
                      </div>
                    ))}
                    <div className="pt-4 border-t">
                      <div className="text-lg font-bold text-primary">{useCase.pricing}</div>
                      <div className="text-sm text-muted-foreground">per provider per month</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="pricing" className="space-y-6">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold">Simple, Transparent Pricing</h2>
            <p className="text-muted-foreground">No hidden fees, no complex licensing. Pay per provider, scale as you grow.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Starter</CardTitle>
                <div className="text-3xl font-bold">$99<span className="text-lg font-normal">/provider/mo</span></div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li>✓ Core EMR functionality</li>
                  <li>✓ AI clinical assistant</li>
                  <li>✓ Basic analytics</li>
                  <li>✓ HIPAA compliance</li>
                  <li>✓ Email support</li>
                </ul>
                <Button className="w-full mt-4">Start Free Trial</Button>
              </CardContent>
            </Card>

            <Card className="border-primary">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  Professional
                  <Badge>Most Popular</Badge>
                </CardTitle>
                <div className="text-3xl font-bold">$149<span className="text-lg font-normal">/provider/mo</span></div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li>✓ Everything in Starter</li>
                  <li>✓ Advanced AI features</li>
                  <li>✓ Custom workflows</li>
                  <li>✓ Advanced analytics</li>
                  <li>✓ Priority support</li>
                  <li>✓ API access</li>
                </ul>
                <Button className="w-full mt-4">Start Free Trial</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Enterprise</CardTitle>
                <div className="text-3xl font-bold">$199<span className="text-lg font-normal">/provider/mo</span></div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li>✓ Everything in Professional</li>
                  <li>✓ Multi-hospital management</li>
                  <li>✓ Custom integrations</li>
                  <li>✓ Dedicated support</li>
                  <li>✓ Training & onboarding</li>
                  <li>✓ SLA guarantees</li>
                </ul>
                <Button className="w-full mt-4">Contact Sales</Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <div className="text-center space-y-4 p-8 bg-muted rounded-lg">
        <h2 className="text-2xl font-bold">Ready to Transform Your Healthcare Operations?</h2>
        <p className="text-muted-foreground">
          Join the AI healthcare revolution. Deploy MedFlow AI in 15 minutes and start seeing results on day one.
        </p>
        <div className="flex gap-4 justify-center">
          <Button size="lg">Start Free 30-Day Trial</Button>
          <Button variant="outline" size="lg">Schedule Demo</Button>
        </div>
      </div>
    </div>
  );
};