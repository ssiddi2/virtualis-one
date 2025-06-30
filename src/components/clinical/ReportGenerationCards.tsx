
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  FileText, 
  Download, 
  Send, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  BarChart3,
  Users,
  Activity,
  TrendingUp,
  Calendar,
  Zap
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ReportGenerationCardsProps {
  hospitalId: string;
}

const ReportGenerationCards = ({ hospitalId }: ReportGenerationCardsProps) => {
  const { toast } = useToast();
  const [reportProgress, setReportProgress] = useState<{[key: string]: number}>({});
  const [reportStatus, setReportStatus] = useState<{[key: string]: 'idle' | 'generating' | 'complete' | 'error'}>({});

  const reports = [
    {
      id: 'quality-metrics',
      name: 'CMS Quality Metrics',
      description: 'Comprehensive quality measure reporting for CMS compliance',
      type: 'Quality',
      priority: 'high',
      estimatedTime: '2-3 minutes',
      icon: <BarChart3 className="h-5 w-5" />,
      color: 'from-blue-600 to-blue-700',
      bgColor: 'bg-blue-500/20',
      borderColor: 'border-blue-300/30'
    },
    {
      id: 'patient-safety',
      name: 'Patient Safety Dashboard',
      description: 'Real-time patient safety indicators and incident tracking',
      type: 'Safety',
      priority: 'critical',
      estimatedTime: '1-2 minutes',
      icon: <Users className="h-5 w-5" />,
      color: 'from-red-600 to-red-700',
      bgColor: 'bg-red-500/20',
      borderColor: 'border-red-300/30'
    },
    {
      id: 'clinical-outcomes',
      name: 'Clinical Outcomes Analysis',
      description: 'Treatment effectiveness and patient outcome metrics',
      type: 'Clinical',
      priority: 'medium',
      estimatedTime: '3-4 minutes',
      icon: <Activity className="h-5 w-5" />,
      color: 'from-green-600 to-green-700',
      bgColor: 'bg-green-500/20',
      borderColor: 'border-green-300/30'
    },
    {
      id: 'financial-performance',
      name: 'Financial Performance',
      description: 'Revenue cycle analytics and billing performance metrics',
      type: 'Financial',
      priority: 'high',
      estimatedTime: '2-3 minutes',
      icon: <TrendingUp className="h-5 w-5" />,
      color: 'from-purple-600 to-purple-700',
      bgColor: 'bg-purple-500/20',
      borderColor: 'border-purple-300/30'
    }
  ];

  const handleGenerateReport = async (reportId: string) => {
    const report = reports.find(r => r.id === reportId);
    if (!report) return;

    setReportStatus(prev => ({ ...prev, [reportId]: 'generating' }));
    setReportProgress(prev => ({ ...prev, [reportId]: 0 }));

    toast({
      title: "Report Generation Started",
      description: `Generating ${report.name}...`,
    });

    // Simulate report generation progress
    const interval = setInterval(() => {
      setReportProgress(prev => {
        const currentProgress = prev[reportId] || 0;
        const newProgress = Math.min(currentProgress + Math.random() * 30, 100);
        
        if (newProgress >= 100) {
          clearInterval(interval);
          setReportStatus(prevStatus => ({ ...prevStatus, [reportId]: 'complete' }));
          toast({
            title: "Report Generated Successfully",
            description: `${report.name} is ready for download`,
          });
        }
        
        return { ...prev, [reportId]: newProgress };
      });
    }, 500);
  };

  const handleDownloadReport = (reportId: string) => {
    const report = reports.find(r => r.id === reportId);
    toast({
      title: "Download Started",
      description: `Downloading ${report?.name}...`,
    });
  };

  const handleSubmitReport = (reportId: string) => {
    const report = reports.find(r => r.id === reportId);
    toast({
      title: "Report Submitted",
      description: `${report?.name} submitted to regulatory authorities`,
    });
  };

  const getPriorityConfig = (priority: string) => {
    switch (priority) {
      case 'critical':
        return {
          color: 'bg-red-500/20 text-red-200 border-red-400/30',
          icon: <Zap className="h-3 w-3" />,
          label: 'CRITICAL'
        };
      case 'high':
        return {
          color: 'bg-yellow-500/20 text-yellow-200 border-yellow-400/30',
          icon: <AlertTriangle className="h-3 w-3" />,
          label: 'HIGH'
        };
      case 'medium':
        return {
          color: 'bg-green-500/20 text-green-200 border-green-400/30',
          icon: <Clock className="h-3 w-3" />,
          label: 'MEDIUM'
        };
      default:
        return {
          color: 'bg-gray-500/20 text-gray-200 border-gray-400/30',
          icon: <Clock className="h-3 w-3" />,
          label: 'LOW'
        };
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-white">Report Generation Hub</h2>
        <p className="text-white/70">Generate comprehensive reports for compliance, analytics, and decision-making</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reports.map((report) => {
          const status = reportStatus[report.id] || 'idle';
          const progress = reportProgress[report.id] || 0;
          const priorityConfig = getPriorityConfig(report.priority);

          return (
            <Card 
              key={report.id} 
              className={`backdrop-blur-xl ${report.bgColor} border ${report.borderColor} rounded-xl shadow-2xl hover:scale-[1.02] transition-all duration-300`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-lg bg-gradient-to-r ${report.color}`}>
                      {report.icon}
                    </div>
                    <div>
                      <CardTitle className="text-white text-lg">{report.name}</CardTitle>
                      <Badge className="mt-1 bg-white/10 text-white/70 border border-white/20 text-xs">
                        {report.type}
                      </Badge>
                    </div>
                  </div>
                  <Badge className={`${priorityConfig.color} flex items-center gap-1 border`}>
                    {priorityConfig.icon}
                    <span>{priorityConfig.label}</span>
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-white/80 text-sm">{report.description}</p>

                <div className="flex items-center gap-2 text-xs text-white/60">
                  <Clock className="h-3 w-3" />
                  <span>Est. generation time: {report.estimatedTime}</span>
                </div>

                {/* Progress Bar */}
                {status === 'generating' && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-white/70">Generating report...</span>
                      <span className="text-white">{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} className="h-2 bg-white/20" />
                  </div>
                )}

                {/* Status Indicator */}
                {status === 'complete' && (
                  <div className="flex items-center gap-2 p-2 bg-green-500/20 border border-green-400/30 rounded-lg">
                    <CheckCircle className="h-4 w-4 text-green-400" />
                    <span className="text-green-200 text-sm">Report generated successfully</span>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2">
                  {status === 'idle' && (
                    <Button
                      onClick={() => handleGenerateReport(report.id)}
                      className={`flex-1 bg-gradient-to-r ${report.color} hover:opacity-90 text-white border-0 rounded-lg`}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Generate Report
                    </Button>
                  )}

                  {status === 'generating' && (
                    <Button
                      disabled
                      className="flex-1 bg-white/10 text-white/60 border border-white/20 rounded-lg cursor-not-allowed"
                    >
                      <div className="animate-spin h-4 w-4 mr-2 border-2 border-white/20 border-t-white rounded-full"></div>
                      Generating...
                    </Button>
                  )}

                  {status === 'complete' && (
                    <>
                      <Button
                        onClick={() => handleDownloadReport(report.id)}
                        className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white border-0 rounded-lg"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                      <Button
                        onClick={() => handleSubmitReport(report.id)}
                        className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white border-0 rounded-lg"
                      >
                        <Send className="h-4 w-4 mr-2" />
                        Submit
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Summary Stats */}
      <Card className="backdrop-blur-xl bg-white/5 border border-white/20 rounded-xl">
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-white">4</div>
              <div className="text-white/70 text-sm">Available Reports</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-400">
                {Object.values(reportStatus).filter(s => s === 'complete').length}
              </div>
              <div className="text-white/70 text-sm">Generated Today</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-400">
                {Object.values(reportStatus).filter(s => s === 'generating').length}
              </div>
              <div className="text-white/70 text-sm">In Progress</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-400">24/7</div>
              <div className="text-white/70 text-sm">Availability</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportGenerationCards;
