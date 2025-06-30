
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Database, Key, TestTube, CheckCircle } from "lucide-react";
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
      title: "Healthcare Integration Complete",
      description: "Clinical system connection established successfully",
    });
  };

  const handleSave = () => {
    onSave({
      hospital_id: hospital.id,
      ...formData,
      status: testResult === 'success' ? 'connected' : 'pending',
      last_updated: new Date().toISOString()
    });
    
    toast({
      title: "Configuration Saved",
      description: `Healthcare integration for ${hospital.name} configured`,
    });
  };

  const getEmrFields = () => {
    switch (formData.emr_type) {
      case 'Epic':
        return (
          <>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-white text-xs">Client ID</Label>
                <Input
                  value={formData.client_id}
                  onChange={(e) => handleInputChange('client_id', e.target.value)}
                  className="bg-blue-500/10 border-blue-400/30 text-white text-xs h-7"
                  placeholder="Epic client ID"
                />
              </div>
              <div>
                <Label className="text-white text-xs">Client Secret</Label>
                <Input
                  type="password"
                  value={formData.client_secret}
                  onChange={(e) => handleInputChange('client_secret', e.target.value)}
                  className="bg-blue-500/10 border-blue-400/30 text-white text-xs h-7"
                />
              </div>
            </div>
            <div>
              <Label className="text-white text-xs">FHIR Endpoint</Label>
              <Input
                value={formData.fhir_endpoint}
                onChange={(e) => handleInputChange('fhir_endpoint', e.target.value)}
                className="bg-blue-500/10 border-blue-400/30 text-white text-xs h-7"
                placeholder="https://fhir.epic.com/..."
              />
            </div>
          </>
        );
      
      case 'Cerner':
        return (
          <>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-white text-xs">API Key</Label>
                <Input
                  value={formData.auth_token}
                  onChange={(e) => handleInputChange('auth_token', e.target.value)}
                  className="bg-blue-500/10 border-blue-400/30 text-white text-xs h-7"
                />
              </div>
              <div>
                <Label className="text-white text-xs">Organization ID</Label>
                <Input
                  value={formData.organization_id}
                  onChange={(e) => handleInputChange('organization_id', e.target.value)}
                  className="bg-blue-500/10 border-blue-400/30 text-white text-xs h-7"
                />
              </div>
            </div>
            <div>
              <Label className="text-white text-xs">FHIR Endpoint</Label>
              <Input
                value={formData.fhir_endpoint}
                onChange={(e) => handleInputChange('fhir_endpoint', e.target.value)}
                className="bg-blue-500/10 border-blue-400/30 text-white text-xs h-7"
                placeholder="https://fhir-open.cerner.com/..."
              />
            </div>
          </>
        );
      
      default:
        return (
          <>
            <div>
              <Label className="text-white text-xs">API Endpoint</Label>
              <Input
                value={formData.api_endpoint}
                onChange={(e) => handleInputChange('api_endpoint', e.target.value)}
                className="bg-blue-500/10 border-blue-400/30 text-white text-xs h-7"
                placeholder="https://api.healthcare-system.com/"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-white text-xs">Username</Label>
                <Input
                  value={formData.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  className="bg-blue-500/10 border-blue-400/30 text-white text-xs h-7"
                />
              </div>
              <div>
                <Label className="text-white text-xs">Password</Label>
                <Input
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="bg-blue-500/10 border-blue-400/30 text-white text-xs h-7"
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

        <div className="max-w-2xl mx-auto">
          <Card className="bg-gradient-to-br from-blue-800/40 via-blue-700/30 to-blue-900/50 backdrop-blur-xl border-blue-400/40 shadow-xl">
            <CardHeader className="pb-3">
              <CardTitle className="text-white flex items-center gap-2 text-sm">
                <Database className="h-4 w-4 text-blue-300" />
                Clinical System Integration
                {testResult === 'success' && (
                  <Badge className="bg-green-500/30 text-green-300 border-green-400/40 text-xs ml-auto">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Connected
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label className="text-white text-xs">Healthcare System Type</Label>
                <Select value={formData.emr_type} onValueChange={(value) => handleInputChange('emr_type', value)}>
                  <SelectTrigger className="bg-blue-500/20 border-blue-400/40 text-white h-7 text-xs">
                    <SelectValue placeholder="Select System Type" />
                  </SelectTrigger>
                  <SelectContent className="bg-blue-900 border-blue-400/30">
                    {emrTypes.map((emr) => (
                      <SelectItem key={emr} value={emr} className="text-white focus:bg-blue-800 text-xs">{emr}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {getEmrFields()}

              <div className="flex gap-2 pt-2">
                <Button
                  onClick={handleTestConnection}
                  size="sm"
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-xs h-7"
                >
                  <TestTube className="h-3 w-3 mr-1" />
                  Test Connection
                </Button>
                
                <Button
                  onClick={handleSave}
                  size="sm"
                  className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white text-xs h-7"
                >
                  <Key className="h-3 w-3 mr-1" />
                  Save Configuration
                </Button>
              </div>

              {testResult === 'success' && (
                <div className="p-3 bg-green-500/20 border border-green-400/40 rounded-lg">
                  <p className="text-green-300 text-xs">
                    ✓ Clinical data integration active
                    <br />
                    ✓ Patient care workflows enabled
                    <br />
                    ✓ Real-time clinical updates available
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
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
