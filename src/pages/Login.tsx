
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Login from '@/components/auth/Login';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (email: string, password: string, role: string) => {
    await login(email, password, role);
    navigate('/dashboard');
  };

  return <Login onLogin={handleLogin} />;
};

export default LoginPage;
