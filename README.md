# 逆思投資｜AI 智慧投資顧問

逆思投資是一個以「個人目標」為起點的投資研究與決策整理工具。產品會先協助使用者理解自己的目標、資金條件與風險輪廓，再逐步進入投資規劃、方向探索、決策驗證、論點卡與心跳追蹤。

目前專案為 **Version 1 前端 Demo**：

- 使用 Electron、React、TypeScript 與 Vite。
- 使用固定且可重現的競賽假資料。
- 不需要後端、Python、資料庫或 API Key 即可操作。
- AI 對話使用固定 Mock 回答，不會連線外部 LLM。
- 不提供買賣指令，所有內容僅用於展示研究與決策整理流程。

後端與 LLM Agent 整合預計在 Version 2 補充。

## 1. 環境需求

開發前請先準備：

- macOS、Windows 或 Linux
- Node.js `22.11.0` 以上
- npm（安裝 Node.js 時會一併安裝）

確認版本：

```bash
node -v
npm -v
```

目前專案為了相容開發環境，暫時鎖定 Electron `39.8.10`。正式發布安裝檔前，應先升級 Node.js，再將 Electron 更新到仍受官方支援的版本。

## 2. 第一次安裝

先開啟終端機，切換到你存放專案的上層目錄，再進入專案：

```bash
cd codex_electron
```

如果你已經在 VS Code 或其他編輯器中開啟本專案，且終端機目前所在目錄就是專案根目錄，可以略過這一步。

可以用以下方式確認目前位置：

```bash
pwd
```

Windows PowerShell 可以使用：

```powershell
Get-Location
```

專案根目錄中應該可以看到 `package.json`、`src/`、`docs/` 與 `README.md`。

安裝依賴：

```bash
npm install
```

通常只有第一次下載專案、`package.json` 更新，或 `node_modules` 不存在時需要重新執行。

## 3. 啟動 Electron 桌面版

```bash
npm run dev
```

這個指令會依序：

1. 啟動 React／Vite 開發伺服器。
2. 建置 Electron Main process。
3. 建置 Electron Preload。
4. 開啟「逆思投資」Electron 視窗。

開發期間修改 React 或 CSS 後，畫面會自動更新。

停止程式：

```text
在執行 npm run dev 的終端機按 Control + C
```

## 4. 只啟動瀏覽器前端

如果目前只想開發或檢查 RWD 畫面，可以執行：

```bash
npm run dev:web
```

接著在瀏覽器開啟：

```text
http://127.0.0.1:5173/
```

瀏覽器模式與 Electron 使用同一套 React Renderer，但不會提供 Electron Preload API。

## 5. Demo 操作流程

### 5.1 產品介紹

點擊左上角「逆思投資」品牌，可以回到產品介紹頁。

選擇：

> 開始建立我的目標

進入目標與個人條件問卷。

### 5.2 建立目標與個人條件

依序完成六個問題：

1. 我的目標
2. 目標期限
3. 投入能力
4. 投資經驗
5. 波動感受
6. 資金需求

每一題選擇答案後，按「下一題」。完成後進入「我的投資輪廓」。

目前問卷答案只保留在當次 React 工作階段，後續輪廓與規劃仍使用固定 Demo fixture，尚未由問卷答案即時計算。

### 5.3 查看投資輪廓

這個畫面會分開呈現：

- 風險承受意願：使用者心理上願意承受多少風險。
- 風險承受能力：使用者的期限與資金條件可以承受多少風險。
- 所需風險：目標可能需要承擔的風險程度。

三者不可合併成單一風險分數。

按「查看我的投資規劃」進入下一步。

### 5.4 查看投資規劃

投資規劃示範三層資金結構：

- 核心配置
- 成長配置
- 彈性資金

同時顯示部位上限、集中度門檻與需要重新檢視規劃的條件。

按「探索投資方向」繼續。

### 5.5 投資方向與候選標的

「投資方向」頁籤用來理解研究方向與個人目標的關聯。

切換到「候選標的」後，可以查看：

- 候選標的名稱與類型
- 值得研究的原因
- 研究條件符合度
- 個人初步適合度

所有候選標的均為明確標示的競賽假資料，不代表真實商品推薦。

按「查看詳細分析」進入標的分析。

### 5.6 標的詳細分析

畫面由淺入深呈現：

- 核心摘要
- 示範財務與資料指標
- 支持證據
- 不同觀點
- 關鍵假設

可展開各分析區塊，也可以按「詢問 AI」開啟目前情境的 AI Drawer。

按「開始決策驗證」進入五步驟流程。

### 5.7 五步驟決策驗證

決策驗證必須依序完成：

1. **投資理由**：至少輸入 20 個字，說明為什麼關注這個標的。
2. **支持證據**：至少選擇一項與理由相關的證據。
3. **不同觀點**：至少納入一項反方觀點。
4. **關鍵假設**：至少選擇一項投資理由成立所依賴的條件。
5. **重要觀察**：輸入具體觀察條件，也可以使用畫面提供的 Demo 門檻。

完成規則：

- 完成目前步驟後才會解鎖下一步。
- 已完成步驟會顯示 `✓`，並可返回修改。
- 修改任何內容後，需要重新更新雙重評分。
- 五個步驟完成後，按「更新雙重評分」。
- 評分完成後，才能按「建立我的論點卡」。

### 5.8 雙重評分

系統會分開顯示：

- **標的成立度**：標的本身是否具備值得持續研究的條件。
- **個人適合度**：標的與使用者目標、輪廓及規劃的關聯。

兩個分數不會合併成單一推薦分數。

### 5.9 我的論點卡

論點卡會整理：

- 使用者的投資理由
- 支持證據
- 不同觀點
- 關鍵假設
- 重要觀察條件
- 標的成立度
- 個人適合度

目前論點卡仍使用固定 Demo fixture；決策驗證過程中的修改尚未永久保存或寫入後端。

按「查看追蹤狀態」進入心跳追蹤。

### 5.10 心跳追蹤與重要變化

心跳追蹤會同時關注：

- 標的資訊
- 投資理由與關鍵假設
- 使用者個人條件

Demo 內建一項「產業集中度接近觀察門檻」的示範事件。

按「查看重要變化」後，依序操作：

1. 了解發生什麼變化。
2. 查看 AI 如何連結原始假設與個人目標。
3. 選擇保持判斷、更新理由、更新觀察條件或調整規劃。
4. 完成後回到心跳追蹤。

### 5.11 AI 對話助理

AI Drawer 可以從側邊欄或支援 AI 的畫面開啟。

Version 1 的 AI 行為：

- 承接目前所在畫面名稱。
- 以逐字效果顯示固定 Mock 回答。
- 不會發送網路請求。
- 不會呼叫 OpenAI API 或 Python Agent。
- 不會替使用者做買賣決定。

## 6. 常用開發指令

| 指令 | 用途 |
|---|---|
| `npm run dev` | 啟動 Vite 與 Electron 桌面版 |
| `npm run dev:web` | 只啟動瀏覽器版 React Renderer |
| `npm run typecheck` | 執行 TypeScript 型別檢查 |
| `npm test` | 執行目前的架構與流程測試 |
| `npm run build` | 建置 Main、Preload 與 Renderer |
| `npm run preview` | 先正式建置，再以 Electron 開啟結果 |

提交程式碼前建議執行：

```bash
npm test
npm run build
```

## 7. 專案目錄

```text
src/
├── main/                   Electron Main process
├── preload/                contextBridge 與允許公開的桌面 API
├── renderer/               React 前端
│   ├── app/                App 入口、Context、路由資訊
│   ├── components/         共用 UI 與 Layout
│   ├── features/           各產品工作區
│   ├── data/
│   │   ├── fixtures/       Version 1 固定假資料
│   │   └── repositories/   資料來源介面與 Mock 實作
│   ├── services/agent/     可替換的 AgentProvider
│   ├── hooks/              跨功能 React hooks
│   └── styles/             Design tokens、共用樣式與 RWD
└── shared/                 Main、Preload、Renderer 共用型別
    ├── contracts/          Desktop／Agent 邊界契約
    └── domain/             投資領域型別
```

其他重要目錄：

```text
docs/product/               目前產品需求與畫面規格
docs/architecture/          Electron 與未來 Agent 架構
docs/references/            產品規劃簡報
prototype/                  舊 HTML／RWD 視覺與互動參考
tests/                      自動化測試
```

`prototype/` 不是正式 React 執行入口，請勿在其中繼續開發正式功能。
