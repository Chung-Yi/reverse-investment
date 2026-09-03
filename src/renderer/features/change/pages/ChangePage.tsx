import { useState } from "react";
import type { ImportantChangeReviewAction } from "@shared/domain/importantChangeReview";
import type { RelatedEvent } from "@shared/domain/relatedEvent";
import type { TrackingTarget } from "@shared/domain/tracking";
import { useAppContext } from "../../../app/AppContext";
import { PageHeader } from "../../../components/layout/PageHeader";
import { Button } from "../../../components/ui/Button";
import type { ImportantChangeReviewRepository } from "../../../data/repositories/ImportantChangeReviewRepository";
import type { TrackingConditionRepository } from "../../../data/repositories/TrackingConditionRepository";
import { useImportantChangeReviews } from "../../../hooks/useImportantChangeReviews";

const steps = ["確認觸發", "理解影響", "記錄決定"];

const actionOptions: Array<{
  id: ImportantChangeReviewAction;
  label: string;
  description: string;
}> = [
  { id: "keep", label: "保持目前判斷", description: "已理解這項變化，目前不修改原始內容。" },
  { id: "updateThesis", label: "更新投資理由", description: "把新的理解寫回這個標的的論點紀錄。" },
  { id: "updateTracking", label: "調整追蹤條件", description: "修改這次被觸發的條件門檻或重新確認事件追蹤。" },
  { id: "updatePlan", label: "補充投資規劃", description: "記錄這項變化對整體配置與限制的影響。" },
];

function defaultNote(action: ImportantChangeReviewAction, event: RelatedEvent) {
  if (action === "keep") return `已檢視「${event.title}」，目前保留原判斷並持續追蹤。`;
  if (action === "updateThesis") return `因「${event.title}」，重新檢視：${event.affectedAssumption}`;
  if (action === "updatePlan") return `重新確認 ${event.affectedInstrument.symbol} ${event.affectedInstrument.name} 在整體配置中的角色與風險限制。`;
  return `重新確認「${event.trigger.label}」的追蹤設定。`;
}

interface ChangePageProps {
  event: RelatedEvent | null;
  target: TrackingTarget | null;
  conditionRepository: TrackingConditionRepository;
  reviewRepository: ImportantChangeReviewRepository;
}

export function ChangePage({ event, target, conditionRepository, reviewRepository }: ChangePageProps) {
  const { navigate, openAssistant } = useAppContext();
  const [step, setStep] = useState(0);
  const [action, setAction] = useState<ImportantChangeReviewAction>("keep");
  const [note, setNote] = useState(() => event ? defaultNote("keep", event) : "");
  const [threshold, setThreshold] = useState(() => String(event?.trigger.threshold ?? ""));
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [savedMessage, setSavedMessage] = useState("");
  const { reviews, error: reviewsError, reload: reloadReviews } = useImportantChangeReviews(
    reviewRepository,
    { eventId: event?.id },
  );

  if (!event || !target) {
    return (
      <section className="change-workspace">
        <PageHeader
          eyebrow="事件檢視與判斷更新"
          title="請先選擇一項關聯事件"
          description="返回心跳追蹤，選擇需要深入理解的事件。"
          action={<Button variant="secondary" onClick={() => navigate("tracking")}>返回心跳追蹤</Button>}
        />
      </section>
    );
  }

  const sourceContent = event.source.url
    ? <a href={event.source.url} target="_blank" rel="noreferrer">{event.source.publisher}・{event.source.title}</a>
    : <>{event.source.publisher}・{event.source.title}</>;

  const chooseAction = (nextAction: ImportantChangeReviewAction) => {
    setAction(nextAction);
    setNote(defaultNote(nextAction, event));
    setThreshold(String(event.trigger.threshold ?? ""));
    setSaveError("");
    setSavedMessage("");
  };

  const discussEvent = () => openAssistant(
    `請和我一起檢視 ${event.affectedInstrument.symbol} ${event.affectedInstrument.name} 的事件「${event.title}」，區分已確認事實、可能影響與仍需驗證的資訊。`,
    {
      focus: { kind: "relatedEvent", id: event.id, label: event.title },
      facts: [
        { key: "instrument", label: "受影響標的", value: `${event.affectedInstrument.symbol} ${event.affectedInstrument.name}` },
        { key: "trigger", label: "觸發條件", value: `${event.trigger.label}・${event.trigger.detail}` },
        { key: "observed", label: "實際觀察", value: event.trigger.observed },
        { key: "assumption", label: "受影響假設", value: event.affectedAssumption },
      ],
    },
  );

  const saveReview = async () => {
    const trimmedNote = (note || defaultNote(action, event)).trim();
    if (!trimmedNote) {
      setSaveError("請先寫下這次檢視後的決定。");
      return;
    }

    let previousValue: string | undefined;
    let updatedValue: string | undefined = trimmedNote;

    try {
      setSaving(true);
      setSaveError("");
      setSavedMessage("");

      if (action === "updateTracking") {
        const { conditionKind, optionId, comparator } = event.trigger;
        if (!conditionKind || !optionId || !comparator) throw new Error("這項事件缺少可更新的追蹤條件資料。");
        const numericThreshold = Number(threshold);
        if (comparator !== "eventOccurs" && (!threshold.trim() || !Number.isFinite(numericThreshold) || numericThreshold < 0)) {
          throw new Error("請輸入有效的新門檻數值。");
        }
        await conditionRepository.save(target, {
          kind: conditionKind,
          optionId,
          comparator,
          threshold: comparator === "eventOccurs" ? undefined : numericThreshold,
        });
        previousValue = event.trigger.detail;
        updatedValue = comparator === "eventOccurs"
          ? `${event.trigger.label}：持續於資料公布時提醒`
          : `${event.trigger.label}：${threshold}${event.trigger.unit ?? ""}`;
      } else if (action === "updateThesis") {
        previousValue = target.thesisReason;
      }

      const selectedAction = actionOptions.find((item) => item.id === action) ?? actionOptions[0];
      await reviewRepository.save({
        eventId: event.id,
        eventTitle: event.title,
        trackingId: target.trackingId,
        thesisId: target.thesisId,
        instrument: {
          id: target.instrument.id,
          symbol: target.instrument.symbol,
          name: target.instrument.name,
        },
        action,
        actionLabel: selectedAction.label,
        note: trimmedNote,
        previousValue,
        updatedValue,
      });
      await reloadReviews();
      setSavedMessage(`已保存：${selectedAction.label}`);
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : "這次更新無法保存，請稍後再試。");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="change-workspace">
      <PageHeader
        eyebrow="事件檢視與判斷更新"
        title={`${event.affectedInstrument.symbol} ${event.affectedInstrument.name}｜${event.title}`}
        description={`因「${event.trigger.label}・${event.trigger.detail}」進入檢視，先確認事實，再決定是否更新判斷。`}
        action={<Button variant="ghost" onClick={discussEvent}>✦ 與 AI 討論這項事件</Button>}
      />

      <div className="change-flow-tabs" role="tablist" aria-label="事件檢視步驟">
        {steps.map((label, index) => (
          <button type="button" role="tab" aria-selected={step === index} aria-current={step === index ? "step" : undefined} key={label} className={step === index ? "active" : ""} onClick={() => setStep(index)}>
            <span>{index + 1}</span>{label}
          </button>
        ))}
      </div>

      {step === 0 && (
        <article className="change-stage card change-stage-facts">
          <div className="change-stage-heading">
            <div className="related-event-tags">
              <span className={`severity ${event.severity === "重要" ? "critical" : event.severity === "注意" ? "attention" : "info"}`}>{event.severity}</span>
              <span className="related-event-type">{event.eventType}</span>
            </div>
            <span className="related-event-status">{event.dataStatus}</span>
          </div>
          <h2>先確認這次為什麼被提醒</h2>
          <p>資料來源：{sourceContent}（資料截至 {event.dataAsOf}）。</p>
          <div className="trigger-comparison">
            <div><span>設定門檻</span><strong>{event.trigger.detail}</strong></div>
            <div><span>實際數值／狀態</span><strong>{event.trigger.observed}</strong></div>
            <div className="difference"><span>差異</span><strong>{event.trigger.difference}</strong></div>
          </div>
          <div className="event-impact-summary">
            <div><span>受影響假設</span><strong>{event.affectedAssumption}</strong></div>
            <div><span>與我的規劃</span><strong>{event.goalImpact}</strong></div>
          </div>
          <footer><Button onClick={() => setStep(1)}>下一步：理解可能影響 →</Button></footer>
        </article>
      )}

      {step === 1 && (
        <article className="change-stage card change-stage-analysis">
          <span className="card-label">把事實、解讀與不確定性分開</span>
          <h2>目前可以知道什麼？還不能確定什麼？</h2>
          <div className="change-analysis-grid">
            <section className="confirmed">
              <span>01・已確認事實</span>
              <ul>{event.confirmedFacts.map((fact) => <li key={fact}>{fact}</li>)}</ul>
            </section>
            <section className="interpretation">
              <span>02・AI 協助解讀</span>
              <p>{event.interpretation}</p>
              <small>這是依目前事件脈絡整理的可能影響，不是已確認事實或投資指令。</small>
            </section>
            <section className="verification">
              <span>03・尚待驗證</span>
              <ul>{event.verificationItems.map((item) => <li key={item}>{item}</li>)}</ul>
            </section>
          </div>
          <footer>
            <Button variant="ghost" onClick={discussEvent}>✦ 繼續與 AI 討論</Button>
            <Button onClick={() => setStep(2)}>下一步：記錄我的決定 →</Button>
          </footer>
        </article>
      )}

      {step === 2 && (
        <article className="change-stage card change-stage-update">
          <span className="card-label">由你決定是否更新</span>
          <h2>這項變化要如何反映到原本的判斷？</h2>
          <p>AI 可以協助整理，但只有你確認並保存後，內容才會寫入相對應的紀錄。</p>
          <div className="update-options">
            {actionOptions.map((option) => (
              <label key={option.id}>
                <input type="radio" name="update" checked={action === option.id} onChange={() => chooseAction(option.id)} />
                <span><strong>{option.label}</strong><small>{option.description}</small></span>
              </label>
            ))}
          </div>

          {action === "updateTracking" && event.trigger.comparator !== "eventOccurs" && (
            <label className="change-update-field">
              <span>新的追蹤門檻</span>
              <div><input type="number" min="0" step="any" value={threshold} onChange={(inputEvent) => setThreshold(inputEvent.target.value)} /><b>{event.trigger.unit}</b></div>
            </label>
          )}

          <label className="change-update-field">
            <span>{action === "updateThesis" ? "更新後的投資理由" : action === "updatePlan" ? "規劃補充紀錄" : "這次檢視紀錄"}</span>
            <textarea value={note} onChange={(inputEvent) => setNote(inputEvent.target.value)} />
          </label>

          {saveError && <p className="change-save-message error" role="alert">{saveError}</p>}
          {savedMessage && <p className="change-save-message success" role="status">✓ {savedMessage}</p>}
          <footer>
            <Button variant="secondary" onClick={() => navigate("tracking")}>返回心跳追蹤</Button>
            <Button disabled={saving} onClick={() => void saveReview()}>{saving ? "保存中…" : "保存處理結果"}</Button>
          </footer>
        </article>
      )}

      <section className="change-history card" aria-label="判斷歷程">
        <div className="section-title">
          <div><span>判斷歷程</span><h2>這項事件的處理紀錄</h2></div>
          <strong>{reviews.length} 次</strong>
        </div>
        {reviewsError ? <p className="change-save-message error">{reviewsError}</p> : reviews.length === 0 ? (
          <p className="change-history-empty">尚未保存處理結果。完成第三步後，紀錄會保留在這裡。</p>
        ) : (
          <ol>{reviews.map((review) => <li key={review.id}><div><strong>{review.actionLabel}</strong><span>{new Date(review.createdAt).toLocaleString("zh-TW")}</span></div><p>{review.note}</p>{review.updatedValue && review.updatedValue !== review.note && <small>更新內容：{review.updatedValue}</small>}</li>)}</ol>
        )}
      </section>
    </section>
  );
}
