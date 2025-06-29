
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  AlertTriangle, 
  Calendar, 
  DollarSign, 
  FileText, 
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DenialManagementProps {
  hospitalId: string;
}

const DenialManagement = ({ hospitalId }: DenialManagementProps) => {
  const { toast } = useToast();
  const [selectedDenial, setSelectedDenial] = useState<any>(null);

  // Mock data - would be replaced with real API calls
  const denials = [
    {
      id: '1',
      denial_code: 'CO-97',
      denial_reason: 'Payment adjusted because the benefit for this service is included in the payment/allowance for another service/procedure',
      denial_date: '2024-06-25',
      appeal_deadline: '2024-07-25',
      status: 'pending',
      amount: 1250.00,
      patient_name: 'John Smith',
      service_code: '99213'
    },
    {
      id: '2',
      denial_code: 'CO-16',
      denial_reason: 'Claim/service lacks information which is needed for adjudication',
      denial_date: '2024-06-20',
      appeal_deadline: '2024-07-20',
      status: 'appealing',
      amount: 890.50,
      patient_name: 'Sarah Johnson',
      service_code: '99214'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/20 text-yellow-200 border-yellow-400/30';
      case 'appealing': return 'bg-blue-500/20 text-blue-200 border-blue-400/30';
      case 'resolved': return 'bg-green-500/20 text-green-200 border-green-400/30';
      case 'written_off': return 'bg-red-500/20 text-red-200 border-red-400/30';
      default: return 'bg-gray-500/20 text-gray-200 border-gray-400/30';
    }
  };

  const handleAppeal = (denialId: string) => {
    toast({
      title: "Appeal Submitted",
      description: "The denial appeal has been submitted for review.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="backdrop-blur-xl bg-red-500/20 border border-red-300/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/70">Total Denials</p>
                <p className="text-2xl font-bold text-white">42</p>
              </div>
              <XCircle className="h-8 w-8 text-red-300" />
            </div>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-xl bg-yellow-500/20 border border-yellow-300/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/70">Pending Appeals</p>
                <p className="text-2xl font-bold text-white">15</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-300" />
            </div>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-xl bg-green-500/20 border border-green-300/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/70">Resolved</p>
                <p className="text-2xl font-bold text-white">28</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-300" />
            </div>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-xl bg-blue-500/20 border border-blue-300/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white/70">Recovery Rate</p>
                <p className="text-2xl font-bold text-white">73%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-300" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Denials List */}
      <Card className="backdrop-blur-xl bg-blue-500/20 border border-blue-300/30">
        <CardHeader>
          <CardTitle className="text-white">Active Denials</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {denials.map((denial) => (
              <div key={denial.id} className="p-4 border border-blue-400/30 rounded-lg bg-blue-600/20">
                <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
                  <div>
                    <p className="text-white font-semibold">{denial.patient_name}</p>
                    <p className="text-white/70 text-sm">Code: {denial.service_code}</p>
                  </div>
                  <div>
                    <p className="text-white font-semibold">${denial.amount}</p>
                    <p className="text-white/70 text-sm">Denied Amount</p>
                  </div>
                  <div>
                    <Badge className={getStatusColor(denial.status)}>
                      {denial.status.toUpperCase()}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-white/70 text-sm">Appeal By:</p>
                    <p className="text-white text-sm">{denial.appeal_deadline}</p>
                  </div>
                  <div>
                    <p className="text-white/70 text-sm">Denial Code:</p>
                    <p className="text-white text-sm">{denial.denial_code}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      onClick={() => handleAppeal(denial.id)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Appeal
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => setSelectedDenial(denial)}
                      className="border-blue-400/30 text-white hover:bg-blue-500/20"
                    >
                      Details
                    </Button>
                  </div>
                </div>
                <div className="mt-2">
                  <p className="text-white/70 text-sm">{denial.denial_reason}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DenialManagement;
