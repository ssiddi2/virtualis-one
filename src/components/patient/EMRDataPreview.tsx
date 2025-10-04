import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Activity, Pill, FlaskConical, Scan, AlertCircle, Shield, FileText } from "lucide-react";
import { PatientClinicalData } from "@/hooks/usePatientClinicalData";
import { ScrollArea } from "@/components/ui/scroll-area";

interface EMRDataPreviewProps {
  data: PatientClinicalData | null | undefined;
  selectedData: string[];
  onToggleData: (dataType: string) => void;
}

const EMRDataPreview = ({ data, selectedData, onToggleData }: EMRDataPreviewProps) => {
  if (!data) {
    return (
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-white tech-font flex items-center gap-2">
            <FileText className="h-5 w-5 text-virtualis-gold" />
            EMR Data Preview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-white/60">No patient selected</p>
        </CardContent>
      </Card>
    );
  }

  const sections = [
    {
      id: 'vitals',
      icon: Activity,
      title: 'Vital Signs',
      color: 'text-green-400',
      count: data.vitalSigns.length,
      preview: data.vitalSigns[0] ? `Latest: BP ${data.vitalSigns[0].blood_pressure_systolic}/${data.vitalSigns[0].blood_pressure_diastolic}, HR ${data.vitalSigns[0].heart_rate}, Temp ${data.vitalSigns[0].temperature}°F` : 'No recent vitals',
    },
    {
      id: 'medications',
      icon: Pill,
      title: 'Active Medications',
      color: 'text-blue-400',
      count: data.medications.length,
      preview: data.medications.slice(0, 2).map(m => m.medication_name).join(', ') || 'No active medications',
    },
    {
      id: 'labs',
      icon: FlaskConical,
      title: 'Lab Results',
      color: 'text-purple-400',
      count: data.labOrders.length,
      preview: data.labOrders.slice(0, 2).map(l => l.test_name).join(', ') || 'No recent labs',
    },
    {
      id: 'imaging',
      icon: Scan,
      title: 'Imaging',
      color: 'text-cyan-400',
      count: data.radiologyOrders.length,
      preview: data.radiologyOrders.slice(0, 2).map(r => r.study_type).join(', ') || 'No recent imaging',
    },
    {
      id: 'problems',
      icon: AlertCircle,
      title: 'Problem List',
      color: 'text-orange-400',
      count: data.problemList.length,
      preview: data.problemList.slice(0, 2).map(p => p.problem_name).join(', ') || 'No active problems',
    },
    {
      id: 'allergies',
      icon: Shield,
      title: 'Allergies',
      color: 'text-red-400',
      count: data.allergies.length,
      preview: data.allergies.map(a => `${a.allergen} (${a.severity})`).join(', ') || 'No known allergies',
    },
  ];

  return (
    <Card className="glass-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white tech-font flex items-center gap-2">
            <FileText className="h-5 w-5 text-virtualis-gold" />
            EMR Data Preview
          </CardTitle>
          <Badge variant="outline" className="glass-badge success">
            {data.completeness}% Complete
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-3">
            {sections.map((section) => {
              const Icon = section.icon;
              const isSelected = selectedData.includes(section.id);
              
              return (
                <div
                  key={section.id}
                  className={`p-3 rounded-lg border transition-all ${
                    isSelected
                      ? 'bg-white/10 border-virtualis-gold/50'
                      : 'bg-black/20 border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => onToggleData(section.id)}
                      className="mt-1"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Icon className={`h-4 w-4 ${section.color}`} />
                        <span className="text-white font-medium tech-font text-sm">
                          {section.title}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {section.count}
                        </Badge>
                      </div>
                      <p className="text-white/60 text-xs truncate">
                        {section.preview}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
        
        <div className="mt-4 p-3 glass-nav-item">
          <p className="text-white/70 text-xs tech-font">
            ℹ️ Select data sections to include in AI-generated note. Unchecked sections will be excluded.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default EMRDataPreview;
