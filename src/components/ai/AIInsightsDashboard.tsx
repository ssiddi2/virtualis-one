
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Brain, AlertTriangle, CheckCircle, Clock, TrendingUp, Users, Activity } from "lucide-react";
import { useAIInsights } from "@/hooks/useAIInsights";
import { usePatients } from "@/hooks/usePatients";

interface AIInsightsDashboardProps {
  hospitalId?: string;
  hospitalName?: string;
}

const AIInsightsDashboard = ({ hospitalId, hospitalName }: AIInsightsDashboardProps) => {
  const { data: insights, isLoading, error } = useAIInsights(hospitalId);
  const { data: patients } = usePatients(hospitalId);

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

  const criticalInsights = insights?.filter(i => i.severity === 'critical') || [];
  const activePatients = patients?.filter(p => p.status === 'active') || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Brain className="h-8 w-8 text-blue-400" />
          <div>
            <h1 className="text-3xl font-bold text-white">AI Clinical Insights</h1>
            <p className="text-white/70">{hospitalName || 'Hospital'} - Real-time AI Analysis</p>
          </div>
        </div>
        <Badge className="bg-blue-600/20 text-blue-300 border-blue-600/30">
          <Activity className="h-3 w-3 mr-1" />
          Live Monitoring
        </Badge>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-white flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-400" />
              Active Patients
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{activePatients.length}</div>
            <p className="text-xs text-slate-400">Currently monitored</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-white flex items-center gap-2">
              <Brain className="h-4 w-4 text-purple-400" />
              AI Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{insights?.length || 0}</div>
            <p className="text-xs text-slate-400">Generated today</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-white flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-400" />
              Critical Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-400">{criticalInsights.length}</div>
            <p className="text-xs text-slate-400">Require attention</p>
          </CardContent>
        </Card>

        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-white flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-400" />
              Efficiency
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">87%</div>
            <p className="text-xs text-slate-400">Clinical workflow</p>
          </CardContent>
        </Card>
      </div>

      {/* AI Insights */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-white">Recent AI Insights</h2>
        {insights && insights.length > 0 ? (
          <div className="space-y-4">
            {insights.map((insight) => (
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
                      <h4 className="text-sm font-semibold text-white mb-2">AI Recommendations:</h4>
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
                      Review Patient
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="bg-slate-800/50 border-slate-700">
            <CardContent className="p-8 text-center">
              <Brain className="h-16 w-16 mx-auto mb-4 text-slate-600" />
              <h3 className="text-xl font-semibold text-white mb-2">No AI Insights Yet</h3>
              <p className="text-slate-400">AI analysis will appear here as patient data is processed.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AIInsightsDashboard;
