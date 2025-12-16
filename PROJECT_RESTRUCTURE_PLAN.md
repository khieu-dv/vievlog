# KẾ HOẠCH TÁI CẤU TRÚC DỰ ÁN VIEVLOG

## 📋 PHÂN TÍCH HIỆN TRẠNG

### Thông tin dự án

- **Tên dự án**: VieVlog - Programming Education Platform
- **Tech Stack**: Next.js 16, React 19, TypeScript, TailwindCSS, PocketBase
- **Mục đích**: Nền tảng học lập trình tương tác với tài liệu và bài học đa ngôn ngữ

### ⚠️ Thay đổi quan trọng

- **LOẠI BỎ WASM**: Dự án không còn sử dụng WebAssembly (Rust & C++), sẽ xóa toàn bộ code và dependencies liên quan

### 🔍 Các vấn đề hiện tại

#### 1. **Cấu trúc thư mục không nhất quán**

- ❌ Có cả `@/` và `~/` path aliases (nên chỉ dùng một)
- ❌ Thư mục `src/ui/primitives` và `src/components/ui` bị trùng lặp mục đích
- ❌ Thư mục `src/lib/services` và `src/lib/types` trống rỗng nhưng vẫn tồn tại
- ❌ Folder `src/content/coursese` (typo - nên là "courses")
- ❌ File `components.json` ở root nhưng không rõ mục đích

#### 2. **Tổ chức code thiếu chuẩn mực**

- ❌ Logic business (comments, auth) nằm lẫn lộn trong `src/lib`
- ❌ Thiếu tổ chức rõ ràng cho features/modules
- ❌ API routes nằm rải rác trong `src/app/(main)/api` và `src/app/docs/api`

#### 3. **Cấu hình và tooling**

- ⚠️ Có cả ESLint và Biome (duplicate linting)
- ❌ File `error.txt` và `DEV.md` nằm ở root (nên trong docs/)

#### 4. **Code WASM không sử dụng**

- ❌ Thư mục `rust-wasm/`, `cpp-wasm/` tồn tại nhưng không dùng
- ❌ WASM loaders trong `src/lib/` không cần thiết
- ❌ Public WASM files chiếm dung lượng
- ❌ Dependencies và scripts build WASM làm phức tạp dự án

#### 5. **Tổ chức nội dung**

- ❌ Nội dung docs nằm trong `public/` thay vì trong `src/`
- ❌ Thiếu phân tách giữa static assets và generated content

---

## 🎯 CẤU TRÚC MỚI THEO CHUẨN CÔNG NGHIỆP

### 📁 Cấu trúc thư mục đề xuất

```
vvlog/
├── .github/                          # GitHub workflows, issue templates
├── .husky/                           # Git hooks
├── .vscode/                          # VS Code settings
├── docs/                             # Project documentation
│   ├── api/                          # API documentation
│   ├── development/                  # Development guides
│   │   ├── setup.md
│   │   └── deployment.md
│   └── architecture.md
│
├── scripts/                          # Build and utility scripts
│   ├── build-search.js
│   ├── generate-meta.js
│   └── generate-posts.js
│
├── public/                           # Static assets only
│   ├── images/
│   ├── fonts/
│   ├── locales/
│   └── favicon.ico
│
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (marketing)/              # Marketing pages group
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   └── about/
│   │   ├── (docs)/                   # Documentation pages group
│   │   │   ├── layout.tsx
│   │   │   └── [[...slug]]/
│   │   ├── (auth)/                   # Auth pages group
│   │   │   ├── layout.tsx
│   │   │   ├── sign-in/
│   │   │   └── sign-up/
│   │   ├── api/                      # All API routes centralized
│   │   │   ├── auth/
│   │   │   ├── comments/
│   │   │   └── health/
│   │   ├── profile/
│   │   ├── layout.tsx
│   │   ├── globals.css
│   │   └── not-found.tsx
│   │
│   ├── components/                   # React components
│   │   ├── layouts/                  # Layout components
│   │   │   ├── main-layout.tsx
│   │   │   ├── auth-layout.tsx
│   │   │   └── docs-layout.tsx
│   │   ├── features/                 # Feature-specific components
│   │   │   ├── auth/
│   │   │   │   ├── sign-in-form.tsx
│   │   │   │   └── sign-up-form.tsx
│   │   │   ├── comments/
│   │   │   │   ├── comment-list.tsx
│   │   │   │   └── comment-form.tsx
│   │   │   └── docs/
│   │   │       ├── doc-navigation.tsx
│   │   │       └── doc-search.tsx
│   │   ├── ui/                       # Reusable UI components (shadcn/ui)
│   │   │   ├── button.tsx
│   │   │   ├── dialog.tsx
│   │   │   └── ...
│   │   └── common/                   # Common shared components
│   │       ├── header.tsx
│   │       ├── footer.tsx
│   │       ├── theme-provider.tsx
│   │       └── navigation-handler.tsx
│   │
│   ├── lib/                          # Shared utilities and helpers
│   │   ├── utils/                    # Pure utility functions
│   │   │   ├── cn.ts
│   │   │   ├── format.ts
│   │   │   └── validators.ts
│   │   ├── constants/                # App constants
│   │   │   ├── routes.ts
│   │   │   └── config.ts
│   │   └── errors/                   # Error handling
│   │       └── app-error.ts
│   │
│   ├── features/                     # Feature modules (domain-driven)
│   │   ├── auth/
│   │   │   ├── api/                  # Auth-related API logic
│   │   │   ├── hooks/                # Auth hooks
│   │   │   ├── types/                # Auth types
│   │   │   └── services/             # Auth services
│   │   ├── comments/
│   │   │   ├── api/
│   │   │   ├── hooks/
│   │   │   ├── types/
│   │   │   └── services/
│   │   └── docs/
│   │       ├── hooks/
│   │       ├── types/
│   │       └── services/
│   │
│   ├── content/                      # Content management
│   │   ├── courses/                  # Course content
│   │   ├── blog/                     # Blog posts
│   │   └── docs/                     # Documentation content
│   │
│   ├── types/                        # Global TypeScript types
│   │   ├── index.ts
│   │   ├── api.ts
│   │   └── models.ts
│   │
│   ├── styles/                       # Global styles
│   │   ├── globals.css
│   │   └── docs.css
│   │
│   └── config/                       # App configuration
│       ├── site.ts                   # Site metadata
│       ├── i18n.ts                   # i18n config
│       └── env.ts                    # Environment variables
│
├── packages/                         # WASM packages (monorepo approach)
│   ├── rust-wasm/
│   │   ├── Cargo.toml
│   └── e2e/
│
├── .env.example
├── .env.local
├── .gitignore
├── biome.json                        # Chỉ dùng Biome thay vì ESLint + Biome
├── components.json                   # shadcn/ui config
├── next.config.js
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

---

## 🔄 CÁC BƯỚC TÁI CẤU TRÚC

### Phase 1: Loại bỏ WASM (30 phút)

1. ✅ Xóa thư mục `rust-wasm/`, `cpp-wasm/`
2. ✅ Xóa thư mục `public/wasm/`, `src/wasm/`
3. ✅ Xóa `src/lib/wasm-loader.ts`, `src/lib/cpp-wasm-loader.ts`
4. ✅ Xóa WASM scripts trong package.json
5. ✅ Loại bỏ WASM dependencies
6. ✅ Cập nhật next.config.js (remove webpack WASM config)
7. ✅ Xóa `DEV.md` (WASM setup guide)

### Phase 2: Dọn dẹp và chuẩn bị (30 phút)

1. ✅ Xóa thư mục rỗng: `src/lib/services`, `src/lib/types`
2. ✅ Sửa typo: `src/content/coursese` → `src/content/courses`
3. ✅ Di chuyển `error.txt` vào `docs/`
4. ✅ Xóa ESLint config (chỉ giữ Biome)
5. ✅ Tạo thư mục mới: `docs/`, `scripts/`, `src/features/`

### Phase 3: Tái cấu trúc src/ (1-2 giờ)

1. ✅ Tạo cấu trúc features/ mới
2. ✅ Di chuyển auth logic: `src/lib/authClient.ts` → `src/features/auth/`
3. ✅ Di chuyển comments logic: `src/lib/comments.ts` → `src/features/comments/`
4. ✅ Merge `src/ui/primitives` vào `src/components/ui`
5. ✅ Tạo `src/components/layouts/` từ các layout components
6. ✅ Tạo `src/components/features/` từ feature-specific components
7. ✅ Tạo `src/lib/utils/` và `src/lib/constants/`

### Phase 4: Chuẩn hóa paths và imports (1 giờ)

1. ✅ Thống nhất chỉ dùng `@/` alias (remove `~/`)
2. ✅ Update tsconfig.json paths
3. ✅ Update tất cả imports trong toàn bộ dự án
4. ✅ Verify không có broken imports

### Phase 5: Cấu trúc API routes (30 phút)

1. ✅ Centralize API routes: di chuyển từ `src/app/(main)/api/` và `src/app/docs/api/` vào `src/app/api/`
2. ✅ Tổ chức theo feature: `api/auth/`, `api/comments/`, `api/health/`
3. ✅ Update API imports trong components

### Phase 6: Tối ưu route groups (30 phút)

1. ✅ Rename `(main)` → `(marketing)`
2. ✅ Rename `docs/` → `(docs)/`
3. ✅ Tạo `(auth)` group cho auth pages
4. ✅ Update layouts cho từng group

---

## 📊 LỢI ÍCH CỦA CẤU TRÚC MỚI

### 1. **Maintainability**

- ✅ Code được tổ chức theo features/domains rõ ràng
- ✅ Dễ tìm kiếm và navigate trong codebase
- ✅ Giảm coupling giữa các modules

### 2. **Scalability**

- ✅ Dễ thêm features mới
- ✅ Hỗ trợ team collaboration tốt hơn
- ✅ Cấu trúc đơn giản, không phức tạp bởi WASM

### 3. **Developer Experience**

- ✅ Imports rõ ràng và nhất quán
- ✅ Cấu trúc dễ hiểu cho developers mới
- ✅ Better IDE support

### 4. **Performance**

- ✅ Tree-shaking tốt hơn
- ✅ Code splitting dễ dàng hơn
- ✅ Tối ưu bundle size (loại bỏ WASM giảm đáng kể dung lượng)
- ✅ Build time nhanh hơn (không cần compile WASM)

---

## 🚀 THỰC THI

Sau khi đồng ý với kế hoạch này, tôi sẽ:

1. Tạo scripts migration tự động
2. Backup toàn bộ dự án hiện tại
3. Thực hiện migration theo từng phase
4. Update documentation
5. Testing và verification
   4-5 giờ làm việc (giảm do loại bỏ WASM complexity)

**Risk Level**: Thấp-Trung bình (chủ yếu là moving files và updating imports
**Risk Level**: Trung bình (có thể có breaking changes, cần testing kỹ)

---

## 📝 CHECKLIST SAU KHI HOÀN THÀNH

- [ ] Tất cả WASM code đã bị xóa
- [ ] Không còn dependencies WASM trong package.json
- [ ] Tất cả imports đều hoạt động
- [ ] Build thành công (`npm run build`)
- [ ] Linting pass (Biome check)
- [ ] TypeScript compile không lỗi
- [ ] Dev server chạy bình thường
- [ ] API routes hoạt động
- [ ] Documentation được cập nhật
- [ ] README.md phản ánh cấu trúc mới
- [ ] .gitignore đã loại bỏ WASM-related entries
