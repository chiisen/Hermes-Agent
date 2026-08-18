# Loop Engineering × Hermes 盤點

> 日期：2026-06-10
> 參考：Addy Osmani《Loop Engineering》(2026-06-07)
> 核心論點：你不再是「按按鈕叫 agent 做事」的人，你變成「設計一套會自己去按按鈕的系統」的人。

## 一句話總結

過去兩年你對 agent 是「打字 → 回 → 再打字」。Loop engineering 把這層抽掉，寫一個小系統自己找事、派工、驗收、記下結果、決定下一步，然後讓這個系統自己去戳 agent。

## 一個 Loop 需要 5 + 1 個元素

| # | 元素 | 角色 |
|---|------|------|
| 1 | Automations | 排程跑、discovery + triage 自動 |
| 2 | Worktrees | 隔離平行工作，兩隻 agent 不踩彼此 |
| 3 | Skills | 專案知識寫下來，別讓 agent 每次重猜 |
| 4 | Plugins / Connectors | MCP，把 agent 接上你已有的工具 |
| 5 | Sub-agents | 寫的人 ≠ 驗的人 |
| ＋ | State | 記住做過什麼、還有什麼（spine） |

---

## Hermes 對照盤點

### 1. Automations（自動排程 + discovery/triage）

- 狀態：✅ 完整
- 證據：`cronjob` 5 個全在跑，全部 `last_status: ok`（天氣/運勢/安全/更新/MemPalace）
- 缺口：
  - 5 個都是「純個人例行」，沒有「triages 進來 → 自動派工」的迴路
  - 缺「triage inbox」機制：cron 結果沒有統一 inbox，現在是直接交付或 silent
- 對照：heartbeat 有了，下游「自動指派」沒串起來

### 2. Worktrees（平行隔離）

- 狀態：❌ 完全沒有
- 證據：`delegate_task` 跑 sub-agent 是平行，但都在同一個 cwd、沒有隔離
- 缺口：
  - Hermes 委派子任務目前沒有 worktree 隔離
  - 多任務平行沒辦法保證不撞檔
- 對照：這是「超過 1 隻 agent 同跑就出問題」的那個洞，目前真要平行就得自管

### 3. Skills（專案知識寫下來）

- 狀態：⚠️ 有但失控
- 證據：
  - 88 個 skills 塞著、很多 use=0 或無 log
  - SOP：不知道差在哪 + use=0 → 砍
  - 保留：hermes-agent、systematic-debugging、security-monitoring、hermes-skill-inventory
  - `skill_manage` 有 create / patch / edit / delete / pin
- 缺口：
  - 沒有自動化機制讓 skills「該清的清、該留的留」
  - curator 之前撞 429 燒光餘額被關掉
  - 目前是手動清，沒有「agent 每次跑會自己撈對的 skill」這個自動匹配的可信度
- 對照：skill 系統有了，但品質與篩選是手動的、不是 loop 的一部分

### 4. Plugins / Connectors（接上 MCP 跟外部工具）

- 狀態：✅ 健全
- 證據：
  - `mcp` skill 群：有 native-mcp
  - `pi-mono-usage` 群有 pi-mono（ACP）
  - `mlops/inference`、`mlops/training` 群
  - 還有 feishu_doc、feishu_drive、discord、homeassistant 等
  - 排程裡 weather（CWA）、fortune、security_check 都在連外部
- 缺口：
  - 沒看到 Linear 整合（文章範例用 Linear 當 state）
  - 沒看到 GitHub Actions 串接
  - 沒有「loop 開 PR 自己回」的 connector
- 對照：日常工具接得很順，但「loop 自動開 PR + 更新 ticket」這層沒串

### 5. Sub-agents（寫的人 ≠ 驗的人）

- 狀態：⚠️ 有雛形但 maker/checker 沒分
- 證據：
  - `delegate_task` 可用，`tasks` 陣列模式支援 3 個並行
  - 但目前用法是「葉節點 worker」，沒有「同一個工作用兩個 agent 一個寫一個驗」的範本
  - 文章強調：Claude Code 的 /goal 就是用第二個模型判斷 done，Hermes 沒內建
- 缺口：
  - 沒有「adversarial review」子代理預設範本
  - 沒有 maker-checker split 的 skill
  - 沒看到任何子代理拿不同模型做驗證
- 對照：sub-agent 能力在，但「寫的跟驗的拆開」這個 pattern 還沒制度化

### 6. State（記住做過什麼、還有什麼）

- 狀態：✅ 完整（多源）
- 證據：
  - 專案根目錄有 AGENTS.md
  - Hindsight 是長期跨 session 記憶
  - MemPalace 排程每天 mine session
  - Skills 目錄就是 on-disk knowledge
  - `memory` 工具：target=memory/user，跨 session 注入
- 缺口：
  - 沒有「todo 系統跨 session 接力」這層 — 排程是 cron，session 是 session，中間缺「昨天做到哪」的接力欄
  - 對照文章，state 應該是「loop 之間銜接的 spine」，目前每個 cron 各自獨立、沒統一 board
- 對照：state 分散在多處，但沒有一個統一 board 把「昨天做到哪」串起來

---

## 摘要表

| 元素 | 狀態 | 等級 |
|------|------|------|
| Automations | ✅ 完整 | heartbeat 穩 |
| Worktrees | ❌ 沒有 | 平行風險 |
| Skills | ⚠️ 有但失控 | 品質/篩選手動 |
| Plugins/Connectors | ✅ 健全 | 缺 PR/ticket 串接 |
| Sub-agents | ⚠️ 雛形 | maker/checker 未拆 |
| State | ✅ 多源 | 缺統一 spine |

---

## 三個最高槓桿的改進點

1. **State 統一 spine**（最低成本、最高回報）
   - 把目前散落的 Hindsight、AGENTS.md、cron 結果收到一個 board/檔
   - 每天 cron 跑完前先讀「今天做到哪」

2. **Maker-checker sub-agent 範本**
   - 寫一個 skill：呼叫兩個 sub-agent（同任務、不同 model），一個寫一個驗
   - 對應文章 verifier 必須存在的論點

3. **Triage inbox 機制**
   - 5 個 cron 結果目前各自交付，加一層「沒處理完才丟 inbox，否則靜默歸檔」
   - 對應文章 Codex Automations tab 的 Triage inbox 模式

## 文章警告的兩個盲點

- **驗證仍是你的責任** — 你目前 SOP 是看 sub-agent 結果 + 抽查，沒制度化
- **comprehension debt** — 你之前就有 88 個 skills 一團亂的經驗，loop 跑越快 debt 累積越快

## 文章關鍵引言

- Peter Steinberger：「你不該再 prompt coding agent 了，你該設計會 prompt agent 的 loops。」
- Boris Cherny（Claude Code 主管）：「我不再 prompt Claude 了，我有 loops 在跑，負責 prompt Claude。我的工作是寫 loops。」
- Addy 結語：「Build the loop. But build it like someone who intends to stay the engineer, not just the person who presses go.」

---

## 延伸決策紀錄

### 2026-06-12: mempalace_core.txt 污染處理

- 處置：選路 1（cronjob 改 script 模式，no_agent=true 繞過 LLM）+ 路 3（.gitignore 防呆）
- 對應改進點：「State 統一 spine」中「資料歸位」這層完成，「可消費的 spine」仍是缺口
- 遺留：~/.mempalace/identity.txt 未建（影響後續接 context 設計）
