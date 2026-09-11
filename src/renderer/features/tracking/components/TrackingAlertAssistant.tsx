interface TrackingAlertAssistantProps {
  count: number;
  loading: boolean;
  error: string | null;
  onClick: () => void;
}

export function TrackingAlertAssistant({ count, loading, error, onClick }: TrackingAlertAssistantProps) {
  const status = error
    ? "提醒暫時無法更新"
    : loading
      ? "正在整理追蹤狀態"
      : count > 0
        ? `${count} 項觸發事件待查看`
        : "目前沒有待處理提醒";

  return (
    <button
      type="button"
      className={`tracking-alert-assistant ${count > 0 ? "has-alerts" : ""}`}
      onClick={onClick}
      aria-label={`開啟追蹤提醒助理，${status}`}
    >
      <span className="tracking-alert-assistant-icon" aria-hidden="true">✦</span>
      <span className="tracking-alert-assistant-copy">
        <strong>追蹤提醒助理</strong>
        <small>{status}</small>
      </span>
      {count > 0 && <b aria-hidden="true">{count}</b>}
    </button>
  );
}
