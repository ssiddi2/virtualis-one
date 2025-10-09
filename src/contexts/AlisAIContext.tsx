import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface AlisAIContextType {
  isActive: boolean;
  isMinimized: boolean;
  isExpanded: boolean;
  currentContext: {
    route: string;
    patientId?: string;
    patientName?: string;
    section?: string;
    currentRoom?: string;
    currentPatient?: {
      id: string;
      mrn?: string;
    };
  };
  setActive: (active: boolean) => void;
  setMinimized: (minimized: boolean) => void;
  setExpanded: (expanded: boolean) => void;
  updateContext: (context: Partial<AlisAIContextType['currentContext']>) => void;
  triggerDialog?: (orderType: string, patientId?: string) => void;
}

const AlisAIContext = createContext<AlisAIContextType | undefined>(undefined);

export const useAlisAI = () => {
  const context = useContext(AlisAIContext);
  if (!context) {
    throw new Error('useAlisAI must be used within AlisAIProvider');
  }
  return context;
};

interface AlisAIProviderProps {
  children: ReactNode;
}

export const AlisAIProvider = ({ children }: AlisAIProviderProps) => {
  const location = useLocation();
  const [isActive, setIsActive] = useState(false);
  const [isMinimized, setIsMinimized] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentContext, setCurrentContext] = useState({
    route: location.pathname,
    section: undefined as string | undefined,
    patientId: undefined as string | undefined,
    patientName: undefined as string | undefined,
  });

  // Track route changes
  useEffect(() => {
    setCurrentContext(prev => ({ ...prev, route: location.pathname }));
  }, [location.pathname]);

  // Load state from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('alisAI');
    if (saved) {
      try {
        const { isActive: savedActive, isMinimized: savedMinimized } = JSON.parse(saved);
        if (savedActive !== undefined) setIsActive(savedActive);
        if (savedMinimized !== undefined) setIsMinimized(savedMinimized);
      } catch (e) {
        console.error('Failed to load Alis AI state:', e);
      }
    }
  }, []);

  // Save state to localStorage
  useEffect(() => {
    localStorage.setItem('alisAI', JSON.stringify({ isActive, isMinimized }));
  }, [isActive, isMinimized]);

  const setActive = (active: boolean) => {
    setIsActive(active);
    if (!active) {
      setIsMinimized(true);
      setIsExpanded(false);
    }
  };

  const setMinimized = (minimized: boolean) => {
    setIsMinimized(minimized);
    if (minimized) setIsExpanded(false);
  };

  const setExpanded = (expanded: boolean) => {
    setIsExpanded(expanded);
  };

  const updateContext = (context: Partial<AlisAIContextType['currentContext']>) => {
    setCurrentContext(prev => ({ ...prev, ...context }));
  };

  const triggerDialog = (orderType: string, patientId?: string) => {
    console.log('[AlisAI] Dialog trigger requested:', orderType, patientId);
    // This can be enhanced to actually trigger dialogs in the future
    // For now, it's a placeholder that components can listen to
  };

  return (
    <AlisAIContext.Provider
      value={{
        isActive,
        isMinimized,
        isExpanded,
        currentContext,
        setActive,
        setMinimized,
        setExpanded,
        updateContext,
        triggerDialog,
      }}
    >
      {children}
    </AlisAIContext.Provider>
  );
};
