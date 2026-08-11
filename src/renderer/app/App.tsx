import { useCallback, useMemo, useState } from "react";
import { AppContext } from "./AppContext";
import { routes, type RouteId } from "./routeMetadata";
import { AppShell } from "../components/layout/AppShell";
import { AiDrawer } from "../components/layout/AiDrawer";
import { mockInvestmentRepository } from "../data/repositories/mockInvestmentRepository";
import { useInvestmentData } from "../hooks/useInvestmentData";
import { MockAgentProvider } from "../services/agent/MockAgentProvider";
import { WelcomePage } from "../features/welcome/pages/WelcomePage";
import { OnboardingPage } from "../features/onboarding/pages/OnboardingPage";
import { HomePage } from "../features/home/pages/HomePage";
import { ProfilePage } from "../features/profile/pages/ProfilePage";
import { PlanPage } from "../features/plan/pages/PlanPage";
import { ExplorePage } from "../features/explore/pages/ExplorePage";
import { InstrumentPage } from "../features/instrument/pages/InstrumentPage";
import { DecisionPage } from "../features/decision/pages/DecisionPage";
import { ThesisPage } from "../features/thesis/pages/ThesisPage";
import { TrackingPage } from "../features/tracking/pages/TrackingPage";
import { ChangePage } from "../features/change/pages/ChangePage";

const validRoutes = new Set<RouteId>(routes.map((route) => route.id));
const initialRoute = location.hash.slice(1) as RouteId;

export function App() {
  const [route, setRoute] = useState<RouteId>(validRoutes.has(initialRoute) ? initialRoute : "home");
  const [assistant, setAssistant] = useState({ open: false, prompt: "" });
  const agentProvider = useMemo(() => new MockAgentProvider(), []);
  const { data, error } = useInvestmentData(mockInvestmentRepository);
  const navigate = useCallback((next: RouteId) => { setRoute(next); location.hash = next; window.scrollTo({ top: 0 }); }, []);
  const openAssistant = useCallback((prompt = "") => setAssistant({ open: true, prompt }), []);
  const context = useMemo(() => ({ route, navigate, openAssistant, agentProvider }), [route, navigate, openAssistant, agentProvider]);

  let content: React.ReactNode;
  if (error) content = <div className="feedback-state error"><h1>目前無法載入 Demo</h1><p>{error}</p></div>;
  else if (!data) content = <div className="feedback-state"><span className="loader" /><h1>正在準備你的投資旅程</h1><p>載入投資研究資料中…</p></div>;
  else {
    const pages: Record<RouteId, React.ReactNode> = {
      welcome: <WelcomePage />, home: <HomePage data={data} />, onboarding: <OnboardingPage />,
      profile: <ProfilePage data={data} />, plan: <PlanPage data={data} />, explore: <ExplorePage data={data} />,
      instrument: <InstrumentPage data={data} />, decision: <DecisionPage data={data} />, thesis: <ThesisPage data={data} />,
      tracking: <TrackingPage />, change: <ChangePage />,
    };
    content = pages[route];
  }

  return <AppContext.Provider value={context}><AppShell route={route} navigate={navigate} openAssistant={() => openAssistant()}>{content}</AppShell><AiDrawer open={assistant.open} route={route} initialPrompt={assistant.prompt} provider={agentProvider} onClose={() => setAssistant((current) => ({ ...current, open: false }))} /></AppContext.Provider>;
}
