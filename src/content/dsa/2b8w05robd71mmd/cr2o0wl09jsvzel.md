---
title: "Sắp Xếp Nổi Bọt (Bubble Sort)"
postId: "cr2o0wl09jsvzel"
category: "Sorting Algorithms"
created: "21/8/2025"
updated: "29/8/2025"
---

# Sắp Xếp Nổi Bọt (Bubble Sort)


Sắp xếp nổi bọt (Bubble Sort), đôi khi được gọi là sắp xếp chìm, là một thuật toán sắp xếp đơn giản hoạt động bằng cách duyệt qua danh sách cần sắp xếp nhiều lần, so sánh từng cặp phần tử liền kề và hoán đổi chúng nếu chúng có thứ tự sai (thứ tự tăng dần hoặc giảm dần). Việc duyệt qua danh sách được lặp lại cho đến khi không còn cần hoán đổi nào, điều này cho biết danh sách đã được sắp xếp.

![Minh họa thuật toán](https://upload.wikimedia.org/wikipedia/commons/c/c8/Bubble-sort-example-300px.gif)

## Giải Thích Chi Tiết

### Cách Hoạt Động

Thuật toán Bubble Sort hoạt động như sau:

1. **Duyệt qua mảng**: Bắt đầu từ phần tử đầu tiên, so sánh từng cặp phần tử liền kề.
2. **So sánh và hoán đổi**: Nếu phần tử bên trái lớn hơn phần tử bên phải (trong sắp xếp tăng dần), hoán đổi chúng.
3. **"Nổi bọt"**: Sau mỗi lượt duyệt, phần tử lớn nhất sẽ "nổi" lên vị trí cuối cùng.
4. **Lặp lại**: Tiếp tục quá trình với phần mảng còn lại cho đến khi toàn bộ mảng được sắp xếp.

### Ví Dụ Minh Họa

Giả sử chúng ta có mảng: `[64, 34, 25, 12, 22, 11, 90]`

**Lượt 1:**
- So sánh 64 và 34: 64 > 34, hoán đổi → `[34, 64, 25, 12, 22, 11, 90]`
- So sánh 64 và 25: 64 > 25, hoán đổi → `[34, 25, 64, 12, 22, 11, 90]`
- So sánh 64 và 12: 64 > 12, hoán đổi → `[34, 25, 12, 64, 22, 11, 90]`
- So sánh 64 và 22: 64 > 22, hoán đổi → `[34, 25, 12, 22, 64, 11, 90]`
- So sánh 64 và 11: 64 > 11, hoán đổi → `[34, 25, 12, 22, 11, 64, 90]`
- So sánh 64 và 90: 64 < 90, không hoán đổi → `[34, 25, 12, 22, 11, 64, 90]`

Sau lượt 1: Phần tử lớn nhất (90) đã ở vị trí cuối.

**Lượt 2:**
- Tiếp tục với mảng con `[34, 25, 12, 22, 11, 64]`
- Sau lượt 2: `[25, 12, 22, 11, 34, 64, 90]`

Quá trình tiếp tục cho đến khi mảng được sắp xếp hoàn toàn.

## Cài Đặt Trong JavaScript

### Cài Đặt Cơ Bản

```javascript
function bubbleSort(mang) {
    const n = mang.length;
    
    for (let i = 0; i < n - 1; i++) {
        // Lượt duyệt thứ i sẽ đưa phần tử lớn thứ i về vị trí cuối
        for (let j = 0; j < n - i - 1; j++) {
            // So sánh hai phần tử liền kề
            if (mang[j] > mang[j + 1]) {
                // Hoán đổi nếu thứ tự sai
                [mang[j], mang[j + 1]] = [mang[j + 1], mang[j]];
            }
        }
    }
    
    return mang;
}

// Ví dụ sử dụng
const danhSachSo = [64, 34, 25, 12, 22, 11, 90];
console.log('Mảng gốc:', danhSachSo);
console.log('Mảng đã sắp xếp:', bubbleSort([...danhSachSo]));
```

### Cài Đặt Tối Ưu (Early Termination)

```javascript
function bubbleSortToiUu(mang) {
    const n = mang.length;
    
    for (let i = 0; i < n - 1; i++) {
        let daHoanDoi = false; // Cờ kiểm tra có hoán đổi không
        
        for (let j = 0; j < n - i - 1; j++) {
            if (mang[j] > mang[j + 1]) {
                [mang[j], mang[j + 1]] = [mang[j + 1], mang[j]];
                daHoanDoi = true;
            }
        }
        
        // Nếu không có hoán đổi nào, mảng đã được sắp xếp
        if (!daHoanDoi) {
            break;
        }
    }
    
    return mang;
}
```

### Cài Đặt Class (Theo Mẫu Dự Án)

```javascript
import Sort from '../Sort';

export default class BubbleSort extends Sort {
    sort(mangGoc) {
        // Cờ để theo dõi việc hoán đổi có xảy ra hay không
        let daHoanDoi = false;
        // Sao chép mảng gốc để tránh thay đổi
        const mang = [...mangGoc];

        for (let i = 1; i < mang.length; i += 1) {
            daHoanDoi = false;

            // Gọi callback để theo dõi việc truy cập phần tử
            this.callbacks.visitingCallback(mang[i]);

            for (let j = 0; j < mang.length - i; j += 1) {
                // Gọi callback để theo dõi việc truy cập phần tử
                this.callbacks.visitingCallback(mang[j]);

                // Hoán đổi các phần tử nếu chúng có thứ tự sai
                if (this.comparator.lessThan(mang[j + 1], mang[j])) {
                    [mang[j], mang[j + 1]] = [mang[j + 1], mang[j]];

                    // Đánh dấu đã có hoán đổi
                    daHoanDoi = true;
                }
            }

            // Nếu không có hoán đổi nào thì mảng đã được sắp xếp
            if (!daHoanDoi) {
                return mang;
            }
        }

        return mang;
    }
}
```

## Ứng Dụng Thực Tế

### 1. Hệ Thống Quản Lý Điểm Số Học Sinh

```javascript
class QuanLyDiem {
    constructor() {
        this.danhSachHocSinh = [];
    }
    
    themHocSinh(ten, diem) {
        this.danhSachHocSinh.push({ ten, diem });
    }
    
    sapXepTheoDiem() {
        // Sử dụng Bubble Sort để sắp xếp theo điểm giảm dần
        const n = this.danhSachHocSinh.length;
        
        for (let i = 0; i < n - 1; i++) {
            let daHoanDoi = false;
            
            for (let j = 0; j < n - i - 1; j++) {
                if (this.danhSachHocSinh[j].diem < this.danhSachHocSinh[j + 1].diem) {
                    [this.danhSachHocSinh[j], this.danhSachHocSinh[j + 1]] = 
                    [this.danhSachHocSinh[j + 1], this.danhSachHocSinh[j]];
                    daHoanDoi = true;
                }
            }
            
            if (!daHoanDoi) break;
        }
        
        return this.danhSachHocSinh;
    }
    
    inBangXepHang() {
        const bangXepHang = this.sapXepTheoDiem();
        console.log('BẢNG XẾP HẠNG ĐIỂM SỐ:');
        console.log('========================');
        
        bangXepHang.forEach((hocSinh, index) => {
            console.log(`${index + 1}. ${hocSinh.ten}: ${hocSinh.diem} điểm`);
        });
    }
}

// Sử dụng hệ thống
const quanLy = new QuanLyDiem();
quanLy.themHocSinh('Nguyễn Văn An', 8.5);
quanLy.themHocSinh('Trần Thị Bình', 9.2);
quanLy.themHocSinh('Lê Minh Cường', 7.8);
quanLy.themHocSinh('Phạm Thị Dung', 9.0);
quanLy.themHocSinh('Hoàng Văn Em', 8.1);

quanLy.inBangXepHang();
```

### 2. Hệ Thống Sắp Xếp Sản Phẩm Theo Giá

```javascript
class QuanLySanPham {
    constructor() {
        this.danhSachSanPham = [];
    }
    
    themSanPham(ten, gia, moTa) {
        this.danhSachSanPham.push({ ten, gia, moTa });
    }
    
    sapXepTheoGia(tangDan = true) {
        const n = this.danhSachSanPham.length;
        let soLanSoSanh = 0;
        let soLanHoanDoi = 0;
        
        console.log(`Bắt đầu sắp xếp ${n} sản phẩm theo giá ${tangDan ? 'tăng dần' : 'giảm dần'}...`);
        
        for (let i = 0; i < n - 1; i++) {
            let daHoanDoi = false;
            
            for (let j = 0; j < n - i - 1; j++) {
                soLanSoSanh++;
                
                const dieuKien = tangDan ? 
                    this.danhSachSanPham[j].gia > this.danhSachSanPham[j + 1].gia :
                    this.danhSachSanPham[j].gia < this.danhSachSanPham[j + 1].gia;
                
                if (dieuKien) {
                    [this.danhSachSanPham[j], this.danhSachSanPham[j + 1]] = 
                    [this.danhSachSanPham[j + 1], this.danhSachSanPham[j]];
                    daHoanDoi = true;
                    soLanHoanDoi++;
                }
            }
            
            if (!daHoanDoi) {
                console.log(`Kết thúc sớm ở lượt ${i + 1}/${n - 1}`);
                break;
            }
        }
        
        console.log(`Hoàn thành! Số lần so sánh: ${soLanSoSanh}, Số lần hoán đổi: ${soLanHoanDoi}`);
        return this.danhSachSanPham;
    }
    
    hienThiDanhSach() {
        console.log('\nDANH SÁCH SẢN PHẨM:');
        console.log('===================');
        this.danhSachSanPham.forEach((sanPham, index) => {
            console.log(`${index + 1}. ${sanPham.ten}`);
            console.log(`   Giá: ${sanPham.gia.toLocaleString('vi-VN')} VNĐ`);
            console.log(`   Mô tả: ${sanPham.moTa}`);
            console.log('-------------------');
        });
    }
}

// Sử dụng hệ thống
const cuaHang = new QuanLySanPham();
cuaHang.themSanPham('Laptop Dell XPS 13', 25000000, 'Laptop cao cấp cho doanh nhân');
cuaHang.themSanPham('iPhone 15 Pro', 28000000, 'Smartphone Apple mới nhất');
cuaHang.themSanPham('Samsung Galaxy S24', 22000000, 'Android flagship 2024');
cuaHang.themSanPham('MacBook Air M3', 30000000, 'Laptop Apple với chip M3');
cuaHang.themSanPham('iPad Pro 12.9', 24000000, 'Máy tính bảng chuyên nghiệp');

cuaHang.sapXepTheoGia(true); // Sắp xếp tăng dần
cuaHang.hienThiDanhSach();
```

### 3. Hệ Thống Sắp Xếp Danh Sách Công Việc

```javascript
class QuanLyCongViec {
    constructor() {
        this.danhSachCongViec = [];
    }
    
    themCongViec(tieuDe, mucDoUuTien, hanChot) {
        this.danhSachCongViec.push({
            tieuDe,
            mucDoUuTien, // 1: Thấp, 2: Trung bình, 3: Cao, 4: Khẩn cấp
            hanChot: new Date(hanChot),
            trangThai: 'Chưa hoàn thành'
        });
    }
    
    sapXepTheoUuTien() {
        // Sắp xếp theo mức độ ưu tiên giảm dần (khẩn cấp trước)
        const n = this.danhSachCongViec.length;
        
        for (let i = 0; i < n - 1; i++) {
            let daHoanDoi = false;
            
            for (let j = 0; j < n - i - 1; j++) {
                // Nếu công việc j có mức độ ưu tiên thấp hơn j+1
                if (this.danhSachCongViec[j].mucDoUuTien < this.danhSachCongViec[j + 1].mucDoUuTien) {
                    [this.danhSachCongViec[j], this.danhSachCongViec[j + 1]] = 
                    [this.danhSachCongViec[j + 1], this.danhSachCongViec[j]];
                    daHoanDoi = true;
                }
                // Nếu cùng mức độ ưu tiên, sắp xếp theo hạn chót
                else if (this.danhSachCongViec[j].mucDoUuTien === this.danhSachCongViec[j + 1].mucDoUuTien) {
                    if (this.danhSachCongViec[j].hanChot > this.danhSachCongViec[j + 1].hanChot) {
                        [this.danhSachCongViec[j], this.danhSachCongViec[j + 1]] = 
                        [this.danhSachCongViec[j + 1], this.danhSachCongViec[j]];
                        daHoanDoi = true;
                    }
                }
            }
            
            if (!daHoanDoi) break;
        }
        
        return this.danhSachCongViec;
    }
    
    hienThiDanhSach() {
        const tenMucDo = {
            1: 'Thấp',
            2: 'Trung bình', 
            3: 'Cao',
            4: 'Khẩn cấp'
        };
        
        console.log('\nDANH SÁCH CÔNG VIỆC (đã sắp xếp theo ưu tiên):');
        console.log('===============================================');
        
        this.danhSachCongViec.forEach((congViec, index) => {
            console.log(`${index + 1}. ${congViec.tieuDe}`);
            console.log(`   Ưu tiên: ${tenMucDo[congViec.mucDoUuTien]}`);
            console.log(`   Hạn chót: ${congViec.hanChot.toLocaleDateString('vi-VN')}`);
            console.log(`   Trạng thái: ${congViec.trangThai}`);
            console.log('-------------------------------------------');
        });
    }
}

// Sử dụng hệ thống
const quanLyCongViec = new QuanLyCongViec();
quanLyCongViec.themCongViec('Hoàn thành báo cáo tháng', 3, '2024-01-15');
quanLyCongViec.themCongViec('Họp với khách hàng', 4, '2024-01-10');
quanLyCongViec.themCongViec('Cập nhật website', 2, '2024-01-20');
quanLyCongViec.themCongViec('Xử lý email', 1, '2024-01-12');
quanLyCongViec.themCongViec('Chuẩn bị presentation', 4, '2024-01-08');

quanLyCongViec.sapXepTheoUuTien();
quanLyCongViec.hienThiDanhSach();
```

## Phân Tích Hiệu Suất

### So Sánh Với Thuật Toán Khác

```javascript
class SoSanhThuatToan {
    static demSoLanThaoTac(mang, thuatToan) {
        let soLanSoSanh = 0;
        let soLanHoanDoi = 0;
        const mangSaoChep = [...mang];
        
        if (thuatToan === 'bubble') {
            const n = mangSaoChep.length;
            
            for (let i = 0; i < n - 1; i++) {
                let daHoanDoi = false;
                
                for (let j = 0; j < n - i - 1; j++) {
                    soLanSoSanh++;
                    
                    if (mangSaoChep[j] > mangSaoChep[j + 1]) {
                        [mangSaoChep[j], mangSaoChep[j + 1]] = [mangSaoChep[j + 1], mangSaoChep[j]];
                        soLanHoanDoi++;
                        daHoanDoi = true;
                    }
                }
                
                if (!daHoanDoi) break;
            }
        }
        
        return { soLanSoSanh, soLanHoanDoi, ketQua: mangSaoChep };
    }
    
    static kiemTraHieuSuat() {
        const testCases = [
            { ten: 'Mảng đã sắp xếp', mang: [1, 2, 3, 4, 5] },
            { ten: 'Mảng ngược', mang: [5, 4, 3, 2, 1] },
            { ten: 'Mảng ngẫu nhiên', mang: [3, 1, 4, 1, 5, 9, 2, 6] },
            { ten: 'Mảng có phần tử trùng', mang: [3, 3, 1, 1, 2, 2] }
        ];
        
        console.log('PHÂN TÍCH HIỆU SUẤT BUBBLE SORT');
        console.log('================================');
        
        testCases.forEach(testCase => {
            const ketQua = this.demSoLanThaoTac(testCase.mang, 'bubble');
            
            console.log(`\nTrường hợp: ${testCase.ten}`);
            console.log(`Mảng gốc: [${testCase.mang.join(', ')}]`);
            console.log(`Kết quả: [${ketQua.ketQua.join(', ')}]`);
            console.log(`Số lần so sánh: ${ketQua.soLanSoSanh}`);
            console.log(`Số lần hoán đổi: ${ketQua.soLanHoanDoi}`);
            
            // Tính toán độ phức tạp thực tế
            const n = testCase.mang.length;
            const maxSoSanh = n * (n - 1) / 2;
            const tiLeSoSanh = (ketQua.soLanSoSanh / maxSoSanh * 100).toFixed(1);
            
            console.log(`Tỷ lệ so sánh so với trường hợp xấu nhất: ${tiLeSoSanh}%`);
        });
    }
}

// Chạy phân tích
SoSanhThuatToan.kiemTraHieuSuat();
```

## Các Biến Thể và Tối Ưu

### 1. Bubble Sort Hai Chiều (Cocktail Sort)

```javascript
function cocktailSort(mang) {
    let dau = 0;
    let cuoi = mang.length - 1;
    let daHoanDoi = true;
    
    while (daHoanDoi) {
        daHoanDoi = false;
        
        // Duyệt từ trái sang phải
        for (let i = dau; i < cuoi; i++) {
            if (mang[i] > mang[i + 1]) {
                [mang[i], mang[i + 1]] = [mang[i + 1], mang[i]];
                daHoanDoi = true;
            }
        }
        cuoi--;
        
        if (!daHoanDoi) break;
        
        // Duyệt từ phải sang trái
        for (let i = cuoi; i > dau; i--) {
            if (mang[i] < mang[i - 1]) {
                [mang[i], mang[i - 1]] = [mang[i - 1], mang[i]];
                daHoanDoi = true;
            }
        }
        dau++;
    }
    
    return mang;
}
```

### 2. Bubble Sort Với Giới Hạn

```javascript
function bubbleSortVoiGioiHan(mang, maxLuot = Infinity) {
    const n = mang.length;
    let luotHienTai = 0;
    
    for (let i = 0; i < n - 1 && luotHienTai < maxLuot; i++) {
        let daHoanDoi = false;
        luotHienTai++;
        
        console.log(`Lượt ${luotHienTai}: [${mang.join(', ')}]`);
        
        for (let j = 0; j < n - i - 1; j++) {
            if (mang[j] > mang[j + 1]) {
                [mang[j], mang[j + 1]] = [mang[j + 1], mang[j]];
                daHoanDoi = true;
            }
        }
        
        if (!daHoanDoi) {
            console.log('Kết thúc sớm - mảng đã được sắp xếp');
            break;
        }
    }
    
    return mang;
}

// Sử dụng
const mangTest = [64, 34, 25, 12, 22, 11, 90];
console.log('Bubble Sort với giới hạn 3 lượt:');
bubbleSortVoiGioiHan([...mangTest], 3);
```

## Ưu Điểm và Nhược Điểm

### Ưu Điểm

1. **Đơn giản**: Dễ hiểu và cài đặt
2. **Ổn định**: Không thay đổi thứ tự tương đối của các phần tử bằng nhau
3. **In-place**: Chỉ cần thêm O(1) bộ nhớ
4. **Phát hiện sớm**: Có thể dừng sớm nếu mảng đã được sắp xếp
5. **Phù hợp cho dữ liệu nhỏ**: Hiệu quả với các mảng nhỏ hoặc gần như đã sắp xếp

### Nhược Điểm

1. **Hiệu suất kém**: O(n²) trong trường hợp trung bình và xấu nhất
2. **Nhiều so sánh**: Thực hiện nhiều phép so sánh không cần thiết
3. **Không thích hợp cho dữ liệu lớn**: Chậm với các mảng lớn
4. **Hoán đổi nhiều**: Thực hiện nhiều phép hoán đổi

## Độ Phức Tạp

| Trường hợp              | Thời gian          | Không gian | Ổn định   | Chú thích                    |
| ----------------------- | :----------------: | :---------: | :-------: | :--------------------------- |
| **Tốt nhất**           | O(n)               | O(1)        | Có        | Mảng đã sắp xếp             |
| **Trung bình**         | O(n²)              | O(1)        | Có        | Mảng ngẫu nhiên             |
| **Xấu nhất**           | O(n²)              | O(1)        | Có        | Mảng sắp xếp ngược          |

### Phân Tích Chi Tiết

- **Số lần so sánh**: 
  - Tốt nhất: n-1 (mảng đã sắp xếp)
  - Xấu nhất: n(n-1)/2
- **Số lần hoán đổi**:
  - Tốt nhất: 0
  - Xấu nhất: n(n-1)/2

## Khi Nào Nên Sử Dụng

### Phù Hợp Khi:
- Dữ liệu nhỏ (< 50 phần tử)
- Mảng gần như đã được sắp xếp
- Cần thuật toán ổn định và đơn giản
- Giới hạn bộ nhớ nghiêm ngặt
- Mục đích giáo dục

### Không Phù Hợp Khi:
- Dữ liệu lớn
- Cần hiệu suất cao
- Mảng hoàn toàn ngẫu nhiên
- Ứng dụng thời gian thực

## Tài Liệu Tham Khảo

- [Wikipedia - Bubble Sort](https://vi.wikipedia.org/wiki/S%E1%BA%AFp_x%E1%BA%BFp_n%E1%BB%95i_b%E1%BB%8Dt)
- [GeeksforGeeks - Bubble Sort](https://www.geeksforgeeks.org/bubble-sort/)
- [Visualgo - Sorting Visualization](https://visualgo.net/en/sorting)
- [YouTube - Bubble Sort Explained](https://www.youtube.com/watch?v=6Gv8vg0kcHc&index=27&t=0s&list=PLLXdhg_r2hKA7DPDsunoDZ-Z769jWn4R8)

## Bài Tập Thực Hành

### Bài 1: Sắp Xếp Chuỗi
Viết hàm sắp xếp mảng các chuỗi theo thứ tự bảng chữ cái sử dụng Bubble Sort.

### Bài 2: Đếm Số Lần Hoán Đổi
Thay đổi thuật toán để đếm và trả về số lần hoán đổi được thực hiện.

### Bài 3: Bubble Sort Cho Đối Tượng
Sắp xếp mảng các đối tượng theo một thuộc tính cụ thể.

### Bài 4: Tối Ưu Hóa
Cài đặt phiên bản Bubble Sort tối ưu nhất có thể với các kỹ thuật như:
- Early termination
- Bidirectional bubbling
- Range reduction

---

*Post ID: cr2o0wl09jsvzel*  
*Category: Sorting Algorithms*  
*Created: 21/8/2025*  
*Updated: 29/8/2025*
