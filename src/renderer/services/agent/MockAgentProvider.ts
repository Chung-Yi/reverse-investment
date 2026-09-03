import type { AgentEvent, AgentMessagePayload } from "@shared/contracts/agent";
import type { AgentProvider } from "./AgentProvider";

const demoReplies: Record<string, string> = {
  plan: "這份規劃先把總投入資金分成核心 60%、成長 25% 與彈性 15%，三項合計 100%。單一標的 10% 上限與產業 40% 提醒門檻，是以總投資資產計算的配置限制，不會再與上方比例相加。目標、投入能力或資金需求改變時，才需要重新檢視整體規劃。",
  instrument: "台積電 2026 年第二季的支持證據包括營收成長、毛利率與先進製程占比；反方觀點則包括半導體景氣循環、客戶需求與產能執行風險。這些資訊需要隨最新官方資料持續更新。",
  decision: "我會先把你的理由拆成支持證據、反方觀點、關鍵假設與觀察條件，再分別評估標的成立度與個人適合度。",
  tracking: "我會先檢查目前條件是否涵蓋價格、期間波動、關鍵指標、重要事件與個人持倉，再說明哪些條件與原始假設有關。新增或調整條件前，仍會由你確認內容與門檻。",
  change: "我會把已確認事實、可能影響與尚待驗證的資訊分開整理，再由你決定是否更新投資理由、追蹤條件或投資規劃。",
  default: "我會承接目前畫面的脈絡協助你理解、整理重點與釐清問題，也不會替你做投資決定。",
};

export class MockAgentProvider implements AgentProvider {
  private listeners = new Set<(event: AgentEvent) => void>();
  private timers = new Map<string, number>();

  async submitMessage(payload: AgentMessagePayload) {
    const requestId = crypto.randomUUID();
    const routeKey = payload.context.route;
    const trackingConditions = payload.context.facts?.find((fact) => fact.key === "activeTrackingConditions")?.value;
    const eventTrigger = payload.context.facts?.find((fact) => fact.key === "trigger")?.value;
    const eventAssumption = payload.context.facts?.find((fact) => fact.key === "assumption")?.value;
    const answer = payload.context.focus?.kind === "relatedEvent"
      ? `這次是由「${eventTrigger ?? "關聯事件"}」進入檢視，可能影響「${eventAssumption ?? "目前的原始假設"}」。${demoReplies.change}`
      : routeKey === "tracking" && trackingConditions
      ? `目前條件：${trackingConditions}。${demoReplies.tracking}`
      : demoReplies[routeKey] ?? demoReplies.default;
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
