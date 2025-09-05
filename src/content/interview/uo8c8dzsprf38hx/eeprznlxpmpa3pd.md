---
title: "Web Development - Câu Hỏi Phỏng Vấn Backend (27-32)"
postId: "eeprznlxpmpa3pd"
category: "BackEnd Interview"
created: "2/9/2025"
updated: "2/9/2025"
---

# Web Development - Câu Hỏi Phỏng Vấn Backend (27-32)


## Câu 27: First-party Cookies vs Third-party Cookies?

**First-party Cookies:**
- **Định nghĩa:** Cookie do chính website bạn đang truy cập tạo ra.
- **Ví dụ:** Trang `example.com` lưu cookie để ghi nhớ chế độ tối (dark mode).
  ```javascript
  document.cookie = "theme=dark; path=/; max-age=86400";
  ```
- **Ứng dụng:** Lưu phiên đăng nhập, sở thích người dùng, giỏ hàng.
- **Ưu điểm:** An toàn, ít bị chặn bởi trình duyệt.

**Third-party Cookies:**
- **Định nghĩa:** Cookie do website khác (không phải trang bạn đang truy cập) tạo ra.
- **Ví dụ:** Trang `news.com` tải quảng cáo từ `ads.com`, `ads.com` lưu cookie theo dõi.
  ```javascript
  document.cookie = "tracking_id=12345; domain=.ads.com; max-age=31536000";
  ```
- **Ứng dụng:** Theo dõi quảng cáo, phân tích hành vi người dùng.
- **Nhược điểm:** Dễ bị chặn bởi trình duyệt (Safari, Chrome), liên quan đến quyền riêng tư.

**So sánh:**
| Tiêu chí | First-party | Third-party |
|----------|-------------|-------------|
| Nguồn | Chính website | Website khác |
| Quyền riêng tư | Ít lo ngại | Nhiều lo ngại |
| Trình duyệt | Ít bị chặn | Thường bị chặn |

**Giải pháp thay thế:** Dùng lưu trữ phía server hoặc first-party data để tránh phụ thuộc third-party cookies.

\---

## Câu 28: Chiến lược versioning cho API?

**1. URL Versioning:**
- Thêm số phiên bản vào URL.
- Ví dụ: `GET /api/v1/users` hoặc `/api/v2/users`.
  ```java
  @RestController
  @RequestMapping("/api/v1")
  public class UserController {
      @GetMapping("/users")
      public List<User> getUsers() { return userService.getUsers(); }
  }
  ```
- **Ưu điểm:** Dễ hiểu, dễ triển khai.
- **Nhược điểm:** URL dài, khó bảo trì nhiều phiên bản.

**2. Header Versioning:**
- Dùng header để chỉ định phiên bản.
- Ví dụ: `GET /api/users` với header `API-Version: v1`.
  ```java
  @GetMapping("/users")
  public ResponseEntity<?> getUsers(@RequestHeader("API-Version") String version) {
      if ("v1".equals(version)) return ResponseEntity.ok(userService.getUsersV1());
      return ResponseEntity.ok(userService.getUsersV2());
  }
  ```
- **Ưu điểm:** URL sạch, linh hoạt.
- **Nhược điểm:** Phức tạp hơn cho client.

**3. Query Parameter Versioning:**
- Thêm phiên bản vào tham số truy vấn.
- Ví dụ: `GET /api/users?version=1`.
  ```java
  @GetMapping("/users")
  public ResponseEntity<?> getUsers(@RequestParam(value = "version", defaultValue = "1") String version) {
      if ("1".equals(version)) return ResponseEntity.ok(userService.getUsersV1());
      return ResponseEntity.ok(userService.getUsersV2());
  }
  ```
- **Ưu điểm:** Dễ triển khai.
- **Nhược điểm:** Không rõ ràng như URL versioning.

**Tốt nhất:** Dùng URL versioning cho đơn giản, kết hợp header versioning cho linh hoạt.

\---

## Câu 29: Nhược điểm của SPA từ góc độ backend?

**1. SEO khó khăn:**
- **Vấn đề:** Nội dung động khó được công cụ tìm kiếm index.
- **Giải pháp:** Dùng server-side rendering (SSR).
  ```java
  @GetMapping("/products")
  public String products(Model model, HttpServletRequest request) {
      if (request.getHeader("User-Agent").contains("Googlebot")) {
          model.addAttribute("products", productService.getProducts());
          return "products-ssr"; // Trang HTML đầy đủ
      }
      return "spa-shell"; // Shell cho SPA
  }
  ```

**2. Thời gian tải ban đầu lâu:**
- **Vấn đề:** Bundle lớn, nhiều API call.
- **Giải pháp:** Tối ưu API và dùng code splitting.
  ```javascript
  const Dashboard = React.lazy(() => import('./Dashboard')); // Tải khi cần
  ```

**3. Độ phức tạp định tuyến:**
- **Vấn đề:** Backend phải xử lý tất cả route của SPA.
- **Giải pháp:** Chuyển tiếp tất cả route không phải API về `index.html`.
  ```java
  @GetMapping("/{path:^(?!api).*}")
  public String spaRoutes() {
      return "forward:/index.html";
  }
  ```

**4. Bảo mật API:**
- **Vấn đề:** Code phía client dễ bị lộ, cần bảo mật API mạnh.
- **Giải pháp:** Xác thực JWT, giới hạn tốc độ (rate limiting).
  ```java
  @PostMapping("/api/users")
  public ResponseEntity<?> createUser(@RequestBody User user, Principal principal) {
      if (rateLimitService.isExceeded(principal.getName())) {
          return ResponseEntity.status(429).build();
      }
      return ResponseEntity.ok(userService.create(user));
  }
  ```

\---

## Câu 30: Tại sao dịch vụ stateless quan trọng?

**Stateless là gì?** Dịch vụ không lưu trạng thái giữa các request, mỗi request chứa đầy đủ thông tin cần thiết.

**Ví dụ:**
- **Stateful (xấu):** Lưu giỏ hàng trong bộ nhớ server.
  ```java
  private Map<String, Cart> carts = new HashMap<>();
  public void addToCart(String userId, String item) {
      carts.get(userId).add(item); // Phụ thuộc trạng thái
  }
  ```
- **Stateless (tốt):** Lưu giỏ hàng trong database.
  ```java
  public Cart addToCart(Long cartId, String item) {
      Cart cart = cartRepository.findById(cartId).orElse(new Cart());
      cart.add(item);
      return cartRepository.save(cart);
  }
  ```

**Lợi ích:**
1. **Mở rộng dễ dàng:** Thêm server mới mà không cần đồng bộ trạng thái.
   ```yaml
   services:
     app:
       image: app:latest
       replicas: 5 # Mở rộng dễ dàng
   ```
2. **Độ tin cậy cao:** Server lỗi không làm mất dữ liệu.
3. **Tải cân bằng đơn giản:** Bất kỳ server nào cũng xử lý được request.
4. **Triển khai dễ:** Cập nhật rolling update không lo mất trạng thái.

**Thực tiễn:** Lưu trạng thái trong database hoặc Redis, dùng JWT cho xác thực.

\---

## Câu 31: REST vs SOAP, khi nào dùng?

**REST:**
- **Đặc điểm:** Dùng HTTP, JSON, stateless, đơn giản.
- **Ví dụ:**
  ```java
  @RestController
  @RequestMapping("/api/users")
  public class UserController {
      @GetMapping("/{id}")
      public User getUser(@PathVariable Long id) {
          return userService.findById(id);
      }
  }
  ```
- **Khi dùng:** API web, ứng dụng mobile, microservices, thao tác CRUD.

**SOAP:**
- **Đặc điểm:** Dùng XML, có WSDL, hỗ trợ bảo mật và giao dịch phức tạp.
- **Ví dụ:**
  ```java
  @WebService
  public class BankingService {
      @WebMethod
      public TransferResponse transfer(TransferRequest request) {
          return bankingService.processTransfer(request);
      }
  }
  ```
- **Khi dùng:** Ứng dụng doanh nghiệp, cần bảo mật cao (ngân hàng), tích hợp hệ thống cũ.

**So sánh:**
| Tiêu chí | REST | SOAP |
|----------|------|------|
| Định dạng | JSON/XML | XML |
| Bảo mật | HTTPS, OAuth | WS-Security |
| Hiệu năng | Nhẹ | Nặng |
| Dùng cho | Web, mobile | Doanh nghiệp |

\---

## Câu 32: MVC vs MVVM?

**MVC (Model-View-Controller):**
- **Đặc điểm:** Controller điều khiển, View hiển thị Model, luồng dữ liệu một chiều.
- **Ví dụ (Spring Boot):**
  ```java
  @Controller
  public class UserController {
      @GetMapping("/users")
      public String listUsers(Model model) {
          model.addAttribute("users", userService.findAll());
          return "users/list"; // View
      }
  }
  ```
- **Khi dùng:** Web server-side, ứng dụng đơn giản.

**MVVM (Model-View-ViewModel):**
- **Đặc điểm:** ViewModel liên kết View và Model, hỗ trợ liên kết hai chiều.
- **Ví dụ (Vue.js):**
  ```vue
  <template>
      <input v-model="form.name" placeholder="Name">
  </template>
  <script>
  export default {
      data() {
          return { form: { name: '' } };
      }
  }
  </script>
  ```
- **Khi dùng:** Ứng dụng client phức tạp, mobile, SPA.

**So sánh:**
| Tiêu chí | MVC | MVVM |
|----------|-----|------|
| Luồng dữ liệu | Một chiều | Hai chiều |
| Phức tạp | Đơn giản hơn | Phức tạp hơn |
| Dùng cho | Web server | Ứng dụng client |

**Tốt nhất:** Kết hợp MVC cho backend API và MVVM cho frontend SPA.


---

*Post ID: eeprznlxpmpa3pd*  
*Category: BackEnd Interview*  
*Created: 2/9/2025*  
*Updated: 2/9/2025*
