import { useState } from "react";
import type { RelatedEvent } from "@shared/domain/relatedEvent";
import { useAppContext } from "../../../app/AppContext";
import { PageHeader } from "../../../components/layout/PageHeader";
import { Button } from "../../../components/ui/Button";

export function ChangePage({ event }: { event: RelatedEvent | null }) {
  const { navigate } = useAppContext();
  const [step, setStep] = useState(0);
  const [update, setUpdate] = useState("保持目前判斷");
  if (!event) return <section><PageHeader eyebrow="重要變化與理解更新" title="請先選擇一項關聯事件" description="返回心跳追蹤，選擇需要深入理解的事件。" action={<Button variant="secondary" onClick={() => navigate("tracking")}>返回心跳追蹤</Button>} /></section>;
  const sourceContent = event.source.url
    ? <a href={event.source.url} target="_blank" rel="noreferrer">{event.source.publisher}・{event.source.title}</a>
    : <>{event.source.publisher}・{event.source.title}</>;
  return <section><PageHeader eyebrow="重要變化與理解更新" title="理解變化，再決定是否更新判斷" description="先還原原始脈絡，再讓使用者決定下一步。" /><div className="change-flow-tabs">{["發生什麼", "AI 解讀", "更新理解"].map((label, index) => <button key={label} className={step === index ? "active" : ""} onClick={() => setStep(index)}><span>{index + 1}</span>{label}</button>)}</div>{step === 0 && <article className="change-stage card"><span className={`severity ${event.severity === "重要" ? "critical" : event.severity === "注意" ? "attention" : "info"}`}>{event.severity}層級</span><h2>{event.title}</h2><p>資料來源：{sourceContent}（資料截至 {event.dataAsOf}・{event.dataStatus}）。</p><div className="impact-chain"><div><span>發生什麼</span><strong>{event.happened}</strong></div><b>→</b><div><span>影響哪個原始假設</span><strong>{event.affectedAssumption}</strong></div><b>→</b><div><span>與我的目標有何關聯</span><strong>{event.goalImpact}</strong></div></div><Button onClick={() => setStep(1)}>了解這項變化 →</Button></article>}{step === 1 && <article className="change-stage card"><span className="ai-spark">✦</span><span className="card-label">基於事件資料的結構化解讀</span><h2>{event.interpretation}</h2><div className="ai-structure"><div><b>01</b><strong>已確認變化</strong><small>{event.happened}</small></div><div><b>02</b><strong>受影響假設</strong><small>{event.affectedAssumption}</small></div><div><b>03</b><strong>個人影響</strong><small>{event.goalImpact}</small></div><div><b>04</b><strong>下一步</strong><small>重新檢視原始論點與觀察條件，不提供買賣指令</small></div></div><Button onClick={() => setStep(2)}>更新我的投資理解 →</Button></article>}{step === 2 && <article className="change-stage card"><span className="card-label">更新選項</span><h2>根據新資訊，選擇如何更新</h2><div className="update-options">{["保持目前判斷", "更新投資理由", "更新觀察條件", "調整投資規劃"].map((option) => <label key={option}><input type="radio" name="update" checked={update === option} onChange={() => setUpdate(option)} /><span><strong>{option}</strong><small>記錄使用者選擇，保留完整更新脈絡。</small></span></label>)}</div><Button onClick={() => navigate("tracking")}>完成更新並持續追蹤 →</Button></article>}</section>;
}
