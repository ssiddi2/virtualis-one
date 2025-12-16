
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/EnterpriseAuthContext';
import { useToast } from '@/hooks/use-toast';
import { Heart, Activity, AlertCircle } from 'lucide-react';

interface NursingDocumentationProps {
  patientId: string;
  hospitalId: string;
}

const NursingDocumentation = ({ patientId, hospitalId }: NursingDocumentationProps) => {
  const { profile } = useAuth();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    shiftType: 'day',
    assessmentType: 'admission',
    vitalSigns: {
      temperature: '',
      bloodPressure: '',
      heartRate: '',
      respiratoryRate: '',
      oxygenSaturation: '',
      painLevel: ''
    },
    nursingAssessment: '',
    interventions: '',
    patientResponse: '',
    nursingDiagnosis: '',
    goals: '',
    additionalNotes: ''
  });

  const shiftTypes = ['day', 'evening', 'night'];
  const assessmentTypes = ['admission', 'shift', 'focused', 'discharge'];

  const handleVitalSignChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      vitalSigns: {
        ...prev.vitalSigns,
        [field]: value
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Here you would normally save to the database
      console.log('Nursing documentation submitted:', formData);
      
      toast({
        title: "Nursing Documentation Saved",
        description: "Documentation has been successfully recorded"
      });

      // Reset form
      setFormData({
        shiftType: 'day',
        assessmentType: 'admission',
        vitalSigns: {
          temperature: '',
          bloodPressure: '',
          heartRate: '',
          respiratoryRate: '',
          oxygenSaturation: '',
          painLevel: ''
        },
        nursingAssessment: '',
        interventions: '',
        patientResponse: '',
        nursingDiagnosis: '',
        goals: '',
        additionalNotes: ''
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save nursing documentation",
        variant: "destructive"
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-red-500" />
          Nursing Documentation
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="shiftType">Shift Type</Label>
              <Select 
                value={formData.shiftType} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, shiftType: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {shiftTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)} Shift
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="assessmentType">Assessment Type</Label>
              <Select 
                value={formData.assessmentType} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, assessmentType: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {assessmentTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)} Assessment
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Vital Signs Section */}
          <div className="border rounded-lg p-4">
            <h3 className="font-medium mb-4 flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Vital Signs
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Temperature (°F)</Label>
                <Input
                  value={formData.vitalSigns.temperature}
                  onChange={(e) => handleVitalSignChange('temperature', e.target.value)}
                  placeholder="98.6"
                />
              </div>
              <div className="space-y-2">
                <Label>Blood Pressure</Label>
                <Input
                  value={formData.vitalSigns.bloodPressure}
                  onChange={(e) => handleVitalSignChange('bloodPressure', e.target.value)}
                  placeholder="120/80"
                />
              </div>
              <div className="space-y-2">
                <Label>Heart Rate (bpm)</Label>
                <Input
                  value={formData.vitalSigns.heartRate}
                  onChange={(e) => handleVitalSignChange('heartRate', e.target.value)}
                  placeholder="72"
                />
              </div>
              <div className="space-y-2">
                <Label>Respiratory Rate</Label>
                <Input
                  value={formData.vitalSigns.respiratoryRate}
                  onChange={(e) => handleVitalSignChange('respiratoryRate', e.target.value)}
                  placeholder="16"
                />
              </div>
              <div className="space-y-2">
                <Label>O2 Saturation (%)</Label>
                <Input
                  value={formData.vitalSigns.oxygenSaturation}
                  onChange={(e) => handleVitalSignChange('oxygenSaturation', e.target.value)}
                  placeholder="98"
                />
              </div>
              <div className="space-y-2">
                <Label>Pain Level (0-10)</Label>
                <Input
                  value={formData.vitalSigns.painLevel}
                  onChange={(e) => handleVitalSignChange('painLevel', e.target.value)}
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="nursingAssessment">Nursing Assessment</Label>
            <Textarea
              id="nursingAssessment"
              value={formData.nursingAssessment}
              onChange={(e) => setFormData(prev => ({ ...prev, nursingAssessment: e.target.value }))}
              placeholder="Patient assessment findings..."
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="interventions">Nursing Interventions</Label>
            <Textarea
              id="interventions"
              value={formData.interventions}
              onChange={(e) => setFormData(prev => ({ ...prev, interventions: e.target.value }))}
              placeholder="Interventions performed..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="patientResponse">Patient Response</Label>
            <Textarea
              id="patientResponse"
              value={formData.patientResponse}
              onChange={(e) => setFormData(prev => ({ ...prev, patientResponse: e.target.value }))}
              placeholder="Patient's response to interventions..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="nursingDiagnosis">Nursing Diagnosis</Label>
            <Textarea
              id="nursingDiagnosis"
              value={formData.nursingDiagnosis}
              onChange={(e) => setFormData(prev => ({ ...prev, nursingDiagnosis: e.target.value }))}
              placeholder="NANDA-approved nursing diagnoses..."
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="goals">Goals/Outcomes</Label>
            <Textarea
              id="goals"
              value={formData.goals}
              onChange={(e) => setFormData(prev => ({ ...prev, goals: e.target.value }))}
              placeholder="Expected outcomes and goals..."
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="additionalNotes">Additional Notes</Label>
            <Textarea
              id="additionalNotes"
              value={formData.additionalNotes}
              onChange={(e) => setFormData(prev => ({ ...prev, additionalNotes: e.target.value }))}
              placeholder="Any additional observations or notes..."
              rows={3}
            />
          </div>

          <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-700">
              <p className="font-medium">Documentation Standards</p>
              <p>All nursing documentation follows evidence-based practice guidelines and institutional policies.</p>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline">
              Save as Draft
            </Button>
            <Button type="submit" className="bg-red-600 hover:bg-red-700">
              Save Documentation
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default NursingDocumentation;
