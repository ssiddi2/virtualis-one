import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export interface HospitalConnection {
  hospitalId: string;
  hospitalName: string;
  emrType: string;
  connectedAt: Date;
  sessionToken?: string;
}

export interface AuthorizedHospital {
  id: string;
  name: string;
  location: string;
  emrType: string;
  status: 'online' | 'degraded' | 'offline';
}

export interface ConnectionStep {
  id: string;
  label: string;
  status: 'pending' | 'active' | 'complete' | 'error';
}

interface MultiHospitalContextType {
  activeConnection: HospitalConnection | null;
  authorizedHospitals: AuthorizedHospital[];
  isConnecting: boolean;
  connectionSteps: ConnectionStep[];
  connect: (hospitalId: string) => Promise<boolean>;
  disconnect: () => void;
  switchHospital: (hospitalId: string) => Promise<boolean>;
}

const MultiHospitalContext = createContext<MultiHospitalContextType | undefined>(undefined);

const INITIAL_STEPS: ConnectionStep[] = [
  { id: 'auth', label: 'Authenticating credentials...', status: 'pending' },
  { id: 'validate', label: 'Validating EMR access...', status: 'pending' },
  { id: 'session', label: 'Establishing secure session...', status: 'pending' },
  { id: 'sync', label: 'Syncing patient data...', status: 'pending' },
];

export function MultiHospitalProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [activeConnection, setActiveConnection] = useState<HospitalConnection | null>(null);
  const [authorizedHospitals, setAuthorizedHospitals] = useState<AuthorizedHospital[]>([]);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionSteps, setConnectionSteps] = useState<ConnectionStep[]>(INITIAL_STEPS);

  // Load authorized hospitals
  useEffect(() => {
    if (!user) return;
    
    const loadHospitals = async () => {
      const { data, error } = await supabase
        .from('hospitals')
        .select('id, name, city, state, emr_type')
        .limit(20);

      if (!error && data) {
        setAuthorizedHospitals(data.map(h => ({
          id: h.id,
          name: h.name,
          location: `${h.city}, ${h.state}`,
          emrType: h.emr_type,
          status: 'online' as const
        })));
      }
    };

    loadHospitals();
  }, [user]);

  // Restore connection from session storage
  useEffect(() => {
    const stored = sessionStorage.getItem('activeHospitalConnection');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setActiveConnection({
          ...parsed,
          connectedAt: new Date(parsed.connectedAt)
        });
      } catch (e) {
        sessionStorage.removeItem('activeHospitalConnection');
      }
    }
  }, []);

  const updateStep = useCallback((stepId: string, status: ConnectionStep['status']) => {
    setConnectionSteps(prev => prev.map(step => 
      step.id === stepId ? { ...step, status } : step
    ));
  }, []);

  const simulateConnection = useCallback(async (hospital: AuthorizedHospital): Promise<boolean> => {
    setConnectionSteps(INITIAL_STEPS);
    setIsConnecting(true);

    const steps = ['auth', 'validate', 'session', 'sync'];
    
    for (const stepId of steps) {
      updateStep(stepId, 'active');
      await new Promise(resolve => setTimeout(resolve, 600 + Math.random() * 400));
      updateStep(stepId, 'complete');
    }

    const connection: HospitalConnection = {
      hospitalId: hospital.id,
      hospitalName: hospital.name,
      emrType: hospital.emrType,
      connectedAt: new Date(),
      sessionToken: crypto.randomUUID()
    };

    setActiveConnection(connection);
    sessionStorage.setItem('activeHospitalConnection', JSON.stringify(connection));
    setIsConnecting(false);
    
    return true;
  }, [updateStep]);

  const connect = useCallback(async (hospitalId: string): Promise<boolean> => {
    const hospital = authorizedHospitals.find(h => h.id === hospitalId);
    if (!hospital) return false;
    
    return simulateConnection(hospital);
  }, [authorizedHospitals, simulateConnection]);

  const disconnect = useCallback(() => {
    setActiveConnection(null);
    sessionStorage.removeItem('activeHospitalConnection');
    setConnectionSteps(INITIAL_STEPS);
  }, []);

  const switchHospital = useCallback(async (hospitalId: string): Promise<boolean> => {
    disconnect();
    await new Promise(resolve => setTimeout(resolve, 300));
    return connect(hospitalId);
  }, [disconnect, connect]);

  return (
    <MultiHospitalContext.Provider value={{
      activeConnection,
      authorizedHospitals,
      isConnecting,
      connectionSteps,
      connect,
      disconnect,
      switchHospital
    }}>
      {children}
    </MultiHospitalContext.Provider>
  );
}

export function useMultiHospital() {
  const context = useContext(MultiHospitalContext);
  if (!context) {
    throw new Error('useMultiHospital must be used within a MultiHospitalProvider');
  }
  return context;
}
