
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
            <div className="grid grid-cols-2 gap-1">
              <div>
                <Label className="text-white text-[10px]">Client ID</Label>
                <Input
                  value={formData.client_id}
                  onChange={(e) => handleInputChange('client_id', e.target.value)}
                  className="bg-white/10 border-white/30 text-white text-[10px] h-6 px-2"
                  placeholder="Epic client ID"
                />
              </div>
              <div>
                <Label className="text-white text-[10px]">Client Secret</Label>
                <Input
                  type="password"
                  value={formData.client_secret}
                  onChange={(e) => handleInputChange('client_secret', e.target.value)}
                  className="bg-white/10 border-white/30 text-white text-[10px] h-6 px-2"
                />
              </div>
            </div>
            <div>
              <Label className="text-white text-[10px]">FHIR Endpoint</Label>
              <Input
                value={formData.fhir_endpoint}
                onChange={(e) => handleInputChange('fhir_endpoint', e.target.value)}
                className="bg-white/10 border-white/30 text-white text-[10px] h-6 px-2"
                placeholder="https://fhir.epic.com/..."
              />
            </div>
          </>
        );
      
      case 'Cerner':
        return (
          <>
            <div className="grid grid-cols-2 gap-1">
              <div>
                <Label className="text-white text-[10px]">API Key</Label>
                <Input
                  value={formData.auth_token}
                  onChange={(e) => handleInputChange('auth_token', e.target.value)}
                  className="bg-white/10 border-white/30 text-white text-[10px] h-6 px-2"
                />
              </div>
              <div>
                <Label className="text-white text-[10px]">Organization ID</Label>
                <Input
                  value={formData.organization_id}
                  onChange={(e) => handleInputChange('organization_id', e.target.value)}
                  className="bg-white/10 border-white/30 text-white text-[10px] h-6 px-2"
                />
              </div>
            </div>
            <div>
              <Label className="text-white text-[10px]">FHIR Endpoint</Label>
              <Input
                value={formData.fhir_endpoint}
                onChange={(e) => handleInputChange('fhir_endpoint', e.target.value)}
                className="bg-white/10 border-white/30 text-white text-[10px] h-6 px-2"
                placeholder="https://fhir-open.cerner.com/..."
              />
            </div>
          </>
        );
      
      default:
        return (
          <>
            <div>
              <Label className="text-white text-[10px]">API Endpoint</Label>
              <Input
                value={formData.api_endpoint}
                onChange={(e) => handleInputChange('api_endpoint', e.target.value)}
                className="bg-white/10 border-white/30 text-white text-[10px] h-6 px-2"
                placeholder="https://api.healthcare-system.com/"
              />
            </div>
            <div className="grid grid-cols-2 gap-1">
              <div>
                <Label className="text-white text-[10px]">Username</Label>
                <Input
                  value={formData.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  className="bg-white/10 border-white/30 text-white text-[10px] h-6 px-2"
                />
              </div>
              <div>
                <Label className="text-white text-[10px]">Password</Label>
                <Input
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="bg-white/10 border-white/30 text-white text-[10px] h-6 px-2"
                />
              </div>
            </div>
          </>
        );
    }
  };

  return (
    <>
      <div className="p-2 space-y-2 min-h-screen" style={{
        background: 'linear-gradient(135deg, hsl(225, 70%, 25%) 0%, hsl(220, 65%, 35%) 25%, hsl(215, 60%, 45%) 50%, hsl(210, 55%, 55%) 75%, hsl(205, 50%, 65%) 100%)'
      }}>
        <div className="flex items-center gap-2">
          <Button
            onClick={onBack}
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20 text-xs h-6 px-2"
          >
            <ArrowLeft className="h-3 w-3 mr-1" />
            Back
          </Button>
          <div>
            <h1 className="text-sm font-bold text-white">
              Healthcare System Integration
            </h1>
            <p className="text-white/70 text-[10px]">
              {hospital.name} • {hospital.location}
            </p>
          </div>
        </div>

        <div className="max-w-xs mx-auto">
          <Card className="backdrop-blur-xl bg-white/10 border border-white/30 shadow-xl rounded-lg">
            <CardHeader className="pb-1 px-3 pt-2">
              <CardTitle className="text-white flex items-center gap-2 text-xs">
                <Database className="h-3 w-3 text-white" />
                Clinical System Integration
                {testResult === 'success' && (
                  <Badge className="bg-green-500/30 text-green-300 border-green-400/40 text-[10px] ml-auto px-1 py-0">
                    <CheckCircle className="h-2 w-2 mr-1" />
                    Connected
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 pt-0 px-3 pb-3">
              <div>
                <Label className="text-white text-[10px]">Healthcare System Type</Label>
                <Select value={formData.emr_type} onValueChange={(value) => handleInputChange('emr_type', value)}>
                  <SelectTrigger className="bg-white/10 border-white/30 text-white h-6 text-[10px] px-2">
                    <SelectValue placeholder="Select System Type" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-white/30">
                    {emrTypes.map((emr) => (
                      <SelectItem key={emr} value={emr} className="text-white focus:bg-white/20 text-[10px]">{emr}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {getEmrFields()}

              <div className="flex gap-1 pt-1">
                <Button
                  onClick={handleTestConnection}
                  size="sm"
                  className="bg-white/20 hover:bg-white/30 border border-white/30 text-white text-[10px] h-6 px-2"
                >
                  <TestTube className="h-2 w-2 mr-1" />
                  Test
                </Button>
                
                <Button
                  onClick={handleSave}
                  size="sm"
                  className="bg-white/20 hover:bg-white/30 border border-white/30 text-white text-[10px] h-6 px-2"
                >
                  <Key className="h-2 w-2 mr-1" />
                  Save
                </Button>
              </div>

              {testResult === 'success' && (
                <div className="p-1 bg-green-500/20 border border-green-400/40 rounded-md">
                  <p className="text-green-300 text-[10px] leading-tight">
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
