# Changelog

所有針對此專案的顯著變更都將記錄在此文件中。

格式參考 [Keep a Changelog](https://keepachangelog.com/zh-TW/1.0.0/)。

## [Unreleased]

### Added
- 撰寫完整 Hermes-Agent 功能說明文件 (README.md)
- 參考官方 GitHub README 重新撰寫專案簡介、六大核心功能
- 新增技術架構、Agent 架構設計、MCP 支援說明
- 特別強調 Skills 自主生成核心亮點功能
- 補充安裝方式、常用指令與斜線指令對照表

### Fixed
- 新增疑難排解章節 (Troubleshooting)
- 記錄 macOS `hermes setup` 崩潰 `OSError: [Errno 22]` 修復方案
- 記錄 `hermes` 與 `hermes gateway` 雙入口架構差異，解決 Telegram 無法收發訊息問題
- 補充 Telegram 必須使用 gateway 啟動的原因、正確做法與背景運行建議