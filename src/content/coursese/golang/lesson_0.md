# Chương trình khóa học Golang từ cơ bản đến nâng cao

## Phần 1: Nền tảng Golang (Bài 1-10)

### Bài 1: Giới thiệu về Golang
**Nội dung:**
- Lịch sử và triết lý của Golang
- Điểm mạnh và các ứng dụng phổ biến
- Cài đặt Go và thiết lập môi trường phát triển
- Cấu trúc một chương trình Go đơn giản

**Hoạt động:**
- Cài đặt Go trên máy tính
- Viết và chạy chương trình "Hello World"
- Khám phá Go Playground

### Bài 2: Biến và kiểu dữ liệu cơ bản
**Nội dung:**
- Khai báo biến và hằng số
- Các kiểu dữ liệu cơ bản: int, float, bool, string
- Zero values
- Type conversion và type inference

**Hoạt động:**
- Thực hành khai báo và sử dụng biến với các kiểu dữ liệu khác nhau
- Viết chương trình tính toán đơn giản
- Bài tập chuyển đổi kiểu dữ liệu

### Bài 3: Toán tử và biểu thức
**Nội dung:**
- Toán tử số học
- Toán tử so sánh
- Toán tử logic
- Toán tử gán
- Thứ tự ưu tiên của toán tử

**Hoạt động:**
- Viết chương trình sử dụng các loại toán tử
- Giải quyết bài toán tính toán phức tạp với nhiều toán tử
- Xây dựng máy tính đơn giản

### Bài 4: Cấu trúc điều khiển - Rẽ nhánh
**Nội dung:**
- Câu lệnh if-else
- Câu lệnh switch-case
- Biểu thức điều kiện ngắn gọn

**Hoạt động:**
- Viết chương trình kiểm tra số chẵn/lẻ
- Tạo chương trình chuyển đổi ngày trong tuần
- Xây dựng ứng dụng tính điểm trung bình và xếp loại học sinh

### Bài 5: Cấu trúc điều khiển - Vòng lặp
**Nội dung:**
- Vòng lặp for
- Vòng lặp for như while
- Vòng lặp vô hạn
- Break và continue
- Range iteration

**Hoạt động:**
- Viết chương trình tính tổng các số từ 1 đến n
- Tạo chương trình in bảng cửu chương
- Xây dựng trò chơi đoán số đơn giản

### Bài 6: Arrays và Slices
**Nội dung:**
- Mảng trong Go
- Slice - mảng động
- Làm việc với slice: append, copy, len, cap
- Slice tricks và patterns

**Hoạt động:**
- Thực hành tạo và thao tác với mảng và slice
- Viết chương trình tìm giá trị lớn nhất/nhỏ nhất trong slice
- Xây dựng bài tập xử lý dữ liệu sinh viên

### Bài 7: Maps và Structs
**Nội dung:**
- Maps - bảng băm
- Khởi tạo và thao tác với maps
- Struct - cấu trúc dữ liệu tùy chỉnh
- Định nghĩa và sử dụng struct

**Hoạt động:**
- Tạo từ điển đơn giản sử dụng map
- Xây dựng chương trình quản lý danh bạ
- Mô hình hóa đối tượng sinh viên bằng struct

### Bài 8: Hàm trong Go
**Nội dung:**
- Định nghĩa và gọi hàm
- Tham số và giá trị trả về
- Multiple return values
- Named return values
- Variadic functions

**Hoạt động:**
- Viết các hàm tính toán đơn giản
- Xây dựng thư viện utility functions
- Tạo chương trình tính thuế thu nhập

### Bài 9: Pointers và Values
**Nội dung:**
- Giới thiệu về pointers
- Tham chiếu và tham trị
- Khi nào sử dụng pointers
- Các lỗi thường gặp với pointers

**Hoạt động:**
- Viết chương trình sử dụng pointers
- So sánh kết quả khi truyền tham số kiểu tham chiếu và tham trị
- Xây dựng chương trình quản lý inventory

### Bài 10: Xử lý lỗi
**Nội dung:**
- Mô hình xử lý lỗi trong Go
- Error interface
- Tạo và trả về errors
- Error handling patterns
- Panic và recover

**Hoạt động:**
- Viết chương trình kiểm tra input người dùng
- Tạo custom error types
- Xây dựng ứng dụng đọc/ghi file với xử lý lỗi đúng cách

## Phần 2: Lập trình nâng cao với Go (Bài 11-20)

### Bài 11: Methods và Interfaces
**Nội dung:**
- Methods trong Go
- Receiver types: value vs pointer
- Interface là gì
- Khai báo và triển khai interface
- Empty interface và type assertion

**Hoạt động:**
- Tạo struct và methods
- Triển khai interface cho nhiều loại đối tượng
- Xây dựng hệ thống quản lý hình học

### Bài 12: Packages và Modules
**Nội dung:**
- Tổ chức code với packages
- Imports và exports
- Tạo và sử dụng modules
- Go modules và dependency management
- Versioning

**Hoạt động:**
- Tạo package riêng
- Xây dựng module đơn giản
- Sử dụng third-party packages

### Bài 13: File I/O và Serialization
**Nội dung:**
- Đọc và ghi file
- Làm việc với directories
- JSON encoding/decoding
- XML processing
- Protocol buffers

**Hoạt động:**
- Tạo chương trình đọc/ghi file text
- Xây dựng ứng dụng đơn giản lưu cấu hình JSON
- Tạo API client đơn giản

### Bài 14: Concurrency - Goroutines
**Nội dung:**
- Concurrency vs Parallelism
- Goroutines là gì
- Tạo và quản lý goroutines
- WaitGroups
- Goroutine leaks và patterns

**Hoạt động:**
- Viết chương trình đơn giản sử dụng goroutines
- Xây dựng worker pool
- Tạo web crawler đơn giản

### Bài 15: Concurrency - Channels
**Nội dung:**
- Channels là gì
- Buffered vs unbuffered channels
- Blocking và communication
- Select statement
- Fan-in, fan-out patterns

**Hoạt động:**
- Tạo chương trình sử dụng channels
- Xây dựng pipeline xử lý dữ liệu
- Tạo ứng dụng tính toán song song

### Bài 16: Concurrency Patterns
**Nội dung:**
- Generator pattern
- Worker pools
- Pipeline pattern
- Fan-in, fan-out
- Timeout và cancellation

**Hoạt động:**
- Xây dựng hệ thống xử lý batch
- Tạo service handler với timeout
- Triển khai pipeline xử lý ảnh đơn giản

### Bài 17: Context Package
**Nội dung:**
- Tổng quan về context package
- Context values
- Cancellation
- Deadlines và timeouts
- Sử dụng context trong HTTP requests

**Hoạt động:**
- Viết API client với context timeout
- Xây dựng service với cancellation
- Tạo long-running process có thể hủy

### Bài 18: Testing cơ bản
**Nội dung:**
- Viết unit tests
- Table-driven tests
- Test coverage
- Benchmarking
- Testable code design

**Hoạt động:**
- Viết test cases cho functions và methods
- Tạo test suite cho package
- Thực hiện benchmark functions

### Bài 19: Testing nâng cao
**Nội dung:**
- Mocking trong Go
- Dependency injection
- Testing HTTP handlers
- Testify và các thư viện testing
- Integration tests

**Hoạt động:**
- Viết test với mocks
- Tạo integration test cho database
- Testing HTTP API

### Bài 20: Reflection và Metaprogramming
**Nội dung:**
- Reflection API
- Type introspection
- Khi nào sử dụng reflection
- Code generation
- Nhược điểm của reflection

**Hoạt động:**
- Viết chương trình dùng reflection
- Tạo simple validation framework
- Xây dựng generic caching solution

## Phần 3: Xây dựng ứng dụng thực tế (Bài 21-30)

### Bài 21: Web Development - HTTP Basics
**Nội dung:**
- HTTP trong Go
- net/http package
- Handlers và ServeMux
- Middleware
- Static file serving

**Hoạt động:**
- Tạo web server đơn giản
- Xây dựng middleware logging
- Triển khai static file server

### Bài 22: Web Development - RESTful APIs
**Nội dung:**
- RESTful principles
- API design
- JSON responses
- Content negotiation
- API versioning

**Hoạt động:**
- Xây dựng CRUD API đơn giản
- Tạo API documentation
- Triển khai API với versioning

### Bài 23: Web Development - Templates
**Nội dung:**
- HTML templates
- Template functions
- Layouts và partials
- Data passing
- XSS prevention

**Hoạt động:**
- Tạo trang web đơn giản với templates
- Xây dựng layout system
- Triển khai form với validation

### Bài 24: Web Frameworks
**Nội dung:**
- So sánh standard library vs frameworks
- Giới thiệu về Gin
- Routing và middleware
- Validation
- Dependency injection

**Hoạt động:**
- Tạo API với Gin
- Triển khai middleware
- Xây dựng service layer

### Bài 25: Database - SQL
**Nội dung:**
- database/sql package
- Connecting to databases
- CRUD operations
- Transactions
- Prepared statements

**Hoạt động:**
- Kết nối với MySQL/PostgreSQL
- Xây dựng repository layer
- Tạo service với transaction support

### Bài 26: Database - ORMs
**Nội dung:**
- GORM overview
- Models và migrations
- Relationships
- Query building
- Hooks và callbacks

**Hoạt động:**
- Xây dựng application với GORM
- Triển khai relationships
- Tạo migration system

### Bài 27: Authentication và Authorization
**Nội dung:**
- JWT authentication
- OAuth 2.0
- User management
- Role-based access control
- Security best practices

**Hoạt động:**
- Xây dựng authentication system
- Triển khai JWT middleware
- Tạo RBAC system

### Bài 28: Caching
**Nội dung:**
- In-memory caching
- Redis integration
- Cache strategies
- Cache invalidation
- Distributed caching

**Hoạt động:**
- Xây dựng in-memory cache layer
- Tích hợp Redis
- Tạo caching middleware

### Bài 29: Microservices - Phần 1
**Nội dung:**
- Microservices principles
- Service boundaries
- Communication patterns
- Service discovery
- Configuration management

**Hoạt động:**
- Thiết kế microservice architecture
- Xây dựng service đơn giản
- Triển khai service discovery

### Bài 30: Microservices - Phần 2
**Nội dung:**
- gRPC introduction
- Protocol Buffers
- Streaming
- Service-to-Service communication
- Error handling

**Hoạt động:**
- Tạo gRPC service
- Xây dựng client/server
- Triển khai bidirectional streaming

## Phần 4: Kỹ năng nâng cao và chuyên môn (Bài 31-40)

### Bài 31: Distributed Systems
**Nội dung:**
- CAP theorem
- Consistency patterns
- Distributed transactions
- Leader election
- Consensus algorithms

**Hoạt động:**
- Xây dựng distributed cache
- Triển khai distributed locking
- Tạo consensus simulation

### Bài 32: Messaging và Event Streaming
**Nội dung:**
- Message queues
- Pub/Sub patterns
- Kafka integration
- RabbitMQ
- Event-driven architecture

**Hoạt động:**
- Tích hợp với message broker
- Xây dựng event-driven system
- Triển khai retry mechanisms

### Bài 33: Monitoring và Observability
**Nội dung:**
- Logging best practices
- Metrics collection
- Distributed tracing
- Prometheus integration
- OpenTelemetry

**Hoạt động:**
- Xây dựng logging infrastructure
- Tích hợp Prometheus
- Triển khai tracing

### Bài 34: Performance Optimization
**Nội dung:**
- Profiling
- Memory optimization
- CPU profiling
- pprof usage
- Benchmarking

**Hoạt động:**
- Phân tích performance bottlenecks
- Tối ưu hóa memory usage
- Tạo benchmarks cho code

### Bài 35: Security Best Practices
**Nội dung:**
- Input validation
- SQL injection prevention
- XSS protection
- CSRF protection
- Security headers

**Hoạt động:**
- Code review for security
- Triển khai security middleware
- Tạo security checklist

### Bài 36: Containerization và Docker
**Nội dung:**
- Docker basics
- Containerizing Go applications
- Multi-stage builds
- Docker Compose
- Best practices

**Hoạt động:**
- Tạo Dockerfile cho Go app
- Xây dựng multi-container system
- Triển khai CI pipeline

### Bài 37: Kubernetes với Go
**Nội dung:**
- Kubernetes basics
- Client-go library
- Custom controllers
- Operators
- Kubernetes patterns

**Hoạt động:**
- Triển khai Go app trên Kubernetes
- Tạo simple operator
- Xây dựng autoscaling service

### Bài 38: Serverless Go
**Nội dung:**
- Serverless architecture
- AWS Lambda với Go
- Google Cloud Functions
- Cold starts
- Serverless patterns

**Hoạt động:**
- Xây dựng serverless function
- Tạo event-driven lambda
- Triển khai API Gateway

### Bài 39: Blockchain Development với Go
**Nội dung:**
- Blockchain fundamentals
- Cryptography trong Go
- Simple blockchain implementation
- Smart contracts
- Ethereum integration

**Hoạt động:**
- Tạo simple blockchain
- Xây dựng cryptocurrency wallet
- Triển khai smart contract client

### Bài 40: Dự án cuối khóa
**Nội dung:**
- Project planning
- System design
- Best practices implementation
- Deployment strategies
- Production readiness

**Hoạt động:**
- Thiết kế full-stack application
- Xây dựng CI/CD pipeline
- Triển khai production-ready system