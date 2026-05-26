# Docker Compose 比較報告

本文件詳細比較了以下兩個 Docker Compose 設定檔的異同點：
- **A 檔 (Jubilant - 三方)**: [docker-compose.yml](file:///Users/liao-eli/github/Hermes-Agent/compare/jubilant_jy/docker-compose.yml)
- **B 檔 (MFS - 四方)**: [docker-compose.yml](file:///Users/liao-eli/github/Hermes-Agent/compare/mfs_jy/docker-compose.yml)

---

## 📌 快速摘要 (Quick Summary)

> [!NOTE]
> 兩個 `docker-compose.yml` 的核心服務架構高度相似，皆包含 `laravel.test`、`phpmyadmin`、`mysql` 、`redis`、`redis-insight` 五大服務。
> **然而，兩者在「網路/磁碟卷命名空間」、「Laravel Reverb 支援」、「Redis 密碼保護」以及「Redis-Insight 的啟動設定」上有顯著的差異。**

### 🔑 關鍵問答：phpMyAdmin 的連接埠 (Port) 是否一樣？
**從 Docker Compose 的預設配置來看是一樣的，但在實際專案的 `.env` 設定下運作連接埠不同。**

#### 1. `FORWARD_PHPMYADMIN_PORT` 的用途
`FORWARD_PHPMYADMIN_PORT` 是 Laravel Sail 用於**自訂宿主機（Host）與 phpMyAdmin 容器對應連接埠**的環境變數。透過設定此變數，開發者可在瀏覽器中使用 `http://localhost:<PORT>` 來開啟網頁版資料庫管理介面。

在兩份 `docker-compose.yml` 中，該服務的埠號皆寫為：
- `"${FORWARD_PHPMYADMIN_PORT:-3307}:80"`

這代表 Docker Compose 將使用以下邏輯決定連接埠：
- 若 `.env` 中**有**宣告 `FORWARD_PHPMYADMIN_PORT`，則採用該變數值。
- 若 `.env` 中**未**宣告，則回退（Fallback）至預設的 **`3307`** 連接埠。

#### 2. 實際專案運行狀態差異
* **A 檔 (Jubilant 專案 - 三方)**：
  其 `.env` 檔案中明確設定了 `FORWARD_PHPMYADMIN_PORT=8081`。因此，其 phpMyAdmin 實際運行於宿主機的 **`8081`** 連接埠，使用者透過 `http://localhost:8081` 即可正常開啟。
* **B 檔 (MFS 專案 - 四方)**：
  其 `.env` 檔案中**未宣告**該變數。因此，Docker 採用預設後備值，使其 phpMyAdmin 運行於宿主機的 **`3307`** 連接埠，必須透過 `http://localhost:3307` 存取。

---

## 📊 服務層級詳細對照表 (Service-Level Comparison)

| 服務名稱 (Service) | 比較項目 | A 檔 (Jubilant - 三方) | B 檔 (MFS - 四方) | 相同/不同 | 說明 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **全域設定** | 網路名稱 (Networks) | `sail-jubilant` | `sail` | 🔴 不同 | A 檔使用專屬後綴，B 檔為標準 Sail 命名 |
| | 磁碟卷名稱前綴 (Volumes) | `sail-jubilant-*` | `sail-*` | 🔴 不同 | 同上，這會導致兩者的資料儲存在不同的 Docker 磁碟卷中 |
| **laravel.test** | 映象檔名稱 (Image) | `sail-8.4/app` | `sail-8.4/app` | 🟢 相同 | 皆基於 PHP 8.4 的 Sail 應用容器 |
| | 連接埠 (Ports) | 80, 5173, 7080 | 80, 5173 | 🔴 不同 | A 檔額外轉發了 Laravel Reverb 廣播連接埠 (`7080`) |
| | 環境變數 (Environment) | 基本 Sail 環境 | 基本 Sail 環境 + 代理註解 | 🔴 不同 | B 檔在環境變數中預留了 SSH 代理 / SOCKS5 Proxy 的註解說明 |
| **phpmyadmin** | 映像檔 (Image) | `phpmyadmin/phpmyadmin` | `phpmyadmin/phpmyadmin` | 🟢 相同 | |
| | 連接埠 (Ports) | `3307:80` (預設) | `3307:80` (預設) | 🟢 相同 | 兩者均為 `"${FORWARD_PHPMYADMIN_PORT:-3307}:80"` |
| **mysql** | 映像檔 (Image) | `mysql/mysql-server:8.0` | `mysql/mysql-server:8.0` | 🟢 相同 | |
| | 連接埠 (Ports) | `3306:3306` (預設) | `3306:3306` (預設) | 🟢 相同 | 兩者均為 `"${FORWARD_DB_PORT:-3306}:3306"` |
| **redis** | 啟動命令 (Command) | 無自訂 | `redis-server --requirepass "${REDIS_PASSWORD}"` | 🔴 不同 | B 檔啟用了 Redis 密碼認證機制 |
| **redis-insight** | 容器名稱 (Container Name) | `"${REDIS_INSIGHT_CONTAINER_NAME:-redis-insight}"` | 未指定 | 🔴 不同 | A 檔有自訂容器名稱，B 檔交由 Compose 自動命名 |
| | 設定檔啟動群組 (Profiles) | `redis-insight` | 未指定 | 🔴 不同 | A 檔限制在 `redis-insight` profile 下啟動；B 檔為預設啟動 |

---

## 🔍 詳細異同點分析 (Detailed Breakdown)

### 🟢 相同點 (Similarities)

1. **核心技術棧一致**：
   - 皆基於 **PHP 8.4** (`sail-8.4/app`) 與 **MySQL 8.0** (`mysql/mysql-server:8.0`)，且 Redis 均使用 `redis:alpine`，Redis Insight 均使用 `redis/redisinsight:latest`。
2. **資料庫與工具連接埠完全一致**：
   - **phpMyAdmin** 連接埠皆為 `"${FORWARD_PHPMYADMIN_PORT:-3307}:80"`。
   - **MySQL** 連接埠皆為 `"${FORWARD_DB_PORT:-3306}:3306"`。
   - **Redis** 連接埠皆為 `"${FORWARD_REDIS_PORT:-6379}:6379"`.
   - **Redis Insight** 連接埠皆為 `"${FORWARD_REDIS_INSIGHT_PORT:-5540}:5540"`.
3. **Laravel 基礎配置相同**：
   - 包含 `WWWUSER`、`DB_HOST`、`LARAVEL_SAIL`、`XDEBUG_MODE`、`XDEBUG_CONFIG`、`IGNITION_LOCAL_SITES_PATH`、`APP_COLOR` 等環境變數配置完全相同。
   - 皆掛載 `.` 至 `/var/www/html`，並將 `gh-ost` 工具掛載至 `/usr/local/bin/gh-ost`。

---

### 🔴 不同點 (Differences)

#### 1. 網路與磁碟卷命名空間 (Network & Volume Namespaces)
* **Jubilant 版本 (三方)**: 為了與其他專案隔離，將 Network 命名為 `sail-jubilant`，且所有的 Volume 也以此為前綴（例如 `sail-jubilant-mysql`、`sail-jubilant-redis`、`sail-jubilant-redis-insight`）。
* **MFS 版本 (四方)**: 使用預設的 `sail` 網路名稱，且 Volume 也是簡短的 `sail-mysql`、`sail-redis`、`sail-redis-insight`。
* *影響*：若同時啟動這兩個專案，因為命名空間不同，它們會各自擁有獨立的 Docker 網路與資料儲存區，不會發生資料庫互相覆蓋的情況。

#### 2. Laravel Reverb 支援 (WebSocket Broadcasting)
* **Jubilant 版本 (三方)**: `laravel.test` 服務的 `ports` 區塊中，包含 `"${FORWARD_REVERB_PORT:-7080}:7080"`。這代表該版本支援並預留了 Laravel Reverb 即時通訊廣播服務的連接埠。
* **MFS 版本 (四方)**: 無此連接埠對應。

#### 3. SSH 代理 (SSH Proxy) 環境變數註解
* **Jubilant 版本 (三方)**: 無此設定。
* **MFS 版本 (四方)**: 在 `laravel.test` 的環境變數中，額外留有以下被註解的 SOCKS5 代理設定：
  ```yaml
  # SSH 動態連接埠轉發 (SSH SOCKS5 Proxy)
  # ALL_PROXY: socks5h://host.docker.internal:8888
  # ...
  ```
  這便於開發者在容器內需要透過宿主機進行 SSH 代理轉發時快速啟用。

#### 4. Redis 安全性設定 (Redis Password Authentication)
* **Jubilant 版本 (三方)**: Redis 容器以預設無密碼模式啟動。
* **MFS 版本 (四方)**: Redis 容器增加了 `command: ["redis-server", "--requirepass", "${REDIS_PASSWORD}"]` 指令。這強制啟用了密碼保護，要求連接 Redis 時必須提供 `${REDIS_PASSWORD}` 變數對應的密碼。

#### 5. Redis-Insight 啟動機制與命名
* **Jubilant 版本 (三方)**:
  - 設定了 `profiles: - redis-insight`，代表預設執行 `docker compose up` 時**不會**啟動此服務，必須手動透過 `--profile redis-insight` 或是指定服務名稱來啟動。
  - 設定了自訂容器名稱 `container_name: "${REDIS_INSIGHT_CONTAINER_NAME:-redis-insight}"`。
* **MFS 版本 (四方)**:
  - 沒有設定 `profiles`，因此預設執行 `docker compose up` 時會**伴隨其他服務一起啟動**。
  - 未設定自訂容器名稱，會由 Docker Compose 自動根據目錄名與服務名進行預設命名。

---

## 💡 總結與建議 (Recommendations)

> [!TIP]
> 1. **資料隔離**：兩者網路與 Volume 的隔離非常良好，您可以在同一台電腦上同時執行這兩個環境，不會有衝突。
> 2. **Redis 密碼**：如果您切換到 **MFS 版本 (四方)**，請確保您的 `.env` 中有正確設定 `REDIS_PASSWORD`，否則應用程式與 Redis 連接時可能會遇到認證失敗（`NOAUTH Authentication required.`）的問題。
> 3. **Redis Insight**：在 **Jubilant 版本 (三方)** 中，若需要使用 Redis Insight 視覺化介面，記得使用 `docker compose --profile redis-insight up -d` 來手動開啟它。

---
*報告產出時間：2026-05-26 10:43:02 (台北時間)*
