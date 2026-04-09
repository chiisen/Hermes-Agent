# MemPalace → Hermes Agent 記憶轉移指南

> 將 MemPalace 的結構化記憶無縫遷移至 Hermes Agent，實現**零 Token 消耗**的經驗傳承。

---

## 📖 核心概念對照

| MemPalace 組件 | Hermes Agent 對應 | 轉移方式 |
|---|---|---|
| **Wings / Rooms** (結構化分類) | **Context Files** (`.hermes-context.md`) | 結構 → 專案規範 |
| **Drawers** (原始對話/決策) | **Skills** (`~/.hermes/skills/*.md`) | 精選 SOP → 永久技能 |
| **Knowledge Graph** (實體關係) | **背景知識** (Context Files) | 三元組 → 文字敘述 |
| **Agent Diary** (跨會話日誌) | **歷史經驗總結** | 日記條目 → Context |

---

## 🚀 四階段轉移流程

### 階段 1：快速喚醒（最簡單，5 分鐘）

把 MemPalace 的核心記憶直接餵給 Hermes，讓它立即「想起」你的專案背景。

**操作步驟**：

```bash
# 1. 匯出 MemPalace 核心記憶（L0+L1，約 600-900 tokens）
mempalace wake-up > mempalace_core.txt

# 2. 查看匯出內容
cat mempalace_core.txt
```

**輸出範例**：
```
## L0 -- IDENTITY
Eli - 資深工程師，位於台灣台中，使用 macOS

## L1 -- ESSENTIAL STORY
[project-decisions]
  - 選擇使用 Laravel + Vue 3 作為主要技術棧  (laravel-setup.md)
  - 部署流程：staging → production  (deploy-sop.md)
...
```

**轉移給 Hermes**：
將上述內容貼給 Hermes 並下達指令：
> 「這是我的背景知識，請記住這些資訊，作為未來對話的參考。」

**效果**：Hermes 會將這些資訊納入上下文，立即理解你的專案脈絡。

---

### 階段 2：精選 Skill 轉移（推薦，零 Token）

把 MemPalace 中的重要決策與成功 SOP 轉為 Hermes 的永久 Skills。

**操作步驟**：

```bash
# 1. 搜尋特定主題的記憶
mempalace search "部署流程" --results 5

# 2. 搜尋專案決策
mempalace search "技術選型" --wing project-a --results 3
```

**建立 Skill 檔案**：

```bash
# 在 Hermes 的 Skills 目錄下建立檔案
mkdir -p ~/.hermes/skills

cat > ~/.hermes/skills/deploy-project.md << 'EOF'
# deploy-project

## 描述
部署專案到 production server 的標準流程（從 MemPalace 轉移）

## 原始來源
MemPalace: wing=project-a, room=decisions, drawer=deploy-sop.md

## 正確步驟（依序執行）
1. `php artisan config:clear`
2. `php artisan config:cache`
3. `composer install --no-dev`
4. `php artisan migrate --force`
5. `php artisan queue:restart`

## 常見錯誤與解法
- 如果 migratoin 失敗：檢查 `.env` 的 DB 連線
- 如果 queue 沒反應：執行 `sail artisan queue:flush`
EOF
```

**效果**：下次只需對 Hermes 說「部署」，它就會調用這個 Skill 自動執行。

---

### 階段 3：知識圖譜轉移（進階）

提取 MemPalace 的實體關係，轉為 Hermes 的專案背景知識。

**操作步驟**：

```bash
# 1. 查詢特定實體的關係（例如專案 "Hermes-Agent"）
mempalace kg query "Hermes-Agent"

# 2. 查看實體時間線
mempalace kg timeline "Hermes-Agent"

# 3. 查看知識圖譜統計
mempalace kg stats
```

**輸出範例**：
```json
{
  "entity": "Hermes-Agent",
  "facts": [
    {"subject": "Hermes-Agent", "predicate": "uses", "object": "Python 93.7%"},
    {"subject": "Hermes-Agent", "predicate": "depends_on", "object": "ChromaDB"},
    {"subject": "Hermes-Agent", "predicate": "author", "object": "Eli"}
  ]
}
```

**轉為 Context File**：

```bash
# 建立專案背景知識檔案
mkdir -p ~/.hermes/context

cat > ~/.hermes/context/hermes-agent-bg.md << 'EOF'
# Hermes-Agent 專案背景知識

## 技術棧
- 主要語言：Python 93.7%
- 輔助語言：Shell, JavaScript, Nix
- 核心依賴：ChromaDB（向量搜尋）, SQLite（知識圖譜）

## 專案資訊
- 作者：Eli
- 建立時間：2026-04
- 類型：自我改進型 AI Agent 框架

## 重要決策
- 使用 MCP 協議整合外部工具
- 支援 6 種終端機後端（local/docker/ssh/daytona/singularity/modal）
EOF
```

**效果**：Hermes 在處理該專案相關任務時，會自動參考這些背景知識。

---

### 階段 4：完整備份（離線遷移）

如果需要完整遷移所有記憶（例如停用 MemPalace）。

**操作步驟**：

```bash
# 1. 備份 MemPalace 資料庫
cp -r ~/.mempalace/palace/ ~/backup/mempalace_palace/
cp ~/.mempalace/knowledge_graph.sqlite3 ~/backup/

# 2. 匯出所有 Wings 的記憶
mempalace list-wings
# 對每個 Wing 執行搜尋匯出
mempalace search "" --wing <wing-name> --results 100 > wing_<name>.txt
```

**批量轉換腳本**（需自行開發）：
由於 MemPalace 目前**尚未實作 `export` 指令**，完整遷移需要：
1. 直接讀取 ChromaDB（`~/.mempalace/palace/chroma.sqlite3`）
2. 將 Drawers 轉換為 Markdown 格式
3. 批量存入 Hermes Skills

> ⚠️ 此功能等待 MemPalace 未來實作 `mempalace export --format json` 後會更容易。

---

## ✅ 轉移策略建議

| 情境 | 推薦做法 | 預估時間 | Token 消耗 |
|---|---|---|---|
| **快速讓 Hermes 了解背景** | 階段 1：`mempalace wake-up` → 貼給 Hermes | 5 分鐘 | 0 |
| **轉移常用操作流程** | 階段 2：`mempalace search` → 建立 Skills | 15-30 分鐘 | 0 |
| **轉移專案決策背景** | 階段 3：`mempalace kg_query` → Context Files | 10 分鐘 | 0 |
| **完整離線遷移** | 階段 4：備份 DB + 轉換腳本 | 1-2 小時 | 0 |

---

## 🔧 實用指令速查

| 動作 | MemPalace 指令 | 用途 |
|---|---|---|
| 匯出核心記憶 | `mempalace wake-up` | 取得 L0+L1 摘要（~800 tokens） |
| 語意搜尋 | `mempalace search "query"` | 查找特定主題的記憶 |
| 限定範圍搜尋 | `mempalace search "query" --wing <name>` | 僅搜尋特定 Wing |
| 查詢實體關係 | `mempalace kg query "entity"` | 取得知識圖譜事實 |
| 查看實體歷史 | `mempalace kg timeline "entity"` | 時序時間線 |
| 知識圖譜統計 | `mempalace kg stats` | 實體/關係總數 |
| 預覽壓縮 | `mempalace compress --dry-run` | 查看所有 Drawers 內容預覽 |
| 宮殿狀態 | `mempalace status` | 確認 Wings/Rooms/Drawers 數量 |

---

## ⚠️ 注意事項

1. **MemPalace 尚無 `export` 指令**
   - 文件中提到但尚未實作
   - 目前需透過 `wake-up`、`search` 或 `compress --dry-run` 間接匯出

2. **Drawers 是原始逐字文本**
   - 轉移前建議先人工篩選，只挑選真正有價值的 SOP
   - 避免把大量冗長對話直接塞給 Hermes

3. **Skills 需要結構化**
   - Hermes 的 Skills 需要清晰的步驟描述
   - 建議格式：`# 名稱` → `## 描述` → `## 步驟` → `## 注意事項`

4. **知識圖譜需手動轉譯**
   - MemPalace 的 KG 是 SQLite 儲存的三元組
   - 轉移為 Hermes 可讀的文字敘述需人工整理

---

*最後更新：2026-04-09*
