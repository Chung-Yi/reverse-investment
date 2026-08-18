export type RiskLevel = "保守" | "穩健" | "成長";

export interface InvestmentGoal {
  name: string;
  targetAmount: number;
  currentAmount: number;
  years: number;
  monthlyContribution: number;
}

export interface RiskProfile {
  willingness: RiskLevel;
  capacity: RiskLevel;
  required: RiskLevel;
  dimensions: Array<{ label: string; value: number }>;
}

export interface AllocationItem {
  label: string;
  percentage: number;
  description: string;
  tone: "core" | "growth" | "liquid";
}

export interface PlanPolicy {
  feasibilityStatus: "可規劃" | "需要調整";
  feasibilityHeadline: string;
  feasibilitySummary: string;
  feasibilityReasons: string[];
  referenceAmount: number;
  percentageBasis: "總投資資產";
  singlePositionLimitPercentage: number;
  industryReviewThresholdPercentage: number;
  reviewTriggers: string[];
}

export interface PlanResearchDirection {
  id: string;
  category: string;
  title: string;
  allocationRole: "長期投資" | "成長投資" | "先觀察";
  rationale: string;
  riskNote: string;
}

export interface PlanResearchSuggestion {
  summary: string;
  directions: PlanResearchDirection[];
}

export type TaiwanMarket = "上市" | "上櫃";
export type ResearchInstrumentType = "個股" | "ETF";
export type ResearchCandidateOrigin = "plan" | "user";
export type ResearchAnalysisStatus = "pending" | "ready";

export interface ResearchInstrument {
  id: string;
  symbol: string;
  name: string;
  market: TaiwanMarket;
  instrumentType: ResearchInstrumentType;
  category: string;
}

export interface ResearchCandidate extends ResearchInstrument {
  candidateId: string;
  origin: ResearchCandidateOrigin;
  directionId?: string;
  directionTitle?: string;
  rationale: string;
  analysisStatus: ResearchAnalysisStatus;
  researchFit?: number;
  suitability?: number;
  instrumentId?: string;
}

export interface InstrumentSearchFilters {
  market?: TaiwanMarket;
  instrumentType?: ResearchInstrumentType;
}

export interface CandidateInstrument {
  id: string;
  symbol: string;
  name: string;
  category: string;
  rationale: string;
  researchFit: number;
  suitability: number;
  summary: string;
  metrics: Array<{ label: string; value: string; note: string }>;
  evidence: string[];
  counterEvidence: string[];
  assumptions: string[];
  dataStatus: string;
  dataAsOf: string;
  sources: Array<{
    title: string;
    publisher: string;
    publishedAt: string;
    url: string;
  }>;
}

export interface ThesisCard {
  id: string;
  instrumentId: string;
  reason: string;
  validityScore: number;
  suitabilityScore: number;
  status: "追蹤中" | "需要檢視";
  updatedAt: string;
}
