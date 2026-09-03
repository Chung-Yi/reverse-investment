import { useAppContext } from "../../../app/AppContext";
import { PageHeader } from "../../../components/layout/PageHeader";
import { Button } from "../../../components/ui/Button";
import type { ImportantChangeReviewRepository } from "../../../data/repositories/ImportantChangeReviewRepository";
import type { InvestmentData } from "../../../hooks/useInvestmentData";
import { useImportantChangeReviews } from "../../../hooks/useImportantChangeReviews";
import { PlanOverview } from "../components/PlanOverview";
import { PlanResearchSuggestions } from "../components/PlanResearchSuggestions";

interface PlanPageProps {
  data: InvestmentData;
  reviewRepository: ImportantChangeReviewRepository;
}

export function PlanPage({ data, reviewRepository }: PlanPageProps) {
  const { navigate, openAssistant } = useAppContext();
  const { reviews } = useImportantChangeReviews(reviewRepository, { action: "updatePlan" });

  return (
    <section>
      <PageHeader
        eyebrow="規劃總覽"
        title="我的投資規劃"
        description="先看懂資金如何分配，再確認配置限制與重新檢視條件。"
        action={<Button variant="ghost" onClick={() => openAssistant("為什麼這樣規劃？")}>✦ 為什麼這樣規劃？</Button>}
      />
      <PlanOverview allocations={data.allocations} policy={data.planPolicy} />
      {reviews.length > 0 && (
        <section className="decision-update-log card">
          <span className="card-label">重要變化後的規劃補充</span>
          <h2>需要納入後續規劃的紀錄</h2>
          <ol>{reviews.map((review) => <li key={review.id}><div><strong>{review.instrument.symbol} {review.instrument.name}</strong><span>{new Date(review.createdAt).toLocaleString("zh-TW")}</span></div><p>{review.updatedValue}</p></li>)}</ol>
        </section>
      )}
      <PlanResearchSuggestions goalName={data.goal.name} suggestion={data.planResearchSuggestion} />
      <div className="page-cta card">
        <div><span className="card-label">下一步</span><h3>查看與研究方向相關的候選標的</h3></div>
        <Button onClick={() => navigate("explore")}>前往投資探索 →</Button>
      </div>
    </section>
  );
}
