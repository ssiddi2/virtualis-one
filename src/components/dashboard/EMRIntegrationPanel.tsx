import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Database, Key, Link, TestTube, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import EMRConnectionSimulation from "./EMRConnectionSimulation";

interface Hospital {
  id: string;
  name: string;
  location: string;
  emr_type: string;
  is_connected: boolean;
}

interface EMRIntegrationPanelProps {
  hospital: Hospital;
  user: any;
  onBack: () => void;
  onSave: (data: any) => void;
}

const EMRIntegrationPanel = ({ hospital, user, onBack, onSave }: EMRIntegrationPanelProps) => {
  const { toast } = useToast();
  const [showSimulation, setShowSimulation] = useState(false);
  const [formData, setFormData] = useState({
    emr_type: hospital.emr_type || '',
    api_endpoint: '',
    auth_token: '',
    client_id: '',
    client_secret: '',
    fhir_endpoint: '',
    username: '',
    password: '',
    organization_id: '',
    additional_config: ''
  });
  const [testResult, setTestResult] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');

  const emrTypes = [
    'Epic',
    'Cerner',
    'Meditech',
    'Allscripts',
    'VistA',
    'FHIR API',
    'HL7 MLLP',
    'CSV Import',
    'Custom API'
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTestConnection = async () => {
    // Show simulation instead of actual connection
    setShowSimulation(true);
  };

  const handleSimulationComplete = () => {
    setShowSimulation(false);
    setTestResult('success');
    
    toast({
      title: "Healthcare Simulation Complete",
      description: "EMR integration simulation completed successfully",
    });
  };

  const handleSave = () => {
    onSave({
      hospital_id: hospital.id,
      ...formData,
      status: testResult === 'success' ? 'simulated' : 'pending',
      last_updated: new Date().toISOString()
    });
    
    toast({
      title: "Configuration Saved",
      description: `EMR simulation setup for ${hospital.name} has been configured`,
    });
  };

  const getEmrFields = () => {
    switch (formData.emr_type) {
      case 'Epic':
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-white tech-font">Client ID</Label>
                <Input
                  value={formData.client_id}
                  onChange={(e) => handleInputChange('client_id', e.target.value)}
                  className="ai-input tech-font"
                  placeholder="Epic client identifier"
                />
              </div>
              <div>
                <Label className="text-white tech-font">Client Secret</Label>
                <Input
                  type="password"
                  value={formData.client_secret}
                  onChange={(e) => handleInputChange('client_secret', e.target.value)}
                  className="ai-input tech-font"
                  placeholder="Epic client secret"
                />
              </div>
            </div>
            <div>
              <Label className="text-white tech-font">FHIR R4 Endpoint</Label>
              <Input
                value={formData.fhir_endpoint}
                onChange={(e) => handleInputChange('fhir_endpoint', e.target.value)}
                className="ai-input tech-font"
                placeholder="https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/R4/"
              />
            </div>
          </>
        );
      
      case 'Cerner':
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-white tech-font">API Key</Label>
                <Input
                  value={formData.auth_token}
                  onChange={(e) => handleInputChange('auth_token', e.target.value)}
                  className="ai-input tech-font"
                  placeholder="Cerner API key"
                />
              </div>
              <div>
                <Label className="text-white tech-font">Organization ID</Label>
                <Input
                  value={formData.organization_id}
                  onChange={(e) => handleInputChange('organization_id', e.target.value)}
                  className="ai-input tech-font"
                  placeholder="Cerner organization identifier"
                />
              </div>
            </div>
            <div>
              <Label className="text-white tech-font">FHIR Endpoint</Label>
              <Input
                value={formData.fhir_endpoint}
                onChange={(e) => handleInputChange('fhir_endpoint', e.target.value)}
                className="ai-input tech-font"
                placeholder="https://fhir-open.cerner.com/r4/"
              />
            </div>
          </>
        );
      
      case 'FHIR API':
        return (
          <div>
            <Label className="text-white tech-font">FHIR Base URL</Label>
            <Input
              value={formData.fhir_endpoint}
              onChange={(e) => handleInputChange('fhir_endpoint', e.target.value)}
              className="ai-input tech-font"
              placeholder="https://your-fhir-server.com/fhir/"
            />
          </div>
        );
      
      default:
        return (
          <>
            <div>
              <Label className="text-white tech-font">API Endpoint</Label>
              <Input
                value={formData.api_endpoint}
                onChange={(e) => handleInputChange('api_endpoint', e.target.value)}
                className="ai-input tech-font"
                placeholder="https://api.emr-system.com/v1/"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-white tech-font">Username</Label>
                <Input
                  value={formData.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  className="ai-input tech-font"
                />
              </div>
              <div>
                <Label className="text-white tech-font">Password</Label>
                <Input
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="ai-input tech-font"
                />
              </div>
            </div>
          </>
        );
    }
  };

  return (
    <>
      <div className="p-6 space-y-6 min-h-screen">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            onClick={onBack}
            variant="ghost"
            className="text-white hover:bg-slate-800"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-white tech-font ai-text-glow">
              EMR SIMULATION CONSOLE
            </h1>
            <p className="text-virtualis-gold font-semibold tech-font">
              {hospital.name} • {hospital.location}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Configuration Form */}
          <div className="lg:col-span-2">
            <Card className="ai-card">
              <CardHeader>
                <CardTitle className="text-white tech-font flex items-center gap-2">
                  <Database className="h-5 w-5 text-virtualis-gold" />
                  HEALTHCARE SIMULATION CONFIG
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="text-white tech-font">EMR System Type</Label>
                  <Select value={formData.emr_type} onValueChange={(value) => handleInputChange('emr_type', value)}>
                    <SelectTrigger className="ai-input tech-font">
                      <SelectValue placeholder="Select EMR System" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-600">
                      {emrTypes.map((emr) => (
                        <SelectItem key={emr} value={emr}>{emr}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {getEmrFields()}

                <div className="flex gap-4">
                  <Button
                    onClick={handleTestConnection}
                    className="ai-button-secondary tech-font"
                  >
                    <TestTube className="h-4 w-4 mr-2" />
                    START SIMULATION
                  </Button>
                  
                  <Button
                    onClick={handleSave}
                    className="ai-button tech-font"
                  >
                    <Key className="h-4 w-4 mr-2" />
                    SAVE CONFIGURATION
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Status Panel */}
          <div className="space-y-6">
            <Card className="ai-card">
              <CardHeader>
                <CardTitle className="text-white tech-font">SIMULATION STATUS</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300 tech-font">Current Mode:</span>
                  <Badge className={
                    testResult === 'success' 
                      ? "bg-virtualis-alert-green/20 text-virtualis-alert-green border-virtualis-alert-green" 
                      : "bg-blue-500/20 text-blue-400 border-blue-500"
                  }>
                    {testResult === 'success' && <CheckCircle className="h-3 w-3 mr-1" />}
                    <Database className="h-3 w-3 mr-1" />
                    {testResult === 'success' ? 'SIMULATED' : 'DEMO MODE'}
                  </Badge>
                </div>
                
                <div className="text-sm text-slate-400 tech-font">
                  Last Updated: {new Date().toLocaleString()}
                </div>
                
                {testResult === 'success' && (
                  <div className="p-3 bg-virtualis-alert-green/10 border border-virtualis-alert-green/30 rounded-lg">
                    <p className="text-virtualis-alert-green text-sm tech-font">
                      ✓ Healthcare simulation ready
                      <br />
                      ✓ Clinical workflows active
                      <br />
                      ✓ Demo data accessible
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="ai-card">
              <CardHeader>
                <CardTitle className="text-white tech-font">SIMULATION FEATURES</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-300 tech-font">Patient Demo Data</span>
                  <Badge className="bg-virtualis-alert-green/20 text-virtualis-alert-green">Active</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-300 tech-font">Clinical Workflows</span>
                  <Badge className="bg-virtualis-alert-green/20 text-virtualis-alert-green">Active</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-300 tech-font">AI Healthcare Assistant</span>
                  <Badge className="bg-virtualis-alert-green/20 text-virtualis-alert-green">Active</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-300 tech-font">Real Integration</span>
                  <Badge className="bg-slate-500/20 text-slate-400">Demo Only</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {showSimulation && (
        <EMRConnectionSimulation
          hospitalName={hospital.name}
          emrType={formData.emr_type}
          onComplete={handleSimulationComplete}
        />
      )}
    </>
  );
};

export default EMRIntegrationPanel;
