
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  DollarSign, 
  TrendingUp, 
  AlertTriangle, 
  FileText,
  Calculator,
  Shield,
  Target,
  BarChart3
} from 'lucide-react';
import DenialManagement from './DenialManagement';
import PriorAuthManager from './PriorAuthManager';
import RevenueAnalytics from './RevenueAnalytics';
import ROICalculator from './ROICalculator';

interface BillingDashboardProps {
  hospitalId: string;
}

const BillingDashboard = ({ hospitalId }: BillingDashboardProps) => {
  return (
    <div className="min-h-screen p-6" style={{
      background: 'linear-gradient(135deg, hsl(225, 70%, 25%) 0%, hsl(220, 65%, 35%) 25%, hsl(215, 60%, 45%) 50%, hsl(210, 55%, 55%) 75%, hsl(205, 50%, 65%) 100%)'
    }}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-white">
            Enhanced Revenue Cycle Management
          </h1>
          <p className="text-white/80 text-lg">
            AI-powered billing optimization with predictive analytics and automated workflows
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="backdrop-blur-xl bg-green-500/20 border border-green-300/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/70">Monthly Revenue</p>
                  <p className="text-2xl font-bold text-white">$2.45M</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-300" />
              </div>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-xl bg-blue-500/20 border border-blue-300/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/70">Collection Rate</p>
                  <p className="text-2xl font-bold text-white">94.2%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-blue-300" />
              </div>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-xl bg-yellow-500/20 border border-yellow-300/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/70">Denial Rate</p>
                  <p className="text-2xl font-bold text-white">8.3%</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-yellow-300" />
              </div>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-xl bg-purple-500/20 border border-purple-300/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/70">Days in A/R</p>
                  <p className="text-2xl font-bold text-white">42.5</p>
                </div>
                <FileText className="h-8 w-8 text-purple-300" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="analytics" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-blue-600/20 border border-blue-400/30">
            <TabsTrigger 
              value="analytics" 
              className="data-[state=active]:bg-blue-500/30 data-[state=active]:text-white text-white/70"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </TabsTrigger>
            <TabsTrigger 
              value="denials"
              className="data-[state=active]:bg-blue-500/30 data-[state=active]:text-white text-white/70"
            >
              <AlertTriangle className="h-4 w-4 mr-2" />
              Denial Management
            </TabsTrigger>
            <TabsTrigger 
              value="prior-auth"
              className="data-[state=active]:bg-blue-500/30 data-[state=active]:text-white text-white/70"
            >
              <Shield className="h-4 w-4 mr-2" />
              Prior Auth
            </TabsTrigger>
            <TabsTrigger 
              value="roi-calculator"
              className="data-[state=active]:bg-blue-500/30 data-[state=active]:text-white text-white/70"
            >
              <Calculator className="h-4 w-4 mr-2" />
              ROI Calculator
            </TabsTrigger>
          </TabsList>

          <TabsContent value="analytics" className="mt-6">
            <RevenueAnalytics hospitalId={hospitalId} />
          </TabsContent>

          <TabsContent value="denials" className="mt-6">
            <DenialManagement hospitalId={hospitalId} />
          </TabsContent>

          <TabsContent value="prior-auth" className="mt-6">
            <PriorAuthManager hospitalId={hospitalId} />
          </TabsContent>

          <TabsContent value="roi-calculator" className="mt-6">
            <ROICalculator />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default BillingDashboard;
