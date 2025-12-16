import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/EnterpriseAuthContext';
import ProgressNotesForm from './ProgressNotesForm';
import NursingDocumentation from './NursingDocumentation';
import ClinicalTemplates from './ClinicalTemplates';
import { FileText, Stethoscope, Heart, ClipboardList } from 'lucide-react';

interface ClinicalDocumentationProps {
  patientId: string;
  patientName: string;
  hospitalId: string;
}

const ClinicalDocumentation = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState('progress-notes');

  // Default values for demo purposes
  const patientName = 'John Doe';
  const hospitalId = profile?.hospital_id || '';

  const documentationTypes = [
    { id: 'progress-notes', label: 'Progress Notes', icon: FileText, count: 12 },
    { id: 'nursing', label: 'Nursing Notes', icon: Heart, count: 8 },
    { id: 'templates', label: 'Templates', icon: ClipboardList, count: 15 }
  ];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-foreground">Clinical Documentation</h1>
              <p className="text-muted-foreground mt-1">Patient: {patientName}</p>
            </div>
            <Badge variant="outline" className="epic-badge-default">
              <Stethoscope className="h-4 w-4 mr-1" />
              Documentation Center
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Documentation Types */}
          <div className="lg:col-span-1">
            <Card className="epic-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-foreground">Documentation Types</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-1">
                  {documentationTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setActiveTab(type.id)}
                      className={`w-full flex items-center justify-between p-3 text-left hover:bg-muted/50 transition-colors text-sm ${
                        activeTab === type.id ? 'bg-accent text-accent-foreground' : 'text-foreground'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <type.icon className="h-4 w-4" />
                        <span className="font-medium">{type.label}</span>
                      </div>
                      <Badge variant="secondary" className="epic-badge-default text-xs">{type.count}</Badge>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Documentation Forms */}
          <div className="lg:col-span-3">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
              <TabsContent value="progress-notes" className="mt-0">
                <ProgressNotesForm
                  patientId={patientId}
                  hospitalId={hospitalId}
                />
              </TabsContent>
              
              <TabsContent value="nursing" className="mt-0">
                <NursingDocumentation
                  patientId={patientId}
                  hospitalId={hospitalId}
                />
              </TabsContent>
              
              <TabsContent value="templates" className="mt-0">
                <ClinicalTemplates
                  patientId={patientId}
                  hospitalId={hospitalId}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClinicalDocumentation;
