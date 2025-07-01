
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Scan, AlertTriangle, Camera } from 'lucide-react';

interface ImagingOrderFormProps {
  patientId: string;
  hospitalId: string;
  onSubmit: (data: any) => void;
}

const ImagingOrderForm = ({ patientId, hospitalId, onSubmit }: ImagingOrderFormProps) => {
  const [formData, setFormData] = useState({
    studyType: '',
    bodyPart: '',
    modality: '',
    priority: 'routine',
    clinicalIndication: '',
    contrast: '',
    specialInstructions: '',
    transportMethod: 'ambulatory',
    schedulingNotes: ''
  });

  const imagingModalities = {
    'X-Ray': [
      'Chest', 'Abdomen', 'Pelvis', 'Spine', 'Extremities', 'Skull', 'Ribs'
    ],
    'CT Scan': [
      'Head', 'Chest', 'Abdomen/Pelvis', 'Spine', 'Extremities', 'Angiography'
    ],
    'MRI': [
      'Brain', 'Spine', 'Abdomen', 'Pelvis', 'Joints', 'Cardiac', 'Angiography'
    ],
    'Ultrasound': [
      'Abdominal', 'Pelvic', 'Cardiac Echo', 'Vascular', 'OB/GYN', 'Thyroid'
    ],
    'Nuclear Medicine': [
      'Bone Scan', 'Cardiac Stress Test', 'Thyroid Scan', 'Lung Scan', 'Renal Scan'
    ],
    'Fluoroscopy': [
      'Upper GI Series', 'Barium Enema', 'VCUG', 'Arthrograms'
    ]
  };

  const contrastOptions = [
    'None', 'IV Contrast', 'Oral Contrast', 'IV + Oral Contrast', 
    'Gadolinium (MRI)', 'Barium', 'Iodine-based'
  ];

  const handleModalityChange = (modality: string) => {
    setFormData(prev => ({
      ...prev,
      modality,
      bodyPart: '', // Reset body part when modality changes
      studyType: `${modality} - `
    }));
  };

  const handleBodyPartChange = (bodyPart: string) => {
    setFormData(prev => ({
      ...prev,
      bodyPart,
      studyType: `${prev.modality} - ${bodyPart}`
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.modality || !formData.bodyPart || !formData.clinicalIndication) {
      alert('Please fill in all required fields');
      return;
    }

    onSubmit(formData);
    
    // Reset form
    setFormData({
      studyType: '',
      bodyPart: '',
      modality: '',
      priority: 'routine',
      clinicalIndication: '',
      contrast: '',
      specialInstructions: '',
      transportMethod: 'ambulatory',
      schedulingNotes: ''
    });
  };

  const selectedBodyParts = formData.modality ? imagingModalities[formData.modality as keyof typeof imagingModalities] || [] : [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Scan className="h-5 w-5 text-purple-500" />
          Imaging Orders
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Modality and Body Part Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="modality">Imaging Modality *</Label>
              <Select value={formData.modality} onValueChange={handleModalityChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select imaging type" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(imagingModalities).map((modality) => (
                    <SelectItem key={modality} value={modality}>
                      {modality}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bodyPart">Body Part/Region *</Label>
              <Select 
                value={formData.bodyPart} 
                onValueChange={handleBodyPartChange}
                disabled={!formData.modality}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select body part" />
                </SelectTrigger>
                <SelectContent>
                  {selectedBodyParts.map((part) => (
                    <SelectItem key={part} value={part}>
                      {part}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Study Details */}
          <div className="space-y-2">
            <Label htmlFor="studyType">Complete Study Description</Label>
            <Input
              id="studyType"
              value={formData.studyType}
              onChange={(e) => setFormData(prev => ({ ...prev, studyType: e.target.value }))}
              placeholder="e.g., CT Chest with IV contrast"
              className="bg-gray-50"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select value={formData.priority} onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="routine">Routine</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="stat">STAT</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="contrast">Contrast</Label>
              <Select value={formData.contrast} onValueChange={(value) => setFormData(prev => ({ ...prev, contrast: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select contrast option" />
                </SelectTrigger>
                <SelectContent>
                  {contrastOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="clinicalIndication">Clinical Indication *</Label>
            <Textarea
              id="clinicalIndication"
              value={formData.clinicalIndication}
              onChange={(e) => setFormData(prev => ({ ...prev, clinicalIndication: e.target.value }))}
              placeholder="Clinical reason for imaging study, symptoms, or suspected diagnosis"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="transportMethod">Transport Method</Label>
            <Select value={formData.transportMethod} onValueChange={(value) => setFormData(prev => ({ ...prev, transportMethod: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ambulatory">Ambulatory</SelectItem>
                <SelectItem value="wheelchair">Wheelchair</SelectItem>
                <SelectItem value="stretcher">Stretcher</SelectItem>
                <SelectItem value="bed">Bed (portable study)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="specialInstructions">Special Instructions</Label>
            <Textarea
              id="specialInstructions"
              value={formData.specialInstructions}
              onChange={(e) => setFormData(prev => ({ ...prev, specialInstructions: e.target.value }))}
              placeholder="Special preparation, positioning, or technical requirements"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="schedulingNotes">Scheduling Notes</Label>
            <Textarea
              id="schedulingNotes"
              value={formData.schedulingNotes}
              onChange={(e) => setFormData(prev => ({ ...prev, schedulingNotes: e.target.value }))}
              placeholder="Preferred timing, patient limitations, or coordination needs"
              rows={2}
            />
          </div>

          {/* Contrast Warning */}
          {formData.contrast && formData.contrast !== 'None' && (
            <div className="flex items-start gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
              <div className="text-sm text-yellow-700">
                <p className="font-medium">Contrast Administration Required</p>
                <p>Verify patient allergies, kidney function, and obtain informed consent before contrast administration.</p>
              </div>
            </div>
          )}

          {/* STAT Priority Warning */}
          {formData.priority === 'stat' && (
            <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <Camera className="h-4 w-4 text-red-600 mt-0.5" />
              <div className="text-sm text-red-700">
                <p className="font-medium">STAT Order</p>
                <p>Radiology will be contacted immediately. Ensure patient is ready for immediate transport.</p>
              </div>
            </div>
          )}

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline">
              Save as Draft
            </Button>
            <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
              Submit Imaging Order
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ImagingOrderForm;
