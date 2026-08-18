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
