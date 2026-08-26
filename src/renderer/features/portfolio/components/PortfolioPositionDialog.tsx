import { useEffect, useState, type FormEvent } from "react";
import type {
  PortfolioAllocationRole,
  PortfolioPosition,
  PortfolioPositionInput,
  ResearchInstrument,
} from "@shared/domain/investment";
import { Button } from "../../../components/ui/Button";
import styles from "../PortfolioPage.module.css";

interface PortfolioPositionDialogProps {
  open: boolean;
  instruments: ResearchInstrument[];
  unavailableInstrumentIds: string[];
  position: PortfolioPosition | null;
  onSave: (input: PortfolioPositionInput) => Promise<boolean>;
  onClose: () => void;
}

export function PortfolioPositionDialog({
  open,
  instruments,
  unavailableInstrumentIds,
  position,
  onSave,
  onClose,
}: PortfolioPositionDialogProps) {
  const firstAvailable = instruments.find((instrument) => !unavailableInstrumentIds.includes(instrument.id))?.id ?? instruments[0]?.id ?? "";
  const [instrumentId, setInstrumentId] = useState(firstAvailable);
  const [allocationRole, setAllocationRole] = useState<PortfolioAllocationRole>("長期投資");
  const [quantity, setQuantity] = useState("");
  const [averageCost, setAverageCost] = useState("");
  const [referencePrice, setReferencePrice] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    setInstrumentId(position?.instrumentId ?? firstAvailable);
    setAllocationRole(position?.allocationRole ?? "長期投資");
    setQuantity(position ? String(position.quantity) : "");
    setAverageCost(position ? String(position.averageCost) : "");
    setReferencePrice(position ? String(position.referencePrice) : "");
  }, [firstAvailable, open, position]);

  if (!open) return null;

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    const saved = await onSave({
      positionId: position?.positionId,
      instrumentId,
      allocationRole,
      quantity: Number(quantity),
      averageCost: Number(averageCost),
      referencePrice: Number(referencePrice),
    });
    setSaving(false);
    if (saved) onClose();
  };

  return (
    <div className={styles.dialogOverlay} role="presentation">
      <section className={styles.dialog} role="dialog" aria-modal="true" aria-labelledby="portfolio-dialog-title">
        <header>
          <div>
            <span className="card-label">模擬持倉</span>
            <h2 id="portfolio-dialog-title">{position ? `編輯 ${position.name}` : "新增一筆持倉"}</h2>
          </div>
          <button type="button" className={styles.dialogClose} onClick={onClose} aria-label="關閉持倉視窗">×</button>
        </header>
        <form onSubmit={(event) => void submit(event)}>
          <label>
            <span>標的</span>
            <select value={instrumentId} onChange={(event) => setInstrumentId(event.target.value)} disabled={Boolean(position)} required>
              {instruments.map((instrument) => (
                <option
                  key={instrument.id}
                  value={instrument.id}
                  disabled={!position && unavailableInstrumentIds.includes(instrument.id)}
                >
                  {instrument.symbol}　{instrument.name}　{unavailableInstrumentIds.includes(instrument.id) && !position ? "（已有持倉）" : ""}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span>配置用途</span>
            <select value={allocationRole} onChange={(event) => setAllocationRole(event.target.value as PortfolioAllocationRole)}>
              <option value="長期投資">長期投資</option>
              <option value="成長投資">成長投資</option>
            </select>
          </label>
          <div className={styles.numericFields}>
            <label>
              <span>持有數量</span>
              <input type="number" min="1" step="1" inputMode="numeric" value={quantity} onChange={(event) => setQuantity(event.target.value)} required />
            </label>
            <label>
              <span>平均成本</span>
              <input type="number" min="0.01" step="0.01" inputMode="decimal" value={averageCost} onChange={(event) => setAverageCost(event.target.value)} required />
            </label>
            <label>
              <span>參考價格</span>
              <input type="number" min="0.01" step="0.01" inputMode="decimal" value={referencePrice} onChange={(event) => setReferencePrice(event.target.value)} required />
            </label>
          </div>
          <p className={styles.dialogNote}>參考價格由使用者輸入，只用於估算模擬持倉市值與損益，不是即時行情。</p>
          <footer>
            <Button type="button" variant="secondary" onClick={onClose}>取消</Button>
            <Button type="submit" disabled={saving}>{saving ? "儲存中…" : position ? "儲存變更" : "加入模擬持倉"}</Button>
          </footer>
        </form>
      </section>
    </div>
  );
}
