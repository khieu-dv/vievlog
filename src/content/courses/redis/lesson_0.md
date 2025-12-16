# Khóa học Redis CRUD Operations Với Các Framework (21 bài)

### Bài 1: Redis CRUD với Node.js và Express.js
**Xây dựng dự án từ đầu:**
- Setup môi trường development
- Khởi tạo Node.js project với npm/yarn
- Cài đặt và cấu hình Express.js
- Cấu trúc thư mục dự án chuẩn

**Setup Redis với Docker Compose:**
- Tạo file docker-compose.yml cho Redis
- Cấu hình Redis container với persistent storage
- Setup Redis Insight container cho monitoring
- Network configuration giữa các containers

**Nội dung cơ bản - Redis CRUD Operations:**
- **SET**: Lưu trữ dữ liệu với `client.set(key, value)`
- **GET**: Truy xuất dữ liệu với `client.get(key)`
- **UPDATE**: Cập nhật dữ liệu với `client.set(key, newValue)` hoặc atomic operations
- **DELETE**: Xóa dữ liệu với `client.del(key)`
- Error handling cho các operations
- JSON data serialization/deserialization

**Hoạt động thực hành:**
- Xây dựng REST API từ đầu với CRUD endpoints
- POST /users (SET user data)
- GET /users/:id (GET user data)
- PUT /users/:id (UPDATE user data)
- DELETE /users/:id (DELETE user data)
- Sử dụng Redis Insight để monitor CRUD operations

### Bài 2: Redis CRUD với Next.js
**Xây dựng dự án từ đầu:**
- Create Next.js app với TypeScript
- Cấu hình ESLint và Prettier
- Setup Tailwind CSS
- Cấu trúc project với API routes

**Setup Redis với Docker Compose:**
- Next.js app + Redis + Redis Insight
- Environment variables configuration
- Development và production environments

**Nội dung cơ bản - Redis CRUD Operations:**
- **SET**: API routes để tạo dữ liệu mới
- **GET**: Server-side data fetching với Redis
- **UPDATE**: Partial updates và full replacement
- **DELETE**: Soft delete và hard delete patterns
- Client-side state synchronization
- Form handling với Redis backend

**Hoạt động thực hành:**
- Xây dựng blog platform từ đầu
- Create post (SET operation)
- Display posts (GET operations)
- Edit posts (UPDATE operations)
- Delete posts (DELETE operations)
- Real-time preview với Redis caching

### Bài 3: Redis CRUD với Vue.js
**Xây dựng dự án từ đầu:**
- Vue 3 project setup với Vite
- Composition API configuration
- Pinia state management setup
- Vue Router configuration

**Setup Redis với Docker Compose:**
- Vue dev server + Redis backend API + Redis Insight
- Proxy configuration cho API calls
- CORS setup cho development

**Nội dung cơ bản - Redis CRUD Operations:**
- **SET**: Form submission để tạo data
- **GET**: Reactive data fetching
- **UPDATE**: Two-way data binding với Redis
- **DELETE**: Confirmation dialogs và cleanup
- Vuex/Pinia integration với Redis operations
- Component state management

**Hoạt động thực hành:**
- Vue task management app từ đầu
- Add tasks (SET operations)
- View task list (GET operations)
- Edit tasks (UPDATE operations)
- Delete tasks (DELETE operations)
- Filter và search functionality

### Bài 4: Redis CRUD với React.js
**Xây dựng dự án từ đầu:**
- Create React App hoặc Vite setup
- TypeScript configuration
- useState và useEffect hooks
- Axios HTTP client setup

**Setup Redis với Docker Compose:**
- React dev server + Backend API + Redis + Redis Insight
- Development workflow optimization

**Nội dung cơ bản - Redis CRUD Operations:**
- **SET**: Form handling và data creation
- **GET**: useEffect data fetching patterns
- **UPDATE**: Controlled components và state updates
- **DELETE**: Optimistic updates và rollback
- Custom hooks cho Redis operations
- Error boundary handling

**Hoạt động thực hành:**
- React contact manager từ đầu
- Create contacts (SET with form validation)
- Display contacts (GET with pagination)
- Edit contacts (UPDATE with inline editing)
- Delete contacts (DELETE with confirmation)
- Search và filter contacts

### Bài 5: Redis CRUD với Angular
**Xây dựng dự án từ đầu:**
- Angular CLI project setup
- Service và component architecture
- Reactive forms setup
- HTTP client configuration

**Setup Redis với Docker Compose:**
- Angular dev server + Backend API + Redis + Redis Insight
- Development proxy configuration

**Nội dung cơ bản - Redis CRUD Operations:**
- **SET**: Reactive forms với Redis backend
- **GET**: Observable patterns cho data fetching
- **UPDATE**: Form validation và error handling
- **DELETE**: Service injection và HTTP operations
- Angular services cho Redis CRUD
- Template-driven vs reactive forms

**Hoạt động thực hành:**
- Angular inventory management từ đầu
- Add products (SET with form validation)
- View inventory (GET with sorting)
- Update stock (UPDATE operations)
- Remove products (DELETE with confirmation)
- Export/import functionality

### Bài 6: Redis CRUD với Spring Boot (Java)
**Xây dựng dự án từ đầu:**
- Spring Boot project với Maven
- Spring Data Redis setup
- RestController configuration
- Model/Entity classes

**Setup Redis với Docker Compose:**
- Spring Boot app + Redis + Redis Insight
- JVM optimization trong container

**Nội dung cơ bản - Redis CRUD Operations:**
- **SET**: `redisTemplate.opsForValue().set(key, value)`
- **GET**: `redisTemplate.opsForValue().get(key)`
- **UPDATE**: Conditional updates và transactions
- **DELETE**: `redisTemplate.delete(key)`
- Repository pattern với Redis
- JSON serialization với Jackson

**Hoạt động thực hành:**
- Spring Boot product catalog từ đầu
- POST /products (CREATE - SET operation)
- GET /products/{id} (READ - GET operation)
- PUT /products/{id} (UPDATE operation)
- DELETE /products/{id} (DELETE operation)
- Exception handling và validation

### Bài 7: Redis CRUD với Gin Framework (Golang)
**Xây dựng dự án từ đầu:**
- Go module initialization
- Gin framework setup
- Struct definitions cho data models
- go-redis client configuration

**Setup Redis với Docker Compose:**
- Go app + Redis + Redis Insight
- Multi-stage Docker build

**Nội dung cơ bản - Redis CRUD Operations:**
- **SET**: `rdb.Set(ctx, key, value, expiration)`
- **GET**: `rdb.Get(ctx, key).Result()`
- **UPDATE**: Atomic operations và pipelines
- **DELETE**: `rdb.Del(ctx, key)`
- JSON marshaling/unmarshaling
- Context handling và timeouts

**Hoạt động thực hành:**
- Go user management API từ đầu
- POST /users (SET user data)
- GET /users/:id (GET user data)
- PUT /users/:id (UPDATE user data)
- DELETE /users/:id (DELETE user data)
- Middleware cho error handling

### Bài 8: Redis CRUD với Django (Python)
**Xây dựng dự án từ đầu:**
- Django project với virtual environment
- Django models và Redis integration
- Views và URL configuration
- Django REST Framework setup

**Setup Redis với Docker Compose:**
- Django + Redis + Redis Insight + PostgreSQL
- Static files serving

**Nội dung cơ bản - Redis CRUD Operations:**
- **SET**: `cache.set(key, value, timeout)`
- **GET**: `cache.get(key, default=None)`
- **UPDATE**: Cache invalidation strategies
- **DELETE**: `cache.delete(key)`
- Model serialization với Redis
- Cache-aside pattern implementation

**Hoạt động thực hành:**
- Django blog system từ đầu
- Create posts (SET với caching)
- List posts (GET với pagination caching)
- Update posts (UPDATE với cache invalidation)
- Delete posts (DELETE với cleanup)
- Comment system với Redis

### Bài 9: Redis CRUD với Flask (Python)
**Xây dựng dự án từ đầu:**
- Flask application factory pattern
- Blueprint organization
- SQLAlchemy models với Redis caching
- Flask-WTF forms

**Setup Redis với Docker Compose:**
- Flask + Redis + Redis Insight
- Development server configuration

**Nội dung cơ bản - Redis CRUD Operations:**
- **SET**: `redis_client.set(key, json.dumps(data))`
- **GET**: `json.loads(redis_client.get(key))`
- **UPDATE**: Compare-and-swap operations
- **DELETE**: `redis_client.delete(key)`
- Session management với Redis
- Form data caching

**Hoạt động thực hành:**
- Flask e-commerce cart từ đầu
- Add to cart (SET cart items)
- View cart (GET cart contents)
- Update quantities (UPDATE operations)
- Remove items (DELETE from cart)
- Checkout process với Redis

### Bài 10: Redis CRUD với Laravel (PHP)
**Xây dựng dự án từ đầu:**
- Laravel project với Composer
- Eloquent models và Redis facade
- Route và Controller setup
- Blade templates

**Setup Redis với Docker Compose:**
- Laravel + Redis + Redis Insight + MySQL + Nginx
- PHP-FPM optimization

**Nội dung cơ bản - Redis CRUD Operations:**
- **SET**: `Redis::set($key, $value)`
- **GET**: `Redis::get($key)`
- **UPDATE**: `Redis::setex($key, $ttl, $newValue)`
- **DELETE**: `Redis::del($key)`
- Cache tags và invalidation
- Eloquent model caching

**Hoạt động thực hành:**
- Laravel news portal từ đầu
- Publish articles (SET operations)
- Display articles (GET với caching)
- Edit articles (UPDATE với cache refresh)
- Delete articles (DELETE với cleanup)
- Category và tag management

### Bài 11: Redis CRUD với Ruby on Rails
**Xây dựng dự án từ đầu:**
- Rails 7 application setup
- ActiveRecord models
- Controllers và routes
- Redis gem configuration

**Setup Redis với Docker Compose:**
- Rails + Redis + Redis Insight + PostgreSQL
- Asset pipeline configuration

**Nội dung cơ bản - Redis CRUD Operations:**
- **SET**: `$redis.set(key, value.to_json)`
- **GET**: `JSON.parse($redis.get(key))`
- **UPDATE**: Atomic increments và updates
- **DELETE**: `$redis.del(key)`
- Rails.cache integration
- ActiveRecord callbacks với Redis

**Hoạt động thực hành:**
- Rails forum application từ đầu
- Create topics (SET operations)
- Browse topics (GET với caching)
- Edit posts (UPDATE operations)
- Delete content (DELETE operations)
- User reputation system

### Bài 12: Redis CRUD với ASP.NET Core (C#)
**Xây dựng dự án từ đầu:**
- .NET Web API project
- Models và DTOs
- Controllers với dependency injection
- StackExchange.Redis setup

**Setup Redis với Docker Compose:**
- ASP.NET Core + Redis + Redis Insight
- Health check endpoints

**Nội dung cơ bản - Redis CRUD Operations:**
- **SET**: `await db.StringSetAsync(key, JsonSerializer.Serialize(value))`
- **GET**: `JsonSerializer.Deserialize<T>(await db.StringGetAsync(key))`
- **UPDATE**: Conditional sets với when conditions
- **DELETE**: `await db.KeyDeleteAsync(key)`
- Async/await patterns
- Generic repository pattern

**Hoạt động thực hành:**
- ASP.NET Core order management từ đầu
- Create orders (SET customer orders)
- Retrieve orders (GET order details)
- Update order status (UPDATE operations)
- Cancel orders (DELETE operations)
- Order tracking system

### Bài 13: Redis CRUD với Flutter (Mobile Development)
**Xây dựng dự án từ đầu:**
- Flutter project initialization
- HTTP client setup (dio/http)
- State management với Provider
- Local storage integration

**Setup Redis với Docker Compose:**
- Backend API + Redis + Redis Insight
- Mobile-friendly API endpoints

**Nội dung cơ bản - Redis CRUD Operations:**
- **SET**: HTTP POST requests tới Redis backend
- **GET**: HTTP GET requests với offline caching
- **UPDATE**: HTTP PUT requests với optimistic updates
- **DELETE**: HTTP DELETE với local synchronization
- Offline-first architecture
- Data synchronization strategies

**Hoạt động thực hành:**
- Flutter note-taking app từ đầu
- Create notes (POST/SET operations)
- Display notes (GET operations)
- Edit notes (PUT/UPDATE operations)
- Delete notes (DELETE operations)
- Offline sync với Redis backend

### Bài 14: Redis CRUD với React Native (Mobile Development)
**Xây dựng dự án từ đầu:**
- React Native CLI setup
- AsyncStorage configuration
- HTTP client với axios
- Navigation setup

**Setup Redis với Docker Compose:**
- React Native backend + Redis + Redis Insight
- WebSocket cho real-time updates

**Nội dung cơ bản - Redis CRUD Operations:**
- **SET**: API calls để create data
- **GET**: Fetch data với refresh functionality
- **UPDATE**: Optimistic updates với rollback
- **DELETE**: Confirmation dialogs
- AsyncStorage caching
- Background sync với Redis

**Hoạt động thực hành:**
- React Native expense tracker từ đầu
- Add expenses (SET operations)
- View expense history (GET operations)
- Edit expenses (UPDATE operations)
- Delete expenses (DELETE operations)
- Category management và reports

### Bài 15: Redis CRUD với Docker và Kubernetes
**Xây dựng dự án từ đầu:**
- Multi-container application
- Dockerfile cho CRUD operations
- Kubernetes manifests
- ConfigMaps cho Redis connection

**Setup Redis với Docker Compose:**
- Production-grade Redis setup
- Redis Insight deployment
- Persistent volumes

**Nội dung cơ bản - Redis CRUD Operations:**
- **SET**: Distributed SET operations
- **GET**: Load-balanced GET operations
- **UPDATE**: Consistent UPDATE across replicas
- **DELETE**: Safe DELETE với backup
- Container orchestration
- Health checks cho CRUD endpoints

**Hoạt động thực hành:**
- Containerized CRUD microservice từ đầu
- Kubernetes deployment với Redis
- Auto-scaling based on CRUD load
- Monitoring CRUD operations
- Backup và restore procedures

### Bài 16: Redis CRUD với GraphQL
**Xây dựng dự án từ đầu:**
- GraphQL server setup
- Schema design cho CRUD operations
- Resolvers implementation
- DataLoader configuration

**Setup Redis với Docker Compose:**
- GraphQL server + Redis + Redis Insight
- GraphQL playground

**Nội dung cơ bản - Redis CRUD Operations:**
- **SET**: Mutation resolvers với Redis SET
- **GET**: Query resolvers với Redis GET
- **UPDATE**: Update mutations với validation
- **DELETE**: Delete mutations với cleanup
- Batch operations với DataLoader
- Subscription cho real-time updates

**Hoạt động thực hành:**
- GraphQL library system từ đầu
- addBook mutation (SET book data)
- books query (GET book list)
- updateBook mutation (UPDATE book info)
- deleteBook mutation (DELETE book)
- Real-time book availability

### Bài 17: Redis CRUD với Microservices Architecture
**Xây dựng dự án từ đầu:**
- Multiple microservices design
- Service-to-service communication
- API gateway setup
- Event-driven architecture

**Setup Redis với Docker Compose:**
- Multi-service với shared Redis
- Service discovery
- Load balancer configuration

**Nội dung cơ bản - Redis CRUD Operations:**
- **SET**: Distributed data creation
- **GET**: Cross-service data retrieval
- **UPDATE**: Eventual consistency patterns
- **DELETE**: Cascading deletes across services
- Inter-service communication
- Data consistency strategies

**Hoạt động thực hành:**
- E-commerce microservices từ đầu
- User service (user CRUD)
- Product service (product CRUD)
- Order service (order CRUD)
- Inventory service (stock CRUD)
- Service orchestration

### Bài 18: Redis CRUD với ElasticSearch Integration
**Xây dựng dự án từ đầu:**
- ElasticSearch setup
- Redis-ES data synchronization
- Search API development
- Index management

**Setup Redis với Docker Compose:**
- ElasticSearch + Redis + Redis Insight
- Kibana cho visualization

**Nội dung cơ bản - Redis CRUD Operations:**
- **SET**: Dual write tới Redis và ES
- **GET**: Fast retrieval từ Redis
- **UPDATE**: Sync updates across stores
- **DELETE**: Consistent deletion
- Search result caching
- Data pipeline patterns

**Hoạt động thực hành:**
- Search platform từ đầu
- Index documents (SET operations)
- Search documents (GET operations)
- Update documents (UPDATE operations)
- Delete documents (DELETE operations)
- Analytics dashboard

### Bài 19: Redis CRUD với Real-time Features
**Xây dựng dự án từ đầu:**
- WebSocket server setup
- Real-time event handling
- Client-side real-time updates
- Pub/Sub pattern implementation

**Setup Redis với Docker Compose:**
- WebSocket server + Redis + Redis Insight
- Multiple client connections

**Nội dung cơ bản - Redis CRUD Operations:**
- **SET**: Real-time data creation broadcasts
- **GET**: Live data updates
- **UPDATE**: Instant update notifications
- **DELETE**: Real-time deletion alerts
- Pub/Sub cho real-time events
- WebSocket connection management

**Hoạt động thực hành:**
- Real-time collaboration tool từ đầu
- Create documents (SET với broadcast)
- View documents (GET với live updates)
- Edit documents (UPDATE với sync)
- Delete documents (DELETE với notifications)
- Multi-user editing

### Bài 20: Redis CRUD Performance Optimization
**Xây dựng dự án từ đầu:**
- Benchmarking setup
- Performance testing tools
- Optimization strategies
- Monitoring implementation

**Setup Redis với Docker Compose:**
- Redis cluster setup
- Performance monitoring stack
- Load testing environment

**Nội dung cơ bản - Redis CRUD Operations:**
- **SET**: Optimized SET operations (pipelines, batching)
- **GET**: Efficient GET patterns (connection pooling)
- **UPDATE**: Atomic UPDATE operations
- **DELETE**: Bulk DELETE strategies
- Memory optimization
- Connection pooling

**Hoạt động thực hành:**
- High-performance CRUD API từ đầu
- Benchmark CRUD operations
- Optimize SET performance
- Optimize GET performance
- Memory usage optimization
- Load testing và tuning

### Bài 21: Redis CRUD Production Best Practices
**Xây dựng dự án từ đầu:**
- Production architecture design
- Security implementation
- Backup strategies
- Monitoring setup

**Setup Redis với Docker Compose:**
- Production-ready configuration
- High availability setup
- Security hardening
- Complete monitoring

**Nội dung cơ bản - Redis CRUD Operations:**
- **SET**: Production SET với error handling
- **GET**: Reliable GET với fallbacks
- **UPDATE**: Safe UPDATE với validation
- **DELETE**: Secure DELETE với audit logs
- Data backup và recovery
- Security best practices

**Hoạt động thực hành:**
- Production CRUD system từ đầu
- Security audit cho CRUD operations
- Backup/restore procedures
- Performance monitoring
- Final project: Enterprise CRUD solution

## Tóm tắt CRUD Operations trong Redis:

### Core Commands:
- **CREATE/SET**: `SET key value`, `SETEX key seconds value`
- **READ/GET**: `GET key`, `MGET key1 key2`
- **UPDATE**: `SET key newValue` (overwrite), atomic operations
- **DELETE**: `DEL key`, `UNLINK key` (async delete)

### Advanced Patterns:
- Conditional operations: `SET key value NX`, `SET key value XX`
- Atomic operations: `INCR`, `DECR`, `INCRBY`
- Batch operations: `MSET`, `MGET`, `PIPELINE`
- Expiration: `EXPIRE key seconds`, `TTL key`