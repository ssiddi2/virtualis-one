import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { EnterpriseAuthProvider, useAuth } from "@/contexts/EnterpriseAuthContext";
import { MultiHospitalProvider } from "@/contexts/MultiHospitalContext";
import { AICopilotProvider } from "@/components/ai/AICopilotProvider";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { AlisAIProvider } from "@/contexts/AlisAIContext";
import { AlisAIFloatingPanel } from "@/components/ambient/AlisAIFloatingPanel";
import { CommandPalette } from "@/components/ui/CommandPalette";
import AppLayout from "@/components/layout/AppLayout";
import LoadingSpinner from "@/components/ui/loading-spinner";
import NotFound from "@/pages/NotFound";
import HospitalSwitcher from "@/components/dashboard/HospitalSwitcher";
import { publicRoutes, protectedRoutes, protectedNoLayoutRoutes } from "@/config/routes";

const queryClient = new QueryClient();

// Loading screen component
const LoadingScreen = () => (
  <div className="min-h-screen flex items-center justify-center" style={{
    background: 'linear-gradient(135deg, hsl(225, 70%, 25%) 0%, hsl(220, 65%, 35%) 25%, hsl(215, 60%, 45%) 50%, hsl(210, 55%, 55%) 75%, hsl(205, 50%, 65%) 100%)'
  }}>
    <LoadingSpinner size="lg" text="Initializing EMR..." />
  </div>
);

// Protected route wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <LoadingScreen />;
  if (!user) return <Navigate to="/login" replace />;
  
  return <>{children}</>;
};

const AppRoutes = () => {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) return <LoadingScreen />;

  const routeProps = { profile, user, navigate };

  return (
    <Routes>
      {/* Hospital selection - standalone protected route */}
      <Route path="/hospital-selection" element={
        <ProtectedRoute>
          <HospitalSwitcher />
        </ProtectedRoute>
      } />
      
      {/* Root redirect */}
      <Route path="/" element={user ? <Navigate to="/hospital-selection" replace /> : <Navigate to="/login" replace />} />
      
      {/* Public routes */}
      {publicRoutes.map(({ path, element }) => (
        <Route 
          key={path} 
          path={path} 
          element={path === '/login' && user ? <Navigate to="/hospital-selection" replace /> : element(routeProps)} 
        />
      ))}
      
      {/* Protected routes with AppLayout */}
      {protectedRoutes.map(({ path, element }) => (
        <Route
          key={path}
          path={path}
          element={
            <ProtectedRoute>
              <AICopilotProvider>
                <AppLayout>
                  {element(routeProps)}
                </AppLayout>
              </AICopilotProvider>
            </ProtectedRoute>
          }
        />
      ))}
      
      {/* Protected routes without AppLayout */}
      {protectedNoLayoutRoutes.map(({ path, element }) => (
        <Route
          key={path}
          path={path}
          element={
            <ProtectedRoute>
              <AICopilotProvider>
                {element(routeProps)}
              </AICopilotProvider>
            </ProtectedRoute>
          }
        />
      ))}
      
      {/* 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <EnterpriseAuthProvider>
          <MultiHospitalProvider>
            <AlisAIProvider>
              <TooltipProvider>
                <AppRoutes />
                <CommandPalette />
                <AlisAIFloatingPanel />
                <Toaster />
                <Sonner />
              </TooltipProvider>
            </AlisAIProvider>
          </MultiHospitalProvider>
        </EnterpriseAuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
