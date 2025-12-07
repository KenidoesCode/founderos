import { create } from "zustand";

interface User {
  id: string;
  email?: string;
  name?: string;
}

interface Tenant {
  id: string;
  name: string;
  slug: string;
}

interface Startup {
  id: string;
  slug: string;
  title: string;
  oneLiner: string;
  json: any;
}

interface AppState {
  user: User | null;
  tenant: Tenant | null;
  activeStartup: Startup | null;
  personaMode: "default" | "keni" | "mentor" | "growth" | "builder";
  streak: number;
  token: string | null;
  sidebarOpen: boolean;
  
  setUser: (user: User | null) => void;
  setTenant: (tenant: Tenant | null) => void;
  setActiveStartup: (startup: Startup | null) => void;
  setPersonaMode: (mode: AppState["personaMode"]) => void;
  setStreak: (days: number) => void;
  setToken: (token: string | null) => void;
  setSidebarOpen: (open: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  user: null,
  tenant: null,
  activeStartup: null,
  personaMode: "default",
  streak: 0,
  token: null,
  sidebarOpen: true,
  
  setUser: (user) => set({ user }),
  setTenant: (tenant) => set({ tenant }),
  setActiveStartup: (startup) => set({ activeStartup: startup }),
  setPersonaMode: (mode) => set({ personaMode: mode }),
  setStreak: (days) => set({ streak: days }),
  setToken: (token) => set({ token }),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
}));

