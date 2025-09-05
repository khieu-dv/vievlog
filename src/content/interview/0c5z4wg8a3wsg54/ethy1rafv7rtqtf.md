---
title: "Câu hỏi 1: Sự khác biệt giữa `val` và `var` trong Kotlin là gì?"
postId: "ethy1rafv7rtqtf"
category: "Android Interview"
created: "2/9/2025"
updated: "2/9/2025"
---

# Câu hỏi 1: Sự khác biệt giữa `val` và `var` trong Kotlin là gì?


## 📝 Nội dung chi tiết

### Khái niệm cơ bản

**`val` (value)** và **`var` (variable)** là hai từ khóa quan trọng trong Kotlin để khai báo biến, nhưng chúng có cách hoạt động hoàn toàn khác nhau về tính bất biến (immutability).

#### 1. `val` - Immutable Reference (Tham chiếu bất biến)

`val` tạo ra một tham chiếu **chỉ đọc** (read-only). Một khi đã được gán giá trị, bạn không thể thay đổi tham chiếu đó nữa.

```kotlin
val name = "John"
// name = "Jane" // ❌ Compile error! Val cannot be reassigned
```

**Lưu ý quan trọng:** `val` chỉ làm cho **tham chiếu** bất biến, không phải **nội dung** của object:

```kotlin
val mutableList = mutableListOf("Apple", "Banana")
mutableList.add("Orange") // ✅ OK - Nội dung của list có thể thay đổi
// mutableList = mutableListOf("New List") // ❌ Error - Không thể gán lại tham chiếu
```

#### 2. `var` - Mutable Reference (Tham chiếu có thể thay đổi)

`var` tạo ra một tham chiếu **có thể thay đổi**. Bạn có thể gán lại giá trị bao nhiêu lần tùy thích.

```kotlin
var age = 25
age = 26 // ✅ OK - Có thể thay đổi giá trị
age = 30 // ✅ OK - Có thể thay đổi nhiều lần
```

### So sánh với Java

| Kotlin | Java Equivalent | Mô tả |
|--------|-----------------|-------|
| `val` | `final` | Chỉ có thể gán một lần |
| `var` | (không có `final`) | Có thể gán lại nhiều lần |

```kotlin
// Kotlin
val finalValue = "Hello"
var mutableValue = "World"

// Java tương đương
final String finalValue = "Hello";
String mutableValue = "World";
```

### Ví dụ thực tế trong Android

```kotlin
class UserProfile {
    val userId: String = UUID.randomUUID().toString() // ID không bao giờ thay đổi
    var username: String = "default_user"             // Username có thể cập nhật
    var profilePicture: String? = null                // Có thể null và thay đổi
    
    fun updateProfile(newUsername: String, newPicture: String?) {
        username = newUsername      // ✅ OK
        profilePicture = newPicture // ✅ OK
        // userId = "new-id"        // ❌ Compile error!
    }
}
```

### Late Initialization với `val`

Với `val`, bạn có thể trì hoãn khởi tạo bằng cách sử dụng `lazy`:

```kotlin
class DatabaseManager {
    val database: SQLiteDatabase by lazy {
        // Chỉ khởi tạo khi lần đầu truy cập
        SQLiteDatabase.openOrCreateDatabase("app.db", null)
    }
}
```

### Custom Getter với `val`

```kotlin
class Rectangle(val width: Int, val height: Int) {
    val area: Int
        get() = width * height // Tính toán mỗi lần truy cập
}

val rect = Rectangle(5, 10)
println(rect.area) // 50 - được tính toán mới
```

## 🔑 Những điểm quan trọng cần lưu ý

### 1. Performance Implications

- **`val`**: Compiler có thể tối ưu hóa tốt hơn vì biết tham chiếu không thay đổi
- **`var`**: Cần kiểm tra thêm về thread safety trong môi trường concurrent

### 2. Thread Safety

```kotlin
class Counter {
    private var count: Int = 0 // ⚠️ Không thread-safe
    
    fun increment() {
        count++ // Race condition có thể xảy ra
    }
}

class SafeCounter {
    private val _count = AtomicInteger(0) // ✅ Thread-safe
    val count: Int get() = _count.get()
    
    fun increment() {
        _count.incrementAndGet()
    }
}
```

### 3. Null Safety

```kotlin
val nonNullVal: String = "Always has value"
var nullableVar: String? = null // Có thể là null

// Smart casting với val
val userInput: Any = "123"
if (userInput is String) {
    println(userInput.length) // ✅ Smart cast hoạt động
}

var userInputVar: Any = "123"
if (userInputVar is String) {
    // userInputVar.length // ❌ Smart cast không hoạt động với var
}
```

### 4. Best Practices

#### Ưu tiên `val` hơn `var` (Immutability First)

```kotlin
// ✅ Tốt - Sử dụng val khi có thể
val users = listOf("Alice", "Bob", "Charlie")
val configuration = AppConfig.load()

// ❌ Tránh - Chỉ dùng var khi thực sự cần thay đổi
var counter = 0 // Chỉ dùng nếu counter sẽ được tăng/giảm
```

#### Sử dụng trong Data Classes

```kotlin
data class User(
    val id: String,        // ID không thay đổi
    var name: String,      // Name có thể cập nhật
    var email: String      // Email có thể cập nhật
)
```

### 5. Common Pitfalls (Lỗi thường gặp)

#### Nhầm lẫn về Immutability

```kotlin
val numbers = mutableListOf(1, 2, 3)
numbers.add(4) // ✅ OK - Nội dung list có thể thay đổi
println(numbers) // [1, 2, 3, 4]

// Để có immutable collection thực sự:
val immutableNumbers = listOf(1, 2, 3) // Tạo immutable list
// immutableNumbers.add(4) // ❌ Compile error!
```

#### Sử dụng var không cần thiết

```kotlin
// ❌ Không tốt
var result = calculateResult()
return result

// ✅ Tốt hơn
val result = calculateResult()
return result

// ✅ Tốt nhất
return calculateResult()
```

### 6. Trong Context của Android

```kotlin
class MainActivity : AppCompatActivity() {
    // ✅ Views thường là val vì reference không thay đổi
    private val binding by lazy { ActivityMainBinding.inflate(layoutInflater) }
    
    // ✅ Data có thể thay đổi nên dùng var
    private var userData: UserData? = null
    
    // ✅ Constants luôn là val
    companion object {
        private val REQUEST_CODE = 123
    }
}
```

### 7. Memory và Performance

- **`val`** objects có thể được cache và reuse tốt hơn
- **`var`** yêu cầu synchronization trong multi-threading
- JVM có thể tối ưu hóa `val` fields tốt hơn

## 💡 Kết luận

- **Sử dụng `val` làm default choice** - chỉ chuyển sang `var` khi thực sự cần thay đổi
- **`val` ≠ immutable object**, chỉ là immutable reference
- **Performance và thread safety** tốt hơn với `val`
- **Code dễ reasoning** hơn khi sử dụng `val` nhiều hơn

**Nguyên tắc vàng**: "Ưu tiên `val` trước, chỉ dùng `var` khi cần thiết" - điều này giúp code an toàn, dễ hiểu và ít bug hơn.

---

*Post ID: ethy1rafv7rtqtf*  
*Category: Android Interview*  
*Created: 2/9/2025*  
*Updated: 2/9/2025*
