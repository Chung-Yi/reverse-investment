import { useCallback, useEffect, useState } from "react";
import type { ImportantChangeReview, ImportantChangeReviewFilter } from "@shared/domain/importantChangeReview";
import type { ImportantChangeReviewRepository } from "../data/repositories/ImportantChangeReviewRepository";

export function useImportantChangeReviews(
  repository: ImportantChangeReviewRepository,
  filter: ImportantChangeReviewFilter,
) {
  const [reviews, setReviews] = useState<ImportantChangeReview[]>([]);
  const [error, setError] = useState<string | null>(null);
  const eventId = filter.eventId;
  const action = filter.action;

  const reload = useCallback(async () => {
    try {
      setError(null);
      setReviews(await repository.list({ eventId, action }));
    } catch {
      setError("目前無法載入判斷歷程，請稍後再試。");
    }
  }, [action, eventId, repository]);

  useEffect(() => { void reload(); }, [reload]);

  return { reviews, error, reload };
}
