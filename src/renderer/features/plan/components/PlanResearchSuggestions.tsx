import { useCallback, useEffect, useRef, useState } from "react";
import type { PlanResearchSuggestion } from "@shared/domain/investment";
import styles from "./PlanResearchSuggestions.module.css";

const mobileResearchQuery = "(max-width: 820px)";

interface PlanResearchSuggestionsProps {
  goalName: string;
  suggestion: PlanResearchSuggestion;
}

export function PlanResearchSuggestions({ goalName, suggestion }: PlanResearchSuggestionsProps) {
  const [expanded, setExpanded] = useState(() => (
    typeof window === "undefined" || !window.matchMedia(mobileResearchQuery).matches
  ));
  const [canScrollBack, setCanScrollBack] = useState(false);
  const [canScrollForward, setCanScrollForward] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia(mobileResearchQuery);
    const handleBreakpointChange = (event: MediaQueryListEvent) => setExpanded(!event.matches);
    mediaQuery.addEventListener("change", handleBreakpointChange);
    return () => mediaQuery.removeEventListener("change", handleBreakpointChange);
  }, []);

  const updateScrollControls = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    setCanScrollBack(track.scrollLeft > 4);
    setCanScrollForward(track.scrollLeft + track.clientWidth < track.scrollWidth - 4);
  }, []);

  useEffect(() => {
    if (!expanded) return;
    const track = trackRef.current;
    if (!track) return;
    const frame = window.requestAnimationFrame(updateScrollControls);
    const resizeObserver = new ResizeObserver(updateScrollControls);
    resizeObserver.observe(track);
    track.addEventListener("scroll", updateScrollControls, { passive: true });
    return () => {
      window.cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      track.removeEventListener("scroll", updateScrollControls);
    };
  }, [expanded, suggestion.directions.length, updateScrollControls]);

  const scrollDirections = (direction: -1 | 1) => {
    const track = trackRef.current;
    const firstCard = track?.querySelector<HTMLElement>(`[data-direction-card]`);
    if (!track || !firstCard) return;
    const gap = Number.parseFloat(window.getComputedStyle(track).columnGap) || 12;
    track.scrollBy({ left: direction * (firstCard.offsetWidth + gap), behavior: "smooth" });
  };

  const hasOverflow = canScrollBack || canScrollForward;

  return (
    <section className={`card ${styles.panel}`} aria-labelledby="plan-research-title">
      <header className={styles.header}>
        <div>
          <span className="card-label">研究起點</span>
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
        <span>{expanded ? "收合研究方向" : `展開 ${suggestion.directions.length} 個研究方向`}</span>
        <b aria-hidden="true">{expanded ? "−" : "＋"}</b>
      </button>

      <div id="plan-research-content" hidden={!expanded}>
        <div className={styles.directionSectionHeader}>
          <div>
            <strong>{suggestion.directions.length} 個研究方向</strong>
            {hasOverflow && <small>可使用箭頭或左右滑動查看更多</small>}
          </div>
          {hasOverflow && (
            <div className={styles.carouselControls} aria-label="切換研究方向">
              <button type="button" disabled={!canScrollBack} onClick={() => scrollDirections(-1)} aria-label="查看上一個研究方向">←</button>
              <button type="button" disabled={!canScrollForward} onClick={() => scrollDirections(1)} aria-label="查看下一個研究方向">→</button>
            </div>
          )}
        </div>

        <div className={styles.directionViewport}>
          <div ref={trackRef} className={styles.directionTrack} aria-label="依目前規劃整理的研究方向">
            {suggestion.directions.map((direction) => (
              <article className={styles.directionCard} data-direction-card key={direction.id}>
                <div className={styles.directionMeta}><span>{direction.category}</span><b>{direction.allocationRole}</b></div>
                <h3>{direction.title}</h3>
                <p>{direction.rationale}</p>
                <small><strong>研究前先驗證：</strong>{direction.riskNote}</small>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
