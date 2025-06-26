
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, TrendingDown, AlertCircle } from "lucide-react";
import { useCMSQualityMeasures } from "@/hooks/useCMSQualityMeasures";

interface CMSQualityDashboardProps {
  hospitalId?: string;
}

const CMSQualityDashboard = ({ hospitalId }: CMSQualityDashboardProps) => {
  const { data: measures, isLoading, error } = useCMSQualityMeasures(hospitalId);

  if (isLoading) {
    return <div className="text-white">Loading CMS quality measures...</div>;
  }

  if (error) {
    return <div className="text-red-400">Error loading quality measures</div>;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-600/20 text-green-300 border-green-600/30';
      case 'submitted': return 'bg-blue-600/20 text-blue-300 border-blue-600/30';
      case 'in_progress': return 'bg-yellow-600/20 text-yellow-300 border-yellow-600/30';
      default: return 'bg-gray-600/20 text-gray-300 border-gray-600/30';
    }
  };

  const getPerformanceIcon = (performanceRate: number, benchmarkRate: number) => {
    if (performanceRate < benchmarkRate) {
      return <TrendingUp className="h-4 w-4 text-green-400" />;
    }
    return <TrendingDown className="h-4 w-4 text-red-400" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <AlertCircle className="h-6 w-6 text-blue-400" />
        <h2 className="text-2xl font-bold text-white">CMS Quality Measures - Q4 2024</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {measures?.map((measure) => (
          <Card key={measure.id} className="bg-slate-800/50 border-slate-700">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg text-white">{measure.measure_name}</CardTitle>
                <Badge className={getStatusColor(measure.status || 'in_progress')}>
                  {measure.status}
                </Badge>
              </div>
              <p className="text-sm text-slate-400">ID: {measure.measure_id}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-300">Performance Rate</span>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-semibold text-white">
                    {measure.performance_rate?.toFixed(2)}%
                  </span>
                  {measure.benchmark_rate && 
                    getPerformanceIcon(measure.performance_rate || 0, measure.benchmark_rate)
                  }
                </div>
              </div>
              
              {measure.benchmark_rate && (
                <div>
                  <div className="flex justify-between text-sm text-slate-400 mb-2">
                    <span>vs Benchmark ({measure.benchmark_rate}%)</span>
                    <span>{measure.numerator}/{measure.denominator}</span>
                  </div>
                  <Progress 
                    value={Math.min((measure.performance_rate || 0) / measure.benchmark_rate * 100, 100)} 
                    className="h-2"
                  />
                </div>
              )}

              {measure.improvement_target && (
                <div className="pt-2 border-t border-slate-700">
                  <span className="text-sm text-slate-400">Target: </span>
                  <span className="text-sm text-blue-400">{measure.improvement_target}%</span>
                </div>
              )}
              
              <div className="text-xs text-slate-500">
                Last updated: {new Date(measure.last_updated || '').toLocaleDateString()}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CMSQualityDashboard;
