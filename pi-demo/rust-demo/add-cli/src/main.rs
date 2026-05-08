use std::env;

fn main() {
    let args: Vec<String> = env::args().collect();

    if args.len() != 3 {
        eprintln!("用法: {} <數字1> <數字2>", args[0]);
        eprintln!("範例: {} 5 3", args[0]);
        std::process::exit(1);
    }

    let num1: f64 = match args[1].parse() {
        Ok(n) => n,
        Err(_) => {
            eprintln!("錯誤: '{}' 不是有效的數字", args[1]);
            std::process::exit(1);
        }
    };

    let num2: f64 = match args[2].parse() {
        Ok(n) => n,
        Err(_) => {
            eprintln!("錯誤: '{}' 不是有效的數字", args[2]);
            std::process::exit(1);
        }
    };

    let result = num1 + num2;
    println!("{} + {} = {}", num1, num2, result);
}