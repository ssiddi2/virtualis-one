
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  ClipboardList, 
  Search, 
  Plus, 
  FileText, 
  Heart, 
  Brain,
  Wind,
  Activity
} from 'lucide-react';

interface ClinicalTemplatesProps {
  patientId: string;
  hospitalId: string;
}

const ClinicalTemplates = ({ patientId, hospitalId }: ClinicalTemplatesProps) => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [customTemplate, setCustomTemplate] = useState('');

  const templateCategories = {
    'General Medicine': [
      {
        id: 1,
        name: 'History & Physical',
        icon: FileText,
        template: `CHIEF COMPLAINT:
[Patient's primary concern]

HISTORY OF PRESENT ILLNESS:
[Detailed description of current illness]

PAST MEDICAL HISTORY:
[Previous medical conditions]

MEDICATIONS:
[Current medications]

ALLERGIES:
[Known allergies]

SOCIAL HISTORY:
[Smoking, alcohol, drug use]

FAMILY HISTORY:
[Relevant family medical history]

REVIEW OF SYSTEMS:
[System-by-system review]

PHYSICAL EXAMINATION:
General: [General appearance]
Vital Signs: [Temperature, BP, HR, RR, O2 sat]
HEENT: [Head, eyes, ears, nose, throat]
Neck: [Examination findings]
Lungs: [Respiratory examination]
Heart: [Cardiovascular examination]
Abdomen: [Abdominal examination]
Extremities: [Examination of extremities]
Neurologic: [Neurological examination]

ASSESSMENT AND PLAN:
[Clinical assessment and treatment plan]`
      },
      {
        id: 2,
        name: 'Progress Note',
        icon: Activity,
        template: `SUBJECTIVE:
[Patient's reported symptoms and concerns]

OBJECTIVE:
Vital Signs: [Current vital signs]
Physical Exam: [Focused physical examination]
Labs/Studies: [Recent test results]

ASSESSMENT:
[Clinical assessment of current status]

PLAN:
[Treatment plan and follow-up]`
      }
    ],
    'Cardiology': [
      {
        id: 3,
        name: 'Cardiac Assessment',
        icon: Heart,
        template: `CARDIAC HISTORY:
[Previous cardiac events, procedures]

CURRENT SYMPTOMS:
Chest Pain: [Character, location, radiation]
Shortness of Breath: [Exertional tolerance]
Palpitations: [Frequency, triggers]
Syncope/Presyncope: [Episodes]

PHYSICAL EXAMINATION:
Heart Rate: [Regular/irregular]
Blood Pressure: [Both arms if indicated]
Heart Sounds: [S1, S2, murmurs, gallops]
Peripheral Pulses: [Quality and symmetry]
Edema: [Location and severity]
JVD: [Jugular venous distension]

DIAGNOSTIC STUDIES:
ECG: [Rhythm, intervals, ST changes]
Echo: [If available]
Stress Test: [If performed]

ASSESSMENT:
[Cardiac diagnosis and risk stratification]

PLAN:
[Medications, lifestyle, follow-up]`
      }
    ],
    'Pulmonology': [
      {
        id: 4,
        name: 'Respiratory Assessment',
        icon: Wind,
        template: `RESPIRATORY HISTORY:
[Previous lung disease, smoking history]

CURRENT SYMPTOMS:
Dyspnea: [Exertional tolerance, triggers]
Cough: [Productive/non-productive, sputum]
Chest Pain: [Pleuritic nature]
Wheezing: [Timing, triggers]

PHYSICAL EXAMINATION:
Respiratory Rate: [Rate and pattern]
Oxygen Saturation: [Room air/supplemental O2]
Chest Inspection: [Shape, symmetry, movement]
Palpation: [Tactile fremitus, chest expansion]
Percussion: [Resonance, dullness]
Auscultation: [Breath sounds, adventitious sounds]

DIAGNOSTIC STUDIES:
Chest X-ray: [Findings]
Pulmonary Function Tests: [If available]
ABG: [If indicated]

ASSESSMENT:
[Respiratory diagnosis]

PLAN:
[Bronchodilators, oxygen, follow-up]`
      }
    ],
    'Neurology': [
      {
        id: 5,
        name: 'Neurological Assessment',
        icon: Brain,
        template: `NEUROLOGICAL HISTORY:
[Previous neurological conditions]

CURRENT SYMPTOMS:
Headache: [Character, location, triggers]
Weakness: [Distribution, progression]
Sensory Changes: [Location, quality]
Seizures: [Type, frequency]
Cognitive Changes: [Memory, concentration]

NEUROLOGICAL EXAMINATION:
Mental Status: [Orientation, memory, language]
Cranial Nerves: [II-XII examination]
Motor: [Strength, tone, bulk]
Sensory: [Light touch, vibration, position]
Reflexes: [Deep tendon reflexes, Babinski]
Coordination: [Finger-to-nose, heel-to-shin]
Gait: [Stability, stride, turns]

ASSESSMENT:
[Neurological diagnosis]

PLAN:
[Medications, imaging, referrals]`
      }
    ]
  };

  const allTemplates = Object.values(templateCategories).flat();
  const filteredTemplates = allTemplates.filter(template =>
    template.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleUseTemplate = (template: any) => {
    setSelectedTemplate(template);
    setCustomTemplate(template.template);
    
    toast({
      title: "Template Loaded",
      description: `${template.name} template is ready for use`
    });
  };

  const handleSaveCustomTemplate = () => {
    // Here you would save the customized template
    
    toast({
      title: "Template Saved",
      description: "Your customized template has been saved"
    });
  };

  return (
    <div className="space-y-6">
      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-blue-500" />
            Clinical Documentation Templates
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search templates..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Button variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Create New
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Template Library */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Template Library</h3>
          
          {Object.entries(templateCategories).map(([category, templates]) => (
            <Card key={category}>
              <CardHeader>
                <CardTitle className="text-base">{category}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {templates
                  .filter(template => 
                    searchTerm === '' || 
                    template.name.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((template) => (
                    <div
                      key={template.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleUseTemplate(template)}
                    >
                      <div className="flex items-center gap-3">
                        <template.icon className="h-4 w-4 text-gray-500" />
                        <span className="font-medium">{template.name}</span>
                      </div>
                      <Badge variant="secondary">Use</Badge>
                    </div>
                  ))
                }
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Template Editor */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Template Editor</h3>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                {selectedTemplate ? `Editing: ${selectedTemplate.name}` : 'Select a Template'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedTemplate ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="templateContent">Template Content</Label>
                    <Textarea
                      id="templateContent"
                      value={customTemplate}
                      onChange={(e) => setCustomTemplate(e.target.value)}
                      rows={20}
                      className="font-mono text-sm"
                      placeholder="Template content will appear here..."
                    />
                  </div>
                  
                  <div className="flex justify-end gap-4">
                    <Button 
                      variant="outline"
                      onClick={() => {
                        setSelectedTemplate(null);
                        setCustomTemplate('');
                      }}
                    >
                      Clear
                    </Button>
                    <Button onClick={handleSaveCustomTemplate}>
                      Save Template
                    </Button>
                    <Button className="bg-green-600 hover:bg-green-700">
                      Use in Documentation
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <ClipboardList className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Select a template from the library to begin editing</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ClinicalTemplates;
