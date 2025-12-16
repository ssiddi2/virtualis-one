
import { useAuth } from '@/contexts/EnterpriseAuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Login from '@/components/auth/Login';
import LoadingSpinner from '@/components/ui/loading-spinner';

const LoginPage = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [isSigningIn, setIsSigningIn] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/hospital-selection');
    }
  }, [user, navigate]);

  const handleLogin = async (email: string, password: string, role: string) => {
    setIsSigningIn(true);
    try {
      const result = await login(email, password);
      if (!result.success) {
        throw new Error(result.error || 'Login failed');
      }
      // ALL users must select hospital first - no exceptions
      navigate('/hospital-selection');
    } catch (error) {
      // Re-throw the error so the Login component can handle it
      throw error;
    } finally {
      setIsSigningIn(false);
    }
  };

  // Show loading overlay during sign-in transition
  if (isSigningIn) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{
        background: 'linear-gradient(135deg, hsl(225, 70%, 25%) 0%, hsl(220, 65%, 35%) 25%, hsl(215, 60%, 45%) 50%, hsl(210, 55%, 55%) 75%, hsl(205, 50%, 65%) 100%)'
      }}>
        <LoadingSpinner size="lg" text="Signing you in..." />
      </div>
    );
  }

  return <Login onLogin={handleLogin} />;
};

export default LoginPage;
