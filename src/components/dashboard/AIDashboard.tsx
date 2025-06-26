
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, Users, FileText, Code, Stethoscope, DollarSign, Shield, Activity } from 'lucide-react';
import MedicalCodingAssistant from '@/components/ai/MedicalCodingAssistant';
import DiagnosisSupport from '@/components/ai/DiagnosisSupport';

interface AIDashboardProps {
  user: any;
}

const AIDashboard = ({ user }: AIDashboardProps) => {
  const [activeTab, setActiveTab] = useState('clinical');

  const aiFeatures = {
    clinical: [
      { name: 'Clinical Documentation', icon: FileText, description: 'AI-powered SOAP notes and medical records' },
      { name: 'Differential Diagnosis', icon: Stethoscope, description: 'Evidence-based diagnostic suggestions' },
      { name: 'Drug Interaction Check', icon: Shield, description: 'Medication safety and dosing guidance' },
      { name: 'Care Plan Generation', icon: Activity, description: 'Personalized treatment protocols' }
    ],
    coding: [
      { name: 'ICD-10 Coding', icon: Code, description: 'Automated diagnosis code suggestions' },
      { name: 'CPT Coding', icon: DollarSign, description: 'Procedure code recommendations' },
      { name: 'Claims Review', icon: FileText, description: 'Pre-submission claim validation' },
      { name: 'Audit Preparation', icon: Shield, description: 'Compliance and quality checks' }
    ],
    nursing: [
      { name: 'Nursing Assessment', icon: Users, description: 'AI-assisted patient assessments' },
      { name: 'Care Plans', icon: Activity, description: 'NANDA-based nursing diagnoses' },
      { name: 'Risk Assessment', icon: Shield, description: 'Fall risk and safety evaluations' },
      { name: 'Medication Admin', icon: FileText, description: 'Double-check protocols and alerts' }
    ],
    administrative: [
      { name: 'Resource Planning', icon: Users, description: 'Staff scheduling optimization' },
      { name: 'Quality Metrics', icon: Activity, description: 'Performance analytics and insights' },
      { name: 'Compliance Monitor', icon: Shield, description: 'Regulatory requirement tracking' },
      { name: 'Financial Analytics', icon: DollarSign, description: 'Revenue cycle optimization' }
    ]
  };

  return (
    <div className="p-6 space-y-8 bg-[#0a1628] min-h-screen">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3 mb-6">
          <Brain className="h-12 w-12 text-virtualis-gold animate-pulse" />
          <div>
            <h1 className="text-4xl font-bold gradient-text tech-font">
              AI Healthcare Assistant
            </h1>
            <p className="text-white/80 text-lg tech-font">
              Intelligent Clinical Support for Every Healthcare Role
            </p>
          </div>
        </div>
        
        <div className="flex items-center justify-center gap-4">
          <Badge className="glass-badge success">
            <Brain className="h-3 w-3 mr-1" />
            GPT-4 Powered
          </Badge>
          <Badge className="glass-badge primary">
            <Shield className="h-3 w-3 mr-1" />
            HIPAA Compliant
          </Badge>
          <Badge className="glass-badge warning">
            <Activity className="h-3 w-3 mr-1" />
            Clinical Decision Support
          </Badge>
        </div>
      </div>

      {/* AI Features Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 glass-card">
          <TabsTrigger value="clinical" className="text-white">
            <Stethoscope className="h-4 w-4 mr-2" />
            Clinical
          </TabsTrigger>
          <TabsTrigger value="coding" className="text-white">
            <Code className="h-4 w-4 mr-2" />
            Coding & Billing
          </TabsTrigger>
          <TabsTrigger value="nursing" className="text-white">
            <Users className="h-4 w-4 mr-2" />
            Nursing
          </TabsTrigger>
          <TabsTrigger value="administrative" className="text-white">
            <Activity className="h-4 w-4 mr-2" />
            Administrative
          </TabsTrigger>
        </TabsList>

        <TabsContent value="clinical" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DiagnosisSupport />
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-400" />
                  Clinical Documentation AI
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-white/70">
                  Generate comprehensive SOAP notes, discharge summaries, and clinical documentation using AI.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {aiFeatures.clinical.map((feature) => (
                    <div key={feature.name} className="p-3 glass-nav-item rounded-lg">
                      <feature.icon className="h-5 w-5 text-virtualis-gold mb-2" />
                      <h4 className="text-white font-medium text-sm">{feature.name}</h4>
                      <p className="text-white/60 text-xs">{feature.description}</p>
                    </div>
                  ))}
                </div>
                <Button className="w-full glass-button">
                  <Brain className="h-4 w-4 mr-2" />
                  Access Clinical AI Tools
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="coding" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <MedicalCodingAssistant />
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-green-400" />
                  Revenue Cycle AI
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-white/70">
                  Optimize coding accuracy and maximize reimbursement with AI-powered analysis.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {aiFeatures.coding.map((feature) => (
                    <div key={feature.name} className="p-3 glass-nav-item rounded-lg">
                      <feature.icon className="h-5 w-5 text-virtualis-gold mb-2" />
                      <h4 className="text-white font-medium text-sm">{feature.name}</h4>
                      <p className="text-white/60 text-xs">{feature.description}</p>
                    </div>
                  ))}
                </div>
                <Button className="w-full glass-button">
                  <Code className="h-4 w-4 mr-2" />
                  Launch Coding Assistant
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="nursing" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Users className="h-5 w-5 text-purple-400" />
                  Nursing Care AI
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-white/70">
                  AI-powered nursing assessments, care plans, and safety protocols.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {aiFeatures.nursing.map((feature) => (
                    <div key={feature.name} className="p-3 glass-nav-item rounded-lg">
                      <feature.icon className="h-5 w-5 text-virtualis-gold mb-2" />
                      <h4 className="text-white font-medium text-sm">{feature.name}</h4>
                      <p className="text-white/60 text-xs">{feature.description}</p>
                    </div>
                  ))}
                </div>
                <Button className="w-full glass-button">
                  <Activity className="h-4 w-4 mr-2" />
                  Access Nursing AI Tools
                </Button>
              </CardContent>
            </Card>
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-white">Patient Safety AI</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-center p-4 glass-nav-item">
                    <div className="text-green-400 text-2xl font-bold">98.7%</div>
                    <div className="text-white/70 text-sm">Safety Score</div>
                  </div>
                  <div className="text-center p-4 glass-nav-item">
                    <div className="text-yellow-400 text-2xl font-bold">23</div>
                    <div className="text-white/70 text-sm">Risk Alerts Today</div>
                  </div>
                  <div className="text-center p-4 glass-nav-item">
                    <div className="text-purple-400 text-2xl font-bold">156</div>
                    <div className="text-white/70 text-sm">Care Plans Generated</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="administrative" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Activity className="h-5 w-5 text-orange-400" />
                  Administrative AI
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-white/70">
                  Optimize operations, compliance, and resource management with AI insights.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {aiFeatures.administrative.map((feature) => (
                    <div key={feature.name} className="p-3 glass-nav-item rounded-lg">
                      <feature.icon className="h-5 w-5 text-virtualis-gold mb-2" />
                      <h4 className="text-white font-medium text-sm">{feature.name}</h4>
                      <p className="text-white/60 text-xs">{feature.description}</p>
                    </div>
                  ))}
                </div>
                <Button className="w-full glass-button">
                  <Brain className="h-4 w-4 mr-2" />
                  Launch Admin AI Suite
                </Button>
              </CardContent>
            </Card>
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-white">Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-center p-4 glass-nav-item">
                    <div className="text-green-400 text-2xl font-bold">87%</div>
                    <div className="text-white/70 text-sm">Efficiency Gain</div>
                  </div>
                  <div className="text-center p-4 glass-nav-item">
                    <div className="text-blue-400 text-2xl font-bold">$2.4M</div>
                    <div className="text-white/70 text-sm">Cost Savings</div>
                  </div>
                  <div className="text-center p-4 glass-nav-item">
                    <div className="text-virtualis-gold text-2xl font-bold">99.1%</div>
                    <div className="text-white/70 text-sm">Compliance Rate</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AIDashboard;
