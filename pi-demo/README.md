# Sum CLI Tool

一個簡單的 Node.js CLI 工具，用於計算兩個數字的總和。

## 功能

- 計算兩數之和
- 支援 `-h` / `--help` 顯示說明
- 包含錯誤處理（無效數字、參數不足）
- 支援整數和浮點數計算

## 安裝

```bash
npm install
```

## 使用方式

### 直接執行

```bash
node index.js 5 3        # 結果: ✨ 5 + 3 = 8
node index.js 10.5 20.3  # 結果: ✨ 10.5 + 20.3 = 30.8
node index.js 100 200    # 結果: ✨ 100 + 200 = 300
```

### 顯示說明

```bash
node index.js --help
```

### 全域安裝

```bash
npm link                 # 建立全域連結
sum 10 20                # 結果: ✨ 10 + 20 = 30
```

## 測試範例

以下是一些實際執行的範例：

```bash
$ node index.js 5 3
✨ 5 + 3 = 8

$ node index.js 10 20
✨ 10 + 20 = 30

$ node index.js --help
sum-cli - 計算兩數之和

 使用方式:
   sum <數字1> <數字2>

 範例:
   sum 5 3      # 輸出: 5 + 3 = 8
   sum 10 20    # 輸出: 10 + 20 = 30

 選項:
   -h, --help   顯示說明
```

## 錯誤處理

- 如果沒有提供足夠的參數，工具會顯示錯誤訊息並提示使用 `--help`
- 如果提供的參數不是有效數字，工具會顯示錯誤訊息

## 檔案結構

```
pi-demo/
├── package.json    # 專案設定
├── index.js        # CLI 主程式
├── README.md       # 說明文件
└── .gitignore      # Git 忽略設定
```

## 授權

MIT