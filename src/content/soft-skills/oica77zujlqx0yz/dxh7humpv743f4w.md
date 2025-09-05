---
title: "Bài 16: 요구사항 분류 마스터 클래스"
postId: "dxh7humpv743f4w"
category: "BRSE"
created: "4/9/2025"
updated: "4/9/2025"
---

# Bài 16: 요구사항 분류 마스터 클래스

## *Mastering Requirements Classification - From Business to Implementation*

\---

## 🎯 **학습 목표 (Mục tiêu học tập)**

Sau 90 phút học tập cường độ cao này, bạn sẽ trở thành **요구사항 전문가 (chuyên gia yêu cầu)** có khả năng:

| **Core Competencies** | **Professional Skills** |
|---|---|
| 🔍 **구별하기 (Phân biệt)** 4 loại yêu cầu trong thực tiễn dự án | 📋 **문서화 (Tài liệu hóa)** yêu cầu theo chuẩn quốc tế |
| ⚡ **식별하기 (Nhận diện)** yêu cầu qua case study thực tế | 🎯 **검증하기 (Kiểm chứng)** tính đầy đủ và chính xác |
| 🏗️ **작성하기 (Viết)** yêu cầu theo format chuyên nghiệp | 🔄 **추적하기 (Truy vết)** mối liên hệ giữa các yêu cầu |

\---

## 📊 **요구사항 분류 체계도 (Sơ đồ Phân loại Yêu cầu)**

```mermaid
graph TD
    A[비즈니스 요구사항<br/>Business Requirements] --> B[사용자 요구사항<br/>User Requirements]
    B --> C[기능 요구사항<br/>Functional Requirements]
    B --> D[비기능 요구사항<br/>Non-functional Requirements]
    
    A --> A1[전략적 목표<br/>(Mục tiêu chiến lược)]
    A --> A2[ROI 기대치<br/>(Kỳ vọng ROI)]
    
    C --> C1[핵심 기능<br/>(Chức năng cốt lõi)]
    C --> C2[비즈니스 로직<br/>(Logic nghiệp vụ)]
    
    D --> D1[성능<br/>(Hiệu năng)]
    D --> D2[보안<br/>(Bảo mật)]
    D --> D3[가용성<br/>(Tính khả dụng)]
```

\---

## 🏢 **실제 프로젝트 시나리오 (Tình huống Dự án Thực tế)**

### **🎬 Case Study: "K-Fashion 글로벌 진출 프로젝트"**

**배경 (Bối cảnh):** 
Công ty thời trang Hàn Quốc **패션코리아** muốn xây dựng **전자상거래 플랫폼 (nền tảng thương mại điện tử)** để **해외 진출 (tiến ra thị trường quốc tế)**. CEO công ty đặt ra thử thách: *"Trong 12 tháng, chúng ta phải **매출 (doanh thu)** 50 tỷ won từ thị trường Đông Nam Á!"*

\---

## 🎯 **1. 비즈니스 요구사항 (Business Requirements)**

### **정의 (Định nghĩa)**
> **비즈니스 요구사항**은 조직의 **전략적 목표 (mục tiêu chiến lược)**와 **사업 가치 (giá trị kinh doanh)**를 달성하기 위한 **최상위 요구사항 (yêu cầu cấp cao nhất)**입니다.

### **핵심 특징 (Đặc điểm Cốt lõi)**

| **Characteristic** | **Description** | **Example Keywords** |
|---|---|---|
| **🎯 목표 지향적** | Hướng mục tiêu | ROI, 매출 증대, 시장 점유율 |
| **📈 측정 가능** | Có thể đo lường | KPI, 수치 목표, 성과 지표 |
| **⏰ 시간 제한** | Có thời hạn | 분기별, 연간, 프로젝트 기간 |

### **💼 실무 예시 (Ví dụ Thực tế)**

**🔥 Hot Example:**
> *"패션코리아는 2024년 말까지 **동남아시아 시장 (thị trường Đông Nam Á)**에서 **월간 활성 사용자 (monthly active users)** 100만 명을 확보하여 **브랜드 인지도 (nhận diện thương hiệu)** 30% 증가를 달성해야 한다."*

**💡 분석 포인트:**
- ✅ **사업 목표**: 시장 확장
- ✅ **측정 지표**: MAU 100만, 브랜드 인지도 30%
- ✅ **시간 프레임**: 2024년 말까지

\---

## 👥 **2. 사용자 요구사항 (User Requirements)**

### **정의**
> 사용자가 시스템을 통해 **달성하고자 하는 목표 (mục tiêu muốn đạt được)**와 **기대하는 경험 (trải nghiệm mong đợi)**을 자연어로 표현한 요구사항.

### **작성 템플릿 (Template Viết)**

```
As a [사용자 유형], 
I want to [원하는 기능],
So that [비즈니스 가치/개인적 이익]
```

### **🎭 페르소나 기반 예시 (Ví dụ theo Persona)**

#### **👩‍🎓 페르소나: "민지 - 22세 대학생, 베트남 호치민 거주"**

**사용자 스토리:**
> *"베트남에 거주하는 **패션 애호가 (người yêu thời trang)**로서, 나는 **한국 최신 트렌드 (xu hướng mới nhất Hàn Quốc)**를 **실시간으로 (real-time)** 확인하고 싶다. 왜냐하면 **또래 친구들 (bạn cùng trang lứa)** 사이에서 **스타일 리더 (style leader)**가 되고 싶기 때문이다."*

**📋 추출된 사용자 요구사항:**
1. **트렌드 정보 접근**: 최신 K-Fashion 트렌드 실시간 업데이트
2. **소셜 공유**: SNS 연동을 통한 **스타일링 공유 (chia sẻ phong cách)**
3. **현지화 서비스**: 베트남어 지원 및 **현지 배송 (giao hàng nội địa)** 정보

\---

## ⚙️ **3. 기능 요구사항 (Functional Requirements)**

### **정의**
> 시스템이 **수행해야 할 구체적인 기능 (chức năng cụ thể cần thực hiện)**과 **동작 방식 (cách thức hoạt động)**을 기술적으로 명세한 요구사항.

### **📝 작성 가이드라인**

| **Element** | **Format** | **Example** |
|---|---|---|
| **입력 (Input)** | 사용자/시스템이 제공하는 데이터 | 회원 정보, 상품 선택 |
| **처리 (Process)** | 시스템이 수행하는 로직 | 검증, 계산, 저장 |
| **출력 (Output)** | 결과로 생성되는 정보 | 확인 메시지, 보고서 |

### **🔧 실무 예시 - 주문 프로세스**

#### **FR-001: 상품 주문 기능**
```
요구사항 ID: FR-001
제목: 다국가 상품 주문 처리

전제 조건:
- 사용자가 로그인 상태
- 장바구니에 1개 이상 상품 존재

주요 흐름:
1. 사용자가 "주문하기" 버튼 클릭
2. 시스템이 재고 상태를 실시간 확인
3. 배송지 정보를 현지화된 형식으로 검증
4. 결제 정보 암호화 처리
5. 주문 확인 이메일을 사용자 언어로 발송

성공 기준:
- 주문 처리 시간 < 10초
- 재고 정확도 99.9%
- 이메일 발송 성공률 > 95%
```

\---

## 🛡️ **4. 비기능 요구사항 (Non-functional Requirements)**

### **분류 매트릭스 (Classification Matrix)**

| **Category** | **Korean Term** | **측정 기준 (Measurement)** | **Business Impact** |
|---|---|---|---|
| **Performance** | 성능 | Response Time, TPS | 사용자 경험, 매출 |
| **Security** | 보안 | 암호화 강도, 인증 레벨 | 신뢰도, 컴플라이언스 |
| **Availability** | 가용성 | Uptime %, 복구 시간 | 서비스 연속성 |
| **Scalability** | 확장성 | 동시 사용자 수용량 | 성장 대응력 |
| **Usability** | 사용성 | 학습 시간, 오류율 | 사용자 만족도 |

### **🏆 실무 예시 - 글로벌 서비스**

#### **NFR-001: 다국가 성능 요구사항**
```
카테고리: 성능 (Performance)
지역별 응답 시간 요구사항:

🇰🇷 한국: < 1초 (CDN 1차 캐시)
🇻🇳 베트남: < 2초 (CDN 2차 캐시)  
🇹🇭 태국: < 2.5초 (Edge Server)
🇮🇩 인도네시아: < 3초 (Regional Gateway)

측정 방법: 
- 95th percentile 기준
- 피크 시간대 (19:00-21:00) 측정
- 주간 평균 리포트 생성
```

#### **NFR-002: 보안 요구사항**
```
카테고리: 보안 (Security)

데이터 보호:
- 개인정보: AES-256 암호화
- 결제 정보: PCI-DSS Level 1 준수
- 세션 관리: JWT 토큰 (30분 만료)

인증 체계:
- 2단계 인증 (OTP) 필수
- 소셜 로그인 연동 (Google, Facebook, Naver)
- 비정상 접근 패턴 실시간 모니터링
```

\---

## 🔄 **요구사항 추적성 매트릭스 (Requirements Traceability Matrix)**

| **Business Req** | **User Story** | **Functional Req** | **Non-functional** | **Test Case** |
|---|---|---|---|---|
| BR-001: 해외 매출 증대 | US-001: 다국가 쇼핑 | FR-001: 주문 처리 | NFR-001: 성능 | TC-001~005 |
| BR-002: 브랜드 인지도 | US-002: 소셜 공유 | FR-002: SNS 연동 | NFR-002: 보안 | TC-006~010 |
| BR-003: 고객 만족도 | US-003: 고객 지원 | FR-003: 챗봇 시스템 | NFR-003: 가용성 | TC-011~015 |

\---

## 🎯 **실전 워크숍: 요구사항 분류 Challenge**

### **🏆 Scenario: "K-Beauty 라이브 커머스 플랫폼"**

**상황:** 
뷰티 브랜드 **뷰티코리아**가 **라이브 스트리밍 (live streaming)** 기능을 통해 **실시간 상품 판매 (real-time product sales)**를 하는 플랫폼을 구축하려고 합니다.

**주어진 요구사항들을 분류해보세요:**

#### **📋 요구사항 리스트**

1. *"2024년 4분기까지 라이브 커머스를 통해 월 매출 10억원 달성"*

2. *"뷰티 인플루언서로서, 나는 실시간으로 팔로워들과 소통하면서 제품을 소개하고 싶다"*

3. *"시스템은 동시에 10,000명의 시청자가 접속해도 끊김 없이 스트리밍을 제공해야 한다"*

4. *"사용자가 '구매하기' 버튼을 클릭하면, 시스템은 실시간으로 재고를 확인하고 3초 이내에 주문을 처리해야 한다"*

5. *"모든 결제 정보는 국제 보안 표준 (PCI-DSS)을 준수하여 암호화되어야 한다"*

6. *"고객으로서, 나는 라이브 중에 다른 시청자들의 리뷰를 보고 구매 결정을 내리고 싶다"*

### **💡 분류 정답 및 해설**

| **요구사항** | **분류** | **해설** | **핵심 키워드** |
|---|---|---|---|
| 1번 | **비즈니스 요구사항** | 매출 목표, 측정 가능한 KPI | 월 매출, 4분기, 달성 |
| 2번 | **사용자 요구사항** | 인플루언서 관점의 니즈 표현 | ~로서, ~하고 싶다 |
| 3번 | **비기능 요구사항 (성능)** | 시스템 성능 제약 조건 | 10,000명, 끊김 없이 |
| 4번 | **기능 요구사항** | 구체적인 시스템 동작 명세 | 버튼 클릭, 3초 이내, 처리 |
| 5번 | **비기능 요구사항 (보안)** | 보안 품질 특성 | PCI-DSS, 암호화 |
| 6번 | **사용자 요구사항** | 고객 관점의 기대 경험 | ~으로서, 구매 결정 |

\---

## 🚀 **Advanced Tips: 요구사항 품질 향상**

### **📊 체크리스트 매트릭스**

| **Quality Attribute** | **Business** | **User** | **Functional** | **Non-functional** |
|---|---|---|---|---|
| **명확성 (Clarity)** | ✅ KPI 수치 명시 | ✅ 자연어 표현 | ✅ 입출력 정의 | ✅ 측정 기준 |
| **검증가능성 (Verifiable)** | ✅ ROI 계산 가능 | ✅ 시나리오 테스트 | ✅ 단위 테스트 | ✅ 성능 측정 |
| **추적가능성 (Traceable)** | ✅ 전략과 연결 | ✅ BR과 매핑 | ✅ US와 연결 | ✅ FR과 관련 |

### **🔍 일반적인 실수와 해결방안**

| **Common Mistake** | **Problem** | **Solution** | **Example** |
|---|---|---|---|
| **모호한 표현** | "빠르게", "안전하게" | 구체적 수치 명시 | "3초 이내", "AES-256" |
| **혼합된 요구사항** | 한 문장에 여러 타입 | 단일 관심사 원칙 | 기능과 성능 분리 |
| **추적 불가능** | 상위 요구사항과 연결 없음 | 트레이스 매트릭스 작성 | RTM 활용 |

\---

## 📚 **실무 과제: Portfolio Project**

### **🎯 미션: "My Dream Platform 요구사항 명세"**

**당신이 만들고 싶은 플랫폼/서비스를 선택하고, 전문적인 요구사항 명세서를 작성하세요.**

#### **선택 가능한 도메인:**
- 🛒 **전자상거래**: K-Culture 상품 글로벌 판매
- 🎓 **에듀테크**: 한국어/IT 온라인 교육
- 🏥 **헬스케어**: 원격 의료 상담 서비스  
- 🎮 **게임**: 소셜 모바일 게임 플랫폼
- 🚗 **모빌리티**: 차량 공유 서비스

#### **제출물 요구사항:**

1. **📋 Requirements Document** (10-15 페이지)
   - Business Requirements (3-5개)
   - User Stories (10-15개) 
   - Functional Requirements (20-30개)
   - Non-functional Requirements (15-20개)

2. **📊 Traceability Matrix** 
   - 요구사항 간 추적성 매트릭스
   - 우선순위 및 위험도 평가

3. **🎯 Validation Criteria**
   - 각 요구사항별 검증 방법
   - 테스트 케이스 개요

#### **평가 기준:**
- **전문성**: 한국어 IT 용어 정확한 사용
- **실무 적용성**: 실제 개발 가능한 수준
- **완성도**: 요구사항 간 일관성 및 추적성
- **창의성**: 독창적이고 실현 가능한 아이디어

\---

## 🏆 **마스터 레벨 도전: Global BRSE Certification**

### **🌟 Final Challenge Questions:**

1. **시나리오 분석**: 복잡한 multi-stakeholder 환경에서 상충하는 요구사항을 어떻게 정리하겠는가?

2. **기술 트렌드 적용**: AI/ML, Blockchain 등 신기술이 포함된 프로젝트에서 요구사항 분류 시 주의사항은?

3. **글로벌 프로젝트**: 문화적 차이가 있는 다국가 프로젝트에서 사용자 요구사항 수집 전략은?

\---

## 📖 **Reference & Further Learning**

### **📚 전문 서적**
- "Software Requirements" - Karl Wiegers
- "요구공학 실무 가이드" - 소프트웨어공학연구소
- "Agile Requirements Documentation" - Dean Leffingwell

### **🌐 Professional Resources**
- **IIBA (International Institute of Business Analysis)**
- **한국소프트웨어기술진흥협회 (KOSTA)**
- **PMI Requirements Management Professional (PMI-RMP)**

### **🏢 Korean IT Industry Standards**
- **국가정보화표준(KCS)** - 요구사항 관리 가이드라인
- **소프트웨어공학표준** - TTA 기술표준
- **전자정부 표준프레임워크** - 요구사항 템플릿

\---

**🎓 축하합니다! 당신은 이제 Professional BRSE로서 요구사항 분류 전문가가 되었습니다!**

*다음 레벨: "요구사항 분석 및 모델링 고급 기법" - Coming Soon! 🚀*

---

*Post ID: dxh7humpv743f4w*  
*Category: BRSE*  
*Created: 4/9/2025*  
*Updated: 4/9/2025*
