import type { AgentEvent, AgentMessagePayload } from "@shared/contracts/agent";
import type { AgentProvider } from "./AgentProvider";

const demoReplies: Record<string, string> = {
  plan: "這份規劃草案以八年期限、每月投入能力與波動承受條件共同整理。核心、成長與彈性資金分開，是為了讓目標與風險各自有清楚的位置。",
  instrument: "台積電 2026 年第二季的支持證據包括營收成長、毛利率與先進製程占比；反方觀點則包括半導體景氣循環、客戶需求與產能執行風險。這些資訊需要隨最新官方資料持續更新。",
  decision: "我會先把你的理由拆成支持證據、反方觀點、關鍵假設與觀察條件，再分別評估標的成立度與個人適合度。",
  default: "我會承接目前畫面的脈絡協助你理解。Version 1 使用前端 Demo 回覆，尚未連線外部 AI，也不會替你做投資決定。",
};

export class MockAgentProvider implements AgentProvider {
  private listeners = new Set<(event: AgentEvent) => void>();
  private timers = new Map<string, number>();

  async submitMessage(payload: AgentMessagePayload) {
    const requestId = crypto.randomUUID();
    const routeKey = payload.context.route;
    const answer = demoReplies[routeKey] ?? demoReplies.default;
    const chunks = answer.match(/.{1,18}/gu) ?? [answer];
    let index = 0;

    const emitNext = () => {
      const chunk = chunks[index];
      if (chunk) {
        this.emit({ type: "message.delta", requestId, delta: chunk });
        index += 1;
        this.timers.set(requestId, window.setTimeout(emitNext, 45));
      } else {
        this.timers.delete(requestId);
        this.emit({ type: "message.completed", requestId, message: answer });
      }
    };

    this.timers.set(requestId, window.setTimeout(emitNext, 120));
    return { requestId };
  }

  stop(requestId: string) {
    const timer = this.timers.get(requestId);
    if (timer) window.clearTimeout(timer);
    this.timers.delete(requestId);
  }

  onEvent(callback: (event: AgentEvent) => void) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  private emit(event: AgentEvent) {
    for (const listener of this.listeners) listener(event);
  }
}
