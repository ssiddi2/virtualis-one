
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import Login from '@/components/auth/Login';
// Temporarily import to create account - remove after use
import '@/utils/createUserAccount';

const LoginPage = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/my-patients');
    }
  }, [user, navigate]);


  const handleLogin = async (email: string, password: string, role: string) => {
    await login(email, password, role);
    // ALL users must select hospital first - no exceptions
    navigate('/hospital-selection');
  };

  return <Login onLogin={handleLogin} />;
};

export default LoginPage;
