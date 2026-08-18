# 《Loop Engineering》文章筆記

> 來源：https://addyosmani.com/blog/loop-engineering/
> 作者：Addy Osmani
> 發布：2026-06-07
> 用途：之後複查不用重抓網址

## 一句話

Loop engineering = 你不是 prompt agent 的人，你是設計「會自己 prompt agent 的系統」的人。

## 兩個關鍵引言

- **Peter Steinberger**：「你不該再 prompt coding agent 了，你該設計會 prompt agent 的 loops。」
- **Boris Cherny**（Anthropic Claude Code 主管）：「我不再 prompt Claude 了，我有 loops 在跑，負責 prompt Claude。我的工作是寫 loops。」

## 為什麼重要

過去兩年你跟 coding agent 的互動模式：
> 打字 → 讀結果 → 再打字 → 讀結果…

你是手握工具的人，每個 turn 都你來。現在：
> 你設計一個小系統，找事、派工、驗收、記下結果、決定下一步，讓這系統自己戳 agent。

## 在脈絡裡的位置

跟兩篇他之前寫的文章是同一棵樹：

- **harness engineering** = 給「單一 agent 住的環境」
- **factory model** = 建軟體的那個系統
- **loop engineering** = 上一層。harness 跑在計時器上、會生小 helpers、會自己餵自己

## 一個 Loop 的 5 + 1 元素

| # | 元素 | 在 loop 裡做什麼 |
|---|------|----------------|
| 1 | Automations | 排程跑、discovery + triage 自動 |
| 2 | Worktrees | 隔離平行工作 |
| 3 | Skills | 寫下專案知識，別每次重猜 |
| 4 | Plugins / Connectors | 接上你已有的工具（MCP） |
| 5 | Sub-agents | 寫的人跟驗的人分開 |
| ＋ | State | 記住做過什麼、還有什麼（spine） |

## 兩家工具對照（Codex app vs Claude Code）

兩邊都有這五個，名字略不同：

| Primitive | Codex app | Claude Code |
|-----------|-----------|-------------|
| Automations | Automations tab、/goal | Scheduled cron、/loop、/goal、hooks、GitHub Actions |
| Worktrees | 內建 per-thread | `git worktree`、`--worktree`、`isolation: worktree` |
| Skills | SKILL.md，用 `$name` 觸發 | SKILL.md |
| Plugins/Connectors | MCP + plugins | MCP + plugins |
| Sub-agents | `.codex/agents/` TOML | `.claude/agents/`、agent teams |
| State | Markdown / Linear via connector | AGENTS.md、progress files、Linear via MCP |

他的重點：**形狀一樣就別吵哪家好，設計一個跟工具無關的 loop**。

## 兩個會話內 primitive 特別值得注意

- **/loop** — 週期性重跑
- **/goal** — 跑到你寫的 stopping condition 為止；每個 turn 後**另一個小模型**判斷有沒有完成
  - 重點：判斷 done 的不是寫 code 的那隻，這是 maker-checker split 應用在停止條件上

## 範例 loop（他每天用的形狀）

```
早上 automation 跑
  → 叫 triage skill 讀昨天 CI 失敗 + 開著議題 + 最近 commit
  → 寫進 markdown / Linear
  → 對每個值得做的 finding：
       開 worktree
       派 sub-agent 寫 patch
       派第二個 sub-agent 對照 skills 跟 tests 驗
  → 透過 connector 開 PR + 更新 ticket
  → loop 處理不掉的進 triage inbox 給人
  → state 檔記住：做過什麼、過了什麼、還開著什麼
       → 明天早上從這接著跑
```

## 三個 loop 沒幫你解、反而更尖銳的問題

### 1. 驗證還是你要負責
Loop 沒人盯的時候是「沒人盯地犯錯」。Verifier sub-agent 存在的目的是讓 loop 的「好了」這句話**有意義**，即使如此「done」是 claim 不是 proof。

> 你的工作是 ship 你確認 work 的 code。

### 2. 理解會腐爛（comprehension debt）
Loop 跑越快、你沒讀的 code 越多，what exists 跟 what you actually know 的 gap 越大。順的 loop 不主動阻止這個成長。

### 3. 認知投降（cognitive surrender）
Loop 跑得很順的時候你會開始不表態、照單全收。**設計 loop 是解藥，迴避思考的話就變助燃劑** — 同一個動作相反的結果。

## 結語（原文）

> Build the loop. But build it like someone who intends to stay the engineer, not just the person who presses go.

## 兩個 takeaway

- 兩個人寫一模一樣的 loop 結果完全相反：一個用來加速他深度理解的工作，一個用來完全迴避理解
- Loop 不知道差在哪，你知道

## 他提到的自己其他文章（值得順著讀）

- agent harness engineering
- factory model
- long-running agents（state / memory 在磁碟不在 context 的論點）
- orchestration tax（人仍然是天花板，review bandwidth 決定能跑幾個）
- intent debt（agent 開新 session 從零開始，會用自信的猜測補 intent 的洞）
- agent skills
- code agent orchestra
- adversarial code review
- code review in the age of AI
