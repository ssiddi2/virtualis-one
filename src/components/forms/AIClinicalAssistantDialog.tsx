
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, Loader2, Stethoscope, FileText, Activity } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAIAssistant } from '@/hooks/useAIAssistant';
import { usePatients } from '@/hooks/usePatients';
import { useMedicalRecords } from '@/hooks/useMedicalRecords';
import { useMedications } from '@/hooks/useMedications';

interface AIClinicalAssistantDialogProps {
  patientId: string;
  hospitalId: string;
  patientName: string;
}

const AIClinicalAssistantDialog = ({ patientId, hospitalId, patientName }: AIClinicalAssistantDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'diagnosis' | 'medication' | 'care_plan'>('diagnosis');
  const [symptoms, setSymptoms] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const { toast } = useToast();
  const { callAI, isLoading } = useAIAssistant();
  
  const { data: patients } = usePatients();
  const { data: medicalRecords } = useMedicalRecords(patientId);
  const { data: medications } = useMedications(patientId);
  
  const patient = patients?.find(p => p.id === patientId);

  const handleDiagnosisSupport = async () => {
    if (!symptoms.trim()) {
      toast({
        title: "Error",
        description: "Please enter symptoms or clinical findings.",
        variant: "destructive"
      });
      return;
    }

    try {
      const context = `Patient: ${patientName}, Age: ${patient ? new Date().getFullYear() - new Date(patient.date_of_birth).getFullYear() : 'Unknown'}, Gender: ${patient?.gender || 'Unknown'}, Medical History: ${patient?.medical_conditions?.join(', ') || 'None documented'}, Current Medications: ${medications?.map(m => m.medication_name).join(', ') || 'None'}`;
      
      const response = await callAI({
        type: 'diagnosis_support',
        data: { symptoms },
        context
      });
      
      setResult(response);
      toast({
        title: "AI Analysis Complete",
        description: "Differential diagnosis suggestions generated successfully."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate diagnosis support. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleMedicationCheck = async () => {
    if (!medications || medications.length === 0) {
      toast({
        title: "No Medications",
        description: "No active medications found for this patient.",
        variant: "destructive"
      });
      return;
    }

    try {
      const medList = medications.map(m => `${m.medication_name} ${m.dosage} ${m.frequency}`).join(', ');
      const age = patient ? new Date().getFullYear() - new Date(patient.date_of_birth).getFullYear() : null;
      
      const response = await callAI({
        type: 'medication_check',
        data: {
          medications: medList,
          age,
          conditions: patient?.medical_conditions?.join(', ') || 'None specified'
        }
      });
      
      setResult(response);
      toast({
        title: "Medication Review Complete",
        description: "Medication interaction analysis completed."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to review medications. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleCarePlan = async () => {
    if (!patient?.medical_conditions || patient.medical_conditions.length === 0) {
      toast({
        title: "No Conditions",
        description: "No medical conditions documented for care plan generation.",
        variant: "destructive"
      });
      return;
    }

    try {
      const recentNote = medicalRecords?.[0];
      const assessment = recentNote ? `${recentNote.chief_complaint || ''} ${recentNote.assessment || ''}`.trim() : 'Standard assessment';
      
      const response = await callAI({
        type: 'care_plan',
        data: {
          condition: patient.medical_conditions.join(', '),
          assessment
        }
      });
      
      setResult(response);
      toast({
        title: "Care Plan Generated",
        description: "Nursing care plan created successfully."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate care plan. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-2 border-slate-600 text-white hover:bg-slate-700"
        >
          <Brain className="h-4 w-4" />
          AI Assistant
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-slate-800 border-slate-700">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-white">
            <Brain className="h-5 w-5 text-blue-400" />
            AI Clinical Assistant - {patientName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Tab Navigation */}
          <div className="flex gap-2">
            <Button
              variant={activeTab === 'diagnosis' ? 'default' : 'outline'}
              onClick={() => { setActiveTab('diagnosis'); setResult(null); }}
              className="flex items-center gap-2"
            >
              <Stethoscope className="h-4 w-4" />
              Diagnosis Support
            </Button>
            <Button
              variant={activeTab === 'medication' ? 'default' : 'outline'}
              onClick={() => { setActiveTab('medication'); setResult(null); }}
              className="flex items-center gap-2"
            >
              <Activity className="h-4 w-4" />
              Medication Review
            </Button>
            <Button
              variant={activeTab === 'care_plan' ? 'default' : 'outline'}
              onClick={() => { setActiveTab('care_plan'); setResult(null); }}
              className="flex items-center gap-2"
            >
              <FileText className="h-4 w-4" />
              Care Planning
            </Button>
          </div>

          {/* Patient Context */}
          <Card className="bg-slate-700/50 border-slate-600">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-white">Patient Context</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-slate-400">Age:</span> 
                  <span className="text-white ml-2">
                    {patient ? new Date().getFullYear() - new Date(patient.date_of_birth).getFullYear() : 'Unknown'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400">Gender:</span> 
                  <span className="text-white ml-2">{patient?.gender || 'Unknown'}</span>
                </div>
              </div>
              {patient?.allergies && patient.allergies.length > 0 && (
                <div>
                  <span className="text-slate-400 text-sm">Allergies:</span>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {patient.allergies.map((allergy, index) => (
                      <Badge key={index} variant="destructive" className="text-xs">
                        {allergy}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              {patient?.medical_conditions && patient.medical_conditions.length > 0 && (
                <div>
                  <span className="text-slate-400 text-sm">Conditions:</span>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {patient.medical_conditions.map((condition, index) => (
                      <Badge key={index} variant="secondary" className="text-xs bg-slate-600 text-slate-300">
                        {condition}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Content based on active tab */}
          {activeTab === 'diagnosis' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Clinical Symptoms & Findings
                </label>
                <Textarea
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  placeholder="Enter patient symptoms, physical exam findings, and relevant clinical observations..."
                  className="min-h-[100px] bg-slate-700 border-slate-600 text-white"
                />
              </div>
              <Button 
                onClick={handleDiagnosisSupport} 
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Stethoscope className="h-4 w-4 mr-2" />}
                Generate Differential Diagnosis
              </Button>
            </div>
          )}

          {activeTab === 'medication' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-white font-medium mb-2">Current Medications</h3>
                {medications && medications.length > 0 ? (
                  <div className="space-y-2">
                    {medications.map((med) => (
                      <div key={med.id} className="p-2 bg-slate-700/50 rounded border border-slate-600">
                        <span className="text-white font-medium">{med.medication_name}</span>
                        <span className="text-slate-400 ml-2">{med.dosage} • {med.frequency}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-400">No active medications</p>
                )}
              </div>
              <Button 
                onClick={handleMedicationCheck} 
                disabled={isLoading || !medications || medications.length === 0}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Activity className="h-4 w-4 mr-2" />}
                Review Medication Interactions
              </Button>
            </div>
          )}

          {activeTab === 'care_plan' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-white font-medium mb-2">Medical Conditions</h3>
                {patient?.medical_conditions && patient.medical_conditions.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {patient.medical_conditions.map((condition, index) => (
                      <Badge key={index} variant="secondary" className="bg-slate-600 text-slate-300">
                        {condition}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-400">No documented conditions</p>
                )}
              </div>
              <Button 
                onClick={handleCarePlan} 
                disabled={isLoading || !patient?.medical_conditions || patient.medical_conditions.length === 0}
                className="w-full bg-purple-600 hover:bg-purple-700"
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <FileText className="h-4 w-4 mr-2" />}
                Generate Nursing Care Plan
              </Button>
            </div>
          )}

          {/* AI Response */}
          {result && (
            <Card className="bg-slate-700/50 border-slate-600">
              <CardHeader>
                <CardTitle className="text-white text-base">AI Analysis Results</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-invert max-w-none">
                  <pre className="whitespace-pre-wrap text-sm text-slate-300 font-sans">{result}</pre>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Disclaimer */}
          <div className="bg-orange-600/20 border border-orange-600/30 rounded-lg p-4">
            <p className="text-orange-300 text-sm">
              <strong>Disclaimer:</strong> AI-generated recommendations are for educational and decision support purposes only. 
              All clinical decisions must be made by qualified healthcare professionals based on their clinical judgment and patient assessment.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AIClinicalAssistantDialog;
