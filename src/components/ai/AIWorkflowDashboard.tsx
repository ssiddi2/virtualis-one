
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Brain, Users, Stethoscope, DollarSign, Code, FileText, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { usePatients } from '@/hooks/usePatients';
import { useMedicalRecords } from '@/hooks/useMedicalRecords';
import { useMedications } from '@/hooks/useMedications';
import { useBillingCharges } from '@/hooks/useBillingCharges';
import { useLabOrders } from '@/hooks/useLabOrders';
import { useAIAssistant } from '@/hooks/useAIAssistant';
import { useToast } from '@/hooks/use-toast';

interface AIWorkflowDashboardProps {
  hospitalId?: string;
}

const AIWorkflowDashboard = ({ hospitalId }: AIWorkflowDashboardProps) => {
  const [selectedPatient, setSelectedPatient] = useState<string>('');
  const [activeRole, setActiveRole] = useState<'physician' | 'nurse' | 'coder' | 'biller'>('physician');
  const [aiResult, setAiResult] = useState<string | null>(null);
  
  const { toast } = useToast();
  const { callAI, isLoading } = useAIAssistant();
  const { data: patients } = usePatients(hospitalId);
  const { data: medicalRecords } = useMedicalRecords(selectedPatient);
  const { data: medications } = useMedications(selectedPatient);
  const { data: billingCharges } = useBillingCharges(hospitalId);
  const { data: labOrders } = useLabOrders(selectedPatient);

  const currentPatient = patients?.find(p => p.id === selectedPatient);
  const patientBilling = billingCharges?.filter(c => c.patient_id === selectedPatient);

  const roleWorkflows = {
    physician: {
      title: 'Clinical Decision Support',
      icon: Stethoscope,
      color: 'text-blue-400',
      actions: [
        { name: 'Differential Diagnosis', description: 'AI-powered diagnostic suggestions based on symptoms' },
        { name: 'Drug Interactions', description: 'Check medication safety and contraindications' },
        { name: 'Clinical Guidelines', description: 'Evidence-based treatment recommendations' },
        { name: 'Risk Assessment', description: 'Patient risk stratification and alerts' }
      ]
    },
    nurse: {
      title: 'Nursing Care Support',
      icon: Users,
      color: 'text-green-400',
      actions: [
        { name: 'Care Plan Generation', description: 'NANDA-based nursing care plans' },
        { name: 'Medication Administration', description: 'Dosage verification and timing alerts' },
        { name: 'Patient Education', description: 'Personalized discharge instructions' },
        { name: 'Quality Indicators', description: 'Fall risk, pressure ulcer prevention' }
      ]
    },
    coder: {
      title: 'Medical Coding Assistant',
      icon: Code,
      color: 'text-purple-400',
      actions: [
        { name: 'ICD-10 Coding', description: 'Automated diagnosis code suggestions' },
        { name: 'CPT Coding', description: 'Procedure code recommendations' },
        { name: 'Code Validation', description: 'Compliance and accuracy checking' },
        { name: 'Documentation Review', description: 'Missing documentation alerts' }
      ]
    },
    biller: {
      title: 'Revenue Cycle Support',
      icon: DollarSign,
      color: 'text-yellow-400',
      actions: [
        { name: 'Claims Review', description: 'Pre-submission claim validation' },
        { name: 'Denial Prevention', description: 'Identify potential denial risks' },
        { name: 'Reimbursement Optimization', description: 'Maximize revenue opportunities' },
        { name: 'Prior Authorization', description: 'Automated PA requirement checks' }
      ]
    }
  };

  const handleAIAction = async (actionName: string) => {
    if (!selectedPatient) {
      toast({
        title: "No Patient Selected",
        description: "Please select a patient to use AI assistance.",
        variant: "destructive"
      });
      return;
    }

    const patientContext = `Patient: ${currentPatient?.first_name} ${currentPatient?.last_name}, Age: ${currentPatient ? new Date().getFullYear() - new Date(currentPatient.date_of_birth).getFullYear() : 'Unknown'}, Conditions: ${currentPatient?.medical_conditions?.join(', ') || 'None'}, Medications: ${medications?.map(m => m.medication_name).join(', ') || 'None'}`;

    try {
      let response = '';
      
      switch (actionName) {
        case 'Differential Diagnosis':
          const recentRecord = medicalRecords?.[0];
          if (!recentRecord?.chief_complaint) {
            toast({
              title: "No Clinical Data",
              description: "No recent clinical notes found for this patient.",
              variant: "destructive"
            });
            return;
          }
          response = await callAI({
            type: 'diagnosis_support',
            data: { symptoms: recentRecord.chief_complaint },
            context: patientContext
          });
          break;

        case 'Drug Interactions':
          if (!medications || medications.length === 0) {
            toast({
              title: "No Medications",
              description: "No active medications found for this patient.",
              variant: "destructive"
            });
            return;
          }
          response = await callAI({
            type: 'medication_check',
            data: {
              medications: medications.map(m => `${m.medication_name} ${m.dosage}`).join(', '),
              age: currentPatient ? new Date().getFullYear() - new Date(currentPatient.date_of_birth).getFullYear() : null,
              conditions: currentPatient?.medical_conditions?.join(', ') || 'None'
            }
          });
          break;

        case 'Care Plan Generation':
          response = await callAI({
            type: 'care_plan',
            data: {
              condition: currentPatient?.medical_conditions?.join(', ') || 'General care',
              assessment: medicalRecords?.[0]?.assessment || 'Standard assessment'
            }
          });
          break;

        case 'ICD-10 Coding':
        case 'CPT Coding':
          const recordForCoding = medicalRecords?.[0];
          if (!recordForCoding) {
            toast({
              title: "No Medical Records",
              description: "No medical records found for coding analysis.",
              variant: "destructive"
            });
            return;
          }
          response = await callAI({
            type: 'medical_coding',
            data: {
              diagnosis: recordForCoding.assessment,
              procedure: recordForCoding.plan,
              context: `${recordForCoding.chief_complaint} - ${recordForCoding.physical_examination}`
            }
          });
          break;

        case 'Claims Review':
          if (!patientBilling || patientBilling.length === 0) {
            toast({
              title: "No Billing Data",
              description: "No billing charges found for this patient.",
              variant: "destructive"
            });
            return;
          }
          const topCharge = patientBilling[0];
          response = await callAI({
            type: 'claims_review',
            data: {
              procedure: topCharge.charge_description,
              diagnosis: medicalRecords?.[0]?.assessment || 'Not specified',
              codes: topCharge.charge_code,
              insurance: currentPatient?.insurance_provider || 'Not specified'
            }
          });
          break;

        default:
          response = `AI analysis for ${actionName} would be performed here with patient data from ${currentPatient?.first_name} ${currentPatient?.last_name}.`;
      }

      setAiResult(response);
      toast({
        title: "AI Analysis Complete",
        description: `${actionName} analysis generated successfully.`
      });
    } catch (error) {
      toast({
        title: "AI Analysis Failed",
        description: "Unable to complete AI analysis. Please try again.",
        variant: "destructive"
      });
    }
  };

  const currentWorkflow = roleWorkflows[activeRole];

  return (
    <div className="space-y-6">
      {/* Patient Selection */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Brain className="h-5 w-5 text-virtualis-gold" />
            AI Healthcare Assistant - Workflow Demo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white mb-2">Select Patient</label>
              <Select value={selectedPatient} onValueChange={setSelectedPatient}>
                <SelectTrigger className="glass-input">
                  <SelectValue placeholder="Choose a patient to analyze" />
                </SelectTrigger>
                <SelectContent className="bg-virtualis-navy border-white/20">
                  {patients?.map((patient) => (
                    <SelectItem key={patient.id} value={patient.id} className="text-white hover:bg-white/10">
                      {patient.first_name} {patient.last_name} (MRN: {patient.mrn})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-white mb-2">Your Role</label>
              <Select value={activeRole} onValueChange={(value: any) => setActiveRole(value)}>
                <SelectTrigger className="glass-input">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-virtualis-navy border-white/20">
                  <SelectItem value="physician" className="text-white hover:bg-white/10">👨‍⚕️ Physician</SelectItem>
                  <SelectItem value="nurse" className="text-white hover:bg-white/10">👩‍⚕️ Nurse</SelectItem>
                  <SelectItem value="coder" className="text-white hover:bg-white/10">💻 Medical Coder</SelectItem>
                  <SelectItem value="biller" className="text-white hover:bg-white/10">💰 Biller</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {selectedPatient && currentPatient && (
            <div className="p-4 glass-nav-item rounded-lg">
              <h3 className="text-white font-medium mb-2">Patient Overview</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-slate-400">Name:</span>
                  <span className="text-white ml-2">{currentPatient.first_name} {currentPatient.last_name}</span>
                </div>
                <div>
                  <span className="text-slate-400">Age:</span>
                  <span className="text-white ml-2">{new Date().getFullYear() - new Date(currentPatient.date_of_birth).getFullYear()}</span>
                </div>
                <div>
                  <span className="text-slate-400">Room:</span>
                  <span className="text-white ml-2">{currentPatient.room_number || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-slate-400">Status:</span>
                  <Badge className="ml-2 bg-green-600/20 text-green-300">{currentPatient.status}</Badge>
                </div>
              </div>
              {currentPatient.medical_conditions && currentPatient.medical_conditions.length > 0 && (
                <div className="mt-2">
                  <span className="text-slate-400 text-sm">Conditions:</span>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {currentPatient.medical_conditions.map((condition, index) => (
                      <Badge key={index} variant="secondary" className="text-xs bg-slate-600 text-slate-300">
                        {condition}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Role-Based AI Actions */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <currentWorkflow.icon className={`h-5 w-5 ${currentWorkflow.color}`} />
            {currentWorkflow.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentWorkflow.actions.map((action) => (
              <div key={action.name} className="p-4 glass-nav-item rounded-lg">
                <h4 className="text-white font-medium mb-2">{action.name}</h4>
                <p className="text-slate-300 text-sm mb-3">{action.description}</p>
                <Button
                  onClick={() => handleAIAction(action.name)}
                  disabled={!selectedPatient || isLoading}
                  className="w-full glass-button text-sm"
                >
                  {isLoading ? 'Analyzing...' : 'Run AI Analysis'}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Results */}
      {aiResult && (
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Brain className="h-5 w-5 text-virtualis-gold" />
              AI Analysis Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-black/20 rounded-lg border border-white/10">
              <pre className="whitespace-pre-wrap text-sm text-slate-300 font-sans">{aiResult}</pre>
            </div>
            <div className="mt-4 p-3 bg-orange-600/20 border border-orange-600/30 rounded-lg">
              <p className="text-orange-300 text-sm">
                <strong>Clinical Disclaimer:</strong> AI recommendations are for decision support only. 
                All clinical decisions must be made by qualified healthcare professionals.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AIWorkflowDashboard;
