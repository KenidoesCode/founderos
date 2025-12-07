"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface AppContextType {
  // Will be extended with Zustand store
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AppContext.Provider value={{}}>
      {children}
    </AppContext.Provider>
  );
}

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within Providers");
  }
  return context;
};

