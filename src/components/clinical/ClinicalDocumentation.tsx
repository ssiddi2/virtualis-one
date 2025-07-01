import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
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
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Clinical Documentation</h1>
              <p className="text-gray-600 mt-1">Patient: {patientName}</p>
            </div>
            <Badge variant="outline" className="text-green-600">
              <Stethoscope className="h-4 w-4 mr-1" />
              Documentation Center
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Documentation Types */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Documentation Types</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-2">
                  {documentationTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setActiveTab(type.id)}
                      className={`w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors ${
                        activeTab === type.id ? 'bg-green-50 border-r-2 border-green-500' : ''
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <type.icon className="h-4 w-4" />
                        <span className="font-medium">{type.label}</span>
                      </div>
                      <Badge variant="secondary">{type.count}</Badge>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Documentation Forms */}
          <div className="lg:col-span-3">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsContent value="progress-notes">
                <ProgressNotesForm
                  patientId={patientId}
                  hospitalId={hospitalId}
                />
              </TabsContent>
              
              <TabsContent value="nursing">
                <NursingDocumentation
                  patientId={patientId}
                  hospitalId={hospitalId}
                />
              </TabsContent>
              
              <TabsContent value="templates">
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
