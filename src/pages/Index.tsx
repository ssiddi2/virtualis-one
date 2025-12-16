
import { useAuth } from "@/contexts/EnterpriseAuthContext";
import AuthForm from "@/components/auth/AuthForm";
import { Navigate } from "react-router-dom";

const Index = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{
        background: 'linear-gradient(135deg, hsl(225, 70%, 25%) 0%, hsl(220, 65%, 35%) 25%, hsl(215, 60%, 45%) 50%, hsl(210, 55%, 55%) 75%, hsl(205, 50%, 65%) 100%)'
      }}>
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{
        background: 'linear-gradient(135deg, hsl(225, 70%, 25%) 0%, hsl(220, 65%, 35%) 25%, hsl(215, 60%, 45%) 50%, hsl(210, 55%, 55%) 75%, hsl(205, 50%, 65%) 100%)',
        minHeight: '100vh'
      }}>
        <AuthForm />
      </div>
    );
  }

  // If user is authenticated, redirect to EMR dashboard
  return <Navigate to="/emr" replace />;
};

export default Index;
