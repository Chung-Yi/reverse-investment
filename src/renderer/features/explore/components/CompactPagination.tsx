import styles from "../ExplorePage.module.css";

interface CompactPaginationProps {
  ariaLabel: string;
  first: number;
  last: number;
  total: number;
  unit: string;
  previousLabel: string;
  nextLabel: string;
  canGoPrevious: boolean;
  canGoNext: boolean;
  placement: "directions" | "candidates";
  onPrevious: () => void;
  onNext: () => void;
}

export function CompactPagination({
  ariaLabel,
  first,
  last,
  total,
  unit,
  previousLabel,
  nextLabel,
  canGoPrevious,
  canGoNext,
  placement,
  onPrevious,
  onNext,
}: CompactPaginationProps) {
  return (
    <nav
      className={`${styles.compactPagination} ${placement === "directions" ? styles.directionPagination : styles.candidatePagination}`}
      aria-label={ariaLabel}
    >
      <span className={styles.paginationRange} aria-live="polite">
        {first}–{last}，共 {total} {unit}
      </span>
      <div className={styles.paginationActions}>
        <button type="button" disabled={!canGoPrevious} onClick={onPrevious} aria-label={previousLabel} title={previousLabel}>
          <span aria-hidden="true">←</span>
        </button>
        <button type="button" disabled={!canGoNext} onClick={onNext} aria-label={nextLabel} title={nextLabel}>
          <span aria-hidden="true">→</span>
        </button>
      </div>
    </nav>
  );
}
