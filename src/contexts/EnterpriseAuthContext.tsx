import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { authRateLimiter, secureStorage } from '@/lib/security';

const SESSION_TIMEOUT_MS = 30 * 60 * 1000;
const WARNING_MS = 5 * 60 * 1000;
const ACTIVITY_EVENTS = ['mousedown', 'keydown', 'scroll', 'touchstart'];

interface Profile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  hospital_id: string | null;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  sessionExpiresAt: Date | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string, firstName?: string, lastName?: string, role?: string) => Promise<{ success: boolean; error?: string }>;
  logout: (reason?: string) => Promise<void>;
  extendSession: () => void;
  hasRole: (role: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function EnterpriseAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [sessionExpiresAt, setSessionExpiresAt] = useState<Date | null>(null);
  const { toast } = useToast();
  const lastActivity = useRef(Date.now());
  const warningShown = useRef(false);

  const updateActivity = useCallback(() => {
    lastActivity.current = Date.now();
    warningShown.current = false;
    if (user) setSessionExpiresAt(new Date(Date.now() + SESSION_TIMEOUT_MS));
  }, [user]);

  useEffect(() => {
    if (!user) return;
    ACTIVITY_EVENTS.forEach(e => window.addEventListener(e, updateActivity, { passive: true }));
    return () => ACTIVITY_EVENTS.forEach(e => window.removeEventListener(e, updateActivity));
  }, [user, updateActivity]);

  useEffect(() => {
    if (!user) return;
    const check = () => {
      const elapsed = Date.now() - lastActivity.current;
      if (elapsed >= SESSION_TIMEOUT_MS) {
        logout('session_timeout');
        toast({ title: "Session Expired", description: "Logged out due to inactivity.", variant: "destructive" });
      } else if (elapsed >= SESSION_TIMEOUT_MS - WARNING_MS && !warningShown.current) {
        warningShown.current = true;
        toast({ title: "Session Expiring", description: `Session expires in ${Math.ceil((SESSION_TIMEOUT_MS - elapsed) / 60000)} min.` });
      }
    };
    const interval = setInterval(check, 30000);
    updateActivity();
    return () => clearInterval(interval);
  }, [user, toast, updateActivity]);

  const fetchProfile = useCallback(async (userId: string) => {
    const { data } = await supabase.from('profiles').select('*').eq('id', userId).single();
    setProfile(data);
  }, []);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, sess) => {
      setSession(sess);
      setUser(sess?.user ?? null);
      if (sess?.user) {
        setTimeout(() => fetchProfile(sess.user.id), 0);
        updateActivity();
      } else {
        setProfile(null);
        setSessionExpiresAt(null);
      }
      setLoading(false);
    });
    
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) {
        fetchProfile(s.user.id);
      }
      setLoading(false);
    });
    
    return () => subscription.unsubscribe();
  }, [fetchProfile, updateActivity]);

  const login = useCallback(async (email: string, password: string) => {
    const rate = authRateLimiter.check(email);
    if (!rate.allowed) return { success: false, error: `Too many attempts. Retry in ${rate.retryAfter}s.` };
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { success: false, error: error.message };
    return { success: true };
  }, []);

  const signUp = useCallback(async (email: string, password: string, firstName?: string, lastName?: string, role?: string) => {
    const redirectUrl = `${window.location.origin}/`;
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          first_name: firstName || 'New',
          last_name: lastName || 'User',
          role: role || 'physician'
        }
      }
    });
    if (error) return { success: false, error: error.message };
    return { success: true };
  }, []);

  const logout = useCallback(async (reason?: string) => {
    secureStorage.clear();
    await supabase.auth.signOut();
  }, []);

  const extendSession = useCallback(() => {
    updateActivity();
    toast({ title: "Session Extended" });
  }, [updateActivity, toast]);

  const hasRole = useCallback((role: string) => {
    return profile?.role === role;
  }, [profile]);

  return (
    <AuthContext.Provider value={{ user, session, profile, loading, sessionExpiresAt, login, signUp, logout, extendSession, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within EnterpriseAuthProvider');
  return ctx;
};
