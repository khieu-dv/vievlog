---
title: "Bài 7: Activity Lifecycle và App Components"
postId: "6y2d7sbaazc5i53"
category: "Android"
created: "1/9/2025"
updated: "1/9/2025"
---

# Bài 7: Activity Lifecycle và App Components


## 🎯 Mục tiêu bài học

Sau khi hoàn thành bài học này, học viên sẽ có thể:

- Hiểu sâu về Activity lifecycle và các trạng thái chuyển đổi
- Nắm vững Fragment lifecycle và lifecycle-aware components
- Quản lý Tasks và Back Stack hiệu quả
- Sử dụng Intent system cho inter-app communication
- Implement các App Components: Services, BroadcastReceivers, ContentProviders
- Tạo background services và foreground services
- Xử lý system events với BroadcastReceivers
- Chia sẻ data giữa apps với ContentProviders

## 📝 Nội dung chi tiết

### 1. Activity Lifecycle Deep Dive

#### 1.1 Activity Lifecycle States

**Khái niệm Activity Lifecycle:**

Activity Lifecycle là series của callback methods mà Android system gọi khi Activity transitions through different states trong lifetime của nó:

**Lifecycle States:**
- **Created**: Activity được tạo và initialized nhưng chưa visible
- **Started**: Activity visible cho user nhưng chưa interactive
- **Resumed**: Activity visible và interactive với user
- **Paused**: Activity partially obscured, có thể vẫn visible
- **Stopped**: Activity không visible cho user
- **Destroyed**: Activity bị removed khỏi memory

**Lifecycle Callbacks:**
- **onCreate()**: Initialize activity, setup UI, create objects
- **onStart()**: Activity becomes visible, prepare for user interaction
- **onResume()**: Activity interactive, register listeners, start animations
- **onPause()**: Prepare for losing focus, save critical data
- **onStop()**: Activity no longer visible, stop expensive operations
- **onRestart()**: Activity returning from stopped state
- **onDestroy()**: Final cleanup, release resources

**State Management:**
- **Configuration Changes**: Handle screen rotation, keyboard changes
- **Memory Management**: Release resources when not needed
- **Data Persistence**: Save user data across lifecycle changes

```kotlin
class MainActivity : AppCompatActivity() {
    
    private lateinit var binding: ActivityMainBinding
    private var startTime: Long = 0
    private lateinit var locationManager: LocationManager
    private var sensorManager: SensorManager? = null
    private var accelerometer: Sensor? = null
    
    companion object {
        private const val TAG = "MainActivity"
        private const val KEY_COUNTER = "counter"
        private const val KEY_USER_INPUT = "user_input"
    }
    
    private var counter = 0
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)
        
        Log.d(TAG, "onCreate() - Activity được tạo")
        
        // Initialize UI components
        setupUI()
        
        // Restore saved state
        savedInstanceState?.let { bundle ->
            counter = bundle.getInt(KEY_COUNTER, 0)
            val userInput = bundle.getString(KEY_USER_INPUT, "")
            binding.editTextInput.setText(userInput)
            updateCounterDisplay()
            Log.d(TAG, "onCreate() - Restored state: counter=$counter")
        }
        
        // Initialize system services
        initializeServices()
        
        startTime = System.currentTimeMillis()
    }
    
    override fun onStart() {
        super.onStart()
        Log.d(TAG, "onStart() - Activity trở nên visible")
        
        // Activity visible, start preparing for interaction
        startLocationUpdates()
        registerSensorListener()
    }
    
    override fun onResume() {
        super.onResume()
        Log.d(TAG, "onResume() - Activity interactive với user")
        
        // Activity interactive, start intensive operations
        startRealtimeUpdates()
        binding.statusText.text = "App is active"
        
        // Update UI với current data
        updateUI()
    }
    
    override fun onPause() {
        super.onPause()
        Log.d(TAG, "onPause() - Activity mất focus")
        
        // Save critical data trước khi lose focus
        saveUserProgress()
        pauseRealtimeUpdates()
        binding.statusText.text = "App is paused"
    }
    
    override fun onStop() {
        super.onStop()
        Log.d(TAG, "onStop() - Activity không còn visible")
        
        // Stop expensive operations
        stopLocationUpdates()
        unregisterSensorListener()
        
        // Save current session data
        saveSessionData()
        
        val sessionDuration = System.currentTimeMillis() - startTime
        Log.d(TAG, "onStop() - Session duration: ${sessionDuration}ms")
    }
    
    override fun onRestart() {
        super.onRestart()
        Log.d(TAG, "onRestart() - Activity returning từ stopped state")
        
        // Prepare activity để return to foreground
        refreshData()
        startTime = System.currentTimeMillis() // Reset session timer
    }
    
    override fun onDestroy() {
        super.onDestroy()
        Log.d(TAG, "onDestroy() - Activity đang bị destroyed")
        
        // Final cleanup
        cleanupResources()
        
        // Check if finishing by user choice or system
        if (isFinishing) {
            Log.d(TAG, "onDestroy() - User finished activity")
            clearUserSession()
        } else {
            Log.d(TAG, "onDestroy() - System destroyed activity (config change)")
        }
    }
    
    // Save instance state cho configuration changes
    override fun onSaveInstanceState(outState: Bundle) {
        super.onSaveInstanceState(outState)
        Log.d(TAG, "onSaveInstanceState() - Saving state")
        
        outState.putInt(KEY_COUNTER, counter)
        outState.putString(KEY_USER_INPUT, binding.editTextInput.text.toString())
    }
    
    // Handle configuration changes
    override fun onConfigurationChanged(newConfig: Configuration) {
        super.onConfigurationChanged(newConfig)
        Log.d(TAG, "onConfigurationChanged() - ${newConfig.orientation}")
        
        // Handle orientation change manually if needed
        updateLayoutForOrientation(newConfig.orientation)
    }
    
    private fun setupUI() {
        binding.incrementButton.setOnClickListener {
            counter++
            updateCounterDisplay()
        }
        
        binding.decrementButton.setOnClickListener {
            counter--
            updateCounterDisplay()
        }
        
        updateCounterDisplay()
    }
    
    private fun updateCounterDisplay() {
        binding.counterText.text = "Counter: $counter"
    }
    
    private fun initializeServices() {
        locationManager = getSystemService(Context.LOCATION_SERVICE) as LocationManager
        sensorManager = getSystemService(Context.SENSOR_SERVICE) as SensorManager
        accelerometer = sensorManager?.getDefaultSensor(Sensor.TYPE_ACCELEROMETER)
    }
    
    private fun startLocationUpdates() {
        Log.d(TAG, "Starting location updates")
        // Location update implementation
    }
    
    private fun stopLocationUpdates() {
        Log.d(TAG, "Stopping location updates")
        // Stop location updates implementation
    }
    
    private fun registerSensorListener() {
        accelerometer?.let { sensor ->
            sensorManager?.registerListener(
                sensorEventListener,
                sensor,
                SensorManager.SENSOR_DELAY_NORMAL
            )
            Log.d(TAG, "Sensor listener registered")
        }
    }
    
    private fun unregisterSensorListener() {
        sensorManager?.unregisterListener(sensorEventListener)
        Log.d(TAG, "Sensor listener unregistered")
    }
    
    private val sensorEventListener = object : SensorEventListener {
        override fun onSensorChanged(event: SensorEvent?) {
            // Handle sensor data
        }
        
        override fun onAccuracyChanged(sensor: Sensor?, accuracy: Int) {
            // Handle accuracy changes
        }
    }
    
    private fun startRealtimeUpdates() {
        Log.d(TAG, "Starting realtime updates")
        // Start realtime operations
    }
    
    private fun pauseRealtimeUpdates() {
        Log.d(TAG, "Pausing realtime updates")
        // Pause realtime operations
    }
    
    private fun updateUI() {
        // Update UI với fresh data
        val currentTime = SimpleDateFormat("HH:mm:ss", Locale.getDefault())
            .format(Date())
        binding.timestampText.text = "Last updated: $currentTime"
    }
    
    private fun saveUserProgress() {
        // Save critical user data
        val sharedPrefs = getSharedPreferences("user_progress", Context.MODE_PRIVATE)
        sharedPrefs.edit()
            .putInt("counter_value", counter)
            .putLong("last_save_time", System.currentTimeMillis())
            .apply()
        Log.d(TAG, "User progress saved")
    }
    
    private fun saveSessionData() {
        // Save session information
        val sessionDuration = System.currentTimeMillis() - startTime
        val sharedPrefs = getSharedPreferences("session_data", Context.MODE_PRIVATE)
        sharedPrefs.edit()
            .putLong("session_duration", sessionDuration)
            .putLong("session_end_time", System.currentTimeMillis())
            .apply()
        Log.d(TAG, "Session data saved: ${sessionDuration}ms")
    }
    
    private fun refreshData() {
        Log.d(TAG, "Refreshing data after restart")
        // Refresh data khi activity returns
    }
    
    private fun updateLayoutForOrientation(orientation: Int) {
        when (orientation) {
            Configuration.ORIENTATION_LANDSCAPE -> {
                Log.d(TAG, "Switched to landscape orientation")
                // Handle landscape layout changes
            }
            Configuration.ORIENTATION_PORTRAIT -> {
                Log.d(TAG, "Switched to portrait orientation")
                // Handle portrait layout changes
            }
        }
    }
    
    private fun cleanupResources() {
        // Cleanup resources
        unregisterSensorListener()
        stopLocationUpdates()
        Log.d(TAG, "Resources cleaned up")
    }
    
    private fun clearUserSession() {
        // Clear user session data khi user finishes activity
        val sharedPrefs = getSharedPreferences("user_progress", Context.MODE_PRIVATE)
        sharedPrefs.edit().clear().apply()
        Log.d(TAG, "User session cleared")
    }
}
```

#### 1.2 Lifecycle-Aware Components

**Khái niệm Lifecycle-Aware Components:**

Lifecycle-Aware Components tự động respond to lifecycle state changes của activities và fragments:

**Key Components:**
- **LifecycleOwner**: Interface implemented by Activities/Fragments
- **LifecycleObserver**: Objects that observe lifecycle changes  
- **Lifecycle**: Class that holds lifecycle state information
- **LiveData**: Lifecycle-aware observable data holder

**Benefits:**
- **Automatic Management**: Components tự cleanup khi lifecycle ends
- **Memory Leak Prevention**: Avoid holding references to destroyed components
- **Resource Optimization**: Only run operations when component is active
- **Code Organization**: Separate concerns into reusable components

```kotlin
// Lifecycle-aware component for location tracking
class LocationTracker(private val context: Context) : LifecycleObserver {
    
    private var locationManager: LocationManager? = null
    private var locationListener: LocationListener? = null
    private var isTracking = false
    
    companion object {
        private const val TAG = "LocationTracker"
        private const val LOCATION_PERMISSION = Manifest.permission.ACCESS_FINE_LOCATION
    }
    
    @OnLifecycleEvent(Lifecycle.Event.ON_START)
    fun startTracking() {
        Log.d(TAG, "Starting location tracking")
        
        if (ContextCompat.checkSelfPermission(context, LOCATION_PERMISSION) == 
            PackageManager.PERMISSION_GRANTED) {
            startLocationUpdates()
        } else {
            Log.w(TAG, "Location permission not granted")
        }
    }
    
    @OnLifecycleEvent(Lifecycle.Event.ON_STOP)
    fun stopTracking() {
        Log.d(TAG, "Stopping location tracking")
        stopLocationUpdates()
    }
    
    @OnLifecycleEvent(Lifecycle.Event.ON_DESTROY)
    fun cleanup() {
        Log.d(TAG, "Cleaning up location tracker")
        locationManager = null
        locationListener = null
    }
    
    private fun startLocationUpdates() {
        if (isTracking) return
        
        locationManager = context.getSystemService(Context.LOCATION_SERVICE) as LocationManager
        locationListener = object : LocationListener {
            override fun onLocationChanged(location: Location) {
                handleLocationUpdate(location)
            }
            
            override fun onProviderEnabled(provider: String) {
                Log.d(TAG, "Location provider enabled: $provider")
            }
            
            override fun onProviderDisabled(provider: String) {
                Log.d(TAG, "Location provider disabled: $provider")
            }
        }
        
        try {
            locationManager?.requestLocationUpdates(
                LocationManager.GPS_PROVIDER,
                5000L, // 5 seconds
                10f,   // 10 meters
                locationListener!!
            )
            isTracking = true
            Log.d(TAG, "Location updates started")
        } catch (e: SecurityException) {
            Log.e(TAG, "Security exception: ${e.message}")
        }
    }
    
    private fun stopLocationUpdates() {
        locationListener?.let { listener ->
            locationManager?.removeUpdates(listener)
            isTracking = false
            Log.d(TAG, "Location updates stopped")
        }
    }
    
    private fun handleLocationUpdate(location: Location) {
        Log.d(TAG, "Location update: ${location.latitude}, ${location.longitude}")
        // Process location update
    }
}

// Lifecycle-aware component for network monitoring
class NetworkMonitor(private val context: Context) : LifecycleObserver {
    
    private var connectivityManager: ConnectivityManager? = null
    private var networkCallback: ConnectivityManager.NetworkCallback? = null
    private val networkStatusLiveData = MutableLiveData<NetworkStatus>()
    
    companion object {
        private const val TAG = "NetworkMonitor"
    }
    
    enum class NetworkStatus {
        AVAILABLE, LOST, UNAVAILABLE
    }
    
    fun getNetworkStatus(): LiveData<NetworkStatus> = networkStatusLiveData
    
    @OnLifecycleEvent(Lifecycle.Event.ON_CREATE)
    fun initialize() {
        Log.d(TAG, "Initializing network monitor")
        connectivityManager = context.getSystemService(Context.CONNECTIVITY_SERVICE) as ConnectivityManager
        setupNetworkCallback()
    }
    
    @OnLifecycleEvent(Lifecycle.Event.ON_START)
    fun startMonitoring() {
        Log.d(TAG, "Starting network monitoring")
        registerNetworkCallback()
    }
    
    @OnLifecycleEvent(Lifecycle.Event.ON_STOP)
    fun stopMonitoring() {
        Log.d(TAG, "Stopping network monitoring")
        unregisterNetworkCallback()
    }
    
    @OnLifecycleEvent(Lifecycle.Event.ON_DESTROY)
    fun cleanup() {
        Log.d(TAG, "Cleaning up network monitor")
        connectivityManager = null
        networkCallback = null
    }
    
    private fun setupNetworkCallback() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
            networkCallback = object : ConnectivityManager.NetworkCallback() {
                override fun onAvailable(network: Network) {
                    Log.d(TAG, "Network available")
                    networkStatusLiveData.postValue(NetworkStatus.AVAILABLE)
                }
                
                override fun onLost(network: Network) {
                    Log.d(TAG, "Network lost")
                    networkStatusLiveData.postValue(NetworkStatus.LOST)
                }
                
                override fun onUnavailable() {
                    Log.d(TAG, "Network unavailable")
                    networkStatusLiveData.postValue(NetworkStatus.UNAVAILABLE)
                }
            }
        }
    }
    
    private fun registerNetworkCallback() {
        networkCallback?.let { callback ->
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
                connectivityManager?.registerDefaultNetworkCallback(callback)
            } else {
                val request = NetworkRequest.Builder()
                    .addCapability(NetworkCapabilities.NET_CAPABILITY_INTERNET)
                    .build()
                connectivityManager?.registerNetworkCallback(request, callback)
            }
        }
    }
    
    private fun unregisterNetworkCallback() {
        networkCallback?.let { callback ->
            connectivityManager?.unregisterNetworkCallback(callback)
        }
    }
}

// Usage trong Activity
class LifecycleAwareActivity : AppCompatActivity() {
    
    private lateinit var binding: ActivityLifecycleAwareBinding
    private lateinit var locationTracker: LocationTracker
    private lateinit var networkMonitor: NetworkMonitor
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityLifecycleAwareBinding.inflate(layoutInflater)
        setContentView(binding.root)
        
        // Initialize lifecycle-aware components
        setupLifecycleObservers()
        observeNetworkStatus()
    }
    
    private fun setupLifecycleObservers() {
        locationTracker = LocationTracker(this)
        networkMonitor = NetworkMonitor(this)
        
        // Register observers với lifecycle
        lifecycle.addObserver(locationTracker)
        lifecycle.addObserver(networkMonitor)
    }
    
    private fun observeNetworkStatus() {
        networkMonitor.getNetworkStatus().observe(this) { status ->
            when (status) {
                NetworkMonitor.NetworkStatus.AVAILABLE -> {
                    binding.networkStatusText.text = "Network Available"
                    binding.networkStatusText.setTextColor(Color.GREEN)
                }
                NetworkMonitor.NetworkStatus.LOST -> {
                    binding.networkStatusText.text = "Network Lost"
                    binding.networkStatusText.setTextColor(Color.RED)
                }
                NetworkMonitor.NetworkStatus.UNAVAILABLE -> {
                    binding.networkStatusText.text = "Network Unavailable"
                    binding.networkStatusText.setTextColor(Color.GRAY)
                }
            }
        }
    }
}
```

### 2. Tasks và Back Stack Management

#### 2.1 Understanding Tasks và Back Stack

**Khái niệm Tasks và Back Stack:**

Tasks là collection của activities mà users interact with khi performing a particular job:

**Task Components:**
- **Task**: Logical grouping of related activities
- **Back Stack**: LIFO stack of activities trong task
- **Root Activity**: First activity trong task (usually launcher activity)
- **Task Affinity**: Preferred task cho activities

**Launch Modes:**
- **standard**: Create new instance mỗi lần launch
- **singleTop**: Reuse instance if on top of stack
- **singleTask**: Single instance trong task, clear above activities
- **singleInstance**: Single instance globally across all tasks

**Intent Flags:**
- **FLAG_ACTIVITY_NEW_TASK**: Start activity trong new task
- **FLAG_ACTIVITY_CLEAR_TOP**: Clear activities above target activity
- **FLAG_ACTIVITY_SINGLE_TOP**: Similar to singleTop launch mode
- **FLAG_ACTIVITY_NO_HISTORY**: Don't add to back stack

```kotlin
class TaskManagementActivity : AppCompatActivity() {
    
    private lateinit var binding: ActivityTaskManagementBinding
    
    companion object {
        private const val TAG = "TaskManagement"
    }
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityTaskManagementBinding.inflate(layoutInflater)
        setContentView(binding.root)
        
        setupTaskDemonstrations()
        displayTaskInfo()
    }
    
    private fun setupTaskDemonstrations() {
        // Standard launch mode
        binding.standardLaunchButton.setOnClickListener {
            val intent = Intent(this, StandardActivity::class.java)
            startActivity(intent)
            Log.d(TAG, "Started StandardActivity - standard launch mode")
        }
        
        // SingleTop launch mode
        binding.singleTopLaunchButton.setOnClickListener {
            val intent = Intent(this, SingleTopActivity::class.java)
            startActivity(intent)
            Log.d(TAG, "Started SingleTopActivity - singleTop launch mode")
        }
        
        // SingleTask launch mode
        binding.singleTaskLaunchButton.setOnClickListener {
            val intent = Intent(this, SingleTaskActivity::class.java)
            startActivity(intent)
            Log.d(TAG, "Started SingleTaskActivity - singleTask launch mode")
        }
        
        // New Task với Clear Top
        binding.newTaskButton.setOnClickListener {
            val intent = Intent(this, MainActivity::class.java)
            intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
            startActivity(intent)
            Log.d(TAG, "Started MainActivity trong new task với clear top")
        }
        
        // Clear Task và Start New
        binding.clearTaskButton.setOnClickListener {
            val intent = Intent(this, MainActivity::class.java)
            intent.flags = Intent.FLAG_ACTIVITY_CLEAR_TASK or Intent.FLAG_ACTIVITY_NEW_TASK
            startActivity(intent)
            finish()
            Log.d(TAG, "Cleared task và started MainActivity")
        }
        
        // No History
        binding.noHistoryButton.setOnClickListener {
            val intent = Intent(this, NoHistoryActivity::class.java)
            intent.flags = Intent.FLAG_ACTIVITY_NO_HISTORY
            startActivity(intent)
            Log.d(TAG, "Started NoHistoryActivity - won't be added to back stack")
        }
    }
    
    private fun displayTaskInfo() {
        val taskInfo = StringBuilder()
        
        // Task ID
        taskInfo.append("Task ID: ${taskId}\n")
        
        // Activity Info
        taskInfo.append("Activity: ${localClassName}\n")
        
        // Launch Mode
        val launchMode = when (packageManager.getActivityInfo(componentName, 0).launchMode) {
            ActivityInfo.LAUNCH_MULTIPLE -> "standard"
            ActivityInfo.LAUNCH_SINGLE_TOP -> "singleTop"
            ActivityInfo.LAUNCH_SINGLE_TASK -> "singleTask"
            ActivityInfo.LAUNCH_SINGLE_INSTANCE -> "singleInstance"
            else -> "unknown"
        }
        taskInfo.append("Launch Mode: $launchMode\n")
        
        // Task Affinity
        val taskAffinity = packageManager.getActivityInfo(componentName, 0).taskAffinity
        taskInfo.append("Task Affinity: $taskAffinity\n")
        
        // Is Task Root
        taskInfo.append("Is Task Root: ${isTaskRoot}\n")
        
        binding.taskInfoText.text = taskInfo.toString()
    }
    
    override fun onNewIntent(intent: Intent?) {
        super.onNewIntent(intent)
        Log.d(TAG, "onNewIntent called - activity reused")
        setIntent(intent)
        
        // Handle new intent data
        intent?.let { 
            handleNewIntentData(it)
        }
    }
    
    private fun handleNewIntentData(intent: Intent) {
        val data = intent.getStringExtra("extra_data")
        data?.let { 
            binding.newIntentDataText.text = "New Intent Data: $it"
            binding.newIntentDataText.visibility = View.VISIBLE
        }
    }
    
    // Custom back stack management
    override fun onBackPressed() {
        val fragmentManager = supportFragmentManager
        
        if (fragmentManager.backStackEntryCount > 0) {
            // Handle fragment back stack
            fragmentManager.popBackStack()
            Log.d(TAG, "Popped fragment from back stack")
        } else {
            // Handle activity back stack
            if (shouldExitApp()) {
                super.onBackPressed()
            } else {
                navigateToHome()
            }
        }
    }
    
    private fun shouldExitApp(): Boolean {
        // Logic để determine if should exit app
        return isTaskRoot
    }
    
    private fun navigateToHome() {
        val intent = Intent(this, MainActivity::class.java)
        intent.flags = Intent.FLAG_ACTIVITY_CLEAR_TOP or Intent.FLAG_ACTIVITY_SINGLE_TOP
        startActivity(intent)
        finish()
    }
}

// Activity với different launch modes
@ActivityInfo(launchMode = ActivityInfo.LAUNCH_SINGLE_TOP)
class SingleTopActivity : AppCompatActivity() {
    
    private var instanceCount = 0
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        instanceCount++
        Log.d("SingleTopActivity", "onCreate - Instance #$instanceCount")
        
        val textView = TextView(this)
        textView.text = "SingleTop Activity\nInstance: $instanceCount\nTask ID: $taskId"
        textView.gravity = Gravity.CENTER
        textView.textSize = 18f
        setContentView(textView)
    }
    
    override fun onNewIntent(intent: Intent?) {
        super.onNewIntent(intent)
        Log.d("SingleTopActivity", "onNewIntent called - reused existing instance")
        
        // Update UI để show reuse
        val textView = findViewById<TextView>(android.R.id.content)
        textView?.text = "SingleTop Activity (REUSED)\nInstance: $instanceCount\nTask ID: $taskId"
    }
}

@ActivityInfo(launchMode = ActivityInfo.LAUNCH_SINGLE_TASK)
class SingleTaskActivity : AppCompatActivity() {
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        Log.d("SingleTaskActivity", "onCreate - Single instance in task")
        
        val textView = TextView(this)
        textView.text = "SingleTask Activity\nTask ID: $taskId\nIs Task Root: $isTaskRoot"
        textView.gravity = Gravity.CENTER
        textView.textSize = 18f
        setContentView(textView)
    }
    
    override fun onNewIntent(intent: Intent?) {
        super.onNewIntent(intent)
        Log.d("SingleTaskActivity", "onNewIntent - cleared activities above")
    }
}
```

### 3. Intent System và Inter-App Communication

#### 3.1 Intent Types và Usage

**Khái niệm Intent System:**

Intent là messaging object dùng để request action từ another app component:

**Intent Types:**
- **Explicit Intent**: Specify exact component to start
- **Implicit Intent**: Declare general action, let system choose component
- **Pending Intent**: Token giving foreign application permission to use your app's identity

**Intent Components:**
- **Action**: Action to be performed (VIEW, EDIT, SEND)
- **Data**: URI và MIME type of data
- **Category**: Additional information about action
- **Extras**: Key-value pairs of additional information
- **Component**: Explicit component name
- **Flags**: Control how intent should be handled

**Common Actions:**
- **ACTION_VIEW**: Display data to user
- **ACTION_EDIT**: Edit data
- **ACTION_SEND**: Share data với another app
- **ACTION_CALL**: Initiate phone call
- **ACTION_PICK**: Pick item từ data

```kotlin
class IntentDemoActivity : AppCompatActivity() {
    
    private lateinit var binding: ActivityIntentDemoBinding
    
    companion object {
        private const val TAG = "IntentDemo"
        private const val REQUEST_IMAGE_PICK = 100
        private const val REQUEST_CONTACT_PICK = 101
        private const val REQUEST_CUSTOM_RESULT = 102
    }
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityIntentDemoBinding.inflate(layoutInflater)
        setContentView(binding.root)
        
        setupExplicitIntents()
        setupImplicitIntents()
        setupIntentForResult()
        setupIntentSharing()
        handleIncomingIntent()
    }
    
    private fun setupExplicitIntents() {
        // Explicit Intent - specify exact component
        binding.explicitIntentButton.setOnClickListener {
            val intent = Intent(this, TargetActivity::class.java)
            intent.putExtra("message", "Hello from explicit intent!")
            intent.putExtra("timestamp", System.currentTimeMillis())
            intent.putExtra("user_data", UserData("John Doe", 25, "john@example.com"))
            
            startActivity(intent)
            Log.d(TAG, "Started TargetActivity with explicit intent")
        }
        
        // Explicit Intent với custom flags
        binding.explicitFlagsButton.setOnClickListener {
            val intent = Intent(this, TargetActivity::class.java)
            intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
            intent.putExtra("message", "Intent with custom flags")
            
            startActivity(intent)
            Log.d(TAG, "Started TargetActivity with custom flags")
        }
    }
    
    private fun setupImplicitIntents() {
        // View URL
        binding.viewUrlButton.setOnClickListener {
            val intent = Intent(Intent.ACTION_VIEW)
            intent.data = Uri.parse("https://developer.android.com")
            
            if (intent.resolveActivity(packageManager) != null) {
                startActivity(intent)
                Log.d(TAG, "Opening URL with implicit intent")
            } else {
                showToast("No app can handle this intent")
            }
        }
        
        // Send Email
        binding.sendEmailButton.setOnClickListener {
            val intent = Intent(Intent.ACTION_SENDTO)
            intent.data = Uri.parse("mailto:")
            intent.putExtra(Intent.EXTRA_EMAIL, arrayOf("recipient@example.com"))
            intent.putExtra(Intent.EXTRA_SUBJECT, "Subject from Android App")
            intent.putExtra(Intent.EXTRA_TEXT, "Email content sent from my Android app")
            
            if (intent.resolveActivity(packageManager) != null) {
                startActivity(intent)
                Log.d(TAG, "Opening email app")
            } else {
                showToast("No email app found")
            }
        }
        
        // Make Phone Call
        binding.makeCallButton.setOnClickListener {
            val intent = Intent(Intent.ACTION_DIAL)
            intent.data = Uri.parse("tel:+1234567890")
            
            startActivity(intent)
            Log.d(TAG, "Opening phone dialer")
        }
        
        // Open Maps
        binding.openMapsButton.setOnClickListener {
            val intent = Intent(Intent.ACTION_VIEW)
            intent.data = Uri.parse("geo:37.7749,-122.4194?q=San Francisco")
            
            if (intent.resolveActivity(packageManager) != null) {
                startActivity(intent)
                Log.d(TAG, "Opening maps")
            } else {
                showToast("No maps app found")
            }
        }
        
        // Take Photo
        binding.takePhotoButton.setOnClickListener {
            val intent = Intent(MediaStore.ACTION_IMAGE_CAPTURE)
            
            if (intent.resolveActivity(packageManager) != null) {
                startActivity(intent)
                Log.d(TAG, "Opening camera")
            } else {
                showToast("No camera app found")
            }
        }
    }
    
    private fun setupIntentForResult() {
        // Pick Image
        binding.pickImageButton.setOnClickListener {
            val intent = Intent(Intent.ACTION_PICK)
            intent.type = "image/*"
            
            if (intent.resolveActivity(packageManager) != null) {
                startActivityForResult(intent, REQUEST_IMAGE_PICK)
                Log.d(TAG, "Picking image")
            } else {
                showToast("No gallery app found")
            }
        }
        
        // Pick Contact
        binding.pickContactButton.setOnClickListener {
            val intent = Intent(Intent.ACTION_PICK)
            intent.type = ContactsContract.Contacts.CONTENT_TYPE
            
            if (intent.resolveActivity(packageManager) != null) {
                startActivityForResult(intent, REQUEST_CONTACT_PICK)
                Log.d(TAG, "Picking contact")
            } else {
                showToast("No contacts app found")
            }
        }
        
        // Custom Activity với Result
        binding.customResultButton.setOnClickListener {
            val intent = Intent(this, CustomResultActivity::class.java)
            intent.putExtra("question", "What is your favorite color?")
            
            startActivityForResult(intent, REQUEST_CUSTOM_RESULT)
            Log.d(TAG, "Started custom activity for result")
        }
    }
    
    private fun setupIntentSharing() {
        // Share Text
        binding.shareTextButton.setOnClickListener {
            val intent = Intent(Intent.ACTION_SEND)
            intent.type = "text/plain"
            intent.putExtra(Intent.EXTRA_SUBJECT, "Shared from My App")
            intent.putExtra(Intent.EXTRA_TEXT, "Check out this amazing Android app!")
            
            val chooser = Intent.createChooser(intent, "Share via")
            startActivity(chooser)
            Log.d(TAG, "Sharing text content")
        }
        
        // Share Image
        binding.shareImageButton.setOnClickListener {
            // Create sample image URI (in real app, use actual image)
            val imageUri = createSampleImageUri()
            
            val intent = Intent(Intent.ACTION_SEND)
            intent.type = "image/*"
            intent.putExtra(Intent.EXTRA_STREAM, imageUri)
            intent.putExtra(Intent.EXTRA_TEXT, "Sharing image from my app")
            intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
            
            val chooser = Intent.createChooser(intent, "Share image via")
            startActivity(chooser)
            Log.d(TAG, "Sharing image")
        }
        
        // Share Multiple Items
        binding.shareMultipleButton.setOnClickListener {
            val imageUris = arrayListOf<Uri>()
            // Add multiple image URIs
            imageUris.add(createSampleImageUri())
            imageUris.add(createSampleImageUri())
            
            val intent = Intent(Intent.ACTION_SEND_MULTIPLE)
            intent.type = "image/*"
            intent.putParcelableArrayListExtra(Intent.EXTRA_STREAM, imageUris)
            intent.putExtra(Intent.EXTRA_TEXT, "Multiple images from my app")
            intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION)
            
            val chooser = Intent.createChooser(intent, "Share multiple images")
            startActivity(chooser)
            Log.d(TAG, "Sharing multiple images")
        }
    }
    
    private fun handleIncomingIntent() {
        // Handle intent data when activity is started by external app
        intent?.let { incomingIntent ->
            when (incomingIntent.action) {
                Intent.ACTION_SEND -> {
                    if (incomingIntent.type?.startsWith("text/") == true) {
                        val sharedText = incomingIntent.getStringExtra(Intent.EXTRA_TEXT)
                        handleSharedText(sharedText)
                    } else if (incomingIntent.type?.startsWith("image/") == true) {
                        val imageUri = incomingIntent.getParcelableExtra<Uri>(Intent.EXTRA_STREAM)
                        handleSharedImage(imageUri)
                    }
                }
                Intent.ACTION_VIEW -> {
                    val data = incomingIntent.data
                    handleViewAction(data)
                }
            }
        }
    }
    
    private fun handleSharedText(text: String?) {
        text?.let {
            binding.sharedContentText.text = "Received shared text: $it"
            binding.sharedContentText.visibility = View.VISIBLE
            Log.d(TAG, "Handled shared text: $it")
        }
    }
    
    private fun handleSharedImage(uri: Uri?) {
        uri?.let {
            binding.sharedContentText.text = "Received shared image: $it"
            binding.sharedContentText.visibility = View.VISIBLE
            // Load and display image
            Glide.with(this)
                .load(it)
                .into(binding.sharedImageView)
            binding.sharedImageView.visibility = View.VISIBLE
            Log.d(TAG, "Handled shared image: $it")
        }
    }
    
    private fun handleViewAction(data: Uri?) {
        data?.let {
            binding.sharedContentText.text = "Opened with URI: $it"
            binding.sharedContentText.visibility = View.VISIBLE
            Log.d(TAG, "Handled view action: $it")
        }
    }
    
    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)
        
        when (requestCode) {
            REQUEST_IMAGE_PICK -> {
                if (resultCode == RESULT_OK && data != null) {
                    val imageUri = data.data
                    binding.resultText.text = "Selected image: $imageUri"
                    
                    // Display selected image
                    imageUri?.let { uri ->
                        Glide.with(this)
                            .load(uri)
                            .into(binding.selectedImageView)
                        binding.selectedImageView.visibility = View.VISIBLE
                    }
                    Log.d(TAG, "Image picked: $imageUri")
                }
            }
            
            REQUEST_CONTACT_PICK -> {
                if (resultCode == RESULT_OK && data != null) {
                    val contactUri = data.data
                    val contactName = getContactName(contactUri)
                    binding.resultText.text = "Selected contact: $contactName"
                    Log.d(TAG, "Contact picked: $contactName")
                }
            }
            
            REQUEST_CUSTOM_RESULT -> {
                if (resultCode == RESULT_OK && data != null) {
                    val answer = data.getStringExtra("answer")
                    binding.resultText.text = "Answer: $answer"
                    Log.d(TAG, "Custom result: $answer")
                }
            }
        }
    }
    
    private fun getContactName(contactUri: Uri?): String {
        contactUri?.let { uri ->
            val cursor = contentResolver.query(
                uri,
                arrayOf(ContactsContract.Contacts.DISPLAY_NAME),
                null,
                null,
                null
            )
            
            cursor?.use { 
                if (it.moveToFirst()) {
                    return it.getString(0)
                }
            }
        }
        return "Unknown"
    }
    
    private fun createSampleImageUri(): Uri {
        // In real app, this would be an actual image file URI
        return Uri.parse("content://com.example.provider/images/sample.jpg")
    }
    
    private fun showToast(message: String) {
        Toast.makeText(this, message, Toast.LENGTH_SHORT).show()
    }
}

// Data class for intent extras
@Parcelize
data class UserData(
    val name: String,
    val age: Int,
    val email: String
) : Parcelable

// Target Activity for explicit intents
class TargetActivity : AppCompatActivity() {
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        val message = intent.getStringExtra("message") ?: "No message"
        val timestamp = intent.getLongExtra("timestamp", 0)
        val userData = intent.getParcelableExtra<UserData>("user_data")
        
        val textView = TextView(this)
        val content = buildString {
            append("Target Activity\n\n")
            append("Message: $message\n")
            append("Timestamp: ${Date(timestamp)}\n")
            userData?.let { user ->
                append("User: ${user.name}\n")
                append("Age: ${user.age}\n")
                append("Email: ${user.email}\n")
            }
        }
        
        textView.text = content
        textView.gravity = Gravity.CENTER
        textView.textSize = 16f
        textView.setPadding(32, 32, 32, 32)
        setContentView(textView)
        
        Log.d("TargetActivity", "Created with data: $content")
    }
}

// Custom Activity that returns result
class CustomResultActivity : AppCompatActivity() {
    
    private lateinit var binding: ActivityCustomResultBinding
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityCustomResultBinding.inflate(layoutInflater)
        setContentView(binding.root)
        
        val question = intent.getStringExtra("question") ?: "No question"
        binding.questionText.text = question
        
        binding.submitButton.setOnClickListener {
            val answer = binding.answerEditText.text.toString()
            
            val resultIntent = Intent()
            resultIntent.putExtra("answer", answer)
            resultIntent.putExtra("timestamp", System.currentTimeMillis())
            
            setResult(RESULT_OK, resultIntent)
            finish()
        }
        
        binding.cancelButton.setOnClickListener {
            setResult(RESULT_CANCELED)
            finish()
        }
    }
}
```

### 4. Services Implementation

#### 4.1 Service Types và Implementation

**Khái niệm Services:**

Services là app components chạy operations trong background mà không cần user interface:

**Service Types:**
- **Started Service**: Chạy operation trong background, không return result to caller
- **Bound Service**: Provides client-server interface, clients có thể bind và interact
- **Foreground Service**: Performs operations noticeable to user, shows notification
- **Background Service**: Performs operations not noticeable to user (restricted on newer Android)

**Service Lifecycle:**
- **onCreate()**: Service được tạo lần đầu
- **onStartCommand()**: Service started với startService()
- **onBind()**: Client binds to service với bindService()
- **onUnbind()**: All clients unbind từ service
- **onDestroy()**: Service bị destroyed

**Start Types:**
- **START_STICKY**: Restart service if killed, với null intent
- **START_NOT_STICKY**: Don't restart if killed
- **START_REDELIVER_INTENT**: Restart và redeliver last intent

```kotlin
// Started Service Example
class MusicPlayerService : Service() {
    
    private var mediaPlayer: MediaPlayer? = null
    private var isPlaying = false
    private val binder = MusicBinder()
    
    companion object {
        private const val TAG = "MusicPlayerService"
        const val ACTION_PLAY = "action_play"
        const val ACTION_PAUSE = "action_pause"
        const val ACTION_STOP = "action_stop"
        const val EXTRA_SONG_URL = "song_url"
        const val NOTIFICATION_ID = 1
        const val CHANNEL_ID = "music_channel"
    }
    
    inner class MusicBinder : Binder() {
        fun getService(): MusicPlayerService = this@MusicPlayerService
    }
    
    override fun onCreate() {
        super.onCreate()
        Log.d(TAG, "Service created")
        
        // Initialize media player
        setupMediaPlayer()
        createNotificationChannel()
    }
    
    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        Log.d(TAG, "onStartCommand: ${intent?.action}")
        
        when (intent?.action) {
            ACTION_PLAY -> {
                val songUrl = intent.getStringExtra(EXTRA_SONG_URL)
                playSong(songUrl)
            }
            ACTION_PAUSE -> pauseSong()
            ACTION_STOP -> stopSong()
        }
        
        // Return START_STICKY để restart service if killed
        return START_STICKY
    }
    
    override fun onBind(intent: Intent?): IBinder? {
        Log.d(TAG, "Service bound")
        return binder
    }
    
    override fun onUnbind(intent: Intent?): Boolean {
        Log.d(TAG, "Service unbound")
        // Return true if you want onRebind() to be called
        return true
    }
    
    override fun onRebind(intent: Intent?) {
        super.onRebind(intent)
        Log.d(TAG, "Service rebound")
    }
    
    override fun onDestroy() {
        super.onDestroy()
        Log.d(TAG, "Service destroyed")
        
        // Cleanup resources
        cleanupMediaPlayer()
        stopForeground(true)
    }
    
    private fun setupMediaPlayer() {
        mediaPlayer = MediaPlayer().apply {
            setOnPreparedListener { 
                Log.d(TAG, "Media player prepared")
                start()
                isPlaying = true
                updateNotification()
            }
            
            setOnCompletionListener { 
                Log.d(TAG, "Song completed")
                isPlaying = false
                updateNotification()
            }
            
            setOnErrorListener { _, what, extra ->
                Log.e(TAG, "Media player error: what=$what, extra=$extra")
                return@setOnErrorListener true
            }
        }
    }
    
    private fun playSong(songUrl: String?) {
        songUrl?.let { url ->
            try {
                mediaPlayer?.apply {
                    reset()
                    setDataSource(url)
                    prepareAsync() // Async preparation
                }
                
                // Start foreground service với notification
                startForegroundService()
                Log.d(TAG, "Playing song: $url")
                
            } catch (e: Exception) {
                Log.e(TAG, "Error playing song", e)
            }
        }
    }
    
    private fun pauseSong() {
        mediaPlayer?.let { player ->
            if (player.isPlaying) {
                player.pause()
                isPlaying = false
                updateNotification()
                Log.d(TAG, "Song paused")
            }
        }
    }
    
    private fun stopSong() {
        mediaPlayer?.let { player ->
            if (player.isPlaying || !isPlaying) {
                player.stop()
                isPlaying = false
                stopForeground(true)
                stopSelf()
                Log.d(TAG, "Song stopped")
            }
        }
    }
    
    private fun startForegroundService() {
        val notification = createNotification()
        startForeground(NOTIFICATION_ID, notification)
    }
    
    private fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                CHANNEL_ID,
                "Music Player",
                NotificationManager.IMPORTANCE_LOW
            ).apply {
                description = "Music player controls"
                setSound(null, null)
            }
            
            val notificationManager = getSystemService(NotificationManager::class.java)
            notificationManager.createNotificationChannel(channel)
        }
    }
    
    private fun createNotification(): Notification {
        // Intent for opening main activity
        val openIntent = Intent(this, MainActivity::class.java)
        val openPendingIntent = PendingIntent.getActivity(
            this, 0, openIntent, 
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )
        
        // Intent for play/pause action
        val playPauseAction = if (isPlaying) ACTION_PAUSE else ACTION_PLAY
        val playPauseIntent = Intent(this, MusicPlayerService::class.java)
            .setAction(playPauseAction)
        val playPausePendingIntent = PendingIntent.getService(
            this, 1, playPauseIntent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )
        
        // Intent for stop action
        val stopIntent = Intent(this, MusicPlayerService::class.java)
            .setAction(ACTION_STOP)
        val stopPendingIntent = PendingIntent.getService(
            this, 2, stopIntent,
            PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
        )
        
        return NotificationCompat.Builder(this, CHANNEL_ID)
            .setContentTitle("Music Player")
            .setContentText(if (isPlaying) "Playing..." else "Paused")
            .setSmallIcon(R.drawable.ic_music_note)
            .setContentIntent(openPendingIntent)
            .addAction(
                if (isPlaying) R.drawable.ic_pause else R.drawable.ic_play,
                if (isPlaying) "Pause" else "Play",
                playPausePendingIntent
            )
            .addAction(R.drawable.ic_stop, "Stop", stopPendingIntent)
            .setOngoing(true)
            .setVisibility(NotificationCompat.VISIBILITY_PUBLIC)
            .build()
    }
    
    private fun updateNotification() {
        val notification = createNotification()
        val notificationManager = getSystemService(NotificationManager::class.java)
        notificationManager.notify(NOTIFICATION_ID, notification)
    }
    
    private fun cleanupMediaPlayer() {
        mediaPlayer?.let { player ->
            if (player.isPlaying) {
                player.stop()
            }
            player.release()
        }
        mediaPlayer = null
    }
    
    // Public methods for bound clients
    fun isPlaying(): Boolean = isPlaying
    
    fun getCurrentPosition(): Int = mediaPlayer?.currentPosition ?: 0
    
    fun getDuration(): Int = mediaPlayer?.duration ?: 0
    
    fun seekTo(position: Int) {
        mediaPlayer?.seekTo(position)
    }
}

// Background Service for data sync
class DataSyncService : Service() {
    
    private val binder = DataSyncBinder()
    private var isRunning = false
    private lateinit var syncJob: Job
    
    companion object {
        private const val TAG = "DataSyncService"
    }
    
    inner class DataSyncBinder : Binder() {
        fun getService(): DataSyncService = this@DataSyncService
    }
    
    override fun onCreate() {
        super.onCreate()
        Log.d(TAG, "DataSync service created")
    }
    
    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        Log.d(TAG, "Starting data sync")
        
        if (!isRunning) {
            startDataSync()
        }
        
        return START_NOT_STICKY // Don't restart if killed
    }
    
    override fun onBind(intent: Intent?): IBinder? {
        Log.d(TAG, "DataSync service bound")
        return binder
    }
    
    override fun onDestroy() {
        super.onDestroy()
        Log.d(TAG, "DataSync service destroyed")
        
        if (::syncJob.isInitialized) {
            syncJob.cancel()
        }
        isRunning = false
    }
    
    private fun startDataSync() {
        isRunning = true
        syncJob = CoroutineScope(Dispatchers.IO).launch {
            try {
                syncData()
            } catch (e: Exception) {
                Log.e(TAG, "Data sync failed", e)
            } finally {
                isRunning = false
                stopSelf()
            }
        }
    }
    
    private suspend fun syncData() {
        Log.d(TAG, "Syncing data...")
        
        // Simulate network calls và data processing
        repeat(5) { i ->
            delay(1000)
            Log.d(TAG, "Sync step ${i + 1}/5")
            
            // Update progress (could broadcast to UI)
            sendProgressUpdate((i + 1) * 20)
        }
        
        Log.d(TAG, "Data sync completed")
        sendSyncCompleteNotification()
    }
    
    private fun sendProgressUpdate(progress: Int) {
        val intent = Intent("com.example.SYNC_PROGRESS")
        intent.putExtra("progress", progress)
        sendBroadcast(intent)
    }
    
    private fun sendSyncCompleteNotification() {
        // Create notification về successful sync
        val notificationManager = getSystemService(NotificationManager::class.java)
        
        // Create channel if needed
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                "sync_channel",
                "Data Sync",
                NotificationManager.IMPORTANCE_DEFAULT
            )
            notificationManager.createNotificationChannel(channel)
        }
        
        val notification = NotificationCompat.Builder(this, "sync_channel")
            .setContentTitle("Sync Complete")
            .setContentText("Your data has been synchronized successfully")
            .setSmallIcon(R.drawable.ic_sync_done)
            .setAutoCancel(true)
            .build()
        
        notificationManager.notify(2, notification)
    }
    
    fun getSyncStatus(): Boolean = isRunning
}
```

### 5. BroadcastReceiver Implementation

#### 5.1 BroadcastReceiver Types và Usage

**Khái niệm BroadcastReceiver:**

BroadcastReceiver là component nhận và responds to broadcast messages từ system hoặc other applications:

**Receiver Types:**
- **Static Receiver**: Declared trong manifest, receives broadcasts even when app is not running
- **Dynamic Receiver**: Registered programmatically, only active when app is running
- **Local Receiver**: Only receives broadcasts từ same app (more secure)

**System Broadcasts:**
- **ACTION_BOOT_COMPLETED**: Device finished booting
- **ACTION_BATTERY_LOW**: Battery is running low
- **ACTION_POWER_CONNECTED**: Power connected
- **CONNECTIVITY_ACTION**: Network connectivity changed
- **ACTION_SCREEN_ON/OFF**: Screen turned on/off

**Custom Broadcasts:**
- **Normal Broadcasts**: Delivered to all receivers asynchronously
- **Ordered Broadcasts**: Delivered to receivers one at a time
- **Local Broadcasts**: Only within same app process

```kotlin
// Static BroadcastReceiver trong manifest
class BootCompleteReceiver : BroadcastReceiver() {
    
    companion object {
        private const val TAG = "BootCompleteReceiver"
    }
    
    override fun onReceive(context: Context?, intent: Intent?) {
        if (intent?.action == Intent.ACTION_BOOT_COMPLETED) {
            Log.d(TAG, "Device boot completed")
            
            // Start essential services
            context?.let { ctx ->
                startEssentialServices(ctx)
                schedulePeriodicTasks(ctx)
            }
        }
    }
    
    private fun startEssentialServices(context: Context) {
        // Start background sync service
        val syncIntent = Intent(context, DataSyncService::class.java)
        context.startService(syncIntent)
        
        Log.d(TAG, "Started essential services after boot")
    }
    
    private fun schedulePeriodicTasks(context: Context) {
        // Schedule WorkManager tasks
        val workRequest = PeriodicWorkRequestBuilder<PeriodicSyncWorker>(
            15, TimeUnit.MINUTES
        ).build()
        
        WorkManager.getInstance(context)
            .enqueueUniquePeriodicWork(
                "periodic_sync",
                ExistingPeriodicWorkPolicy.KEEP,
                workRequest
            )
        
        Log.d(TAG, "Scheduled periodic tasks")
    }
}

// Battery và Power Status Receiver
class BatteryReceiver : BroadcastReceiver() {
    
    companion object {
        private const val TAG = "BatteryReceiver"
    }
    
    override fun onReceive(context: Context?, intent: Intent?) {
        when (intent?.action) {
            Intent.ACTION_BATTERY_LOW -> {
                Log.d(TAG, "Battery low")
                handleBatteryLow(context)
            }
            Intent.ACTION_BATTERY_OKAY -> {
                Log.d(TAG, "Battery okay")
                handleBatteryOkay(context)
            }
            Intent.ACTION_POWER_CONNECTED -> {
                Log.d(TAG, "Power connected")
                handlePowerConnected(context)
            }
            Intent.ACTION_POWER_DISCONNECTED -> {
                Log.d(TAG, "Power disconnected")
                handlePowerDisconnected(context)
            }
        }
    }
    
    private fun handleBatteryLow(context: Context?) {
        context?.let { ctx ->
            // Enable battery saving mode
            enableBatterySavingMode(ctx)
            
            // Notify user
            showBatteryLowNotification(ctx)
        }
    }
    
    private fun handleBatteryOkay(context: Context?) {
        context?.let { ctx ->
            // Disable battery saving mode
            disableBatterySavingMode(ctx)
        }
    }
    
    private fun handlePowerConnected(context: Context?) {
        context?.let { ctx ->
            // Start charging optimizations
            enableChargingOptimizations(ctx)
            
            // Schedule intensive tasks
            scheduleIntensiveTasks(ctx)
        }
    }
    
    private fun handlePowerDisconnected(context: Context?) {
        context?.let { ctx ->
            // Stop intensive tasks
            cancelIntensiveTasks(ctx)
            
            // Enable power saving
            enablePowerSavingMode(ctx)
        }
    }
    
    private fun enableBatterySavingMode(context: Context) {
        // Reduce background activity
        val sharedPrefs = context.getSharedPreferences("app_settings", Context.MODE_PRIVATE)
        sharedPrefs.edit()
            .putBoolean("battery_saving_mode", true)
            .apply()
        
        // Cancel non-essential work
        WorkManager.getInstance(context).cancelAllWorkByTag("non_essential")
        
        Log.d(TAG, "Battery saving mode enabled")
    }
    
    private fun disableBatterySavingMode(context: Context) {
        val sharedPrefs = context.getSharedPreferences("app_settings", Context.MODE_PRIVATE)
        sharedPrefs.edit()
            .putBoolean("battery_saving_mode", false)
            .apply()
        
        Log.d(TAG, "Battery saving mode disabled")
    }
    
    private fun showBatteryLowNotification(context: Context) {
        val notificationManager = context.getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                "battery_channel",
                "Battery Status",
                NotificationManager.IMPORTANCE_DEFAULT
            )
            notificationManager.createNotificationChannel(channel)
        }
        
        val notification = NotificationCompat.Builder(context, "battery_channel")
            .setContentTitle("Battery Low")
            .setContentText("Battery saving mode has been enabled")
            .setSmallIcon(R.drawable.ic_battery_alert)
            .setAutoCancel(true)
            .build()
        
        notificationManager.notify(3, notification)
    }
    
    private fun enableChargingOptimizations(context: Context) {
        Log.d(TAG, "Enabling charging optimizations")
    }
    
    private fun scheduleIntensiveTasks(context: Context) {
        Log.d(TAG, "Scheduling intensive tasks")
    }
    
    private fun cancelIntensiveTasks(context: Context) {
        WorkManager.getInstance(context).cancelAllWorkByTag("intensive")
        Log.d(TAG, "Cancelled intensive tasks")
    }
    
    private fun enablePowerSavingMode(context: Context) {
        Log.d(TAG, "Power saving mode enabled")
    }
}

// Network Connectivity Receiver
class NetworkReceiver : BroadcastReceiver() {
    
    companion object {
        private const val TAG = "NetworkReceiver"
    }
    
    override fun onReceive(context: Context?, intent: Intent?) {
        if (intent?.action == ConnectivityManager.CONNECTIVITY_ACTION) {
            context?.let { ctx ->
                val networkInfo = getNetworkInfo(ctx)
                handleNetworkChange(ctx, networkInfo)
            }
        }
    }
    
    private fun getNetworkInfo(context: Context): NetworkInfo {
        val connectivityManager = context.getSystemService(Context.CONNECTIVITY_SERVICE) 
                as ConnectivityManager
        
        return if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            val network = connectivityManager.activeNetwork
            val capabilities = connectivityManager.getNetworkCapabilities(network)
            
            NetworkInfo(
                isConnected = capabilities?.hasCapability(NetworkCapabilities.NET_CAPABILITY_INTERNET) == true,
                isWiFi = capabilities?.hasTransport(NetworkCapabilities.TRANSPORT_WIFI) == true,
                isMobile = capabilities?.hasTransport(NetworkCapabilities.TRANSPORT_CELLULAR) == true,
                isMetered = connectivityManager.isActiveNetworkMetered
            )
        } else {
            @Suppress("DEPRECATION")
            val activeNetwork = connectivityManager.activeNetworkInfo
            NetworkInfo(
                isConnected = activeNetwork?.isConnected == true,
                isWiFi = activeNetwork?.type == ConnectivityManager.TYPE_WIFI,
                isMobile = activeNetwork?.type == ConnectivityManager.TYPE_MOBILE,
                isMetered = connectivityManager.isActiveNetworkMetered
            )
        }
    }
    
    private fun handleNetworkChange(context: Context, networkInfo: NetworkInfo) {
        Log.d(TAG, "Network changed: $networkInfo")
        
        when {
            !networkInfo.isConnected -> handleNetworkLoss(context)
            networkInfo.isWiFi -> handleWiFiConnection(context)
            networkInfo.isMobile -> handleMobileConnection(context, networkInfo.isMetered)
        }
        
        // Broadcast network status to app
        val intent = Intent("com.example.NETWORK_CHANGED")
        intent.putExtra("network_info", networkInfo)
        context.sendBroadcast(intent)
    }
    
    private fun handleNetworkLoss(context: Context) {
        Log.d(TAG, "Network connection lost")
        
        // Cancel network-dependent tasks
        WorkManager.getInstance(context).cancelAllWorkByTag("network_required")
        
        // Enable offline mode
        val sharedPrefs = context.getSharedPreferences("app_settings", Context.MODE_PRIVATE)
        sharedPrefs.edit()
            .putBoolean("offline_mode", true)
            .apply()
    }
    
    private fun handleWiFiConnection(context: Context) {
        Log.d(TAG, "WiFi connected")
        
        // Disable offline mode
        val sharedPrefs = context.getSharedPreferences("app_settings", Context.MODE_PRIVATE)
        sharedPrefs.edit()
            .putBoolean("offline_mode", false)
            .apply()
        
        // Start high-bandwidth tasks
        scheduleHighBandwidthTasks(context)
    }
    
    private fun handleMobileConnection(context: Context, isMetered: Boolean) {
        Log.d(TAG, "Mobile connected, metered: $isMetered")
        
        // Disable offline mode
        val sharedPrefs = context.getSharedPreferences("app_settings", Context.MODE_PRIVATE)
        sharedPrefs.edit()
            .putBoolean("offline_mode", false)
            .putBoolean("data_saver_mode", isMetered)
            .apply()
        
        // Schedule appropriate tasks based on metered status
        if (isMetered) {
            scheduleEssentialTasksOnly(context)
        } else {
            scheduleAllNetworkTasks(context)
        }
    }
    
    private fun scheduleHighBandwidthTasks(context: Context) {
        val workRequest = OneTimeWorkRequestBuilder<HighBandwidthWorker>()
            .setConstraints(
                Constraints.Builder()
                    .setRequiredNetworkType(NetworkType.UNMETERED)
                    .build()
            )
            .addTag("high_bandwidth")
            .build()
        
        WorkManager.getInstance(context).enqueue(workRequest)
        Log.d(TAG, "Scheduled high bandwidth tasks")
    }
    
    private fun scheduleEssentialTasksOnly(context: Context) {
        val workRequest = OneTimeWorkRequestBuilder<EssentialSyncWorker>()
            .setConstraints(
                Constraints.Builder()
                    .setRequiredNetworkType(NetworkType.CONNECTED)
                    .build()
            )
            .addTag("essential")
            .build()
        
        WorkManager.getInstance(context).enqueue(workRequest)
        Log.d(TAG, "Scheduled essential tasks only")
    }
    
    private fun scheduleAllNetworkTasks(context: Context) {
        Log.d(TAG, "Scheduled all network tasks")
    }
}

data class NetworkInfo(
    val isConnected: Boolean,
    val isWiFi: Boolean,
    val isMobile: Boolean,
    val isMetered: Boolean
) : Parcelable {
    constructor(parcel: Parcel) : this(
        parcel.readByte() != 0.toByte(),
        parcel.readByte() != 0.toByte(),
        parcel.readByte() != 0.toByte(),
        parcel.readByte() != 0.toByte()
    )
    
    override fun writeToParcel(parcel: Parcel, flags: Int) {
        parcel.writeByte(if (isConnected) 1 else 0)
        parcel.writeByte(if (isWiFi) 1 else 0)
        parcel.writeByte(if (isMobile) 1 else 0)
        parcel.writeByte(if (isMetered) 1 else 0)
    }
    
    override fun describeContents(): Int = 0
    
    companion object CREATOR : Parcelable.Creator<NetworkInfo> {
        override fun createFromParcel(parcel: Parcel): NetworkInfo = NetworkInfo(parcel)
        override fun newArray(size: Int): Array<NetworkInfo?> = arrayOfNulls(size)
    }
}

// Activity managing dynamic receivers
class BroadcastManagementActivity : AppCompatActivity() {
    
    private lateinit var binding: ActivityBroadcastManagementBinding
    private lateinit var batteryReceiver: BatteryReceiver
    private lateinit var networkReceiver: NetworkReceiver
    private var isReceiversRegistered = false
    
    companion object {
        private const val TAG = "BroadcastManagement"
    }
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityBroadcastManagementBinding.inflate(layoutInflater)
        setContentView(binding.root)
        
        setupReceivers()
        setupControls()
    }
    
    override fun onResume() {
        super.onResume()
        registerReceivers()
    }
    
    override fun onPause() {
        super.onPause()
        unregisterReceivers()
    }
    
    private fun setupReceivers() {
        batteryReceiver = BatteryReceiver()
        networkReceiver = NetworkReceiver()
    }
    
    private fun setupControls() {
        binding.registerReceiversButton.setOnClickListener {
            registerReceivers()
        }
        
        binding.unregisterReceiversButton.setOnClickListener {
            unregisterReceivers()
        }
        
        binding.sendCustomBroadcastButton.setOnClickListener {
            sendCustomBroadcast()
        }
        
        binding.sendOrderedBroadcastButton.setOnClickListener {
            sendOrderedBroadcast()
        }
    }
    
    private fun registerReceivers() {
        if (!isReceiversRegistered) {
            // Register battery receiver
            val batteryFilter = IntentFilter().apply {
                addAction(Intent.ACTION_BATTERY_LOW)
                addAction(Intent.ACTION_BATTERY_OKAY)
                addAction(Intent.ACTION_POWER_CONNECTED)
                addAction(Intent.ACTION_POWER_DISCONNECTED)
            }
            registerReceiver(batteryReceiver, batteryFilter)
            
            // Register network receiver
            val networkFilter = IntentFilter(ConnectivityManager.CONNECTIVITY_ACTION)
            registerReceiver(networkReceiver, networkFilter)
            
            isReceiversRegistered = true
            binding.receiversStatusText.text = "Receivers registered"
            Log.d(TAG, "Dynamic receivers registered")
        }
    }
    
    private fun unregisterReceivers() {
        if (isReceiversRegistered) {
            try {
                unregisterReceiver(batteryReceiver)
                unregisterReceiver(networkReceiver)
                
                isReceiversRegistered = false
                binding.receiversStatusText.text = "Receivers unregistered"
                Log.d(TAG, "Dynamic receivers unregistered")
            } catch (e: IllegalArgumentException) {
                Log.w(TAG, "Receivers already unregistered")
            }
        }
    }
    
    private fun sendCustomBroadcast() {
        val intent = Intent("com.example.CUSTOM_ACTION")
        intent.putExtra("message", "Hello from custom broadcast")
        intent.putExtra("timestamp", System.currentTimeMillis())
        
        sendBroadcast(intent)
        Log.d(TAG, "Sent custom broadcast")
    }
    
    private fun sendOrderedBroadcast() {
        val intent = Intent("com.example.ORDERED_ACTION")
        intent.putExtra("data", "Ordered broadcast data")
        
        sendOrderedBroadcast(
            intent,
            null, // permission
            object : BroadcastReceiver() {
                override fun onReceive(context: Context?, intent: Intent?) {
                    Log.d(TAG, "Ordered broadcast final result: ${resultData}")
                }
            },
            null, // scheduler
            Activity.RESULT_OK,
            "Initial data",
            null // extras
        )
        
        Log.d(TAG, "Sent ordered broadcast")
    }
}
```

## 🏆 Bài tập thực hành

### Đề bài 1: Music Player với Background Service

Tạo ứng dụng Music Player với các tính năng:

1. **Service Requirements**:
   - Foreground service với notification controls
   - Play/Pause/Stop functionality
   - Progress tracking và seeking
   - Handle audio focus changes

2. **Lifecycle Management**:
   - Proper service lifecycle handling
   - Save playback state across app restarts
   - Handle phone calls và other interruptions

3. **Notification Controls**:
   - Media-style notification với controls
   - Update notification based on playback state
   - Handle notification actions

### Đề bài 2: System Event Monitor với BroadcastReceivers

Tạo app monitor system events:

1. **Static Receivers**:
   - Boot completed receiver
   - Package install/uninstall receiver
   - Timezone change receiver

2. **Dynamic Receivers**:
   - Battery level monitoring
   - Screen on/off detection
   - Network connectivity changes

3. **Event Logging**:
   - Log all events với timestamps
   - Display events trong RecyclerView
   - Export event logs to file

### Lời giải Bài tập 1:

```kotlin
// Music Player Service Implementation
class MusicPlayerService : Service() {
    // Implementation provided above
    // Additional methods for complete functionality:
    
    fun getPlaylist(): List<Song> = currentPlaylist
    
    fun getCurrentSong(): Song? = currentSong
    
    fun playNext() {
        currentSongIndex++
        if (currentSongIndex < currentPlaylist.size) {
            playSong(currentPlaylist[currentSongIndex].url)
        } else {
            stopSong()
        }
    }
    
    fun playPrevious() {
        currentSongIndex--
        if (currentSongIndex >= 0) {
            playSong(currentPlaylist[currentSongIndex].url)
        }
    }
    
    private fun handleAudioFocus() {
        val audioManager = getSystemService(Context.AUDIO_SERVICE) as AudioManager
        
        val focusRequest = AudioFocusRequest.Builder(AudioManager.AUDIOFOCUS_GAIN).run {
            setAudioAttributes(AudioAttributes.Builder().run {
                setUsage(AudioAttributes.USAGE_MEDIA)
                setContentType(AudioAttributes.CONTENT_TYPE_MUSIC)
                build()
            })
            setAcceptsDelayedFocusGain(true)
            setOnAudioFocusChangeListener(audioFocusListener)
            build()
        }
        
        audioManager.requestAudioFocus(focusRequest)
    }
    
    private val audioFocusListener = AudioManager.OnAudioFocusChangeListener { focusChange ->
        when (focusChange) {
            AudioManager.AUDIOFOCUS_GAIN -> {
                // Resume playback
                mediaPlayer?.start()
            }
            AudioManager.AUDIOFOCUS_LOSS_TRANSIENT -> {
                // Pause playback
                mediaPlayer?.pause()
            }
            AudioManager.AUDIOFOCUS_LOSS_TRANSIENT_CAN_DUCK -> {
                // Lower volume
                mediaPlayer?.setVolume(0.3f, 0.3f)
            }
            AudioManager.AUDIOFOCUS_LOSS -> {
                // Stop playback
                stopSong()
            }
        }
    }
}

data class Song(
    val id: Long,
    val title: String,
    val artist: String,
    val album: String,
    val duration: Long,
    val url: String,
    val albumArtUrl: String?
)
```

## 🔑 Những điểm quan trọng cần lưu ý

### 1. Lifecycle Management Best Practices
- Always save critical data trong onPause()
- Use onSaveInstanceState() cho configuration changes
- Implement proper cleanup trong onDestroy()
- Handle process death scenarios

### 2. Service Implementation Guidelines  
- Use appropriate service type cho use case
- Always call stopSelf() khi work is done
- Handle service binding properly
- Implement proper notification cho foreground services

### 3. BroadcastReceiver Security
- Be careful với sensitive data trong broadcasts
- Use local broadcasts khi possible
- Validate incoming intent data
- Don't perform long operations trong onReceive()

### 4. Memory Management
- Unregister receivers trong appropriate lifecycle methods
- Release resources properly trong onDestroy()
- Use weak references khi necessary
- Monitor memory usage với profiling tools

### 5. Common Mistakes
- Forgetting to unregister dynamic receivers
- Not handling configuration changes properly
- Long operations trong main thread
- Missing permissions trong manifest
- Improper service lifecycle management

## 📝 Bài tập về nhà

### Bài 1: File Manager với Content Provider

Tạo file manager app với:

**Content Provider Features**:
- Expose file data to other apps
- Support CRUD operations
- Handle different MIME types
- Implement proper security

**File Operations**:
- Browse file system
- Create/rename/delete files và folders
- Copy/move operations
- File sharing với other apps

### Bài 2: Task Scheduler với AlarmManager

Tạo task scheduling app:

**Alarm Features**:
- Schedule one-time và recurring alarms
- Different alarm types (RTC, ELAPSED_REALTIME)
- Handle device reboot
- Manage alarm persistence

**Task Management**:
- Create custom tasks
- Set task priority và dependencies
- Handle task execution monitoring
- Provide task history và statistics

---

*Post ID: 6y2d7sbaazc5i53*  
*Category: Android*  
*Created: 1/9/2025*  
*Updated: 1/9/2025*
