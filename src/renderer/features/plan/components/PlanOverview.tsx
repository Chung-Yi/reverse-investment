import type { AllocationItem, PlanPolicy } from "@shared/domain/investment";
import styles from "./PlanOverview.module.css";

const money = new Intl.NumberFormat("zh-TW", {
  style: "currency",
  currency: "TWD",
  maximumFractionDigits: 0,
});

interface PlanOverviewProps {
  allocations: AllocationItem[];
  policy: PlanPolicy;
}

export function PlanOverview({ allocations, policy }: PlanOverviewProps) {
  const allocationTotal = allocations.reduce((total, item) => total + item.percentage, 0);
  const positionLimitAmount = policy.referenceAmount * policy.singlePositionLimitPercentage / 100;
  const industryReviewAmount = policy.referenceAmount * policy.industryReviewThresholdPercentage / 100;

  return (
    <div className={styles.overview}>
      <ol className={styles.readingGuide} aria-label="投資規劃閱讀順序">
        <li><span>1</span><div><strong>先分配資金</strong><small>三項合計 100%</small></div></li>
        <li><span>2</span><div><strong>再設定限制</strong><small>避免標的或產業過度集中</small></div></li>
        <li><span>3</span><div><strong>最後設定重新檢視條件</strong><small>情況改變時再調整</small></div></li>
      </ol>

      <article className={`card ${styles.feasibility}`}>
        <div className={styles.feasibilityCopy}>
          <span className="card-label">規劃摘要</span>
          <h2>{policy.feasibilityHeadline}</h2>
          <p>{policy.feasibilitySummary}</p>
          <ul>
            {policy.feasibilityReasons.map((reason) => <li key={reason}>{reason}</li>)}
          </ul>
        </div>
        <div className={styles.feasibilityStatus}>
          <span>目前評估</span>
          <strong>{policy.feasibilityStatus}</strong>
          <small>這是條件整理結果，不是成功機率、報酬預測或達成保證。</small>
        </div>
      </article>

      <section className={`card ${styles.section}`} aria-labelledby="allocation-title">
        <header className={styles.sectionHeader}>
          <div>
            <span className={styles.stepLabel}>步驟 1｜資金分配</span>
            <h2 id="allocation-title">我的資金怎麼分配？</h2>
            <p>以下三項都以總投入資金為基準，彼此相加才是完整配置。</p>
          </div>
          <div className={styles.totalBadge}><span>配置合計</span><strong>{allocationTotal}%</strong></div>
        </header>

        <div className={styles.allocationBar} aria-label={`三項資金配置合計 ${allocationTotal}%`}>
          {allocations.map((item) => (
            <span
              key={item.label}
              className={`${styles.segment} ${styles[item.tone]}`}
              style={{ flexBasis: `${item.percentage}%` }}
              aria-hidden="true"
            />
          ))}
        </div>

        <p className={styles.exampleIntro}>以每投入 {money.format(policy.referenceAmount)} 為例：</p>
        <div className={styles.allocationList}>
          {allocations.map((item) => (
            <article key={item.label}>
              <i className={styles[item.tone]} aria-hidden="true" />
              <div><strong>{item.label}</strong><small>{item.description}</small></div>
              <div className={styles.allocationValue}><strong>{item.percentage}%</strong><small>{money.format(policy.referenceAmount * item.percentage / 100)}</small></div>
            </article>
          ))}
        </div>
      </section>

      <section className={`card ${styles.section}`} aria-labelledby="guardrail-title">
        <header className={styles.sectionHeader}>
          <div>
            <span className={styles.stepLabel}>步驟 2｜配置限制</span>
            <h2 id="guardrail-title">配置時要遵守什麼限制？</h2>
            <p>以下是套用在上方配置的安全規則，不會與 60%、25%、15% 相加。</p>
          </div>
          <span className="status neutral">計算基準：{policy.percentageBasis}</span>
        </header>

        <div className={styles.guardrailGrid}>
          <article>
            <span>單一研究型標的上限</span>
            <strong>{policy.singlePositionLimitPercentage}%</strong>
            <p>任何一個研究型標的，最多占{policy.percentageBasis} {policy.singlePositionLimitPercentage}%。</p>
            <small>每 {money.format(policy.referenceAmount)} 最多 {money.format(positionLimitAmount)}</small>
          </article>
          <article>
            <span>單一產業提醒門檻</span>
            <strong>{policy.industryReviewThresholdPercentage}%</strong>
            <p>同一產業接近{policy.percentageBasis} {policy.industryReviewThresholdPercentage}% 時，提醒重新檢查集中風險。</p>
            <small>每 {money.format(policy.referenceAmount)} 接近 {money.format(industryReviewAmount)} 時提醒</small>
          </article>
        </div>
      </section>

      <section className={`card ${styles.reviewSection}`} aria-labelledby="review-title">
        <div>
          <span className={styles.stepLabel}>步驟 3｜重新檢視條件</span>
          <h2 id="review-title">什麼情況需要重新規劃？</h2>
          <p>這些是事件提醒，不是另一組配置比例。</p>
        </div>
        <ul>
          {policy.reviewTriggers.map((trigger) => <li key={trigger}>{trigger}</li>)}
        </ul>
      </section>
    </div>
  );
}
