# Bài 16: Error Handling trong Rust

## Mục tiêu bài học
- Hiểu rõ triết lý xử lý lỗi của Rust
- Phân biệt và sử dụng đúng các phương pháp xử lý lỗi khác nhau
- Áp dụng kỹ thuật xử lý lỗi hiệu quả trong các ứng dụng thực tế
- Tạo và quản lý custom error types
- Sử dụng thành thạo các thư viện hỗ trợ xử lý lỗi phổ biến

## 1. Giới thiệu về Error Handling trong Rust

### 1.1 Tầm quan trọng của xử lý lỗi
- Rust được thiết kế với triết lý "fail fast, fail early" - phát hiện lỗi càng sớm càng tốt
- Xử lý lỗi là một phần không thể thiếu trong lập trình an toàn
- Rust bắt buộc lập trình viên xử lý lỗi một cách tường minh (không ẩn giấu lỗi)

### 1.2 Phân loại lỗi trong Rust
- **Unrecoverable errors**: Lỗi nghiêm trọng, không thể phục hồi, chương trình buộc phải dừng
- **Recoverable errors**: Lỗi có thể xử lý, chương trình có thể tiếp tục thực thi

### 1.3 So sánh với các ngôn ngữ khác
- Không sử dụng exceptions như Java, Python, C++
- Không dùng lỗi trả về (return codes) như C
- Tận dụng type system để bắt buộc xử lý lỗi ngay khi biên dịch

## 2. Panic! và Unrecoverable Errors

### 2.1 Hiểu về panic!
- `panic!` là cơ chế xử lý lỗi nghiêm trọng, không thể khôi phục
- Khi `panic!` xảy ra, chương trình sẽ:
  - In thông báo lỗi
  - Thực hiện unwinding (mặc định) hoặc abort
  - Dừng thread hiện tại hoặc toàn bộ chương trình

```rust
fn main() {
    println!("Trước khi panic");
    panic!("Đây là một lỗi nghiêm trọng!");
    println!("Sau khi panic - dòng này không bao giờ được thực thi");
}
```

### 2.2 Khi nào sử dụng panic!
- Lỗi nghiêm trọng không thể khôi phục
- Trạng thái không hợp lệ mà chương trình không thể tiếp tục an toàn
- Trong quá trình phát triển để phát hiện lỗi sớm
- Các tình huống "không thể xảy ra" trong code

### 2.3 Các trường hợp panic! tự động xảy ra
- Truy cập mảng với index ngoài phạm vi
- Chia cho 0
- Unwrap một Option::None hoặc Result::Err
- Assert thất bại

```rust
fn demo_auto_panic() {
    // 1. Index ngoài phạm vi
    let v = vec![1, 2, 3];
    let value = v[99]; // Panic!
    
    // 2. Unwrap None
    let x: Option<i32> = None;
    let value = x.unwrap(); // Panic!
    
    // 3. Chia cho 0
    let result = 10 / 0; // Panic!
}
```

### 2.4 Cấu hình Panic Behavior
- Mặc định: unwinding (giải phóng bộ nhớ rồi kết thúc)
- Abort: kết thúc ngay lập tức (nhỏ gọn hơn)
- Cấu hình trong Cargo.toml:
```toml
[profile.release]
panic = "abort"
```

### 2.5 Backtrace
- Hiển thị stack trace khi panic xảy ra
- Cách bật: `RUST_BACKTRACE=1 cargo run`
- Cách đọc backtrace để debug lỗi hiệu quả

## 3. Result&lt;T, E&gt; và Recoverable Errors

### 3.1 Result enum
- Định nghĩa:
```rust
enum Result&lt;T, E&gt; {
    Ok(T),   // Thành công với giá trị T
    Err(E),  // Thất bại với lỗi E
}
```
- Dùng cho các hàm có thể thất bại nhưng không nghiêm trọng đến mức phải panic

### 3.2 Cách sử dụng Result
```rust
fn đọc_file(đường_dẫn: &str) -> Result<String, std::io::Error> {
    std::fs::read_to_string(đường_dẫn)
}

fn main() {
    let kết_quả = đọc_file("config.txt");
    
    match kết_quả {
        Ok(nội_dung) => println!("Đọc file thành công: {}", nội_dung),
        Err(lỗi) => println!("Không thể đọc file: {}", lỗi),
    }
}
```

### 3.3 Các phương thức hữu ích của Result
- `unwrap()`: Trả về Ok value hoặc panic nếu là Err
- `expect(msg)`: Giống unwrap nhưng với thông báo tùy chỉnh
- `unwrap_or(default)`: Trả về Ok value hoặc giá trị mặc định
- `unwrap_or_else(f)`: Trả về Ok value hoặc kết quả của hàm f
- `is_ok()`, `is_err()`: Kiểm tra kết quả

```rust
// Các cách xử lý Result
fn demo_result_methods() {
    let file_result = std::fs::File::open("config.txt");
    
    // 1. unwrap - không nên dùng trong production
    let file1 = std::fs::File::open("config.txt").unwrap();
    
    // 2. expect - tốt hơn unwrap khi debugging
    let file2 = std::fs::File::open("config.txt")
        .expect("Không thể mở file config.txt");
    
    // 3. unwrap_or_else - xử lý lỗi mềm dẻo
    let file3 = std::fs::File::open("config.txt").unwrap_or_else(|error| {
        println!("Gặp lỗi: {}", error);
        // Xử lý thay thế, ví dụ tạo file mới
        std::fs::File::create("config.txt").unwrap()
    });
    
    // 4. match - đầy đủ và rõ ràng nhất
    let file4 = match std::fs::File::open("config.txt") {
        Ok(file) => file,
        Err(error) => {
            println!("Gặp lỗi khi mở file: {}", error);
            // Xử lý lỗi cụ thể
            match error.kind() {
                std::io::ErrorKind::NotFound => {
                    println!("File không tồn tại, tạo file mới");
                    std::fs::File::create("config.txt").unwrap()
                },
                std::io::ErrorKind::PermissionDenied => {
                    panic!("Không có quyền truy cập file");
                },
                _ => {
                    panic!("Lỗi không xác định: {}", error);
                }
            }
        }
    };
}
```

### 3.4 if let và while let với Result
```rust
fn demo_if_let() {
    let result = std::fs::read_to_string("config.txt");
    
    if let Ok(content) = result {
        println!("Nội dung file: {}", content);
    } else {
        println!("Không thể đọc file");
    }
}
```

## 4. Propagating Errors với toán tử ?

### 4.1 Giới thiệu toán tử ?
- Cú pháp ngắn gọn để truyền lỗi lên hàm gọi
- Thay thế cho pattern match dài dòng
- Chỉ sử dụng được trong hàm trả về Result hoặc Option

### 4.2 Cách hoạt động
```rust
fn đọc_config() -> Result<String, std::io::Error> {
    let mut nội_dung = String::new();
    
    // Không dùng ?
    let mut file = match std::fs::File::open("config.txt") {
        Ok(file) => file,
        Err(e) => return Err(e),
    };
    
    // Dùng ?
    let mut file = std::fs::File::open("config.txt")?;
    file.read_to_string(&mut nội_dung)?;
    
    Ok(nội_dung)
}
```

### 4.3 Chuỗi các toán tử ?
```rust
fn đọc_username_từ_file() -> Result<String, std::io::Error> {
    let nội_dung = std::fs::read_to_string("config.txt")?;
    let username = nội_dung.lines().next().ok_or(std::io::Error::new(
        std::io::ErrorKind::InvalidData,
        "File config không chứa username"
    ))?;
    
    Ok(username.to_string())
}
```

### 4.4 Chuyển đổi kiểu lỗi với ?
- Toán tử ? tự động chuyển đổi lỗi thông qua trait From
- Cho phép kết hợp các loại lỗi khác nhau

```rust
fn process_data() -> Result<(), Box<dyn std::error::Error>> {
    let data = std::fs::read_to_string("data.txt")?; // std::io::Error
    let number: u32 = data.trim().parse()?;          // std::num::ParseIntError
    
    Ok(())
}
```

## 5. Custom Error Types

### 5.1 Tại sao cần custom error types
- Cung cấp thông tin lỗi cụ thể cho ứng dụng
- Nhóm nhiều loại lỗi khác nhau
- Cải thiện API của thư viện
- Giúp xử lý lỗi linh hoạt hơn

### 5.2 Tạo error type với enum
```rust
#[derive(Debug)]
enum AppError {
    IoError(std::io::Error),
    ParseError(std::num::ParseIntError),
    ConfigError(String),
}

impl std::fmt::Display for AppError {
    fn fmt(&self, f: &mut std::fmt::Formatter) -> std::fmt::Result {
        match self {
            AppError::IoError(e) => write!(f, "Lỗi IO: {}", e),
            AppError::ParseError(e) => write!(f, "Lỗi chuyển đổi số: {}", e),
            AppError::ConfigError(msg) => write!(f, "Lỗi cấu hình: {}", msg),
        }
    }
}

impl std::error::Error for AppError {}

// Chuyển đổi từ IoError sang AppError
impl From<std::io::Error> for AppError {
    fn from(error: std::io::Error) -> Self {
        AppError::IoError(error)
    }
}

// Chuyển đổi từ ParseIntError sang AppError
impl From<std::num::ParseIntError> for AppError {
    fn from(error: std::num::ParseIntError) -> Self {
        AppError::ParseError(error)
    }
}
```

### 5.3 Sử dụng custom error type
```rust
fn đọc_config() -> Result<u32, AppError> {
    let nội_dung = std::fs::read_to_string("config.txt")?; // Tự động chuyển IoError sang AppError
    
    if nội_dung.is_empty() {
        return Err(AppError::ConfigError("File config trống".to_string()));
    }
    
    let số = nội_dung.trim().parse()?; // Tự động chuyển ParseIntError sang AppError
    
    Ok(số)
}
```

## 6. Thư viện thiserror và anyhow

### 6.1 thiserror
- Giảm boilerplate code khi tạo custom error types
- Sử dụng derive macro để tự động implement các trait cần thiết
- Cách sử dụng:

```rust
use thiserror::Error;

#[derive(Error, Debug)]
enum AppError {
    #[error("Lỗi IO: {0}")]
    IoError(#[from] std::io::Error),
    
    #[error("Lỗi phân tích số: {0}")]
    ParseError(#[from] std::num::ParseIntError),
    
    #[error("Lỗi cấu hình: {0}")]
    ConfigError(String),
    
    #[error("Lỗi không hợp lệ ở dòng {line}: {message}")]
    InvalidInput { line: usize, message: String },
}
```

### 6.2 anyhow
- Thiết kế cho application code (không phải library)
- Đơn giản hóa việc xử lý nhiều loại lỗi
- Tập trung vào sự tiện lợi hơn là chi tiết về loại lỗi

```rust
use anyhow::{Context, Result, anyhow};

fn đọc_config() -> Result<u32> {
    let nội_dung = std::fs::read_to_string("config.txt")
        .context("Không thể đọc file cấu hình")?;
    
    if nội_dung.is_empty() {
        return Err(anyhow!("File cấu hình trống"));
    }
    
    let số = nội_dung.trim().parse()
        .context("Không thể chuyển đổi cấu hình thành số")?;
    
    Ok(số)
}
```

### 6.3 Khi nào dùng thiserror vs anyhow
- **thiserror**: 
  - Khi viết thư viện
  - Khi cần kiểm soát chính xác loại lỗi
  - Khi API cần rõ ràng về các loại lỗi có thể xảy ra

- **anyhow**: 
  - Khi viết application
  - Khi chỉ cần xử lý lỗi đơn giản
  - Khi không cần phân biệt chính xác loại lỗi

## 7. Ví dụ thực tế: Xây dựng ứng dụng đọc và xử lý file

### 7.1 Thiết kế cấu trúc lỗi
```rust
use thiserror::Error;

#[derive(Error, Debug)]
enum FileProcessError {
    #[error("Lỗi đọc file: {0}")]
    ReadError(#[from] std::io::Error),
    
    #[error("Lỗi định dạng ở dòng {line}: {message}")]
    FormatError { line: usize, message: String },
    
    #[error("Lỗi phân tích số: {0}")]
    ParseError(#[from] std::num::ParseIntError),
    
    #[error("File không có dữ liệu")]
    EmptyFile,
}

type Result&lt;T&gt; = std::result::Result<T, FileProcessError>;
```

### 7.2 Đọc và xử lý file
```rust
fn đọc_số_từ_file(đường_dẫn: &str) -> Result<Vec<i32>> {
    let nội_dung = std::fs::read_to_string(đường_dẫn)?;
    
    if nội_dung.trim().is_empty() {
        return Err(FileProcessError::EmptyFile);
    }
    
    let mut kết_quả = Vec::new();
    
    for (số_dòng, dòng) in nội_dung.lines().enumerate() {
        let dòng = dòng.trim();
        if dòng.is_empty() || dòng.starts_with('#') {
            continue;
        }
        
        match dòng.parse() {
            Ok(số) => kết_quả.push(số),
            Err(e) => {
                return Err(FileProcessError::FormatError {
                    line: số_dòng + 1,
                    message: format!("Không thể chuyển đổi '{}' thành số", dòng),
                });
            }
        }
    }
    
    Ok(kết_quả)
}
```

### 7.3 Sử dụng trong main
```rust
fn main() {
    let kết_quả = đọc_số_từ_file("data.txt");
    
    match kết_quả {
        Ok(số) => {
            println!("Đọc thành công {} số từ file", số.len());
            println!("Tổng: {}", số.iter().sum::<i32>());
        },
        Err(lỗi) => {
            eprintln!("Lỗi xử lý file: {}", lỗi);
            
            // Xử lý chi tiết từng loại lỗi
            match &lỗi {
                FileProcessError::EmptyFile => {
                    eprintln!("File rỗng, vui lòng thêm dữ liệu");
                },
                FileProcessError::FormatError { line, message } => {
                    eprintln!("Lỗi định dạng tại dòng {}: {}", line, message);
                    eprintln!("Vui lòng sửa lại file và thử lại");
                },
                FileProcessError::ReadError(e) => {
                    if e.kind() == std::io::ErrorKind::NotFound {
                        eprintln!("File không tồn tại, tạo file mới...");
                        // Tạo file mới
                    } else {
                        eprintln!("Không thể đọc file. Vui lòng kiểm tra quyền truy cập");
                    }
                },
                FileProcessError::ParseError(_) => {
                    eprintln!("Lỗi chuyển đổi dữ liệu");
                }
            }
            
            std::process::exit(1);
        }
    }
}
```

## 8. Thực hành: Cải thiện thông báo lỗi trong ứng dụng

### 8.1 Yêu cầu bài tập
- Xây dựng ứng dụng đọc file cấu hình dạng key-value
- Xử lý các loại lỗi có thể gặp phải
- Hiển thị thông báo lỗi thân thiện với người dùng
- Ghi log lỗi chi tiết để debug

### 8.2 Cấu trúc chương trình
```rust
use std::collections::HashMap;
use std::path::Path;
use thiserror::Error;

#[derive(Error, Debug)]
enum ConfigError {
    #[error("Lỗi đọc file: {0}")]
    IoError(#[from] std::io::Error),
    
    #[error("Lỗi định dạng ở dòng {line}: {message}")]
    FormatError { line: usize, message: String },
    
    #[error("Thiếu trường bắt buộc: {0}")]
    MissingField(String),
    
    #[error("Giá trị không hợp lệ cho {field}: {message}")]
    InvalidValue { field: String, message: String },
}

type Result&lt;T&gt; = std::result::Result<T, ConfigError>;

struct Config {
    settings: HashMap<String, String>,
}

impl Config {
    fn load(path: impl AsRef<Path>) -> Result<Self> {
        let content = std::fs::read_to_string(path)?;
        let mut settings = HashMap::new();
        
        for (line_num, line) in content.lines().enumerate() {
            let line = line.trim();
            if line.is_empty() || line.starts_with('#') {
                continue;
            }
            
            if let Some(pos) = line.find('=') {
                let key = line[..pos].trim().to_string();
                let value = line[pos+1..].trim().to_string();
                settings.insert(key, value);
            } else {
                return Err(ConfigError::FormatError {
                    line: line_num + 1,
                    message: format!("Thiếu ký tự '=' trong dòng: '{}'", line),
                });
            }
        }
        
        // Kiểm tra các trường bắt buộc
        let required_fields = ["database_url", "port"];
        for field in required_fields {
            if !settings.contains_key(field) {
                return Err(ConfigError::MissingField(field.to_string()));
            }
        }
        
        // Kiểm tra giá trị hợp lệ
        if let Some(port) = settings.get("port") {
            if let Err(_) = port.parse::<u16>() {
                return Err(ConfigError::InvalidValue { 
                    field: "port".to_string(), 
                    message: "Phải là số từ 1-65535".to_string() 
                });
            }
        }
        
        Ok(Config { settings })
    }
    
    fn get(&self, key: &str) -> Option<&String> {
        self.settings.get(key)
    }
    
    fn get_or<'a>(&'a self, key: &str, default: &'a str) -> &'a str {
        self.settings.get(key).map(|s| s.as_str()).unwrap_or(default)
    }
}

fn main() {
    match Config::load("config.ini") {
        Ok(config) => {
            println!("Đã tải cấu hình thành công!");
            println!("Database URL: {}", config.get("database_url").unwrap());
            println!("Port: {}", config.get("port").unwrap());
            println!("Timeout: {}", config.get_or("timeout", "30"));
        },
        Err(err) => {
            match &err {
                ConfigError::IoError(io_err) => {
                    match io_err.kind() {
                        std::io::ErrorKind::NotFound => {
                            eprintln!("Không tìm thấy file cấu hình!");
                            eprintln!("Tạo file config.ini với nội dung sau:");
                            eprintln!("database_url = postgres://user:pass@localhost/dbname");
                            eprintln!("port = 8080");
                        },
                        std::io::ErrorKind::PermissionDenied => {
                            eprintln!("Không có quyền đọc file cấu hình!");
                        },
                        _ => {
                            eprintln!("Lỗi đọc file: {}", io_err);
                        }
                    }
                },
                ConfigError::FormatError { line, message } => {
                    eprintln!("Lỗi định dạng tại dòng {}: {}", line, message);
                    eprintln!("Mỗi dòng phải có định dạng: key = value");
                },
                ConfigError::MissingField(field) => {
                    eprintln!("Thiếu trường cấu hình bắt buộc: {}", field);
                    eprintln!("Vui lòng thêm trường này vào file cấu hình");
                },
                ConfigError::InvalidValue { field, message } => {
                    eprintln!("Giá trị không hợp lệ cho trường {}: {}", field, message);
                }
            }
            
            // Ghi log chi tiết
            eprintln!("\nChi tiết lỗi để debug:");
            eprintln!("{:?}", err);
            
            std::process::exit(1);
        }
    }
}
```

## 9. Các chiến thuật nâng cao và best practices

### 9.1 Sử dụng Context
- Thêm ngữ cảnh vào lỗi để dễ debug
- Ví dụ với anyhow:
```rust
use anyhow::{Context, Result};

fn read_config() -> Result<Config> {
    let content = std::fs::read_to_string("config.ini")
        .context("Không thể đọc file cấu hình")?;
    
    // ...
}
```

### 9.2 Chuyển đổi lỗi phù hợp
- Chuyển đổi lỗi cấp thấp thành lỗi có ngữ cảnh phù hợp
- Không để lộ chi tiết triển khai qua lỗi

```rust
fn validate_input(input: &str) -> Result<(), AppError> {
    if input.parse::<i32>().is_err() {
        return Err(AppError::ValidationError("Input phải là số".to_string()));
    }
    
    Ok(())
}
```

### 9.3 Logging errors
- Kết hợp xử lý lỗi với logging
- Sử dụng thư viện log hoặc tracing

```rust
use log::{error, warn, info};

fn process_file(path: &str) -> Result<(), AppError> {
    match std::fs::read_to_string(path) {
        Ok(content) => {
            info!("Đã đọc file {} thành công", path);
            // Xử lý content
            Ok(())
        },
        Err(e) => {
            error!("Không thể đọc file {}: {}", path, e);
            Err(AppError::from(e))
        }
    }
}
```

### 9.4 Testing error handling
- Kiểm tra các trường hợp lỗi trong unit tests
- Đảm bảo mã xử lý lỗi hoạt động đúng

```rust
#[test]
fn test_missing_file() {
    let result = đọc_file("không_tồn_tại.txt");
    assert!(result.is_err());
    
    if let Err(e) = result {
        match e {
            AppError::IoError(io_error) => {
                assert_eq!(io_error.kind(), std::io::ErrorKind::NotFound);
            },
            _ => panic!("Loại lỗi không đúng"),
        }
    }
}
```

## 10. Tổng kết

### 10.1 Nguyên tắc xử lý lỗi trong Rust
- Tường minh và bắt buộc xử lý lỗi
- Phân biệt rõ recoverable và unrecoverable errors
- Tận dụng type system để xử lý lỗi an toàn

### 10.2 Tóm tắt kiến thức
- `panic!` cho unrecoverable errors
- `Result&lt;T, E&gt;` cho recoverable errors
- Toán tử `?` để lan truyền lỗi
- Custom error types cho API rõ ràng
- Thư viện thiserror và anyhow để đơn giản hóa

### 10.3 Các bước tiếp theo
- Tìm hiểu thêm về error handling trong async/await
- Nghiên cứu các pattern xử lý lỗi trong các thư viện lớn
- Xây dựng error handling framework cho dự án của riêng bạn

## Bài tập về nhà

1. Viết một chương trình đọc file CSV, xử lý dữ liệu và ghi kết quả ra file mới với xử lý lỗi đầy đủ
2. Cải thiện ứng dụng cấu hình để hỗ trợ:
   - Nhiều nguồn cấu hình (file, biến môi trường)
   - Mã hóa/giải mã các giá trị nhạy cảm
   - Tự động tạo file cấu hình mẫu nếu không tồn tại
3. Tạo một thư viện xử lý lỗi tùy chỉnh cho domain cụ thể (ví dụ: web API, xử lý dữ liệu, database access)

## 11. Ví dụ thực tế: Ứng dụng đọc và xử lý file

Sau đây là một ví dụ hoàn chỉnh của ứng dụng đọc và xử lý file với error handling chuyên nghiệp:

```rust
use std::fs::File;
use std::io::{self, BufRead, BufReader, Write};
use std::path::Path;
use thiserror::Error;

// Định nghĩa các loại lỗi
#[derive(Error, Debug)]
enum AppError {
    #[error("Lỗi đọc file: {0}")]
    IoError(#[from] io::Error),
    
    #[error("Lỗi phân tích số ở dòng {line}: {source}")]
    ParseError {
        line: usize,
        #[source] source: std::num::ParseIntError
    },
    
    #[error("File đầu vào trống")]
    EmptyFile,
    
    #[error("Không tìm thấy số nào trong file")]
    NoNumbers,
}

// Type alias để viết code ngắn gọn hơn
type Result&lt;T&gt; = std::result::Result<T, AppError>;

// Hàm đọc số từ file, tính tổng và ghi ra file mới
fn process_numbers(input_path: &str, output_path: &str) -> Result<i64> {
    println!("Đọc số từ file: {}", input_path);
    
    // Mở file đầu vào
    let file = File::open(input_path)?;
    let reader = BufReader::new(file);
    let lines: Vec<String> = reader.lines().collect::<io::Result<_>>()?;
    
    if lines.is_empty() {
        return Err(AppError::EmptyFile);
    }
    
    // Đọc và phân tích các số
    let mut numbers = Vec::new();
    
    for (idx, line) in lines.iter().enumerate() {
        let line = line.trim();
        
        // Bỏ qua dòng trống và comment
        if line.is_empty() || line.starts_with('#') {
            continue;
        }
        
        // Phân tích số
        match line.parse::<i64>() {
            Ok(num) => numbers.push(num),
            Err(err) => {
                return Err(AppError::ParseError {
                    line: idx + 1,
                    source: err,
                });
            }
        }
    }
    
    if numbers.is_empty() {
        return Err(AppError::NoNumbers);
    }
    
    // Tính tổng
    let sum: i64 = numbers.iter().sum();
    let average: f64 = sum as f64 / numbers.len() as f64;
    
    // Ghi kết quả ra file mới
    let mut output = File::create(output_path)?;
    writeln!(output, "Số lượng số: {}", numbers.len())?;
    writeln!(output, "Tổng: {}", sum)?;
    writeln!(output, "Trung bình: {:.2}", average)?;
    writeln!(output, "Giá trị lớn nhất: {}", numbers.iter().max().unwrap())?;
    writeln!(output, "Giá trị nhỏ nhất: {}", numbers.iter().min().unwrap())?;
    
    println!("Đã ghi kết quả vào file: {}", output_path);
    
    Ok(sum)
}

fn main() {
    // Đường dẫn file
    let input_file = "numbers.txt";
    let output_file = "results.txt";
    
    // Xử lý kết quả từ hàm process_numbers
    match process_numbers(input_file, output_file) {
        Ok(sum) => {
            println!("✅ Xử lý thành công!");
            println!("Tổng các số: {}", sum);
        },
        Err(error) => {
            // Xử lý từng loại lỗi với thông báo thân thiện
            match &error {
                AppError::IoError(io_error) => {
                    match io_error.kind() {
                        io::ErrorKind::NotFound => {
                            eprintln!("❌ Không tìm thấy file: {}", input_file);
                            eprintln!("Vui lòng tạo file với danh sách các số, mỗi số trên một dòng.");
                            
                            // Tạo file mẫu nếu không tồn tại
                            if !Path::new(input_file).exists() {
                                println!("Đang tạo file mẫu...");
                                let mut sample = File::create(input_file).unwrap();
                                writeln!(sample, "# Danh sách các số (mỗi số một dòng)").unwrap();
                                writeln!(sample, "42").unwrap();
                                writeln!(sample, "17").unwrap();
                                writeln!(sample, "123").unwrap();
                                println!("Đã tạo file mẫu: {}", input_file);
                            }
                        },
                        io::ErrorKind::PermissionDenied => {
                            eprintln!("❌ Không có quyền truy cập file: {}", input_file);
                            eprintln!("Vui lòng kiểm tra quyền của file và thử lại.");
                        },
                        _ => {
                            eprintln!("❌ Lỗi khi đọc/ghi file: {}", io_error);
                        }
                    }
                },
                AppError::ParseError { line, source } => {
                    eprintln!("❌ Lỗi ở dòng {}: không thể chuyển đổi thành số", line);
                    eprintln!("Chi tiết: {}", source);
                    eprintln!("Vui lòng kiểm tra và đảm bảo tất cả các dòng đều chứa số nguyên hợp lệ.");
                },
                AppError::EmptyFile => {
                    eprintln!("❌ File đầu vào trống.");
                    eprintln!("Vui lòng thêm các số vào file và thử lại.");
                },
                AppError::NoNumbers => {
                    eprintln!("❌ Không tìm thấy số nào trong file.");
                    eprintln!("File có thể chỉ chứa các dòng trống hoặc comment.");
                }
            }
            
            // In chi tiết lỗi ở dạng debug để giúp khắc phục
            eprintln!("\nChi tiết lỗi: {:?}", error);
            
            // Thoát với mã lỗi
            std::process::exit(1);
        }
    }
}
```

### Giải thích ví dụ:

1. **Custom Error Type**: Sử dụng enum `AppError` để biểu diễn các loại lỗi cụ thể
2. **thiserror**: Sử dụng `#[derive(Error)]` để tự động triển khai các trait cần thiết
3. **Error Context**: Thêm ngữ cảnh cho lỗi (ví dụ: số dòng gặp lỗi) 
4. **Error Propagation**: Sử dụng toán tử `?` để lan truyền lỗi lên hàm gọi
5. **User-Friendly Messages**: Hiển thị thông báo lỗi thân thiện với người dùng
6. **Recovery Mechanisms**: Tự động tạo file mẫu nếu file không tồn tại

## 12. Tài liệu tham khảo

### Sách và tài liệu chính thức
- [The Rust Programming Language](https://doc.rust-lang.org/book/ch09-00-error-handling.html) - Chương 9: Error Handling
- [Rust By Example](https://doc.rust-lang.org/rust-by-example/error.html) - Error Handling
- [Rustonomicon](https://doc.rust-lang.org/nomicon/unwinding.html) - Unwinding

### Thư viện hữu ích
- [thiserror](https://github.com/dtolnay/thiserror) - Định nghĩa error types dễ dàng
- [anyhow](https://github.com/dtolnay/anyhow) - Error handling linh hoạt
- [eyre](https://github.com/yaahc/eyre) - Error reporting trong Rust
- [snafu](https://github.com/shepmaster/snafu) - Error handling chi tiết và context
- [miette](https://github.com/zkat/miette) - Error handling với diagnostic reporting đẹp mắt

### Bài viết và hướng dẫn
- [Error Handling in Rust](https://blog.burntsushi.net/rust-error-handling/) - Andrew Gallant (BurntSushi)
- [Rust Error Handling Best Practices](https://nick.groenen.me/posts/rust-error-handling/) - Nick Groenen
- [Pretty Errors with Thiserror and Anyhow](https://robertohuertas.com/2020/05/05/pretty-errors-with-thiserror-and-anyhow/) - Roberto Huertas

## 13. FAQ - Câu hỏi thường gặp

### 1. Khi nào nên dùng panic! và khi nào nên dùng Result?
- Dùng `panic!` khi:
  - Gặp lỗi không thể phục hồi, chương trình không thể tiếp tục an toàn
  - Lỗi là do lập trình sai và nên được phát hiện trong quá trình phát triển
  - Các tình huống "không thể xảy ra" (unwrap trên Option/Result đã kiểm tra)
- Dùng `Result` khi:
  - Lỗi có thể xảy ra và có thể xử lý một cách hợp lý
  - Tương tác với bên ngoài (file, network, input)
  - API cần cho phép người dùng tự quyết định cách xử lý lỗi

### 2. Làm thế nào để chuyển đổi từ một kiểu lỗi sang kiểu lỗi khác?
- Triển khai trait `From&lt;OtherError&gt;` cho error type của bạn
- Sử dụng thiserror và thuộc tính `#[from]`
- Sử dụng `map_err()` để chuyển đổi lỗi trong `Result`
- Sử dụng toán tử `?` (yêu cầu trait `From` được triển khai)

### 3. Làm sao để tránh quá nhiều match trong code xử lý lỗi?
- Sử dụng toán tử `?` để truyền lỗi
- Sử dụng các phương thức như `unwrap_or`, `unwrap_or_else`
- Sử dụng thư viện như anyhow cho application code
- Tạo các helper function để tái sử dụng logic xử lý lỗi

### 4. Làm thế nào để xử lý lỗi trong async functions?
- Các nguyên tắc tương tự như với code đồng bộ
- Toán tử `?` vẫn hoạt động bình thường trong async functions
- Kết hợp với futures để xử lý lỗi trong các tác vụ đồng thời
- Cân nhắc sử dụng `try_join!` thay vì `join!` nếu muốn lỗi lan truyền

### 5. Khi nào nên tạo custom error type và khi nào dùng Box&lt;dyn Error&gt;?
- Tạo custom error type khi:
  - Viết thư viện với API công khai
  - Cần xử lý chi tiết từng loại lỗi
  - Muốn cung cấp thông tin lỗi cụ thể
- Dùng `Box&lt;dyn Error&gt;` hoặc `anyhow::Error` khi:
  - Viết ứng dụng, không phải thư viện
  - Chỉ cần hiển thị lỗi, không cần xử lý chi tiết
  - Cần kết hợp nhiều loại lỗi khác nhau một cách đơn giản

## 14. Phụ lục: Các pattern xử lý lỗi nâng cao

### 1. Fallible Iterator
```rust
fn process_items<I>(items: I) -> Result<Vec<i32>, AppError>
where
    I: Iterator<Item = Result<i32, AppError>>,
{
    items.collect()
}
```

### 2. Error Context Stack
```rust
use anyhow::{Context, Result};

fn read_config() -> Result<Config> {
    std::fs::read_to_string("config.json")
        .context("Đọc file cấu hình")?
        .parse::<serde_json::Value>()
        .context("Phân tích JSON")?
        .try_into()
        .context("Chuyển đổi thành Config")
}
```

### 3. Typed Error Handling
```rust
enum DatabaseError {
    ConnectionFailed(String),
    QueryFailed(String),
    TransactionFailed(String),
}

enum ApiError {
    NotFound,
    Unauthorized,
    InternalError(Box<dyn std::error::Error>),
}

impl From<DatabaseError> for ApiError {
    fn from(err: DatabaseError) -> Self {
        match err {
            DatabaseError::ConnectionFailed(_) | DatabaseError::TransactionFailed(_) => 
                ApiError::InternalError(Box::new(err)),
            DatabaseError::QueryFailed(_) => 
                ApiError::NotFound,
        }
    }
}
```

### 4. Try Blocks (Experimental)
```rust
fn process() -> Result<(), AppError> {
    let result = try {
        let file = std::fs::File::open("data.txt")?;
        let content = std::io::read_to_string(file)?;
        content.parse::<i32>()?
    };
    
    match result {
        Ok(number) => println!("Số: {}", number),
        Err(err) => println!("Lỗi: {}", err),
    }
    
    Ok(())
}
```

### 5. Railway Oriented Programming
```rust
fn validate_then_process(input: &str) -> Result<Output, AppError> {
    validate_input(input)
        .and_then(parse_input)
        .and_then(process_data)
        .and_then(format_output)
}
```

## 15. Các bước chuẩn bị cho bài giảng

### 1. Chuẩn bị môi trường
- Tạo dự án Rust mới: `cargo new error_handling_demo`
- Thêm dependencies vào Cargo.toml:
  ```toml
  [dependencies]
  thiserror = "1.0.40"
  anyhow = "1.0.70"
  serde = { version = "1.0", features = ["derive"] }
  serde_json = "1.0"
  ```

### 2. Chuẩn bị file demo
- Tạo file `numbers.txt` với nội dung:
  ```
  # Danh sách các số
  42
  17
  xấu
  123
  ```
- Tạo file `config.ini` với nội dung:
  ```
  # Cấu hình ứng dụng
  database_url = postgres://user:pass@localhost/dbname
  port = 8080
  timeout = 30
  ```

### 3. Chuẩn bị slides hoặc tài liệu trình chiếu
- Các điểm chính của bài giảng
- Code mẫu cho từng phần
- Diagram minh họa các khái niệm (Result, propagation, etc.)

### 4. Chuẩn bị bài tập về nhà
- Tạo template code cho học viên
- Chuẩn bị test cases để học viên tự kiểm tra
- Tạo các yêu cầu với nhiều cấp độ khó khác nhau

## 16. Tóm tắt bài giảng

Error handling trong Rust là một phần không thể thiếu để viết code an toàn và đáng tin cậy. Rust cung cấp các công cụ mạnh mẽ như `panic!` cho unrecoverable errors và `Result&lt;T, E&gt;` cho recoverable errors. Toán tử `?` giúp code xử lý lỗi trở nên ngắn gọn và dễ đọc. Việc tạo custom error types với `thiserror` hoặc sử dụng `anyhow` giúp ứng dụng có thể xử lý và báo cáo lỗi một cách chuyên nghiệp.

Sau bài học này, bạn đã có đủ kiến thức để:
1. Phân biệt và sử dụng đúng các phương pháp xử lý lỗi
2. Tạo custom error types phù hợp cho ứng dụng của bạn
3. Sử dụng các thư viện hỗ trợ xử lý lỗi
4. Xây dựng ứng dụng với error handling chuyên nghiệp

Trong các bài giảng tiếp theo, chúng ta sẽ tìm hiểu về error handling trong context của programming bất đồng bộ và làm việc với web APIs.

Chúc các bạn học tập hiệu quả!