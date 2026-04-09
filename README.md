# Hermes-Agent 學習筆記

> **Hermes Agent** — 由 [Nous Research](https://nousresearch.com) 開發的自我改進型 AI Agent，目前唯一內建完整學習循環的 Agent 框架。

GitHub: https://github.com/nousresearch/hermes-agent

---

## 📖 專案簡介

Hermes Agent 是一個**模型無關（Model-Agnostic）**的自主 AI Agent，具備以下核心特質：

- **自我改進學習循環** — Agent 能從執行經驗中自主建立技能、在使用中持續優化、主動持久化知識。
- **跨平台統一閘道** — 單一程序同時支援 CLI、Telegram、Discord、Slack、WhatsApp、Signal 與 Email。
- **持久化記憶與使用者建模** — 跨會話搜尋對話紀錄，並建構辯證式使用者模型（Honcho）。
- **彈性部署** — 可運行於 $5 VPS、GPU 叢集或近乎零成本的 Serverless 環境（Daytona / Modal）。
- **研究導向** — 內建批次軌跡生成與 Atropos 強化學習環境，專為訓練下一代工具呼叫模型設計。

---

## ⚡ 核心功能

### 1. 專業終端機介面 (TUI)
- 多行編輯、斜線指令自動完成、歷史紀錄瀏覽。
- 中斷/重導機制與串流工具輸出即時顯示。

### 2. 全平台訊息閘道 (Gateway)
- **單一程序統一管理**：CLI、Telegram、Discord、Slack、WhatsApp、Signal、Email。
- 語音備忘錄自動轉錄。
- 跨平台對話延續（換平台不丟失上下文）。

### 3. 閉環學習系統 (Closed-Loop Learning)
| 機制 | 說明 |
|---|---|
| **技能自主生成** | 完成複雜任務後，Agent 自動建立可複用的 Skill。 |
| **技能自我優化** | 依使用頻率與反饋持續迭代 Skill。 |
| **知識提示** | 定期將重要知識注入上下文。 |
| **FTS5 全文檢索** | 跨會話搜尋完整對話歷史。 |
| **Honcho 使用者建模** | 辯證式建模，相容 `agentskills.io` 開放標準。 |

### 4. 排程自動化 (Cron Scheduler)
- 支援**自然語言**設定排程（如「每天早上 8 點發日报」）。
- 多平台推播通知。
- 適用場景：日報、夜間備份、每週審計等無人值守任務。

### 5. 委派與平行處理 (Subagents)
- 動態生成**隔離子 Agent** 執行平行工作流。
- 支援撰寫 Python 腳本透過 RPC 呼叫工具，將多步驟管線壓縮為**零上下文損耗**的回合。

### 6. 無處不運行 (Run Anywhere)
提供 **6 種終端機後端**：

| 後端 | 適用場景 |
|---|---|
| `local` | 本地開發 |
| `docker` | 容器化隔離 |
| `ssh` | 遠端伺服器 |
| `daytona` | Serverless（閒置自動休眠） |
| `singularity` | HPC 環境 |
| `modal` | 雲端無伺服器 |

---

## 🏗️ 技術架構

```
hermes-agent/
├── agent/          # 核心 Agent 邏輯（決策、路由、執行循環）
├── gateway/        # 跨平台訊息路由（Telegram/Discord/Slack...）
├── hermes_cli/     # TUI 互動式介面
├── skills/         # 技能系統（程序性記憶庫）
├── tools/          # 內建工具集
├── plugins/        # 外掛生態
├── mcp_serve.py    # MCP 服務端
└── tinker-atropos  # RL 訓練管線（Git Submodule）
```

- **主要語言**：Python 93.7%，輔以 Shell、JS、Nix。
- **雙入口架構**：`hermes`（互動式 CLI）與 `hermes gateway`（訊息平台閘道）共用同一套斜線指令集與狀態管理。

---

## 🤖 Agent 架構設計

### 記憶與知識管理
- **FTS5 全文搜尋** + LLM 摘要 → 跨會話回憶。
- **Honcho 模組** → 辯證式使用者畫像建模。

### 技能系統 (Skills) — 🌟 核心亮點

> **這是最厲害的功能**：你不需要手寫任何 Skill，Agent 會在實踐中**自己學會**並記住新技能。

| 特性 | 說明 |
|---|---|
| **自主生成** | 完成複雜任務後，Agent 自動將執行步驟封裝為可複用的 Skill。 |
| **自我優化** | 已生成的 Skill 會根據使用頻率與用戶反饋持續迭代改進。 |
| **持久化記憶** | Skill 保存在 Skills Hub 中，**跨會話永久可用**。 |
| **開放標準** | 符合 `agentskills.io` 規範的程序性記憶庫。 |

**實際場景舉例**：
> 你第一次教 Agent「幫我部署 Laravel 專案到 production」，Agent 會一步步執行。  
> 完成後，它會**自動建立一個 `deploy-laravel` Skill**。  
> 下次你只需說「部署」，Agent 就能**一鍵執行**，無需再次教學。

**這就是它被稱為「自我改進型 Agent」的核心原因** — 越用越聰明，越用越強大。

### 上下文控制
- **Context Files** — 為特定專案注入上下文。
- `/compress` — 動態壓縮上下文長度。
- `/usage` — 即時監控 Token 用量。

### 執行循環
1. 主 Agent 負責**決策與路由**。
2. 複雜任務拆解為**孤立子 Agent** 或透過 **Python RPC** 串接工具鏈。
3. 避免上下文膨脹與狀態污染。

---

## 🔌 MCP Servers 支援

- 原生整合 **MCP (Model Context Protocol)**。
- 專案內含 `mcp_serve.py` 與相關設定檔。
- 支援無縫連接任意符合 MCP 標準的 Server，直接擴展 Agent 的外部工具與資料存取能力，**無需修改核心程式碼**。

---

## 📦 安裝方式

### 快速安裝 (Linux / macOS / WSL2)

```bash
curl -fsSL https://raw.githubusercontent.com/NousResearch/hermes-agent/main/scripts/install.sh | bash
source ~/.bashrc  # 或 source ~/.zshrc
hermes            # 啟動互動對話
```

> ⚠️ **不支援原生 Windows**，請安裝 WSL2 後執行上述指令。

### 開發者/貢獻者安裝

```bash
git clone https://github.com/NousResearch/hermes-agent.git
cd hermes-agent
uv venv venv --python 3.11
source venv/bin/activate
uv pip install -e ".[all,dev]"
python -m pytest tests/ -q
```

**（選填）RL 訓練模組**：
```bash
git submodule update --init tinker-atropos
uv pip install -e "./tinker-atropos"
```

---

## 💻 常用指令

| 指令 | 用途 |
|---|---|
| `hermes` | 啟動互動式 CLI 對話 |
| `hermes model` | 切換 LLM 供應商與模型（無鎖定） |
| `hermes tools` | 設定啟用的工具集 |
| `hermes gateway` | 設定並啟動 Telegram/Discord 等訊息閘道 |
| `hermes setup` | 執行完整設定精靈 |
| `hermes claw migrate` | 從 OpenClaw 遷移設定、記憶、技能與 API Key |
| `hermes update` / `hermes doctor` | 版本更新 / 環境診斷 |

---

## ⌨️ 通用斜線指令

> CLI 與訊息平台皆可使用。

| 指令 | 功能 |
|---|---|
| `/new` 或 `/reset` | 開始全新對話 |
| `/model [provider:model]` | 即時切換模型 |
| `/personality [name]` | 套用特定人格 |
| `/compress` | 壓縮上下文 |
| `/usage` | 查看 Token 用量 |
| `/skills` 或 `/<skill-name>` | 瀏覽或直接呼叫技能 |
| `/stop` 或 `Ctrl+C` | 中斷當前執行任務 |
| `/retry` / `/undo` | 重試或撤回上一步輸出 |

---

## 🔗 參考資源

- **官方文件**：[hermes-agent.nousresearch.com/docs](https://hermes-agent.nousresearch.com/docs)
- **GitHub 專案**：[NousResearch/hermes-agent](https://github.com/nousresearch/hermes-agent)
- **Nous Research**：[nousresearch.com](https://nousresearch.com)

---

*最後更新：2026-04-09*
