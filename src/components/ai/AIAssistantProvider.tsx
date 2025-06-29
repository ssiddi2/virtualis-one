
import { createContext, useContext, useEffect } from 'react';
import VirtualisAIAssistant from './VirtualisAIAssistant';

interface AIAssistantContextType {
  // Future expansion for assistant state management
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
  return (
    <AIAssistantContext.Provider value={{}}>
      {children}
      <VirtualisAIAssistant />
    </AIAssistantContext.Provider>
  );
};
