---
title: "Code Design - Câu Hỏi Phỏng Vấn Backend (11-18)"
postId: "fpy31vtb7565mvz"
category: "BackEnd Interview"
created: "2/9/2025"
updated: "2/9/2025"
---

# Code Design - Câu Hỏi Phỏng Vấn Backend (11-18)



## Câu 11: Tính gắn kết cao (High Cohesion) và liên kết lỏng lẻo (Loose Coupling) là gì?

**Tính gắn kết cao (High Cohesion):**  
- Các thành phần trong một module tập trung vào một mục đích chung.  
- **Ví dụ tốt:**  
  ```java
  class UserValidator {
      boolean isValidEmail(String email) { /* Kiểm tra email */ }
      boolean isValidPassword(String password) { /* Kiểm tra mật khẩu */ }
  }
  ```  
- **Ví dụ xấu (tránh):**  
  ```java
  class UserUtility {
      boolean isValidEmail(String email) { /* Kiểm tra email */ }
      void sendEmail(String to, String message) { /* Gửi email */ }
      double calculateDiscount(double price) { /* Tính chiết khấu */ }
  }
  ```

**Liên kết lỏng lẻo (Loose Coupling):**  
- Các module ít phụ thuộc lẫn nhau, thay đổi một module không ảnh hưởng lớn đến module khác.  
- **Ví dụ xấu (tránh):**  
  ```java
  class OrderService {
      void processOrder(Order order) {
          EmailSender emailSender = new EmailSender();
          emailSender.sendOrderConfirmation(order);
      }
  }
  ```  
- **Ví dụ tốt:**  
  ```java
  interface NotificationService {
      void sendOrderConfirmation(Order order);
  }
  class OrderService {
      private NotificationService notificationService;
      OrderService(NotificationService notificationService) {
          this.notificationService = notificationService;
      }
      void processOrder(Order order) {
          notificationService.sendOrderConfirmation(order);
      }
  }
  ```

**Cách đạt được:**  
- Dùng interface, Dependency Injection, Event-Driven Architecture, hoặc Factory Pattern.  

**Lợi ích:** Dễ bảo trì, kiểm thử, tái sử dụng và mở rộng.

## Câu 12: Tại sao chỉ số mảng bắt đầu từ 0?

**Lý do:**  
- Chỉ số 0 giúp truy cập trực tiếp địa chỉ bộ nhớ đầu tiên, không cần phép tính thừa.  
- **Ví dụ:**  
  ```c
  int arr[5] = {10, 20, 30, 40, 50};
  // arr[0]: 1000 + (0 × 4) = 1000
  // arr[1]: 1000 + (1 × 4) = 1004
  ```  
- Nếu bắt đầu từ 1, cần trừ 1, làm giảm hiệu năng.

**Lợi ích:**  
- Tăng hiệu năng.  
- Hỗ trợ phép toán con trỏ.  
- Vòng lặp đơn giản: `for (int i = 0; i < length; i++)`.  
- Phù hợp với ngôn ngữ C và các ngôn ngữ hiện đại.

## Câu 13: TDD ảnh hưởng đến thiết kế code như thế nào?

**TDD (Test-Driven Development):**  
- Quy trình: Viết test thất bại → Viết code để pass → Tái cấu trúc.  

**Ảnh hưởng:**  
1. **Giảm phụ thuộc:**  
   ```java
   class OrderService {
       private PaymentService paymentService;
       OrderService(PaymentService paymentService) {
           this.paymentService = paymentService;
       }
   }
   ```  
2. Tuân thủ SRP, tăng tính gắn kết, phụ thuộc rõ ràng.  

**Lợi ích:**  
- Code chia module rõ ràng.  
- Tránh thiết kế thừa.  
- API dễ hiểu.  

**Ví dụ:**  
```java
@Test
void shouldProcessOrderSuccessfully() {
    PaymentService mock = mock(PaymentService.class);
    OrderService service = new OrderService(mock);
    service.processOrder(new Order());
    verify(mock).processPayment(any());
}
```

## Câu 14: Tính gắn kết (Cohesion) và liên kết (Coupling) khác nhau thế nào?

**Tính gắn kết (Cohesion):**  
- Mức độ liên quan giữa các thành phần trong một module.  
- **Ví dụ tốt:**  
  ```java
  class PrimeNumberChecker {
      boolean isPrime(int number) { /* Kiểm tra số nguyên tố */ }
  }
  ```  
- **Ví dụ xấu:**  
  ```java
  class Utilities {
      void printReport() { /* In báo cáo */ }
      int calculateTax() { /* Tính thuế */ }
  }
  ```

**Liên kết (Coupling):**  
- Mức độ phụ thuộc giữa các module.  
- **Ví dụ tốt:**  
  ```java
  class Calculator {
      double add(double a, double b) { return a + b; }
  }
  ```  
- **Ví dụ xấu:**  
  ```java
  class BadOrderService {
      void processOrder() {
          SomeOtherClass.internalField = "modified";
      }
  }
  ```

**So sánh:**  
| Tiêu chí | Cohesion | Coupling |
|----------|----------|----------|
| Phạm vi | Trong module | Giữa module |
| Mục tiêu | Cao | Thấp |
| Tốt | Functional | Data |
| Xấu | Coincidental | Content |

**Cải thiện:** Cohesion dùng SRP; Coupling dùng interface, Dependency Injection.

## Câu 15: Lợi ích của Refactoring?

**Refactoring:** Cải thiện cấu trúc code, giữ nguyên chức năng.  

**Lợi ích:**  
1. **Dễ đọc:**  
   ```java
   double calculateTotal(List<Item> items) {
       return items.stream().mapToDouble(Item::getPrice).sum();
   }
   ```  
2. Dễ bảo trì, tối ưu hiệu năng, giảm nợ kỹ thuật, dễ kiểm thử.  

**Kỹ thuật:**  
- Tách hàm nhỏ, đặt tên rõ nghĩa, loại bỏ code lặp, nhóm tham số.  

**Lưu ý:**  
- Có test trước khi refactor.  
- Thay đổi từng bước nhỏ.  
- Dùng công cụ tự động.

## Câu 16: Có cần viết comment trong code không?

**Không nên:**  
- Comment hiển nhiên: `int age = 25; // Gán age bằng 25`.  
- Lặp lại tên method: `void calculateTotal() { // Tính tổng }`.  

**Nên:**  
1. Giải thích lý do:  
   ```java
   double calculateDiscount(Customer customer) {
       // Chiết khấu 25% cho VIP trong mùa lễ
       return customer.isVIP() ? 0.25 : 0.10;
   }
   ```  
2. Mô tả logic phức tạp, cảnh báo tác dụng phụ, hoặc giải thích regex/phụ thuộc ngoài.  

**Thay thế:** Đặt tên rõ ràng, tách hàm nhỏ.  

**Bảo trì:** Cập nhật/xóa comment khi code thay đổi.

## Câu 17: Thiết kế (Design) và Kiến trúc (Architecture) khác nhau thế nào?

**Kiến trúc:**  
- Cấu trúc cấp cao, định nghĩa thành phần chính và mối quan hệ.  
- Ví dụ: Dùng microservices, chọn cơ sở dữ liệu.  
- Khó thay đổi, tập trung vào hiệu năng/mở rộng.  

**Thiết kế:**  
- Chi tiết triển khai từng module.  
- Ví dụ:  
  ```java
  class UserService {
      private UserRepository repository;
      UserService(UserRepository repository) {
          this.repository = repository;
      }
  }
  ```  
- Dễ thay đổi, tập trung vào chức năng.  

**So sánh:**  
| Tiêu chí | Architecture | Design |
|----------|-------------|--------|
| Phạm vi | Toàn hệ thống | Từng module |
| Thay đổi | Khó | Dễ hơn |
| Mục tiêu | Cấu trúc | Triển khai |

## Câu 18: Tại sao viết test trước khi viết code?

**Lợi ích TDD:**  
1. Code dễ kiểm thử:  
   ```java
   class OrderService {
       private PaymentService paymentService;
       OrderService(PaymentService paymentService) {
           this.paymentService = paymentService;
       }
   }
   ```  
2. Yêu cầu rõ ràng, tránh thiết kế thừa, tự tin khi refactor.  

**Quy trình:**  
- Red: Viết test thất bại.  
- Green: Viết code để pass.  
- Refactor: Cải thiện code.  

**Tránh:** Viết quá nhiều test, test chi tiết triển khai, bỏ qua refactor.


---

*Post ID: fpy31vtb7565mvz*  
*Category: BackEnd Interview*  
*Created: 2/9/2025*  
*Updated: 2/9/2025*
