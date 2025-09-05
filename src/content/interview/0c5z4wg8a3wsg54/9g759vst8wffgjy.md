---
title: "Câu hỏi 5: Inline functions hoạt động như thế nào và ưu điểm là gì?"
postId: "9g759vst8wffgjy"
category: "Android Interview"
created: "2/9/2025"
updated: "2/9/2025"
---

# Câu hỏi 5: Inline functions hoạt động như thế nào và ưu điểm là gì?


## 📝 Nội dung chi tiết

### Khái niệm cơ bản

**Inline functions** trong Kotlin là functions được đánh dấu với từ khóa `inline`. Khi compile, thay vì tạo function call thông thường, compiler sẽ **copy toàn bộ function body** trực tiếp vào nơi function được gọi (call site). Điều này giúp loại bỏ overhead của function calls và mở ra nhiều khả năng tối ưu hóa mạnh mẽ.

### Cú pháp cơ bản

```kotlin
// Regular function
fun regularFunction(value: Int): Int {
    return value * 2
}

// Inline function
inline fun inlineFunction(value: Int): Int {
    return value * 2
}

fun main() {
    val result = inlineFunction(5) // Compiler sẽ thay thế bằng: val result = 5 * 2
}
```

## 🔧 Cách hoạt động của Inline Functions

### Compiler Transformation

```kotlin
// Trước khi compile
inline fun performOperation(x: Int, operation: (Int) -> Int): Int {
    println("Before operation")
    val result = operation(x)
    println("After operation")
    return result
}

fun main() {
    val result = performOperation(10) { it * 2 }
    println(result)
}

// Sau khi compile (tương đương)
fun main() {
    // Code của performOperation được copy trực tiếp
    println("Before operation")
    val result = 10 * 2  // Lambda cũng được inline
    println("After operation")
    println(result)
}
```

### Visualization of Inlining Process

```kotlin
// Original code
inline fun calculate(a: Int, b: Int, operation: (Int, Int) -> Int): Int {
    println("Calculating...")
    return operation(a, b)
}

fun testCalculation() {
    val sum = calculate(3, 4) { x, y -> x + y }
    val multiply = calculate(5, 6) { x, y -> x * y }
}

// After inlining
fun testCalculation() {
    // First call được thay thế
    println("Calculating...")
    val sum = 3 + 4
    
    // Second call được thay thế  
    println("Calculating...")
    val multiply = 5 * 6
}
```

## ⚡ Ưu điểm của Inline Functions

### 1. Performance Optimization

```kotlin
// Đo performance với higher-order functions
class PerformanceTest {
    
    // Regular higher-order function
    fun regularMap(list: List<Int>, transform: (Int) -> Int): List<Int> {
        return list.map(transform)
    }
    
    // Inline higher-order function  
    inline fun inlineMap(list: List<Int>, transform: (Int) -> Int): List<Int> {
        return list.map(transform)
    }
    
    fun testPerformance() {
        val numbers = (1..1000000).toList()
        
        // Regular: Tạo Function object cho lambda
        val regularResult = regularMap(numbers) { it * 2 }
        
        // Inline: Lambda được inline, không tạo Function object
        val inlineResult = inlineMap(numbers) { it * 2 }
    }
}
```

### 2. Reduced Object Allocation

```kotlin
class AllocationComparison {
    
    fun regularForEach(items: List<String>, action: (String) -> Unit) {
        for (item in items) {
            action(item) // Function object được tạo
        }
    }
    
    inline fun inlineForEach(items: List<String>, action: (String) -> Unit) {
        for (item in items) {
            action(item) // Không tạo Function object
        }
    }
    
    fun demonstrateAllocation() {
        val items = listOf("A", "B", "C")
        
        // Regular: Tạo lambda object
        regularForEach(items) { println(it) }
        
        // Inline: Không tạo lambda object
        inlineForEach(items) { println(it) }
    }
}
```

## 🎯 Reified Type Parameters

Một trong những tính năng mạnh mẽ nhất của inline functions là khả năng sử dụng **reified type parameters**, giúp bypass type erasure của Java.

### Type Erasure Problem

```kotlin
// ❌ Không thể làm điều này với regular functions
fun <T> regularFunction(): Class<T> {
    return T::class.java // ❌ Compile error: Cannot use 'T' as reified type parameter
}

// ✅ Với inline functions và reified
inline fun <reified T> inlineFunction(): Class<T> {
    return T::class.java // ✅ OK: T được preserve tại runtime
}
```

### Practical Applications

```kotlin
// JSON parsing với reified types
inline fun <reified T> String.parseJson(): T {
    return Gson().fromJson(this, T::class.java)
}

// Intent extras với reified types
inline fun <reified T : Parcelable> Intent.getParcelableExtraCompat(name: String): T? {
    return if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
        getParcelableExtra(name, T::class.java)
    } else {
        @Suppress("DEPRECATION")
        getParcelableExtra(name) as? T
    }
}

// Usage
val user: User = jsonString.parseJson<User>() // Type được infer tự động
val userData = intent.getParcelableExtraCompat<UserData>("user_data")
```

### Bundle Extensions với Reified

```kotlin
// Bundle extensions với type safety
inline fun <reified T> Bundle.get(key: String): T? {
    return when (T::class) {
        String::class -> getString(key) as? T
        Int::class -> getInt(key) as? T
        Boolean::class -> getBoolean(key) as? T
        Parcelable::class -> getParcelable(key) as? T
        else -> null
    }
}

// Usage
val name: String? = bundle.get<String>("name")
val age: Int? = bundle.get<Int>("age")
val isActive: Boolean? = bundle.get<Boolean>("active")
```

## 🔄 Advanced Inline Patterns

### 1. DSL Creation

```kotlin
// HTML DSL với inline functions
class HTML {
    private val content = StringBuilder()
    
    inline fun body(init: BODY.() -> Unit): HTML {
        val body = BODY()
        body.init()
        content.append("<body>${body.content}</body>")
        return this
    }
    
    override fun toString() = content.toString()
}

class BODY {
    var content = StringBuilder()
    
    inline fun h1(text: String, init: H1.() -> Unit = {}) {
        val h1 = H1(text)
        h1.init()
        content.append(h1)
    }
}

class H1(private val text: String) {
    private var cssClass = ""
    
    fun cssClass(className: String) {
        cssClass = " class=\"$className\""
    }
    
    override fun toString() = "<h1$cssClass>$text</h1>"
}

// Usage
val html = HTML().body {
    h1("Welcome") {
        cssClass("title")
    }
}
```

### 2. Resource Management

```kotlin
// Automatic resource management
inline fun <T : Closeable, R> T.use(block: (T) -> R): R {
    var exception: Throwable? = null
    try {
        return block(this)
    } catch (e: Throwable) {
        exception = e
        throw e
    } finally {
        when {
            this == null -> {}
            exception == null -> close()
            else -> {
                try {
                    close()
                } catch (closeException: Throwable) {
                    exception.addSuppressed(closeException)
                }
            }
        }
    }
}

// Usage trong Android
fun readFileContent(fileName: String): String {
    return FileInputStream(fileName).use { input ->
        BufferedReader(InputStreamReader(input)).use { reader ->
            reader.readText()
        }
    }
}
```

### 3. Scope Functions Implementation

```kotlin
// Implement các scope functions
inline fun <T> T.myApply(block: T.() -> Unit): T {
    block()
    return this
}

inline fun <T, R> T.myLet(block: (T) -> R): R {
    return block(this)
}

inline fun <T, R> T.myRun(block: T.() -> R): R {
    return block()
}

// Usage
val user = User().myApply {
    name = "John"
    age = 30
}.myLet { user ->
    println("Created user: ${user.name}")
    user
}
```

## 🔑 Những điểm quan trọng cần lưu ý

### 1. Code Size Impact

```kotlin
// ⚠️ Inline có thể làm tăng code size
inline fun printWithBorder(message: String) {
    println("=" * 50)
    println(message)
    println("=" * 50)
}

fun multipleUsages() {
    printWithBorder("Message 1") // Code được copy
    printWithBorder("Message 2") // Code được copy lại
    printWithBorder("Message 3") // Code được copy lại
    // -> Code size tăng lên so với regular function calls
}
```

### 2. Compilation Time

```kotlin
// Inline functions có thể làm chậm compilation
inline fun complexInlineFunction(data: List<String>) {
    // Complex processing logic...
    data.forEach { item ->
        // Many lines of processing...
    }
}

// Nếu được gọi ở nhiều nơi, compilation time sẽ tăng
```

### 3. noinline và crossinline

#### noinline Parameter

```kotlin
inline fun performOperations(
    inlineOp: () -> Unit,
    noinline nonInlineOp: () -> Unit
) {
    inlineOp()        // Sẽ được inline
    nonInlineOp()     // Không được inline
    
    // Có thể pass nonInlineOp như regular function
    anotherFunction(nonInlineOp)
}

fun anotherFunction(operation: () -> Unit) {
    operation()
}
```

#### crossinline Parameter

```kotlin
inline fun runAsync(crossinline action: () -> Unit) {
    Thread {
        action() // ✅ OK với crossinline
    }.start()
}

inline fun regularInline(action: () -> Unit) {
    Thread {
        // action() // ❌ Error: Can't inline because of non-local return
    }.start()
}

fun testCrossinline() {
    runAsync {
        println("Running in background")
        // return // ❌ Non-local return không được phép với crossinline
    }
}
```

### 4. When NOT to use inline

```kotlin
// ❌ Đừng inline large functions
inline fun largeFunction() {
    // 50+ lines of code
    // Sẽ làm code size tăng đáng kể
}

// ❌ Đừng inline functions không có lambda parameters
inline fun simpleAdd(a: Int, b: Int): Int {
    return a + b // Không có performance benefit
}

// ❌ Đừng inline recursive functions
inline fun factorial(n: Int): Int {
    return if (n <= 1) 1 else n * factorial(n - 1) // Sẽ gây stack overflow
}
```

## 🎯 Best Practices

### 1. Khi nên sử dụng inline ✅

```kotlin
// ✅ Higher-order functions với lambdas
inline fun <T> Iterable<T>.customFilter(predicate: (T) -> Boolean): List<T> {
    return filter(predicate)
}

// ✅ Functions với reified type parameters
inline fun <reified T> createInstance(): T {
    return T::class.java.newInstance()
}

// ✅ DSL builders
inline fun buildString(builderAction: StringBuilder.() -> Unit): String {
    val stringBuilder = StringBuilder()
    stringBuilder.builderAction()
    return stringBuilder.toString()
}

// ✅ Resource management
inline fun <T : AutoCloseable, R> T.safeUse(block: (T) -> R): R {
    return use(block)
}
```

### 2. Performance-critical scenarios

```kotlin
class CollectionExtensions {
    
    // ✅ Tốt cho performance-critical operations
    inline fun <T, R> List<T>.fastMap(transform: (T) -> R): List<R> {
        val result = ArrayList<R>(size)
        for (item in this) {
            result.add(transform(item))
        }
        return result
    }
    
    inline fun <T> List<T>.fastForEach(action: (T) -> Unit) {
        for (item in this) {
            action(item)
        }
    }
}
```

### 3. Android-specific Use Cases

```kotlin
// ViewBinding extension
inline fun <T : ViewBinding> ComponentActivity.viewBinding(
    crossinline bindingInflater: (LayoutInflater) -> T
) = lazy(LazyThreadSafetyMode.NONE) {
    bindingInflater.invoke(layoutInflater)
}

// SharedPreferences extensions
inline fun <reified T> SharedPreferences.get(key: String, defaultValue: T): T {
    return when (T::class) {
        String::class -> getString(key, defaultValue as String) as T
        Int::class -> getInt(key, defaultValue as Int) as T
        Boolean::class -> getBoolean(key, defaultValue as Boolean) as T
        Float::class -> getFloat(key, defaultValue as Float) as T
        Long::class -> getLong(key, defaultValue as Long) as T
        else -> throw IllegalArgumentException("Unsupported type")
    }
}

// Usage
class MainActivity : ComponentActivity() {
    private val binding by viewBinding(ActivityMainBinding::inflate)
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(binding.root)
        
        val prefs = getSharedPreferences("app_prefs", Context.MODE_PRIVATE)
        val userName: String = prefs.get("username", "Guest")
        val isFirstRun: Boolean = prefs.get("first_run", true)
    }
}
```

## 📊 Performance Comparison

```kotlin
class PerformanceBenchmark {
    
    fun regularHigherOrder(list: List<Int>, transform: (Int) -> Int): List<Int> {
        return list.map { transform(it) }
    }
    
    inline fun inlineHigherOrder(list: List<Int>, transform: (Int) -> Int): List<Int> {
        return list.map { transform(it) }
    }
    
    fun benchmarkTest() {
        val largeList = (1..1_000_000).toList()
        
        // Benchmark regular function
        val regularTime = measureTimeMillis {
            repeat(100) {
                regularHigherOrder(largeList) { it * 2 }
            }
        }
        
        // Benchmark inline function
        val inlineTime = measureTimeMillis {
            repeat(100) {
                inlineHigherOrder(largeList) { it * 2 }
            }
        }
        
        println("Regular: ${regularTime}ms")
        println("Inline: ${inlineTime}ms")
        println("Improvement: ${((regularTime - inlineTime).toFloat() / regularTime * 100)}%")
    }
}
```

## 💡 Kết luận

**Inline functions phù hợp khi:**
- Higher-order functions với lambda parameters
- Cần reified type parameters
- Performance-critical code với frequent calls
- DSL creation
- Resource management patterns

**Tránh inline khi:**
- Function body quá lớn (>3-5 lines)
- Function không có lambda parameters
- Recursive functions
- Functions được gọi ở quá nhiều nơi (code bloat)

**Nguyên tắc vàng**: 
- Chỉ inline higher-order functions hoặc functions cần reified types
- Giữ inline functions nhỏ gọn
- Monitor code size impact trong production builds
- Sử dụng `noinline` và `crossinline` khi cần thiết

**Performance benefit**: Inline functions có thể cải thiện performance 10-30% cho higher-order functions thường xuyên được gọi, đặc biệt trong Android apps với performance constraints.

---

*Post ID: 9g759vst8wffgjy*  
*Category: Android Interview*  
*Created: 2/9/2025*  
*Updated: 2/9/2025*
