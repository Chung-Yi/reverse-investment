import { useEffect, useRef, useState } from "react";
import type { AgentContextDetails, AgentEvent } from "@shared/contracts/agent";
import type { AgentProvider } from "../../services/agent/AgentProvider";
import { routeMetadata, type RouteId } from "../../app/routeMetadata";

interface AiDrawerProps {
  open: boolean;
  route: RouteId;
  initialPrompt: string;
  context?: AgentContextDetails;
  provider: AgentProvider;
  onClose: () => void;
}

export function AiDrawer({ open, route, initialPrompt, context, provider, onClose }: AiDrawerProps) {
  const [input, setInput] = useState(initialPrompt);
  const [answer, setAnswer] = useState("");
  const [running, setRunning] = useState(false);
  const requestRef = useRef<string | null>(null);

  useEffect(() => setInput(initialPrompt), [initialPrompt]);
  useEffect(() => provider.onEvent((event: AgentEvent) => {
    if (event.requestId !== requestRef.current) return;
    if (event.type === "message.delta") setAnswer((current) => current + event.delta);
    if (event.type === "message.completed" || event.type === "agent.error") setRunning(false);
  }), [provider]);
  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [onClose]);

  const submit = async () => {
    if (!input.trim() || running) return;
    setAnswer(""); setRunning(true);
    const request = await provider.submitMessage({ message: input, context: { ...context, route, screenTitle: routeMetadata[route].label } });
    requestRef.current = request.requestId;
  };

  return (
    <>
      <button className={`drawer-overlay ${open ? "open" : ""}`} onClick={onClose} aria-label="關閉 AI 對話助理" />
      <aside className={`ai-drawer ${open ? "open" : ""}`} aria-hidden={!open} aria-label="AI 對話助理">
        <header><div><span className="ai-spark">✦</span><span><strong>AI 對話助理</strong><small>目前情境：{routeMetadata[route].label}</small></span></div><button className="icon-button" onClick={onClose} aria-label="關閉 AI 面板">×</button></header>
        <div className="ai-body">
          <div className="ai-message"><span>AI</span><div><strong>{answer ? "AI 整理" : "想先理解哪一部分？"}</strong><p>{answer || "我會承接目前畫面的脈絡，協助你整理重點與釐清問題。"}{running && <i className="typing-cursor" />}</p></div></div>
          <div className="suggestions">
            {context?.focus?.kind === "trackingConditions" ? <>
              <button onClick={() => setInput("目前條件涵蓋了哪些風險？")}>目前涵蓋哪些風險？</button>
              <button onClick={() => setInput("還有哪些追蹤條件值得我進一步考慮？")}>還有哪些條件值得考慮？</button>
            </> : <>
              <button onClick={() => setInput("這和我的目標有什麼關係？")}>與我的目標有何關係？</button>
              <button onClick={() => setInput("有哪些反方觀點？")}>有哪些反方觀點？</button>
            </>}
          </div>
        </div>
        <footer><label htmlFor="ai-input">輸入問題</label><div><input id="ai-input" value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") void submit(); }} placeholder="輸入你想了解的問題" /><button onClick={() => void submit()} disabled={running} aria-label="送出問題">↑</button></div><p>回答會依目前畫面脈絡整理；重要資訊請回到原始資料確認。</p></footer>
      </aside>
    </>
  );
}
