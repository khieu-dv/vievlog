---
title: "Sắp Xếp Trộn (Merge Sort)"
postId: "wjn0v8htv9m9znp"
category: "Sorting Algorithms"
created: "21/8/2025"
updated: "29/8/2025"
---

# Sắp Xếp Trộn (Merge Sort)


Trong khoa học máy tính, Sắp xếp trộn (Merge Sort) là một thuật toán sắp xếp hiệu quả, có mục đích tổng quát, dựa trên so sánh. Hầu hết các cài đặt tạo ra một thuật toán sắp xếp ổn định, có nghĩa là thuật toán bảo toàn thứ tự đầu vào của các phần tử bằng nhau trong kết quả đã sắp xếp. Merge Sort là một thuật toán chia để trị (divide and conquer) được phát minh bởi John von Neumann vào năm 1945.

![Minh họa thuật toán](https://upload.wikimedia.org/wikipedia/commons/c/cc/Merge-sort-example-300px.gif)

Một ví dụ về merge sort đệ quy được sử dụng để sắp xếp một mảng gồm 7 giá trị số nguyên. Đây là các bước mà con người sẽ thực hiện để mô phỏng merge sort (từ trên xuống dưới).

![Minh họa thuật toán](https://upload.wikimedia.org/wikipedia/commons/e/e6/Merge_sort_algorithm_diagram.svg)

## Giải Thích Chi Tiết

### Cách Hoạt Động

Thuật toán Merge Sort hoạt động theo nguyên lý "Chia để trị":

1. **Chia (Divide)**: Chia mảng ban đầu thành hai nửa bằng nhau (hoặc gần bằng nhau).
2. **Trị (Conquer)**: Đệ quy sắp xếp từng nửa một cách riêng biệt.
3. **Kết hợp (Combine)**: Trộn hai nửa đã sắp xếp thành một mảng hoàn chỉnh đã sắp xếp.

### Ví Dụ Minh Họa Chi Tiết

Giả sử chúng ta có mảng: `[38, 27, 43, 3, 9, 82, 10]`

**Giai đoạn Chia:**

```
                [38, 27, 43, 3, 9, 82, 10]
                        /            \
               [38, 27, 43]        [3, 9, 82, 10]
                /      \              /          \
           [38]    [27, 43]      [3, 9]      [82, 10]
            |       /    \        /    \       /     \
          [38]   [27]   [43]   [3]   [9]   [82]   [10]
```

**Giai đoạn Trộn:**

```
          [38]   [27]   [43]   [3]   [9]   [82]   [10]
            |       \    /        \    /       \     /
          [38]     [27, 43]      [3, 9]     [10, 82]
                \       /            \         /
               [27, 38, 43]        [3, 9, 10, 82]
                        \              /
                   [3, 9, 10, 27, 38, 43, 82]
```

**Chi tiết quá trình trộn từng bước:**

1. **Trộn [27] và [43]**: So sánh 27 < 43 → [27, 43]
2. **Trộn [3] và [9]**: So sánh 3 < 9 → [3, 9]
3. **Trộn [82] và [10]**: So sánh 10 < 82 → [10, 82]
4. **Trộn [38] và [27, 43]**: 
   - So sánh 38 vs 27: 27 < 38 → lấy 27
   - So sánh 38 vs 43: 38 < 43 → lấy 38
   - Còn lại 43 → [27, 38, 43]
5. **Trộn [3, 9] và [10, 82]**:
   - So sánh 3 vs 10: 3 < 10 → lấy 3
   - So sánh 9 vs 10: 9 < 10 → lấy 9
   - Còn lại [10, 82] → [3, 9, 10, 82]
6. **Trộn [27, 38, 43] và [3, 9, 10, 82]**:
   - 3 < 27 → lấy 3
   - 9 < 27 → lấy 9
   - 10 < 27 → lấy 10
   - 27 < 82 → lấy 27
   - 38 < 82 → lấy 38
   - 43 < 82 → lấy 43
   - Còn lại 82 → [3, 9, 10, 27, 38, 43, 82]

## Cài Đặt Trong JavaScript

### Cài Đặt Cơ Bản

```javascript
function mergeSort(mang) {
    // Trường hợp cơ sở: mảng có 0 hoặc 1 phần tử đã được sắp xếp
    if (mang.length <= 1) {
        return mang;
    }
    
    // Chia mảng thành hai nửa
    const viTriGiua = Math.floor(mang.length / 2);
    const mangTrai = mang.slice(0, viTriGiua);
    const mangPhai = mang.slice(viTriGiua);
    
    // Đệ quy sắp xếp từng nửa
    const mangTraiDaSapXep = mergeSort(mangTrai);
    const mangPhaiDaSapXep = mergeSort(mangPhai);
    
    // Trộn hai nửa đã sắp xếp
    return tronMang(mangTraiDaSapXep, mangPhaiDaSapXep);
}

function tronMang(mangTrai, mangPhai) {
    const ketQua = [];
    let chiSoTrai = 0;
    let chiSoPhai = 0;
    
    // So sánh và trộn từng phần tử
    while (chiSoTrai < mangTrai.length && chiSoPhai < mangPhai.length) {
        if (mangTrai[chiSoTrai] <= mangPhai[chiSoPhai]) {
            ketQua.push(mangTrai[chiSoTrai]);
            chiSoTrai++;
        } else {
            ketQua.push(mangPhai[chiSoPhai]);
            chiSoPhai++;
        }
    }
    
    // Thêm các phần tử còn lại
    while (chiSoTrai < mangTrai.length) {
        ketQua.push(mangTrai[chiSoTrai]);
        chiSoTrai++;
    }
    
    while (chiSoPhai < mangPhai.length) {
        ketQua.push(mangPhai[chiSoPhai]);
        chiSoPhai++;
    }
    
    return ketQua;
}

// Ví dụ sử dụng
const danhSachSo = [38, 27, 43, 3, 9, 82, 10];
console.log('Mảng gốc:', danhSachSo);
console.log('Mảng đã sắp xếp:', mergeSort([...danhSachSo]));
```

### Cài Đặt Với Theo Dõi Quá Trình

```javascript
function mergeSortCoTheoDoi(mang, mucDo = 0) {
    const khoangCach = '  '.repeat(mucDo);
    console.log(`${khoangCach}📥 Bắt đầu sắp xếp: [${mang.join(', ')}]`);
    
    // Trường hợp cơ sở
    if (mang.length <= 1) {
        console.log(`${khoangCach}✅ Mảng đã sắp xếp (1 phần tử): [${mang.join(', ')}]`);
        return mang;
    }
    
    // Chia mảng
    const viTriGiua = Math.floor(mang.length / 2);
    const mangTrai = mang.slice(0, viTriGiua);
    const mangPhai = mang.slice(viTriGiua);
    
    console.log(`${khoangCach}🔪 Chia thành:`);
    console.log(`${khoangCach}   Trái: [${mangTrai.join(', ')}]`);
    console.log(`${khoangCach}   Phải: [${mangPhai.join(', ')}]`);
    
    // Đệ quy sắp xếp
    console.log(`${khoangCach}⬇️  Sắp xếp nửa trái:`);
    const mangTraiDaSapXep = mergeSortCoTheoDoi(mangTrai, mucDo + 1);
    
    console.log(`${khoangCach}⬇️  Sắp xếp nửa phải:`);
    const mangPhaiDaSapXep = mergeSortCoTheoDoi(mangPhai, mucDo + 1);
    
    // Trộn
    console.log(`${khoangCach}🔄 Trộn:`);
    console.log(`${khoangCach}   [${mangTraiDaSapXep.join(', ')}] + [${mangPhaiDaSapXep.join(', ')}]`);
    
    const ketQua = tronMangCoTheoDoi(mangTraiDaSapXep, mangPhaiDaSapXep, khoangCach);
    
    console.log(`${khoangCach}✅ Kết quả: [${ketQua.join(', ')}]`);
    return ketQua;
}

function tronMangCoTheoDoi(mangTrai, mangPhai, khoangCach) {
    const ketQua = [];
    let chiSoTrai = 0;
    let chiSoPhai = 0;
    
    console.log(`${khoangCach}   🔍 Bắt đầu trộn từng phần tử:`);
    
    while (chiSoTrai < mangTrai.length && chiSoPhai < mangPhai.length) {
        if (mangTrai[chiSoTrai] <= mangPhai[chiSoPhai]) {
            console.log(`${khoangCach}     ${mangTrai[chiSoTrai]} ≤ ${mangPhai[chiSoPhai]} → Chọn ${mangTrai[chiSoTrai]} từ trái`);
            ketQua.push(mangTrai[chiSoTrai]);
            chiSoTrai++;
        } else {
            console.log(`${khoangCach}     ${mangTrai[chiSoTrai]} > ${mangPhai[chiSoPhai]} → Chọn ${mangPhai[chiSoPhai]} từ phải`);
            ketQua.push(mangPhai[chiSoPhai]);
            chiSoPhai++;
        }
    }
    
    // Thêm phần tử còn lại
    if (chiSoTrai < mangTrai.length) {
        console.log(`${khoangCach}     Thêm phần tử còn lại từ trái: [${mangTrai.slice(chiSoTrai).join(', ')}]`);
        ketQua.push(...mangTrai.slice(chiSoTrai));
    }
    
    if (chiSoPhai < mangPhai.length) {
        console.log(`${khoangCach}     Thêm phần tử còn lại từ phải: [${mangPhai.slice(chiSoPhai).join(', ')}]`);
        ketQua.push(...mangPhai.slice(chiSoPhai));
    }
    
    return ketQua;
}
```

### Cài Đặt Class (Theo Mẫu Dự Án)

```javascript
import Sort from '../Sort';

export default class MergeSort extends Sort {
    sort(mangGoc) {
        // Gọi callback để theo dõi
        this.callbacks.visitingCallback(null);

        // Nếu mảng rỗng hoặc có một phần tử thì trả về mảng này vì nó đã được sắp xếp
        if (mangGoc.length <= 1) {
            return mangGoc;
        }

        // Chia mảng thành hai nửa
        const chiSoGiua = Math.floor(mangGoc.length / 2);
        const mangTrai = mangGoc.slice(0, chiSoGiua);
        const mangPhai = mangGoc.slice(chiSoGiua, mangGoc.length);

        // Sắp xếp hai nửa của mảng đã chia
        const mangTraiDaSapXep = this.sort(mangTrai);
        const mangPhaiDaSapXep = this.sort(mangPhai);

        // Trộn hai mảng đã sắp xếp thành một
        return this.tronMangDaSapXep(mangTraiDaSapXep, mangPhaiDaSapXep);
    }

    tronMangDaSapXep(mangTrai, mangPhai) {
        const mangDaSapXep = [];

        // Sử dụng con trỏ mảng để loại trừ các phần tử cũ sau khi chúng được thêm vào mảng đã sắp xếp
        let chiSoTrai = 0;
        let chiSoPhai = 0;

        while (chiSoTrai < mangTrai.length && chiSoPhai < mangPhai.length) {
            let phanTuNhoNhat = null;

            // Tìm phần tử nhỏ nhất giữa mảng trái và mảng phải
            if (this.comparator.lessThanOrEqual(mangTrai[chiSoTrai], mangPhai[chiSoPhai])) {
                phanTuNhoNhat = mangTrai[chiSoTrai];
                // Tăng con trỏ chỉ số sang phải
                chiSoTrai += 1;
            } else {
                phanTuNhoNhat = mangPhai[chiSoPhai];
                // Tăng con trỏ chỉ số sang phải
                chiSoPhai += 1;
            }

            // Thêm phần tử nhỏ nhất vào mảng đã sắp xếp
            mangDaSapXep.push(phanTuNhoNhat);

            // Gọi callback để theo dõi
            this.callbacks.visitingCallback(phanTuNhoNhat);
        }

        // Sẽ có các phần tử còn lại từ mảng trái HOẶC mảng phải
        // Nối các phần tử còn lại vào mảng đã sắp xếp
        return mangDaSapXep
            .concat(mangTrai.slice(chiSoTrai))
            .concat(mangPhai.slice(chiSoPhai));
    }
}
```

### Cài Đặt Merge Sort Iterative (Không Đệ Quy)

```javascript
function mergeSortIterative(mang) {
    const n = mang.length;
    const ketQua = [...mang]; // Tạo bản sao để không thay đổi mảng gốc
    
    console.log('MERGE SORT ITERATIVE (BOTTOM-UP)');
    console.log('=================================');
    console.log(`Mảng ban đầu: [${ketQua.join(', ')}]`);
    
    // Bắt đầu với kích thước 1, sau đó 2, 4, 8, ...
    for (let kichThuoc = 1; kichThuoc < n; kichThuoc *= 2) {
        console.log(`\nBước với kích thước: ${kichThuoc}`);
        
        // Trộn các mảng con có kích thước hiện tại
        for (let trai = 0; trai < n - 1; trai += kichThuoc * 2) {
            const giua = Math.min(trai + kichThuoc - 1, n - 1);
            const phai = Math.min(trai + kichThuoc * 2 - 1, n - 1);
            
            if (giua < phai) {
                console.log(`  Trộn [${trai}..${giua}] với [${giua + 1}..${phai}]`);
                tronMangConIterative(ketQua, trai, giua, phai);
                console.log(`  Kết quả: [${ketQua.join(', ')}]`);
            }
        }
    }
    
    return ketQua;
}

function tronMangConIterative(mang, trai, giua, phai) {
    // Tạo mảng tạm để chứa các phần tử
    const mangTam = [];
    
    // Sao chép dữ liệu vào mảng tạm
    for (let i = trai; i <= phai; i++) {
        mangTam[i - trai] = mang[i];
    }
    
    let i = 0; // Con trỏ đầu của mảng con trái
    let j = giua - trai + 1; // Con trỏ đầu của mảng con phải
    let k = trai; // Con trỏ của mảng gốc
    
    // Trộn hai mảng con
    while (i <= giua - trai && j <= phai - trai) {
        if (mangTam[i] <= mangTam[j]) {
            mang[k] = mangTam[i];
            i++;
        } else {
            mang[k] = mangTam[j];
            j++;
        }
        k++;
    }
    
    // Sao chép các phần tử còn lại
    while (i <= giua - trai) {
        mang[k] = mangTam[i];
        i++;
        k++;
    }
    
    while (j <= phai - trai) {
        mang[k] = mangTam[j];
        j++;
        k++;
    }
}
```

## Ứng Dụng Thực Tế

### 1. Hệ Thống Sắp Xếp Danh Bạ Điện Thoại

```javascript
class DanhBaDienThoai {
    constructor() {
        this.danhSachLienHe = [];
    }
    
    themLienHe(ten, soDienThoai, nhom, ghiChu = '') {
        this.danhSachLienHe.push({
            ten,
            soDienThoai,
            nhom,
            ghiChu,
            thoiGianThem: new Date(),
            soLanGoi: 0
        });
    }
    
    sapXepDanhBaBangMergeSort(tieuChi = 'ten') {
        console.log(`\n📱 SẮPXẾP DANH BẠ THEO ${tieuChi.toUpperCase()}`);
        console.log('='.repeat(40));
        
        this.danhSachLienHe = this.mergeSortDanhBa(this.danhSachLienHe, tieuChi);
        
        console.log('✅ Hoàn thành sắp xếp danh bạ!');
        return this.danhSachLienHe;
    }
    
    mergeSortDanhBa(danhSach, tieuChi) {
        if (danhSach.length <= 1) {
            return danhSach;
        }
        
        const giua = Math.floor(danhSach.length / 2);
        const trai = danhSach.slice(0, giua);
        const phai = danhSach.slice(giua);
        
        const traiDaSapXep = this.mergeSortDanhBa(trai, tieuChi);
        const phaiDaSapXep = this.mergeSortDanhBa(phai, tieuChi);
        
        return this.tronDanhBa(traiDaSapXep, phaiDaSapXep, tieuChi);
    }
    
    tronDanhBa(danhBaTrai, danhBaPhai, tieuChi) {
        const ketQua = [];
        let chiSoTrai = 0;
        let chiSoPhai = 0;
        
        while (chiSoTrai < danhBaTrai.length && chiSoPhai < danhBaPhai.length) {
            const lienHeTrai = danhBaTrai[chiSoTrai];
            const lienHePhai = danhBaPhai[chiSoPhai];
            
            if (this.soSanhLienHe(lienHeTrai, lienHePhai, tieuChi) <= 0) {
                ketQua.push(lienHeTrai);
                chiSoTrai++;
            } else {
                ketQua.push(lienHePhai);
                chiSoPhai++;
            }
        }
        
        // Thêm phần tử còn lại
        ketQua.push(...danhBaTrai.slice(chiSoTrai));
        ketQua.push(...danhBaPhai.slice(chiSoPhai));
        
        return ketQua;
    }
    
    soSanhLienHe(lienHe1, lienHe2, tieuChi) {
        switch (tieuChi) {
            case 'ten':
                return lienHe1.ten.localeCompare(lienHe2.ten, 'vi-VN');
            
            case 'nhom':
                const soSanhNhom = lienHe1.nhom.localeCompare(lienHe2.nhom, 'vi-VN');
                return soSanhNhom !== 0 ? soSanhNhom : 
                       lienHe1.ten.localeCompare(lienHe2.ten, 'vi-VN');
            
            case 'soLanGoi':
                return lienHe2.soLanGoi - lienHe1.soLanGoi; // Giảm dần
            
            case 'thoiGianThem':
                return lienHe2.thoiGianThem - lienHe1.thoiGianThem; // Mới nhất trước
            
            default:
                return lienHe1.ten.localeCompare(lienHe2.ten, 'vi-VN');
        }
    }
    
    goiDienThoai(soDienThoai) {
        const lienHe = this.danhSachLienHe.find(lh => lh.soDienThoai === soDienThoai);
        if (lienHe) {
            lienHe.soLanGoi++;
            console.log(`📞 Đang gọi cho ${lienHe.ten} (${soDienThoai})`);
            console.log(`   Số lần gọi: ${lienHe.soLanGoi}`);
            return lienHe;
        }
        return null;
    }
    
    timKiemLienHe(tuKhoa) {
        const ketQua = this.danhSachLienHe.filter(lh => 
            lh.ten.toLowerCase().includes(tuKhoa.toLowerCase()) ||
            lh.soDienThoai.includes(tuKhoa) ||
            lh.nhom.toLowerCase().includes(tuKhoa.toLowerCase())
        );
        
        console.log(`\n🔍 TÌM KIẾM: "${tuKhoa}"`);
        console.log(`Tìm thấy ${ketQua.length} kết quả:`);
        
        ketQua.forEach((lh, index) => {
            console.log(`${index + 1}. ${lh.ten} - ${lh.soDienThoai} (${lh.nhom})`);
        });
        
        return ketQua;
    }
    
    inDanhBa() {
        console.log('\n📖 DANH BẠ ĐIỆN THOẠI');
        console.log('=====================');
        
        let nhomHienTai = '';
        this.danhSachLienHe.forEach((lienHe, index) => {
            // Hiển thị header nhóm nếu khác nhóm trước
            if (lienHe.nhom !== nhomHienTai) {
                nhomHienTai = lienHe.nhom;
                console.log(`\n📁 NHÓM: ${nhomHienTai.toUpperCase()}`);
                console.log('─'.repeat(30));
            }
            
            const soLanGoi = lienHe.soLanGoi > 0 ? ` (Đã gọi: ${lienHe.soLanGoi})` : '';
            
            console.log(`${index + 1}. 👤 ${lienHe.ten}`);
            console.log(`   📱 ${lienHe.soDienThoai}${soLanGoi}`);
            if (lienHe.ghiChu) {
                console.log(`   📝 ${lienHe.ghiChu}`);
            }
            console.log(`   ⏰ ${lienHe.thoiGianThem.toLocaleDateString('vi-VN')}`);
            console.log('');
        });
    }
    
    xuatThongKe() {
        const thongKe = {
            tongSoLienHe: this.danhSachLienHe.length,
            theo Nhom: {},
            topGoiNhieu: [],
            lienHeMoi: []
        };
        
        // Thống kê theo nhóm
        this.danhSachLienHe.forEach(lh => {
            thongKe.theoNhom[lh.nhom] = (thongKe.theoNhom[lh.nhom] || 0) + 1;
        });
        
        // Top 5 liên hệ gọi nhiều nhất
        thongKe.topGoiNhieu = [...this.danhSachLienHe]
            .sort((a, b) => b.soLanGoi - a.soLanGoi)
            .slice(0, 5)
            .filter(lh => lh.soLanGoi > 0);
        
        // Liên hệ thêm trong 7 ngày gần đây
        const bayNgayTruoc = new Date();
        bayNgayTruoc.setDate(bayNgayTruoc.getDate() - 7);
        thongKe.lienHeMoi = this.danhSachLienHe.filter(lh => 
            lh.thoiGianThem > bayNgayTruoc
        );
        
        console.log('\n📊 THỐNG KÊ DANH BẠ');
        console.log('===================');
        console.log(`Tổng số liên hệ: ${thongKe.tongSoLienHe}`);
        
        console.log('\nPhân bố theo nhóm:');
        Object.entries(thongKe.theoNhom).forEach(([nhom, soLuong]) => {
            console.log(`  📁 ${nhom}: ${soLuong} liên hệ`);
        });
        
        if (thongKe.topGoiNhieu.length > 0) {
            console.log('\nTop liên hệ thường gọi:');
            thongKe.topGoiNhieu.forEach((lh, index) => {
                console.log(`  ${index + 1}. ${lh.ten}: ${lh.soLanGoi} cuộc gọi`);
            });
        }
        
        console.log(`\nLiên hệ mới (7 ngày): ${thongKe.lienHeMoi.length}`);
        
        return thongKe;
    }
}

// Sử dụng hệ thống
const danhBa = new DanhBaDienThoai();

// Thêm liên hệ
danhBa.themLienHe('Nguyễn Văn An', '0901234567', 'Bạn bè', 'Bạn thân từ thời đại học');
danhBa.themLienHe('Trần Thị Bình', '0902345678', 'Gia đình', 'Chị gái');
danhBa.themLienHe('Lê Minh Cường', '0903456789', 'Công việc', 'Đồng nghiệp phòng IT');
danhBa.themLienHe('Phạm Thị Dung', '0904567890', 'Bạn bè', 'Hàng xóm');
danhBa.themLienHe('Hoàng Văn Em', '0905678901', 'Gia đình', 'Em trai');
danhBa.themLienHe('Võ Thị Phượng', '0906789012', 'Công việc', 'Quản lý dự án');
danhBa.themLienHe('Ngô Minh Quân', '0907890123', 'Bạn bè', 'Bạn học cũ');

// Gọi một vài cuộc điện thoại
danhBa.goiDienThoai('0901234567');
danhBa.goiDienThoai('0901234567');
danhBa.goiDienThoai('0902345678');
danhBa.goiDienThoai('0906789012');
danhBa.goiDienThoai('0906789012');
danhBa.goiDienThoai('0906789012');

// Sắp xếp theo các tiêu chí khác nhau
console.log('📋 Sắp xếp theo tên:');
danhBa.sapXepDanhBaBangMergeSort('ten');
danhBa.inDanhBa();

console.log('\n📋 Sắp xếp theo nhóm:');
danhBa.sapXepDanhBaBangMergeSort('nhom');
danhBa.inDanhBa();

console.log('\n📋 Sắp xếp theo số lần gọi:');
danhBa.sapXepDanhBaBangMergeSort('soLanGoi');
danhBa.inDanhBa();

// Tìm kiếm
danhBa.timKiemLienHe('Nguyễn');
danhBa.timKiemLienHe('Công việc');

// Thống kê
danhBa.xuatThongKe();
```

### 2. Hệ Thống Quản Lý Thư Viện Sách

```javascript
class ThuVienSach {
    constructor() {
        this.danhSachSach = [];
        this.lichSuMuon = [];
    }
    
    themSach(tieuDe, tacGia, theLoai, namXuatBan, soLuong) {
        const sach = {
            id: Date.now() + Math.random(),
            tieuDe,
            tacGia,
            theLoai,
            namXuatBan,
            soLuong,
            soLuongConLai: soLuong,
            soLanMuon: 0,
            danhGia: 0,
            luotDanhGia: 0,
            thoiGianThem: new Date()
        };
        
        this.danhSachSach.push(sach);
        console.log(`📚 Đã thêm sách: "${tieuDe}" - ${tacGia}`);
        return sach;
    }
    
    sapXepSachBangMergeSort(tieuChi = 'tieuDe') {
        console.log(`\n📖 SẮPXẾP THƯ VIỆN THEO ${tieuChi.toUpperCase()}`);
        console.log('='.repeat(50));
        
        this.danhSachSach = this.mergeSortSach(this.danhSachSach, tieuChi);
        
        console.log('✅ Hoàn thành sắp xếp thư viện!');
        return this.danhSachSach;
    }
    
    mergeSortSach(danhSach, tieuChi) {
        if (danhSach.length <= 1) {
            return danhSach;
        }
        
        const giua = Math.floor(danhSach.length / 2);
        const trai = danhSach.slice(0, giua);
        const phai = danhSach.slice(giua);
        
        const traiDaSapXep = this.mergeSortSach(trai, tieuChi);
        const phaiDaSapXep = this.mergeSortSach(phai, tieuChi);
        
        return this.tronSach(traiDaSapXep, phaiDaSapXep, tieuChi);
    }
    
    tronSach(sachTrai, sachPhai, tieuChi) {
        const ketQua = [];
        let chiSoTrai = 0;
        let chiSoPhai = 0;
        
        while (chiSoTrai < sachTrai.length && chiSoPhai < sachPhai.length) {
            const sachBenTrai = sachTrai[chiSoTrai];
            const sachBenPhai = sachPhai[chiSoPhai];
            
            if (this.soSanhSach(sachBenTrai, sachBenPhai, tieuChi) <= 0) {
                ketQua.push(sachBenTrai);
                chiSoTrai++;
            } else {
                ketQua.push(sachBenPhai);
                chiSoPhai++;
            }
        }
        
        ketQua.push(...sachTrai.slice(chiSoTrai));
        ketQua.push(...sachPhai.slice(chiSoPhai));
        
        return ketQua;
    }
    
    soSanhSach(sach1, sach2, tieuChi) {
        switch (tieuChi) {
            case 'tieuDe':
                return sach1.tieuDe.localeCompare(sach2.tieuDe, 'vi-VN');
            
            case 'tacGia':
                const soSanhTacGia = sach1.tacGia.localeCompare(sach2.tacGia, 'vi-VN');
                return soSanhTacGia !== 0 ? soSanhTacGia : 
                       sach1.tieuDe.localeCompare(sach2.tieuDe, 'vi-VN');
            
            case 'theLoai':
                const soSanhTheLoai = sach1.theLoai.localeCompare(sach2.theLoai, 'vi-VN');
                return soSanhTheLoai !== 0 ? soSanhTheLoai : 
                       sach1.tieuDe.localeCompare(sach2.tieuDe, 'vi-VN');
            
            case 'namXuatBan':
                return sach2.namXuatBan - sach1.namXuatBan; // Mới nhất trước
            
            case 'danhGia':
                const diemTB1 = sach1.luotDanhGia > 0 ? sach1.danhGia / sach1.luotDanhGia : 0;
                const diemTB2 = sach2.luotDanhGia > 0 ? sach2.danhGia / sach2.luotDanhGia : 0;
                return diemTB2 - diemTB1; // Cao nhất trước
            
            case 'phoBien':
                return sach2.soLanMuon - sach1.soLanMuon; // Nhiều lượt mượn nhất trước
            
            default:
                return sach1.tieuDe.localeCompare(sach2.tieuDe, 'vi-VN');
        }
    }
    
    muonSach(idSach, tenNguoiMuon, ngayTra) {
        const sach = this.danhSachSach.find(s => s.id === idSach);
        
        if (!sach) {
            console.log('❌ Không tìm thấy sách!');
            return null;
        }
        
        if (sach.soLuongConLai <= 0) {
            console.log('❌ Sách đã hết, không thể mượn!');
            return null;
        }
        
        // Cập nhật thông tin
        sach.soLuongConLai--;
        sach.soLanMuon++;
        
        // Ghi lịch sử
        const lichSu = {
            idSach,
            tieuDeSach: sach.tieuDe,
            tenNguoiMuon,
            ngayMuon: new Date(),
            ngayTra: new Date(ngayTra),
            daTraSach: false
        };
        
        this.lichSuMuon.push(lichSu);
        
        console.log(`📤 ${tenNguoiMuon} đã mượn "${sach.tieuDe}"`);
        console.log(`   Ngày trả dự kiến: ${ngayTra.toLocaleDateString('vi-VN')}`);
        console.log(`   Còn lại: ${sach.soLuongConLai} cuốn`);
        
        return lichSu;
    }
    
    traSach(idSach, tenNguoiMuon, danhGiaSao = 0) {
        const lichSu = this.lichSuMuon.find(ls => 
            ls.idSach === idSach && 
            ls.tenNguoiMuon === tenNguoiMuon && 
            !ls.daTraSach
        );
        
        if (!lichSu) {
            console.log('❌ Không tìm thấy thông tin mượn sách!');
            return null;
        }
        
        const sach = this.danhSachSach.find(s => s.id === idSach);
        
        // Cập nhật thông tin
        sach.soLuongConLai++;
        lichSu.daTraSach = true;
        lichSu.ngayTraThucTe = new Date();
        
        // Xử lý đánh giá
        if (danhGiaSao > 0 && danhGiaSao <= 5) {
            sach.danhGia += danhGiaSao;
            sach.luotDanhGia++;
            console.log(`⭐ Cảm ơn đánh giá ${danhGiaSao} sao cho "${sach.tieuDe}"`);
        }
        
        // Kiểm tra trả trễ
        const ngayHienTai = new Date();
        const treHan = ngayHienTai > lichSu.ngayTra;
        const soNgayTre = treHan ? Math.ceil((ngayHienTai - lichSu.ngayTra) / (1000 * 60 * 60 * 24)) : 0;
        
        console.log(`📥 ${tenNguoiMuon} đã trả "${sach.tieuDe}"`);
        if (treHan) {
            console.log(`   ⚠️  Trả trễ ${soNgayTre} ngày`);
        } else {
            console.log(`   ✅ Trả đúng hạn`);
        }
        console.log(`   Hiện có: ${sach.soLuongConLai} cuốn`);
        
        return { lichSu, treHan, soNgayTre };
    }
    
    timKiemSach(tuKhoa) {
        const ketQua = this.danhSachSach.filter(sach =>
            sach.tieuDe.toLowerCase().includes(tuKhoa.toLowerCase()) ||
            sach.tacGia.toLowerCase().includes(tuKhoa.toLowerCase()) ||
            sach.theLoai.toLowerCase().includes(tuKhoa.toLowerCase())
        );
        
        console.log(`\n🔍 TÌM KIẾM: "${tuKhoa}"`);
        console.log(`Tìm thấy ${ketQua.length} cuốn sách:`);
        
        ketQua.forEach((sach, index) => {
            const diemTB = sach.luotDanhGia > 0 ? (sach.danhGia / sach.luotDanhGia).toFixed(1) : 'Chưa có';
            const tinhTrang = sach.soLuongConLai > 0 ? `Còn ${sach.soLuongConLai} cuốn` : 'Hết sách';
            
            console.log(`${index + 1}. "${sach.tieuDe}" - ${sach.tacGia}`);
            console.log(`   📚 ${sach.theLoai} (${sach.namXuatBan})`);
            console.log(`   ⭐ ${diemTB}/5 | 📊 ${tinhTrang} | 📖 Đã mượn: ${sach.soLanMuon} lần`);
        });
        
        return ketQua;
    }
    
    inThuVien() {
        console.log('\n📚 THƯ VIỆN SÁCH');
        console.log('=================');
        
        let theLoaiHienTai = '';
        this.danhSachSach.forEach((sach, index) => {
            // Hiển thị header thể loại nếu khác thể loại trước
            if (sach.theLoai !== theLoaiHienTai) {
                theLoaiHienTai = sach.theLoai;
                console.log(`\n📖 THỂ LOẠI: ${theLoaiHienTai.toUpperCase()}`);
                console.log('─'.repeat(40));
            }
            
            const diemTB = sach.luotDanhGia > 0 ? (sach.danhGia / sach.luotDanhGia).toFixed(1) : 'N/A';
            const tinhTrang = sach.soLuongConLai > 0 ? '🟢 Có sẵn' : '🔴 Hết sách';
            
            console.log(`${index + 1}. 📘 "${sach.tieuDe}"`);
            console.log(`   ✍️  Tác giả: ${sach.tacGia}`);
            console.log(`   📅 Năm XB: ${sach.namXuatBan}`);
            console.log(`   📊 Kho: ${sach.soLuongConLai}/${sach.soLuong} | ${tinhTrang}`);
            console.log(`   ⭐ Điểm: ${diemTB}/5 (${sach.luotDanhGia} đánh giá)`);
            console.log(`   📖 Đã mượn: ${sach.soLanMuon} lần`);
            console.log('');
        });
    }
    
    baoCaoThongKe() {
        const thongKe = {
            tongSoSach: this.danhSachSach.length,
            tongSoLuong: this.danhSachSach.reduce((sum, s) => sum + s.soLuong, 0),
            soLuongConLai: this.danhSachSach.reduce((sum, s) => sum + s.soLuongConLai, 0),
            theoTheLoai: {},
            topPhoBien: [],
            topDanhGia: [],
            sachHetSach: []
        };
        
        // Thống kê theo thể loại
        this.danhSachSach.forEach(sach => {
            if (!thongKe.theoTheLoai[sach.theLoai]) {
                thongKe.theoTheLoai[sach.theLoai] = {
                    soLuong: 0,
                    soLanMuon: 0
                };
            }
            thongKe.theoTheLoai[sach.theLoai].soLuong += sach.soLuong;
            thongKe.theoTheLoai[sach.theLoai].soLanMuon += sach.soLanMuon;
        });
        
        // Top 5 sách phổ biến nhất
        thongKe.topPhoBien = [...this.danhSachSach]
            .sort((a, b) => b.soLanMuon - a.soLanMuon)
            .slice(0, 5)
            .filter(s => s.soLanMuon > 0);
        
        // Top 5 sách được đánh giá cao nhất
        thongKe.topDanhGia = [...this.danhSachSach]
            .filter(s => s.luotDanhGia > 0)
            .sort((a, b) => (b.danhGia / b.luotDanhGia) - (a.danhGia / a.luotDanhGia))
            .slice(0, 5);
        
        // Sách hết hàng
        thongKe.sachHetHang = this.danhSachSach.filter(s => s.soLuongConLai === 0);
        
        console.log('\n📊 BÁO CÁO THỐNG KÊ THƯ VIỆN');
        console.log('==============================');
        console.log(`📚 Tổng số đầu sách: ${thongKe.tongSoSach}`);
        console.log(`📦 Tổng số lượng: ${thongKe.tongSoLuong} cuốn`);
        console.log(`🟢 Còn lại: ${thongKe.soLuongConLai} cuốn`);
        console.log(`🔴 Đang được mượn: ${thongKe.tongSoLuong - thongKe.soLuongConLai} cuốn`);
        
        console.log('\n📖 Thống kê theo thể loại:');
        Object.entries(thongKe.theoTheLoai).forEach(([theLoai, data]) => {
            console.log(`  ${theLoai}: ${data.soLuong} cuốn (${data.soLanMuon} lượt mượn)`);
        });
        
        if (thongKe.topPhoBien.length > 0) {
            console.log('\n🔥 Top sách phổ biến:');
            thongKe.topPhoBien.forEach((sach, index) => {
                console.log(`  ${index + 1}. "${sach.tieuDe}" - ${sach.soLanMuon} lượt mượn`);
            });
        }
        
        if (thongKe.topDanhGia.length > 0) {
            console.log('\n⭐ Top sách được đánh giá cao:');
            thongKe.topDanhGia.forEach((sach, index) => {
                const diemTB = (sach.danhGia / sach.luotDanhGia).toFixed(1);
                console.log(`  ${index + 1}. "${sach.tieuDe}" - ${diemTB}/5 (${sach.luotDanhGia} đánh giá)`);
            });
        }
        
        if (thongKe.sachHetHang.length > 0) {
            console.log('\n⚠️  Sách hết hàng cần bổ sung:');
            thongKe.sachHetHang.forEach(sach => {
                console.log(`  • "${sach.tieuDe}" - ${sach.tacGia}`);
            });
        }
        
        return thongKe;
    }
}

// Sử dụng hệ thống
const thuVien = new ThuVienSach();

// Thêm sách
thuVien.themSach('Đắc Nhân Tâm', 'Dale Carnegie', 'Phát triển bản thân', 2010, 5);
thuVien.themSach('Sapiens', 'Yuval Noah Harari', 'Lịch sử', 2018, 3);
thuVien.themSach('Atomic Habits', 'James Clear', 'Phát triển bản thân', 2020, 4);
thuVien.themSach('Tôi Thấy Hoa Vàng Trên Cỏ Xanh', 'Nguyễn Nhật Ánh', 'Văn học', 2015, 6);
thuVien.themSach('Clean Code', 'Robert C. Martin', 'Lập trình', 2019, 2);
thuVien.themSach('Homo Deus', 'Yuval Noah Harari', 'Lịch sử', 2020, 3);
thuVien.themSach('Cô Gái Đến Từ Hôm Qua', 'Nguyễn Nhật Ánh', 'Văn học', 2017, 4);

// Mượn sách
const ngayTra = new Date();
ngayTra.setDate(ngayTra.getDate() + 14); // 14 ngày sau

thuVien.muonSach(thuVien.danhSachSach[0].id, 'Nguyễn Văn An', ngayTra);
thuVien.muonSach(thuVien.danhSachSach[1].id, 'Trần Thị Bình', ngayTra);
thuVien.muonSach(thuVien.danhSachSach[0].id, 'Lê Minh Cường', ngayTra);

// Trả sách với đánh giá
thuVien.traSach(thuVien.danhSachSach[1].id, 'Trần Thị Bình', 5);

// Sắp xếp theo các tiêu chí
console.log('\n📚 Sắp xếp theo tiêu đề:');
thuVien.sapXepSachBangMergeSort('tieuDe');
thuVien.inThuVien();

console.log('\n📚 Sắp xếp theo thể loại:');
thuVien.sapXepSachBangMergeSort('theLoai');
thuVien.inThuVien();

console.log('\n📚 Sắp xếp theo độ phổ biến:');
thuVien.sapXepSachBangMergeSort('phoBien');
thuVien.inThuVien();

// Tìm kiếm
thuVien.timKiemSach('Nguyễn Nhật Ánh');
thuVien.timKiemSach('Lịch sử');

// Báo cáo thống kê
thuVien.baoCaoThongKe();
```

### 3. Hệ Thống Xử Lý Đơn Hàng E-commerce

```javascript
class XuLyDonHang {
    constructor() {
        this.danhSachDonHang = [];
        this.lichSuXuLy = [];
        this.soDonHang = 1;
    }
    
    taoDonHang(tenKhachHang, diaChiGiaoHang, danhSachSanPham, phuongThucThanhToan) {
        const tongGiaTri = danhSachSanPham.reduce((sum, sp) => sum + (sp.gia * sp.soLuong), 0);
        const mucDoUuTien = this.tinhMucDoUuTien(tongGiaTri, tenKhachHang, danhSachSanPham);
        
        const donHang = {
            id: this.soDonHang++,
            tenKhachHang,
            diaChiGiaoHang,
            danhSachSanPham,
            phuongThucThanhToan,
            tongGiaTri,
            mucDoUuTien,
            trangThai: 'CHỜ XỬ LÝ',
            thoiGianTao: new Date(),
            thoiGianXuLy: null,
            thoiGianGiaoHang: null,
            ghiChu: ''
        };
        
        this.danhSachDonHang.push(donHang);
        console.log(`🛒 Tạo đơn hàng #${donHang.id} - ${tenKhachHang}`);
        console.log(`   Giá trị: ${tongGiaTri.toLocaleString('vi-VN')} VNĐ`);
        console.log(`   Ưu tiên: ${this.layTenMucDoUuTien(mucDoUuTien)}`);
        
        return donHang;
    }
    
    tinhMucDoUuTien(tongGiaTri, tenKhachHang, danhSachSanPham) {
        let mucDo = 1; // Cơ bản
        
        // Ưu tiên theo giá trị đơn hàng
        if (tongGiaTri >= 10000000) mucDo = 4; // VIP
        else if (tongGiaTri >= 5000000) mucDo = 3; // Cao
        else if (tongGiaTri >= 1000000) mucDo = 2; // Trung bình
        
        // Khách hàng VIP (giả sử có từ khóa)
        if (tenKhachHang.toLowerCase().includes('vip') || 
            tenKhachHang.toLowerCase().includes('kim cương')) {
            mucDo = Math.max(mucDo, 4);
        }
        
        // Sản phẩm đặc biệt (ví dụ: điện tử)
        const coSanPhamDacBiet = danhSachSanPham.some(sp => 
            sp.loai === 'Điện tử' || sp.loai === 'Laptop'
        );
        if (coSanPhamDacBiet) {
            mucDo = Math.max(mucDo, 2);
        }
        
        return mucDo;
    }
    
    sapXepDonHangBangMergeSort(tieuChi = 'uuTien') {
        console.log(`\n📦 SẮPXẾP ĐƠN HÀNG THEO ${tieuChi.toUpperCase()}`);
        console.log('='.repeat(50));
        
        this.danhSachDonHang = this.mergeSortDonHang(this.danhSachDonHang, tieuChi);
        
        console.log('✅ Hoàn thành sắp xếp đơn hàng!');
        return this.danhSachDonHang;
    }
    
    mergeSortDonHang(danhSach, tieuChi) {
        if (danhSach.length <= 1) {
            return danhSach;
        }
        
        const giua = Math.floor(danhSach.length / 2);
        const trai = danhSach.slice(0, giua);
        const phai = danhSach.slice(giua);
        
        const traiDaSapXep = this.mergeSortDonHang(trai, tieuChi);
        const phaiDaSapXep = this.mergeSortDonHang(phai, tieuChi);
        
        return this.tronDonHang(traiDaSapXep, phaiDaSapXep, tieuChi);
    }
    
    tronDonHang(donHangTrai, donHangPhai, tieuChi) {
        const ketQua = [];
        let chiSoTrai = 0;
        let chiSoPhai = 0;
        
        while (chiSoTrai < donHangTrai.length && chiSoPhai < donHangPhai.length) {
            const donTrai = donHangTrai[chiSoTrai];
            const donPhai = donHangPhai[chiSoPhai];
            
            if (this.soSanhDonHang(donTrai, donPhai, tieuChi) <= 0) {
                ketQua.push(donTrai);
                chiSoTrai++;
            } else {
                ketQua.push(donPhai);
                chiSoPhai++;
            }
        }
        
        ketQua.push(...donHangTrai.slice(chiSoTrai));
        ketQua.push(...donHangPhai.slice(chiSoPhai));
        
        return ketQua;
    }
    
    soSanhDonHang(don1, don2, tieuChi) {
        switch (tieuChi) {
            case 'uuTien':
                // Ưu tiên cao -> Giá trị cao -> Thời gian tạo sớm
                if (don1.mucDoUuTien !== don2.mucDoUuTien) {
                    return don2.mucDoUuTien - don1.mucDoUuTien; // Cao trước
                }
                if (don1.tongGiaTri !== don2.tongGiaTri) {
                    return don2.tongGiaTri - don1.tongGiaTri; // Giá trị cao trước
                }
                return don1.thoiGianTao - don2.thoiGianTao; // Cũ trước
            
            case 'giaTri':
                return don2.tongGiaTri - don1.tongGiaTri; // Giá trị cao trước
            
            case 'thoiGian':
                return don1.thoiGianTao - don2.thoiGianTao; // Cũ trước (FIFO)
            
            case 'khachHang':
                const soSanhTen = don1.tenKhachHang.localeCompare(don2.tenKhachHang, 'vi-VN');
                return soSanhTen !== 0 ? soSanhTen : don1.thoiGianTao - don2.thoiGianTao;
            
            default:
                return don1.id - don2.id;
        }
    }
    
    xuLyDonHang(idDonHang, ghiChu = '') {
        const donHang = this.danhSachDonHang.find(dh => dh.id === idDonHang);
        
        if (!donHang) {
            console.log('❌ Không tìm thấy đơn hàng!');
            return null;
        }
        
        if (donHang.trangThai !== 'CHỜ XỬ LÝ') {
            console.log('❌ Đơn hàng đã được xử lý!');
            return null;
        }
        
        donHang.trangThai = 'ĐANG XỬ LÝ';
        donHang.thoiGianXuLy = new Date();
        donHang.ghiChu = ghiChu;
        
        // Ghi lịch sử
        this.lichSuXuLy.push({
            idDonHang,
            hanhDong: 'BẮT ĐẦU XỬ LÝ',
            thoiGian: new Date(),
            ghiChu
        });
        
        console.log(`⚡ Bắt đầu xử lý đơn hàng #${idDonHang}`);
        console.log(`   Khách hàng: ${donHang.tenKhachHang}`);
        console.log(`   Giá trị: ${donHang.tongGiaTri.toLocaleString('vi-VN')} VNĐ`);
        if (ghiChu) console.log(`   Ghi chú: ${ghiChu}`);
        
        return donHang;
    }
    
    hoanThanhDonHang(idDonHang, ghiChu = '') {
        const donHang = this.danhSachDonHang.find(dh => dh.id === idDonHang);
        
        if (!donHang || donHang.trangThai !== 'ĐANG XỬ LÝ') {
            console.log('❌ Đơn hàng không hợp lệ hoặc chưa được xử lý!');
            return null;
        }
        
        donHang.trangThai = 'HOÀN THÀNH';
        donHang.thoiGianHoanThanh = new Date();
        
        // Tính thời gian xử lý
        const thoiGianXuLy = Math.floor((donHang.thoiGianHoanThanh - donHang.thoiGianXuLy) / 60000);
        donHang.thoiGianXuLyPhut = thoiGianXuLy;
        
        // Ghi lịch sử
        this.lichSuXuLy.push({
            idDonHang,
            hanhDong: 'HOÀN THÀNH',
            thoiGian: new Date(),
            ghiChu,
            thoiGianXuLy
        });
        
        console.log(`✅ Hoàn thành đơn hàng #${idDonHang}`);
        console.log(`   Thời gian xử lý: ${thoiGianXuLy} phút`);
        if (ghiChu) console.log(`   Ghi chú: ${ghiChu}`);
        
        return donHang;
    }
    
    layTenMucDoUuTien(mucDo) {
        const tenMucDo = {
            1: 'Cơ bản',
            2: 'Trung bình',
            3: 'Cao',
            4: 'VIP'
        };
        return tenMucDo[mucDo] || 'Không xác định';
    }
    
    layIconMucDoUuTien(mucDo) {
        const icons = {
            1: '🟢',
            2: '🟡',
            3: '🟠',
            4: '🔴'
        };
        return icons[mucDo] || '⚪';
    }
    
    layIconTrangThai(trangThai) {
        const icons = {
            'CHỜ XỬ LÝ': '⏳',
            'ĐANG XỬ LÝ': '⚡',
            'HOÀN THÀNH': '✅',
            'HỦY': '❌'
        };
        return icons[trangThai] || '❓';
    }
    
    inDanhSachDonHang() {
        console.log('\n📦 DANH SÁCH ĐƠN HÀNG');
        console.log('======================');
        
        if (this.danhSachDonHang.length === 0) {
            console.log('📭 Không có đơn hàng nào');
            return;
        }
        
        this.danhSachDonHang.forEach((donHang, index) => {
            const iconUuTien = this.layIconMucDoUuTien(donHang.mucDoUuTien);
            const iconTrangThai = this.layIconTrangThai(donHang.trangThai);
            
            console.log(`${index + 1}. ${iconUuTien} Đơn hàng #${donHang.id} ${iconTrangThai}`);
            console.log(`   👤 Khách hàng: ${donHang.tenKhachHang}`);
            console.log(`   🏠 Địa chỉ: ${donHang.diaChiGiaoHang}`);
            console.log(`   💰 Giá trị: ${donHang.tongGiaTri.toLocaleString('vi-VN')} VNĐ`);
            console.log(`   ⭐ Ưu tiên: ${this.layTenMucDoUuTien(donHang.mucDoUuTien)}`);
            console.log(`   📊 Trạng thái: ${donHang.trangThai}`);
            console.log(`   🕒 Tạo lúc: ${donHang.thoiGianTao.toLocaleString('vi-VN')}`);
            
            if (donHang.thoiGianXuLy) {
                console.log(`   ⚡ Xử lý lúc: ${donHang.thoiGianXuLy.toLocaleString('vi-VN')}`);
            }
            
            if (donHang.thoiGianHoanThanh) {
                console.log(`   ✅ Hoàn thành lúc: ${donHang.thoiGianHoanThanh.toLocaleString('vi-VN')}`);
                console.log(`   ⏱️ Thời gian xử lý: ${donHang.thoiGianXuLyPhut} phút`);
            }
            
            console.log(`   📝 Sản phẩm: ${donHang.danhSachSanPham.length} mặt hàng`);
            donHang.danhSachSanPham.forEach(sp => {
                console.log(`     • ${sp.ten} x${sp.soLuong} - ${(sp.gia * sp.soLuong).toLocaleString('vi-VN')} VNĐ`);
            });
            
            if (donHang.ghiChu) {
                console.log(`   💬 Ghi chú: ${donHang.ghiChu}`);
            }
            
            console.log('   ' + '-'.repeat(50));
        });
    }
    
    baoCaoThongKe() {
        const thongKe = {
            tongDonHang: this.danhSachDonHang.length,
            theoTrangThai: {},
            theoMucDoUuTien: {},
            tongDoanhThu: 0,
            doanhThuTheoUuTien: {},
            thoiGianXuLyTrungBinh: 0,
            donHangHoanThanh: []
        };
        
        // Thống kê cơ bản
        this.danhSachDonHang.forEach(dh => {
            // Theo trạng thái
            thongKe.theoTrangThai[dh.trangThai] = (thongKe.theoTrangThai[dh.trangThai] || 0) + 1;
            
            // Theo mức độ ưu tiên
            const tenUuTien = this.layTenMucDoUuTien(dh.mucDoUuTien);
            thongKe.theoMucDoUuTien[tenUuTien] = (thongKe.theoMucDoUuTien[tenUuTien] || 0) + 1;
            
            // Doanh thu
            thongKe.tongDoanhThu += dh.tongGiaTri;
            thongKe.doanhThuTheoUuTien[tenUuTien] = (thongKe.doanhThuTheoUuTien[tenUuTien] || 0) + dh.tongGiaTri;
            
            // Thời gian xử lý
            if (dh.trangThai === 'HOÀN THÀNH' && dh.thoiGianXuLyPhut) {
                thongKe.donHangHoanThanh.push(dh);
            }
        });
        
        // Tính thời gian xử lý trung bình
        if (thongKe.donHangHoanThanh.length > 0) {
            thongKe.thoiGianXuLyTrungBinh = thongKe.donHangHoanThanh.reduce((sum, dh) => 
                sum + dh.thoiGianXuLyPhut, 0) / thongKe.donHangHoanThanh.length;
        }
        
        console.log('\n📊 BÁO CÁO THỐNG KÊ ĐƠN HÀNG');
        console.log('=============================');
        console.log(`📦 Tổng số đơn hàng: ${thongKe.tongDonHang}`);
        console.log(`💰 Tổng doanh thu: ${thongKe.tongDoanhThu.toLocaleString('vi-VN')} VNĐ`);
        
        console.log('\n📊 Theo trạng thái:');
        Object.entries(thongKe.theoTrangThai).forEach(([trangThai, soLuong]) => {
            const icon = this.layIconTrangThai(trangThai);
            const tyLe = (soLuong / thongKe.tongDonHang * 100).toFixed(1);
            console.log(`  ${icon} ${trangThai}: ${soLuong} đơn (${tyLe}%)`);
        });
        
        console.log('\n⭐ Theo mức độ ưu tiên:');
        Object.entries(thongKe.theoMucDoUuTien).forEach(([mucDo, soLuong]) => {
            const doanhThu = thongKe.doanhThuTheoUuTien[mucDo];
            const tyLe = (soLuong / thongKe.tongDonHang * 100).toFixed(1);
            console.log(`  ${mucDo}: ${soLuong} đơn (${tyLe}%) - ${doanhThu.toLocaleString('vi-VN')} VNĐ`);
        });
        
        if (thongKe.donHangHoanThanh.length > 0) {
            console.log(`\n⏱️ Thời gian xử lý trung bình: ${thongKe.thoiGianXuLyTrungBinh.toFixed(1)} phút`);
            
            const nhanh = Math.min(...thongKe.donHangHoanThanh.map(dh => dh.thoiGianXuLyPhut));
            const cham = Math.max(...thongKe.donHangHoanThanh.map(dh => dh.thoiGianXuLyPhut));
            console.log(`⚡ Nhanh nhất: ${nhanh} phút | 🐌 Chậm nhất: ${cham} phút`);
        }
        
        return thongKe;
    }
}

// Sử dụng hệ thống
const heThongDonHang = new XuLyDonHang();

// Tạo đơn hàng
const dh1 = heThongDonHang.taoDonHang(
    'Nguyễn Văn An VIP',
    '123 Nguyễn Trãi, Q1, TP.HCM',
    [
        { ten: 'iPhone 15 Pro', gia: 25000000, soLuong: 1, loai: 'Điện tử' },
        { ten: 'Case iPhone', gia: 500000, soLuong: 1, loai: 'Phụ kiện' }
    ],
    'Chuyển khoản'
);

const dh2 = heThongDonHang.taoDonHang(
    'Trần Thị Bình',
    '456 Lê Lợi, Q3, TP.HCM', 
    [
        { ten: 'Áo thun', gia: 200000, soLuong: 2, loai: 'Thời trang' },
        { ten: 'Quần jean', gia: 500000, soLuong: 1, loai: 'Thời trang' }
    ],
    'Tiền mặt'
);

const dh3 = heThongDonHang.taoDonHang(
    'Lê Minh Cường Kim Cương',
    '789 Nguyễn Huệ, Q1, TP.HCM',
    [
        { ten: 'MacBook Pro M3', gia: 50000000, soLuong: 1, loai: 'Laptop' },
        { ten: 'Mouse Magic', gia: 2000000, soLuong: 1, loai: 'Phụ kiện' }
    ],
    'Chuyển khoản'
);

const dh4 = heThongDonHang.taoDonHang(
    'Phạm Thị Dung',
    '321 Điện Biên Phủ, Q.Bình Thạnh, TP.HCM',
    [
        { ten: 'Sách học JavaScript', gia: 300000, soLuong: 3, loai: 'Sách' }
    ],
    'COD'
);

// Sắp xếp và hiển thị theo các tiêu chí
console.log('\n📦 Sắp xếp theo mức độ ưu tiên:');
heThongDonHang.sapXepDonHangBangMergeSort('uuTien');
heThongDonHang.inDanhSachDonHang();

// Xử lý đơn hàng
console.log('\n⚡ BẮT ĐẦU XỬ LÝ ĐƠN HÀNG');
console.log('===========================');

// Xử lý đơn hàng ưu tiên cao trước
const donDauTien = heThongDonHang.danhSachDonHang[0];
heThongDonHang.xuLyDonHang(donDauTien.id, 'Đơn hàng VIP - xử lý ưu tiên');

// Mô phỏng thời gian xử lý
setTimeout(() => {
    heThongDonHang.hoanThanhDonHang(donDauTien.id, 'Đã đóng gói và chuyển cho shipper');
    
    // Xử lý đơn thứ hai
    const donThuHai = heThongDonHang.danhSachDonHang[1];
    heThongDonHang.xuLyDonHang(donThuHai.id, 'Đơn hàng bình thường');
    
    setTimeout(() => {
        heThongDonHang.hoanThanhDonHang(donThuHai.id, 'Hoàn thành đơn hàng');
        
        // Hiển thị kết quả cuối cùng
        console.log('\n📋 TRẠNG THÁI CUỐI CÙNG:');
        heThongDonHang.inDanhSachDonHang();
        heThongDonHang.baoCaoThongKe();
        
    }, 2000);
}, 1000);
```

## Phân Tích Hiệu Suất

### So Sánh Merge Sort Với Các Thuật Toán Khác

```javascript
class PhanTichHieuSuatMergeSort {
    static demThaoTacMergeSort(mang) {
        let soLanSoSanh = 0;
        let soLanSaoChep = 0;
        
        function mergeSort(arr) {
            if (arr.length <= 1) return arr;
            
            const mid = Math.floor(arr.length / 2);
            const left = mergeSort(arr.slice(0, mid));
            const right = mergeSort(arr.slice(mid));
            
            return merge(left, right);
        }
        
        function merge(left, right) {
            const result = [];
            let i = 0, j = 0;
            
            while (i < left.length && j < right.length) {
                soLanSoSanh++;
                if (left[i] <= right[j]) {
                    result.push(left[i]);
                    i++;
                } else {
                    result.push(right[j]);
                    j++;
                }
                soLanSaoChep++;
            }
            
            while (i < left.length) {
                result.push(left[i]);
                i++;
                soLanSaoChep++;
            }
            
            while (j < right.length) {
                result.push(right[j]);
                j++;
                soLanSaoChep++;
            }
            
            return result;
        }
        
        const ketQua = mergeSort([...mang]);
        return { soLanSoSanh, soLanSaoChep, ketQua };
    }
    
    static demThaoTacQuickSort(mang) {
        let soLanSoSanh = 0;
        let soLanHoanDoi = 0;
        
        function quickSort(arr, low, high) {
            if (low < high) {
                const pi = partition(arr, low, high);
                quickSort(arr, low, pi - 1);
                quickSort(arr, pi + 1, high);
            }
        }
        
        function partition(arr, low, high) {
            const pivot = arr[high];
            let i = low - 1;
            
            for (let j = low; j <= high - 1; j++) {
                soLanSoSanh++;
                if (arr[j] < pivot) {
                    i++;
                    [arr[i], arr[j]] = [arr[j], arr[i]];
                    soLanHoanDoi++;
                }
            }
            
            [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
            soLanHoanDoi++;
            return i + 1;
        }
        
        const mangSaoChep = [...mang];
        quickSort(mangSaoChep, 0, mangSaoChep.length - 1);
        
        return { soLanSoSanh, soLanHoanDoi, ketQua: mangSaoChep };
    }
    
    static soSanhThuatToan() {
        const testCases = [
            { ten: 'Mảng đã sắp xếp', mang: [1, 2, 3, 4, 5, 6, 7, 8] },
            { ten: 'Mảng ngược hoàn toàn', mang: [8, 7, 6, 5, 4, 3, 2, 1] },
            { ten: 'Mảng ngẫu nhiên', mang: [5, 2, 8, 1, 9, 3, 7, 4] },
            { ten: 'Mảng có nhiều phần tử trùng', mang: [3, 1, 3, 1, 3, 1, 3] },
            { ten: 'Mảng lớn ngẫu nhiên', mang: Array.from({length: 100}, () => Math.floor(Math.random() * 100)) }
        ];
        
        console.log('SO SÁNH HIỆU SUẤT: MERGE SORT vs QUICK SORT');
        console.log('===========================================');
        
        testCases.forEach(testCase => {
            console.log(`\n📊 ${testCase.ten} (${testCase.mang.length} phần tử)`);
            console.log('─'.repeat(60));
            
            const ketQuaMerge = this.demThaoTacMergeSort(testCase.mang);
            const ketQuaQuick = this.demThaoTacQuickSort(testCase.mang);
            
            // Merge Sort
            console.log('🔵 MERGE SORT:');
            console.log(`   So sánh: ${ketQuaMerge.soLanSoSanh}`);
            console.log(`   Sao chép: ${ketQuaMerge.soLanSaoChep}`);
            console.log(`   Tổng thao tác: ${ketQuaMerge.soLanSoSanh + ketQuaMerge.soLanSaoChep}`);
            
            // Quick Sort
            console.log('🟠 QUICK SORT:');
            console.log(`   So sánh: ${ketQuaQuick.soLanSoSanh}`);
            console.log(`   Hoán đổi: ${ketQuaQuick.soLanHoanDoi}`);
            console.log(`   Tổng thao tác: ${ketQuaQuick.soLanSoSanh + ketQuaQuick.soLanHoanDoi}`);
            
            // Phân tích
            console.log('📈 PHÂN TÍCH:');
            const tongMerge = ketQuaMerge.soLanSoSanh + ketQuaMerge.soLanSaoChep;
            const tongQuick = ketQuaQuick.soLanSoSanh + ketQuaQuick.soLanHoanDoi;
            
            if (tongMerge < tongQuick) {
                console.log(`   🏆 Merge Sort hiệu quả hơn (${tongMerge} vs ${tongQuick})`);
            } else if (tongQuick < tongMerge) {
                console.log(`   🏆 Quick Sort hiệu quả hơn (${tongQuick} vs ${tongMerge})`);
            } else {
                console.log(`   🤝 Hiệu suất tương đương (${tongMerge})`);
            }
            
            // Đặc điểm của Merge Sort
            console.log('   🎯 Đặc điểm Merge Sort:');
            console.log('     ✅ Ổn định (stable sorting)');
            console.log('     ✅ Hiệu suất dự đoán được O(n log n)');
            console.log('     ❌ Cần thêm bộ nhớ O(n)');
            console.log('     ✅ Phù hợp với dữ liệu lớn');
        });
    }
    
    static phanTichDoPHucTapTheoKichThuoc() {
        console.log('\n📏 PHÂN TÍCH ĐỘ PHỨC TẠP THEO KÍCH THƯỚC');
        console.log('=======================================');
        
        const kichThuocMang = [10, 50, 100, 200, 500, 1000];
        
        console.log('Kích thước | So sánh | Sao chép | Tổng | Lý thuyết O(n log n)');
        console.log('─'.repeat(70));
        
        kichThuocMang.forEach(n => {
            const mang = Array.from({ length: n }, () => Math.floor(Math.random() * 1000));
            const ketQua = this.demThaoTacMergeSort(mang);
            const lyThuyet = Math.floor(n * Math.log2(n));
            
            console.log(`${n.toString().padStart(10)} | ${ketQua.soLanSoSanh.toString().padStart(7)} | ${ketQua.soLanSaoChep.toString().padStart(8)} | ${(ketQua.soLanSoSanh + ketQua.soLanSaoChep).toString().padStart(4)} | ${lyThuyet.toString().padStart(18)}`);
        });
        
        console.log('\n💡 Nhận xét:');
        console.log('• Merge Sort có độ phức tạp thời gian ổn định O(n log n)');
        console.log('• Số lần thao tác thực tế tương đối gần với lý thuyết');
        console.log('• Hiệu suất không thay đổi với các loại dữ liệu khác nhau');
        console.log('• Phù hợp cho các ứng dụng cần hiệu suất dự đoán được');
    }
    
    static kiemTraTinhOnDinh() {
        console.log('\n🎯 KIỂM TRA TÍNH ỔN ĐỊNH CỦA MERGE SORT');
        console.log('=====================================');
        
        // Test với mảng có các phần tử trùng giá trị
        const testStability = [
            { gia: 5, ten: 'A' },
            { gia: 3, ten: 'B' },
            { gia: 5, ten: 'C' },
            { gia: 1, ten: 'D' },
            { gia: 3, ten: 'E' },
            { gia: 5, ten: 'F' }
        ];
        
        console.log('Mảng gốc:', testStability.map(item => `${item.ten}(${item.gia})`).join(', '));
        
        // Merge sort theo giá trị
        const sorted = this.mergeSortByValue([...testStability]);
        
        console.log('Sau merge sort:', sorted.map(item => `${item.ten}(${item.gia})`).join(', '));
        
        // Kiểm tra tính ổn định
        let isStable = true;
        const groups = {};
        
        // Nhóm theo giá trị
        testStability.forEach((item, index) => {
            if (!groups[item.gia]) groups[item.gia] = [];
            groups[item.gia].push({ ...item, originalIndex: index });
        });
        
        // Kiểm tra thứ tự trong từng nhóm
        Object.values(groups).forEach(group => {
            if (group.length > 1) {
                for (let i = 0; i < group.length - 1; i++) {
                    const item1 = sorted.find(s => s.ten === group[i].ten);
                    const item2 = sorted.find(s => s.ten === group[i + 1].ten);
                    
                    const index1 = sorted.indexOf(item1);
                    const index2 = sorted.indexOf(item2);
                    
                    if (item1.gia === item2.gia && group[i].originalIndex > group[i + 1].originalIndex && index1 < index2) {
                        isStable = false;
                        break;
                    }
                }
            }
        });
        
        console.log(`Tính ổn định: ${isStable ? '✅ Ổn định' : '❌ Không ổn định'}`);
        console.log('📝 Lưu ý: Merge Sort là thuật toán ổn định khi được cài đặt đúng cách');
        
        // Hiển thị chi tiết các nhóm có cùng giá trị
        console.log('\nChi tiết các nhóm có cùng giá trị:');
        Object.entries(groups).forEach(([gia, items]) => {
            if (items.length > 1) {
                const sortedGroup = sorted.filter(s => s.gia == gia);
                console.log(`Giá trị ${gia}: ${sortedGroup.map(s => s.ten).join(' → ')}`);
            }
        });
    }
    
    static mergeSortByValue(mang) {
        if (mang.length <= 1) return mang;
        
        const mid = Math.floor(mang.length / 2);
        const left = this.mergeSortByValue(mang.slice(0, mid));
        const right = this.mergeSortByValue(mang.slice(mid));
        
        return this.mergeByValue(left, right);
    }
    
    static mergeByValue(left, right) {
        const result = [];
        let i = 0, j = 0;
        
        while (i < left.length && j < right.length) {
            // Sử dụng <= để đảm bảo tính ổn định
            if (left[i].gia <= right[j].gia) {
                result.push(left[i]);
                i++;
            } else {
                result.push(right[j]);
                j++;
            }
        }
        
        while (i < left.length) {
            result.push(left[i]);
            i++;
        }
        
        while (j < right.length) {
            result.push(right[j]);
            j++;
        }
        
        return result;
    }
    
    static so SanhBoNhoSuDung() {
        console.log('\n💾 PHÂN TÍCH SỬ DỤNG BỘ NHỚ');
        console.log('============================');
        
        const kichThuocMang = [100, 500, 1000, 2000];
        
        console.log('Kích thước | Bộ nhớ Merge Sort | Bộ nhớ Quick Sort | Tỷ lệ M/Q');
        console.log('─'.repeat(65));
        
        kichThuocMang.forEach(n => {
            // Merge Sort: O(n) bộ nhớ bổ sung
            const boNhoMerge = n * 4; // 4 bytes per integer
            
            // Quick Sort: O(log n) bộ nhớ cho stack đệ quy (trường hợp tốt)
            const boNhoQuick = Math.log2(n) * 4;
            
            const tiLe = (boNhoMerge / boNhoQuick).toFixed(1);
            
            console.log(`${n.toString().padStart(10)} | ${(boNhoMerge/1024).toFixed(1)} KB`.padStart(17) + ` | ${(boNhoQuick/1024).toFixed(3)} KB`.padStart(17) + ` | ${tiLe}x`.padStart(10));
        });
        
        console.log('\n💡 Nhận xét về bộ nhớ:');
        console.log('• Merge Sort cần O(n) bộ nhớ bổ sung để lưu mảng tạm');
        console.log('• Quick Sort chỉ cần O(log n) bộ nhớ cho stack đệ quy');
        console.log('• Với dữ liệu lớn, bộ nhớ có thể là yếu tố quan trọng');
        console.log('• Các biến thể in-place của Merge Sort phức tạp hơn');
    }
}

// Chạy các phân tích
PhanTichHieuSuatMergeSort.soSanhThuatToan();
PhanTichHieuSuatMergeSort.phanTichDoPHucTapTheoKichThuoc();
PhanTichHieuSuatMergeSort.kiemTraTinhOnDinh();
PhanTichHieuSuatMergeSort.soSanhBoNhoSuDung();
```

## Biến Thể và Tối Ưu

### 1. Natural Merge Sort

```javascript
function naturalMergeSort(mang) {
    console.log('NATURAL MERGE SORT');
    console.log('==================');
    console.log(`Mảng ban đầu: [${mang.join(', ')}]`);
    
    const ketQua = [...mang];
    
    while (true) {
        const runs = timCacDoanTangDan(ketQua);
        
        console.log(`\nTìm thấy ${runs.length} đoạn tăng dần:`);
        runs.forEach((run, index) => {
            console.log(`  Đoạn ${index + 1}: [${run.join(', ')}]`);
        });
        
        if (runs.length <= 1) {
            console.log('Mảng đã được sắp xếp!');
            break;
        }
        
        // Trộn từng cặp runs
        const newRuns = [];
        for (let i = 0; i < runs.length; i += 2) {
            if (i + 1 < runs.length) {
                const merged = tronHaiMang(runs[i], runs[i + 1]);
                console.log(`Trộn đoạn ${i + 1} và ${i + 2}: [${merged.join(', ')}]`);
                newRuns.push(merged);
            } else {
                newRuns.push(runs[i]);
            }
        }
        
        // Xây dựng lại mảng
        ketQua.length = 0;
        newRuns.forEach(run => ketQua.push(...run));
        
        console.log(`Kết quả lượt này: [${ketQua.join(', ')}]`);
    }
    
    return ketQua;
}

function timCacDoanTangDan(mang) {
    const runs = [];
    let currentRun = [mang[0]];
    
    for (let i = 1; i < mang.length; i++) {
        if (mang[i] >= mang[i - 1]) {
            currentRun.push(mang[i]);
        } else {
            runs.push(currentRun);
            currentRun = [mang[i]];
        }
    }
    
    runs.push(currentRun);
    return runs;
}

function tronHaiMang(mang1, mang2) {
    const ketQua = [];
    let i = 0, j = 0;
    
    while (i < mang1.length && j < mang2.length) {
        if (mang1[i] <= mang2[j]) {
            ketQua.push(mang1[i]);
            i++;
        } else {
            ketQua.push(mang2[j]);
            j++;
        }
    }
    
    ketQua.push(...mang1.slice(i));
    ketQua.push(...mang2.slice(j));
    
    return ketQua;
}
```

### 2. 3-Way Merge Sort

```javascript
function threeWayMergeSort(mang) {
    console.log('3-WAY MERGE SORT');
    console.log('================');
    
    return threeWayMergeSortRecursive([...mang], 0);
}

function threeWayMergeSortRecursive(mang, mucDo = 0) {
    const khoangCach = '  '.repeat(mucDo);
    
    if (mang.length <= 1) {
        return mang;
    }
    
    console.log(`${khoangCach}Chia mảng: [${mang.join(', ')}]`);
    
    // Chia thành 3 phần
    const size = Math.floor(mang.length / 3);
    const phan1 = mang.slice(0, size);
    const phan2 = mang.slice(size, size * 2);
    const phan3 = mang.slice(size * 2);
    
    console.log(`${khoangCach}  Phần 1: [${phan1.join(', ')}]`);
    console.log(`${khoangCach}  Phần 2: [${phan2.join(', ')}]`);
    console.log(`${khoangCach}  Phần 3: [${phan3.join(', ')}]`);
    
    // Đệ quy sắp xếp từng phần
    const phan1DaSapXep = threeWayMergeSortRecursive(phan1, mucDo + 1);
    const phan2DaSapXep = threeWayMergeSortRecursive(phan2, mucDo + 1);
    const phan3DaSapXep = threeWayMergeSortRecursive(phan3, mucDo + 1);
    
    // Trộn 3 phần
    const ketQua = tronBaMang(phan1DaSapXep, phan2DaSapXep, phan3DaSapXep);
    
    console.log(`${khoangCach}Kết quả trộn: [${ketQua.join(', ')}]`);
    
    return ketQua;
}

function tronBaMang(mang1, mang2, mang3) {
    const ketQua = [];
    let i = 0, j = 0, k = 0;
    
    // Trộn cả 3 mảng đồng thời
    while (i < mang1.length && j < mang2.length && k < mang3.length) {
        if (mang1[i] <= mang2[j] && mang1[i] <= mang3[k]) {
            ketQua.push(mang1[i]);
            i++;
        } else if (mang2[j] <= mang3[k]) {
            ketQua.push(mang2[j]);
            j++;
        } else {
            ketQua.push(mang3[k]);
            k++;
        }
    }
    
    // Trộn 2 mảng còn lại
    while (i < mang1.length && j < mang2.length) {
        if (mang1[i] <= mang2[j]) {
            ketQua.push(mang1[i]);
            i++;
        } else {
            ketQua.push(mang2[j]);
            j++;
        }
    }
    
    while (i < mang1.length && k < mang3.length) {
        if (mang1[i] <= mang3[k]) {
            ketQua.push(mang1[i]);
            i++;
        } else {
            ketQua.push(mang3[k]);
            k++;
        }
    }
    
    while (j < mang2.length && k < mang3.length) {
        if (mang2[j] <= mang3[k]) {
            ketQua.push(mang2[j]);
            j++;
        } else {
            ketQua.push(mang3[k]);
            k++;
        }
    }
    
    // Thêm phần tử còn lại
    ketQua.push(...mang1.slice(i));
    ketQua.push(...mang2.slice(j));
    ketQua.push(...mang3.slice(k));
    
    return ketQua;
}
```

### 3. In-Place Merge Sort

```javascript
function inPlaceMergeSort(mang) {
    console.log('IN-PLACE MERGE SORT');
    console.log('===================');
    console.log(`Mảng ban đầu: [${mang.join(', ')}]`);
    
    const ketQua = [...mang];
    inPlaceMergeSortRecursive(ketQua, 0, ketQua.length - 1);
    
    return ketQua;
}

function inPlaceMergeSortRecursive(mang, trai, phai) {
    if (trai >= phai) return;
    
    const giua = Math.floor((trai + phai) / 2);
    
    console.log(`Chia: [${trai}..${giua}] và [${giua + 1}..${phai}]`);
    
    inPlaceMergeSortRecursive(mang, trai, giua);
    inPlaceMergeSortRecursive(mang, giua + 1, phai);
    
    inPlaceMerge(mang, trai, giua, phai);
    
    console.log(`Sau trộn [${trai}..${phai}]: [${mang.slice(trai, phai + 1).join(', ')}]`);
}

function inPlaceMerge(mang, trai, giua, phai) {
    let start2 = giua + 1;
    
    // Nếu mảng đã được sắp xếp
    if (mang[giua] <= mang[start2]) {
        return;
    }
    
    while (trai <= giua && start2 <= phai) {
        // Nếu phần tử ở vị trí đúng
        if (mang[trai] <= mang[start2]) {
            trai++;
        } else {
            const value = mang[start2];
            let index = start2;
            
            // Dịch chuyển tất cả phần tử từ trai đến start2
            while (index !== trai) {
                mang[index] = mang[index - 1];
                index--;
            }
            
            mang[trai] = value;
            
            // Cập nhật các pointer
            trai++;
            giua++;
            start2++;
        }
    }
}
```

### 4. Parallel Merge Sort

```javascript
class ParallelMergeSort {
    static async sort(mang, maxWorkers = 4) {
        console.log('PARALLEL MERGE SORT');
        console.log('===================');
        console.log(`Mảng ban đầu: [${mang.join(', ')}] (${mang.length} phần tử)`);
        console.log(`Sử dụng tối đa ${maxWorkers} workers`);
        
        if (mang.length <= 1) return mang;
        
        return await this.parallelMergeSortRecursive([...mang], maxWorkers);
    }
    
    static async parallelMergeSortRecursive(mang, workersConLai) {
        if (mang.length <= 1) return mang;
        
        // Nếu mảng nhỏ hoặc không còn workers, dùng merge sort tuần tự
        if (mang.length < 100 || workersConLai <= 1) {
            return this.sequentialMergeSort(mang);
        }
        
        const giua = Math.floor(mang.length / 2);
        const mangTrai = mang.slice(0, giua);
        const mangPhai = mang.slice(giua);
        
        console.log(`Chia song song: ${mangTrai.length} và ${mangPhai.length} phần tử`);
        
        // Chạy song song với Promise.all
        const [mangTraiDaSapXep, mangPhaiDaSapXep] = await Promise.all([
            this.parallelMergeSortRecursive(mangTrai, Math.floor(workersConLai / 2)),
            this.parallelMergeSortRecursive(mangPhai, Math.floor(workersConLai / 2))
        ]);
        
        // Trộn kết quả
        const ketQua = this.merge(mangTraiDaSapXep, mangPhaiDaSapXep);
        console.log(`Hoàn thành trộn: ${ketQua.length} phần tử`);
        
        return ketQua;
    }
    
    static sequentialMergeSort(mang) {
        if (mang.length <= 1) return mang;
        
        const giua = Math.floor(mang.length / 2);
        const trai = this.sequentialMergeSort(mang.slice(0, giua));
        const phai = this.sequentialMergeSort(mang.slice(giua));
        
        return this.merge(trai, phai);
    }
    
    static merge(trai, phai) {
        const ketQua = [];
        let i = 0, j = 0;
        
        while (i < trai.length && j < phai.length) {
            if (trai[i] <= phai[j]) {
                ketQua.push(trai[i]);
                i++;
            } else {
                ketQua.push(phai[j]);
                j++;
            }
        }
        
        ketQua.push(...trai.slice(i));
        ketQua.push(...phai.slice(j));
        
        return ketQua;
    }
    
    static async demo() {
        // Tạo mảng lớn để demo
        const mangLon = Array.from({ length: 1000 }, () => Math.floor(Math.random() * 1000));
        
        console.log('='.repeat(50));
        console.log('DEMO PARALLEL MERGE SORT');
        console.log('='.repeat(50));
        
        // So sánh thời gian
        console.time('Parallel Merge Sort');
        const ketQuaParallel = await this.sort(mangLon, 4);
        console.timeEnd('Parallel Merge Sort');
        
        console.time('Sequential Merge Sort');
        const ketQuaSequential = this.sequentialMergeSort([...mangLon]);
        console.timeEnd('Sequential Merge Sort');
        
        // Kiểm tra kết quả
        const dungKetQua = JSON.stringify(ketQuaParallel) === JSON.stringify(ketQuaSequential);
        console.log(`\nKết quả chính xác: ${dungKetQua ? '✅' : '❌'}`);
        
        return ketQuaParallel;
    }
}

// Chạy demo
// ParallelMergeSort.demo();
```

## Ưu Điểm và Nhược Điểm

### Ưu Điểm

1. **Hiệu suất ổn định**: O(n log n) trong mọi trường hợp
2. **Ổn định**: Bảo toàn thứ tự tương đối của các phần tử bằng nhau
3. **Dự đoán được**: Hiệu suất không phụ thuộc vào thứ tự đầu vào
4. **Phân tách được**: Phù hợp cho xử lý song song
5. **Phù hợp với dữ liệu lớn**: Hiệu quả với các tập dữ liệu lớn
6. **External sorting**: Có thể sắp xếp dữ liệu không vừa trong bộ nhớ

### Nhược Điểm

1. **Cần thêm bộ nhớ**: O(n) bộ nhớ bổ sung
2. **Overhead**: Chi phí sao chép dữ liệu
3. **Không adaptive**: Không tối ưu cho dữ liệu gần như đã sắp xếp
4. **Phức tạp hơn**: Khó cài đặt so với các thuật toán đơn giản

## Độ Phức Tạp

| Trường hợp         | Thời gian       | Không gian | Ổn định | Nhận xét                    |
| ------------------ | :-------------: | :---------: | :-----: | :-------------------------- |
| **Tốt nhất**       | O(n log n)      | O(n)        | Có      | Hiệu suất nhất quán         |
| **Trung bình**     | O(n log n)      | O(n)        | Có      | Reliable performance        |
| **Xấu nhất**       | O(n log n)      | O(n)        | Có      | Guaranteed performance      |

### Phân Tích Chi Tiết

- **Số lần chia**: log₂(n) cấp độ
- **Số lần trộn**: n phần tử ở mỗi cấp độ
- **Tổng cộng**: O(n) × O(log n) = O(n log n)
- **Bộ nhớ**: O(n) cho mảng tạm khi trộn

## Khi Nào Nên Sử Dụng

### Phù Hợp Khi:
- Cần hiệu suất ổn định và dự đoán được
- Cần tính ổn định (stable sorting)
- Làm việc với dữ liệu lớn
- Xử lý song song
- External sorting (dữ liệu không vừa RAM)
- Hệ thống real-time cần đảm bảo thời gian

### Không Phù Hợp Khi:
- Bộ nhớ bị hạn chế nghiêm ngặt
- Dữ liệu nhỏ (overhead không đáng giá)
- Cần in-place sorting
- Dữ liệu đã gần như sắp xếp (insertion sort tốt hơn)

## So Sánh Với Thuật Toán Khác

| Thuật toán      | Thời gian TB   | Thời gian Xấu nhất | Bộ nhớ | Ổn định | Ghi chú                |
| --------------- | :------------: | :----------------: | :----: | :-----: | :--------------------- |
| **Merge Sort**  | O(n log n)     | O(n log n)         | O(n)   | Có      | Predictable, parallel  |
| **Quick Sort**  | O(n log n)     | O(n²)              | O(log n)| Không   | Fast average, in-place |
| **Heap Sort**   | O(n log n)     | O(n log n)         | O(1)   | Không   | In-place, guaranteed   |
| **Tim Sort**    | O(n)           | O(n log n)         | O(n)   | Có      | Adaptive, hybrid       |

## Tài Liệu Tham Khảo

- [Wikipedia - Merge Sort](https://vi.wikipedia.org/wiki/S%E1%BA%AFp_x%E1%BA%BFp_tr%E1%BB%99n)
- [GeeksforGeeks - Merge Sort](https://www.geeksforgeeks.org/merge-sort/)
- [Visualgo - Merge Sort](https://visualgo.net/en/sorting)
- [MIT OpenCourseWare - Merge Sort](https://ocw.mit.edu/courses/electrical-engineering-and-computer-science/6-006-introduction-to-algorithms-fall-2011/)

## Bài Tập Thực Hành

### Bài 1: Merge Sort Cho Linked List
Cài đặt Merge Sort để sắp xếp danh sách liên kết mà không cần mảng bổ sung.

### Bài 2: K-Way Merge
Mở rộng để trộn k mảng đã sắp xếp thành một mảng duy nhất.

### Bài 3: External Merge Sort
Cài đặt Merge Sort cho dữ liệu lớn không vừa trong bộ nhớ.

### Bài 4: Count Inversions
Sử dụng Merge Sort để đếm số cặp nghịch thế trong mảng.

### Bài 5: Merge Sort With Custom Comparator
Cài đặt Merge Sort có thể sắp xếp theo tiêu chí tùy chỉnh.

---

*Post ID: wjn0v8htv9m9znp*  
*Category: Sorting Algorithms*  
*Created: 21/8/2025*  
*Updated: 29/8/2025*
