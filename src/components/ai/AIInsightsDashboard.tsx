
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Brain, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { useAIInsights } from "@/hooks/useAIInsights";

interface AIInsightsDashboardProps {
  hospitalId?: string;
}

const AIInsightsDashboard = ({ hospitalId }: AIInsightsDashboardProps) => {
  const { data: insights, isLoading, error } = useAIInsights(hospitalId);

  if (isLoading) {
    return <div className="text-white">Loading AI insights...</div>;
  }

  if (error) {
    return <div className="text-red-400">Error loading AI insights</div>;
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-600/20 text-red-300 border-red-600/30';
      case 'high': return 'bg-orange-600/20 text-orange-300 border-orange-600/30';
      case 'medium': return 'bg-yellow-600/20 text-yellow-300 border-yellow-600/30';
      case 'low': return 'bg-green-600/20 text-green-300 border-green-600/30';
      default: return 'bg-gray-600/20 text-gray-300 border-gray-600/30';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <AlertTriangle className="h-4 w-4 text-red-400" />;
      case 'high': return <AlertTriangle className="h-4 w-4 text-orange-400" />;
      case 'medium': return <Clock className="h-4 w-4 text-yellow-400" />;
      case 'low': return <CheckCircle className="h-4 w-4 text-green-400" />;
      default: return <Brain className="h-4 w-4 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Brain className="h-6 w-6 text-blue-400" />
        <h2 className="text-2xl font-bold text-white">AI Clinical Insights</h2>
      </div>

      <div className="space-y-4">
        {insights?.map((insight) => (
          <Card key={insight.id} className="bg-slate-800/50 border-slate-700">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getSeverityIcon(insight.severity)}
                  <CardTitle className="text-lg text-white">{insight.title}</CardTitle>
                </div>
                <Badge className={getSeverityColor(insight.severity)}>
                  {insight.severity}
                </Badge>
              </div>
              <div className="flex items-center gap-4 text-sm text-slate-400">
                <span>Patient: {(insight as any).patients?.first_name} {(insight as any).patients?.last_name}</span>
                <span>MRN: {(insight as any).patients?.mrn}</span>
                <span>Type: {insight.insight_type}</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-300">{insight.description}</p>
              
              {insight.recommendations && insight.recommendations.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-white mb-2">Recommendations:</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {insight.recommendations.map((rec, index) => (
                      <li key={index} className="text-sm text-slate-300">{rec}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex items-center justify-between pt-2 border-t border-slate-700">
                <div className="flex items-center gap-4 text-xs text-slate-500">
                  <span>Confidence: {((insight.confidence_score || 0) * 100).toFixed(0)}%</span>
                  <span>Sources: {insight.data_sources?.join(', ')}</span>
                </div>
                <Button size="sm" variant="outline" className="text-blue-400 border-blue-600 hover:bg-blue-600/20">
                  Review
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AIInsightsDashboard;
