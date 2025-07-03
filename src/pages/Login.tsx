
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import Login from '@/components/auth/Login';

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
    if (role === 'admin') {
      navigate('/hospital-selection');
    } else {
      navigate('/my-patients');
    }
  };

  return <Login onLogin={handleLogin} />;
};

export default LoginPage;
