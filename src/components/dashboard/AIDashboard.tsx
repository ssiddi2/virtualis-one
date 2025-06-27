
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, Users, FileText, Code, Stethoscope, DollarSign, Shield, Activity } from 'lucide-react';
import MedicalCodingAssistant from '@/components/ai/MedicalCodingAssistant';
import DiagnosisSupport from '@/components/ai/DiagnosisSupport';
import AIInsightsDashboard from '@/components/ai/AIInsightsDashboard';
import { useHospitals } from '@/hooks/useHospitals';

interface AIDashboardProps {
  user: any;
  hospitalId?: string;
}

const AIDashboard = ({ user, hospitalId }: AIDashboardProps) => {
  const [activeTab, setActiveTab] = useState('insights');
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
    <div className="p-6 space-y-8 bg-gradient-to-br from-blue-50 to-sky-100 min-h-screen">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3 mb-6">
          <Brain className="h-12 w-12 text-blue-600 animate-pulse" />
          <div>
            <h1 className="text-4xl font-bold gradient-text tech-font">
              AI Healthcare Assistant
            </h1>
            <p className="text-slate-700 text-lg tech-font">
              {selectedHospital ? `${selectedHospital.name} - Clinical AI Intelligence` : 'Intelligent Clinical Support'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center justify-center gap-4">
          <Badge className="glass-badge success bg-green-100/80 border-green-300/60 text-green-700">
            <Brain className="h-3 w-3 mr-1" />
            GPT-4 Powered
          </Badge>
          <Badge className="glass-badge primary bg-blue-100/80 border-blue-300/60 text-blue-700">
            <Shield className="h-3 w-3 mr-1" />
            HIPAA Compliant
          </Badge>
          <Badge className="glass-badge warning bg-amber-100/80 border-amber-300/60 text-amber-700">
            <Activity className="h-3 w-3 mr-1" />
            Clinical Decision Support
          </Badge>
          {selectedHospital && (
            <Badge className="glass-badge bg-purple-100/80 border-purple-300/60 text-purple-700">
              {selectedHospital.emr_type} Integration
            </Badge>
          )}
        </div>
      </div>

      {/* AI Features Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 glass-card bg-white/80 border-blue-200/60 shadow-lg">
          <TabsTrigger value="insights" className="text-slate-700 data-[state=active]:bg-blue-100/80 data-[state=active]:text-blue-700">
            <Brain className="h-4 w-4 mr-2" />
            AI Insights
          </TabsTrigger>
          <TabsTrigger value="clinical" className="text-slate-700 data-[state=active]:bg-blue-100/80 data-[state=active]:text-blue-700">
            <Stethoscope className="h-4 w-4 mr-2" />
            Clinical AI
          </TabsTrigger>
          <TabsTrigger value="coding" className="text-slate-700 data-[state=active]:bg-blue-100/80 data-[state=active]:text-blue-700">
            <Code className="h-4 w-4 mr-2" />
            Coding & Billing
          </TabsTrigger>
          <TabsTrigger value="tools" className="text-slate-700 data-[state=active]:bg-blue-100/80 data-[state=active]:text-blue-700">
            <Activity className="h-4 w-4 mr-2" />
            AI Tools
          </TabsTrigger>
        </TabsList>

        <TabsContent value="insights" className="space-y-6">
          <AIInsightsDashboard 
            hospitalId={hospitalId} 
            hospitalName={selectedHospital?.name}
          />
        </TabsContent>

        <TabsContent value="clinical" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DiagnosisSupport />
            <Card className="glass-card bg-white/80 border-blue-200/60 shadow-lg">
              <CardHeader>
                <CardTitle className="text-slate-800 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-500" />
                  Clinical Documentation AI
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-slate-600">
                  Generate comprehensive SOAP notes, discharge summaries, and clinical documentation using AI.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {aiFeatures.clinical.map((feature) => (
                    <div key={feature.name} className="p-3 glass-nav-item rounded-lg bg-white/50 border-blue-200/40 shadow-sm">
                      <feature.icon className="h-5 w-5 text-blue-600 mb-2" />
                      <h4 className="text-slate-800 font-medium text-sm">{feature.name}</h4>
                      <p className="text-slate-600 text-xs">{feature.description}</p>
                    </div>
                  ))}
                </div>
                <Button className="w-full glass-button bg-blue-600 hover:bg-blue-700 text-white shadow-md">
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
            <Card className="glass-card bg-white/80 border-blue-200/60 shadow-lg">
              <CardHeader>
                <CardTitle className="text-slate-800 flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-green-500" />
                  Revenue Cycle AI
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-slate-600">
                  Optimize coding accuracy and maximize reimbursement with AI-powered analysis.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {aiFeatures.coding.map((feature) => (
                    <div key={feature.name} className="p-3 glass-nav-item rounded-lg bg-white/50 border-blue-200/40 shadow-sm">
                      <feature.icon className="h-5 w-5 text-blue-600 mb-2" />
                      <h4 className="text-slate-800 font-medium text-sm">{feature.name}</h4>
                      <p className="text-slate-600 text-xs">{feature.description}</p>
                    </div>
                  ))}
                </div>
                <Button className="w-full glass-button bg-blue-600 hover:bg-blue-700 text-white shadow-md">
                  <Code className="h-4 w-4 mr-2" />
                  Launch Coding Assistant
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="tools" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="glass-card bg-white/80 border-blue-200/60 shadow-lg">
              <CardHeader>
                <CardTitle className="text-slate-800">Clinical Decision Support</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-center p-4 glass-nav-item bg-white/50 border-blue-200/40 shadow-sm">
                    <div className="text-green-600 text-2xl font-bold">98.7%</div>
                    <div className="text-slate-600 text-sm">Accuracy Rate</div>
                  </div>
                  <Button className="w-full glass-button bg-blue-600 hover:bg-blue-700 text-white shadow-md">
                    <Brain className="h-4 w-4 mr-2" />
                    Launch Assistant
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card bg-white/80 border-blue-200/60 shadow-lg">
              <CardHeader>
                <CardTitle className="text-slate-800">Drug Safety</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-center p-4 glass-nav-item bg-white/50 border-blue-200/40 shadow-sm">
                    <div className="text-amber-600 text-2xl font-bold">23</div>
                    <div className="text-slate-600 text-sm">Alerts Today</div>
                  </div>
                  <Button className="w-full glass-button bg-blue-600 hover:bg-blue-700 text-white shadow-md">
                    <Shield className="h-4 w-4 mr-2" />
                    Check Interactions
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card bg-white/80 border-blue-200/60 shadow-lg">
              <CardHeader>
                <CardTitle className="text-slate-800">Quality Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-center p-4 glass-nav-item bg-white/50 border-blue-200/40 shadow-sm">
                    <div className="text-blue-600 text-2xl font-bold">94%</div>
                    <div className="text-slate-600 text-sm">Compliance Score</div>
                  </div>
                  <Button className="w-full glass-button bg-blue-600 hover:bg-blue-700 text-white shadow-md">
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
