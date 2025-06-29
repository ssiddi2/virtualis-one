
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Shield, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Calendar,
  DollarSign,
  User
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PriorAuthManagerProps {
  hospitalId: string;
}

const PriorAuthManager = ({ hospitalId }: PriorAuthManagerProps) => {
  const { toast } = useToast();
  const [showNewAuth, setShowNewAuth] = useState(false);

  // Mock data
  const priorAuths = [
    {
      id: '1',
      patient_name: 'Maria Garcia',
      service_description: 'MRI Brain with contrast',
      service_code: '70553',
      insurance_provider: 'Blue Cross Blue Shield',
      status: 'pending',
      requested_date: '2024-06-28',
      estimated_cost: 2400.00,
      auth_number: null
    },
    {
      id: '2',
      patient_name: 'Robert Chen',
      service_description: 'Cardiac Catheterization',
      service_code: '93458',
      insurance_provider: 'Aetna',
      status: 'approved',
      requested_date: '2024-06-25',
      approval_date: '2024-06-27',
      estimated_cost: 8500.00,
      auth_number: 'AUTH-789123'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/20 text-yellow-200 border-yellow-400/30';
      case 'approved': return 'bg-green-500/20 text-green-200 border-green-400/30';
      case 'denied': return 'bg-red-500/20 text-red-200 border-red-400/30';
      case 'expired': return 'bg-gray-500/20 text-gray-200 border-gray-400/30';
      default: return 'bg-blue-500/20 text-blue-200 border-blue-400/30';
    }
  };

  const handleSubmitAuth = () => {
    toast({
      title: "Prior Authorization Submitted",
      description: "The prior authorization request has been submitted to the insurance provider.",
    });
    setShowNewAuth(false);
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="backdrop-blur-xl bg-yellow-500/20 border border-yellow-300/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/70">Pending Auths</p>
                <p className="text-2xl font-bold text-white">12</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-300" />
            </div>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-xl bg-green-500/20 border border-green-300/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/70">Approved</p>
                <p className="text-2xl font-bold text-white">28</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-300" />
            </div>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-xl bg-red-500/20 border border-red-300/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/70">Denied</p>
                <p className="text-2xl font-bold text-white">5</p>
              </div>
              <XCircle className="h-8 w-8 text-red-300" />
            </div>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-xl bg-blue-500/20 border border-blue-300/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/70">Approval Rate</p>
                <p className="text-2xl font-bold text-white">85%</p>
              </div>
              <Shield className="h-8 w-8 text-blue-300" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* New Auth Button */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Prior Authorizations</h2>
        <Button 
          onClick={() => setShowNewAuth(true)}
          className="bg-green-600 hover:bg-green-700"
        >
          New Prior Auth Request
        </Button>
      </div>

      {/* New Auth Form */}
      {showNewAuth && (
        <Card className="backdrop-blur-xl bg-blue-500/20 border border-blue-300/30">
          <CardHeader>
            <CardTitle className="text-white">New Prior Authorization Request</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-white/70 text-sm mb-2">Patient</label>
                <Select>
                  <SelectTrigger className="bg-blue-600/20 border-blue-400/30 text-white">
                    <SelectValue placeholder="Select patient" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="patient1">Maria Garcia</SelectItem>
                    <SelectItem value="patient2">Robert Chen</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-white/70 text-sm mb-2">Service Code</label>
                <Input 
                  placeholder="e.g., 70553"
                  className="bg-blue-600/20 border-blue-400/30 text-white"
                />
              </div>
            </div>
            <div>
              <label className="block text-white/70 text-sm mb-2">Service Description</label>
              <Textarea 
                placeholder="Describe the service requiring authorization"
                className="bg-blue-600/20 border-blue-400/30 text-white"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-white/70 text-sm mb-2">Insurance Provider</label>
                <Input 
                  placeholder="e.g., Blue Cross Blue Shield"
                  className="bg-blue-600/20 border-blue-400/30 text-white"
                />
              </div>
              <div>
                <label className="block text-white/70 text-sm mb-2">Estimated Cost</label>
                <Input 
                  type="number"
                  placeholder="0.00"
                  className="bg-blue-600/20 border-blue-400/30 text-white"
                />
              </div>
            </div>
            <div className="flex gap-2 pt-4">
              <Button onClick={handleSubmitAuth} className="bg-green-600 hover:bg-green-700">
                Submit Request
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setShowNewAuth(false)}
                className="border-blue-400/30 text-white hover:bg-blue-500/20"
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Prior Auths List */}
      <Card className="backdrop-blur-xl bg-blue-500/20 border border-blue-300/30">
        <CardHeader>
          <CardTitle className="text-white">Authorization Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {priorAuths.map((auth) => (
              <div key={auth.id} className="p-4 border border-blue-400/30 rounded-lg bg-blue-600/20">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                  <div>
                    <p className="text-white font-semibold">{auth.patient_name}</p>
                    <p className="text-white/70 text-sm">{auth.service_code}</p>
                  </div>
                  <div>
                    <p className="text-white/70 text-sm">Service</p>
                    <p className="text-white text-sm">{auth.service_description}</p>
                  </div>
                  <div>
                    <p className="text-white/70 text-sm">Insurance</p>
                    <p className="text-white text-sm">{auth.insurance_provider}</p>
                  </div>
                  <div>
                    <Badge className={getStatusColor(auth.status)}>
                      {auth.status.toUpperCase()}
                    </Badge>
                    {auth.auth_number && (
                      <p className="text-white/70 text-xs mt-1">{auth.auth_number}</p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-white font-semibold">${auth.estimated_cost.toLocaleString()}</p>
                    <p className="text-white/70 text-sm">Est. Cost</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PriorAuthManager;
