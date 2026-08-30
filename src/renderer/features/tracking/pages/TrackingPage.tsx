import { useMemo } from "react";
import type { RelatedEvent } from "@shared/domain/relatedEvent";
import { useAppContext } from "../../../app/AppContext";
import { PageHeader } from "../../../components/layout/PageHeader";
import { Button } from "../../../components/ui/Button";
import type { RelatedEventRepository } from "../../../data/repositories/RelatedEventRepository";
import type { ResearchCandidateRepository } from "../../../data/repositories/ResearchCandidateRepository";
import type { InvestmentData } from "../../../hooks/useInvestmentData";
import { useRelatedEvents } from "../hooks/useRelatedEvents";
import { useTrackingCandidates } from "../hooks/useTrackingCandidates";

interface TrackingPageProps {
  data: InvestmentData;
  candidateRepository: ResearchCandidateRepository;
  eventRepository: RelatedEventRepository;
  onOpenEvent: (event: RelatedEvent) => void;
}

function RelatedEventCard({ event, onOpen }: { event: RelatedEvent; onOpen: (event: RelatedEvent) => void }) {
  return (
    <article className="card related-event-card">
      <div className="related-event-head">
        <span className={`severity ${event.severity === "重要" ? "critical" : event.severity === "注意" ? "attention" : "info"}`}>{event.severity}</span>
        <span className="related-event-status">{event.dataStatus}</span>
      </div>
      <h3>{event.title}</h3>
      <p>{event.happened}</p>
      <div className="related-event-meta">
        <span>來源：{event.source.publisher}・{event.source.title}</span>
        <span>資料截至：{event.dataAsOf}</span>
      </div>
      <div className="related-event-context">
        <div><span>受影響標的</span><strong>{event.affectedInstrument.symbol} {event.affectedInstrument.name}</strong></div>
        <div><span>受影響假設</span><strong>{event.affectedAssumption}</strong></div>
      </div>
      <Button variant="text" onClick={() => onOpen(event)}>查看重要變化 →</Button>
    </article>
  );
}

export function TrackingPage({ data, candidateRepository, eventRepository, onOpenEvent }: TrackingPageProps) {
  const { thesisObservation } = useAppContext();
  const instrument = data.candidates.find((item) => item.id === data.thesis.instrumentId) ?? data.candidates[0];
  const researchCandidates = useTrackingCandidates(candidateRepository);
  const eventRequest = useMemo(() => ({ primaryInstrument: instrument, researchCandidates, thesisObservation }), [instrument, researchCandidates, thesisObservation]);
  const { feed, error } = useRelatedEvents(eventRepository, eventRequest);
  const observationText = thesisObservation.trim() || "尚未建立重要觀察條件";
  const positiveEvidence = instrument.evidence[0] ?? "目前尚無支持證據";
  const negativeEvidence = instrument.counterEvidence[0] ?? "目前尚無反方意見";
  return (
    <section>
      <PageHeader
        eyebrow="心跳追蹤"
        title="只關注會影響判斷的重要變化"
        description="這一頁是你的追蹤中心：先看目前是否有變化，再看正方、反方與重要觀察。"
        action={feed?.events[0] ? <Button variant="secondary" onClick={() => onOpenEvent(feed.events[0])}>查看重要變化</Button> : undefined}
      />

      <article className="tracking-summary card">
        <div className="pulse attention">
          <i />
          <span>注意</span>
        </div>

        <div className="tracking-summary-copy">
          <span className="card-label">目前追蹤中・{instrument.symbol} {instrument.name}</span>
          <h2>為什麼這檔標的需要持續追蹤？</h2>
          <p>{data.thesis.reason}</p>
          <p>標的成立度 {data.thesis.validityScore}/100，個人適合度 {data.thesis.suitabilityScore}/100；目前先把正方、反方與觀察條件分開追蹤。</p>
        </div>

        <div className="tracking-summary-note">
          <span>重要觀察</span>
          <strong>{observationText}</strong>
          <small>這是從前一頁帶入的觸發條件，若條件成立，就回來重新檢視。</small>
        </div>
      </article>

      <div className="section-title related-events-title">
        <div>
          <span>關聯事件</span>
          <h2>只保留會影響標的或原始假設的事件</h2>
          <p>每項事件都標示來源、時間、受影響標的與假設；點擊後進入重要變化流程。</p>
        </div>
        <span className="related-event-count">{feed?.events.length ?? 0} 項</span>
      </div>

      {error ? <div className="feedback-state error" role="alert"><p>{error}</p></div> : (
        <div className="related-event-list" aria-label="關聯事件清單">
          {feed?.events.map((event) => <RelatedEventCard key={event.id} event={event} onOpen={onOpenEvent} />)}
        </div>
      )}

      <div className="section-title">
        <div>
          <span>正在追蹤的三個面向</span>
          <h2>正方、反方、重要觀察分開看</h2>
        </div>
      </div>

      <div className="tracking-grid">
        <article className="card tracking-card positive">
          <span className="tracking-badge">正方意見</span>
          <h3>目前支持這支標的的理由</h3>
          <p>{positiveEvidence}</p>
          <strong>連動到論點卡的支持證據（共 {instrument.evidence.length} 項）</strong>
        </article>

        <article className="card tracking-card negative">
          <span className="tracking-badge">反方意見</span>
          <h3>需要保留、也需要注意的角度</h3>
          <p>{negativeEvidence}</p>
          <strong>連動到論點卡的反方意見（共 {instrument.counterEvidence.length} 項）</strong>
        </article>

        <article className="card tracking-card observation">
          <span className="tracking-badge">重要觀察</span>
          <h3>什麼情況要重新檢視</h3>
          <p>這裡放的是具體條件，不是市場雜訊。當條件成立時，提醒你回來看一次。</p>
          <strong>{observationText}</strong>
        </article>
      </div>

      <article className="severity-guide card">
        <div className="severity-guide-head">
          <span className="card-label">提醒層級</span>
          <h3>不同顏色代表不同的追蹤強度</h3>
        </div>
        <div className="severity-guide-list">
          <div>
            <span className="severity info">資訊</span>
            <p>知道就好，通常不改變原始判斷</p>
          </div>
          <div>
            <span className="severity attention">注意</span>
            <p>可能影響部分想法，需要再理解</p>
          </div>
          <div>
            <span className="severity critical">重要</span>
            <p>可能影響決策，建議回來重新檢視</p>
          </div>
        </div>
      </article>
    </section>
  );
}
