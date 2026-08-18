import { useState } from "react";
import { useAppContext } from "../../../app/AppContext";
import { PageHeader } from "../../../components/layout/PageHeader";
import { Button } from "../../../components/ui/Button";
import { onboardingQuestions } from "../../../data/fixtures/onboardingQuestions";

export function OnboardingPage() {
  const { navigate, openAssistant, onboardingMode, onboardingAnswers, saveOnboardingAnswers } = useAppContext();
  const isCreateMode = onboardingMode === "create";
  const [step, setStep] = useState(0);
  const [maxReachedStep, setMaxReachedStep] = useState(0);
  const [completedQuestionIds, setCompletedQuestionIds] = useState<Set<string>>(() => new Set());
  const [changedQuestionIds, setChangedQuestionIds] = useState<Set<string>>(() => new Set());
  const [answers, setAnswers] = useState<Record<string, string>>(() => isCreateMode ? {} : { ...onboardingAnswers });
  const question = onboardingQuestions[step];
  const completedCount = completedQuestionIds.size;
  const changedCount = changedQuestionIds.size;

  const select = (option: string) => {
    setAnswers((current) => ({ ...current, [question.id]: option }));
    if (!isCreateMode) {
      setChangedQuestionIds((current) => {
        const next = new Set(current);
        if (option === onboardingAnswers[question.id]) next.delete(question.id);
        else next.add(question.id);
        return next;
      });
    }
  };

  const nextCreateStep = () => {
    setCompletedQuestionIds((current) => new Set(current).add(question.id));
    if (step === onboardingQuestions.length - 1) {
      saveOnboardingAnswers(answers);
      navigate("profile");
    } else {
      setMaxReachedStep((current) => Math.max(current, step + 1));
      setStep((value) => value + 1);
    }
  };

  const saveEdits = () => {
    saveOnboardingAnswers(answers);
    navigate("profile");
  };

  const progressValue = isCreateMode ? completedCount : step + 1;
  const progressLabel = isCreateMode ? "問卷確認進度" : "目前編輯位置";

  return (
    <section>
      <PageHeader
        eyebrow="目標與個人條件"
        title={isCreateMode ? "建立你的目標與條件" : "調整你的目標與條件"}
        description={isCreateMode ? "依序完成六個步驟，建立你的第一份投資輪廓。" : "已帶入最後儲存的資料；可直接選擇想修改的項目。"}
        action={<><Button variant="secondary" onClick={() => navigate(isCreateMode ? "welcome" : "profile")}>{isCreateMode ? "返回產品介紹" : "取消編輯"}</Button><Button variant="ghost" onClick={() => openAssistant("這題是什麼意思？")}>✦ 這題是什麼意思？</Button></>}
      />
      <div className="question-layout">
        <aside className="stepper" aria-label="問卷進度">
          {onboardingQuestions.map((item, index) => {
            const isCurrent = index === step;
            const isComplete = isCreateMode && completedQuestionIds.has(item.id);
            const isChanged = !isCreateMode && changedQuestionIds.has(item.id);
            const hasSavedData = !isCreateMode && Boolean(onboardingAnswers[item.id]);
            const isUnavailable = isCreateMode && index > maxReachedStep;
            const statusLabel = isCurrent ? "目前步驟" : isComplete ? "已完成" : isChanged ? "已修改" : hasSavedData ? "已有資料" : "尚未完成";
            const statusClass = isCurrent ? "active" : isComplete ? "done" : isChanged ? "changed" : hasSavedData ? "saved" : "pending";
            return <button key={item.id} className={statusClass} disabled={isUnavailable} aria-current={isCurrent ? "step" : undefined} aria-label={`${item.kicker}，${statusLabel}`} onClick={() => setStep(index)}><span>{isComplete || isChanged ? "✓" : index + 1}</span>{item.kicker}</button>;
          })}
        </aside>

        <div className="question-card card">
          <div className="progress-row"><span>第 {step + 1} 題，共 {onboardingQuestions.length} 題</span><strong>{isCreateMode ? `已確認 ${completedCount}/${onboardingQuestions.length}` : `已修改 ${changedCount} 項`}</strong></div>
          <div className="progress" role="progressbar" aria-label={progressLabel} aria-valuemin={0} aria-valuemax={onboardingQuestions.length} aria-valuenow={progressValue}><i style={{ width: `${(progressValue / onboardingQuestions.length) * 100}%` }} /></div>
          <div className="question-content">
            <span className="question-kicker">{question.kicker}</span>
            <h2>{question.title}</h2>
            <p>{question.help}</p>
            <div className="option-grid">{question.options.map((option) => <button key={option} className={answers[question.id] === option ? "selected" : ""} onClick={() => select(option)}><span>{option}</span><i>{answers[question.id] === option ? "✓" : ""}</i></button>)}</div>
          </div>
          <div className="card-actions">
            <Button variant="secondary" disabled={step === 0} onClick={() => setStep((value) => value - 1)}>← 上一題</Button>
            {isCreateMode ? (
              <Button disabled={!answers[question.id]} onClick={nextCreateStep}>{step === onboardingQuestions.length - 1 ? "建立並查看投資輪廓" : "確認並前往下一題 →"}</Button>
            ) : (
              <div className="question-action-group">
                {step < onboardingQuestions.length - 1 && <Button variant="secondary" onClick={() => setStep((value) => value + 1)}>下一題 →</Button>}
                <Button disabled={changedCount === 0} onClick={saveEdits}>儲存變更</Button>
              </div>
            )}
          </div>
        </div>

        <aside className="summary-panel card">
          <span className="card-label">{isCreateMode ? "建立摘要" : "最後儲存資料"}</span>
          <h3>{isCreateMode ? "目前草稿" : changedCount > 0 ? `已修改 ${changedCount} 項` : "尚未修改"}</h3>
          {onboardingQuestions.map((item) => <div className="summary-row" key={item.id}><span>{item.kicker}</span><strong>{answers[item.id] ?? "尚未回答"}</strong></div>)}
          <p className="data-note">{isCreateMode ? "完成六個步驟後才會建立投資輪廓。" : "可直接切換項目；按下儲存變更後才會更新原本資料。"}</p>
        </aside>
      </div>
    </section>
  );
}
