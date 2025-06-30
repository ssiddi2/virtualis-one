
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
import BillingReportGenerator from './BillingReportGenerator';

interface BillingDashboardProps {
  hospitalId: string;
}

const BillingDashboard = ({ hospitalId }: BillingDashboardProps) => {
  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-white virtualis-gradient-text">
            Enhanced Revenue Cycle Management
          </h1>
          <p className="text-white/80 text-lg">
            AI-powered billing optimization with predictive analytics and automated workflows
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="virtualis-card">
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

          <Card className="virtualis-card">
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

          <Card className="virtualis-card">
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

          <Card className="virtualis-card">
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
          <TabsList className="grid w-full grid-cols-5 virtualis-card">
            <TabsTrigger 
              value="analytics" 
              className="data-[state=active]:bg-white/20 text-white"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </TabsTrigger>
            <TabsTrigger 
              value="reports"
              className="data-[state=active]:bg-white/20 text-white"
            >
              <FileText className="h-4 w-4 mr-2" />
              Reports
            </TabsTrigger>
            <TabsTrigger 
              value="denials"
              className="data-[state=active]:bg-white/20 text-white"
            >
              <AlertTriangle className="h-4 w-4 mr-2" />
              Denials
            </TabsTrigger>
            <TabsTrigger 
              value="prior-auth"
              className="data-[state=active]:bg-white/20 text-white"
            >
              <Shield className="h-4 w-4 mr-2" />
              Prior Auth
            </TabsTrigger>
            <TabsTrigger 
              value="roi-calculator"
              className="data-[state=active]:bg-white/20 text-white"
            >
              <Calculator className="h-4 w-4 mr-2" />
              ROI Calculator
            </TabsTrigger>
          </TabsList>

          <TabsContent value="analytics" className="mt-6">
            <RevenueAnalytics hospitalId={hospitalId} />
          </TabsContent>

          <TabsContent value="reports" className="mt-6">
            <BillingReportGenerator hospitalId={hospitalId} />
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
