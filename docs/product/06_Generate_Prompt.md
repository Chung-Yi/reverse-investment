# 06_Generate_Prompt

## 1. 文件定位

本文件承接：

- `01_Product_Story.md`
- `02_User_Story.md`
- `03_App_Story_Flow.md`
- `04_Screen_Spec.md`
- `05_Design_Guide.md`

本文件回答：

> **如何把前述產品故事、使用者旅程、Screen 規格與 Design System，交給 Codex 產生一致的 Figma Web Prototype，並進一步延伸為 App Prototype？**

本文件：

> **不重新定義產品。**

本文件只負責：

- 將產品故事轉成生成指令
- 將 17 個 Screen 轉成 Prototype
- 將 05 的 Design Guide 轉成可執行的 UI 規則
- 定義 Navigation
- 定義 CTA
- 定義 AI 互動
- 定義資料承接
- 定義 Web → App 轉換
- 定義 Prototype 品質檢查

---

# 2. 上游文件關係

Codex 必須按照以下順序理解：

```text
01_Product_Story
        ↓
定義產品故事
        ↓
02_User_Story
        ↓
定義使用者與使用情境
        ↓
03_App_Story_Flow
        ↓
定義完整使用者旅程
        ↓
04_Screen_Spec
        ↓
定義 17 個 Screen 與互動
        ↓
05_Design_Guide
        ↓
定義視覺語言與 Design System
        ↓
06_Generate_Prompt
        ↓
轉換成 Prototype 生成規格
        ↓
Codex
        ↓
Figma Web Prototype
        ↓
Figma App Prototype
```

`01～05` 是產品內容與設計來源。

`06` 不得與上述文件重新定義不同的產品邏輯。

---

# 3. 最重要的生成原則

請從：

> **使用者的財務目標**

開始建立完整產品旅程。

使用者需要逐步完成：

```text
目標
 ↓
個人條件
 ↓
風險與投資輪廓
 ↓
投資規劃
 ↓
投資方向
 ↓
投資標的
 ↓
標的理解
 ↓
決策驗證
 ↓
雙重評分
 ↓
投資論點
 ↓
心跳追蹤
 ↓
重要變化
 ↓
AI 解讀
 ↓
更新投資理解
 ↓
持續追蹤
```

產品的核心不是：

> 「告訴使用者買什麼。」

而是：

> **「讓使用者從自己的目標與條件出發，逐步理解投資、形成自己的投資理由，並持續檢視重要變化。」**

---

# 4. 使用者體驗核心

完成 Prototype 後，使用者應該隨時知道：

### 我現在在哪裡？

### 我正在理解什麼？

### 這些資訊為什麼和我有關？

### 下一步可以做什麼？

因此每個主要 Screen 都必須具備：

```text
Page Title
+
目前任務
+
核心資訊
+
主要 CTA
```

必要時增加：

- 返回
- Breadcrumb
- Progress
- AI 入口
- 編輯入口

---

# 5. 使用者類型

產品服務兩類主要使用者：

## User A｜投資新手

需要：

- 清楚的步驟
- 白話說明
- 核心摘要
- AI 解釋
- 明確下一步

---

## User B｜有一點投資資歷

需要：

- 快速掌握重點
- 詳細資料
- 財務資訊
- 估值
- 支持證據
- 不同觀點
- 關鍵假設

---

## 共同規則

不要建立兩套 UI。

兩者使用：

```text
同一套核心畫面
+
同一套核心流程
+
同一套資訊架構
+
同一套 Design System
```

資訊深度採：

```text
核心摘要
 ↓
白話解釋
 ↓
進階資料
 ↓
深入分析
```

這與 02、05 所定義的「一致核心畫面 × 一致核心流程 × 漸進資訊深度」一致。

---

# 6. Web-first、App-adaptive

第一階段：

> **建立完整 Web Prototype。**

第二階段：

> **將同一產品故事轉換成 App。**

App 不是另一套產品。

App 必須維持：

- 相同 Screen
- 相同產品名稱
- 相同資訊架構
- 相同核心流程
- 相同 Component 概念
- 相同 Design Token

只調整：

- 尺寸
- 排列
- 資訊密度
- 觸控方式
- Navigation

05 已明確將 Web-first、App-adaptive 定為設計策略，因此 Codex 不得把 Web 與 App 做成兩套不同產品。

---

# 7. UI 語言

所有使用者可見文字：

> **繁體中文**

包含：

- Page Title
- Section Title
- Button
- CTA
- Card
- Tooltip
- Form
- Questionnaire
- AI 對話
- Notification
- Empty State
- Loading State
- Error State

---

# 8. 固定產品詞彙

Web 與 App 必須統一使用以下名稱：

```text
我的目標
問卷卡
投資風險儀表板
我的投資輪廓
投資規劃
投資方向探索
候選投資標的
標的詳細分析
AI 對話助理
決策驗證
雙重評分
標的成立度
個人適合度
我的論點卡
心跳追蹤
重要變化
AI 解讀重要變化
更新投資理解與規劃
原始假設
```

不要在不同畫面任意改名。

例如：

不要：

```text
我的投資輪廓
→ 投資人格
→ 投資 DNA
→ Risk Profile
```

統一：

> **我的投資輪廓**

---

# 9. Figma 技術命名

Figma Component 可以使用英文。

例如：

```text
Button/Primary
Button/Secondary

Input/Text
Input/Number
Input/Select

QuestionCard

Card/Summary
Card/Data
Card/Insight
Card/Evidence
Card/Alert
Card/Action

Investment/RiskIndicator
Investment/RadarProfile
Investment/ScoreCard
Investment/ThesisCard
Investment/MonitoringCard

AI/Entry
AI/Chat
AI/Insight
AI/SuggestedQuestion
```

技術名稱不直接顯示給使用者。

---

# 10. 固定 Screen 清單

Prototype 必須建立完整的 17 個 Screen：

```text
Screen 01｜歡迎／開始
Screen 02｜我的目標
Screen 03｜我的個人條件
Screen 04｜投資風險儀表板
Screen 05｜我的投資輪廓
Screen 06｜我的投資規劃
Screen 07｜投資方向探索
Screen 08｜候選投資標的
Screen 09｜標的詳細分析
Screen 10｜AI 對話助理
Screen 11｜決策驗證
Screen 12｜雙重評分
Screen 13｜我的論點卡
Screen 14｜心跳追蹤
Screen 15｜重要變化提醒
Screen 16｜AI 解讀重要變化
Screen 17｜更新投資理解與規劃
```

**不得增加或刪除主要 Screen。**

---

# 11. 主流程

主要 Prototype Flow 必須是：

```text
01
 ↓
02
 ↓
03
 ↓
04
 ↓
05
 ↓
06
 ↓
07
 ↓
08
 ↓
09
 ↓
11
 ↓
12
 ↓
13
 ↓
14
 ↓
15
 ↓
16
 ↓
17
 ↓
14
```

注意：

> **Screen 10 不在主流程中。**

---

# 12. Screen 10 AI 的特殊 Navigation

Screen 10 是：

> **共同 AI 互動介面。**

不是：

> **主流程中的必經步驟。**

例如：

```text
Screen 09
標的詳細分析
       ↓
問問 AI
       ↓
Screen 10
AI 對話助理
       ↓
返回 Screen 09
```

而不是：

```text
Screen 09
 ↓
Screen 10
 ↓
Screen 11
```

Screen 09 的主要 CTA 仍然是：

> **開始決策驗證**

因此：

```text
Screen 09 → Screen 11
```

是主要流程。

---

# 13. Screen 14～17 持續循環

Prototype 必須形成：

```text
Screen 14
心跳追蹤
   ↓
Screen 15
重要變化提醒
   ↓
Screen 16
AI 解讀重要變化
   ↓
Screen 17
更新投資理解與規劃
   ↓
Screen 14
心跳追蹤
```

這是產品的長期循環。

不是一次性流程。

---

# 14. Screen 01｜歡迎／開始

## 目的

讓使用者理解：

> **這是一個從我的目標開始的投資規劃工具。**

主要呈現：

- 品牌
- 核心產品價值
- 簡短產品說明

主要 CTA：

> **開始建立我的目標**

Navigation：

```text
01 → 02
```

---

# 15. Screen 02｜我的目標

## 核心任務

建立：

- 目標名稱
- 目標金額
- 目標期限
- 每月投入
- 目前資源

依 04 的畫面規格逐步詢問，不一次顯示大型表單。

採：

> **一張問卷卡聚焦一個主要問題。**

---

## UI

使用：

```text
QuestionCard
Progress
Input
Select
AI/Entry
Button/Primary
```

---

## 主要 CTA

> **繼續了解我的投資條件**

Navigation：

```text
02 → 03
```

---

# 16. Screen 03｜我的個人條件

建立：

- 可投入資金
- 每月投入能力
- 資金使用需求
- 投資經驗
- 波動感受
- 可承受損失
- 現有投資狀況
- 其他必要條件

採單卡單問題。

AI 可以協助：

- 解釋題目
- 解釋選項
- 提供白話例子

AI 不直接替使用者決定答案。

主要 CTA：

> **查看我的投資風險**

Navigation：

```text
03 → 04
```

---

# 17. Screen 04｜投資風險儀表板

完成問卷後，將使用者條件整理成四個主要區塊：

```text
我的目標
+
我的資源
+
我的風險輪廓
+
我的投資條件
```

使用：

```text
Card/Summary
Card/Data
Investment/RiskIndicator
```

核心感受：

> **「這些是形成我的投資規劃的重要條件。」**

主要 CTA：

> **看懂我的投資輪廓**

Navigation：

```text
04 → 05
```

---

# 18. Screen 05｜我的投資輪廓

使用：

```text
Investment/RadarProfile
```

建議維度：

- 成長需求
- 投資期限
- 波動承受度
- 資金彈性
- 投資經驗

雷達圖不能獨立存在。

必須搭配：

- 一句話摘要
- 主要特徵
- 文字解讀

例如：

> **你的投資輪廓偏向穩健成長。**

主要 CTA：

> **查看我的投資規劃**

Navigation：

```text
05 → 06
```

---

# 19. Screen 06｜我的投資規劃

依據：

```text
我的目標
+
我的資源
+
我的投資輪廓
+
風險條件
```

形成個人化投資規劃。

需要呈現：

- 配置方向
- 比例／區間
- 角色
- 規劃原因
- 重要條件

AI 入口：

> **為什麼這樣規劃？**

AI 回應：

```text
規劃形成原因
 ↓
與目標的關聯
 ↓
與投資輪廓的關聯
 ↓
後續觀察重點
```

主要 CTA：

> **探索投資方向**

Navigation：

```text
06 → 07
```

---

# 20. Screen 07｜投資方向探索

每個方向使用一致 Card。

包含：

- 方向名稱
- 一句話定位
- 核心特色
- 與目標關聯
- 個人適合度摘要
- 值得研究的原因

可：

- 瀏覽
- 篩選
- 比較
- 查看詳細方向
- 詢問 AI

主要 CTA：

> **查看候選標的**

Navigation：

```text
07 → 08
```

---

# 21. Screen 08｜候選投資標的

建立候選標的卡。

至少呈現：

```text
標的名稱
一句話摘要
標的成立度
個人適合度
值得研究的原因
查看詳細分析
```

核心感受：

> **「為什麼這個標的值得進一步理解？」**

重要：

候選標的不是：

> 「系統叫我買這個。」

而是：

> **「值得進一步研究的候選對象。」**

主要 CTA：

> **查看詳細分析**

Navigation：

```text
08 → 09
```

---

# 22. Screen 09｜標的詳細分析

資訊採由淺入深：

```text
核心摘要
 ↓
投資特色
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

不要第一眼顯示所有資訊。

使用：

```text
Card/Summary
Card/Data
Card/Evidence
Card/Insight
Accordion
Tab
```

Web 可使用：

- Tab
- 側欄
- 多欄

App 可使用：

- Accordion
- Section
- Bottom Sheet

主要 CTA：

> **開始決策驗證**

Navigation：

```text
09 → 11
```

AI 入口：

```text
09 → 10
```

完成 AI 互動後：

```text
10 → 返回 09
```

---

# 23. Screen 10｜AI 對話助理

## 定位

AI 是：

> **整個 App 的共同理解能力。**

不是獨立產品流程。

---

## 可以從以下畫面進入

```text
02 我的目標
03 我的個人條件
04 投資風險儀表板
05 我的投資輪廓
06 我的投資規劃
07 投資方向探索
09 標的詳細分析
11 決策驗證
13 我的論點卡
14 心跳追蹤
15 重要變化提醒
```

---

## AI 回應結構

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

AI 回應可以轉成：

- 洞察卡
- 證據卡
- 關鍵假設卡
- 觀察指標卡
- 投資理由
- 個人適合度說明

---

## Context

AI 必須知道使用者目前所在的畫面。

例如：

使用者在 Screen 09 問：

> 「這個標的和我的目標有什麼關係？」

AI 必須理解：

```text
我的目標
+
我的投資輪廓
+
我的投資規劃
+
目前標的
```

而不是只回答一般性的金融問題。

---

## 返回規則

AI 完成後：

> **返回原本使用者所在的畫面。**

不要無故把使用者送往另一個流程。

---

# 24. Screen 11｜決策驗證

核心目的：

> **整理與檢視自己的投資理由。**

核心流程：

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

使用：

```text
Step
Section
Card
```

AI 可以協助：

- 整理理由
- 找出支持證據
- 補充不同觀點
- 歸納關鍵假設
- 整理觀察指標

但：

> **投資理由必須保持為使用者自己的判斷。**

主要 CTA：

> **查看雙重評分**

Navigation：

```text
11 → 12
```

---

# 25. Screen 12｜雙重評分

必須清楚呈現兩個不同維度：

```text
標的成立度
       ×
個人適合度
```

兩者不得合併成單一推薦分數。

---

## 標的成立度

回答：

> **這個標的本身有哪些值得持續研究的條件？**

可包含：

- 基本面
- 財務資料
- 估值
- 支持證據
- 不同觀點
- 關鍵假設

---

## 個人適合度

回答：

> **這個標的與我的投資規劃有什麼關聯？**

可包含：

- 目標期限
- 投資輪廓
- 風險承受度
- 部位條件
- 集中度
- 資金需求
- 投資規劃

---

## ScoreCard

每個分數需要：

- 分數
- 狀態
- 主要原因
- 詳細資訊

不能只顯示：

```text
82
76
```

必須讓使用者知道：

> **「為什麼得到這個結果？」**

主要 CTA：

> **建立我的論點卡**

Navigation：

```text
12 → 13
```

---

# 26. Screen 13｜我的論點卡

建立可長期追蹤的投資判斷紀錄。

內容：

```text
投資標的
我的投資理由
與我的目標關聯
支持證據
不同觀點
關鍵假設
觀察指標
標的成立度
個人適合度
```

使用：

```text
Investment/ThesisCard
Card/Summary
Card/Evidence
Card/Insight
```

提供：

- 查看
- 編輯
- 更新
- 啟用心跳追蹤

主要 CTA：

> **開始心跳追蹤**

Navigation：

```text
13 → 14
```

---

# 27. Screen 14｜心跳追蹤

核心定位：

> **持續觀察投資理由、原始假設與個人規劃的重要變化。**

不是單純：

> 股票價格通知。

---

## 平時呈現

```text
目前狀態
最新觀察
關鍵指標
原始假設狀態
投資理由狀態
```

沒有重要變化：

> **目前沒有需要特別注意的重要變化。**

持續留在 Screen 14。

---

## 有重要變化

顯示：

> **發現值得你了解的重要變化。**

主要 CTA：

> **查看重要變化**

Navigation：

```text
14 → 15
```

---

# 28. Screen 15｜重要變化提醒

重要變化不是單純行情警示。

必須呈現：

```text
發生什麼
 ↓
影響哪個原始假設
 ↓
與投資理由有什麼關聯
 ↓
與我的目標有什麼關聯
 ↓
下一步可以檢視什麼
```

使用：

```text
Card/Alert
Card/Insight
Card/Action
```

不要只用紅色警告。

主要 CTA：

> **了解這項變化**

Navigation：

```text
15 → 16
```

---

# 29. Screen 16｜AI 解讀重要變化

AI 協助理解：

> **重要變化與原始投資判斷之間的關係。**

使用者可以問：

> 「這個變化代表什麼？」

> 「它影響我原本哪個假設？」

> 「這和我的投資理由有什麼關係？」

> 「這和我的目標有什麼關聯？」

> 「接下來可以觀察什麼？」

---

## AI 回應結構

```text
重要變化
 ↓
受到影響的原始假設
 ↓
投資理由關聯
 ↓
個人目標關聯
 ↓
下一步觀察方向
```

重要結果可以更新：

- 論點卡
- 關鍵假設
- 觀察條件
- 投資規劃

主要 CTA：

> **更新我的投資理解**

Navigation：

```text
16 → 17
```

---

# 30. Screen 17｜更新投資理解與規劃

讓使用者根據新的資訊更新自己的判斷。

可執行：

```text
維持目前判斷
或
更新投資理由
或
更新觀察條件
或
調整投資規劃
```

---

## 可更新內容

### 我的論點卡

- 投資理由
- 關鍵假設
- 觀察條件

### 投資規劃

- 目標
- 配置方向
- 部位條件
- 重要觀察

---

## 核心原則

更新不是：

> 「原本一定錯了。」

而是：

> **「根據新的資訊，我重新理解自己的投資判斷。」**

主要 CTA：

> **完成更新並持續追蹤**

Navigation：

```text
17 → 14
```

形成完整循環。

---

# 31. 完整 Prototype Navigation

Codex 必須建立：

```text
01
 ↓
02
 ↓
03
 ↓
04
 ↓
05
 ↓
06
 ↓
07
 ↓
08
 ↓
09
 ↓
11
 ↓
12
 ↓
13
 ↓
14
 ↓
15
 ↓
16
 ↓
17
 ↓
14
```

AI 支援流程：

```text
任何支援 AI 的 Screen
        ↓
       10
        ↓
返回原 Screen
```

---

# 32. AI Navigation 範例

## 從 Screen 06

```text
06 投資規劃
      ↓
   問問 AI
      ↓
10 AI 對話
      ↓
返回 06
```

---

## 從 Screen 09

```text
09 標的詳細分析
      ↓
   問問 AI
      ↓
10 AI 對話
      ↓
返回 09
```

---

## 從 Screen 11

```text
11 決策驗證
      ↓
   問問 AI
      ↓
10 AI 對話
      ↓
返回 11
```

---

## 從 Screen 15

```text
15 重要變化
      ↓
了解這項變化
      ↓
16 AI 解讀
```

注意：

Screen 15 → Screen 16 是產品故事中的特殊 AI 解讀流程。

這與一般「問問 AI → 返回原畫面」不同。

---

# 33. 資料承接規則

Prototype 中每一個 Screen 都必須看起來像是承接上一個 Screen 的結果。

---

## 目標

```text
Screen 02
```

建立：

- 目標
- 金額
- 期限

---

## 個人條件

```text
Screen 03
```

建立：

- 資源
- 投入能力
- 風險相關條件

---

## 風險儀表板

```text
Screen 04
```

整合：

```text
目標
+
資源
+
風險
+
投資條件
```

---

## 投資輪廓

```text
Screen 05
```

將上述資訊形成多維度投資輪廓。

---

## 投資規劃

```text
Screen 06
```

依：

```text
目標
+
資源
+
投資輪廓
+
風險條件
```

形成規劃。

---

## 投資方向

```text
Screen 07
```

必須看起來是：

> **從投資規劃延伸出來的研究方向。**

---

## 候選標的

```text
Screen 08
```

必須看起來是：

> **從投資方向延伸出的研究對象。**

---

## 標的分析

```text
Screen 09
```

必須承接：

- 候選標的
- 投資方向
- 個人條件

---

## 決策驗證

```text
Screen 11
```

必須承接：

- 標的資訊
- 支持證據
- 不同觀點
- 關鍵假設
- 使用者自己的投資理由

---

## 雙重評分

```text
Screen 12
```

必須同時承接：

```text
標的研究資訊
+
個人投資規劃
```

---

## 論點卡

```text
Screen 13
```

必須保存：

```text
投資理由
+
證據
+
不同觀點
+
關鍵假設
+
觀察指標
+
雙重評分
```

---

## 心跳追蹤

```text
Screen 14
```

承接：

```text
論點卡
+
原始假設
+
觀察條件
+
投資規劃
```

---

## 重要變化

```text
Screen 15
```

必須指出：

```text
發生什麼
+
影響哪個原始假設
+
與投資理由關聯
+
與目標關聯
```

---

## 更新

```text
Screen 17
```

更新：

```text
論點卡
+
關鍵假設
+
觀察條件
+
投資規劃
```

---

# 34. Web Layout

第一階段使用 Desktop-first。

基本結構：

```text
┌──────────────────────────────────────┐
│ Navigation                           │
├──────────────────────────────────────┤
│ Page Header                          │
├────────────────────────┬─────────────┤
│                        │             │
│ Main Content           │ Supporting  │
│                        │ / AI Panel  │
│                        │             │
└────────────────────────┴─────────────┘
```

共用：

- Container
- Grid
- Section
- Card
- Sidebar
- Content Panel

---

# 35. Web Navigation

主要 Navigation：

```text
首頁／總覽
我的規劃
投資探索
我的論點
心跳追蹤
```

AI：

> **AI 對話助理**

作為跨頁共同入口。

---

# 36. App Layout

第二階段轉換為 App。

基本：

```text
Safe Area
 ↓
Page Header
 ↓
Single Column
 ↓
Section
 ↓
Card
 ↓
Sticky CTA
 ↓
Bottom Navigation
```

必要時：

- Bottom Sheet
- Accordion
- Horizontal Card
- Full Screen Chat

---

# 37. Web → App 轉換

| Web | App |
|---|---|
| Top / Side Navigation | Bottom Navigation |
| 多欄 Card | 單欄 Card |
| Sidebar | Bottom Sheet |
| Tab | Accordion / Section |
| 完整表格 | 重點資料卡 |
| Side AI Panel | Full Screen / Bottom Sheet |
| 並排評分 | 上下排列 |
| Grid | 單欄／水平滑動 |
| Page CTA | Sticky CTA |

內容與產品名稱不能改變。

---

# 38. Design System

Codex 必須建立：

```text
Color
Typography
Spacing
Radius
Shadow
Icon
Grid
```

Design System 必須在：

```text
03_Design_System
```

集中管理。

---

# 39. Component System

建立可重複使用元件：

```text
Button
Input
Select
Checkbox
Radio

QuestionCard

SummaryCard
DataCard
InsightCard
EvidenceCard
AlertCard
ActionCard

RiskIndicator
RadarProfile
ScoreCard
ThesisCard
MonitoringCard

AIEntry
AIChat
AIInsight
AISuggestedQuestion
```

不要每個 Screen 各自重新設計相同元件。

---

# 40. Card System

所有 Card 必須保持：

- 一致 Padding
- 一致 Radius
- 一致 Border
- 一致 Typography
- 一致 Header
- 一致 Footer
- 一致 CTA 邏輯

---

## Card/Summary

用於：

- 我的目標
- 投資輪廓摘要
- 投資規劃摘要

---

## Card/Data

用於：

- 財務資料
- 估值
- 投資指標

---

## Card/Insight

用於：

- AI 解讀
- 投資洞察
- 重要分析

---

## Card/Evidence

用於：

- 支持證據
- 不同觀點
- 關鍵資料

---

## Card/Alert

用於：

- 重要變化
- 原始假設影響
- 下一步

---

## Card/Action

用於：

- 下一步
- 主要 CTA

---

# 41. AI Component System

建立：

```text
AI/Entry
AI/Chat
AI/Insight
AI/SuggestedQuestion
```

---

## AI/Entry

顯示：

> **問問 AI**

或：

> **和 AI 一起理解**

---

## AI/Chat

提供：

- 對話
- 問題
- AI 回應
- Suggested Questions

---

## AI/Insight

將 AI 回應轉成：

- 洞察
- 證據
- 關鍵假設
- 觀察條件

---

# 42. 資訊層級

整個產品遵守：

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

不要第一眼塞滿金融資訊。

---

# 43. 重要變化的視覺規則

重要變化不能設計成：

> 純紅色警告。

應該設計成：

```text
發生什麼
 ↓
影響哪個原始假設
 ↓
與投資理由的關聯
 ↓
與目標的關聯
 ↓
下一步
```

核心視覺感受：

> **清楚、重要、穩定。**

而不是：

> **緊張、恐慌、交易警報。**

---

# 44. Prototype Interaction

主要 CTA 必須真的可以點擊。

至少包括：

```text
開始建立我的目標
繼續了解我的投資條件
查看我的投資風險
看懂我的投資輪廓
查看我的投資規劃
探索投資方向
查看候選標的
查看詳細分析
問問 AI
開始決策驗證
查看雙重評分
建立我的論點卡
開始心跳追蹤
查看重要變化
了解這項變化
更新我的投資理解
完成更新並持續追蹤
```

Prototype 不可以只是：

> **17 張靜態畫面。**

必須能呈現：

> **完整故事與主要互動。**

---

# 45. 返回操作

每個非第一層流程 Screen 都應提供合理的：

> **返回**

返回不能破壞目前上下文。

尤其：

```text
Screen 09
 ↓
Screen 10
 ↓
返回 Screen 09
```

必須保持 Screen 09 原本的：

- 標的
- 滾動位置／主要情境
- 使用者問題上下文
- 已閱讀狀態

---

# 46. AI Context 規則

AI 不應該成為沒有上下文的聊天機器人。

AI 必須知道：

```text
目前 Screen
+
使用者目標
+
使用者條件
+
投資輪廓
+
投資規劃
+
目前標的
+
投資理由
+
原始假設
+
重要變化
```

依畫面需要使用其中相關資訊。

---

# 47. AI 的角色限制

AI 可以：

- 解釋
- 整理
- 比較
- 提供證據脈絡
- 補充不同觀點
- 歸納關鍵假設
- 整理觀察指標

AI 不應該將產品設計成：

> **「只要問 AI 就得到答案。」**

核心仍然是：

```text
使用者提供條件與想法
        ↓
AI 協助整理與分析
        ↓
使用者理解
        ↓
使用者形成自己的決策
```

這與 User Story 對 AI 的定位一致。

---

# 48. Visual Direction

整體視覺感受：

> **清晰 × 專業 × 理性 × 穩定 × 智慧 × 陪伴**

避免：

- 過度金融交易感
- 過度行情看盤感
- 過度資訊密集
- 過度警示
- 過度裝飾

產品應該像：

> **智慧投資陪伴與決策理解工具**

而不是：

> **交易終端機。**

---

# 49. Accessibility

需要：

- 足夠文字對比
- 清楚字級
- Clear Focus
- 鍵盤操作
- 觸控操作
- 不依賴單一顏色
- 圖表文字摘要

雷達圖：

> 必須有文字摘要。

雙重評分：

> 必須有文字原因。

重要變化：

> 必須有文字脈絡。

---

# 50. Figma Pages

建立：

```text
01_Web
02_App
03_Design_System
04_Components
```

---

## 01_Web

建立完整：

```text
01 → 02 → 03 → 04 → 05 → 06 → 07 → 08 → 09
                                      ↓
                                    11 → 12 → 13 → 14
                                                    ↓
                                               15 → 16 → 17
                                                    ↓
                                                    14
```

Screen 10：

> 作為跨畫面 AI Flow。

---

## 02_App

依相同 Screen 與資料結構建立 App 版本。

---

## 03_Design_System

集中：

- Color
- Typography
- Spacing
- Radius
- Shadow
- Icon
- Grid
- Responsive rules

---

## 04_Components

集中：

- Button
- Input
- QuestionCard
- SummaryCard
- DataCard
- InsightCard
- EvidenceCard
- AlertCard
- ActionCard
- RiskIndicator
- RadarProfile
- ScoreCard
- ThesisCard
- MonitoringCard
- AIEntry
- AIChat
- AIInsight

---

# 51. Prototype 建立順序

Codex 不要一開始同時製作全部細節。

建議順序：

## Phase 1

建立：

```text
Design System
+
Components
```

---

## Phase 2

建立：

```text
Screen 01
Screen 02
Screen 03
Screen 04
Screen 05
Screen 06
```

完成：

> 目標 → 個人條件 → 投資輪廓 → 投資規劃

---

## Phase 3

建立：

```text
Screen 07
Screen 08
Screen 09
```

完成：

> 探索 → 候選標的 → 詳細分析

---

## Phase 4

建立：

```text
Screen 10
Screen 11
Screen 12
Screen 13
```

完成：

> AI → 決策驗證 → 雙重評分 → 論點卡

---

## Phase 5

建立：

```text
Screen 14
Screen 15
Screen 16
Screen 17
```

完成：

> 心跳 → 重要變化 → AI 解讀 → 更新 → 回到心跳

---

# 52. Prototype 資料狀態

Prototype 可以使用示範資料。

但示範資料必須在不同 Screen 之間一致。

例如：

```text
目標金額
NT$3,000,000
```

如果 Screen 02 顯示：

> NT$3,000,000

Screen 04、05、06 不能突然變成：

> NT$5,000,000

除非 Prototype 明確示範：

> 使用者修改了目標。

---

# 53. Prototype 狀態

至少呈現：

## Default

正常狀態。

## Loading

資料載入。

## Empty

尚未建立資料。

## Error

資料無法載入。

## Editing

使用者正在修改。

## AI Loading

AI 正在分析。

## Important Change

發生重要變化。

---

# 54. 不要產生的設計

避免：

- 純行情看盤 App
- 純新聞 App
- 純聊天機器人
- 單純商品展示頁
- 新手／進階兩套 UI
- Web／App 兩套產品邏輯
- 沒有上下文的 AI
- 沒有文字解讀的雷達圖
- 只有分數沒有原因的雙重評分
- 只有價格通知的心跳追蹤
- 只有紅色警告的重要變化
- 一個畫面塞所有資訊
- Screen 09 強制經過 Screen 10 才能進入 Screen 11

---

# 55. 最終 Navigation Check

Codex 完成後必須確認：

```text
01 → 02
02 → 03
03 → 04
04 → 05
05 → 06
06 → 07
07 → 08
08 → 09
09 → 11
11 → 12
12 → 13
13 → 14
14 → 15
15 → 16
16 → 17
17 → 14
```

AI：

```text
支援 Screen
 ↓
10
 ↓
返回原 Screen
```

特殊 AI 解讀：

```text
15 → 16 → 17
```

---

# 56. 最終 Screen Check

Codex 必須確認以下 17 個 Screen 全部存在：

```text
✓ 01 歡迎／開始
✓ 02 我的目標
✓ 03 我的個人條件
✓ 04 投資風險儀表板
✓ 05 我的投資輪廓
✓ 06 我的投資規劃
✓ 07 投資方向探索
✓ 08 候選投資標的
✓ 09 標的詳細分析
✓ 10 AI 對話助理
✓ 11 決策驗證
✓ 12 雙重評分
✓ 13 我的論點卡
✓ 14 心跳追蹤
✓ 15 重要變化提醒
✓ 16 AI 解讀重要變化
✓ 17 更新投資理解與規劃
```

---

# 57. 五份上游文件一致性檢查

產生 Prototype 前，必須確認：

## 01 Product Story

是否：

> 從人生／財務目標開始？

---

## 02 User Story

是否：

> 同一套核心畫面服務新手與有一點投資資歷使用者？

---

## 03 App Story Flow

是否：

```text
目標
 ↓
現況
 ↓
風險
 ↓
規劃
 ↓
投資方向
 ↓
決策驗證
 ↓
雙重評分
 ↓
論點卡
 ↓
心跳追蹤
```

並持續循環？

---

## 04 Screen Spec

是否：

> 完整實作 Screen 01～17？

是否：

> Screen 09 → Screen 11 為主要流程？

是否：

> Screen 10 為共同 AI 能力？

是否：

> Screen 14 → 15 → 16 → 17 → 14？

---

## 05 Design Guide

是否：

- Web-first？
- App-adaptive？
- Design System 一致？
- Component 可重複？
- UI 使用繁體中文？
- Card 結構一致？
- 資訊由淺入深？

---

# 58. 最終產品故事

Prototype 完成後，使用者應該可以自然走完：

```text
我有一個想實現的財務目標
        ↓
我建立我的目標
        ↓
我整理我的個人條件
        ↓
我了解我的投資風險與條件
        ↓
我看到我的投資輪廓
        ↓
我理解我的投資規劃
        ↓
我探索投資方向
        ↓
我查看候選投資標的
        ↓
我理解投資標的
        ↓
我可以詢問 AI
        ↓
我進行決策驗證
        ↓
我查看雙重評分
        ↓
我建立自己的投資論點
        ↓
我開始心跳追蹤
        ↓
重要變化發生
        ↓
我理解這項變化
        ↓
我知道它影響哪個原始假設
        ↓
我透過 AI 進一步理解
        ↓
我更新我的投資理解與規劃
        ↓
我回到心跳追蹤
```

---

# 59. 最終產品核心

整個 Prototype 必須呈現：

> **從目標出發，以理解為核心，以投資理由為主軸，以重要變化追蹤形成持續的投資決策循環。**

---

# 60. 最終生成指令

請依照：

```text
01_Product_Story.md
+
02_User_Story.md
+
03_App_Story_Flow.md
+
04_Screen_Spec.md
+
05_Design_Guide.md
```

建立：

> **完整 Figma Web Prototype**

再建立：

> **對應的 Figma App Prototype**

---

## 生成優先順序

如果不同文件之間出現需要判斷的地方，遵循：

```text
產品故事
 >
使用者故事
 >
App Story Flow
 >
Screen Spec
 >
Design Guide
 >
Visual Design
```

但目前 01～05 已經形成一致規格，因此：

> **不得自行重新發明產品流程。**

---

## 最重要的限制

不要：

- 新增主要 Screen
- 刪除主要 Screen
- 修改 Screen 名稱
- 改變主要 Navigation
- 把 Screen 10 變成主流程必經頁
- 將雙重評分合併成單一分數
- 將心跳追蹤變成單純價格警示
- 將重要變化變成單純紅色警告
- 將 AI 變成沒有上下文的聊天機器人
- 為新手與進階使用者建立兩套產品
- 讓 Web 與 App 使用不同產品故事

---

# 61. 最終 Prototype 結構

最終應形成：

```text
                 ┌──────────────────┐
                 │   01～09 主流程   │
                 └────────┬─────────┘
                          ↓
                 ┌──────────────────┐
                 │   11 決策驗證     │
                 └────────┬─────────┘
                          ↓
                 ┌──────────────────┐
                 │   12 雙重評分     │
                 └────────┬─────────┘
                          ↓
                 ┌──────────────────┐
                 │   13 論點卡       │
                 └────────┬─────────┘
                          ↓
                 ┌──────────────────┐
                 │   14 心跳追蹤     │
                 └────────┬─────────┘
                          ↓
                 ┌──────────────────┐
                 │   15 重要變化     │
                 └────────┬─────────┘
                          ↓
                 ┌──────────────────┐
                 │   16 AI 解讀      │
                 └────────┬─────────┘
                          ↓
                 ┌──────────────────┐
                 │   17 更新理解     │
                 └────────┬─────────┘
                          ↓
                          14
```

而：

```text
        Screen 10
     AI 對話助理
          ↑ ↓
  ┌───────┼────────┐
  │       │        │
  02      06       09
  │       │        │
  11      13       14
          │
          15
```

代表：

> **AI 是貫穿產品的共同理解能力，而不是另一條獨立產品流程。**

---

# 62. 最終完成條件

只有當以下條件全部成立，才算完成：

```text
✓ 17 個 Screen 完整
✓ Screen 編號一致
✓ Screen 名稱一致
✓ 主流程一致
✓ AI 流程一致
✓ 追蹤循環一致
✓ 目標資料可以一路承接
✓ 個人條件可以一路承接
✓ 投資輪廓可以一路承接
✓ 投資規劃可以一路承接
✓ 投資標的可以一路承接
✓ 投資理由可以一路承接
✓ 原始假設可以一路承接
✓ 論點卡可以一路承接
✓ 重要變化可以回到原始假設
✓ 更新可以回到心跳追蹤
✓ Web / App 產品邏輯一致
✓ Design System 一致
✓ Component 可以重複使用
✓ 所有 UI 使用繁體中文
✓ 主要 CTA 可點擊
✓ Prototype 呈現完整故事
```

---

# 63. 最終一句話

> **請不要把這份文件當成重新設計產品的需求，而是把 01～05 已經定義好的產品故事、使用者旅程、17 個 Screen 與 Design System，忠實轉換成一個可以操作、可以驗證、可以延伸到 Web 與 App 的完整 Prototype。**