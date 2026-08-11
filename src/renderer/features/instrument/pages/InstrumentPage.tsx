import type { InvestmentData } from "../../../hooks/useInvestmentData";
import { useAppContext } from "../../../app/AppContext";
import { PageHeader } from "../../../components/layout/PageHeader";
import { Button } from "../../../components/ui/Button";

export function InstrumentPage({ data }: { data: InvestmentData }) {
  const instrument = data.candidates[0];
  const { navigate, openAssistant } = useAppContext();
  return <section><PageHeader eyebrow="Screen 09｜標的詳細分析" title={instrument.name} description="由核心摘要逐步深入到證據、不同觀點與關鍵假設。" action={<><Button variant="ghost" onClick={() => openAssistant("請解釋這個標的")}>✦ 詢問 AI</Button><Button onClick={() => navigate("decision")}>開始決策驗證 →</Button></>} /><article className="instrument-hero card"><div><span className="card-label">核心摘要</span><h2>{instrument.summary}</h2><p>以下內容均為競賽 Demo fixture，不代表任何真實金融商品。</p></div><div className="data-quality"><span>資料狀態</span><strong>固定假資料</strong><small>更新：2026-08-08</small></div></article><div className="metric-grid">{instrument.metrics.map((metric) => <article className="card" key={metric.label}><span>{metric.label}</span><strong>{metric.value}</strong><small>{metric.note}</small></article>)}</div><div className="analysis-sections"><details className="card" open><summary><span><b>01</b>支持證據</span><i>＋</i></summary><ul>{instrument.evidence.map((item) => <li key={item}>{item}</li>)}</ul></details><details className="card"><summary><span><b>02</b>不同觀點</span><i>＋</i></summary><ul>{instrument.counterEvidence.map((item) => <li key={item}>{item}</li>)}</ul></details><details className="card"><summary><span><b>03</b>關鍵假設</span><i>＋</i></summary><ul>{instrument.assumptions.map((item) => <li key={item}>{item}</li>)}</ul></details></div></section>;
}
