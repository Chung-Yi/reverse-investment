import { useEffect, useState } from "react";
import type {
  InstrumentSearchFilters,
  ResearchInstrument,
  ResearchInstrumentType,
  TaiwanMarket,
} from "@shared/domain/investment";
import { Button } from "../../../components/ui/Button";
import styles from "../ExplorePage.module.css";

interface AddInstrumentDialogProps {
  open: boolean;
  existingInstrumentIds: string[];
  search: (query: string, filters: InstrumentSearchFilters) => Promise<ResearchInstrument[]>;
  onAdd: (instrumentId: string) => Promise<void>;
  onClose: () => void;
}

export function AddInstrumentDialog({ open, existingInstrumentIds, search, onAdd, onClose }: AddInstrumentDialogProps) {
  const [query, setQuery] = useState("");
  const [market, setMarket] = useState<TaiwanMarket | "">("");
  const [instrumentType, setInstrumentType] = useState<ResearchInstrumentType | "">("");
  const [results, setResults] = useState<ResearchInstrument[]>([]);
  const [loading, setLoading] = useState(false);
  const [addingId, setAddingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    setError(null);
    const timer = window.setTimeout(() => {
      void search(query, {
        market: market || undefined,
        instrumentType: instrumentType || undefined,
      }).then(setResults).catch(() => setError("目前無法取得標的清單，請稍後再試。")).finally(() => setLoading(false));
    }, 180);
    return () => window.clearTimeout(timer);
  }, [open, query, market, instrumentType, search]);

  if (!open) return null;

  const add = async (instrumentId: string) => {
    setAddingId(instrumentId);
    setError(null);
    try {
      await onAdd(instrumentId);
    } catch {
      setError("加入研究清單失敗，請稍後再試。");
    } finally {
      setAddingId(null);
    }
  };

  return (
    <div className={styles.dialogOverlay} onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section className={styles.dialog} role="dialog" aria-modal="true" aria-labelledby="add-instrument-title">
        <header>
          <div><span className="card-label">研究清單</span><h2 id="add-instrument-title">新增研究標的</h2><p>搜尋台灣上市、上櫃個股與 ETF。</p></div>
          <button className={styles.dialogClose} onClick={onClose} aria-label="關閉新增研究標的">×</button>
        </header>

        <div className={styles.searchControls}>
          <label className={styles.searchField}>
            <span>股票代號或名稱</span>
            <input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="例如：2330 或台積電" />
          </label>
          <label><span>市場</span><select value={market} onChange={(event) => setMarket(event.target.value as TaiwanMarket | "")}><option value="">全部市場</option><option value="上市">上市</option><option value="上櫃">上櫃</option></select></label>
          <label><span>類型</span><select value={instrumentType} onChange={(event) => setInstrumentType(event.target.value as ResearchInstrumentType | "")}><option value="">全部類型</option><option value="個股">個股</option><option value="ETF">ETF</option></select></label>
        </div>

        <div className={styles.searchResults} aria-live="polite">
          {loading && <div className={styles.dialogState}>正在搜尋標的…</div>}
          {!loading && error && <div className={`${styles.dialogState} ${styles.error}`}>{error}</div>}
          {!loading && !error && results.length === 0 && <div className={styles.dialogState}>找不到符合條件的標的，請調整關鍵字或篩選條件。</div>}
          {!loading && !error && results.map((instrument) => {
            const added = existingInstrumentIds.includes(instrument.id);
            return <article key={instrument.id} className={styles.searchResult}>
              <span className={styles.resultTicker}>{instrument.symbol}</span>
              <div><strong>{instrument.name}</strong><small>{instrument.market}・{instrument.instrumentType}・{instrument.category}</small></div>
              <Button variant="secondary" disabled={added || addingId === instrument.id} onClick={() => void add(instrument.id)}>{added ? "已加入" : addingId === instrument.id ? "加入中…" : "加入研究清單"}</Button>
            </article>;
          })}
        </div>

        <footer><p>加入清單不代表買進建議；完成資料整理後才顯示研究評估。</p><Button variant="secondary" onClick={onClose}>完成</Button></footer>
      </section>
    </div>
  );
}
