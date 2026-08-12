const routes = {
  welcome: { journey: "開始", page: "產品介紹" },
  onboarding: { journey: "建立輪廓", page: "目標與條件" },
  profile: { journey: "理解自己", page: "投資輪廓" },
  plan: { journey: "建立規劃", page: "我的投資規劃" },
  home: { journey: "首頁", page: "總覽" },
  explore: { journey: "投資探索", page: "方向與候選標的" },
  instrument: { journey: "投資探索", page: "標的詳細分析" },
  decision: { journey: "決策驗證", page: "理由與雙重評分" },
  thesis: { journey: "我的論點", page: "論點卡" },
  tracking: { journey: "心跳追蹤", page: "追蹤中心" },
  change: { journey: "心跳追蹤", page: "重要變化" },
};

const questions = [
  {
    title: "這次投資最想完成什麼目標？",
    hint: "先選擇方向，之後仍可在規劃頁調整。",
    options: ["退休準備", "購屋準備", "教育基金", "資產累積"],
  },
  {
    title: "希望多久後達成？",
    hint: "投資期間會影響可承受的波動與規劃方式。",
    options: ["3 年內", "3–5 年", "5–10 年", "10 年以上"],
  },
  {
    title: "目前每月可投入的狀況？",
    hint: "原型不預填金額，正式產品會提供金額輸入與試算。",
    options: ["已有明確金額", "仍在評估", "以單筆資金為主"],
  },
  {
    title: "你目前的投資經驗？",
    hint: "這會影響說明深度，不代表風險承受能力。",
    options: ["剛開始了解", "有一些投資經驗", "能閱讀基本資料"],
  },
  {
    title: "市場明顯下跌時，你較接近哪種感受？",
    hint: "請依真實反應選擇，沒有標準答案。",
    options: ["希望波動較小", "可接受適度波動", "可接受較大波動"],
  },
  {
    title: "這筆資金何時可能需要使用？",
    hint: "資金用途與流動性會影響客觀風險承受能力。",
    options: ["可能短期使用", "中期可能使用", "可長期投入"],
  },
];

const aiCopy = {
  home: ["我的規劃目前最需要注意什麼？", "如何閱讀心跳追蹤？"],
  plan: ["可否解釋目標可行性？", "投入條件改變會影響什麼？"],
  profile: ["意願與能力為什麼不同？", "如何理解我的投資輪廓？"],
  explore: ["這些方向如何符合我的條件？", "候選標的是如何篩選的？"],
  instrument: ["用白話解釋這個標的", "有哪些風險需要先確認？"],
  decision: ["幫我檢查這段投資理由", "兩個分數的差別是什麼？"],
  thesis: ["論點卡之後可以修改嗎？", "哪些變化會影響原始理由？"],
  tracking: ["目前有哪些訊號值得留意？", "心跳追蹤不是報酬追蹤嗎？"],
  change: ["這個變化為什麼重要？", "它如何影響我的原始論點？"],
  onboarding: ["為什麼需要這些資料？", "資料之後還可以修改嗎？"],
  welcome: ["這個產品如何協助我？", "它會直接推薦買賣嗎？"],
};

const state = {
  route: "home",
  question: 0,
  answers: {},
};

const screens = [...document.querySelectorAll("[data-screen]")];
const sidebar = document.querySelector(".sidebar");
const overlay = document.querySelector(".overlay");
const aiDrawer = document.querySelector(".ai-drawer");

function setRoute(route, { updateHash = true } = {}) {
  if (!routes[route]) route = "home";
  state.route = route;

  screens.forEach((screen) => {
    const active = screen.dataset.screen === route;
    screen.hidden = !active;
    screen.classList.toggle("active", active);
  });

  document.querySelector("#journeyLabel").textContent = routes[route].journey;
  document.querySelector("#pageLabel").textContent = routes[route].page;

  document.querySelectorAll(".nav-list [data-route], .bottom-nav [data-route]").forEach((item) => {
    const active = item.dataset.route === route ||
      (["instrument", "decision"].includes(route) && item.dataset.route === "explore") ||
      (route === "change" && item.dataset.route === "tracking");
    item.classList.toggle("active", active);
    if (active) item.setAttribute("aria-current", "page");
    else item.removeAttribute("aria-current");
  });

  closePanels();
  window.scrollTo({ top: 0, behavior: "smooth" });
  if (updateHash) history.replaceState(null, "", `#${route}`);
}

function closePanels() {
  sidebar?.classList.remove("open");
  aiDrawer?.classList.remove("open");
  aiDrawer?.setAttribute("aria-hidden", "true");
  overlay?.classList.remove("open");
  document.body.classList.remove("no-scroll");
}

function openAI(prompt = "") {
  const suggestions = aiCopy[state.route] || aiCopy.home;
  const context = document.querySelector("#aiContext");
  const list = document.querySelector("#suggestions");
  const input = document.querySelector("#aiInput");

  context.textContent = `${routes[state.route].journey} · ${routes[state.route].page}`;
  list.replaceChildren(...suggestions.map((text) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "suggestion-button";
    button.textContent = text;
    button.addEventListener("click", () => {
      input.value = text;
      input.focus();
    });
    return button;
  }));

  if (prompt) input.value = prompt;
  aiDrawer.classList.add("open");
  aiDrawer.setAttribute("aria-hidden", "false");
  overlay.classList.add("open");
  document.body.classList.add("no-scroll");
  window.setTimeout(() => input.focus(), 120);
}

function showToast(message) {
  document.querySelector(".toast")?.remove();
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.setAttribute("role", "status");
  toast.textContent = message;
  document.body.append(toast);
  window.setTimeout(() => toast.classList.add("is-visible"), 10);
  window.setTimeout(() => {
    toast.classList.remove("is-visible");
    window.setTimeout(() => toast.remove(), 200);
  }, 3200);
}

function renderQuestion() {
  const question = questions[state.question];
  const title = document.querySelector("#questionTitle");
  const hint = document.querySelector("#questionHelp");
  const options = document.querySelector("#questionOptions");
  const previous = document.querySelector("#prevQuestion");
  const next = document.querySelector("#nextQuestion");

  if (!title || !hint || !options) return;
  title.textContent = question.title;
  hint.textContent = question.hint;
  options.replaceChildren(...question.options.map((text) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "answer-option";
    button.textContent = text;
    button.classList.toggle("selected", state.answers[state.question] === text);
    button.addEventListener("click", () => {
      state.answers[state.question] = text;
      renderQuestion();
      if (state.question === 1) {
        const summary = document.querySelector("#summaryTerm");
        if (summary) summary.textContent = text;
      }
    });
    return button;
  }));

  document.querySelectorAll("[data-step]").forEach((step, index) => {
    step.classList.toggle("active", index === state.question);
    step.classList.toggle("done", index < state.question || Boolean(state.answers[index]));
  });
  document.querySelector("#questionProgress").textContent = `第 ${state.question + 1} 題，共 ${questions.length} 題`;
  document.querySelector("#questionKicker").textContent = ["我的目標", "目標期限", "投入能力", "投資經驗", "波動感受", "資金需求"][state.question];
  document.querySelector("#progressBar").style.width = `${((state.question + 1) / questions.length) * 100}%`;
  previous.disabled = state.question === 0;
  next.disabled = !state.answers[state.question];
  next.textContent = state.question === questions.length - 1 ? "查看我的投資輪廓" : "下一題";
}

function setExplorePanel(panel) {
  document.querySelectorAll("[data-explore-tab]").forEach((tab) => {
    const active = tab.dataset.exploreTab === panel;
    tab.classList.toggle("active", active);
    tab.setAttribute("aria-selected", String(active));
  });
  document.querySelectorAll("[data-explore-panel]").forEach((item) => {
    item.hidden = item.dataset.explorePanel !== panel;
  });
}

function setChangeStep(step) {
  document.querySelectorAll("[data-change-step]").forEach((button) => {
    const active = button.dataset.changeStep === step;
    button.classList.toggle("active", active);
    button.setAttribute("aria-current", active ? "step" : "false");
  });
  document.querySelectorAll("[data-change-panel]").forEach((panel) => {
    panel.hidden = panel.dataset.changePanel !== step;
  });
}

document.addEventListener("click", (event) => {
  const routeButton = event.target.closest("[data-route]");
  if (routeButton) setRoute(routeButton.dataset.route);

  const aiButton = event.target.closest("[data-ai]");
  if (aiButton) openAI(aiButton.dataset.ai || "");

  const exploreTab = event.target.closest("[data-explore-tab]");
  if (exploreTab) setExplorePanel(exploreTab.dataset.exploreTab);

  if (event.target.closest("[data-explore-next]")) setExplorePanel("candidates");

  const changeStep = event.target.closest("[data-change-step]");
  if (changeStep) setChangeStep(changeStep.dataset.changeStep);

  const chip = event.target.closest(".chip");
  if (chip) {
    chip.parentElement.querySelectorAll(".chip").forEach((item) => item.classList.remove("active"));
    chip.classList.add("active");
  }

  const nextChange = event.target.closest("[data-next-change]");
  if (nextChange) {
    const current = Number(document.querySelector("[data-change-step].active")?.dataset.changeStep || 0);
    setChangeStep(String(Math.min(2, current + 1)));
  }
});

document.querySelector("#menuToggle")?.addEventListener("click", () => {
  sidebar.classList.add("open");
  overlay.classList.add("open");
  document.body.classList.add("no-scroll");
});

document.querySelector("#closeAI")?.addEventListener("click", closePanels);
overlay?.addEventListener("click", closePanels);

document.querySelector("#prevQuestion")?.addEventListener("click", () => {
  state.question = Math.max(0, state.question - 1);
  renderQuestion();
});

document.querySelector("#nextQuestion")?.addEventListener("click", () => {
  if (!state.answers[state.question]) return;
  if (state.question === questions.length - 1) setRoute("profile");
  else {
    state.question += 1;
    renderQuestion();
  }
});

document.querySelectorAll("[data-step]").forEach((step, index) => {
  step.addEventListener("click", () => {
    if (index <= state.question || state.answers[index - 1]) {
      state.question = index;
      renderQuestion();
    }
  });
});

const reasonInput = document.querySelector("#reason");
const scoreButton = document.querySelector("#scoreButton");
reasonInput?.addEventListener("input", () => {
  scoreButton.disabled = reasonInput.value.trim().length < 10;
});
scoreButton?.addEventListener("click", () => {
  document.querySelector("#scorePanel")?.scrollIntoView({ behavior: "smooth", block: "center" });
  showToast("此為靜態原型；正式版本串接評分服務後才會產生結果。 ");
});

document.querySelector("#aiDrawer footer button")?.addEventListener("click", () => {
  showToast("AI 服務尚未串接，原型目前僅展示互動與資訊架構。 ");
});

document.querySelector("#aiInput")?.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    showToast("AI 服務尚未串接，原型目前僅展示互動與資訊架構。 ");
  }
});

document.querySelector("#previewChange")?.addEventListener("click", () => setRoute("change"));

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closePanels();
});

window.addEventListener("hashchange", () => setRoute(location.hash.slice(1), { updateHash: false }));

const initialRoute = location.hash.slice(1);
setRoute(routes[initialRoute] ? initialRoute : "home", { updateHash: false });
renderQuestion();
setExplorePanel("directions");
setChangeStep("0");
