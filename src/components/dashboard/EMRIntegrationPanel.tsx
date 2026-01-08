import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Database, Key, TestTube, CheckCircle, XCircle, Link, Loader2, Shield, AlertTriangle } from "lucide-react";
import { useEMRCredentials, type EMRVendor } from "@/hooks/useEMRCredentials";

interface Hospital {
  id: string;
  name: string;
  location?: string;
  emr_type?: string;
}

interface EMRIntegrationPanelProps {
  hospital: Hospital;
  user?: any;
  onBack: () => void;
  onSave?: (data: any) => void;
}

const EMRIntegrationPanel = ({ hospital, onBack, onSave }: EMRIntegrationPanelProps) => {
  const { loading, getCredentials, saveCredentials, testConnection } = useEMRCredentials(hospital.id);
  const [testResult, setTestResult] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [latency, setLatency] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    vendor: (hospital.emr_type?.toLowerCase() || 'epic') as EMRVendor,
    base_url: '',
    client_id: '',
    client_secret: '',
    tenant_id: '',
    auth_method: 'client_secret' as 'client_secret' | 'jwt_bearer',
    private_key: '',
  });

  useEffect(() => {
    getCredentials().then(creds => {
      if (creds) {
        setFormData({
          vendor: creds.vendor,
          base_url: creds.base_url,
          client_id: creds.client_id,
          client_secret: '',
          tenant_id: creds.tenant_id || '',
          auth_method: (creds as any).auth_method || 'client_secret',
          private_key: '',
        });
        if (creds.last_health_status) {
          setTestResult(creds.last_health_status === 'healthy' ? 'success' : 'error');
        }
      }
    });
  }, [hospital.id]);

  const handleSave = async () => {
    const success = await saveCredentials({
      hospital_id: hospital.id,
      vendor: formData.vendor,
      base_url: formData.base_url,
      client_id: formData.client_id,
      client_secret: formData.client_secret,
      tenant_id: formData.tenant_id || undefined,
      auth_method: formData.auth_method,
      private_key: formData.private_key || undefined,
    });
    if (success) onSave?.({ ...formData, hospital_id: hospital.id });
  };

  const handleTest = async () => {
    setTestResult('testing');
    const result = await testConnection();
    setTestResult(result.success ? 'success' : 'error');
    if (result.latencyMs) setLatency(result.latencyMs);
  };

  const getEndpointPlaceholder = () => {
    switch (formData.vendor) {
      case 'epic': return 'https://fhir.epic.com/interconnect-fhir-oauth/api/FHIR/R4';
      case 'cerner': return 'https://fhir-open.cerner.com/r4/ec2458f2-1e24-41c8-b71b-0e701af7583d';
      case 'meditech': return 'https://fhir.meditech.com/api/FHIR/R4';
      case 'allscripts': return 'https://cloud.allscripts.com/fhir/r4';
      default: return 'https://your-fhir-server.com/fhir/R4';
    }
  };

  const showJWTBearerOption = formData.vendor === 'epic';

  return (
    <div className="p-6 space-y-6 min-h-screen">
      <div className="flex items-center gap-4">
        <Button onClick={onBack} variant="ghost" className="text-foreground hover:bg-muted">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-2xl font-bold">EMR Integration</h1>
          <p className="text-muted-foreground">{hospital.name}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5 text-primary" />
                Connection Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>EMR System</Label>
                <Select value={formData.vendor} onValueChange={(v) => setFormData(p => ({ ...p, vendor: v as EMRVendor }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="epic">Epic</SelectItem>
                    <SelectItem value="cerner">Cerner (Oracle Health)</SelectItem>
                    <SelectItem value="meditech">Meditech</SelectItem>
                    <SelectItem value="allscripts">Allscripts</SelectItem>
                    <SelectItem value="fhir">Generic FHIR</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>FHIR Base URL</Label>
                <Input
                  value={formData.base_url}
                  onChange={(e) => setFormData(p => ({ ...p, base_url: e.target.value }))}
                  placeholder={getEndpointPlaceholder()}
                />
              </div>

              <div>
                <Label>Client ID</Label>
                <Input
                  value={formData.client_id}
                  onChange={(e) => setFormData(p => ({ ...p, client_id: e.target.value }))}
                  placeholder="OAuth client identifier from Epic App Orchard"
                />
              </div>

              {showJWTBearerOption && (
                <div>
                  <Label>Authentication Method</Label>
                  <Select 
                    value={formData.auth_method} 
                    onValueChange={(v) => setFormData(p => ({ ...p, auth_method: v as 'client_secret' | 'jwt_bearer' }))}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="client_secret">Client Secret (Standard OAuth)</SelectItem>
                      <SelectItem value="jwt_bearer">JWT Bearer (SMART Backend Services)</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-1">
                    Epic SMART Backend Services requires JWT Bearer authentication with a private key.
                  </p>
                </div>
              )}

              {formData.auth_method === 'jwt_bearer' ? (
                <div>
                  <Label className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    Private Key (PEM format)
                  </Label>
                  <Textarea
                    value={formData.private_key}
                    onChange={(e) => setFormData(p => ({ ...p, private_key: e.target.value }))}
                    placeholder="-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASC...
-----END PRIVATE KEY-----"
                    className="font-mono text-xs h-32"
                  />
                  <div className="mt-2 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-600 text-xs space-y-1">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-semibold">Generate RSA Key Pair:</p>
                        <code className="block mt-1 text-[10px] bg-black/20 p-1 rounded">
                          openssl genrsa -out virtualis_private.pem 2048
                        </code>
                        <code className="block mt-1 text-[10px] bg-black/20 p-1 rounded">
                          openssl rsa -in virtualis_private.pem -pubout -out virtualis_public.pem
                        </code>
                        <p className="mt-2">Upload the <strong>public key</strong> to Epic. Paste the <strong>private key</strong> above.</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <Label>Client Secret</Label>
                  <Input
                    type="password"
                    value={formData.client_secret}
                    onChange={(e) => setFormData(p => ({ ...p, client_secret: e.target.value }))}
                    placeholder="••••••••"
                  />
                </div>
              )}

              {(formData.vendor === 'epic' || formData.vendor === 'cerner') && (
                <div>
                  <Label>Tenant/Organization ID (optional)</Label>
                  <Input
                    value={formData.tenant_id}
                    onChange={(e) => setFormData(p => ({ ...p, tenant_id: e.target.value }))}
                    placeholder="Organization identifier"
                  />
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <Button onClick={handleTest} disabled={loading || !formData.base_url} variant="outline">
                  {testResult === 'testing' ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <TestTube className="h-4 w-4 mr-2" />}
                  Test Connection
                </Button>
                <Button onClick={handleSave} disabled={loading || !formData.client_id}>
                  <Key className="h-4 w-4 mr-2" />
                  Save Credentials
                </Button>
              </div>
            </CardContent>
          </Card>

          {formData.vendor === 'epic' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Shield className="h-4 w-4 text-primary" />
                  Epic on FHIR Setup Guide
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-3">
                <ol className="list-decimal list-inside space-y-2">
                  <li>Go to <a href="https://fhir.epic.com/Developer/Create" target="_blank" rel="noopener" className="text-primary underline">Epic App Orchard</a> and create a new app</li>
                  <li>Select <strong>Backend System</strong> as the application type</li>
                  <li>Choose <strong>SMART Backend Services</strong> for authentication</li>
                  <li>Generate an RSA key pair and upload the public key to Epic</li>
                  <li>Select FHIR scopes: <code className="bg-muted px-1 rounded">patient/*.read</code>, <code className="bg-muted px-1 rounded">system/*.read</code></li>
                  <li>Copy the Client ID and FHIR Base URL from Epic</li>
                  <li>Paste your private key above (it will be encrypted)</li>
                </ol>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Connection Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-sm">Status</span>
                <Badge variant={testResult === 'success' ? 'default' : testResult === 'error' ? 'destructive' : 'secondary'}>
                  {testResult === 'success' && <CheckCircle className="h-3 w-3 mr-1" />}
                  {testResult === 'error' && <XCircle className="h-3 w-3 mr-1" />}
                  {testResult === 'testing' && <Loader2 className="h-3 w-3 mr-1 animate-spin" />}
                  {testResult === 'idle' && <Link className="h-3 w-3 mr-1" />}
                  {testResult === 'testing' ? 'Testing...' : testResult === 'success' ? 'Connected' : testResult === 'error' ? 'Failed' : 'Not Tested'}
                </Badge>
              </div>
              {latency && <div className="text-xs text-muted-foreground">Latency: {latency}ms</div>}
              
              {testResult === 'success' && (
                <div className="p-3 bg-green-500/10 border border-green-500/30 rounded-lg text-green-600 text-xs space-y-1">
                  <div>✓ OAuth authentication verified</div>
                  <div>✓ FHIR metadata endpoint accessible</div>
                  <div>✓ Ready for data sync</div>
                </div>
              )}
              {testResult === 'error' && (
                <div className="p-3 bg-destructive/10 border border-destructive/30 rounded-lg text-destructive text-xs space-y-1">
                  <div>✗ Connection failed</div>
                  <div>✗ Check credentials and URL</div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Supported Operations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Patient Search</span><Badge variant="outline">Read</Badge></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Lab Results</span><Badge variant="outline">Read</Badge></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Orders</span><Badge variant="outline">Read/Write</Badge></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Medications</span><Badge variant="outline">Read</Badge></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Allergies</span><Badge variant="outline">Read</Badge></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Conditions</span><Badge variant="outline">Read</Badge></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Vitals</span><Badge variant="outline">Read</Badge></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Documents</span><Badge variant="outline">Read</Badge></div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default EMRIntegrationPanel;
