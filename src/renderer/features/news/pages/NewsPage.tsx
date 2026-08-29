import { Button } from "../../../components/ui/Button";
import { PageHeader } from "../../../components/layout/PageHeader";
import { useAppContext } from "../../../app/AppContext";
import type { InvestmentData } from "../../../hooks/useInvestmentData";

type NewsImpact = "正方意見" | "反方意見" | "重要觀察" | "產業脈絡" | "市場總經";

type NewsItem = {
  id: string;
  title: string;
  source: string;
  time: string;
  summary: string;
  impact: NewsImpact;
  target: string;
  tag: string;
};

function buildNewsItems(data: InvestmentData, thesisObservation: string) {
  const target = data.candidates.find((item: InvestmentData["candidates"][number]) => item.id === data.thesis.instrumentId) ?? data.candidates[0];
  const direction = data.planResearchSuggestion.directions[0] ?? data.planResearchSuggestion.directions[data.planResearchSuggestion.directions.length - 1];
  const directionName = direction?.title ?? "目前研究方向";
  const directionLabel = direction?.category ?? "投資方向";
  const observation = thesisObservation.trim() || "尚未建立重要觀察條件";

  const items: NewsItem[] = [
    {
      id: "news-1",
      title: `${target.name} 最新財報維持成長，但毛利率變化仍需觀察`,
      source: target.sources[0]?.publisher ?? target.category,
      time: `${target.dataAsOf} 更新`,
      summary: `這則新聞會直接影響目前論點，適合回到標的分析頁檢視正反方意見。`,
      impact: "正方意見",
      target: `${target.symbol} ${target.name}`,
      tag: "我的標的",
    },
    {
      id: "news-2",
      title: `${directionName} 相關產業出現資金輪動，市場關注度升高`,
      source: "市場盤勢整理",
      time: "今日更新",
      summary: `這則新聞對探索頁的研究方向有直接關聯，可用來補強產業脈絡。`,
      impact: "產業脈絡",
      target: directionLabel,
      tag: "探索方向",
    },
    {
      id: "news-3",
      title: `若 ${observation}，請回來重新檢視目前判斷`,
      source: "心跳追蹤",
      time: "持續監控",
      summary: `這則內容來自追蹤條件，代表使用者已設定要回來重新看一次的時點。`,
      impact: "重要觀察",
      target: observation,
      tag: "追蹤條件",
    },
    {
      id: "news-4",
      title: "利率與匯率變化仍可能影響金融與大型權值板塊",
      source: "總經觀察",
      time: "今日更新",
      summary: "可作為背景資訊，不直接取代標的分析，但會影響整體市場風險偏好。",
      impact: "市場總經",
      target: "台股大盤",
      tag: "市場脈動",
    },
    {
      id: "news-5",
      title: `${target.name} 相關競爭對手消息，可能對反方意見形成補充`,
      source: "同業動態",
      time: "最新整理",
      summary: "這類新聞最適合放在反方意見區，提醒使用者別只看支持面。",
      impact: "反方意見",
      target: `${target.symbol} ${target.name}`,
      tag: "論點更新",
    },
  ];

  return { target, items };
}

function NewsCard({ item, onOpen }: { item: NewsItem; onOpen: (item: NewsItem) => void }) {
  return (
    <article className={`card news-card ${item.impact.replaceAll("意見", "").replaceAll(" ", "-")}`}>
      <div className="news-card-head">
        <span className="news-badge">{item.impact}</span>
        <small>{item.tag}</small>
      </div>
      <h3>{item.title}</h3>
      <p>{item.summary}</p>
      <div className="news-meta">
        <span>{item.source}</span>
        <span>{item.time}</span>
      </div>
      <div className="news-target">影響脈絡：{item.target}</div>
      <Button variant="text" onClick={() => onOpen(item)}>查看關聯分析 →</Button>
    </article>
  );
}

function groupTitle(impact: NewsImpact) {
  return {
    正方意見: "支持目前論點的新聞",
    反方意見: "需要留意的反向訊號",
    重要觀察: "會觸發回來檢視的事件",
    產業脈絡: "和研究方向有關的產業新聞",
    市場總經: "市場與總體經濟背景",
  }[impact];
}

export function NewsPage({ data }: { data: InvestmentData }) {
  const { navigate, thesisObservation, openAssistant } = useAppContext();
  const { target, items } = buildNewsItems(data, thesisObservation);

  const onOpen = (item: NewsItem) => {
    if (item.impact === "重要觀察") navigate("tracking");
    else if (item.impact === "正方意見" || item.impact === "反方意見") navigate("thesis");
    else if (item.impact === "產業脈絡") navigate("explore");
    else navigate("change");
  };

  return (
    <section className="news-page">
      <PageHeader
        eyebrow="新聞脈動"
        title="把新聞變成可追蹤的投資訊號"
        description="這裡不是一般財經新聞牆，而是會對應到探索、論點卡與心跳追蹤的研究脈絡。"
        action={<Button variant="secondary" onClick={() => openAssistant("請幫我整理今天最重要的新聞訊號")}>✦ 詢問 AI</Button>}
      />

      <article className="card news-hero">
        <div>
          <span className="card-label">今日摘要</span>
          <h2>圍繞 {target.symbol}・{target.name}，先看最重要的 3 則訊號</h2>
          <p>使用者正在研究、追蹤與建立論點的內容，會自動優先排在前面。</p>
        </div>
        <div className="news-hero-stats">
          <div><strong>5</strong><span>則新聞</span></div>
          <div><strong>3</strong><span>個連動模組</span></div>
          <div><strong>1</strong><span>個追蹤條件</span></div>
        </div>
      </article>

      <div className="news-layout">
        <div className="news-main">
          {(["正方意見", "反方意見", "重要觀察", "產業脈絡", "市場總經"] as NewsImpact[]).map((impact) => (
            <section key={impact} className="news-group">
              <div className="card-head">
                <div>
                  <span className="card-label">{impact}</span>
                  <h3>{groupTitle(impact)}</h3>
                </div>
              </div>
              <div className="news-grid">
                {items.filter((item) => item.impact === impact).map((item) => <NewsCard key={item.id} item={item} onOpen={onOpen} />)}
              </div>
            </section>
          ))}
        </div>

        <aside className="news-side">
          <article className="card news-panel">
            <span className="card-label">連動來源</span>
            <h3>探索 → 論點卡 → 心跳追蹤</h3>
            <ul>
              <li>探索頁帶出研究方向與候選標的</li>
              <li>論點卡用新聞更新正反方與風險評估</li>
              <li>心跳追蹤用新聞觸發回來重看</li>
            </ul>
          </article>
          <article className="card news-panel">
            <span className="card-label">篩選視角</span>
            <h3>先看這四種新聞</h3>
            <ul>
              <li>我的標的</li>
              <li>探索方向</li>
              <li>重要觀察</li>
              <li>市場總經</li>
            </ul>
          </article>
        </aside>
      </div>
    </section>
  );
}
