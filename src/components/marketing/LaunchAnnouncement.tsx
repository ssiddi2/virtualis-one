import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Rocket, 
  Sparkles, 
  Users, 
  Shield, 
  Zap, 
  Building2,
  CheckCircle,
  ArrowRight,
  Clock,
  DollarSign
} from 'lucide-react';

export const LaunchAnnouncement: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Hero Announcement */}
      <Card className="border-primary bg-gradient-to-r from-primary/5 to-secondary/5">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Badge className="bg-green-600 text-white animate-pulse">
              <Rocket className="h-3 w-3 mr-1" />
              NOW LIVE
            </Badge>
            <Badge variant="outline">Production Ready</Badge>
          </div>
          <CardTitle className="text-4xl font-bold mb-4">
            🚀 MedFlow AI is Now Live in Production!
          </CardTitle>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            The first AI-native EMR platform designed for small to medium hospitals 
            is ready for deployment. Transform your healthcare operations in 15 minutes.
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Clock className="h-8 w-8 text-blue-600" />
              </div>
              <div className="font-bold text-lg">15 Minutes</div>
              <div className="text-sm text-muted-foreground">Setup Time</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
              <div className="font-bold text-lg">$99/month</div>
              <div className="text-sm text-muted-foreground">Per Provider</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Shield className="h-8 w-8 text-purple-600" />
              </div>
              <div className="font-bold text-lg">HIPAA</div>
              <div className="text-sm text-muted-foreground">Compliant</div>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Zap className="h-8 w-8 text-orange-600" />
              </div>
              <div className="font-bold text-lg">&lt;200ms</div>
              <div className="text-sm text-muted-foreground">Response Time</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-green-600 hover:bg-green-700">
              <Sparkles className="h-4 w-4 mr-2" />
              Start 30-Day Free Trial
            </Button>
            <Button variant="outline" size="lg">
              Schedule Live Demo
            </Button>
            <Button variant="ghost" size="lg">
              Join Beta Program
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* What Makes Us Different */}
      <Card>
        <CardHeader>
          <CardTitle className="text-center text-2xl mb-4">
            Why Choose MedFlow AI Over Legacy EMRs?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4 text-red-600">Legacy EMRs</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center mt-0.5">
                    <span className="text-red-600 text-xs">✗</span>
                  </div>
                  <span className="text-sm">6-18 month implementations</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center mt-0.5">
                    <span className="text-red-600 text-xs">✗</span>
                  </div>
                  <span className="text-sm">$500K+ upfront costs</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center mt-0.5">
                    <span className="text-red-600 text-xs">✗</span>
                  </div>
                  <span className="text-sm">Requires dedicated IT team</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center mt-0.5">
                    <span className="text-red-600 text-xs">✗</span>
                  </div>
                  <span className="text-sm">AI bolted on as afterthought</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center mt-0.5">
                    <span className="text-red-600 text-xs">✗</span>
                  </div>
                  <span className="text-sm">Slow, clunky interfaces</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4 text-green-600">MedFlow AI</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <span className="text-sm">15 minutes to go live</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <span className="text-sm">$99/month per provider</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <span className="text-sm">Zero IT overhead</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <span className="text-sm">AI-native from ground up</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <span className="text-sm">Sub-200ms response times</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Target Hospitals */}
      <Card>
        <CardHeader>
          <CardTitle className="text-center text-2xl mb-4">
            Perfect for Small to Medium Hospitals
          </CardTitle>
          <p className="text-center text-muted-foreground">
            Designed specifically for hospitals that need enterprise features without enterprise complexity
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-dashed">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Building2 className="h-5 w-5" />
                  Critical Access
                </CardTitle>
                <p className="text-sm text-muted-foreground">25-50 beds</p>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-4">
                  <div className="text-2xl font-bold">$99</div>
                  <div className="text-sm text-muted-foreground">/provider/month</div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    <span>Instant deployment</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    <span>No IT team required</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    <span>Full EMR functionality</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-primary">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Building2 className="h-5 w-5" />
                  Community Hospitals
                  <Badge>Most Popular</Badge>
                </CardTitle>
                <p className="text-sm text-muted-foreground">50-200 beds</p>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-4">
                  <div className="text-2xl font-bold">$149</div>
                  <div className="text-sm text-muted-foreground">/provider/month</div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    <span>Scalable architecture</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    <span>Multi-department support</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    <span>Advanced analytics</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-dashed">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Building2 className="h-5 w-5" />
                  Hospital Networks
                </CardTitle>
                <p className="text-sm text-muted-foreground">200+ beds</p>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-4">
                  <div className="text-2xl font-bold">$199</div>
                  <div className="text-sm text-muted-foreground">/provider/month</div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    <span>Enterprise features</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    <span>Network management</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-3 w-3 text-green-500" />
                    <span>Custom integrations</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Launch Metrics */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50">
        <CardHeader>
          <CardTitle className="text-center text-2xl">
            Production Launch Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-green-600">99.9%</div>
              <div className="text-sm text-muted-foreground">Uptime SLA</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600">&lt;200ms</div>
              <div className="text-sm text-muted-foreground">Response Time</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600">34</div>
              <div className="text-sm text-muted-foreground">Database Tables</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600">15min</div>
              <div className="text-sm text-muted-foreground">Setup Time</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Call to Action */}
      <Card className="text-center">
        <CardContent className="pt-8">
          <h2 className="text-2xl font-bold mb-4">Ready to Join the AI Healthcare Revolution?</h2>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            MedFlow AI is live and ready to transform your hospital operations. 
            Start your free trial today and see why forward-thinking hospitals are choosing AI-native EMR.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
            <Button size="lg" className="bg-green-600 hover:bg-green-700">
              <Users className="h-4 w-4 mr-2" />
              Start Free 30-Day Trial
            </Button>
            <Button variant="outline" size="lg">
              Schedule Demo Call
            </Button>
          </div>

          <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Shield className="h-3 w-3" />
              <span>HIPAA Compliant</span>
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle className="h-3 w-3" />
              <span>No Setup Fees</span>
            </div>
            <div className="flex items-center gap-1">
              <Zap className="h-3 w-3" />
              <span>Cancel Anytime</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};