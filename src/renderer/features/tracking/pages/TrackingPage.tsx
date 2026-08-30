import { useEffect, useMemo, useState } from "react";
import type { RelatedEvent } from "@shared/domain/relatedEvent";
import type { TrackingTarget } from "@shared/domain/tracking";
import { useAppContext } from "../../../app/AppContext";
import { PageHeader } from "../../../components/layout/PageHeader";
import { Button } from "../../../components/ui/Button";
import type { RelatedEventRepository } from "../../../data/repositories/RelatedEventRepository";
import type { TrackingRepository } from "../../../data/repositories/TrackingRepository";
import type { InvestmentData } from "../../../hooks/useInvestmentData";
import { useRelatedEventCounts } from "../hooks/useRelatedEventCounts";
import { useRelatedEvents } from "../hooks/useRelatedEvents";
import { useTrackingTargets } from "../hooks/useTrackingTargets";

interface TrackingPageProps {
  data: InvestmentData;
  trackingRepository: TrackingRepository;
  eventRepository: RelatedEventRepository;
  onOpenEvent: (event: RelatedEvent) => void;
}

function attentionClass(level: TrackingTarget["attentionLevel"]) {
  if (level === "重要") return "critical";
  if (level === "注意") return "attention";
  return "info";
}

function TrackingTargetCard({
  target,
  eventCount,
  selected,
  onSelect,
}: {
  target: TrackingTarget;
  eventCount: number | undefined;
  selected: boolean;
  onSelect: (trackingId: string) => void;
}) {
  return (
    <button
      type="button"
      className={`tracking-target-card ${selected ? "selected" : ""}`}
      aria-pressed={selected}
      onClick={() => onSelect(target.trackingId)}
    >
      <div className="tracking-target-head">
        <span className={`severity ${attentionClass(target.attentionLevel)}`}>{target.attentionLevel}</span>
        <small>{eventCount === undefined ? "事件載入中" : `${eventCount} 項事件`}</small>
      </div>
      <span className="tracking-target-symbol">{target.instrument.symbol}</span>
      <strong>{target.instrument.name}</strong>
      <small>{target.instrument.category}</small>
      <div className="tracking-target-scores">
        <span>成立度 <b>{target.validityScore}</b></span>
        <span>適合度 <b>{target.suitabilityScore}</b></span>
      </div>
    </button>
  );
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

export function TrackingPage({ data, trackingRepository, eventRepository, onOpenEvent }: TrackingPageProps) {
  const { thesisObservation } = useAppContext();
  const primaryInstrument = data.candidates.find((item) => item.id === data.thesis.instrumentId) ?? data.candidates[0];
  const trackingRequest = useMemo(() => ({
    primaryInstrument,
    primaryThesis: data.thesis,
    primaryObservation: thesisObservation,
  }), [data.thesis, primaryInstrument, thesisObservation]);
  const { targets, error: targetsError } = useTrackingTargets(trackingRepository, trackingRequest);
  const eventCounts = useRelatedEventCounts(eventRepository, targets);
  const [selectedTrackingId, setSelectedTrackingId] = useState("");

  useEffect(() => {
    if (targets.length === 0) return;
    if (!targets.some((target) => target.trackingId === selectedTrackingId)) {
      setSelectedTrackingId(targets[0].trackingId);
    }
  }, [selectedTrackingId, targets]);

  const selectedTarget = targets.find((target) => target.trackingId === selectedTrackingId) ?? null;
  const eventRequest = useMemo(() => selectedTarget ? { target: selectedTarget } : null, [selectedTarget]);
  const { feed, error: eventsError } = useRelatedEvents(eventRepository, eventRequest);

  return (
    <section>
      <PageHeader
        eyebrow="心跳追蹤"
        title="集中管理每一項追蹤中的投資判斷"
        description="先選擇追蹤標的，再查看只和該標的、原始假設與觀察條件有關的事件。"
        action={feed?.events[0] ? <Button variant="secondary" onClick={() => onOpenEvent(feed.events[0])}>查看最重要變化</Button> : undefined}
      />

      <div className="section-title tracking-targets-title">
        <div>
          <span>我的追蹤標的</span>
          <h2>{targets.length} 個標的追蹤中</h2>
          <p>每個標的都有獨立論點、觀察條件與事件，不會把不同標的混在一起。</p>
        </div>
      </div>

      {targetsError ? <div className="feedback-state error" role="alert"><p>{targetsError}</p></div> : (
        <div className="tracking-target-grid" aria-label="追蹤標的清單">
          {targets.map((target) => (
            <TrackingTargetCard
              key={target.trackingId}
              target={target}
              eventCount={eventCounts[target.trackingId]}
              selected={target.trackingId === selectedTarget?.trackingId}
              onSelect={setSelectedTrackingId}
            />
          ))}
        </div>
      )}

      {selectedTarget && (
        <article className="tracking-focus card">
          <div className="tracking-focus-main">
            <span className="card-label">目前查看・{selectedTarget.instrument.symbol} {selectedTarget.instrument.name}</span>
            <h2>目前追蹤的投資判斷</h2>
            <p>{selectedTarget.thesisReason}</p>
            <small>最後整理：{selectedTarget.updatedAt}・內容用於研究與追蹤，不構成投資建議</small>
          </div>
          <div className="tracking-focus-observation">
            <span>重新檢視條件</span>
            <strong>{selectedTarget.observation}</strong>
            <small>條件成立時，回到重要變化流程確認原始假設。</small>
          </div>
        </article>
      )}

      <div className="section-title related-events-title">
        <div>
          <span>關聯事件</span>
          <h2>{selectedTarget ? `${selectedTarget.instrument.symbol} ${selectedTarget.instrument.name} 的追蹤事件` : "選擇標的後顯示事件"}</h2>
          <p>只顯示會影響目前標的或原始假設的事件，並保留來源與資料時間。</p>
        </div>
        <span className="related-event-count">{feed?.events.length ?? 0} 項</span>
      </div>

      {eventsError ? <div className="feedback-state error" role="alert"><p>{eventsError}</p></div> : (
        <div className="related-event-list" aria-label="所選標的的關聯事件">
          {feed?.events.map((event) => <RelatedEventCard key={event.id} event={event} onOpen={onOpenEvent} />)}
        </div>
      )}
    </section>
  );
}
