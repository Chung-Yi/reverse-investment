import { useMemo } from "react";
import type { NewsEvent } from "@shared/domain/news";
import { Button } from "../../../components/ui/Button";
import { PageHeader } from "../../../components/layout/PageHeader";
import { useAppContext } from "../../../app/AppContext";
import type { NewsRepository } from "../../../data/repositories/NewsRepository";
import type { ResearchCandidateRepository } from "../../../data/repositories/ResearchCandidateRepository";
import type { InvestmentData } from "../../../hooks/useInvestmentData";
import { useNewsCandidates } from "../hooks/useNewsCandidates";
import { useNewsFeed } from "../hooks/useNewsFeed";
import styles from "../NewsPage.module.css";

function NewsCard({ item, onOpen }: { item: NewsEvent; onOpen: (item: NewsEvent) => void }) {
  return (
    <article className={`card ${styles.newsCard}`}>
      <div className={styles.newsCardHead}>
        <span className={styles.newsBadge}>{item.impact}</span>
      </div>
      <h3>{item.title}</h3>
      <p>{item.summary}</p>
      <div className={styles.newsMeta}>
        <span>{item.source}</span>
        <span>{item.updateLabel}</span>
      </div>
      <div className={styles.newsTarget}>影響脈絡：{item.affectedContext}</div>
      <Button variant="text" onClick={() => onOpen(item)}>查看關聯分析 →</Button>
    </article>
  );
}

interface NewsPageProps {
  data: InvestmentData;
  candidateRepository: ResearchCandidateRepository;
  newsRepository: NewsRepository;
}

export function NewsPage({ data, candidateRepository, newsRepository }: NewsPageProps) {
  const { navigate, thesisObservation, openAssistant } = useAppContext();
  const researchCandidates = useNewsCandidates(candidateRepository);
  const primaryInstrument = data.candidates.find((item) => item.id === data.thesis.instrumentId) ?? data.candidates[0];
  const newsRequest = useMemo(() => ({ primaryInstrument, researchCandidates, thesisObservation }), [primaryInstrument, researchCandidates, thesisObservation]);
  const { feed, error } = useNewsFeed(newsRepository, newsRequest);

  const onOpen = (item: NewsEvent) => {
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
        <span className="card-label">研究摘要 · {feed?.dataStatus ?? "資料整理中"}</span>
        <h2>整理研究標的的關聯訊號</h2>
        {error ? <p role="alert">{error}</p> : (
          <p>
            {feed?.instruments.map((item) => `${item.symbol} ${item.name}`).join("、") || "正在整理研究清單"}；
            依照與目前研究脈絡的關聯排序，資料來源與更新狀態標示於各則內容。
          </p>
        )}
      </article>

      <div className={styles.newsFeed} aria-label="關聯新聞清單">
        {feed?.events.map((item) => <NewsCard key={item.id} item={item} onOpen={onOpen} />)}
      </div>
    </section>
  );
}
