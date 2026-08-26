import { describeAssessmentScore } from "@shared/domain/assessment";
import type { ResearchCandidate } from "@shared/domain/investment";
import { useAppContext } from "../../../app/AppContext";
import { PageHeader } from "../../../components/layout/PageHeader";
import { Button } from "../../../components/ui/Button";
import { demoCandidateAnalysis } from "../../../data/fixtures/instrumentCatalog";
import type { InvestmentData } from "../../../hooks/useInvestmentData";
import styles from "../InstrumentPage.module.css";

interface InstrumentPageProps {
  data: InvestmentData;
  selectedCandidate: ResearchCandidate | null;
}

export function InstrumentPage({ data, selectedCandidate }: InstrumentPageProps) {
  const { navigate, openAssistant } = useAppContext();
  const detailedInstrument = selectedCandidate?.instrumentId
    ? data.candidates.find((instrument) => instrument.id === selectedCandidate.instrumentId)
    : undefined;
  const candidateAnalysis = selectedCandidate ? demoCandidateAnalysis[selectedCandidate.id] : undefined;
  const name = selectedCandidate?.name ?? detailedInstrument?.name;
  const symbol = selectedCandidate?.symbol ?? detailedInstrument?.symbol;
  const researchFit = selectedCandidate?.researchFit ?? candidateAnalysis?.researchFit;
  const suitability = selectedCandidate?.suitability ?? candidateAnalysis?.suitability;
  const positivePoints = detailedInstrument?.evidence ?? (selectedCandidate ? [
    selectedCandidate.rationale,
    selectedCandidate.directionTitle ? `對應方向：${selectedCandidate.directionTitle}` : "對應方向尚未指定。",
  ] : []);
  const negativePoints = detailedInstrument?.counterEvidence ?? (selectedCandidate ? [
    selectedCandidate.directionTitle ? `若 ${selectedCandidate.directionTitle} 的產業循環轉弱，需重新檢查。` : "需在取得完整資料後再補充。",
    "單一標的不應直接代表整體投資結論。",
  ] : []);
  const summaryPoints = detailedInstrument?.assumptions ?? (selectedCandidate ? [
    "把支持與反方意見一起看，避免只保留單邊資訊。",
    "若關鍵條件變化，需重新檢查目前評述。",
  ] : []);
  const riskPoints = selectedCandidate ? [
    selectedCandidate.directionTitle ? `產業風險：${selectedCandidate.directionTitle} 相關循環與景氣變化。` : "產業風險：需等待方向補齊後判斷。",
    "配置風險：單一標的與既有部位集中度。",
    "資料風險：可驗證來源的完整性、更新頻率與交叉比對程度仍需持續確認。",
  ] : [];

  if (!name || !symbol) {
    return <section><PageHeader eyebrow="標的分析" title="目前無法顯示此標的" description="請返回候選研究標的，重新選擇想查看的標的。" /></section>;
  }

  const askAi = () => openAssistant(`請解釋 ${name}（${symbol}）的研究摘要與它和我的規劃有什麼關係。`);

  return (
    <section>
      <PageHeader
        eyebrow="標的分析"
        title={`${name}（${symbol}）`}
        description="先看研究摘要與個人關聯，再依可用資料深入檢查。"
        action={<><Button variant="ghost" onClick={askAi}>✦ 詢問 AI</Button><Button onClick={() => navigate("decision")}>開始決策驗證 →</Button></>}
      />

      <article className="instrument-hero card">
        <div>
          <span className="card-label">研究摘要</span>
          <h2>{detailedInstrument?.summary ?? selectedCandidate?.rationale}</h2>
          <p className="source-note">
            {detailedInstrument ? (
              <>資料來源：{detailedInstrument.sources.length > 0 ? detailedInstrument.sources.map((source, index) => <span key={source.url}>{index > 0 && "、"}<a href={source.url} target="_blank" rel="noreferrer">{source.publisher}・{source.title}</a>（發布：{source.publishedAt}）</span>) : "尚未提供"}。</>
            ) : (
              <>對應方向：{selectedCandidate?.directionTitle ?? "尚未指定"}。</>
            )}
            內容用於研究與決策整理，不構成投資建議。
          </p>
        </div>
        <div className="data-quality">
          <span>資料狀態</span>
          <strong>{detailedInstrument?.dataStatus ?? "初步資料已整理"}</strong>
          <small>{detailedInstrument ? `資料截至：${detailedInstrument.dataAsOf}` : `${selectedCandidate?.market}・${selectedCandidate?.instrumentType}・${selectedCandidate?.category}`}</small>
        </div>
      </article>

      <div className={styles.assessmentGrid}>
        <article className="card">
          <span>研究條件符合度</span>
          <strong>{researchFit ?? "待補充"}</strong>
          <small>{researchFit !== undefined ? `${describeAssessmentScore(researchFit)}｜看這支標的本身是否值得研究` : "資料完整後顯示"}</small>
        </article>
        <article className="card">
          <span>個人初步適合度</span>
          <strong>{suitability ?? "待補充"}</strong>
          <small>{suitability !== undefined ? `${describeAssessmentScore(suitability)}｜看這支標的是否符合你的條件` : "資料完整後顯示"}</small>
        </article>
      </div>

      <div className={styles.opinionGrid}>
        <details className={`${styles.opinionCard} ${styles.positive}`} open>
          <summary><span>正方意見</span><i>＋</i></summary>
          <p className="section-note">支持這支標的的主要理由。</p>
          <ul>{positivePoints.map((item) => <li key={item}>{item}</li>)}</ul>
        </details>
        <details className={`${styles.opinionCard} ${styles.negative}`}>
          <summary><span>反方意見</span><i>＋</i></summary>
          <p className="section-note">需要保留、也需要注意的反面觀點。</p>
          <ul>{negativePoints.map((item) => <li key={item}>{item}</li>)}</ul>
        </details>
        <details className={`${styles.opinionCard} ${styles.summary}`}>
          <summary><span>綜合評述</span><i>＋</i></summary>
          <p className="section-note">統整正反方論點後，形成目前的整體判斷。</p>
          <ul>{summaryPoints.map((item) => <li key={item}>{item}</li>)}</ul>
        </details>
        <details className={`${styles.opinionCard} ${styles.risk}`}>
          <summary><span>風險評估</span><i>＋</i></summary>
          <p className="section-note">這支標的目前最需要注意的風險與觀察重點。</p>
          <ul>{riskPoints.map((item) => <li key={item}>{item}</li>)}</ul>
        </details>
      </div>
    </section>
  );
}
