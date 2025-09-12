
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

  // Temporary: one-time auto-provision for Dr. Siddiqi
  useEffect(() => {
    if (!user) {
      const key = 'dr_provision_attempted_v2';
      const attempted = sessionStorage.getItem(key);
      if (!attempted) {
        sessionStorage.setItem(key, '1');
        navigate('/tools/create-user?email=dr.siddiqi@livemedhealth.com&password=123456&first_name=Siddiqi&role=physician');
      }
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
