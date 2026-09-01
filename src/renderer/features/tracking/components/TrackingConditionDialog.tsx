import { useEffect, useMemo, useState } from "react";
import type { SaveTrackingConditionInput, TrackingConditionComparator, TrackingConditionDefinition, TrackingConditionKind } from "@shared/domain/trackingCondition";
import type { TrackingConditionSetup } from "@shared/domain/trackingCondition";
import { Button } from "../../../components/ui/Button";

const comparatorLabels: Record<TrackingConditionComparator, string> = {
  below: "低於",
  above: "高於",
  changeAtLeast: "漲跌幅達到",
  eventOccurs: "資料公布時",
};

function BellIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" /></svg>;
}

export function TrackingBellButton({ count, onClick }: { count: number; onClick: () => void }) {
  return (
    <button type="button" className="tracking-bell-button" onClick={onClick} aria-label={`設定追蹤條件，目前 ${count} 項`} title="設定追蹤條件">
      <BellIcon />
      {count > 0 && <span>{count}</span>}
    </button>
  );
}

export function TrackingConditionDialog({
  open,
  setup,
  onClose,
  onSave,
}: {
  open: boolean;
  setup: TrackingConditionSetup;
  onClose: () => void;
  onSave: (input: SaveTrackingConditionInput) => Promise<void>;
}) {
  const [kind, setKind] = useState<TrackingConditionKind>(setup.definitions[0].kind);
  const definition = useMemo(() => setup.definitions.find((item) => item.kind === kind) ?? setup.definitions[0], [kind, setup.definitions]);
  const [optionId, setOptionId] = useState(definition.options[0].id);
  const option = definition.options.find((item) => item.id === optionId) ?? definition.options[0];
  const [comparator, setComparator] = useState<TrackingConditionComparator>(option.supportedComparators[0]);
  const [threshold, setThreshold] = useState(String(option.defaultThreshold ?? ""));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const selectDefinition = (next: TrackingConditionDefinition) => {
    const nextOption = next.options[0];
    setKind(next.kind);
    setOptionId(nextOption.id);
    setComparator(nextOption.supportedComparators[0]);
    setThreshold(String(nextOption.defaultThreshold ?? ""));
    setError("");
  };

  const selectOption = (nextOptionId: string) => {
    const nextOption = definition.options.find((item) => item.id === nextOptionId) ?? definition.options[0];
    setOptionId(nextOption.id);
    setComparator(nextOption.supportedComparators[0]);
    setThreshold(String(nextOption.defaultThreshold ?? ""));
    setError("");
  };

  useEffect(() => {
    if (!open) return;
    const first = setup.definitions[0];
    selectDefinition(first);
  }, [open, setup.target.trackingId]);

  if (!open) return null;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const numericThreshold = Number(threshold);
    if (comparator !== "eventOccurs" && (!threshold.trim() || !Number.isFinite(numericThreshold) || numericThreshold < 0)) {
      setError("請輸入有效的門檻數值。");
      return;
    }
    try {
      setSaving(true);
      setError("");
      await onSave({ kind, optionId: option.id, comparator, threshold: comparator === "eventOccurs" ? undefined : numericThreshold });
      onClose();
    } catch {
      setError("條件儲存失敗，請稍後再試。");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="tracking-condition-layer">
      <button type="button" className="tracking-condition-overlay" aria-label="關閉追蹤條件設定" onClick={onClose} />
      <section className="tracking-condition-dialog" role="dialog" aria-modal="true" aria-labelledby="tracking-condition-title">
        <header>
          <div>
            <span className="card-label">{setup.target.instrument.symbol} {setup.target.instrument.name}</span>
            <h2 id="tracking-condition-title">設定追蹤條件</h2>
            <p>選擇固定的追蹤種類，再依這個標的設定內容與門檻。</p>
          </div>
          <button type="button" className="tracking-condition-close" onClick={onClose} aria-label="關閉">×</button>
        </header>

        <form onSubmit={handleSubmit}>
          <fieldset className="tracking-condition-types">
            <legend>
              <span>追蹤種類</span>
              <small>選擇一種要持續監測的訊號</small>
            </legend>
            <div className="tracking-condition-type-grid">
              {setup.definitions.map((item) => (
                <button
                  type="button"
                  key={item.kind}
                  className={item.kind === kind ? "selected" : ""}
                  aria-pressed={item.kind === kind}
                  onClick={() => selectDefinition(item)}
                >
                  <strong>{item.label}</strong>
                  <small>{item.description}</small>
                </button>
              ))}
            </div>
          </fieldset>

          <div className="tracking-condition-fields">
            <label>
              <span>追蹤內容</span>
              <select value={option.id} onChange={(event) => selectOption(event.target.value)}>
                {definition.options.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
              </select>
            </label>

            <label>
              <span>觸發方式</span>
              <select value={comparator} onChange={(event) => setComparator(event.target.value as TrackingConditionComparator)}>
                {option.supportedComparators.map((item) => <option key={item} value={item}>{comparatorLabels[item]}</option>)}
              </select>
            </label>

            {comparator !== "eventOccurs" && (
              <label>
                <span>門檻數值</span>
                <div className="tracking-threshold-input"><input type="number" min="0" step="any" value={threshold} onChange={(event) => setThreshold(event.target.value)} /><b>{option.unit}</b></div>
              </label>
            )}
          </div>

          <p className="tracking-condition-note">條件成立後會產生提醒；只有可能影響原始假設的內容，才會進入下方「關聯事件」。</p>
          {error && <p className="tracking-condition-error" role="alert">{error}</p>}
          <footer><Button type="button" variant="ghost" onClick={onClose}>取消</Button><Button type="submit" disabled={saving}>{saving ? "儲存中…" : "新增追蹤條件"}</Button></footer>
        </form>
      </section>
    </div>
  );
}
