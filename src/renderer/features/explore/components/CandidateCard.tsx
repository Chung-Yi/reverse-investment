import { describeAssessmentScore } from "@shared/domain/assessment";
import type { ResearchCandidate } from "@shared/domain/investment";
import { Button } from "../../../components/ui/Button";
import styles from "../ExplorePage.module.css";

interface CandidateCardProps {
  candidate: ResearchCandidate;
  analyzing: boolean;
  onAnalyze: (candidateId: string) => void;
  onRemove: (candidateId: string) => void;
  onOpenAnalysis: (candidate: ResearchCandidate) => void;
}

export function CandidateCard({ candidate, analyzing, onAnalyze, onRemove, onOpenAnalysis }: CandidateCardProps) {
  const ready = candidate.analysisStatus === "ready";
  return (
    <article className={`card ${styles.candidateCard}`}>
      <div className={styles.candidateIdentity}>
        <span className={styles.ticker}>{candidate.symbol}</span>
        <div>
          <div className={styles.candidateTags}>
            <span>{candidate.market}</span><span>{candidate.instrumentType}</span><span>{candidate.category}</span>
          </div>
          <h2>{candidate.name}</h2>
          <small>{candidate.origin === "plan" ? "依我的規劃整理" : "我自行加入"}</small>
        </div>
      </div>

      <div className={styles.candidateContext}>
        <span>對應方向</span>
        <strong>{candidate.directionTitle ?? "尚未指定方向"}</strong>
        <p>{candidate.rationale}</p>
      </div>

      <div className={styles.candidateAssessment}>
        {ready && candidate.researchFit !== undefined && candidate.suitability !== undefined ? (
          <>
            <div><span>研究條件符合度</span><strong>{candidate.researchFit}/100</strong><small>{describeAssessmentScore(candidate.researchFit)}</small></div>
            <div><span>個人初步適合度</span><strong>{candidate.suitability}/100</strong><small>{describeAssessmentScore(candidate.suitability)}</small></div>
          </>
        ) : (
          <div className={styles.pendingAssessment}><span>分析狀態</span><strong>{analyzing ? "正在整理資料…" : "等待分析"}</strong><small>完成後才會顯示評估</small></div>
        )}
      </div>

      <div className={styles.candidateActions}>
        {ready ? (
          <Button onClick={() => onOpenAnalysis(candidate)}>查看分析 →</Button>
        ) : (
          <Button disabled={analyzing} onClick={() => onAnalyze(candidate.candidateId)}>{analyzing ? "分析中…" : "開始分析"}</Button>
        )}
        {candidate.origin === "user" && <button className={styles.removeButton} onClick={() => onRemove(candidate.candidateId)}>從清單移除</button>}
      </div>
    </article>
  );
}
