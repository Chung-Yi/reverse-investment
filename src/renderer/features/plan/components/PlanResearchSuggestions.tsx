import { useEffect, useState } from "react";
import type { PlanResearchSuggestion } from "@shared/domain/investment";
import { Button } from "../../../components/ui/Button";
import styles from "./PlanResearchSuggestions.module.css";

type ViewMode = "directions" | "candidates";
const mobileResearchQuery = "(max-width: 820px)";

interface PlanResearchSuggestionsProps {
  goalName: string;
  suggestion: PlanResearchSuggestion;
  onNavigate: (route: "explore" | "instrument") => void;
}

export function PlanResearchSuggestions({ goalName, suggestion, onNavigate }: PlanResearchSuggestionsProps) {
  const [view, setView] = useState<ViewMode>("directions");
  const [expanded, setExpanded] = useState(() => (
    typeof window === "undefined" || !window.matchMedia(mobileResearchQuery).matches
  ));

  useEffect(() => {
    const mediaQuery = window.matchMedia(mobileResearchQuery);
    const handleBreakpointChange = (event: MediaQueryListEvent) => setExpanded(!event.matches);
    mediaQuery.addEventListener("change", handleBreakpointChange);
    return () => mediaQuery.removeEventListener("change", handleBreakpointChange);
  }, []);

  return (
    <section className={`card ${styles.panel}`} aria-labelledby="plan-research-title">
      <header className={styles.header}>
        <div>
          <span className="card-label">AI 研究起點</span>
          <h2 id="plan-research-title">根據「{goalName}」整理可研究的方向</h2>
          <p>{suggestion.summary}</p>
        </div>
        <span className="status neutral">依目前條件整理</span>
      </header>

      <button
        type="button"
        className={styles.mobileToggle}
        aria-expanded={expanded}
        aria-controls="plan-research-content"
        onClick={() => setExpanded((current) => !current)}
      >
        <span>{expanded ? "收合研究方向" : "展開研究方向"}</span>
        <b aria-hidden="true">{expanded ? "−" : "＋"}</b>
      </button>

      <div id="plan-research-content" hidden={!expanded}>
        <div className={styles.viewSwitch} role="tablist" aria-label="AI 研究起點顯示方式">
          <button type="button" role="tab" aria-selected={view === "directions"} className={view === "directions" ? styles.active : ""} onClick={() => setView("directions")}>產業與主題方向</button>
          <button type="button" role="tab" aria-selected={view === "candidates"} className={view === "candidates" ? styles.active : ""} onClick={() => setView("candidates")}>候選標的與類型</button>
        </div>

        {view === "directions" ? (
          <div className={styles.directionGrid} role="tabpanel">
            {suggestion.directions.map((direction) => (
              <article className={styles.directionCard} key={direction.id}>
                <div className={styles.directionMeta}><span>{direction.category}</span><b>{direction.allocationRole}</b></div>
                <h3>{direction.title}</h3>
                <p>{direction.rationale}</p>
                <small><strong>研究前先驗證：</strong>{direction.riskNote}</small>
              </article>
            ))}
          </div>
        ) : (
          <div className={styles.candidateList} role="tabpanel">
            {suggestion.candidates.map((candidate) => (
              <article className={styles.candidateRow} key={candidate.id}>
                <div className={styles.symbol}>{candidate.symbol ?? "TYPE"}</div>
                <div>
                  <span className="card-label">{candidate.category}</span>
                  <h3>{candidate.name}</h3>
                  <p>{candidate.rationale}</p>
                </div>
                <div className={styles.candidateAction}>
                  <span className={candidate.instrumentId ? "status stable" : "status neutral"}>{candidate.dataStatus}</span>
                  <Button variant="secondary" onClick={() => onNavigate(candidate.instrumentId ? "instrument" : "explore")}>{candidate.instrumentId ? "查看標的研究" : "前往篩選"} →</Button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
