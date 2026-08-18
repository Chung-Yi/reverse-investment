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

test("preserves 12 UI workspaces and 17 story-node traceability without exposing internal IDs", async () => {
  const productPagePaths = [
    "welcome/pages/WelcomePage.tsx",
    "onboarding/pages/OnboardingPage.tsx",
    "profile/pages/ProfilePage.tsx",
    "plan/pages/PlanPage.tsx",
    "explore/pages/ExplorePage.tsx",
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

  for (const route of ["welcome", "home", "onboarding", "profile", "plan", "explore", "instrument", "decision", "thesis", "tracking", "change"]) {
    assert.match(metadata, new RegExp(`id: "${route}"`));
  }
  assert.match(drawer, /AI 對話助理/);
  assert.match(metadata, /story: "15–17"/);
  assert.doesNotMatch(productPages.join("\n"), /Screen\s+\d/i);
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

test("plan research directions scale without mixing abstract types or duplicate next actions", async () => {
  const [planSuggestions, planPage, explorePage, planFixture, instrumentFixture] = await Promise.all([
    readProjectFile("src/renderer/features/plan/components/PlanResearchSuggestions.tsx"),
    readProjectFile("src/renderer/features/plan/pages/PlanPage.tsx"),
    readProjectFile("src/renderer/features/explore/pages/ExplorePage.tsx"),
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
  assert.match(explorePage, /上一組/);
  assert.match(explorePage, /下一組/);
  assert.match(explorePage, /上一頁/);
  assert.match(explorePage, /下一頁/);
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
