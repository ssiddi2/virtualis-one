import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { 
  DollarSign, 
  Clock, 
  AlertTriangle,
  Phone,
  Mail,
  FileText,
  TrendingUp,
  TrendingDown,
  Calendar,
  Filter,
  Download,
  CheckCircle2,
  XCircle,
  Search
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CollectionsDashboardProps {
  hospitalId?: string;
}

// Mock aging data
const agingBuckets = [
  { label: '0-30 Days', amount: 245000, count: 156, color: 'bg-green-500', trend: '+5%' },
  { label: '31-60 Days', amount: 128000, count: 87, color: 'bg-yellow-500', trend: '-2%' },
  { label: '61-90 Days', amount: 67000, count: 42, color: 'bg-orange-500', trend: '+1%' },
  { label: '90+ Days', amount: 89000, count: 65, color: 'bg-red-500', trend: '-8%' }
];

const outstandingAccounts = [
  { id: '1', patientName: 'Johnson, Mary', payer: 'Medicare Part A', amount: 12450, daysOut: 45, lastContact: '2024-01-10', status: 'pending' },
  { id: '2', patientName: 'Smith, Robert', payer: 'Blue Cross', amount: 8750, daysOut: 72, lastContact: '2024-01-05', status: 'in_review' },
  { id: '3', patientName: 'Williams, Patricia', payer: 'Medicaid', amount: 5200, daysOut: 33, lastContact: '2024-01-15', status: 'pending' },
  { id: '4', patientName: 'Brown, James', payer: 'Aetna', amount: 15800, daysOut: 95, lastContact: '2023-12-20', status: 'escalated' },
  { id: '5', patientName: 'Davis, Linda', payer: 'Medicare Part B', amount: 3400, daysOut: 28, lastContact: '2024-01-18', status: 'pending' },
  { id: '6', patientName: 'Miller, Michael', payer: 'UnitedHealth', amount: 9200, daysOut: 67, lastContact: '2024-01-08', status: 'in_review' },
  { id: '7', patientName: 'Wilson, Elizabeth', payer: 'Humana', amount: 11300, daysOut: 105, lastContact: '2023-12-15', status: 'escalated' },
  { id: '8', patientName: 'Moore, William', payer: 'Cigna', amount: 6700, daysOut: 41, lastContact: '2024-01-12', status: 'pending' }
];

const CollectionsDashboard = ({ hospitalId }: CollectionsDashboardProps) => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBucket, setSelectedBucket] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  const totalOutstanding = agingBuckets.reduce((sum, b) => sum + b.amount, 0);
  const totalAccounts = agingBuckets.reduce((sum, b) => sum + b.count, 0);

  const filteredAccounts = outstandingAccounts.filter(acc => {
    const matchesSearch = acc.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          acc.payer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBucket = !selectedBucket || 
      (selectedBucket === '0-30' && acc.daysOut <= 30) ||
      (selectedBucket === '31-60' && acc.daysOut > 30 && acc.daysOut <= 60) ||
      (selectedBucket === '61-90' && acc.daysOut > 60 && acc.daysOut <= 90) ||
      (selectedBucket === '90+' && acc.daysOut > 90);
    return matchesSearch && matchesBucket;
  });

  const handleContactPatient = (accountId: string, method: 'phone' | 'email' | 'letter') => {
    toast({
      title: `Contact Initiated`,
      description: `${method === 'phone' ? 'Phone call' : method === 'email' ? 'Email' : 'Letter'} contact logged for account.`
    });
  };

  const handleMarkPaid = (accountId: string) => {
    toast({
      title: 'Payment Posted',
      description: 'Account marked as paid and removed from collections.'
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-blue-500/20 text-blue-300 border-blue-400/30">Pending</Badge>;
      case 'in_review':
        return <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-400/30">In Review</Badge>;
      case 'escalated':
        return <Badge className="bg-red-500/20 text-red-300 border-red-400/30">Escalated</Badge>;
      default:
        return <Badge className="bg-muted text-muted-foreground">Unknown</Badge>;
    }
  };

  const getDaysOutColor = (days: number) => {
    if (days <= 30) return 'text-green-400';
    if (days <= 60) return 'text-yellow-400';
    if (days <= 90) return 'text-orange-400';
    return 'text-red-400';
  };

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="backdrop-blur-xl bg-gradient-to-br from-blue-500/20 to-blue-600/20 border-blue-400/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-200">Total A/R</p>
                <p className="text-2xl font-bold text-white">${(totalOutstanding / 1000).toFixed(0)}K</p>
                <p className="text-xs text-blue-300 flex items-center gap-1">
                  <TrendingDown className="h-3 w-3" /> -3.2% this month
                </p>
              </div>
              <div className="p-2 bg-blue-500/30 rounded-lg">
                <DollarSign className="h-6 w-6 text-blue-300" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-xl bg-gradient-to-br from-green-500/20 to-green-600/20 border-green-400/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-200">Collection Rate</p>
                <p className="text-2xl font-bold text-white">94.2%</p>
                <p className="text-xs text-green-300 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" /> +1.8% vs target
                </p>
              </div>
              <div className="p-2 bg-green-500/30 rounded-lg">
                <CheckCircle2 className="h-6 w-6 text-green-300" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-xl bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 border-yellow-400/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-200">Avg Days in A/R</p>
                <p className="text-2xl font-bold text-white">42.5</p>
                <p className="text-xs text-yellow-300 flex items-center gap-1">
                  <TrendingDown className="h-3 w-3" /> -5.2 days improved
                </p>
              </div>
              <div className="p-2 bg-yellow-500/30 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-300" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-xl bg-gradient-to-br from-purple-500/20 to-purple-600/20 border-purple-400/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-200">Open Accounts</p>
                <p className="text-2xl font-bold text-white">{totalAccounts}</p>
                <p className="text-xs text-purple-300">Across all aging buckets</p>
              </div>
              <div className="p-2 bg-purple-500/30 rounded-lg">
                <FileText className="h-6 w-6 text-purple-300" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="backdrop-blur-xl bg-blue-600/20 border border-blue-400/30">
          <TabsTrigger value="overview" className="data-[state=active]:bg-blue-500/30 text-white">
            A/R Aging
          </TabsTrigger>
          <TabsTrigger value="accounts" className="data-[state=active]:bg-blue-500/30 text-white">
            Accounts
          </TabsTrigger>
          <TabsTrigger value="payments" className="data-[state=active]:bg-blue-500/30 text-white">
            Payment Posting
          </TabsTrigger>
        </TabsList>

        {/* A/R Aging Overview */}
        <TabsContent value="overview" className="mt-6 space-y-6">
          {/* Aging Buckets */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {agingBuckets.map((bucket, index) => (
              <Card 
                key={bucket.label}
                className={`backdrop-blur-xl bg-slate-800/50 border-slate-700 cursor-pointer transition-all hover:scale-105 ${
                  selectedBucket === bucket.label.split(' ')[0] ? 'ring-2 ring-blue-400' : ''
                }`}
                onClick={() => setSelectedBucket(
                  selectedBucket === bucket.label.split(' ')[0] ? null : bucket.label.split(' ')[0]
                )}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-slate-300">{bucket.label}</span>
                    <span className={`text-xs ${bucket.trend.startsWith('+') ? 'text-red-400' : 'text-green-400'}`}>
                      {bucket.trend}
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-white mb-1">${(bucket.amount / 1000).toFixed(0)}K</p>
                  <p className="text-xs text-slate-400">{bucket.count} accounts</p>
                  <div className="mt-3">
                    <Progress 
                      value={(bucket.amount / totalOutstanding) * 100} 
                      className={`h-2 ${bucket.color}`}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Aging Chart Visualization */}
          <Card className="backdrop-blur-xl bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-400" />
                A/R Aging Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end gap-2 h-40">
                {agingBuckets.map((bucket, index) => (
                  <div key={bucket.label} className="flex-1 flex flex-col items-center">
                    <div 
                      className={`w-full ${bucket.color} rounded-t transition-all hover:opacity-80`}
                      style={{ height: `${(bucket.amount / totalOutstanding) * 100 * 1.5}%` }}
                    />
                    <p className="text-xs text-slate-400 mt-2 text-center">{bucket.label}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Accounts List */}
        <TabsContent value="accounts" className="mt-6">
          <Card className="backdrop-blur-xl bg-slate-800/50 border-slate-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white">Outstanding Accounts</CardTitle>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      placeholder="Search accounts..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9 bg-slate-700 border-slate-600 text-white w-64"
                    />
                  </div>
                  <Button variant="outline" size="sm" className="border-slate-600 text-slate-300">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                  <Button variant="outline" size="sm" className="border-slate-600 text-slate-300">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <div className="space-y-3">
                  {filteredAccounts.map((account) => (
                    <Card key={account.id} className="bg-slate-700/50 border-slate-600 hover:bg-slate-700 transition-colors">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="font-medium text-white">{account.patientName}</h4>
                              {getStatusBadge(account.status)}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-slate-400">
                              <span>{account.payer}</span>
                              <span className={getDaysOutColor(account.daysOut)}>
                                {account.daysOut} days
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                Last: {account.lastContact}
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xl font-bold text-white">${account.amount.toLocaleString()}</p>
                            <div className="flex items-center gap-1 mt-2">
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                onClick={() => handleContactPatient(account.id, 'phone')}
                                className="text-blue-400 hover:bg-blue-500/20 p-1 h-8 w-8"
                              >
                                <Phone className="h-4 w-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="ghost"
                                onClick={() => handleContactPatient(account.id, 'email')}
                                className="text-green-400 hover:bg-green-500/20 p-1 h-8 w-8"
                              >
                                <Mail className="h-4 w-4" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="ghost"
                                onClick={() => handleContactPatient(account.id, 'letter')}
                                className="text-yellow-400 hover:bg-yellow-500/20 p-1 h-8 w-8"
                              >
                                <FileText className="h-4 w-4" />
                              </Button>
                              <Button 
                                size="sm"
                                onClick={() => handleMarkPaid(account.id)}
                                className="bg-green-600 hover:bg-green-700 text-white ml-2"
                              >
                                <CheckCircle2 className="h-4 w-4 mr-1" />
                                Paid
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payment Posting */}
        <TabsContent value="payments" className="mt-6">
          <Card className="backdrop-blur-xl bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Payment Posting</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm text-slate-400">Patient/Account</label>
                  <Input placeholder="Search patient or account..." className="bg-slate-700 border-slate-600 text-white" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-slate-400">Payment Amount</label>
                  <Input type="number" placeholder="0.00" className="bg-slate-700 border-slate-600 text-white" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm text-slate-400">Payment Date</label>
                  <Input type="date" className="bg-slate-700 border-slate-600 text-white" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-slate-400">Payment Method</label>
                  <select className="w-full h-10 px-3 bg-slate-700 border border-slate-600 text-white rounded-md">
                    <option>Check</option>
                    <option>EFT</option>
                    <option>Credit Card</option>
                    <option>Cash</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-slate-400">Reference #</label>
                  <Input placeholder="Check # or Transaction ID" className="bg-slate-700 border-slate-600 text-white" />
                </div>
              </div>
              <Button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700">
                <DollarSign className="h-4 w-4 mr-2" />
                Post Payment
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CollectionsDashboard;
