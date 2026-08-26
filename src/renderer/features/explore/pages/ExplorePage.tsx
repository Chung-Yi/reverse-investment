import { useEffect, useMemo, useState } from "react";
import type { ResearchCandidate } from "@shared/domain/investment";
import { useAppContext } from "../../../app/AppContext";
import { PageHeader } from "../../../components/layout/PageHeader";
import { Button } from "../../../components/ui/Button";
import type { ResearchCandidateRepository } from "../../../data/repositories/ResearchCandidateRepository";
import type { InvestmentData } from "../../../hooks/useInvestmentData";
import styles from "../ExplorePage.module.css";
import { AddInstrumentDialog } from "../components/AddInstrumentDialog";
import { CandidateCard } from "../components/CandidateCard";
import { CompactPagination } from "../components/CompactPagination";
import { ResearchDirectionCard } from "../components/ResearchDirectionCard";
import { useResearchCandidates } from "../hooks/useResearchCandidates";
import type { ExploreViewState } from "../types";

interface ExplorePageProps {
  data: InvestmentData;
  repository: ResearchCandidateRepository;
  onOpenCandidate: (candidate: ResearchCandidate) => void;
  viewState: ExploreViewState;
  onViewStateChange: (updater: (current: ExploreViewState) => ExploreViewState) => void;
}

const candidatesPerPage = 5;

function getDirectionPageSize() {
  if (typeof window === "undefined") return 3;
  if (window.matchMedia("(max-width: 820px)").matches) return 1;
  if (window.matchMedia("(max-width: 1180px)").matches) return 2;
  return 3;
}

export function ExplorePage({ data, repository, onOpenCandidate, viewState, onViewStateChange }: ExplorePageProps) {
  const { openAssistant } = useAppContext();
  const { tab, selectedDirection, originFilter, directionPage, candidatePage } = viewState;
  const [directionPageSize, setDirectionPageSize] = useState(getDirectionPageSize);
  const [dialogOpen, setDialogOpen] = useState(false);
  const updateViewState = (patch: Partial<ExploreViewState>) => {
    onViewStateChange((current) => ({ ...current, ...patch }));
  };
  const {
    candidates,
    loading,
    error,
    analyzingIds,
    search,
    addCandidate,
    removeCandidate,
    requestAnalysis,
  } = useResearchCandidates(repository);
  const researchDirections = data.planResearchSuggestion.directions;
  const totalDirectionPages = Math.max(1, Math.ceil(researchDirections.length / directionPageSize));
  const currentDirectionPage = Math.min(directionPage, totalDirectionPages);
  const pagedDirections = researchDirections.slice(
    (currentDirectionPage - 1) * directionPageSize,
    currentDirectionPage * directionPageSize,
  );

  const visibleCandidates = useMemo(() => candidates.filter((candidate) => {
    const matchesDirection = selectedDirection === "all"
      || candidate.directionId === selectedDirection
      || (selectedDirection === "unassigned" && !candidate.directionId);
    const matchesOrigin = originFilter === "all" || candidate.origin === originFilter;
    return matchesDirection && matchesOrigin;
  }), [candidates, originFilter, selectedDirection]);
  const totalCandidatePages = Math.max(1, Math.ceil(visibleCandidates.length / candidatesPerPage));
  const currentCandidatePage = Math.min(candidatePage, totalCandidatePages);
  const pagedCandidates = visibleCandidates.slice(
    (currentCandidatePage - 1) * candidatesPerPage,
    currentCandidatePage * candidatesPerPage,
  );

  useEffect(() => {
    if (candidatePage > totalCandidatePages) updateViewState({ candidatePage: totalCandidatePages });
  }, [candidatePage, totalCandidatePages]);

  useEffect(() => {
    const mobileQuery = window.matchMedia("(max-width: 820px)");
    const tabletQuery = window.matchMedia("(max-width: 1180px)");
    const updatePageSize = () => setDirectionPageSize(getDirectionPageSize());
    mobileQuery.addEventListener("change", updatePageSize);
    tabletQuery.addEventListener("change", updatePageSize);
    return () => {
      mobileQuery.removeEventListener("change", updatePageSize);
      tabletQuery.removeEventListener("change", updatePageSize);
    };
  }, []);

  useEffect(() => {
    if (directionPage > totalDirectionPages) updateViewState({ directionPage: totalDirectionPages });
  }, [directionPage, totalDirectionPages]);

  const viewDirectionCandidates = (directionId: string) => {
    updateViewState({ selectedDirection: directionId, originFilter: "all", candidatePage: 1, tab: "candidates" });
  };

  return (
    <section>
      <PageHeader
        eyebrow="方向探索與候選標的"
        title="從規劃出發，找到研究方向"
        description="先理解與目標相關的研究方向，再挑選值得深入驗證的候選標的。"
        action={<Button variant="ghost" onClick={() => openAssistant("請幫我比較目前的投資研究方向")}>✦ 請 AI 協助比較</Button>}
      />

      <div className={styles.toolbar}>
        <div className={styles.tabs} role="tablist" aria-label="投資探索內容">
          <button role="tab" aria-selected={tab === "directions"} className={tab === "directions" ? styles.active : ""} onClick={() => updateViewState({ tab: "directions" })}>投資方向</button>
          <button role="tab" aria-selected={tab === "candidates"} className={tab === "candidates" ? styles.active : ""} onClick={() => updateViewState({ tab: "candidates" })}>候選研究標的（{candidates.length}）</button>
        </div>
        {tab === "candidates" && <Button variant="secondary" onClick={() => setDialogOpen(true)}>＋ 新增研究標的</Button>}
      </div>

      {tab === "directions" ? (
        <>
          <section className={styles.directionContext} aria-labelledby="direction-context-title">
            <div>
              <span className="card-label">依目前規劃整理</span>
              <h2 id="direction-context-title">{data.goal.name}的研究方向</h2>
              <p>研究方向會依目標、期限、投入金額與風險意願整理。</p>
            </div>
            <dl className={styles.directionFacts}>
              <div>
                <dt>目標期限</dt>
                <dd>{data.goal.years} 年</dd>
              </div>
              <div>
                <dt>每月投入</dt>
                <dd>NT$ {data.goal.monthlyContribution.toLocaleString("zh-TW")}</dd>
              </div>
              <div>
                <dt>風險意願</dt>
                <dd>{data.profile.willingness}</dd>
              </div>
              <div>
                <dt>研究方向</dt>
                <dd>{researchDirections.length} 個</dd>
              </div>
            </dl>
          </section>
          <CompactPagination
            ariaLabel="投資方向分頁"
            first={(currentDirectionPage - 1) * directionPageSize + 1}
            last={Math.min(currentDirectionPage * directionPageSize, researchDirections.length)}
            total={researchDirections.length}
            unit="個方向"
            previousLabel="上一組研究方向"
            nextLabel="下一組研究方向"
            canGoPrevious={currentDirectionPage > 1}
            canGoNext={currentDirectionPage < totalDirectionPages}
            placement="directions"
            onPrevious={() => updateViewState({ directionPage: currentDirectionPage - 1 })}
            onNext={() => updateViewState({ directionPage: currentDirectionPage + 1 })}
          />
          <div className={styles.directionGrid}>
            {pagedDirections.map((direction) => (
              <ResearchDirectionCard
                key={direction.id}
                direction={direction}
                candidateCount={candidates.filter((candidate) => candidate.directionId === direction.id).length}
                onViewCandidates={viewDirectionCandidates}
              />
            ))}
          </div>
        </>
      ) : (
        <>
          <div className={`card ${styles.candidateIntro}`}>
            <div>
              <span className="card-label">我的研究清單</span>
              <h2>規劃產生的候選，也可以加入你想研究的標的</h2>
              <p>兩種來源都會保留，方便比較標的本身的研究條件與它和個人規劃的關聯。</p>
            </div>
          </div>

          <div className={styles.filterBar}>
            <label htmlFor="candidate-direction">研究方向</label>
            <select id="candidate-direction" value={selectedDirection} onChange={(event) => updateViewState({ selectedDirection: event.target.value, candidatePage: 1 })}>
              <option value="all">全部方向</option>
              {researchDirections.map((direction) => <option key={direction.id} value={direction.id}>{direction.title}</option>)}
              <option value="unassigned">尚未指定方向</option>
            </select>
            <label htmlFor="candidate-origin">加入來源</label>
            <select id="candidate-origin" value={originFilter} onChange={(event) => updateViewState({ originFilter: event.target.value as ExploreViewState["originFilter"], candidatePage: 1 })}>
              <option value="all">全部來源</option>
              <option value="plan">依我的規劃整理</option>
              <option value="user">我自行加入</option>
            </select>
          </div>

          {loading && <div className={`card ${styles.loadingState}`}>正在整理候選研究標的…</div>}
          {!loading && error && <div className={`card ${styles.errorState}`}>{error}</div>}
          {!loading && !error && visibleCandidates.length === 0 && (
            <div className={`card ${styles.emptyState}`}>
              <h3>目前沒有符合篩選條件的標的</h3>
              <p>可以調整篩選條件，或使用上方按鈕加入想進一步研究的台股與 ETF。</p>
            </div>
          )}
          {!loading && !error && visibleCandidates.length > 0 && (
            <div className={styles.candidateList}>
              {pagedCandidates.map((candidate) => (
                <CandidateCard
                  key={candidate.candidateId}
                  candidate={candidate}
                  analyzing={analyzingIds.includes(candidate.candidateId)}
                  onAnalyze={(candidateId) => void requestAnalysis(candidateId)}
                  onRemove={(candidateId) => void removeCandidate(candidateId)}
                  onOpenAnalysis={onOpenCandidate}
                />
              ))}
            </div>
          )}
          {!loading && !error && visibleCandidates.length > 0 && (
            <CompactPagination
              ariaLabel="候選研究標的分頁"
              first={(currentCandidatePage - 1) * candidatesPerPage + 1}
              last={Math.min(currentCandidatePage * candidatesPerPage, visibleCandidates.length)}
              total={visibleCandidates.length}
              unit="筆標的"
              previousLabel="上一頁候選研究標的"
              nextLabel="下一頁候選研究標的"
              canGoPrevious={currentCandidatePage > 1}
              canGoNext={currentCandidatePage < totalCandidatePages}
              placement="candidates"
              onPrevious={() => updateViewState({ candidatePage: currentCandidatePage - 1 })}
              onNext={() => updateViewState({ candidatePage: currentCandidatePage + 1 })}
            />
          )}
        </>
      )}

      <AddInstrumentDialog
        open={dialogOpen}
        existingInstrumentIds={candidates.map((candidate) => candidate.id)}
        search={search}
        onAdd={addCandidate}
        onClose={() => setDialogOpen(false)}
      />
    </section>
  );
}
