import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Play, Pause, RotateCcw, CheckCircle, XCircle, Clock, FileText, Download } from 'lucide-react';

interface TestCase {
  id: string;
  name: string;
  category: 'integration' | 'security' | 'performance' | 'compliance';
  status: 'passed' | 'failed' | 'running' | 'pending';
  duration: number;
  lastRun: string;
  description: string;
  requirements: string[];
}

interface TestSuite {
  id: string;
  name: string;
  vendor: string;
  totalTests: number;
  passedTests: number;
  failedTests: number;
  runningTests: number;
  lastRun: string;
  status: 'completed' | 'running' | 'failed' | 'pending';
}

const EMRTestSuite = () => {
  const [testSuites] = useState<TestSuite[]>([
    {
      id: 'epic-integration',
      name: 'Epic Integration Suite',
      vendor: 'Epic',
      totalTests: 95,
      passedTests: 92,
      failedTests: 2,
      runningTests: 1,
      lastRun: '2024-01-15 14:30',
      status: 'running'
    },
    {
      id: 'cerner-security',
      name: 'Cerner Security Tests',
      vendor: 'Cerner',
      totalTests: 67,
      passedTests: 65,
      failedTests: 2,
      runningTests: 0,
      lastRun: '2024-01-14 16:45',
      status: 'completed'
    },
    {
      id: 'meditech-performance',
      name: 'Meditech Performance Suite',
      vendor: 'Meditech',
      totalTests: 34,
      passedTests: 30,
      failedTests: 4,
      runningTests: 0,
      lastRun: '2024-01-13 10:15',
      status: 'failed'
    }
  ]);

  const [testCases] = useState<TestCase[]>([
    {
      id: 'epic-fhir-patient',
      name: 'FHIR Patient Resource Test',
      category: 'integration',
      status: 'passed',
      duration: 2340,
      lastRun: '2024-01-15 14:25',
      description: 'Validates FHIR Patient resource CRUD operations',
      requirements: ['FHIR R4', 'OAuth 2.0', 'Patient Read/Write Access']
    },
    {
      id: 'epic-oauth-flow',
      name: 'OAuth 2.0 Authorization Flow',
      category: 'security',
      status: 'running',
      duration: 0,
      lastRun: '2024-01-15 14:30',
      description: 'Tests complete OAuth 2.0 authorization code flow',
      requirements: ['OAuth 2.0', 'SMART on FHIR', 'JWT Validation']
    },
    {
      id: 'cerner-hl7-inbound',
      name: 'HL7 Inbound Message Processing',
      category: 'integration',
      status: 'failed',
      duration: 5670,
      lastRun: '2024-01-14 16:20',
      description: 'Processes inbound HL7 v2.x messages',
      requirements: ['HL7 v2.x', 'Message Parsing', 'Error Handling']
    },
    {
      id: 'meditech-load-test',
      name: 'High Volume Load Test',
      category: 'performance',
      status: 'passed',
      duration: 45000,
      lastRun: '2024-01-13 09:30',
      description: 'Tests system under high concurrent user load',
      requirements: ['Load Testing', 'Performance Monitoring', 'Resource Utilization']
    }
  ]);

  const [isRunning, setIsRunning] = useState(false);
  const [currentProgress, setCurrentProgress] = useState(73);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed': return <XCircle className="h-4 w-4 text-red-500" />;
      case 'running': return <Clock className="h-4 w-4 text-blue-500 animate-spin" />;
      default: return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      passed: 'default',
      failed: 'destructive',
      running: 'secondary',
      pending: 'outline',
      completed: 'default'
    } as const;
    
    return <Badge variant={variants[status as keyof typeof variants]}>{status}</Badge>;
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      integration: 'bg-blue-100 text-blue-800',
      security: 'bg-red-100 text-red-800',
      performance: 'bg-green-100 text-green-800',
      compliance: 'bg-purple-100 text-purple-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const formatDuration = (ms: number) => {
    if (ms === 0) return 'Running...';
    const seconds = Math.floor(ms / 1000);
    return `${seconds}s`;
  };

  const runTestSuite = () => {
    setIsRunning(true);
    // Simulate test progress
    const interval = setInterval(() => {
      setCurrentProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsRunning(false);
          return 100;
        }
        return prev + Math.random() * 10;
      });
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">EMR Test Suite</h1>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button onClick={runTestSuite} disabled={isRunning}>
            {isRunning ? (
              <>
                <Pause className="h-4 w-4 mr-2" />
                Running...
              </>
            ) : (
              <>
                <Play className="h-4 w-4 mr-2" />
                Run All Tests
              </>
            )}
          </Button>
        </div>
      </div>

      {isRunning && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5 animate-spin" />
              <span>Test Execution in Progress</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Overall Progress</span>
                <span>{Math.round(currentProgress)}%</span>
              </div>
              <Progress value={currentProgress} />
              <p className="text-sm text-muted-foreground">
                Running Epic OAuth 2.0 Authorization Flow test...
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="suites" className="space-y-4">
        <TabsList>
          <TabsTrigger value="suites">Test Suites</TabsTrigger>
          <TabsTrigger value="cases">Individual Tests</TabsTrigger>
          <TabsTrigger value="reports">Test Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="suites" className="space-y-4">
          <div className="grid gap-4">
            {testSuites.map((suite) => (
              <Card key={suite.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(suite.status)}
                      <CardTitle className="text-lg">{suite.name}</CardTitle>
                      {getStatusBadge(suite.status)}
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <FileText className="h-4 w-4 mr-1" />
                        View Report
                      </Button>
                      <Button variant="outline" size="sm">
                        <RotateCcw className="h-4 w-4 mr-1" />
                        Rerun
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{suite.passedTests}</div>
                      <div className="text-sm text-muted-foreground">Passed</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600">{suite.failedTests}</div>
                      <div className="text-sm text-muted-foreground">Failed</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{suite.runningTests}</div>
                      <div className="text-sm text-muted-foreground">Running</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{suite.totalTests}</div>
                      <div className="text-sm text-muted-foreground">Total</div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Success Rate</span>
                      <span>{Math.round((suite.passedTests / suite.totalTests) * 100)}%</span>
                    </div>
                    <Progress value={(suite.passedTests / suite.totalTests) * 100} />
                    <div className="text-sm text-muted-foreground">
                      Last run: {suite.lastRun} • Vendor: {suite.vendor}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="cases" className="space-y-4">
          <div className="grid gap-4">
            {testCases.map((testCase) => (
              <Card key={testCase.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(testCase.status)}
                      <CardTitle className="text-base">{testCase.name}</CardTitle>
                      <Badge className={getCategoryColor(testCase.category)}>
                        {testCase.category}
                      </Badge>
                      {getStatusBadge(testCase.status)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {formatDuration(testCase.duration)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      {testCase.description}
                    </p>
                    
                    <div>
                      <h4 className="font-medium text-sm mb-2">Requirements</h4>
                      <div className="flex flex-wrap gap-1">
                        {testCase.requirements.map((req, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {req}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Last run: {testCase.lastRun}
                      </span>
                      <Button variant="outline" size="sm">
                        Run Test
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <div className="grid gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Test Execution Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-3xl font-bold text-green-600">187</div>
                      <div className="text-sm text-muted-foreground">Total Passed</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-3xl font-bold text-red-600">8</div>
                      <div className="text-sm text-muted-foreground">Total Failed</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-3xl font-bold">95.9%</div>
                      <div className="text-sm text-muted-foreground">Success Rate</div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span>Last full test run: January 15, 2024 at 2:30 PM</span>
                    <Button>
                      <Download className="h-4 w-4 mr-2" />
                      Download Full Report
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EMRTestSuite;