import { useAppContext } from "../../../app/AppContext";
import { PageHeader } from "../../../components/layout/PageHeader";
import { Button } from "../../../components/ui/Button";
import { importantChangeSnapshot } from "../../../data/fixtures/demoInvestment";

export function TrackingPage() {
  const { navigate } = useAppContext();
  return <section><PageHeader eyebrow="心跳追蹤" title="只關注會影響判斷的重要變化" description="追蹤標的、原始假設與個人條件，不是單純盯著價格。" action={<Button variant="secondary" onClick={() => navigate("change")}>查看重要變化</Button>} /><article className="tracking-status card"><div className="pulse attention"><i /><span>注意</span></div><div><span className="card-label">目前狀態・資料截至 {importantChangeSnapshot.dataAsOf}</span><h2>有一項官方展望值得追蹤</h2><p>{importantChangeSnapshot.title}，尚不足以判定原始投資理由失效。</p></div></article><div className="section-title"><div><span>追蹤範圍</span><h2>三種脈絡一起看</h2></div></div><div className="three-cards"><article className="card monitoring"><span className="monitor-icon">標</span><h3>標的資訊</h3><p>營收、財報、估值、基本面與重要事件。</p><strong>1 項注意變化</strong></article><article className="card monitoring"><span className="monitor-icon">論</span><h3>投資理由</h3><p>關鍵假設、支持證據與觀察指標。</p><strong>2 項假設追蹤中</strong></article><article className="card monitoring"><span className="monitor-icon">我</span><h3>個人條件</h3><p>目標、期限、投入、輪廓與投資部位。</p><strong>目前沒有重要變化</strong></article></div><article className="severity-guide card"><span className="card-label">提醒層級</span><div><span className="severity info">資訊</span><p>值得知道，不影響原始假設</p></div><div><span className="severity attention">注意</span><p>可能影響部分假設，需要理解</p></div><div><span className="severity critical">重要</span><p>具有決策意義，需要重新檢視</p></div></article></section>;
}
