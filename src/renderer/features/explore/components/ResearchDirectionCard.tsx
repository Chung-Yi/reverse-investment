import type { PlanResearchDirection } from "@shared/domain/investment";
import { Button } from "../../../components/ui/Button";
import styles from "../ExplorePage.module.css";

interface ResearchDirectionCardProps {
  direction: PlanResearchDirection;
  candidateCount: number;
  onViewCandidates: (directionId: string) => void;
}

export function ResearchDirectionCard({ direction, candidateCount, onViewCandidates }: ResearchDirectionCardProps) {
  return (
    <article className={`card ${styles.directionCard}`}>
      <div className={styles.directionMeta}>
        <span>{direction.allocationRole}</span>
        <small>{direction.category}</small>
      </div>
      <h2>{direction.title}</h2>
      <p>{direction.rationale}</p>
      <dl>
        <div><dt>研究前先確認</dt><dd>{direction.riskNote}</dd></div>
      </dl>
      <Button variant="secondary" onClick={() => onViewCandidates(direction.id)}>
        查看候選標的{candidateCount > 0 ? `（${candidateCount}）` : ""} →
      </Button>
    </article>
  );
}
