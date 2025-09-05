---
title: "Bài 6: Navigation Component và Advanced Navigation"
postId: "ncid0bbtupg9d9c"
category: "Android"
created: "1/9/2025"
updated: "1/9/2025"
---

# Bài 6: Navigation Component và Advanced Navigation


## 🎯 Mục tiêu bài học

Sau khi hoàn thành bài học này, học viên sẽ có thể:

- Hiểu và implement Navigation Architecture Component hiệu quả
- Tạo và quản lý NavGraph với destinations và actions
- Sử dụng Safe Args plugin để truyền data an toàn giữa destinations
- Implement deep linking cho external app integration
- Xử lý conditional navigation và complex navigation flows
- Tích hợp Navigation Drawer, Bottom Navigation với Navigation Component
- Tạo nested navigation graphs cho modular architecture
- Handle back stack management và navigation state

## 📝 Nội dung chi tiết

### 1. Navigation Architecture Component Overview

#### 1.1 Navigation Component Principles

**Khái niệm Navigation Architecture Component:**

Navigation Component provide consistent và predictable way to handle in-app navigation:

**Core Principles:**
- **Single Activity Architecture**: One activity hosts multiple fragments
- **Type-safe Navigation**: Compile-time safety for destinations và arguments  
- **Automatic Back Stack Management**: Handle up và back navigation correctly
- **Deep Link Support**: Direct links to specific app content

**Key Benefits:**
- **Centralized Navigation Logic**: All navigation rules trong NavGraph
- **Argument Passing Safety**: Safe Args plugin generates type-safe classes
- **UI Component Integration**: Works với Bottom Navigation, Drawer, etc.
- **Animation Support**: Built-in transition animations
- **Testing**: Easy to test navigation flows

Navigation Component được thiết kế dựa trên Single Activity architecture:

```kotlin
// Traditional multi-activity approach (Not recommended)
class MainActivity : AppCompatActivity() {
    fun openProfileScreen() {
        val intent = Intent(this, ProfileActivity::class.java)
        intent.putExtra("user_id", userId)
        startActivity(intent)
    }
}

class ProfileActivity : AppCompatActivity() {
    fun openEditProfile() {
        val intent = Intent(this, EditProfileActivity::class.java)
        startActivityForResult(intent, EDIT_PROFILE_REQUEST)
    }
}

// Modern Navigation Component approach (Recommended)
class MainActivity : AppCompatActivity() {
    
    private lateinit var navController: NavController
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        
        setupNavigation()
    }
    
    private fun setupNavigation() {
        val navHostFragment = supportFragmentManager
            .findFragmentById(R.id.nav_host_fragment) as NavHostFragment
        navController = navHostFragment.navController
        
        // Setup navigation UI components
        setupBottomNavigation()
        setupNavigationDrawer()
        setupToolbar()
    }
    
    private fun setupBottomNavigation() {
        val bottomNav = findViewById<BottomNavigationView>(R.id.bottom_navigation)
        bottomNav.setupWithNavController(navController)
    }
    
    private fun setupNavigationDrawer() {
        val drawerLayout = findViewById<DrawerLayout>(R.id.drawer_layout)
        val navView = findViewById<NavigationView>(R.id.nav_view)
        
        val appBarConfiguration = AppBarConfiguration(
            setOf(R.id.homeFragment, R.id.profileFragment, R.id.settingsFragment),
            drawerLayout
        )
        
        setupActionBarWithNavController(navController, appBarConfiguration)
        navView.setupWithNavController(navController)
    }
    
    private fun setupToolbar() {
        val appBarConfiguration = AppBarConfiguration(navController.graph)
        setupActionBarWithNavController(navController, appBarConfiguration)
    }
    
    override fun onSupportNavigateUp(): Boolean {
        return navController.navigateUp() || super.onSupportNavigateUp()
    }
}
```

#### 1.2 Key Navigation Components

```kotlin
// Core Navigation Components:

// 1. NavController: Navigation state manager
class HomeFragment : Fragment() {
    
    private fun navigateToProfile(userId: String) {
        findNavController().navigate(
            HomeFragmentDirections.actionHomeToProfile(userId)
        )
    }
    
    private fun navigateWithOptions() {
        val navOptions = NavOptions.Builder()
            .setPopUpTo(R.id.homeFragment, inclusive = false)
            .setEnterAnim(R.anim.slide_in_right)
            .setExitAnim(R.anim.slide_out_left)
            .setPopEnterAnim(R.anim.slide_in_left)
            .setPopExitAnim(R.anim.slide_out_right)
            .build()
            
        findNavController().navigate(
            R.id.action_home_to_profile,
            null,
            navOptions
        )
    }
}

// 2. NavGraph: Navigation structure definition
// Được define trong res/navigation/nav_graph.xml

// 3. NavHost: Container cho navigation content
// NavHostFragment trong layout XML
```

### 2. NavGraph Configuration

#### 2.1 Basic NavGraph Setup

```xml
<!-- File: res/navigation/nav_graph.xml -->
<?xml version="1.0" encoding="utf-8"?>
<navigation xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    xmlns:tools="http://schemas.android.com/tools"
    android:id="@+id/nav_graph"
    app:startDestination="@id/homeFragment">

    <!-- Home Fragment -->
    <fragment
        android:id="@+id/homeFragment"
        android:name="com.example.app.ui.HomeFragment"
        android:label="@string/home_title"
        tools:layout="@layout/fragment_home">
        
        <!-- Action to Profile -->
        <action
            android:id="@+id/action_home_to_profile"
            app:destination="@id/profileFragment"
            app:enterAnim="@anim/slide_in_right"
            app:exitAnim="@anim/slide_out_left"
            app:popEnterAnim="@anim/slide_in_left"
            app:popExitAnim="@anim/slide_out_right" />
            
        <!-- Action to Search -->
        <action
            android:id="@+id/action_home_to_search"
            app:destination="@id/searchFragment"
            app:launchSingleTop="true" />
            
        <!-- Deep link -->
        <deepLink app:uri="myapp://home" />
        
    </fragment>

    <!-- Profile Fragment -->
    <fragment
        android:id="@+id/profileFragment"
        android:name="com.example.app.ui.ProfileFragment"
        android:label="{user_name}"
        tools:layout="@layout/fragment_profile">
        
        <!-- Arguments -->
        <argument
            android:name="user_id"
            app:argType="string" />
            
        <argument
            android:name="user_name"
            app:argType="string"
            android:defaultValue="Profile" />
            
        <argument
            android:name="is_own_profile"
            app:argType="boolean"
            android:defaultValue="false" />
        
        <!-- Actions -->
        <action
            android:id="@+id/action_profile_to_edit"
            app:destination="@id/editProfileFragment" />
            
        <action
            android:id="@+id/action_profile_to_followers"
            app:destination="@id/followersFragment" />
            
        <!-- Deep link with parameters -->
        <deepLink app:uri="myapp://profile/{user_id}" />
        
    </fragment>

    <!-- Edit Profile Fragment -->
    <fragment
        android:id="@+id/editProfileFragment"
        android:name="com.example.app.ui.EditProfileFragment"
        android:label="@string/edit_profile_title"
        tools:layout="@layout/fragment_edit_profile">
        
        <!-- Pop behavior - return to profile after save -->
        <action
            android:id="@+id/action_edit_profile_save"
            app:popUpTo="@id/profileFragment"
            app:popUpToInclusive="false" />
            
    </fragment>

    <!-- Search Fragment -->
    <fragment
        android:id="@+id/searchFragment"
        android:name="com.example.app.ui.SearchFragment"
        android:label="@string/search_title"
        tools:layout="@layout/fragment_search">
        
        <!-- Search results can navigate to profile -->
        <action
            android:id="@+id/action_search_to_profile"
            app:destination="@id/profileFragment" />
            
    </fragment>

    <!-- Followers Fragment với custom animations -->
    <fragment
        android:id="@+id/followersFragment"
        android:name="com.example.app.ui.FollowersFragment"
        android:label="Followers"
        tools:layout="@layout/fragment_followers">
        
        <argument
            android:name="user_id"
            app:argType="string" />
            
        <argument
            android:name="follower_type"
            app:argType="com.example.app.model.FollowerType"
            android:defaultValue="FOLLOWERS" />
            
    </fragment>

</navigation>
```

#### 2.2 MainActivity Layout với NavHostFragment

```xml
<!-- File: res/layout/activity_main.xml -->
<?xml version="1.0" encoding="utf-8"?>
<androidx.drawerlayout.widget.DrawerLayout 
    xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:id="@+id/drawer_layout"
    android:layout_width="match_parent"
    android:layout_height="match_parent">

    <!-- Main Content -->
    <androidx.constraintlayout.widget.ConstraintLayout
        android:layout_width="match_parent"
        android:layout_height="match_parent">

        <!-- App Bar -->
        <com.google.android.material.appbar.MaterialToolbar
            android:id="@+id/toolbar"
            android:layout_width="match_parent"
            android:layout_height="?attr/actionBarSize"
            android:background="?attr/colorPrimary"
            android:theme="@style/ThemeOverlay.Material3.Dark.ActionBar"
            app:layout_constraintTop_toTopOf="parent" />

        <!-- Nav Host Fragment -->
        <androidx.fragment.app.FragmentContainerView
            android:id="@+id/nav_host_fragment"
            android:name="androidx.navigation.fragment.NavHostFragment"
            android:layout_width="match_parent"
            android:layout_height="0dp"
            app:defaultNavHost="true"
            app:navGraph="@navigation/nav_graph"
            app:layout_constraintTop_toBottomOf="@id/toolbar"
            app:layout_constraintBottom_toTopOf="@id/bottom_navigation" />

        <!-- Bottom Navigation -->
        <com.google.android.material.bottomnavigation.BottomNavigationView
            android:id="@+id/bottom_navigation"
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            app:menu="@menu/bottom_navigation_menu"
            app:layout_constraintBottom_toBottomOf="parent" />

    </androidx.constraintlayout.widget.ConstraintLayout>

    <!-- Navigation Drawer -->
    <com.google.android.material.navigation.NavigationView
        android:id="@+id/nav_view"
        android:layout_width="wrap_content"
        android:layout_height="match_parent"
        android:layout_gravity="start"
        android:fitsSystemWindows="true"
        app:headerLayout="@layout/nav_header"
        app:menu="@menu/drawer_menu" />

</androidx.drawerlayout.widget.DrawerLayout>
```

### 3. Safe Args Plugin

**Khái niệm Safe Args:**

Safe Args plugin generates type-safe classes cho navigation với compile-time argument checking:

**How It Works:**
- **Code Generation**: Plugin generates direction classes từ NavGraph
- **Type Safety**: Arguments are strongly typed, prevent runtime errors
- **IDE Support**: Auto-completion và refactoring support
- **Null Safety**: Integration với Kotlin null safety system

**Generated Classes:**
- **Directions**: Methods để navigate với typed arguments
- **Args**: Classes để retrieve arguments trong destination fragments
- **NavDirections**: Type-safe navigation actions

**Benefits:**
- **Compile-time Safety**: Catch navigation errors during build
- **Refactoring Support**: IDE can rename arguments safely
- **Better Developer Experience**: Auto-completion for navigation

#### 3.1 Setup Safe Args

```kotlin
// File: build.gradle.kts (Project level)
buildscript {
    dependencies {
        classpath("androidx.navigation:navigation-safe-args-gradle-plugin:2.7.6")
    }
}

// File: build.gradle.kts (App level)
plugins {
    id("androidx.navigation.safeargs.kotlin")
}

dependencies {
    implementation("androidx.navigation:navigation-fragment-ktx:2.7.6")
    implementation("androidx.navigation:navigation-ui-ktx:2.7.6")
}
```

#### 3.2 Using Safe Args

```kotlin
// Generated Safe Args classes từ nav_graph.xml

// HomeFragment - Passing arguments
class HomeFragment : Fragment() {
    
    private var _binding: FragmentHomeBinding? = null
    private val binding get() = _binding!!
    
    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentHomeBinding.inflate(inflater, container, false)
        return binding.root
    }
    
    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        
        setupClickListeners()
    }
    
    private fun setupClickListeners() {
        binding.profileButton.setOnClickListener {
            navigateToProfile("user_123", "John Doe", true)
        }
        
        binding.searchButton.setOnClickListener {
            navigateToSearch()
        }
        
        binding.followersButton.setOnClickListener {
            navigateToFollowers("user_123", FollowerType.FOLLOWERS)
        }
    }
    
    private fun navigateToProfile(userId: String, userName: String, isOwnProfile: Boolean) {
        val directions = HomeFragmentDirections.actionHomeToProfile(
            userId = userId,
            userName = userName,
            isOwnProfile = isOwnProfile
        )
        findNavController().navigate(directions)
    }
    
    private fun navigateToSearch() {
        val directions = HomeFragmentDirections.actionHomeToSearch()
        findNavController().navigate(directions)
    }
    
    private fun navigateToFollowers(userId: String, type: FollowerType) {
        // First navigate to profile, then to followers
        val profileDirections = HomeFragmentDirections.actionHomeToProfile(
            userId = userId,
            userName = "Loading..."
        )
        
        findNavController().navigate(profileDirections)
        
        // Navigate to followers after profile is loaded
        lifecycleScope.launch {
            delay(100) // Wait for profile to load
            val followersDirections = ProfileFragmentDirections.actionProfileToFollowers(
                userId = userId,
                followerType = type
            )
            findNavController().navigate(followersDirections)
        }
    }
    
    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}

// ProfileFragment - Receiving arguments
class ProfileFragment : Fragment() {
    
    private var _binding: FragmentProfileBinding? = null
    private val binding get() = _binding!!
    
    private val args: ProfileFragmentArgs by navArgs()
    private lateinit var viewModel: ProfileViewModel
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        // Access arguments safely
        val userId = args.userId
        val userName = args.userName
        val isOwnProfile = args.isOwnProfile
        
        // Initialize ViewModel with arguments
        val factory = ProfileViewModelFactory(userId, isOwnProfile)
        viewModel = ViewModelProvider(this, factory)[ProfileViewModel::class.java]
    }
    
    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentProfileBinding.inflate(inflater, container, false)
        return binding.root
    }
    
    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        
        setupUI()
        observeViewModel()
        
        // Load profile data
        viewModel.loadProfile()
    }
    
    private fun setupUI() {
        // Initial setup with args
        binding.apply {
            // Show loading state initially
            profileName.text = args.userName
            
            // Setup buttons based on ownership
            if (args.isOwnProfile) {
                editButton.visibility = View.VISIBLE
                followButton.visibility = View.GONE
            } else {
                editButton.visibility = View.GONE
                followButton.visibility = View.VISIBLE
            }
            
            editButton.setOnClickListener {
                navigateToEditProfile()
            }
            
            followersCount.setOnClickListener {
                navigateToFollowers(FollowerType.FOLLOWERS)
            }
            
            followingCount.setOnClickListener {
                navigateToFollowers(FollowerType.FOLLOWING)
            }
        }
    }
    
    private fun observeViewModel() {
        viewModel.profile.observe(viewLifecycleOwner) { profile ->
            updateProfileUI(profile)
        }
        
        viewModel.error.observe(viewLifecycleOwner) { error ->
            showError(error)
        }
    }
    
    private fun updateProfileUI(profile: Profile) {
        binding.apply {
            profileName.text = profile.name
            profileBio.text = profile.bio
            followersCount.text = profile.followersCount.toString()
            followingCount.text = profile.followingCount.toString()
            postsCount.text = profile.postsCount.toString()
            
            // Load profile image
            Glide.with(this@ProfileFragment)
                .load(profile.profileImageUrl)
                .placeholder(R.drawable.default_profile)
                .into(profileImage)
        }
    }
    
    private fun navigateToEditProfile() {
        val directions = ProfileFragmentDirections.actionProfileToEdit()
        findNavController().navigate(directions)
    }
    
    private fun navigateToFollowers(type: FollowerType) {
        val directions = ProfileFragmentDirections.actionProfileToFollowers(
            userId = args.userId,
            followerType = type
        )
        findNavController().navigate(directions)
    }
    
    private fun showError(message: String) {
        Snackbar.make(binding.root, message, Snackbar.LENGTH_LONG).show()
    }
    
    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}

// Custom argument type
enum class FollowerType {
    FOLLOWERS, FOLLOWING
}
```

### 4. Deep Linking Implementation

**Khái niệm Deep Linking:**

Deep Linking cho phép direct links tới specific content trong app:

**Types of Deep Links:**
- **Web Links**: HTTP/HTTPS URLs that open app content
- **App Links**: Verified web links that open directly trong app
- **Custom Scheme**: Custom URI schemes (myapp://profile)

**Benefits:**
- **User Engagement**: Direct access to specific content
- **Marketing**: Share specific screens via links
- **Integration**: External apps can link to your content
- **SEO**: Web links can improve app discoverability

**Implementation:**
- **Manifest Declaration**: Intent filters for link handling
- **NavGraph Integration**: Deep link destinations trong navigation graph
- **URL Pattern Matching**: Handle different URL patterns
- **Argument Extraction**: Parse URL parameters to navigation arguments

#### 4.1 Manifest Configuration

```xml
<!-- File: AndroidManifest.xml -->
<activity
    android:name=".MainActivity"
    android:exported="true"
    android:launchMode="singleTop"
    android:theme="@style/Theme.MyApp">
    
    <!-- Default launcher intent -->
    <intent-filter>
        <action android:name="android.intent.action.MAIN" />
        <category android:name="android.intent.category.LAUNCHER" />
    </intent-filter>
    
    <!-- Deep link intent filters -->
    <intent-filter android:autoVerify="true">
        <action android:name="android.intent.action.VIEW" />
        <category android:name="android.intent.category.DEFAULT" />
        <category android:name="android.intent.category.BROWSABLE" />
        <data android:scheme="https"
            android:host="myapp.example.com" />
    </intent-filter>
    
    <intent-filter>
        <action android:name="android.intent.action.VIEW" />
        <category android:name="android.intent.category.DEFAULT" />
        <category android:name="android.intent.category.BROWSABLE" />
        <data android:scheme="myapp" />
    </intent-filter>
    
</activity>
```

#### 4.2 Deep Link Handling

```kotlin
class MainActivity : AppCompatActivity() {
    
    private lateinit var navController: NavController
    private lateinit var appBarConfiguration: AppBarConfiguration
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)
        
        setupNavigation()
        handleDeepLink(intent)
    }
    
    override fun onNewIntent(intent: Intent?) {
        super.onNewIntent(intent)
        intent?.let { handleDeepLink(it) }
    }
    
    private fun setupNavigation() {
        val navHostFragment = supportFragmentManager
            .findFragmentById(R.id.nav_host_fragment) as NavHostFragment
        navController = navHostFragment.navController
        
        appBarConfiguration = AppBarConfiguration(
            setOf(R.id.homeFragment, R.id.searchFragment, R.id.profileFragment),
            findViewById(R.id.drawer_layout)
        )
        
        setupActionBarWithNavController(navController, appBarConfiguration)
        
        // Setup bottom navigation
        findViewById<BottomNavigationView>(R.id.bottom_navigation)
            .setupWithNavController(navController)
    }
    
    private fun handleDeepLink(intent: Intent) {
        val data = intent.data
        
        if (data != null) {
            when {
                // Handle web deep links: https://myapp.example.com/profile/123
                data.scheme == "https" && data.host == "myapp.example.com" -> {
                    handleWebDeepLink(data)
                }
                // Handle app deep links: myapp://profile/123
                data.scheme == "myapp" -> {
                    handleAppDeepLink(data)
                }
            }
        }
    }
    
    private fun handleWebDeepLink(data: Uri) {
        val pathSegments = data.pathSegments
        
        when {
            pathSegments.size >= 2 && pathSegments[0] == "profile" -> {
                val userId = pathSegments[1]
                navigateToProfile(userId)
            }
            pathSegments.size >= 2 && pathSegments[0] == "post" -> {
                val postId = pathSegments[1]
                navigateToPost(postId)
            }
            pathSegments.isNotEmpty() && pathSegments[0] == "search" -> {
                val query = data.getQueryParameter("q")
                navigateToSearch(query)
            }
            else -> {
                // Default to home
                navigateToHome()
            }
        }
    }
    
    private fun handleAppDeepLink(data: Uri) {
        // Use Navigation Component's built-in deep link handling
        navController.handleDeepLink(Intent().apply {
            this.data = data
        })
    }
    
    private fun navigateToProfile(userId: String) {
        try {
            val directions = HomeFragmentDirections.actionHomeToProfile(
                userId = userId,
                userName = "Loading..." // Will be updated when profile loads
            )
            navController.navigate(directions)
        } catch (e: Exception) {
            // Handle navigation error (destination not reachable from current)
            navController.popBackStack(R.id.homeFragment, false)
            navController.navigate(
                R.id.profileFragment,
                bundleOf("user_id" to userId)
            )
        }
    }
    
    private fun navigateToPost(postId: String) {
        // Navigate to post detail
        navController.navigate(
            R.id.postDetailFragment,
            bundleOf("post_id" to postId)
        )
    }
    
    private fun navigateToSearch(query: String?) {
        navController.navigate(
            R.id.searchFragment,
            bundleOf("initial_query" to query)
        )
    }
    
    private fun navigateToHome() {
        navController.popBackStack(R.id.homeFragment, false)
    }
    
    override fun onSupportNavigateUp(): Boolean {
        return navController.navigateUp(appBarConfiguration) 
            || super.onSupportNavigateUp()
    }
}

// Deep Link Utility class
object DeepLinkHandler {
    
    fun createProfileDeepLink(userId: String): Uri {
        return Uri.parse("myapp://profile/$userId")
    }
    
    fun createPostDeepLink(postId: String): Uri {
        return Uri.parse("myapp://post/$postId")
    }
    
    fun createSearchDeepLink(query: String): Uri {
        return Uri.parse("myapp://search?q=${Uri.encode(query)}")
    }
    
    fun createWebProfileLink(userId: String): Uri {
        return Uri.parse("https://myapp.example.com/profile/$userId")
    }
    
    fun shareProfile(context: Context, userId: String, userName: String) {
        val shareIntent = Intent(Intent.ACTION_SEND).apply {
            type = "text/plain"
            putExtra(Intent.EXTRA_SUBJECT, "Check out $userName's profile")
            putExtra(Intent.EXTRA_TEXT, "https://myapp.example.com/profile/$userId")
        }
        context.startActivity(Intent.createChooser(shareIntent, "Share Profile"))
    }
}
```

### 5. Conditional Navigation

#### 5.1 Authentication Flow

```kotlin
// Authentication Navigation Graph
// File: res/navigation/auth_nav_graph.xml
<?xml version="1.0" encoding="utf-8"?>
<navigation xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:id="@+id/auth_nav_graph"
    app:startDestination="@id/splashFragment">

    <fragment
        android:id="@+id/splashFragment"
        android:name="com.example.app.auth.SplashFragment"
        android:label="Splash">
        
        <!-- Conditional navigation based on auth state -->
        <action
            android:id="@+id/action_splash_to_main"
            app:destination="@id/main_nav_graph"
            app:popUpTo="@id/splashFragment"
            app:popUpToInclusive="true" />
            
        <action
            android:id="@+id/action_splash_to_login"
            app:destination="@id/loginFragment"
            app:popUpTo="@id/splashFragment"
            app:popUpToInclusive="true" />
            
    </fragment>

    <fragment
        android:id="@+id/loginFragment"
        android:name="com.example.app.auth.LoginFragment"
        android:label="Login">
        
        <action
            android:id="@+id/action_login_to_register"
            app:destination="@id/registerFragment" />
            
        <action
            android:id="@+id/action_login_to_main"
            app:destination="@id/main_nav_graph"
            app:popUpTo="@id/auth_nav_graph"
            app:popUpToInclusive="true" />
            
    </fragment>

    <fragment
        android:id="@+id/registerFragment"
        android:name="com.example.app.auth.RegisterFragment"
        android:label="Register">
        
        <action
            android:id="@+id/action_register_to_main"
            app:destination="@id/main_nav_graph"
            app:popUpTo="@id/auth_nav_graph"
            app:popUpToInclusive="true" />
            
    </fragment>

    <!-- Include main navigation as nested graph -->
    <include app:graph="@navigation/main_nav_graph" />

</navigation>

// Splash Fragment với conditional navigation
class SplashFragment : Fragment() {
    
    private var _binding: FragmentSplashBinding? = null
    private val binding get() = _binding!!
    
    private lateinit var authManager: AuthManager
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        authManager = AuthManager.getInstance(requireContext())
    }
    
    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentSplashBinding.inflate(inflater, container, false)
        return binding.root
    }
    
    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        
        // Show splash animation
        animateSplashLogo()
        
        // Check authentication state
        lifecycleScope.launch {
            delay(2000) // Minimum splash time
            checkAuthenticationState()
        }
    }
    
    private fun animateSplashLogo() {
        binding.logoImage.apply {
            alpha = 0f
            scaleX = 0.5f
            scaleY = 0.5f
            
            animate()
                .alpha(1f)
                .scaleX(1f)
                .scaleY(1f)
                .setDuration(1000)
                .setInterpolator(OvershootInterpolator())
                .start()
        }
    }
    
    private suspend fun checkAuthenticationState() {
        try {
            val isLoggedIn = authManager.isUserLoggedIn()
            val hasValidToken = authManager.hasValidToken()
            
            when {
                isLoggedIn && hasValidToken -> {
                    // User is authenticated, go to main app
                    navigateToMain()
                }
                isLoggedIn && !hasValidToken -> {
                    // Token expired, try refresh
                    val refreshSuccessful = authManager.refreshToken()
                    if (refreshSuccessful) {
                        navigateToMain()
                    } else {
                        navigateToLogin()
                    }
                }
                else -> {
                    // User not logged in
                    navigateToLogin()
                }
            }
        } catch (e: Exception) {
            // Handle error, default to login
            navigateToLogin()
        }
    }
    
    private fun navigateToMain() {
        findNavController().navigate(
            SplashFragmentDirections.actionSplashToMain()
        )
    }
    
    private fun navigateToLogin() {
        findNavController().navigate(
            SplashFragmentDirections.actionSplashToLogin()
        )
    }
    
    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}

// Login Fragment với navigation after success
class LoginFragment : Fragment() {
    
    private var _binding: FragmentLoginBinding? = null
    private val binding get() = _binding!!
    
    private lateinit var authManager: AuthManager
    
    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentLoginBinding.inflate(inflater, container, false)
        return binding.root
    }
    
    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        
        authManager = AuthManager.getInstance(requireContext())
        
        setupClickListeners()
    }
    
    private fun setupClickListeners() {
        binding.apply {
            loginButton.setOnClickListener {
                performLogin()
            }
            
            registerButton.setOnClickListener {
                navigateToRegister()
            }
            
            skipButton.setOnClickListener {
                navigateToMainAsGuest()
            }
        }
    }
    
    private fun performLogin() {
        val email = binding.emailInput.text.toString().trim()
        val password = binding.passwordInput.text.toString().trim()
        
        if (!validateInputs(email, password)) {
            return
        }
        
        showLoading(true)
        
        lifecycleScope.launch {
            try {
                val loginResult = authManager.login(email, password)
                
                if (loginResult.isSuccess) {
                    // Login successful
                    navigateToMain()
                } else {
                    // Login failed
                    showError(loginResult.errorMessage ?: "Login failed")
                }
            } catch (e: Exception) {
                showError("Network error. Please try again.")
            } finally {
                showLoading(false)
            }
        }
    }
    
    private fun validateInputs(email: String, password: String): Boolean {
        var isValid = true
        
        if (email.isEmpty() || !Patterns.EMAIL_ADDRESS.matcher(email).matches()) {
            binding.emailInputLayout.error = "Please enter a valid email"
            isValid = false
        } else {
            binding.emailInputLayout.error = null
        }
        
        if (password.isEmpty() || password.length < 6) {
            binding.passwordInputLayout.error = "Password must be at least 6 characters"
            isValid = false
        } else {
            binding.passwordInputLayout.error = null
        }
        
        return isValid
    }
    
    private fun showLoading(show: Boolean) {
        binding.apply {
            progressBar.visibility = if (show) View.VISIBLE else View.GONE
            loginButton.isEnabled = !show
            registerButton.isEnabled = !show
        }
    }
    
    private fun showError(message: String) {
        Snackbar.make(binding.root, message, Snackbar.LENGTH_LONG).show()
    }
    
    private fun navigateToMain() {
        findNavController().navigate(
            LoginFragmentDirections.actionLoginToMain()
        )
    }
    
    private fun navigateToRegister() {
        findNavController().navigate(
            LoginFragmentDirections.actionLoginToRegister()
        )
    }
    
    private fun navigateToMainAsGuest() {
        // Set guest mode
        authManager.setGuestMode(true)
        navigateToMain()
    }
    
    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
```

#### 5.2 Permission-based Navigation

```kotlin
// Permission-aware navigation
class CameraFragment : Fragment() {
    
    private var _binding: FragmentCameraBinding? = null
    private val binding get() = _binding!!
    
    private val cameraPermissionLauncher = registerForActivityResult(
        ActivityResultContracts.RequestPermission()
    ) { isGranted ->
        if (isGranted) {
            initializeCamera()
        } else {
            handlePermissionDenied()
        }
    }
    
    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        
        checkCameraPermission()
    }
    
    private fun checkCameraPermission() {
        when {
            ContextCompat.checkSelfPermission(
                requireContext(),
                Manifest.permission.CAMERA
            ) == PackageManager.PERMISSION_GRANTED -> {
                initializeCamera()
            }
            shouldShowRequestPermissionRationale(Manifest.permission.CAMERA) -> {
                showPermissionRationale()
            }
            else -> {
                cameraPermissionLauncher.launch(Manifest.permission.CAMERA)
            }
        }
    }
    
    private fun showPermissionRationale() {
        AlertDialog.Builder(requireContext())
            .setTitle("Camera Permission Required")
            .setMessage("This feature requires camera access to take photos.")
            .setPositiveButton("Grant Permission") { _, _ ->
                cameraPermissionLauncher.launch(Manifest.permission.CAMERA)
            }
            .setNegativeButton("Cancel") { _, _ ->
                navigateBack()
            }
            .show()
    }
    
    private fun handlePermissionDenied() {
        AlertDialog.Builder(requireContext())
            .setTitle("Camera Permission Denied")
            .setMessage("To use this feature, please enable camera permission in settings.")
            .setPositiveButton("Settings") { _, _ ->
                openAppSettings()
            }
            .setNegativeButton("Cancel") { _, _ ->
                navigateBack()
            }
            .show()
    }
    
    private fun openAppSettings() {
        val intent = Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS)
        intent.data = Uri.fromParts("package", requireContext().packageName, null)
        startActivity(intent)
    }
    
    private fun navigateBack() {
        findNavController().navigateUp()
    }
    
    private fun initializeCamera() {
        // Initialize camera functionality
    }
}

// Navigation based on feature flags
class FeatureGatedFragment : Fragment() {
    
    private lateinit var featureManager: FeatureManager
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        featureManager = FeatureManager.getInstance()
    }
    
    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        
        checkFeatureAvailability()
    }
    
    private fun checkFeatureAvailability() {
        lifecycleScope.launch {
            val features = featureManager.getAvailableFeatures()
            
            when {
                features.contains(Feature.PREMIUM_FEATURE) -> {
                    navigateToPremiumFlow()
                }
                features.contains(Feature.BETA_FEATURE) -> {
                    navigateToBetaFlow()
                }
                else -> {
                    navigateToStandardFlow()
                }
            }
        }
    }
    
    private fun navigateToPremiumFlow() {
        findNavController().navigate(R.id.action_to_premium_flow)
    }
    
    private fun navigateToBetaFlow() {
        findNavController().navigate(R.id.action_to_beta_flow)
    }
    
    private fun navigateToStandardFlow() {
        findNavController().navigate(R.id.action_to_standard_flow)
    }
}
```

### 6. Nested Navigation Graphs

#### 6.1 Modular Navigation Structure

```xml
<!-- File: res/navigation/main_nav_graph.xml -->
<?xml version="1.0" encoding="utf-8"?>
<navigation xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:id="@+id/main_nav_graph"
    app:startDestination="@id/home_nav_graph">

    <!-- Home Module Navigation -->
    <include app:graph="@navigation/home_nav_graph" />
    
    <!-- Profile Module Navigation -->
    <include app:graph="@navigation/profile_nav_graph" />
    
    <!-- Settings Module Navigation -->
    <include app:graph="@navigation/settings_nav_graph" />

    <!-- Global actions available from anywhere -->
    <action
        android:id="@+id/action_global_to_search"
        app:destination="@id/searchFragment" />
        
    <action
        android:id="@+id/action_global_to_login"
        app:destination="@id/auth_nav_graph"
        app:popUpTo="@id/main_nav_graph"
        app:popUpToInclusive="true" />

    <!-- Global fragments -->
    <fragment
        android:id="@+id/searchFragment"
        android:name="com.example.app.search.SearchFragment"
        android:label="Search" />
        
</navigation>

<!-- File: res/navigation/home_nav_graph.xml -->
<?xml version="1.0" encoding="utf-8"?>
<navigation xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:id="@+id/home_nav_graph"
    app:startDestination="@id/homeFragment">

    <fragment
        android:id="@+id/homeFragment"
        android:name="com.example.app.home.HomeFragment"
        android:label="Home">
        
        <action
            android:id="@+id/action_home_to_post_detail"
            app:destination="@id/postDetailFragment" />
            
        <!-- Cross-module navigation -->
        <action
            android:id="@+id/action_home_to_profile"
            app:destination="@id/profile_nav_graph" />
            
    </fragment>

    <fragment
        android:id="@+id/postDetailFragment"
        android:name="com.example.app.home.PostDetailFragment"
        android:label="Post Detail">
        
        <argument
            android:name="post_id"
            app:argType="string" />
            
        <action
            android:id="@+id/action_post_detail_to_comments"
            app:destination="@id/commentsFragment" />
            
    </fragment>

    <fragment
        android:id="@+id/commentsFragment"
        android:name="com.example.app.home.CommentsFragment"
        android:label="Comments">
        
        <argument
            android:name="post_id"
            app:argType="string" />
            
    </fragment>

</navigation>

<!-- File: res/navigation/profile_nav_graph.xml -->
<?xml version="1.0" encoding="utf-8"?>
<navigation xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:id="@+id/profile_nav_graph"
    app:startDestination="@id/profileFragment">

    <fragment
        android:id="@+id/profileFragment"
        android:name="com.example.app.profile.ProfileFragment"
        android:label="{user_name}">
        
        <argument
            android:name="user_id"
            app:argType="string" />
            
        <argument
            android:name="user_name"
            app:argType="string"
            android:defaultValue="Profile" />
        
        <action
            android:id="@+id/action_profile_to_edit"
            app:destination="@id/editProfileFragment" />
            
        <action
            android:id="@+id/action_profile_to_followers"
            app:destination="@id/followersFragment" />
            
        <action
            android:id="@+id/action_profile_to_posts"
            app:destination="@id/userPostsFragment" />
            
    </fragment>

    <fragment
        android:id="@+id/editProfileFragment"
        android:name="com.example.app.profile.EditProfileFragment"
        android:label="Edit Profile" />

    <fragment
        android:id="@+id/followersFragment"
        android:name="com.example.app.profile.FollowersFragment"
        android:label="Followers">
        
        <argument
            android:name="user_id"
            app:argType="string" />
            
        <argument
            android:name="follower_type"
            app:argType="com.example.app.model.FollowerType" />
            
    </fragment>

    <fragment
        android:id="@+id/userPostsFragment"
        android:name="com.example.app.profile.UserPostsFragment"
        android:label="Posts">
        
        <argument
            android:name="user_id"
            app:argType="string" />
            
        <!-- Can navigate back to home module -->
        <action
            android:id="@+id/action_user_posts_to_post_detail"
            app:destination="@id/home_nav_graph" />
            
    </fragment>

</navigation>
```

#### 6.2 Cross-Module Navigation

```kotlin
// Navigation between different modules
class HomeFragment : Fragment() {
    
    private fun navigateToUserProfile(userId: String, userName: String) {
        // Navigate to profile module
        val directions = HomeFragmentDirections.actionHomeToProfile(
            userId = userId,
            userName = userName
        )
        findNavController().navigate(directions)
    }
    
    private fun navigateToGlobalSearch() {
        // Use global action
        findNavController().navigate(R.id.action_global_to_search)
    }
}

// Navigation Manager cho complex flows
class NavigationManager(private val navController: NavController) {
    
    fun navigateToUserProfile(userId: String) {
        val currentDestination = navController.currentDestination?.id
        
        val directions = when (currentDestination) {
            R.id.homeFragment -> {
                HomeFragmentDirections.actionHomeToProfile(userId, "Loading...")
            }
            R.id.searchFragment -> {
                SearchFragmentDirections.actionSearchToProfile(userId, "Loading...")
            }
            else -> {
                // Use global action
                NavGraphDirections.actionGlobalToProfile(userId, "Loading...")
            }
        }
        
        navController.navigate(directions)
    }
    
    fun navigateToPostDetail(postId: String) {
        // Smart navigation based on current location
        val currentDestination = navController.currentDestination?.id
        
        when (currentDestination) {
            in homeModuleDestinations -> {
                navController.navigate(
                    HomeFragmentDirections.actionToPostDetail(postId)
                )
            }
            else -> {
                // Navigate to home first, then to post
                navController.navigate(R.id.home_nav_graph)
                navController.navigate(
                    HomeFragmentDirections.actionToPostDetail(postId)
                )
            }
        }
    }
    
    fun logout() {
        // Clear back stack and go to auth
        navController.navigate(R.id.action_global_to_login)
    }
    
    companion object {
        private val homeModuleDestinations = setOf(
            R.id.homeFragment,
            R.id.postDetailFragment,
            R.id.commentsFragment
        )
    }
}
```

## 🏆 Bài tập thực hành

### Đề bài: E-commerce App với Complete Navigation Flow

Tạo ứng dụng e-commerce với navigation system hoàn chỉnh:

1. **Authentication Flow**: Splash → Login/Register → Main App
2. **Main Navigation**: Bottom nav với Home, Search, Cart, Profile
3. **Product Flow**: Categories → Products → Product Detail → Cart
4. **Checkout Flow**: Cart → Shipping → Payment → Confirmation
5. **Deep Linking**: Product links, category links, order tracking
6. **Conditional Navigation**: Guest vs authenticated users

### Lời giải chi tiết:

#### Bước 1: Navigation Graph Structure

```xml
<!-- File: res/navigation/main_nav_graph.xml -->
<?xml version="1.0" encoding="utf-8"?>
<navigation xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:id="@+id/main_nav_graph"
    app:startDestination="@id/auth_nav_graph">

    <!-- Authentication Module -->
    <include app:graph="@navigation/auth_nav_graph" />
    
    <!-- Shopping Module -->
    <include app:graph="@navigation/shop_nav_graph" />
    
    <!-- Cart & Checkout Module -->
    <include app:graph="@navigation/checkout_nav_graph" />
    
    <!-- Profile Module -->
    <include app:graph="@navigation/profile_nav_graph" />

    <!-- Global Actions -->
    <action
        android:id="@+id/action_global_to_login"
        app:destination="@id/auth_nav_graph"
        app:popUpTo="@id/main_nav_graph"
        app:popUpToInclusive="true" />
        
    <action
        android:id="@+id/action_global_to_search"
        app:destination="@id/searchFragment" />
        
    <action
        android:id="@+id/action_global_to_cart"
        app:destination="@id/checkout_nav_graph" />

    <!-- Global Search Fragment -->
    <fragment
        android:id="@+id/searchFragment"
        android:name="com.example.ecommerce.search.SearchFragment"
        android:label="Search Products">
        
        <action
            android:id="@+id/action_search_to_product"
            app:destination="@id/shop_nav_graph" />
            
    </fragment>

</navigation>

<!-- File: res/navigation/auth_nav_graph.xml -->
<?xml version="1.0" encoding="utf-8"?>
<navigation xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:id="@+id/auth_nav_graph"
    app:startDestination="@id/splashFragment">

    <fragment
        android:id="@+id/splashFragment"
        android:name="com.example.ecommerce.auth.SplashFragment"
        android:label="Splash">
        
        <action
            android:id="@+id/action_splash_to_main"
            app:destination="@id/shop_nav_graph"
            app:popUpTo="@id/auth_nav_graph"
            app:popUpToInclusive="true" />
            
        <action
            android:id="@+id/action_splash_to_onboarding"
            app:destination="@id/onboardingFragment" />
            
    </fragment>

    <fragment
        android:id="@+id/onboardingFragment"
        android:name="com.example.ecommerce.auth.OnboardingFragment"
        android:label="Welcome">
        
        <action
            android:id="@+id/action_onboarding_to_login"
            app:destination="@id/loginFragment" />
            
        <action
            android:id="@+id/action_onboarding_to_register"
            app:destination="@id/registerFragment" />
            
        <action
            android:id="@+id/action_onboarding_to_guest"
            app:destination="@id/shop_nav_graph"
            app:popUpTo="@id/auth_nav_graph"
            app:popUpToInclusive="true" />
            
    </fragment>

    <fragment
        android:id="@+id/loginFragment"
        android:name="com.example.ecommerce.auth.LoginFragment"
        android:label="Login">
        
        <action
            android:id="@+id/action_login_to_register"
            app:destination="@id/registerFragment" />
            
        <action
            android:id="@+id/action_login_to_forgot_password"
            app:destination="@id/forgotPasswordFragment" />
            
        <action
            android:id="@+id/action_login_success"
            app:destination="@id/shop_nav_graph"
            app:popUpTo="@id/auth_nav_graph"
            app:popUpToInclusive="true" />
            
    </fragment>

    <fragment
        android:id="@+id/registerFragment"
        android:name="com.example.ecommerce.auth.RegisterFragment"
        android:label="Create Account">
        
        <action
            android:id="@+id/action_register_to_verification"
            app:destination="@id/verificationFragment" />
            
    </fragment>

    <fragment
        android:id="@+id/verificationFragment"
        android:name="com.example.ecommerce.auth.VerificationFragment"
        android:label="Verify Email">
        
        <argument
            android:name="email"
            app:argType="string" />
            
        <action
            android:id="@+id/action_verification_success"
            app:destination="@id/shop_nav_graph"
            app:popUpTo="@id/auth_nav_graph"
            app:popUpToInclusive="true" />
            
    </fragment>

    <fragment
        android:id="@+id/forgotPasswordFragment"
        android:name="com.example.ecommerce.auth.ForgotPasswordFragment"
        android:label="Forgot Password" />

</navigation>

<!-- File: res/navigation/shop_nav_graph.xml -->
<?xml version="1.0" encoding="utf-8"?>
<navigation xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:id="@+id/shop_nav_graph"
    app:startDestination="@id/homeFragment">

    <fragment
        android:id="@+id/homeFragment"
        android:name="com.example.ecommerce.shop.HomeFragment"
        android:label="Home">
        
        <action
            android:id="@+id/action_home_to_category"
            app:destination="@id/categoryFragment" />
            
        <action
            android:id="@+id/action_home_to_product_detail"
            app:destination="@id/productDetailFragment" />
            
        <!-- Deep link -->
        <deepLink app:uri="ecommerce://home" />
        
    </fragment>

    <fragment
        android:id="@+id/categoryFragment"
        android:name="com.example.ecommerce.shop.CategoryFragment"
        android:label="{category_name}">
        
        <argument
            android:name="category_id"
            app:argType="string" />
            
        <argument
            android:name="category_name"
            app:argType="string"
            android:defaultValue="Category" />
        
        <action
            android:id="@+id/action_category_to_product_detail"
            app:destination="@id/productDetailFragment" />
            
        <action
            android:id="@+id/action_category_to_filter"
            app:destination="@id/filterFragment" />
            
        <!-- Deep link -->
        <deepLink app:uri="ecommerce://category/{category_id}" />
        
    </fragment>

    <fragment
        android:id="@+id/productDetailFragment"
        android:name="com.example.ecommerce.shop.ProductDetailFragment"
        android:label="{product_name}">
        
        <argument
            android:name="product_id"
            app:argType="string" />
            
        <argument
            android:name="product_name"
            app:argType="string"
            android:defaultValue="Product" />
        
        <action
            android:id="@+id/action_product_to_reviews"
            app:destination="@id/reviewsFragment" />
            
        <action
            android:id="@+id/action_product_to_size_guide"
            app:destination="@id/sizeGuideFragment" />
            
        <!-- Deep link -->
        <deepLink app:uri="ecommerce://product/{product_id}" />
        <deepLink app:uri="https://ecommerce.example.com/product/{product_id}" />
        
    </fragment>

    <fragment
        android:id="@+id/filterFragment"
        android:name="com.example.ecommerce.shop.FilterFragment"
        android:label="Filter Products">
        
        <argument
            android:name="category_id"
            app:argType="string" />
            
    </fragment>

    <fragment
        android:id="@+id/reviewsFragment"
        android:name="com.example.ecommerce.shop.ReviewsFragment"
        android:label="Reviews">
        
        <argument
            android:name="product_id"
            app:argType="string" />
            
    </fragment>

    <fragment
        android:id="@+id/sizeGuideFragment"
        android:name="com.example.ecommerce.shop.SizeGuideFragment"
        android:label="Size Guide" />

</navigation>
```

#### Bước 2: MainActivity với Navigation Setup

```kotlin
// File: MainActivity.kt
class MainActivity : AppCompatActivity() {
    
    private lateinit var binding: ActivityMainBinding
    private lateinit var navController: NavController
    private lateinit var appBarConfiguration: AppBarConfiguration
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)
        
        setupNavigation()
        handleDeepLink(intent)
        setupBottomNavigation()
    }
    
    private fun setupNavigation() {
        val navHostFragment = supportFragmentManager
            .findFragmentById(R.id.nav_host_fragment) as NavHostFragment
        navController = navHostFragment.navController
        
        // Top level destinations (don't show back button)
        appBarConfiguration = AppBarConfiguration(
            setOf(
                R.id.homeFragment,
                R.id.searchFragment,
                R.id.cartFragment,
                R.id.profileFragment
            )
        )
        
        setupActionBarWithNavController(navController, appBarConfiguration)
        
        // Listen for navigation changes
        navController.addOnDestinationChangedListener { _, destination, _ ->
            handleDestinationChanged(destination)
        }
    }
    
    private fun setupBottomNavigation() {
        binding.bottomNavigation.setupWithNavController(navController)
        
        // Handle special cart navigation
        binding.bottomNavigation.setOnItemSelectedListener { item ->
            when (item.itemId) {
                R.id.nav_cart -> {
                    handleCartNavigation()
                    false // Don't let default handling occur
                }
                else -> {
                    NavigationUI.onNavDestinationSelected(item, navController)
                }
            }
        }
        
        // Update cart badge
        updateCartBadge()
    }
    
    private fun handleCartNavigation() {
        val authManager = AuthManager.getInstance(this)
        
        if (!authManager.isUserLoggedIn()) {
            // Show login required dialog
            showLoginRequiredDialog("Access Cart") {
                navController.navigate(R.id.action_global_to_login)
            }
        } else {
            navController.navigate(R.id.action_global_to_cart)
        }
    }
    
    private fun handleDestinationChanged(destination: NavDestination) {
        // Show/hide bottom navigation based on destination
        val showBottomNav = when (destination.id) {
            R.id.homeFragment,
            R.id.searchFragment,
            R.id.cartFragment,
            R.id.profileFragment -> true
            else -> false
        }
        
        binding.bottomNavigation.visibility = if (showBottomNav) {
            View.VISIBLE
        } else {
            View.GONE
        }
        
        // Update title
        supportActionBar?.title = when (destination.id) {
            R.id.homeFragment -> "ShopApp"
            R.id.searchFragment -> "Search"
            R.id.cartFragment -> "Shopping Cart"
            R.id.profileFragment -> "Profile"
            else -> destination.label
        }
    }
    
    private fun updateCartBadge() {
        lifecycleScope.launch {
            CartManager.getInstance().cartItemCount.collect { count ->
                val badge = binding.bottomNavigation.getOrCreateBadge(R.id.nav_cart)
                if (count > 0) {
                    badge.number = count
                    badge.isVisible = true
                } else {
                    badge.isVisible = false
                }
            }
        }
    }
    
    private fun showLoginRequiredDialog(feature: String, onLogin: () -> Unit) {
        AlertDialog.Builder(this)
            .setTitle("Login Required")
            .setMessage("Please login to $feature")
            .setPositiveButton("Login") { _, _ -> onLogin() }
            .setNegativeButton("Cancel", null)
            .show()
    }
    
    override fun onNewIntent(intent: Intent?) {
        super.onNewIntent(intent)
        intent?.let { handleDeepLink(it) }
    }
    
    private fun handleDeepLink(intent: Intent) {
        val data = intent.data
        
        if (data != null) {
            when {
                data.pathSegments?.get(0) == "product" -> {
                    val productId = data.pathSegments?.get(1)
                    productId?.let { navigateToProduct(it) }
                }
                data.pathSegments?.get(0) == "category" -> {
                    val categoryId = data.pathSegments?.get(1)
                    categoryId?.let { navigateToCategory(it) }
                }
                data.pathSegments?.get(0) == "order" -> {
                    val orderId = data.pathSegments?.get(1)
                    orderId?.let { navigateToOrderTracking(it) }
                }
            }
        }
    }
    
    private fun navigateToProduct(productId: String) {
        navController.navigate(
            ShopNavGraphDirections.actionGlobalToProductDetail(
                productId = productId,
                productName = "Loading..."
            )
        )
    }
    
    private fun navigateToCategory(categoryId: String) {
        navController.navigate(
            ShopNavGraphDirections.actionGlobalToCategory(
                categoryId = categoryId,
                categoryName = "Loading..."
            )
        )
    }
    
    private fun navigateToOrderTracking(orderId: String) {
        // Navigate to order tracking
        navController.navigate(
            ProfileNavGraphDirections.actionGlobalToOrderTracking(orderId)
        )
    }
    
    override fun onSupportNavigateUp(): Boolean {
        return navController.navigateUp(appBarConfiguration) || super.onSupportNavigateUp()
    }
}
```

#### Bước 3: Authentication Flow Implementation

```kotlin
// File: SplashFragment.kt
class SplashFragment : Fragment() {
    
    private var _binding: FragmentSplashBinding? = null
    private val binding get() = _binding!!
    
    private lateinit var authManager: AuthManager
    private lateinit var preferencesManager: PreferencesManager
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        authManager = AuthManager.getInstance(requireContext())
        preferencesManager = PreferencesManager.getInstance(requireContext())
    }
    
    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentSplashBinding.inflate(inflater, container, false)
        return binding.root
    }
    
    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        
        animateSplashScreen()
        checkAppState()
    }
    
    private fun animateSplashScreen() {
        binding.apply {
            logoImage.apply {
                alpha = 0f
                scaleX = 0.7f
                scaleY = 0.7f
                
                animate()
                    .alpha(1f)
                    .scaleX(1f)
                    .scaleY(1f)
                    .setDuration(1000)
                    .setInterpolator(OvershootInterpolator())
                    .start()
            }
            
            appNameText.apply {
                translationY = 100f
                alpha = 0f
                
                animate()
                    .translationY(0f)
                    .alpha(1f)
                    .setDuration(800)
                    .setStartDelay(300)
                    .start()
            }
        }
    }
    
    private fun checkAppState() {
        lifecycleScope.launch {
            delay(2500) // Minimum splash time
            
            when {
                !preferencesManager.hasSeenOnboarding() -> {
                    navigateToOnboarding()
                }
                authManager.isUserLoggedIn() && authManager.hasValidToken() -> {
                    navigateToMain()
                }
                authManager.isUserLoggedIn() -> {
                    // Try to refresh token
                    val refreshSuccess = authManager.refreshToken()
                    if (refreshSuccess) {
                        navigateToMain()
                    } else {
                        navigateToOnboarding()
                    }
                }
                authManager.isGuestMode() -> {
                    navigateToMain()
                }
                else -> {
                    navigateToOnboarding()
                }
            }
        }
    }
    
    private fun navigateToOnboarding() {
        findNavController().navigate(
            SplashFragmentDirections.actionSplashToOnboarding()
        )
    }
    
    private fun navigateToMain() {
        findNavController().navigate(
            SplashFragmentDirections.actionSplashToMain()
        )
    }
    
    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}

// File: OnboardingFragment.kt
class OnboardingFragment : Fragment() {
    
    private var _binding: FragmentOnboardingBinding? = null
    private val binding get() = _binding!!
    
    private lateinit var preferencesManager: PreferencesManager
    private lateinit var authManager: AuthManager
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        preferencesManager = PreferencesManager.getInstance(requireContext())
        authManager = AuthManager.getInstance(requireContext())
    }
    
    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentOnboardingBinding.inflate(inflater, container, false)
        return binding.root
    }
    
    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        
        setupViewPager()
        setupClickListeners()
        
        // Mark onboarding as seen
        preferencesManager.setHasSeenOnboarding(true)
    }
    
    private fun setupViewPager() {
        val onboardingAdapter = OnboardingPagerAdapter()
        binding.onboardingViewPager.adapter = onboardingAdapter
        
        TabLayoutMediator(binding.indicatorTabLayout, binding.onboardingViewPager) { _, _ -> 
            // Empty - just for indicators
        }.attach()
    }
    
    private fun setupClickListeners() {
        binding.apply {
            loginButton.setOnClickListener {
                navigateToLogin()
            }
            
            registerButton.setOnClickListener {
                navigateToRegister()
            }
            
            continueAsGuestButton.setOnClickListener {
                continueAsGuest()
            }
            
            skipButton.setOnClickListener {
                // Skip to guest mode
                continueAsGuest()
            }
        }
    }
    
    private fun navigateToLogin() {
        findNavController().navigate(
            OnboardingFragmentDirections.actionOnboardingToLogin()
        )
    }
    
    private fun navigateToRegister() {
        findNavController().navigate(
            OnboardingFragmentDirections.actionOnboardingToRegister()
        )
    }
    
    private fun continueAsGuest() {
        authManager.setGuestMode(true)
        findNavController().navigate(
            OnboardingFragmentDirections.actionOnboardingToGuest()
        )
    }
    
    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
```

**Giải thích implementation:**

1. **Modular Navigation**: Nested graphs cho authentication, shopping, checkout
2. **Conditional Flow**: Authentication state determines navigation path
3. **Deep Linking**: Product và category links với proper handling
4. **Guest Mode**: Support cho guest users với limited functionality
5. **Cross-module Navigation**: Safe navigation between different feature modules
6. **Cart Integration**: Dynamic badge updates và authentication checks
7. **State Management**: Proper handling của user authentication state

## 🔑 Những điểm quan trọng cần lưu ý

### 1. Navigation Best Practices
- **Single Activity Architecture** với Navigation Component
- **Use Safe Args** cho type-safe argument passing
- **Proper back stack management** với popUpTo và inclusive flags
- **Handle deep links** gracefully với fallback navigation

### 2. Memory Management
- **Null binding references** trong Fragment onDestroyView
- **Remove observers** khi không cần thiết
- **Cancel ongoing operations** trong Fragment lifecycle
- **Use viewLifecycleOwner** cho LiveData observations

### 3. User Experience
- **Smooth animations** giữa destinations
- **Loading states** cho navigation transitions
- **Error handling** cho navigation failures
- **Proper authentication flows** với conditional navigation

### 4. Architecture Considerations
- **Modular navigation graphs** cho large apps
- **Shared ViewModels** cho cross-fragment communication
- **Navigation state handling** với configuration changes
- **Deep link testing** cho all supported URLs

### 5. Common Mistakes
- Forgetting to handle authentication state changes
- Not testing deep links thoroughly
- Overcomplicating navigation with too many nested graphs
- Memory leaks from retained Fragment references
- Poor back stack management leading to confusing UX

## 📝 Bài tập về nhà

### Bài 1: News App với Multi-level Navigation

Tạo news app với navigation structure phức tạp:

**Features:**
- **Auth Flow**: Login/Register với social media options
- **Main Navigation**: Categories, Bookmarks, Profile với drawer
- **Article Flow**: Category → Articles → Article Detail → Comments
- **Search Flow**: Global search với filters và results
- **Profile Flow**: Settings, Subscription, Reading History

**Technical Requirements:**
- Multiple nested navigation graphs
- Deep linking cho articles và categories
- Conditional navigation based on subscription status
- Cross-module navigation between features
- Proper back stack management cho complex flows

### Bài 2: Banking App với Security-focused Navigation

Tạo banking app với secure navigation patterns:

**Features:**
- **Onboarding**: Multi-step account setup
- **Authentication**: PIN, Biometric, OTP verification
- **Dashboard**: Account overview với quick actions
- **Transactions**: Transfer, Payment, History
- **Security Settings**: PIN change, Device management

**Advanced Requirements:**
- **Session management** với automatic logout
- **Step-by-step flows** với progress tracking
- **Secure navigation** với biometric confirmation
- **Emergency logout** from any screen
- **Navigation logging** cho security audit

---

*Post ID: ncid0bbtupg9d9c*  
*Category: Android*  
*Created: 1/9/2025*  
*Updated: 1/9/2025*
