
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
              {selectedHospital ? `${selectedHospital.name} - Clinical AI Intelligence` : 'Intelligent Clinical Support'}
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
          {selectedHospital && (
            <Badge className="glass-badge info">
              {selectedHospital.emr_type} Integration
            </Badge>
          )}
        </div>
      </div>

      {/* AI Features Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 glass-card">
          <TabsTrigger value="insights" className="text-white">
            <Brain className="h-4 w-4 mr-2" />
            AI Insights
          </TabsTrigger>
          <TabsTrigger value="clinical" className="text-white">
            <Stethoscope className="h-4 w-4 mr-2" />
            Clinical AI
          </TabsTrigger>
          <TabsTrigger value="coding" className="text-white">
            <Code className="h-4 w-4 mr-2" />
            Coding & Billing
          </TabsTrigger>
          <TabsTrigger value="tools" className="text-white">
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

        <TabsContent value="tools" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-white">Clinical Decision Support</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-center p-4 glass-nav-item">
                    <div className="text-green-400 text-2xl font-bold">98.7%</div>
                    <div className="text-white/70 text-sm">Accuracy Rate</div>
                  </div>
                  <Button className="w-full glass-button">
                    <Brain className="h-4 w-4 mr-2" />
                    Launch Assistant
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-white">Drug Safety</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-center p-4 glass-nav-item">
                    <div className="text-yellow-400 text-2xl font-bold">23</div>
                    <div className="text-white/70 text-sm">Alerts Today</div>
                  </div>
                  <Button className="w-full glass-button">
                    <Shield className="h-4 w-4 mr-2" />
                    Check Interactions
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-white">Quality Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-center p-4 glass-nav-item">
                    <div className="text-blue-400 text-2xl font-bold">94%</div>
                    <div className="text-white/70 text-sm">Compliance Score</div>
                  </div>
                  <Button className="w-full glass-button">
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
