# 05_Design_Guide

## 1. 文件定位

本文件承接：

- `01_Product_Story.md`
- `02_User_Story.md`
- `03_App_Story_Flow.md`
- `04_Screen_Spec.md`

本文件回答：

> **「這些畫面要怎麼長得像同一個 App？」**

本產品採取 **Web-first、App-adaptive** 的設計策略：

```text
產品故事
 ↓
Web 版完整體驗
 ↓
建立共用 Design System
 ↓
App 版體驗轉換
```

Web 與 App 使用同一套：

- 產品語言
- 資訊架構
- 核心元件
- 視覺語言
- 投資概念
- 使用者旅程

App 版本則依據：

- 螢幕尺寸
- 觸控操作
- 單手使用
- 資訊密度

進行版面重新編排。

核心原則：

> **同一個產品、同一套設計語言，先建立完整 Web 體驗，再自然延伸至 App。**

---

# 2. 產品 UI 語言

## 2.1 使用者介面統一使用繁體中文

本產品為繁體中文產品。

所有使用者可直接看到的：

- 頁面標題
- Section 標題
- Card 標題
- Button
- CTA
- Tooltip
- 表單文字
- 問卷內容
- AI 對話文字
- 提示文字
- Empty State
- Loading State
- Error State
- Notification

皆以**繁體中文**呈現。

---

## 2.2 Web 與 App 共用產品詞彙

Web 與 App 不因版型不同而改變核心產品名稱。

統一使用：

- 我的目標
- 問卷卡
- 投資風險儀表板
- 我的投資輪廓
- 投資規劃
- 投資方向探索
- 投資標的
- AI 對話助理
- 決策驗證
- 雙重評分
- 標的成立度
- 個人適合度
- 我的論點卡
- 心跳追蹤
- 重要變化
- 原始假設

例如：

Web 顯示：

> **我的投資輪廓**

App 同樣顯示：

> **我的投資輪廓**

不因裝置改變產品概念名稱。

---

## 2.3 Figma Component 技術命名

Figma Component 的技術命名可以使用英文，以方便：

- 元件管理
- Design System
- Codex 生成
- 前端實作
- Web / App 共用元件

例如：

```text
Button/Primary
Button/Secondary

Card/Summary
Card/Data
Card/Insight
Card/Evidence
Card/Alert

Investment/RiskIndicator
Investment/RadarProfile
Investment/ScoreCard
Investment/ThesisCard
Investment/MonitoringCard

AI/Entry
AI/Chat
AI/Insight
```

但這些名稱屬於**設計與開發命名**，不直接顯示給使用者。

例如：

```text
Figma Component
Investment/RadarProfile

UI 顯示
我的投資輪廓
```

---

# 3. 整體設計方向

## 3.1 核心設計感受

視覺需要傳達：

- 清楚
- 專業
- 理性
- 穩定
- 智慧
- 陪伴感
- 決策脈絡

使用者看到產品時，應感受到：

> **這是一個從我的目標出發，陪我理解自己、建立投資規劃、驗證投資理由，並持續掌握重要變化的智慧投資產品。**

---

# 4. 核心設計原則

## 4.1 從目標開始

產品的視覺故事從：

> **我的目標**

開始，而不是直接從投資標的開始。

主要脈絡：

```text
我的目標
 ↓
我的條件
 ↓
我的投資輪廓
 ↓
我的投資規劃
 ↓
投資方向
 ↓
投資標的
 ↓
投資理由
 ↓
重要變化
```

---

## 4.2 先理解自己，再理解投資

前段畫面需要建立：

- 目標
- 個人條件
- 風險輪廓
- 投資輪廓

再進入：

- 投資規劃
- 投資探索
- 標的分析
- 決策驗證

---

## 4.3 資訊由淺入深

採用：

```text
核心摘要
 ↓
白話解釋
 ↓
圖表／卡片
 ↓
詳細資料
 ↓
深入分析
```

投資新手可以停留在容易理解的資訊層。

有一點投資資歷的使用者可以繼續深入。

兩者維持相同產品旅程。

---

# 5. Web-first 設計策略

## 5.1 Web 是完整產品體驗的基準

第一階段先完成 Web 版。

Web 需要完整呈現：

- 導航
- 目標
- 問卷
- 風險儀表板
- 投資輪廓
- 雷達圖
- 投資規劃
- 投資方向
- 投資標的
- AI 對話助理
- 決策驗證
- 雙重評分
- 論點卡
- 心跳追蹤
- 重要變化

---

## 5.2 Web 版資訊密度

Web 可以善用較大的螢幕空間：

```text
主要內容
+
Supporting Panel
+
AI / Context Panel
```

例如：

```text
┌─────────────────────────────────────┐
│ Navigation                          │
├─────────────────────────────────────┤
│ Page Header                         │
├──────────────────────┬──────────────┤
│                      │              │
│  Main Content        │ Supporting   │
│                      │ / AI Panel   │
│                      │              │
└──────────────────────┴──────────────┘
```

但主要資訊仍需要保持清楚的視覺優先順序。

---

# 6. App-adaptive 設計策略

## 6.1 App 是 Web 體驗的延伸

App 不建立另一套產品邏輯。

App 使用：

- 相同產品名稱
- 相同資訊架構
- 相同 Design Token
- 相同 Component 概念
- 相同核心旅程

再依行動裝置重新編排。

---

## 6.2 App 版面原則

優先：

```text
單欄
 ↓
Card
 ↓
Section
 ↓
主要 CTA
```

必要時使用：

- Bottom Sheet
- Tab
- Accordion
- Horizontal Scroll
- Sticky CTA
- Bottom Navigation

---

## 6.3 Web → App 的轉換方式

### Web

可以：

```text
兩欄
三欄
側欄
完整表格
```

### App

轉換為：

```text
單欄
分段 Card
橫向滑動
展開詳細資訊
Bottom Sheet
```

核心內容保持一致。

---

# 7. Design System

## 7.1 Color Token

建立共用色彩角色：

```text
color/primary
color/secondary
color/background
color/surface
color/text-primary
color/text-secondary
color/border
color/success
color/attention
color/information
```

Web 與 App 共用同一組 Design Token。

---

## 7.2 Typography Token

建立：

```text
Display
Page Title
Section Title
Card Title
Body
Caption
```

Web 與 App 可使用不同字級比例，但維持相同資訊層級。

---

## 7.3 Spacing Token

建議：

```text
4
8
12
16
24
32
48
64
```

Web 與 App 共用 spacing 語意。

App 可以使用較緊湊的實際尺寸。

---

## 7.4 Radius Token

建立一致的：

- Small
- Medium
- Large

避免不同畫面使用完全不同的圓角語言。

---

# 8. Layout 系統

## 8.1 Web

建立：

- Page Container
- Grid
- Column
- Section
- Card
- Sidebar
- Content Panel

確保主要內容具有一致水平對齊。

---

## 8.2 App

建立：

- Safe Area
- Page Container
- Section
- Card
- Bottom Navigation
- Bottom Sheet
- Sticky CTA

---

# 9. Card 系統

Card 是本產品重要的資訊容器。

## 9.1 摘要卡

Figma：

```text
Card/Summary
```

UI：

> 摘要卡

用途：

- 目標摘要
- 投資輪廓摘要
- 投資規劃摘要

---

## 9.2 資料卡

Figma：

```text
Card/Data
```

UI：

> 資料卡

用途：

- 財務資料
- 估值
- 投資指標

---

## 9.3 洞察卡

Figma：

```text
Card/Insight
```

UI：

> 洞察卡

用途：

- AI 解讀
- 投資洞察
- 重要分析

---

## 9.4 證據卡

Figma：

```text
Card/Evidence
```

UI：

> 證據卡

用途：

- 支持證據
- 不同觀點
- 關鍵資料

---

## 9.5 重要變化卡

Figma：

```text
Card/Alert
```

UI：

> 重要變化

用途：

- 重大變化
- 原始假設影響
- 下一步

---

## 9.6 行動卡

Figma：

```text
Card/Action
```

UI：

> 下一步

用途：

- 引導使用者完成目前主要任務

---

# 10. 問卷卡設計

## 10.1 核心定位

問卷不是傳統表單。

它是：

> **陪使用者一步一步建立投資輪廓的互動體驗。**

---

## 10.2 單卡單問題

每張卡聚焦一個問題。

例如：

> **希望多久後達成？**

---

## 10.3 進度

使用者需要清楚知道目前進度。

例如：

```text
✓ 我的目標
✓ 目標期限
● 每月投入
○ 投資經驗
○ 風險承受度
```

---

## 10.4 Web

Web 可使用：

- 左側進度
- 中央問卷卡
- 右側 AI 協助

---

## 10.5 App

App 可使用：

- 頂部進度
- 中央問卷卡
- 底部主要 CTA
- AI 浮動入口

---

# 11. 投資風險儀表板

## 11.1 核心目的

讓使用者看懂：

> **我的投資條件是什麼？**

---

## 11.2 四大資訊區塊

```text
我的目標
我的資源
我的風險輪廓
我的投資條件
```

---

## 11.3 Web

可使用：

```text
┌────────────┬────────────┐
│ 我的目標    │ 我的資源    │
├────────────┼────────────┤
│ 我的風險輪廓│ 投資條件    │
└────────────┴────────────┘
```

---

## 11.4 App

轉換為：

```text
我的目標
↓
我的資源
↓
我的風險輪廓
↓
我的投資條件
```

---

# 12. 我的投資輪廓與雷達圖

## 12.1 定位

雷達圖是：

> **我的投資輪廓的視覺化摘要。**

---

## 12.2 建議維度

- 成長需求
- 投資期限
- 波動承受度
- 資金彈性
- 投資經驗

---

## 12.3 Web

雷達圖可以與文字解讀並排：

```text
┌────────────────┬─────────────────┐
│                │ 我的投資輪廓     │
│    雷達圖       │ 一句話摘要       │
│                │ 主要特徵         │
└────────────────┴─────────────────┘
```

---

## 12.4 App

雷達圖可以置於：

```text
標題
 ↓
雷達圖
 ↓
一句話摘要
 ↓
主要特徵
```

---

## 12.5 雷達圖文字輔助

不能只提供圖形。

一定要搭配：

- 一句話總結
- 主要特徵
- 必要的數值／文字

確保使用者即使不理解雷達圖，也能理解自己的投資輪廓。

---

# 13. 投資規劃設計

## 13.1 核心感受

使用者需要感受到：

> **「這是依據我的目標與條件形成的規劃。」**

---

## 13.2 Web

可以使用：

```text
我的目標
+
我的投資輪廓
+
我的規劃
+
配置方向
+
重要條件
```

---

## 13.3 App

依序呈現：

```text
我的目標
 ↓
我的投資輪廓
 ↓
我的規劃
 ↓
配置方向
 ↓
重要條件
```

---

# 14. 投資方向探索

## 14.1 方向卡

每個方向使用一致 Card。

內容：

- 名稱
- 一句話定位
- 核心特色
- 與目標的關聯
- 個人適合度摘要

---

## 14.2 Web

可使用 Grid：

```text
方向 A
方向 B
方向 C
```

---

## 14.3 App

使用：

```text
方向 A
↓
方向 B
↓
方向 C
```

或水平滑動 Card。

---

# 15. 投資標的設計

## 15.1 候選標的卡

內容：

```text
標的名稱
一句話摘要
標的成立度
個人適合度
研究理由
查看分析
```

---

## 15.2 詳細分析

使用：

```text
核心摘要
 ↓
核心資料
 ↓
財務資料
 ↓
估值
 ↓
支持證據
 ↓
不同觀點
 ↓
關鍵假設
 ↓
個人適合度
```

Web 可以使用 Tab、側欄或多欄。

App 使用 Section、Accordion 或 Bottom Sheet。

---

# 16. AI 對話助理

## 16.1 核心定位

AI 對話助理是：

> **理解投資資訊與建立投資思考的共同助手。**

---

## 16.2 UI 顯示文字

統一使用：

> **AI 對話助理**

AI 入口可以使用：

> **問問 AI**

或：

> **和 AI 一起理解**

---

## 16.3 Web

可以使用：

```text
Main Content
+
AI Side Panel
```

也可以從主要內容開啟對話。

---

## 16.4 App

使用：

- Full Screen Chat
- Bottom Sheet
- Floating Entry

但 AI 仍保留目前畫面的上下文。

---

## 16.5 AI 回應結構

優先：

```text
結論
 ↓
原因
 ↓
證據
 ↓
下一步
```

重要內容可以轉換成：

- 洞察卡
- 證據卡
- 關鍵假設卡
- 觀察卡

---

# 17. 決策驗證

## 17.1 核心視覺流程

```text
我的投資理由
 ↓
支持證據
 ↓
不同觀點
 ↓
關鍵假設
 ↓
重要觀察
```

---

## 17.2 Web

可採用：

- Step
- Section
- Card
- 右側摘要

---

## 17.3 App

採用：

- Step
- Card
- Accordion
- Sticky CTA

---

# 18. 雙重評分

## 18.1 核心概念

清楚呈現：

```text
標的成立度
      ×
個人適合度
```

---

## 18.2 評分卡

Figma：

```text
Investment/ScoreCard
```

UI：

> 評分卡

每個評分搭配：

- 分數
- 狀態
- 主要原因
- 詳細資訊入口

---

## 18.3 Web

可以並排：

```text
標的成立度
個人適合度
```

---

## 18.4 App

上下排列：

```text
標的成立度
↓
個人適合度
```

---

# 19. 我的論點卡

## 19.1 定位

論點卡是：

> **使用者投資思考的長期記錄。**

---

## 19.2 核心內容

```text
投資標的
 ↓
我的投資理由
 ↓
支持證據
 ↓
不同觀點
 ↓
關鍵假設
 ↓
觀察指標
 ↓
標的成立度
 ↓
個人適合度
```

---

## 19.3 Web

可以使用完整 Card 或 Detail Panel。

## 19.4 App

使用完整 Card，詳細資訊採展開方式呈現。

---

# 20. 心跳追蹤

## 20.1 核心定位

心跳追蹤的核心是：

> **持續觀察投資理由與原始假設的重要變化。**

---

## 20.2 平時狀態

呈現：

- 目前狀態
- 最新觀察
- 關鍵指標
- 原始假設狀態

---

## 20.3 重大變化

重大變化需要清楚呈現：

```text
發生什麼
 ↓
影響哪個原始假設
 ↓
與投資理由的關聯
 ↓
與我的目標的關聯
 ↓
下一步可以檢視什麼
```

---

## 20.4 推播文字

重大變化通知需要直接說明：

> **發生什麼 + 影響哪個原始假設 + 下一步**

避免只提供：

> 「價格變動」

或單一行情資訊。

---

# 21. 重要變化畫面

第一眼：

> **發生什麼**

第二層：

> **為什麼值得關注**

第三層：

> **影響哪個原始假設**

第四層：

> **下一步可以如何理解**

---

# 22. 導航設計

## 22.1 Web Navigation

建議主要導航：

- 首頁／總覽
- 我的規劃
- 投資探索
- 我的論點
- 心跳追蹤

AI 作為跨頁入口。

---

## 22.2 App Navigation

建議使用 Bottom Navigation：

- 首頁
- 我的規劃
- 探索
- 我的論點
- 追蹤

AI 可以作為全域入口。

---

# 23. 首頁／總覽

首頁優先呈現：

## 我的目標

- 目標金額
- 目標期限
- 目前進度

## 我的投資規劃

- 目前狀態
- 主要配置方向

## 我的論點

- 目前追蹤的投資理由

## 心跳追蹤

- 最新重要變化

## AI

> **今天想了解什麼？**

---

# 24. CTA 設計

## Primary CTA

目前最重要的下一步。

例如：

> **查看我的投資規劃**

## Secondary CTA

進一步查看資訊。

例如：

> **查看詳細分析**

## Tertiary Action

編輯或補充。

例如：

> **編輯我的條件**

---

# 25. 文案設計原則

## 25.1 使用正向語言

優先：

- 了解
- 探索
- 建立
- 查看
- 驗證
- 掌握
- 更新
- 調整
- 發現
- 深入理解

---

## 25.2 CTA 具體

優先：

> **查看我的投資輪廓**

而非：

> 繼續

優先：

> **了解這項變化**

而非：

> 查看

優先：

> **更新我的投資理解**

而非：

> 確定

---

# 26. Empty State

空狀態需要提供下一步。

例如：

> **開始建立你的投資目標**

> 設定目標金額與期限，一步一步建立你的投資規劃。

CTA：

> **建立我的目標**

---

# 27. Loading State

Loading 需要說明正在完成什麼。

例如：

> **正在整理你的投資輪廓…**

> **正在分析投資資料…**

> **正在整理投資理由…**

> **正在檢視重要變化…**

---

# 28. Error State

錯誤狀態採正向、可行動的文字。

例如：

> **資料目前需要重新整理**

> 請稍後再試一次。

CTA：

> **重新整理**

---

# 29. Accessibility

需要考慮：

- 足夠文字對比
- 清楚字級
- 清楚 Focus
- 鍵盤操作
- 觸控操作
- 不依賴單一色彩
- 圖表搭配文字摘要

尤其：

> **雷達圖、評分、狀態、重要變化都需要提供文字輔助。**

---

# 30. Responsive 設計原則

## Web

優先：

- Desktop
- Large Desktop
- Tablet

## App

優先：

- iOS
- Android

核心原則：

> **資訊架構一致，版面配置適應裝置。**

---

# 31. Web → App 的設計轉換表

| 功能 | Web | App |
|---|---|---|
| 導航 | Top / Side Navigation | Bottom Navigation |
| 問卷 | 中央問卷卡＋進度 | 單欄問卷卡＋進度 |
| 風險儀表板 | 多卡並排 | 單欄卡片 |
| 雷達圖 | 圖表＋文字並排 | 圖表上下排列 |
| 投資規劃 | 多欄資訊 | 單欄 Section |
| 投資探索 | Grid | 單欄／橫向 Card |
| 詳細分析 | Tab／側欄 | Accordion／Bottom Sheet |
| AI | Side Panel | Full Screen／Bottom Sheet |
| 決策驗證 | Step＋多欄 | Step＋單欄 |
| 雙重評分 | 並排 | 上下排列 |
| 論點卡 | 完整 Card | 可展開 Card |
| 心跳追蹤 | Dashboard | Card＋時間序列 |
| 重要變化 | Alert Panel | Alert Card |
| 主要 CTA | Page CTA | Sticky CTA |

---

# 32. Component System

## 基礎元件

```text
Button
Input
Select
Checkbox
Radio
Tag
Icon
Tooltip
```

## 內容元件

```text
Card/Summary
Card/Data
Card/Insight
Card/Evidence
Card/Alert
Card/Action
```

## 投資元件

```text
Investment/RiskIndicator
Investment/RadarProfile
Investment/ScoreCard
Investment/ThesisCard
Investment/MonitoringCard
```

## AI 元件

```text
AI/Entry
AI/Chat
AI/Insight
AI/SuggestedQuestion
```

---

# 33. Component 命名與 UI 文字規則

## 技術命名

可以使用英文：

```text
Investment/RadarProfile
Investment/ScoreCard
AI/Insight
```

## UI 顯示

使用繁體中文：

```text
我的投資輪廓
評分
AI 洞察
```

---

# 34. Figma Design Token

Web 與 App 共用：

```text
Color
Typography
Spacing
Radius
Shadow
Border
Icon
```

不同裝置只調整：

- 尺寸
- 間距
- 排列
- 互動方式

不改變核心視覺語言。

---

# 35. Prototype 原則

第一階段先建立 Web Prototype：

```text
開始
 ↓
建立我的目標
 ↓
問卷卡
 ↓
投資風險儀表板
 ↓
我的投資輪廓／雷達圖
 ↓
我的投資規劃
 ↓
投資方向探索
 ↓
投資標的
 ↓
AI 對話助理
 ↓
決策驗證
 ↓
雙重評分
 ↓
我的論點卡
 ↓
心跳追蹤
 ↓
重要變化
 ↓
AI 解讀
 ↓
更新投資理解
```

完成 Web 後，再將相同 Prototype 轉換成 App 版。

---

# 36. Web → App 的內容原則

轉換時：

### 保留

- 核心內容
- 核心產品名稱
- 使用者旅程
- 投資資料
- AI 能力
- 決策驗證
- 心跳追蹤

### 重新編排

- 欄位
- Card 排列
- 導航
- CTA 位置
- 詳細資訊呈現方式

核心原則：

> **App 是同一段產品故事在行動裝置上的自然延伸。**

---

# 37. 新手與有一點投資資歷

兩類使用者共用：

- 相同產品名稱
- 相同畫面
- 相同核心流程
- 相同 Design System

差異透過資訊深度呈現：

```text
核心摘要
 ↓
白話解釋
 ↓
詳細資料
 ↓
深入分析
```

因此可以：

> **同一個 App，同一套設計語言，不同的資訊深度。**

---

# 38. 最終 Design Principle

整體設計濃縮成：

> **1. 從我的目標開始。**

> **2. 先理解自己，再理解投資。**

> **3. Web 先建立完整體驗，再自然延伸至 App。**

> **4. Web 與 App 共用同一套繁體中文產品語言。**

> **5. 讓投資資料轉化成可以理解的投資理由。**

> **6. 讓重要變化連結到原始假設與下一步。**

> **7. 用同一套設計語言陪伴不同投資經驗的使用者。**

最終希望使用者在 Web 與 App 中都能感受到：

> **「我知道自己現在在哪裡、正在理解什麼，也知道下一步可以怎麼走。」**
