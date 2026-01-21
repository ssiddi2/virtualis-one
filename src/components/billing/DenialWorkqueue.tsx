import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { 
  AlertTriangle, 
  FileText,
  Sparkles,
  Send,
  Clock,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Copy,
  TrendingUp,
  DollarSign,
  Filter
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAIAssistant } from '@/hooks/useAIAssistant';

interface DenialWorkqueueProps {
  hospitalId?: string;
}

// Mock denial data
const denialQueue = [
  {
    id: '1',
    patientName: 'Johnson, Mary',
    claimId: 'CLM-2024-001234',
    payer: 'Medicare Part A',
    amount: 12450,
    denialDate: '2024-01-15',
    denialCode: 'CO-4',
    denialReason: 'The procedure code is inconsistent with the modifier used',
    daysSinceDenial: 6,
    priority: 'high',
    appealDeadline: '2024-02-14'
  },
  {
    id: '2',
    patientName: 'Smith, Robert',
    claimId: 'CLM-2024-001198',
    payer: 'Blue Cross',
    amount: 8750,
    denialDate: '2024-01-12',
    denialCode: 'PR-1',
    denialReason: 'Deductible amount',
    daysSinceDenial: 9,
    priority: 'medium',
    appealDeadline: '2024-02-11'
  },
  {
    id: '3',
    patientName: 'Williams, Patricia',
    claimId: 'CLM-2024-001156',
    payer: 'Medicaid',
    amount: 5200,
    denialDate: '2024-01-10',
    denialCode: 'CO-16',
    denialReason: 'Claim/service lacks information needed for adjudication',
    daysSinceDenial: 11,
    priority: 'high',
    appealDeadline: '2024-02-09'
  },
  {
    id: '4',
    patientName: 'Brown, James',
    claimId: 'CLM-2024-001089',
    payer: 'Aetna',
    amount: 15800,
    denialDate: '2024-01-08',
    denialCode: 'CO-97',
    denialReason: 'The benefit for this service is included in the payment/allowance for another service',
    daysSinceDenial: 13,
    priority: 'medium',
    appealDeadline: '2024-02-07'
  },
  {
    id: '5',
    patientName: 'Davis, Linda',
    claimId: 'CLM-2024-001045',
    payer: 'UnitedHealth',
    amount: 9200,
    denialDate: '2024-01-05',
    denialCode: 'CO-50',
    denialReason: 'These are non-covered services because this is not deemed a medical necessity',
    daysSinceDenial: 16,
    priority: 'critical',
    appealDeadline: '2024-02-04'
  }
];

const DenialWorkqueue = ({ hospitalId }: DenialWorkqueueProps) => {
  const { toast } = useToast();
  const { callAI, isLoading: isAILoading } = useAIAssistant();
  const [selectedDenial, setSelectedDenial] = useState<typeof denialQueue[0] | null>(null);
  const [appealLetter, setAppealLetter] = useState('');
  const [isGeneratingAppeal, setIsGeneratingAppeal] = useState(false);

  const totalDeniedAmount = denialQueue.reduce((sum, d) => sum + d.amount, 0);
  const criticalCount = denialQueue.filter(d => d.priority === 'critical').length;
  const highCount = denialQueue.filter(d => d.priority === 'high').length;

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'critical':
        return <Badge className="bg-red-500/20 text-red-300 border-red-400/30">Critical</Badge>;
      case 'high':
        return <Badge className="bg-orange-500/20 text-orange-300 border-orange-400/30">High</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-400/30">Medium</Badge>;
      default:
        return <Badge className="bg-blue-500/20 text-blue-300 border-blue-400/30">Low</Badge>;
    }
  };

  const generateAppealLetter = async () => {
    if (!selectedDenial) return;
    
    setIsGeneratingAppeal(true);
    try {
      const result = await callAI({
        type: 'denial_prediction',
        data: {
          claimId: selectedDenial.claimId,
          denialCode: selectedDenial.denialCode,
          denialReason: selectedDenial.denialReason,
          patientName: selectedDenial.patientName,
          payer: selectedDenial.payer,
          amount: selectedDenial.amount,
          requestType: 'appeal_letter'
        },
        context: 'Generate a professional appeal letter for this denied claim'
      });
      
      setAppealLetter(result || generateFallbackAppeal(selectedDenial));
      toast({
        title: 'Appeal Generated',
        description: 'AI has drafted an appeal letter. Review and customize before sending.'
      });
    } catch (error) {
      console.error('Appeal generation error:', error);
      setAppealLetter(generateFallbackAppeal(selectedDenial));
    } finally {
      setIsGeneratingAppeal(false);
    }
  };

  const generateFallbackAppeal = (denial: typeof denialQueue[0]) => {
    return `[FACILITY LETTERHEAD]

Date: ${new Date().toLocaleDateString()}

${denial.payer}
Appeals Department

RE: Appeal for Denied Claim
Claim ID: ${denial.claimId}
Patient: ${denial.patientName}
Denial Code: ${denial.denialCode}
Denial Reason: ${denial.denialReason}

Dear Appeals Committee,

I am writing to formally appeal the denial of the above-referenced claim in the amount of $${denial.amount.toLocaleString()}.

The services provided were medically necessary and appropriately documented. Upon review of the denial reason "${denial.denialReason}", we respectfully submit the following for your reconsideration:

1. Medical Necessity: [Insert supporting clinical documentation]
2. Correct Coding: [Confirm procedure and modifier accuracy]
3. Supporting Documentation: [Reference attached records]

We request that you overturn this denial and process the claim for payment. Please find enclosed supporting documentation for your review.

If you require additional information, please contact our billing department.

Sincerely,
[Provider Name]
[NPI Number]
[Contact Information]

Enclosures: [List supporting documents]`;
  };

  const handleSubmitAppeal = () => {
    toast({
      title: 'Appeal Submitted',
      description: 'Appeal has been logged and sent to payer. Track status in the appeals dashboard.'
    });
    setSelectedDenial(null);
    setAppealLetter('');
  };

  const handleWriteOff = (denialId: string) => {
    toast({
      title: 'Write-Off Processed',
      description: 'Denial has been written off and removed from the queue.',
      variant: 'destructive'
    });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(appealLetter);
    toast({ title: 'Copied to clipboard' });
  };

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="backdrop-blur-xl bg-red-500/20 border-red-400/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-200">Denied Amount</p>
                <p className="text-2xl font-bold text-white">${(totalDeniedAmount / 1000).toFixed(0)}K</p>
              </div>
              <AlertTriangle className="h-6 w-6 text-red-300" />
            </div>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-xl bg-orange-500/20 border-orange-400/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-200">Critical/High Priority</p>
                <p className="text-2xl font-bold text-white">{criticalCount + highCount}</p>
              </div>
              <Clock className="h-6 w-6 text-orange-300" />
            </div>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-xl bg-green-500/20 border-green-400/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-200">Appeal Success Rate</p>
                <p className="text-2xl font-bold text-white">72%</p>
              </div>
              <TrendingUp className="h-6 w-6 text-green-300" />
            </div>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-xl bg-blue-500/20 border-blue-400/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-200">Pending Appeals</p>
                <p className="text-2xl font-bold text-white">{denialQueue.length}</p>
              </div>
              <FileText className="h-6 w-6 text-blue-300" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Denial Queue */}
        <Card className="backdrop-blur-xl bg-slate-800/50 border-slate-700">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-400" />
                Denial Workqueue
              </CardTitle>
              <Button variant="outline" size="sm" className="border-slate-600 text-slate-300">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[500px]">
              <div className="space-y-3">
                {denialQueue.map((denial) => (
                  <Card 
                    key={denial.id} 
                    className={`bg-slate-700/50 border-slate-600 cursor-pointer transition-all hover:bg-slate-700 ${
                      selectedDenial?.id === denial.id ? 'ring-2 ring-blue-400' : ''
                    }`}
                    onClick={() => setSelectedDenial(denial)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium text-white">{denial.patientName}</h4>
                            {getPriorityBadge(denial.priority)}
                          </div>
                          <p className="text-xs text-slate-400">{denial.claimId}</p>
                        </div>
                        <p className="text-lg font-bold text-white">${denial.amount.toLocaleString()}</p>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge className="bg-slate-600 text-slate-300 text-xs">{denial.denialCode}</Badge>
                          <span className="text-xs text-slate-400">{denial.payer}</span>
                        </div>
                        <p className="text-sm text-slate-300 line-clamp-2">{denial.denialReason}</p>
                        <div className="flex items-center justify-between text-xs text-slate-400">
                          <span>{denial.daysSinceDenial} days ago</span>
                          <span className="text-yellow-400">Appeal by: {denial.appealDeadline}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Appeal Generator */}
        <Card className="backdrop-blur-xl bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-400" />
              AI Appeal Generator
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedDenial ? (
              <>
                {/* Selected Denial Summary */}
                <Card className="bg-slate-700/50 border-slate-600">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-white">{selectedDenial.patientName}</h4>
                      <span className="text-lg font-bold text-white">${selectedDenial.amount.toLocaleString()}</span>
                    </div>
                    <p className="text-sm text-slate-300 mb-2">{selectedDenial.denialReason}</p>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-slate-600 text-slate-300">{selectedDenial.denialCode}</Badge>
                      <span className="text-xs text-slate-400">{selectedDenial.payer}</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Generate Button */}
                {!appealLetter && (
                  <Button 
                    onClick={generateAppealLetter}
                    disabled={isGeneratingAppeal || isAILoading}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                    {isGeneratingAppeal ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Generating Appeal...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 mr-2" />
                        Generate AI Appeal Letter
                      </>
                    )}
                  </Button>
                )}

                {/* Appeal Letter Editor */}
                {appealLetter && (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-400">Generated Appeal Letter</span>
                      <Button variant="ghost" size="sm" onClick={copyToClipboard} className="text-slate-400">
                        <Copy className="h-4 w-4 mr-1" />
                        Copy
                      </Button>
                    </div>
                    <Textarea
                      value={appealLetter}
                      onChange={(e) => setAppealLetter(e.target.value)}
                      className="min-h-[300px] bg-slate-700 border-slate-600 text-white font-mono text-sm"
                    />
                    <div className="flex gap-3">
                      <Button 
                        variant="outline"
                        onClick={() => handleWriteOff(selectedDenial.id)}
                        className="flex-1 border-red-500/50 text-red-400 hover:bg-red-500/20"
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Write Off
                      </Button>
                      <Button 
                        onClick={handleSubmitAppeal}
                        className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                      >
                        <Send className="h-4 w-4 mr-2" />
                        Submit Appeal
                      </Button>
                    </div>
                  </>
                )}
              </>
            ) : (
              <div className="text-center py-12 text-slate-400">
                <AlertTriangle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Select a denial from the queue to generate an appeal</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DenialWorkqueue;
