package main

import (
	"flag"
	"fmt"
	"os"
	"strconv"
)

func main() {
	// 使用 flag 定義參數
	a := flag.Float64("a", 0, "第一個數字")
	b := flag.Float64("b", 0, "第二個數字")
	flag.Parse()

	// 如果沒有使用 flag，嘗試從位置參數讀取
	args := flag.Args()
	if *a == 0 && *b == 0 && len(args) >= 2 {
		num1, err1 := strconv.ParseFloat(args[0], 64)
		num2, err2 := strconv.ParseFloat(args[1], 64)
		if err1 == nil && err2 == nil {
			fmt.Printf("%.2f + %.2f = %.2f\n", num1, num2, num1+num2)
			return
		}
	}

	// 使用 flag 參數
	if *a == 0 && *b == 0 {
		fmt.Println("用法:")
		fmt.Println("  add-demo -a <數字1> -b <數字2>")
		fmt.Println("  add-demo <數字1> <數字2>")
		fmt.Println("\n範例:")
		fmt.Println("  add-demo -a 10 -b 20")
		fmt.Println("  add-demo 10 20")
		os.Exit(1)
	}

	fmt.Printf("%.2f + %.2f = %.2f\n", *a, *b, *a+*b)
}