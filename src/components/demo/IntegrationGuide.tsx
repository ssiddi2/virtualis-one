
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Download, 
  FileText, 
  Code, 
  Database, 
  Settings,
  CheckCircle,
  AlertTriangle,
  Info
} from "lucide-react";

const IntegrationGuide = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);

  const integrationSteps = [
    {
      title: "Discovery & Assessment",
      duration: "2-4 weeks",
      description: "Technical assessment and interface mapping",
      tasks: [
        "Current system inventory and API documentation review",
        "Data flow mapping and integration point identification",
        "Security and compliance requirements assessment",
        "Custom interface specification development"
      ]
    },
    {
      title: "Design & Development",
      duration: "4-6 weeks",
      description: "Development of integration components and API endpoints",
      tasks: [
        "API endpoint design and implementation",
        "Data mapping and transformation",
        "Authentication and authorization setup",
        "Integration testing and validation"
      ]
    },
    {
      title: "Testing & Validation",
      duration: "2-4 weeks",
      description: "Testing and validation of integration components",
      tasks: [
        "End-to-end data flow validation",
        "API response time testing",
        "Error handling verification",
        "Load testing with sample data",
        "Authentication flow validation",
        "Role-based access verification",
        "Data encryption validation",
        "Penetration testing"
      ]
    },
    {
      title: "Deployment & Maintenance",
      duration: "1-2 weeks",
      description: "Deployment of integration components and ongoing maintenance",
      tasks: [
        "Integration component deployment",
        "Monitoring and logging setup",
        "Regular updates and bug fixes"
      ]
    }
  ];

  const apiEndpoints = [
    {
      method: "GET",
      endpoint: "/api/v1/patients",
      description: "Retrieve patient demographics and basic information",
      authentication: "Bearer Token + API Key"
    },
    {
      method: "POST",
      endpoint: "/api/v1/patients",
      description: "Create new patient record",
      authentication: "Bearer Token + API Key"
    },
    {
      method: "PUT",
      endpoint: "/api/v1/patients/{id}",
      description: "Update patient information",
      authentication: "Bearer Token + API Key"
    },
    {
      method: "GET",
      endpoint: "/api/v1/encounters",
      description: "Retrieve encounter data",
      authentication: "Bearer Token + API Key"
    },
    {
      method: "GET",
      endpoint: "/api/v1/observations",
      description: "Get lab results and vitals",
      authentication: "Bearer Token + API Key"
    },
    {
      method: "POST",
      endpoint: "/api/v1/orders",
      description: "Submit new orders",
      authentication: "Bearer Token + API Key"
    },
    {
      method: "POST",
      endpoint: "/api/v1/ai/clinical-notes",
      description: "Generate clinical documentation",
      authentication: "Bearer Token + API Key"
    },
    {
      method: "POST",
      endpoint: "/api/v1/ai/diagnosis-support",
      description: "AI-powered diagnosis assistance",
      authentication: "Bearer Token + API Key"
    },
    {
      method: "POST",
      endpoint: "/api/v1/ai/medical-coding",
      description: "Automated medical coding",
      authentication: "Bearer Token + API Key"
    }
  ];

  const securityFeatures = [
    {
      feature: "End-to-End Encryption",
      description: "AES-256 encryption for data in transit and at rest",
      compliance: "HIPAA, HITECH"
    },
    {
      feature: "Role-Based Access Control",
      description: "Fine-grained access control based on user roles",
      compliance: "HIPAA, HITECH"
    },
    {
      feature: "Data Masking",
      description: "Data masking to protect sensitive information",
      compliance: "HIPAA, HITECH"
    },
    {
      feature: "Audit Logging",
      description: "Real-time logging of all system activities",
      compliance: "HIPAA, HITECH"
    }
  ];

  const downloadSpecification = (type: string) => {
    // Simulate downloading technical specifications
    console.log(`Downloading ${type} specification...`);
  };

  return (
    <div className="min-h-screen bg-[#0a1628] p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4 tech-font ai-text-glow">
            INTEGRATION IMPLEMENTATION GUIDE
          </h1>
          <p className="text-virtualis-gold text-lg tech-font">
            Technical specifications and implementation requirements
          </p>
        </div>

        <Tabs defaultValue="requirements" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-slate-800">
            <TabsTrigger value="requirements" className="tech-font">Requirements</TabsTrigger>
            <TabsTrigger value="endpoints" className="tech-font">API Endpoints</TabsTrigger>
            <TabsTrigger value="authentication" className="tech-font">Authentication</TabsTrigger>
            <TabsTrigger value="data-mapping" className="tech-font">Data Mapping</TabsTrigger>
            <TabsTrigger value="testing" className="tech-font">Testing</TabsTrigger>
          </TabsList>

          {/* Requirements */}
          <TabsContent value="requirements" className="space-y-6">
            <Card className="ai-card">
              <CardHeader>
                <CardTitle className="text-white tech-font flex items-center gap-2">
                  <Settings className="h-6 w-6 text-virtualis-gold" />
                  SYSTEM REQUIREMENTS & PREREQUISITES
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="bg-slate-800 border-slate-600">
                    <CardHeader>
                      <CardTitle className="text-virtualis-gold tech-font text-lg">
                        NETWORK REQUIREMENTS
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-400 mt-1" />
                        <div>
                          <span className="text-white tech-font font-semibold">Internet Connectivity</span>
                          <p className="text-slate-300 text-sm">Minimum 100 Mbps dedicated bandwidth</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-400 mt-1" />
                        <div>
                          <span className="text-white tech-font font-semibold">Firewall Configuration</span>
                          <p className="text-slate-300 text-sm">HTTPS (443), DICOM (11112), HL7 (custom ports)</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-400 mt-1" />
                        <div>
                          <span className="text-white tech-font font-semibold">VPN Support</span>
                          <p className="text-slate-300 text-sm">Site-to-site VPN for secure communication</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-800 border-slate-600">
                    <CardHeader>
                      <CardTitle className="text-virtualis-gold tech-font text-lg">
                        SYSTEM ACCESS
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-start gap-2">
                        <Info className="h-4 w-4 text-blue-400 mt-1" />
                        <div>
                          <span className="text-white tech-font font-semibold">EMR Administrator Access</span>
                          <p className="text-slate-300 text-sm">Admin credentials for integration setup</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <Info className="h-4 w-4 text-blue-400 mt-1" />
                        <div>
                          <span className="text-white tech-font font-semibold">Database Permissions</span>
                          <p className="text-slate-300 text-sm">Read access to clinical data tables</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="h-4 w-4 text-yellow-400 mt-1" />
                        <div>
                          <span className="text-white tech-font font-semibold">Change Control Process</span>
                          <p className="text-slate-300 text-sm">Approval workflow for system modifications</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-600">
                  <h4 className="text-white tech-font font-semibold mb-3">TECHNICAL SPECIFICATIONS</h4>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div>
                      <h5 className="text-virtualis-gold tech-font mb-2">SUPPORTED EMR VERSIONS</h5>
                      <div className="space-y-1">
                        <Badge className="bg-blue-600/20 text-blue-300 border-blue-600/30">Epic 2020+</Badge>
                        <Badge className="bg-green-600/20 text-green-300 border-green-600/30">Cerner PowerChart 2019+</Badge>
                        <Badge className="bg-purple-600/20 text-purple-300 border-purple-600/30">Meditech 6.1+</Badge>
                      </div>
                    </div>
                    <div>
                      <h5 className="text-virtualis-gold tech-font mb-2">PROTOCOL SUPPORT</h5>
                      <div className="space-y-1">
                        <Badge className="bg-orange-600/20 text-orange-300 border-orange-600/30">HL7 v2.3-2.8</Badge>
                        <Badge className="bg-red-600/20 text-red-300 border-red-600/30">FHIR R4</Badge>
                        <Badge className="bg-teal-600/20 text-teal-300 border-teal-600/30">DICOM 3.0</Badge>
                      </div>
                    </div>
                    <div>
                      <h5 className="text-virtualis-gold tech-font mb-2">SECURITY STANDARDS</h5>
                      <div className="space-y-1">
                        <Badge className="bg-red-600/20 text-red-300 border-red-600/30">TLS 1.3</Badge>
                        <Badge className="bg-blue-600/20 text-blue-300 border-blue-600/30">OAuth 2.0</Badge>
                        <Badge className="bg-green-600/20 text-green-300 border-green-600/30">SAML 2.0</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* API Endpoints */}
          <TabsContent value="endpoints" className="space-y-6">
            <Card className="ai-card">
              <CardHeader>
                <CardTitle className="text-white tech-font flex items-center gap-2">
                  <Code className="h-6 w-6 text-virtualis-gold" />
                  API ENDPOINTS & INTEGRATION POINTS
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-600">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-virtualis-gold tech-font font-semibold">PATIENT DATA API</h4>
                      <Button size="sm" onClick={() => downloadSpecification('patient-api')}>
                        <Download className="h-4 w-4 mr-2" />
                        Download Spec
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <Badge className="bg-green-600/20 text-green-300 border-green-600/30">GET</Badge>
                        <code className="text-blue-300 bg-slate-800 px-2 py-1 rounded">/api/v1/patients</code>
                        <span className="text-slate-300 text-sm">Retrieve patient demographics</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className="bg-blue-600/20 text-blue-300 border-blue-600/30">POST</Badge>
                        <code className="text-blue-300 bg-slate-800 px-2 py-1 rounded">/api/v1/patients</code>
                        <span className="text-slate-300 text-sm">Create new patient record</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className="bg-yellow-600/20 text-yellow-300 border-yellow-600/30">PUT</Badge>
                        <code className="text-blue-300 bg-slate-800 px-2 py-1 rounded">/api/v1/patients/patientId</code>
                        <span className="text-slate-300 text-sm">Update patient information</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-600">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-virtualis-gold tech-font font-semibold">CLINICAL DATA API</h4>
                      <Button size="sm" onClick={() => downloadSpecification('clinical-api')}>
                        <Download className="h-4 w-4 mr-2" />
                        Download Spec
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <Badge className="bg-green-600/20 text-green-300 border-green-600/30">GET</Badge>
                        <code className="text-blue-300 bg-slate-800 px-2 py-1 rounded">/api/v1/encounters</code>
                        <span className="text-slate-300 text-sm">Retrieve encounter data</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className="bg-green-600/20 text-green-300 border-green-600/30">GET</Badge>
                        <code className="text-blue-300 bg-slate-800 px-2 py-1 rounded">/api/v1/observations</code>
                        <span className="text-slate-300 text-sm">Get lab results and vitals</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className="bg-blue-600/20 text-blue-300 border-blue-600/30">POST</Badge>
                        <code className="text-blue-300 bg-slate-800 px-2 py-1 rounded">/api/v1/orders</code>
                        <span className="text-slate-300 text-sm">Submit new orders</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-600">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-virtualis-gold tech-font font-semibold">AI SERVICES API</h4>
                      <Button size="sm" onClick={() => downloadSpecification('ai-api')}>
                        <Download className="h-4 w-4 mr-2" />
                        Download Spec
                      </Button>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <Badge className="bg-blue-600/20 text-blue-300 border-blue-600/30">POST</Badge>
                        <code className="text-blue-300 bg-slate-800 px-2 py-1 rounded">/api/v1/ai/clinical-notes</code>
                        <span className="text-slate-300 text-sm">Generate clinical documentation</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className="bg-blue-600/20 text-blue-300 border-blue-600/30">POST</Badge>
                        <code className="text-blue-300 bg-slate-800 px-2 py-1 rounded">/api/v1/ai/diagnosis-support</code>
                        <span className="text-slate-300 text-sm">AI-powered diagnosis assistance</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className="bg-blue-600/20 text-blue-300 border-blue-600/30">POST</Badge>
                        <code className="text-blue-300 bg-slate-800 px-2 py-1 rounded">/api/v1/ai/medical-coding</code>
                        <span className="text-slate-300 text-sm">Automated medical coding</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Authentication */}
          <TabsContent value="authentication" className="space-y-6">
            <Card className="ai-card">
              <CardHeader>
                <CardTitle className="text-white tech-font flex items-center gap-2">
                  <Database className="h-6 w-6 text-virtualis-gold" />
                  AUTHENTICATION & AUTHORIZATION
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="bg-slate-800 border-slate-600">
                    <CardHeader>
                      <CardTitle className="text-virtualis-gold tech-font text-lg">
                        OAUTH 2.0 FLOW
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="bg-slate-900 p-3 rounded font-mono text-sm">
                        <div className="text-green-400"># Step 1: Authorization Request</div>
                        <div className="text-blue-300">GET /oauth/authorize</div>
                        <div className="text-slate-300">?client_id=your_client_id</div>
                        <div className="text-slate-300">&response_type=code</div>
                        <div className="text-slate-300">&scope=read:patients write:orders</div>
                        <div className="text-slate-300">&redirect_uri=your_callback</div>
                        <br />
                        <div className="text-green-400"># Step 2: Token Exchange</div>
                        <div className="text-blue-300">POST /oauth/token</div>
                        <div className="text-slate-300">grant_type=authorization_code</div>
                        <div className="text-slate-300">code=received_auth_code</div>
                        <div className="text-slate-300">client_id=your_client_id</div>
                        <div className="text-slate-300">client_secret=your_secret</div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-800 border-slate-600">
                    <CardHeader>
                      <CardTitle className="text-virtualis-gold tech-font text-lg">
                        API KEY AUTHENTICATION
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="bg-slate-900 p-3 rounded font-mono text-sm">
                        <div className="text-green-400"># HTTP Header Authentication</div>
                        <div className="text-blue-300">Authorization: Bearer &lt;access_token&gt;</div>
                        <div className="text-blue-300">X-API-Key: &lt;your_api_key&gt;</div>
                        <div className="text-blue-300">Content-Type: application/json</div>
                        <br />
                        <div className="text-green-400"># Example Request</div>
                        <div className="text-blue-300">curl -X GET \\</div>
                        <div className="text-slate-300">  -H "Authorization: Bearer abc123" \\</div>
                        <div className="text-slate-300">  -H "X-API-Key: your_key_here" \\</div>
                        <div className="text-slate-300">  https://api.virtualis.ai/v1/patients</div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-600">
                  <h4 className="text-white tech-font font-semibold mb-3">ROLE-BASED PERMISSIONS</h4>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <div>
                      <h5 className="text-virtualis-gold tech-font mb-2">PHYSICIAN</h5>
                      <div className="space-y-1 text-sm">
                        <div className="text-green-400">✓ Read patient data</div>
                        <div className="text-green-400">✓ Create/update encounters</div>
                        <div className="text-green-400">✓ Place orders</div>
                        <div className="text-green-400">✓ Access AI tools</div>
                      </div>
                    </div>
                    <div>
                      <h5 className="text-virtualis-gold tech-font mb-2">NURSE</h5>
                      <div className="space-y-1 text-sm">
                        <div className="text-green-400">✓ Read patient data</div>
                        <div className="text-green-400">✓ Update vitals</div>
                        <div className="text-green-400">✓ View orders</div>
                        <div className="text-red-400">✗ Place orders</div>
                      </div>
                    </div>
                    <div>
                      <h5 className="text-virtualis-gold tech-font mb-2">BILLING</h5>
                      <div className="space-y-1 text-sm">
                        <div className="text-green-400">✓ Read encounter data</div>
                        <div className="text-green-400">✓ Access coding tools</div>
                        <div className="text-green-400">✓ Generate claims</div>
                        <div className="text-red-400">✗ Modify clinical data</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Data Mapping */}
          <TabsContent value="data-mapping" className="space-y-6">
            <Card className="ai-card">
              <CardHeader>
                <CardTitle className="text-white tech-font flex items-center gap-2">
                  <FileText className="h-6 w-6 text-virtualis-gold" />
                  DATA MAPPING & TRANSFORMATION
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-600">
                  <h4 className="text-white tech-font font-semibold mb-3">HL7 MESSAGE MAPPING</h4>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div>
                        <h5 className="text-virtualis-gold tech-font mb-2">ADT^A04 (Patient Registration)</h5>
                        <div className="bg-slate-800 p-3 rounded font-mono text-xs">
                          <div className="text-blue-300">MSH|^~\&|EMR|HOSPITAL|VIRTUALIS|AI</div>
                          <div className="text-green-400">PID|1||12345^^^MRN||DOE^JOHN^||19800101|M</div>
                          <div className="text-yellow-400">PV1|1|I|ICU^101^A|||DOC123^SMITH^JANE</div>
                        </div>
                      </div>
                      <div>
                        <h5 className="text-virtualis-gold tech-font mb-2">JSON Transformation</h5>
                        <div className="bg-slate-800 p-3 rounded font-mono text-xs">
                          <div className="text-blue-300">{"{"}</div>
                          <div className="text-green-400">  "patient_id": "12345",</div>
                          <div className="text-green-400">  "first_name": "JOHN",</div>
                          <div className="text-green-400">  "last_name": "DOE",</div>
                          <div className="text-green-400">  "dob": "1980-01-01",</div>
                          <div className="text-green-400">  "gender": "M"</div>
                          <div className="text-blue-300">{"}"}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-600">
                  <h4 className="text-white tech-font font-semibold mb-3">FHIR RESOURCE MAPPING</h4>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div>
                      <h5 className="text-virtualis-gold tech-font mb-2">Patient Resource</h5>
                      <div className="bg-slate-800 p-3 rounded font-mono text-xs">
                        <div className="text-blue-300">{"{"}</div>
                        <div className="text-green-400">  "resourceType": "Patient",</div>
                        <div className="text-green-400">  "identifier": [</div>
                        <div className="text-green-400">    {"{"}"system": "MRN", "value": "12345"{"}"}</div>
                        <div className="text-green-400">  ],</div>
                        <div className="text-green-400">  "name": [{"{"}"family": "Doe", "given": ["John"]{"}"}</div>
                        <div className="text-blue-300">{"}"}</div>
                      </div>
                    </div>
                    <div>
                      <h5 className="text-virtualis-gold tech-font mb-2">Observation Resource</h5>
                      <div className="bg-slate-800 p-3 rounded font-mono text-xs">
                        <div className="text-blue-300">{"{"}</div>
                        <div className="text-green-400">  "resourceType": "Observation",</div>
                        <div className="text-green-400">  "code": {"{"}"coding": [</div>
                        <div className="text-green-400">    {"{"}"system": "LOINC", "code": "33747-0"{"}"}</div>
                        <div className="text-green-400">  ]{"}"}</div>
                        <div className="text-green-400">  "valueQuantity": {"{"}"value": 120, "unit": "mg/dL"{"}"}</div>
                        <div className="text-blue-300">{"}"}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Testing */}
          <TabsContent value="testing" className="space-y-6">
            <Card className="ai-card">
              <CardHeader>
                <CardTitle className="text-white tech-font flex items-center gap-2">
                  <CheckCircle className="h-6 w-6 text-virtualis-gold" />
                  TESTING & VALIDATION PROCEDURES
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="bg-slate-800 border-slate-600">
                    <CardHeader>
                      <CardTitle className="text-virtualis-gold tech-font text-lg">
                        INTEGRATION TESTING
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-400" />
                        <span className="text-white tech-font">End-to-end data flow validation</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-400" />
                        <span className="text-white tech-font">API response time testing</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-400" />
                        <span className="text-white tech-font">Error handling verification</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-400" />
                        <span className="text-white tech-font">Load testing with sample data</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-800 border-slate-600">
                    <CardHeader>
                      <CardTitle className="text-virtualis-gold tech-font text-lg">
                        SECURITY TESTING
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-400" />
                        <span className="text-white tech-font">Authentication flow validation</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-400" />
                        <span className="text-white tech-font">Role-based access verification</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-400" />
                        <span className="text-white tech-font">Data encryption validation</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-400" />
                        <span className="text-white tech-font">Penetration testing</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-600">
                  <h4 className="text-white tech-font font-semibold mb-3">TEST SCENARIOS</h4>
                  <div className="space-y-4">
                    <div className="border-l-4 border-green-600 pl-4">
                      <h5 className="text-virtualis-gold tech-font mb-1">SCENARIO 1: Patient Registration</h5>
                      <p className="text-slate-300 text-sm mb-2">Verify complete patient data flow from EMR to Virtualis platform</p>
                      <div className="text-xs text-slate-400">
                        Expected: Patient data correctly mapped and stored with proper validation
                      </div>
                    </div>
                    
                    <div className="border-l-4 border-blue-600 pl-4">
                      <h5 className="text-virtualis-gold tech-font mb-1">SCENARIO 2: Lab Results Processing</h5>
                      <p className="text-slate-300 text-sm mb-2">Test lab result ingestion and AI analysis workflow</p>
                      <div className="text-xs text-slate-400">
                        Expected: Results processed, analyzed, and alerts generated appropriately
                      </div>
                    </div>
                    
                    <div className="border-l-4 border-purple-600 pl-4">
                      <h5 className="text-virtualis-gold tech-font mb-1">SCENARIO 3: Order Management</h5>
                      <p className="text-slate-300 text-sm mb-2">Validate order creation and status updates</p>
                      <div className="text-xs text-slate-400">
                        Expected: Orders successfully transmitted and status tracked
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default IntegrationGuide;
