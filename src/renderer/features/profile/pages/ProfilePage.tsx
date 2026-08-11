import type { InvestmentData } from "../../../hooks/useInvestmentData";
import { useAppContext } from "../../../app/AppContext";
import { PageHeader } from "../../../components/layout/PageHeader";
import { Button } from "../../../components/ui/Button";

export function ProfilePage({ data }: { data: InvestmentData }) {
  const { navigate, openAssistant } = useAppContext();
  return <section><PageHeader eyebrow="Screen 04–05｜投資風險與輪廓" title="看懂我的投資輪廓" description="這是條件摘要，不是能力排名或好壞評價。" action={<Button variant="secondary" onClick={() => navigate("onboarding")}>編輯我的條件</Button>} /><div className="profile-grid"><article className="card profile-hero"><div className="card-head"><div><span className="card-label">我的多維度特徵</span><h2>穩健成長型輪廓</h2></div><span className="status stable">Demo 完整</span></div><div className="profile-bars">{data.profile.dimensions.map((item) => <div key={item.label}><span>{item.label}</span><i><b style={{ width: `${item.value}%` }} /></i><strong>{item.value}</strong></div>)}</div><p>八年期限提供一定波動承受空間，但仍應保留彈性資金並限制成長部位集中度。</p></article><div className="profile-side"><article className="card"><span className="card-label">風險承受意願</span><h3>{data.profile.willingness}</h3><p>你願意承受的心理波動。</p></article><article className="card"><span className="card-label">風險承受能力</span><h3>{data.profile.capacity}</h3><p>期限與資金條件能承受的風險。</p></article><article className="card"><span className="card-label">所需風險</span><h3>{data.profile.required}</h3><p>達成目標可能需要承擔的程度。</p></article></div></div><div className="page-cta card"><div><span className="card-label">下一步</span><h3>把條件轉換為個人化投資規劃</h3></div><div><Button variant="ghost" onClick={() => openAssistant("請解釋我的三種風險")}>✦ 請 AI 解釋</Button><Button onClick={() => navigate("plan")}>查看我的投資規劃 →</Button></div></div></section>;
}
