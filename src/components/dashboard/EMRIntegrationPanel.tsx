
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
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-white text-sm">Client ID</Label>
                <Input
                  value={formData.client_id}
                  onChange={(e) => handleInputChange('client_id', e.target.value)}
                  className="bg-blue-500/10 border-blue-400/30 text-white text-sm h-9"
                  placeholder="Epic client identifier"
                />
              </div>
              <div>
                <Label className="text-white text-sm">Client Secret</Label>
                <Input
                  type="password"
                  value={formData.client_secret}
                  onChange={(e) => handleInputChange('client_secret', e.target.value)}
                  className="bg-blue-500/10 border-blue-400/30 text-white text-sm h-9"
                  placeholder="Epic client secret"
                />
              </div>
            </div>
            <div>
              <Label className="text-white text-sm">FHIR R4 Endpoint</Label>
              <Input
                value={formData.fhir_endpoint}
                onChange={(e) => handleInputChange('fhir_endpoint', e.target.value)}
                className="bg-blue-500/10 border-blue-400/30 text-white text-sm h-9"
                placeholder="https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/R4/"
              />
            </div>
          </>
        );
      
      case 'Cerner':
        return (
          <>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-white text-sm">API Key</Label>
                <Input
                  value={formData.auth_token}
                  onChange={(e) => handleInputChange('auth_token', e.target.value)}
                  className="bg-blue-500/10 border-blue-400/30 text-white text-sm h-9"
                  placeholder="Cerner API key"
                />
              </div>
              <div>
                <Label className="text-white text-sm">Organization ID</Label>
                <Input
                  value={formData.organization_id}
                  onChange={(e) => handleInputChange('organization_id', e.target.value)}
                  className="bg-blue-500/10 border-blue-400/30 text-white text-sm h-9"
                  placeholder="Cerner organization identifier"
                />
              </div>
            </div>
            <div>
              <Label className="text-white text-sm">FHIR Endpoint</Label>
              <Input
                value={formData.fhir_endpoint}
                onChange={(e) => handleInputChange('fhir_endpoint', e.target.value)}
                className="bg-blue-500/10 border-blue-400/30 text-white text-sm h-9"
                placeholder="https://fhir-open.cerner.com/r4/"
              />
            </div>
          </>
        );
      
      default:
        return (
          <>
            <div>
              <Label className="text-white text-sm">API Endpoint</Label>
              <Input
                value={formData.api_endpoint}
                onChange={(e) => handleInputChange('api_endpoint', e.target.value)}
                className="bg-blue-500/10 border-blue-400/30 text-white text-sm h-9"
                placeholder="https://api.emr-system.com/v1/"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-white text-sm">Username</Label>
                <Input
                  value={formData.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  className="bg-blue-500/10 border-blue-400/30 text-white text-sm h-9"
                />
              </div>
              <div>
                <Label className="text-white text-sm">Password</Label>
                <Input
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="bg-blue-500/10 border-blue-400/30 text-white text-sm h-9"
                />
              </div>
            </div>
          </>
        );
    }
  };

  return (
    <>
      <div className="p-4 space-y-4 min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <div className="flex items-center gap-3">
          <Button
            onClick={onBack}
            variant="ghost"
            size="sm"
            className="text-white hover:bg-blue-800/50"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-white">
              EMR SIMULATION CONSOLE
            </h1>
            <p className="text-blue-200 text-sm">
              {hospital.name} • {hospital.location}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 max-w-6xl">
          <div className="lg:col-span-2">
            <Card className="bg-blue-900/40 backdrop-blur-xl border-blue-400/30 shadow-xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-white flex items-center gap-2 text-lg">
                  <Database className="h-5 w-5 text-blue-300" />
                  HEALTHCARE SIMULATION CONFIG
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-white text-sm">EMR System Type</Label>
                  <Select value={formData.emr_type} onValueChange={(value) => handleInputChange('emr_type', value)}>
                    <SelectTrigger className="bg-blue-500/10 border-blue-400/30 text-white h-9">
                      <SelectValue placeholder="Select EMR System" />
                    </SelectTrigger>
                    <SelectContent className="bg-blue-900 border-blue-400/30">
                      {emrTypes.map((emr) => (
                        <SelectItem key={emr} value={emr} className="text-white focus:bg-blue-800">{emr}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {getEmrFields()}

                <div className="flex gap-3 pt-2">
                  <Button
                    onClick={handleTestConnection}
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <TestTube className="h-4 w-4 mr-2" />
                    START SIMULATION
                  </Button>
                  
                  <Button
                    onClick={handleSave}
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Key className="h-4 w-4 mr-2" />
                    SAVE CONFIG
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <Card className="bg-blue-900/40 backdrop-blur-xl border-blue-400/30 shadow-xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-lg">SIMULATION STATUS</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-blue-200 text-sm">Current Mode:</span>
                  <Badge className={
                    testResult === 'success' 
                      ? "bg-green-500/20 text-green-300 border-green-400/30" 
                      : "bg-blue-500/20 text-blue-300 border-blue-400/30"
                  }>
                    {testResult === 'success' && <CheckCircle className="h-3 w-3 mr-1" />}
                    <Database className="h-3 w-3 mr-1" />
                    {testResult === 'success' ? 'SIMULATED' : 'DEMO MODE'}
                  </Badge>
                </div>
                
                <div className="text-xs text-blue-300">
                  Last Updated: {new Date().toLocaleString()}
                </div>
                
                {testResult === 'success' && (
                  <div className="p-3 bg-green-500/10 border border-green-400/30 rounded-lg">
                    <p className="text-green-300 text-xs">
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

            <Card className="bg-blue-900/40 backdrop-blur-xl border-blue-400/30 shadow-xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-lg">SIMULATION FEATURES</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-blue-200">Patient Demo Data</span>
                  <Badge className="bg-green-500/20 text-green-300 border-green-400/30 text-xs">Active</Badge>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-blue-200">Clinical Workflows</span>
                  <Badge className="bg-green-500/20 text-green-300 border-green-400/30 text-xs">Active</Badge>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-blue-200">AI Healthcare Assistant</span>
                  <Badge className="bg-green-500/20 text-green-300 border-green-400/30 text-xs">Active</Badge>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-blue-200">Real Integration</span>
                  <Badge className="bg-blue-500/20 text-blue-300 border-blue-400/30 text-xs">Demo Only</Badge>
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
