import { useEffect, useState } from "react";
import type {
  AllocationItem,
  CandidateInstrument,
  InvestmentGoal,
  PlanPolicy,
  PlanResearchSuggestion,
  RiskProfile,
  ThesisCard,
} from "@shared/domain/investment";
import type { InvestmentRepository } from "../data/repositories/InvestmentRepository";

export interface InvestmentData {
  goal: InvestmentGoal;
  profile: RiskProfile;
  allocations: AllocationItem[];
  planPolicy: PlanPolicy;
  planResearchSuggestion: PlanResearchSuggestion;
  candidates: CandidateInstrument[];
  thesis: ThesisCard;
}

export function useInvestmentData(repository: InvestmentRepository) {
  const [data, setData] = useState<InvestmentData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    Promise.all([
      repository.getGoal(),
      repository.getRiskProfile(),
      repository.getAllocations(),
      repository.getPlanPolicy(),
      repository.getPlanResearchSuggestion(),
      repository.getCandidates(),
      repository.getThesis(),
    ])
      .then(([goal, profile, allocations, planPolicy, planResearchSuggestion, candidates, thesis]) => {
        if (active) setData({ goal, profile, allocations, planPolicy, planResearchSuggestion, candidates, thesis });
      })
      .catch(() => {
        if (active) setError("投資研究資料載入失敗，請重新開啟應用程式。");
      });
    return () => { active = false; };
  }, [repository]);

  return { data, error };
}
