---
title: "Bài 2: Kotlin Fundamentals cho Android"
postId: "tvpim02p77tefvb"
category: "Android"
created: "1/9/2025"
updated: "1/9/2025"
---

# Bài 2: Kotlin Fundamentals cho Android


## 🎯 Mục tiêu bài học

Sau khi hoàn thành bài học này, học viên sẽ có thể:

- Nắm vững cú pháp cơ bản của Kotlin và các khái niệm lập trình hiện đại
- Hiểu và sử dụng thành thạo Null Safety - tính năng đặc trưng của Kotlin
- Viết và sử dụng functions, extension functions và lambda expressions
- Tạo và quản lý classes, objects và data classes trong Kotlin
- Áp dụng Kotlin vào Android development với Android KTX extensions
- Sử dụng View Binding thay thế findViewById để truy cập views an toàn
- Hiểu cơ bản về Kotlin Coroutines cho asynchronous programming

## 📝 Nội dung chi tiết

### 1. Cú pháp Kotlin cơ bản

Kotlin được thiết kế để ngắn gọn, an toàn và hoàn toàn tương thích với Java. Điều này làm cho việc chuyển đổi từ Java sang Kotlin trở nên dễ dàng.

#### 1.1 Variables và Constants

**Khái niệm Variables và Constants:**

Trong Kotlin, chúng ta có hai cách chính để khai báo biến, mỗi cách phục vụ mục đích khác nhau:

**`val` (value) - Immutable Variable:**
- Là biến không thể thay đổi sau khi khởi tạo
- Tương tự như từ khóa `final` trong Java
- Được khuyến khích sử dụng vì giúp code an toàn hơn
- Compiler sẽ đảm bảo giá trị không bị thay đổi vô tình

**`var` (variable) - Mutable Variable:**
- Là biến có thể thay đổi giá trị sau khi khởi tạo
- Chỉ nên sử dụng khi thực sự cần thay đổi giá trị
- Có thể dẫn đến bugs nếu không được quản lý cẩn thận

**Type Inference:**
- Kotlin có khả năng tự động suy luận kiểu dữ liệu
- Không cần khai báo type nếu compiler có thể suy luận được
- Giúp code ngắn gọn nhưng vẫn đảm bảo type safety

**Late Initialization:**
- `lateinit` cho phép khởi tạo property sau này
- Hữu ích cho dependency injection hoặc Android lifecycle
- Chỉ sử dụng cho var properties và không thể là primitive types

```kotlin
// Biến có thể thay đổi (mutable)
var userName: String = "John Doe"
var age: Int = 25

// Biến không thể thay đổi (immutable) - được ưu tiên
val appName: String = "My Android App"
val maxRetryCount: Int = 3

// Type inference - Kotlin tự suy luận kiểu dữ liệu
var score = 100        // Int được suy luận
val message = "Hello"  // String được suy luận
val isActive = true    // Boolean được suy luận

// Late initialization cho properties
lateinit var database: Database
```

#### 1.2 Data Types và Collections

**Khái niệm Data Types trong Kotlin:**

Kotlin có hệ thống type system thống nhất và mạnh mẽ:

**Unified Type System:**
- Tất cả đều là objects, không có primitive types như Java
- Compiler tự động tối ưu hóa thành primitives khi có thể
- Điều này có nghĩa là bạn có thể gọi methods trên mọi values

**Collections Framework:**
Kotlin phân biệt rõ ràng giữa immutable và mutable collections:

**Immutable Collections:**
- `List`, `Map`, `Set` - không thể thay đổi sau khi tạo
- An toàn cho multi-threading
- Được khuyến khích sử dụng khi có thể

**Mutable Collections:**
- `MutableList`, `MutableMap`, `MutableSet` - có thể thay đổi nội dung
- Cần cẩn thận với thread safety
- Chỉ sử dụng khi thực sự cần modify

**Arrays:**
- Đại diện cho mảng với kích thước cố định
- Ít được sử dụng hơn Lists trong Android development
- Có performance tốt hơn nhưng ít flexible hơn

```kotlin
// Basic Types - tất cả đều là objects
val number: Int = 42
val longNumber: Long = 42L
val floatNumber: Float = 42.0f
val doubleNumber: Double = 42.0
val character: Char = 'A'
val text: String = "Hello Kotlin"
val isEnabled: Boolean = true

// Immutable Collections - được ưu tiên
val readOnlyList = listOf("Apple", "Banana", "Orange")
val readOnlyMap = mapOf("name" to "John", "age" to 25)
val readOnlySet = setOf(1, 2, 3, 3) // Duplicate sẽ bị loại bỏ

// Mutable Collections - chỉ khi cần thiết
val mutableList = mutableListOf<String>()
mutableList.add("Item 1")
mutableList.add("Item 2")

val mutableMap = mutableMapOf<String, Int>()
mutableMap["score"] = 100
mutableMap["level"] = 5

// Arrays - ít sử dụng
val numbers = arrayOf(1, 2, 3, 4, 5)
val strings = arrayOf("A", "B", "C")
```

### 2. Null Safety - Tính năng đặc trưng

**Khái niệm Null Safety:**

Null Safety là tính năng quan trọng nhất của Kotlin, được thiết kế để loại bỏ NullPointerException - "The Billion Dollar Mistake". Đây là cách Kotlin đảm bảo an toàn khi làm việc với null values.

**Nguyên lý cốt lõi:**
- **Null là exception, không phải rule**: Mặc định mọi variables đều non-nullable
- **Explicit nullable types**: Phải khai báo rõ ràng khi muốn cho phép null
- **Compile-time checking**: Lỗi null được phát hiện tại compile time, không phải runtime

**Các toán tử và kỹ thuật:**

**Safe Call Operator (?.):**
- Cho phép gọi methods/properties trên nullable objects an toàn
- Return null nếu object là null, ngược lại return kết quả

**Elvis Operator (?:):**
- Cung cấp default value khi expression trước nó là null
- Rất hữu ích cho fallback logic

**Not-null Assertion (!!):**
- Ép buộc convert nullable type thành non-null
- Nguy hiểm - sẽ throw exception nếu object thực sự null
- Chỉ sử dụng khi chắc chắn 100% object không null

```kotlin
// Non-null types (mặc định)
var name: String = "John"
// name = null // Compile error!

// Nullable types (có thể null)
var nickname: String? = null
nickname = "Johnny"

// Safe call operator (?.)
val length = nickname?.length  // Trả về null nếu nickname là null

// Elvis operator (?:) - cung cấp giá trị mặc định
val displayName = nickname ?: "Unknown User"
val nameLength = nickname?.length ?: 0

// Not-null assertion (!!) - nguy hiểm
val definiteLength = nickname!!.length  // Throws exception nếu null

// Safe casting (as?)
val numberAsString: Any = 123
val stringValue = numberAsString as? String  // null nếu cast fail

// let function với nullable - scope function
nickname?.let { safeNickname ->
    println("Nickname is: $safeNickname")
    // Code trong đây chỉ chạy khi nickname không null
}

// Practical Android example
fun updateUserProfile(user: User?) {
    user?.let { safeUser ->
        binding.nameText.text = safeUser.name
        binding.emailText.text = safeUser.email
        
        safeUser.profileImage?.let { imageUrl ->
            // Nested safe calls
            loadImage(imageUrl)
        }
    } ?: run {
        // Execute khi user là null
        showErrorMessage("User data not available")
    }
}
```

### 3. Functions và Higher-order Functions

#### 3.1 Function Declaration

**Khái niệm Functions trong Kotlin:**

Functions trong Kotlin có nhiều tính năng mạnh mẽ, làm cho code ngắn gọn và linh hoạt hơn so với Java:

**Function Basics:**
- Sử dụng từ khóa `fun` để khai báo
- Có thể có return type hoặc không (Unit - tương đương void)
- Parameters có thể có default values

**Single Expression Functions:**
- Khi function body chỉ có một expression
- Có thể viết ngắn gọn với dấu `=` thay vì dấu ngoặc nhọn
- Return type có thể được infer

**Default Parameters:**
- Cho phép đặt giá trị mặc định cho parameters
- Giảm số lượng function overloads cần thiết
- Tăng flexibility khi gọi function

**Named Arguments:**
- Có thể chỉ định tên parameter khi gọi function
- Tăng tính rõ ràng, đặc biệt với nhiều parameters
- Cho phép thay đổi thứ tự parameters

**Variable Arguments (vararg):**
- Cho phép function nhận số lượng arguments không cố định
- Tương tự như Java varargs nhưng syntax khác
- Chỉ một parameter có thể là vararg trong mỗi function

```kotlin
// Basic function
fun greetUser(name: String): String {
    return "Hello, $name!"
}

// Single expression function
fun addNumbers(a: Int, b: Int): Int = a + b

// Function với default parameters
fun createUser(
    name: String, 
    email: String,
    age: Int = 18,
    isActive: Boolean = true
): User {
    return User(name, email, age, isActive)
}

// Named arguments usage
val user = createUser(
    name = "John",
    email = "john@example.com",
    age = 25
    // isActive sử dụng default value
)

// Vararg parameters
fun logMessages(tag: String, vararg messages: String) {
    messages.forEach { message ->
        println("[$tag] $message")
    }
}

// Usage
logMessages("DEBUG", "App started", "User logged in", "Data loaded")
```

#### 3.2 Higher-order Functions

**Khái niệm Higher-order Functions:**

Higher-order functions là foundation của functional programming trong Kotlin. Chúng cho phép functions trở thành first-class citizens:

**Functions as First-class Citizens:**
- Functions có thể được stored trong variables
- Functions có thể được passed as arguments
- Functions có thể được returned from other functions

**Function Types:**
- Kotlin có type system riêng cho functions
- Syntax: `(InputType) -> OutputType`
- Ví dụ: `(String) -> Int`, `() -> Unit`

**Lambda Expressions:**
- Anonymous functions với syntax ngắn gọn
- Syntax: `{ parameters -> body }`
- Nếu chỉ có một parameter, có thể sử dụng `it`

**Trailing Lambda Syntax:**
- Khi lambda là parameter cuối cùng
- Có thể viết lambda bên ngoài dấu ngoặc đơn
- Nếu lambda là parameter duy nhất, có thể bỏ dấu ngoặc đơn

```kotlin
// Function nhận function khác làm parameter
fun processData(data: List<String>, processor: (String) -> String): List<String> {
    return data.map { processor(it) }
}

// Lambda expressions
val upperCaseProcessor: (String) -> String = { it.uppercase() }
val result = processData(listOf("hello", "world"), upperCaseProcessor)

// Trailing lambda syntax
val numbers = listOf(1, 2, 3, 4, 5)
val doubled = numbers.map { it * 2 }
val filtered = numbers.filter { it > 2 }

// Function literals with receiver
fun StringBuilder.appendMultiple(vararg values: String): StringBuilder {
    values.forEach { append(it) }
    return this
}

val stringBuilder = StringBuilder().appendMultiple("Hello", " ", "World")

// Android specific examples
button.setOnClickListener { view ->
    // Lambda thay thế anonymous inner class
    startActivity(Intent(this, ProfileActivity::class.java))
}

// Collection operations với lambdas
val users = listOf(
    User("John", 25),
    User("Jane", 30),
    User("Bob", 22)
)

val adults = users.filter { it.age >= 18 }
val names = users.map { it.name }
val totalAge = users.sumOf { it.age }
val oldestUser = users.maxByOrNull { it.age }
```

### 4. Classes và Objects

#### 4.1 Classes

**Khái niệm Classes trong Kotlin:**

Classes trong Kotlin được thiết kế để ngắn gọn hơn Java nhưng vẫn mạnh mẽ:

**Primary Constructor:**
- Constructor chính được khai báo ngay trong class header
- Có thể khai báo properties trực tiếp trong constructor
- Rất tiện lợi cho simple data classes

**Secondary Constructor:**
- Constructor phụ có thể có nhiều overloads
- Phải delegate tới primary constructor
- Ít sử dụng hơn do có default parameters

**Init Blocks:**
- Code initialization chạy khi object được tạo
- Có thể có nhiều init blocks
- Chạy theo thứ tự khai báo

**Properties:**
- Kotlin tự generate getters/setters
- Có thể custom getter/setter
- Visibility modifiers: public, private, protected, internal

```kotlin
// Primary constructor với properties
class User(
    val name: String,           // read-only property
    val email: String,
    var age: Int = 18          // mutable property với default value
) {
    // Property với custom getter
    var isActive: Boolean = true
        private set  // Getter public, setter private
    
    // Secondary constructor
    constructor(name: String, email: String) : this(name, email, 18)
    
    // Init block - chạy khi object được tạo
    init {
        println("User created: $name")
        validateEmail(email)
        require(age >= 0) { "Age cannot be negative" }
    }
    
    // Methods
    fun updateAge(newAge: Int) {
        if (newAge > 0) {
            age = newAge
        }
    }
    
    fun deactivate() {
        isActive = false
    }
    
    // Private method
    private fun validateEmail(email: String) {
        require(email.contains("@")) { "Invalid email format" }
    }
    
    // Override toString
    override fun toString(): String {
        return "User(name='$name', email='$email', age=$age, active=$isActive)"
    }
}
```

#### 4.2 Data Classes

**Khái niệm Data Classes:**

Data classes là một tính năng đặc biệt của Kotlin dành cho classes chủ yếu chứa data:

**Auto-generated Methods:**
- `equals()` và `hashCode()`: So sánh structural equality
- `toString()`: Human-readable representation
- `copy()`: Tạo copy với possibility để modify một số properties
- `componentN()`: Destructuring declarations

**Benefits:**
- Giảm boilerplate code đáng kể
- Immutability support tốt
- Perfect cho model objects, DTOs, API responses

**Limitations:**
- Primary constructor phải có ít nhất một parameter
- Tất cả primary constructor parameters phải là val hoặc var
- Không thể inherit từ other classes (nhưng có thể implement interfaces)

```kotlin
// Data class - perfect cho model objects
data class Product(
    val id: String,
    val name: String,
    val price: Double,
    val category: String,
    var quantity: Int = 0
)

// Usage examples
val product1 = Product("1", "Laptop", 999.99, "Electronics")
val product2 = Product("1", "Laptop", 999.99, "Electronics")

// Structural equality (auto-generated equals)
println(product1 == product2)  // true

// Auto-generated toString()
println(product1)  // Product(id=1, name=Laptop, price=999.99, category=Electronics, quantity=0)

// Copy with modifications
val discountedProduct = product1.copy(price = 799.99)
val outOfStockProduct = product1.copy(quantity = 0)

// Destructuring declaration
val (id, name, price) = product1
println("Product $name costs $price")

// Android usage examples
data class ApiResponse<T>(
    val success: Boolean,
    val data: T?,
    val message: String?,
    val errorCode: Int = 0
)

data class LoginRequest(
    val email: String,
    val password: String,
    val rememberMe: Boolean = false
)

// Immutable data modeling
data class UserProfile(
    val userId: String,
    val displayName: String,
    val email: String,
    val avatarUrl: String?,
    val settings: UserSettings
)

data class UserSettings(
    val notifications: Boolean = true,
    val darkMode: Boolean = false,
    val language: String = "en"
)
```

#### 4.3 Object Declaration và Singleton

**Khái niệm Objects:**

Kotlin cung cấp nhiều cách để work với objects và singleton patterns:

**Object Declaration:**
- Singleton pattern được built-in vào language
- Thread-safe by default
- Lazy initialization
- Perfect cho utility classes, managers, constants

**Object Expression:**
- Anonymous objects, tương tự anonymous inner classes trong Java
- Có thể implement interfaces hoặc extend classes
- Useful cho one-time implementations

**Companion Object:**
- Static-like members trong classes
- Chỉ một companion object per class
- Có thể implement interfaces
- Access được từ class name

```kotlin
// Object declaration - Singleton pattern
object DatabaseManager {
    private var isInitialized = false
    private var database: Database? = null
    
    fun initialize(context: Context) {
        if (!isInitialized) {
            database = Room.databaseBuilder(
                context.applicationContext,
                AppDatabase::class.java,
                "app_database"
            ).build()
            isInitialized = true
            println("Database initialized")
        }
    }
    
    fun getDatabase(): Database {
        return database ?: throw IllegalStateException("Database not initialized")
    }
    
    fun query(sql: String): List<String> {
        // Implementation
        return listOf("Result 1", "Result 2")
    }
}

// Usage
DatabaseManager.initialize(context)
val results = DatabaseManager.query("SELECT * FROM users")

// Object expression - Anonymous object
val clickListener = object : View.OnClickListener {
    override fun onClick(v: View?) {
        println("Button clicked")
        // Handle click
    }
}

// Companion object - static-like members
class ApiClient {
    companion object {
        private const val BASE_URL = "https://api.example.com"
        private const val TIMEOUT = 30_000L
        
        // Factory method
        fun create(): ApiClient {
            return ApiClient()
        }
        
        // Utility method
        @JvmStatic  // For Java interop
        fun isNetworkAvailable(context: Context): Boolean {
            val connectivityManager = context.getSystemService(Context.CONNECTIVITY_SERVICE) 
                as ConnectivityManager
            val activeNetwork = connectivityManager.activeNetworkInfo
            return activeNetwork?.isConnectedOrConnecting == true
        }
        
        // Constants
        const val MAX_RETRY_COUNT = 3
        const val DEFAULT_PAGE_SIZE = 20
    }
    
    // Instance methods
    fun getData(): String {
        return "Data from $BASE_URL"
    }
}

// Usage
val client = ApiClient.create()
val isConnected = ApiClient.isNetworkAvailable(context)
val maxRetries = ApiClient.MAX_RETRY_COUNT
```

### 5. Extension Functions

**Khái niệm Extension Functions:**

Extension functions cho phép "extend" existing classes với new functionality mà không cần modify source code hoặc use inheritance. Đây là một tính năng mạnh mẽ giúp code readable và maintainable hơn.

**How it works:**
- Add functions to existing classes từ bên ngoài
- Không thực sự modify class, chỉ là syntactic sugar
- Resolved statically, không có dynamic dispatch
- Cannot access private members của class

**Use cases:**
- Utility functions cho existing types
- Domain-specific extensions
- API improvements cho third-party libraries
- Android-specific helpers

**Best practices:**
- Keep extensions focused và cohesive
- Prefer member functions khi có thể
- Be careful with naming conflicts
- Use receiver type efficiently

```kotlin
// Extension function cho String
fun String.isValidEmail(): Boolean {
    return this.contains("@") && this.contains(".") && this.length > 5
}

// Usage
val email = "user@example.com"
if (email.isValidEmail()) {
    println("Valid email")
}

// Extension function với nullable receiver
fun String?.orDefault(default: String): String {
    return if (this.isNullOrEmpty()) default else this
}

// Usage
val name: String? = null
val displayName = name.orDefault("Anonymous")

// Extension properties
val String.lastChar: Char?
    get() = if (isEmpty()) null else this[length - 1]

// Android specific extensions
fun View.visible() {
    visibility = View.VISIBLE
}

fun View.invisible() {
    visibility = View.INVISIBLE
}

fun View.gone() {
    visibility = View.GONE
}

fun View.isVisible(): Boolean {
    return visibility == View.VISIBLE
}

// Context extensions
fun Context.showToast(message: String, duration: Int = Toast.LENGTH_SHORT) {
    Toast.makeText(this, message, duration).show()
}

fun Context.dp(value: Int): Int {
    return TypedValue.applyDimension(
        TypedValue.COMPLEX_UNIT_DIP,
        value.toFloat(),
        resources.displayMetrics
    ).toInt()
}

fun Context.sp(value: Int): Int {
    return TypedValue.applyDimension(
        TypedValue.COMPLEX_UNIT_SP,
        value.toFloat(),
        resources.displayMetrics
    ).toInt()
}

// Usage trong Activity
class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        // Using extensions
        binding.progressBar.gone()
        binding.contentView.visible()
        
        showToast("Welcome!")
        
        val marginInDp = dp(16)
        val textSizeInSp = sp(14)
        
        // String extensions
        val userEmail = binding.emailInput.text.toString()
        if (userEmail.isValidEmail()) {
            proceedWithLogin(userEmail)
        }
    }
}

// Generic extensions
fun <T> List<T>.second(): T? {
    return if (size >= 2) this[1] else null
}

fun <T> List<T>.secondOrNull(): T? = if (size >= 2) this[1] else null

// Usage
val list = listOf("A", "B", "C")
val secondItem = list.second() // "B"
```

## 🏆 Bài tập thực hành

### Đề bài: Student Grade Management System

Tạo một hệ thống quản lý điểm sinh viên với các yêu cầu sau:

**Chức năng chính:**
1. Thêm sinh viên với thông tin: tên, email, các môn học và điểm số
2. Tính điểm trung bình cho mỗi sinh viên
3. Xếp loại học tập (Xuất sắc ≥9, Giỏi ≥8, Khá ≥6.5, Trung bình ≥5, Yếu <5)
4. Tìm kiếm sinh viên theo tên hoặc email
5. Hiển thị thống kê lớp học

**Yêu cầu kỹ thuật:**
- Sử dụng data classes cho Student model
- Extension functions cho validation và formatting
- Higher-order functions cho filtering và sorting
- Null safety cho tất cả operations
- Object singleton cho data management

### Lời giải chi tiết:

```kotlin
// Data models
data class Subject(
    val name: String,
    val score: Double,
    val credits: Int = 3
) {
    init {
        require(score in 0.0..10.0) { "Score must be between 0 and 10" }
        require(credits > 0) { "Credits must be positive" }
    }
}

data class Student(
    val id: String,
    val name: String,
    val email: String,
    val subjects: List<Subject>
) {
    init {
        require(name.isNotBlank()) { "Name cannot be blank" }
        require(email.isValidEmail()) { "Invalid email format" }
        require(subjects.isNotEmpty()) { "Student must have at least one subject" }
    }
    
    val averageScore: Double by lazy {
        if (subjects.isEmpty()) 0.0
        else subjects.sumOf { it.score * it.credits } / subjects.sumOf { it.credits }
    }
    
    val grade: Grade by lazy {
        Grade.fromScore(averageScore)
    }
    
    val totalCredits: Int by lazy {
        subjects.sumOf { it.credits }
    }
}

enum class Grade(val displayName: String, val minScore: Double) {
    EXCELLENT("Xuất sắc", 9.0),
    GOOD("Giỏi", 8.0),
    FAIR("Khá", 6.5),
    AVERAGE("Trung bình", 5.0),
    POOR("Yếu", 0.0);
    
    companion object {
        fun fromScore(score: Double): Grade {
            return values().first { score >= it.minScore }
        }
    }
}

// Extension functions
fun String.isValidEmail(): Boolean {
    val emailPattern = "^[A-Za-z0-9+_.-]+@([A-Za-z0-9.-]+\\.[A-Za-z]{2,})$"
    return this.matches(emailPattern.toRegex())
}

fun String.formatName(): String {
    return this.trim()
        .split(" ")
        .joinToString(" ") { word ->
            word.lowercase().replaceFirstChar { it.uppercase() }
        }
}

fun Double.formatScore(): String {
    return "%.2f".format(this)
}

fun List<Student>.filterByGrade(grade: Grade): List<Student> {
    return this.filter { it.grade == grade }
}

fun List<Student>.searchByName(query: String): List<Student> {
    return this.filter { it.name.contains(query, ignoreCase = true) }
}

fun List<Student>.searchByEmail(query: String): List<Student> {
    return this.filter { it.email.contains(query, ignoreCase = true) }
}

fun List<Student>.sortedByAverage(): List<Student> {
    return this.sortedByDescending { it.averageScore }
}

// Singleton Manager
object StudentManager {
    private val students = mutableListOf<Student>()
    
    fun addStudent(student: Student): Boolean {
        return try {
            if (students.any { it.id == student.id }) {
                throw IllegalArgumentException("Student with ID ${student.id} already exists")
            }
            students.add(student)
            true
        } catch (e: Exception) {
            println("Error adding student: ${e.message}")
            false
        }
    }
    
    fun removeStudent(studentId: String): Boolean {
        return students.removeIf { it.id == studentId }
    }
    
    fun findStudentById(id: String): Student? {
        return students.find { it.id == id }
    }
    
    fun searchStudents(query: String): List<Student> {
        return students.filter { student ->
            student.name.contains(query, ignoreCase = true) ||
            student.email.contains(query, ignoreCase = true)
        }
    }
    
    fun getStudentsByGrade(grade: Grade): List<Student> {
        return students.filter { it.grade == grade }
    }
    
    fun getAllStudents(): List<Student> {
        return students.toList() // Return immutable copy
    }
    
    fun getClassStatistics(): ClassStatistics {
        if (students.isEmpty()) {
            return ClassStatistics(0, 0.0, emptyMap(), null, null)
        }
        
        val totalStudents = students.size
        val classAverage = students.map { it.averageScore }.average()
        val gradeDistribution = students.groupBy { it.grade }
            .mapValues { it.value.size }
        val topStudent = students.maxByOrNull { it.averageScore }
        val bottomStudent = students.minByOrNull { it.averageScore }
        
        return ClassStatistics(
            totalStudents = totalStudents,
            classAverage = classAverage,
            gradeDistribution = gradeDistribution,
            topStudent = topStudent,
            bottomStudent = bottomStudent
        )
    }
    
    fun updateStudent(studentId: String, updater: (Student) -> Student): Boolean {
        val index = students.indexOfFirst { it.id == studentId }
        return if (index != -1) {
            try {
                students[index] = updater(students[index])
                true
            } catch (e: Exception) {
                println("Error updating student: ${e.message}")
                false
            }
        } else {
            false
        }
    }
    
    // Higher-order functions for complex operations
    fun processStudents(processor: (List<Student>) -> List<Student>): List<Student> {
        return processor(students.toList())
    }
    
    fun filterStudents(predicate: (Student) -> Boolean): List<Student> {
        return students.filter(predicate)
    }
    
    fun sortStudents(comparator: Comparator<Student>): List<Student> {
        return students.sortedWith(comparator)
    }
}

data class ClassStatistics(
    val totalStudents: Int,
    val classAverage: Double,
    val gradeDistribution: Map<Grade, Int>,
    val topStudent: Student?,
    val bottomStudent: Student?
) {
    fun displayReport(): String {
        return buildString {
            appendLine("=== CLASS STATISTICS ===")
            appendLine("Total Students: $totalStudents")
            appendLine("Class Average: ${classAverage.formatScore()}")
            appendLine()
            appendLine("Grade Distribution:")
            Grade.values().forEach { grade ->
                val count = gradeDistribution[grade] ?: 0
                val percentage = if (totalStudents > 0) (count * 100.0 / totalStudents) else 0.0
                appendLine("  ${grade.displayName}: $count (${percentage.formatScore()}%)")
            }
            appendLine()
            topStudent?.let {
                appendLine("Top Student: ${it.name} - ${it.averageScore.formatScore()}")
            }
            bottomStudent?.let {
                appendLine("Lowest Student: ${it.name} - ${it.averageScore.formatScore()}")
            }
        }
    }
}

// Usage example
fun main() {
    // Create sample students
    val student1 = Student(
        id = "SV001",
        name = "nguyen van a",
        email = "a.nguyen@email.com",
        subjects = listOf(
            Subject("Mathematics", 9.5),
            Subject("Physics", 8.5),
            Subject("Chemistry", 9.0)
        )
    )
    
    val student2 = Student(
        id = "SV002", 
        name = "TRAN THI B",
        email = "b.tran@email.com",
        subjects = listOf(
            Subject("Mathematics", 7.5),
            Subject("Literature", 8.0),
            Subject("English", 7.0)
        )
    )
    
    // Add students
    StudentManager.addStudent(student1)
    StudentManager.addStudent(student2)
    
    // Search operations
    val searchResults = StudentManager.searchStudents("nguyen")
    println("Search results: ${searchResults.map { it.name }}")
    
    // Filter by grade
    val excellentStudents = StudentManager.getStudentsByGrade(Grade.EXCELLENT)
    println("Excellent students: ${excellentStudents.map { it.name }}")
    
    // Class statistics
    val stats = StudentManager.getClassStatistics()
    println(stats.displayReport())
    
    // Higher-order function usage
    val topPerformers = StudentManager.processStudents { students ->
        students.filter { it.averageScore >= 8.0 }
            .sortedByDescending { it.averageScore }
    }
    
    println("Top performers:")
    topPerformers.forEach { student ->
        println("${student.name}: ${student.averageScore.formatScore()} (${student.grade.displayName})")
    }
}
```

**Giải thích từng phần:**

1. **Data Classes**: `Student`, `Subject` với validation trong init blocks
2. **Enum Classes**: `Grade` với companion object factory method
3. **Extension Functions**: String validation, formatting, List filtering
4. **Null Safety**: Safe calls, elvis operators trong tất cả operations
5. **Higher-order Functions**: Filtering, sorting, processing operations
6. **Object Singleton**: `StudentManager` quản lý state và operations
7. **Lazy Properties**: `averageScore`, `grade` được tính khi cần
8. **Immutable Collections**: Return copies để đảm bảo encapsulation

## 🔑 Những điểm quan trọng cần lưu ý

### 1. Null Safety Best Practices
- **Ưu tiên non-nullable types** khi có thể
- **Sử dụng safe calls (?.)** thay vì not-null assertion (!!)
- **Elvis operator (?:)** cho default values elegant hơn if-else
- **let function** cho conditional execution trên nullable objects

### 2. Function Design Principles
- **Single responsibility** - mỗi function làm một việc cụ thể
- **Default parameters** giảm function overloading
- **Named arguments** tăng code readability
- **Extension functions** thay vì utility classes khi phù hợp

### 3. Class vs Data Class Selection
- **Data classes** cho POJOs, DTOs, model objects
- **Regular classes** cho business logic và behavior
- **Object declarations** cho singletons, utilities, constants
- **Companion objects** cho factory methods và static-like functionality

### 4. Collections Best Practices
- **Immutable collections** by default để đảm bảo thread safety
- **Mutable collections** chỉ khi thực sự cần modify
- **Higher-order functions** (map, filter, reduce) thay vì manual loops
- **Sequence** cho large datasets để lazy evaluation

### 5. Android-specific Considerations
- **View Binding** thay thế findViewById - type safe và null safe
- **Android KTX** extensions cho concise code
- **Lifecycle-aware** operations với proper scope
- **Memory management** - avoid leaks với proper cleanup

## 📝 Bài tập về nhà

### Bài 1: Personal Finance Tracker

**Mô tả:** Tạo ứng dụng quản lý tài chính cá nhân

**Features Required:**
- **Transaction Management**: Add, edit, delete income/expense transactions
- **Category System**: Predefined categories với custom categories
- **Date Range Filtering**: View transactions by week, month, year
- **Budget Tracking**: Set budgets per category và track spending
- **Statistics**: Summary reports với charts data

**Technical Requirements:**
- Data classes cho Transaction, Category, Budget models
- Extension functions cho date formatting và currency display
- Higher-order functions cho filtering và aggregation
- Null safety cho tất cả optional fields
- Singleton manager cho data persistence simulation

### Bài 2: Recipe Book Application

**Mô tả:** Ứng dụng quản lý công thức nấu ăn

**Features Required:**
- **Recipe Management**: CRUD operations cho recipes
- **Ingredient System**: Quantities, units, substitutions
- **Search & Filter**: By ingredients, cooking time, difficulty
- **Shopping List**: Generate từ selected recipes
- **Rating System**: Rate recipes và add reviews

**Advanced Requirements:**
- **Sealed classes** cho different recipe types (Breakfast, Lunch, Dinner, Dessert)
- **Custom operators** cho ingredient quantity calculations  
- **DSL-style builders** cho recipe creation
- **Type-safe builders** cho complex recipe structures
- **Functional programming** approaches cho data transformations

---

*Post ID: tvpim02p77tefvb*  
*Category: Android*  
*Created: 1/9/2025*  
*Updated: 1/9/2025*
