---
title: "Sắp Xếp Chèn (Insertion Sort)"
postId: "uyuddky4z81r1sv"
category: "Sorting Algorithms"
created: "21/8/2025"
updated: "29/8/2025"
---

# Sắp Xếp Chèn (Insertion Sort)


Sắp xếp chèn (Insertion Sort) là một thuật toán sắp xếp đơn giản xây dựng mảng đã sắp xếp cuối cùng (hoặc danh sách) từng phần tử một. Nó kém hiệu quả hơn nhiều trên các danh sách lớn so với các thuật toán tiên tiến hơn như quicksort, heapsort, hoặc merge sort. Tuy nhiên, Insertion Sort có những ưu điểm quan trọng như tính ổn định, hoạt động tại chỗ, và hiệu quả với dữ liệu nhỏ hoặc gần như đã được sắp xếp.

![Minh họa thuật toán](https://upload.wikimedia.org/wikipedia/commons/4/42/Insertion_sort.gif)

![Minh họa thuật toán](https://upload.wikimedia.org/wikipedia/commons/0/0f/Insertion-sort-example-300px.gif)

## Giải Thích Chi Tiết

### Cách Hoạt Động

Thuật toán Insertion Sort hoạt động tương tự như cách chúng ta sắp xếp bài trong tay:

1. **Bắt đầu từ phần tử thứ hai**: Phần tử đầu tiên được coi là đã sắp xếp.
2. **Lấy phần tử tiếp theo**: So sánh với các phần tử đã sắp xếp.
3. **Tìm vị trí chèn**: Dịch chuyển các phần tử lớn hơn về phía sau.
4. **Chèn phần tử**: Đặt phần tử vào vị trí đúng.
5. **Lặp lại**: Tiếp tục với phần tử tiếp theo cho đến hết mảng.

### Ví Dụ Minh Họa Chi Tiết

Giả sử chúng ta có mảng: `[5, 2, 4, 6, 1, 3]`

**Bước 1:** Phần tử đầu tiên `5` được coi là đã sắp xếp
- Mảng: `[5, 2, 4, 6, 1, 3]`
- Phần đã sắp xếp: `[5]`
- Phần chưa sắp xếp: `[2, 4, 6, 1, 3]`

**Bước 2:** Chèn `2` vào vị trí đúng
- Lấy phần tử `2`
- So sánh với `5`: `2 < 5`, nên chèn `2` trước `5`
- Kết quả: `[2, 5, 4, 6, 1, 3]`
- Phần đã sắp xếp: `[2, 5]`

**Bước 3:** Chèn `4` vào vị trí đúng
- Lấy phần tử `4`
- So sánh với `5`: `4 < 5`, dịch `5` sang phải
- So sánh với `2`: `4 > 2`, chèn `4` sau `2`
- Kết quả: `[2, 4, 5, 6, 1, 3]`
- Phần đã sắp xếp: `[2, 4, 5]`

**Bước 4:** Chèn `6` vào vị trí đúng
- Lấy phần tử `6`
- So sánh với `5`: `6 > 5`, `6` đã ở vị trí đúng
- Kết quả: `[2, 4, 5, 6, 1, 3]`
- Phần đã sắp xếp: `[2, 4, 5, 6]`

**Bước 5:** Chèn `1` vào vị trí đúng
- Lấy phần tử `1`
- So sánh với `6`: `1 < 6`, dịch `6` sang phải
- So sánh với `5`: `1 < 5`, dịch `5` sang phải
- So sánh với `4`: `1 < 4`, dịch `4` sang phải
- So sánh với `2`: `1 < 2`, dịch `2` sang phải
- Chèn `1` vào đầu mảng
- Kết quả: `[1, 2, 4, 5, 6, 3]`
- Phần đã sắp xếp: `[1, 2, 4, 5, 6]`

**Bước 6:** Chèn `3` vào vị trí đúng
- Lấy phần tử `3`
- So sánh với `6`: `3 < 6`, dịch `6` sang phải
- So sánh với `5`: `3 < 5`, dịch `5` sang phải
- So sánh với `4`: `3 < 4`, dịch `4` sang phải
- So sánh với `2`: `3 > 2`, chèn `3` sau `2`
- Kết quả cuối cùng: `[1, 2, 3, 4, 5, 6]`

## Cài Đặt Trong JavaScript

### Cài Đặt Cơ Bản

```javascript
function insertionSort(mang) {
    // Duyệt từ phần tử thứ hai đến cuối mảng
    for (let i = 1; i < mang.length; i++) {
        let phanTuHienTai = mang[i];
        let viTri = i;
        
        // Dịch chuyển các phần tử lớn hơn về phía sau
        while (viTri > 0 && mang[viTri - 1] > phanTuHienTai) {
            mang[viTri] = mang[viTri - 1];
            viTri--;
        }
        
        // Chèn phần tử vào vị trí đúng
        mang[viTri] = phanTuHienTai;
    }
    
    return mang;
}

// Ví dụ sử dụng
const danhSachSo = [5, 2, 4, 6, 1, 3];
console.log('Mảng gốc:', danhSachSo);
console.log('Mảng đã sắp xếp:', insertionSort([...danhSachSo]));
```

### Cài Đặt Với Theo Dõi Quá Trình

```javascript
function insertionSortCoTheoDoi(mang) {
    console.log(`Bắt đầu sắp xếp mảng: [${mang.join(', ')}]`);
    console.log('=====================================');
    
    for (let i = 1; i < mang.length; i++) {
        let phanTuHienTai = mang[i];
        let viTri = i;
        
        console.log(`\nBước ${i}: Chèn phần tử ${phanTuHienTai}`);
        console.log(`Phần đã sắp xếp: [${mang.slice(0, i).join(', ')}]`);
        console.log(`Phần tử cần chèn: ${phanTuHienTai}`);
        
        // Tìm vị trí chèn và dịch chuyển
        while (viTri > 0 && mang[viTri - 1] > phanTuHienTai) {
            console.log(`  So sánh: ${phanTuHienTai} < ${mang[viTri - 1]} -> Dịch chuyển ${mang[viTri - 1]} sang phải`);
            mang[viTri] = mang[viTri - 1];
            viTri--;
        }
        
        // Chèn phần tử
        mang[viTri] = phanTuHienTai;
        console.log(`  Chèn ${phanTuHienTai} vào vị trí ${viTri}`);
        console.log(`Kết quả: [${mang.join(', ')}]`);
    }
    
    console.log(`\nKết quả cuối cùng: [${mang.join(', ')}]`);
    return mang;
}
```

### Cài Đặt Class (Theo Mẫu Dự Án)

```javascript
import Sort from '../Sort';

export default class InsertionSort extends Sort {
    sort(mangGoc) {
        const mang = [...mangGoc];

        // Duyệt qua tất cả các phần tử của mảng...
        for (let i = 1; i < mang.length; i += 1) {
            let chiSoHienTai = i;

            // Gọi callback để theo dõi việc truy cập phần tử
            this.callbacks.visitingCallback(mang[i]);

            // Kiểm tra xem phần tử trước có lớn hơn phần tử hiện tại không.
            // Nếu có, hoán đổi hai phần tử.
            while (
                mang[chiSoHienTai - 1] !== undefined
                && this.comparator.lessThan(mang[chiSoHienTai], mang[chiSoHienTai - 1])
            ) {
                // Gọi callback để theo dõi việc truy cập phần tử
                this.callbacks.visitingCallback(mang[chiSoHienTai - 1]);

                // Hoán đổi các phần tử
                [
                    mang[chiSoHienTai - 1],
                    mang[chiSoHienTai],
                ] = [
                    mang[chiSoHienTai],
                    mang[chiSoHienTai - 1],
                ];

                // Dịch chỉ số hiện tại sang trái
                chiSoHienTai -= 1;
            }
        }

        return mang;
    }
}
```

### Cài Đặt Tối Ưu Với Binary Search

```javascript
function insertionSortBinary(mang) {
    for (let i = 1; i < mang.length; i++) {
        let phanTuHienTai = mang[i];
        
        // Sử dụng binary search để tìm vị trí chèn
        let viTriChen = timViTriChenBinary(mang, 0, i, phanTuHienTai);
        
        // Dịch chuyển các phần tử
        for (let j = i; j > viTriChen; j--) {
            mang[j] = mang[j - 1];
        }
        
        // Chèn phần tử
        mang[viTriChen] = phanTuHienTai;
    }
    
    return mang;
}

function timViTriChenBinary(mang, trai, phai, giaTri) {
    while (trai < phai) {
        let giua = Math.floor((trai + phai) / 2);
        
        if (mang[giua] > giaTri) {
            phai = giua;
        } else {
            trai = giua + 1;
        }
    }
    
    return trai;
}
```

### Cài Đặt Cho Sắp Xếp Giảm Dần

```javascript
function insertionSortGiamDan(mang) {
    for (let i = 1; i < mang.length; i++) {
        let phanTuHienTai = mang[i];
        let viTri = i;
        
        // Tìm vị trí chèn (sắp xếp giảm dần)
        while (viTri > 0 && mang[viTri - 1] < phanTuHienTai) {
            mang[viTri] = mang[viTri - 1];
            viTri--;
        }
        
        mang[viTri] = phanTuHienTai;
    }
    
    return mang;
}
```

## Ứng Dụng Thực Tế

### 1. Hệ Thống Sắp Xếp Bảng Điểm Theo Thời Gian Thực

```javascript
class BangDiemTheoThoiGianThuc {
    constructor() {
        this.danhSachDiem = [];
        this.lichSuThaoTac = [];
    }
    
    themDiem(hoTen, monHoc, diem, thoiGian = new Date()) {
        const diemMoi = {
            hoTen,
            monHoc,
            diem,
            thoiGian,
            id: Date.now() + Math.random()
        };
        
        // Sử dụng insertion sort để chèn điểm vào đúng vị trí (sắp xếp theo điểm giảm dần)
        this.chenDiemBangInsertionSort(diemMoi);
        this.ghiLichSuThaoTac('THÊM', diemMoi);
        
        return diemMoi;
    }
    
    chenDiemBangInsertionSort(diemMoi) {
        console.log(`\nChèn điểm mới: ${diemMoi.hoTen} - ${diemMoi.monHoc}: ${diemMoi.diem}`);
        
        // Thêm vào cuối mảng
        this.danhSachDiem.push(diemMoi);
        let viTri = this.danhSachDiem.length - 1;
        
        console.log(`Vị trí ban đầu: ${viTri}`);
        
        // Sử dụng insertion sort để di chuyển về vị trí đúng
        while (viTri > 0 && this.soSanhDiem(this.danhSachDiem[viTri], this.danhSachDiem[viTri - 1]) > 0) {
            console.log(`  So sánh: ${this.danhSachDiem[viTri].diem} vs ${this.danhSachDiem[viTri - 1].diem}`);
            console.log(`  Hoán đổi: ${this.danhSachDiem[viTri].hoTen} <-> ${this.danhSachDiem[viTri - 1].hoTen}`);
            
            // Hoán đổi
            [this.danhSachDiem[viTri], this.danhSachDiem[viTri - 1]] = 
            [this.danhSachDiem[viTri - 1], this.danhSachDiem[viTri]];
            
            viTri--;
        }
        
        console.log(`Vị trí cuối cùng: ${viTri}`);
        console.log('Bảng điểm sau khi cập nhật:');
        this.inBangDiem();
    }
    
    soSanhDiem(diem1, diem2) {
        // Sắp xếp theo điểm giảm dần, nếu bằng nhau thì theo thời gian mới nhất
        if (diem1.diem !== diem2.diem) {
            return diem1.diem - diem2.diem;
        }
        return diem2.thoiGian - diem1.thoiGian;
    }
    
    capNhatDiem(id, diemMoi) {
        const viTri = this.danhSachDiem.findIndex(d => d.id === id);
        if (viTri === -1) return null;
        
        const diemCu = this.danhSachDiem[viTri].diem;
        this.danhSachDiem[viTri].diem = diemMoi;
        this.danhSachDiem[viTri].thoiGian = new Date();
        
        console.log(`\nCập nhật điểm: ${this.danhSachDiem[viTri].hoTen} từ ${diemCu} thành ${diemMoi}`);
        
        // Sắp xếp lại bằng insertion sort
        this.sapXepLaiBangInsertionSort();
        this.ghiLichSuThaoTac('CẬP NHẬT', this.danhSachDiem[viTri]);
        
        return this.danhSachDiem[viTri];
    }
    
    sapXepLaiBangInsertionSort() {
        console.log('Sắp xếp lại toàn bộ bảng điểm...');
        
        for (let i = 1; i < this.danhSachDiem.length; i++) {
            let phanTuHienTai = this.danhSachDiem[i];
            let viTri = i;
            
            while (viTri > 0 && this.soSanhDiem(phanTuHienTai, this.danhSachDiem[viTri - 1]) > 0) {
                this.danhSachDiem[viTri] = this.danhSachDiem[viTri - 1];
                viTri--;
            }
            
            this.danhSachDiem[viTri] = phanTuHienTai;
        }
        
        console.log('Hoàn thành sắp xếp!');
    }
    
    inBangDiem() {
        console.log('\nBẢNG ĐIỂM HIỆN TẠI');
        console.log('===================');
        
        this.danhSachDiem.forEach((diem, index) => {
            const xepHang = index + 1;
            const huyChương = xepHang <= 3 ? this.layHuyChương(xepHang) : '';
            
            console.log(`${xepHang}. ${huyChương} ${diem.hoTen}`);
            console.log(`   Môn: ${diem.monHoc}`);
            console.log(`   Điểm: ${diem.diem}`);
            console.log(`   Thời gian: ${diem.thoiGian.toLocaleString('vi-VN')}`);
            console.log('   ----------------');
        });
    }
    
    layHuyChương(hang) {
        const huyChương = { 1: '🥇', 2: '🥈', 3: '🥉' };
        return huyChương[hang] || '';
    }
    
    ghiLichSuThaoTac(loai, diem) {
        this.lichSuThaoTac.push({
            loai,
            diem: { ...diem },
            thoiGian: new Date()
        });
    }
    
    inLichSuThaoTac() {
        console.log('\nLỊCH SỬ THAO TÁC');
        console.log('=================');
        
        this.lichSuThaoTac.slice(-10).forEach((thaoTac, index) => {
            console.log(`${index + 1}. ${thaoTac.loai}: ${thaoTac.diem.hoTen} - ${thaoTac.diem.diem} điểm`);
            console.log(`   Thời gian: ${thaoTac.thoiGian.toLocaleString('vi-VN')}`);
        });
    }
}

// Sử dụng hệ thống
const bangDiem = new BangDiemTheoThoiGianThuc();

// Thêm điểm theo thời gian thực
bangDiem.themDiem('Nguyễn Văn An', 'Toán', 8.5);
bangDiem.themDiem('Trần Thị Bình', 'Toán', 9.2);
bangDiem.themDiem('Lê Minh Cường', 'Toán', 7.8);
bangDiem.themDiem('Phạm Thị Dung', 'Toán', 9.0);
bangDiem.themDiem('Hoàng Văn Em', 'Toán', 8.1);

// Cập nhật điểm
const diemAn = bangDiem.danhSachDiem.find(d => d.hoTen === 'Nguyễn Văn An');
bangDiem.capNhatDiem(diemAn.id, 9.5);

bangDiem.inLichSuThaoTac();
```

### 2. Hệ Thống Sắp Xếp Danh Sách Phát Nhạc

```javascript
class DanhSachPhatNhac {
    constructor() {
        this.danhSachBaiHat = [];
        this.lichSuPhat = [];
    }
    
    themBaiHat(tenBaiHat, caSi, album, doDai, danhGia = 0) {
        const baiHat = {
            tenBaiHat,
            caSi,
            album,
            doDai, // giây
            danhGia, // từ 0-5 sao
            soLanPhat: 0,
            thoiGianThem: new Date(),
            id: Date.now() + Math.random()
        };
        
        // Chèn bài hát mới theo thứ tự ưu tiên (đánh giá cao -> ít phát -> mới thêm)
        this.chenBaiHatBangInsertionSort(baiHat);
        
        console.log(`✅ Đã thêm: "${tenBaiHat}" - ${caSi}`);
        return baiHat;
    }
    
    chenBaiHatBangInsertionSort(baiHatMoi) {
        // Thêm vào cuối danh sách
        this.danhSachBaiHat.push(baiHatMoi);
        let viTri = this.danhSachBaiHat.length - 1;
        
        console.log(`\nChèn bài hát: "${baiHatMoi.tenBaiHat}"`);
        console.log(`Đánh giá: ${baiHatMoi.danhGia} sao, Số lần phát: ${baiHatMoi.soLanPhat}`);
        
        // Sử dụng insertion sort để tìm vị trí đúng
        while (viTri > 0 && this.soSanhUuTien(this.danhSachBaiHat[viTri], this.danhSachBaiHat[viTri - 1]) > 0) {
            console.log(`  So sánh với: "${this.danhSachBaiHat[viTri - 1].tenBaiHat}"`);
            console.log(`    Ưu tiên cao hơn -> Di chuyển lên`);
            
            // Hoán đổi
            [this.danhSachBaiHat[viTri], this.danhSachBaiHat[viTri - 1]] = 
            [this.danhSachBaiHat[viTri - 1], this.danhSachBaiHat[viTri]];
            
            viTri--;
        }
        
        console.log(`Vị trí cuối cùng trong danh sách: ${viTri + 1}`);
    }
    
    soSanhUuTien(baiHat1, baiHat2) {
        // Tiêu chí ưu tiên: Đánh giá cao > Ít phát > Mới thêm
        if (baiHat1.danhGia !== baiHat2.danhGia) {
            return baiHat1.danhGia - baiHat2.danhGia;
        }
        
        if (baiHat1.soLanPhat !== baiHat2.soLanPhat) {
            return baiHat2.soLanPhat - baiHat1.soLanPhat; // Ít phát hơn = ưu tiên cao hơn
        }
        
        return baiHat1.thoiGianThem - baiHat2.thoiGianThem; // Mới hơn = ưu tiên cao hơn
    }
    
    phatBaiHat(id) {
        const baiHat = this.danhSachBaiHat.find(b => b.id === id);
        if (!baiHat) return null;
        
        baiHat.soLanPhat++;
        
        console.log(`🎵 Đang phát: "${baiHat.tenBaiHat}" - ${baiHat.caSi}`);
        console.log(`   Số lần phát: ${baiHat.soLanPhat}`);
        
        // Ghi lịch sử
        this.lichSuPhat.push({
            baiHat: { ...baiHat },
            thoiGian: new Date()
        });
        
        // Sắp xếp lại danh sách vì số lần phát đã thay đổi
        this.sapXepLaiDanhSach();
        
        return baiHat;
    }
    
    danhGiaBaiHat(id, sao) {
        const baiHat = this.danhSachBaiHat.find(b => b.id === id);
        if (!baiHat || sao < 0 || sao > 5) return null;
        
        const danhGiaCu = baiHat.danhGia;
        baiHat.danhGia = sao;
        
        console.log(`⭐ Đánh giá "${baiHat.tenBaiHat}": ${danhGiaCu} -> ${sao} sao`);
        
        // Sắp xếp lại vì đánh giá đã thay đổi
        this.sapXepLaiDanhSach();
        
        return baiHat;
    }
    
    sapXepLaiDanhSach() {
        // Sử dụng insertion sort để sắp xếp lại
        for (let i = 1; i < this.danhSachBaiHat.length; i++) {
            let baiHatHienTai = this.danhSachBaiHat[i];
            let viTri = i;
            
            while (viTri > 0 && this.soSanhUuTien(baiHatHienTai, this.danhSachBaiHat[viTri - 1]) > 0) {
                this.danhSachBaiHat[viTri] = this.danhSachBaiHat[viTri - 1];
                viTri--;
            }
            
            this.danhSachBaiHat[viTri] = baiHatHienTai;
        }
    }
    
    inDanhSachPhat() {
        console.log('\n🎼 DANH SÁCH PHÁT (Theo Thứ Tự Ưu Tiên)');
        console.log('==========================================');
        
        this.danhSachBaiHat.forEach((baiHat, index) => {
            const sao = '⭐'.repeat(baiHat.danhGia) + '☆'.repeat(5 - baiHat.danhGia);
            const doDaiPhut = Math.floor(baiHat.doDai / 60);
            const doDaiGiay = baiHat.doDai % 60;
            
            console.log(`${index + 1}. 🎵 "${baiHat.tenBaiHat}"`);
            console.log(`   👤 Ca sĩ: ${baiHat.caSi}`);
            console.log(`   💿 Album: ${baiHat.album}`);
            console.log(`   ⏱️ Thời lượng: ${doDaiPhut}:${doDaiGiay.toString().padStart(2, '0')}`);
            console.log(`   ${sao} (${baiHat.danhGia}/5)`);
            console.log(`   🔄 Đã phát: ${baiHat.soLanPhat} lần`);
            console.log('   --------------------------------');
        });
    }
    
    taoPlaylistTheoTheLoai(theLoai, soLuong = 10) {
        const playlist = this.danhSachBaiHat
            .filter(bh => bh.album.toLowerCase().includes(theLoai.toLowerCase()) || 
                         bh.caSi.toLowerCase().includes(theLoai.toLowerCase()))
            .slice(0, soLuong);
        
        console.log(`\n📋 PLAYLIST "${theLoai.toUpperCase()}" (${playlist.length} bài)`);
        console.log('================================');
        
        playlist.forEach((baiHat, index) => {
            console.log(`${index + 1}. "${baiHat.tenBaiHat}" - ${baiHat.caSi} (${baiHat.danhGia}⭐)`);
        });
        
        return playlist;
    }
    
    inLichSuPhat(soLuong = 5) {
        console.log(`\n📊 LỊCH SỬ PHÁT GẦN ĐÂY (${soLuong} bài cuối)`);
        console.log('=================================');
        
        this.lichSuPhat.slice(-soLuong).reverse().forEach((lichSu, index) => {
            console.log(`${index + 1}. "${lichSu.baiHat.tenBaiHat}" - ${lichSu.baiHat.caSi}`);
            console.log(`   ⏰ ${lichSu.thoiGian.toLocaleString('vi-VN')}`);
        });
    }
}

// Sử dụng hệ thống
const spotify = new DanhSachPhatNhac();

// Thêm bài hát
const baiHat1 = spotify.themBaiHat('Nơi này có anh', 'Sơn Tùng M-TP', 'Single', 320, 4);
const baiHat2 = spotify.themBaiHat('Lạc trôi', 'Sơn Tùng M-TP', 'm-tp M-TP', 285, 5);
const baiHat3 = spotify.themBaiHat('Chúng ta không thuộc về nhau', 'Sơn Tùng M-TP', 'Single', 295, 3);
const baiHat4 = spotify.themBaiHat('Em gì ơi', 'Jack & K-ICM', 'Single', 240, 4);
const baiHat5 = spotify.themBaiHat('Bạc phận', 'Jack & K-ICM', 'Single', 275, 5);

spotify.inDanhSachPhat();

// Phát một số bài hát
spotify.phatBaiHat(baiHat3.id);
spotify.phatBaiHat(baiHat3.id);
spotify.phatBaiHat(baiHat1.id);

// Đánh giá lại
spotify.danhGiaBaiHat(baiHat3.id, 5);

console.log('\n📱 DANH SÁCH SAU KHI CẬP NHẬT:');
spotify.inDanhSachPhat();
spotify.inLichSuPhat();
```

### 3. Hệ Thống Quản Lý Hàng Đợi Ưu Tiên Bệnh Viện

```javascript
class HangDoiBenhVien {
    constructor() {
        this.danhSachBenhNhan = [];
        this.lichSuKham = [];
        this.soThuTu = 1;
    }
    
    dangKyKham(hoTen, tuoi, trieuChung, mucDoKhan, baoHiem = true) {
        const benhNhan = {
            id: this.soThuTu++,
            hoTen,
            tuoi,
            trieuChung,
            mucDoKhan, // 1: Khám thường, 2: Ưu tiên, 3: Cấp cứu, 4: Nguy kịch
            baoHiem,
            thoiGianDangKy: new Date(),
            thoiGianChoKham: null,
            trangThai: 'CHỜ KHÁM'
        };
        
        // Sử dụng insertion sort để chèn bệnh nhân vào đúng vị trí ưu tiên
        this.chenBenhNhanBangInsertionSort(benhNhan);
        
        console.log(`📋 Đã đăng ký: ${hoTen} - ${this.layTenMucDoKhan(mucDoKhan)}`);
        return benhNhan;
    }
    
    chenBenhNhanBangInsertionSort(benhNhanMoi) {
        // Thêm vào cuối hàng đợi
        this.danhSachBenhNhan.push(benhNhanMoi);
        let viTri = this.danhSachBenhNhan.length - 1;
        
        console.log(`\n🚑 Sắp xếp ưu tiên cho: ${benhNhanMoi.hoTen}`);
        console.log(`   Mức độ: ${this.layTenMucDoKhan(benhNhanMoi.mucDoKhan)}`);
        console.log(`   Tuổi: ${benhNhanMoi.tuoi}, Bảo hiểm: ${benhNhanMoi.baoHiem ? 'Có' : 'Không'}`);
        
        // Insertion sort để tìm vị trí ưu tiên đúng
        while (viTri > 0 && this.soSanhUuTien(this.danhSachBenhNhan[viTri], this.danhSachBenhNhan[viTri - 1]) > 0) {
            const benhNhanTruoc = this.danhSachBenhNhan[viTri - 1];
            
            console.log(`   So sánh với: ${benhNhanTruoc.hoTen} (${this.layTenMucDoKhan(benhNhanTruoc.mucDoKhan)})`);
            console.log(`   -> Ưu tiên cao hơn, di chuyển lên trước`);
            
            // Hoán đổi vị trí
            [this.danhSachBenhNhan[viTri], this.danhSachBenhNhan[viTri - 1]] = 
            [this.danhSachBenhNhan[viTri - 1], this.danhSachBenhNhan[viTri]];
            
            viTri--;
        }
        
        console.log(`   Vị trí cuối cùng trong hàng đợi: ${viTri + 1}`);
        
        // Cập nhật thời gian chờ khám
        this.capNhatThoiGianChoKham();
    }
    
    soSanhUuTien(bn1, bn2) {
        // Tiêu chí ưu tiên: Mức độ khẩn > Tuổi cao (>60) > Có bảo hiểm > Đến trước
        
        // 1. Mức độ khẩn cấp (cao hơn = ưu tiên hơn)
        if (bn1.mucDoKhan !== bn2.mucDoKhan) {
            return bn1.mucDoKhan - bn2.mucDoKhan;
        }
        
        // 2. Người cao tuổi (>60 tuổi được ưu tiên)
        const bn1CaoTuoi = bn1.tuoi > 60;
        const bn2CaoTuoi = bn2.tuoi > 60;
        if (bn1CaoTuoi !== bn2CaoTuoi) {
            return bn1CaoTuoi ? 1 : -1;
        }
        
        // 3. Có bảo hiểm y tế
        if (bn1.baoHiem !== bn2.baoHiem) {
            return bn1.baoHiem ? 1 : -1;
        }
        
        // 4. Thời gian đăng ký (đến trước được ưu tiên)
        return bn2.thoiGianDangKy - bn1.thoiGianDangKy;
    }
    
    capNhatThoiGianChoKham() {
        // Ước tính thời gian chờ khám (15 phút/bệnh nhân)
        let thoiGianTichLuy = new Date();
        
        this.danhSachBenhNhan.forEach((bn, index) => {
            if (bn.trangThai === 'CHỜ KHÁM') {
                thoiGianTichLuy = new Date(thoiGianTichLuy.getTime() + 15 * 60000); // +15 phút
                bn.thoiGianChoKham = new Date(thoiGianTichLuy);
            }
        });
    }
    
    goiBenhNhanTiepTheo() {
        if (this.danhSachBenhNhan.length === 0) {
            console.log('📭 Hàng đợi trống');
            return null;
        }
        
        const benhNhanTiepTheo = this.danhSachBenhNhan.shift();
        benhNhanTiepTheo.trangThai = 'ĐANG KHÁM';
        benhNhanTiepTheo.thoiGianBatDauKham = new Date();
        
        console.log(`🩺 Mời bệnh nhân: ${benhNhanTiepTheo.hoTen} (${benhNhanTiepTheo.id})`);
        console.log(`   Triệu chứng: ${benhNhanTiepTheo.trieuChung}`);
        console.log(`   Mức độ: ${this.layTenMucDoKhan(benhNhanTiepTheo.mucDoKhan)}`);
        
        // Cập nhật lại thời gian chờ cho những người còn lại
        this.capNhatThoiGianChoKham();
        
        return benhNhanTiepTheo;
    }
    
    hoanThanhKham(benhNhan, chuanDoan, thuoc, phiKham) {
        benhNhan.trangThai = 'ĐÃ KHÁM';
        benhNhan.thoiGianKetThucKham = new Date();
        benhNhan.chuanDoan = chuanDoan;
        benhNhan.thuoc = thuoc;
        benhNhan.phiKham = phiKham;
        
        // Lưu vào lịch sử
        this.lichSuKham.push({ ...benhNhan });
        
        console.log(`✅ Hoàn thành khám: ${benhNhan.hoTen}`);
        console.log(`   Chẩn đoán: ${chuanDoan}`);
        console.log(`   Phí khám: ${phiKham.toLocaleString('vi-VN')} VNĐ`);
        
        return benhNhan;
    }
    
    themTinhHuongCapCuu(hoTen, tuoi, trieuChung) {
        // Trường hợp cấp cứu - mức độ 4 (cao nhất)
        const benhNhanCapCuu = this.dangKyKham(hoTen, tuoi, trieuChung, 4, true);
        
        console.log(`🚨 TÌNH HUỐNG CẤP CỨU: ${hoTen}`);
        console.log('🚑 Đã được ưu tiên lên đầu hàng đợi');
        
        return benhNhanCapCuu;
    }
    
    inHangDoi() {
        console.log('\n🏥 HÀNG ĐỢI KHÁM BỆNH');
        console.log('======================');
        
        if (this.danhSachBenhNhan.length === 0) {
            console.log('📭 Hàng đợi trống');
            return;
        }
        
        this.danhSachBenhNhan.forEach((bn, index) => {
            const icon = this.layIconMucDoKhan(bn.mucDoKhan);
            const thoiGianCho = bn.thoiGianChoKham ? 
                `(~${bn.thoiGianChoKham.toLocaleTimeString('vi-VN')})` : '';
            
            console.log(`${index + 1}. ${icon} ${bn.hoTen} (${bn.id})`);
            console.log(`   Tuổi: ${bn.tuoi}, Bảo hiểm: ${bn.baoHiem ? '✅' : '❌'}`);
            console.log(`   Triệu chứng: ${bn.trieuChung}`);
            console.log(`   Mức độ: ${this.layTenMucDoKhan(bn.mucDoKhan)}`);
            console.log(`   Đăng ký: ${bn.thoiGianDangKy.toLocaleTimeString('vi-VN')}`);
            console.log(`   Dự kiến khám: ${thoiGianCho}`);
            console.log('   -------------------------');
        });
    }
    
    layTenMucDoKhan(mucDo) {
        const tenMucDo = {
            1: 'Khám thường',
            2: 'Ưu tiên',
            3: 'Cấp cứu',
            4: 'Nguy kịch'
        };
        return tenMucDo[mucDo] || 'Không xác định';
    }
    
    layIconMucDoKhan(mucDo) {
        const icons = {
            1: '🟢',
            2: '🟡',
            3: '🟠',
            4: '🔴'
        };
        return icons[mucDo] || '⚪';
    }
    
    thongKeHangDoi() {
        const thongKe = {
            tongSo: this.danhSachBenhNhan.length,
            khamThuong: 0,
            uuTien: 0,
            capCuu: 0,
            nguyKich: 0,
            coBaoHiem: 0,
            tuoiCao: 0
        };
        
        this.danhSachBenhNhan.forEach(bn => {
            switch (bn.mucDoKhan) {
                case 1: thongKe.khamThuong++; break;
                case 2: thongKe.uuTien++; break;
                case 3: thongKe.capCuu++; break;
                case 4: thongKe.nguyKich++; break;
            }
            
            if (bn.baoHiem) thongKe.coBaoHiem++;
            if (bn.tuoi > 60) thongKe.tuoiCao++;
        });
        
        console.log('\n📊 THỐNG KÊ HÀNG ĐỢI');
        console.log('====================');
        console.log(`Tổng số bệnh nhân: ${thongKe.tongSo}`);
        console.log(`🔴 Nguy kịch: ${thongKe.nguyKich}`);
        console.log(`🟠 Cấp cứu: ${thongKe.capCuu}`);
        console.log(`🟡 Ưu tiên: ${thongKe.uuTien}`);
        console.log(`🟢 Khám thường: ${thongKe.khamThuong}`);
        console.log(`👥 Có bảo hiểm: ${thongKe.coBaoHiem}/${thongKe.tongSo}`);
        console.log(`👴 Người cao tuổi: ${thongKe.tuoiCao}/${thongKe.tongSo}`);
        
        return thongKe;
    }
}

// Sử dụng hệ thống
const benhVien = new HangDoiBenhVien();

// Đăng ký bệnh nhân thường
benhVien.dangKyKham('Nguyễn Văn An', 35, 'Đau đầu nhẹ', 1, true);
benhVien.dangKyKham('Trần Thị Bình', 67, 'Khó thở', 2, true);
benhVien.dangKyKham('Lê Minh Cường', 28, 'Đau bụng', 1, false);
benhVien.dangKyKham('Phạm Thị Dung', 72, 'Tim đập nhanh', 3, true);

// Tình huống cấp cứu
benhVien.themTinhHuongCapCuu('Hoàng Văn Em', 45, 'Tai nạn giao thông');

benhVien.inHangDoi();
benhVien.thongKeHangDoi();

// Bắt đầu khám
console.log('\n🩺 BẮT ĐẦU KHÁM BỆNH');
console.log('====================');

const bn1 = benhVien.goiBenhNhanTiepTheo();
benhVien.hoanThanhKham(bn1, 'Chấn thương đa vị trí', 'Thuốc giảm đau, kháng sinh', 500000);

const bn2 = benhVien.goiBenhNhanTiepTheo();
benhVien.hoanThanhKham(bn2, 'Rối loạn nhịp tim', 'Thuốc điều hòa nhịp tim', 300000);

console.log('\n📋 HÀNG ĐỢI SAU KHI KHÁM:');
benhVien.inHangDoi();
```

## Phân Tích Hiệu Suất

### So Sánh Insertion Sort Với Các Thuật Toán Khác

```javascript
class PhanTichHieuSuatInsertionSort {
    static demThaoTacInsertionSort(mang) {
        let soLanSoSanh = 0;
        let soLanDichChuyen = 0;
        const mangSaoChep = [...mang];
        
        for (let i = 1; i < mangSaoChep.length; i++) {
            let phanTuHienTai = mangSaoChep[i];
            let viTri = i;
            
            while (viTri > 0 && mangSaoChep[viTri - 1] > phanTuHienTai) {
                soLanSoSanh++;
                mangSaoChep[viTri] = mangSaoChep[viTri - 1];
                soLanDichChuyen++;
                viTri--;
            }
            
            if (viTri > 0) soLanSoSanh++; // So sánh cuối cùng để dừng while
            mangSaoChep[viTri] = phanTuHienTai;
        }
        
        return { soLanSoSanh, soLanDichChuyen, ketQua: mangSaoChep };
    }
    
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
    
    static soSanhTatCaThuatToan() {
        const testCases = [
            { ten: 'Mảng đã sắp xếp', mang: [1, 2, 3, 4, 5, 6, 7, 8] },
            { ten: 'Mảng ngược hoàn toàn', mang: [8, 7, 6, 5, 4, 3, 2, 1] },
            { ten: 'Mảng ngẫu nhiên', mang: [5, 2, 8, 1, 9, 3, 7, 4] },
            { ten: 'Mảng gần như đã sắp xếp', mang: [1, 2, 3, 5, 4, 6, 7, 8] },
            { ten: 'Mảng có nhiều phần tử trùng', mang: [3, 1, 3, 1, 3, 1, 3] }
        ];
        
        console.log('SO SÁNH HIỆU SUẤT: INSERTION vs SELECTION vs BUBBLE SORT');
        console.log('========================================================');
        
        testCases.forEach(testCase => {
            console.log(`\n📊 Trường hợp: ${testCase.ten}`);
            console.log(`Mảng gốc: [${testCase.mang.join(', ')}]`);
            console.log(''.padEnd(60, '-'));
            
            const ketQuaInsertion = this.demThaoTacInsertionSort(testCase.mang);
            const ketQuaSelection = this.demThaoTacSelectionSort(testCase.mang);
            const ketQuaBubble = this.demThaoTacBubbleSort(testCase.mang);
            
            console.log('🔵 INSERTION SORT:');
            console.log(`   So sánh: ${ketQuaInsertion.soLanSoSanh}`);
            console.log(`   Dịch chuyển: ${ketQuaInsertion.soLanDichChuyen}`);
            console.log(`   Tổng thao tác: ${ketQuaInsertion.soLanSoSanh + ketQuaInsertion.soLanDichChuyen}`);
            
            console.log('🟡 SELECTION SORT:');
            console.log(`   So sánh: ${ketQuaSelection.soLanSoSanh}`);
            console.log(`   Hoán đổi: ${ketQuaSelection.soLanHoanDoi}`);
            console.log(`   Tổng thao tác: ${ketQuaSelection.soLanSoSanh + ketQuaSelection.soLanHoanDoi}`);
            
            console.log('🟠 BUBBLE SORT:');
            console.log(`   So sánh: ${ketQuaBubble.soLanSoSanh}`);
            console.log(`   Hoán đổi: ${ketQuaBubble.soLanHoanDoi}`);
            console.log(`   Tổng thao tác: ${ketQuaBubble.soLanSoSanh + ketQuaBubble.soLanHoanDoi}`);
            
            // Phân tích
            console.log('📈 PHÂN TÍCH:');
            const thuatToanToiUu = this.timThuatToanToiUu([
                { ten: 'Insertion', tong: ketQuaInsertion.soLanSoSanh + ketQuaInsertion.soLanDichChuyen },
                { ten: 'Selection', tong: ketQuaSelection.soLanSoSanh + ketQuaSelection.soLanHoanDoi },
                { ten: 'Bubble', tong: ketQuaBubble.soLanSoSanh + ketQuaBubble.soLanHoanDoi }
            ]);
            console.log(`   🏆 Tối ưu nhất: ${thuatToanToiUu.ten} (${thuatToanToiUu.tong} thao tác)`);
            
            // So sánh với mảng đã sắp xếp (trường hợp tốt nhất)
            if (testCase.ten === 'Mảng đã sắp xếp') {
                console.log('   ✨ Insertion Sort rất hiệu quả với mảng đã sắp xếp!');
            }
        });
    }
    
    static timThuatToanToiUu(ketQua) {
        return ketQua.reduce((min, current) => 
            current.tong < min.tong ? current : min
        );
    }
    
    static phanTichDoPHTucTapTheoKichThuoc() {
        console.log('\n📏 PHÂN TÍCH ĐỘ PHỨC TẠP THEO KÍCH THƯỚC MẢNG');
        console.log('===============================================');
        
        const kichThuocMang = [10, 20, 50, 100, 200];
        
        console.log('Kích thước | Insertion | Selection | Bubble | Tỷ lệ I/S | Tỷ lệ I/B');
        console.log(''.padEnd(75, '-'));
        
        kichThuocMang.forEach(n => {
            // Tạo mảng ngẫu nhiên
            const mang = Array.from({ length: n }, () => Math.floor(Math.random() * 100));
            
            const ketQuaInsertion = this.demThaoTacInsertionSort(mang);
            const ketQuaSelection = this.demThaoTacSelectionSort(mang);
            const ketQuaBubble = this.demThaoTacBubbleSort(mang);
            
            const tongInsertion = ketQuaInsertion.soLanSoSanh + ketQuaInsertion.soLanDichChuyen;
            const tongSelection = ketQuaSelection.soLanSoSanh + ketQuaSelection.soLanHoanDoi;
            const tongBubble = ketQuaBubble.soLanSoSanh + ketQuaBubble.soLanHoanDoi;
            
            const tiLeIS = (tongInsertion / tongSelection).toFixed(2);
            const tiLeIB = (tongInsertion / tongBubble).toFixed(2);
            
            console.log(`${n.toString().padStart(10)} | ${tongInsertion.toString().padStart(9)} | ${tongSelection.toString().padStart(9)} | ${tongBubble.toString().padStart(6)} | ${tiLeIS.padStart(9)} | ${tiLeIB.padStart(9)}`);
        });
    }
    
    static kiemTraHieuSuatVoiDuLieuDacBiet() {
        console.log('\n🎯 KIỂM TRA VỚI DỮ LIỆU ĐẶC BIỆT');
        console.log('==================================');
        
        const testCasesDacBiet = [
            {
                ten: 'Mảng có 1 phần tử sai vị trí',
                mang: [1, 2, 3, 4, 8, 5, 6, 7] // 8 sai vị trí
            },
            {
                ten: 'Mảng đảo ngược một phần',
                mang: [1, 2, 7, 6, 5, 4, 3, 8] // giữa bị đảo ngược
            },
            {
                ten: 'Mảng có clustering',
                mang: [1, 2, 3, 8, 9, 10, 4, 5] // 2 cụm đã sắp xếp
            }
        ];
        
        testCasesDacBiet.forEach(testCase => {
            console.log(`\n🔍 ${testCase.ten}:`);
            console.log(`Mảng: [${testCase.mang.join(', ')}]`);
            
            const ketQua = this.demThaoTacInsertionSort(testCase.mang);
            console.log(`Insertion Sort: ${ketQua.soLanSoSanh} so sánh, ${ketQua.soLanDichChuyen} dịch chuyển`);
            
            // Phân tích đặc điểm
            const n = testCase.mang.length;
            const maxSoSanh = (n * (n - 1)) / 2;
            const hieuSuat = ((maxSoSanh - ketQua.soLanSoSanh) / maxSoSanh * 100).toFixed(1);
            console.log(`Hiệu suất: ${hieuSuat}% tốt hơn trường hợp xấu nhất`);
        });
    }
}

// Chạy các phân tích
PhanTichHieuSuatInsertionSort.soSanhTatCaThuatToan();
PhanTichHieuSuatInsertionSort.phanTichDoPHTucTapTheoKichThuoc();
PhanTichHieuSuatInsertionSort.kiemTraHieuSuatVoiDuLieuDacBiet();
```

## Biến Thể và Tối Ưu

### 1. Binary Insertion Sort

```javascript
function binaryInsertionSort(mang) {
    console.log('BINARY INSERTION SORT');
    console.log('======================');
    
    for (let i = 1; i < mang.length; i++) {
        let phanTuHienTai = mang[i];
        
        // Sử dụng binary search để tìm vị trí chèn
        let viTriChen = binarySearch(mang, 0, i, phanTuHienTai);
        
        console.log(`\nBước ${i}: Chèn ${phanTuHienTai}`);
        console.log(`Tìm vị trí chèn bằng binary search: ${viTriChen}`);
        
        // Dịch chuyển các phần tử
        for (let j = i; j > viTriChen; j--) {
            mang[j] = mang[j - 1];
        }
        
        // Chèn phần tử
        mang[viTriChen] = phanTuHienTai;
        
        console.log(`Kết quả: [${mang.join(', ')}]`);
    }
    
    return mang;
}

function binarySearch(mang, trai, phai, giaTri) {
    while (trai < phai) {
        let giua = Math.floor((trai + phai) / 2);
        
        if (mang[giua] > giaTri) {
            phai = giua;
        } else {
            trai = giua + 1;
        }
    }
    
    return trai;
}
```

### 2. Shell Sort (Insertion Sort Với Gap)

```javascript
function shellSort(mang) {
    const n = mang.length;
    
    // Dãy gap (Knuth sequence): 1, 4, 13, 40, 121, ...
    let gap = 1;
    while (gap < n / 3) {
        gap = gap * 3 + 1;
    }
    
    console.log('SHELL SORT (Insertion Sort với Gap)');
    console.log('====================================');
    
    while (gap >= 1) {
        console.log(`\nSắp xếp với gap = ${gap}:`);
        
        // Insertion sort với gap
        for (let i = gap; i < n; i++) {
            let phanTuHienTai = mang[i];
            let j = i;
            
            console.log(`  Chèn ${phanTuHienTai} (vị trí ${i})`);
            
            while (j >= gap && mang[j - gap] > phanTuHienTai) {
                console.log(`    So sánh với ${mang[j - gap]} (cách ${gap} vị trí)`);
                mang[j] = mang[j - gap];
                j -= gap;
            }
            
            mang[j] = phanTuHienTai;
            
            if (j !== i) {
                console.log(`    Chèn vào vị trí ${j}`);
            }
        }
        
        console.log(`  Kết quả với gap ${gap}: [${mang.join(', ')}]`);
        gap = Math.floor(gap / 3);
    }
    
    return mang;
}
```

### 3. Insertion Sort Với Sentinel

```javascript
function insertionSortVoiSentinel(mang) {
    if (mang.length <= 1) return mang;
    
    console.log('INSERTION SORT VỚI SENTINEL');
    console.log('============================');
    
    // Tìm phần tử nhỏ nhất và đặt ở đầu mảng làm sentinel
    let viTriNhoNhat = 0;
    for (let i = 1; i < mang.length; i++) {
        if (mang[i] < mang[viTriNhoNhat]) {
            viTriNhoNhat = i;
        }
    }
    
    if (viTriNhoNhat !== 0) {
        [mang[0], mang[viTriNhoNhat]] = [mang[viTriNhoNhat], mang[0]];
        console.log(`Đặt sentinel ${mang[0]} ở đầu mảng: [${mang.join(', ')}]`);
    }
    
    // Insertion sort không cần kiểm tra boundary
    for (let i = 2; i < mang.length; i++) {
        let phanTuHienTai = mang[i];
        let j = i;
        
        console.log(`\nBước ${i - 1}: Chèn ${phanTuHienTai}`);
        
        // Không cần kiểm tra j > 0 vì có sentinel
        while (mang[j - 1] > phanTuHienTai) {
            mang[j] = mang[j - 1];
            j--;
        }
        
        mang[j] = phanTuHienTai;
        console.log(`Kết quả: [${mang.join(', ')}]`);
    }
    
    return mang;
}
```

### 4. Insertion Sort Đệ Quy

```javascript
function insertionSortDeQuy(mang, n = mang.length) {
    // Base case
    if (n <= 1) return mang;
    
    console.log(`Sắp xếp ${n} phần tử đầu: [${mang.slice(0, n).join(', ')}]`);
    
    // Sắp xếp n-1 phần tử đầu
    insertionSortDeQuy(mang, n - 1);
    
    // Chèn phần tử thứ n vào vị trí đúng
    let phanTuCuoi = mang[n - 1];
    let j = n - 2;
    
    console.log(`Chèn ${phanTuCuoi} vào phần đã sắp xếp`);
    
    while (j >= 0 && mang[j] > phanTuCuoi) {
        mang[j + 1] = mang[j];
        j--;
    }
    
    mang[j + 1] = phanTuCuoi;
    
    console.log(`Kết quả: [${mang.slice(0, n).join(', ')}]`);
    
    return mang;
}
```

## Ưu Điểm và Nhược Điểm

### Ưu Điểm

1. **Đơn giản**: Dễ hiểu và triển khai
2. **Ổn định**: Bảo toàn thứ tự tương đối của các phần tử bằng nhau
3. **In-place**: Chỉ cần O(1) bộ nhớ bổ sung
4. **Adaptive**: Hiệu quả với dữ liệu gần như đã sắp xếp
5. **Online**: Có thể sắp xếp danh sách khi nhận dữ liệu
6. **Hiệu quả với dữ liệu nhỏ**: Tốt hơn nhiều thuật toán phức tạp với mảng nhỏ

### Nhược Điểm

1. **Hiệu suất kém với dữ liệu lớn**: O(n²) trong trường hợp xấu nhất
2. **Nhiều thao tác dịch chuyển**: Có thể chậm với mảng lớn
3. **Không tận dụng được cấu trúc dữ liệu**: Không hiệu quả với mảng ngẫu nhiên lớn

## Độ Phức Tạp

| Trường hợp         | Thời gian       | Không gian | Ổn định | Số lần so sánh | Số lần di chuyển |
| ------------------ | :-------------: | :---------: | :-----: | :------------: | :--------------: |
| **Tốt nhất**       | O(n)           | O(1)        | Có      | n-1            | 0                |
| **Trung bình**     | O(n²)          | O(1)        | Có      | n²/4           | n²/4             |
| **Xấu nhất**       | O(n²)          | O(1)        | Có      | n²/2           | n²/2             |

### Đặc Điểm Quan Trọng

- **Adaptive**: Hiệu suất cải thiện đáng kể với dữ liệu gần như đã sắp xếp
- **Stable**: Bảo toàn thứ tự tương đối của các phần tử có giá trị bằng nhau
- **Online**: Có thể xử lý dữ liệu theo thời gian thực

## Khi Nào Nên Sử Dụng

### Phù Hợp Khi:
- Dữ liệu nhỏ (< 50 phần tử)
- Mảng gần như đã được sắp xếp
- Cần thuật toán ổn định
- Cần sắp xếp online (theo thời gian thực)
- Đơn giản và dễ triển khai là ưu tiên
- Là bước cuối của hybrid sort algorithms

### Không Phù Hợp Khi:
- Dữ liệu lớn và ngẫu nhiên
- Cần hiệu suất cao với dữ liệu lớn
- Bộ nhớ bị hạn chế nghiêm ngặt (ít hơn Selection Sort)

## Tài Liệu Tham Khảo

- [Wikipedia - Insertion Sort](https://vi.wikipedia.org/wiki/S%E1%BA%AFp_x%E1%BA%BFp_ch%C3%A8n)
- [GeeksforGeeks - Insertion Sort](https://www.geeksforgeeks.org/insertion-sort/)
- [Visualgo - Insertion Sort](https://visualgo.net/en/sorting)
- [Khan Academy - Insertion Sort](https://www.khanacademy.org/computing/computer-science/algorithms/insertion-sort/a/insertion-sort)

## Bài Tập Thực Hành

### Bài 1: Insertion Sort Cho Linked List
Cài đặt Insertion Sort cho danh sách liên kết đơn.

### Bài 2: Đếm Số Lần Dịch Chuyển
Tạo phiên bản Insertion Sort đếm và báo cáo số lần dịch chuyển phần tử.

### Bài 3: Insertion Sort Với Khoảng
Cài đặt Insertion Sort chỉ sắp xếp trong một khoảng chỉ định của mảng.

### Bài 4: Tối Ưu Cho Dữ Liệu Gần Sắp Xếp
Viết thuật toán phát hiện mảng gần như đã sắp xếp và tối ưu Insertion Sort.

### Bài 5: Hybrid Sort
Kết hợp Insertion Sort với thuật toán khác (như Quick Sort) để tạo hybrid algorithm hiệu quả.

---

*Post ID: uyuddky4z81r1sv*  
*Category: Sorting Algorithms*  
*Created: 21/8/2025*  
*Updated: 29/8/2025*
