import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface HospitalConnection {
  hospitalId: string;
  hospitalName: string;
  emrType: string;
  status: 'connecting' | 'connected' | 'error';
  connectedAt: Date;
}

export interface ConnectionStep {
  id: string;
  label: string;
  status: 'pending' | 'active' | 'complete' | 'error';
}

export interface AuthorizedHospital {
  id: string;
  name: string;
  emrType: string;
  location: string;
}

interface MultiHospitalContextType {
  activeConnection: HospitalConnection | null;
  authorizedHospitals: AuthorizedHospital[];
  isConnecting: boolean;
  connectionSteps: ConnectionStep[];
  connect: (hospitalId: string) => Promise<boolean>;
  disconnect: () => Promise<void>;
  switchHospital: (hospitalId: string) => Promise<boolean>;
}

const MultiHospitalContext = createContext<MultiHospitalContextType | undefined>(undefined);
const STORAGE_KEY = 'virtualis:hospital_session';

export function MultiHospitalProvider({ children }: { children: React.ReactNode }) {
  const [activeConnection, setActiveConnection] = useState<HospitalConnection | null>(null);
  const [authorizedHospitals, setAuthorizedHospitals] = useState<AuthorizedHospital[]>([]);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionSteps, setConnectionSteps] = useState<ConnectionStep[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    loadHospitals();
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const p = JSON.parse(stored);
        setActiveConnection({ ...p, connectedAt: new Date(p.connectedAt) });
      } catch { localStorage.removeItem(STORAGE_KEY); }
    }
  }, []);

  useEffect(() => {
    if (activeConnection) localStorage.setItem(STORAGE_KEY, JSON.stringify(activeConnection));
    else localStorage.removeItem(STORAGE_KEY);
  }, [activeConnection]);

  const loadHospitals = async () => {
    const { data } = await supabase.from('hospitals').select('id, name, emr_type, city, state').order('name');
    setAuthorizedHospitals((data || []).map(h => ({
      id: h.id, 
      name: h.name, 
      emrType: h.emr_type || 'Unknown',
      location: `${h.city || ''}, ${h.state || ''}`.trim() || 'Unknown',
    })));
  };

  const connect = useCallback(async (hospitalId: string): Promise<boolean> => {
    if (activeConnection?.hospitalId === hospitalId) return true;
    if (activeConnection) {
      toast({ title: "Already Connected", description: "Disconnect first or use Switch.", variant: "destructive" });
      return false;
    }
    
    const hospital = authorizedHospitals.find(h => h.id === hospitalId);
    if (!hospital) { 
      toast({ title: "Error", description: "Hospital not found", variant: "destructive" }); 
      return false; 
    }

    setIsConnecting(true);
    const steps: ConnectionStep[] = [
      { id: 'verify', label: 'Verifying Credentials', status: 'pending' },
      { id: 'auth', label: `Authenticating with ${hospital.emrType}`, status: 'pending' },
      { id: 'handshake', label: 'Secure TLS Handshake', status: 'pending' },
      { id: 'sync', label: 'Synchronizing Data', status: 'pending' },
      { id: 'ready', label: 'Initializing Workspace', status: 'pending' },
    ];
    setConnectionSteps(steps);

    try {
      for (let i = 0; i < steps.length; i++) {
        setConnectionSteps(s => s.map((st, j) => ({ ...st, status: j === i ? 'active' : j < i ? 'complete' : 'pending' })));
        await new Promise(r => setTimeout(r, i === 3 ? 1200 : 600));
        setConnectionSteps(s => s.map((st, j) => ({ ...st, status: j <= i ? 'complete' : st.status })));
      }

      setActiveConnection({
        hospitalId: hospital.id, 
        hospitalName: hospital.name, 
        emrType: hospital.emrType,
        status: 'connected', 
        connectedAt: new Date(),
      });

      toast({ title: "Connected", description: `Connected to ${hospital.name}` });
      return true;
    } catch (e: any) {
      toast({ title: "Connection Failed", description: e.message, variant: "destructive" });
      return false;
    } finally {
      setIsConnecting(false);
    }
  }, [activeConnection, authorizedHospitals, toast]);

  const disconnect = useCallback(async () => {
    if (!activeConnection) return;
    toast({ title: "Disconnected", description: `Disconnected from ${activeConnection.hospitalName}` });
    setActiveConnection(null);
    setConnectionSteps([]);
  }, [activeConnection, toast]);

  const switchHospital = useCallback(async (hospitalId: string): Promise<boolean> => {
    if (activeConnection?.hospitalId === hospitalId) return true;
    if (activeConnection) { 
      await disconnect(); 
      await new Promise(r => setTimeout(r, 300)); 
    }
    return connect(hospitalId);
  }, [activeConnection, disconnect, connect]);

  return (
    <MultiHospitalContext.Provider value={{
      activeConnection, authorizedHospitals, isConnecting, connectionSteps, connect, disconnect, switchHospital,
    }}>
      {children}
    </MultiHospitalContext.Provider>
  );
}

export const useMultiHospital = () => {
  const ctx = useContext(MultiHospitalContext);
  if (!ctx) throw new Error('useMultiHospital must be within MultiHospitalProvider');
  return ctx;
};
