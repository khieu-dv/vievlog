---
title: "Bài 8: Giao tiếp với đội ngũ kỹ thuật (Developer, Tester)"
postId: "1n3z75dfb7bbxt1"
category: "BRSE"
created: "2/9/2025"
updated: "2/9/2025"
---

# Bài 8: Giao tiếp với đội ngũ kỹ thuật (Developer, Tester)

*Từ ngôn ngữ kinh doanh đến ngôn ngữ kỹ thuật*

\---

## 🎯 Mục tiêu học tập

Sau bài học này, bạn sẽ có thể:
- **해석하다** (phiên dịch) yêu cầu nghiệp vụ thành **기술 명세서** (đặc tả kỹ thuật)
- **소통하다** (giao tiếp) chuyên nghiệp với **개발팀** (team phát triển)
- **작성하다** (viết) **요구사항 문서** (tài liệu yêu cầu) rõ ràng và chi tiết
- **처리하다** (xử lý) **피드백** từ đội ngũ kỹ thuật một cách hiệu quả

\---

## 🏢 Tình huống mở đầu: Khủng hoảng tại SmartRetail

**Background:** Bạn là BRSE tại công ty phần mềm VietTech, đang làm dự án quản lý bán hàng cho chuỗi cửa hàng SmartRetail tại Seoul.

**상황 (Tình huống):** Sáng thứ 2, bạn nhận được tin nhắn khẩn cấp:

> **김과장** (Trưởng phòng SmartRetail): "Hệ thống báo cáo doanh thu có vấn đề! Không hiển thị đúng số liệu cuối tuần!"
>
> **박개발자** (Developer): "Yêu cầu trong document không rõ ràng, không biết xử lý thế nào!"
>
> **이테스터** (Tester): "Test case thiếu trường hợp weekend, không thể validate!"

**❓ Vậy làm thế nào để giải quyết tình huống này?**

\---

## 📊 Hiểu "DNA" của đội ngũ kỹ thuật

### 개발자 (Developer) - "Logic Machine"

**🧠 Tư duy:**
- Mọi thứ phải có **논리적 순서** (trình tự logic)
- Yêu cầu **구체적인 입력값과 출력값** (input/output cụ thể)
- Không chấp nhận **모호한 요구사항** (yêu cầu mơ hồ)

**💬 Ngôn ngữ họ hiểu:**
```
❌ "Báo cáo đẹp và dễ nhìn"
✅ "Biểu đồ cột màu xanh #4CAF50, font size 14px, hiển thị 7 ngày gần nhất"
```

**📝 Họ cần từ BRSE:**
- **상세한 기능 명세** (đặc tả chức năng chi tiết)
- **데이터 흐름도** (sơ đồ luồng dữ liệu)
- **예외 처리 시나리오** (kịch bản xử lý ngoại lệ)

### 테스터 (Tester/QA) - "Bug Hunter"

**🔍 Tư duy:**
- Luôn tìm cách "phá vỡ" hệ thống
- Tập trung vào **경계값 테스트** (test giá trị biên)
- Quan tâm đến **사용자 경험** (trải nghiệm người dùng)

**💬 Ngôn ngữ họ hiểu:**
```
❌ "Chức năng login hoạt động bình thường"
✅ "Sau 3 lần nhập sai password → hiển thị captcha
     Sau 5 lần nhập sai → khóa tài khoản 15 phút"
```

**📋 Họ cần từ BRSE:**
- **테스트 케이스** (test case) đầy đủ
- **인수 조건** (acceptance criteria) rõ ràng
- **버그 재현 단계** (bước tái tạo bug) chi tiết

\---

## 🔄 Quy trình "번역" (dịch thuật) yêu cầu

### Bước 1: 요구사항 분석 (Phân tích yêu cầu)

**Từ khách hàng:** *"Tôi muốn xem báo cáo doanh thu theo tuần"*

**BRSE phân tích:**
```
WHO (누가): Manager level trở lên
WHAT (무엇을): Weekly revenue report  
WHEN (언제): Truy cập mọi lúc, cập nhật realtime
WHERE (어디서): Web dashboard, mobile app
WHY (왜): Theo dõi KPI, ra quyết định kinh doanh
HOW (어떻게): Charts + Tables + Export function
```

### Bước 2: 기술 명세서 작성 (Viết đặc tả kỹ thuật)

**📋 Template chuẩn:**

```markdown
## 기능 이름: Weekly Revenue Report

### 전제 조건 (Pre-conditions):
- User đã login với role ≥ Manager
- Database có dữ liệu ≥ 7 ngày

### 주요 흐름 (Main Flow):
1. User click "Reports" → "Revenue" → "Weekly View"
2. System hiển thị datepicker (default: tuần hiện tại)
3. User chọn tuần → click "Generate"
4. System query data → render chart + table
5. Display: Line chart + Data table + Export button

### 출력 데이터 (Output Data):
- Chart: 7 points (Mon-Sun), Y-axis = revenue (VND)
- Table: Date | Orders | Revenue | Growth%
- Export: Excel format (.xlsx)

### 예외 상황 (Exception Cases):
- No data: Display "데이터가 없습니다"
- Server error: Display "잠시 후 다시 시도해주세요"
- Timeout: Auto retry 3 times
```

### Bước 3: 검증 및 피드백 (Validation & Feedback)

**🔄 Review cycle với team:**
```
BRSE → 개발자 review → 테스터 review → 고객 확인 → Final spec
```

\---

## 💡 Case Study: Dự án "Happy Pet Clinic"

**배경:** Hệ thống quản lý phòng khám thú cưng tại Gangnam, Seoul

### Tình huống 1: 애매한 요구사항 (Yêu cầu mơ hồ)

**고객 요청:** *"Tôi muốn tìm kiếm thông tin khách hàng nhanh chóng"*

**❌ BRSE không kinh nghiệm:**
```
"Làm chức năng search customer"
→ Developer: "Search bằng gì? Hiển thị thế nào?"
→ Tester: "Test case nào? Boundary condition?"
→ Kết quả: Delay 3 ngày, làm lại 2 lần
```

**✅ BRSE chuyên nghiệp:**

**1단계: 요구사항 세분화**
```
🔍 Search criteria:
- 고객명 (Customer name): Fuzzy search
- 전화번호 (Phone): Exact match
- 이메일 (Email): Partial match
- 등록일 (Registration date): Date range

🎨 UI Specification:
- Search bar: Top-right corner, width 300px
- Advanced search: Collapsible panel
- Search button: Blue #2196F3, "검색" label
- Clear button: Grey #9E9E9E, "초기화" label

📊 Result Display:
- Table format: Name | Phone | Email | Last Visit | Action
- Pagination: 20 items per page
- Sort: By name (A-Z default)
- No result: "검색 결과가 없습니다" with search tips

⚡ Performance:
- Response time: < 2 seconds
- Auto-suggest: After 3 characters
- Search history: Last 5 searches
```

**2단계: 테스트 케이스 작성**
```
✅ Normal Cases:
- Search "Nguyễn" → Show all customers with name containing "Nguyễn"
- Search "010-1234-5678" → Show exact phone match
- Search empty → Show all customers (paginated)

❌ Edge Cases:  
- Search special characters (!@#$%) → Show "invalid input" message
- Search > 100 characters → Truncate and search first 100
- Network timeout → Show "연결 오류" with retry button

🔄 Error Scenarios:
- Database down → Show "시스템 점검 중" message
- Too many results (>10,000) → Show "검색 결과를 좁혀주세요"
```

### Tình huống 2: 긴급 버그 처리 (Xử lý bug khẩn cấp)

**🚨 Bug report từ customer:**
> "Hệ thống báo cáo doanh thu hiển thị sai số liệu cuối tuần!"

**📋 BRSE action plan:**

**1. 즉시 대응 (Immediate Response):**
```
→ 고객: "확인 중입니다. 30분 내 업데이트 드리겠습니다"
→ 개발팀: "Priority 1 bug - Revenue report weekend calculation"
→ 테스터: "Urgent - Need to verify weekend data logic"
```

**2. 문제 분석 (Root Cause Analysis):**
```
🔍 Investigation:
- Database: Weekend data exists ✅
- Logic: Weekend days excluded from calculation ❌
- Code: date.getDay() == 0 || date.getDay() == 6 → skip

🎯 Root Cause: 
Business requirement: "Include weekend sales"
Technical spec: "Skip weekend in calculation" 
→ 요구사항 번역 오류!
```

**3. 해결책 제시 (Solution):**
```
📝 Quick Fix:
- Remove weekend exclusion logic
- Add weekend indicator in report
- Deploy hotfix in 2 hours

🔒 Long-term Fix:
- Update 요구사항 문서
- Add regression test case
- Review all date-related calculations
```

\---

## 🛠️ Tools & Templates cho BRSE

### 1. 요구사항 문서 템플릿

```markdown
# [기능명] - Requirements Document

## 개요 (Overview)
- 목적: [Business purpose]
- 대상 사용자: [User personas]
- 우선순위: [High/Medium/Low]

## 기능 명세 (Functional Specification)
- 입력: [Input parameters]
- 처리: [Business logic]  
- 출력: [Expected output]

## 기술 명세 (Technical Specification)
- API endpoints
- Database schema
- Integration points

## 테스트 케이스 (Test Cases)
- Positive scenarios
- Negative scenarios  
- Edge cases

## 인수 조건 (Acceptance Criteria)
- [ ] Functional requirements met
- [ ] Non-functional requirements met
- [ ] User acceptance criteria passed
```

### 2. Bug Report Template

```markdown
# 버그 리포트 - [Bug Title]

## 환경 (Environment)
- OS: Windows 10 / macOS / iOS / Android
- Browser: Chrome 96 / Safari 15 / Mobile app v2.1
- Server: Production / Staging / Development

## 재현 단계 (Steps to Reproduce)
1. [First step]
2. [Second step]  
3. [Result step]

## 예상 결과 (Expected Result)
[What should happen]

## 실제 결과 (Actual Result)  
[What actually happened]

## 추가 정보 (Additional Info)
- Screenshots/Video
- Log files
- Frequency: Always / Sometimes / Rarely
```

\---

## 🎯 Best Practices

### DO's ✅

**의사소통 (Communication):**
- 매일 15분 **스탠드업 미팅** 참여
- **슬랙/이메일** response trong vòng 2 giờ
- Technical terms 사용할 때 설명 kèm theo

**문서화 (Documentation):**
- 모든 결정사항 **컨플루언스**에 기록
- **변경사항** track bằng version control
- **스크린샷/다이어그램** để minh họa

**품질 보증 (Quality Assurance):**
- Code review 전에 **요구사항 리뷰**
- **데모** trước khi delivery
- **회고 미팅** sau mỗi sprint

### DON'Ts ❌

**절대 하지 말 것:**
- ❌ "대충 이런 식으로..." (Mơ hồ, không cụ thể)
- ❌ "빨리빨리!" không có deadline rõ ràng  
- ❌ "다른 회사는..." so sánh không xây dựng
- ❌ Blame game khi có lỗi xảy ra

\---

## 💪 Bài tập thực hành

### Challenge 1: Requirements Translation

**Scenario:** CEO của startup FinTech yêu cầu:
*"Tôi muốn dashboard để theo dõi tất cả giao dịch của khách hàng realtime"*

**Your mission:**
1. **질문 목록** (Question list) cần hỏi CEO
2. **기능 명세서** (Function spec) chi tiết  
3. **API 설계** (API design) cần thiết
4. **테스트 시나리오** (Test scenarios) đầy đủ

### Challenge 2: Crisis Management  

**Scenario:** Thứ 6 5PM, khách hàng báo:
*"Payment gateway bị lỗi, khách hàng không thanh toán được! Mất 100 triệu/giờ!"*

**Your action plan:**
1. **30 phút đầu**: Làm gì?
2. **Communication strategy**: Nói gì với stakeholders?
3. **Technical investigation**: Cần check những gì?
4. **Follow-up actions**: Prevent tương lai

\---

## 🏆 Checklist BRSE chuyên nghiệp

### Before Development (개발 전)
- [ ] **요구사항** 100% clear và validated
- [ ] **Mock-up/Wireframe** approved by customer  
- [ ] **API contract** agreed between FE/BE
- [ ] **테스트 케이스** reviewed và signed-off
- [ ] **Definition of Done** established

### During Development (개발 중)  
- [ ] **Daily sync** với dev team
- [ ] **블로커** identified và resolved quickly
- [ ] **변경사항** documented và communicated
- [ ] **진행상황** updated to stakeholders
- [ ] **리스크** monitored và mitigated

### Before Release (배포 전)
- [ ] **기능 테스트** completed by QA
- [ ] **사용자 승인** received from customer
- [ ] **배포 계획** reviewed và approved  
- [ ] **롤백 계획** prepared
- [ ] **모니터링** setup for production

\---

## 🎓 Key Takeaways

**🔑 3 Golden Rules:**

1. **명확성 (Clarity)**: Mỗi yêu cầu phải có 1 cách hiểu duy nhất
2. **소통 (Communication)**: Over-communicate hơn là under-communicate  
3. **문서화 (Documentation)**: "기록되지 않으면 존재하지 않는다"

**💎 BRSE Success Formula:**
```
Business Knowledge + Technical Skills + Communication + Korean = 
성공적인 BRSE (Successful BRSE)
```

**🚀 Next Steps:**
- Practice writing detailed requirements daily
- Join technical discussions với dev team
- Study Korean IT terminology 30 minutes/day
- Build relationship với 개발자 và 테스터

\---

*"좋은 BRSE는 고객과 개발팀 사이의 다리가 아니라, 두 세계를 연결하는 번역가입니다"*
*(A good BRSE is not just a bridge between customer and dev team, but a translator connecting two worlds)*

---

*Post ID: 1n3z75dfb7bbxt1*  
*Category: BRSE*  
*Created: 2/9/2025*  
*Updated: 2/9/2025*
