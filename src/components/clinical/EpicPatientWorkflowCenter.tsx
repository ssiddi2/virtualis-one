import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  User, 
  Calendar, 
  Phone,
  AlertTriangle,
  FileText,
  TestTube,
  Monitor,
  Pill,
  Activity,
  ClipboardList,
  ArrowLeft,
  Plus,
  Edit3,
  Sparkles,
  Stethoscope,
  Brain,
  Mic
} from 'lucide-react';
import { usePatients } from '@/hooks/usePatients';
import { useMedications } from '@/hooks/useMedications';
import { useProblemList } from '@/hooks/useProblemList';
import { useAllergies } from '@/hooks/useAllergies';
import { useMedicalRecords } from '@/hooks/useMedicalRecords';
import { useToast } from '@/hooks/use-toast';
import LoadingSpinner from '@/components/ui/loading-spinner';
import PageTransition from '@/components/ui/page-transition';
import EpicLabResultsVertical from './EpicLabResultsVertical';
import EpicImagingResults from './EpicImagingResults';
import EnhancedCPOESystem from './EnhancedCPOESystem';

// Glass morphism note overlay component
const GlassNoteOverlay = ({ isOpen, onClose, patientId, patientName }: {
  isOpen: boolean;
  onClose: () => void;
  patientId: string;
  patientName: string;
}) => {
  const [noteContent, setNoteContent] = useState('');
  const [noteType, setNoteType] = useState('progress');
  const [isAIAssisting, setIsAIAssisting] = useState(false);

  const handleAIAssist = () => {
    setIsAIAssisting(true);
    // Simulate AI assistance
    setTimeout(() => {
      setNoteContent(prev => prev + '\n\n[AI Suggestion: Based on recent vitals and lab results, consider monitoring blood pressure trends and adjusting medication timing.]');
      setIsAIAssisting(false);
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 backdrop-blur-md bg-black/30"
        onClick={onClose}
      />
      
      {/* Glass morphism card */}
      <Card className="relative w-full max-w-4xl h-[80vh] border-white/20 shadow-2xl animate-scale-in"
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)'
            }}>
        <CardHeader className="border-b border-white/20 pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white text-xl font-semibold">New Progress Note</CardTitle>
              <p className="text-white/70 text-sm mt-1">Patient: {patientName}</p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleAIAssist}
                disabled={isAIAssisting}
                className="bg-blue-600/20 border-blue-400/30 text-white hover:bg-blue-500/30"
              >
                {isAIAssisting ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <Brain className="h-4 w-4 mr-1" />
                )}
                AI Assist
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="bg-purple-600/20 border-purple-400/30 text-white hover:bg-purple-500/30"
              >
                <Mic className="h-4 w-4 mr-1" />
                Voice
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onClose}
                className="bg-gray-600/20 border-gray-400/30 text-white hover:bg-gray-500/30"
              >
                ✕
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-6 h-full overflow-auto">
          <div className="space-y-6">
            {/* Note type selector */}
            <div className="flex gap-2">
              {['progress', 'admission', 'discharge', 'consult'].map((type) => (
                <Button
                  key={type}
                  variant={noteType === type ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setNoteType(type)}
                  className={noteType === type 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white/10 border-white/30 text-white hover:bg-white/20'
                  }
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)} Note
                </Button>
              ))}
            </div>

            {/* Note sections */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-white font-medium text-sm mb-2 block">
                    Chief Complaint
                  </label>
                  <textarea 
                    className="w-full h-20 bg-white/10 border border-white/30 rounded-lg p-3 text-white placeholder:text-white/60 focus:ring-2 focus:ring-blue-400 focus:border-transparent resize-none"
                    placeholder="Patient's primary concern..."
                  />
                </div>
                
                <div>
                  <label className="text-white font-medium text-sm mb-2 block">
                    History of Present Illness
                  </label>
                  <textarea 
                    className="w-full h-32 bg-white/10 border border-white/30 rounded-lg p-3 text-white placeholder:text-white/60 focus:ring-2 focus:ring-blue-400 focus:border-transparent resize-none"
                    placeholder="Chronological description of symptoms..."
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-white font-medium text-sm mb-2 block">
                    Physical Examination
                  </label>
                  <textarea 
                    className="w-full h-20 bg-white/10 border border-white/30 rounded-lg p-3 text-white placeholder:text-white/60 focus:ring-2 focus:ring-blue-400 focus:border-transparent resize-none"
                    placeholder="Vital signs and physical findings..."
                  />
                </div>
                
                <div>
                  <label className="text-white font-medium text-sm mb-2 block">
                    Assessment & Plan
                  </label>
                  <textarea 
                    value={noteContent}
                    onChange={(e) => setNoteContent(e.target.value)}
                    className="w-full h-32 bg-white/10 border border-white/30 rounded-lg p-3 text-white placeholder:text-white/60 focus:ring-2 focus:ring-blue-400 focus:border-transparent resize-none"
                    placeholder="Clinical assessment and treatment plan..."
                  />
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t border-white/20">
              <Button
                variant="outline"
                onClick={onClose}
                className="bg-gray-600/20 border-gray-400/30 text-white hover:bg-gray-500/30"
              >
                Cancel
              </Button>
              <Button
                className="bg-green-600/80 hover:bg-green-600 text-white"
              >
                Save Note
              </Button>
              <Button
                className="bg-blue-600/80 hover:bg-blue-600 text-white"
              >
                Sign & Complete
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Epic-style notes list component
const EpicNotesList = ({ patientId, onSelectNote, onNewNote }: {
  patientId?: string;
  onSelectNote: (noteId: string) => void;
  onNewNote: () => void;
}) => {
  const { data: medicalRecords } = useMedicalRecords();
  const patientNotes = medicalRecords?.filter(record => record.patient_id === patientId) || [];

  const getNoteTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'progress': return 'bg-blue-600/20 text-blue-300 border-blue-400/30';
      case 'admission': return 'bg-green-600/20 text-green-300 border-green-400/30';
      case 'discharge': return 'bg-purple-600/20 text-purple-300 border-purple-400/30';
      case 'consult': return 'bg-orange-600/20 text-orange-300 border-orange-400/30';
      default: return 'bg-gray-600/20 text-gray-300 border-gray-400/30';
    }
  };

  return (
    <div className="h-full space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-white font-semibold text-lg">Clinical Notes</h3>
        <Button
          size="sm"
          onClick={onNewNote}
          className="bg-blue-600/20 border border-blue-400/30 text-white hover:bg-blue-500/30"
        >
          <Plus className="h-4 w-4 mr-1" />
          New Note
        </Button>
      </div>

      <div className="space-y-2 overflow-auto h-full">
        {patientNotes.map((note) => (
          <Card 
            key={note.id}
            className="clinical-card cursor-pointer hover:bg-white/10 transition-all"
            onClick={() => onSelectNote(note.id)}
          >
            <CardContent className="p-3">
              <div className="flex items-center justify-between mb-2">
                <Badge className={getNoteTypeColor(note.encounter_type)}>
                  {note.encounter_type}
                </Badge>
                <span className="text-white/60 text-xs">
                  {new Date(note.visit_date).toLocaleDateString()}
                </span>
              </div>
              <p className="text-white text-sm font-medium mb-1">
                {note.chief_complaint || 'No chief complaint recorded'}
              </p>
              <p className="text-white/70 text-xs line-clamp-2">
                {note.assessment || note.history_present_illness || 'No details available'}
              </p>
            </CardContent>
          </Card>
        ))}

        {patientNotes.length === 0 && (
          <div className="text-center text-white/60 py-8">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No clinical notes found</p>
            <Button
              size="sm"
              onClick={onNewNote}
              className="mt-2 bg-blue-600/20 border border-blue-400/30 text-white hover:bg-blue-500/30"
            >
              Create First Note
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

const EpicPatientWorkflowCenter = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('notes');
  const [showNoteOverlay, setShowNoteOverlay] = useState(false);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const { toast } = useToast();

  const { data: patients, isLoading, error } = usePatients();
  const { data: medications } = useMedications();
  const { data: problemList } = useProblemList(patientId);
  const { data: allergies } = useAllergies(patientId);

  const patient = patients?.find(p => p.id === patientId);
  const patientMedications = medications?.filter(med => med.patient_id === patientId);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{
        background: 'linear-gradient(135deg, hsl(225, 70%, 25%) 0%, hsl(220, 65%, 35%) 25%, hsl(215, 60%, 45%) 50%, hsl(210, 55%, 55%) 75%, hsl(205, 50%, 65%) 100%)'
      }}>
        <LoadingSpinner size="lg" text="Loading patient workspace..." />
      </div>
    );
  }

  if (error || !patient) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{
        background: 'linear-gradient(135deg, hsl(225, 70%, 25%) 0%, hsl(220, 65%, 35%) 25%, hsl(215, 60%, 45%) 50%, hsl(210, 55%, 55%) 75%, hsl(205, 50%, 65%) 100%)'
      }}>
        <div className="text-white text-center">
          <p className="text-red-300 mb-4">Patient not found or error loading data</p>
          <Button onClick={() => navigate('/my-patients')} className="bg-blue-600 hover:bg-blue-700">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Patient List
          </Button>
        </div>
      </div>
    );
  }

  const age = new Date().getFullYear() - new Date(patient.date_of_birth).getFullYear();

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'new-note':
        setShowNoteOverlay(true);
        break;
      case 'cpoe':
        setActiveTab('cpoe');
        break;
      case 'labs':
        setActiveTab('labs');
        break;
      default:
        toast({
          title: "Feature Coming Soon",
          description: `${action} functionality will be available soon.`,
        });
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen" style={{
        background: 'linear-gradient(135deg, hsl(225, 70%, 25%) 0%, hsl(220, 65%, 35%) 25%, hsl(215, 60%, 45%) 50%, hsl(210, 55%, 55%) 75%, hsl(205, 50%, 65%) 100%)'
      }}>
        <div className="p-4 space-y-4">
          {/* Navigation Header */}
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              onClick={() => navigate('/my-patients')}
              className="bg-transparent border-blue-400/30 text-white hover:bg-blue-500/20"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Patient List
            </Button>
            <h1 className="text-2xl font-bold text-white">Epic Workflow Center</h1>
          </div>

          {/* Epic-Style Patient Banner */}
          <Card className="clinical-card sticky top-0 z-20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-3">
                    <User className="h-8 w-8 text-blue-300" />
                    <div>
                      <h1 className="text-xl font-bold text-white">{patient.first_name} {patient.last_name}</h1>
                      <p className="text-blue-200 text-sm">
                        MRN: {patient.mrn} • DOB: {new Date(patient.date_of_birth).toLocaleDateString()} • Age: {age} • {patient.gender || 'Unknown'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-white">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>Room: {patient.room_number || 'Unassigned'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Phone className="h-4 w-4" />
                      <span>{patient.phone || 'No phone'}</span>
                    </div>
                  </div>
                </div>
                
                {/* Quick AI-Enhanced Action Toolbar */}
                <div className="flex items-center gap-2">
                  <Button 
                    size="sm"
                    onClick={() => handleQuickAction('new-note')}
                    className="bg-blue-600/20 border border-blue-400/30 text-white hover:bg-blue-500/30"
                  >
                    <Edit3 className="h-4 w-4 mr-1" />
                    <Sparkles className="h-3 w-3 mr-1" />
                    AI Note
                  </Button>
                  <Button 
                    size="sm"
                    onClick={() => handleQuickAction('cpoe')}
                    className="bg-purple-600/20 border border-purple-400/30 text-white hover:bg-purple-500/30"
                  >
                    <ClipboardList className="h-4 w-4 mr-1" />
                    <Brain className="h-3 w-3 mr-1" />
                    Smart Orders
                  </Button>
                  <Button 
                    size="sm"
                    onClick={() => handleQuickAction('labs')}
                    className="bg-green-600/20 border border-green-400/30 text-white hover:bg-green-500/30"
                  >
                    <TestTube className="h-4 w-4 mr-1" />
                    <Sparkles className="h-3 w-3 mr-1" />
                    AI Labs
                  </Button>
                </div>
              </div>
              
              {/* Critical Alerts */}
              {allergies && allergies.length > 0 && (
                <Alert className="mt-3 bg-red-900/20 border-red-400/30">
                  <AlertTriangle className="h-4 w-4 text-red-400" />
                  <AlertDescription className="text-red-200">
                    <strong>ALLERGIES:</strong> {allergies.filter(a => a.status === 'active').map(a => a.allergen).join(', ')}
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Epic-Style Two-Panel Layout */}
          <ResizablePanelGroup direction="horizontal" className="h-[calc(100vh-240px)]">
            {/* Left Panel - Notes List */}
            <ResizablePanel defaultSize={30} minSize={25}>
              <Card className="clinical-card h-full">
                <CardContent className="p-4 h-full">
                  <EpicNotesList 
                    patientId={patientId}
                    onSelectNote={setSelectedNoteId}
                    onNewNote={() => setShowNoteOverlay(true)}
                  />
                </CardContent>
              </Card>
            </ResizablePanel>

            <ResizableHandle className="w-2 bg-white/20 hover:bg-white/30 transition-colors" />

            {/* Right Panel - Workspace */}
            <ResizablePanel defaultSize={70} minSize={50}>
              <Card className="clinical-card h-full">
                <CardContent className="p-0 h-full">
                  <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
                    <div className="p-4 border-b border-white/20">
                      <TabsList className="grid w-full grid-cols-6 bg-blue-600/20 border border-blue-400/30">
                        <TabsTrigger value="notes" className="text-white data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                          <FileText className="h-4 w-4 mr-1" />
                          Notes
                        </TabsTrigger>
                        <TabsTrigger value="labs" className="text-white data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                          <TestTube className="h-4 w-4 mr-1" />
                          Labs
                        </TabsTrigger>
                        <TabsTrigger value="imaging" className="text-white data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                          <Monitor className="h-4 w-4 mr-1" />
                          Imaging
                        </TabsTrigger>
                        <TabsTrigger value="medications" className="text-white data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                          <Pill className="h-4 w-4 mr-1" />
                          Meds
                        </TabsTrigger>
                        <TabsTrigger value="cpoe" className="text-white data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                          <ClipboardList className="h-4 w-4 mr-1" />
                          CPOE
                        </TabsTrigger>
                        <TabsTrigger value="vitals" className="text-white data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                          <Activity className="h-4 w-4 mr-1" />
                          Vitals
                        </TabsTrigger>
                      </TabsList>
                    </div>

                    <div className="p-4 h-full overflow-auto">
                      <TabsContent value="notes" className="h-full">
                        <div className="text-center text-white/60 py-8">
                          <FileText className="h-16 w-16 mx-auto mb-4 opacity-50" />
                          <p className="text-lg mb-2">Select a note from the left panel to view details</p>
                          <p className="text-sm">Or create a new note using the AI-assisted overlay</p>
                        </div>
                      </TabsContent>

                      <TabsContent value="labs" className="h-full">
                        <EpicLabResultsVertical patientId={patientId} />
                      </TabsContent>

                      <TabsContent value="imaging" className="h-full">
                        <EpicImagingResults patientId={patientId} />
                      </TabsContent>

                      <TabsContent value="medications" className="h-full">
                        <div className="space-y-3">
                          {patientMedications?.map((med) => (
                            <Card key={med.id} className="clinical-card">
                              <CardContent className="p-4">
                                <div className="flex items-center justify-between mb-2">
                                  <h4 className="text-white font-medium">{med.medication_name}</h4>
                                  <Badge className={med.status === 'active' ? 'bg-green-600' : 'bg-gray-600'}>
                                    {med.status}
                                  </Badge>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                                  <p className="text-white/80"><span className="font-medium">Dose:</span> {med.dosage}</p>
                                  <p className="text-white/80"><span className="font-medium">Route:</span> {med.route}</p>
                                  <p className="text-white/80"><span className="font-medium">Frequency:</span> {med.frequency}</p>
                                  <p className="text-white/80"><span className="font-medium">Started:</span> {new Date(med.start_date).toLocaleDateString()}</p>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </TabsContent>

                      <TabsContent value="cpoe" className="h-full">
                        <EnhancedCPOESystem />
                      </TabsContent>

                      <TabsContent value="vitals" className="h-full">
                        <div className="text-center text-white/60 py-8">
                          <Activity className="h-16 w-16 mx-auto mb-4 opacity-50" />
                          <p className="text-lg mb-2">Vital Signs Monitoring</p>
                          <p className="text-sm">Real-time patient monitoring coming soon</p>
                        </div>
                      </TabsContent>
                    </div>
                  </Tabs>
                </CardContent>
              </Card>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>

        {/* Glass morphism note overlay */}
        <GlassNoteOverlay
          isOpen={showNoteOverlay}
          onClose={() => setShowNoteOverlay(false)}
          patientId={patientId || ''}
          patientName={`${patient.first_name} ${patient.last_name}`}
        />
      </div>
    </PageTransition>
  );
};

export default EpicPatientWorkflowCenter;