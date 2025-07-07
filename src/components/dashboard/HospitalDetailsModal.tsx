import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Hospital, 
  Users, 
  Activity, 
  Clock, 
  Shield, 
  Brain, 
  CheckCircle, 
  X, 
  TrendingUp, 
  TrendingDown, 
  Mail, 
  Phone 
} from 'lucide-react';
import { EnhancedHospital } from '@/types/hospital';

interface HospitalDetailModalProps {
  hospital: EnhancedHospital;
  showHospitalDetails: string | null;
  setShowHospitalDetails: (id: string | null) => void;
}

export const HospitalDetailModal: React.FC<HospitalDetailModalProps> = ({ 
  hospital, 
  showHospitalDetails, 
  setShowHospitalDetails 
}) => (
  <Dialog open={showHospitalDetails === hospital.id} onOpenChange={() => setShowHospitalDetails(null)}>
    <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-900 border-slate-700 text-white">
      <DialogHeader>
        <DialogTitle className="text-2xl flex items-center gap-3">
          <Hospital className="h-6 w-6 text-yellow-400" />
          {hospital.name}
        </DialogTitle>
        <DialogDescription className="text-slate-300">
          {hospital.location} • {hospital.address}, {hospital.city}, {hospital.state} {hospital.zipCode}
        </DialogDescription>
      </DialogHeader>
      
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5 bg-slate-800">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="virtualis">Virtualis AI</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="contacts">Contacts</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-4 text-center">
                <Users className="h-6 w-6 mx-auto mb-2 text-blue-400" />
                <div className="text-2xl font-bold text-white">{hospital.activePatients}</div>
                <div className="text-xs text-slate-400">Active Patients</div>
              </CardContent>
            </Card>
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-4 text-center">
                <Activity className="h-6 w-6 mx-auto mb-2 text-green-400" />
                <div className="text-2xl font-bold text-white">{hospital.uptime}%</div>
                <div className="text-xs text-slate-400">Uptime</div>
              </CardContent>
            </Card>
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-4 text-center">
                <Clock className="h-6 w-6 mx-auto mb-2 text-yellow-400" />
                <div className="text-2xl font-bold text-white">{hospital.responseTime}ms</div>
                <div className="text-xs text-slate-400">Response Time</div>
              </CardContent>
            </Card>
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-4 text-center">
                <Shield className="h-6 w-6 mx-auto mb-2 text-purple-400" />
                <div className="text-2xl font-bold text-white">{hospital.dataQuality}%</div>
                <div className="text-xs text-slate-400">Data Quality</div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white text-lg">System Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">EMR System:</span>
                  <span className="text-white font-medium">{hospital.emrType} {hospital.emrVersion}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Authentication:</span>
                  <span className="text-white">{hospital.authMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">FHIR Version:</span>
                  <span className="text-white">{hospital.fhirVersion || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Last Sync:</span>
                  <span className="text-white">{hospital.lastSync}</span>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white text-lg">Resource Usage</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-400">CPU Usage</span>
                    <span className="text-white">{hospital.systemLoad}%</span>
                  </div>
                  <Progress value={hospital.systemLoad} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-400">Storage</span>
                    <span className="text-white">{hospital.storageUsed}TB / {hospital.storageLimit}TB</span>
                  </div>
                  <Progress value={(hospital.storageUsed / hospital.storageLimit) * 100} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-400">Users</span>
                    <span className="text-white">{hospital.activeUsers} / {hospital.userCount}</span>
                  </div>
                  <Progress value={(hospital.activeUsers / hospital.userCount) * 100} className="h-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {hospital.performanceMetrics.map((metric, index) => (
              <Card key={index} className="bg-slate-800 border-slate-700">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-400 text-sm">{metric.metric}</span>
                    <div className="flex items-center gap-1">
                      {metric.trend === 'up' && <TrendingUp className="h-3 w-3 text-green-400" />}
                      {metric.trend === 'down' && <TrendingDown className="h-3 w-3 text-red-400" />}
                      {metric.trend === 'stable' && <div className="h-3 w-3 rounded-full bg-yellow-400" />}
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">
                    {metric.value} {metric.unit}
                  </div>
                  <div className="text-xs text-slate-400">
                    Benchmark: {metric.benchmark} {metric.unit}
                  </div>
                  <Badge className={
                    metric.status === 'good' ? 'bg-green-600/20 text-green-300' :
                    metric.status === 'warning' ? 'bg-yellow-600/20 text-yellow-300' :
                    'bg-red-600/20 text-red-300'
                  }>
                    {metric.status}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="virtualis" className="space-y-4">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Brain className="h-5 w-5 text-purple-400" />
                Virtualis AI Status
                {hospital.virtualisEnabled ? (
                  <Badge className="bg-green-600/20 text-green-300 border-green-400/30">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Enabled
                  </Badge>
                ) : (
                  <Badge className="bg-red-600/20 text-red-300 border-red-400/30">
                    <X className="w-3 h-3 mr-1" />
                    Disabled
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {hospital.virtualisFeatures.map((feature, index) => (
                  <div key={index} className="bg-slate-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-medium">{feature.name}</span>
                      <Badge className={
                        feature.status === 'active' ? 'bg-green-600/20 text-green-300' :
                        feature.status === 'updating' ? 'bg-yellow-600/20 text-yellow-300' :
                        'bg-gray-600/20 text-gray-300'
                      }>
                        {feature.status}
                      </Badge>
                    </div>
                    <div className="text-sm text-slate-400 mb-2">
                      Version: {feature.version} • Updated: {feature.lastUpdate}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400">Usage:</span>
                      <div className="flex-1">
                        <Progress value={feature.usage} className="h-2" />
                      </div>
                      <span className="text-xs text-white">{feature.usage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Security Level</CardTitle>
              </CardHeader>
              <CardContent>
                <Badge className={
                  hospital.securityLevel === 'high' ? 'bg-green-600/20 text-green-300' :
                  hospital.securityLevel === 'medium' ? 'bg-yellow-600/20 text-yellow-300' :
                  'bg-red-600/20 text-red-300'
                }>
                  {hospital.securityLevel.toUpperCase()}
                </Badge>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Compliance Status:</span>
                    <span className="text-white">{hospital.complianceStatus}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Last Audit:</span>
                    <span className="text-white">{hospital.auditCompliance.lastAudit}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Audit Score:</span>
                    <span className="text-white">{hospital.auditCompliance.score}/100</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Certifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {hospital.certifications.map((cert, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-white text-sm">{cert.name}</span>
                    <Badge className={
                      cert.status === 'active' ? 'bg-green-600/20 text-green-300' :
                      cert.status === 'expired' ? 'bg-red-600/20 text-red-300' :
                      'bg-yellow-600/20 text-yellow-300'
                    }>
                      {cert.status}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="contacts" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {hospital.contacts.map((contact, index) => (
              <Card key={index} className="bg-slate-800 border-slate-700">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-blue-600/20 rounded-full flex items-center justify-center">
                      <Users className="h-5 w-5 text-blue-400" />
                    </div>
                    <div>
                      <div className="text-white font-medium">{contact.name}</div>
                      <div className="text-slate-400 text-sm">{contact.role}</div>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Mail className="h-3 w-3 text-slate-400" />
                      <span className="text-white">{contact.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-3 w-3 text-slate-400" />
                      <span className="text-white">{contact.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-3 w-3 text-slate-400" />
                      <span className="text-white">{contact.availability}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </DialogContent>
  </Dialog>
);