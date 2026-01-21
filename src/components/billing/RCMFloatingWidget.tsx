import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useRCMOptional } from '@/contexts/RCMContext';
import { 
  DollarSign, 
  TrendingUp, 
  Clock, 
  ChevronUp, 
  ChevronDown,
  Send,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface RCMFloatingWidgetProps {
  className?: string;
}

const RCMFloatingWidget = ({ className }: RCMFloatingWidgetProps) => {
  const rcm = useRCMOptional();
  const [isExpanded, setIsExpanded] = useState(false);

  // Don't render if RCM context is not available
  if (!rcm) return null;

  const { currentSession, pendingCharges, openPanel, submitAllPending } = rcm;
  const pendingCount = currentSession.pendingCount;
  const todayTotal = currentSession.totalEstimate;

  // Don't show widget if no activity
  if (pendingCount === 0 && todayTotal === 0) return null;

  const highRiskCount = pendingCharges.filter(c => c.denialRisk === 'high').length;

  return (
    <div className={cn(
      "fixed bottom-20 right-6 z-40 transition-all duration-300",
      className
    )}>
      {/* Expanded Panel */}
      {isExpanded && (
        <Card className="mb-3 w-72 bg-slate-900/95 backdrop-blur-xl border-slate-700 shadow-2xl animate-in slide-in-from-bottom-2">
          <CardContent className="p-4 space-y-4">
            {/* Today's Summary */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-slate-300 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-400" />
                Today's Billing
              </h4>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-800/50 rounded-lg p-3">
                  <p className="text-xs text-slate-400">Total Estimate</p>
                  <p className="text-xl font-bold text-green-400">${todayTotal.toFixed(0)}</p>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-3">
                  <p className="text-xs text-slate-400">Charges</p>
                  <p className="text-xl font-bold text-white">{currentSession.totalCharges}</p>
                </div>
              </div>
            </div>

            {/* Pending Charges */}
            {pendingCount > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-400">Pending Submission</span>
                  <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-400/30">
                    {pendingCount} charges
                  </Badge>
                </div>
                
                {highRiskCount > 0 && (
                  <div className="flex items-center gap-2 text-xs text-red-400 bg-red-500/10 px-2 py-1 rounded">
                    <AlertTriangle className="h-3 w-3" />
                    {highRiskCount} high denial risk
                  </div>
                )}

                <Button 
                  size="sm" 
                  onClick={submitAllPending}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Submit All Pending
                </Button>
              </div>
            )}

            {/* Recent Submissions */}
            {currentSession.submittedCount > 0 && (
              <div className="flex items-center gap-2 text-xs text-green-400">
                <CheckCircle2 className="h-3 w-3" />
                {currentSession.submittedCount} submitted today
              </div>
            )}

            {/* Open Full Panel */}
            <Button 
              variant="outline" 
              size="sm"
              onClick={openPanel}
              className="w-full border-slate-600 text-slate-300 hover:bg-slate-800"
            >
              <DollarSign className="h-4 w-4 mr-2" />
              Open Billing Panel
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Floating Button */}
      <Button
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          "h-14 rounded-full shadow-lg transition-all duration-300",
          "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700",
          pendingCount > 0 ? "px-5" : "w-14"
        )}
      >
        <div className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          {pendingCount > 0 && (
            <>
              <span className="font-semibold">${todayTotal.toFixed(0)}</span>
              <Badge className="bg-white/20 text-white text-xs px-1.5 py-0">
                {pendingCount}
              </Badge>
            </>
          )}
          {isExpanded ? (
            <ChevronDown className="h-4 w-4 ml-1" />
          ) : (
            <ChevronUp className="h-4 w-4 ml-1" />
          )}
        </div>
      </Button>
    </div>
  );
};

export default RCMFloatingWidget;
