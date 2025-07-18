import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, XCircle, Clock, AlertTriangle, Shield, Zap, FileCheck, Database } from 'lucide-react';

interface CertificationStatus {
  vendor: string;
  status: 'certified' | 'pending' | 'failed' | 'not-started';
  completedTests: number;
  totalTests: number;
  lastUpdated: string;
  expiryDate?: string;
  requirements: string[];
}

const EMRCertificationDashboard = () => {
  const [certifications] = useState<CertificationStatus[]>([
    {
      vendor: 'Epic',
      status: 'certified',
      completedTests: 95,
      totalTests: 95,
      lastUpdated: '2024-01-15',
      expiryDate: '2025-01-15',
      requirements: ['App Orchard Certification', 'SMART on FHIR', 'OAuth 2.0', 'HL7 FHIR R4']
    },
    {
      vendor: 'Cerner',
      status: 'pending',
      completedTests: 78,
      totalTests: 92,
      lastUpdated: '2024-01-10',
      requirements: ['SMART Certification', 'FHIR R4 Compliance', 'Security Audit', 'Performance Testing']
    },
    {
      vendor: 'Meditech',
      status: 'pending',
      completedTests: 45,
      totalTests: 67,
      lastUpdated: '2024-01-08',
      requirements: ['Integration Testing', 'API Compliance', 'Data Validation', 'Security Review']
    },
    {
      vendor: 'AllScripts',
      status: 'not-started',
      completedTests: 0,
      totalTests: 58,
      lastUpdated: '2024-01-01',
      requirements: ['Developer Program', 'API Integration', 'Compliance Testing', 'Security Audit']
    }
  ]);

  const [testResults] = useState({
    security: { passed: 47, failed: 3, pending: 5 },
    performance: { passed: 23, failed: 1, pending: 2 },
    compliance: { passed: 89, failed: 2, pending: 8 },
    integration: { passed: 156, failed: 4, pending: 12 }
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'certified': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'failed': return <XCircle className="h-4 w-4 text-red-500" />;
      default: return <AlertTriangle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      certified: 'default',
      pending: 'secondary',
      failed: 'destructive',
      'not-started': 'outline'
    } as const;
    
    return <Badge variant={variants[status as keyof typeof variants]}>{status.replace('-', ' ')}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">EMR Certification Dashboard</h1>
        <Button>Run Full Test Suite</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Certifications</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <p className="text-xs text-muted-foreground">EMR vendors</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Certified</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">1</div>
            <p className="text-xs text-muted-foreground">Epic certified</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">2</div>
            <p className="text-xs text-muted-foreground">Cerner, Meditech</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Test Success Rate</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94.2%</div>
            <p className="text-xs text-muted-foreground">Overall passing rate</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="certifications" className="space-y-4">
        <TabsList>
          <TabsTrigger value="certifications">Certifications</TabsTrigger>
          <TabsTrigger value="testing">Test Results</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="certifications" className="space-y-4">
          <div className="grid gap-4">
            {certifications.map((cert) => (
              <Card key={cert.vendor}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(cert.status)}
                      <CardTitle className="text-lg">{cert.vendor}</CardTitle>
                      {getStatusBadge(cert.status)}
                    </div>
                    {cert.expiryDate && (
                      <div className="text-sm text-muted-foreground">
                        Expires: {cert.expiryDate}
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Test Progress</span>
                        <span>{cert.completedTests}/{cert.totalTests}</span>
                      </div>
                      <Progress value={(cert.completedTests / cert.totalTests) * 100} />
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Requirements</h4>
                      <div className="flex flex-wrap gap-2">
                        {cert.requirements.map((req, index) => (
                          <Badge key={index} variant="outline">{req}</Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Last updated: {cert.lastUpdated}
                      </span>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="testing" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(testResults).map(([category, results]) => (
              <Card key={category}>
                <CardHeader>
                  <CardTitle className="text-base capitalize">{category} Tests</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-green-600">Passed</span>
                      <span className="font-medium">{results.passed}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-red-600">Failed</span>
                      <span className="font-medium">{results.failed}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-yellow-600">Pending</span>
                      <span className="font-medium">{results.pending}</span>
                    </div>
                    <div className="pt-2">
                      <Progress 
                        value={(results.passed / (results.passed + results.failed + results.pending)) * 100} 
                        className="h-2"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-4">
          <div className="grid gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileCheck className="h-5 w-5" />
                  <span>HIPAA Compliance</span>
                  <Badge variant="default">Certified</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">Last audit: December 2023</p>
                <Progress value={100} className="h-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5" />
                  <span>SOC 2 Type II</span>
                  <Badge variant="default">Active</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">Expires: June 2024</p>
                <Progress value={85} className="h-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Database className="h-5 w-5" />
                  <span>HL7 FHIR R4</span>
                  <Badge variant="default">Compliant</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-2">All endpoints validated</p>
                <Progress value={98} className="h-2" />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Response Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">127ms</div>
                <p className="text-xs text-muted-foreground">Average API response</p>
                <Progress value={85} className="h-2 mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Throughput</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2,500</div>
                <p className="text-xs text-muted-foreground">Requests per minute</p>
                <Progress value={92} className="h-2 mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Uptime</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">99.9%</div>
                <p className="text-xs text-muted-foreground">Last 30 days</p>
                <Progress value={99.9} className="h-2 mt-2" />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EMRCertificationDashboard;