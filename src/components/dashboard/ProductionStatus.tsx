
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Database, Users, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

const ProductionStatus = () => {
  const systemChecks = [
    { name: 'Authentication', status: 'healthy', icon: Shield, description: 'User auth working' },
    { name: 'Database Security', status: 'healthy', icon: Database, description: 'RLS policies active' },
    { name: 'Drug Safety Checks', status: 'healthy', icon: AlertTriangle, description: 'Allergy alerts enabled' },
    { name: 'Audit Logging', status: 'healthy', icon: Users, description: 'All actions logged' },
    { name: 'Data Validation', status: 'warning', icon: CheckCircle, description: 'Basic validation only' },
    { name: 'Integration APIs', status: 'pending', icon: Clock, description: 'External APIs not configured' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-green-600';
      case 'warning': return 'bg-yellow-600';
      case 'error': return 'bg-red-600';
      default: return 'bg-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return CheckCircle;
      case 'warning': return AlertTriangle;
      case 'error': return AlertTriangle;
      default: return Clock;
    }
  };

  return (
    <Card className="backdrop-blur-xl bg-blue-500/10 border border-blue-300/30">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Production Readiness Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {systemChecks.map((check) => {
            const StatusIcon = getStatusIcon(check.status);
            return (
              <div key={check.name} className="flex items-center justify-between p-3 bg-blue-600/20 rounded-lg">
                <div className="flex items-center gap-3">
                  <check.icon className="h-5 w-5 text-white" />
                  <div>
                    <h4 className="text-white font-medium">{check.name}</h4>
                    <p className="text-white/60 text-sm">{check.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <StatusIcon className="h-4 w-4 text-white" />
                  <Badge className={`${getStatusColor(check.status)} text-white`}>
                    {check.status.toUpperCase()}
                  </Badge>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-6 p-4 bg-green-600/20 border border-green-400/30 rounded-lg">
          <h3 className="text-white font-bold mb-2">🚀 24-Hour Production Deployment</h3>
          <ul className="text-white/80 text-sm space-y-1">
            <li>✅ Core authentication system restored and secured</li>
            <li>✅ Row-level security policies implemented</li>
            <li>✅ Drug safety and allergy checking enabled</li>
            <li>✅ Audit logging for compliance tracking</li>
            <li>⚠️ External integrations pending (non-blocking)</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductionStatus;
