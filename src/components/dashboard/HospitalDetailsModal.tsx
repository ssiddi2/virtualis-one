import React from "react";
import {
  Hospital, Wifi, Clock, Shield, Activity, Users, Brain, Mail, Phone,
  AlertTriangle, CheckCircle, Settings, ChevronDown
} from "lucide-react";
import {
  Card, CardContent, CardHeader, CardTitle
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { EnhancedHospital } from "@/types/hospital";

// Reusable Badge Generator
const getStatusBadge = (label: string, status: string) => {
  const colors: Record<string, string> = {
    online: 'bg-green-600/20 text-green-300 border-green-400/30',
    degraded: 'bg-yellow-600/20 text-yellow-300 border-yellow-400/30',
    offline: 'bg-red-600/20 text-red-300 border-red-400/30',
    maintenance: 'bg-blue-600/20 text-blue-300 border-blue-400/30',
    default: 'bg-slate-600/20 text-slate-300 border-slate-400/30'
  }
  return <Badge className={`${colors[status] || colors.default} px-2 py-1 rounded-full text-xs font-medium border`}>{label}</Badge>
}

interface MetricCardProps {
  icon: React.ElementType;
  label: string;
  value: string | number;
}

const MetricCard: React.FC<MetricCardProps> = ({ icon: Icon, label, value }) => (
  <Card className="virtualis-card">
    <CardContent className="p-4 text-center">
      <Icon className="h-6 w-6 mx-auto mb-2 text-virtualis-gold" />
      <div className="text-2xl font-bold text-white">{value}</div>
      <div className="text-xs text-slate-400">{label}</div>
    </CardContent>
  </Card>
)

interface ContactCardProps {
  contact: {
    name: string;
    role: string;
    email: string;
    phone: string;
    availability: string;
  };
}

const ContactCard: React.FC<ContactCardProps> = ({ contact }) => (
  <Card className="virtualis-card">
    <CardContent className="p-4">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 bg-virtualis-gold/20 rounded-full flex items-center justify-center">
          <Users className="h-5 w-5 text-virtualis-gold" />
        </div>
        <div>
          <div className="text-white font-medium">{contact.name}</div>
          <div className="text-slate-400 text-sm">{contact.role}</div>
        </div>
      </div>
      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2 text-white">
          <Mail className="h-3 w-3 text-slate-400" /> {contact.email}
        </div>
        <div className="flex items-center gap-2 text-white">
          <Phone className="h-3 w-3 text-slate-400" /> {contact.phone}
        </div>
        <div className="flex items-center gap-2 text-white">
          <Clock className="h-3 w-3 text-slate-400" /> {contact.availability}
        </div>
      </div>
    </CardContent>
  </Card>
)

interface AICopilotPanelProps {
  aiData?: {
    summary?: string;
    orders?: string[];
  };
}

const AICopilotPanel: React.FC<AICopilotPanelProps> = ({ aiData }) => (
  <Card className="virtualis-card">
    <CardHeader>
      <CardTitle className="text-white text-lg flex items-center gap-2">
        <Brain className="h-5 w-5 text-purple-400" /> Virtualis AI Copilot
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-2 text-sm text-white/80">
      {aiData?.summary && (
        <div className="text-white">
          <p className="font-medium">Suggested Note:</p>
          <p className="text-sm italic">"{aiData.summary}"</p>
        </div>
      )}
      {aiData?.orders && (
        <div>
          <p className="font-medium">Suggested Orders:</p>
          <ul className="list-disc list-inside">
            {aiData.orders.map((order, i) => <li key={i}>{order}</li>)}
          </ul>
        </div>
      )}
    </CardContent>
  </Card>
)

interface HospitalDetailsModalProps {
  hospital: EnhancedHospital | null;
  open: boolean;
  onClose: () => void;
}

const HospitalDetailsModal: React.FC<HospitalDetailsModalProps> = ({ hospital, open, onClose }) => {
  if (!hospital) return null;

  // Mock data for features not in the current hospital type
  const mockContacts = [
    {
      name: "Dr. Sarah Johnson",
      role: "Chief Medical Officer",
      email: "sarah.johnson@hospital.org",
      phone: "(555) 123-4567",
      availability: "24/7 On-Call"
    },
    {
      name: "Mark Thompson",
      role: "IT Director",
      email: "mark.thompson@hospital.org", 
      phone: "(555) 234-5678",
      availability: "Mon-Fri 8AM-6PM"
    }
  ];

  const mockCertifications = [
    { name: "HIPAA Compliance", status: "online" },
    { name: "SOC 2 Type II", status: "online" },
    { name: "HITECH Compliance", status: "online" }
  ];

  const mockAuditCompliance = {
    lastAudit: "2024-01-15",
    score: 95
  };

  const mockAIData = {
    summary: "High-performing facility with excellent patient outcomes. AI suggests optimizing workflow during peak hours.",
    orders: [
      "Schedule maintenance during low-traffic periods",
      "Increase staffing for evening shifts",
      "Review medication dispensing protocols"
    ]
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl virtualis-modal">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Hospital className="h-5 w-5 text-virtualis-gold" /> {hospital.name}
            {getStatusBadge(hospital.status, hospital.status)}
          </DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="overview">
          <TabsList className="grid grid-cols-6 bg-slate-800 mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="contacts">Contacts</TabsTrigger>
            <TabsTrigger value="copilot">AI Copilot</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <MetricCard icon={Users} label="Active Patients" value={hospital.activePatients} />
              <MetricCard icon={Activity} label="Uptime" value={`${hospital.uptime}%`} />
              <MetricCard icon={Clock} label="Response Time" value={`${hospital.responseTime}ms`} />
              <MetricCard icon={Shield} label="Data Quality" value={`${hospital.dataQuality}%`} />
            </div>
          </TabsContent>

          <TabsContent value="system">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="virtualis-card">
                <CardHeader>
                  <CardTitle className="text-white">Modules & Integrations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {hospital.supportedModules?.slice(0, 3).map((module, i) => (
                    <div key={i} className="flex justify-between items-center text-sm">
                      <span className="text-white">{module.name}</span>
                      <div className="flex gap-2">
                        {getStatusBadge(module.status, module.status)}
                        <span className="text-slate-400 text-xs">{module.version}</span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
              
              <Card className="virtualis-card">
                <CardHeader>
                  <CardTitle className="text-white">AI Capabilities</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {hospital.aiCapabilities?.slice(0, 3).map((ai, i) => (
                    <div key={i} className="flex justify-between items-center text-sm">
                      <span className="text-white">{ai.name}</span>
                      <div className="flex gap-2">
                        <Badge className={`text-xs ${ai.enabled ? 'bg-green-600/20 text-green-300' : 'bg-gray-600/20 text-gray-300'}`}>
                          {ai.confidence}% confidence
                        </Badge>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="performance">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="virtualis-card">
                <CardHeader>
                  <CardTitle className="text-white">Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {hospital.performanceMetrics?.slice(0, 4).map((metric, i) => (
                    <div key={i} className="flex justify-between items-center text-sm">
                      <span className="text-white">{metric.metric}</span>
                      <div className="flex gap-2 items-center">
                        <span className="text-virtualis-gold">{metric.value}{metric.unit}</span>
                        <Badge className={`text-xs ${
                          metric.status === 'good' ? 'bg-green-600/20 text-green-300' :
                          metric.status === 'warning' ? 'bg-yellow-600/20 text-yellow-300' :
                          'bg-red-600/20 text-red-300'
                        }`}>
                          {metric.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
              
              <Card className="virtualis-card">
                <CardHeader>
                  <CardTitle className="text-white">System Health</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-white">Backup Status:</span>
                    <Badge className={`text-xs ${
                      hospital.backupStatus?.status === 'successful' ? 'bg-green-600/20 text-green-300' :
                      hospital.backupStatus?.status === 'failed' ? 'bg-red-600/20 text-red-300' :
                      'bg-yellow-600/20 text-yellow-300'
                    }`}>
                      {hospital.backupStatus?.status}
                    </Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white">DR Status:</span>
                    <Badge className={`text-xs ${
                      hospital.disasterRecovery?.status === 'passed' ? 'bg-green-600/20 text-green-300' :
                      'bg-yellow-600/20 text-yellow-300'
                    }`}>
                      {hospital.disasterRecovery?.status}
                    </Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white">Storage:</span>
                    <span className="text-virtualis-gold">{hospital.storageUsed}GB / {hospital.storageLimit}GB</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white">Active Users:</span>
                    <span className="text-virtualis-gold">{hospital.activeUsers} / {hospital.userCount}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="security">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="virtualis-card">
                <CardHeader>
                  <CardTitle className="text-white">Security & Compliance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  {getStatusBadge(hospital.securityLevel, hospital.securityLevel)}
                  <div className="flex justify-between text-white">
                    <span>Compliance:</span>
                    <span>{hospital.complianceStatus}</span>
                  </div>
                  <div className="flex justify-between text-white">
                    <span>Last Audit:</span>
                    <span>{hospital.auditCompliance?.lastAudit || mockAuditCompliance.lastAudit}</span>
                  </div>
                  <div className="flex justify-between text-white">
                    <span>Score:</span>
                    <span>{hospital.auditCompliance?.score || mockAuditCompliance.score}/100</span>
                  </div>
                </CardContent>
              </Card>
              <Card className="virtualis-card">
                <CardHeader>
                  <CardTitle className="text-white">Certifications</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {(hospital.certifications && hospital.certifications.length > 0 ? hospital.certifications : mockCertifications).map((cert, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span className="text-white">{cert.name}</span>
                      {getStatusBadge(cert.status, cert.status)}
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="contacts">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(hospital.contacts && hospital.contacts.length > 0 ? hospital.contacts : mockContacts).map((c, i) => (
                <ContactCard key={i} contact={{
                  name: c.name,
                  role: c.role,
                  email: c.email,
                  phone: c.phone,
                  availability: c.availability
                }} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="copilot">
            <AICopilotPanel aiData={mockAIData} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

export default HospitalDetailsModal;