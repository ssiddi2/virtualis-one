
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Database, Key, Link, TestTube, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
    setTestResult('testing');
    
    // Simulate API test
    setTimeout(() => {
      const success = Math.random() > 0.3; // 70% success rate for demo
      setTestResult(success ? 'success' : 'error');
      
      toast({
        title: success ? "Connection Successful" : "Connection Failed",
        description: success 
          ? "EMR integration test completed successfully" 
          : "Unable to connect to EMR system. Check credentials.",
        variant: success ? "default" : "destructive"
      });
    }, 2000);
  };

  const handleSave = () => {
    onSave({
      hospital_id: hospital.id,
      ...formData,
      status: testResult === 'success' ? 'active' : 'pending',
      last_updated: new Date().toISOString()
    });
    
    toast({
      title: "Integration Saved",
      description: `EMR integration for ${hospital.name} has been configured`,
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
            EMR INTEGRATION CONSOLE
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
                NEURAL CONNECTION CONFIG
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

              <div>
                <Label className="text-white tech-font">Additional Configuration (JSON)</Label>
                <Textarea
                  value={formData.additional_config}
                  onChange={(e) => handleInputChange('additional_config', e.target.value)}
                  className="ai-input tech-font min-h-[100px]"
                  placeholder='{"timeout": 30, "retry_attempts": 3}'
                />
              </div>

              <div className="flex gap-4">
                <Button
                  onClick={handleTestConnection}
                  disabled={testResult === 'testing'}
                  className="ai-button-secondary tech-font"
                >
                  <TestTube className="h-4 w-4 mr-2" />
                  {testResult === 'testing' ? 'TESTING...' : 'TEST CONNECTION'}
                </Button>
                
                <Button
                  onClick={handleSave}
                  className="ai-button tech-font"
                >
                  <Key className="h-4 w-4 mr-2" />
                  SAVE INTEGRATION
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Status Panel */}
        <div className="space-y-6">
          <Card className="ai-card">
            <CardHeader>
              <CardTitle className="text-white tech-font">CONNECTION STATUS</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-slate-300 tech-font">Current Status:</span>
                <Badge className={
                  testResult === 'success' 
                    ? "bg-virtualis-alert-green/20 text-virtualis-alert-green border-virtualis-alert-green" 
                    : testResult === 'error'
                    ? "bg-virtualis-alert-red/20 text-virtualis-alert-red border-virtualis-alert-red"
                    : "bg-slate-500/20 text-slate-400 border-slate-500"
                }>
                  {testResult === 'success' && <CheckCircle className="h-3 w-3 mr-1" />}
                  {testResult === 'error' && <XCircle className="h-3 w-3 mr-1" />}
                  {testResult === 'testing' && <Database className="h-3 w-3 mr-1 animate-spin" />}
                  {testResult === 'idle' && <Link className="h-3 w-3 mr-1" />}
                  {testResult === 'testing' ? 'TESTING' : 
                   testResult === 'success' ? 'CONNECTED' : 
                   testResult === 'error' ? 'ERROR' : 'PENDING'}
                </Badge>
              </div>
              
              <div className="text-sm text-slate-400 tech-font">
                Last Updated: {new Date().toLocaleString()}
              </div>
              
              {testResult === 'success' && (
                <div className="p-3 bg-virtualis-alert-green/10 border border-virtualis-alert-green/30 rounded-lg">
                  <p className="text-virtualis-alert-green text-sm tech-font">
                    ✓ Authentication verified
                    <br />
                    ✓ FHIR endpoint accessible
                    <br />
                    ✓ Data sync ready
                  </p>
                </div>
              )}
              
              {testResult === 'error' && (
                <div className="p-3 bg-virtualis-alert-red/10 border border-virtualis-alert-red/30 rounded-lg">
                  <p className="text-virtualis-alert-red text-sm tech-font">
                    ✗ Connection failed
                    <br />
                    ✗ Check credentials
                    <br />
                    ✗ Verify endpoint URL
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="ai-card">
            <CardHeader>
              <CardTitle className="text-white tech-font">INTEGRATION FEATURES</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-300 tech-font">Patient Data</span>
                <Badge className="bg-virtualis-alert-green/20 text-virtualis-alert-green">Enabled</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-300 tech-font">Lab Results</span>
                <Badge className="bg-virtualis-alert-green/20 text-virtualis-alert-green">Enabled</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-300 tech-font">Medications</span>
                <Badge className="bg-virtualis-alert-yellow/20 text-virtualis-alert-yellow">Partial</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-300 tech-font">Orders</span>
                <Badge className="bg-slate-500/20 text-slate-400">Disabled</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EMRIntegrationPanel;
