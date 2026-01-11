import { ReactNode } from 'react';
import LoginPage from "@/pages/Login";
import Patients from "@/pages/Patients";
import MyPatients from "@/pages/MyPatients";
import Clinical from "@/pages/Clinical";
import CPOE from "@/pages/CPOE";
import Demo from "@/pages/Demo";
import Settings from "@/pages/Settings";
import Tasks from "@/pages/Tasks";
import VirtualisChat from "@/pages/VirtualisChat";
import Certification from "@/pages/Certification";
import Ambient from "@/pages/Ambient";
import AuditLog from "@/pages/AuditLog";
import EpicPatientWorkspace from "@/components/clinical/EpicPatientWorkspace";
import CPOESystem from "@/components/clinical/CPOESystem";
import EnhancedCPOESystem from "@/components/clinical/EnhancedCPOESystem";
import ClinicalDocumentation from "@/components/clinical/ClinicalDocumentation";
import BillingDashboard from "@/components/billing/BillingDashboard";
import EnhancedLISDashboard from "@/components/laboratory/EnhancedLISDashboard";
import PACSManager from "@/components/radiology/PACSManager";
import CMSQualityDashboard from "@/components/cms/CMSQualityDashboard";
import CodingDashboard from "@/components/coding/CodingDashboard";
import AIDashboard from "@/components/dashboard/AIDashboard";
import EMRDashboard from "@/components/emr/EMRDashboard";
import EpicPatientWorkflowCenter from "@/components/clinical/EpicPatientWorkflowCenter";
import MainDashboard from "@/components/dashboard/MainDashboard";
import CFODashboard from "@/components/dashboard/CFODashboard";
import ERDashboard from "@/components/clinical/ERDashboard";
import HospitalSelector from "@/components/dashboard/HospitalSelector";
import { BetaOnboarding } from "@/components/onboarding/BetaOnboarding";
import ToolsCreateUser from "@/pages/ToolsCreateUser";
import EpicSandboxTest from "@/pages/EpicSandboxTest";

export interface RouteConfig {
  path: string;
  element: (props: RouteProps) => ReactNode;
  isPublic?: boolean;
  useLayout?: boolean;
  // For routes that don't need full wrapper (like patient chart which has its own layout)
  noLayout?: boolean;
}

export interface RouteProps {
  profile: any;
  user: any;
  navigate: (path: string) => void;
}

// Public routes - no auth required
export const publicRoutes: RouteConfig[] = [
  { path: '/login', element: () => <LoginPage />, isPublic: true },
  { path: '/beta-signup', element: () => <BetaOnboarding />, isPublic: true },
  { path: '/tools/create-user', element: () => <ToolsCreateUser />, isPublic: true },
];

// Protected routes with AppLayout
export const protectedRoutes: RouteConfig[] = [
  // Main navigation
  { path: '/my-patients', element: () => <MyPatients />, useLayout: true },
  { path: '/patients', element: () => <Patients />, useLayout: true },
  { path: '/dashboard', element: ({ profile, user }) => <MainDashboard user={profile || user} />, useLayout: true },
  { path: '/cfo-dashboard', element: ({ profile }) => <CFODashboard hospitalId={profile?.hospital_id || ''} />, useLayout: true },
  { path: '/er-dashboard', element: () => <ERDashboard />, useLayout: true },
  { path: '/clinical', element: () => <Clinical />, useLayout: true },
  { path: '/cpoe', element: () => <CPOE />, useLayout: true },
  { path: '/virtualis-chat', element: () => <VirtualisChat />, useLayout: true },
  { path: '/billing', element: ({ profile }) => <BillingDashboard hospitalId={profile?.hospital_id || ''} />, useLayout: true },
  { path: '/laboratory', element: () => <EnhancedLISDashboard />, useLayout: true },
  { path: '/radiology', element: () => <PACSManager />, useLayout: true },
  { path: '/quality', element: () => <CMSQualityDashboard />, useLayout: true },
  { path: '/coding', element: ({ profile }) => <CodingDashboard hospitalId={profile?.hospital_id || ''} />, useLayout: true },
  { path: '/ai-dashboard', element: ({ profile, user }) => <AIDashboard user={profile || user} hospitalId={profile?.hospital_id || ''} />, useLayout: true },
  { path: '/ambient', element: () => <Ambient />, useLayout: true },
  { path: '/demo', element: () => <Demo />, useLayout: true },
  { path: '/settings', element: () => <Settings />, useLayout: true },
  { path: '/tasks', element: () => <Tasks />, useLayout: true },
  { path: '/certification', element: () => <Certification />, useLayout: true },
  { path: '/audit-log', element: () => <AuditLog />, useLayout: true },
  { path: '/epic-test', element: () => <EpicSandboxTest />, useLayout: true },
  
  // Patient-specific routes with layout
  { path: '/patients/:patientId', element: () => <EpicPatientWorkspace />, useLayout: true },
  { path: '/patients/:patientId/cpoe', element: () => <CPOESystem />, useLayout: true },
  { path: '/cpoe/:patientId', element: () => <EnhancedCPOESystem />, useLayout: true },
  { path: '/documentation/:patientId', element: () => <ClinicalDocumentation />, useLayout: true },
  
  // EMR module routes (hospital-scoped)
  { path: '/emr/:hospitalId/patients', element: () => <MyPatients />, useLayout: true },
  { path: '/emr/:hospitalId/laboratory', element: () => <EnhancedLISDashboard />, useLayout: true },
  { path: '/emr/:hospitalId/radiology', element: () => <PACSManager />, useLayout: true },
  { path: '/emr/:hospitalId/documentation', element: () => <ClinicalDocumentation />, useLayout: true },
  { path: '/emr/:hospitalId/cpoe', element: () => <EnhancedCPOESystem />, useLayout: true },
  { path: '/emr/:hospitalId/clinical', element: () => <Clinical />, useLayout: true },
];

// Protected routes without AppLayout (have their own layout)
export const protectedNoLayoutRoutes: RouteConfig[] = [
  { path: '/hospital-selection', element: ({ navigate }) => <HospitalSelector onSelectHospital={() => navigate('/my-patients')} />, noLayout: true },
  { path: '/emr/:hospitalId', element: () => <EMRDashboard />, noLayout: true },
  { path: '/patient-chart/:patientId', element: () => <EpicPatientWorkflowCenter />, noLayout: true },
];
