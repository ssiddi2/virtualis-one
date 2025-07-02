import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Plus, 
  ChevronDown, 
  ChevronRight,
  Clock,
  User,
  Stethoscope
} from 'lucide-react';
import { useMedicalRecords } from '@/hooks/useMedicalRecords';

interface EpicClinicalNotesProps {
  patientId?: string;
}

const EpicClinicalNotes = ({ patientId }: EpicClinicalNotesProps) => {
  const [expandedNotes, setExpandedNotes] = useState<Set<string>>(new Set());
  const { data: medicalRecords } = useMedicalRecords(patientId);
  
  const patientRecords = medicalRecords?.filter(record => record.patient_id === patientId) || [];

  const toggleNoteExpansion = (noteId: string) => {
    const newExpanded = new Set(expandedNotes);
    if (newExpanded.has(noteId)) {
      newExpanded.delete(noteId);
    } else {
      newExpanded.add(noteId);
    }
    setExpandedNotes(newExpanded);
  };

  const getEncounterTypeColor = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'progress note': return 'bg-blue-600';
      case 'admission note': return 'bg-green-600';
      case 'discharge summary': return 'bg-purple-600';
      case 'consultation': return 'bg-orange-600';
      default: return 'bg-gray-600';
    }
  };

  return (
    <Card className="clinical-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Previous Clinical Notes
          </CardTitle>
          <Button className="quick-action-btn quick-action-primary">
            <Plus className="h-4 w-4 mr-1" />
            New Progress Note
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {patientRecords.length === 0 && (
          <div className="text-center text-white/60 py-8">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="mb-4">No clinical notes available</p>
            <Button className="quick-action-btn quick-action-primary">
              Create First Progress Note
            </Button>
          </div>
        )}

        {patientRecords
          .sort((a, b) => new Date(b.visit_date || b.created_at!).getTime() - new Date(a.visit_date || a.created_at!).getTime())
          .map((record) => {
            const isExpanded = expandedNotes.has(record.id);
            const noteDate = new Date(record.visit_date || record.created_at!);
            
            return (
              <div key={record.id} className="clinical-note">
                <div 
                  className="clinical-note-header cursor-pointer"
                  onClick={() => toggleNoteExpansion(record.id)}
                >
                  <div className="flex items-center gap-3">
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4 text-white/60" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-white/60" />
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <Badge className={`${getEncounterTypeColor(record.encounter_type)} text-white`}>
                          {record.encounter_type}
                        </Badge>
                        <div className="flex items-center gap-1 text-white/70 text-sm">
                          <Clock className="h-3 w-3" />
                          <span>{noteDate.toLocaleDateString()} at {noteDate.toLocaleTimeString()}</span>
                        </div>
                      </div>
                      <h3 className="text-white font-medium">
                        {record.chief_complaint || 'Clinical Note'}
                      </h3>
                    </div>
                    <div className="flex items-center gap-2 text-white/60 text-sm">
                      <User className="h-3 w-3" />
                      <span>Dr. Provider</span>
                    </div>
                  </div>
                </div>

                {isExpanded && (
                  <div className="clinical-note-content mt-4">
                    {/* Structured Note Sections */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {record.chief_complaint && (
                        <div className="clinical-note-section">
                          <h4>Chief Complaint</h4>
                          <p className="text-white/80">{record.chief_complaint}</p>
                        </div>
                      )}

                      {record.history_present_illness && (
                        <div className="clinical-note-section">
                          <h4>History of Present Illness</h4>
                          <p className="text-white/80">{record.history_present_illness}</p>
                        </div>
                      )}

                      {record.physical_examination && (
                        <div className="clinical-note-section">
                          <h4>Physical Examination</h4>
                          <p className="text-white/80">{record.physical_examination}</p>
                        </div>
                      )}

                      {record.assessment && (
                        <div className="clinical-note-section">
                          <h4>Assessment</h4>
                          <p className="text-white/80">{record.assessment}</p>
                        </div>
                      )}

                      {record.plan && (
                        <div className="clinical-note-section col-span-full">
                          <h4>Plan</h4>
                          <p className="text-white/80">{record.plan}</p>
                        </div>
                      )}

                      {record.discharge_summary && (
                        <div className="clinical-note-section col-span-full">
                          <h4>Discharge Summary</h4>
                          <p className="text-white/80">{record.discharge_summary}</p>
                        </div>
                      )}

                      {record.follow_up_instructions && (
                        <div className="clinical-note-section col-span-full">
                          <h4>Follow-up Instructions</h4>
                          <p className="text-white/80">{record.follow_up_instructions}</p>
                        </div>
                      )}
                    </div>

                    {/* Diagnosis and Procedure Codes */}
                    {(record.diagnosis_codes || record.procedure_codes) && (
                      <div className="mt-6 p-4 bg-white/5 rounded border border-white/20">
                        <h4 className="text-white font-medium mb-3 flex items-center gap-2">
                          <Stethoscope className="h-4 w-4" />
                          Clinical Codes
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {record.diagnosis_codes && record.diagnosis_codes.length > 0 && (
                            <div>
                              <h5 className="text-white/80 font-medium mb-2">Diagnosis Codes:</h5>
                              <div className="flex flex-wrap gap-1">
                                {record.diagnosis_codes.map((code, index) => (
                                  <Badge key={index} className="bg-blue-600/20 border border-blue-400/30 text-white text-xs">
                                    {code}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                          {record.procedure_codes && record.procedure_codes.length > 0 && (
                            <div>
                              <h5 className="text-white/80 font-medium mb-2">Procedure Codes:</h5>
                              <div className="flex flex-wrap gap-1">
                                {record.procedure_codes.map((code, index) => (
                                  <Badge key={index} className="bg-green-600/20 border border-green-400/30 text-white text-xs">
                                    {code}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* AI Coding Suggestions */}
                    {record.ai_coding_suggestions && (
                      <div className="mt-4 p-3 bg-purple-600/20 rounded border border-purple-400/30">
                        <h4 className="text-purple-200 font-medium mb-2 text-sm">AI Clinical Insights:</h4>
                        <div className="text-purple-100 text-xs">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className="bg-purple-600 text-white">
                              {record.coding_confidence_score}% Confidence
                            </Badge>
                            <span className="text-purple-200">AI-Enhanced Documentation</span>
                          </div>
                          <pre className="whitespace-pre-wrap font-mono bg-purple-900/20 p-2 rounded text-xs">
                            {JSON.stringify(record.ai_coding_suggestions, null, 2)}
                          </pre>
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="mt-6 flex gap-2 pt-4 border-t border-white/20">
                      <Button size="sm" className="quick-action-btn quick-action-primary">
                        <FileText className="h-3 w-3 mr-1" />
                        Edit Note
                      </Button>
                      <Button size="sm" className="quick-action-btn quick-action-secondary">
                        <Plus className="h-3 w-3 mr-1" />
                        Addendum
                      </Button>
                      <Button size="sm" className="quick-action-btn quick-action-success">
                        <Stethoscope className="h-3 w-3 mr-1" />
                        Sign Note
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
      </CardContent>
    </Card>
  );
};

export default EpicClinicalNotes;