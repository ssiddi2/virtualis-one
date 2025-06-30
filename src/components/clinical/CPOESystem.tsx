import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Plus, Clock, User, Pill, Activity, FileText } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMedicationSafety } from '@/hooks/useMedicationSafety';
import { useToast } from '@/hooks/use-toast';

const CPOESystem = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { validateMedication } = useMedicationSafety(patientId || '');

  const [activeTab, setActiveTab] = useState('medications');
  const [medicationForm, setMedicationForm] = useState({
    name: '',
    dosage: '',
    frequency: '',
    route: '',
    duration: '',
    indication: ''
  });

  const handleMedicationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate medication safety
    const safety = validateMedication(medicationForm.name, medicationForm.dosage);
    
    if (!safety.iseSafe) {
      toast({
        title: "Safety Check Required",
        description: "Please review all warnings before proceeding",
        variant: "destructive",
      });
      return;
    }

    // In production, this would submit to the database
    toast({
      title: "Order Submitted",
      description: `${medicationForm.name} order placed successfully`,
    });
    
    // Reset form
    setMedicationForm({
      name: '',
      dosage: '',
      frequency: '',
      route: '',
      duration: '',
      indication: ''
    });
  };

  return (
    <div className="min-h-screen p-6" style={{
      background: 'linear-gradient(135deg, hsl(225, 70%, 25%) 0%, hsl(220, 65%, 35%) 25%, hsl(215, 60%, 45%) 50%, hsl(210, 55%, 55%) 75%, hsl(205, 50%, 65%) 100%)'
    }}>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">CPOE - Computerized Provider Order Entry</h1>
            <p className="text-white/70">Patient ID: {patientId}</p>
          </div>
          <Button 
            onClick={() => navigate('/patients')}
            variant="outline"
            className="border-white/30 text-white hover:bg-white/10"
          >
            Back to Patients
          </Button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 bg-blue-600/20 p-1 rounded-lg">
          {[
            { id: 'medications', label: 'Medications', icon: Pill },
            { id: 'lab', label: 'Lab Orders', icon: Activity },
            { id: 'imaging', label: 'Imaging', icon: FileText },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'text-white/70 hover:text-white hover:bg-blue-600/50'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Medication Orders Tab */}
        {activeTab === 'medications' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="backdrop-blur-xl bg-blue-500/10 border border-blue-300/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Pill className="h-5 w-5" />
                  New Medication Order
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleMedicationSubmit} className="space-y-4">
                  <div>
                    <Label className="text-white">Medication Name</Label>
                    <Input
                      value={medicationForm.name}
                      onChange={(e) => {
                        setMedicationForm({...medicationForm, name: e.target.value});
                        // Trigger safety check on medication name change
                        if (e.target.value.length > 3) {
                          validateMedication(e.target.value);
                        }
                      }}
                      className="bg-blue-600/20 border-blue-400/30 text-white"
                      placeholder="Enter medication name"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-white">Dosage</Label>
                      <Input
                        value={medicationForm.dosage}
                        onChange={(e) => setMedicationForm({...medicationForm, dosage: e.target.value})}
                        className="bg-blue-600/20 border-blue-400/30 text-white"
                        placeholder="e.g., 500mg"
                        required
                      />
                    </div>
                    <div>
                      <Label className="text-white">Route</Label>
                      <Select value={medicationForm.route} onValueChange={(value) => setMedicationForm({...medicationForm, route: value})}>
                        <SelectTrigger className="bg-blue-600/20 border-blue-400/30 text-white">
                          <SelectValue placeholder="Select route" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="oral">Oral</SelectItem>
                          <SelectItem value="iv">IV</SelectItem>
                          <SelectItem value="im">IM</SelectItem>
                          <SelectItem value="topical">Topical</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-white">Frequency</Label>
                      <Select value={medicationForm.frequency} onValueChange={(value) => setMedicationForm({...medicationForm, frequency: value})}>
                        <SelectTrigger className="bg-blue-600/20 border-blue-400/30 text-white">
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="once">Once daily</SelectItem>
                          <SelectItem value="twice">Twice daily</SelectItem>
                          <SelectItem value="three">Three times daily</SelectItem>
                          <SelectItem value="four">Four times daily</SelectItem>
                          <SelectItem value="prn">As needed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-white">Duration</Label>
                      <Input
                        value={medicationForm.duration}
                        onChange={(e) => setMedicationForm({...medicationForm, duration: e.target.value})}
                        className="bg-blue-600/20 border-blue-400/30 text-white"
                        placeholder="e.g., 7 days"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-white">Indication</Label>
                    <Textarea
                      value={medicationForm.indication}
                      onChange={(e) => setMedicationForm({...medicationForm, indication: e.target.value})}
                      className="bg-blue-600/20 border-blue-400/30 text-white"
                      placeholder="Reason for medication"
                      rows={3}
                    />
                  </div>

                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Submit Order
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Active Orders */}
            <Card className="backdrop-blur-xl bg-green-500/10 border border-green-300/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Active Orders
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-green-600/20 rounded-lg border border-green-400/30">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-white font-medium">Lisinopril 10mg</h4>
                        <p className="text-white/70 text-sm">Once daily, Oral</p>
                        <p className="text-white/60 text-xs">For hypertension</p>
                      </div>
                      <Badge className="bg-green-600 text-white">Active</Badge>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-yellow-600/20 rounded-lg border border-yellow-400/30">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-white font-medium">Metformin 500mg</h4>
                        <p className="text-white/70 text-sm">Twice daily, Oral</p>
                        <p className="text-white/60 text-xs">For diabetes</p>
                      </div>
                      <Badge className="bg-yellow-600 text-white">Pending</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Lab Orders Tab */}
        {activeTab === 'lab' && (
          <Card className="backdrop-blur-xl bg-purple-500/10 border border-purple-300/30">
            <CardHeader>
              <CardTitle className="text-white">Lab Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white/70">Lab ordering functionality coming soon...</p>
            </CardContent>
          </Card>
        )}

        {/* Imaging Tab */}
        {activeTab === 'imaging' && (
          <Card className="backdrop-blur-xl bg-orange-500/10 border border-orange-300/30">
            <CardHeader>
              <CardTitle className="text-white">Imaging Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-white/70">Imaging ordering functionality coming soon...</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CPOESystem;
