
import { createContext, useContext, ReactNode } from 'react';
import { useAICopilot } from '@/hooks/useAICopilot';
import AIClinicalCopilot from './AIClinicalCopilot';

interface AICopilotContextType {
  isOpen: boolean;
  currentPatient?: any;
  context?: any;
  openCopilot: (patient?: any, context?: any) => void;
  closeCopilot: () => void;
  updateContext: (context: any) => void;
  setCurrentPatient: (patient: any) => void;
}

const AICopilotContext = createContext<AICopilotContextType | undefined>(undefined);

export const useAICopilotContext = () => {
  const context = useContext(AICopilotContext);
  if (!context) {
    throw new Error('useAICopilotContext must be used within AICopilotProvider');
  }
  return context;
};

interface AICopilotProviderProps {
  children: ReactNode;
}

export const AICopilotProvider = ({ children }: AICopilotProviderProps) => {
  const copilot = useAICopilot();

  return (
    <AICopilotContext.Provider value={copilot}>
      {children}
      <AIClinicalCopilot
        isOpen={copilot.isOpen}
        onClose={copilot.closeCopilot}
        currentPatient={copilot.currentPatient}
        context={copilot.context}
      />
    </AICopilotContext.Provider>
  );
};
