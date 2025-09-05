---
title: "Câu hỏi 6: Companion object trong Kotlin có vai trò gì?"
postId: "xgw1uj57x8h7mqb"
category: "Android Interview"
created: "2/9/2025"
updated: "2/9/2025"
---

# Câu hỏi 6: Companion object trong Kotlin có vai trò gì?


## 📝 Nội dung chi tiết

### Khái niệm cơ bản

**Companion object** trong Kotlin là một object được khai báo bên trong một class với từ khóa `companion`. Nó tương đương với **static members** trong Java, cho phép bạn truy cập các members mà không cần tạo instance của class. Companion object là một singleton object thuộc về class, không phải về instance cụ thể nào.

### Cú pháp cơ bản

```kotlin
class MyClass {
    companion object {
        const val CONSTANT_VALUE = "Hello"
        
        fun staticMethod() {
            println("This is like a static method")
        }
    }
    
    fun instanceMethod() {
        println("This is an instance method")
    }
}

// Usage
val constant = MyClass.CONSTANT_VALUE
MyClass.staticMethod() // Gọi mà không cần instance
val instance = MyClass()
instance.instanceMethod() // Cần instance
```

## 🔧 Đặc điểm của Companion Object

### 1. Singleton Nature

```kotlin
class DatabaseManager {
    companion object {
        private var instance: DatabaseManager? = null
        
        fun getInstance(): DatabaseManager {
            return instance ?: synchronized(this) {
                instance ?: DatabaseManager().also { instance = it }
            }
        }
        
        fun initialize() {
            println("Database initialized - ${this.hashCode()}")
        }
    }
}

fun demonstrateSingleton() {
    DatabaseManager.initialize() // Same companion object
    DatabaseManager.initialize() // Same companion object
    // Cùng một companion object instance được sử dụng
}
```

### 2. Có thể có tên

```kotlin
class MathUtils {
    companion object Calculator {
        fun add(a: Int, b: Int) = a + b
        fun multiply(a: Int, b: Int) = a * b
    }
}

// Có thể truy cập qua tên companion
val result1 = MathUtils.add(5, 3)
val result2 = MathUtils.Calculator.add(5, 3) // Cũng OK
```

### 3. Implement Interfaces

```kotlin
interface Factory<T> {
    fun create(): T
}

class User(val name: String) {
    companion object : Factory<User> {
        override fun create(): User {
            return User("Default User")
        }
        
        fun createWithName(name: String): User {
            return User(name)
        }
    }
}

// Usage
val defaultUser = User.create()
val namedUser = User.createWithName("John")

// Có thể pass companion object như interface
fun processFactory(factory: Factory<User>) {
    val user = factory.create()
    println(user.name)
}

processFactory(User) // Pass companion object trực tiếp
```

## 🎯 Các trường hợp sử dụng thực tế

### 1. Factory Pattern

```kotlin
sealed class Shape {
    abstract val area: Double
    
    data class Circle(val radius: Double) : Shape() {
        override val area: Double = Math.PI * radius * radius
    }
    
    data class Rectangle(val width: Double, val height: Double) : Shape() {
        override val area: Double = width * height
    }
    
    companion object {
        fun circle(radius: Double): Circle {
            require(radius > 0) { "Radius must be positive" }
            return Circle(radius)
        }
        
        fun rectangle(width: Double, height: Double): Rectangle {
            require(width > 0 && height > 0) { "Dimensions must be positive" }
            return Rectangle(width, height)
        }
        
        fun square(side: Double): Rectangle {
            return rectangle(side, side)
        }
    }
}

// Usage
val circle = Shape.circle(5.0)
val square = Shape.square(4.0)
val rectangle = Shape.rectangle(3.0, 6.0)
```

### 2. Constants và Configuration

```kotlin
class ApiConfig {
    companion object {
        const val BASE_URL = "https://api.example.com/"
        const val TIMEOUT_SECONDS = 30
        const val MAX_RETRIES = 3
        
        val DEFAULT_HEADERS = mapOf(
            "Content-Type" to "application/json",
            "Accept" to "application/json"
        )
        
        fun buildUrl(endpoint: String): String {
            return BASE_URL + endpoint.removePrefix("/")
        }
    }
}

// Android usage
class ApiService {
    private val client = OkHttpClient.Builder()
        .connectTimeout(ApiConfig.TIMEOUT_SECONDS.toLong(), TimeUnit.SECONDS)
        .build()
    
    fun makeRequest(endpoint: String) {
        val url = ApiConfig.buildUrl(endpoint)
        // Make request...
    }
}
```

### 3. Extension Functions cho Companion Objects

```kotlin
class User(val name: String, val email: String) {
    companion object {
        fun fromJson(json: String): User {
            // Parse JSON
            return User("John", "john@example.com")
        }
    }
}

// Extension function cho companion object
fun User.Companion.createAdmin(name: String): User {
    return User(name, "${name.lowercase()}@admin.com")
}

// Usage
val user = User.fromJson(jsonString)
val admin = User.createAdmin("Admin") // Extension function
```

### 4. Singleton với Lazy Initialization

```kotlin
class CacheManager private constructor() {
    private val cache = mutableMapOf<String, Any>()
    
    fun put(key: String, value: Any) {
        cache[key] = value
    }
    
    fun get(key: String): Any? = cache[key]
    
    companion object {
        @JvmStatic
        val instance: CacheManager by lazy { CacheManager() }
        
        // Convenience methods
        fun putValue(key: String, value: Any) {
            instance.put(key, value)
        }
        
        fun getValue(key: String): Any? {
            return instance.get(key)
        }
    }
}

// Usage
CacheManager.putValue("user_data", userData)
val data = CacheManager.getValue("user_data")
```

## 🔄 So sánh với Java Static

### Java Code

```java
public class JavaUtils {
    public static final String CONSTANT = "Value";
    private static JavaUtils instance;
    
    public static JavaUtils getInstance() {
        if (instance == null) {
            instance = new JavaUtils();
        }
        return instance;
    }
    
    public static void staticMethod() {
        System.out.println("Static method");
    }
}
```

### Kotlin Equivalent

```kotlin
class KotlinUtils {
    companion object {
        const val CONSTANT = "Value"
        private var instance: KotlinUtils? = null
        
        fun getInstance(): KotlinUtils {
            return instance ?: KotlinUtils().also { instance = it }
        }
        
        fun staticMethod() {
            println("Static method")
        }
    }
}
```

## ⚡ Advanced Patterns

### 1. Generic Factory với Companion Object

```kotlin
abstract class DatabaseEntity<T> {
    abstract fun save(): T
    
    companion object Factory {
        inline fun <reified T : DatabaseEntity<T>> create(): T {
            return when (T::class) {
                User::class -> User("", "") as T
                Product::class -> Product("", 0.0) as T
                else -> throw IllegalArgumentException("Unknown entity type")
            }
        }
    }
}

class User(var name: String, var email: String) : DatabaseEntity<User>() {
    override fun save(): User {
        // Save user logic
        return this
    }
    
    companion object : DatabaseEntity.Factory // Inherit factory methods
}

class Product(var name: String, var price: Double) : DatabaseEntity<Product>() {
    override fun save(): Product {
        // Save product logic  
        return this
    }
}

// Usage
val user = User.create<User>()
val product = DatabaseEntity.create<Product>()
```

### 2. Builder Pattern với Companion Object

```kotlin
class HttpRequest private constructor(
    val url: String,
    val method: String,
    val headers: Map<String, String>,
    val body: String?
) {
    companion object {
        fun builder() = Builder()
    }
    
    class Builder {
        private var url: String = ""
        private var method: String = "GET"
        private var headers: MutableMap<String, String> = mutableMapOf()
        private var body: String? = null
        
        fun url(url: String) = apply { this.url = url }
        fun method(method: String) = apply { this.method = method }
        fun header(key: String, value: String) = apply { headers[key] = value }
        fun body(body: String) = apply { this.body = body }
        
        fun build(): HttpRequest {
            require(url.isNotEmpty()) { "URL is required" }
            return HttpRequest(url, method, headers.toMap(), body)
        }
    }
}

// Usage
val request = HttpRequest.builder()
    .url("https://api.example.com/users")
    .method("POST")
    .header("Content-Type", "application/json")
    .body("{\"name\": \"John\"}")
    .build()
```

### 3. Type-safe Constants

```kotlin
class ApiEndpoints {
    companion object {
        private const val BASE_PATH = "/api/v1"
        
        object Auth {
            const val LOGIN = "$BASE_PATH/auth/login"
            const val LOGOUT = "$BASE_PATH/auth/logout"
            const val REFRESH = "$BASE_PATH/auth/refresh"
        }
        
        object Users {
            const val LIST = "$BASE_PATH/users"
            const val PROFILE = "$BASE_PATH/users/profile"
            fun byId(id: String) = "$BASE_PATH/users/$id"
        }
        
        object Products {
            const val LIST = "$BASE_PATH/products"
            fun byCategory(category: String) = "$BASE_PATH/products/category/$category"
        }
    }
}

// Usage
val loginUrl = ApiEndpoints.Auth.LOGIN
val userUrl = ApiEndpoints.Users.byId("123")
val categoryUrl = ApiEndpoints.Products.byCategory("electronics")
```

## 🔑 Những điểm quan trọng cần lưu ý

### 1. JvmStatic Annotation

```kotlin
class JavaInterop {
    companion object {
        // ❌ Từ Java: JavaInterop.Companion.regularMethod()
        fun regularMethod() {
            println("Regular companion method")
        }
        
        // ✅ Từ Java: JavaInterop.staticMethod()
        @JvmStatic
        fun staticMethod() {
            println("JvmStatic method")
        }
        
        // ✅ Constants tự động static trong Java
        const val CONSTANT = "Auto static in Java"
    }
}
```

### 2. Late Initialization trong Companion Objects

```kotlin
class ConfigManager {
    companion object {
        private lateinit var config: Properties
        
        fun initialize(configFile: String) {
            config = Properties().apply {
                load(FileInputStream(configFile))
            }
        }
        
        fun getProperty(key: String): String? {
            check(::config.isInitialized) { "Config not initialized" }
            return config.getProperty(key)
        }
    }
}

// Usage
ConfigManager.initialize("app.properties")
val apiUrl = ConfigManager.getProperty("api.url")
```

### 3. Companion Object với Generics

```kotlin
abstract class Repository<T, ID> {
    abstract fun findById(id: ID): T?
    abstract fun save(entity: T): T
    
    companion object {
        fun <T, ID> create(): Repository<T, ID> {
            @Suppress("UNCHECKED_CAST")
            return InMemoryRepository<T, ID>() as Repository<T, ID>
        }
    }
}

class InMemoryRepository<T, ID> : Repository<T, ID>() {
    private val storage = mutableMapOf<ID, T>()
    
    override fun findById(id: ID): T? = storage[id]
    
    override fun save(entity: T): T {
        // Assume entity has getId() method
        // storage[entity.getId()] = entity
        return entity
    }
}

// Usage
val userRepo = Repository.create<User, String>()
val productRepo = Repository.create<Product, Long>()
```

## 📱 Android-specific Use Cases

### 1. Activity/Fragment Factory

```kotlin
class UserProfileFragment : Fragment() {
    
    companion object {
        private const val ARG_USER_ID = "user_id"
        private const val ARG_SHOW_EDIT = "show_edit"
        
        fun newInstance(userId: String, showEdit: Boolean = false): UserProfileFragment {
            return UserProfileFragment().apply {
                arguments = Bundle().apply {
                    putString(ARG_USER_ID, userId)
                    putBoolean(ARG_SHOW_EDIT, showEdit)
                }
            }
        }
    }
    
    private val userId: String
        get() = arguments?.getString(ARG_USER_ID) ?: ""
    
    private val showEdit: Boolean
        get() = arguments?.getBoolean(ARG_SHOW_EDIT, false) ?: false
}

// Usage
val fragment = UserProfileFragment.newInstance("123", showEdit = true)
```

### 2. Shared Preferences Helper

```kotlin
class PreferenceManager(private val context: Context) {
    
    companion object {
        private const val PREF_NAME = "app_preferences"
        private const val KEY_USER_TOKEN = "user_token"
        private const val KEY_IS_FIRST_LAUNCH = "is_first_launch"
        
        @Volatile
        private var INSTANCE: PreferenceManager? = null
        
        fun getInstance(context: Context): PreferenceManager {
            return INSTANCE ?: synchronized(this) {
                INSTANCE ?: PreferenceManager(context.applicationContext).also { INSTANCE = it }
            }
        }
    }
    
    private val prefs = context.getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE)
    
    var userToken: String?
        get() = prefs.getString(KEY_USER_TOKEN, null)
        set(value) = prefs.edit().putString(KEY_USER_TOKEN, value).apply()
    
    var isFirstLaunch: Boolean
        get() = prefs.getBoolean(KEY_IS_FIRST_LAUNCH, true)
        set(value) = prefs.edit().putBoolean(KEY_IS_FIRST_LAUNCH, value).apply()
}
```

### 3. ViewHolder Factory

```kotlin
sealed class ViewType(val layoutId: Int) {
    object Header : ViewType(R.layout.item_header)
    object Content : ViewType(R.layout.item_content)
    object Footer : ViewType(R.layout.item_footer)
    
    companion object {
        fun fromViewType(viewType: Int): ViewType {
            return when (viewType) {
                0 -> Header
                1 -> Content
                2 -> Footer
                else -> throw IllegalArgumentException("Unknown view type: $viewType")
            }
        }
    }
}

abstract class BaseViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
    abstract fun bind(item: Any)
    
    companion object {
        fun create(parent: ViewGroup, viewType: ViewType): BaseViewHolder {
            val view = LayoutInflater.from(parent.context)
                .inflate(viewType.layoutId, parent, false)
            
            return when (viewType) {
                ViewType.Header -> HeaderViewHolder(view)
                ViewType.Content -> ContentViewHolder(view)
                ViewType.Footer -> FooterViewHolder(view)
            }
        }
    }
}
```

## 💡 Best Practices

### 1. Naming Conventions ✅

```kotlin
class ApiService {
    companion object {
        // ✅ Constants: ALL_CAPS
        const val BASE_URL = "https://api.example.com"
        const val TIMEOUT_MS = 30_000L
        
        // ✅ Factory methods: descriptive names
        fun createDefault(): ApiService = ApiService()
        fun createWithTimeout(timeoutMs: Long): ApiService = ApiService(timeoutMs)
        
        // ✅ Utility functions: verb + noun
        fun parseResponse(json: String): ApiResponse = Gson().fromJson(json, ApiResponse::class.java)
    }
}
```

### 2. Avoid Anti-patterns ❌

```kotlin
class BadExamples {
    companion object {
        // ❌ Mutable state trong companion object
        var globalCounter = 0
        val mutableList = mutableListOf<String>()
        
        // ❌ Heavy initialization trong companion object init
        val heavyResource = createExpensiveResource() // Sẽ chậm app startup
        
        // ❌ Instance methods trong companion
        fun processInstanceData(instance: BadExamples) {
            // Anti-pattern: nên là instance method
        }
    }
}

// ✅ Better approaches
class GoodExamples {
    companion object {
        // ✅ Immutable constants
        const val VERSION = "1.0.0"
        val SUPPORTED_FORMATS = listOf("JSON", "XML")
        
        // ✅ Lazy initialization cho expensive resources
        val heavyResource: ExpensiveResource by lazy { createExpensiveResource() }
        
        // ✅ Factory methods
        fun create(): GoodExamples = GoodExamples()
    }
    
    // ✅ Instance methods cho instance data
    fun processData() {
        // Work with instance data
    }
}
```

## 💡 Kết luận

**Companion object phù hợp khi:**
- Cần static methods/constants (thay thế Java static)
- Factory pattern implementation
- Singleton pattern implementation
- Utility functions liên quan đến class
- Configuration và constants
- Android: Fragment/Activity factory methods

**Tránh companion object khi:**
- Chỉ cần simple constants (có thể dùng top-level)
- Mutable global state
- Heavy initialization (dùng lazy thay thế)
- Logic không liên quan trực tiếp đến class

**Nguyên tắc vàng**:
- Sử dụng `const val` cho compile-time constants
- Sử dụng `@JvmStatic` khi cần Java interoperability
- Implement interfaces khi cần polymorphism
- Dùng `lazy` cho expensive initialization
- Factory methods nên validate input và provide meaningful error messages

---

*Post ID: xgw1uj57x8h7mqb*  
*Category: Android Interview*  
*Created: 2/9/2025*  
*Updated: 2/9/2025*
