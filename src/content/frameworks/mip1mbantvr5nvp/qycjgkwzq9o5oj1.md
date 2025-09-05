---
title: "Bài 5: RecyclerView và Advanced UI Components"
postId: "qycjgkwzq9o5oj1"
category: "Android"
created: "1/9/2025"
updated: "1/9/2025"
---

# Bài 5: RecyclerView và Advanced UI Components


## 🎯 Mục tiêu bài học

Sau khi hoàn thành bài học này, học viên sẽ có thể:

- Thành thạo RecyclerView và hiểu sự khác biệt với ListView
- Tạo và tùy chỉnh Adapters, ViewHolders cho complex data types
- Sử dụng các LayoutManagers: LinearLayoutManager, GridLayoutManager, StaggeredGridLayoutManager
- Implement animations, item decorations và advanced RecyclerView features
- Làm việc với Fragments lifecycle và best practices
- Tạo dynamic UI với ViewPager2 và TabLayout
- Implement Navigation Drawer và Bottom Navigation
- Tạo custom dialogs, bottom sheets và advanced UI components

## 📝 Nội dung chi tiết

### 1. RecyclerView vs ListView

#### 1.1 Tại sao RecyclerView tốt hơn ListView

**Khái niệm RecyclerView:**

RecyclerView là modern replacement cho ListView với better performance và flexibility:

**Key Improvements:**
- **Mandatory ViewHolder Pattern**: Efficient view recycling, better performance
- **Flexible LayoutManagers**: Linear, Grid, Staggered layouts out-of-the-box  
- **Built-in Animations**: Item add/remove/change animations
- **Item Decorations**: Easy customization of item spacing, dividers
- **Better Memory Management**: Automatic view recycling when scrolling

**ViewHolder Pattern:**
- **Purpose**: Cache view references to avoid expensive findViewById calls
- **Recycling**: Views are reused as user scrolls, only data changes
- **Performance**: Significant improvement for large datasets

```kotlin
// ListView (Legacy) - Không nên sử dụng
class OldListViewActivity : AppCompatActivity() {
    
    private lateinit var listView: ListView
    private lateinit var adapter: ArrayAdapter<String>
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        listView = ListView(this)
        adapter = ArrayAdapter(this, android.R.layout.simple_list_item_1, getData())
        listView.adapter = adapter
        
        setContentView(listView)
    }
    
    private fun getData(): List<String> {
        return (1..100).map { "Item $it" }
    }
}

// RecyclerView (Modern) - Recommended approach
class ModernRecyclerViewActivity : AppCompatActivity() {
    
    private lateinit var binding: ActivityRecyclerViewBinding
    private lateinit var adapter: ItemAdapter
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityRecyclerViewBinding.inflate(layoutInflater)
        setContentView(binding.root)
        
        setupRecyclerView()
    }
    
    private fun setupRecyclerView() {
        adapter = ItemAdapter { item ->
            // Handle item click
            handleItemClick(item)
        }
        
        binding.recyclerView.apply {
            layoutManager = LinearLayoutManager(this@ModernRecyclerViewActivity)
            adapter = this@ModernRecyclerViewActivity.adapter
            
            // Performance optimizations
            setHasFixedSize(true)
            itemAnimator = DefaultItemAnimator()
            
            // Add divider
            addItemDecoration(
                DividerItemDecoration(context, DividerItemDecoration.VERTICAL)
            )
        }
        
        // Load data
        adapter.submitList(generateData())
    }
    
    private fun generateData(): List<ItemData> {
        return (1..100).map { 
            ItemData(
                id = it,
                title = "Item $it",
                subtitle = "Description for item $it",
                timestamp = System.currentTimeMillis()
            )
        }
    }
    
    private fun handleItemClick(item: ItemData) {
        Toast.makeText(this, "Clicked: ${item.title}", Toast.LENGTH_SHORT).show()
    }
}
```

**Ưu điểm của RecyclerView:**
- **ViewHolder Pattern**: Bắt buộc sử dụng, tăng performance
- **Flexible LayoutManager**: Linear, Grid, Staggered layouts
- **Item Animations**: Built-in animations cho add/remove/change
- **Item Decorations**: Dividers, spacing, custom decorations
- **Better Memory Management**: Efficient view recycling
- **Extensible**: Dễ customize và extend

### 2. RecyclerView Adapter và ViewHolder

#### 2.1 Basic Adapter Implementation

**Khái niệm Adapter Pattern trong RecyclerView:**

Adapter acts as bridge between data source và RecyclerView:

**Key Components:**
- **Adapter**: Manages data và creates ViewHolders
- **ViewHolder**: Holds references to item view components
- **DiffUtil**: Efficiently calculate differences between data sets
- **ListAdapter**: Simplified adapter với built-in DiffUtil support

**Data Flow:**
1. Adapter receives data changes
2. Creates/recycles ViewHolder instances  
3. Binds data to ViewHolder views
4. RecyclerView displays updated items

```kotlin
// Data class cho items
data class NewsItem(
    val id: Int,
    val title: String,
    val description: String,
    val imageUrl: String,
    val author: String,
    val publishedAt: Long,
    val category: String,
    val isBookmarked: Boolean = false
)

// ViewHolder class
class NewsViewHolder(
    private val binding: ItemNewsBinding,
    private val onItemClick: (NewsItem) -> Unit,
    private val onBookmarkClick: (NewsItem) -> Unit
) : RecyclerView.ViewHolder(binding.root) {
    
    fun bind(item: NewsItem) {
        binding.apply {
            titleText.text = item.title
            descriptionText.text = item.description
            authorText.text = item.author
            categoryChip.text = item.category
            publishedText.text = formatDate(item.publishedAt)
            
            // Load image
            Glide.with(itemView.context)
                .load(item.imageUrl)
                .placeholder(R.drawable.placeholder_image)
                .error(R.drawable.error_image)
                .centerCrop()
                .into(newsImage)
            
            // Bookmark state
            bookmarkButton.setImageResource(
                if (item.isBookmarked) R.drawable.ic_bookmark_filled
                else R.drawable.ic_bookmark_outline
            )
            
            // Click listeners
            root.setOnClickListener { onItemClick(item) }
            bookmarkButton.setOnClickListener { onBookmarkClick(item) }
            
            // Category chip color
            val categoryColor = getCategoryColor(item.category)
            categoryChip.setChipBackgroundColor(ColorStateList.valueOf(categoryColor))
        }
    }
    
    private fun formatDate(timestamp: Long): String {
        val now = System.currentTimeMillis()
        val diff = now - timestamp
        
        return when {
            diff < 3600000 -> "${diff / 60000}m ago" // Minutes
            diff < 86400000 -> "${diff / 3600000}h ago" // Hours  
            else -> SimpleDateFormat("MMM dd", Locale.getDefault()).format(Date(timestamp))
        }
    }
    
    private fun getCategoryColor(category: String): Int {
        return when (category.lowercase()) {
            "technology" -> Color.parseColor("#2196F3")
            "sports" -> Color.parseColor("#4CAF50")
            "entertainment" -> Color.parseColor("#FF9800")
            "business" -> Color.parseColor("#9C27B0")
            else -> Color.parseColor("#757575")
        }
    }
}

// Adapter class với DiffUtil
class NewsAdapter(
    private val onItemClick: (NewsItem) -> Unit,
    private val onBookmarkClick: (NewsItem) -> Unit
) : ListAdapter<NewsItem, NewsViewHolder>(NewsDiffCallback()) {
    
    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): NewsViewHolder {
        val binding = ItemNewsBinding.inflate(
            LayoutInflater.from(parent.context),
            parent,
            false
        )
        return NewsViewHolder(binding, onItemClick, onBookmarkClick)
    }
    
    override fun onBindViewHolder(holder: NewsViewHolder, position: Int) {
        holder.bind(getItem(position))
    }
    
    // Optional: Handle payloads for efficient partial updates
    override fun onBindViewHolder(
        holder: NewsViewHolder,
        position: Int,
        payloads: MutableList<Any>
    ) {
        if (payloads.isEmpty()) {
            super.onBindViewHolder(holder, position, payloads)
        } else {
            // Handle partial updates
            val item = getItem(position)
            payloads.forEach { payload ->
                when (payload) {
                    "bookmark" -> holder.updateBookmarkState(item.isBookmarked)
                }
            }
        }
    }
}

// DiffUtil Callback cho efficient updates
class NewsDiffCallback : DiffUtil.ItemCallback<NewsItem>() {
    override fun areItemsTheSame(oldItem: NewsItem, newItem: NewsItem): Boolean {
        return oldItem.id == newItem.id
    }
    
    override fun areContentsTheSame(oldItem: NewsItem, newItem: NewsItem): Boolean {
        return oldItem == newItem
    }
    
    // Optional: Return payload for partial updates
    override fun getChangePayload(oldItem: NewsItem, newItem: NewsItem): Any? {
        return when {
            oldItem.isBookmarked != newItem.isBookmarked -> "bookmark"
            else -> null
        }
    }
}

// Extension function cho NewsViewHolder
fun NewsViewHolder.updateBookmarkState(isBookmarked: Boolean) {
    binding.bookmarkButton.setImageResource(
        if (isBookmarked) R.drawable.ic_bookmark_filled
        else R.drawable.ic_bookmark_outline
    )
}
```

#### 2.2 Layout cho News Item

```xml
<!-- File: res/layout/item_news.xml -->
<?xml version="1.0" encoding="utf-8"?>
<com.google.android.material.card.MaterialCardView 
    xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="match_parent"
    android:layout_height="wrap_content"
    android:layout_marginHorizontal="16dp"
    android:layout_marginVertical="8dp"
    app:cardCornerRadius="12dp"
    app:cardElevation="2dp"
    app:strokeWidth="0dp">

    <androidx.constraintlayout.widget.ConstraintLayout
        android:layout_width="match_parent"
        android:layout_height="wrap_content"
        android:padding="16dp">

        <!-- News Image -->
        <ImageView
            android:id="@+id/newsImage"
            android:layout_width="80dp"
            android:layout_height="80dp"
            android:scaleType="centerCrop"
            android:background="@drawable/rounded_corner_background"
            app:layout_constraintStart_toStartOf="parent"
            app:layout_constraintTop_toTopOf="parent"
            tools:src="@tools:sample/backgrounds/scenic" />

        <!-- Category Chip -->
        <com.google.android.material.chip.Chip
            android:id="@+id/categoryChip"
            style="@style/Widget.Material3.Chip.Assist"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:layout_marginStart="12dp"
            android:textSize="10sp"
            app:chipMinHeight="24dp"
            app:layout_constraintStart_toEndOf="@id/newsImage"
            app:layout_constraintTop_toTopOf="parent"
            tools:text="Technology" />

        <!-- Bookmark Button -->
        <ImageButton
            android:id="@+id/bookmarkButton"
            android:layout_width="32dp"
            android:layout_height="32dp"
            android:background="?attr/selectableItemBackgroundBorderless"
            android:src="@drawable/ic_bookmark_outline"
            android:contentDescription="Bookmark article"
            app:layout_constraintEnd_toEndOf="parent"
            app:layout_constraintTop_toTopOf="parent" />

        <!-- Title -->
        <TextView
            android:id="@+id/titleText"
            android:layout_width="0dp"
            android:layout_height="wrap_content"
            android:layout_marginStart="12dp"
            android:layout_marginTop="8dp"
            android:layout_marginEnd="8dp"
            android:textAppearance="?attr/textAppearanceBodyLarge"
            android:textStyle="bold"
            android:maxLines="2"
            android:ellipsize="end"
            app:layout_constraintStart_toEndOf="@id/newsImage"
            app:layout_constraintTop_toBottomOf="@id/categoryChip"
            app:layout_constraintEnd_toStartOf="@id/bookmarkButton"
            tools:text="Breaking: New Android Features Announced at Google I/O 2024" />

        <!-- Description -->
        <TextView
            android:id="@+id/descriptionText"
            android:layout_width="0dp"
            android:layout_height="wrap_content"
            android:layout_marginStart="12dp"
            android:layout_marginTop="4dp"
            android:layout_marginEnd="8dp"
            android:textAppearance="?attr/textAppearanceBodySmall"
            android:textColor="?attr/colorOnSurfaceVariant"
            android:maxLines="2"
            android:ellipsize="end"
            app:layout_constraintStart_toEndOf="@id/newsImage"
            app:layout_constraintTop_toBottomOf="@id/titleText"
            app:layout_constraintEnd_toStartOf="@id/bookmarkButton"
            tools:text="Google announces exciting new features for Android developers including improved performance and new APIs" />

        <!-- Metadata Layout -->
        <LinearLayout
            android:layout_width="0dp"
            android:layout_height="wrap_content"
            android:layout_marginTop="8dp"
            android:orientation="horizontal"
            android:gravity="center_vertical"
            app:layout_constraintStart_toStartOf="parent"
            app:layout_constraintTop_toBottomOf="@id/newsImage"
            app:layout_constraintEnd_toEndOf="parent">

            <!-- Author -->
            <TextView
                android:id="@+id/authorText"
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:textAppearance="?attr/textAppearanceBodySmall"
                android:textColor="?attr/colorPrimary"
                android:drawableStart="@drawable/ic_person"
                android:drawablePadding="4dp"
                android:drawableTint="?attr/colorPrimary"
                tools:text="John Doe" />

            <!-- Separator -->
            <View
                android:layout_width="4dp"
                android:layout_height="4dp"
                android:layout_marginHorizontal="8dp"
                android:background="@drawable/circle_dot"
                android:backgroundTint="?attr/colorOnSurfaceVariant" />

            <!-- Published Time -->
            <TextView
                android:id="@+id/publishedText"
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:textAppearance="?attr/textAppearanceBodySmall"
                android:textColor="?attr/colorOnSurfaceVariant"
                tools:text="2h ago" />

            <!-- Spacer -->
            <View
                android:layout_width="0dp"
                android:layout_height="1dp"
                android:layout_weight="1" />

            <!-- Share Button -->
            <ImageButton
                android:id="@+id/shareButton"
                android:layout_width="32dp"
                android:layout_height="32dp"
                android:background="?attr/selectableItemBackgroundBorderless"
                android:src="@drawable/ic_share"
                android:contentDescription="Share article" />

        </LinearLayout>

    </androidx.constraintlayout.widget.ConstraintLayout>

</com.google.android.material.card.MaterialCardView>
```

### 3. LayoutManagers

**Khái niệm LayoutManagers:**

LayoutManagers control how items are positioned trong RecyclerView:

**Types:**
- **LinearLayoutManager**: Arrange items trong single direction (vertical/horizontal)
- **GridLayoutManager**: Arrange items trong grid pattern (like table)
- **StaggeredGridLayoutManager**: Staggered grid với variable item sizes
- **Custom LayoutManagers**: Create completely custom layouts

**Key Features:**
- **Orientation**: Control direction (vertical, horizontal)
- **Span Count**: Number of columns trong grid layouts
- **Reverse Layout**: Display items trong reverse order
- **Stack From End**: Start layout from end instead of beginning

**Customization:**
- **Item Spacing**: Control gaps between items
- **Decoration**: Add dividers, margins, backgrounds
- **Animation**: Smooth transitions when layout changes

#### 3.1 LinearLayoutManager với diverse orientations

```kotlin
class LayoutManagerActivity : AppCompatActivity() {
    
    private lateinit var binding: ActivityLayoutManagerBinding
    private lateinit var adapter: UniversalAdapter
    private val items = mutableListOf<DisplayItem>()
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityLayoutManagerBinding.inflate(layoutInflater)
        setContentView(binding.root)
        
        setupAdapter()
        setupLayoutManagerSwitcher()
        loadSampleData()
    }
    
    private fun setupAdapter() {
        adapter = UniversalAdapter { item ->
            Toast.makeText(this, "Clicked: ${item.title}", Toast.LENGTH_SHORT).show()
        }
        
        binding.recyclerView.adapter = adapter
    }
    
    private fun setupLayoutManagerSwitcher() {
        binding.layoutSwitcher.setOnCheckedChangeListener { _, checkedId ->
            when (checkedId) {
                R.id.linearVertical -> setLinearLayoutManager(RecyclerView.VERTICAL)
                R.id.linearHorizontal -> setLinearLayoutManager(RecyclerView.HORIZONTAL)
                R.id.gridLayout -> setGridLayoutManager()
                R.id.staggeredLayout -> setStaggeredGridLayoutManager()
            }
        }
        
        // Default to vertical linear
        binding.linearVertical.isChecked = true
    }
    
    private fun setLinearLayoutManager(orientation: Int) {
        val layoutManager = LinearLayoutManager(this, orientation, false)
        binding.recyclerView.layoutManager = layoutManager
        
        // Update adapter view type based on orientation
        adapter.viewType = if (orientation == RecyclerView.HORIZONTAL) {
            UniversalAdapter.VIEW_TYPE_HORIZONTAL
        } else {
            UniversalAdapter.VIEW_TYPE_VERTICAL
        }
        
        updateItemDecorations(orientation)
    }
    
    private fun setGridLayoutManager() {
        val spanCount = resources.getInteger(R.integer.grid_span_count)
        val layoutManager = GridLayoutManager(this, spanCount)
        
        // Custom span size for different item types
        layoutManager.spanSizeLookup = object : GridLayoutManager.SpanSizeLookup() {
            override fun getSpanSize(position: Int): Int {
                return when (adapter.getItemViewType(position)) {
                    UniversalAdapter.VIEW_TYPE_HEADER -> spanCount // Full width
                    UniversalAdapter.VIEW_TYPE_GRID -> 1 // Single column
                    else -> spanCount
                }
            }
        }
        
        binding.recyclerView.layoutManager = layoutManager
        adapter.viewType = UniversalAdapter.VIEW_TYPE_GRID
        
        updateItemDecorations(RecyclerView.VERTICAL)
    }
    
    private fun setStaggeredGridLayoutManager() {
        val spanCount = 2
        val layoutManager = StaggeredGridLayoutManager(
            spanCount, 
            StaggeredGridLayoutManager.VERTICAL
        )
        
        // Prevent item gaps
        layoutManager.gapStrategy = StaggeredGridLayoutManager.GAP_HANDLING_MOVE_ITEMS_BETWEEN_SPANS
        
        binding.recyclerView.layoutManager = layoutManager
        adapter.viewType = UniversalAdapter.VIEW_TYPE_STAGGERED
        
        updateItemDecorations(RecyclerView.VERTICAL)
    }
    
    private fun updateItemDecorations(orientation: Int) {
        // Remove existing decorations
        while (binding.recyclerView.itemDecorationCount > 0) {
            binding.recyclerView.removeItemDecorationAt(0)
        }
        
        // Add appropriate decoration
        when (orientation) {
            RecyclerView.HORIZONTAL -> {
                binding.recyclerView.addItemDecoration(
                    SpacingItemDecoration(horizontal = 12.dp)
                )
            }
            RecyclerView.VERTICAL -> {
                binding.recyclerView.addItemDecoration(
                    SpacingItemDecoration(vertical = 8.dp)
                )
            }
        }
    }
    
    private fun loadSampleData() {
        val sampleItems = mutableListOf<DisplayItem>()
        
        // Add header
        sampleItems.add(
            DisplayItem(
                id = -1,
                type = DisplayItem.Type.HEADER,
                title = "Sample Items",
                description = "Various content types"
            )
        )
        
        // Add regular items with varying content length
        repeat(20) { index ->
            sampleItems.add(
                DisplayItem(
                    id = index,
                    type = DisplayItem.Type.CONTENT,
                    title = "Item ${index + 1}",
                    description = generateRandomDescription(),
                    imageUrl = "https://picsum.photos/300/200?random=$index"
                )
            )
        }
        
        items.clear()
        items.addAll(sampleItems)
        adapter.submitList(items.toList())
    }
    
    private fun generateRandomDescription(): String {
        val descriptions = listOf(
            "Short description",
            "This is a medium length description that provides more context about the item",
            "This is a very long description that contains multiple sentences and provides detailed information about the item. It demonstrates how the layout adapts to different content lengths and maintains proper spacing and alignment throughout the interface.",
            "Another description",
            "Longer content here with multiple lines to show how the staggered grid layout handles different heights effectively"
        )
        return descriptions.random()
    }
    
    private val Int.dp: Int
        get() = TypedValue.applyDimension(
            TypedValue.COMPLEX_UNIT_DIP,
            this.toFloat(),
            resources.displayMetrics
        ).toInt()
}

// Custom ItemDecoration cho spacing
class SpacingItemDecoration(
    private val horizontal: Int = 0,
    private val vertical: Int = 0
) : RecyclerView.ItemDecoration() {
    
    override fun getItemOffsets(
        outRect: Rect,
        view: View,
        parent: RecyclerView,
        state: RecyclerView.State
    ) {
        outRect.left = horizontal
        outRect.right = horizontal
        outRect.top = vertical
        outRect.bottom = vertical
    }
}
```

#### 3.2 Universal Adapter cho multiple view types

```kotlin
// Data model
data class DisplayItem(
    val id: Int,
    val type: Type,
    val title: String,
    val description: String = "",
    val imageUrl: String = ""
) {
    enum class Type { HEADER, CONTENT }
}

// Universal Adapter supporting multiple layouts
class UniversalAdapter(
    private val onItemClick: (DisplayItem) -> Unit
) : ListAdapter<DisplayItem, RecyclerView.ViewHolder>(DisplayItemDiffCallback()) {
    
    var viewType: Int = VIEW_TYPE_VERTICAL
        set(value) {
            field = value
            notifyDataSetChanged()
        }
    
    companion object {
        const val VIEW_TYPE_HEADER = 0
        const val VIEW_TYPE_VERTICAL = 1
        const val VIEW_TYPE_HORIZONTAL = 2
        const val VIEW_TYPE_GRID = 3
        const val VIEW_TYPE_STAGGERED = 4
    }
    
    override fun getItemViewType(position: Int): Int {
        return when (getItem(position).type) {
            DisplayItem.Type.HEADER -> VIEW_TYPE_HEADER
            DisplayItem.Type.CONTENT -> viewType
        }
    }
    
    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): RecyclerView.ViewHolder {
        return when (viewType) {
            VIEW_TYPE_HEADER -> HeaderViewHolder.create(parent)
            VIEW_TYPE_HORIZONTAL -> HorizontalItemViewHolder.create(parent, onItemClick)
            VIEW_TYPE_GRID -> GridItemViewHolder.create(parent, onItemClick)
            VIEW_TYPE_STAGGERED -> StaggeredItemViewHolder.create(parent, onItemClick)
            else -> VerticalItemViewHolder.create(parent, onItemClick)
        }
    }
    
    override fun onBindViewHolder(holder: RecyclerView.ViewHolder, position: Int) {
        val item = getItem(position)
        when (holder) {
            is HeaderViewHolder -> holder.bind(item)
            is VerticalItemViewHolder -> holder.bind(item)
            is HorizontalItemViewHolder -> holder.bind(item)
            is GridItemViewHolder -> holder.bind(item)
            is StaggeredItemViewHolder -> holder.bind(item)
        }
    }
}

// Header ViewHolder
class HeaderViewHolder(
    private val binding: ItemHeaderBinding
) : RecyclerView.ViewHolder(binding.root) {
    
    fun bind(item: DisplayItem) {
        binding.headerTitle.text = item.title
        binding.headerSubtitle.text = item.description
    }
    
    companion object {
        fun create(parent: ViewGroup): HeaderViewHolder {
            val binding = ItemHeaderBinding.inflate(
                LayoutInflater.from(parent.context),
                parent,
                false
            )
            return HeaderViewHolder(binding)
        }
    }
}

// Vertical Item ViewHolder
class VerticalItemViewHolder(
    private val binding: ItemVerticalBinding,
    private val onItemClick: (DisplayItem) -> Unit
) : RecyclerView.ViewHolder(binding.root) {
    
    fun bind(item: DisplayItem) {
        binding.apply {
            titleText.text = item.title
            descriptionText.text = item.description
            
            // Load image if available
            if (item.imageUrl.isNotEmpty()) {
                itemImage.visibility = View.VISIBLE
                Glide.with(itemView.context)
                    .load(item.imageUrl)
                    .centerCrop()
                    .into(itemImage)
            } else {
                itemImage.visibility = View.GONE
            }
            
            root.setOnClickListener { onItemClick(item) }
        }
    }
    
    companion object {
        fun create(parent: ViewGroup, onItemClick: (DisplayItem) -> Unit): VerticalItemViewHolder {
            val binding = ItemVerticalBinding.inflate(
                LayoutInflater.from(parent.context),
                parent,
                false
            )
            return VerticalItemViewHolder(binding, onItemClick)
        }
    }
}

// Similar implementations for other ViewHolders...
// HorizontalItemViewHolder, GridItemViewHolder, StaggeredItemViewHolder
```

### 4. RecyclerView Animations và Effects

**Khái niệm RecyclerView Animations:**

Animations provide visual feedback khi data changes trong RecyclerView:

**Built-in Animations:**
- **DefaultItemAnimator**: Standard animations for add/remove/move/change
- **Fade animations**: Items fade in/out
- **Slide animations**: Items slide from sides
- **Scale animations**: Items grow/shrink

**Animation Types:**
- **Add Animation**: When new items are inserted
- **Remove Animation**: When items are deleted
- **Move Animation**: When items are reordered
- **Change Animation**: When item content updates

**Custom Animations:**
- **Custom ItemAnimator**: Override default behavior
- **View Animations**: Animate individual view properties
- **Transition Animations**: Smooth transitions between states
- **Performance**: Balance visual appeal với smooth performance

#### 4.1 Custom Item Animations

```kotlin
class CustomItemAnimator : DefaultItemAnimator() {
    
    override fun animateAdd(holder: RecyclerView.ViewHolder?): Boolean {
        holder?.itemView?.apply {
            // Start from transparent and small
            alpha = 0f
            scaleX = 0.8f
            scaleY = 0.8f
            
            // Animate to normal state
            animate()
                .alpha(1f)
                .scaleX(1f)
                .scaleY(1f)
                .setDuration(300)
                .setInterpolator(OvershootInterpolator())
                .start()
        }
        return super.animateAdd(holder)
    }
    
    override fun animateRemove(holder: RecyclerView.ViewHolder?): Boolean {
        holder?.itemView?.apply {
            animate()
                .alpha(0f)
                .scaleX(0.8f)
                .scaleY(0.8f)
                .translationX(-width.toFloat())
                .setDuration(300)
                .setInterpolator(AccelerateInterpolator())
                .withEndAction {
                    // Reset values after animation
                    alpha = 1f
                    scaleX = 1f
                    scaleY = 1f
                    translationX = 0f
                }
                .start()
        }
        return super.animateRemove(holder)
    }
    
    override fun animateMove(
        holder: RecyclerView.ViewHolder?,
        fromX: Int, fromY: Int,
        toX: Int, toY: Int
    ): Boolean {
        holder?.itemView?.apply {
            // Add bounce effect during move
            animate()
                .setDuration(300)
                .setInterpolator(BounceInterpolator())
                .start()
        }
        return super.animateMove(holder, fromX, fromY, toX, toY)
    }
}

// Usage trong Activity
binding.recyclerView.itemAnimator = CustomItemAnimator()
```

#### 4.2 Pull-to-Refresh và Loading States

```kotlin
class NewsListActivity : AppCompatActivity() {
    
    private lateinit var binding: ActivityNewsListBinding
    private lateinit var newsAdapter: NewsAdapter
    private lateinit var viewModel: NewsViewModel
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityNewsListBinding.inflate(layoutInflater)
        setContentView(binding.root)
        
        setupRecyclerView()
        setupSwipeRefresh()
        setupPagination()
        observeViewModel()
        
        // Initial load
        viewModel.loadNews()
    }
    
    private fun setupRecyclerView() {
        newsAdapter = NewsAdapter(
            onItemClick = { newsItem ->
                openNewsDetail(newsItem)
            },
            onBookmarkClick = { newsItem ->
                viewModel.toggleBookmark(newsItem)
            }
        )
        
        binding.recyclerView.apply {
            adapter = newsAdapter
            layoutManager = LinearLayoutManager(this@NewsListActivity)
            
            // Add loading footer
            addFooterAdapter()
        }
    }
    
    private fun addFooterAdapter() {
        val footerAdapter = LoadingFooterAdapter()
        val concatAdapter = ConcatAdapter(
            newsAdapter,
            footerAdapter
        )
        binding.recyclerView.adapter = concatAdapter
    }
    
    private fun setupSwipeRefresh() {
        binding.swipeRefreshLayout.apply {
            setColorSchemeResources(
                R.color.primary_color,
                R.color.secondary_color,
                R.color.accent_color
            )
            
            setOnRefreshListener {
                viewModel.refreshNews()
            }
        }
    }
    
    private fun setupPagination() {
        binding.recyclerView.addOnScrollListener(object : RecyclerView.OnScrollListener() {
            override fun onScrolled(recyclerView: RecyclerView, dx: Int, dy: Int) {
                super.onScrolled(recyclerView, dx, dy)
                
                val layoutManager = recyclerView.layoutManager as LinearLayoutManager
                val visibleItemCount = layoutManager.childCount
                val totalItemCount = layoutManager.itemCount
                val firstVisibleItemPosition = layoutManager.findFirstVisibleItemPosition()
                
                // Load more when near the end
                if (!viewModel.isLoading.value!! && 
                    (visibleItemCount + firstVisibleItemPosition) >= totalItemCount - 5) {
                    viewModel.loadMoreNews()
                }
            }
        })
    }
    
    private fun observeViewModel() {
        viewModel.newsItems.observe(this) { newsItems ->
            newsAdapter.submitList(newsItems)
        }
        
        viewModel.isLoading.observe(this) { isLoading ->
            binding.swipeRefreshLayout.isRefreshing = isLoading
        }
        
        viewModel.error.observe(this) { error ->
            error?.let {
                showErrorSnackbar(it)
            }
        }
    }
    
    private fun showErrorSnackbar(message: String) {
        Snackbar.make(binding.root, message, Snackbar.LENGTH_LONG)
            .setAction("Retry") {
                viewModel.retryLastOperation()
            }
            .show()
    }
}

// Loading Footer Adapter
class LoadingFooterAdapter : RecyclerView.Adapter<LoadingFooterViewHolder>() {
    
    private var isLoading = false
    
    fun setLoading(loading: Boolean) {
        if (isLoading != loading) {
            isLoading = loading
            if (loading) {
                notifyItemInserted(0)
            } else {
                notifyItemRemoved(0)
            }
        }
    }
    
    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): LoadingFooterViewHolder {
        val binding = ItemLoadingFooterBinding.inflate(
            LayoutInflater.from(parent.context),
            parent,
            false
        )
        return LoadingFooterViewHolder(binding)
    }
    
    override fun onBindViewHolder(holder: LoadingFooterViewHolder, position: Int) {
        holder.bind()
    }
    
    override fun getItemCount(): Int = if (isLoading) 1 else 0
}

class LoadingFooterViewHolder(
    private val binding: ItemLoadingFooterBinding
) : RecyclerView.ViewHolder(binding.root) {
    
    fun bind() {
        binding.progressBar.visibility = View.VISIBLE
        binding.loadingText.text = "Loading more..."
    }
}
```

### 5. Fragments Deep Dive

**Khái niệm Fragments:**

Fragments là reusable UI components representing portion của user interface:

**Core Concepts:**
- **Modular UI**: Break complex screens into manageable pieces
- **Reusability**: Use same fragment trong multiple activities
- **Lifecycle Management**: Independent lifecycle linked to host activity
- **Back Stack**: Navigation support với fragment transactions

**Fragment Lifecycle:**
- **onAttach()**: Fragment attached to activity
- **onCreate()**: Fragment instance created
- **onCreateView()**: Fragment UI created
- **onViewCreated()**: View setup after creation
- **onStart()/onResume()**: Fragment becomes visible/interactive
- **onPause()/onStop()**: Fragment loses focus/visibility
- **onDestroyView()**: View hierarchy destroyed
- **onDestroy()**: Fragment instance destroyed
- **onDetach()**: Fragment detached from activity

**Best Practices:**
- **ViewBinding**: Avoid memory leaks với proper binding cleanup
- **ViewModel**: Share data between fragments và survive configuration changes
- **Communication**: Use interfaces hoặc shared ViewModel for fragment communication

#### 5.1 Fragment Lifecycle và Best Practices

```kotlin
class NewsFragment : Fragment() {
    
    private var _binding: FragmentNewsBinding? = null
    private val binding get() = _binding!!
    
    private lateinit var newsAdapter: NewsAdapter
    private val viewModel: NewsViewModel by viewModels()
    
    // Lifecycle methods theo thứ tự
    override fun onAttach(context: Context) {
        super.onAttach(context)
        Log.d(TAG, "onAttach")
    }
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        Log.d(TAG, "onCreate")
        
        // Initialize non-UI components
        setupAdapter()
    }
    
    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        Log.d(TAG, "onCreateView")
        _binding = FragmentNewsBinding.inflate(inflater, container, false)
        return binding.root
    }
    
    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        Log.d(TAG, "onViewCreated")
        
        setupRecyclerView()
        setupSwipeRefresh()
        observeViewModel()
        
        // Load data if not already loaded
        if (savedInstanceState == null) {
            viewModel.loadNews()
        }
    }
    
    override fun onStart() {
        super.onStart()
        Log.d(TAG, "onStart")
    }
    
    override fun onResume() {
        super.onResume()
        Log.d(TAG, "onResume")
        
        // Refresh data if needed
        if (shouldRefreshData()) {
            viewModel.refreshNews()
        }
    }
    
    override fun onPause() {
        super.onPause()
        Log.d(TAG, "onPause")
        
        // Save current state if needed
        saveScrollPosition()
    }
    
    override fun onStop() {
        super.onStop()
        Log.d(TAG, "onStop")
    }
    
    override fun onDestroyView() {
        super.onDestroyView()
        Log.d(TAG, "onDestroyView")
        
        // Clean up UI references
        _binding = null
    }
    
    override fun onDestroy() {
        super.onDestroy()
        Log.d(TAG, "onDestroy")
    }
    
    override fun onDetach() {
        super.onDetach()
        Log.d(TAG, "onDetach")
    }
    
    private fun setupAdapter() {
        newsAdapter = NewsAdapter(
            onItemClick = { newsItem ->
                findNavController().navigate(
                    NewsFragmentDirections.actionNewsToDetail(newsItem.id)
                )
            },
            onBookmarkClick = { newsItem ->
                viewModel.toggleBookmark(newsItem)
            }
        )
    }
    
    private fun setupRecyclerView() {
        binding.recyclerView.apply {
            adapter = newsAdapter
            layoutManager = LinearLayoutManager(requireContext())
            
            // Restore scroll position
            restoreScrollPosition()
        }
    }
    
    private fun setupSwipeRefresh() {
        binding.swipeRefreshLayout.setOnRefreshListener {
            viewModel.refreshNews()
        }
    }
    
    private fun observeViewModel() {
        viewModel.newsItems.observe(viewLifecycleOwner) { newsItems ->
            newsAdapter.submitList(newsItems)
            updateEmptyState(newsItems.isEmpty())
        }
        
        viewModel.isLoading.observe(viewLifecycleOwner) { isLoading ->
            binding.swipeRefreshLayout.isRefreshing = isLoading
        }
        
        viewModel.error.observe(viewLifecycleOwner) { error ->
            error?.let { showError(it) }
        }
    }
    
    private fun updateEmptyState(isEmpty: Boolean) {
        binding.emptyStateLayout.visibility = if (isEmpty) View.VISIBLE else View.GONE
        binding.recyclerView.visibility = if (isEmpty) View.GONE else View.VISIBLE
    }
    
    private fun showError(message: String) {
        Snackbar.make(binding.root, message, Snackbar.LENGTH_LONG)
            .setAction("Retry") {
                viewModel.retryLastOperation()
            }
            .show()
    }
    
    private fun shouldRefreshData(): Boolean {
        // Check if data is stale
        return viewModel.isDataStale()
    }
    
    private fun saveScrollPosition() {
        val layoutManager = binding.recyclerView.layoutManager as? LinearLayoutManager
        layoutManager?.let {
            val position = it.findFirstVisibleItemPosition()
            val offset = it.findViewByPosition(position)?.top ?: 0
            
            // Save to SharedPreferences or ViewModel
            viewModel.saveScrollPosition(position, offset)
        }
    }
    
    private fun restoreScrollPosition() {
        val (position, offset) = viewModel.getScrollPosition()
        if (position >= 0) {
            val layoutManager = binding.recyclerView.layoutManager as LinearLayoutManager
            layoutManager.scrollToPositionWithOffset(position, offset)
        }
    }
    
    companion object {
        private const val TAG = "NewsFragment"
        
        fun newInstance(): NewsFragment {
            return NewsFragment()
        }
    }
}
```

#### 5.2 Fragment Communication

```kotlin
// Shared ViewModel approach
class SharedDataViewModel : ViewModel() {
    
    private val _selectedCategory = MutableLiveData<String>()
    val selectedCategory: LiveData<String> = _selectedCategory
    
    private val _filterOptions = MutableLiveData<FilterOptions>()
    val filterOptions: LiveData<FilterOptions> = _filterOptions
    
    fun selectCategory(category: String) {
        _selectedCategory.value = category
    }
    
    fun updateFilters(filters: FilterOptions) {
        _filterOptions.value = filters
    }
}

// Parent Fragment with child fragments
class MainNewsFragment : Fragment() {
    
    private var _binding: FragmentMainNewsBinding? = null
    private val binding get() = _binding!!
    
    private val sharedViewModel: SharedDataViewModel by activityViewModels()
    
    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentMainNewsBinding.inflate(inflater, container, false)
        return binding.root
    }
    
    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        
        setupChildFragments()
        observeSharedData()
    }
    
    private fun setupChildFragments() {
        val categoriesFragment = CategoriesFragment()
        val newsListFragment = NewsListFragment()
        
        childFragmentManager.beginTransaction()
            .replace(R.id.categoriesContainer, categoriesFragment)
            .replace(R.id.newsListContainer, newsListFragment)
            .commit()
    }
    
    private fun observeSharedData() {
        sharedViewModel.selectedCategory.observe(viewLifecycleOwner) { category ->
            // React to category selection
            updateNewsForCategory(category)
        }
    }
    
    private fun updateNewsForCategory(category: String) {
        // Update news list based on selected category
        val newsListFragment = childFragmentManager
            .findFragmentById(R.id.newsListContainer) as? NewsListFragment
        newsListFragment?.filterByCategory(category)
    }
}

// Categories Fragment
class CategoriesFragment : Fragment() {
    
    private var _binding: FragmentCategoriesBinding? = null
    private val binding get() = _binding!!
    
    private val sharedViewModel: SharedDataViewModel by activityViewModels()
    private lateinit var categoriesAdapter: CategoriesAdapter
    
    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentCategoriesBinding.inflate(inflater, container, false)
        return binding.root
    }
    
    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        
        setupCategoriesRecyclerView()
        loadCategories()
    }
    
    private fun setupCategoriesRecyclerView() {
        categoriesAdapter = CategoriesAdapter { category ->
            // Notify parent through shared ViewModel
            sharedViewModel.selectCategory(category.name)
        }
        
        binding.categoriesRecyclerView.apply {
            adapter = categoriesAdapter
            layoutManager = LinearLayoutManager(
                requireContext(),
                LinearLayoutManager.HORIZONTAL,
                false
            )
        }
    }
    
    private fun loadCategories() {
        val categories = listOf(
            Category("All", true),
            Category("Technology", false),
            Category("Sports", false),
            Category("Entertainment", false),
            Category("Business", false)
        )
        
        categoriesAdapter.submitList(categories)
    }
}

// Interface-based communication (alternative approach)
interface OnCategorySelectedListener {
    fun onCategorySelected(category: String)
}

class CategoriesFragment2 : Fragment() {
    
    private var listener: OnCategorySelectedListener? = null
    
    override fun onAttach(context: Context) {
        super.onAttach(context)
        listener = when {
            context is OnCategorySelectedListener -> context
            parentFragment is OnCategorySelectedListener -> parentFragment as OnCategorySelectedListener
            else -> throw RuntimeException("$context must implement OnCategorySelectedListener")
        }
    }
    
    override fun onDetach() {
        super.onDetach()
        listener = null
    }
    
    private fun onCategoryClicked(category: String) {
        listener?.onCategorySelected(category)
    }
}
```

### 6. ViewPager2 và TabLayout

#### 6.1 ViewPager2 với Fragments

```kotlin
class MainPagerActivity : AppCompatActivity() {
    
    private lateinit var binding: ActivityMainPagerBinding
    private lateinit var pagerAdapter: MainPagerAdapter
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainPagerBinding.inflate(layoutInflater)
        setContentView(binding.root)
        
        setupViewPager()
        setupTabLayout()
    }
    
    private fun setupViewPager() {
        pagerAdapter = MainPagerAdapter(this)
        binding.viewPager.apply {
            adapter = pagerAdapter
            
            // Performance optimization
            offscreenPageLimit = 2
            
            // Custom page transformer
            setPageTransformer(DepthPageTransformer())
            
            // Register page change callback
            registerOnPageChangeCallback(object : ViewPager2.OnPageChangeCallback() {
                override fun onPageSelected(position: Int) {
                    super.onPageSelected(position)
                    onPageChanged(position)
                }
                
                override fun onPageScrolled(
                    position: Int,
                    positionOffset: Float,
                    positionOffsetPixels: Int
                ) {
                    super.onPageScrolled(position, positionOffset, positionOffsetPixels)
                    // Handle scroll events if needed
                }
            })
        }
    }
    
    private fun setupTabLayout() {
        TabLayoutMediator(binding.tabLayout, binding.viewPager) { tab, position ->
            when (position) {
                0 -> {
                    tab.text = "News"
                    tab.setIcon(R.drawable.ic_news)
                }
                1 -> {
                    tab.text = "Categories"
                    tab.setIcon(R.drawable.ic_category)
                }
                2 -> {
                    tab.text = "Bookmarks"
                    tab.setIcon(R.drawable.ic_bookmark)
                }
                3 -> {
                    tab.text = "Profile"
                    tab.setIcon(R.drawable.ic_profile)
                }
            }
        }.attach()
        
        // Customize tab layout
        binding.tabLayout.apply {
            tabMode = TabLayout.MODE_FIXED
            tabGravity = TabLayout.GRAVITY_FILL
            
            // Custom tab selection listener
            addOnTabSelectedListener(object : TabLayout.OnTabSelectedListener {
                override fun onTabSelected(tab: TabLayout.Tab?) {
                    tab?.let { animateTabSelection(it) }
                }
                
                override fun onTabUnselected(tab: TabLayout.Tab?) {
                    tab?.let { animateTabDeselection(it) }
                }
                
                override fun onTabReselected(tab: TabLayout.Tab?) {
                    // Handle tab reselection (e.g., scroll to top)
                    tab?.let { handleTabReselection(it.position) }
                }
            })
        }
    }
    
    private fun onPageChanged(position: Int) {
        // Handle page changes (e.g., analytics, state updates)
        when (position) {
            0 -> handleNewsPageSelected()
            1 -> handleCategoriesPageSelected()
            2 -> handleBookmarksPageSelected()
            3 -> handleProfilePageSelected()
        }
    }
    
    private fun animateTabSelection(tab: TabLayout.Tab) {
        tab.view.animate()
            .scaleX(1.1f)
            .scaleY(1.1f)
            .setDuration(200)
            .start()
    }
    
    private fun animateTabDeselection(tab: TabLayout.Tab) {
        tab.view.animate()
            .scaleX(1.0f)
            .scaleY(1.0f)
            .setDuration(200)
            .start()
    }
    
    private fun handleTabReselection(position: Int) {
        // Scroll to top of current fragment
        val currentFragment = pagerAdapter.getFragment(position)
        if (currentFragment is ScrollableFragment) {
            currentFragment.scrollToTop()
        }
    }
}

// ViewPager2 Adapter
class MainPagerAdapter(fragmentActivity: FragmentActivity) : FragmentStateAdapter(fragmentActivity) {
    
    private val fragments = mutableMapOf<Int, Fragment>()
    
    override fun getItemCount(): Int = 4
    
    override fun createFragment(position: Int): Fragment {
        val fragment = when (position) {
            0 -> NewsFragment()
            1 -> CategoriesFragment()
            2 -> BookmarksFragment()
            3 -> ProfileFragment()
            else -> throw IllegalArgumentException("Invalid position $position")
        }
        
        fragments[position] = fragment
        return fragment
    }
    
    fun getFragment(position: Int): Fragment? = fragments[position]
}

// Custom Page Transformer
class DepthPageTransformer : ViewPager2.PageTransformer {
    
    private val minScale = 0.75f
    
    override fun transformPage(view: View, position: Float) {
        view.apply {
            when {
                position < -1 -> { // [-Infinity,-1)
                    alpha = 0f
                }
                position <= 0 -> { // [-1,0]
                    alpha = 1f
                    translationX = 0f
                    scaleX = 1f
                    scaleY = 1f
                }
                position <= 1 -> { // (0,1]
                    alpha = 1 - position
                    translationX = width * -position
                    val scaleFactor = minScale + (1 - minScale) * (1 - abs(position))
                    scaleX = scaleFactor
                    scaleY = scaleFactor
                }
                else -> { // (1,+Infinity]
                    alpha = 0f
                }
            }
        }
    }
}

// Interface for scrollable fragments
interface ScrollableFragment {
    fun scrollToTop()
}

// Implementation trong NewsFragment
class NewsFragment : Fragment(), ScrollableFragment {
    // ... existing code ...
    
    override fun scrollToTop() {
        binding.recyclerView.smoothScrollToPosition(0)
    }
}
```

### 7. Navigation Drawer và Bottom Navigation

#### 7.1 Navigation Drawer Implementation

```kotlin
class NavigationDrawerActivity : AppCompatActivity() {
    
    private lateinit var binding: ActivityNavigationDrawerBinding
    private lateinit var toggle: ActionBarDrawerToggle
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityNavigationDrawerBinding.inflate(layoutInflater)
        setContentView(binding.root)
        
        setupToolbar()
        setupNavigationDrawer()
        setupNavigationView()
        
        // Load default fragment
        if (savedInstanceState == null) {
            loadFragment(NewsFragment(), "News")
        }
    }
    
    private fun setupToolbar() {
        setSupportActionBar(binding.toolbar)
        supportActionBar?.apply {
            setDisplayHomeAsUpEnabled(true)
            setHomeButtonEnabled(true)
        }
    }
    
    private fun setupNavigationDrawer() {
        toggle = ActionBarDrawerToggle(
            this,
            binding.drawerLayout,
            binding.toolbar,
            R.string.navigation_drawer_open,
            R.string.navigation_drawer_close
        )
        
        binding.drawerLayout.addDrawerListener(toggle)
        
        // Custom drawer listener
        binding.drawerLayout.addDrawerListener(object : DrawerLayout.DrawerListener {
            override fun onDrawerSlide(drawerView: View, slideOffset: Float) {
                // Apply slide animation to main content
                val slideX = drawerView.width * slideOffset
                binding.contentFrame.translationX = slideX
            }
            
            override fun onDrawerOpened(drawerView: View) {
                // Handle drawer opened
                hideKeyboard()
            }
            
            override fun onDrawerClosed(drawerView: View) {
                // Handle drawer closed
            }
            
            override fun onDrawerStateChanged(newState: Int) {
                // Handle drawer state changes
            }
        })
    }
    
    private fun setupNavigationView() {
        binding.navigationView.setNavigationItemSelectedListener { menuItem ->
            when (menuItem.itemId) {
                R.id.nav_news -> {
                    loadFragment(NewsFragment(), "News")
                    binding.toolbar.title = "News"
                }
                R.id.nav_categories -> {
                    loadFragment(CategoriesFragment(), "Categories")
                    binding.toolbar.title = "Categories"
                }
                R.id.nav_bookmarks -> {
                    loadFragment(BookmarksFragment(), "Bookmarks")
                    binding.toolbar.title = "Bookmarks"
                }
                R.id.nav_settings -> {
                    startActivity(Intent(this, SettingsActivity::class.java))
                }
                R.id.nav_about -> {
                    showAboutDialog()
                }
                R.id.nav_logout -> {
                    showLogoutConfirmation()
                }
            }
            
            binding.drawerLayout.closeDrawer(GravityCompat.START)
            true
        }
        
        // Setup header
        setupNavigationHeader()
        
        // Update menu item badges
        updateMenuBadges()
    }
    
    private fun setupNavigationHeader() {
        val headerView = binding.navigationView.getHeaderView(0)
        val profileImage = headerView.findViewById<ImageView>(R.id.profileImage)
        val nameText = headerView.findViewById<TextView>(R.id.nameText)
        val emailText = headerView.findViewById<TextView>(R.id.emailText)
        
        // Load user data
        val user = getCurrentUser() // Your user data source
        nameText.text = user.name
        emailText.text = user.email
        
        Glide.with(this)
            .load(user.profileImageUrl)
            .placeholder(R.drawable.default_profile)
            .circleCrop()
            .into(profileImage)
        
        // Header click listener
        headerView.setOnClickListener {
            startActivity(Intent(this, ProfileActivity::class.java))
            binding.drawerLayout.closeDrawer(GravityCompat.START)
        }
    }
    
    private fun updateMenuBadges() {
        val menu = binding.navigationView.menu
        
        // Add badge to bookmarks item
        val bookmarksItem = menu.findItem(R.id.nav_bookmarks)
        val bookmarksCount = getBookmarksCount() // Your data source
        
        if (bookmarksCount > 0) {
            bookmarksItem.title = "Bookmarks ($bookmarksCount)"
        }
    }
    
    private fun loadFragment(fragment: Fragment, tag: String) {
        supportFragmentManager.beginTransaction()
            .setCustomAnimations(
                R.anim.slide_in_right,
                R.anim.slide_out_left,
                R.anim.slide_in_left,
                R.anim.slide_out_right
            )
            .replace(R.id.contentFrame, fragment, tag)
            .commit()
    }
    
    override fun onPostCreate(savedInstanceState: Bundle?) {
        super.onPostCreate(savedInstanceState)
        toggle.syncState()
    }
    
    override fun onConfigurationChanged(newConfig: Configuration) {
        super.onConfigurationChanged(newConfig)
        toggle.onConfigurationChanged(newConfig)
    }
    
    override fun onBackPressed() {
        if (binding.drawerLayout.isDrawerOpen(GravityCompat.START)) {
            binding.drawerLayout.closeDrawer(GravityCompat.START)
        } else {
            super.onBackPressed()
        }
    }
    
    private fun hideKeyboard() {
        val imm = getSystemService(Context.INPUT_METHOD_SERVICE) as InputMethodManager
        imm.hideSoftInputFromWindow(binding.root.windowToken, 0)
    }
    
    private fun showAboutDialog() {
        // Show about dialog
    }
    
    private fun showLogoutConfirmation() {
        AlertDialog.Builder(this)
            .setTitle("Logout")
            .setMessage("Are you sure you want to logout?")
            .setPositiveButton("Logout") { _, _ ->
                performLogout()
            }
            .setNegativeButton("Cancel", null)
            .show()
    }
    
    private fun performLogout() {
        // Handle logout logic
    }
    
    private fun getCurrentUser(): User {
        // Return current user data
        return User("John Doe", "john@example.com", "https://example.com/profile.jpg")
    }
    
    private fun getBookmarksCount(): Int {
        // Return bookmarks count
        return 5
    }
    
    data class User(val name: String, val email: String, val profileImageUrl: String)
}
```

#### 7.2 Bottom Navigation Implementation

```kotlin
class BottomNavigationActivity : AppCompatActivity() {
    
    private lateinit var binding: ActivityBottomNavigationBinding
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityBottomNavigationBinding.inflate(layoutInflater)
        setContentView(binding.root)
        
        setupBottomNavigation()
        
        // Load default fragment
        if (savedInstanceState == null) {
            loadFragment(NewsFragment())
        }
    }
    
    private fun setupBottomNavigation() {
        binding.bottomNavigation.setOnItemSelectedListener { item ->
            when (item.itemId) {
                R.id.nav_home -> {
                    loadFragment(NewsFragment())
                    true
                }
                R.id.nav_search -> {
                    loadFragment(SearchFragment())
                    true
                }
                R.id.nav_favorites -> {
                    loadFragment(FavoritesFragment())
                    true
                }
                R.id.nav_profile -> {
                    loadFragment(ProfileFragment())
                    true
                }
                else -> false
            }
        }
        
        // Add badges to menu items
        addBadgeToMenuItem(R.id.nav_favorites, 3)
        
        // Custom item reselection handling
        binding.bottomNavigation.setOnItemReselectedListener { item ->
            when (item.itemId) {
                R.id.nav_home -> scrollCurrentFragmentToTop()
                R.id.nav_search -> clearSearchAndScrollToTop()
                R.id.nav_favorites -> scrollCurrentFragmentToTop()
                R.id.nav_profile -> scrollCurrentFragmentToTop()
            }
        }
    }
    
    private fun loadFragment(fragment: Fragment) {
        supportFragmentManager.beginTransaction()
            .replace(R.id.fragmentContainer, fragment)
            .commit()
    }
    
    private fun addBadgeToMenuItem(menuItemId: Int, badgeCount: Int) {
        val badge = binding.bottomNavigation.getOrCreateBadge(menuItemId)
        badge.number = badgeCount
        badge.backgroundColor = ContextCompat.getColor(this, R.color.badge_color)
        badge.badgeTextColor = ContextCompat.getColor(this, R.color.white)
    }
    
    private fun scrollCurrentFragmentToTop() {
        val currentFragment = supportFragmentManager
            .findFragmentById(R.id.fragmentContainer)
        
        if (currentFragment is ScrollableFragment) {
            currentFragment.scrollToTop()
        }
    }
    
    private fun clearSearchAndScrollToTop() {
        val searchFragment = supportFragmentManager
            .findFragmentById(R.id.fragmentContainer) as? SearchFragment
        
        searchFragment?.clearSearchAndScrollToTop()
    }
}
```

## 🏆 Bài tập thực hành

### Đề bài: Social Media Feed App

Tạo ứng dụng social media feed tương tự Facebook/Instagram với các yêu cầu:

1. **RecyclerView**: Hiển thị posts với multiple view types (text, image, video)
2. **Pull-to-refresh**: Refresh feed content
3. **Infinite scrolling**: Load more posts khi scroll đến cuối
4. **Interactions**: Like, comment, share buttons với animations
5. **Navigation**: Bottom navigation với badges
6. **Stories**: Horizontal RecyclerView cho stories

### Lời giải chi tiết:

#### Bước 1: Data Models

```kotlin
// File: Post.kt
sealed class Post {
    abstract val id: String
    abstract val author: User
    abstract val timestamp: Long
    abstract val likes: Int
    abstract val comments: Int
    abstract val isLiked: Boolean
    
    data class TextPost(
        override val id: String,
        override val author: User,
        override val timestamp: Long,
        override val likes: Int,
        override val comments: Int,
        override val isLiked: Boolean,
        val content: String
    ) : Post()
    
    data class ImagePost(
        override val id: String,
        override val author: User,
        override val timestamp: Long,
        override val likes: Int,
        override val comments: Int,
        override val isLiked: Boolean,
        val content: String,
        val imageUrls: List<String>
    ) : Post()
    
    data class VideoPost(
        override val id: String,
        override val author: User,
        override val timestamp: Long,
        override val likes: Int,
        override val comments: Int,
        override val isLiked: Boolean,
        val content: String,
        val videoUrl: String,
        val thumbnailUrl: String,
        val duration: Int
    ) : Post()
}

data class User(
    val id: String,
    val name: String,
    val username: String,
    val profileImageUrl: String,
    val isVerified: Boolean = false
)

data class Story(
    val id: String,
    val user: User,
    val imageUrl: String,
    val isViewed: Boolean = false
)
```

#### Bước 2: RecyclerView Adapter với Multiple View Types

```kotlin
// File: SocialFeedAdapter.kt
class SocialFeedAdapter(
    private val onPostClick: (Post) -> Unit,
    private val onLikeClick: (Post) -> Unit,
    private val onCommentClick: (Post) -> Unit,
    private val onShareClick: (Post) -> Unit,
    private val onProfileClick: (User) -> Unit
) : ListAdapter<Post, RecyclerView.ViewHolder>(PostDiffCallback()) {
    
    companion object {
        private const val VIEW_TYPE_TEXT = 1
        private const val VIEW_TYPE_IMAGE = 2
        private const val VIEW_TYPE_VIDEO = 3
    }
    
    override fun getItemViewType(position: Int): Int {
        return when (getItem(position)) {
            is Post.TextPost -> VIEW_TYPE_TEXT
            is Post.ImagePost -> VIEW_TYPE_IMAGE
            is Post.VideoPost -> VIEW_TYPE_VIDEO
        }
    }
    
    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): RecyclerView.ViewHolder {
        return when (viewType) {
            VIEW_TYPE_TEXT -> TextPostViewHolder.create(parent, onPostClick, onLikeClick, onCommentClick, onShareClick, onProfileClick)
            VIEW_TYPE_IMAGE -> ImagePostViewHolder.create(parent, onPostClick, onLikeClick, onCommentClick, onShareClick, onProfileClick)
            VIEW_TYPE_VIDEO -> VideoPostViewHolder.create(parent, onPostClick, onLikeClick, onCommentClick, onShareClick, onProfileClick)
            else -> throw IllegalArgumentException("Unknown view type: $viewType")
        }
    }
    
    override fun onBindViewHolder(holder: RecyclerView.ViewHolder, position: Int) {
        when (holder) {
            is TextPostViewHolder -> holder.bind(getItem(position) as Post.TextPost)
            is ImagePostViewHolder -> holder.bind(getItem(position) as Post.ImagePost)
            is VideoPostViewHolder -> holder.bind(getItem(position) as Post.VideoPost)
        }
    }
}

// Base ViewHolder với common functionality
abstract class BasePostViewHolder(
    protected val binding: ViewDataBinding,
    protected val onPostClick: (Post) -> Unit,
    protected val onLikeClick: (Post) -> Unit,
    protected val onCommentClick: (Post) -> Unit,
    protected val onShareClick: (Post) -> Unit,
    protected val onProfileClick: (User) -> Unit
) : RecyclerView.ViewHolder(binding.root) {
    
    protected fun setupCommonViews(post: Post) {
        // Setup author info
        setupAuthorInfo(post.author)
        
        // Setup timestamp
        setupTimestamp(post.timestamp)
        
        // Setup interaction buttons
        setupInteractionButtons(post)
    }
    
    private fun setupAuthorInfo(author: User) {
        // Implementation for author info setup
    }
    
    private fun setupTimestamp(timestamp: Long) {
        // Implementation for timestamp formatting
    }
    
    private fun setupInteractionButtons(post: Post) {
        // Setup like, comment, share buttons
    }
    
    protected fun animateLikeButton(isLiked: Boolean) {
        // Like button animation
    }
    
    protected fun formatTimeAgo(timestamp: Long): String {
        // Time formatting logic
        val now = System.currentTimeMillis()
        val diff = now - timestamp
        
        return when {
            diff < 60000 -> "Just now"
            diff < 3600000 -> "${diff / 60000}m"
            diff < 86400000 -> "${diff / 3600000}h"
            diff < 604800000 -> "${diff / 86400000}d"
            else -> SimpleDateFormat("MMM dd", Locale.getDefault()).format(Date(timestamp))
        }
    }
}

// Text Post ViewHolder
class TextPostViewHolder(
    private val binding: ItemTextPostBinding,
    onPostClick: (Post) -> Unit,
    onLikeClick: (Post) -> Unit,
    onCommentClick: (Post) -> Unit,
    onShareClick: (Post) -> Unit,
    onProfileClick: (User) -> Unit
) : BasePostViewHolder(binding, onPostClick, onLikeClick, onCommentClick, onShareClick, onProfileClick) {
    
    fun bind(post: Post.TextPost) {
        binding.apply {
            // Set content
            contentText.text = post.content
            
            // Setup common views
            setupCommonViews(post)
            
            // Setup click listeners
            root.setOnClickListener { onPostClick(post) }
            profileImage.setOnClickListener { onProfileClick(post.author) }
            authorName.setOnClickListener { onProfileClick(post.author) }
            
            // Load profile image
            Glide.with(itemView.context)
                .load(post.author.profileImageUrl)
                .placeholder(R.drawable.default_profile)
                .circleCrop()
                .into(profileImage)
        }
    }
    
    companion object {
        fun create(
            parent: ViewGroup,
            onPostClick: (Post) -> Unit,
            onLikeClick: (Post) -> Unit,
            onCommentClick: (Post) -> Unit,
            onShareClick: (Post) -> Unit,
            onProfileClick: (User) -> Unit
        ): TextPostViewHolder {
            val binding = ItemTextPostBinding.inflate(
                LayoutInflater.from(parent.context),
                parent,
                false
            )
            return TextPostViewHolder(binding, onPostClick, onLikeClick, onCommentClick, onShareClick, onProfileClick)
        }
    }
}

// Image Post ViewHolder with ViewPager for multiple images
class ImagePostViewHolder(
    private val binding: ItemImagePostBinding,
    onPostClick: (Post) -> Unit,
    onLikeClick: (Post) -> Unit,
    onCommentClick: (Post) -> Unit,
    onShareClick: (Post) -> Unit,
    onProfileClick: (User) -> Unit
) : BasePostViewHolder(binding, onPostClick, onLikeClick, onCommentClick, onShareClick, onProfileClick) {
    
    private lateinit var imageAdapter: PostImagesAdapter
    
    fun bind(post: Post.ImagePost) {
        binding.apply {
            // Set content
            contentText.text = post.content
            contentText.visibility = if (post.content.isNotEmpty()) View.VISIBLE else View.GONE
            
            // Setup common views
            setupCommonViews(post)
            
            // Setup image viewpager
            setupImageViewPager(post.imageUrls)
            
            // Setup click listeners
            root.setOnClickListener { onPostClick(post) }
            profileImage.setOnClickListener { onProfileClick(post.author) }
        }
    }
    
    private fun setupImageViewPager(imageUrls: List<String>) {
        imageAdapter = PostImagesAdapter(imageUrls) { imageUrl, position ->
            // Handle image click - open full screen
            openImageFullScreen(imageUrl, position)
        }
        
        binding.imagesViewPager.apply {
            adapter = imageAdapter
            
            // Show indicator if multiple images
            if (imageUrls.size > 1) {
                binding.imageIndicator.visibility = View.VISIBLE
                binding.imageIndicator.attachTo(this)
            } else {
                binding.imageIndicator.visibility = View.GONE
            }
        }
    }
    
    private fun openImageFullScreen(imageUrl: String, position: Int) {
        // Open full screen image viewer
    }
    
    companion object {
        fun create(
            parent: ViewGroup,
            onPostClick: (Post) -> Unit,
            onLikeClick: (Post) -> Unit,
            onCommentClick: (Post) -> Unit,
            onShareClick: (Post) -> Unit,
            onProfileClick: (User) -> Unit
        ): ImagePostViewHolder {
            val binding = ItemImagePostBinding.inflate(
                LayoutInflater.from(parent.context),
                parent,
                false
            )
            return ImagePostViewHolder(binding, onPostClick, onLikeClick, onCommentClick, onShareClick, onProfileClick)
        }
    }
}
```

#### Bước 3: Main Activity với Bottom Navigation

```kotlin
// File: MainActivity.kt
class MainActivity : AppCompatActivity() {
    
    private lateinit var binding: ActivityMainBinding
    
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)
        
        setupBottomNavigation()
        
        // Load default fragment
        if (savedInstanceState == null) {
            loadFragment(FeedFragment())
        }
    }
    
    private fun setupBottomNavigation() {
        binding.bottomNavigation.setOnItemSelectedListener { item ->
            when (item.itemId) {
                R.id.nav_feed -> {
                    loadFragment(FeedFragment())
                    true
                }
                R.id.nav_search -> {
                    loadFragment(SearchFragment())
                    true
                }
                R.id.nav_add -> {
                    openCreatePostScreen()
                    false // Don't change selection
                }
                R.id.nav_notifications -> {
                    loadFragment(NotificationsFragment())
                    true
                }
                R.id.nav_profile -> {
                    loadFragment(ProfileFragment())
                    true
                }
                else -> false
            }
        }
        
        // Add notification badge
        updateNotificationBadge(5)
    }
    
    private fun loadFragment(fragment: Fragment) {
        supportFragmentManager.beginTransaction()
            .setCustomAnimations(
                android.R.anim.fade_in,
                android.R.anim.fade_out
            )
            .replace(R.id.fragmentContainer, fragment)
            .commit()
    }
    
    private fun openCreatePostScreen() {
        startActivity(Intent(this, CreatePostActivity::class.java))
    }
    
    private fun updateNotificationBadge(count: Int) {
        val badge = binding.bottomNavigation.getOrCreateBadge(R.id.nav_notifications)
        if (count > 0) {
            badge.number = count
            badge.isVisible = true
        } else {
            badge.isVisible = false
        }
    }
}
```

#### Bước 4: Feed Fragment với Stories và Posts

```kotlin
// File: FeedFragment.kt
class FeedFragment : Fragment(), ScrollableFragment {
    
    private var _binding: FragmentFeedBinding? = null
    private val binding get() = _binding!!
    
    private lateinit var feedAdapter: SocialFeedAdapter
    private lateinit var storiesAdapter: StoriesAdapter
    private val viewModel: FeedViewModel by viewModels()
    
    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentFeedBinding.inflate(inflater, container, false)
        return binding.root
    }
    
    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        
        setupStoriesRecyclerView()
        setupFeedRecyclerView()
        setupSwipeRefresh()
        setupScrollListener()
        observeViewModel()
        
        // Load initial data
        viewModel.loadStories()
        viewModel.loadFeed()
    }
    
    private fun setupStoriesRecyclerView() {
        storiesAdapter = StoriesAdapter { story ->
            openStoryViewer(story)
        }
        
        binding.storiesRecyclerView.apply {
            adapter = storiesAdapter
            layoutManager = LinearLayoutManager(
                requireContext(),
                LinearLayoutManager.HORIZONTAL,
                false
            )
            
            addItemDecoration(object : RecyclerView.ItemDecoration() {
                override fun getItemOffsets(
                    outRect: Rect,
                    view: View,
                    parent: RecyclerView,
                    state: RecyclerView.State
                ) {
                    outRect.right = 12.dp
                }
            })
        }
    }
    
    private fun setupFeedRecyclerView() {
        feedAdapter = SocialFeedAdapter(
            onPostClick = { post ->
                openPostDetails(post)
            },
            onLikeClick = { post ->
                viewModel.toggleLike(post)
            },
            onCommentClick = { post ->
                openComments(post)
            },
            onShareClick = { post ->
                sharePost(post)
            },
            onProfileClick = { user ->
                openUserProfile(user)
            }
        )
        
        binding.feedRecyclerView.apply {
            adapter = feedAdapter
            layoutManager = LinearLayoutManager(requireContext())
            
            // Add divider
            addItemDecoration(
                DividerItemDecoration(requireContext(), DividerItemDecoration.VERTICAL)
            )
            
            // Performance optimizations
            setHasFixedSize(false) // Content has variable sizes
            itemAnimator = DefaultItemAnimator()
            
            // Prefetch items for smoother scrolling
            (layoutManager as LinearLayoutManager).initialPrefetchItemCount = 4
        }
    }
    
    private fun setupSwipeRefresh() {
        binding.swipeRefreshLayout.apply {
            setColorSchemeResources(
                R.color.primary_color,
                R.color.secondary_color,
                R.color.accent_color
            )
            
            setOnRefreshListener {
                viewModel.refreshFeed()
            }
        }
    }
    
    private fun setupScrollListener() {
        binding.feedRecyclerView.addOnScrollListener(object : RecyclerView.OnScrollListener() {
            override fun onScrolled(recyclerView: RecyclerView, dx: Int, dy: Int) {
                super.onScrolled(recyclerView, dx, dy)
                
                val layoutManager = recyclerView.layoutManager as LinearLayoutManager
                val visibleItemCount = layoutManager.childCount
                val totalItemCount = layoutManager.itemCount
                val firstVisibleItemPosition = layoutManager.findFirstVisibleItemPosition()
                
                // Load more posts when near the end
                if (!viewModel.isLoading.value!! && 
                    (visibleItemCount + firstVisibleItemPosition) >= totalItemCount - 3) {
                    viewModel.loadMorePosts()
                }
                
                // Show/hide stories based on scroll position
                val showStories = firstVisibleItemPosition == 0
                animateStoriesVisibility(showStories)
            }
        })
    }
    
    private fun animateStoriesVisibility(show: Boolean) {
        val targetAlpha = if (show) 1f else 0f
        val targetHeight = if (show) resources.getDimensionPixelSize(R.dimen.stories_height) else 0
        
        binding.storiesContainer.animate()
            .alpha(targetAlpha)
            .setDuration(300)
            .withStartAction {
                if (show) binding.storiesContainer.visibility = View.VISIBLE
            }
            .withEndAction {
                if (!show) binding.storiesContainer.visibility = View.GONE
            }
            .start()
    }
    
    private fun observeViewModel() {
        viewModel.stories.observe(viewLifecycleOwner) { stories ->
            storiesAdapter.submitList(stories)
        }
        
        viewModel.posts.observe(viewLifecycleOwner) { posts ->
            feedAdapter.submitList(posts)
            updateEmptyState(posts.isEmpty())
        }
        
        viewModel.isLoading.observe(viewLifecycleOwner) { isLoading ->
            binding.swipeRefreshLayout.isRefreshing = isLoading
        }
        
        viewModel.error.observe(viewLifecycleOwner) { error ->
            error?.let { showError(it) }
        }
    }
    
    private fun updateEmptyState(isEmpty: Boolean) {
        binding.emptyStateLayout.visibility = if (isEmpty) View.VISIBLE else View.GONE
        binding.feedRecyclerView.visibility = if (isEmpty) View.GONE else View.VISIBLE
    }
    
    private fun showError(message: String) {
        Snackbar.make(binding.root, message, Snackbar.LENGTH_LONG)
            .setAction("Retry") {
                viewModel.retryLastOperation()
            }
            .show()
    }
    
    private fun openStoryViewer(story: Story) {
        // Open story viewer activity
        val intent = Intent(requireContext(), StoryViewerActivity::class.java)
        intent.putExtra("story_id", story.id)
        startActivity(intent)
    }
    
    private fun openPostDetails(post: Post) {
        // Open post details
        val intent = Intent(requireContext(), PostDetailsActivity::class.java)
        intent.putExtra("post_id", post.id)
        startActivity(intent)
    }
    
    private fun openComments(post: Post) {
        // Open comments bottom sheet or activity
        val bottomSheet = CommentsBottomSheet.newInstance(post.id)
        bottomSheet.show(childFragmentManager, "comments")
    }
    
    private fun sharePost(post: Post) {
        val shareIntent = Intent(Intent.ACTION_SEND).apply {
            type = "text/plain"
            putExtra(Intent.EXTRA_TEXT, "Check out this post: ${post.id}")
        }
        startActivity(Intent.createChooser(shareIntent, "Share Post"))
    }
    
    private fun openUserProfile(user: User) {
        val intent = Intent(requireContext(), UserProfileActivity::class.java)
        intent.putExtra("user_id", user.id)
        startActivity(intent)
    }
    
    override fun scrollToTop() {
        binding.feedRecyclerView.smoothScrollToPosition(0)
    }
    
    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
    
    private val Int.dp: Int
        get() = TypedValue.applyDimension(
            TypedValue.COMPLEX_UNIT_DIP,
            this.toFloat(),
            resources.displayMetrics
        ).toInt()
}
```

**Giải thích implementation:**

1. **Multiple View Types**: Text, Image, Video posts với different layouts
2. **Sealed Classes**: Type-safe post modeling với Kotlin sealed classes
3. **BaseViewHolder**: Common functionality extracted to base class
4. **Stories Integration**: Horizontal RecyclerView cho stories
5. **Infinite Scrolling**: Load more content khi user scroll đến cuối
6. **Pull-to-Refresh**: SwipeRefreshLayout cho content refresh
7. **Animations**: Custom animations cho interactions
8. **Performance**: Optimizations với prefetch và view recycling

## 🔑 Những điểm quan trọng cần lưu ý

### 1. RecyclerView Performance
- **Use DiffUtil** thay vì notifyDataSetChanged()
- **Set hasFixedSize(true)** nếu item sizes không thay đổi
- **Implement view recycling** properly trong ViewHolders
- **Avoid complex operations** trong onBindViewHolder()

### 2. Memory Management
- **Clear image loading** trong ViewHolder recycling
- **Null binding references** trong Fragment onDestroyView
- **Unregister listeners** khi không cần thiết
- **Use weak references** cho long-running operations

### 3. UI Thread Best Practices
- **Never block UI thread** với heavy operations
- **Use background threads** cho data processing
- **Update UI** chỉ trên main thread
- **Implement proper loading states** cho better UX

### 4. Fragment Lifecycle
- **Handle configuration changes** properly
- **Save and restore state** khi cần thiết
- **Use viewLifecycleOwner** cho LiveData observations
- **Clean up resources** trong appropriate lifecycle methods

### 5. Common Mistakes
- Forgetting to implement DiffUtil properly
- Memory leaks với Fragment binding references
- Not handling empty states và error states
- Overcomplicating ViewHolder implementations
- Poor scroll performance due to heavy operations

## 📝 Bài tập về nhà

### Bài 1: Music Player với RecyclerView

Tạo ứng dụng music player với requirements:

**Features:**
- **Song List**: RecyclerView với album art, song name, artist, duration
- **Multiple View Types**: Now Playing, Regular Song, Album Header
- **Playback Controls**: Play/pause, skip, progress bar trong ViewHolder
- **Playlists**: Drag & drop reordering với ItemTouchHelper
- **Search**: Real-time filtering với SearchView

**Technical Requirements:**
- Custom ItemTouchHelper cho drag & drop
- MediaPlayer integration cho playback
- Smooth animations cho playback state changes
- Sticky headers cho album grouping
- Efficient image loading cho album arts

### Bài 2: E-commerce Product Catalog

Tạo product catalog với advanced RecyclerView features:

**Features:**
- **Multiple Layouts**: Grid và List view switching
- **Filter & Sort**: Bottom sheet với filter options
- **Nested RecyclerView**: Categories với horizontal product lists
- **Add to Cart Animation**: Item fly animation đến cart icon
- **Wishlist**: Heart animation với state persistence

**Advanced Requirements:**
- **Staggered Grid**: Variable height products
- **Parallax Headers**: Category banners với parallax effect
- **Infinite Scroll**: Pagination với loading states
- **Complex Item Types**: Products, banners, category headers, ads
- **Custom LayoutManager**: Implement custom layout behavior

---

*Post ID: qycjgkwzq9o5oj1*  
*Category: Android*  
*Created: 1/9/2025*  
*Updated: 1/9/2025*
