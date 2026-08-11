import type { InvestmentData } from "../../../hooks/useInvestmentData";
import { useAppContext } from "../../../app/AppContext";
import { PageHeader } from "../../../components/layout/PageHeader";
import { Button } from "../../../components/ui/Button";

export function ThesisPage({ data }: { data: InvestmentData }) {
  const { navigate } = useAppContext();
  const instrument = data.candidates.find((item) => item.id === data.thesis.instrumentId) ?? data.candidates[0];
  return <section><PageHeader eyebrow="Screen 13｜我的論點卡" title="保存的是你的判斷，不是買賣訊號" description="把理由、證據、假設與觀察條件整理成可持續更新的內容。" action={<Button variant="secondary" onClick={() => navigate("decision")}>編輯論點</Button>} /><article className="card thesis-card"><div className="card-head"><div><span className="card-label">{instrument.symbol}・{instrument.name}</span><h2>{data.thesis.reason}</h2></div><span className="status stable">{data.thesis.status}</span></div><div className="dual-score"><div><span>標的成立度</span><strong>{data.thesis.validityScore}</strong><small>Demo 評估・標的本身</small></div><div><span>個人適合度</span><strong>{data.thesis.suitabilityScore}</strong><small>Demo 評估・與我的規劃</small></div></div><p className="data-note">論點更新：{data.thesis.updatedAt}・財務資料截至：{instrument.dataAsOf}</p></article><div className="thesis-anatomy"><article className="card"><b>01</b><h3>支持證據</h3><ul>{instrument.evidence.map((item) => <li key={item}>{item}</li>)}</ul></article><article className="card"><b>02</b><h3>不同觀點</h3><ul>{instrument.counterEvidence.map((item) => <li key={item}>{item}</li>)}</ul></article><article className="card"><b>03</b><h3>關鍵假設</h3><ul>{instrument.assumptions.map((item) => <li key={item}>{item}</li>)}</ul></article><article className="card"><b>04</b><h3>觀察條件</h3><p>若單季毛利率低於自行設定的 60% 門檻，或先進製程營收占比連續兩季下降，重新檢視。</p></article></div><div className="page-cta card"><div><span className="card-label">下一步</span><h3>讓論點進入心跳追蹤</h3></div><Button onClick={() => navigate("tracking")}>查看追蹤狀態 →</Button></div></section>;
}
