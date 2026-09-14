import { useEffect, useState } from "react";
import type { SatisfactionRating } from "@shared/domain/userFeedback";
import type { RouteId } from "../../../app/routeMetadata";
import type { UserFeedbackRepository } from "../../../data/repositories/UserFeedbackRepository";
import { Button } from "../../../components/ui/Button";
import styles from "./SatisfactionDialog.module.css";

interface SatisfactionDialogProps {
  open: boolean;
  route: RouteId;
  repository: UserFeedbackRepository;
  onClose: () => void;
}

const ratingOptions: Array<{ value: SatisfactionRating; label: string }> = [
  { value: 1, label: "非常不滿意" },
  { value: 2, label: "不滿意" },
  { value: 3, label: "普通" },
  { value: 4, label: "滿意" },
  { value: 5, label: "非常滿意" },
];

export function SatisfactionDialog({ open, route, repository, onClose }: SatisfactionDialogProps) {
  const [rating, setRating] = useState<SatisfactionRating | null>(null);
  const [hoveredRating, setHoveredRating] = useState<SatisfactionRating | null>(null);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!open) return;
    setRating(null);
    setHoveredRating(null);
    setComment("");
    setSubmitted(false);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [open, onClose]);

  if (!open) return null;

  const activeRating = hoveredRating ?? rating ?? 0;
  const ratingLabel = ratingOptions.find((option) => option.value === (hoveredRating ?? rating))?.label;
  const submit = () => {
    if (!rating) return;
    repository.save({ rating, comment, route });
    setSubmitted(true);
  };

  return (
    <div className={styles.layer} role="presentation">
      <button className={styles.overlay} onClick={onClose} aria-label="關閉使用回饋" />
      <section className={styles.dialog} role="dialog" aria-modal="true" aria-labelledby="satisfaction-title">
        <header>
          <div><span>使用回饋</span><h2 id="satisfaction-title">這次使用感受如何？</h2></div>
          <button className={styles.close} onClick={onClose} aria-label="關閉使用回饋">×</button>
        </header>

        {submitted ? (
          <div className={styles.success} role="status">
            <span aria-hidden="true">✓</span>
            <h3>謝謝你的回饋</h3>
            <p>你的意見將協助我們持續改善資訊呈現與投資決策流程。</p>
            <Button onClick={onClose}>完成</Button>
          </div>
        ) : (
          <form onSubmit={(event) => { event.preventDefault(); submit(); }}>
            <p className={styles.prompt}>整體而言，你對逆思投資目前的使用體驗滿意嗎？</p>
            <fieldset className={styles.ratingGroup}>
              <legend>滿意度評分</legend>
              <div role="radiogroup" aria-label="滿意度評分">
                {ratingOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    role="radio"
                    aria-checked={rating === option.value}
                    aria-label={`${option.value} 顆星，${option.label}`}
                    className={option.value <= activeRating ? styles.activeStar : ""}
                    onClick={() => setRating(option.value)}
                    onMouseEnter={() => setHoveredRating(option.value)}
                    onMouseLeave={() => setHoveredRating(null)}
                    onFocus={() => setHoveredRating(option.value)}
                    onBlur={() => setHoveredRating(null)}
                  >★</button>
                ))}
              </div>
              <p aria-live="polite">{ratingLabel ?? "請選擇 1 至 5 顆星"}</p>
            </fieldset>
            <label className={styles.comment} htmlFor="feedback-comment">
              <span>還有什麼想告訴我們？<small>選填</small></span>
              <textarea id="feedback-comment" value={comment} onChange={(event) => setComment(event.target.value)} maxLength={300} placeholder="例如：哪個流程最有幫助，或哪裡不容易理解" />
              <small>{comment.length} / 300</small>
            </label>
            <footer>
              <Button type="button" variant="ghost" onClick={onClose}>稍後再說</Button>
              <Button type="submit" disabled={!rating}>送出回饋</Button>
            </footer>
          </form>
        )}
      </section>
    </div>
  );
}
