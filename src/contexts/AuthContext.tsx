import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// HIPAA requires session timeout - 30 minutes default
const SESSION_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes
const WARNING_BEFORE_MS = 5 * 60 * 1000; // 5 minute warning
const ACTIVITY_EVENTS = ['mousedown', 'keydown', 'scroll', 'touchstart', 'mousemove'];

interface Profile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  hospital_id: string;
  department?: string;
  license_number?: string;
  phone?: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  sessionExpiresAt: Date | null;
  login: (email: string, password: string, role: string) => Promise<void>;
  signUp: (email: string, password: string, userData: any) => Promise<{ error: any }>;
  logout: () => Promise<void>;
  extendSession: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [sessionExpiresAt, setSessionExpiresAt] = useState<Date | null>(null);
  const { toast } = useToast();
  
  const lastActivityRef = useRef(Date.now());
  const warningShownRef = useRef(false);

  // Track user activity
  const updateActivity = useCallback(() => {
    lastActivityRef.current = Date.now();
    warningShownRef.current = false;
    setSessionExpiresAt(new Date(Date.now() + SESSION_TIMEOUT_MS));
  }, []);

  // Setup activity listeners
  useEffect(() => {
    if (!user) return;
    
    ACTIVITY_EVENTS.forEach(event => 
      window.addEventListener(event, updateActivity, { passive: true })
    );
    return () => {
      ACTIVITY_EVENTS.forEach(event => 
        window.removeEventListener(event, updateActivity)
      );
    };
  }, [user, updateActivity]);

  // Session timeout checker
  useEffect(() => {
    if (!user) return;

    const checkSession = () => {
      const elapsed = Date.now() - lastActivityRef.current;
      
      if (elapsed >= SESSION_TIMEOUT_MS) {
        // Session expired - force logout
        logout();
        toast({
          title: "Session Expired",
          description: "You have been logged out due to inactivity for HIPAA compliance.",
          variant: "destructive",
        });
      } else if (elapsed >= SESSION_TIMEOUT_MS - WARNING_BEFORE_MS && !warningShownRef.current) {
        // Show warning once
        warningShownRef.current = true;
        const remaining = Math.ceil((SESSION_TIMEOUT_MS - elapsed) / 60000);
        toast({
          title: "Session Expiring Soon",
          description: `Your session will expire in ${remaining} minute(s). Move your mouse or press a key to stay logged in.`,
        });
      }
    };

    // Check every 30 seconds
    const interval = setInterval(checkSession, 30000);
    updateActivity(); // Reset on mount

    return () => clearInterval(interval);
  }, [user, toast, updateActivity]);

  // Fetch profile helper
  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }
      return data as Profile;
    } catch (error) {
      console.error('Profile fetch error:', error);
      return null;
    }
  };

  // Auth state listener
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Defer profile fetch to avoid deadlock
          setTimeout(async () => {
            const profileData = await fetchProfile(session.user.id);
            setProfile(profileData);
          }, 0);
          updateActivity();
        } else {
          setProfile(null);
          setSessionExpiresAt(null);
        }
        
        setLoading(false);
      }
    );

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id).then(setProfile);
        updateActivity();
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [updateActivity]);

  const login = async (email: string, password: string, role: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        toast({
          title: "Sign In Failed",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, userData: any) => {
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: userData
        }
      });
      
      if (error) {
        toast({
          title: "Sign Up Failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Account Created",
          description: "Please check your email to verify your account.",
        });
      }
      
      return { error };
    } catch (error) {
      console.error('Sign up error:', error);
      return { error };
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Signed Out",
        description: "You have been signed out successfully.",
      });
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const extendSession = useCallback(() => {
    updateActivity();
    toast({
      title: "Session Extended",
      description: "Your session has been extended for another 30 minutes.",
    });
  }, [updateActivity, toast]);

  const value = {
    user,
    session,
    profile,
    loading,
    sessionExpiresAt,
    login,
    signUp,
    logout,
    extendSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
