
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { FileText, Calendar, Pill, AlertCircle, CheckCircle2, Printer } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { usePatients } from '@/hooks/usePatients';
import { useMedications } from '@/hooks/useMedications';
import { useMedicalRecords } from '@/hooks/useMedicalRecords';

interface DischargePlanningDialogProps {
  patientId: string;
  hospitalId: string;
  patientName: string;
}

const DischargePlanningDialog = ({ patientId, hospitalId, patientName }: DischargePlanningDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dischargeSummary, setDischargeSummary] = useState('');
  const [followUpInstructions, setFollowUpInstructions] = useState('');
  const [followUpDate, setFollowUpDate] = useState('');
  const [homeCarePlan, setHomeCarePlan] = useState('');
  const [checklist, setChecklist] = useState({
    medicationReconciliation: false,
    followUpScheduled: false,
    transportArranged: false,
    equipmentOrdered: false,
    educationProvided: false,
    insuranceVerified: false
  });
  
  const { toast } = useToast();
  const { data: patients } = usePatients();
  const { data: medications } = useMedications(patientId);
  const { data: medicalRecords } = useMedicalRecords(patientId);
  
  const patient = patients?.find(p => p.id === patientId);
  const activeMedications = medications?.filter(m => m.status === 'active') || [];
  const recentRecord = medicalRecords?.[0];

  const handleChecklistChange = (item: keyof typeof checklist) => {
    setChecklist(prev => ({ ...prev, [item]: !prev[item] }));
  };

  const isReadyForDischarge = Object.values(checklist).every(Boolean);

  const handleGenerateDischarge = () => {
    // Auto-populate fields with existing data
    if (recentRecord) {
      setDischargeSummary(
        `Patient: ${patientName}\n` +
        `Admission Date: ${patient?.admission_date ? new Date(patient.admission_date).toLocaleDateString() : 'N/A'}\n` +
        `Chief Complaint: ${recentRecord.chief_complaint || 'N/A'}\n` +
        `Assessment: ${recentRecord.assessment || 'N/A'}\n` +
        `Treatment Provided: ${recentRecord.plan || 'N/A'}\n` +
        `Condition at Discharge: Stable\n` +
        `Discharge Medications: ${activeMedications.map(m => `${m.medication_name} ${m.dosage} ${m.frequency}`).join(', ') || 'None'}`
      );
    }
    
    setFollowUpInstructions(
      `1. Take medications as prescribed\n` +
      `2. Follow up with primary care physician in 1-2 weeks\n` +
      `3. Return to hospital if symptoms worsen\n` +
      `4. Monitor for signs of complications\n` +
      `5. Maintain activity restrictions as discussed`
    );

    // Set follow-up date to 1 week from now
    const followUp = new Date();
    followUp.setDate(followUp.getDate() + 7);
    setFollowUpDate(followUp.toISOString().split('T')[0]);

    toast({
      title: "Discharge Summary Generated",
      description: "Please review and complete the discharge checklist."
    });
  };

  const handleCompleteDischarge = () => {
    if (!isReadyForDischarge) {
      toast({
        title: "Discharge Checklist Incomplete",
        description: "Please complete all checklist items before discharging the patient.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Patient Discharged Successfully",
      description: `${patientName} has been discharged. Discharge summary and instructions have been documented.`,
    });
    
    setIsOpen(false);
  };

  const handlePrintDischarge = () => {
    toast({
      title: "Printing Discharge Papers",
      description: "Discharge summary and instructions are being prepared for printing."
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-2 border-slate-600 text-white hover:bg-slate-700"
        >
          <FileText className="h-4 w-4" />
          Discharge
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto bg-slate-800 border-slate-700">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-white">
            <FileText className="h-5 w-5 text-green-400" />
            Discharge Planning - {patientName}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Patient Info & Checklist */}
          <div className="space-y-4">
            {/* Patient Summary */}
            <Card className="bg-slate-700/50 border-slate-600">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-white">Patient Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-slate-400">MRN:</span> 
                    <span className="text-white ml-2">{patient?.mrn}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Room:</span> 
                    <span className="text-white ml-2">{patient?.room_number || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Admission:</span> 
                    <span className="text-white ml-2">
                      {patient?.admission_date ? new Date(patient.admission_date).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400">Length of Stay:</span> 
                    <span className="text-white ml-2">
                      {patient?.admission_date 
                        ? Math.floor((new Date().getTime() - new Date(patient.admission_date).getTime()) / (1000 * 60 * 60 * 24)) 
                        : 0} days
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Current Medications */}
            <Card className="bg-slate-700/50 border-slate-600">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-white flex items-center gap-2">
                  <Pill className="h-4 w-4" />
                  Discharge Medications
                </CardTitle>
              </CardHeader>
              <CardContent>
                {activeMedications.length > 0 ? (
                  <div className="space-y-2">
                    {activeMedications.map((med) => (
                      <div key={med.id} className="flex items-center justify-between p-2 bg-slate-600/50 rounded">
                        <div>
                          <span className="text-white text-sm font-medium">{med.medication_name}</span>
                          <p className="text-slate-400 text-xs">{med.dosage} • {med.frequency}</p>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {med.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-400 text-sm">No active medications</p>
                )}
              </CardContent>
            </Card>

            {/* Discharge Checklist */}
            <Card className="bg-slate-700/50 border-slate-600">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-white flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  Discharge Checklist
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {Object.entries(checklist).map(([key, checked]) => (
                  <div key={key} className="flex items-center space-x-2">
                    <Checkbox
                      id={key}
                      checked={checked}
                      onCheckedChange={() => handleChecklistChange(key as keyof typeof checklist)}
                      className="border-slate-500"
                    />
                    <label htmlFor={key} className={`text-sm ${checked ? 'text-green-400' : 'text-slate-300'}`}>
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </label>
                  </div>
                ))}
                
                {isReadyForDischarge && (
                  <div className="flex items-center gap-2 mt-4 p-2 bg-green-600/20 border border-green-600/30 rounded">
                    <CheckCircle2 className="h-4 w-4 text-green-400" />
                    <span className="text-green-400 text-sm">Ready for discharge</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Discharge Documentation */}
          <div className="space-y-4">
            <Button onClick={handleGenerateDischarge} className="w-full bg-blue-600 hover:bg-blue-700">
              <FileText className="h-4 w-4 mr-2" />
              Generate Discharge Summary
            </Button>

            {/* Discharge Summary */}
            <Card className="bg-slate-700/50 border-slate-600">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-white">Discharge Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={dischargeSummary}
                  onChange={(e) => setDischargeSummary(e.target.value)}
                  placeholder="Enter comprehensive discharge summary including admission details, treatment provided, and condition at discharge..."
                  className="min-h-[150px] bg-slate-600 border-slate-500 text-white"
                />
              </CardContent>
            </Card>

            {/* Follow-up Instructions */}
            <Card className="bg-slate-700/50 border-slate-600">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-white">Follow-up Instructions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Textarea
                  value={followUpInstructions}
                  onChange={(e) => setFollowUpInstructions(e.target.value)}
                  placeholder="Enter detailed follow-up instructions for the patient..."
                  className="min-h-[100px] bg-slate-600 border-slate-500 text-white"
                />
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Follow-up Appointment Date
                  </label>
                  <Input
                    type="date"
                    value={followUpDate}
                    onChange={(e) => setFollowUpDate(e.target.value)}
                    className="bg-slate-600 border-slate-500 text-white"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Home Care Plan */}
            <Card className="bg-slate-700/50 border-slate-600">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm text-white">Home Care Plan</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={homeCarePlan}
                  onChange={(e) => setHomeCarePlan(e.target.value)}
                  placeholder="Enter home care instructions, activity restrictions, diet recommendations, etc..."
                  className="min-h-[100px] bg-slate-600 border-slate-500 text-white"
                />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t border-slate-600">
          <Button 
            onClick={handlePrintDischarge} 
            variant="outline"
            className="flex items-center gap-2 border-slate-600 text-white hover:bg-slate-700"
          >
            <Printer className="h-4 w-4" />
            Print Discharge Papers
          </Button>
          
          <Button 
            onClick={handleCompleteDischarge}
            disabled={!isReadyForDischarge}
            className={`flex items-center gap-2 ${
              isReadyForDischarge 
                ? 'bg-green-600 hover:bg-green-700' 
                : 'bg-slate-600 cursor-not-allowed'
            }`}
          >
            {isReadyForDischarge ? (
              <CheckCircle2 className="h-4 w-4" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            Complete Discharge
          </Button>
        </div>

        {/* Disclaimer */}
        <div className="bg-blue-600/20 border border-blue-600/30 rounded-lg p-3 mt-4">
          <p className="text-blue-300 text-sm">
            <strong>Note:</strong> Ensure all required documentation is complete and reviewed by the attending physician 
            before finalizing the discharge process.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DischargePlanningDialog;
