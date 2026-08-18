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
  allocationRole: "核心配置" | "成長配置" | "觀察清單";
  rationale: string;
  riskNote: string;
}

export interface PlanCandidateIdea {
  id: string;
  name: string;
  symbol?: string;
  category: string;
  rationale: string;
  dataStatus: "已有研究資料" | "待進一步篩選";
  instrumentId?: string;
}

export interface PlanResearchSuggestion {
  summary: string;
  directions: PlanResearchDirection[];
  candidates: PlanCandidateIdea[];
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
