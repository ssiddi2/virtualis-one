
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  TestTube, 
  Scan, 
  Pill, 
  Brain, 
  Plus,
  Stethoscope,
  Activity,
  ClipboardList
} from 'lucide-react';
import AIEnhancedNoteDialogWrapper from '@/components/forms/AIEnhancedNoteDialogWrapper';
import NewLabOrderDialogWrapper from '@/components/forms/NewLabOrderDialogWrapper';
import NewRadiologyOrderDialogWrapper from '@/components/forms/NewRadiologyOrderDialogWrapper';
import { useToast } from '@/hooks/use-toast';

interface PatientActionsPanelProps {
  patientId: string;
  hospitalId: string;
  patientName?: string;
}

const PatientActionsPanel = ({ patientId, hospitalId, patientName }: PatientActionsPanelProps) => {
  const { toast } = useToast();
  const [isCreatingVitals, setIsCreatingVitals] = useState(false);

  const handleCreateVitals = async () => {
    setIsCreatingVitals(true);
    // Simulate vitals creation
    setTimeout(() => {
      toast({
        title: "Vital Signs Recorded",
        description: `New vital signs recorded for ${patientName || 'patient'}`,
      });
      setIsCreatingVitals(false);
    }, 1000);
  };

  const handleCreateMedication = () => {
    toast({
      title: "Medication Order",
      description: "Medication ordering system would open here",
    });
  };

  const quickActions = [
    {
      title: "Vital Signs",
      icon: Activity,
      action: handleCreateVitals,
      loading: isCreatingVitals,
      color: "bg-green-600 hover:bg-green-700"
    },
    {
      title: "Medication",
      icon: Pill,
      action: handleCreateMedication,
      loading: false,
      color: "bg-purple-600 hover:bg-purple-700"
    }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5" />
            Patient Actions
            {patientName && (
              <Badge variant="outline" className="ml-2">
                {patientName}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Primary Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <AIEnhancedNoteDialogWrapper 
              patientId={patientId} 
              hospitalId={hospitalId}
              patientName={patientName}
            />
            
            <NewLabOrderDialogWrapper 
              patientId={patientId}
              patientName={patientName}
            />
            
            <NewRadiologyOrderDialogWrapper 
              patientId={patientId}
              patientName={patientName}
            />

            {quickActions.map((action) => (
              <Button
                key={action.title}
                onClick={action.action}
                disabled={action.loading}
                className={`flex items-center gap-2 ${action.color}`}
              >
                <action.icon className="h-4 w-4" />
                {action.loading ? 'Recording...' : action.title}
              </Button>
            ))}
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">5</div>
              <div className="text-xs text-muted-foreground">Active Orders</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">12</div>
              <div className="text-xs text-muted-foreground">Notes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">3</div>
              <div className="text-xs text-muted-foreground">Medications</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Assistant Quick Access */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Brain className="h-4 w-4 text-purple-600" />
            AI Clinical Assistant
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-3">
            Get AI-powered clinical insights, documentation assistance, and decision support.
          </p>
          <Button 
            size="sm" 
            className="bg-purple-600 hover:bg-purple-700"
            onClick={() => {
              toast({
                title: "AI Assistant",
                description: "Opening AI clinical assistant...",
              });
            }}
          >
            <Brain className="h-3 w-3 mr-2" />
            Launch AI Assistant
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default PatientActionsPanel;
