import { describeAssessmentScore } from "@shared/domain/assessment";
import type { ResearchCandidate } from "@shared/domain/investment";
import { useAppContext } from "../../../app/AppContext";
import { PageHeader } from "../../../components/layout/PageHeader";
import { Button } from "../../../components/ui/Button";
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
    : selectedCandidate ? undefined : data.candidates[0];
  const name = selectedCandidate?.name ?? detailedInstrument?.name;
  const symbol = selectedCandidate?.symbol ?? detailedInstrument?.symbol;

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
        action={<><Button variant="ghost" onClick={askAi}>✦ 詢問 AI</Button>{detailedInstrument && <Button onClick={() => navigate("decision")}>開始決策驗證 →</Button>}</>}
      />

      <article className="instrument-hero card">
        <div>
          <span className="card-label">研究摘要</span>
          <h2>{detailedInstrument?.summary ?? selectedCandidate?.rationale}</h2>
          {detailedInstrument ? (
            <p className="source-note">資料來源：{detailedInstrument.sources.length > 0 ? detailedInstrument.sources.map((source, index) => <span key={source.url}>{index > 0 && "、"}<a href={source.url} target="_blank" rel="noreferrer">{source.publisher}・{source.title}</a>（發布：{source.publishedAt}）</span>) : "尚未提供"}。內容用於研究與決策整理，不構成投資建議。</p>
          ) : (
            <p className="source-note">對應方向：{selectedCandidate?.directionTitle ?? "尚未指定"}。內容用於研究與決策整理，不構成投資建議。</p>
          )}
        </div>
        <div className="data-quality">
          <span>資料狀態</span>
          <strong>{detailedInstrument?.dataStatus ?? "初步資料已整理"}</strong>
          <small>{detailedInstrument ? `資料截至：${detailedInstrument.dataAsOf}` : `${selectedCandidate?.market}・${selectedCandidate?.instrumentType}・${selectedCandidate?.category}`}</small>
        </div>
      </article>

      {selectedCandidate?.researchFit !== undefined && selectedCandidate.suitability !== undefined && (
        <div className={styles.assessmentGrid}>
          <article className="card"><span>研究條件符合度</span><strong>{selectedCandidate.researchFit}/100</strong><small>{describeAssessmentScore(selectedCandidate.researchFit)}</small></article>
          <article className="card"><span>個人初步適合度</span><strong>{selectedCandidate.suitability}/100</strong><small>{describeAssessmentScore(selectedCandidate.suitability)}</small></article>
        </div>
      )}

      {detailedInstrument ? (
        <>
          <div className="metric-grid">{detailedInstrument.metrics.map((metric) => <article className="card" key={metric.label}><span>{metric.label}</span><strong>{metric.value}</strong><small>{metric.note}</small></article>)}</div>
          <div className="analysis-sections">
            <details className="card" open><summary><span>支持證據</span><i>＋</i></summary><ul>{detailedInstrument.evidence.map((item) => <li key={item}>{item}</li>)}</ul></details>
            <details className="card"><summary><span>不同觀點</span><i>＋</i></summary><ul>{detailedInstrument.counterEvidence.map((item) => <li key={item}>{item}</li>)}</ul></details>
            <details className="card"><summary><span>關鍵假設</span><i>＋</i></summary><ul>{detailedInstrument.assumptions.map((item) => <li key={item}>{item}</li>)}</ul></details>
          </div>
        </>
      ) : (
        <article className={`card ${styles.availableAnalysis}`}>
          <span className="card-label">目前可查看的內容</span>
          <h2>先從研究摘要與個人關聯開始</h2>
          <p>財務資料、支持證據、不同觀點與關鍵假設，會在取得可驗證來源後顯示。資料完整前不會進入決策驗證。</p>
          <Button variant="secondary" onClick={askAi}>✦ 請 AI 解釋目前資訊</Button>
        </article>
      )}
    </section>
  );
}
