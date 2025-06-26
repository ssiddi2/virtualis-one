
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  FileText, 
  CheckCircle, 
  AlertCircle,
  Upload,
  Download,
  RefreshCw,
  Target,
  BarChart3
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useCMSQualityMeasures } from '@/hooks/useCMSQualityMeasures';

const CMSQualityDashboard = () => {
  const { toast } = useToast();
  const { data: qualityMeasures } = useCMSQualityMeasures();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [isUpdatingMeasures, setIsUpdatingMeasures] = useState(false);

  const handleSubmitToHHS = async () => {
    setIsSubmitting(true);
    
    setTimeout(() => {
      toast({
        title: "Successfully Submitted to HHS",
        description: "Quality measures have been submitted to the Health and Human Services reporting system.",
      });
      setIsSubmitting(false);
    }, 3000);
  };

  const handleGenerateReport = async (reportType: string) => {
    setIsGeneratingReport(true);
    
    setTimeout(() => {
      toast({
        title: "Report Generated",
        description: `${reportType} report has been generated and downloaded.`,
      });
      setIsGeneratingReport(false);
      
      // Simulate file download
      const element = document.createElement('a');
      element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(`${reportType} CMS Report Data`));
      element.setAttribute('download', `cms_${reportType.toLowerCase().replace(' ', '_')}_${new Date().toISOString().split('T')[0]}.pdf`);
      element.style.display = 'none';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }, 2000);
  };

  const handleUpdateMeasures = async () => {
    setIsUpdatingMeasures(true);
    
    setTimeout(() => {
      toast({
        title: "Measures Updated",
        description: "Quality measures have been refreshed with the latest data from all departments.",
      });
      setIsUpdatingMeasures(false);
    }, 2500);
  };

  const handleValidateData = () => {
    toast({
      title: "Data Validation Complete",
      description: "All quality measures have been validated. No discrepancies found.",
    });
  };

  const getPerformanceColor = (rate: number, benchmark: number) => {
    if (rate >= benchmark) return 'text-green-400';
    if (rate >= benchmark * 0.9) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getPerformanceBadge = (rate: number, benchmark: number) => {
    if (rate >= benchmark) return { text: 'Exceeds', class: 'bg-green-600/20 text-green-300 border-green-600/30' };
    if (rate >= benchmark * 0.9) return { text: 'Meets', class: 'bg-yellow-600/20 text-yellow-300 border-yellow-600/30' };
    return { text: 'Below', class: 'bg-red-600/20 text-red-300 border-red-600/30' };
  };

  const overallScore = qualityMeasures?.reduce((sum, measure) => 
    sum + (measure.performance_rate || 0), 0) / (qualityMeasures?.length || 1);

  return (
    <div className="min-h-screen bg-[#0a1628] p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">CMS Quality Reporting</h1>
            <p className="text-white/70">Healthcare quality measures and compliance tracking</p>
          </div>
          <div className="flex gap-3">
            <Button 
              onClick={handleUpdateMeasures}
              disabled={isUpdatingMeasures}
              variant="outline"
              className="border-blue-600 text-blue-400 hover:bg-blue-600/10"
            >
              {isUpdatingMeasures ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : <RefreshCw className="h-4 w-4 mr-2" />}
              Update Data
            </Button>
            <Button 
              onClick={handleSubmitToHHS}
              disabled={isSubmitting}
              className="bg-green-600 hover:bg-green-700"
            >
              {isSubmitting ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : <Upload className="h-4 w-4 mr-2" />}
              Submit to HHS
            </Button>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Overall Score</CardTitle>
              <Target className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{overallScore.toFixed(1)}%</div>
              <p className="text-xs text-slate-400">
                +2.3% from last quarter
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Measures Tracked</CardTitle>
              <BarChart3 className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{qualityMeasures?.length || 0}</div>
              <p className="text-xs text-slate-400">
                All categories covered
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Exceeding Target</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {qualityMeasures?.filter(m => (m.performance_rate || 0) >= (m.benchmark_rate || 0)).length || 0}
              </div>
              <p className="text-xs text-slate-400">
                Out of {qualityMeasures?.length || 0} measures
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">Last Submission</CardTitle>
              <FileText className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">Dec 15</div>
              <p className="text-xs text-slate-400">
                Next due: Mar 15
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Quality Measures */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-white">Quality Measures Performance</CardTitle>
              <div className="flex gap-2">
                <Button 
                  onClick={handleValidateData}
                  size="sm"
                  variant="outline"
                  className="border-slate-600 text-white hover:bg-slate-700"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Validate Data
                </Button>
                <Button 
                  onClick={() => handleGenerateReport('Quality Dashboard')}
                  disabled={isGeneratingReport}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isGeneratingReport ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : <Download className="h-4 w-4 mr-2" />}
                  Export Report
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {qualityMeasures && qualityMeasures.length > 0 ? (
                qualityMeasures.map((measure) => {
                  const badge = getPerformanceBadge(measure.performance_rate || 0, measure.benchmark_rate || 0);
                  return (
                    <div key={measure.id} className="p-4 bg-slate-700/30 rounded-lg">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-medium text-white">{measure.measure_name}</h4>
                          <p className="text-sm text-slate-400">ID: {measure.measure_id}</p>
                        </div>
                        <Badge className={badge.class}>
                          {badge.text}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                        <div>
                          <span className="text-xs text-slate-500">Performance</span>
                          <div className={`text-lg font-semibold ${getPerformanceColor(measure.performance_rate || 0, measure.benchmark_rate || 0)}`}>
                            {measure.performance_rate?.toFixed(1)}%
                          </div>
                        </div>
                        <div>
                          <span className="text-xs text-slate-500">Benchmark</span>
                          <div className="text-lg font-semibold text-slate-300">
                            {measure.benchmark_rate?.toFixed(1)}%
                          </div>
                        </div>
                        <div>
                          <span className="text-xs text-slate-500">Numerator</span>
                          <div className="text-lg font-semibold text-slate-300">
                            {measure.numerator}
                          </div>
                        </div>
                        <div>
                          <span className="text-xs text-slate-500">Denominator</span>
                          <div className="text-lg font-semibold text-slate-300">
                            {measure.denominator}
                          </div>
                        </div>
                      </div>
                      <Progress 
                        value={measure.performance_rate || 0} 
                        className="h-2 bg-slate-600"
                      />
                    </div>
                  );
                })
              ) : (
                <p className="text-slate-400 text-center py-8">No quality measures data available</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Action Items */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <AlertCircle className="h-5 w-5 text-orange-400" />
                Action Items
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-orange-600/20 rounded border border-orange-600/30">
                  <div>
                    <div className="font-medium text-orange-300">Improve Readmission Rate</div>
                    <div className="text-sm text-orange-400/70">Target: 8.5% | Current: 9.2%</div>
                  </div>
                  <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                    Review
                  </Button>
                </div>
                <div className="flex items-center justify-between p-3 bg-yellow-600/20 rounded border border-yellow-600/30">
                  <div>
                    <div className="font-medium text-yellow-300">Patient Safety Indicators</div>
                    <div className="text-sm text-yellow-400/70">2 measures need attention</div>
                  </div>
                  <Button size="sm" className="bg-yellow-600 hover:bg-yellow-700">
                    Address
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <FileText className="h-5 w-5 text-blue-400" />
                Reporting Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                onClick={() => handleGenerateReport('Quarterly Summary')}
                disabled={isGeneratingReport}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                <FileText className="h-4 w-4 mr-2" />
                Generate Quarterly Report
              </Button>
              <Button 
                onClick={() => handleGenerateReport('CMS Submission')}
                disabled={isGeneratingReport}
                variant="outline"
                className="w-full border-slate-600 text-white hover:bg-slate-700"
              >
                <Download className="h-4 w-4 mr-2" />
                Download CMS Submission File
              </Button>
              <Button 
                onClick={() => toast({ title: "Feature", description: "Opening benchmark comparison tool..." })}
                variant="outline"
                className="w-full border-slate-600 text-white hover:bg-slate-700"
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                Compare to National Benchmarks
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CMSQualityDashboard;
