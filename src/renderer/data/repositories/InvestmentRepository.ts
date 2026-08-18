import type {
  AllocationItem,
  CandidateInstrument,
  InvestmentGoal,
  PlanPolicy,
  PlanResearchSuggestion,
  RiskProfile,
  ThesisCard,
} from "@shared/domain/investment";

export interface InvestmentRepository {
  getGoal(): Promise<InvestmentGoal>;
  getRiskProfile(): Promise<RiskProfile>;
  getAllocations(): Promise<AllocationItem[]>;
  getPlanPolicy(): Promise<PlanPolicy>;
  getPlanResearchSuggestion(): Promise<PlanResearchSuggestion>;
  getCandidates(): Promise<CandidateInstrument[]>;
  getThesis(): Promise<ThesisCard>;
}
