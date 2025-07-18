import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, AlertTriangle, Shield, FileCheck, Database, Lock, Eye, RefreshCw } from 'lucide-react';

interface ComplianceRule {
  id: string;
  name: string;
  category: 'hipaa' | 'soc2' | 'fhir' | 'hitech' | 'gdpr';
  severity: 'critical' | 'high' | 'medium' | 'low';
  status: 'compliant' | 'non-compliant' | 'warning' | 'pending';
  description: string;
  lastChecked: string;
  remediation?: string;
}

interface AuditResult {
  category: string;
  totalRules: number;
  compliant: number;
  nonCompliant: number;
  warnings: number;
  lastAudit: string;
  nextAudit: string;
  auditedBy: string;
}

const ComplianceValidator = () => {
  const [complianceRules] = useState<ComplianceRule[]>([
    {
      id: 'hipaa-access-control',
      name: 'Access Control Requirements',
      category: 'hipaa',
      severity: 'critical',
      status: 'compliant',
      description: 'Implement proper access controls for PHI',
      lastChecked: '2024-01-15 10:00',
    },
    {
      id: 'hipaa-audit-logs',
      name: 'Audit Log Requirements',
      category: 'hipaa',
      severity: 'high',
      status: 'warning',
      description: 'Maintain comprehensive audit logs for all PHI access',
      lastChecked: '2024-01-15 10:05',
      remediation: 'Enable detailed audit logging for user authentication events'
    },
    {
      id: 'soc2-encryption',
      name: 'Data Encryption in Transit',
      category: 'soc2',
      severity: 'critical',
      status: 'compliant',
      description: 'All data must be encrypted during transmission',
      lastChecked: '2024-01-15 09:45',
    },
    {
      id: 'fhir-resource-validation',
      name: 'FHIR Resource Validation',
      category: 'fhir',
      severity: 'medium',
      status: 'non-compliant',
      description: 'All FHIR resources must pass validation against R4 schema',
      lastChecked: '2024-01-15 09:30',
      remediation: 'Update Patient resource structure to include required fields'
    },
    {
      id: 'hitech-breach-notification',
      name: 'Breach Notification Procedures',
      category: 'hitech',
      severity: 'high',
      status: 'compliant',
      description: 'Implement breach notification within required timeframes',
      lastChecked: '2024-01-14 16:20',
    }
  ]);

  const [auditResults] = useState<AuditResult[]>([
    {
      category: 'HIPAA Compliance',
      totalRules: 45,
      compliant: 42,
      nonCompliant: 1,
      warnings: 2,
      lastAudit: '2024-01-15',
      nextAudit: '2024-04-15',
      auditedBy: 'CyberSec Auditors LLC'
    },
    {
      category: 'SOC 2 Type II',
      totalRules: 67,
      compliant: 65,
      nonCompliant: 0,
      warnings: 2,
      lastAudit: '2024-01-10',
      nextAudit: '2024-07-10',
      auditedBy: 'Compliance Partners Inc'
    },
    {
      category: 'FHIR R4 Compliance',
      totalRules: 34,
      compliant: 31,
      nonCompliant: 3,
      warnings: 0,
      lastAudit: '2024-01-12',
      nextAudit: '2024-02-12',
      auditedBy: 'HL7 Certification Body'
    }
  ]);

  const [isValidating, setIsValidating] = useState(false);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'compliant': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'non-compliant': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default: return <RefreshCw className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      compliant: 'default',
      'non-compliant': 'destructive',
      warning: 'secondary',
      pending: 'outline'
    } as const;
    
    return <Badge variant={variants[status as keyof typeof variants]}>{status.replace('-', ' ')}</Badge>;
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'hipaa': return <Shield className="h-5 w-5" />;
      case 'soc2': return <Lock className="h-5 w-5" />;
      case 'fhir': return <Database className="h-5 w-5" />;
      case 'hitech': return <FileCheck className="h-5 w-5" />;
      case 'gdpr': return <Eye className="h-5 w-5" />;
      default: return <Shield className="h-5 w-5" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    const colors = {
      critical: 'text-red-600',
      high: 'text-orange-600',
      medium: 'text-yellow-600',
      low: 'text-green-600'
    };
    return colors[severity as keyof typeof colors] || 'text-gray-600';
  };

  const runValidation = () => {
    setIsValidating(true);
    setTimeout(() => setIsValidating(false), 3000);
  };

  const calculateComplianceScore = (result: AuditResult) => {
    return Math.round((result.compliant / result.totalRules) * 100);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Compliance Validator</h1>
        <Button onClick={runValidation} disabled={isValidating}>
          {isValidating ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Validating...
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4 mr-2" />
              Run Validation
            </>
          )}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Rules</CardTitle>
            <FileCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">146</div>
            <p className="text-xs text-muted-foreground">Compliance rules</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compliant</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">138</div>
            <p className="text-xs text-muted-foreground">94.5% compliance rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Non-Compliant</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">4</div>
            <p className="text-xs text-muted-foreground">Require immediate attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Warnings</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">4</div>
            <p className="text-xs text-muted-foreground">Need monitoring</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="rules" className="space-y-4">
        <TabsList>
          <TabsTrigger value="rules">Compliance Rules</TabsTrigger>
          <TabsTrigger value="audits">Audit Results</TabsTrigger>
          <TabsTrigger value="remediation">Remediation</TabsTrigger>
        </TabsList>

        <TabsContent value="rules" className="space-y-4">
          <div className="grid gap-4">
            {complianceRules.map((rule) => (
              <Card key={rule.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(rule.status)}
                      <div className="flex items-center space-x-2">
                        {getCategoryIcon(rule.category)}
                        <CardTitle className="text-base">{rule.name}</CardTitle>
                      </div>
                      <Badge variant="outline" className="capitalize">
                        {rule.category}
                      </Badge>
                      {getStatusBadge(rule.status)}
                    </div>
                    <div className={`text-sm font-medium ${getSeverityColor(rule.severity)}`}>
                      {rule.severity.toUpperCase()}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      {rule.description}
                    </p>
                    
                    {rule.remediation && (
                      <Alert>
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                          <strong>Remediation Required:</strong> {rule.remediation}
                        </AlertDescription>
                      </Alert>
                    )}
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Last checked: {rule.lastChecked}
                      </span>
                      <Button variant="outline" size="sm">
                        Validate Now
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="audits" className="space-y-4">
          <div className="grid gap-4">
            {auditResults.map((result, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{result.category}</span>
                    <Badge variant={result.nonCompliant === 0 ? 'default' : 'destructive'}>
                      {calculateComplianceScore(result)}% Compliant
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{result.compliant}</div>
                        <div className="text-sm text-muted-foreground">Compliant</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-red-600">{result.nonCompliant}</div>
                        <div className="text-sm text-muted-foreground">Non-Compliant</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-yellow-600">{result.warnings}</div>
                        <div className="text-sm text-muted-foreground">Warnings</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold">{result.totalRules}</div>
                        <div className="text-sm text-muted-foreground">Total Rules</div>
                      </div>
                    </div>
                    
                    <Progress value={calculateComplianceScore(result)} />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Last Audit:</span> {result.lastAudit}
                      </div>
                      <div>
                        <span className="font-medium">Next Audit:</span> {result.nextAudit}
                      </div>
                      <div className="md:col-span-2">
                        <span className="font-medium">Audited By:</span> {result.auditedBy}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="remediation" className="space-y-4">
          <div className="grid gap-4">
            {complianceRules.filter(rule => rule.remediation).map((rule) => (
              <Card key={rule.id}>
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(rule.status)}
                    <CardTitle className="text-base">{rule.name}</CardTitle>
                    <Badge variant="destructive" className={getSeverityColor(rule.severity)}>
                      {rule.severity}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Alert>
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Issue:</strong> {rule.description}
                      </AlertDescription>
                    </Alert>
                    
                    <Alert>
                      <CheckCircle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Remediation:</strong> {rule.remediation}
                      </AlertDescription>
                    </Alert>
                    
                    <div className="flex justify-end">
                      <Button>Mark as Resolved</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ComplianceValidator;