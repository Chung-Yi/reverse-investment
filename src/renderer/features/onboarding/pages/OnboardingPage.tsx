import { useState } from "react";
import { useAppContext } from "../../../app/AppContext";
import { PageHeader } from "../../../components/layout/PageHeader";
import { Button } from "../../../components/ui/Button";
import { onboardingQuestions } from "../../../data/fixtures/onboardingQuestions";

export function OnboardingPage() {
  const { navigate, openAssistant, onboardingAnswers, saveOnboardingAnswers } = useAppContext();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>(() => ({ ...onboardingAnswers }));
  const question = onboardingQuestions[step];
  const select = (option: string) => setAnswers((current) => ({ ...current, [question.id]: option }));
  const next = () => {
    if (step === onboardingQuestions.length - 1) {
      saveOnboardingAnswers(answers);
      navigate("profile");
    } else setStep((value) => value + 1);
  };
  return <section><PageHeader eyebrow="Screen 02–03｜編輯目標與個人條件" title="調整你的目標與條件" description="已帶入目前答案；取消編輯不會影響原有資料。" action={<><Button variant="secondary" onClick={() => navigate("profile")}>取消編輯</Button><Button variant="ghost" onClick={() => openAssistant("這題是什麼意思？")}>✦ 這題是什麼意思？</Button></>} /><div className="question-layout"><aside className="stepper" aria-label="問卷進度">{onboardingQuestions.map((item, index) => <button key={item.id} className={index === step ? "active" : answers[item.id] ? "done" : ""} onClick={() => (answers[item.id] || index <= step) && setStep(index)}><span>{answers[item.id] ? "✓" : index + 1}</span>{item.kicker}</button>)}</aside><div className="question-card card"><div className="progress-row"><span>第 {step + 1} 題，共 {onboardingQuestions.length} 題</span><span>完成後才會儲存</span></div><div className="progress"><i style={{ width: `${((step + 1) / onboardingQuestions.length) * 100}%` }} /></div><div className="question-content"><span className="question-kicker">{question.kicker}</span><h2>{question.title}</h2><p>{question.help}</p><div className="option-grid">{question.options.map((option) => <button key={option} className={answers[question.id] === option ? "selected" : ""} onClick={() => select(option)}><span>{option}</span><i>{answers[question.id] === option ? "✓" : ""}</i></button>)}</div></div><div className="card-actions"><Button variant="secondary" disabled={step === 0} onClick={() => setStep((value) => value - 1)}>← 上一題</Button><Button disabled={!answers[question.id]} onClick={next}>{step === onboardingQuestions.length - 1 ? "儲存並查看投資輪廓" : "下一題 →"}</Button></div></div><aside className="summary-panel card"><span className="card-label">編輯摘要</span><h3>目前草稿</h3>{onboardingQuestions.map((item) => <div className="summary-row" key={item.id}><span>{item.kicker}</span><strong>{answers[item.id] ?? "尚未回答"}</strong></div>)}<p className="data-note">只有完成儲存才會更新；取消編輯會保留原本答案。</p></aside></div></section>;
}
