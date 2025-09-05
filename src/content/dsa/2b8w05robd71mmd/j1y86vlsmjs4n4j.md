---
title: "Sắp Xếp Chọn Lọc (Selection Sort)"
postId: "j1y86vlsmjs4n4j"
category: "Sorting Algorithms"
created: "21/8/2025"
updated: "29/8/2025"
---

# Sắp Xếp Chọn Lọc (Selection Sort)



Sắp xếp chọn lọc (Selection Sort) là một thuật toán sắp xếp, cụ thể là thuật toán so sánh tại chỗ (in-place comparison sort). Thuật toán này có độ phức tạp thời gian O(n²), làm cho nó không hiệu quả trên các danh sách lớn, và thường hoạt động tệ hơn so với thuật toán sắp xếp chèn (insertion sort) tương tự. Selection Sort được chú ý vì tính đơn giản của nó, và có những ưu điểm về hiệu suất so với các thuật toán phức tạp hơn trong một số tình huống nhất định, đặc biệt là khi bộ nhớ phụ trợ bị hạn chế.

![Minh họa thuật toán](https://upload.wikimedia.org/wikipedia/commons/b/b0/Selection_sort_animation.gif)

![Minh họa thuật toán](https://upload.wikimedia.org/wikipedia/commons/9/94/Selection-Sort-Animation.gif)

## Giải Thích Chi Tiết

### Cách Hoạt Động

Thuật toán Selection Sort hoạt động theo nguyên lý đơn giản:

1. **Tìm phần tử nhỏ nhất**: Trong mảng chưa sắp xếp, tìm phần tử có giá trị nhỏ nhất.
2. **Hoán đổi**: Đặt phần tử này vào vị trí đầu tiên của mảng chưa sắp xếp.
3. **Thu hẹp phạm vi**: Loại bỏ phần tử vừa sắp xếp khỏi danh sách cần xử lý.
4. **Lặp lại**: Tiếp tục quá trình với phần mảng còn lại cho đến khi toàn bộ mảng được sắp xếp.

### Ví Dụ Minh Họa Chi Tiết

Giả sử chúng ta có mảng: `[64, 25, 12, 22, 11]`

**Bước 1:** Tìm phần tử nhỏ nhất trong toàn bộ mảng
- Mảng: `[64, 25, 12, 22, 11]`
- Phần tử nhỏ nhất: `11` (tại vị trí 4)
- Hoán đổi với phần tử đầu tiên: `[11, 25, 12, 22, 64]`
- Phần đã sắp xếp: `[11]`

**Bước 2:** Tìm phần tử nhỏ nhất trong mảng con `[25, 12, 22, 64]`
- Phần tử nhỏ nhất: `12` (tại vị trí 2)
- Hoán đổi với phần tử đầu tiên của mảng con: `[11, 12, 25, 22, 64]`
- Phần đã sắp xếp: `[11, 12]`

**Bước 3:** Tìm phần tử nhỏ nhất trong mảng con `[25, 22, 64]`
- Phần tử nhỏ nhất: `22` (tại vị trí 3)
- Hoán đổi: `[11, 12, 22, 25, 64]`
- Phần đã sắp xếp: `[11, 12, 22]`

**Bước 4:** Tìm phần tử nhỏ nhất trong mảng con `[25, 64]`
- Phần tử nhỏ nhất: `25` (đã ở vị trí đúng)
- Không cần hoán đổi: `[11, 12, 22, 25, 64]`
- Phần đã sắp xếp: `[11, 12, 22, 25]`

**Kết quả:** Mảng cuối cùng: `[11, 12, 22, 25, 64]`

## Cài Đặt Trong JavaScript

### Cài Đặt Cơ Bản

```javascript
function selectionSort(mang) {
    const n = mang.length;
    
    for (let i = 0; i < n - 1; i++) {
        // Tìm vị trí của phần tử nhỏ nhất trong mảng con chưa sắp xếp
        let viTriNhoNhat = i;
        
        for (let j = i + 1; j < n; j++) {
            if (mang[j] < mang[viTriNhoNhat]) {
                viTriNhoNhat = j;
            }
        }
        
        // Hoán đổi phần tử nhỏ nhất với phần tử đầu tiên của mảng con
        if (viTriNhoNhat !== i) {
            [mang[i], mang[viTriNhoNhat]] = [mang[viTriNhoNhat], mang[i]];
        }
    }
    
    return mang;
}

// Ví dụ sử dụng
const danhSachSo = [64, 25, 12, 22, 11];
console.log('Mảng gốc:', danhSachSo);
console.log('Mảng đã sắp xếp:', selectionSort([...danhSachSo]));
```

### Cài Đặt Với Theo Dõi Quá Trình

```javascript
function selectionSortCoTheoDoi(mang) {
    const n = mang.length;
    let soLanSoSanh = 0;
    let soLanHoanDoi = 0;
    
    console.log(`Bắt đầu sắp xếp mảng: [${mang.join(', ')}]`);
    
    for (let i = 0; i < n - 1; i++) {
        let viTriNhoNhat = i;
        
        console.log(`\nBước ${i + 1}: Tìm phần tử nhỏ nhất từ vị trí ${i}`);
        
        for (let j = i + 1; j < n; j++) {
            soLanSoSanh++;
            console.log(`  So sánh: ${mang[j]} vs ${mang[viTriNhoNhat]}`);
            
            if (mang[j] < mang[viTriNhoNhat]) {
                viTriNhoNhat = j;
                console.log(`    -> Tìm thấy giá trị nhỏ hơn: ${mang[j]} tại vị trí ${j}`);
            }
        }
        
        if (viTriNhoNhat !== i) {
            console.log(`  Hoán đổi: ${mang[i]} <-> ${mang[viTriNhoNhat]}`);
            [mang[i], mang[viTriNhoNhat]] = [mang[viTriNhoNhat], mang[i]];
            soLanHoanDoi++;
        } else {
            console.log(`  Không cần hoán đổi (${mang[i]} đã ở vị trí đúng)`);
        }
        
        console.log(`  Mảng sau bước ${i + 1}: [${mang.join(', ')}]`);
        console.log(`  Phần đã sắp xếp: [${mang.slice(0, i + 1).join(', ')}]`);
    }
    
    console.log(`\nKết quả cuối cùng: [${mang.join(', ')}]`);
    console.log(`Tổng số lần so sánh: ${soLanSoSanh}`);
    console.log(`Tổng số lần hoán đổi: ${soLanHoanDoi}`);
    
    return mang;
}
```

### Cài Đặt Class (Theo Mẫu Dự Án)

```javascript
import Sort from '../Sort';

export default class SelectionSort extends Sort {
    sort(mangGoc) {
        // Sao chép mảng gốc để tránh thay đổi
        const mang = [...mangGoc];

        for (let i = 0; i < mang.length - 1; i += 1) {
            let viTriNhoNhat = i;

            // Gọi callback để theo dõi việc truy cập phần tử
            this.callbacks.visitingCallback(mang[i]);

            // Tìm phần tử nhỏ nhất trong phần còn lại của mảng
            for (let j = i + 1; j < mang.length; j += 1) {
                // Gọi callback để theo dõi việc truy cập phần tử
                this.callbacks.visitingCallback(mang[j]);

                if (this.comparator.lessThan(mang[j], mang[viTriNhoNhat])) {
                    viTriNhoNhat = j;
                }
            }

            // Nếu tìm thấy phần tử nhỏ hơn thì hoán đổi với phần tử hiện tại
            if (viTriNhoNhat !== i) {
                [mang[i], mang[viTriNhoNhat]] = [mang[viTriNhoNhat], mang[i]];
            }
        }

        return mang;
    }
}
```

### Cài Đặt Cho Sắp Xếp Giảm Dần

```javascript
function selectionSortGiamDan(mang) {
    const n = mang.length;
    
    for (let i = 0; i < n - 1; i++) {
        // Tìm vị trí của phần tử lớn nhất trong mảng con chưa sắp xếp
        let viTriLonNhat = i;
        
        for (let j = i + 1; j < n; j++) {
            if (mang[j] > mang[viTriLonNhat]) {
                viTriLonNhat = j;
            }
        }
        
        // Hoán đổi phần tử lớn nhất với phần tử đầu tiên của mảng con
        if (viTriLonNhat !== i) {
            [mang[i], mang[viTriLonNhat]] = [mang[viTriLonNhat], mang[i]];
        }
    }
    
    return mang;
}
```

## Ứng Dụng Thực Tế

### 1. Hệ Thống Xếp Hạng Thi Đấu Thể Thao

```javascript
class XepHangThiDau {
    constructor() {
        this.danhSachVanDongVien = [];
    }
    
    themVanDongVien(ten, diem, theThao) {
        this.danhSachVanDongVien.push({
            ten,
            diem,
            theThao,
            xepHang: null
        });
    }
    
    xepHangBangSelectionSort() {
        const n = this.danhSachVanDongVien.length;
        console.log('BẮT ĐẦU XẾP HẠNG VẬN ĐỘNG VIÊN');
        console.log('================================');
        
        // Sử dụng Selection Sort để xếp hạng theo điểm giảm dần
        for (let i = 0; i < n - 1; i++) {
            let viTriDiemCaoNhat = i;
            
            console.log(`\nVòng ${i + 1}: Tìm vận động viên có điểm cao nhất từ vị trí ${i + 1}`);
            
            // Tìm vận động viên có điểm cao nhất trong phần chưa xếp hạng
            for (let j = i + 1; j < n; j++) {
                console.log(`  So sánh: ${this.danhSachVanDongVien[j].ten} (${this.danhSachVanDongVien[j].diem}) vs ${this.danhSachVanDongVien[viTriDiemCaoNhat].ten} (${this.danhSachVanDongVien[viTriDiemCaoNhat].diem})`);
                
                if (this.danhSachVanDongVien[j].diem > this.danhSachVanDongVien[viTriDiemCaoNhat].diem) {
                    viTriDiemCaoNhat = j;
                    console.log(`    -> Tìm thấy điểm cao hơn: ${this.danhSachVanDongVien[j].ten}`);
                }
            }
            
            // Hoán đổi nếu cần
            if (viTriDiemCaoNhat !== i) {
                console.log(`  Hoán đổi vị trí: ${this.danhSachVanDongVien[i].ten} <-> ${this.danhSachVanDongVien[viTriDiemCaoNhat].ten}`);
                [this.danhSachVanDongVien[i], this.danhSachVanDongVien[viTriDiemCaoNhat]] = 
                [this.danhSachVanDongVien[viTriDiemCaoNhat], this.danhSachVanDongVien[i]];
            }
            
            // Cập nhật xếp hạng
            this.danhSachVanDongVien[i].xepHang = i + 1;
            console.log(`  Hạng ${i + 1}: ${this.danhSachVanDongVien[i].ten} - ${this.danhSachVanDongVien[i].diem} điểm`);
        }
        
        // Cập nhật xếp hạng cho vận động viên cuối cùng
        this.danhSachVanDongVien[n - 1].xepHang = n;
        
        return this.danhSachVanDongVien;
    }
    
    inBangXepHang() {
        console.log('\nBẢNG XẾP HẠNG CUỐI CÙNG');
        console.log('========================');
        
        this.danhSachVanDongVien.forEach(vdv => {
            const huy = vdv.xepHang <= 3 ? this.layHuy章(vdv.xepHang) : '';
            console.log(`${vdv.xepHang}. ${vdv.ten} ${huy}`);
            console.log(`   Môn: ${vdv.theThao}`);
            console.log(`   Điểm: ${vdv.diem}`);
            console.log('   ----------------');
        });
    }
    
    layHuyChương(hang) {
        const huyChương = { 1: '🥇', 2: '🥈', 3: '🥉' };
        return huyChương[hang] || '';
    }
}

// Sử dụng hệ thống
const giaiDau = new XepHangThiDau();
giaiDau.themVanDongVien('Nguyễn Thành Long', 9.8, 'Bơi lội');
giaiDau.themVanDongVien('Trần Minh Anh', 9.2, 'Điền kinh');
giaiDau.themVanDongVien('Lê Hoài Nam', 9.9, 'Thể dục dụng cụ');
giaiDau.themVanDongVien('Phạm Thị Lan', 9.1, 'Cầu lông');
giaiDau.themVanDongVien('Hoàng Đức Minh', 9.7, 'Judo');

giaiDau.xepHangBangSelectionSort();
giaiDau.inBangXepHang();
```

### 2. Hệ Thống Quản Lý Kho Hàng Theo Mức Độ Ưu Tiên

```javascript
class QuanLyKhoHang {
    constructor() {
        this.danhSachSanPham = [];
    }
    
    themSanPham(maSP, tenSP, soLuong, mucDoUuTien) {
        // Mức độ ưu tiên: 1 = Thấp, 2 = Trung bình, 3 = Cao, 4 = Khẩn cấp
        this.danhSachSanPham.push({
            maSP,
            tenSP,
            soLuong,
            mucDoUuTien,
            trangThai: soLuong === 0 ? 'Hết hàng' : 'Còn hàng'
        });
    }
    
    sapXepTheoUuTien() {
        const n = this.danhSachSanPham.length;
        console.log('SẮPLXẾP KHO HÀNG THEO MỨC ĐỘ ưu TIÊN');
        console.log('======================================');
        
        for (let i = 0; i < n - 1; i++) {
            let viTriUuTienCaoNhat = i;
            
            console.log(`\nBước ${i + 1}: Tìm sản phẩm ưu tiên cao nhất`);
            
            for (let j = i + 1; j < n; j++) {
                const sanPhamHienTai = this.danhSachSanPham[j];
                const sanPhamUuTienCaoNhat = this.danhSachSanPham[viTriUuTienCaoNhat];
                
                console.log(`  So sánh: ${sanPhamHienTai.tenSP} (ưu tiên ${sanPhamHienTai.mucDoUuTien}) vs ${sanPhamUuTienCaoNhat.tenSP} (ưu tiên ${sanPhamUuTienCaoNhat.mucDoUuTien})`);
                
                // Ưu tiên theo: Mức độ ưu tiên cao -> Số lượng ít (cần bổ sung)
                if (sanPhamHienTai.mucDoUuTien > sanPhamUuTienCaoNhat.mucDoUuTien ||
                    (sanPhamHienTai.mucDoUuTien === sanPhamUuTienCaoNhat.mucDoUuTien && 
                     sanPhamHienTai.soLuong < sanPhamUuTienCaoNhat.soLuong)) {
                    viTriUuTienCaoNhat = j;
                    console.log(`    -> Tìm thấy ưu tiên cao hơn: ${sanPhamHienTai.tenSP}`);
                }
            }
            
            if (viTriUuTienCaoNhat !== i) {
                console.log(`  Chuyển lên đầu: ${this.danhSachSanPham[viTriUuTienCaoNhat].tenSP}`);
                [this.danhSachSanPham[i], this.danhSachSanPham[viTriUuTienCaoNhat]] = 
                [this.danhSachSanPham[viTriUuTienCaoNhat], this.danhSachSanPham[i]];
            }
            
            console.log(`  Vị trí ${i + 1}: ${this.danhSachSanPham[i].tenSP} - Ưu tiên ${this.danhSachSanPham[i].mucDoUuTien}`);
        }
        
        return this.danhSachSanPham;
    }
    
    inDanhSachUuTien() {
        const tenMucDo = {
            1: 'Thấp',
            2: 'Trung bình',
            3: 'Cao', 
            4: 'Khẩn cấp'
        };
        
        console.log('\nDANH SÁCH ƯU TIÊN XỬ LÝ KHO HÀNG');
        console.log('==================================');
        
        this.danhSachSanPham.forEach((sp, index) => {
            const icon = sp.mucDoUuTien === 4 ? '🚨' : 
                        sp.mucDoUuTien === 3 ? '⚠️' : 
                        sp.mucDoUuTien === 2 ? '⚡' : '📦';
            
            console.log(`${index + 1}. ${icon} ${sp.tenSP}`);
            console.log(`   Mã SP: ${sp.maSP}`);
            console.log(`   Số lượng: ${sp.soLuong}`);
            console.log(`   Ưu tiên: ${tenMucDo[sp.mucDoUuTien]}`);
            console.log(`   Trạng thái: ${sp.trangThai}`);
            console.log('   ------------------------');
        });
    }
    
    xuatBaoCaoBoSung() {
        const sanPhamCanBoSung = this.danhSachSanPham.filter(sp => sp.soLuong < 10);
        
        console.log('\nBÁO CÁO SẢN PHẨM CẦN BỔ SUNG');
        console.log('=============================');
        
        if (sanPhamCanBoSung.length === 0) {
            console.log('Không có sản phẩm nào cần bổ sung.');
            return;
        }
        
        sanPhamCanBoSung.forEach(sp => {
            const mucDoKhan = sp.soLuong === 0 ? 'HẾT HÀNG' : 
                            sp.soLuong < 5 ? 'RẤT ÍT' : 'ÍT';
            console.log(`• ${sp.tenSP}: ${sp.soLuong} (${mucDoKhan})`);
        });
    }
}

// Sử dụng hệ thống
const khoHang = new QuanLyKhoHang();
khoHang.themSanPham('SP001', 'Laptop Dell XPS', 2, 4);  // Khẩn cấp, ít hàng
khoHang.themSanPham('SP002', 'Mouse Logitech', 15, 1);  // Thấp, đủ hàng
khoHang.themSanPham('SP003', 'Màn hình Samsung', 0, 3); // Cao, hết hàng
khoHang.themSanPham('SP004', 'Bàn phím cơ', 8, 2);     // Trung bình, ít hàng
khoHang.themSanPham('SP005', 'Webcam HD', 1, 4);       // Khẩn cấp, rất ít

khoHang.sapXepTheoUuTien();
khoHang.inDanhSachUuTien();
khoHang.xuatBaoCaoBoSung();
```

### 3. Hệ Thống Tuyển Dụng Nhân Viên

```javascript
class HeTuyenDung {
    constructor() {
        this.danhSachUngVien = [];
    }
    
    themUngVien(hoTen, kiNang, kinhNghiem, bangCap, mucLuongMongMuon) {
        const diemTongHop = this.tinhDiemTongHop(kiNang, kinhNghiem, bangCap);
        
        this.danhSachUngVien.push({
            hoTen,
            kiNang,           // Điểm từ 1-10
            kinhNghiem,       // Số năm kinh nghiệm
            bangCap,          // Điểm từ 1-10
            mucLuongMongMuon, // VNĐ
            diemTongHop,
            ketQua: null
        });
    }
    
    tinhDiemTongHop(kiNang, kinhNghiem, bangCap) {
        // Công thức tính điểm: (Kỹ năng * 0.4) + (Kinh nghiệm * 0.3) + (Bằng cấp * 0.3)
        return (kiNang * 0.4 + Math.min(kinhNghiem, 10) * 0.3 + bangCap * 0.3).toFixed(2);
    }
    
    sapXepUngVienBangSelectionSort() {
        const n = this.danhSachUngVien.length;
        console.log('QUÁ TRÌNH TUYỂN CHỌN ỨNG VIÊN');
        console.log('==============================');
        
        // Sắp xếp theo điểm tổng hợp giảm dần
        for (let i = 0; i < n - 1; i++) {
            let viTriDiemCaoNhat = i;
            
            console.log(`\nVòng tuyển chọn ${i + 1}:`);
            
            for (let j = i + 1; j < n; j++) {
                const ungVienHienTai = this.danhSachUngVien[j];
                const ungVienDiemCao = this.danhSachUngVien[viTriDiemCaoNhat];
                
                console.log(`  Đánh giá: ${ungVienHienTai.hoTen} (${ungVienHienTai.diemTongHop} điểm) vs ${ungVienDiemCao.hoTen} (${ungVienDiemCao.diemTongHop} điểm)`);
                
                if (parseFloat(ungVienHienTai.diemTongHop) > parseFloat(ungVienDiemCao.diemTongHop)) {
                    viTriDiemCaoNhat = j;
                    console.log(`    -> Ứng viên xuất sắc hơn: ${ungVienHienTai.hoTen}`);
                }
                // Nếu điểm bằng nhau, ưu tiên người có mức lương mong muốn thấp hơn
                else if (parseFloat(ungVienHienTai.diemTongHop) === parseFloat(ungVienDiemCao.diemTongHop) &&
                        ungVienHienTai.mucLuongMongMuon < ungVienDiemCao.mucLuongMongMuon) {
                    viTriDiemCaoNhat = j;
                    console.log(`    -> Cùng điểm nhưng mức lương hợp lý hơn: ${ungVienHienTai.hoTen}`);
                }
            }
            
            if (viTriDiemCaoNhat !== i) {
                console.log(`  Chọn ứng viên: ${this.danhSachUngVien[viTriDiemCaoNhat].hoTen} cho vị trí thứ ${i + 1}`);
                [this.danhSachUngVien[i], this.danhSachUngVien[viTriDiemCaoNhat]] = 
                [this.danhSachUngVien[viTriDiemCaoNhat], this.danhSachUngVien[i]];
            }
            
            // Xác định kết quả (giả sử chỉ tuyển 3 người đầu)
            this.danhSachUngVien[i].ketQua = i < 3 ? 'TRÚNG TUYỂN' : 'KHÔNG TRÚNG TUYỂN';
        }
        
        // Xác định kết quả cho ứng viên cuối
        this.danhSachUngVien[n - 1].ketQua = (n - 1) < 3 ? 'TRÚNG TUYỂN' : 'KHÔNG TRÚNG TUYỂN';
        
        return this.danhSachUngVien;
    }
    
    inKetQuaTuyenDung() {
        console.log('\nKẾT QUẢ TUYỂN DỤNG');
        console.log('===================');
        
        this.danhSachUngVien.forEach((uv, index) => {
            const icon = uv.ketQua === 'TRÚNG TUYỂN' ? '✅' : '❌';
            
            console.log(`${index + 1}. ${icon} ${uv.hoTen} - ${uv.ketQua}`);
            console.log(`   Điểm tổng hợp: ${uv.diemTongHop}/10`);
            console.log(`   Chi tiết:`);
            console.log(`     • Kỹ năng: ${uv.kiNang}/10`);
            console.log(`     • Kinh nghiệm: ${uv.kinhNghiem} năm`);
            console.log(`     • Bằng cấp: ${uv.bangCap}/10`);
            console.log(`   Mức lương mong muốn: ${uv.mucLuongMongMuon.toLocaleString('vi-VN')} VNĐ`);
            console.log('   ----------------------------------------');
        });
    }
    
    thongKeTuyenDung() {
        const trungtTuyen = this.danhSachUngVien.filter(uv => uv.ketQua === 'TRÚNG TUYỂN');
        const khongTrungTuyen = this.danhSachUngVien.filter(uv => uv.ketQua === 'KHÔNG TRÚNG TUYỂN');
        
        console.log('\nTHỐNG KÊ KẾT QUẢ');
        console.log('=================');
        console.log(`Tổng số ứng viên: ${this.danhSachUngVien.length}`);
        console.log(`Trúng tuyển: ${trungTuyen.length}`);
        console.log(`Không trúng tuyển: ${khongTrungTuyen.length}`);
        console.log(`Tỷ lệ trúng tuyển: ${(trungTuyen.length / this.danhSachUngVien.length * 100).toFixed(1)}%`);
        
        if (trungTuyen.length > 0) {
            const diemTBTrungTuyen = trungTuyen.reduce((sum, uv) => sum + parseFloat(uv.diemTongHop), 0) / trungTuyen.length;
            console.log(`Điểm trung bình của người trúng tuyển: ${diemTBTrungTuyen.toFixed(2)}`);
        }
    }
}

// Sử dụng hệ thống
const phongNhanSu = new HeTuyenDung();
phongNhanSu.themUngVien('Nguyễn Văn An', 8.5, 5, 8.0, 15000000);
phongNhanSu.themUngVien('Trần Thị Bình', 9.0, 3, 9.5, 18000000);
phongNhanSu.themUngVien('Lê Minh Cường', 7.5, 7, 7.0, 12000000);
phongNhanSu.themUngVien('Phạm Thị Dung', 8.8, 4, 8.5, 16000000);
phongNhanSu.themUngVien('Hoàng Văn Em', 9.2, 6, 9.0, 20000000);
phongNhanSu.themUngVien('Võ Thị Phát', 8.0, 8, 7.5, 14000000);

phongNhanSu.sapXepUngVienBangSelectionSort();
phongNhanSu.inKetQuaTuyenDung();
phongNhanSu.thongKeTuyenDung();
```

## Phân Tích Hiệu Suất

### So Sánh Selection Sort Với Các Thuật Toán Khác

```javascript
class PhanTichHieuSuat {
    static demThaoTacSelectionSort(mang) {
        let soLanSoSanh = 0;
        let soLanHoanDoi = 0;
        const mangSaoChep = [...mang];
        const n = mangSaoChep.length;
        
        for (let i = 0; i < n - 1; i++) {
            let viTriNhoNhat = i;
            
            for (let j = i + 1; j < n; j++) {
                soLanSoSanh++;
                if (mangSaoChep[j] < mangSaoChep[viTriNhoNhat]) {
                    viTriNhoNhat = j;
                }
            }
            
            if (viTriNhoNhat !== i) {
                [mangSaoChep[i], mangSaoChep[viTriNhoNhat]] = [mangSaoChep[viTriNhoNhat], mangSaoChep[i]];
                soLanHoanDoi++;
            }
        }
        
        return { soLanSoSanh, soLanHoanDoi, ketQua: mangSaoChep };
    }
    
    static demThaoTacBubbleSort(mang) {
        let soLanSoSanh = 0;
        let soLanHoanDoi = 0;
        const mangSaoChep = [...mang];
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
        
        return { soLanSoSanh, soLanHoanDoi, ketQua: mangSaoChep };
    }
    
    static soSanhThuatToan() {
        const testCases = [
            { ten: 'Mảng nhỏ đã sắp xếp', mang: [1, 2, 3, 4, 5] },
            { ten: 'Mảng nhỏ ngược', mang: [5, 4, 3, 2, 1] },
            { ten: 'Mảng trung bình ngẫu nhiên', mang: [64, 25, 12, 22, 11, 90, 88, 76, 50, 42] },
            { ten: 'Mảng có nhiều số trùng', mang: [3, 7, 3, 1, 7, 1, 3] }
        ];
        
        console.log('SO SÁNH HIỆU SUẤT: SELECTION SORT vs BUBBLE SORT');
        console.log('=================================================');
        
        testCases.forEach(testCase => {
            console.log(`\nTrường hợp: ${testCase.ten}`);
            console.log(`Mảng gốc: [${testCase.mang.join(', ')}]`);
            console.log('-------------------------------------------');
            
            const ketQuaSelection = this.demThaoTacSelectionSort(testCase.mang);
            const ketQuaBubble = this.demThaoTacBubbleSort(testCase.mang);
            
            console.log('SELECTION SORT:');
            console.log(`  Số lần so sánh: ${ketQuaSelection.soLanSoSanh}`);
            console.log(`  Số lần hoán đổi: ${ketQuaSelection.soLanHoanDoi}`);
            console.log(`  Tổng thao tác: ${ketQuaSelection.soLanSoSanh + ketQuaSelection.soLanHoanDoi}`);
            
            console.log('BUBBLE SORT:');
            console.log(`  Số lần so sánh: ${ketQuaBubble.soLanSoSanh}`);
            console.log(`  Số lần hoán đổi: ${ketQuaBubble.soLanHoanDoi}`);
            console.log(`  Tổng thao tác: ${ketQuaBubble.soLanSoSanh + ketQuaBubble.soLanHoanDoi}`);
            
            // So sánh
            console.log('SO SÁNH:');
            const tiLeSoSanh = (ketQuaSelection.soLanSoSanh / ketQuaBubble.soLanSoSanh * 100).toFixed(1);
            const tiLeHoanDoi = ketQuaBubble.soLanHoanDoi > 0 ? 
                (ketQuaSelection.soLanHoanDoi / ketQuaBubble.soLanHoanDoi * 100).toFixed(1) : '0';
            
            console.log(`  Selection Sort so sánh ${tiLeSoSanh}% so với Bubble Sort`);
            console.log(`  Selection Sort hoán đổi ${tiLeHoanDoi}% so với Bubble Sort`);
            
            if (ketQuaSelection.soLanHoanDoi < ketQuaBubble.soLanHoanDoi) {
                console.log(`  ✅ Selection Sort ít hoán đổi hơn (${ketQuaSelection.soLanHoanDoi} vs ${ketQuaBubble.soLanHoanDoi})`);
            }
        });
    }
    
    static phanTichDoPucTap() {
        console.log('\nPHÂN TÍCH ĐỘ PHỨC TẠP CHI TIẾT');
        console.log('==============================');
        
        const kichThuocMang = [5, 10, 20, 50, 100];
        
        kichThuocMang.forEach(n => {
            // Tạo mảng ngẫu nhiên
            const mang = Array.from({ length: n }, () => Math.floor(Math.random() * 100));
            const ketQua = this.demThaoTacSelectionSort(mang);
            
            const soSanhLyThuyet = n * (n - 1) / 2;
            const hoanDoiTrungBinh = n / 2; // Ước tính trung bình
            
            console.log(`\nKích thước mảng: ${n}`);
            console.log(`Số lần so sánh thực tế: ${ketQua.soLanSoSanh}`);
            console.log(`Số lần so sánh lý thuyết: ${soSanhLyThuyet}`);
            console.log(`Số lần hoán đổi: ${ketQua.soLanHoanDoi}`);
            console.log(`Tỷ lệ chính xác: ${(ketQua.soLanSoSanh / soSanhLyThuyet * 100).toFixed(1)}%`);
        });
    }
}

// Chạy phân tích
PhanTichHieuSuat.soSanhThuatToan();
PhanTichHieuSuat.phanTichDoPHucTap();
```

## Biến Thể và Tối Ưu

### 1. Selection Sort Hai Chiều (Double-Ended Selection Sort)

```javascript
function doubleEndedSelectionSort(mang) {
    let trai = 0;
    let phai = mang.length - 1;
    
    console.log('DOUBLE-ENDED SELECTION SORT');
    console.log('============================');
    
    while (trai < phai) {
        let viTriNhoNhat = trai;
        let viTriLonNhat = trai;
        
        console.log(`\nTìm min và max từ vị trí ${trai} đến ${phai}`);
        
        // Tìm đồng thời phần tử nhỏ nhất và lớn nhất
        for (let i = trai; i <= phai; i++) {
            if (mang[i] < mang[viTriNhoNhat]) {
                viTriNhoNhat = i;
            }
            if (mang[i] > mang[viTriLonNhat]) {
                viTriLonNhat = i;
            }
        }
        
        console.log(`Min: ${mang[viTriNhoNhat]} tại vị trí ${viTriNhoNhat}`);
        console.log(`Max: ${mang[viTriLonNhat]} tại vị trí ${viTriLonNhat}`);
        
        // Đặt phần tử nhỏ nhất về đầu
        if (viTriNhoNhat !== trai) {
            [mang[trai], mang[viTriNhoNhat]] = [mang[viTriNhoNhat], mang[trai]];
            
            // Nếu phần tử lớn nhất ở vị trí đầu, cập nhật vị trí sau khi hoán đổi
            if (viTriLonNhat === trai) {
                viTriLonNhat = viTriNhoNhat;
            }
        }
        
        // Đặt phần tử lớn nhất về cuối
        if (viTriLonNhat !== phai) {
            [mang[phai], mang[viTriLonNhat]] = [mang[viTriLonNhat], mang[phai]];
        }
        
        console.log(`Sau bước: [${mang.join(', ')}]`);
        
        trai++;
        phai--;
    }
    
    return mang;
}
```

### 2. Selection Sort Với Bước Nhảy (Gap Selection Sort)

```javascript
function gapSelectionSort(mang, buocNhay = 1) {
    const n = mang.length;
    
    console.log(`GAP SELECTION SORT (Bước nhảy: ${buocNhay})`);
    console.log('==========================================');
    
    for (let i = 0; i < n - buocNhay; i += buocNhay) {
        let viTriNhoNhat = i;
        
        console.log(`\nBước ${Math.floor(i / buocNhay) + 1}: Tìm min từ vị trí ${i} với bước ${buocNhay}`);
        
        // Tìm phần tử nhỏ nhất với bước nhảy
        for (let j = i + buocNhay; j < n; j += buocNhay) {
            console.log(`  So sánh: ${mang[j]} vs ${mang[viTriNhoNhat]}`);
            if (mang[j] < mang[viTriNhoNhat]) {
                viTriNhoNhat = j;
                console.log(`    -> Tìm thấy nhỏ hơn: ${mang[j]}`);
            }
        }
        
        if (viTriNhoNhat !== i) {
            console.log(`  Hoán đổi: ${mang[i]} <-> ${mang[viTriNhoNhat]}`);
            [mang[i], mang[viTriNhoNhat]] = [mang[viTriNhoNhat], mang[i]];
        }
        
        console.log(`  Kết quả: [${mang.join(', ')}]`);
    }
    
    return mang;
}
```

### 3. Selection Sort Với Điều Kiện Dừng Sớm

```javascript
function earlyStopSelectionSort(mang) {
    const n = mang.length;
    let soLuongDaDung = 0;
    
    for (let i = 0; i < n - 1; i++) {
        let viTriNhoNhat = i;
        let daTim = false;
        
        // Kiểm tra xem phần còn lại đã được sắp xếp chưa
        let daSapXep = true;
        for (let k = i; k < n - 1; k++) {
            if (mang[k] > mang[k + 1]) {
                daSapXep = false;
                break;
            }
        }
        
        if (daSapXep) {
            console.log(`Dừng sớm ở bước ${i + 1} - mảng đã được sắp xếp`);
            soLuongDaDung = i;
            break;
        }
        
        for (let j = i + 1; j < n; j++) {
            if (mang[j] < mang[viTriNhoNhat]) {
                viTriNhoNhat = j;
                daTim = true;
            }
        }
        
        if (viTriNhoNhat !== i) {
            [mang[i], mang[viTriNhoNhat]] = [mang[viTriNhoNhat], mang[i]];
        }
    }
    
    console.log(`Hoàn thành với ${soLuongDaDung} bước được tối ưu`);
    return mang;
}
```

## Ưu Điểm và Nhược Điểm

### Ưu Điểm

1. **Đơn giản**: Dễ hiểu và triển khai
2. **Ít hoán đổi**: Thực hiện tối đa n-1 lần hoán đổi
3. **In-place**: Chỉ cần O(1) bộ nhớ bổ sung
4. **Hoạt động nhất quán**: Hiệu suất không phụ thuộc vào thứ tự ban đầu
5. **Phù hợp cho bộ nhớ chậm**: Ít thao tác ghi hơn so với bubble sort

### Nhược Điểm

1. **Không ổn định**: Không bảo toàn thứ tự tương đối của các phần tử bằng nhau
2. **Hiệu suất cố định O(n²)**: Không được cải thiện ngay cả khi mảng gần như đã sắp xếp
3. **Nhiều so sánh**: Luôn thực hiện n(n-1)/2 phép so sánh
4. **Không phù hợp cho dữ liệu lớn**: Chậm với mảng lớn

## Độ Phức Tạp

| Trường hợp         | Thời gian       | Không gian | Ổn định | Số lần so sánh | Số lần hoán đổi |
| ------------------ | :-------------: | :---------: | :-----: | :------------: | :-------------: |
| **Tốt nhất**       | O(n²)           | O(1)        | Không   | n(n-1)/2       | 0               |
| **Trung bình**     | O(n²)           | O(1)        | Không   | n(n-1)/2       | n/2             |
| **Xấu nhất**       | O(n²)           | O(1)        | Không   | n(n-1)/2       | n-1             |

### Đặc Điểm Quan Trọng

- **Số lần so sánh cố định**: Luôn là n(n-1)/2 bất kể thứ tự ban đầu
- **Số lần hoán đổi tối thiểu**: Tối đa n-1 lần hoán đổi
- **Không ổn định**: Có thể thay đổi thứ tự của các phần tử có giá trị bằng nhau

## Khi Nào Nên Sử Dụng

### Phù Hợp Khi:
- Cần tối thiểu hóa số lần ghi/hoán đổi
- Bộ nhớ bị hạn chế nghiêm ngặt
- Chi phí hoán đổi rất cao (ví dụ: hoán đổi file lớn)
- Dữ liệu nhỏ và cần thuật toán đơn giản
- Không cần tính ổn định

### Không Phù Hợp Khi:
- Cần tính ổn định
- Dữ liệu lớn
- Cần hiệu suất cao
- Mảng gần như đã được sắp xếp (không có lợi thế)

## Tài Liệu Tham Khảo

- [Wikipedia - Selection Sort](https://vi.wikipedia.org/wiki/S%E1%BA%AFp_x%E1%BA%BFp_ch%E1%BB%8Dn)
- [GeeksforGeeks - Selection Sort](https://www.geeksforgeeks.org/selection-sort/)
- [Visualgo - Selection Sort](https://visualgo.net/en/sorting)
- [Khan Academy - Selection Sort](https://www.khanacademy.org/computing/computer-science/algorithms/sorting-algorithms/a/selection-sort-pseudocode)

## Bài Tập Thực Hành

### Bài 1: Selection Sort Cho Chuỗi
Cài đặt Selection Sort để sắp xếp mảng chuỗi theo thứ tự từ điển.

### Bài 2: Tìm K Phần Tử Nhỏ Nhất
Sử dụng ý tưởng của Selection Sort để tìm k phần tử nhỏ nhất mà không cần sắp xếp toàn bộ mảng.

### Bài 3: Selection Sort Ổn Định
Cải tiến Selection Sort để trở thành thuật toán ổn định.

### Bài 4: Đếm Hoán Đổi
Viết phiên bản Selection Sort có thể đếm và báo cáo số lần hoán đổi được thực hiện.

### Bài 5: Selection Sort Đệ Quy
Cài đặt Selection Sort sử dụng phương pháp đệ quy thay vì vòng lặp.

---

*Post ID: j1y86vlsmjs4n4j*  
*Category: Sorting Algorithms*  
*Created: 21/8/2025*  
*Updated: 29/8/2025*
