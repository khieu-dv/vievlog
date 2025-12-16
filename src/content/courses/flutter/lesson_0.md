# KHÓA HỌC FLUTTER TỪ CƠ BẢN ĐẾN NÂNG CAO
## 50 Bài giảng (35 bài lý thuyết + 15 bài thực hành dự án)


## PHẦN I: FLUTTER CƠ BẢN (Bài 1-35)

### **Bài 1: Giới thiệu Flutter và cài đặt môi trường**
**Nội dung cơ bản:**
- Flutter là gì? Tại sao chọn Flutter?
- So sánh Flutter với React Native, Xamarin
- Kiến trúc Flutter (Widget Tree, Rendering Engine)
- Cài đặt Flutter SDK trên Windows
- Cài đặt Android Studio, VS Code
- Cấu hình Android Emulator

**Hoạt động thực hành:**
- Cài đặt Flutter SDK và IDE
- Chạy lệnh `flutter doctor` để kiểm tra
- Tạo project Flutter đầu tiên
- Chạy ứng dụng "Hello World" trên emulator


### **Bài 2: Cấu trúc project Flutter và Widget cơ bản**
**Nội dung cơ bản:**
- Cấu trúc thư mục Flutter project
- File pubspec.yaml và quản lý dependencies
- Widget là gì? Stateless vs Stateful Widget
- MaterialApp và Scaffold
- AppBar, Body, FloatingActionButton

**Hoạt động thực hành:**
- Phân tích cấu trúc project mặc định
- Tạo Widget đầu tiên
- Thay đổi title, theme của ứng dụng
- Tùy chỉnh AppBar và thêm icon


### **Bài 3: Text và Container Widget**
**Nội dung cơ bản:**
- Text Widget và các thuộc tính styling
- Container Widget: padding, margin, decoration
- Colors và MaterialColor
- BoxDecoration: border, borderRadius, gradient

**Hoạt động thực hành:**
- Tạo các Text với style khác nhau
- Thiết kế Container với background màu sắc
- Tạo card đẹp mắt với BoxDecoration
- Thực hành gradient background


### **Bài 4: Layout cơ bản - Row và Column**
**Nội dung cơ bản:**
- Row Widget: mainAxis và crossAxis
- Column Widget và sự khác biệt với Row
- MainAxisAlignment và CrossAxisAlignment
- Expanded và Flexible Widget

**Hoạt động thực hành:**
- Tạo layout ngang với Row
- Tạo layout dọc với Column
- Kết hợp Row và Column
- Sử dụng Expanded để chia đều không gian



### **Bài 5: Image và Asset Management**
**Nội dung cơ bản:**
- Image Widget: Image.asset, Image.network
- Quản lý assets trong pubspec.yaml
- Các thuộc tính: fit, width, height, alignment
- Caching và optimization hình ảnh

**Hoạt động thực hành:**
- Thêm hình ảnh vào project assets
- Hiển thị hình ảnh local và từ internet
- Tạo gallery đơn giản
- Xử lý loading và error state cho network image



### **Bài 6: Button và sự kiện cơ bản**
**Nội dung cơ bản:**
- ElevatedButton, TextButton, OutlinedButton
- IconButton và FloatingActionButton
- Xử lý sự kiện onPressed
- ButtonStyle và customization

**Hoạt động thực hành:**
- Tạo các loại button khác nhau
- Xử lý click event đơn giản
- Tùy chỉnh màu sắc và style button
- Tạo button với icon và text



### **Bài 7: TextField và Form Input**
**Nội dung cơ bản:**
- TextField Widget và TextEditingController
- InputDecoration: hintText, labelText, border
- TextInputType và validation cơ bản
- Focus và keyboard handling

**Hoạt động thực hành:**
- Tạo form đăng nhập đơn giản
- Xử lý input validation
- Thay đổi keyboard type
- Tạo TextField với icon và decoration đẹp


### **Bài 8: StatefulWidget và State Management cơ bản**
**Nội dung cơ bản:**
- Khái niệm State trong Flutter
- Chuyển từ StatelessWidget sang StatefulWidget
- setState() method
- Widget lifecycle methods

**Hoạt động thực hành:**
- Tạo counter app với StatefulWidget
- Xử lý thay đổi state khi click button
- Tạo ứng dụng to-do list đơn giản
- Thực hành lifecycle methods



### **Bài 9: ListView và ScrollView**
**Nội dung cơ bản:**
- ListView.builder vs ListView
- ScrollDirection và scroll physics
- ListTile Widget
- SingleChildScrollView

**Hoạt động thực hành:**
- Tạo danh sách cuộn dọc
- Tạo danh sách cuộn ngang
- Xây dựng contact list với ListTile
- Tạo grid view đơn giản



### **Bài 10: GridView và Flexible Layouts**
**Nội dung cơ bản:**
- GridView.builder và GridView.count
- SliverGridDelegate
- AspectRatio và tối ưu layout
- StaggeredGridView (package bên ngoài)

**Hoạt động thực hành:**
- Tạo photo gallery với GridView
- Tùy chỉnh số cột và spacing
- Tạo dashboard với các card
- Responsive grid layout



### **Bài 11: Stack và Positioned Widget**
**Nội dung cơ bản:**
- Stack Widget cho overlay layout
- Positioned Widget và alignment
- IndexedStack cho tab switching
- Z-index và layer management

**Hoạt động thực hành:**
- Tạo profile card với avatar overlay
- Badge notification trên icon
- Floating elements trên background
- Tạo custom app bar với Stack


### **Bài 12: Wrap và Chip Widget**
**Nội dung cơ bản:**
- Wrap Widget cho flexible layout
- Chip, ActionChip, FilterChip
- Spacing và runSpacing
- Dynamic tag system

**Hoạt động thực hành:**
- Tạo tag selector với Chip
- Dynamic filter system
- Hashtag display
- Responsive button layout với Wrap


### **Bài 13: Card và Material Design**
**Nội dung cơ bản:**
- Card Widget và elevation
- Material Design principles
- Inkwell và Ripple effects
- Shadow và rounded corners

**Hoạt động thực hành:**
- Tạo news card layout
- Product card cho e-commerce
- Profile card với animation
- Card với action buttons


### **Bài 14: AppBar và Navigation cơ bản**
**Nội dung cơ bản:**
- AppBar customization
- leading, title, actions
- PreferredSize và custom height
- SliverAppBar cho advanced scrolling

**Hoạt động thực hành:**
- Custom AppBar với gradient
- Search AppBar
- AppBar với menu actions
- Collapsing AppBar effect


### **Bài 15: Bottom Navigation và TabBar**
**Nội dung cơ bản:**
- BottomNavigationBar
- TabBar và TabBarView
- Tab controller và lifecycle
- Custom tab indicators

**Hoạt động thực hành:**
- Tạo app với bottom navigation
- Tab view cho different categories
- Custom tab design
- Badge trên tab items


### **Bài 16: Drawer và Side Navigation**
**Nội dung cơ bản:**
- Drawer Widget
- DrawerHeader và UserAccountsDrawerHeader
- Navigation logic
- Custom drawer design

**Hoạt động thực hành:**
- Tạo side navigation menu
- User profile drawer
- Custom drawer với animation
- Mini drawer cho desktop


### **Bài 17: Dialog và Bottom Sheet**
**Nội dung cơ bản:**
- AlertDialog và custom dialogs
- showDialog method
- BottomSheet và ModalBottomSheet
- Dialog theming và customization

**Hoạt động thực hành:**
- Confirmation dialog
- Form dialog với input
- Action bottom sheet
- Custom dialog design


### **Bài 18: Snackbar và Toast Messages**
**Nội dung cơ bản:**
- SnackBar Widget
- ScaffoldMessenger
- Duration và action buttons
- Custom snackbar styling

**Hoạt động thực hành:**
- Success/Error messages
- Undo action với SnackBar
- Custom toast notifications
- Floating snackbar


### **Bài 19: Icons và Custom Icons**
**Nội dung cơ bản:**
- Material Icons
- FontAwesome và custom icon fonts
- Icon themes và sizing
- SVG icons với flutter_svg

**Hoạt động thực hành:**
- Icon gallery app
- Custom icon font integration
- SVG icon implementation
- Icon button với multiple states


### **Bài 20: Themes và Styling**
**Nội dung cơ bản:**
- ThemeData và ColorScheme
- Dark/Light theme
- Custom theme creation
- Theme inheritance

**Hoạt động thực hành:**
- Tạo custom app theme
- Dark mode toggle
- Brand color implementation
- Responsive typography


### **Bài 21: Animation cơ bản**
**Nội dung cơ bản:**
- AnimationController
- Tween và Animation
- AnimatedContainer và AnimatedBuilder
- Implicit vs Explicit animations

**Hoạt động thực hành:**
- Fade in/out animation
- Size transition animation
- Color changing animation
- Loading spinner tùy chỉnh

### **Bài 22: Hero Animation và Page Transitions**
**Nội dung cơ bản:**
- Hero Widget
- Page route transitions
- Custom page transitions
- Shared element animations

**Hoạt động thực hành:**
- Image gallery với Hero animation
- Custom page transition
- Profile photo zoom effect
- Card to detail page transition


### **Bài 23: Gesture Detection**
**Nội dung cơ bản:**
- GestureDetector Widget
- Tap, long press, drag gestures
- Pan và scale gestures
- Custom gesture recognizers

**Hoạt động thực hành:**
- Swipe to delete item
- Pinch to zoom image
- Drag and drop functionality
- Double tap to like


### **Bài 24: Custom Painting và Canvas**
**Nội dung cơ bản:**
- CustomPainter class
- Canvas và Paint objects
- Drawing shapes và paths
- Custom chart creation

**Hoạt động thực hành:**
- Vẽ custom shapes
- Progress circle indicator
- Simple line chart
- Signature pad


### **Bài 25: HTTP Requests và REST API**
**Nội dung cơ bản:**
- http package
- GET, POST, PUT, DELETE requests
- JSON parsing với dart:convert
- Error handling và status codes

**Hoạt động thực hành:**
- Fetch data từ JSONPlaceholder API
- Create post functionality
- Error handling implementation
- Loading states management


### **Bài 26: Local Storage - SharedPreferences**
**Nội dung cơ bản:**
- SharedPreferences package
- Lưu trữ settings và preferences
- Data types supported
- Best practices cho local storage

**Hoạt động thực hành:**
- Save user preferences
- Remember login state
- App settings storage
- First time user experience


### **Bài 27: File System và Path Provider**
**Nội dung cơ bản:**
- path_provider package
- Application documents directory
- File reading và writing
- Image caching locally

**Hoạt động thực hành:**
- Save và load text files
- Image download và cache
- Export data to file
- Offline data storage


### **Bài 28: SQLite Database với sqflite**
**Nội dung cơ bản:**
- sqflite package introduction
- Database creation và migration
- CRUD operations
- Database helper class

**Hoạt động thực hành:**
- Tạo local database
- User data management
- Offline note-taking app
- Data synchronization prep


### **Bài 29: State Management với Provider**
**Nội dung cơ bản:**
- Provider package
- ChangeNotifier class
- Consumer và Selector widgets
- MultiProvider setup

**Hoạt động thực hành:**
- Shopping cart với Provider
- User authentication state
- Theme switching với Provider
- Complex form state management


### **Bài 30: Navigation 2.0 và Route Management**
**Nội dung cơ bản:**
- Navigator 2.0 concepts
- go_router package
- Route configuration
- Deep linking setup

**Hoạt động thực hành:**
- Setup go_router
- Nested navigation
- URL-based navigation
- Route guards implementation


### **Bài 31: Form Validation và Complex Forms**
**Nội dung cơ bản:**
- Form Widget và GlobalKey
- TextFormField validation
- Custom validators
- Form submission handling

**Hoạt động thực hành:**
- Registration form với validation
- Multi-step form wizard
- Dynamic form fields
- File upload form


### **Bài 32: Camera và Image Picker**
**Nội dung cơ bản:**
- image_picker package
- Camera vs Gallery selection
- Image cropping và editing
- Permissions handling

**Hoạt động thực hành:**
- Profile photo upload
- Multiple image selection
- Image cropping functionality
- Camera preview implementation


### **Bài 33: Maps Integration**
**Nội dung cơ bản:**
- google_maps_flutter package
- Map configuration và API keys
- Markers và info windows
- Location services

**Hoạt động thực hành:**
- Basic map display
- Add markers và custom icons
- Current location tracking
- Directions và routing


### **Bài 34: Push Notifications**
**Nội dung cơ bản:**
- firebase_messaging package
- FCM setup và configuration
- Local notifications
- Background message handling

**Hoạt động thực hành:**
- Setup Firebase messaging
- Local notification system
- Handle notification taps
- Background notification processing


### **Bài 35: Testing và Debugging**
**Nội dung cơ bản:**
- Unit testing với test package
- Widget testing fundamentals
- Integration testing
- Debugging tools và techniques

**Hoạt động thực hành:**
- Write unit tests cho business logic
- Widget test cho UI components
- Integration test cho user flows
- Performance profiling


## PHẦN II: DỰ ÁN THỰC TẾ VỚI POCKETBASE (Bài 36-50)

### **Bài 36: Giới thiệu PocketBase và Setup**
**Nội dung cơ bản:**
- PocketBase là gì? So sánh với Firebase
- Cài đặt PocketBase server
- Admin dashboard và collection setup
- Authentication system overview

**Hoạt động thực hành:**
- Download và setup PocketBase
- Tạo first collection
- Setup authentication
- Test API endpoints với Postman


### **Bài 37: Project Structure và Architecture**
**Nội dung cơ bản:**
- Clean Architecture principles
- Folder structure cho large project
- Dependency injection setup
- Service layer pattern

**Hoạt động thực hành:**
- Setup project structure
- Create base service classes
- Implement dependency injection
- Setup error handling system


### **Bài 38: Authentication System**
**Nội dung cơ bản:**
- PocketBase authentication API
- Login/Register functionality
- Token management
- Auto-refresh tokens

**Hoạt động thực hành:**
- Build login screen
- Implement registration flow
- Setup automatic token refresh
- Create splash screen với auth check


### **Bài 39: User Profile Management**
**Nội dung cơ bản:**
- User profile CRUD operations
- Image upload to PocketBase
- Profile validation
- Account settings

**Hoạt động thực hành:**
- Create profile screen
- Implement profile editing
- Avatar upload functionality
- Account deletion feature


### **Bài 40: Real-time Data với PocketBase**
**Nội dung cơ bản:**
- PocketBase realtime subscriptions
- WebSocket connection handling
- Live data updates
- Connection state management

**Hoạt động thực hành:**
- Setup realtime listeners
- Implement live chat feature
- Real-time notifications
- Handle connection drops


### **Bài 41: CRUD Operations - Create & Read**
**Nội dung cơ bản:**
- POST requests để create data
- GET requests với filtering
- Pagination implementation
- Search functionality

**Hoạt động thực hành:**
- Create post/article feature
- Implement infinite scroll
- Add search với filters
- Category-based filtering


### **Bài 42: CRUD Operations - Update & Delete**
**Nội dung cơ bản:**
- PUT/PATCH requests cho updates
- DELETE operations với confirmation
- Optimistic vs Pessimistic updates
- Conflict resolution

**Hoạt động thực hành:**
- Edit functionality cho posts
- Delete với confirmation dialog
- Draft saving feature
- Version conflict handling


### **Bài 43: File Upload và Media Management**
**Nội dung cơ bản:**
- File upload to PocketBase
- Image optimization
- Multiple file upload
- File type validation

**Hoạt động thực hành:**
- Multiple image upload
- Video file handling
- File preview functionality
- Upload progress indicators


### **Bài 44: Advanced Queries và Relations**
**Nội dung cơ bản:**
- Complex filtering với PocketBase
- Relational data queries
- Expand relations
- Aggregation queries

**Hoạt động thực hành:**
- User posts với comments
- Related data loading
- Complex search implementation
- Data relationship mapping


### **Bài 45: Offline Support và Caching**
**Nội dung cơ bản:**
- Local caching strategies
- Offline data access
- Sync mechanisms
- Conflict resolution

**Hoạt động thực hành:**
- Implement local caching
- Offline reading capability
- Data synchronization
- Handle sync conflicts


### **Bài 46: Push Notifications với PocketBase**
**Nội dung cơ bản:**
- PocketBase hooks for notifications
- Server-side notification logic
- Client-side notification handling
- Notification preferences

**Hoạt động thực hành:**
- Setup notification system
- User notification preferences
- Real-time notification delivery
- Notification history


### **Bài 47: Advanced UI/UX Implementation**
**Nội dung cơ bản:**
- Advanced animation techniques
- Custom transitions
- Micro-interactions
- Performance optimization

**Hoạt động thực hành:**
- Polish app animations
- Implement pull-to-refresh
- Loading skeletons
- Smooth page transitions


### **Bài 48: Error Handling và User Feedback**
**Nội dung cơ bản:**
- Comprehensive error handling
- User-friendly error messages
- Retry mechanisms
- Logging và monitoring

**Hoạt động thực hành:**
- Global error handling
- Network error recovery
- User feedback system
- Error reporting setup


### **Bài 49: Testing & Quality Assurance**
**Nội dung cơ bản:**
- Integration testing với API
- Mock testing strategies
- UI testing automation
- Performance testing

**Hoạt động thực hành:**
- API integration tests
- UI automation tests
- Performance benchmarking
- Code coverage analysis


### **Bài 50: Deployment và App Store Preparation**
**Nội dung cơ bản:**
- Build optimization
- App signing và certificates
- Play Store/App Store guidelines
- CI/CD pipeline setup

**Hoạt động thực hành:**
- Generate release builds
- Setup app signing
- Prepare store listings
- Deploy to test tracks

