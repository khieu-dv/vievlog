---
title: "Bài 4: Layouts và Views Cơ bản"
postId: "kf1uaz36wkwd2b7"
category: "Android"
created: "1/9/2025"
updated: "1/9/2025"
---

# Bài 4: Layouts và Views Cơ bản


## 🎯 Mục tiêu bài học

Sau khi hoàn thành bài học này, học viên sẽ có thể:

- Hiểu sâu về View hierarchy và cách Android render UI
- Thành thạo các layout cơ bản: LinearLayout, RelativeLayout, FrameLayout
- Sử dụng ConstraintLayout để tạo responsive và complex layouts
- Làm việc với các View components: TextView, EditText, Button, ImageView
- Xử lý user input và events một cách hiệu quả
- Áp dụng Material Design principles vào ứng dụng
- Tạo responsive design cho multiple screen sizes
- Quản lý resources và internationalization

## 📝 Nội dung chi tiết

### 1. View Hierarchy và ViewGroup

#### 1.1 Hiểu về View System

**Khái niệm View System trong Android:**

Android UI system được built trên tree-like structure gọi là View Hierarchy. Hiểu cấu trúc này là fundamental cho UI development:

**View Hierarchy Concepts:**
- **View**: Base class cho tất cả UI components (TextView, Button, ImageView)
- **ViewGroup**: Container views có thể chứa child views (LinearLayout, ConstraintLayout) 
- **Root View**: ViewGroup cao nhất trong hierarchy, thường là layout container
- **Parent-Child Relationships**: Mỗi view có một parent (except root), có thể có multiple children

**Tree Structure Benefits:**
- **Hierarchical Rendering**: Views được render từ parent xuống children
- **Event Propagation**: Touch events bubble up từ child đến parent
- **Layout Management**: Parent ViewGroups control positioning của children
- **Resource Inheritance**: Children inherit certain properties từ parents

**Performance Implications:**
- **Flat Hierarchy**: Ít levels tốt hơn cho performance
- **Nested ViewGroups**: Quá nhiều levels có thể slow down rendering
- **View Recycling**: Important cho large lists và complex UIs

```kotlin
// View hierarchy example
┌─────────────────────────────────────┐
│           ViewGroup (Root)          │
│  ┌─────────────┐  ┌──────────────┐  │
│  │    View 1   │  │  ViewGroup   │  │
│  └─────────────┘  │  ┌─────────┐ │  │
│                   │  │ View 2  │ │  │
│                   │  └─────────┘ │  │
│                   │  ┌─────────┐ │  │
│                   │  │ View 3  │ │  │
│                   │  └─────────┘ │  │
│                   └──────────────┘  │
└─────────────────────────────────────┘
```

#### 1.2 View Lifecycle và Drawing Process

```kotlin
class CustomView @JvmOverloads constructor(
    context: Context,
    attrs: AttributeSet? = null,
    defStyleAttr: Int = 0
) : View(context, attrs, defStyleAttr) {
    
    private val paint = Paint().apply {
        color = Color.BLUE
        strokeWidth = 5f
        style = Paint.Style.STROKE
    }
    
    // 1. Measure: Xác định kích thước view
    override fun onMeasure(widthMeasureSpec: Int, heightMeasureSpec: Int) {
        val widthMode = MeasureSpec.getMode(widthMeasureSpec)
        val widthSize = MeasureSpec.getSize(widthMeasureSpec)
        val heightMode = MeasureSpec.getMode(heightMeasureSpec)
        val heightSize = MeasureSpec.getSize(heightMeasureSpec)
        
        // Custom measurement logic
        val desiredWidth = 200.dp
        val desiredHeight = 200.dp
        
        val width = when (widthMode) {
            MeasureSpec.EXACTLY -> widthSize
            MeasureSpec.AT_MOST -> minOf(desiredWidth, widthSize)
            MeasureSpec.UNSPECIFIED -> desiredWidth
            else -> desiredWidth
        }
        
        val height = when (heightMode) {
            MeasureSpec.EXACTLY -> heightSize
            MeasureSpec.AT_MOST -> minOf(desiredHeight, heightSize)
            MeasureSpec.UNSPECIFIED -> desiredHeight
            else -> desiredHeight
        }
        
        setMeasuredDimension(width, height)
    }
    
    // 2. Layout: Xác định vị trí view
    override fun onLayout(changed: Boolean, left: Int, top: Int, right: Int, bottom: Int) {
        super.onLayout(changed, left, top, right, bottom)
        // Custom layout logic for child views
    }
    
    // 3. Draw: Vẽ view lên canvas
    override fun onDraw(canvas: Canvas) {
        super.onDraw(canvas)
        
        val centerX = width / 2f
        val centerY = height / 2f
        val radius = minOf(centerX, centerY) - 10f
        
        canvas.drawCircle(centerX, centerY, radius, paint)
    }
    
    // Extension property để convert dp to pixels
    private val Int.dp: Int
        get() = TypedValue.applyDimension(
            TypedValue.COMPLEX_UNIT_DIP,
            this.toFloat(),
            resources.displayMetrics
        ).toInt()
}
```

### 2. Linear Layout

**Khái niệm LinearLayout:**

LinearLayout là một ViewGroup arrange children trong single direction (horizontal hoặc vertical):

**Key Properties:**
- **android:orientation**: "horizontal" hoặc "vertical" 
- **android:layout_weight**: Distribute available space proportionally
- **android:gravity**: Control alignment của children within container
- **android:layout_gravity**: Control alignment của view within parent

**When to Use:**
- Simple linear arrangements
- Equal spacing/weight distribution
- Nested layouts (though ConstraintLayout preferred)

LinearLayout sắp xếp child views theo hướng horizontal hoặc vertical:

```xml
<!-- Vertical LinearLayout -->
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:orientation="vertical"
    android:padding="16dp">

    <!-- Header Section -->
    <TextView
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:text="Login Form"
        android:textSize="24sp"
        android:textStyle="bold"
        android:gravity="center"
        android:layout_marginBottom="32dp" />

    <!-- Email Input -->
    <com.google.android.material.textfield.TextInputLayout
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:layout_marginBottom="16dp"
        android:hint="Email"
        app:startIconDrawable="@drawable/ic_email">

        <com.google.android.material.textfield.TextInputEditText
            android:id="@+id/emailInput"
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:inputType="textEmailAddress" />

    </com.google.android.material.textfield.TextInputLayout>

    <!-- Password Input -->
    <com.google.android.material.textfield.TextInputLayout
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:layout_marginBottom="24dp"
        android:hint="Password"
        app:startIconDrawable="@drawable/ic_lock"
        app:endIconMode="password_toggle">

        <com.google.android.material.textfield.TextInputEditText
            android:id="@+id/passwordInput"
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:inputType="textPassword" />

    </com.google.android.material.textfield.TextInputLayout>

    <!-- Buttons with weight distribution -->
    <LinearLayout
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:orientation="horizontal"
        android:layout_marginBottom="16dp">

        <Button
            android:id="@+id/loginButton"
            android:layout_width="0dp"
            android:layout_height="wrap_content"
            android:layout_weight="1"
            android:text="Login"
            android:layout_marginEnd="8dp" />

        <Button
            android:id="@+id/registerButton"
            android:layout_width="0dp"
            android:layout_height="wrap_content"
            android:layout_weight="1"
            android:text="Register"
            style="@style/Widget.Material3.Button.OutlinedButton"
            android:layout_marginStart="8dp" />

    </LinearLayout>

    <!-- Spacer to push footer to bottom -->
    <View
        android:layout_width="match_parent"
        android:layout_height="0dp"
        android:layout_weight="1" />

    <!-- Footer -->
    <TextView
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:text="Forgot Password?"
        android:textColor="?attr/colorPrimary"
        android:gravity="center"
        android:padding="16dp" />

</LinearLayout>
```

#### Linear Layout with Kotlin

```kotlin
class LoginActivity : AppCompatActivity() {
    
    private lateinit var binding: ActivityLoginBinding
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityLoginBinding.inflate(layoutInflater)
        setContentView(binding.root)
        
        setupLinearLayoutProgrammatically()
        setupEventHandlers()
    }
    
    private fun setupLinearLayoutProgrammatically() {
        // Tạo LinearLayout programmatically
        val dynamicLayout = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            layoutParams = LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                LinearLayout.LayoutParams.WRAP_CONTENT
            )
            setPadding(16.dp, 16.dp, 16.dp, 16.dp)
        }
        
        // Thêm TextView dynamic
        val dynamicText = TextView(this).apply {
            text = "Dynamically Added Text"
            textSize = 18f
            gravity = Gravity.CENTER
            layoutParams = LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                LinearLayout.LayoutParams.WRAP_CONTENT
            ).apply {
                bottomMargin = 16.dp
            }
        }
        
        dynamicLayout.addView(dynamicText)
        
        // Thêm vào root layout
        binding.rootLayout.addView(dynamicLayout)
    }
    
    private fun setupEventHandlers() {
        binding.loginButton.setOnClickListener {
            val email = binding.emailInput.text.toString()
            val password = binding.passwordInput.text.toString()
            
            if (validateInput(email, password)) {
                performLogin(email, password)
            }
        }
        
        binding.registerButton.setOnClickListener {
            startActivity(Intent(this, RegisterActivity::class.java))
        }
    }
    
    private fun validateInput(email: String, password: String): Boolean {
        var isValid = true
        
        if (email.isEmpty() || !android.util.Patterns.EMAIL_ADDRESS.matcher(email).matches()) {
            binding.emailInput.error = "Please enter valid email"
            isValid = false
        }
        
        if (password.isEmpty() || password.length < 6) {
            binding.passwordInput.error = "Password must be at least 6 characters"
            isValid = false
        }
        
        return isValid
    }
    
    private fun performLogin(email: String, password: String) {
        // Login logic here
        Toast.makeText(this, "Login successful", Toast.LENGTH_SHORT).show()
    }
    
    // Extension property cho dp conversion
    private val Int.dp: Int
        get() = TypedValue.applyDimension(
            TypedValue.COMPLEX_UNIT_DIP,
            this.toFloat(),
            resources.displayMetrics
        ).toInt()
}
```

### 3. RelativeLayout

**Khái niệm RelativeLayout:**

RelativeLayout là ViewGroup cho phép position child views relative to each other hoặc parent:

**Key Properties:**
- **Relative Positioning**: Views positioned relative to other views
- **Parent-relative**: align with parent edges (centerInParent, alignParentTop)
- **Sibling-relative**: position relative to other views (below, toRightOf, above)
- **Flexible Layouts**: Complex arrangements without nesting

**Common Attributes:**
- **layout_centerInParent**: Center view trong parent
- **layout_alignParentTop/Bottom/Start/End**: Align với parent edges
- **layout_below/above**: Position vertically relative to other views
- **layout_toStartOf/toEndOf**: Position horizontally relative to other views

**When to Use:**
- Complex positioning requirements
- When ConstraintLayout is not available
- Legacy code maintenance

**Note**: ConstraintLayout is preferred over RelativeLayout for new projects.

RelativeLayout cho phép positioning views relative to each other:

```xml
<RelativeLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:padding="16dp">

    <!-- Profile Image ở center -->
    <ImageView
        android:id="@+id/profileImage"
        android:layout_width="120dp"
        android:layout_height="120dp"
        android:layout_centerHorizontal="true"
        android:layout_marginTop="32dp"
        android:background="@drawable/circle_background"
        android:scaleType="centerCrop"
        android:src="@drawable/default_avatar" />

    <!-- Name below profile image -->
    <TextView
        android:id="@+id/nameText"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_below="@id/profileImage"
        android:layout_centerHorizontal="true"
        android:layout_marginTop="16dp"
        android:text="John Doe"
        android:textSize="24sp"
        android:textStyle="bold" />

    <!-- Email below name -->
    <TextView
        android:id="@+id/emailText"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:layout_below="@id/nameText"
        android:layout_centerHorizontal="true"
        android:layout_marginTop="8dp"
        android:text="john.doe@example.com"
        android:textSize="16sp"
        android:textColor="@color/text_secondary" />

    <!-- Edit button to the right of name -->
    <ImageButton
        android:id="@+id/editButton"
        android:layout_width="48dp"
        android:layout_height="48dp"
        android:layout_alignTop="@id/nameText"
        android:layout_toEndOf="@id/nameText"
        android:layout_marginStart="16dp"
        android:background="?attr/selectableItemBackgroundBorderless"
        android:src="@drawable/ic_edit"
        android:contentDescription="Edit profile" />

    <!-- Stats section at bottom -->
    <LinearLayout
        android:id="@+id/statsLayout"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:layout_above="@id/actionButtons"
        android:layout_marginBottom="32dp"
        android:orientation="horizontal"
        android:weightSum="3">

        <LinearLayout
            android:layout_width="0dp"
            android:layout_height="wrap_content"
            android:layout_weight="1"
            android:gravity="center"
            android:orientation="vertical">

            <TextView
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:text="125"
                android:textSize="20sp"
                android:textStyle="bold" />

            <TextView
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:text="Posts"
                android:textSize="14sp" />

        </LinearLayout>

        <LinearLayout
            android:layout_width="0dp"
            android:layout_height="wrap_content"
            android:layout_weight="1"
            android:gravity="center"
            android:orientation="vertical">

            <TextView
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:text="1.2K"
                android:textSize="20sp"
                android:textStyle="bold" />

            <TextView
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:text="Followers"
                android:textSize="14sp" />

        </LinearLayout>

        <LinearLayout
            android:layout_width="0dp"
            android:layout_height="wrap_content"
            android:layout_weight="1"
            android:gravity="center"
            android:orientation="vertical">

            <TextView
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:text="856"
                android:textSize="20sp"
                android:textStyle="bold" />

            <TextView
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:text="Following"
                android:textSize="14sp" />

        </LinearLayout>

    </LinearLayout>

    <!-- Action buttons at bottom -->
    <LinearLayout
        android:id="@+id/actionButtons"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:layout_alignParentBottom="true"
        android:orientation="horizontal">

        <Button
            android:id="@+id/followButton"
            android:layout_width="0dp"
            android:layout_height="wrap_content"
            android:layout_weight="1"
            android:text="Follow"
            android:layout_marginEnd="8dp" />

        <Button
            android:id="@+id/messageButton"
            android:layout_width="0dp"
            android:layout_height="wrap_content"
            android:layout_weight="1"
            android:text="Message"
            style="@style/Widget.Material3.Button.OutlinedButton"
            android:layout_marginStart="8dp" />

    </LinearLayout>

</RelativeLayout>
```

### 4. ConstraintLayout Master Class

**Khái niệm ConstraintLayout:**

ConstraintLayout là modern layout system sử dụng constraints để position views relative to each other:

**Core Concepts:**
- **Constraints**: Rules định nghĩa position của view relative to other views hoặc parent
- **Flat Hierarchy**: Avoid nested layouts for better performance  
- **Responsive Design**: Automatically adapt to different screen sizes
- **Design Tools**: Visual editor support trong Android Studio

**Key Features:**
- **Guidelines**: Invisible lines để align multiple views
- **Barriers**: Dynamic boundaries based on multiple views
- **Chains**: Group views together with defined spacing behavior
- **Dimension Ratios**: Maintain aspect ratios (e.g., 16:9)

ConstraintLayout là layout mạnh nhất và linh hoạt nhất trong Android:

```xml
<androidx.constraintlayout.widget.ConstraintLayout 
    xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:padding="16dp">

    <!-- Logo at top center -->
    <ImageView
        android:id="@+id/logo"
        android:layout_width="80dp"
        android:layout_height="80dp"
        android:src="@drawable/app_logo"
        app:layout_constraintTop_toTopOf="parent"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintEnd_toEndOf="parent"
        app:layout_constraintVertical_chainStyle="packed"
        app:layout_constraintBottom_toTopOf="@id/titleText" />

    <!-- Title -->
    <TextView
        android:id="@+id/titleText"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="Welcome Back"
        android:textSize="28sp"
        android:textStyle="bold"
        android:layout_marginTop="16dp"
        app:layout_constraintTop_toBottomOf="@id/logo"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintEnd_toEndOf="parent"
        app:layout_constraintBottom_toTopOf="@id/subtitleText" />

    <!-- Subtitle -->
    <TextView
        android:id="@+id/subtitleText"
        android:layout_width="0dp"
        android:layout_height="wrap_content"
        android:text="Sign in to your account to continue"
        android:textSize="16sp"
        android:textColor="@color/text_secondary"
        android:gravity="center"
        android:layout_marginTop="8dp"
        app:layout_constraintTop_toBottomOf="@id/titleText"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintEnd_toEndOf="parent"
        app:layout_constraintWidth_percent="0.8"
        app:layout_constraintBottom_toTopOf="@id/emailInputLayout" />

    <!-- Email Input với barrier -->
    <com.google.android.material.textfield.TextInputLayout
        android:id="@+id/emailInputLayout"
        android:layout_width="0dp"
        android:layout_height="wrap_content"
        android:layout_marginTop="32dp"
        android:hint="Email Address"
        app:layout_constraintTop_toBottomOf="@id/subtitleText"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintEnd_toEndOf="parent"
        app:layout_constraintBottom_toTopOf="@id/passwordInputLayout">

        <com.google.android.material.textfield.TextInputEditText
            android:id="@+id/emailInput"
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:inputType="textEmailAddress" />

    </com.google.android.material.textfield.TextInputLayout>

    <!-- Password Input -->
    <com.google.android.material.textfield.TextInputLayout
        android:id="@+id/passwordInputLayout"
        android:layout_width="0dp"
        android:layout_height="wrap_content"
        android:layout_marginTop="16dp"
        android:hint="Password"
        app:endIconMode="password_toggle"
        app:layout_constraintTop_toBottomOf="@id/emailInputLayout"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintEnd_toEndOf="parent"
        app:layout_constraintBottom_toTopOf="@id/forgotPasswordText">

        <com.google.android.material.textfield.TextInputEditText
            android:id="@+id/passwordInput"
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:inputType="textPassword" />

    </com.google.android.material.textfield.TextInputLayout>

    <!-- Forgot Password -->
    <TextView
        android:id="@+id/forgotPasswordText"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="Forgot Password?"
        android:textColor="?attr/colorPrimary"
        android:padding="8dp"
        android:layout_marginTop="8dp"
        app:layout_constraintTop_toBottomOf="@id/passwordInputLayout"
        app:layout_constraintEnd_toEndOf="parent"
        app:layout_constraintBottom_toTopOf="@id/loginButton" />

    <!-- Login Button -->
    <Button
        android:id="@+id/loginButton"
        android:layout_width="0dp"
        android:layout_height="56dp"
        android:text="Sign In"
        android:textSize="16sp"
        android:layout_marginTop="24dp"
        app:layout_constraintTop_toBottomOf="@id/forgotPasswordText"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintEnd_toEndOf="parent"
        app:layout_constraintBottom_toTopOf="@id/dividerLine" />

    <!-- Divider -->
    <View
        android:id="@+id/dividerLine"
        android:layout_width="0dp"
        android:layout_height="1dp"
        android:background="@color/divider_color"
        android:layout_marginTop="32dp"
        android:layout_marginStart="32dp"
        android:layout_marginEnd="32dp"
        app:layout_constraintTop_toBottomOf="@id/loginButton"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintEnd_toEndOf="parent"
        app:layout_constraintBottom_toTopOf="@id/orText" />

    <!-- OR Text -->
    <TextView
        android:id="@+id/orText"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:text="OR"
        android:textSize="14sp"
        android:textColor="@color/text_secondary"
        android:background="@color/background_color"
        android:paddingStart="16dp"
        android:paddingEnd="16dp"
        app:layout_constraintTop_toTopOf="@id/dividerLine"
        app:layout_constraintBottom_toBottomOf="@id/dividerLine"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintEnd_toEndOf="parent" />

    <!-- Social Login Buttons -->
    <Button
        android:id="@+id/googleSignInButton"
        android:layout_width="0dp"
        android:layout_height="48dp"
        android:text="Continue with Google"
        android:drawableStart="@drawable/ic_google"
        android:drawablePadding="12dp"
        android:gravity="center"
        style="@style/Widget.Material3.Button.OutlinedButton"
        android:layout_marginTop="16dp"
        app:layout_constraintTop_toBottomOf="@id/dividerLine"
        app:layout_constraintStart_toStartOf="parent"
        app:layout_constraintEnd_toEndOf="parent" />

    <!-- Guidelines for responsive design -->
    <androidx.constraintlayout.widget.Guideline
        android:id="@+id/guidelineStart"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:orientation="vertical"
        app:layout_constraintGuide_percent="0.05" />

    <androidx.constraintlayout.widget.Guideline
        android:id="@+id/guidelineEnd"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        android:orientation="vertical"
        app:layout_constraintGuide_percent="0.95" />

    <!-- Barrier for dynamic content -->
    <androidx.constraintlayout.widget.Barrier
        android:id="@+id/inputBarrier"
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        app:barrierDirection="bottom"
        app:constraint_referenced_ids="emailInputLayout,passwordInputLayout" />

</androidx.constraintlayout.widget.ConstraintLayout>
```

#### ConstraintLayout Advanced Features

```kotlin
class ConstraintLayoutActivity : AppCompatActivity() {
    
    private lateinit var binding: ActivityConstraintLayoutBinding
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityConstraintLayoutBinding.inflate(layoutInflater)
        setContentView(binding.root)
        
        setupConstraintLayoutProgrammatically()
        setupAnimatedConstraints()
    }
    
    private fun setupConstraintLayoutProgrammatically() {
        val constraintSet = ConstraintSet()
        constraintSet.clone(binding.constraintLayout)
        
        // Modify constraints programmatically
        constraintSet.connect(
            R.id.loginButton, 
            ConstraintSet.START,
            ConstraintSet.PARENT_ID, 
            ConstraintSet.START, 
            16.dp
        )
        
        constraintSet.connect(
            R.id.loginButton, 
            ConstraintSet.END,
            ConstraintSet.PARENT_ID, 
            ConstraintSet.END, 
            16.dp
        )
        
        // Set dimension ratio
        constraintSet.setDimensionRatio(R.id.logo, "1:1")
        
        // Apply constraints with animation
        constraintSet.applyTo(binding.constraintLayout)
    }
    
    private fun setupAnimatedConstraints() {
        binding.loginButton.setOnClickListener {
            animateConstraints()
        }
    }
    
    private fun animateConstraints() {
        val constraintSet = ConstraintSet()
        constraintSet.clone(binding.constraintLayout)
        
        // Modify constraints for animation
        constraintSet.clear(R.id.logo, ConstraintSet.TOP)
        constraintSet.connect(
            R.id.logo, 
            ConstraintSet.BOTTOM, 
            ConstraintSet.PARENT_ID, 
            ConstraintSet.BOTTOM, 
            32.dp
        )
        
        // Animate the constraint change
        val transition = AutoTransition().apply {
            duration = 1000
            interpolator = AccelerateDecelerateInterpolator()
        }
        
        TransitionManager.beginDelayedTransition(binding.constraintLayout, transition)
        constraintSet.applyTo(binding.constraintLayout)
    }
    
    private val Int.dp: Int
        get() = TypedValue.applyDimension(
            TypedValue.COMPLEX_UNIT_DIP,
            this.toFloat(),
            resources.displayMetrics
        ).toInt()
}
```

### 5. TextView, EditText, Button, ImageView

**Khái niệm Basic Views:**

Chúng là các UI components cơ bản nhất trong Android development:

**TextView:**
- Display text content với rich formatting options
- Support custom fonts, colors, spacing, drawable compound
- Auto-sizing, spannable text for dynamic content

**EditText:**
- User input field với various input types
- Built-in validation và text filtering
- IME (Input Method Editor) integration

**Button:**
- Interactive element cho user actions
- Material Design styling và ripple effects
- State management (enabled, disabled, pressed)

**ImageView:**
- Display images với flexible scaling options
- Support vector drawables, bitmap loading
- Efficient memory management cho large images

#### 5.1 TextView Advanced Usage

```xml
<!-- Advanced TextView features -->
<TextView
    android:id="@+id/advancedText"
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:text="@string/formatted_text"
    android:textSize="16sp"
    android:textColor="@color/text_primary"
    android:fontFamily="@font/roboto_medium"
    android:lineSpacingExtra="4dp"
    android:lineSpacingMultiplier="1.2"
    android:letterSpacing="0.01"
    android:justificationMode="inter_word"
    android:hyphenationFrequency="normal"
    android:drawableStart="@drawable/ic_info"
    android:drawablePadding="12dp"
    android:drawableTint="?attr/colorPrimary"
    android:gravity="start|center_vertical"
    android:padding="16dp"
    android:background="@drawable/rounded_background"
    android:elevation="2dp" />
```

```kotlin
class TextViewActivity : AppCompatActivity() {
    
    private lateinit var binding: ActivityTextViewBinding
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityTextViewBinding.inflate(layoutInflater)
        setContentView(binding.root)
        
        setupAdvancedTextView()
        setupSpannableText()
        setupCustomTypeFace()
    }
    
    private fun setupAdvancedTextView() {
        binding.advancedText.apply {
            // Auto-sizing text
            setAutoSizeTextTypeUniformWithConfiguration(
                12, // min size sp
                30, // max size sp
                2,  // granularity sp
                TypedValue.COMPLEX_UNIT_SP
            )
            
            // Marquee effect for long text
            ellipsize = TextUtils.TruncateAt.MARQUEE
            isSingleLine = true
            marqueeRepeatLimit = -1
            isSelected = true
            
            // Custom click handling for links
            movementMethod = LinkMovementMethod.getInstance()
        }
    }
    
    private fun setupSpannableText() {
        val text = "Hello World! This is bold text and this is italic text."
        val spannable = SpannableStringBuilder(text)
        
        // Bold text
        spannable.setSpan(
            StyleSpan(Typeface.BOLD),
            text.indexOf("bold"),
            text.indexOf("bold") + "bold".length,
            Spannable.SPAN_EXCLUSIVE_EXCLUSIVE
        )
        
        // Italic text
        spannable.setSpan(
            StyleSpan(Typeface.ITALIC),
            text.indexOf("italic"),
            text.indexOf("italic") + "italic".length,
            Spannable.SPAN_EXCLUSIVE_EXCLUSIVE
        )
        
        // Color span
        spannable.setSpan(
            ForegroundColorSpan(ContextCompat.getColor(this, R.color.primary_color)),
            0,
            "Hello World!".length,
            Spannable.SPAN_EXCLUSIVE_EXCLUSIVE
        )
        
        // Clickable span
        val clickableSpan = object : ClickableSpan() {
            override fun onClick(widget: View) {
                Toast.makeText(this@TextViewActivity, "Clicked!", Toast.LENGTH_SHORT).show()
            }
            
            override fun updateDrawState(ds: TextPaint) {
                super.updateDrawState(ds)
                ds.isUnderlineText = false
                ds.color = ContextCompat.getColor(this@TextViewActivity, R.color.link_color)
            }
        }
        
        spannable.setSpan(
            clickableSpan,
            text.indexOf("World"),
            text.indexOf("World") + "World".length,
            Spannable.SPAN_EXCLUSIVE_EXCLUSIVE
        )
        
        binding.spannableText.text = spannable
        binding.spannableText.movementMethod = LinkMovementMethod.getInstance()
    }
    
    private fun setupCustomTypeFace() {
        // Using custom font
        val customFont = ResourcesCompat.getFont(this, R.font.custom_font)
        binding.customFontText.typeface = customFont
        
        // Programmatic text styling
        binding.styledText.apply {
            text = buildString {
                append("Regular text\n")
                append("Bold text\n")
                append("Italic text")
            }
            
            // Apply different styles to different parts
            val spannable = SpannableString(text)
            
            spannable.setSpan(
                StyleSpan(Typeface.BOLD),
                text.indexOf("Bold"),
                text.indexOf("Bold") + "Bold text".length,
                Spannable.SPAN_EXCLUSIVE_EXCLUSIVE
            )
            
            spannable.setSpan(
                StyleSpan(Typeface.ITALIC),
                text.indexOf("Italic"),
                text.indexOf("Italic") + "Italic text".length,
                Spannable.SPAN_EXCLUSIVE_EXCLUSIVE
            )
            
            text = spannable
        }
    }
}
```

#### 5.2 EditText với Validation

```xml
<com.google.android.material.textfield.TextInputLayout
    android:id="@+id/phoneInputLayout"
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:hint="Phone Number"
    app:startIconDrawable="@drawable/ic_phone"
    app:prefixText="+84 "
    app:counterEnabled="true"
    app:counterMaxLength="10"
    app:helperText="Enter 10 digit phone number"
    app:errorEnabled="true">

    <com.google.android.material.textfield.TextInputEditText
        android:id="@+id/phoneInput"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:inputType="phone"
        android:maxLength="10" />

</com.google.android.material.textfield.TextInputLayout>
```

```kotlin
class EditTextValidationActivity : AppCompatActivity() {
    
    private lateinit var binding: ActivityEditTextValidationBinding
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityEditTextValidationBinding.inflate(layoutInflater)
        setContentView(binding.root)
        
        setupEditTextValidation()
        setupRealTimeValidation()
    }
    
    private fun setupEditTextValidation() {
        binding.phoneInput.addTextChangedListener(object : TextWatcher {
            override fun beforeTextChanged(s: CharSequence?, start: Int, count: Int, after: Int) {}
            
            override fun onTextChanged(s: CharSequence?, start: Int, before: Int, count: Int) {
                validatePhoneNumber(s.toString())
            }
            
            override fun afterTextChanged(s: Editable?) {
                // Format phone number
                formatPhoneNumber(s)
            }
        })
        
        // Custom input filter
        binding.phoneInput.filters = arrayOf(
            InputFilter.LengthFilter(10),
            InputFilter { source, start, end, dest, dstart, dend ->
                // Only allow digits
                if (source.matches(Regex("[0-9]*"))) {
                    null // Accept the input
                } else {
                    "" // Reject the input
                }
            }
        )
    }
    
    private fun validatePhoneNumber(phone: String) {
        binding.phoneInputLayout.error = when {
            phone.isEmpty() -> "Phone number is required"
            phone.length < 10 -> "Phone number must be 10 digits"
            !phone.startsWith("0") -> "Phone number must start with 0"
            else -> null
        }
    }
    
    private fun formatPhoneNumber(editable: Editable?) {
        editable?.let { text ->
            val clean = text.toString().replace(Regex("[^0-9]"), "")
            val formatted = when {
                clean.length >= 7 -> "${clean.substring(0, 3)} ${clean.substring(3, 6)} ${clean.substring(6)}"
                clean.length >= 4 -> "${clean.substring(0, 3)} ${clean.substring(3)}"
                else -> clean
            }
            
            if (formatted != text.toString()) {
                text.replace(0, text.length, formatted)
            }
        }
    }
    
    private fun setupRealTimeValidation() {
        // Email validation với regex
        binding.emailInput.addTextChangedListener(object : TextWatcher {
            override fun beforeTextChanged(s: CharSequence?, start: Int, count: Int, after: Int) {}
            override fun onTextChanged(s: CharSequence?, start: Int, before: Int, count: Int) {}
            
            override fun afterTextChanged(s: Editable?) {
                val email = s.toString()
                val isValid = android.util.Patterns.EMAIL_ADDRESS.matcher(email).matches()
                
                binding.emailInputLayout.error = if (!isValid && email.isNotEmpty()) {
                    "Invalid email format"
                } else null
                
                // Change icon color based on validation
                val iconColor = if (isValid && email.isNotEmpty()) {
                    ContextCompat.getColor(this@EditTextValidationActivity, R.color.success_color)
                } else {
                    ContextCompat.getColor(this@EditTextValidationActivity, R.color.default_color)
                }
                
                binding.emailInputLayout.setStartIconTintList(ColorStateList.valueOf(iconColor))
            }
        })
        
        // Password strength indicator
        binding.passwordInput.addTextChangedListener(object : TextWatcher {
            override fun beforeTextChanged(s: CharSequence?, start: Int, count: Int, after: Int) {}
            override fun onTextChanged(s: CharSequence?, start: Int, before: Int, count: Int) {}
            
            override fun afterTextChanged(s: Editable?) {
                val password = s.toString()
                val strength = calculatePasswordStrength(password)
                updatePasswordStrengthIndicator(strength)
            }
        })
    }
    
    private fun calculatePasswordStrength(password: String): PasswordStrength {
        return when {
            password.length < 6 -> PasswordStrength.WEAK
            password.length < 8 -> PasswordStrength.MEDIUM
            password.matches(Regex("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$")) -> PasswordStrength.STRONG
            else -> PasswordStrength.MEDIUM
        }
    }
    
    private fun updatePasswordStrengthIndicator(strength: PasswordStrength) {
        val (color, text) = when (strength) {
            PasswordStrength.WEAK -> R.color.error_color to "Weak"
            PasswordStrength.MEDIUM -> R.color.warning_color to "Medium"  
            PasswordStrength.STRONG -> R.color.success_color to "Strong"
        }
        
        binding.passwordStrengthText.apply {
            setTextColor(ContextCompat.getColor(this@EditTextValidationActivity, color))
            text = "Password strength: $text"
        }
    }
    
    enum class PasswordStrength {
        WEAK, MEDIUM, STRONG
    }
}
```

### 6. Material Design Implementation

**Khái niệm Material Design:**

Material Design là Google's design language cho consistent UI/UX:

**Core Principles:**
- **Material Metaphor**: UI elements behave like physical materials
- **Bold Graphics**: Intentional color, imagery, typography
- **Meaningful Motion**: Animations provide feedback và continuity
- **Adaptive Design**: Responsive across devices và screen sizes

**Key Components:**
- **Cards**: Elevated surfaces cho content grouping
- **FAB (Floating Action Button)**: Primary action promotion
- **Bottom Sheets**: Modal surfaces for supplementary content
- **Navigation**: Consistent navigation patterns
- **Material Theming**: Customizable design system

**Benefits:**
- **User Familiarity**: Consistent experience across apps
- **Accessibility**: Built-in accessibility features
- **Performance**: Optimized components và animations

#### 6.1 Material Design Components

```xml
<!-- Material Design themed activity -->
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:orientation="vertical">

    <!-- Material Toolbar -->
    <com.google.android.material.appbar.MaterialToolbar
        android:id="@+id/toolbar"
        android:layout_width="match_parent"
        android:layout_height="?attr/actionBarSize"
        android:background="?attr/colorPrimary"
        android:title="Material Design Demo"
        app:titleTextColor="?attr/colorOnPrimary"
        app:menu="@menu/main_menu"
        app:navigationIcon="@drawable/ic_menu" />

    <!-- Scrollable content -->
    <androidx.core.widget.NestedScrollView
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        android:fillViewport="true">

        <LinearLayout
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:orientation="vertical"
            android:padding="16dp">

            <!-- Material Cards -->
            <com.google.android.material.card.MaterialCardView
                android:layout_width="match_parent"
                android:layout_height="wrap_content"
                android:layout_marginBottom="16dp"
                app:cardCornerRadius="12dp"
                app:cardElevation="4dp"
                app:strokeWidth="1dp"
                app:strokeColor="?attr/colorOutline">

                <LinearLayout
                    android:layout_width="match_parent"
                    android:layout_height="wrap_content"
                    android:orientation="vertical"
                    android:padding="16dp">

                    <TextView
                        android:layout_width="match_parent"
                        android:layout_height="wrap_content"
                        android:text="Material Card"
                        android:textAppearance="?attr/textAppearanceHeadline6"
                        android:layout_marginBottom="8dp" />

                    <TextView
                        android:layout_width="match_parent"
                        android:layout_height="wrap_content"
                        android:text="This is a Material Design card component with elevation and rounded corners."
                        android:textAppearance="?attr/textAppearanceBody2"
                        android:textColor="?attr/colorOnSurfaceVariant" />

                </LinearLayout>

            </com.google.android.material.card.MaterialCardView>

            <!-- Material Buttons -->
            <TextView
                android:layout_width="match_parent"
                android:layout_height="wrap_content"
                android:text="Button Styles"
                android:textAppearance="?attr/textAppearanceHeadline6"
                android:layout_marginBottom="16dp" />

            <Button
                android:id="@+id/filledButton"
                android:layout_width="match_parent"
                android:layout_height="wrap_content"
                android:text="Filled Button"
                android:layout_marginBottom="8dp" />

            <Button
                android:id="@+id/outlinedButton"
                style="@style/Widget.Material3.Button.OutlinedButton"
                android:layout_width="match_parent"
                android:layout_height="wrap_content"
                android:text="Outlined Button"
                android:layout_marginBottom="8dp" />

            <Button
                android:id="@+id/textButton"
                style="@style/Widget.Material3.Button.TextButton"
                android:layout_width="match_parent"
                android:layout_height="wrap_content"
                android:text="Text Button"
                android:layout_marginBottom="16dp" />

            <!-- Material Chips -->
            <TextView
                android:layout_width="match_parent"
                android:layout_height="wrap_content"
                android:text="Chips"
                android:textAppearance="?attr/textAppearanceHeadline6"
                android:layout_marginBottom="16dp" />

            <com.google.android.material.chip.ChipGroup
                android:id="@+id/chipGroup"
                android:layout_width="match_parent"
                android:layout_height="wrap_content"
                android:layout_marginBottom="16dp"
                app:singleSelection="false">

                <com.google.android.material.chip.Chip
                    android:id="@+id/chip1"
                    style="@style/Widget.Material3.Chip.Filter"
                    android:layout_width="wrap_content"
                    android:layout_height="wrap_content"
                    android:text="Technology"
                    android:checked="true" />

                <com.google.android.material.chip.Chip
                    android:id="@+id/chip2"
                    style="@style/Widget.Material3.Chip.Filter"
                    android:layout_width="wrap_content"
                    android:layout_height="wrap_content"
                    android:text="Sports" />

                <com.google.android.material.chip.Chip
                    android:id="@+id/chip3"
                    style="@style/Widget.Material3.Chip.Filter"
                    android:layout_width="wrap_content"
                    android:layout_height="wrap_content"
                    android:text="Entertainment" />

            </com.google.android.material.chip.ChipGroup>

            <!-- FAB -->
            <com.google.android.material.floatingactionbutton.FloatingActionButton
                android:id="@+id/fab"
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:layout_gravity="end"
                android:layout_marginTop="16dp"
                android:src="@drawable/ic_add"
                android:contentDescription="Add item" />

        </LinearLayout>

    </androidx.core.widget.NestedScrollView>

</LinearLayout>
```

#### 6.2 Material Theming

```xml
<!-- File: res/values/themes.xml -->
<resources xmlns:tools="http://schemas.android.com/tools">

    <style name="AppTheme" parent="Theme.Material3.DayNight.NoActionBar">
        <!-- Primary colors -->
        <item name="colorPrimary">@color/primary_color</item>
        <item name="colorOnPrimary">@color/on_primary_color</item>
        <item name="colorPrimaryContainer">@color/primary_container</item>
        <item name="colorOnPrimaryContainer">@color/on_primary_container</item>

        <!-- Secondary colors -->
        <item name="colorSecondary">@color/secondary_color</item>
        <item name="colorOnSecondary">@color/on_secondary_color</item>
        <item name="colorSecondaryContainer">@color/secondary_container</item>
        <item name="colorOnSecondaryContainer">@color/on_secondary_container</item>

        <!-- Surface colors -->
        <item name="colorSurface">@color/surface_color</item>
        <item name="colorOnSurface">@color/on_surface_color</item>
        <item name="colorSurfaceVariant">@color/surface_variant</item>
        <item name="colorOnSurfaceVariant">@color/on_surface_variant</item>

        <!-- Background colors -->
        <item name="android:colorBackground">@color/background_color</item>
        <item name="colorOnBackground">@color/on_background_color</item>

        <!-- Error colors -->
        <item name="colorError">@color/error_color</item>
        <item name="colorOnError">@color/on_error_color</item>

        <!-- Custom attributes -->
        <item name="android:statusBarColor">@color/status_bar_color</item>
        <item name="android:windowLightStatusBar">true</item>
        <item name="android:navigationBarColor">@color/navigation_bar_color</item>
        <item name="android:windowLightNavigationBar" tools:targetApi="O_MR1">true</item>

        <!-- Typography -->
        <item name="textAppearanceHeadline1">@style/TextAppearance.App.Headline1</item>
        <item name="textAppearanceHeadline2">@style/TextAppearance.App.Headline2</item>
        
        <!-- Component styles -->
        <item name="materialButtonStyle">@style/Widget.App.Button</item>
        <item name="textInputStyle">@style/Widget.App.TextInputLayout</item>
    </style>

    <!-- Custom Text Appearances -->
    <style name="TextAppearance.App.Headline1" parent="TextAppearance.Material3.HeadlineLarge">
        <item name="android:fontFamily">@font/roboto_bold</item>
        <item name="fontFamily">@font/roboto_bold</item>
    </style>

    <style name="TextAppearance.App.Headline2" parent="TextAppearance.Material3.HeadlineMedium">
        <item name="android:fontFamily">@font/roboto_medium</item>
        <item name="fontFamily">@font/roboto_medium</item>
    </style>

    <!-- Custom Component Styles -->
    <style name="Widget.App.Button" parent="Widget.Material3.Button">
        <item name="android:textAllCaps">false</item>
        <item name="cornerRadius">8dp</item>
    </style>

    <style name="Widget.App.TextInputLayout" parent="Widget.Material3.TextInputLayout.OutlinedBox">
        <item name="boxCornerRadiusTopStart">8dp</item>
        <item name="boxCornerRadiusTopEnd">8dp</item>
        <item name="boxCornerRadiusBottomStart">8dp</item>
        <item name="boxCornerRadiusBottomEnd">8dp</item>
    </style>

</resources>
```

## 🏆 Bài tập thực hành

### Đề bài: Instagram-like Profile Screen

Tạo màn hình profile tương tự Instagram với các yêu cầu:

1. **Header Section**: Avatar, name, bio, follower stats
2. **Action Buttons**: Follow, Message, More options
3. **Highlights Section**: Story highlights carousel  
4. **Content Grid**: 3-column photo grid
5. **Material Design**: Áp dụng Material Design 3
6. **Responsive**: Support both portrait và landscape

### Lời giải chi tiết:

#### Bước 1: Main Layout với ConstraintLayout

```xml
<!-- File: res/layout/activity_profile.xml -->
<?xml version="1.0" encoding="utf-8"?>
<androidx.coordinatorlayout.widget.CoordinatorLayout 
    xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:layout_width="match_parent"
    android:layout_height="match_parent">

    <com.google.android.material.appbar.AppBarLayout
        android:id="@+id/appBarLayout"
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        app:elevation="0dp">

        <com.google.android.material.appbar.MaterialToolbar
            android:id="@+id/toolbar"
            android:layout_width="match_parent"
            android:layout_height="?attr/actionBarSize"
            app:title="john_doe_official"
            app:titleTextColor="?attr/colorOnSurface"
            app:menu="@menu/profile_menu"
            app:navigationIcon="@drawable/ic_arrow_back" />

    </com.google.android.material.appbar.AppBarLayout>

    <androidx.core.widget.NestedScrollView
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        app:layout_behavior="@string/appbar_scrolling_view_behavior">

        <androidx.constraintlayout.widget.ConstraintLayout
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:padding="16dp">

            <!-- Profile Header Section -->
            <androidx.constraintlayout.widget.ConstraintLayout
                android:id="@+id/headerSection"
                android:layout_width="match_parent"
                android:layout_height="wrap_content"
                app:layout_constraintTop_toTopOf="parent"
                app:layout_constraintStart_toStartOf="parent"
                app:layout_constraintEnd_toEndOf="parent">

                <!-- Profile Avatar -->
                <com.google.android.material.imageview.ShapeableImageView
                    android:id="@+id/profileAvatar"
                    android:layout_width="88dp"
                    android:layout_height="88dp"
                    android:src="@drawable/profile_placeholder"
                    android:scaleType="centerCrop"
                    app:shapeAppearanceOverlay="@style/CircularImageView"
                    app:strokeWidth="2dp"
                    app:strokeColor="?attr/colorOutline"
                    app:layout_constraintTop_toTopOf="parent"
                    app:layout_constraintStart_toStartOf="parent" />

                <!-- Stats Section -->
                <LinearLayout
                    android:id="@+id/statsLayout"
                    android:layout_width="0dp"
                    android:layout_height="wrap_content"
                    android:orientation="horizontal"
                    android:layout_marginStart="24dp"
                    app:layout_constraintTop_toTopOf="@id/profileAvatar"
                    app:layout_constraintBottom_toBottomOf="@id/profileAvatar"
                    app:layout_constraintStart_toEndOf="@id/profileAvatar"
                    app:layout_constraintEnd_toEndOf="parent">

                    <LinearLayout
                        android:layout_width="0dp"
                        android:layout_height="wrap_content"
                        android:layout_weight="1"
                        android:orientation="vertical"
                        android:gravity="center">

                        <TextView
                            android:id="@+id/postsCount"
                            android:layout_width="wrap_content"
                            android:layout_height="wrap_content"
                            android:text="256"
                            android:textAppearance="?attr/textAppearanceHeadlineSmall"
                            android:textStyle="bold" />

                        <TextView
                            android:layout_width="wrap_content"
                            android:layout_height="wrap_content"
                            android:text="Posts"
                            android:textAppearance="?attr/textAppearanceBodySmall"
                            android:textColor="?attr/colorOnSurfaceVariant" />

                    </LinearLayout>

                    <LinearLayout
                        android:layout_width="0dp"
                        android:layout_height="wrap_content"
                        android:layout_weight="1"
                        android:orientation="vertical"
                        android:gravity="center">

                        <TextView
                            android:id="@+id/followersCount"
                            android:layout_width="wrap_content"
                            android:layout_height="wrap_content"
                            android:text="12.5K"
                            android:textAppearance="?attr/textAppearanceHeadlineSmall"
                            android:textStyle="bold" />

                        <TextView
                            android:layout_width="wrap_content"
                            android:layout_height="wrap_content"
                            android:text="Followers"
                            android:textAppearance="?attr/textAppearanceBodySmall"
                            android:textColor="?attr/colorOnSurfaceVariant" />

                    </LinearLayout>

                    <LinearLayout
                        android:layout_width="0dp"
                        android:layout_height="wrap_content"
                        android:layout_weight="1"
                        android:orientation="vertical"
                        android:gravity="center">

                        <TextView
                            android:id="@+id/followingCount"
                            android:layout_width="wrap_content"
                            android:layout_height="wrap_content"
                            android:text="1,845"
                            android:textAppearance="?attr/textAppearanceHeadlineSmall"
                            android:textStyle="bold" />

                        <TextView
                            android:layout_width="wrap_content"
                            android:layout_height="wrap_content"
                            android:text="Following"
                            android:textAppearance="?attr/textAppearanceBodySmall"
                            android:textColor="?attr/colorOnSurfaceVariant" />

                    </LinearLayout>

                </LinearLayout>

                <!-- Name and Bio -->
                <TextView
                    android:id="@+id/displayName"
                    android:layout_width="match_parent"
                    android:layout_height="wrap_content"
                    android:text="John Doe"
                    android:textAppearance="?attr/textAppearanceBodyLarge"
                    android:textStyle="bold"
                    android:layout_marginTop="12dp"
                    app:layout_constraintTop_toBottomOf="@id/profileAvatar"
                    app:layout_constraintStart_toStartOf="parent"
                    app:layout_constraintEnd_toEndOf="parent" />

                <TextView
                    android:id="@+id/bioText"
                    android:layout_width="match_parent"
                    android:layout_height="wrap_content"
                    android:text="📱 Mobile Developer\n🎯 Android Enthusiast\n📍 Ho Chi Minh City"
                    android:textAppearance="?attr/textAppearanceBodyMedium"
                    android:layout_marginTop="4dp"
                    app:layout_constraintTop_toBottomOf="@id/displayName"
                    app:layout_constraintStart_toStartOf="parent"
                    app:layout_constraintEnd_toEndOf="parent" />

                <TextView
                    android:id="@+id/websiteLink"
                    android:layout_width="match_parent"
                    android:layout_height="wrap_content"
                    android:text="www.johndoe.dev"
                    android:textAppearance="?attr/textAppearanceBodyMedium"
                    android:textColor="?attr/colorPrimary"
                    android:layout_marginTop="4dp"
                    app:layout_constraintTop_toBottomOf="@id/bioText"
                    app:layout_constraintStart_toStartOf="parent"
                    app:layout_constraintEnd_toEndOf="parent" />

            </androidx.constraintlayout.widget.ConstraintLayout>

            <!-- Action Buttons -->
            <LinearLayout
                android:id="@+id/actionButtonsLayout"
                android:layout_width="match_parent"
                android:layout_height="wrap_content"
                android:orientation="horizontal"
                android:layout_marginTop="20dp"
                app:layout_constraintTop_toBottomOf="@id/headerSection"
                app:layout_constraintStart_toStartOf="parent"
                app:layout_constraintEnd_toEndOf="parent">

                <Button
                    android:id="@+id/followButton"
                    android:layout_width="0dp"
                    android:layout_height="36dp"
                    android:layout_weight="1"
                    android:text="Follow"
                    android:textSize="14sp"
                    android:layout_marginEnd="6dp" />

                <Button
                    android:id="@+id/messageButton"
                    android:layout_width="0dp"
                    android:layout_height="36dp"
                    android:layout_weight="1"
                    android:text="Message"
                    android:textSize="14sp"
                    style="@style/Widget.Material3.Button.OutlinedButton"
                    android:layout_marginStart="6dp"
                    android:layout_marginEnd="6dp" />

                <Button
                    android:id="@+id/moreButton"
                    android:layout_width="36dp"
                    android:layout_height="36dp"
                    android:layout_marginStart="6dp"
                    style="@style/Widget.Material3.Button.OutlinedButton"
                    app:icon="@drawable/ic_more_horiz"
                    app:iconGravity="textStart"
                    app:iconPadding="0dp" />

            </LinearLayout>

            <!-- Story Highlights -->
            <TextView
                android:id="@+id/highlightsTitle"
                android:layout_width="match_parent"
                android:layout_height="wrap_content"
                android:text="Story Highlights"
                android:textAppearance="?attr/textAppearanceBodyLarge"
                android:textStyle="bold"
                android:layout_marginTop="24dp"
                app:layout_constraintTop_toBottomOf="@id/actionButtonsLayout"
                app:layout_constraintStart_toStartOf="parent" />

            <androidx.recyclerview.widget.RecyclerView
                android:id="@+id/highlightsRecyclerView"
                android:layout_width="match_parent"
                android:layout_height="wrap_content"
                android:layout_marginTop="12dp"
                android:orientation="horizontal"
                app:layoutManager="androidx.recyclerview.widget.LinearLayoutManager"
                app:layout_constraintTop_toBottomOf="@id/highlightsTitle"
                app:layout_constraintStart_toStartOf="parent"
                app:layout_constraintEnd_toEndOf="parent" />

            <!-- Content Tab Layout -->
            <com.google.android.material.tabs.TabLayout
                android:id="@+id/contentTabLayout"
                android:layout_width="match_parent"
                android:layout_height="48dp"
                android:layout_marginTop="24dp"
                app:tabMode="fixed"
                app:tabGravity="fill"
                app:tabIconTint="?attr/colorOnSurfaceVariant"
                app:tabSelectedTextColor="?attr/colorOnSurface"
                app:tabTextColor="?attr/colorOnSurfaceVariant"
                app:layout_constraintTop_toBottomOf="@id/highlightsRecyclerView"
                app:layout_constraintStart_toStartOf="parent"
                app:layout_constraintEnd_toEndOf="parent">

                <com.google.android.material.tabs.TabItem
                    android:layout_width="wrap_content"
                    android:layout_height="wrap_content"
                    android:icon="@drawable/ic_grid" />

                <com.google.android.material.tabs.TabItem
                    android:layout_width="wrap_content"
                    android:layout_height="wrap_content"
                    android:icon="@drawable/ic_video" />

                <com.google.android.material.tabs.TabItem
                    android:layout_width="wrap_content"
                    android:layout_height="wrap_content"
                    android:icon="@drawable/ic_bookmark" />

            </com.google.android.material.tabs.TabLayout>

            <!-- Content ViewPager -->
            <androidx.viewpager2.widget.ViewPager2
                android:id="@+id/contentViewPager"
                android:layout_width="match_parent"
                android:layout_height="wrap_content"
                app:layout_constraintTop_toBottomOf="@id/contentTabLayout"
                app:layout_constraintStart_toStartOf="parent"
                app:layout_constraintEnd_toEndOf="parent"
                app:layout_constraintBottom_toBottomOf="parent" />

        </androidx.constraintlayout.widget.ConstraintLayout>

    </androidx.core.widget.NestedScrollView>

</androidx.coordinatorlayout.widget.CoordinatorLayout>
```

#### Bước 2: Activity Implementation

```kotlin
// File: ProfileActivity.kt
class ProfileActivity : AppCompatActivity() {
    
    private lateinit var binding: ActivityProfileBinding
    private lateinit var highlightsAdapter: HighlightsAdapter
    private lateinit var contentPagerAdapter: ContentPagerAdapter
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityProfileBinding.inflate(layoutInflater)
        setContentView(binding.root)
        
        setupToolbar()
        setupHighlights()
        setupContentTabs()
        setupClickListeners()
        loadProfileData()
    }
    
    private fun setupToolbar() {
        setSupportActionBar(binding.toolbar)
        supportActionBar?.setDisplayHomeAsUpEnabled(true)
        
        binding.toolbar.setNavigationOnClickListener {
            onBackPressed()
        }
    }
    
    private fun setupHighlights() {
        highlightsAdapter = HighlightsAdapter { highlight ->
            // Handle highlight click
            showHighlightStory(highlight)
        }
        
        binding.highlightsRecyclerView.apply {
            adapter = highlightsAdapter
            addItemDecoration(object : RecyclerView.ItemDecoration() {
                override fun getItemOffsets(
                    outRect: Rect,
                    view: View,
                    parent: RecyclerView,
                    state: RecyclerView.State
                ) {
                    outRect.right = 16.dp
                }
            })
        }
    }
    
    private fun setupContentTabs() {
        contentPagerAdapter = ContentPagerAdapter(this)
        binding.contentViewPager.adapter = contentPagerAdapter
        
        TabLayoutMediator(binding.contentTabLayout, binding.contentViewPager) { tab, position ->
            tab.icon = ContextCompat.getDrawable(this, 
                when (position) {
                    0 -> R.drawable.ic_grid
                    1 -> R.drawable.ic_video
                    else -> R.drawable.ic_bookmark
                }
            )
        }.attach()
    }
    
    private fun setupClickListeners() {
        binding.followButton.setOnClickListener {
            toggleFollowStatus()
        }
        
        binding.messageButton.setOnClickListener {
            openMessageScreen()
        }
        
        binding.moreButton.setOnClickListener {
            showMoreOptionsDialog()
        }
        
        binding.profileAvatar.setOnClickListener {
            showProfilePictureDialog()
        }
        
        binding.websiteLink.setOnClickListener {
            openWebsite()
        }
        
        // Make stats clickable
        setupStatsClickListeners()
    }
    
    private fun setupStatsClickListeners() {
        binding.statsLayout.getChildAt(0).setOnClickListener {
            // Show posts
            binding.contentViewPager.currentItem = 0
        }
        
        binding.statsLayout.getChildAt(1).setOnClickListener {
            showFollowersList()
        }
        
        binding.statsLayout.getChildAt(2).setOnClickListener {
            showFollowingList()
        }
    }
    
    private fun loadProfileData() {
        // Simulate loading profile data
        val profileData = ProfileData(
            username = "john_doe_official",
            displayName = "John Doe",
            bio = "📱 Mobile Developer\n🎯 Android Enthusiast\n📍 Ho Chi Minh City",
            website = "www.johndoe.dev",
            postsCount = 256,
            followersCount = 12500,
            followingCount = 1845,
            isFollowing = false,
            avatarUrl = "https://example.com/avatar.jpg"
        )
        
        updateUI(profileData)
    }
    
    private fun updateUI(profile: ProfileData) {
        binding.apply {
            toolbar.title = profile.username
            displayName.text = profile.displayName
            bioText.text = profile.bio
            websiteLink.text = profile.website
            
            postsCount.text = formatCount(profile.postsCount)
            followersCount.text = formatCount(profile.followersCount)
            followingCount.text = formatCount(profile.followingCount)
            
            followButton.text = if (profile.isFollowing) "Following" else "Follow"
            followButton.icon = if (profile.isFollowing) {
                ContextCompat.getDrawable(this@ProfileActivity, R.drawable.ic_check)
            } else null
            
            // Load avatar image
            loadProfileImage(profile.avatarUrl)
        }
        
        // Load highlights data
        loadHighlights()
    }
    
    private fun formatCount(count: Int): String {
        return when {
            count >= 1_000_000 -> "${count / 1_000_000}M"
            count >= 1_000 -> "${count / 1_000}K"
            else -> count.toString()
        }
    }
    
    private fun loadProfileImage(url: String) {
        // Using Glide to load image
        Glide.with(this)
            .load(url)
            .placeholder(R.drawable.profile_placeholder)
            .error(R.drawable.profile_placeholder)
            .into(binding.profileAvatar)
    }
    
    private fun loadHighlights() {
        val highlights = listOf(
            HighlightData("Travel", R.drawable.highlight_travel),
            HighlightData("Food", R.drawable.highlight_food),
            HighlightData("Work", R.drawable.highlight_work),
            HighlightData("Fitness", R.drawable.highlight_fitness)
        )
        
        highlightsAdapter.submitList(highlights)
    }
    
    private fun toggleFollowStatus() {
        val isFollowing = binding.followButton.text == "Following"
        
        binding.followButton.apply {
            text = if (isFollowing) "Follow" else "Following"
            icon = if (!isFollowing) {
                ContextCompat.getDrawable(context, R.drawable.ic_check)
            } else null
        }
        
        // Animate follower count change
        animateFollowerCount(!isFollowing)
        
        // Show toast
        Toast.makeText(this, 
            if (!isFollowing) "Started following" else "Unfollowed", 
            Toast.LENGTH_SHORT
        ).show()
    }
    
    private fun animateFollowerCount(isFollowing: Boolean) {
        val currentCount = binding.followersCount.text.toString()
        val newCount = if (isFollowing) {
            formatCount(12501)
        } else {
            formatCount(12499)
        }
        
        ValueAnimator.ofFloat(0f, 1f).apply {
            duration = 300
            addUpdateListener { animator ->
                val progress = animator.animatedValue as Float
                if (progress > 0.5f) {
                    binding.followersCount.text = newCount
                }
            }
            start()
        }
    }
    
    private fun showHighlightStory(highlight: HighlightData) {
        // Open story viewer
        val intent = Intent(this, StoryViewerActivity::class.java)
        intent.putExtra("highlight_name", highlight.name)
        startActivity(intent)
    }
    
    private fun openMessageScreen() {
        // Open messaging interface
        val intent = Intent(this, MessageActivity::class.java)
        startActivity(intent)
    }
    
    private fun showMoreOptionsDialog() {
        val options = arrayOf("Share Profile", "Copy Link", "Report User", "Block User")
        
        AlertDialog.Builder(this)
            .setTitle("More Options")
            .setItems(options) { dialog, which ->
                when (which) {
                    0 -> shareProfile()
                    1 -> copyProfileLink()
                    2 -> reportUser()
                    3 -> blockUser()
                }
            }
            .show()
    }
    
    private fun showProfilePictureDialog() {
        // Show full screen profile picture
        val intent = Intent(this, FullScreenImageActivity::class.java)
        intent.putExtra("image_url", "https://example.com/avatar.jpg")
        
        val options = ActivityOptions.makeSceneTransitionAnimation(
            this, 
            binding.profileAvatar, 
            "profile_image"
        )
        
        startActivity(intent, options.toBundle())
    }
    
    private fun openWebsite() {
        val intent = Intent(Intent.ACTION_VIEW, Uri.parse("https://www.johndoe.dev"))
        startActivity(intent)
    }
    
    private fun showFollowersList() {
        // Show followers list activity
        val intent = Intent(this, FollowersActivity::class.java)
        intent.putExtra("type", "followers")
        startActivity(intent)
    }
    
    private fun showFollowingList() {
        // Show following list activity  
        val intent = Intent(this, FollowersActivity::class.java)
        intent.putExtra("type", "following")
        startActivity(intent)
    }
    
    private fun shareProfile() {
        val shareIntent = Intent(Intent.ACTION_SEND).apply {
            type = "text/plain"
            putExtra(Intent.EXTRA_TEXT, "Check out @john_doe_official on Instagram")
        }
        startActivity(Intent.createChooser(shareIntent, "Share Profile"))
    }
    
    private fun copyProfileLink() {
        val clipboard = getSystemService(Context.CLIPBOARD_SERVICE) as ClipboardManager
        val clip = ClipData.newPlainText("Profile Link", "https://instagram.com/john_doe_official")
        clipboard.setPrimaryClip(clip)
        
        Toast.makeText(this, "Profile link copied", Toast.LENGTH_SHORT).show()
    }
    
    private fun reportUser() {
        // Open report user screen
    }
    
    private fun blockUser() {
        AlertDialog.Builder(this)
            .setTitle("Block User")
            .setMessage("Are you sure you want to block this user?")
            .setPositiveButton("Block") { _, _ ->
                // Handle block action
                Toast.makeText(this, "User blocked", Toast.LENGTH_SHORT).show()
            }
            .setNegativeButton("Cancel", null)
            .show()
    }
    
    override fun onCreateOptionsMenu(menu: Menu?): Boolean {
        menuInflater.inflate(R.menu.profile_menu, menu)
        return true
    }
    
    override fun onOptionsItemSelected(item: MenuItem): Boolean {
        return when (item.itemId) {
            R.id.action_notifications -> {
                // Toggle notifications
                true
            }
            R.id.action_share -> {
                shareProfile()
                true
            }
            else -> super.onOptionsItemSelected(item)
        }
    }
    
    // Extension property
    private val Int.dp: Int
        get() = TypedValue.applyDimension(
            TypedValue.COMPLEX_UNIT_DIP,
            this.toFloat(),
            resources.displayMetrics
        ).toInt()
    
    // Data classes
    data class ProfileData(
        val username: String,
        val displayName: String,
        val bio: String,
        val website: String,
        val postsCount: Int,
        val followersCount: Int,
        val followingCount: Int,
        val isFollowing: Boolean,
        val avatarUrl: String
    )
    
    data class HighlightData(
        val name: String,
        val imageRes: Int
    )
}
```

#### Bước 3: Responsive Design Support

```xml
<!-- File: res/layout-land/activity_profile.xml -->
<!-- Landscape layout with adjusted spacing and layout -->
<?xml version="1.0" encoding="utf-8"?>
<androidx.coordinatorlayout.widget.CoordinatorLayout 
    xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    android:layout_width="match_parent"
    android:layout_height="match_parent">

    <!-- Similar structure but optimized for landscape -->
    <!-- Avatar smaller, stats in horizontal layout -->
    <!-- Content grid shows more columns -->

</androidx.coordinatorlayout.widget.CoordinatorLayout>
```

```xml
<!-- File: res/layout-sw600dp/activity_profile.xml -->
<!-- Tablet layout with larger spacing and components -->
```

**Giải thích implementation:**

1. **ConstraintLayout**: Flexible positioning với complex relationships
2. **Material Design 3**: Colors, typography, components theo chuẩn MD3
3. **Responsive Design**: Different layouts cho phone/tablet/landscape
4. **User Interactions**: Click handlers, animations, state management
5. **Image Loading**: Glide integration cho profile pictures
6. **Data Management**: Structured data classes và state handling

## 🔑 Những điểm quan trọng cần lưu ý

### 1. Layout Performance
- **Avoid nested LinearLayouts** - sử dụng ConstraintLayout thay thế
- **Use merge tag** khi include layouts để giảm view hierarchy depth
- **ViewStub** cho lazy loading của expensive views
- **Proper weight usage** trong LinearLayout để tránh multiple measure passes

### 2. Responsive Design Principles
- **Use dp units** cho dimensions, sp cho text sizes
- **Support different screen densities** với drawable-hdpi/xhdpi/xxhdpi
- **Guidelines và Barriers** trong ConstraintLayout cho adaptive layouts
- **Different layouts** cho portrait/landscape/tablet

### 3. Material Design Best Practices
- **Consistent color scheme** theo Material Design guidelines
- **Proper typography hierarchy** với TextAppearance styles
- **Elevation và shadows** cho depth perception
- **Accessible design** với proper content descriptions

### 4. View Binding Benefits
- **Type safety** - compile-time error detection
- **Null safety** - views luôn non-null khi binding exists
- **Performance** - faster than findViewById
- **Easy refactoring** - IDE support cho view references

### 5. Common Mistakes
- Hard-coding dimensions thay vì sử dụng resources
- Không test trên different screen sizes
- Quên handle configuration changes
- Không follow accessibility guidelines
- Overuse của RelativeLayout khi ConstraintLayout tối ưu hơn

## 📝 Bài tập về nhà

### Bài 1: E-commerce Product Detail Screen

Tạo màn hình chi tiết sản phẩm cho ứng dụng e-commerce:

**Requirements:**
- **Image Gallery**: ViewPager2 với indicator dots
- **Product Info**: Title, price, rating, description
- **Variants**: Color, size selection với chips
- **Quantity Selector**: +/- buttons với animation
- **Action Buttons**: Add to cart, Buy now, Wishlist
- **Reviews Section**: Rating distribution, user reviews
- **Related Products**: Horizontal RecyclerView

**Technical Requirements:**
- ConstraintLayout làm root layout
- Material Design 3 theming
- Support cả portrait và landscape
- Smooth scroll behavior với NestedScrollView
- Custom animations cho button interactions

### Bài 2: Chat Interface Layout

Tạo giao diện chat tương tự WhatsApp:

**Features:**
- **Message Bubbles**: Sent/received với different styling
- **Message Types**: Text, image, file, voice note
- **Input Section**: EditText, attach button, send button, voice button
- **Header**: Contact info, online status, action buttons
- **Message Status**: Sent, delivered, read indicators
- **Date Separators**: Sticky headers cho messages by date

**Advanced Requirements:**
- **Bubble layouts** với proper margins và backgrounds
- **Dynamic sizing** based on content length
- **Emoji support** trong messages
- **Reply layout** khi reply to specific message
- **Typing indicator** animation
- **Custom message time formatting**

---

*Post ID: kf1uaz36wkwd2b7*  
*Category: Android*  
*Created: 1/9/2025*  
*Updated: 1/9/2025*
