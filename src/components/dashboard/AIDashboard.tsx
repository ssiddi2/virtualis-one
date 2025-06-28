import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, Users, FileText, Code, Stethoscope, DollarSign, Shield, Activity, Workflow } from 'lucide-react';
import MedicalCodingAssistant from '@/components/ai/MedicalCodingAssistant';
import DiagnosisSupport from '@/components/ai/DiagnosisSupport';
import AIInsightsDashboard from '@/components/ai/AIInsightsDashboard';
import AIWorkflowDashboard from '@/components/ai/AIWorkflowDashboard';
import { useHospitals } from '@/hooks/useHospitals';

interface AIDashboardProps {
  user: any;
  hospitalId?: string;
}

const AIDashboard = ({ user, hospitalId }: AIDashboardProps) => {
  const [activeTab, setActiveTab] = useState('workflow');
  const { data: hospitals } = useHospitals();
  
  const selectedHospital = hospitalId ? hospitals?.find(h => h.id === hospitalId) : null;

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
    ]
  };

  return (
    <div className="p-6 space-y-8 min-h-screen" style={{
      background: 'linear-gradient(135deg, hsl(225, 70%, 25%) 0%, hsl(220, 65%, 35%) 25%, hsl(215, 60%, 45%) 50%, hsl(210, 55%, 55%) 75%, hsl(205, 50%, 65%) 100%)'
    }}>
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3 mb-6">
          <Brain className="h-12 w-12 text-sky-300 animate-pulse" />
          <div>
            <h1 className="text-4xl font-bold text-white">
              AI Healthcare Assistant
            </h1>
            <p className="text-white/80 text-lg">
              {selectedHospital ? `${selectedHospital.name} - Clinical AI Intelligence` : 'Intelligent Clinical Support'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center justify-center gap-4">
          <Badge className="bg-green-500/20 text-green-200 border border-green-400/30">
            <Brain className="h-3 w-3 mr-1" />
            GPT-4 Powered
          </Badge>
          <Badge className="bg-blue-500/20 text-blue-200 border border-blue-400/30">
            <Shield className="h-3 w-3 mr-1" />
            HIPAA Compliant
          </Badge>
          <Badge className="bg-purple-500/20 text-purple-200 border border-purple-400/30">
            <Activity className="h-3 w-3 mr-1" />
            Clinical Decision Support
          </Badge>
          {selectedHospital && (
            <Badge className="bg-sky-500/20 text-sky-200 border border-sky-400/30">
              {selectedHospital.emr_type} Integration
            </Badge>
          )}
        </div>
      </div>

      {/* AI Features Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 backdrop-blur-xl bg-blue-500/20 border border-blue-300/30 rounded-xl">
          <TabsTrigger value="workflow" className="text-white data-[state=active]:bg-white/20">
            <Workflow className="h-4 w-4 mr-2" />
            Workflow Demo
          </TabsTrigger>
          <TabsTrigger value="insights" className="text-white data-[state=active]:bg-white/20">
            <Brain className="h-4 w-4 mr-2" />
            AI Insights
          </TabsTrigger>
          <TabsTrigger value="clinical" className="text-white data-[state=active]:bg-white/20">
            <Stethoscope className="h-4 w-4 mr-2" />
            Clinical AI
          </TabsTrigger>
          <TabsTrigger value="coding" className="text-white data-[state=active]:bg-white/20">
            <Code className="h-4 w-4 mr-2" />
            Coding & Billing
          </TabsTrigger>
          <TabsTrigger value="tools" className="text-white data-[state=active]:bg-white/20">
            <Activity className="h-4 w-4 mr-2" />
            AI Tools
          </TabsTrigger>
        </TabsList>

        <TabsContent value="workflow" className="space-y-6">
          <AIWorkflowDashboard hospitalId={hospitalId} />
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <AIInsightsDashboard 
            hospitalId={hospitalId} 
            hospitalName={selectedHospital?.name}
          />
        </TabsContent>

        <TabsContent value="clinical" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DiagnosisSupport />
            <Card className="backdrop-blur-xl bg-blue-500/20 border border-blue-300/30 rounded-xl shadow-lg">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <FileText className="h-5 w-5 text-sky-300" />
                  Clinical Documentation AI
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-white/70">
                  Generate comprehensive SOAP notes, discharge summaries, and clinical documentation using AI.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {aiFeatures.clinical.map((feature) => (
                    <div key={feature.name} className="p-3 virtualis-card rounded-lg">
                      <feature.icon className="h-5 w-5 text-sky-300 mb-2" />
                      <h4 className="text-white font-medium text-sm">{feature.name}</h4>
                      <p className="text-white/60 text-xs">{feature.description}</p>
                    </div>
                  ))}
                </div>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-xl transition-all duration-300">
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
            <Card className="virtualis-card">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-green-300" />
                  Revenue Cycle AI
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-white/70">
                  Optimize coding accuracy and maximize reimbursement with AI-powered analysis.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {aiFeatures.coding.map((feature) => (
                    <div key={feature.name} className="p-3 virtualis-card rounded-lg">
                      <feature.icon className="h-5 w-5 text-sky-300 mb-2" />
                      <h4 className="text-white font-medium text-sm">{feature.name}</h4>
                      <p className="text-white/60 text-xs">{feature.description}</p>
                    </div>
                  ))}
                </div>
                <Button className="w-full virtualis-button">
                  <Code className="h-4 w-4 mr-2" />
                  Launch Coding Assistant
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="tools" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="virtualis-card">
              <CardHeader>
                <CardTitle className="text-white">Clinical Decision Support</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-center p-4 virtualis-card">
                    <div className="text-green-300 text-2xl font-bold">98.7%</div>
                    <div className="text-white/70 text-sm">Accuracy Rate</div>
                  </div>
                  <Button className="w-full virtualis-button">
                    <Brain className="h-4 w-4 mr-2" />
                    Launch Assistant
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="virtualis-card">
              <CardHeader>
                <CardTitle className="text-white">Drug Safety</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-center p-4 virtualis-card">
                    <div className="text-blue-300 text-2xl font-bold">23</div>
                    <div className="text-white/70 text-sm">Alerts Today</div>
                  </div>
                  <Button className="w-full virtualis-button">
                    <Shield className="h-4 w-4 mr-2" />
                    Check Interactions
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="virtualis-card">
              <CardHeader>
                <CardTitle className="text-white">Quality Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-center p-4 virtualis-card">
                    <div className="text-sky-300 text-2xl font-bold">94%</div>
                    <div className="text-white/70 text-sm">Compliance Score</div>
                  </div>
                  <Button className="w-full virtualis-button">
                    <Activity className="h-4 w-4 mr-2" />
                    View Metrics
                  </Button>
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
