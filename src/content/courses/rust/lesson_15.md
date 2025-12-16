# Bài 15: Collections - HashMaps trong Rust

## Giới thiệu (5 phút)

**Lời chào và giới thiệu**
- Chào mừng các bạn đến với bài học thứ 15 trong chuỗi bài giảng về ngôn ngữ lập trình Rust
- Hôm nay chúng ta sẽ tìm hiểu về HashMap - một trong những collections quan trọng và phổ biến nhất trong Rust
- HashMap giúp chúng ta lưu trữ dữ liệu theo dạng cặp key-value, giúp tìm kiếm dữ liệu nhanh chóng và hiệu quả

**Tại sao HashMap lại quan trọng?**
- HashMap là cấu trúc dữ liệu cơ bản trong hầu hết các ngôn ngữ lập trình
- Trong thực tế, HashMap được sử dụng rộng rãi để:
  - Lưu trữ cấu hình ứng dụng
  - Đếm tần suất xuất hiện (ví dụ: đếm từ trong văn bản)
  - Cache dữ liệu
  - Xây dựng các indexes cho cơ sở dữ liệu

**Tổng quan nội dung bài học**
- Hiểu về HashMap và cách hoạt động
- Các phương thức cơ bản của HashMap
- Thêm và truy xuất dữ liệu
- Ownership và borrowing với HashMap
- Cập nhật giá trị dựa trên giá trị cũ
- Hàm băm (hash functions)
- Thực hành: Xây dựng chương trình đếm từ và ứng dụng cấu hình

## Phần 1: HashMap<K, V> và Cách Hoạt Động (10 phút)

**Khái niệm cơ bản**
- HashMap<K, V> là một collection lưu trữ dữ liệu theo cặp key-value
- K: kiểu dữ liệu của key (phải implement trait `Hash` + `Eq`)
- V: kiểu dữ liệu của value (có thể là bất kỳ kiểu nào)

**Import và khởi tạo**
```rust
// Import HashMap từ standard library
use std::collections::HashMap;

// Khởi tạo HashMap rỗng
let mut scores = HashMap::new();

// Khởi tạo với kiểu chỉ định rõ ràng
let mut scores: HashMap<String, i32> = HashMap::new();

// Khởi tạo từ vectors sử dụng collect
let teams = vec![String::from("Blue"), String::from("Red")];
let initial_scores = vec![10, 50];
let mut scores: HashMap<_, _> = teams.into_iter().zip(initial_scores.into_iter()).collect();
```

**Nguyên lý hoạt động**
- Hàm băm (hash function) chuyển đổi key thành số nguyên (hash code)
- Hash code được dùng để xác định vị trí lưu trữ value trong bộ nhớ
- Rust sử dụng SipHash làm thuật toán băm mặc định - cân bằng giữa tốc độ và bảo mật
- Khi có nhiều keys cùng hash code (collision), Rust sử dụng linked list để lưu trữ

**Các thuộc tính quan trọng**
- Truy xuất nhanh: O(1) trong trường hợp tốt nhất
- Không đảm bảo thứ tự các phần tử
- Tự động tăng kích thước khi cần thiết
- Không thể có hai key giống nhau

## Phần 2: Inserting và Retrieving Dữ Liệu (10 phút)

**Thêm dữ liệu**
```rust
let mut scores = HashMap::new();

// Thêm dữ liệu với insert
scores.insert(String::from("Blue"), 10);
scores.insert(String::from("Red"), 50);

// Ghi đè giá trị nếu key đã tồn tại
scores.insert(String::from("Blue"), 25); // Giá trị "Blue" giờ là 25
```

**Truy xuất dữ liệu**
```rust
// Sử dụng get - trả về Option<&V>
let team_name = String::from("Blue");
let score = scores.get(&team_name);
match score {
    Some(s) => println!("Score của team Blue: {}", s),
    None => println!("Không tìm thấy team Blue"),
}

// Sử dụng indexing với []
// Chú ý: Có thể panic nếu key không tồn tại
let blue_score = scores["Blue"];
println!("Score của team Blue: {}", blue_score);

// Kiểm tra key tồn tại hay không
if scores.contains_key(&team_name) {
    println!("Team Blue đã có trong HashMap");
}
```

**Thêm dữ liệu có điều kiện**
```rust
// entry API - thêm nếu không tồn tại
scores.entry(String::from("Yellow")).or_insert(0);

// or_insert trả về &mut V, cho phép chỉnh sửa value
let yellow_score = scores.entry(String::from("Yellow")).or_insert(0);
*yellow_score += 1; // Tăng điểm
```

**Duyệt qua tất cả các phần tử**
```rust
for (key, value) in &scores {
    println!("{}: {}", key, value);
}
```

## Phần 3: Ownership với HashMap (10 phút)

**Quy tắc ownership với key và value**
- Đối với kiểu dữ liệu không implement Copy trait:
  - HashMap sẽ take ownership của key và value khi insert
  - Data được move vào HashMap, không thể sử dụng sau khi insert

```rust
let team_name = String::from("Blue");
let team_score = 10;

let mut scores = HashMap::new();
scores.insert(team_name, team_score);

// OK vì i32 implement Copy trait
println!("Score: {}", team_score);

// Error: team_name đã bị move vào HashMap
// println!("Team: {}", team_name);
```

**Clone để giữ lại ownership**
```rust
let team_name = String::from("Blue");
let mut scores = HashMap::new();

// Sử dụng clone để giữ lại ownership
scores.insert(team_name.clone(), 10);
println!("Team: {}", team_name); // OK vì chúng ta đã clone
```

**Borrowing từ HashMap**
```rust
let blue_score = scores.get("Blue");
// blue_score là &i32, tham chiếu đến giá trị trong HashMap

let mut scores = HashMap::new();
scores.insert(String::from("Blue"), 10);

// Mượn tham chiếu có thể chỉnh sửa
if let Some(score) = scores.get_mut("Blue") {
    *score += 5; // Tăng điểm thêm 5
}
```

**Lifetime với tham chiếu từ HashMap**
- Tham chiếu từ `get()` và `get_mut()` chỉ hợp lệ khi HashMap còn tồn tại
- Borrow checker đảm bảo ta không thể sử dụng tham chiếu sau khi HashMap bị drop

## Phần 4: Cập Nhật Giá Trị Dựa Trên Giá Trị Cũ (10 phút)

**Đếm tần suất**
```rust
let text = "hello world wonderful world";
let mut word_count = HashMap::new();

for word in text.split_whitespace() {
    // Lấy tham chiếu đến giá trị hiện tại hoặc tạo mới với giá trị 0
    let count = word_count.entry(word).or_insert(0);
    // Tăng giá trị lên 1
    *count += 1;
}

println!("{:?}", word_count);
// Output: {"world": 2, "hello": 1, "wonderful": 1}
```

**Thay thế giá trị**
```rust
let mut scores = HashMap::new();
scores.insert("Blue", 10);

// Phương thức 1: Kiểm tra trước khi thay thế
if let Some(value) = scores.get_mut("Blue") {
    if *value < 20 {
        *value = 20;
    }
}

// Phương thức 2: Sử dụng entry API
scores.entry("Blue").and_modify(|score| {
    if *score < 20 {
        *score = 20;
    }
}).or_insert(20);
```

**Thêm hoặc cập nhật (upsert)**
```rust
let mut player_stats = HashMap::new();

// Thêm mới hoặc cập nhật thông tin người chơi
fn update_player(
    stats: &mut HashMap<String, (i32, i32, i32)>, 
    name: &str, 
    kills: i32, 
    deaths: i32, 
    assists: i32
) {
    stats.entry(name.to_string()).and_modify(|stat| {
        stat.0 += kills;
        stat.1 += deaths;
        stat.2 += assists;
    }).or_insert((kills, deaths, assists));
}

update_player(&mut player_stats, "Player1", 5, 2, 3);
update_player(&mut player_stats, "Player1", 3, 1, 2); // Cập nhật thêm

println!("{:?}", player_stats);
// Output: {"Player1": (8, 3, 5)}
```

## Phần 5: Hàm Băm và Bảo Mật (10 phút)

**HashDoS và SipHash**
- Hash DoS (Denial of Service) là kiểu tấn công khi kẻ tấn công tạo ra nhiều keys gây collision
- Rust sử dụng SipHash-1-3 làm thuật toán băm mặc định
- SipHash có thể hơi chậm hơn một số thuật toán khác nhưng an toàn hơn về mặt bảo mật

**Tùy chỉnh hàm băm**
- Bạn có thể sử dụng hàm băm khác bằng BuildHasher trait
- Thư viện ngoài như `fnv` cung cấp hàm băm nhanh hơn cho các trường hợp không yêu cầu bảo mật cao

```rust
// Cần thêm fnv crate vào Cargo.toml trước
use fnv::FnvHashMap;

// Sử dụng FnvHashMap thay vì HashMap thông thường
let mut scores = FnvHashMap::default();
scores.insert(String::from("Blue"), 10);
```

**Implement các trait cần thiết cho key tùy chỉnh**
```rust
use std::collections::HashMap;
use std::hash::{Hash, Hasher};

struct Team {
    id: u32,
    name: String,
}

// Cần implement Eq và Hash để dùng làm key
impl PartialEq for Team {
    fn eq(&self, other: &Self) -> bool {
        self.id == other.id
    }
}

impl Eq for Team {}

impl Hash for Team {
    fn hash<H: Hasher>(&self, state: &mut H) {
        // Chỉ hash id, không hash name
        self.id.hash(state);
    }
}

// Giờ có thể dùng Team làm key
let mut team_scores = HashMap::new();
team_scores.insert(Team { id: 1, name: String::from("Blue") }, 10);
```

## Phần 6: Thực Hành - Đếm Từ trong Văn Bản (15 phút)

**Bài tập: Viết chương trình đếm từ**
```rust
use std::collections::HashMap;
use std::io;

fn main() {
    println!("Nhập văn bản để đếm từ:");
    
    let mut input = String::new();
    io::stdin()
        .read_line(&mut input)
        .expect("Không thể đọc input");
    
    let word_counts = count_words(&input);
    
    // In ra 5 từ xuất hiện nhiều nhất
    print_top_words(&word_counts, 5);
}

fn count_words(text: &str) -> HashMap<String, usize> {
    let mut word_counts = HashMap::new();
    
    // Chuyển thành chữ thường và loại bỏ dấu câu
    let text = text.to_lowercase();
    let text = text.replace(&['.', ',', '!', '?', ':', ';', '"', '(', ')', '[', ']'], "");
    
    for word in text.split_whitespace() {
        *word_counts.entry(word.to_string()).or_insert(0) += 1;
    }
    
    word_counts
}

fn print_top_words(word_counts: &HashMap<String, usize>, limit: usize) {
    // Chuyển hashmap thành vector để có thể sắp xếp
    let mut counts_vec: Vec<(&String, &usize)> = word_counts.iter().collect();
    
    // Sắp xếp theo số lần xuất hiện (giảm dần)
    counts_vec.sort_by(|a, b| b.1.cmp(a.1));
    
    println!("\nCác từ xuất hiện nhiều nhất:");
    println!("{:<15} {:<10}", "Từ", "Số lần");
    println!("{:-<26}", "");
    
    for (i, (word, count)) in counts_vec.iter().take(limit).enumerate() {
        println!("{:<15} {:<10}", word, count);
    }
}
```

**Giải thích từng bước:**
1. Đọc văn bản từ người dùng
2. Tiền xử lý: chuyển sang chữ thường, loại bỏ dấu câu
3. Tách thành các từ riêng lẻ và đếm số lần xuất hiện bằng HashMap
4. Sắp xếp các từ theo tần suất xuất hiện
5. In ra các từ xuất hiện nhiều nhất

**Nâng cao:**
- Thêm chức năng lọc từ (stop words)
- Lưu kết quả vào file
- Đọc văn bản từ file

## Phần 7: Thực Hành - Lưu Trữ Cấu Hình (15 phút)

**Bài tập: Tạo một ứng dụng quản lý cấu hình đơn giản**
```rust
use std::collections::HashMap;
use std::io;
use std::fs;
use std::io::Write;

struct ConfigManager {
    config: HashMap<String, String>,
    filename: String,
}

impl ConfigManager {
    // Tạo mới với file được chỉ định
    fn new(filename: &str) -> Self {
        let config = Self::load_from_file(filename)
            .unwrap_or_else(|_| HashMap::new());
            
        ConfigManager {
            config,
            filename: filename.to_string(),
        }
    }
    
    // Đọc cấu hình từ file
    fn load_from_file(filename: &str) -> Result<HashMap<String, String>, io::Error> {
        let contents = fs::read_to_string(filename)?;
        let mut config = HashMap::new();
        
        for line in contents.lines() {
            if line.trim().is_empty() || line.starts_with('#') {
                continue;
            }
            
            if let Some((key, value)) = line.split_once('=') {
                config.insert(key.trim().to_string(), value.trim().to_string());
            }
        }
        
        Ok(config)
    }
    
    // Lưu cấu hình vào file
    fn save_to_file(&self) -> Result<(), io::Error> {
        let mut file = fs::File::create(&self.filename)?;
        
        writeln!(&mut file, "# Configuration file")?;
        writeln!(&mut file, "# Generated on: {}", chrono::Local::now())?;
        writeln!(&mut file)?;
        
        for (key, value) in &self.config {
            writeln!(&mut file, "{} = {}", key, value)?;
        }
        
        Ok(())
    }
    
    // Lấy giá trị với key
    fn get(&self, key: &str) -> Option<&String> {
        self.config.get(key)
    }
    
    // Đặt giá trị cho key
    fn set(&mut self, key: &str, value: &str) {
        self.config.insert(key.to_string(), value.to_string());
    }
    
    // Xóa key
    fn remove(&mut self, key: &str) -> bool {
        self.config.remove(key).is_some()
    }
    
    // Hiển thị tất cả cấu hình
    fn display_all(&self) {
        println!("\nCấu hình hiện tại:");
        println!("{:<20} {:<20}", "Key", "Value");
        println!("{:-<41}", "");
        
        for (key, value) in &self.config {
            println!("{:<20} {:<20}", key, value);
        }
    }
}

fn main() {
    let mut config_manager = ConfigManager::new("app_config.txt");
    
    loop {
        println!("\n--- QUẢN LÝ CẤU HÌNH ---");
        println!("1. Hiển thị tất cả cấu hình");
        println!("2. Thêm/Cập nhật cấu hình");
        println!("3. Xóa cấu hình");
        println!("4. Lưu vào file");
        println!("0. Thoát");
        
        let mut choice = String::new();
        io::stdin().read_line(&mut choice).expect("Lỗi đọc input");
        
        match choice.trim() {
            "1" => config_manager.display_all(),
            "2" => {
                println!("Nhập key:");
                let mut key = String::new();
                io::stdin().read_line(&mut key).expect("Lỗi đọc input");
                
                println!("Nhập value:");
                let mut value = String::new();
                io::stdin().read_line(&mut value).expect("Lỗi đọc input");
                
                config_manager.set(key.trim(), value.trim());
                println!("Đã cập nhật cấu hình.");
            },
            "3" => {
                println!("Nhập key cần xóa:");
                let mut key = String::new();
                io::stdin().read_line(&mut key).expect("Lỗi đọc input");
                
                if config_manager.remove(key.trim()) {
                    println!("Đã xóa cấu hình.");
                } else {
                    println!("Không tìm thấy key.");
                }
            },
            "4" => {
                match config_manager.save_to_file() {
                    Ok(_) => println!("Đã lưu cấu hình vào file."),
                    Err(e) => println!("Lỗi khi lưu file: {}", e),
                }
            },
            "0" => break,
            _ => println!("Lựa chọn không hợp lệ."),
        }
    }
}
```

**Đặc điểm của ứng dụng:**
1. Đọc và ghi cấu hình từ/vào file text
2. Giao diện dòng lệnh đơn giản
3. Hỗ trợ các thao tác CRUD với cấu hình

## Phần 8: Tóm Tắt Bài Học (5 phút)

**Những gì chúng ta đã học**
- Khái niệm và cách sử dụng HashMap trong Rust
- Thao tác cơ bản: thêm, truy xuất, cập nhật, xóa
- Xử lý ownership và borrowing
- Cách cập nhật giá trị dựa trên giá trị cũ
- Hiểu về hàm băm và cách Rust bảo đảm an toàn
- Thực hành với các ứng dụng thực tế

**Bài tập về nhà**
1. Mở rộng ứng dụng đếm từ
   - Thêm tính năng so sánh hai văn bản
   - Lọc các stop words
   - Phân tích tần suất theo độ dài từ

2. Nâng cao ứng dụng quản lý cấu hình
   - Hỗ trợ cấu hình phân cấp
   - Thêm tính năng import/export JSON
   - Thêm tính năng xác thực kiểu dữ liệu

**Tài liệu tham khảo**
- Rust Book: https://doc.rust-lang.org/book/ch08-03-hash-maps.html
- Rust by Example: https://doc.rust-lang.org/rust-by-example/std/hash.html
- Rust std::collections: https://doc.rust-lang.org/std/collections/index.html

## Kết Luận (2 phút)

**Tổng kết**
- HashMap là một cấu trúc dữ liệu mạnh mẽ trong Rust
- Cho phép lưu trữ và truy xuất dữ liệu một cách hiệu quả
- API trực quan nhưng vẫn tuân theo quy tắc ownership của Rust
- Có nhiều ứng dụng thực tế trong phát triển phần mềm

**Buổi sau**
- Trong bài học tiếp theo, chúng ta sẽ tìm hiểu về các collections khác như BTreeMap, HashSet và BTreeSet
- Chúng ta cũng sẽ đi sâu hơn vào cách tối ưu hóa hiệu suất khi làm việc với collections trong Rust

**Lời cảm ơn**
- Cảm ơn các bạn đã theo dõi bài học này
- Hãy để lại bình luận hoặc câu hỏi bên dưới video
- Đừng quên like, share và subscribe để không bỏ lỡ các bài học tiếp theo!