
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TechnicalDiagrams from "@/components/demo/TechnicalDiagrams";
import IntegrationGuide from "@/components/demo/IntegrationGuide";
import { 
  FileText, 
  Code, 
  Download, 
  ExternalLink,
  Presentation,
  Database
} from "lucide-react";

const Demo = () => {
  const [activeView, setActiveView] = useState<'overview' | 'diagrams' | 'guide'>('overview');

  const downloadResource = (resource: string) => {
    // Simulate download
    console.log(`Downloading ${resource}...`);
  };

  const openExternalLink = (url: string) => {
    window.open(url, '_blank');
  };

  if (activeView === 'diagrams') {
    return <TechnicalDiagrams />;
  }

  if (activeView === 'guide') {
    return <IntegrationGuide />;
  }

  return (
    <div className="min-h-screen bg-[#0a1628] p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4 tech-font ai-text-glow">
            VIRTUALIS DEMO RESOURCES
          </h1>
          <p className="text-virtualis-gold text-lg tech-font">
            Complete technical documentation and demo materials
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="ai-card cursor-pointer hover:border-virtualis-gold/50 transition-colors"
                onClick={() => setActiveView('diagrams')}>
            <CardHeader>
              <CardTitle className="text-white tech-font flex items-center gap-2">
                <Database className="h-6 w-6 text-virtualis-gold" />
                TECHNICAL DIAGRAMS
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300 text-sm mb-4">
                Comprehensive system architecture diagrams, integration flows, and technical specifications
              </p>
              <Button className="ai-button-secondary tech-font w-full">
                View Diagrams
              </Button>
            </CardContent>
          </Card>

          <Card className="ai-card cursor-pointer hover:border-virtualis-gold/50 transition-colors"
                onClick={() => setActiveView('guide')}>
            <CardHeader>
              <CardTitle className="text-white tech-font flex items-center gap-2">
                <Code className="h-6 w-6 text-virtualis-gold" />
                INTEGRATION GUIDE
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300 text-sm mb-4">
                Step-by-step implementation guide with API specifications and code examples
              </p>
              <Button className="ai-button-secondary tech-font w-full">
                View Guide
              </Button>
            </CardContent>
          </Card>

          <Card className="ai-card">
            <CardHeader>
              <CardTitle className="text-white tech-font flex items-center gap-2">
                <Presentation className="h-6 w-6 text-virtualis-gold" />
                DEMO SCRIPTS
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300 text-sm mb-4">
                Prepared talking points and demo scenarios for your presentation
              </p>
              <Button 
                className="ai-button-secondary tech-font w-full"
                onClick={() => downloadResource('demo-scripts')}
              >
                Download Scripts
              </Button>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="talking-points" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-slate-800">
            <TabsTrigger value="talking-points" className="tech-font">Talking Points</TabsTrigger>
            <TabsTrigger value="demo-scenarios" className="tech-font">Demo Scenarios</TabsTrigger>
            <TabsTrigger value="objection-handling" className="tech-font">Objection Handling</TabsTrigger>
            <TabsTrigger value="resources" className="tech-font">Resources</TabsTrigger>
          </TabsList>

          {/* Talking Points */}
          <TabsContent value="talking-points" className="space-y-6">
            <Card className="ai-card">
              <CardHeader>
                <CardTitle className="text-white tech-font">
                  KEY DEMO TALKING POINTS
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="border-l-4 border-virtualis-gold pl-4">
                    <h3 className="text-virtualis-gold tech-font text-lg mb-2">OPENING (2 minutes)</h3>
                    <ul className="space-y-1 text-slate-300">
                      <li>• "Welcome to Virtualis - the first true AI-native healthcare platform"</li>
                      <li>• "Unlike bolt-on AI solutions, we've built intelligence into every layer"</li>
                      <li>• "Today I'll show you how we integrate seamlessly with your existing systems"</li>
                      <li>• "And demonstrate measurable improvements in efficiency and outcomes"</li>
                    </ul>
                  </div>

                  <div className="border-l-4 border-blue-600 pl-4">
                    <h3 className="text-blue-400 tech-font text-lg mb-2">INTEGRATION STORY (5 minutes)</h3>
                    <ul className="space-y-1 text-slate-300">
                      <li>• "We connect to Epic, Cerner, Meditech - any EMR through standard APIs"</li>
                      <li>• "HL7 FHIR and DICOM protocols ensure seamless data exchange"</li>
                      <li>• "Your workflows remain unchanged - we enhance, don't disrupt"</li>
                      <li>• "Implementation typically takes 6-8 weeks with minimal IT overhead"</li>
                    </ul>
                  </div>

                  <div className="border-l-4 border-green-600 pl-4">
                    <h3 className="text-green-400 tech-font text-lg mb-2">AI CAPABILITIES (8 minutes)</h3>
                    <ul className="space-y-1 text-slate-300">
                      <li>• "Clinical documentation that understands context and generates SOAP notes"</li>
                      <li>• "Diagnosis support that analyzes patterns across thousands of similar cases"</li>
                      <li>• "Medical coding that captures maximum reimbursement while ensuring compliance"</li>
                      <li>• "Radiology AI that flags critical findings in real-time"</li>
                    </ul>
                  </div>

                  <div className="border-l-4 border-purple-600 pl-4">
                    <h3 className="text-purple-400 tech-font text-lg mb-2">ROI & OUTCOMES (3 minutes)</h3>
                    <ul className="space-y-1 text-slate-300">
                      <li>• "40% reduction in documentation time means more patient care"</li>
                      <li>• "15% increase in revenue capture through optimized coding"</li>
                      <li>• "25% fewer coding errors and denials"</li>
                      <li>• "Typical ROI achieved in 12-18 months"</li>
                    </ul>
                  </div>

                  <div className="border-l-4 border-red-600 pl-4">
                    <h3 className="text-red-400 tech-font text-lg mb-2">CLOSING (2 minutes)</h3>
                    <ul className="space-y-1 text-slate-300">
                      <li>• "The question isn't whether AI will transform healthcare - it's happening now"</li>
                      <li>• "The question is: will you lead the transformation or follow?"</li>
                      <li>• "Virtualis gives you a competitive advantage while improving patient outcomes"</li>
                      <li>• "Let's discuss how we can start your AI journey next quarter"</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Demo Scenarios */}
          <TabsContent value="demo-scenarios" className="space-y-6">
            <Card className="ai-card">
              <CardHeader>
                <CardTitle className="text-white tech-font">
                  DEMONSTRATION SCENARIOS
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="bg-slate-800 border-slate-600">
                    <CardHeader>
                      <CardTitle className="text-virtualis-gold tech-font text-lg">
                        SCENARIO 1: ER PATIENT INTAKE
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-slate-300 text-sm">
                        "Let me show you a typical ER scenario. A 65-year-old patient presents with chest pain..."
                      </p>
                      <div className="space-y-2">
                        <div className="text-xs">
                          <span className="text-blue-400 font-semibold">1. Patient Registration:</span>
                          <span className="text-slate-300"> Show EMR data auto-population</span>
                        </div>
                        <div className="text-xs">
                          <span className="text-green-400 font-semibold">2. AI Triage:</span>
                          <span className="text-slate-300"> Demonstrate risk assessment and priority scoring</span>
                        </div>
                        <div className="text-xs">
                          <span className="text-purple-400 font-semibold">3. Clinical Notes:</span>
                          <span className="text-slate-300"> Show AI-generated documentation</span>
                        </div>
                        <div className="text-xs">
                          <span className="text-orange-400 font-semibold">4. Orders:</span>
                          <span className="text-slate-300"> Display suggested orders and protocols</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-800 border-slate-600">
                    <CardHeader>
                      <CardTitle className="text-virtualis-gold tech-font text-lg">
                        SCENARIO 2: RADIOLOGY WORKFLOW
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-slate-300 text-sm">
                        "Here's how our AI enhances radiology interpretation and reporting..."
                      </p>
                      <div className="space-y-2">
                        <div className="text-xs">
                          <span className="text-blue-400 font-semibold">1. DICOM Import:</span>
                          <span className="text-slate-300"> Show seamless PACS integration</span>
                        </div>
                        <div className="text-xs">
                          <span className="text-green-400 font-semibold">2. AI Analysis:</span>
                          <span className="text-slate-300"> Demonstrate automated finding detection</span>
                        </div>
                        <div className="text-xs">
                          <span className="text-purple-400 font-semibold">3. Critical Results:</span>
                          <span className="text-slate-300"> Show real-time alerting system</span>
                        </div>
                        <div className="text-xs">
                          <span className="text-orange-400 font-semibold">4. Structured Reports:</span>
                          <span className="text-slate-300"> Display AI-generated reports</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-800 border-slate-600">
                    <CardHeader>
                      <CardTitle className="text-virtualis-gold tech-font text-lg">
                        SCENARIO 3: CODING & BILLING
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-slate-300 text-sm">
                        "Watch how we optimize revenue cycle management through intelligent coding..."
                      </p>
                      <div className="space-y-2">
                        <div className="text-xs">
                          <span className="text-blue-400 font-semibold">1. Encounter Review:</span>
                          <span className="text-slate-300"> Show clinical data extraction</span>
                        </div>
                        <div className="text-xs">
                          <span className="text-green-400 font-semibold">2. Code Suggestions:</span>
                          <span className="text-slate-300"> Demonstrate AI-powered ICD/CPT mapping</span>
                        </div>
                        <div className="text-xs">
                          <span className="text-purple-400 font-semibold">3. CDI Opportunities:</span>
                          <span className="text-slate-300"> Highlight documentation improvements</span>
                        </div>
                        <div className="text-xs">
                          <span className="text-orange-400 font-semibold">4. Claims Processing:</span>
                          <span className="text-slate-300"> Show automated submission workflow</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-800 border-slate-600">
                    <CardHeader>
                      <CardTitle className="text-virtualis-gold tech-font text-lg">
                        SCENARIO 4: LAB INTEGRATION
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-slate-300 text-sm">
                        "See how we transform laboratory data into actionable clinical insights..."
                      </p>
                      <div className="space-y-2">
                        <div className="text-xs">
                          <span className="text-blue-400 font-semibold">1. Order Management:</span>
                          <span className="text-slate-300"> Show bidirectional LIS communication</span>
                        </div>
                        <div className="text-xs">
                          <span className="text-green-400 font-semibold">2. Result Analysis:</span>
                          <span className="text-slate-300"> Demonstrate trend analysis and alerts</span>
                        </div>
                        <div className="text-xs">
                          <span className="text-purple-400 font-semibold">3. Critical Values:</span>
                          <span className="text-slate-300"> Show automated provider notification</span>
                        </div>
                        <div className="text-xs">
                          <span className="text-orange-400 font-semibold">4. Drug Interactions:</span>
                          <span className="text-slate-300"> Display medication safety checks</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Objection Handling */}
          <TabsContent value="objection-handling" className="space-y-6">
            <Card className="ai-card">
              <CardHeader>
                <CardTitle className="text-white tech-font">
                  COMMON OBJECTIONS & RESPONSES
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-6">
                  <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-600">
                    <h4 className="text-red-400 tech-font font-semibold mb-2">
                      "We already have AI tools in our EMR"
                    </h4>
                    <div className="text-slate-300 text-sm space-y-2">
                      <p><strong>Response:</strong> "That's great that you're already seeing AI value. Most EMR AI tools are narrow - they solve one specific problem. Virtualis is different because we're AI-native across your entire workflow."</p>
                      <p><strong>Follow-up:</strong> "Can your current AI generate complete clinical notes? Does it optimize your coding for maximum reimbursement? Does it analyze radiology images in real-time? We bring all of this together in one platform."</p>
                    </div>
                  </div>

                  <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-600">
                    <h4 className="text-red-400 tech-font font-semibold mb-2">
                      "This looks expensive and complicated to implement"
                    </h4>
                    <div className="text-slate-300 text-sm space-y-2">
                      <p><strong>Response:</strong> "I understand the concern about implementation complexity. That's exactly why we built our platform to integrate through standard APIs - HL7 FHIR, DICOM, REST APIs that your IT team already knows."</p>
                      <p><strong>ROI Focus:</strong> "The investment pays for itself quickly. Our clients typically see 12-18 month ROI through increased revenue capture and reduced labor costs. Let me show you our ROI calculator."</p>
                    </div>
                  </div>

                  <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-600">
                    <h4 className="text-red-400 tech-font font-semibold mb-2">
                      "We're concerned about AI accuracy and liability"
                    </h4>
                    <div className="text-slate-300 text-sm space-y-2">
                      <p><strong>Response:</strong> "Excellent question - safety is paramount in healthcare. Our AI is designed to augment, not replace, clinical decision-making. Every AI suggestion requires provider review and approval."</p>
                      <p><strong>Credentials:</strong> "We're SOC2 Type II certified, HIPAA compliant, and our AI models are trained on millions of de-identified clinical cases. We also carry professional liability insurance specifically for our AI recommendations."</p>
                    </div>
                  </div>

                  <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-600">
                    <h4 className="text-red-400 tech-font font-semibold mb-2">
                      "Our staff is already overwhelmed - they won't adopt new technology"
                    </h4>
                    <div className="text-slate-300 text-sm space-y-2">
                      <p><strong>Response:</strong> "That's exactly the problem we solve. Virtualis reduces workload, it doesn't add to it. Our AI handles the tedious work - documentation, coding, data entry - so your staff can focus on patient care."</p>
                      <p><strong>User Experience:</strong> "The interface is intuitive and works within your existing EMR workflow. Most users are productive within days, not weeks. We also provide comprehensive training and 24/7 support during rollout."</p>
                    </div>
                  </div>

                  <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-600">
                    <h4 className="text-red-400 tech-font font-semibold mb-2">
                      "We need to see references from similar organizations"
                    </h4>
                    <div className="text-slate-300 text-sm space-y-2">
                      <p><strong>Response:</strong> "Absolutely - references are crucial for a decision this important. I can connect you with three health systems similar to yours who've implemented Virtualis."</p>
                      <p><strong>Case Studies:</strong> "Let me share some specific outcomes: Regional Medical Center increased coding accuracy by 25% and reduced documentation time by 40%. Metro Hospital improved their revenue cycle by 15% in the first year."</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Resources */}
          <TabsContent value="resources" className="space-y-6">
            <Card className="ai-card">
              <CardHeader>
                <CardTitle className="text-white tech-font">
                  DOWNLOADABLE RESOURCES
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <Button 
                    className="ai-button-secondary tech-font justify-start h-auto p-4"
                    onClick={() => downloadResource('technical-specifications')}
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5" />
                      <div className="text-left">
                        <div className="font-semibold">Technical Specifications</div>
                        <div className="text-xs opacity-75">Complete API documentation and integration specs</div>
                      </div>
                    </div>
                    <Download className="h-4 w-4 ml-auto" />
                  </Button>

                  <Button 
                    className="ai-button-secondary tech-font justify-start h-auto p-4"
                    onClick={() => downloadResource('roi-calculator')}
                  >
                    <div className="flex items-center gap-3">
                      <Database className="h-5 w-5" />
                      <div className="text-left">
                        <div className="font-semibold">ROI Calculator</div>
                        <div className="text-xs opacity-75">Customizable spreadsheet for financial projections</div>
                      </div>
                    </div>
                    <Download className="h-4 w-4 ml-auto" />
                  </Button>

                  <Button 
                    className="ai-button-secondary tech-font justify-start h-auto p-4"
                    onClick={() => downloadResource('case-studies')}
                  >
                    <div className="flex items-center gap-3">
                      <Presentation className="h-5 w-5" />
                      <div className="text-left">
                        <div className="font-semibold">Case Studies</div>
                        <div className="text-xs opacity-75">Success stories from similar healthcare organizations</div>
                      </div>
                    </div>
                    <Download className="h-4 w-4 ml-auto" />
                  </Button>

                  <Button 
                    className="ai-button-secondary tech-font justify-start h-auto p-4"
                    onClick={() => downloadResource('security-compliance')}
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5" />
                      <div className="text-left">
                        <div className="font-semibold">Security & Compliance</div>
                        <div className="text-xs opacity-75">HIPAA, SOC2, and security architecture details</div>
                      </div>
                    </div>
                    <Download className="h-4 w-4 ml-auto" />
                  </Button>
                </div>

                <div className="mt-6 pt-6 border-t border-slate-600">
                  <h4 className="text-white tech-font font-semibold mb-3">EXTERNAL LINKS</h4>
                  <div className="space-y-2">
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => openExternalLink('https://hl7.org/fhir/')}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      HL7 FHIR Documentation
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => openExternalLink('https://www.dicomstandard.org/')}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      DICOM Standard Reference
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full justify-start"
                      onClick={() => openExternalLink('https://www.hhs.gov/hipaa/')}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      HIPAA Compliance Guidelines
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-8 text-center">
          <Button 
            onClick={() => setActiveView('overview')}
            className="ai-button tech-font"
          >
            Back to Main Demo
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Demo;
