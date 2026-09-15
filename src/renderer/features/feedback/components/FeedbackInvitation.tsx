import { Button } from "../../../components/ui/Button";
import styles from "./FeedbackInvitation.module.css";

interface FeedbackInvitationProps {
  onOpen: () => void;
  onDismiss: () => void;
}

export function FeedbackInvitation({ onOpen, onDismiss }: FeedbackInvitationProps) {
  return (
    <aside className={styles.invitation} aria-labelledby="feedback-invitation-title">
      <div className={styles.icon} aria-hidden="true">☆</div>
      <div className={styles.copy}>
        <span>完成心跳追蹤體驗</span>
        <h3 id="feedback-invitation-title">這段追蹤流程對你有幫助嗎？</h3>
        <p>用 1～5 顆星告訴我們你的感受，協助持續改善投資資訊與判斷流程。</p>
      </div>
      <div className={styles.actions}>
        <Button variant="ghost" onClick={onDismiss}>稍後再說</Button>
        <Button onClick={onOpen}>給予評分</Button>
      </div>
    </aside>
  );
}
