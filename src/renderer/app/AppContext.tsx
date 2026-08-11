import { createContext, useContext } from "react";
import type { AgentProvider } from "../services/agent/AgentProvider";
import type { RouteId } from "./routeMetadata";

interface AppContextValue {
  route: RouteId;
  navigate: (route: RouteId) => void;
  openAssistant: (prompt?: string) => void;
  agentProvider: AgentProvider;
}

export const AppContext = createContext<AppContextValue | null>(null);

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useAppContext must be used within AppContext.Provider");
  return context;
}
