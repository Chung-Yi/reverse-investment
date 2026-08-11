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
