
import { useState, useEffect, useCallback } from 'react';

interface CopilotState {
  isOpen: boolean;
  currentPatient?: any;
  context?: {
    location?: string;
    unit?: string;
    role?: string;
  };
}

export const useAICopilot = () => {
  const [state, setState] = useState<CopilotState>({
    isOpen: false,
    currentPatient: null,
    context: {}
  });

  // Global hotkey handler for Ctrl+Space
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if ((event.ctrlKey || event.metaKey) && event.code === 'Space') {
      event.preventDefault();
      setState(prev => ({ ...prev, isOpen: !prev.isOpen }));
    }
    
    // Escape to close
    if (event.key === 'Escape' && state.isOpen) {
      setState(prev => ({ ...prev, isOpen: false }));
    }
  }, [state.isOpen]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const openCopilot = (patient?: any, context?: any) => {
    setState({
      isOpen: true,
      currentPatient: patient,
      context: context || {}
    });
  };

  const closeCopilot = () => {
    setState(prev => ({ ...prev, isOpen: false }));
  };

  const updateContext = (newContext: any) => {
    setState(prev => ({
      ...prev,
      context: { ...prev.context, ...newContext }
    }));
  };

  const setCurrentPatient = (patient: any) => {
    setState(prev => ({ ...prev, currentPatient: patient }));
  };

  return {
    ...state,
    openCopilot,
    closeCopilot,
    updateContext,
    setCurrentPatient
  };
};
