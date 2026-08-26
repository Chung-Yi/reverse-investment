import { useMemo, useState } from "react";
import { describeAssessmentScore } from "@shared/domain/assessment";
import type { InvestmentData } from "../../../hooks/useInvestmentData";
import { useAppContext } from "../../../app/AppContext";
import { PageHeader } from "../../../components/layout/PageHeader";
import { Button } from "../../../components/ui/Button";

const steps = ["正方意見", "反方意見", "綜合評述", "風險評估", "重要觀察"] as const;

function toggleSelection(items: string[], item: string) {
  return items.includes(item) ? items.filter((value) => value !== item) : [...items, item];
}

export function DecisionPage({ data }: { data: InvestmentData }) {
  const { navigate, openAssistant, saveThesisObservation } = useAppContext();
  const instrument = data.candidates.find((item) => item.id === data.thesis.instrumentId) ?? data.candidates[0];
  const [activeStep, setActiveStep] = useState(0);
  const [reason, setReason] = useState(data.thesis.reason);
  const [selectedEvidence, setSelectedEvidence] = useState<string[]>([]);
  const [selectedCounterEvidence, setSelectedCounterEvidence] = useState<string[]>([]);
  const [selectedAssumptions, setSelectedAssumptions] = useState<string[]>([]);
  const [riskAssessment, setRiskAssessment] = useState("");
  const [observation, setObservation] = useState("");
  const [scored, setScored] = useState(false);

  const completed = useMemo(
    () => [
      reason.trim().length >= 20,
      selectedCounterEvidence.length > 0,
      selectedAssumptions.length > 0,
      riskAssessment.trim().length >= 8,
      observation.trim().length >= 8,
    ],
    [reason, selectedCounterEvidence, selectedAssumptions, riskAssessment, observation],
  );
  const allComplete = completed.every(Boolean);
  const firstIncomplete = completed.findIndex((value) => !value);
  const highestUnlockedStep = firstIncomplete === -1 ? steps.length - 1 : firstIncomplete;
  const completedCount = completed.filter(Boolean).length;

  const changeReason = (value: string) => { setReason(value); setScored(false); };
  const changeEvidence = (item: string) => { setSelectedEvidence((current) => toggleSelection(current, item)); setScored(false); };
  const changeCounterEvidence = (item: string) => { setSelectedCounterEvidence((current) => toggleSelection(current, item)); setScored(false); };
  const changeAssumption = (item: string) => { setSelectedAssumptions((current) => toggleSelection(current, item)); setScored(false); };
  const changeRiskAssessment = (value: string) => { setRiskAssessment(value); setScored(false); };
  const changeObservation = (value: string) => { setObservation(value); saveThesisObservation(value); setScored(false); };

  const goNext = () => {
    if (completed[activeStep] && activeStep < steps.length - 1) setActiveStep((current) => current + 1);
  };

  const renderStep = () => {
    if (activeStep === 0) {
      return <div className="step-panel" role="tabpanel" aria-label="正方意見"><span className="card-label">步驟 1｜正方意見</span><h2>支持這支標的的主要理由是什麼？</h2><p>請先用自己的話說明，AI 只能協助整理，不能替你產生立場。</p><label className="field-label" htmlFor="reason">正方意見</label><textarea id="reason" value={reason} onChange={(event) => changeReason(event.target.value)} /><div className="field-status"><span>{reason.trim().length} 字</span><strong className={completed[0] ? "complete" : ""}>{completed[0] ? "✓ 已達最低完整度" : "至少輸入 20 個字"}</strong></div></div>;
    }

    if (activeStep === 1) {
      return <div className="step-panel" role="tabpanel" aria-label="反方意見"><span className="card-label">步驟 2｜反方意見</span><h2>有哪些反面觀點需要一起看？</h2><p>這不是為了否定前一步，而是避免只保留支持自己的資訊。</p><div className="selection-list">{instrument.counterEvidence.map((item) => <label className={selectedCounterEvidence.includes(item) ? "selected" : ""} key={item}><input type="checkbox" checked={selectedCounterEvidence.includes(item)} onChange={() => changeCounterEvidence(item)} /><span><strong>{item}</strong><small>{instrument.sources[0]?.publisher ?? instrument.dataStatus}・資料截至 {instrument.dataAsOf}</small></span></label>)}</div></div>;
    }

    if (activeStep === 2) {
      return <div className="step-panel" role="tabpanel" aria-label="綜合評述"><span className="card-label">步驟 3｜綜合評述</span><h2>統整正反方意見後，怎麼看這支標的？</h2><p>把支持與反面的內容一起整理，形成目前的整體判斷。</p><div className="selection-list">{instrument.assumptions.map((item) => <label className={selectedAssumptions.includes(item) ? "selected" : ""} key={item}><input type="checkbox" checked={selectedAssumptions.includes(item)} onChange={() => changeAssumption(item)} /><span><strong>{item}</strong><small>選取代表已納入後續評估</small></span></label>)}</div></div>;
    }

    if (activeStep === 3) {
      return <div className="step-panel" role="tabpanel" aria-label="風險評估"><span className="card-label">步驟 4｜風險評估</span><h2>這支標的目前最需要注意什麼？</h2><p>把最重要的風險整理清楚，避免後續只看到正面資訊。</p><label className="field-label" htmlFor="risk-assessment">風險評估</label><textarea id="risk-assessment" value={riskAssessment} onChange={(event) => changeRiskAssessment(event.target.value)} placeholder="例如：若需求循環轉弱或估值回落，需重新檢視目前判斷。" /><div className="field-status"><span>{riskAssessment.trim().length} 字</span><strong className={completed[3] ? "complete" : ""}>{completed[3] ? "✓ 已完成風險評估" : "至少輸入 8 個字"}</strong></div></div>;
    }

    return <div className="step-panel" role="tabpanel" aria-label="重要觀察"><span className="card-label">步驟 5｜重要觀察</span><h2>發生什麼變化時，你需要重新檢視？</h2><p>請把觀察指標寫成具體條件，而不是只寫「市場變差」。下列門檻是使用者自行設定，不是公司預測。</p><div className="suggested-observations"><button type="button" onClick={() => changeObservation("若單季毛利率低於 60%，重新檢視獲利能力假設。")}>＋ 使用毛利率門檻</button><button type="button" onClick={() => changeObservation("若先進製程營收占比連續兩季下降，重新檢視需求假設。")}>＋ 使用製程占比條件</button></div><label className="field-label" htmlFor="observation">重要觀察條件</label><textarea id="observation" value={observation} onChange={(event) => changeObservation(event.target.value)} placeholder="例如：若某項指標達到什麼條件，就重新檢視哪個假設。" /><div className="field-status"><span>{observation.trim().length} 字</span><strong className={completed[4] ? "complete" : ""}>{completed[4] ? "✓ 已建立觀察條件" : "至少輸入 8 個字"}</strong></div></div>;
  };

  return (
    <section>
      <PageHeader eyebrow="決策驗證與雙重評分" title="把「有興趣」整理成可檢驗的理由" description="AI 協助整理你的想法，不會憑空替你建立投資理由。" action={<Button variant="ghost" onClick={() => openAssistant(`請協助整理「${steps[activeStep]}」`)}>✦ 請 AI 協助整理</Button>} />
      <div className="decision-layout">
        <article className="card thesis-builder">
          <div className="step-overview"><span>決策驗證進度</span><strong>{completedCount} / {steps.length} 已完成</strong></div>
          <div className="builder-steps" role="tablist" aria-label="決策驗證步驟">
            {steps.map((label, index) => {
              const locked = index > highestUnlockedStep;
              return <button type="button" role="tab" aria-selected={activeStep === index} aria-current={activeStep === index ? "step" : undefined} disabled={locked} className={`${activeStep === index ? "active" : ""} ${completed[index] ? "completed" : ""}`} onClick={() => setActiveStep(index)} key={label}><span>{completed[index] ? "✓" : index + 1}</span>{label}<small>{locked ? "完成前一步後解鎖" : completed[index] ? "已完成" : activeStep === index ? "進行中" : "可填寫"}</small></button>;
            })}
          </div>
          {renderStep()}
          <div className="step-actions"><Button variant="secondary" disabled={activeStep === 0} onClick={() => setActiveStep((current) => Math.max(0, current - 1))}>← 上一步</Button>{activeStep < steps.length - 1 ? <Button disabled={!completed[activeStep]} onClick={goNext}>儲存並繼續 →</Button> : <Button disabled={!allComplete} onClick={() => setScored(true)}>{scored ? "✓ 評分已更新" : "更新雙重評分"}</Button>}</div>
        </article>
        <aside className="score-panel card" aria-live="polite">
          <span className="card-label">雙重評分</span><h2>兩個問題，分開回答</h2><div className="score-progress"><span>決策驗證完成度</span><strong>{completedCount}/{steps.length}</strong><i><b style={{ width: `${(completedCount / steps.length) * 100}%` }} /></i></div><div className="score-card"><div><span>標的成立度</span><strong>{scored ? `${data.thesis.validityScore}/100` : "—"}</strong></div><p>{scored ? `${describeAssessmentScore(data.thesis.validityScore)}｜標的本身是否具備值得持續研究的條件。` : "完成五個步驟並更新評分後顯示。"}</p></div><div className="score-card"><div><span>個人適合度</span><strong>{scored ? `${data.thesis.suitabilityScore}/100` : "—"}</strong></div><p>{scored ? `${describeAssessmentScore(data.thesis.suitabilityScore)}｜標的與你的目標、輪廓及規劃有何關聯。` : "個人條件與標的評估仍會分開處理。"}</p></div><p className="score-note">分數用於分開理解標的條件與個人條件，不是官方資料或投資推薦；兩個分數不可合併。</p><Button full disabled={!scored} onClick={() => navigate("thesis")}>{scored ? "建立我的論點卡 →" : "完成驗證後建立論點卡"}</Button>
        </aside>
      </div>
    </section>
  );
}
