import { useEffect, useState } from "react";
import type { ResearchCandidate } from "@shared/domain/investment";
import type { ResearchCandidateRepository } from "../../../data/repositories/ResearchCandidateRepository";

export function useTrackingCandidates(repository: ResearchCandidateRepository) {
  const [candidates, setCandidates] = useState<ResearchCandidate[]>([]);

  useEffect(() => {
    let active = true;
    repository.getCandidates()
      .then((items) => { if (active) setCandidates(items); })
      .catch(() => { if (active) setCandidates([]); });
    return () => { active = false; };
  }, [repository]);

  return candidates;
}
