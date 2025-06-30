
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
      <div className="p-3 space-y-3 min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
        <div className="flex items-center gap-2">
          <Button
            onClick={onBack}
            variant="ghost"
            size="sm"
            className="text-white hover:bg-blue-800/50 text-sm"
          >
            <ArrowLeft className="h-3 w-3 mr-1" />
            Back
          </Button>
          <div>
            <h1 className="text-lg font-bold text-white">
              Healthcare System Integration
            </h1>
            <p className="text-blue-200 text-xs">
              {hospital.name} • {hospital.location}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 max-w-5xl">
          <div className="lg:col-span-3">
            <Card className="bg-gradient-to-br from-blue-800/40 via-blue-700/30 to-blue-900/50 backdrop-blur-xl border-blue-400/40 shadow-xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-white flex items-center gap-2 text-base">
                  <Database className="h-4 w-4 text-blue-300" />
                  Clinical Data Integration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label className="text-white text-xs">Healthcare System Type</Label>
                  <Select value={formData.emr_type} onValueChange={(value) => handleInputChange('emr_type', value)}>
                    <SelectTrigger className="bg-blue-500/20 border-blue-400/40 text-white h-8 text-sm">
                      <SelectValue placeholder="Select System Type" />
                    </SelectTrigger>
                    <SelectContent className="bg-blue-900 border-blue-400/30">
                      {emrTypes.map((emr) => (
                        <SelectItem key={emr} value={emr} className="text-white focus:bg-blue-800 text-sm">{emr}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {getEmrFields()}

                <div className="flex gap-2 pt-2">
                  <Button
                    onClick={handleTestConnection}
                    size="sm"
                    className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-xs h-8"
                  >
                    <TestTube className="h-3 w-3 mr-1" />
                    Test Connection
                  </Button>
                  
                  <Button
                    onClick={handleSave}
                    size="sm"
                    className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white text-xs h-8"
                  >
                    <Key className="h-3 w-3 mr-1" />
                    Save Configuration
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-3">
            <Card className="bg-gradient-to-br from-blue-800/40 via-blue-700/30 to-blue-900/50 backdrop-blur-xl border-blue-400/40 shadow-xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-white text-sm">Integration Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-blue-200 text-xs">Connection:</span>
                  <Badge className={
                    testResult === 'success' 
                      ? "bg-green-500/30 text-green-300 border-green-400/40 text-xs" 
                      : "bg-blue-500/30 text-blue-300 border-blue-400/40 text-xs"
                  }>
                    {testResult === 'success' && <CheckCircle className="h-2 w-2 mr-1" />}
                    <Database className="h-2 w-2 mr-1" />
                    {testResult === 'success' ? 'Active' : 'Demo Mode'}
                  </Badge>
                </div>
                
                <div className="text-xs text-blue-300">
                  Updated: {new Date().toLocaleString()}
                </div>
                
                {testResult === 'success' && (
                  <div className="p-2 bg-green-500/20 border border-green-400/40 rounded-lg">
                    <p className="text-green-300 text-xs">
                      ✓ Healthcare system connected
                      <br />
                      ✓ Clinical workflows active
                      <br />
                      ✓ Patient data accessible
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-800/40 via-blue-700/30 to-blue-900/50 backdrop-blur-xl border-blue-400/40 shadow-xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-white text-sm">Clinical Features</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-blue-200">Patient Records</span>
                  <Badge className="bg-green-500/30 text-green-300 border-green-400/40 text-xs">Active</Badge>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-blue-200">Care Coordination</span>
                  <Badge className="bg-green-500/30 text-green-300 border-green-400/40 text-xs">Active</Badge>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-blue-200">Clinical Decision Support</span>
                  <Badge className="bg-green-500/30 text-green-300 border-green-400/40 text-xs">Active</Badge>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-blue-200">Live Integration</span>
                  <Badge className="bg-blue-500/30 text-blue-300 border-blue-400/40 text-xs">Demo</Badge>
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
