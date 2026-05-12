# MiniMax API 404 排查 Runbook

## 適用情境

當 `hermes agent` 切換或更新 MiniMax API Key 後，出現類似以下錯誤：

```text
provider=minimax base_url=https://api.minimax.io/v1
Streaming failed before delivery: 404 Not Found
HTTP 404 — 404 Not Found
```

## 這次能快速定位的原因

核心方法是不要先假設「API Key 壞了」，而是從 log 的結構判斷請求實際打到哪裡。

這次 log 已經給出三個關鍵事實：

1. provider 是 `minimax`
2. model 是 `MiniMax-M2.5`
3. base URL 是 `https://api.minimax.io/v1`

接著比對 Hermes 原始設定與 provider 實作，發現 Hermes 的 MiniMax direct provider 不是走 OpenAI-style `/v1`，而是走 Anthropic-compatible endpoint：

```text
https://api.minimax.io/anthropic
```

所以 `404 Not Found` 的第一懷疑點不是 Key，而是 base URL 被 `.env` 或 credential pool 覆蓋錯誤。

## 最短排查流程

### 1. 先看 log 的 provider 與 base_url

```bash
hermes logs --lines 50
```

確認是否有：

```text
provider=minimax
base_url=https://api.minimax.io/v1
HTTP 404
```

如果有，幾乎可以直接判定是 MiniMax endpoint 設錯。

### 2. 檢查設定來源

```bash
rg -n "MINIMAX_BASE_URL|base_url.*api\.minimax|MiniMax-M2" ~/.hermes/.env ~/.hermes/auth.json ~/.hermes/config.yaml
```

常見錯誤：

```text
MINIMAX_BASE_URL=https://api.minimax.io/v1 # Override default base URL
```

或 `~/.hermes/auth.json` 裡有：

```json
"base_url": "https://api.minimax.io/v1 # Override default base URL"
```

注意：如果註解被寫進 `.env` value，Hermes 可能會把整段字串視為 URL 的一部分。

### 3. 修正 MiniMax base URL

全域 MiniMax direct API 應設為：

```text
https://api.minimax.io/anthropic
```

修正 `~/.hermes/.env`：

```env
MINIMAX_BASE_URL=https://api.minimax.io/anthropic
```

如果 `~/.hermes/auth.json` 的 credential pool 也快取了錯誤 URL，也要同步改成：

```json
"base_url": "https://api.minimax.io/anthropic"
```

### 4. 驗證連線

先跑 doctor：

```bash
hermes doctor
```

預期看到：

```text
✓ MiniMax
```

再跑一次實際對話 endpoint：

```bash
hermes -z '只回覆 OK' --provider minimax --model MiniMax-M2.5
```

預期輸出：

```text
OK
```

## 判斷準則

- `401` 或 `403`：優先懷疑 API Key、權限、帳號狀態。
- `404` 且 log 顯示 `base_url=https://api.minimax.io/v1`：優先懷疑 endpoint 設錯。
- `nodename nor servname provided`：可能是 Codex 沙箱 DNS 或網路限制，應在本機或升權環境重跑診斷。

## 這次實際修復項目

已將以下兩處從 `/v1` 修正為 `/anthropic`：

```text
~/.hermes/.env
~/.hermes/auth.json
```

並用下列指令驗證成功：

```bash
hermes doctor
hermes -z '只回覆 OK' --provider minimax --model MiniMax-M2.5
```

## 安全提醒

如果 API Key 曾出現在 log、終端輸出、截圖或聊天紀錄中，應立即到 MiniMax 後台輪換 Key，並更新：

```text
~/.hermes/.env
```
