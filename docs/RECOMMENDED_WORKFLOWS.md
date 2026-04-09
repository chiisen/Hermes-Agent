# Hermes Agent 推薦工作流程與最佳實踐

> 根據官方文件與社群資源整理的實用工作流程，協助快速發揮 Hermes Agent 的強大功能。

---

## 📋 工作流程總覽

| 工作流程 | 適用對象 | 複雜度 | 推薦指數 |
|---|---|---|---|
| [1. 個人知識助手](#1️⃣-個人知識助手最快速上手) | 個人使用者 / 開發者 | ⭐ | ⭐⭐⭐⭐⭐ |
| [2. Cron 自動化報表](#2️⃣-cron-自動化報表零手動介入) | 開發者 / 維運人員 | ⭐⭐ | ⭐⭐⭐⭐⭐ |
| [3. AI 產品經理 / 專案助理](#3️⃣-ai-產品經理--專案助理) | PM / 專案負責人 | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| [4. 開發自動化 (DevOps)](#4️⃣-開發自動化devops) | 工程師 | ⭐⭐ | ⭐⭐⭐⭐⭐ |
| [5. 多 Agent 平行處理](#5️⃣-多-agent-平行處理進階) | 進階使用者 | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |

---

## 1️⃣ 個人知識助手（最快速上手）

**場景**：讓 Hermes 成為你的私人 AI 秘書，跨平台隨時對話，記憶永不遺忘。

### 設定步驟

```bash
# 1. 確保 .env 中的 Telegram Bot Token 已設定
# TELEGRAM_BOT_TOKEN=your_token_here
# TELEGRAM_ALLOWED_USERS=your_user_id

# 2. 啟動 Gateway（Telegram 為主）
hermes gateway
```

### 使用範例

在 Telegram 傳送訊息給 Bot：
- 「幫我整理昨天 Git commit 的重點」
- 「搜尋我的筆記裡關於 Docker 的內容」
- 「昨天我們討論了什麼？」（跨會話記憶）

### 為什麼好用？
- 📱 **手機隨時對話**：不用開電腦，用手機就能指揮 Agent
- 🎙️ **語音自動轉錄**：傳送語音訊息，Agent 自動轉為文字處理
- 🧠 **永久記憶**：對話歷史永久保存，可全文搜尋

---

## 2️⃣ Cron 自動化報表（零手動介入）

**場景**：每日/每週自動生成報告，推播到 Telegram/Discord，完全無人值守。

### 設定步驟

```bash
# 1. 啟動排程守護程序
hermes cron start

# 2. 用自然語言建立任務
/cron add "every 1d 08:00" "搜尋今日 AI 熱門新聞並整理為 5 個重點摘要"

# 3. 查看任務列表
/cron list

# 4. 立即測試執行
/cron run <job-id>
```

### 推薦排程任務表

| 頻率 | Schedule | 任務 Prompt |
|---|---|---|
| **每日 08:00** | `0 8 * * *` | 檢閱過去 24h Git 記錄，起草站會回報 |
| **每日 23:00** | `0 23 * * *` | 壓縮 `~/projects` 到 `~/backups/`，回報結果 |
| **每週日** | `0 9 * * 0` | 掃描 package.json 生成依賴更新清單 |
| **每月 1 號** | `0 9 1 * *` | 整理本月完成功能與下月計畫 |

### 歷史輸出查詢

無需手動翻找目錄，直接在對話中詢問：
> 「Show me the output from last night's backup job」

Agent 會自動讀取對應時間戳檔案並摘要呈現。

### 進階管理

```bash
# 暫停任務（保留設定與歷史）
/cron pause <job-id>

# 恢復任務
/cron resume <job-id>

# 編輯任務邏輯
/cron edit <job-id>
```

---

## 3️⃣ AI 產品經理 / 專案助理

**場景**：自動化管理使用者回饋、產品路圖、發布公告。

### 設定步驟

**1. 建立 `SOUL.md` 定義角色**：
在專案根目錄建立 `.hermes-context.md` 或 `SOUL.md`：
```markdown
# 產品經理助理
你是資深產品經理，負責：
- 分級使用者回饋（高/中/低優先級）
- 更新產品路圖狀態
- 草擬產品更新公告
```

**2. 撰寫專案技能**：
```bash
# 建立產品概覽技能
cat > ~/.hermes/skills/product-overview.md << 'EOF'
# product-overview
## 描述
說明產品架構、使用者分眾與戰略優先級
## 內容
- 目標用戶：25-40 歲科技從業者
- 核心功能：自動化報表、即時監控
- 當前優先級：提升使用者留存率
EOF
```

**3. 連線外部工具**（可選）：
設定 Jira、Linear、Userorbit 等工具的 API Key，Hermes 會自動執行 API 呼叫。

### 效果
Hermes 會自動執行 API 呼叫、處理分頁、回傳結構化結果，大幅減少人工操作。

---

## 4️⃣ 開發自動化 (DevOps)

**場景**：程式碼審查、文件同步、部署流程、測試自動化。

### 推薦 Skills 清單

| 技能檔案 | 用途 | 觸發指令 |
|---|---|---|
| `deploy-laravel.md` | 一鍵部署 Laravel 到 production | 「部署」 |
| `run-tests.md` | 執行測試並自動修復常見錯誤 | 「跑測試」 |
| `code-review.md` | 掃描 Git diff，找出潛在問題 | 「審計最近提交的程式碼」 |
| `doc-sync.md` | 檢查文件與程式碼是否同步 | 「同步文件」 |

### 設定方式

**從社群安裝**：
```bash
hermes skills browse
hermes skills install <skill-name>
```

**手動建立**：
```bash
# 在 Skills 目錄下建立檔案
cat > ~/.hermes/skills/deploy-laravel.md << 'EOF'
# deploy-laravel
## 描述
部署專案到 production server 的標準流程
## 步驟
1. `php artisan config:cache`
2. `composer install --no-dev`
3. `php artisan migrate --force`
EOF
```

---

## 5️⃣ 多 Agent 平行處理（進階）

**場景**：研究、分析、撰寫、QA 多軌道並行，加速大型任務。

### 架構示意圖

```
父 Agent（決策與匯總）
  ├─ 子 Agent A：市場研究（獨立終端機與上下文）
  ├─ 子 Agent B：競品分析（獨立終端機與上下文）
  └─ 子 Agent C：QA 測試（獨立終端機與上下文）
       ↓
  結果回傳 → 父 Agent 綜合判斷與摘要
```

### 好處
- 🔒 **環境隔離**：每個子 Agent 有獨立上下文，不互相干擾
- 🚀 **平行加速**：多任務同時進行，大幅縮短總執行時間
- 🔄 **自動匯總**：完成後結果自動回傳，父 Agent 進行最終判斷

---

## 📋 最佳實踐總結

### 🛡️ 安全與品質
| 項目 | 建議 |
|---|---|
| **高風險操作** | 保留審核權（如指示「草擬但暫不發布」） |
| **技能格式** | 遵循標準 `SKILL.md` 結構（適用時機、步驟、常見陷阱） |
| **信任等級** | 善用內建信任等級（builtin/official/trusted/community）攔截惡意指令 |
| **Human-in-the-loop** | 重要決策保留人工確認環節 |

### ⚙️ 效能與資源
| 項目 | 建議 |
|---|---|
| **模型選擇** | 日常任務用免費方案（Gemini Flash），關鍵任務用高階模型 |
| **起步策略** | 先用 Telegram Gateway + 幾個基礎 Skills 熟悉操作 |
| **背景運行** | 用 `tmux` 或 `systemd` 保持 Gateway 與 Cron 常駐 |
| **備份** | 定期備份 `~/.hermes/` 目錄 |
| **環境擴展** | 從低成本 VPS 起步，隨負載擴展至 GPU 叢集或 Serverless |

### 🔧 實用指令速查
```bash
# 互動式對話
hermes

# 啟動訊息閘道
hermes gateway

# 啟動排程器
hermes cron start

# 瀏覽技能
hermes skills browse

# 切換模型
hermes model

# 完整設定精靈
hermes setup
```

---

*最後更新：2026-04-09*
*資料來源：Hermes Agent 官方文件、Mintlify、Userorbit 社群文章*
