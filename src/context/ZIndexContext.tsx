import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ZIndexContextType {
  incrementZIndex: () => number;
}

const ZIndexContext = createContext<ZIndexContextType | null>(null);

export const ZIndexProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [baseZIndex, setBaseZIndex] = useState(1000);
  
  const incrementZIndex = () => {
    const newZIndex = baseZIndex + 10;
    setBaseZIndex(newZIndex);
    return newZIndex;
  };

  return (
    <ZIndexContext.Provider value={{ incrementZIndex }}>
      {children}
    </ZIndexContext.Provider>
  );
};

export const useZIndex = () => {
  const context = useContext(ZIndexContext);
  if (!context) {
    throw new Error('useZIndex must be used within a ZIndexProvider');
  }
  return context;
};