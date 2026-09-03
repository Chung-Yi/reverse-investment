import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const readProjectFile = (path) => readFile(new URL(`../${path}`, import.meta.url), "utf8");

test("renderer has a product-specific React entry", async () => {
  const [html, entry, app] = await Promise.all([
    readProjectFile("src/renderer/index.html"),
    readProjectFile("src/renderer/app/main.tsx"),
    readProjectFile("src/renderer/app/App.tsx"),
  ]);

  assert.match(html, /<html lang="zh-Hant">/);
  assert.match(html, /逆思投資｜AI 智慧投資顧問/);
  assert.match(html, /id="root"/);
  assert.match(entry, /createRoot/);
  assert.match(entry, /styles\/tokens\.css/);
  assert.match(app, /MockAgentProvider/);
  assert.match(app, /mockInvestmentRepository/);
});

test("preserves the documented UI workspaces and adds portfolio without exposing internal IDs", async () => {
  const productPagePaths = [
    "welcome/pages/WelcomePage.tsx",
    "onboarding/pages/OnboardingPage.tsx",
    "profile/pages/ProfilePage.tsx",
    "plan/pages/PlanPage.tsx",
    "explore/pages/ExplorePage.tsx",
    "portfolio/pages/PortfolioPage.tsx",
    "instrument/pages/InstrumentPage.tsx",
    "decision/pages/DecisionPage.tsx",
    "thesis/pages/ThesisPage.tsx",
    "tracking/pages/TrackingPage.tsx",
    "change/pages/ChangePage.tsx",
  ];
  const [metadata, drawer, ...productPages] = await Promise.all([
    readProjectFile("src/renderer/app/routeMetadata.ts"),
    readProjectFile("src/renderer/components/layout/AiDrawer.tsx"),
    ...productPagePaths.map((path) => readProjectFile(`src/renderer/features/${path}`)),
  ]);

  for (const route of ["welcome", "home", "onboarding", "profile", "plan", "explore", "portfolio", "instrument", "decision", "thesis", "tracking", "change"]) {
    assert.match(metadata, new RegExp(`id: "${route}"`));
  }
  assert.match(drawer, /AI 對話助理/);
  assert.match(metadata, /story: "15–17"/);
  assert.doesNotMatch(productPages.join("\n"), /Screen\s+\d/i);
});

test("simulated portfolio is editable through a replaceable repository", async () => {
  const [metadata, app, page, dialog, card, checkbox, repository, contract, fixture, domain, formatter] = await Promise.all([
    readProjectFile("src/renderer/app/routeMetadata.ts"),
    readProjectFile("src/renderer/app/App.tsx"),
    readProjectFile("src/renderer/features/portfolio/pages/PortfolioPage.tsx"),
    readProjectFile("src/renderer/features/portfolio/components/PortfolioPositionDialog.tsx"),
    readProjectFile("src/renderer/features/portfolio/components/PortfolioPositionCard.tsx"),
    readProjectFile("src/renderer/features/portfolio/components/SelectionCheckbox.tsx"),
    readProjectFile("src/renderer/data/repositories/mockPortfolioRepository.ts"),
    readProjectFile("src/renderer/data/repositories/PortfolioRepository.ts"),
    readProjectFile("src/renderer/data/fixtures/demoPortfolio.ts"),
    readProjectFile("src/shared/domain/investment.ts"),
    readProjectFile("src/renderer/utils/formatTwd.ts"),
  ]);

  assert.match(metadata, /id: "portfolio", label: "我的資產"/);
  assert.match(metadata, /id: "portfolio", label: "資產"/);
  assert.doesNotMatch(metadata, /id: "thesis", label: "論點", icon:/);
  assert.match(app, /PortfolioPage/);
  assert.match(app, /mockPortfolioRepository/);
  assert.match(page, /總資產/);
  assert.match(page, /totalAssetValue/);
  assert.match(page, /formatTwd\(totals\.totalAssets\)/);
  assert.match(page, /目前配置是否符合原始規劃/);
  assert.match(page, /新增模擬持倉/);
  assert.match(page, /singlePositionLimitPercentage/);
  assert.match(page, /window\.confirm/);
  assert.match(page, /selectedPositionIds/);
  assert.match(page, /indeterminate=\{partiallySelected\}/);
  assert.match(page, /移除已選取的/);
  assert.match(dialog, /role="dialog"/);
  assert.match(dialog, /參考價格由使用者輸入/);
  assert.match(card, /未實現損益/);
  assert.match(card, /trashIcon/);
  assert.match(card, /aria-label=\{`移除/);
  assert.match(checkbox, /inputRef\.current\.indeterminate/);
  assert.match(checkbox, /checkboxVisual/);
  assert.match(contract, /savePosition/);
  assert.match(contract, /removePosition/);
  assert.match(contract, /removePositions/);
  assert.match(repository, /portfolioState/);
  assert.match(repository, /new Set\(positionIds\)/);
  assert.doesNotMatch(repository, /localStorage|fetch\(/);
  assert.match(fixture, /position-twse-0050/);
  assert.match(fixture, /position-twse-2330/);
  assert.match(domain, /interface SimulatedPortfolio/);
  assert.match(domain, /interface PortfolioPositionInput/);
  assert.match(formatter, /return `NT\$ \$\{twdAmount\.format\(value\)\}`/);
});

test("Electron renderer keeps privileged APIs behind preload", async () => {
  const [main, preload] = await Promise.all([
    readProjectFile("src/main/windows/createMainWindow.ts"),
    readProjectFile("src/preload/index.ts"),
  ]);

  assert.match(main, /contextIsolation:\s*true/);
  assert.match(main, /nodeIntegration:\s*false/);
  assert.match(main, /sandbox:\s*true/);
  assert.match(preload, /contextBridge\.exposeInMainWorld/);
  assert.match(preload, /desktop:get-info/);
});

test("mock Agent implements the replaceable streaming contract", async () => {
  const [contract, provider] = await Promise.all([
    readProjectFile("src/renderer/services/agent/AgentProvider.ts"),
    readProjectFile("src/renderer/services/agent/MockAgentProvider.ts"),
  ]);

  assert.match(contract, /submitMessage/);
  assert.match(contract, /stop\(requestId/);
  assert.match(contract, /onEvent/);
  assert.match(provider, /message\.delta/);
  assert.match(provider, /message\.completed/);
  assert.doesNotMatch(provider, /fetch\(|OpenAI|python/i);
});

test("onboarding distinguishes current, completed, and pending steps", async () => {
  const [page, styles] = await Promise.all([
    readProjectFile("src/renderer/features/onboarding/pages/OnboardingPage.tsx"),
    readProjectFile("src/renderer/styles/workspaces.css"),
  ]);

  assert.match(page, /completedQuestionIds/);
  assert.match(page, /maxReachedStep/);
  assert.match(page, /new Set\(current\)\.add\(question\.id\)/);
  assert.match(page, /const statusClass = isCurrent \? "active" : isComplete \? "done" : isChanged \? "changed" : hasSavedData \? "saved" : "pending"/);
  assert.match(page, /aria-current=\{isCurrent \? "step" : undefined\}/);
  assert.match(page, /`已確認 \$\{completedCount\}\/\$\{onboardingQuestions\.length\}`/);
  assert.match(page, /aria-valuenow=\{progressValue\}/);
  assert.doesNotMatch(page, /filter\(\(item\) => Boolean\(answers\[item\.id\]\)\)/);
  assert.match(styles, /\.stepper button\.done, \.stepper button\.changed \{/);
  assert.match(styles, /\.stepper button\.saved \{/);
  assert.match(styles, /\.stepper button\.pending \{/);
});

test("onboarding separates first-time creation from returning-user editing", async () => {
  const [app, context, welcome, onboarding, profile, home, localRepository, personalization] = await Promise.all([
    readProjectFile("src/renderer/app/App.tsx"),
    readProjectFile("src/renderer/app/AppContext.tsx"),
    readProjectFile("src/renderer/features/welcome/pages/WelcomePage.tsx"),
    readProjectFile("src/renderer/features/onboarding/pages/OnboardingPage.tsx"),
    readProjectFile("src/renderer/features/profile/pages/ProfilePage.tsx"),
    readProjectFile("src/renderer/features/home/pages/HomePage.tsx"),
    readProjectFile("src/renderer/data/repositories/localOnboardingProfileRepository.ts"),
    readProjectFile("src/renderer/data/personalization/buildPersonalizedInvestmentData.ts"),
  ]);

  assert.match(context, /type OnboardingMode = "create" \| "edit"/);
  assert.match(welcome, /startOnboarding\("create"\)/);
  assert.match(profile, /startOnboarding\("edit"\)/);
  assert.match(home, /startOnboarding\("edit"\)/);
  assert.match(onboarding, /isCreateMode \? \{\} : \{ \.\.\.onboardingAnswers \}/);
  assert.match(onboarding, /const isUnavailable = isCreateMode && index > maxReachedStep/);
  assert.match(onboarding, /hasSavedData \? "saved"/);
  assert.match(onboarding, /changedQuestionIds/);
  assert.match(onboarding, /option === onboardingAnswers\[question\.id\]/);
  assert.match(onboarding, /disabled=\{changedCount === 0\}/);
  assert.match(onboarding, />儲存變更<\/Button>/);
  assert.match(onboarding, /可直接選擇想修改的項目/);
  assert.match(onboarding, /建立你的目標與條件/);
  assert.match(onboarding, /已帶入最後儲存的資料/);
  assert.match(app, /localOnboardingProfileRepository\.load/);
  assert.match(app, /localOnboardingProfileRepository\.save/);
  assert.match(app, /buildPersonalizedInvestmentData\(data, onboardingAnswers\)/);
  assert.match(localRepository, /window\.localStorage\.getItem/);
  assert.match(localRepository, /window\.localStorage\.setItem/);
  assert.match(localRepository, /question\.options\.includes\(answer\)/);
  assert.match(personalization, /data\.goal =/);
  assert.match(personalization, /data\.profile =/);
  assert.match(personalization, /data\.allocations =/);
  assert.match(personalization, /data\.planPolicy =/);
  assert.match(personalization, /data\.planResearchSuggestion =/);
});

test("investment exploration uses plan directions and a replaceable candidate repository", async () => {
  const [page, dialog, repository, fixture] = await Promise.all([
    readProjectFile("src/renderer/features/explore/pages/ExplorePage.tsx"),
    readProjectFile("src/renderer/features/explore/components/AddInstrumentDialog.tsx"),
    readProjectFile("src/renderer/data/repositories/ResearchCandidateRepository.ts"),
    readProjectFile("src/renderer/data/fixtures/instrumentCatalog.ts"),
  ]);

  assert.match(page, /researchDirections = data\.planResearchSuggestion\.directions/);
  assert.match(page, /候選研究標的/);
  assert.match(page, /AddInstrumentDialog/);
  assert.match(dialog, /role="dialog"/);
  assert.match(dialog, /上市、上櫃個股與 ETF/);
  assert.match(repository, /searchInstruments/);
  assert.match(repository, /addCandidate/);
  assert.match(repository, /requestAnalysis/);
  assert.match(fixture, /元大台灣50/);
  assert.match(fixture, /環球晶/);
});

test("multiple tracking targets keep related events scoped and replaceable", async () => {
  const [metadata, app, home, tracking, conditionDialog, conditionHook, conditionFixture, conditionDomain, conditionContract, conditionRepository, change, eventFixture, eventContract, eventRepository, eventHook, eventCountHook, targetFixture, targetDomain, targetContract, targetRepository, targetHook] = await Promise.all([
    readProjectFile("src/renderer/app/routeMetadata.ts"),
    readProjectFile("src/renderer/app/App.tsx"),
    readProjectFile("src/renderer/features/home/pages/HomePage.tsx"),
    readProjectFile("src/renderer/features/tracking/pages/TrackingPage.tsx"),
    readProjectFile("src/renderer/features/tracking/components/TrackingConditionDialog.tsx"),
    readProjectFile("src/renderer/features/tracking/hooks/useTrackingConditions.ts"),
    readProjectFile("src/renderer/data/fixtures/trackingConditionCatalog.ts"),
    readProjectFile("src/shared/domain/trackingCondition.ts"),
    readProjectFile("src/renderer/data/repositories/TrackingConditionRepository.ts"),
    readProjectFile("src/renderer/data/repositories/localTrackingConditionRepository.ts"),
    readProjectFile("src/renderer/features/change/pages/ChangePage.tsx"),
    readProjectFile("src/renderer/data/fixtures/relatedEvents.ts"),
    readProjectFile("src/renderer/data/repositories/RelatedEventRepository.ts"),
    readProjectFile("src/renderer/data/repositories/mockRelatedEventRepository.ts"),
    readProjectFile("src/renderer/features/tracking/hooks/useRelatedEvents.ts"),
    readProjectFile("src/renderer/features/tracking/hooks/useRelatedEventCounts.ts"),
    readProjectFile("src/renderer/data/fixtures/trackingTargets.ts"),
    readProjectFile("src/shared/domain/tracking.ts"),
    readProjectFile("src/renderer/data/repositories/TrackingRepository.ts"),
    readProjectFile("src/renderer/data/repositories/mockTrackingRepository.ts"),
    readProjectFile("src/renderer/features/tracking/hooks/useTrackingTargets.ts"),
  ]);

  assert.doesNotMatch(metadata, /id: "news"|label: "新聞"/);
  assert.doesNotMatch(home, /新聞脈動|navigate\("news"\)/);
  assert.doesNotMatch(app, /NewsPage|mockNewsRepository/);
  assert.match(eventContract, /interface RelatedEventRepository/);
  assert.match(eventContract, /target: TrackingTarget/);
  assert.match(eventRepository, /buildRelatedEventFeed/);
  assert.match(eventFixture, /eventsByInstrument/);
  assert.match(eventFixture, /"twse-2881": \[\]/);
  assert.doesNotMatch(eventFixture, /related-event-observation|目前尚未確認條件已成立/);
  assert.match(eventHook, /repository\.getRelatedEvents\(request\)/);
  assert.match(eventCountHook, /repository\.getRelatedEvents\(\{ target \}\)/);
  assert.match(eventCountHook, /feed\.events\.length/);
  assert.match(tracking, /eventCounts\[target\.trackingId\]/);
  assert.doesNotMatch(targetDomain, /relatedEventCount/);
  assert.doesNotMatch(targetFixture, /relatedEventCount/);
  assert.match(targetContract, /interface TrackingRepository/);
  assert.match(targetRepository, /buildTrackingTargets/);
  assert.match(targetHook, /repository\.getTrackingTargets\(request\)/);
  assert.match(targetFixture, /tracking-twse-0050/);
  assert.match(targetFixture, /tracking-twse-2881/);
  assert.match(tracking, /tracking-target-grid/);
  assert.match(tracking, /aria-pressed=\{selected\}/);
  assert.match(tracking, /selectedTrackingId/);
  assert.match(tracking, /每個標的都有獨立論點、觀察條件與事件/);
  assert.match(tracking, /關聯事件/);
  assert.match(tracking, /event\.trigger\.label/);
  assert.match(tracking, /目前沒有需要特別注意的新事件/);
  assert.match(tracking, /目前追蹤條件/);
  assert.match(tracking, /TrackingBellButton/);
  assert.match(tracking, /TrackingConditionDialog/);
  assert.match(conditionDialog, /設定追蹤條件/);
  assert.match(conditionDialog, /條件成立後會產生提醒/);
  assert.match(conditionHook, /repository\.getSetup\(target\)/);
  assert.match(conditionHook, /repository\.save\(target, input\)/);
  assert.match(conditionContract, /interface TrackingConditionRepository/);
  assert.match(conditionContract, /getSetup/);
  assert.match(conditionRepository, /buildTrackingConditionDefinitions/);
  assert.match(conditionRepository, /window\.localStorage/);
  assert.match(conditionDomain, /TrackingConditionKind/);
  assert.match(conditionFixture, /price: \{ label: "價格門檻"/);
  assert.match(conditionFixture, /importantEvent: \{ label: "重要事件"/);
  assert.match(conditionFixture, /category\.includes\("ETF"\)/);
  assert.match(conditionFixture, /月營收年增率/);
  assert.match(conditionFixture, /追蹤差異/);
  assert.match(tracking, /受影響標的/);
  assert.match(tracking, /受影響假設/);
  assert.match(tracking, /資料截至/);
  assert.match(tracking, /onOpenEvent/);
  assert.match(change, /event\.affectedAssumption/);
  assert.match(change, /event\.goalImpact/);
  assert.doesNotMatch(tracking, /正方、反方、重要觀察分開看/);
  assert.match(eventFixture, /dataStatus: "非即時資訊"/);
  assert.doesNotMatch([home, tracking, change].join("\n"), /demo|mock/i);
});

test("Sites build packages the current renderer instead of stale client assets", async () => {
  const [packageJson, prepareScript] = await Promise.all([
    readProjectFile("package.json"),
    readProjectFile("scripts/prepare-sites-dist.mjs"),
  ]);

  assert.match(packageJson, /"build:sites"/);
  assert.match(packageJson, /prepare-sites-dist\.mjs/);
  assert.match(prepareScript, /await cp\(rendererOutput, clientOutput/);
  assert.match(prepareScript, /await rm\(clientOutput/);
});

test("plan research directions scale without mixing abstract types or duplicate next actions", async () => {
  const [planSuggestions, planPage, explorePage, compactPagination, planFixture, instrumentFixture] = await Promise.all([
    readProjectFile("src/renderer/features/plan/components/PlanResearchSuggestions.tsx"),
    readProjectFile("src/renderer/features/plan/pages/PlanPage.tsx"),
    readProjectFile("src/renderer/features/explore/pages/ExplorePage.tsx"),
    readProjectFile("src/renderer/features/explore/components/CompactPagination.tsx"),
    readProjectFile("src/renderer/data/fixtures/demoInvestment.ts"),
    readProjectFile("src/renderer/data/fixtures/instrumentCatalog.ts"),
  ]);

  assert.match(planSuggestions, /suggestion\.directions\.map/);
  assert.match(planSuggestions, /scrollBy/);
  assert.match(planSuggestions, /查看上一個研究方向/);
  assert.doesNotMatch(planSuggestions, /TYPE|候選標的與類型|待進一步篩選|前往篩選/);
  assert.doesNotMatch(planSuggestions, /下一步|前往投資探索/);
  assert.equal(planPage.match(/navigate\("explore"\)/g)?.length, 1);
  assert.match(planPage, /查看與研究方向相關的候選標的/);
  assert.match(explorePage, /candidatesPerPage/);
  assert.match(explorePage, /候選研究標的分頁/);
  assert.match(explorePage, /getDirectionPageSize/);
  assert.match(explorePage, /pagedDirections\.map/);
  assert.match(explorePage, /投資方向分頁/);
  assert.match(explorePage, /CompactPagination/);
  assert.match(explorePage, /上一組研究方向/);
  assert.match(explorePage, /下一組研究方向/);
  assert.match(explorePage, /上一頁候選研究標的/);
  assert.match(explorePage, /下一頁候選研究標的/);
  assert.match(compactPagination, /aria-live="polite"/);
  assert.match(compactPagination, /aria-hidden="true">←/);
  assert.match(compactPagination, /aria-hidden="true">→/);
  assert.doesNotMatch(explorePage, /第 \{currentDirectionPage\}／|第 \{currentCandidatePage\}／/);
  assert.match(explorePage, /依目前規劃整理/);
  assert.match(explorePage, /目標期限/);
  assert.match(explorePage, /每月投入/);
  assert.match(explorePage, /風險意願/);
  assert.doesNotMatch(explorePage, /查看全部候選標的/);
  assert.doesNotMatch(explorePage, /directionIntro/);
  assert.ok(explorePage.includes('{tab === "candidates" && <Button variant="secondary" onClick={() => setDialogOpen(true)}>＋ 新增研究標的</Button>}'));
  assert.equal(explorePage.match(/＋ 新增研究標的/g)?.length, 1);
  for (const directionId of ["diversified-core", "semiconductor-ai", "financial-quality", "power-efficiency", "display-materials"]) {
    assert.match(planFixture, new RegExp(`id: "${directionId}"`));
  }
  for (const candidateId of ["plan-twse-2330", "plan-twse-0050", "plan-twse-2881", "plan-twse-006208", "plan-twse-2308", "plan-tpex-8069"]) {
    assert.match(instrumentFixture, new RegExp(`candidateId: "${candidateId}"`));
  }
  for (const simpleLabel of ["長期投資", "成長投資", "保留資金", "先觀察"]) {
    assert.match(planFixture, new RegExp(simpleLabel));
  }
  assert.doesNotMatch(planFixture, /核心配置|成長配置|彈性資金|觀察清單/);
});

test("all ready candidates use one analysis action without mixing instrument data", async () => {
  const [app, candidateCard, instrumentPage] = await Promise.all([
    readProjectFile("src/renderer/app/App.tsx"),
    readProjectFile("src/renderer/features/explore/components/CandidateCard.tsx"),
    readProjectFile("src/renderer/features/instrument/pages/InstrumentPage.tsx"),
  ]);

  assert.match(app, /selectedCandidate/);
  assert.match(app, /openCandidateAnalysis/);
  assert.match(candidateCard, /查看分析 →/);
  assert.doesNotMatch(candidateCard, /查看詳細分析|查看分析摘要/);
  assert.match(instrumentPage, /selectedCandidate\?\.instrumentId/);
  assert.match(instrumentPage, /data\.candidates\.find/);
  assert.match(instrumentPage, /初步資料已整理/);
  assert.match(instrumentPage, /資料完整前不會進入決策驗證/);
});

test("contextual back navigation preserves the investment exploration view", async () => {
  const [app, shell, metadata, explorePage, exploreTypes, instrumentPage, changePage] = await Promise.all([
    readProjectFile("src/renderer/app/App.tsx"),
    readProjectFile("src/renderer/components/layout/AppShell.tsx"),
    readProjectFile("src/renderer/app/routeMetadata.ts"),
    readProjectFile("src/renderer/features/explore/pages/ExplorePage.tsx"),
    readProjectFile("src/renderer/features/explore/types.ts"),
    readProjectFile("src/renderer/features/instrument/pages/InstrumentPage.tsx"),
    readProjectFile("src/renderer/features/change/pages/ChangePage.tsx"),
  ]);

  assert.match(app, /routeHistoryRef/);
  assert.match(app, /const goBack/);
  assert.match(app, /backLabel=\{secondaryRouteBackNavigation\[route\]\?\.label\}/);
  assert.match(shell, /aria-label=\{backLabel\}/);
  assert.match(shell, /onClick=\{onBack\}/);
  assert.match(shell, /mobile-page-title/);
  assert.match(metadata, /instrument: \{ label: "返回候選研究標的", fallback: "explore" \}/);
  assert.match(metadata, /decision: \{ label: "返回標的分析", fallback: "instrument" \}/);
  assert.match(metadata, /change: \{ label: "返回心跳追蹤", fallback: "tracking" \}/);
  assert.doesNotMatch(instrumentPage, /action=\{<Button[^>]*>返回投資探索/);
  assert.doesNotMatch(changePage, /action=\{<Button[^>]*>返回心跳追蹤/);
  assert.match(app, /exploreViewState/);
  assert.match(explorePage, /viewState: ExploreViewState/);
  assert.match(explorePage, /onViewStateChange/);
  assert.match(exploreTypes, /tab: "directions"/);
  assert.match(exploreTypes, /selectedDirection/);
  assert.match(exploreTypes, /candidatePage/);
});

test("primary navigation reopens exploration at its default directions view", async () => {
  const [app, shell, exploreTypes] = await Promise.all([
    readProjectFile("src/renderer/app/App.tsx"),
    readProjectFile("src/renderer/components/layout/AppShell.tsx"),
    readProjectFile("src/renderer/features/explore/types.ts"),
  ]);

  assert.match(app, /const navigateFromPrimary/);
  assert.match(app, /next === "explore"/);
  assert.match(app, /setExploreViewState\(\{ \.\.\.initialExploreViewState \}\)/);
  assert.match(app, /onPrimaryNavigate=\{navigateFromPrimary\}/);
  assert.match(shell, /const goPrimary/);
  assert.equal(shell.match(/onClick=\{\(\) => goPrimary\(item\.id\)\}/g)?.length, 2);
  assert.match(exploreTypes, /tab: "directions"/);
  assert.match(exploreTypes, /directionPage: 1/);
  assert.match(exploreTypes, /candidatePage: 1/);
});

test("important changes separate facts from AI interpretation and persist user decisions", async () => {
  const [page, eventDomain, reviewDomain, reviewContract, reviewRepository, reviewHook, app, thesis, plan, drawer] = await Promise.all([
    readProjectFile("src/renderer/features/change/pages/ChangePage.tsx"),
    readProjectFile("src/shared/domain/relatedEvent.ts"),
    readProjectFile("src/shared/domain/importantChangeReview.ts"),
    readProjectFile("src/renderer/data/repositories/ImportantChangeReviewRepository.ts"),
    readProjectFile("src/renderer/data/repositories/localImportantChangeReviewRepository.ts"),
    readProjectFile("src/renderer/hooks/useImportantChangeReviews.ts"),
    readProjectFile("src/renderer/app/App.tsx"),
    readProjectFile("src/renderer/features/thesis/pages/ThesisPage.tsx"),
    readProjectFile("src/renderer/features/plan/pages/PlanPage.tsx"),
    readProjectFile("src/renderer/components/layout/AiDrawer.tsx"),
  ]);

  assert.match(page, /title=\{`\$\{event\.affectedInstrument\.symbol\}/);
  assert.match(page, /設定門檻/);
  assert.match(page, /實際數值／狀態/);
  assert.match(page, /已確認事實/);
  assert.match(page, /AI 協助解讀/);
  assert.match(page, /尚待驗證/);
  assert.match(page, /conditionRepository\.save/);
  assert.match(page, /reviewRepository\.save/);
  assert.match(page, /與 AI 討論這項事件/);
  assert.match(page, /kind: "relatedEvent"/);
  assert.match(eventDomain, /confirmedFacts/);
  assert.match(eventDomain, /verificationItems/);
  assert.match(reviewDomain, /ImportantChangeReviewAction/);
  assert.match(reviewContract, /interface ImportantChangeReviewRepository/);
  assert.match(reviewRepository, /localStorage/);
  assert.match(reviewHook, /repository\.list/);
  assert.match(app, /localImportantChangeReviewRepository/);
  assert.match(thesis, /重要變化後的論點更新/);
  assert.match(plan, /重要變化後的規劃補充/);
  assert.match(drawer, /context\?\.focus\?\.kind === "relatedEvent"/);
});

test("decision validation is an actionable gated five-step flow", async () => {
  const page = await readProjectFile("src/renderer/features/decision/pages/DecisionPage.tsx");

  assert.match(page, /const \[activeStep, setActiveStep\]/);
  assert.match(page, /onClick=\{\(\) => setActiveStep\(index\)\}/);
  assert.match(page, /disabled=\{locked\}/);
  assert.match(page, /selectedEvidence\.length > 0/);
  assert.match(page, /selectedCounterEvidence\.length > 0/);
  assert.match(page, /selectedAssumptions\.length > 0/);
  assert.match(page, /disabled=\{!scored\}/);
});
