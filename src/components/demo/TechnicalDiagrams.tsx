
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Database, 
  Cloud, 
  Shield, 
  Zap, 
  ArrowRight, 
  Server, 
  Monitor,
  FileText,
  Activity,
  Users,
  Brain,
  Lock,
  CheckCircle
} from "lucide-react";

const TechnicalDiagrams = () => {
  return (
    <div className="min-h-screen bg-[#0a1628] p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4 tech-font ai-text-glow">
            VIRTUALIS INTEGRATION ARCHITECTURE
          </h1>
          <p className="text-virtualis-gold text-lg tech-font">
            Comprehensive Technical Integration Documentation
          </p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 bg-slate-800">
            <TabsTrigger value="overview" className="tech-font">System Overview</TabsTrigger>
            <TabsTrigger value="pacs" className="tech-font">PACS Integration</TabsTrigger>
            <TabsTrigger value="lab" className="tech-font">Lab Integration</TabsTrigger>
            <TabsTrigger value="billing" className="tech-font">Claims/Billing</TabsTrigger>
            <TabsTrigger value="security" className="tech-font">Security</TabsTrigger>
            <TabsTrigger value="implementation" className="tech-font">Implementation</TabsTrigger>
          </TabsList>

          {/* System Overview */}
          <TabsContent value="overview" className="space-y-6">
            <Card className="ai-card">
              <CardHeader>
                <CardTitle className="text-white tech-font flex items-center gap-2">
                  <Cloud className="h-6 w-6 text-virtualis-gold" />
                  VIRTUALIS HEALTHCARE AI PLATFORM ARCHITECTURE
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Frontend Layer */}
                  <Card className="bg-slate-800 border-slate-600">
                    <CardHeader>
                      <CardTitle className="text-virtualis-gold tech-font text-lg">
                        FRONTEND LAYER
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Monitor className="h-4 w-4 text-blue-400" />
                        <span className="text-white tech-font">React/TypeScript UI</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-green-400" />
                        <span className="text-white tech-font">Role-Based Access</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Brain className="h-4 w-4 text-purple-400" />
                        <span className="text-white tech-font">AI-Enhanced UX</span>
                      </div>
                    </CardContent>
                  </Card>

                  {/* API Gateway */}
                  <Card className="bg-slate-800 border-slate-600">
                    <CardHeader>
                      <CardTitle className="text-virtualis-gold tech-font text-lg">
                        API GATEWAY
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Server className="h-4 w-4 text-blue-400" />
                        <span className="text-white tech-font">Supabase Edge Functions</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-red-400" />
                        <span className="text-white tech-font">Authentication & RLS</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Zap className="h-4 w-4 text-yellow-400" />
                        <span className="text-white tech-font">Real-time Processing</span>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Integration Layer */}
                  <Card className="bg-slate-800 border-slate-600">
                    <CardHeader>
                      <CardTitle className="text-virtualis-gold tech-font text-lg">
                        INTEGRATION LAYER
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Database className="h-4 w-4 text-green-400" />
                        <span className="text-white tech-font">HL7 FHIR R4</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-blue-400" />
                        <span className="text-white tech-font">DICOM Protocol</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Activity className="h-4 w-4 text-purple-400" />
                        <span className="text-white tech-font">REST/GraphQL APIs</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Data Flow Diagram */}
                <div className="bg-slate-900/50 p-6 rounded-lg border border-slate-600">
                  <h3 className="text-white tech-font text-xl mb-4">DATA FLOW ARCHITECTURE</h3>
                  <div className="flex items-center justify-between space-x-4 overflow-x-auto">
                    <div className="flex flex-col items-center min-w-[120px]">
                      <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mb-2">
                        <Database className="h-8 w-8 text-white" />
                      </div>
                      <span className="text-white tech-font text-sm text-center">EMR Systems</span>
                    </div>
                    <ArrowRight className="h-6 w-6 text-virtualis-gold" />
                    <div className="flex flex-col items-center min-w-[120px]">
                      <div className="w-16 h-16 bg-green-600 rounded-lg flex items-center justify-center mb-2">
                        <Shield className="h-8 w-8 text-white" />
                      </div>
                      <span className="text-white tech-font text-sm text-center">API Gateway</span>
                    </div>
                    <ArrowRight className="h-6 w-6 text-virtualis-gold" />
                    <div className="flex flex-col items-center min-w-[120px]">
                      <div className="w-16 h-16 bg-purple-600 rounded-lg flex items-center justify-center mb-2">
                        <Brain className="h-8 w-8 text-white" />
                      </div>
                      <span className="text-white tech-font text-sm text-center">AI Processing</span>
                    </div>
                    <ArrowRight className="h-6 w-6 text-virtualis-gold" />
                    <div className="flex flex-col items-center min-w-[120px]">
                      <div className="w-16 h-16 bg-orange-600 rounded-lg flex items-center justify-center mb-2">
                        <Monitor className="h-8 w-8 text-white" />
                      </div>
                      <span className="text-white tech-font text-sm text-center">User Interface</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* PACS Integration */}
          <TabsContent value="pacs" className="space-y-6">
            <Card className="ai-card">
              <CardHeader>
                <CardTitle className="text-white tech-font flex items-center gap-2">
                  <FileText className="h-6 w-6 text-virtualis-gold" />
                  PACS INTEGRATION ARCHITECTURE
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-virtualis-gold tech-font text-lg">SUPPORTED PACS VENDORS</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {['GE Healthcare', 'Siemens Healthineers', 'Philips', 'Agfa HealthCare', 'Carestream', 'McKesson'].map((vendor) => (
                        <Badge key={vendor} className="bg-blue-600/20 text-blue-300 border-blue-600/30">
                          {vendor}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-virtualis-gold tech-font text-lg">INTEGRATION PROTOCOLS</h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-400" />
                        <span className="text-white tech-font">DICOM C-STORE/C-FIND/C-MOVE</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-400" />
                        <span className="text-white tech-font">WADO-URI/WADO-RS</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-400" />
                        <span className="text-white tech-font">DICOMweb REST APIs</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-400" />
                        <span className="text-white tech-font">HL7 FHIR ImagingStudy</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-600">
                  <h4 className="text-white tech-font font-semibold mb-3">INTEGRATION WORKFLOW</h4>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">1</div>
                      <div>
                        <span className="text-white tech-font font-semibold">Worklist Query</span>
                        <p className="text-slate-300 text-sm">Query RIS/PACS for scheduled studies via DICOM C-FIND</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center text-white text-xs font-bold">2</div>
                      <div>
                        <span className="text-white tech-font font-semibold">Image Retrieval</span>
                        <p className="text-slate-300 text-sm">Fetch DICOM images using C-MOVE or WADO protocols</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">3</div>
                      <div>
                        <span className="text-white tech-font font-semibold">AI Analysis</span>
                        <p className="text-slate-300 text-sm">Process images with AI algorithms for findings detection</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-orange-600 rounded-full flex items-center justify-center text-white text-xs font-bold">4</div>
                      <div>
                        <span className="text-white tech-font font-semibold">Results Integration</span>
                        <p className="text-slate-300 text-sm">Send structured reports back to PACS/RIS via SR objects</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Lab Integration */}
          <TabsContent value="lab" className="space-y-6">
            <Card className="ai-card">
              <CardHeader>
                <CardTitle className="text-white tech-font flex items-center gap-2">
                  <Activity className="h-6 w-6 text-virtualis-gold" />
                  LABORATORY INTEGRATION ARCHITECTURE
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-virtualis-gold tech-font text-lg">SUPPORTED LIS SYSTEMS</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {['Cerner Millennium', 'Epic Beaker', 'Meditech LIS', 'Allscripts', 'SOFT Computer', 'Orchard Harvest'].map((lis) => (
                        <Badge key={lis} className="bg-green-600/20 text-green-300 border-green-600/30">
                          {lis}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-virtualis-gold tech-font text-lg">MESSAGE STANDARDS</h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-400" />
                        <span className="text-white tech-font">HL7 v2.x (ORM, ORU, ADT)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-400" />
                        <span className="text-white tech-font">HL7 FHIR R4 (Observation, DiagnosticReport)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-400" />
                        <span className="text-white tech-font">LOINC Code Mapping</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-400" />
                        <span className="text-white tech-font">SNOMED CT Integration</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-600">
                  <h4 className="text-white tech-font font-semibold mb-3">BI-DIRECTIONAL INTERFACE</h4>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h5 className="text-virtualis-gold tech-font mb-2">OUTBOUND (Orders)</h5>
                      <div className="space-y-2">
                        <div className="text-slate-300 text-sm">• ORM^O01 - Lab Order Messages</div>
                        <div className="text-slate-300 text-sm">• Patient Demographics (PID)</div>
                        <div className="text-slate-300 text-sm">• Provider Information (PV1)</div>
                        <div className="text-slate-300 text-sm">• Order Details (OBR/OBX)</div>
                      </div>
                    </div>
                    <div>
                      <h5 className="text-virtualis-gold tech-font mb-2">INBOUND (Results)</h5>
                      <div className="space-y-2">
                        <div className="text-slate-300 text-sm">• ORU^R01 - Result Messages</div>
                        <div className="text-slate-300 text-sm">• Quantitative Results</div>
                        <div className="text-slate-300 text-sm">• Critical Value Alerts</div>
                        <div className="text-slate-300 text-sm">• Reference Ranges</div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Billing Integration */}
          <TabsContent value="billing" className="space-y-6">
            <Card className="ai-card">
              <CardHeader>
                <CardTitle className="text-white tech-font flex items-center gap-2">
                  <FileText className="h-6 w-6 text-virtualis-gold" />
                  REVENUE CYCLE MANAGEMENT INTEGRATION
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <Card className="bg-slate-800 border-slate-600">
                    <CardHeader>
                      <CardTitle className="text-virtualis-gold tech-font text-lg">
                        CODING SYSTEMS
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-400" />
                        <span className="text-white tech-font">ICD-10-CM/PCS</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-400" />
                        <span className="text-white tech-font">CPT/HCPCS</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-400" />
                        <span className="text-white tech-font">MS-DRG Grouping</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-400" />
                        <span className="text-white tech-font">APR-DRG</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-800 border-slate-600">
                    <CardHeader>
                      <CardTitle className="text-virtualis-gold tech-font text-lg">
                        PAYER CONNECTIONS
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-400" />
                        <span className="text-white tech-font">Medicare/Medicaid</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-400" />
                        <span className="text-white tech-font">Commercial Payers</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-400" />
                        <span className="text-white tech-font">EDI 837/835 Processing</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-400" />
                        <span className="text-white tech-font">Real-time Eligibility</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-800 border-slate-600">
                    <CardHeader>
                      <CardTitle className="text-virtualis-gold tech-font text-lg">
                        AI ENHANCEMENTS
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Brain className="h-4 w-4 text-purple-400" />
                        <span className="text-white tech-font">Code Optimization</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Brain className="h-4 w-4 text-purple-400" />
                        <span className="text-white tech-font">CDI Opportunities</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Brain className="h-4 w-4 text-purple-400" />
                        <span className="text-white tech-font">Denial Prevention</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Brain className="h-4 w-4 text-purple-400" />
                        <span className="text-white tech-font">Quality Measures</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-600">
                  <h4 className="text-white tech-font font-semibold mb-3">CLAIMS PROCESSING WORKFLOW</h4>
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-2">
                        <span className="text-white font-bold">1</span>
                      </div>
                      <h5 className="text-virtualis-gold tech-font text-sm">DATA EXTRACTION</h5>
                      <p className="text-slate-300 text-xs">Pull encounter data from EMR</p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-2">
                        <span className="text-white font-bold">2</span>
                      </div>
                      <h5 className="text-virtualis-gold tech-font text-sm">AI CODING</h5>
                      <p className="text-slate-300 text-xs">Suggest optimal codes</p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-2">
                        <span className="text-white font-bold">3</span>
                      </div>
                      <h5 className="text-virtualis-gold tech-font text-sm">VALIDATION</h5>
                      <p className="text-slate-300 text-xs">Check coding accuracy</p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-2">
                        <span className="text-white font-bold">4</span>
                      </div>
                      <h5 className="text-virtualis-gold tech-font text-sm">SUBMISSION</h5>
                      <p className="text-slate-300 text-xs">Submit EDI claims</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security */}
          <TabsContent value="security" className="space-y-6">
            <Card className="ai-card">
              <CardHeader>
                <CardTitle className="text-white tech-font flex items-center gap-2">
                  <Shield className="h-6 w-6 text-virtualis-gold" />
                  SECURITY & COMPLIANCE ARCHITECTURE
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-virtualis-gold tech-font text-lg">COMPLIANCE STANDARDS</h3>
                    <div className="space-y-3">
                      <Badge className="bg-red-600/20 text-red-300 border-red-600/30 w-full justify-center">
                        HIPAA Compliant
                      </Badge>
                      <Badge className="bg-blue-600/20 text-blue-300 border-blue-600/30 w-full justify-center">
                        SOC 2 Type II
                      </Badge>
                      <Badge className="bg-green-600/20 text-green-300 border-green-600/30 w-full justify-center">
                        HITRUST Certified
                      </Badge>
                      <Badge className="bg-purple-600/20 text-purple-300 border-purple-600/30 w-full justify-center">
                        FedRAMP Ready
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-virtualis-gold tech-font text-lg">SECURITY FEATURES</h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Lock className="h-4 w-4 text-red-400" />
                        <span className="text-white tech-font">End-to-End Encryption</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-blue-400" />
                        <span className="text-white tech-font">Multi-Factor Authentication</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-green-400" />
                        <span className="text-white tech-font">Role-Based Access Control</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Activity className="h-4 w-4 text-yellow-400" />
                        <span className="text-white tech-font">Comprehensive Audit Logging</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-600">
                  <h4 className="text-white tech-font font-semibold mb-3">DATA PROTECTION LAYERS</h4>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-red-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                        <Lock className="h-8 w-8 text-white" />
                      </div>
                      <h5 className="text-white tech-font font-semibold">ENCRYPTION</h5>
                      <p className="text-slate-300 text-sm">AES-256 encryption at rest and in transit</p>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                        <Shield className="h-8 w-8 text-white" />
                      </div>
                      <h5 className="text-white tech-font font-semibold">ACCESS CONTROL</h5>
                      <p className="text-slate-300 text-sm">Zero-trust architecture with RLS policies</p>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 bg-green-600 rounded-lg flex items-center justify-center mx-auto mb-3">
                        <Activity className="h-8 w-8 text-white" />
                      </div>
                      <h5 className="text-white tech-font font-semibold">MONITORING</h5>
                      <p className="text-slate-300 text-sm">24/7 security monitoring and alerting</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Implementation */}
          <TabsContent value="implementation" className="space-y-6">
            <Card className="ai-card">
              <CardHeader>
                <CardTitle className="text-white tech-font flex items-center gap-2">
                  <Server className="h-6 w-6 text-virtualis-gold" />
                  IMPLEMENTATION ROADMAP
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-6">
                  <div className="border-l-4 border-blue-600 pl-4">
                    <h3 className="text-virtualis-gold tech-font text-lg mb-2">PHASE 1: DISCOVERY & PLANNING (2-4 Weeks)</h3>
                    <div className="space-y-2">
                      <div className="text-white tech-font">• Technical architecture assessment</div>
                      <div className="text-white tech-font">• Interface mapping and data flow analysis</div>
                      <div className="text-white tech-font">• Security and compliance review</div>
                      <div className="text-white tech-font">• Project timeline and resource planning</div>
                    </div>
                  </div>

                  <div className="border-l-4 border-green-600 pl-4">
                    <h3 className="text-virtualis-gold tech-font text-lg mb-2">PHASE 2: DEVELOPMENT & CONFIGURATION (4-6 Weeks)</h3>
                    <div className="space-y-2">
                      <div className="text-white tech-font">• API development and integration coding</div>
                      <div className="text-white tech-font">• Custom interface configuration</div>
                      <div className="text-white tech-font">• Security implementation and hardening</div>
                      <div className="text-white tech-font">• AI model training and optimization</div>
                    </div>
                  </div>

                  <div className="border-l-4 border-purple-600 pl-4">
                    <h3 className="text-virtualis-gold tech-font text-lg mb-2">PHASE 3: TESTING & VALIDATION (2-3 Weeks)</h3>
                    <div className="space-y-2">
                      <div className="text-white tech-font">• End-to-end integration testing</div>
                      <div className="text-white tech-font">• User acceptance testing</div>
                      <div className="text-white tech-font">• Performance and load testing</div>
                      <div className="text-white tech-font">• Security penetration testing</div>
                    </div>
                  </div>

                  <div className="border-l-4 border-orange-600 pl-4">
                    <h3 className="text-virtualis-gold tech-font text-lg mb-2">PHASE 4: DEPLOYMENT & GO-LIVE (1 Week)</h3>
                    <div className="space-y-2">
                      <div className="text-white tech-font">• Phased production rollout</div>
                      <div className="text-white tech-font">• Staff training and onboarding</div>
                      <div className="text-white tech-font">• 24/7 go-live support</div>
                      <div className="text-white tech-font">• Performance monitoring and optimization</div>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-600">
                  <h4 className="text-white tech-font font-semibold mb-3">SUCCESS METRICS & KPIs</h4>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <div>
                      <h5 className="text-virtualis-gold tech-font mb-2">EFFICIENCY GAINS</h5>
                      <div className="space-y-1">
                        <div className="text-slate-300 text-sm">• 40% reduction in documentation time</div>
                        <div className="text-slate-300 text-sm">• 30% faster diagnosis support</div>
                        <div className="text-slate-300 text-sm">• 25% improvement in coding accuracy</div>
                      </div>
                    </div>
                    <div>
                      <h5 className="text-virtualis-gold tech-font mb-2">FINANCIAL IMPACT</h5>
                      <div className="space-y-1">
                        <div className="text-slate-300 text-sm">• 15% increase in revenue capture</div>
                        <div className="text-slate-300 text-sm">• 20% reduction in claim denials</div>
                        <div className="text-slate-300 text-sm">• 12-18 month ROI timeline</div>
                      </div>
                    </div>
                    <div>
                      <h5 className="text-virtualis-gold tech-font mb-2">QUALITY MEASURES</h5>
                      <div className="space-y-1">
                        <div className="text-slate-300 text-sm">• 99.9% system uptime</div>
                        <div className="text-slate-300 text-sm">• <100ms response time</div>
                        <div className="text-slate-300 text-sm">• 95% user satisfaction</div>
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

export default TechnicalDiagrams;
