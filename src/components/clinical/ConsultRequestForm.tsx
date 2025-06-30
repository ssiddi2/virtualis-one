
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Send, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const ConsultRequestForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    patientMrn: '',
    consultingService: '',
    urgency: '',
    reason: '',
    clinicalQuestion: '',
    preferredConsultant: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Consult Request Submitted",
      description: "Your consultation request has been sent to the consulting service.",
    });
    navigate('/clinical');
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen p-6" style={{
      background: 'linear-gradient(135deg, hsl(225, 70%, 25%) 0%, hsl(220, 65%, 35%) 25%, hsl(215, 60%, 45%) 50%, hsl(210, 55%, 55%) 75%, hsl(205, 50%, 65%) 100%)'
    }}>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button 
            onClick={() => navigate('/clinical')}
            variant="outline"
            className="border-white/30 text-white hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-white">Request Consultation</h1>
            <p className="text-white/70">Submit a consultation request to another service</p>
          </div>
        </div>

        {/* Form */}
        <Card className="backdrop-blur-xl bg-blue-500/10 border border-blue-300/30">
          <CardHeader>
            <CardTitle className="text-white">Consultation Request</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="patientMrn" className="text-white">Patient MRN</Label>
                  <Input
                    id="patientMrn"
                    value={formData.patientMrn}
                    onChange={(e) => handleInputChange('patientMrn', e.target.value)}
                    className="bg-blue-600/20 border-blue-400/30 text-white"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="consultingService" className="text-white">Consulting Service</Label>
                  <Select value={formData.consultingService} onValueChange={(value) => handleInputChange('consultingService', value)}>
                    <SelectTrigger className="bg-blue-600/20 border-blue-400/30 text-white">
                      <SelectValue placeholder="Select service" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cardiology">Cardiology</SelectItem>
                      <SelectItem value="neurology">Neurology</SelectItem>
                      <SelectItem value="oncology">Oncology</SelectItem>
                      <SelectItem value="surgery">Surgery</SelectItem>
                      <SelectItem value="psychiatry">Psychiatry</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="urgency" className="text-white">Urgency</Label>
                  <Select value={formData.urgency} onValueChange={(value) => handleInputChange('urgency', value)}>
                    <SelectTrigger className="bg-blue-600/20 border-blue-400/30 text-white">
                      <SelectValue placeholder="Select urgency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="stat">STAT</SelectItem>
                      <SelectItem value="urgent">Urgent (within 24h)</SelectItem>
                      <SelectItem value="routine">Routine</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="preferredConsultant" className="text-white">Preferred Consultant (Optional)</Label>
                  <Input
                    id="preferredConsultant"
                    value={formData.preferredConsultant}
                    onChange={(e) => handleInputChange('preferredConsultant', e.target.value)}
                    className="bg-blue-600/20 border-blue-400/30 text-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reason" className="text-white">Reason for Consultation</Label>
                <Textarea
                  id="reason"
                  value={formData.reason}
                  onChange={(e) => handleInputChange('reason', e.target.value)}
                  className="bg-blue-600/20 border-blue-400/30 text-white"
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="clinicalQuestion" className="text-white">Specific Clinical Question</Label>
                <Textarea
                  id="clinicalQuestion"
                  value={formData.clinicalQuestion}
                  onChange={(e) => handleInputChange('clinicalQuestion', e.target.value)}
                  className="bg-blue-600/20 border-blue-400/30 text-white"
                  rows={4}
                  required
                />
              </div>

              <div className="flex gap-4">
                <Button 
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Submit Request
                </Button>
                <Button 
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/clinical')}
                  className="border-white/30 text-white hover:bg-white/10"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ConsultRequestForm;
