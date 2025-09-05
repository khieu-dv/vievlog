---
title: "Bài 3: Android Studio và Gradle Mastery"
postId: "k3w0wljbv2gqef0"
category: "Android"
created: "1/9/2025"
updated: "1/9/2025"
---

# Bài 3: Android Studio và Gradle Mastery


## 🎯 Mục tiêu bài học

Sau khi hoàn thành bài học này, học viên sẽ có thể:

- Thành thạo các tính năng nâng cao của Android Studio IDE
- Hiểu sâu về Gradle build system và cấu hình project
- Tạo và quản lý build variants, product flavors cho different environments
- Tối ưu hóa build performance và dependency management
- Thiết lập và sử dụng version control (Git) hiệu quả trong Android projects
- Cấu hình ProGuard/R8 cho code obfuscation và optimization
- Implement CI/CD pipeline cơ bản cho Android apps

## 📝 Nội dung chi tiết

### 1. Android Studio Features và Shortcuts

#### 1.1 Essential Shortcuts và Productivity Features

**Khái niệm Keyboard Shortcuts trong Android Studio:**

Keyboard shortcuts là chìa khóa để tăng productivity khi phát triển Android apps. Thay vì sử dụng chuột để navigate qua menu, bạn có thể thực hiện hầu hết các tác vụ chỉ bằng bàn phím:

**Navigation Shortcuts:**
- **Find Action**: Tìm kiếm và thực hiện bất kỳ action nào trong IDE
- **Open Class/File**: Quickly navigate đến class hoặc file cụ thể
- **Search Everywhere**: Tìm kiếm trong toàn bộ project

**Code Editing Shortcuts:**
- **Duplicate Line**: Copy dòng hiện tại và paste xuống dưới
- **Comment/Uncomment**: Toggle comment cho selected code
- **Extend Selection**: Intelligent selection expansion
- **Optimize Imports**: Tự động organize và remove unused imports

**Refactoring Shortcuts:**
- **Show Intention Actions**: Hiển thị suggestions để improve code
- **Reformat Code**: Auto-format code theo coding style
- **Replace**: Find và replace text trong file hoặc project

```kotlin
// Essential Shortcuts (Mac/Windows)
Cmd/Ctrl + Shift + A    // Find Action (search mọi action)
Cmd/Ctrl + O           // Open Class
Cmd/Ctrl + Shift + O   // Open File
Cmd/Ctrl + Alt + O     // Optimize Imports
Cmd/Ctrl + D           // Duplicate Line
Cmd/Ctrl + /           // Comment/Uncomment
Cmd/Ctrl + Shift + /   // Block Comment
Cmd/Ctrl + W           // Extend Selection
Cmd/Ctrl + R           // Replace
Cmd/Ctrl + Shift + R   // Replace in Path
Alt + Enter           // Show Intention Actions
Cmd/Ctrl + Alt + L    // Reformat Code
```

#### 1.2 Code Generation và Live Templates

**Khái niệm Live Templates:**

Live Templates là một tính năng mạnh mẽ của Android Studio cho phép tạo code snippets có thể tái sử dụng. Thay vì gõ đi gõ lại những đoạn code giống nhau, bạn có thể định nghĩa templates và sử dụng chúng với shortcuts:

**Built-in Live Templates:**
- **logd**: Tạo Log.debug statement với tag tự động
- **fbc**: findViewById với cast type
- **const**: Tạo public static final constant
- **psf**: public static final field
- **starter**: Activity starter method pattern

**Custom Live Templates:**
- Có thể tạo custom templates cho patterns thường dùng
- Support variables với placeholders ($VARIABLE_NAME$)
- Có thể set context (Java, Kotlin, XML, etc.)
- Tăng consistency và giảm typing errors

**ViewBinding Templates:**
- Template setup cho Activity ViewBinding
- Template setup cho Fragment ViewBinding với proper cleanup
- Template cho RecyclerView ViewHolder

```kotlin
// Live Templates - type và nhấn Tab
"logd" + Tab  // Generate Log.d statement
"fbc" + Tab   // findViewById cast
"const" + Tab // public static final constant
"psf" + Tab   // public static final
"starter" + Tab // Activity starter method

// Custom Live Templates example
// Settings -> Editor -> Live Templates -> Android

// Template cho ViewBinding setup:
private lateinit var binding: $BINDING_CLASS$
binding = $BINDING_CLASS$.inflate(layoutInflater)
setContentView(binding.root)

// Template cho Fragment ViewBinding:
private var _binding: $BINDING_CLASS$? = null
private val binding get() = _binding!!

override fun onCreateView(inflater: LayoutInflater, container: ViewGroup?, savedInstanceState: Bundle?): View {
    _binding = $BINDING_CLASS$.inflate(inflater, container, false)
    return binding.root
}

override fun onDestroyView() {
    super.onDestroyView()
    _binding = null
}
```

#### 1.3 Advanced Debugging Features

**Khái niệm Advanced Debugging:**

Android Studio cung cấp nhiều debugging tools nâng cao giúp developers identify và fix bugs hiệu quả hơn:

**Conditional Breakpoints:**
- Chỉ dừng execution khi certain condition được thỏa mãn
- Rất hữu ích khi debugging loops hoặc large datasets
- Có thể set complex expressions làm conditions

**Logging Breakpoints:**
- Print information ra console mà không dừng execution
- Useful cho tracking values trong runtime
- Condition format: `Log "message" && false`

**Field Watchpoints:**
- Monitor khi field value được thay đổi
- Track access patterns của variables
- Identify unexpected modifications

**Method Breakpoints:**
- Break khi method được called
- Useful cho tracking method invocations
- Can see call stack và parameters

**Exception Breakpoints:**
- Automatically break khi exception occurs
- Even cho caught exceptions nếu muốn
- Help identify root cause của errors

```kotlin
class MainActivity : AppCompatActivity() {
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        // Conditional Breakpoints
        val users = getUsers()
        users.forEach { user ->
            // Right-click breakpoint -> Condition: user.age > 25
            processUser(user)
        }
        
        // Logging Breakpoints (không dừng execution)
        val result = calculateSomething()
        // Breakpoint condition: Log "Result: " + result && false
        
        // Field Watchpoints
        var importantValue = 10
        // Right-click variable -> Add Watchpoint
    }
    
    // Method Breakpoints - break when method is entered
    private fun criticalOperation() {
        // Implementation
    }
}
```

### 2. Gradle Build System Deep Dive

#### 2.1 Project-level build.gradle.kts

**Khái niệm Gradle Build System:**

Gradle là build automation system được Android sử dụng để compile, package và distribute apps. Hiểu Gradle là essential cho Android development:

**Project-level build.gradle.kts:**
- File configuration chính cho entire project
- Định nghĩa plugins, repositories, dependencies cho tất cả modules
- Setup build script dependencies và global configurations

**Key Components:**

**buildscript block:**
- Định nghĩa dependencies cho build script itself
- Chứa classpath cho plugins sẽ được sử dụng
- Version management cho build tools

**plugins block:**
- Apply plugins cho project
- Có thể apply cho tất cả modules hoặc specific modules
- Support both legacy và new plugin syntax

**allprojects block:**
- Configuration áp dụng cho tất cả modules
- Repository definitions
- Common dependencies và settings

**repositories:**
- Nơi Gradle tìm dependencies
- google(), mavenCentral(), jitpack.io là common repos
- Có thể add private repositories với credentials

```kotlin
// File: build.gradle.kts (Project level)
buildscript {
    val kotlin_version = "1.9.20"
    val gradle_version = "8.1.4"
    
    dependencies {
        classpath("com.android.tools.build:gradle:$gradle_version")
        classpath("org.jetbrains.kotlin:kotlin-gradle-plugin:$kotlin_version")
        classpath("com.google.gms:google-services:4.4.0")
        classpath("com.google.firebase:firebase-crashlytics-gradle:2.9.9")
        
        // Custom plugin classpath
        classpath("com.github.ben-manes:gradle-versions-plugin:0.48.0")
    }
}

plugins {
    id("com.github.ben-manes.versions") version "0.48.0"
    id("org.jetbrains.kotlin.android") version "1.9.20" apply false
}

allprojects {
    repositories {
        google()
        mavenCentral()
        maven { url = uri("https://jitpack.io") }
        
        // Private repository nếu cần
        maven {
            url = uri("https://private-repo.example.com/maven")
            credentials {
                username = project.findProperty("repo.username") as String? ?: ""
                password = project.findProperty("repo.password") as String? ?: ""
            }
        }
    }
}

// Cleanup task
tasks.register("clean", Delete::class) {
    delete(rootProject.buildDir)
}

// Custom tasks
tasks.register("checkDependencyUpdates") {
    dependsOn("dependencyUpdates")
    doLast {
        println("Check build/dependencyUpdates/report.txt for updates")
    }
}
```

#### 2.2 Module-level build.gradle.kts

**Khái niệm Module-level Configuration:**

Module-level build.gradle.kts file configure specific settings cho individual modules (thường là app module):

**android block Components:**
- **compileSdk**: SDK version để compile app
- **defaultConfig**: Default configuration cho tất cả build variants  
- **buildTypes**: Different build configurations (debug, release)
- **productFlavors**: Different app variants/versions

**Key Settings:**
- **applicationId**: Unique identifier cho app trên Play Store
- **versionCode/versionName**: App versioning cho updates
- **minSdk/targetSdk**: Android version compatibility range
- **buildFeatures**: Enable/disable build features (ViewBinding, DataBinding)

```kotlin
// File: app/build.gradle.kts
plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
    id("kotlin-kapt")
    id("dagger.hilt.android.plugin")
    id("kotlin-parcelize")
    id("com.google.gms.google-services")
    id("com.google.firebase.crashlytics")
}

android {
    namespace = "com.example.myapp"
    compileSdk = 34

    defaultConfig {
        applicationId = "com.example.myapp"
        minSdk = 24
        targetSdk = 34
        versionCode = generateVersionCode()
        versionName = "1.0.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
        
        // Build config fields
        buildConfigField("String", "API_BASE_URL", "\"https://api.example.com/\"")
        buildConfigField("boolean", "ENABLE_LOGGING", "true")
        
        // Manifest placeholders
        manifestPlaceholders["crashlyticsEnabled"] = true
        
        // Vector drawable support
        vectorDrawables.useSupportLibrary = true
    }

    buildTypes {
        debug {
            isDebuggable = true
            isMinifyEnabled = false
            applicationIdSuffix = ".debug"
            versionNameSuffix = "-DEBUG"
            
            buildConfigField("String", "API_BASE_URL", "\"https://api-dev.example.com/\"")
            manifestPlaceholders["crashlyticsEnabled"] = false
            
            // Enable R8 full mode even in debug
            isMinifyEnabled = false
            proguardFiles(getDefaultProguardFile("proguard-android-optimize.txt"), "proguard-rules.pro")
        }
        
        create("staging") {
            initWith(getByName("debug"))
            isMinifyEnabled = true
            applicationIdSuffix = ".staging"
            versionNameSuffix = "-STAGING"
            
            buildConfigField("String", "API_BASE_URL", "\"https://api-staging.example.com/\"")
            manifestPlaceholders["crashlyticsEnabled"] = true
            
            proguardFiles(getDefaultProguardFile("proguard-android-optimize.txt"), "proguard-rules.pro")
        }
        
        release {
            isMinifyEnabled = true
            isShrinkResources = true
            
            buildConfigField("String", "API_BASE_URL", "\"https://api.example.com/\"")
            manifestPlaceholders["crashlyticsEnabled"] = true
            
            proguardFiles(getDefaultProguardFile("proguard-android-optimize.txt"), "proguard-rules.pro")
            
            signingConfig = signingConfigs.getByName("debug") // Change for production
        }
    }
    
    // Product Flavors cho different markets/versions
    flavorDimensions += listOf("version", "market")
    
    productFlavors {
        create("free") {
            dimension = "version"
            applicationIdSuffix = ".free"
            versionNameSuffix = "-free"
            
            buildConfigField("boolean", "IS_PRO_VERSION", "false")
            buildConfigField("int", "MAX_DOWNLOAD_COUNT", "5")
        }
        
        create("pro") {
            dimension = "version"
            applicationIdSuffix = ".pro"
            versionNameSuffix = "-pro"
            
            buildConfigField("boolean", "IS_PRO_VERSION", "true")
            buildConfigField("int", "MAX_DOWNLOAD_COUNT", "Integer.MAX_VALUE")
        }
        
        create("playstore") {
            dimension = "market"
            buildConfigField("String", "ANALYTICS_KEY", "\"playstore_key\"")
        }
        
        create("amazon") {
            dimension = "market"
            buildConfigField("String", "ANALYTICS_KEY", "\"amazon_key\"")
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_1_8
        targetCompatibility = JavaVersion.VERSION_1_8
        
        // Enable core library desugaring
        isCoreLibraryDesugaringEnabled = true
    }

    kotlinOptions {
        jvmTarget = "1.8"
        
        // Compiler arguments
        freeCompilerArgs += listOf(
            "-opt-in=kotlin.RequiresOptIn",
            "-opt-in=kotlinx.coroutines.ExperimentalCoroutinesApi",
            "-opt-in=androidx.compose.material3.ExperimentalMaterial3Api"
        )
    }

    buildFeatures {
        viewBinding = true
        dataBinding = true
        buildConfig = true
        compose = true
    }
    
    composeOptions {
        kotlinCompilerExtensionVersion = "1.5.4"
    }

    packaging {
        resources {
            excludes += "/META-INF/{AL2.0,LGPL2.1}"
        }
    }
    
    // Test options
    testOptions {
        unitTests {
            isIncludeAndroidResources = true
        }
    }
    
    // Lint options
    lint {
        abortOnError = false
        checkReleaseBuilds = false
        disable += setOf("ContentDescription", "HardcodedText")
    }
}

// Custom function để generate version code
fun generateVersionCode(): Int {
    val majorVersion = 1
    val minorVersion = 0
    val patchVersion = 0
    return majorVersion * 10000 + minorVersion * 100 + patchVersion
}

dependencies {
    implementation("androidx.core:core-ktx:1.12.0")
    implementation("androidx.appcompat:appcompat:1.6.1")
    implementation("com.google.android.material:material:1.11.0")
    implementation("androidx.constraintlayout:constraintlayout:2.1.4")
    
    // Architecture components
    implementation("androidx.lifecycle:lifecycle-viewmodel-ktx:2.7.0")
    implementation("androidx.lifecycle:lifecycle-livedata-ktx:2.7.0")
    implementation("androidx.navigation:navigation-fragment-ktx:2.7.6")
    implementation("androidx.navigation:navigation-ui-ktx:2.7.6")
    
    // Dependency injection
    implementation("com.google.dagger:hilt-android:2.48")
    kapt("com.google.dagger:hilt-compiler:2.48")
    
    // Network
    implementation("com.squareup.retrofit2:retrofit:2.9.0")
    implementation("com.squareup.retrofit2:converter-gson:2.9.0")
    implementation("com.squareup.okhttp3:logging-interceptor:4.12.0")
    
    // Image loading
    implementation("com.github.bumptech.glide:glide:4.16.0")
    kapt("com.github.bumptech.glide:compiler:4.16.0")
    
    // Database
    implementation("androidx.room:room-runtime:2.6.1")
    implementation("androidx.room:room-ktx:2.6.1")
    kapt("androidx.room:room-compiler:2.6.1")
    
    // Coroutines
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-android:1.7.3")
    
    // Firebase
    implementation("com.google.firebase:firebase-analytics-ktx:21.5.0")
    implementation("com.google.firebase:firebase-crashlytics-ktx:18.6.1")
    
    // Jetpack Compose
    val composeVersion = "1.5.6"
    implementation("androidx.compose.ui:ui:$composeVersion")
    implementation("androidx.compose.ui:ui-tooling-preview:$composeVersion")
    implementation("androidx.compose.material3:material3:1.1.2")
    implementation("androidx.activity:activity-compose:1.8.2")
    
    // Core library desugaring
    coreLibraryDesugaring("com.android.tools:desugar_jdk_libs:2.0.4")
    
    // Testing
    testImplementation("junit:junit:4.13.2")
    testImplementation("org.mockito:mockito-core:5.7.0")
    testImplementation("org.mockito.kotlin:mockito-kotlin:5.2.1")
    testImplementation("androidx.arch.core:core-testing:2.2.0")
    testImplementation("org.jetbrains.kotlinx:kotlinx-coroutines-test:1.7.3")
    
    androidTestImplementation("androidx.test.ext:junit:1.1.5")
    androidTestImplementation("androidx.test.espresso:espresso-core:3.5.1")
    androidTestImplementation("androidx.compose.ui:ui-test-junit4:$composeVersion")
    
    debugImplementation("androidx.compose.ui:ui-tooling:$composeVersion")
    debugImplementation("androidx.compose.ui:ui-test-manifest:$composeVersion")
    debugImplementation("com.squareup.leakcanary:leakcanary-android:2.12")
}

// Custom tasks
tasks.register("printVariants") {
    doLast {
        android.applicationVariants.all { variant ->
            println("Variant: ${variant.name}")
            println("  Application ID: ${variant.applicationId}")
            println("  Version Name: ${variant.versionName}")
            println("  Version Code: ${variant.versionCode}")
            println()
        }
    }
}
```

### 3. Build Variants và Product Flavors

#### 3.1 Understanding Build Variants

**Khái niệm Build Variants:**

Build Variants system cho phép tạo multiple versions của app từ single codebase:

**Build Types:**
- Control HOW app được built (debug settings, optimization, signing)
- Common: debug (for development), release (for production)

**Product Flavors:**  
- Control WHAT version của app (free vs premium, different markets)
- Can have different source sets, resources, dependencies

**Build Variant Formula:**
Build Variant = Build Type × Product Flavor
Example: debugFree, releasePremium

Build Variants = Build Type + Product Flavor(s):

```
Build Variants Generated:
- freePlaystoreDebug
- freePlaystoreStaging  
- freePlaystoreRelease
- freeAmazonDebug
- freeAmazonStaging
- freeAmazonRelease
- proPlaystoreDebug
- proPlaystoreStaging
- proPlaystoreRelease
- proAmazonDebug
- proAmazonStaging
- proAmazonRelease
```

#### 3.2 Flavor-specific Resources

```
app/src/
├── main/                    # Common resources
├── debug/                   # Debug build type resources
├── release/                 # Release build type resources
├── free/                    # Free flavor resources
│   ├── res/
│   │   ├── values/
│   │   │   └── strings.xml  # Free version strings
│   │   └── drawable/
│   │       └── icon.png     # Free version icon
│   └── java/
├── pro/                     # Pro flavor resources
│   ├── res/
│   │   ├── values/
│   │   │   └── strings.xml  # Pro version strings
│   │   └── drawable/
│   │       └── icon.png     # Pro version icon
│   └── java/
├── playstore/               # Play Store market resources
└── amazon/                  # Amazon market resources
```

#### 3.3 Conditional Code Based on Build Variants

```kotlin
class MainActivity : AppCompatActivity() {
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        
        setupBasedOnVariant()
    }
    
    private fun setupBasedOnVariant() {
        // Using BuildConfig
        if (BuildConfig.IS_PRO_VERSION) {
            enableProFeatures()
        } else {
            setupFreeLimitations()
        }
        
        // Different API endpoints
        val apiUrl = BuildConfig.API_BASE_URL
        ApiClient.initialize(apiUrl)
        
        // Analytics setup based on market
        val analyticsKey = BuildConfig.ANALYTICS_KEY
        AnalyticsManager.initialize(analyticsKey)
        
        // Debug-only features
        if (BuildConfig.DEBUG) {
            // Enable debug tools
            enableDebugTools()
            
            // Show debug info
            val debugInfo = """
                Version: ${BuildConfig.VERSION_NAME}
                Build Type: ${BuildConfig.BUILD_TYPE}
                API URL: ${BuildConfig.API_BASE_URL}
            """.trimIndent()
            
            Log.d("DEBUG_INFO", debugInfo)
        }
    }
    
    private fun enableProFeatures() {
        // Unlock premium features
        binding.premiumButton.visibility = View.GONE
        binding.adContainer.visibility = View.GONE
        
        val maxDownloads = BuildConfig.MAX_DOWNLOAD_COUNT
        binding.downloadLimitText.text = if (maxDownloads == Int.MAX_VALUE) {
            "Unlimited downloads"
        } else {
            "Max $maxDownloads downloads"
        }
    }
    
    private fun setupFreeLimitations() {
        // Show ads
        binding.adContainer.visibility = View.VISIBLE
        loadAds()
        
        // Show premium upgrade button
        binding.premiumButton.visibility = View.VISIBLE
        binding.premiumButton.setOnClickListener {
            showPremiumUpgradeDialog()
        }
        
        val maxDownloads = BuildConfig.MAX_DOWNLOAD_COUNT
        binding.downloadLimitText.text = "Free: $maxDownloads downloads remaining"
    }
    
    private fun enableDebugTools() {
        // Add debugging menu
        val debugMenuItem = menu.add("Debug Tools")
        debugMenuItem.setOnMenuItemClickListener {
            showDebugDialog()
            true
        }
    }
}
```

### 4. Dependencies Management

#### 4.1 Version Catalog (gradle/libs.versions.toml)

```toml
[versions]
kotlin = "1.9.20"
android-gradle = "8.1.4"
core-ktx = "1.12.0"
appcompat = "1.6.1"
material = "1.11.0"
constraintlayout = "2.1.4"
lifecycle = "2.7.0"
navigation = "2.7.6"
room = "2.6.1"
retrofit = "2.9.0"
okhttp = "4.12.0"
hilt = "2.48"
compose = "1.5.6"
compose-compiler = "1.5.4"

[libraries]
androidx-core-ktx = { group = "androidx.core", name = "core-ktx", version.ref = "core-ktx" }
androidx-appcompat = { group = "androidx.appcompat", name = "appcompat", version.ref = "appcompat" }
material = { group = "com.google.android.material", name = "material", version.ref = "material" }
androidx-constraintlayout = { group = "androidx.constraintlayout", name = "constraintlayout", version.ref = "constraintlayout" }

# Lifecycle
androidx-lifecycle-viewmodel-ktx = { group = "androidx.lifecycle", name = "lifecycle-viewmodel-ktx", version.ref = "lifecycle" }
androidx-lifecycle-livedata-ktx = { group = "androidx.lifecycle", name = "lifecycle-livedata-ktx", version.ref = "lifecycle" }

# Navigation
androidx-navigation-fragment-ktx = { group = "androidx.navigation", name = "navigation-fragment-ktx", version.ref = "navigation" }
androidx-navigation-ui-ktx = { group = "androidx.navigation", name = "navigation-ui-ktx", version.ref = "navigation" }

# Room
androidx-room-runtime = { group = "androidx.room", name = "room-runtime", version.ref = "room" }
androidx-room-ktx = { group = "androidx.room", name = "room-ktx", version.ref = "room" }
androidx-room-compiler = { group = "androidx.room", name = "room-compiler", version.ref = "room" }

# Network
retrofit = { group = "com.squareup.retrofit2", name = "retrofit", version.ref = "retrofit" }
retrofit-converter-gson = { group = "com.squareup.retrofit2", name = "converter-gson", version.ref = "retrofit" }
okhttp-logging-interceptor = { group = "com.squareup.okhttp3", name = "logging-interceptor", version.ref = "okhttp" }

# Dependency Injection
hilt-android = { group = "com.google.dagger", name = "hilt-android", version.ref = "hilt" }
hilt-compiler = { group = "com.google.dagger", name = "hilt-compiler", version.ref = "hilt" }

[bundles]
lifecycle = ["androidx-lifecycle-viewmodel-ktx", "androidx-lifecycle-livedata-ktx"]
navigation = ["androidx-navigation-fragment-ktx", "androidx-navigation-ui-ktx"]
room = ["androidx-room-runtime", "androidx-room-ktx"]
network = ["retrofit", "retrofit-converter-gson", "okhttp-logging-interceptor"]

[plugins]
android-application = { id = "com.android.application", version.ref = "android-gradle" }
kotlin-android = { id = "org.jetbrains.kotlin.android", version.ref = "kotlin" }
hilt = { id = "com.google.dagger.hilt.android", version.ref = "hilt" }
```

#### 4.2 Using Version Catalog in build.gradle.kts

```kotlin
// File: app/build.gradle.kts
plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
    alias(libs.plugins.hilt)
    kotlin("kapt")
}

dependencies {
    implementation(libs.androidx.core.ktx)
    implementation(libs.androidx.appcompat)
    implementation(libs.material)
    implementation(libs.androidx.constraintlayout)
    
    // Using bundles
    implementation(libs.bundles.lifecycle)
    implementation(libs.bundles.navigation)
    implementation(libs.bundles.room)
    implementation(libs.bundles.network)
    
    // Dependency injection
    implementation(libs.hilt.android)
    kapt(libs.hilt.compiler)
    
    // Room compiler
    kapt(libs.androidx.room.compiler)
}
```

### 5. ProGuard và R8 Optimization

**Khái niệm ProGuard/R8:**

ProGuard và R8 là code obfuscation và optimization tools:

**Purpose:**
- **Reduce APK size**: Remove unused code và resources
- **Protect code**: Obfuscate class và method names
- **Optimize performance**: Dead code elimination, inline methods
- **Security**: Make reverse engineering harder

**R8 vs ProGuard:**
- **R8**: Google's replacement cho ProGuard, faster và better optimization
- **ProGuard**: Legacy tool, still supported nhưng R8 is preferred
- **Integration**: R8 is default trong Android Gradle Plugin 3.4+

**Configuration:**
- **proguard-rules.pro**: File chứa rules để keep/obfuscate specific classes
- **getDefaultProguardFile()**: Android's default optimization rules
- **Custom rules**: App-specific keep rules cho libraries và reflection

#### 5.1 ProGuard Rules Configuration

```pro
# File: app/proguard-rules.pro

# Keep application class
-keep class * extends android.app.Application

# Keep all public classes that extend Android base classes
-keep public class * extends android.app.Activity
-keep public class * extends android.app.Service
-keep public class * extends android.content.BroadcastReceiver
-keep public class * extends android.content.ContentProvider

# Keep all classes with native methods
-keepclasseswithmembernames class * {
    native <methods>;
}

# Retrofit specific rules
-keepattributes Signature, InnerClasses, EnclosingMethod
-keepattributes RuntimeVisibleAnnotations, RuntimeVisibleParameterAnnotations
-keep,allowobfuscation,allowshrinking interface retrofit2.Call
-keep,allowobfuscation,allowshrinking class retrofit2.Response
-keep,allowobfuscation,allowshrinking class kotlin.coroutines.Continuation

# Gson specific rules
-keepattributes Signature
-keepattributes *Annotation*
-dontwarn sun.misc.**
-keep class * implements com.google.gson.TypeAdapter
-keep class * implements com.google.gson.TypeAdapterFactory
-keep class * implements com.google.gson.JsonSerializer
-keep class * implements com.google.gson.JsonDeserializer

# Keep data classes for API
-keep class com.example.myapp.data.model.** { *; }
-keep class com.example.myapp.data.api.response.** { *; }

# Room specific rules
-keep class * extends androidx.room.RoomDatabase
-keep @androidx.room.Entity class *
-dontwarn androidx.room.paging.**

# Hilt rules
-keep class dagger.hilt.** { *; }
-keep class javax.inject.** { *; }
-keep class * extends dagger.hilt.android.HiltAndroidApp
-keepclasseswithmembers class * {
    @dagger.hilt.android.AndroidEntryPoint <methods>;
}

# Firebase Crashlytics
-keepattributes SourceFile,LineNumberTable
-keep public class * extends java.lang.Exception

# Custom classes to keep
-keep class com.example.myapp.utils.** { *; }
-keep interface com.example.myapp.interface.** { *; }

# Remove logging in release
-assumenosideeffects class android.util.Log {
    public static boolean isLoggable(java.lang.String, int);
    public static int v(...);
    public static int i(...);
    public static int w(...);
    public static int d(...);
    public static int e(...);
}

# Optimization
-optimizations !code/simplification/arithmetic,!code/simplification/cast,!field/*,!class/merging/*
-optimizationpasses 5
-allowaccessmodification
-dontpreverify
```

### 6. Git Integration và Best Practices

#### 6.1 .gitignore cho Android Projects

```gitignore
# File: .gitignore

# Built application files
*.apk
*.ap_
*.aab

# Files for the ART/Dalvik VM
*.dex

# Java class files
*.class

# Generated files
bin/
gen/
out/
release/

# Gradle files
.gradle/
build/

# Local configuration file (sdk path, etc)
local.properties

# Proguard folder generated by Eclipse
proguard/

# Log Files
*.log

# Android Studio Navigation editor temp files
.navigation/

# Android Studio captures folder
captures/

# IntelliJ
*.iml
.idea/workspace.xml
.idea/tasks.xml
.idea/gradle.xml
.idea/assetWizardSettings.xml
.idea/dictionaries
.idea/libraries
.idea/caches
.idea/modules.xml

# External native build folder generated in Android Studio 2.2 and later
.externalNativeBuild
.cxx/

# Google Services (e.g. APIs or Firebase)
google-services.json

# Freeline
freeline.py
freeline/
freeline_project_description.json

# fastlane
fastlane/report.xml
fastlane/Preview.html
fastlane/screenshots
fastlane/test_output
fastlane/readme.md

# Version control
vcs.xml

# lint
lint/intermediates/
lint/generated/
lint/outputs/
lint/tmp/

# Android Profiling
*.hprof

# Keystore files
*.jks
*.keystore

# Google Play Console Service Account
*.json
```

#### 6.2 Git Workflow cho Android Development

```bash
# Branch naming convention
feature/user-authentication
bugfix/login-crash-fix
hotfix/critical-security-patch
release/v1.2.0

# Commit message convention
feat: add user authentication with biometrics
fix: resolve crash when user clicks logout button
docs: update README with setup instructions
style: format code according to ktlint rules
refactor: extract networking logic to repository pattern
test: add unit tests for user registration
chore: update dependencies to latest versions

# Pre-commit hooks setup
#!/bin/sh
# File: .git/hooks/pre-commit

echo "Running pre-commit checks..."

# Run ktlint
./gradlew ktlintCheck
if [ $? -ne 0 ]; then
    echo "❌ Code style check failed. Run './gradlew ktlintFormat' to fix."
    exit 1
fi

# Run unit tests
./gradlew testDebugUnitTest
if [ $? -ne 0 ]; then
    echo "❌ Unit tests failed."
    exit 1
fi

# Run lint
./gradlew lintDebug
if [ $? -ne 0 ]; then
    echo "❌ Lint check failed."
    exit 1
fi

echo "✅ All pre-commit checks passed!"
```

## 🏆 Bài tập thực hành

### Đề bài: Multi-flavor News App Configuration

Tạo cấu hình build system cho một News App với requirements sau:

1. **Build Types**: debug, staging, release
2. **Product Flavors**: 
   - Version dimension: free, premium
   - Market dimension: playstore, huawei
3. **Features theo flavor**:
   - Free: 5 articles per day, ads enabled
   - Premium: unlimited articles, no ads
   - PlayStore: Google Analytics, In-app purchases
   - Huawei: HMS Analytics, Huawei IAP

### Lời giải chi tiết:

#### Bước 1: Project-level build.gradle.kts

```kotlin
// File: build.gradle.kts (Project level)
buildscript {
    val kotlin_version = "1.9.20"
    
    dependencies {
        classpath("com.android.tools.build:gradle:8.1.4")
        classpath("org.jetbrains.kotlin:kotlin-gradle-plugin:$kotlin_version")
        classpath("com.google.gms:google-services:4.4.0")
        classpath("com.huawei.agconnect:agcp:1.9.1.301")
        
        // Custom plugins
        classpath("com.github.ben-manes:gradle-versions-plugin:0.48.0")
        classpath("org.jlleitschuh.gradle:ktlint-gradle:11.6.1")
    }
}

plugins {
    id("com.github.ben-manes.versions") version "0.48.0"
    id("org.jlleitschuh.gradle.ktlint") version "11.6.1"
}

allprojects {
    repositories {
        google()
        mavenCentral()
        maven { url = uri("https://developer.huawei.com/repo/") }
    }
    
    // Apply ktlint to all modules
    apply(plugin = "org.jlleitschuh.gradle.ktlint")
    
    ktlint {
        version.set("0.50.0")
        debug.set(true)
        verbose.set(true)
        android.set(true)
        outputToConsole.set(true)
    }
}
```

#### Bước 2: App-level build.gradle.kts

```kotlin
// File: app/build.gradle.kts
plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
    id("kotlin-kapt")
    id("kotlin-parcelize")
}

android {
    namespace = "com.example.newsapp"
    compileSdk = 34

    defaultConfig {
        minSdk = 24
        targetSdk = 34
        versionCode = generateVersionCode()
        versionName = "1.0.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
        
        // Common build config fields
        buildConfigField("String", "API_BASE_URL", "\"https://newsapi.org/v2/\"")
        buildConfigField("String", "APP_NAME", "\"News App\"")
    }

    signingConfigs {
        create("release") {
            // In production, read from properties file or environment
            storeFile = file("../keystore/release.keystore")
            storePassword = project.findProperty("KEYSTORE_PASSWORD") as String? ?: "password"
            keyAlias = project.findProperty("KEY_ALIAS") as String? ?: "key"
            keyPassword = project.findProperty("KEY_PASSWORD") as String? ?: "password"
        }
    }

    buildTypes {
        debug {
            isDebuggable = true
            isMinifyEnabled = false
            applicationIdSuffix = ".debug"
            versionNameSuffix = "-DEBUG"
            
            buildConfigField("boolean", "ENABLE_LOGGING", "true")
            buildConfigField("String", "LOG_LEVEL", "\"DEBUG\"")
            
            manifestPlaceholders["crashlyticsEnabled"] = false
            manifestPlaceholders["enableClearTextTraffic"] = true
        }
        
        create("staging") {
            initWith(getByName("debug"))
            isMinifyEnabled = true
            applicationIdSuffix = ".staging"
            versionNameSuffix = "-STAGING"
            
            buildConfigField("boolean", "ENABLE_LOGGING", "true")
            buildConfigField("String", "LOG_LEVEL", "\"INFO\"")
            buildConfigField("String", "API_BASE_URL", "\"https://staging-api.newsapp.com/v2/\"")
            
            manifestPlaceholders["crashlyticsEnabled"] = true
            manifestPlaceholders["enableClearTextTraffic"] = false
            
            proguardFiles(getDefaultProguardFile("proguard-android-optimize.txt"), "proguard-rules.pro")
            signingConfig = signingConfigs.getByName("debug")
        }
        
        release {
            isMinifyEnabled = true
            isShrinkResources = true
            
            buildConfigField("boolean", "ENABLE_LOGGING", "false")
            buildConfigField("String", "LOG_LEVEL", "\"ERROR\"")
            
            manifestPlaceholders["crashlyticsEnabled"] = true
            manifestPlaceholders["enableClearTextTraffic"] = false
            
            proguardFiles(getDefaultProguardFile("proguard-android-optimize.txt"), "proguard-rules.pro")
            signingConfig = signingConfigs.getByName("release")
        }
    }

    flavorDimensions += listOf("version", "market")

    productFlavors {
        create("free") {
            dimension = "version"
            applicationIdSuffix = ".free"
            versionNameSuffix = "-free"
            
            buildConfigField("boolean", "IS_PREMIUM", "false")
            buildConfigField("int", "DAILY_ARTICLE_LIMIT", "5")
            buildConfigField("boolean", "ADS_ENABLED", "true")
            buildConfigField("String", "FLAVOR_NAME", "\"Free\"")
            
            manifestPlaceholders["appIcon"] = "@mipmap/ic_launcher_free"
            manifestPlaceholders["appName"] = "News App Free"
        }
        
        create("premium") {
            dimension = "version"
            applicationIdSuffix = ".premium"
            versionNameSuffix = "-premium"
            
            buildConfigField("boolean", "IS_PREMIUM", "true")
            buildConfigField("int", "DAILY_ARTICLE_LIMIT", "Integer.MAX_VALUE")
            buildConfigField("boolean", "ADS_ENABLED", "false")
            buildConfigField("String", "FLAVOR_NAME", "\"Premium\"")
            
            manifestPlaceholders["appIcon"] = "@mipmap/ic_launcher_premium"
            manifestPlaceholders["appName"] = "News App Premium"
        }
        
        create("playstore") {
            dimension = "market"
            
            buildConfigField("String", "ANALYTICS_PLATFORM", "\"Google Analytics\"")
            buildConfigField("String", "IAP_PLATFORM", "\"Google Play Billing\"")
            buildConfigField("boolean", "USE_HMS", "false")
            
            manifestPlaceholders["marketName"] = "Google Play"
        }
        
        create("huawei") {
            dimension = "market"
            
            buildConfigField("String", "ANALYTICS_PLATFORM", "\"HMS Analytics\"")
            buildConfigField("String", "IAP_PLATFORM", "\"Huawei IAP\"")
            buildConfigField("boolean", "USE_HMS", "true")
            
            manifestPlaceholders["marketName"] = "Huawei AppGallery"
        }
    }

    // Disable specific variants if needed
    androidComponents {
        beforeVariants { variantBuilder ->
            // Disable premium + huawei + debug combinations
            if (variantBuilder.productFlavors.containsAll(listOf("premium" to "version", "huawei" to "market")) &&
                variantBuilder.buildType == "debug") {
                variantBuilder.enable = false
            }
        }
    }

    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_1_8
        targetCompatibility = JavaVersion.VERSION_1_8
    }

    kotlinOptions {
        jvmTarget = "1.8"
    }

    buildFeatures {
        viewBinding = true
        buildConfig = true
    }
    
    packaging {
        resources {
            excludes += "/META-INF/{AL2.0,LGPL2.1}"
            // Exclude HMS from PlayStore variants
            if (project.hasProperty("excludeHMS")) {
                excludes += "**/META-INF/com/huawei/**"
            }
        }
    }
}

fun generateVersionCode(): Int {
    val majorVersion = 1
    val minorVersion = 0
    val patchVersion = 0
    return majorVersion * 10000 + minorVersion * 100 + patchVersion
}

dependencies {
    implementation("androidx.core:core-ktx:1.12.0")
    implementation("androidx.appcompat:appcompat:1.6.1")
    implementation("com.google.android.material:material:1.11.0")
    implementation("androidx.constraintlayout:constraintlayout:2.1.4")
    
    // Architecture components
    implementation("androidx.lifecycle:lifecycle-viewmodel-ktx:2.7.0")
    implementation("androidx.navigation:navigation-fragment-ktx:2.7.6")
    
    // Network
    implementation("com.squareup.retrofit2:retrofit:2.9.0")
    implementation("com.squareup.retrofit2:converter-gson:2.9.0")
    implementation("com.squareup.okhttp3:logging-interceptor:4.12.0")
    
    // PlayStore specific dependencies
    "playstoreImplementation"("com.google.android.gms:play-services-analytics:18.0.4")
    "playstoreImplementation"("com.android.billingclient:billing:6.1.0")
    
    // Huawei specific dependencies
    "huaweiImplementation"("com.huawei.hms:hianalytics:6.11.0.300")
    "huaweiImplementation"("com.huawei.hms:iap:6.12.0.300")
    
    // Free version - ads
    "freeImplementation"("com.google.android.gms:play-services-ads:22.6.0")
    
    // Debug tools
    debugImplementation("com.squareup.leakcanary:leakcanary-android:2.12")
    
    // Testing
    testImplementation("junit:junit:4.13.2")
    androidTestImplementation("androidx.test.ext:junit:1.1.5")
    androidTestImplementation("androidx.test.espresso:espresso-core:3.5.1")
}

// Custom tasks
tasks.register("printBuildVariants") {
    doLast {
        android.applicationVariants.all { variant ->
            println("=== Variant: ${variant.name} ===")
            println("Application ID: ${variant.applicationId}")
            println("Version Name: ${variant.versionName}")
            println("Version Code: ${variant.versionCode}")
            println("Build Type: ${variant.buildType.name}")
            println("Product Flavors: ${variant.productFlavors.joinToString { "${it.name}(${it.dimension})" }}")
            println("Output APK: ${variant.outputs.map { it.outputFile.name }}")
            println()
        }
    }
}

tasks.register("buildAllVariants") {
    dependsOn("assembleRelease")
    doLast {
        println("All release variants built successfully!")
    }
}

// Apply different plugins based on flavor
android.applicationVariants.all { variant ->
    val marketFlavor = variant.productFlavors.find { it.dimension == "market" }?.name
    
    when (marketFlavor) {
        "playstore" -> {
            apply(plugin = "com.google.gms.google-services")
        }
        "huawei" -> {
            apply(plugin = "com.huawei.agconnect")
        }
    }
}
```

#### Bước 3: Flavor-specific Source Sets

```
app/src/
├── main/                           # Common source
│   ├── java/
│   ├── res/
│   └── AndroidManifest.xml
├── free/                          # Free flavor specific
│   ├── java/com/example/newsapp/
│   │   └── ads/
│   │       └── AdsManager.kt
│   └── res/
│       ├── values/
│       │   └── strings.xml
│       └── mipmap-hdpi/
│           └── ic_launcher_free.png
├── premium/                       # Premium flavor specific
│   ├── java/com/example/newsapp/
│   │   └── ads/
│   │       └── AdsManager.kt      # Empty implementation
│   └── res/
│       ├── values/
│       │   └── strings.xml
│       └── mipmap-hdpi/
│           └── ic_launcher_premium.png
├── playstore/                     # PlayStore market specific
│   ├── java/com/example/newsapp/
│   │   ├── analytics/
│   │   │   └── AnalyticsManager.kt
│   │   └── billing/
│   │       └── BillingManager.kt
│   └── res/
├── huawei/                        # Huawei market specific
│   ├── java/com/example/newsapp/
│   │   ├── analytics/
│   │   │   └── AnalyticsManager.kt
│   │   └── billing/
│   │       └── BillingManager.kt
│   └── res/
├── debug/                         # Debug build type
│   └── res/
│       └── values/
│           └── strings.xml
└── release/                       # Release build type
    └── res/
        └── values/
            └── strings.xml
```

#### Bước 4: Conditional Implementation

```kotlin
// File: src/main/java/com/example/newsapp/MainActivity.kt
class MainActivity : AppCompatActivity() {
    
    private lateinit var binding: ActivityMainBinding
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)
        
        setupBasedOnFlavor()
    }
    
    private fun setupBasedOnFlavor() {
        // Version-based setup
        if (BuildConfig.IS_PREMIUM) {
            setupPremiumFeatures()
        } else {
            setupFreeFeatures()
        }
        
        // Market-based setup
        if (BuildConfig.USE_HMS) {
            initializeHuaweiServices()
        } else {
            initializeGoogleServices()
        }
        
        // Update UI with flavor info
        binding.flavorInfo.text = """
            Version: ${BuildConfig.FLAVOR_NAME}
            Market: ${BuildConfig.ANALYTICS_PLATFORM}
            Daily Limit: ${if (BuildConfig.DAILY_ARTICLE_LIMIT == Int.MAX_VALUE) "Unlimited" else BuildConfig.DAILY_ARTICLE_LIMIT}
        """.trimIndent()
    }
    
    private fun setupPremiumFeatures() {
        binding.premiumBadge.visibility = View.VISIBLE
        binding.upgradeButton.visibility = View.GONE
        
        // Hide ads
        binding.adContainer.visibility = View.GONE
    }
    
    private fun setupFreeFeatures() {
        binding.premiumBadge.visibility = View.GONE
        binding.upgradeButton.visibility = View.VISIBLE
        
        // Setup ads if enabled
        if (BuildConfig.ADS_ENABLED) {
            AdsManager.initialize()
            AdsManager.loadBannerAd(binding.adContainer)
        }
        
        binding.upgradeButton.setOnClickListener {
            // Different upgrade flow based on market
            when {
                BuildConfig.USE_HMS -> HuaweiIAPManager.showUpgradeDialog()
                else -> GooglePlayBillingManager.showUpgradeDialog()
            }
        }
    }
    
    private fun initializeGoogleServices() {
        GoogleAnalyticsManager.initialize()
        GooglePlayBillingManager.initialize()
    }
    
    private fun initializeHuaweiServices() {
        HMSAnalyticsManager.initialize()
        HuaweiIAPManager.initialize()
    }
}
```

**Giải thích cấu hình:**

1. **Build Types**: 3 môi trường với cấu hình khác nhau về logging, API endpoints
2. **Product Flavors**: 2 dimensions tạo ra 4 combinations
3. **Conditional Dependencies**: Dependencies chỉ được include cho specific flavors
4. **Source Sets**: Separate implementations cho different flavors
5. **Build Config**: Dynamic values được inject vào runtime
6. **Signing Config**: Different signing cho different build types

## 🔑 Những điểm quan trọng cần lưu ý

### 1. Gradle Performance Optimization
- **Parallel execution**: `org.gradle.parallel=true`
- **Build cache**: `org.gradle.caching=true` 
- **Configuration cache**: `org.gradle.unsafe.configuration-cache=true`
- **JVM heap size**: `org.gradle.jvmargs=-Xmx4g`

### 2. Build Variants Best Practices
- Không tạo quá nhiều variants (exponential growth)
- Disable unused variants với `androidComponents.beforeVariants`
- Sử dụng consistent naming conventions
- Document flavor purposes và use cases

### 3. ProGuard/R8 Optimization
- Test thoroughly trước khi release
- Keep specific classes và methods cần thiết
- Use `@Keep` annotation cho critical code
- Enable full R8 mode cho better optimization

### 4. Version Control
- Exclude generated files từ VCS
- Use meaningful commit messages
- Setup pre-commit hooks cho code quality
- Branch naming conventions consistency

### 5. Common Mistakes
- Hardcode signing configs trong build files
- Không test tất cả build variants
- Over-complicated build configurations
- Missing ProGuard rules for libraries
- Không optimize build performance

## 📝 Bài tập về nhà

### Bài 1: E-commerce App Build System

Tạo build system cho E-commerce app với requirements:

**Build Types**: development, testing, production
**Flavors**: 
- Customer type: customer, merchant  
- Market: domestic, international

**Features**:
- Customer app: browse products, place orders
- Merchant app: manage inventory, process orders
- Domestic: VND currency, Vietnamese language
- International: USD currency, English language

**Technical Requirements**:
- Different API endpoints cho mỗi build type
- Conditional dependencies (payment gateways khác nhau)
- Flavor-specific resources và strings
- Custom ProGuard rules
- Automated version code generation

### Bài 2: Multi-module Project Setup

Tạo multi-module architecture cho news app:

**Modules**:
- `:app` - Main application module
- `:core` - Common utilities và base classes  
- `:data` - Repository pattern, API calls
- `:domain` - Business logic và use cases
- `:feature:news` - News listing feature
- `:feature:profile` - User profile feature

**Requirements**:
- Shared build configuration
- Version catalog usage
- Module-specific ProGuard rules
- Inter-module dependencies management
- Build performance optimization với parallel execution

---

*Post ID: k3w0wljbv2gqef0*  
*Category: Android*  
*Created: 1/9/2025*  
*Updated: 1/9/2025*
