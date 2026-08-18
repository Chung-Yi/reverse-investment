import { useAppContext } from "../../../app/AppContext";
import { Button } from "../../../components/ui/Button";

export function WelcomePage() {
  const { navigate } = useAppContext();
  return <section className="welcome-grid"><div className="welcome-copy"><span className="eyebrow">歡迎使用逆思投資</span><h1>從你的目標開始，<br />建立屬於你的投資規劃。</h1><p className="lead">先理解自己的條件，再探索方向、驗證理由，持續掌握真正重要的變化。</p><Button onClick={() => navigate("onboarding")}>開始建立我的目標 →</Button><p className="fine-print">不是從商品開始，也不替你做投資決定。</p></div><div className="journey-card"><span className="card-label">完整決策旅程</span><div className="journey-center"><span>你的目標</span><strong>理解自己</strong></div><ol><li><b>01</b><span>建立輪廓<small>條件與風險</small></span></li><li><b>02</b><span>形成規劃<small>目標與配置</small></span></li><li><b>03</b><span>驗證決策<small>理由與證據</small></span></li><li><b>04</b><span>持續追蹤<small>假設與變化</small></span></li></ol></div></section>;
}
