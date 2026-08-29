import type { ResearchCandidate } from "@shared/domain/investment";
import { Button } from "../../../components/ui/Button";
import { PageHeader } from "../../../components/layout/PageHeader";
import { useAppContext } from "../../../app/AppContext";
import type { ResearchCandidateRepository } from "../../../data/repositories/ResearchCandidateRepository";
import type { InvestmentData } from "../../../hooks/useInvestmentData";
import { useNewsCandidates } from "../hooks/useNewsCandidates";
import styles from "../NewsPage.module.css";

type NewsImpact = "論點影響" | "風險變化" | "重要觀察" | "產業脈絡" | "市場總經";

type NewsItem = {
  id: string;
  title: string;
  source: string;
  time: string;
  summary: string;
  impact: NewsImpact;
  target: string;
};

type NewsTarget = Pick<ResearchCandidate, "symbol" | "name" | "category"> & {
  directionTitle?: string;
};

function buildNewsItems(data: InvestmentData, researchCandidates: ResearchCandidate[], thesisObservation: string) {
  const thesisTarget = data.candidates.find((item) => item.id === data.thesis.instrumentId) ?? data.candidates[0];
  const primaryTarget = researchCandidates.find((item) => item.symbol === thesisTarget.symbol) ?? thesisTarget;
  const coveredTargets: NewsTarget[] = [
    primaryTarget,
    ...researchCandidates.filter((item) => item.symbol !== primaryTarget.symbol),
  ].slice(0, 3);
  const secondaryTarget = coveredTargets[1] ?? coveredTargets[0];
  const tertiaryTarget = coveredTargets[2] ?? secondaryTarget;
  const observation = thesisObservation.trim() || "尚未建立重要觀察條件";

  const items: NewsItem[] = [
    {
      id: "news-1",
      title: `${primaryTarget.name} 最新財報維持成長，但毛利率變化仍需觀察`,
      source: thesisTarget.sources[0]?.publisher ?? thesisTarget.category,
      time: `${thesisTarget.dataAsOf} 更新`,
      summary: "這項變化可能影響目前論點的重要假設，先確認影響範圍，再決定是否需要重新檢視。",
      impact: "論點影響",
      target: `${primaryTarget.symbol} ${primaryTarget.name}`,
    },
    {
      id: "news-2",
      title: `市場波動變化下，${secondaryTarget.name} 的配置角色需要重新確認`,
      source: "Demo 市場情境",
      time: "非即時資訊",
      summary: `這項示意訊號用來檢查 ${secondaryTarget.name} 是否仍符合原本的研究用途，不代表即時市場判斷。`,
      impact: "風險變化",
      target: `${secondaryTarget.symbol} ${secondaryTarget.name}`,
    },
    {
      id: "news-3",
      title: `${tertiaryTarget.directionTitle ?? tertiaryTarget.category} 出現值得持續研究的產業變化`,
      source: "Demo 產業情境",
      time: "非即時資訊",
      summary: `這項示意訊號對 ${tertiaryTarget.name} 的研究方向有關聯，可作為補充產業脈絡的起點。`,
      impact: "產業脈絡",
      target: `${tertiaryTarget.symbol} ${tertiaryTarget.name}`,
    },
    {
      id: "news-4",
      title: `若 ${observation}，請回來重新檢視目前判斷`,
      source: "心跳追蹤",
      time: "持續監控",
      summary: "這項內容來自使用者設定的追蹤條件，用來提示何時需要重新檢視，而不是外部新聞結論。",
      impact: "重要觀察",
      target: observation,
    },
    {
      id: "news-5",
      title: "利率與匯率變化可能影響金融與大型權值板塊",
      source: "Demo 總經情境",
      time: "非即時資訊",
      summary: "這項背景資訊不取代標的分析，只用來提醒整體市場風險偏好也可能影響研究判斷。",
      impact: "市場總經",
      target: "台股市場背景",
    },
  ];

  return { coveredTargets, items };
}

function NewsCard({ item, onOpen }: { item: NewsItem; onOpen: (item: NewsItem) => void }) {
  return (
    <article className={`card ${styles.newsCard}`}>
      <div className={styles.newsCardHead}>
        <span className={styles.newsBadge}>{item.impact}</span>
      </div>
      <h3>{item.title}</h3>
      <p>{item.summary}</p>
      <div className={styles.newsMeta}>
        <span>{item.source}</span>
        <span>{item.time}</span>
      </div>
      <div className={styles.newsTarget}>影響脈絡：{item.target}</div>
      <Button variant="text" onClick={() => onOpen(item)}>查看關聯分析 →</Button>
    </article>
  );
}

interface NewsPageProps {
  data: InvestmentData;
  repository: ResearchCandidateRepository;
}

export function NewsPage({ data, repository }: NewsPageProps) {
  const { navigate, thesisObservation, openAssistant } = useAppContext();
  const researchCandidates = useNewsCandidates(repository);
  const { coveredTargets, items } = buildNewsItems(data, researchCandidates, thesisObservation);

  const onOpen = (item: NewsItem) => {
    if (item.impact === "重要觀察") navigate("tracking");
    else if (item.impact === "產業脈絡") navigate("explore");
    else navigate("change");
  };

  return (
    <section className={styles.page}>
      <PageHeader
        eyebrow="新聞脈動"
        title="把新聞變成可追蹤的投資訊號"
        description="這裡不是一般財經新聞牆，而是把外部變化對應到目前正在研究的標的與追蹤條件。"
        action={<Button variant="secondary" onClick={() => openAssistant("請幫我整理今天最重要的新聞訊號")}>✦ 詢問 AI</Button>}
      />

      <article className={`card ${styles.hero}`}>
        <span className="card-label">今日摘要</span>
        <h2>整理 {coveredTargets.length} 個研究標的的關聯訊號</h2>
        <p>
          {coveredTargets.map((item) => `${item.symbol} ${item.name}`).join("、")}；依照與目前研究脈絡的關聯排序。
          本頁為競賽 Demo 固定資料，不是即時新聞。
        </p>
      </article>

      <div className={styles.newsFeed} aria-label="關聯新聞清單">
        {items.map((item) => <NewsCard key={item.id} item={item} onOpen={onOpen} />)}
      </div>
    </section>
  );
}
