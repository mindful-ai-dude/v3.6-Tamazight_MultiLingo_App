import React, { createContext, useState, useContext, ReactNode, useMemo, useCallback } from 'react';

type Mode = 'offline' | 'online';

interface ModeContextType {
  mode: Mode;
  toggleMode: () => void;
}

const ModeContext = createContext<ModeContextType | undefined>(undefined);

export const ModeProvider = ({ children }: { children: ReactNode }) => {
  const [mode, setMode] = useState<Mode>('offline');

  const toggleMode = useCallback(() => {
    setMode(prevMode => (prevMode === 'offline' ? 'online' : 'offline'));
  }, []);

  const value = useMemo(() => ({
    mode,
    toggleMode
  }), [mode, toggleMode]);

  return (
    <ModeContext.Provider value={value}>
      {children}
    </ModeContext.Provider>
  );
};

export const useMode = () => {
  const context = useContext(ModeContext);
  if (context === undefined) {
    throw new Error('useMode must be used within a ModeProvider');
  }
  return context;
};

// Default export to satisfy Expo Router requirements
export default ModeProvider;