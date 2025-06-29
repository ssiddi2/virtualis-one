
import { createContext, useContext, useEffect, useState } from 'react';
import VirtualisAIAssistant from './VirtualisAIAssistant';

interface AIAssistantContextType {
  selectedHospitalId: string | null;
  setSelectedHospitalId: (hospitalId: string | null) => void;
}

const AIAssistantContext = createContext<AIAssistantContextType | undefined>(undefined);

export const useAIAssistantContext = () => {
  const context = useContext(AIAssistantContext);
  if (context === undefined) {
    throw new Error('useAIAssistantContext must be used within an AIAssistantProvider');
  }
  return context;
};

interface AIAssistantProviderProps {
  children: React.ReactNode;
}

export const AIAssistantProvider = ({ children }: AIAssistantProviderProps) => {
  const [selectedHospitalId, setSelectedHospitalId] = useState<string | null>(null);

  return (
    <AIAssistantContext.Provider value={{ selectedHospitalId, setSelectedHospitalId }}>
      {children}
      <VirtualisAIAssistant selectedHospitalId={selectedHospitalId} />
    </AIAssistantContext.Provider>
  );
};
