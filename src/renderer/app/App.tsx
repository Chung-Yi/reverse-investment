import { useCallback, useMemo, useRef, useState } from "react";
import type { ResearchCandidate } from "@shared/domain/investment";
import { AppContext, type OnboardingMode } from "./AppContext";
import { routes, secondaryRouteBackNavigation, type RouteId } from "./routeMetadata";
import { AppShell } from "../components/layout/AppShell";
import { AiDrawer } from "../components/layout/AiDrawer";
import { mockInvestmentRepository } from "../data/repositories/mockInvestmentRepository";
import { mockResearchCandidateRepository } from "../data/repositories/mockResearchCandidateRepository";
import { mockPortfolioRepository } from "../data/repositories/mockPortfolioRepository";
import { localOnboardingProfileRepository } from "../data/repositories/localOnboardingProfileRepository";
import { buildPersonalizedInvestmentData } from "../data/personalization/buildPersonalizedInvestmentData";
import { useInvestmentData } from "../hooks/useInvestmentData";
import { MockAgentProvider } from "../services/agent/MockAgentProvider";
import { demoOnboardingAnswers } from "../data/fixtures/onboardingQuestions";
import { WelcomePage } from "../features/welcome/pages/WelcomePage";
import { OnboardingPage } from "../features/onboarding/pages/OnboardingPage";
import { HomePage } from "../features/home/pages/HomePage";
import { ProfilePage } from "../features/profile/pages/ProfilePage";
import { PlanPage } from "../features/plan/pages/PlanPage";
import { ExplorePage } from "../features/explore/pages/ExplorePage";
import { initialExploreViewState } from "../features/explore/types";
import { PortfolioPage } from "../features/portfolio/pages/PortfolioPage";
import { RotationPage } from "../features/rotation/pages/RotationPage";
import { InstrumentPage } from "../features/instrument/pages/InstrumentPage";
import { DecisionPage } from "../features/decision/pages/DecisionPage";
import { ThesisPage } from "../features/thesis/pages/ThesisPage";
import { TrackingPage } from "../features/tracking/pages/TrackingPage";
import { ChangePage } from "../features/change/pages/ChangePage";

const validRoutes = new Set<RouteId>(routes.map((route) => route.id));
const initialRoute = location.hash.slice(1) as RouteId;

export function App() {
  const [route, setRoute] = useState<RouteId>(validRoutes.has(initialRoute) ? initialRoute : "home");
  const routeRef = useRef(route);
  const routeHistoryRef = useRef<RouteId[]>([route]);
  const [assistant, setAssistant] = useState({ open: false, prompt: "" });
  const [selectedCandidate, setSelectedCandidate] = useState<ResearchCandidate | null>(null);
  const [exploreViewState, setExploreViewState] = useState(initialExploreViewState);
  const [onboardingMode, setOnboardingMode] = useState<OnboardingMode>("edit");
  const [onboardingAnswers, setOnboardingAnswers] = useState<Record<string, string>>(() => (
    localOnboardingProfileRepository.load()?.answers ?? { ...demoOnboardingAnswers }
  ));
  const [thesisObservation, setThesisObservation] = useState("");
  const agentProvider = useMemo(() => new MockAgentProvider(), []);
  const { data, error } = useInvestmentData(mockInvestmentRepository);
  const navigate = useCallback((next: RouteId) => {
    if (routeRef.current === next) return;
    routeHistoryRef.current.push(next);
    routeRef.current = next;
    setRoute(next);
    window.history.replaceState(null, "", `#${next}`);
    window.scrollTo({ top: 0 });
  }, []);
  const navigateFromPrimary = useCallback((next: RouteId) => {
    if (next === "explore") setExploreViewState({ ...initialExploreViewState });
    navigate(next);
  }, [navigate]);
  const goBack = useCallback(() => {
    const currentRoute = routeRef.current;
    const fallback = secondaryRouteBackNavigation[currentRoute]?.fallback;
    if (routeHistoryRef.current.length > 1) routeHistoryRef.current.pop();
    else if (fallback) routeHistoryRef.current = [fallback];
    else return;
    const previous = routeHistoryRef.current[routeHistoryRef.current.length - 1];
    routeRef.current = previous;
    setRoute(previous);
    window.history.replaceState(null, "", `#${previous}`);
    window.scrollTo({ top: 0 });
  }, []);
  const openCandidateAnalysis = useCallback((candidate: ResearchCandidate) => {
    setSelectedCandidate(candidate);
    navigate("instrument");
  }, [navigate]);
  const openAssistant = useCallback((prompt = "") => setAssistant({ open: true, prompt }), []);
  const startOnboarding = useCallback((mode: OnboardingMode) => {
    setOnboardingMode(mode);
    navigate("onboarding");
  }, [navigate]);
  const saveOnboardingAnswers = useCallback((answers: Record<string, string>) => {
    const savedProfile = localOnboardingProfileRepository.save(answers);
    setOnboardingAnswers(savedProfile.answers);
    setOnboardingMode("edit");
  }, []);
  const context = useMemo(() => ({ route, navigate, openAssistant, agentProvider, onboardingMode, onboardingAnswers, thesisObservation, startOnboarding, saveOnboardingAnswers, saveThesisObservation: setThesisObservation }), [route, navigate, openAssistant, agentProvider, onboardingMode, onboardingAnswers, thesisObservation, startOnboarding, saveOnboardingAnswers]);
  const personalizedData = useMemo(() => data ? buildPersonalizedInvestmentData(data, onboardingAnswers) : null, [data, onboardingAnswers]);

  let content: React.ReactNode;
  if (error) content = <div className="feedback-state error"><h1>目前無法載入 Demo</h1><p>{error}</p></div>;
  else if (!personalizedData) content = <div className="feedback-state"><span className="loader" /><h1>正在準備你的投資旅程</h1><p>載入投資研究資料中…</p></div>;
  else {
    const pages: Record<RouteId, React.ReactNode> = {
      welcome: <WelcomePage />, home: <HomePage data={personalizedData} />, onboarding: <OnboardingPage key={onboardingMode} />,
      profile: <ProfilePage data={personalizedData} />, plan: <PlanPage data={personalizedData} />, explore: <ExplorePage data={personalizedData} repository={mockResearchCandidateRepository} onOpenCandidate={openCandidateAnalysis} viewState={exploreViewState} onViewStateChange={setExploreViewState} />,
      portfolio: <PortfolioPage data={personalizedData} repository={mockPortfolioRepository} />,
      rotation: <RotationPage />,
      instrument: <InstrumentPage data={personalizedData} selectedCandidate={selectedCandidate} />, decision: <DecisionPage data={personalizedData} />, thesis: <ThesisPage data={personalizedData} />,
      tracking: <TrackingPage data={personalizedData} />, change: <ChangePage />,
    };
    content = pages[route];
  }

  return <AppContext.Provider value={context}><AppShell route={route} navigate={navigate} onPrimaryNavigate={navigateFromPrimary} backLabel={secondaryRouteBackNavigation[route]?.label} onBack={goBack} openAssistant={() => openAssistant()}>{content}</AppShell><AiDrawer open={assistant.open} route={route} initialPrompt={assistant.prompt} provider={agentProvider} onClose={() => setAssistant((current) => ({ ...current, open: false }))} /></AppContext.Provider>;
}
