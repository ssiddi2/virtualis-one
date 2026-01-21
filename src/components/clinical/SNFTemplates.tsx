import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  FileText, 
  Activity, 
  Heart, 
  Brain,
  Utensils,
  ShowerHead,
  Footprints,
  Bed,
  Pill,
  Clipboard,
  Clock,
  CheckCircle2
} from 'lucide-react';

interface SNFTemplatesProps {
  onSelectTemplate: (template: SNFTemplate) => void;
  onContentChange?: (content: string) => void;
}

export interface SNFTemplate {
  id: string;
  name: string;
  category: 'daily' | 'therapy' | 'mds' | 'admission' | 'discharge';
  icon: React.ElementType;
  content: string;
  requiredFields: string[];
}

const snfTemplates: SNFTemplate[] = [
  {
    id: 'snf-daily-skilled',
    name: 'Daily Skilled Nursing Note',
    category: 'daily',
    icon: Activity,
    requiredFields: ['Vitals', 'Assessment', 'Interventions', 'Response'],
    content: `SKILLED NURSING DAILY NOTE

Date: [DATE]
Time: [TIME]
Shift: [DAY/EVENING/NIGHT]

VITAL SIGNS:
BP: ___/___ mmHg | HR: ___ bpm | RR: ___ | Temp: ___°F | O2 Sat: ___%
Pain Level: ___/10 | Location: ___

SKILLED ASSESSMENT:
□ Cardiovascular: 
□ Respiratory: 
□ Neurological: 
□ Skin Integrity: 
□ Nutritional Status: 

SKILLED INTERVENTIONS PROVIDED:
□ IV therapy/medication administration
□ Wound care/dressing change
□ Tube feeding management
□ Foley catheter care
□ Oxygen therapy management
□ Disease process teaching
□ Medication management/teaching

PATIENT RESPONSE TO INTERVENTIONS:


ADL STATUS:
Eating: □ Independent □ Setup □ Supervision □ Limited Assist □ Extensive Assist □ Total Dependence
Bathing: □ Independent □ Setup □ Supervision □ Limited Assist □ Extensive Assist □ Total Dependence
Dressing: □ Independent □ Setup □ Supervision □ Limited Assist □ Extensive Assist □ Total Dependence
Toileting: □ Independent □ Setup □ Supervision □ Limited Assist □ Extensive Assist □ Total Dependence
Transferring: □ Independent □ Setup □ Supervision □ Limited Assist □ Extensive Assist □ Total Dependence
Ambulation: □ Independent □ Supervision □ 1-Person Assist □ 2-Person Assist □ Wheelchair □ Bedbound

PLAN:


SKILLED NURSING JUSTIFICATION:
Services provided require the skills of a licensed nurse due to:


Signature: ___________________________ RN/LPN
Date/Time: ___________________________`
  },
  {
    id: 'snf-pt-note',
    name: 'Physical Therapy Progress Note',
    category: 'therapy',
    icon: Footprints,
    requiredFields: ['Treatment Time', 'Interventions', 'Patient Response', 'Plan'],
    content: `PHYSICAL THERAPY PROGRESS NOTE

Date: [DATE]
Treatment Time: ___ minutes (Start: ___ End: ___)

SUBJECTIVE:
Patient reports: 
Pain level: ___/10
Sleep quality: 
Functional concerns: 

OBJECTIVE:
Vital Signs Pre-Treatment: BP ___/___ HR ___ O2 ___% 
Vital Signs Post-Treatment: BP ___/___ HR ___ O2 ___%

TREATMENT PROVIDED:
□ Therapeutic Exercise (97110) - ___ minutes
  - 
□ Gait Training (97116) - ___ minutes
  - 
□ Therapeutic Activities (97530) - ___ minutes
  - 
□ Neuromuscular Re-education (97112) - ___ minutes
  - 
□ Manual Therapy (97140) - ___ minutes
  - 

PATIENT RESPONSE:
Tolerance to treatment: □ Good □ Fair □ Poor
Patient participation: □ Excellent □ Good □ Fair □ Limited

FUNCTIONAL PROGRESS:
Bed Mobility: 
Transfers: 
Ambulation: 
Balance: 

ASSESSMENT:
Patient is making [good/fair/limited] progress toward goals.
Skilled PT continues to be medically necessary because:

PLAN:
Continue current treatment plan
Frequency: ___ times per week
Duration: ___ weeks remaining
Goals update: 

Signature: ___________________________ PT/PTA
Date/Time: ___________________________`
  },
  {
    id: 'snf-ot-note',
    name: 'Occupational Therapy Progress Note',
    category: 'therapy',
    icon: ShowerHead,
    requiredFields: ['Treatment Time', 'Interventions', 'ADL Status', 'Plan'],
    content: `OCCUPATIONAL THERAPY PROGRESS NOTE

Date: [DATE]
Treatment Time: ___ minutes (Start: ___ End: ___)

SUBJECTIVE:
Patient reports: 
Functional concerns: 
Home setup considerations: 

OBJECTIVE:

TREATMENT PROVIDED:
□ Therapeutic Activities (97530) - ___ minutes
  - 
□ Self-Care/ADL Training (97535) - ___ minutes
  - 
□ Therapeutic Exercise (97110) - ___ minutes
  - 
□ Neuromuscular Re-education (97112) - ___ minutes
  - 
□ Cognitive Training (97532) - ___ minutes
  - 

ADL PERFORMANCE:
Feeding: □ I □ S □ LA □ EA □ TD
Upper Body Dressing: □ I □ S □ LA □ EA □ TD
Lower Body Dressing: □ I □ S □ LA □ EA □ TD
Grooming: □ I □ S □ LA □ EA □ TD
Bathing: □ I □ S □ LA □ EA □ TD
Toileting: □ I □ S □ LA □ EA □ TD
(I=Independent, S=Supervision, LA=Limited Assist, EA=Extensive Assist, TD=Total Dependence)

PATIENT RESPONSE:
Tolerance to treatment: □ Good □ Fair □ Poor
Patient participation: □ Excellent □ Good □ Fair □ Limited

ASSESSMENT:
Patient is making [good/fair/limited] progress toward ADL independence.
Skilled OT continues to be medically necessary because:

PLAN:
Continue current treatment plan
Frequency: ___ times per week
Duration: ___ weeks remaining
Discharge planning considerations:

Signature: ___________________________ OT/COTA
Date/Time: ___________________________`
  },
  {
    id: 'snf-st-note',
    name: 'Speech Therapy Progress Note',
    category: 'therapy',
    icon: Brain,
    requiredFields: ['Treatment Time', 'Interventions', 'Cognitive/Swallow Status', 'Plan'],
    content: `SPEECH THERAPY PROGRESS NOTE

Date: [DATE]
Treatment Time: ___ minutes (Start: ___ End: ___)

SUBJECTIVE:
Patient reports: 
Swallowing complaints: 
Communication concerns: 
Cognitive concerns: 

OBJECTIVE:

TREATMENT PROVIDED:
□ Speech/Language Treatment (92507) - ___ minutes
  - 
□ Swallowing Treatment (92526) - ___ minutes
  - 
□ Cognitive Rehabilitation (97532) - ___ minutes
  - 

SWALLOWING STATUS:
Diet Level: 
Liquid Consistency: 
Aspiration Risk: □ High □ Moderate □ Low
Swallow Function: 

COMMUNICATION STATUS:
Verbal Expression: □ Intact □ Mildly Impaired □ Moderately Impaired □ Severely Impaired
Auditory Comprehension: □ Intact □ Mildly Impaired □ Moderately Impaired □ Severely Impaired
Reading: □ Intact □ Mildly Impaired □ Moderately Impaired □ Severely Impaired
Writing: □ Intact □ Mildly Impaired □ Moderately Impaired □ Severely Impaired

COGNITIVE STATUS:
Orientation: □ x4 □ x3 □ x2 □ x1 □ x0
Attention/Concentration: 
Memory: 
Problem-Solving: 

PATIENT RESPONSE:
Tolerance to treatment: □ Good □ Fair □ Poor
Patient participation: □ Excellent □ Good □ Fair □ Limited

ASSESSMENT:
Patient is making [good/fair/limited] progress toward goals.
Skilled ST continues to be medically necessary because:

PLAN:
Continue current treatment plan
Frequency: ___ times per week
Diet/liquid recommendations: 

Signature: ___________________________ SLP
Date/Time: ___________________________`
  },
  {
    id: 'snf-mds-section-g',
    name: 'MDS Section G - Functional Status',
    category: 'mds',
    icon: Clipboard,
    requiredFields: ['All ADL Scores', 'Self-Performance', 'Support Provided'],
    content: `MDS 3.0 SECTION G - FUNCTIONAL STATUS

Resident: ___________________________
Assessment Reference Date (ARD): ___/___/___
Assessment Type: □ Admission □ Quarterly □ Annual □ Significant Change

CODING INSTRUCTIONS:
Self-Performance: 0=Independent, 1=Supervision, 2=Limited Assistance, 3=Extensive Assistance, 4=Total Dependence, 7=Activity occurred only once or twice, 8=Activity did not occur

Support Provided: 0=No setup or physical help, 1=Setup help only, 2=One-person physical assist, 3=Two+ person physical assist, 8=Activity did not occur

G0110. ACTIVITIES OF DAILY LIVING (ADL) ASSISTANCE

A. Bed Mobility
   Self-Performance: ___  Support Provided: ___
   
B. Transfer
   Self-Performance: ___  Support Provided: ___
   
C. Walk in Room
   Self-Performance: ___  Support Provided: ___
   
D. Walk in Corridor
   Self-Performance: ___  Support Provided: ___
   
E. Locomotion on Unit
   Self-Performance: ___  Support Provided: ___
   
F. Locomotion off Unit
   Self-Performance: ___  Support Provided: ___
   
G. Dressing
   Self-Performance: ___  Support Provided: ___
   
H. Eating
   Self-Performance: ___  Support Provided: ___
   
I. Toilet Use
   Self-Performance: ___  Support Provided: ___
   
J. Personal Hygiene
   Self-Performance: ___  Support Provided: ___

G0120. BATHING
   Self-Performance: ___
   (0=Independent, 1=Supervision, 2=Physical help limited, 3=Physical help extensive, 4=Total dependence, 8=Activity did not occur)

G0300. BALANCE DURING TRANSITIONS AND WALKING
   A. Moving from seated to standing: ___
   B. Walking (with assistive device if used): ___
   C. Turning around and facing opposite direction: ___
   D. Moving on and off toilet: ___
   E. Surface-to-surface transfer: ___
   (0=Steady at all times, 1=Not steady but able to stabilize, 2=Not steady, only able to stabilize with assist, 3=Activity did not occur)

G0400. FUNCTIONAL LIMITATION IN RANGE OF MOTION
   A. Upper extremity (shoulders, elbows, wrists, hands): ___
   B. Lower extremity (hips, knees, ankles, feet): ___
   (0=No impairment, 1=Impairment on one side, 2=Impairment on both sides)

NOTES/OBSERVATIONS:


Completed by: ___________________________ 
Title: ___________________________
Date: ___/___/___`
  },
  {
    id: 'snf-admission',
    name: 'SNF Admission Assessment',
    category: 'admission',
    icon: Bed,
    requiredFields: ['Admission Info', 'Diagnoses', 'Functional Status', 'Care Plan'],
    content: `SKILLED NURSING FACILITY ADMISSION ASSESSMENT

ADMISSION INFORMATION:
Date/Time of Admission: ___/___/___ at ___:___
Admitted From: □ Hospital □ Home □ Other SNF □ Other: ___
Mode of Arrival: □ Ambulatory □ Wheelchair □ Stretcher
Primary Insurance: □ Medicare A □ Medicare B □ Medicaid □ Private □ Other: ___

REASON FOR ADMISSION:


PRIMARY DIAGNOSES:
1. 
2. 
3. 
4. 

ALLERGIES: □ NKDA □ Allergies Listed:


CURRENT MEDICATIONS:


VITAL SIGNS ON ADMISSION:
BP: ___/___ mmHg | HR: ___ bpm | RR: ___ | Temp: ___°F | O2 Sat: ___%
Height: ___ | Weight: ___ lbs | BMI: ___
Pain Level: ___/10 | Location: ___

ADVANCE DIRECTIVES:
□ Full Code □ DNR □ DNR/DNI □ Comfort Care Only
□ Healthcare Power of Attorney: ___
□ Living Will on file

BASELINE FUNCTIONAL STATUS:

ADLs (Prior to Hospitalization):
Eating: □ I □ S □ LA □ EA □ TD
Bathing: □ I □ S □ LA □ EA □ TD
Dressing: □ I □ S □ LA □ EA □ TD
Toileting: □ I □ S □ LA □ EA □ TD
Transferring: □ I □ S □ LA □ EA □ TD
Ambulation: □ I □ With Device □ 1-Assist □ 2-Assist □ WC □ Bedbound

COGNITIVE STATUS:
Orientation: □ x4 □ x3 □ x2 □ x1 □ x0
□ Alert □ Confused □ Lethargic □ Dementia diagnosis

SKIN ASSESSMENT:
□ Skin intact
□ Pressure injury present - Stage: ___ Location: ___
□ Wound present - Type: ___ Location: ___
□ Bruising noted - Location: ___

FALL RISK ASSESSMENT:
□ History of falls □ Gait instability □ Cognitive impairment □ Medications
Fall Risk Level: □ Low □ Moderate □ High

NUTRITIONAL ASSESSMENT:
Diet Order: ___
Liquid Consistency: ___
□ Dysphagia □ Weight loss □ Poor appetite □ Tube feeding

SKILLED SERVICES ORDERED:
□ Skilled Nursing: 
□ Physical Therapy: 
□ Occupational Therapy: 
□ Speech Therapy: 
□ Wound Care: 

INITIAL CARE PLAN:


DISCHARGE PLANNING:
Anticipated Discharge Date: ___/___/___
Anticipated Discharge Destination: □ Home □ Home with services □ Assisted Living □ Long-term care

Admission Nurse: ___________________________ RN
Attending Physician: ___________________________
Date/Time: ___/___/___ at ___:___`
  },
  {
    id: 'snf-medication-admin',
    name: 'Medication Administration Note',
    category: 'daily',
    icon: Pill,
    requiredFields: ['Medications Given', 'Time', 'Response'],
    content: `MEDICATION ADMINISTRATION RECORD

Date: [DATE]
Shift: □ 0600-1400 □ 1400-2200 □ 2200-0600

SCHEDULED MEDICATIONS ADMINISTERED:
Time | Medication | Dose | Route | Site | Initials | Notes
_____|____________|______|_______|______|__________|_______
     |            |      |       |      |          |
     |            |      |       |      |          |
     |            |      |       |      |          |
     |            |      |       |      |          |

PRN MEDICATIONS ADMINISTERED:
Time | Medication | Dose | Route | Reason Given | Response | Initials
_____|____________|______|_______|______________|__________|_________
     |            |      |       |              |          |
     |            |      |       |              |          |

MEDICATIONS HELD/REFUSED:
Medication: _______________
Reason: □ Refused □ NPO □ Parameters not met □ Other: ___
MD notified: □ Yes □ No  Time: ___

INSULIN ADMINISTRATION:
Time | Type | Dose | Site | Blood Glucose | Initials
_____|______|______|______|_______________|_________
     |      |      |      |               |

ANTICOAGULANT ADMINISTRATION:
□ Warfarin ___ mg at ___ 
  INR: ___ (Date: ___/___/___)
□ Enoxaparin ___ mg SubQ at ___
□ Heparin ___ units IV/SubQ at ___

NOTES:


Signature: ___________________________ RN/LPN
Date/Time: ___________________________`
  }
];

const SNFTemplates = ({ onSelectTemplate, onContentChange }: SNFTemplatesProps) => {
  const [selectedTemplate, setSelectedTemplate] = useState<SNFTemplate | null>(null);
  const [editableContent, setEditableContent] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Templates' },
    { id: 'daily', label: 'Daily Notes' },
    { id: 'therapy', label: 'Therapy Notes' },
    { id: 'mds', label: 'MDS Assessment' },
    { id: 'admission', label: 'Admission' },
  ];

  const filteredTemplates = activeCategory === 'all' 
    ? snfTemplates 
    : snfTemplates.filter(t => t.category === activeCategory);

  const handleSelectTemplate = (template: SNFTemplate) => {
    // Replace placeholders with current date/time
    const now = new Date();
    let content = template.content
      .replace(/\[DATE\]/g, now.toLocaleDateString())
      .replace(/\[TIME\]/g, now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    
    setSelectedTemplate(template);
    setEditableContent(content);
    onSelectTemplate(template);
    if (onContentChange) {
      onContentChange(content);
    }
  };

  const handleContentChange = (value: string) => {
    setEditableContent(value);
    if (onContentChange) {
      onContentChange(value);
    }
  };

  return (
    <div className="space-y-4">
      {/* Category Filter */}
      <div className="flex gap-2 flex-wrap">
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={activeCategory === category.id ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveCategory(category.id)}
            className={activeCategory === category.id 
              ? "bg-blue-600 text-white" 
              : "border-slate-600 text-slate-300 hover:bg-slate-700"
            }
          >
            {category.label}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Template Selection */}
        <Card className="bg-slate-800/50 border border-slate-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-base">SNF Documentation Templates</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 max-h-[500px] overflow-y-auto">
            {filteredTemplates.map((template) => (
              <div
                key={template.id}
                onClick={() => handleSelectTemplate(template)}
                className={`p-3 rounded-lg cursor-pointer transition-colors ${
                  selectedTemplate?.id === template.id
                    ? 'bg-blue-600/30 border border-blue-400/50'
                    : 'bg-slate-700/50 hover:bg-slate-700 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                    selectedTemplate?.id === template.id ? 'bg-blue-600' : 'bg-slate-600'
                  }`}>
                    <template.icon className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-medium">{template.name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs border-slate-500 text-slate-300">
                        {template.category}
                      </Badge>
                      <span className="text-xs text-slate-400">
                        {template.requiredFields.length} required fields
                      </span>
                    </div>
                  </div>
                  {selectedTemplate?.id === template.id && (
                    <CheckCircle2 className="h-5 w-5 text-blue-400" />
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Template Editor */}
        <Card className="bg-slate-800/50 border border-slate-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-base flex items-center gap-2">
              <FileText className="h-4 w-4" />
              {selectedTemplate ? selectedTemplate.name : 'Select a Template'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedTemplate ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <Clock className="h-4 w-4" />
                  <span>Required: {selectedTemplate.requiredFields.join(', ')}</span>
                </div>
                <Textarea
                  value={editableContent}
                  onChange={(e) => handleContentChange(e.target.value)}
                  className="bg-slate-700 text-white border-slate-600 font-mono text-sm min-h-[400px]"
                  placeholder="Select a template to begin..."
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-[400px] text-slate-400">
                <FileText className="h-12 w-12 mb-4 opacity-50" />
                <p>Select a template from the left to begin documenting</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SNFTemplates;
