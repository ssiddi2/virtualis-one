
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
          <Brain className="h-12 w-12 text-white animate-pulse" />
          <div>
            <h1 className="text-4xl font-bold text-white">
              AI Healthcare Assistant
            </h1>
            <p className="text-white/80 text-lg">
              {selectedHospital ? `${selectedHospital.name} - Clinical AI Intelligence` : 'Advanced Documentation and Decision Support Platform'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <Badge className="backdrop-blur-sm bg-white/10 text-white border border-white/20">
            <Brain className="h-3 w-3 mr-1" />
            GPT-4 Powered
          </Badge>
          <Badge className="backdrop-blur-sm bg-white/10 text-white border border-white/20">
            <Shield className="h-3 w-3 mr-1" />
            HIPAA Compliant
          </Badge>
          <Badge className="backdrop-blur-sm bg-white/10 text-white border border-white/20">
            <Activity className="h-3 w-3 mr-1" />
            Clinical Decision Support
          </Badge>
          {selectedHospital && (
            <Badge className="backdrop-blur-sm bg-white/10 text-white border border-white/20">
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
                  <FileText className="h-5 w-5 text-white" />
                  Clinical Documentation AI
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-white/70">
                  Generate comprehensive SOAP notes, discharge summaries, and clinical documentation using AI.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {aiFeatures.clinical.map((feature) => (
                    <div key={feature.name} className="p-3 backdrop-blur-sm bg-blue-600/20 border border-blue-400/30 rounded-lg">
                      <feature.icon className="h-5 w-5 text-white mb-2" />
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
            <Card className="backdrop-blur-xl bg-blue-500/20 border border-blue-300/30 rounded-xl shadow-lg">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-white" />
                  Revenue Cycle AI
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-white/70">
                  Optimize coding accuracy and maximize reimbursement with AI-powered analysis.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {aiFeatures.coding.map((feature) => (
                    <div key={feature.name} className="p-3 backdrop-blur-sm bg-blue-600/20 border border-blue-400/30 rounded-lg">
                      <feature.icon className="h-5 w-5 text-white mb-2" />
                      <h4 className="text-white font-medium text-sm">{feature.name}</h4>
                      <p className="text-white/60 text-xs">{feature.description}</p>
                    </div>
                  ))}
                </div>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-xl transition-all duration-300">
                  <Code className="h-4 w-4 mr-2" />
                  Launch Coding Assistant
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="tools" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="backdrop-blur-xl bg-blue-500/20 border border-blue-300/30 rounded-xl shadow-lg">
              <CardHeader>
                <CardTitle className="text-white">Clinical Decision Support</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-center p-4 backdrop-blur-sm bg-blue-600/20 border border-blue-400/30 rounded-lg">
                    <div className="text-white text-2xl font-bold">98.7%</div>
                    <div className="text-white/70 text-sm">Accuracy Rate</div>
                  </div>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-xl transition-all duration-300">
                    <Brain className="h-4 w-4 mr-2" />
                    Launch Assistant
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-xl bg-blue-500/20 border border-blue-300/30 rounded-xl shadow-lg">
              <CardHeader>
                <CardTitle className="text-white">Drug Safety</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-center p-4 backdrop-blur-sm bg-blue-600/20 border border-blue-400/30 rounded-lg">
                    <div className="text-white text-2xl font-bold">23</div>
                    <div className="text-white/70 text-sm">Alerts Today</div>
                  </div>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-xl transition-all duration-300">
                    <Shield className="h-4 w-4 mr-2" />
                    Check Interactions
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-xl bg-blue-500/20 border border-blue-300/30 rounded-xl shadow-lg">
              <CardHeader>
                <CardTitle className="text-white">Quality Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-center p-4 backdrop-blur-sm bg-blue-600/20 border border-blue-400/30 rounded-lg">
                    <div className="text-white text-2xl font-bold">94%</div>
                    <div className="text-white/70 text-sm">Compliance Score</div>
                  </div>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-xl transition-all duration-300">
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
