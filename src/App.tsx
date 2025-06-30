
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';

import { AuthProvider } from '@/contexts/AuthContext';
import Dashboard from '@/pages/Dashboard';
import Login from '@/pages/Login';
import NotFound from '@/pages/NotFound';
import Patients from '@/pages/Patients';
import Settings from '@/pages/Settings';
import Tasks from '@/pages/Tasks';
import Clinical from '@/pages/Clinical';
import ERPatientTracker from '@/components/dashboard/ERPatientTracker';
import FloatingActionButton from '@/components/clinical/FloatingActionButton';
import ConsultRequestForm from '@/components/clinical/ConsultRequestForm';
import TeamMessaging from '@/components/clinical/TeamMessaging';
import EpicStylePatientChart from '@/components/clinical/EpicStylePatientChart';
import PhysicianRoundingList from '@/components/clinical/PhysicianRoundingList';
import NursingWorkstation from '@/components/clinical/NursingWorkstation';
import CPOESystem from '@/components/clinical/CPOESystem';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster />
      <BrowserRouter>
        <AuthProvider>
          <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/patients" element={<Patients />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/clinical" element={<Clinical />} />
              <Route path="/er-patient-tracker" element={<ERPatientTracker />} />
              <Route path="/team-messaging" element={<TeamMessaging />} />
              <Route path="/consult-request" element={<ConsultRequestForm />} />
              
              <Route path="/epic-chart/:patientId" element={<EpicStylePatientChart />} />
              <Route path="/physician-rounding" element={<PhysicianRoundingList />} />
              <Route path="/nursing-workstation" element={<NursingWorkstation />} />
              <Route path="/cpoe/:patientId" element={<CPOESystem />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
