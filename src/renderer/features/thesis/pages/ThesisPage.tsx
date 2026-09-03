import { describeAssessmentScore } from "@shared/domain/assessment";
import { useAppContext } from "../../../app/AppContext";
import { PageHeader } from "../../../components/layout/PageHeader";
import { Button } from "../../../components/ui/Button";
import type { ImportantChangeReviewRepository } from "../../../data/repositories/ImportantChangeReviewRepository";
import type { InvestmentData } from "../../../hooks/useInvestmentData";
import { useImportantChangeReviews } from "../../../hooks/useImportantChangeReviews";

interface ThesisPageProps {
  data: InvestmentData;
  reviewRepository: ImportantChangeReviewRepository;
}

export function ThesisPage({ data, reviewRepository }: ThesisPageProps) {
  const { navigate } = useAppContext();
  const { reviews } = useImportantChangeReviews(reviewRepository, { action: "updateThesis" });
  const instrument = data.candidates.find((item) => item.id === data.thesis.instrumentId) ?? data.candidates[0];
  const latestPrimaryUpdate = reviews.find((review) => review.thesisId === data.thesis.id);
  const displayedReason = latestPrimaryUpdate?.updatedValue ?? data.thesis.reason;
  const updatedAt = latestPrimaryUpdate ? new Date(latestPrimaryUpdate.createdAt).toLocaleDateString("zh-TW") : data.thesis.updatedAt;

  return (
    <section>
      <PageHeader
        eyebrow="我的論點卡"
        title="保存的是你的判斷，不是買賣訊號"
        description="把正方意見、反方意見、綜合評述與風險評估整理成可持續更新的內容。"
        action={<Button variant="secondary" onClick={() => navigate("decision")}>編輯論點</Button>}
      />
      <article className="card thesis-card">
        <div className="card-head">
          <div><span className="card-label">{instrument.symbol}・{instrument.name}</span><h2>{displayedReason}</h2></div>
          <span className="status stable">{data.thesis.status}</span>
        </div>
        <div className="dual-score">
          <div><span>標的成立度</span><strong>{data.thesis.validityScore}/100</strong><small>{describeAssessmentScore(data.thesis.validityScore)}・標的本身</small></div>
          <div><span>個人適合度</span><strong>{data.thesis.suitabilityScore}/100</strong><small>{describeAssessmentScore(data.thesis.suitabilityScore)}・與我的規劃</small></div>
        </div>
        <p className="data-note">論點更新：{updatedAt}・財務資料截至：{instrument.dataAsOf}</p>
      </article>
      <div className="thesis-anatomy">
        <article className="card"><h3>正方意見</h3><ul>{instrument.evidence.map((item) => <li key={item}>{item}</li>)}</ul></article>
        <article className="card"><h3>反方意見</h3><ul>{instrument.counterEvidence.map((item) => <li key={item}>{item}</li>)}</ul></article>
        <article className="card"><h3>綜合評述</h3><ul>{instrument.assumptions.map((item) => <li key={item}>{item}</li>)}</ul></article>
        <article className="card"><h3>風險評估</h3><p>若單季毛利率低於自行設定的 60% 門檻，或先進製程營收占比連續兩季下降，重新檢視。</p></article>
      </div>
      {reviews.length > 0 && (
        <section className="decision-update-log card">
          <span className="card-label">重要變化後的論點更新</span>
          <h2>保留每次修改的原因與時間</h2>
          <ol>{reviews.map((review) => <li key={review.id}><div><strong>{review.instrument.symbol} {review.instrument.name}</strong><span>{new Date(review.createdAt).toLocaleString("zh-TW")}</span></div><p>{review.updatedValue}</p><small>來源事件：{review.eventTitle || "關聯事件"}</small></li>)}</ol>
        </section>
      )}
      <div className="page-cta card"><div><span className="card-label">下一步</span><h3>讓論點進入心跳追蹤</h3></div><Button onClick={() => navigate("tracking")}>查看追蹤狀態 →</Button></div>
    </section>
  );
}
