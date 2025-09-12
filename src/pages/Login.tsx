
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Login from '@/components/auth/Login';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const LoginPage = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);

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

  const handleQuickDemoAccess = async () => {
    setIsCreating(true);
    try {
      // Create the demo account
      const { data, error } = await supabase.functions.invoke('admin-create-user', {
        body: {
          email: 'dr.siddiqi@livemedhealth.com',
          password: '123456',
          first_name: 'Dr.',
          last_name: 'Siddiqi',
          role: 'physician'
        }
      });

      if (error) throw error;

      // Auto-login after creation
      await login('dr.siddiqi@livemedhealth.com', '123456', 'physician');
      toast({ 
        title: "Demo Access Ready", 
        description: "Welcome to the EMR demo! You're now logged in." 
      });
      navigate('/hospital-selection');
    } catch (err: any) {
      // If user already exists, just try to login
      if (err?.message?.includes('already') || err?.message?.includes('exists')) {
        try {
          await login('dr.siddiqi@livemedhealth.com', '123456', 'physician');
          toast({ 
            title: "Welcome Back", 
            description: "Logging you into the demo account." 
          });
          navigate('/hospital-selection');
        } catch (loginErr) {
          toast({ 
            title: "Login Failed", 
            description: "Please use email: dr.siddiqi@livemedhealth.com and password: 123456",
            variant: "destructive" 
          });
        }
      } else {
        toast({ 
          title: "Setup Error", 
          description: err?.message || "Could not set up demo access. Please try again.",
          variant: "destructive" 
        });
      }
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div>
      <Login onLogin={handleLogin} />
      
      {/* Quick Demo Access Button */}
      <div className="fixed bottom-8 right-8 z-50">
        <Button
          onClick={handleQuickDemoAccess}
          disabled={isCreating}
          size="lg"
          className="bg-gradient-to-r from-primary to-primary-glow text-white shadow-lg hover:shadow-xl transition-all duration-300"
        >
          {isCreating ? (
            <>Creating Demo Account...</>
          ) : (
            <>🚀 Quick Demo Access</>
          )}
        </Button>
      </div>
    </div>
  );
};

export default LoginPage;
