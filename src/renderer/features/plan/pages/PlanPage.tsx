import type { InvestmentData } from "../../../hooks/useInvestmentData";
import { useAppContext } from "../../../app/AppContext";
import { PageHeader } from "../../../components/layout/PageHeader";
import { Button } from "../../../components/ui/Button";
import { PlanOverview } from "../components/PlanOverview";
import { PlanResearchSuggestions } from "../components/PlanResearchSuggestions";

export function PlanPage({ data }: { data: InvestmentData }) {
  const { navigate, openAssistant } = useAppContext();
  return (
    <section>
      <PageHeader
        eyebrow="Screen 06｜我的投資規劃"
        title="我的投資規劃"
        description="先看懂資金如何分配，再確認配置限制與重新檢視條件。"
        action={<Button variant="ghost" onClick={() => openAssistant("為什麼這樣規劃？")}>✦ 為什麼這樣規劃？</Button>}
      />
      <PlanOverview allocations={data.allocations} policy={data.planPolicy} />
      <PlanResearchSuggestions goalName={data.goal.name} suggestion={data.planResearchSuggestion} onNavigate={navigate} />
      <div className="page-cta card">
        <div><span className="card-label">下一步</span><h3>從 AI 研究起點出發，驗證方向與候選標的</h3></div>
        <Button onClick={() => navigate("explore")}>探索投資方向 →</Button>
      </div>
    </section>
  );
}
