# Reverse Investment Frontend Project

## Product versions and delivery priority

- This repository contains the frontend and desktop application for the Reverse Investment competition project.
- Version 1 is a complete, polished, deterministic frontend demo using mock data.
- Version 1 does not integrate a backend, Python Agent, OpenAI API, or other live LLM service.
- Version 2 adds backend and LLM Agent integration after the Version 1 frontend is complete and verified.
- Build the production frontend with Electron, React, TypeScript, and Vite.
- Keep the existing `prototype/` implementation as a visual and interaction reference until the React replacement is verified.

## Source of truth

Before changing product behavior or screen structure, consult these sources in order:

1. `docs/product/01_Product_Story.md` through `docs/product/06_Generate_Prompt.md`
2. `docs/architecture/electron-python-agent-architecture-report.html`
3. `docs/references/逆思投資_產品規劃文件總覽.pptx`
4. `prototype/` for the current HTML/RWD interaction reference

Treat files under `docs/references/archive/` as historical references only. Do not use archived material to override the current product documents or architecture.

## Product and UI scope

- Implement 12 UI workspaces while preserving traceability to all 17 documented Story Nodes.
- Screen 10 is a contextual global AI drawer, not a standalone route.
- Story Nodes 15, 16, and 17 form one stepped important-change workspace.
- Keep risk willingness, risk capacity, and required risk as separate concepts.
- Keep instrument validity and personal suitability as separate scores; never merge them into one recommendation score.
- The product supports research and decision organization. It must not present itself as issuing buy or sell instructions.

## Frontend architecture

- Use TypeScript in strict mode.
- Keep Electron Main, Preload, Renderer, and shared contracts separated under `src/`.
- The Renderer must not import Node.js or Electron privileged APIs directly.
- Expose only allowlisted, typed APIs through Preload `contextBridge`.
- Keep API keys, secrets, process management, filesystem access, and network credentials out of the Renderer.
- Pages must not invoke raw IPC channels. Route desktop capabilities through typed services or providers.
- Prefer small, reusable components and feature-oriented modules over large page components.
- Reuse shared design tokens for color, typography, spacing, radius, elevation, and responsive breakpoints.

## Required source layout

Organize production code by runtime boundary first, then by product feature:

```text
src/
├── main/                         # Electron Main process only
│   ├── index.ts
│   ├── windows/                  # BrowserWindow creation and lifecycle
│   ├── ipc/                      # Typed IPC handlers
│   └── agent/                    # Version 2 process/provider integration
│       └── providers/
├── preload/                      # contextBridge allowlist only
│   ├── index.ts
│   └── bridges/
├── renderer/                     # React application; browser-safe code only
│   ├── app/                      # App bootstrap, providers, router, route metadata
│   ├── routes/                   # Thin route-level composition
│   ├── components/
│   │   ├── ui/                   # Generic primitives: Button, Card, Input, Modal
│   │   ├── layout/               # AppShell, Sidebar, Topbar, BottomNavigation
│   │   └── feedback/             # Loading, Empty, Error, Offline states
│   ├── features/                 # Product behavior grouped by workspace
│   │   ├── welcome/
│   │   ├── onboarding/
│   │   ├── profile/
│   │   ├── plan/
│   │   ├── home/
│   │   ├── explore/
│   │   ├── instrument/
│   │   ├── decision/
│   │   ├── thesis/
│   │   ├── tracking/
│   │   ├── change/
│   │   └── assistant/
│   ├── data/
│   │   ├── fixtures/             # Version 1 deterministic demo records
│   │   └── repositories/         # Interfaces and mock implementations
│   ├── services/
│   │   └── agent/                # Agent gateway and provider selection
│   ├── hooks/                    # Truly cross-feature React hooks
│   ├── styles/                   # tokens.css, globals.css, responsive foundations
│   └── assets/                   # App-owned static images and icons
└── shared/                       # Runtime-neutral TypeScript only
    ├── contracts/                # IPC and Agent request/event contracts
    ├── domain/                   # Shared domain types
    └── schemas/                  # Boundary validation schemas when needed
```

Do not create every optional child directory in advance. Add a directory when it receives its first real file.

## React file placement rules

- Put a component in `renderer/components/ui` only when it is generic, product-language-free, and reused across features.
- Put application chrome and responsive navigation in `renderer/components/layout`.
- Put loading, empty, error, and offline presentation in `renderer/components/feedback`.
- Put product-specific components beside their owning feature, for example `features/profile/components/RiskSummary.tsx`.
- Route files should compose feature pages and pass route context; they should not contain domain calculations or data fixtures.
- A feature may contain `components/`, `pages/`, `hooks/`, `services/`, and `types.ts` when those files are feature-specific.
- Keep tests beside the unit they cover as `*.test.ts` or `*.test.tsx`; keep cross-route end-to-end tests under `tests/e2e/`.
- Use PascalCase for React component files, `useCamelCase` for hooks, and descriptive camelCase names for utilities and services.
- Avoid vague catch-all files or directories such as `helpers.ts`, `common/`, or `misc/`. Name code after its responsibility.
- Do not move a feature component into shared UI merely because it is visually reusable; share it only after its API is stable and product-neutral.
- Prefer CSS Modules for feature/component styles and CSS custom properties from `renderer/styles/tokens.css` for shared design values.
- Do not import from another feature's private internals. Promote genuinely shared contracts or UI to the appropriate shared location.

## Data and Agent boundaries

- React components must not own or hard-code their data source.
- Access product data through typed repositories or services.
- Access AI behavior through a typed `AgentProvider` boundary.
- Preserve a stable minimum Agent contract equivalent to:
  - `submitMessage(payload)`
  - `stop(requestId)`
  - `onEvent(callback)`
- Support these minimum event categories:
  - `message.delta`
  - `message.completed`
  - `agent.error`
- In Version 1, use only a mock provider and deterministic fixtures.
- Keep provider implementations replaceable so Version 2 can use a Python Agent process or an OpenAI-backed provider without rewriting the Renderer.
- Version 2 Python integration uses Electron Main process management and JSONL over stdin/stdout unless the architecture document is intentionally revised.

## Demo and mock data

- Mock data is allowed for the competition demo.
- Store deterministic fixtures under a dedicated mock or fixture module; do not scatter literals across React components.
- Clearly label demo financial content as competition demonstration data and not real-time market information.
- Keep loading, empty, success, partial, offline, and error states distinguishable.
- Do not fabricate a source, timestamp, calculation result, or AI response and present it as verified or live.
- The Version 1 demo must be fully usable without a live Python Agent, backend, or external AI service.

## Responsive and interaction requirements

- Support desktop, tablet, and mobile layouts from the same component system.
- Desktop may use sidebar navigation; mobile should use an appropriate compact or bottom navigation pattern.
- Preserve keyboard focus visibility, semantic controls, labels, and reasonable color contrast.
- AI output should support progressive streaming without causing layout jumps or losing the current screen context.

## Working agreements for Codex

- Before editing, confirm the working directory is this repository and inspect the relevant source-of-truth files.
- Do not modify product documents, presentations, archived references, or the static prototype unless the task explicitly requires it.
- Preserve unrelated user changes and avoid destructive Git or filesystem operations.
- Do not add production dependencies unless they are necessary for the requested implementation; explain material additions.
- Use subagents only for bounded, independent work such as read-only review, test analysis, or separate non-overlapping modules.
- Avoid parallel agents editing the same files.
- Add a repository skill only after a workflow is stable and repeated enough to benefit from reuse.
- Add command rules or MCP integrations only when they solve a demonstrated recurring need.

## Validation and handoff

- After TypeScript changes, run the available typecheck and relevant tests.
- After UI changes, verify the affected route at desktop and mobile widths when browser testing is available.
- After Electron Main or Preload changes, verify the security boundary and IPC types.
- After Agent contract changes, verify mock-provider compatibility before relying on a live provider.
- Report what changed, what was verified, and any remaining mock or unconnected behavior.
