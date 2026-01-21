import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/EnterpriseAuthContext';
import { usePatients } from '@/hooks/usePatients';
import ProgressNotesForm from './ProgressNotesForm';
import NursingDocumentation from './NursingDocumentation';
import ClinicalTemplates from './ClinicalTemplates';
import SNFTemplates from './SNFTemplates';
import NoteToBillingWorkflow from '@/components/billing/NoteToBillingWorkflow';
import SNFBillingCalculator from '@/components/billing/SNFBillingCalculator';
import { FileText, Stethoscope, Heart, ClipboardList, DollarSign, Building2, Calculator } from 'lucide-react';

interface ClinicalDocumentationProps {
  patientId?: string;
  patientName?: string;
  hospitalId?: string;
}

const ClinicalDocumentation = () => {
  const { patientId: routePatientId } = useParams<{ patientId: string }>();
  const { profile } = useAuth();
  const { data: patients } = usePatients();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('note-to-billing');
  const [selectedPatientId, setSelectedPatientId] = useState(routePatientId || '');

  const patientId = routePatientId || selectedPatientId;
  const patient = patients?.find(p => p.id === patientId);
  const patientName = patient ? `${patient.first_name} ${patient.last_name}` : 'Select a Patient';
  const hospitalId = profile?.hospital_id || '';

  const documentationTypes = [
    { id: 'note-to-billing', label: 'Note → Billing', icon: DollarSign, count: null },
    { id: 'snf-templates', label: 'SNF Templates', icon: Building2, count: null },
    { id: 'progress-notes', label: 'Progress Notes', icon: FileText, count: 12 },
    { id: 'nursing', label: 'Nursing Notes', icon: Heart, count: 8 },
    { id: 'templates', label: 'Templates', icon: ClipboardList, count: 15 },
    { id: 'billing-calc', label: 'Billing Calculator', icon: Calculator, count: null },
  ];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-semibold text-foreground">Clinical Documentation & RCM</h1>
              <p className="text-muted-foreground mt-1">AI-Powered Documentation to Billing Workflow</p>
            </div>
            <div className="flex items-center gap-4">
              {!routePatientId && (
                <Select value={selectedPatientId} onValueChange={setSelectedPatientId}>
                  <SelectTrigger className="w-[250px] bg-slate-800 border-slate-600 text-white">
                    <SelectValue placeholder="Select a patient..." />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-600">
                    {patients?.map((p) => (
                      <SelectItem key={p.id} value={p.id} className="text-white">
                        {p.first_name} {p.last_name} - MRN: {p.mrn}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              <Badge variant="outline" className="bg-blue-600/20 border-blue-400/30 text-blue-200">
                <Stethoscope className="h-4 w-4 mr-1" />
                {patientName}
              </Badge>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Documentation Types */}
          <div className="lg:col-span-1">
            <Card className="bg-slate-800/50 border-slate-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-white">Workflow Options</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-1">
                  {documentationTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setActiveTab(type.id)}
                      className={`w-full flex items-center justify-between p-3 text-left hover:bg-slate-700/50 transition-colors text-sm ${
                        activeTab === type.id ? 'bg-blue-600/30 text-blue-200 border-l-2 border-blue-400' : 'text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <type.icon className="h-4 w-4" />
                        <span className="font-medium">{type.label}</span>
                      </div>
                      {type.count && (
                        <Badge variant="secondary" className="bg-slate-700 text-slate-300 text-xs">{type.count}</Badge>
                      )}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Documentation Forms */}
          <div className="lg:col-span-4">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
              <TabsContent value="note-to-billing" className="mt-0">
                {patientId ? (
                  <NoteToBillingWorkflow
                    patientId={patientId}
                    patientName={patientName}
                    hospitalId={hospitalId}
                  />
                ) : (
                  <Card className="bg-slate-800/50 border-slate-700 p-8 text-center">
                    <p className="text-slate-400">Please select a patient to begin documentation</p>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="snf-templates" className="mt-0">
                <SNFTemplates onSelectTemplate={() => {}} />
              </TabsContent>

              <TabsContent value="progress-notes" className="mt-0">
                <ProgressNotesForm patientId={patientId} hospitalId={hospitalId} />
              </TabsContent>
              
              <TabsContent value="nursing" className="mt-0">
                <NursingDocumentation patientId={patientId} hospitalId={hospitalId} />
              </TabsContent>
              
              <TabsContent value="templates" className="mt-0">
                <ClinicalTemplates patientId={patientId} hospitalId={hospitalId} />
              </TabsContent>

              <TabsContent value="billing-calc" className="mt-0">
                <SNFBillingCalculator patientId={patientId} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClinicalDocumentation;
