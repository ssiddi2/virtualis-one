import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Monitor, 
  Calendar,
  AlertTriangle,
  Download,
  Eye,
  FileImage,
  Activity,
  Brain,
  Heart
} from 'lucide-react';

interface ImagingStudy {
  id: string;
  studyType: string;
  modality: string;
  bodyPart: string;
  studyDate: string;
  status: 'completed' | 'pending' | 'in_progress';
  priority: 'routine' | 'urgent' | 'stat';
  findings: string;
  impression: string;
  radiologist: string;
  criticalFindings?: string[];
  images: string[];
  aiAnalysis?: {
    confidence: number;
    abnormalities: string[];
    recommendations: string[];
  };
}

const EpicImagingResults = ({ patientId }: { patientId?: string }) => {
  const [selectedTimeFrame, setSelectedTimeFrame] = useState('30d');
  const [selectedModality, setSelectedModality] = useState('all');

  // Mock imaging data with comprehensive studies
  const mockImagingData: ImagingStudy[] = [
    {
      id: 'study-001',
      studyType: 'Chest X-Ray',
      modality: 'XR',
      bodyPart: 'Chest',
      studyDate: '2024-01-15T10:30:00Z',
      status: 'completed',
      priority: 'routine',
      findings: 'Bilateral lower lobe infiltrates consistent with pneumonia. Heart size normal. No pneumothorax.',
      impression: 'Bilateral pneumonia',
      radiologist: 'Dr. Sarah Chen, MD',
      criticalFindings: ['Bilateral pneumonia'],
      images: ['chest-xray-001.jpg', 'chest-xray-002.jpg'],
      aiAnalysis: {
        confidence: 94,
        abnormalities: ['Bilateral infiltrates', 'Increased opacity lower lobes'],
        recommendations: ['Clinical correlation recommended', 'Follow-up imaging in 7-10 days']
      }
    },
    {
      id: 'study-002',
      studyType: 'CT Chest with Contrast',
      modality: 'CT',
      bodyPart: 'Chest',
      studyDate: '2024-01-14T14:15:00Z',
      status: 'completed',
      priority: 'urgent',
      findings: 'Extensive bilateral ground-glass opacities. Mediastinal lymphadenopathy. Small bilateral pleural effusions.',
      impression: 'Findings consistent with viral pneumonia vs. ARDS. Consider infectious etiology.',
      radiologist: 'Dr. Michael Torres, MD',
      criticalFindings: ['Bilateral pneumonia', 'Pleural effusions'],
      images: ['ct-chest-001.jpg', 'ct-chest-002.jpg', 'ct-chest-003.jpg'],
      aiAnalysis: {
        confidence: 91,
        abnormalities: ['Ground-glass opacities', 'Lymphadenopathy', 'Pleural effusions'],
        recommendations: ['Consider infectious workup', 'Monitor respiratory status']
      }
    },
    {
      id: 'study-003',
      studyType: 'Echocardiogram',
      modality: 'US',
      bodyPart: 'Heart',
      studyDate: '2024-01-13T09:00:00Z',
      status: 'completed',
      priority: 'routine',
      findings: 'Left ventricular ejection fraction 45-50%. Mild mitral regurgitation. No wall motion abnormalities.',
      impression: 'Mildly reduced LV systolic function. Mild mitral regurgitation.',
      radiologist: 'Dr. Jennifer Park, MD',
      images: ['echo-001.jpg', 'echo-002.jpg'],
      aiAnalysis: {
        confidence: 88,
        abnormalities: ['Reduced ejection fraction', 'Mitral regurgitation'],
        recommendations: ['Follow-up echo in 6 months', 'Consider ACE inhibitor therapy']
      }
    },
    {
      id: 'study-004',
      studyType: 'CT Head without Contrast',
      modality: 'CT',
      bodyPart: 'Head',
      studyDate: '2024-01-12T16:45:00Z',
      status: 'completed',
      priority: 'stat',
      findings: 'No acute intracranial abnormality. No hemorrhage, mass effect, or midline shift.',
      impression: 'Normal CT head',
      radiologist: 'Dr. Robert Kim, MD',
      images: ['ct-head-001.jpg', 'ct-head-002.jpg'],
      aiAnalysis: {
        confidence: 96,
        abnormalities: [],
        recommendations: ['No follow-up imaging required']
      }
    },
    {
      id: 'study-005',
      studyType: 'Abdominal X-Ray',
      modality: 'XR',
      bodyPart: 'Abdomen',
      studyDate: '2024-01-11T11:20:00Z',
      status: 'completed',
      priority: 'routine',
      findings: 'Mildly dilated loops of small bowel. No free air. Normal bowel gas pattern.',
      impression: 'Mild small bowel dilatation, clinical correlation recommended',
      radiologist: 'Dr. Lisa Wang, MD',
      images: ['abd-xray-001.jpg'],
      aiAnalysis: {
        confidence: 82,
        abnormalities: ['Small bowel dilatation'],
        recommendations: ['Clinical correlation', 'Consider follow-up if symptomatic']
      }
    }
  ];

  const getModalityIcon = (modality: string) => {
    switch (modality) {
      case 'CT': return <Brain className="h-4 w-4" />;
      case 'XR': return <Monitor className="h-4 w-4" />;
      case 'US': return <Heart className="h-4 w-4" />;
      default: return <FileImage className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-600';
      case 'pending': return 'bg-yellow-600';
      case 'in_progress': return 'bg-blue-600';
      default: return 'bg-gray-600';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'stat': return 'bg-red-600';
      case 'urgent': return 'bg-orange-600';
      case 'routine': return 'bg-green-600';
      default: return 'bg-gray-600';
    }
  };

  const filteredStudies = mockImagingData.filter(study => {
    if (selectedModality === 'all') return true;
    return study.modality === selectedModality;
  });

  const criticalFindings = mockImagingData.filter(study => 
    study.criticalFindings && study.criticalFindings.length > 0
  );

  return (
    <Card className="clinical-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <Monitor className="h-5 w-5" />
            Imaging Studies - Epic Style
          </CardTitle>
          <div className="flex gap-2">
            <Button 
              size="sm"
              onClick={() => setSelectedModality('all')}
              className={`quick-action-btn ${selectedModality === 'all' ? 'quick-action-primary' : 'quick-action-secondary'}`}
            >
              All
            </Button>
            <Button 
              size="sm"
              onClick={() => setSelectedModality('XR')}
              className={`quick-action-btn ${selectedModality === 'XR' ? 'quick-action-primary' : 'quick-action-secondary'}`}
            >
              X-Ray
            </Button>
            <Button 
              size="sm"
              onClick={() => setSelectedModality('CT')}
              className={`quick-action-btn ${selectedModality === 'CT' ? 'quick-action-primary' : 'quick-action-secondary'}`}
            >
              CT
            </Button>
            <Button 
              size="sm"
              onClick={() => setSelectedModality('US')}
              className={`quick-action-btn ${selectedModality === 'US' ? 'quick-action-primary' : 'quick-action-secondary'}`}
            >
              Ultrasound
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Critical Findings Alert */}
        {criticalFindings.length > 0 && (
          <div className="mb-4 p-3 bg-red-900/20 border border-red-400/30 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-red-400" />
              <span className="text-red-200 font-semibold">Critical Imaging Findings:</span>
            </div>
            {criticalFindings.map(study => (
              <div key={study.id} className="text-red-200 text-sm">
                <span className="font-medium">{study.studyType}:</span> {study.criticalFindings?.join(', ')}
              </div>
            ))}
          </div>
        )}

        {/* Imaging Studies List */}
        <div className="space-y-4">
          {filteredStudies.map((study) => (
            <div key={study.id} className="clinical-note">
              <div className="clinical-note-header">
                <div className="flex items-center gap-3 flex-1">
                  <div className="flex items-center gap-2">
                    {getModalityIcon(study.modality)}
                    <div>
                      <h3 className="text-white font-medium">{study.studyType}</h3>
                      <p className="text-white/60 text-sm flex items-center gap-2">
                        <Calendar className="h-3 w-3" />
                        {new Date(study.studyDate).toLocaleDateString()} at {new Date(study.studyDate).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={`${getStatusColor(study.status)} text-white`}>
                      {study.status.replace('_', ' ').toUpperCase()}
                    </Badge>
                    <Badge className={`${getPriorityColor(study.priority)} text-white`}>
                      {study.priority.toUpperCase()}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" className="quick-action-btn quick-action-primary">
                    <Eye className="h-3 w-3 mr-1" />
                    View Images
                  </Button>
                  <Button size="sm" className="quick-action-btn quick-action-secondary">
                    <Download className="h-3 w-3 mr-1" />
                    Download
                  </Button>
                </div>
              </div>

              <div className="clinical-note-content">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Findings */}
                  <div className="clinical-note-section">
                    <h4>Findings</h4>
                    <p className="text-white/80">{study.findings}</p>
                  </div>

                  {/* Impression */}
                  <div className="clinical-note-section">
                    <h4>Impression</h4>
                    <p className="text-white/80">{study.impression}</p>
                  </div>

                  {/* Study Details */}
                  <div className="clinical-note-section">
                    <h4>Study Details</h4>
                    <div className="space-y-1 text-white/80 text-sm">
                      <p><span className="font-medium">Body Part:</span> {study.bodyPart}</p>
                      <p><span className="font-medium">Modality:</span> {study.modality}</p>
                      <p><span className="font-medium">Radiologist:</span> {study.radiologist}</p>
                      <p><span className="font-medium">Images:</span> {study.images.length} files</p>
                    </div>
                  </div>

                  {/* AI Analysis */}
                  {study.aiAnalysis && (
                    <div className="clinical-note-section">
                      <h4>AI Analysis</h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Activity className="h-3 w-3 text-purple-400" />
                          <span className="text-white/80 text-sm">
                            Confidence: {study.aiAnalysis.confidence}%
                          </span>
                        </div>
                        {study.aiAnalysis.abnormalities.length > 0 && (
                          <div>
                            <p className="text-white/70 text-sm font-medium">Detected Abnormalities:</p>
                            <ul className="text-white/60 text-xs ml-4">
                              {study.aiAnalysis.abnormalities.map((abnormality, index) => (
                                <li key={index}>• {abnormality}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {study.aiAnalysis.recommendations.length > 0 && (
                          <div>
                            <p className="text-white/70 text-sm font-medium">AI Recommendations:</p>
                            <ul className="text-white/60 text-xs ml-4">
                              {study.aiAnalysis.recommendations.map((rec, index) => (
                                <li key={index}>• {rec}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Critical Findings Highlight */}
                {study.criticalFindings && study.criticalFindings.length > 0 && (
                  <div className="mt-4 p-3 bg-red-900/20 rounded border border-red-400/30">
                    <h4 className="text-red-200 font-medium text-sm mb-2 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      Critical Findings
                    </h4>
                    <ul className="text-red-100 text-sm">
                      {study.criticalFindings.map((finding, index) => (
                        <li key={index}>• {finding}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredStudies.length === 0 && (
          <div className="text-center py-8">
            <Monitor className="h-12 w-12 text-white/40 mx-auto mb-4" />
            <p className="text-white/60 mb-4">No imaging studies available for selected filters</p>
            <Button className="quick-action-btn quick-action-primary">
              Order New Study
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EpicImagingResults;