import { useState } from "react";
import { useAppContext } from "../../../app/AppContext";
import { PageHeader } from "../../../components/layout/PageHeader";
import { Button } from "../../../components/ui/Button";
import { onboardingQuestions } from "../../../data/fixtures/onboardingQuestions";

export function OnboardingPage() {
  const { navigate, openAssistant } = useAppContext();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const question = onboardingQuestions[step];
  const select = (option: string) => setAnswers((current) => ({ ...current, [question.id]: option }));
  const next = () => step === onboardingQuestions.length - 1 ? navigate("profile") : setStep((value) => value + 1);
  return <section><PageHeader eyebrow="Screen 02–03｜建立目標與個人條件" title="先從你想實現的事情開始" description="每次只回答一個問題，答案之後都可以修改。" action={<Button variant="ghost" onClick={() => openAssistant("這題是什麼意思？")}>✦ 這題是什麼意思？</Button>} /><div className="question-layout"><aside className="stepper" aria-label="問卷進度">{onboardingQuestions.map((item, index) => <button key={item.id} className={index === step ? "active" : answers[item.id] ? "done" : ""} onClick={() => index <= step && setStep(index)}><span>{answers[item.id] ? "✓" : index + 1}</span>{item.kicker}</button>)}</aside><div className="question-card card"><div className="progress-row"><span>第 {step + 1} 題，共 {onboardingQuestions.length} 題</span><span>可稍後修改</span></div><div className="progress"><i style={{ width: `${((step + 1) / onboardingQuestions.length) * 100}%` }} /></div><div className="question-content"><span className="question-kicker">{question.kicker}</span><h2>{question.title}</h2><p>{question.help}</p><div className="option-grid">{question.options.map((option) => <button key={option} className={answers[question.id] === option ? "selected" : ""} onClick={() => select(option)}><span>{option}</span><i>{answers[question.id] === option ? "✓" : ""}</i></button>)}</div></div><div className="card-actions"><Button variant="secondary" disabled={step === 0} onClick={() => setStep((value) => value - 1)}>← 上一題</Button><Button disabled={!answers[question.id]} onClick={next}>{step === onboardingQuestions.length - 1 ? "查看我的投資輪廓" : "下一題 →"}</Button></div></div><aside className="summary-panel card"><span className="card-label">即時摘要</span><h3>我的回答</h3>{onboardingQuestions.map((item) => <div className="summary-row" key={item.id}><span>{item.kicker}</span><strong>{answers[item.id] ?? "尚未回答"}</strong></div>)}<p className="data-note">此頁答案只保留在目前 Demo 工作階段。</p></aside></div></section>;
}
