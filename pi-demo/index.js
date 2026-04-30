#!/usr/bin/env node

/**
 * sum-cli - 計算兩數之和的 CLI 工具
 * 使用方式: sum <數字1> <數字2>
 */

// 取得命令列參數
const args = process.argv.slice(2);

// 顯示說明
function showHelp() {
  console.log(`
 sum-cli - 計算兩數之和

 使用方式:
   sum <數字1> <數字2>

 範例:
   sum 5 3      # 輸出: 5 + 3 = 8
   sum 10 20    # 輸出: 10 + 20 = 30

 選項:
   -h, --help   顯示說明
`);
}

// 主程式
function main() {
  // 檢查是否顯示說明
  if (args.includes('-h') || args.includes('--help')) {
    showHelp();
    process.exit(0);
  }

  // 檢查參數數量
  if (args.length < 2) {
    console.error('❌ 錯誤：需要兩個數字參數');
    console.log('使用 --help 查看說明');
    process.exit(1);
  }

  // 解析數字
  const num1 = parseFloat(args[0]);
  const num2 = parseFloat(args[1]);

  // 驗證是否為有效數字
  if (isNaN(num1) || isNaN(num2)) {
    console.error('❌ 錯誤：請輸入有效的數字');
    process.exit(1);
  }

  // 計算並輸出結果
  const result = num1 + num2;
  console.log(`✨ ${num1} + ${num2} = ${result}`);
}

main();