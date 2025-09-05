---
title: "Sắp Xếp Đống (Heap Sort)"
postId: "vfzrlllxtmu0k8s"
category: "Sorting Algorithms"
created: "21/8/2025"
updated: "29/8/2025"
---

# Sắp Xếp Đống (Heap Sort)


Heap Sort là một thuật toán sắp xếp dựa trên so sánh. Heap Sort có thể được coi là một phiên bản cải tiến của Selection Sort: giống như thuật toán đó, nó chia đầu vào thành một vùng đã sắp xếp và một vùng chưa sắp xếp, và nó lặp đi lặp lại thu hẹp vùng chưa sắp xếp bằng cách trích xuất phần tử lớn nhất và di chuyển nó đến vùng đã sắp xếp. Cải tiến bao gồm việc sử dụng cấu trúc dữ liệu heap thay vì tìm kiếm tuyến tính để tìm ra giá trị lớn nhất.

![Minh họa thuật toán](https://upload.wikimedia.org/wikipedia/commons/1/1b/Sorting_heapsort_anim.gif)

![Minh họa thuật toán](https://upload.wikimedia.org/wikipedia/commons/4/4d/Heapsort-example.gif)

## Giải Thích Chi Tiết

### Cấu Trúc Dữ Liệu Heap

Trước khi hiểu Heap Sort, chúng ta cần hiểu về cấu trúc dữ liệu Heap:

**Heap** là một cây nhị phân hoàn chỉnh với tính chất đặc biệt:
- **Max Heap**: Mỗi nút cha có giá trị lớn hơn hoặc bằng các nút con
- **Min Heap**: Mỗi nút cha có giá trị nhỏ hơn hoặc bằng các nút con

**Đặc điểm quan trọng:**
- Cây nhị phân hoàn chỉnh (complete binary tree)
- Có thể biểu diễn bằng mảng
- Phần tử gốc luôn là phần tử lớn nhất (Max Heap) hoặc nhỏ nhất (Min Heap)

### Biểu Diễn Heap Bằng Mảng

Trong mảng, với chỉ số bắt đầu từ 0:
- Nút cha của nút `i`: `Math.floor((i-1)/2)`
- Nút con trái của nút `i`: `2*i + 1`
- Nút con phải của nút `i`: `2*i + 2`

**Ví dụ Max Heap:**
```
Mảng: [50, 30, 40, 10, 20, 15, 35]

Biểu diễn cây:
       50
      /  \
    30    40
   / \   / \
  10 20 15 35
```

### Cách Hoạt Động Của Heap Sort

Heap Sort hoạt động theo hai giai đoạn chính:

1. **Xây dựng Max Heap**: Chuyển đổi mảng thành Max Heap
2. **Trích xuất phần tử**: Lặp đi lặp lại lấy phần tử lớn nhất và sắp xếp

### Ví Dụ Minh Họa Chi Tiết

Giả sử chúng ta có mảng: `[4, 10, 3, 5, 1]`

**Giai đoạn 1: Xây dựng Max Heap**

Bước 1: Bắt đầu từ nút cha cuối cùng (index = 1, giá trị = 10)
```
       4
      / \
    10   3
   / \
  5   1
```

Bước 2: Heapify từ index 1
- So sánh 10 với con của nó (5, 1)
- 10 > 5 và 10 > 1, không cần đổi

Bước 3: Heapify từ index 0 (root)
- So sánh 4 với con của nó (10, 3)
- 10 > 4, hoán đổi 4 và 10
```
       10
      / \
     4   3
   / \
  5   1
```

- Tiếp tục heapify xuống: so sánh 4 với (5, 1)
- 5 > 4, hoán đổi 4 và 5
```
       10
      / \
     5   3
   / \
  4   1
```

**Max Heap đã hoàn thành: [10, 5, 3, 4, 1]**

**Giai đoạn 2: Sắp xếp**

Bước 1: Hoán đổi root (10) với phần tử cuối (1)
- Mảng: [1, 5, 3, 4, 10]
- Phần đã sắp xếp: [10]
- Heapify lại với kích thước heap = 4

Bước 2: Hoán đổi root (5) với phần tử cuối của heap (4)
- Mảng: [4, 1, 3, 5, 10]
- Phần đã sắp xếp: [5, 10]
- Heapify lại với kích thước heap = 3

Tiếp tục cho đến khi hoàn thành...

**Kết quả cuối cùng: [1, 3, 4, 5, 10]**

## Cài Đặt Trong JavaScript

### Cài Đặt Cơ Bản (In-place)

```javascript
function heapSort(mang) {
    const n = mang.length;
    
    // Xây dựng max heap
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        heapify(mang, n, i);
    }
    
    // Trích xuất các phần tử từ heap
    for (let i = n - 1; i > 0; i--) {
        // Di chuyển root hiện tại (lớn nhất) đến cuối
        [mang[0], mang[i]] = [mang[i], mang[0]];
        
        // Gọi heapify trên heap bị giảm
        heapify(mang, i, 0);
    }
    
    return mang;
}

function heapify(mang, n, i) {
    let largest = i; // Khởi tạo largest là root
    let left = 2 * i + 1; // con trái
    let right = 2 * i + 2; // con phải
    
    // Nếu con trái lớn hơn root
    if (left < n && mang[left] > mang[largest]) {
        largest = left;
    }
    
    // Nếu con phải lớn hơn largest hiện tại
    if (right < n && mang[right] > mang[largest]) {
        largest = right;
    }
    
    // Nếu largest không phải root
    if (largest !== i) {
        [mang[i], mang[largest]] = [mang[largest], mang[i]];
        
        // Đệ quy heapify sub-tree bị ảnh hưởng
        heapify(mang, n, largest);
    }
}

// Ví dụ sử dụng
const danhSachSo = [4, 10, 3, 5, 1];
console.log('Mảng gốc:', danhSachSo);
console.log('Mảng đã sắp xếp:', heapSort([...danhSachSo]));
```

### Cài Đặt Với Theo Dõi Quá Trình

```javascript
function heapSortCoTheoDoi(mang) {
    const n = mang.length;
    
    console.log(`Bắt đầu Heap Sort với mảng: [${mang.join(', ')}]`);
    console.log('='.repeat(50));
    
    console.log('\n🏗️  GIAI ĐOẠN 1: XÂY DỰNG MAX HEAP');
    console.log('===================================');
    
    // Xây dựng max heap
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        console.log(`\nHeapify từ index ${i} (giá trị: ${mang[i]})`);
        heapifyCoTheoDoi(mang, n, i, `  `);
        console.log(`Kết quả: [${mang.join(', ')}]`);
    }
    
    console.log(`\n✅ Max Heap hoàn thành: [${mang.join(', ')}]`);
    
    console.log('\n📤 GIAI ĐOẠN 2: TRÍCH XUẤT VÀ SẮP XẾP');
    console.log('=====================================');
    
    // Trích xuất các phần tử từ heap
    for (let i = n - 1; i > 0; i--) {
        console.log(`\nBước ${n - i}: Trích xuất phần tử lớn nhất`);
        console.log(`  Hoán đổi root (${mang[0]}) với phần tử cuối (${mang[i]})`);
        
        // Di chuyển root hiện tại đến cuối
        [mang[0], mang[i]] = [mang[i], mang[0]];
        
        console.log(`  Sau hoán đổi: [${mang.join(', ')}]`);
        console.log(`  Phần đã sắp xếp: [${mang.slice(i).join(', ')}]`);
        console.log(`  Heapify lại với kích thước ${i}`);
        
        // Heapify heap bị giảm
        heapifyCoTheoDoi(mang, i, 0, `    `);
        console.log(`  Heap sau heapify: [${mang.slice(0, i).join(', ')}]`);
    }
    
    console.log(`\n🎉 Kết quả cuối cùng: [${mang.join(', ')}]`);
    return mang;
}

function heapifyCoTheoDoi(mang, n, i, indent = '') {
    let largest = i;
    let left = 2 * i + 1;
    let right = 2 * i + 2;
    
    console.log(`${indent}So sánh node ${i} (${mang[i]}) với các con:`);
    
    // So sánh với con trái
    if (left < n) {
        console.log(`${indent}  Con trái (${left}): ${mang[left]}`);
        if (mang[left] > mang[largest]) {
            largest = left;
            console.log(`${indent}  -> Con trái lớn hơn`);
        }
    }
    
    // So sánh với con phải
    if (right < n) {
        console.log(`${indent}  Con phải (${right}): ${mang[right]}`);
        if (mang[right] > mang[largest]) {
            largest = right;
            console.log(`${indent}  -> Con phải lớn hơn`);
        }
    }
    
    // Hoán đổi nếu cần
    if (largest !== i) {
        console.log(`${indent}  Hoán đổi ${mang[i]} <-> ${mang[largest]}`);
        [mang[i], mang[largest]] = [mang[largest], mang[i]];
        
        // Đệ quy heapify
        console.log(`${indent}  Tiếp tục heapify từ ${largest}`);
        heapifyCoTheoDoi(mang, n, largest, indent + '  ');
    } else {
        console.log(`${indent}  Không cần hoán đổi`);
    }
}
```

### Cài Đặt Class (Theo Mẫu Dự Án)

```javascript
import Sort from '../Sort';
import MinHeap from '../../../data-structures/heap/MinHeap';

export default class HeapSort extends Sort {
    sort(mangGoc) {
        const mangDaSapXep = [];
        const minHeap = new MinHeap(this.callbacks.compareCallback);

        // Chèn tất cả phần tử mảng vào heap
        mangGoc.forEach((phanTu) => {
            // Gọi callback để theo dõi truy cập
            this.callbacks.visitingCallback(phanTu);

            minHeap.add(phanTu);
        });

        // Bây giờ chúng ta có min heap với phần tử nhỏ nhất luôn ở trên
        // Hãy poll phần tử nhỏ nhất từng cái một để tạo thành mảng đã sắp xếp
        while (!minHeap.isEmpty()) {
            const phanTuNhoTiepTheo = minHeap.poll();

            // Gọi callback để theo dõi truy cập
            this.callbacks.visitingCallback(phanTuNhoTiepTheo);

            mangDaSapXep.push(phanTuNhoTiepTheo);
        }

        return mangDaSapXep;
    }
}
```

### Cài Đặt Max Heap In-place

```javascript
class MaxHeapInPlace {
    static sort(mang) {
        const n = mang.length;
        
        // Xây dựng max heap
        MaxHeapInPlace.buildMaxHeap(mang);
        
        // Một by một trích xuất phần tử từ heap
        for (let i = n - 1; i > 0; i--) {
            // Di chuyển root hiện tại đến cuối
            MaxHeapInPlace.swap(mang, 0, i);
            
            // Gọi max heapify trên heap bị giảm
            MaxHeapInPlace.maxHeapify(mang, i, 0);
        }
        
        return mang;
    }
    
    static buildMaxHeap(mang) {
        const n = mang.length;
        
        // Bắt đầu từ nút cha cuối cùng và heapify mỗi nút
        for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
            MaxHeapInPlace.maxHeapify(mang, n, i);
        }
    }
    
    static maxHeapify(mang, heapSize, i) {
        const left = 2 * i + 1;
        const right = 2 * i + 2;
        let largest = i;
        
        // Nếu con trái lớn hơn root
        if (left < heapSize && mang[left] > mang[largest]) {
            largest = left;
        }
        
        // Nếu con phải lớn hơn largest hiện tại
        if (right < heapSize && mang[right] > mang[largest]) {
            largest = right;
        }
        
        // Nếu largest không phải root
        if (largest !== i) {
            MaxHeapInPlace.swap(mang, i, largest);
            
            // Đệ quy heapify sub-tree bị ảnh hưởng
            MaxHeapInPlace.maxHeapify(mang, heapSize, largest);
        }
    }
    
    static swap(mang, i, j) {
        [mang[i], mang[j]] = [mang[j], mang[i]];
    }
}
```

## Ứng Dụng Thực Tế

### 1. Hệ Thống Xử Lý Tác Vụ Ưu Tiên

```javascript
class HeTongXuLyTacVuUuTien {
    constructor() {
        this.danhSachTacVu = [];
        this.tacVuDangXuLy = [];
        this.tacVuHoanThanh = [];
        this.idTacVu = 1;
    }
    
    themTacVu(tenTacVu, mucDoUuTien, thoiGianUocTinh, nguoiGiao) {
        const tacVu = {
            id: this.idTacVu++,
            tenTacVu,
            mucDoUuTien, // 1-10 (10 là cao nhất)
            thoiGianUocTinh, // phút
            nguoiGiao,
            thoiGianThem: new Date(),
            trangThai: 'CHỜ XỬ LÝ'
        };
        
        // Thêm vào danh sách và sắp xếp bằng heap sort
        this.danhSachTacVu.push(tacVu);
        this.sapXepTacVuBangHeapSort();
        
        console.log(`✅ Đã thêm tác vụ: "${tenTacVu}" (Ưu tiên: ${mucDoUuTien})`);
        return tacVu;
    }
    
    sapXepTacVuBangHeapSort() {
        // Sử dụng heap sort để sắp xếp theo mức độ ưu tiên
        const n = this.danhSachTacVu.length;
        
        console.log('\n🔄 Sắp xếp lại danh sách tác vụ bằng Heap Sort...');
        
        // Xây dựng max heap dựa trên mức độ ưu tiên
        for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
            this.heapifyTacVu(n, i);
        }
        
        // Trích xuất các phần tử từ heap
        for (let i = n - 1; i > 0; i--) {
            // Hoán đổi root với phần tử cuối
            [this.danhSachTacVu[0], this.danhSachTacVu[i]] = 
            [this.danhSachTacVu[i], this.danhSachTacVu[0]];
            
            // Heapify heap bị giảm
            this.heapifyTacVu(i, 0);
        }
        
        console.log('✅ Hoàn thành sắp xếp tác vụ theo ưu tiên');
    }
    
    heapifyTacVu(heapSize, i) {
        let largest = i;
        let left = 2 * i + 1;
        let right = 2 * i + 2;
        
        // So sánh với con trái
        if (left < heapSize && this.soSanhUuTien(this.danhSachTacVu[left], this.danhSachTacVu[largest]) > 0) {
            largest = left;
        }
        
        // So sánh với con phải
        if (right < heapSize && this.soSanhUuTien(this.danhSachTacVu[right], this.danhSachTacVu[largest]) > 0) {
            largest = right;
        }
        
        // Hoán đổi nếu cần
        if (largest !== i) {
            [this.danhSachTacVu[i], this.danhSachTacVu[largest]] = 
            [this.danhSachTacVu[largest], this.danhSachTacVu[i]];
            
            // Đệ quy heapify
            this.heapifyTacVu(heapSize, largest);
        }
    }
    
    soSanhUuTien(tacVu1, tacVu2) {
        // Tiêu chí ưu tiên: Mức độ ưu tiên > Thời gian thêm sớm hơn
        if (tacVu1.mucDoUuTien !== tacVu2.mucDoUuTien) {
            return tacVu1.mucDoUuTien - tacVu2.mucDoUuTien;
        }
        
        // Nếu cùng mức độ ưu tiên, ưu tiên tác vụ được thêm trước
        return tacVu2.thoiGianThem - tacVu1.thoiGianThem;
    }
    
    layTacVuTiepTheo() {
        if (this.danhSachTacVu.length === 0) {
            console.log('📭 Không có tác vụ nào đang chờ xử lý');
            return null;
        }
        
        // Lấy tác vụ có ưu tiên cao nhất (đầu danh sách sau khi sắp xếp)
        const tacVu = this.danhSachTacVu.shift();
        tacVu.trangThai = 'ĐANG XỬ LÝ';
        tacVu.thoiGianBatDau = new Date();
        
        this.tacVuDangXuLy.push(tacVu);
        
        console.log(`🚀 Bắt đầu xử lý: "${tacVu.tenTacVu}"`);
        console.log(`   Ưu tiên: ${tacVu.mucDoUuTien}/10`);
        console.log(`   Người giao: ${tacVu.nguoiGiao}`);
        console.log(`   Thời gian ước tính: ${tacVu.thoiGianUocTinh} phút`);
        
        return tacVu;
    }
    
    hoanThanhTacVu(id, ghiChu = '') {
        const index = this.tacVuDangXuLy.findIndex(tv => tv.id === id);
        if (index === -1) return null;
        
        const tacVu = this.tacVuDangXuLy.splice(index, 1)[0];
        tacVu.trangThai = 'HOÀN THÀNH';
        tacVu.thoiGianHoanThanh = new Date();
        tacVu.ghiChu = ghiChu;
        
        const thoiGianThucTe = Math.floor((tacVu.thoiGianHoanThanh - tacVu.thoiGianBatDau) / 60000);
        tacVu.thoiGianThucTe = thoiGianThucTe;
        
        this.tacVuHoanThanh.push(tacVu);
        
        console.log(`✅ Hoàn thành: "${tacVu.tenTacVu}"`);
        console.log(`   Thời gian thực tế: ${thoiGianThucTe} phút`);
        console.log(`   Ghi chú: ${ghiChu}`);
        
        return tacVu;
    }
    
    inDanhSachTacVu() {
        console.log('\n📋 DANH SÁCH TÁC VỤ THEO ƯU TIÊN');
        console.log('=================================');
        
        if (this.danhSachTacVu.length === 0) {
            console.log('📭 Không có tác vụ nào đang chờ');
            return;
        }
        
        this.danhSachTacVu.forEach((tacVu, index) => {
            const mucDoIcon = this.layIconUuTien(tacVu.mucDoUuTien);
            
            console.log(`${index + 1}. ${mucDoIcon} "${tacVu.tenTacVu}"`);
            console.log(`   ID: ${tacVu.id} | Ưu tiên: ${tacVu.mucDoUuTien}/10`);
            console.log(`   Người giao: ${tacVu.nguoiGiao}`);
            console.log(`   Thời gian ước tính: ${tacVu.thoiGianUocTinh} phút`);
            console.log(`   Thêm lúc: ${tacVu.thoiGianThem.toLocaleString('vi-VN')}`);
            console.log('   -------------------------');
        });
    }
    
    layIconUuTien(mucDo) {
        if (mucDo >= 9) return '🔴'; // Cực kỳ khẩn cấp
        if (mucDo >= 7) return '🟠'; // Khẩn cấp
        if (mucDo >= 5) return '🟡'; // Quan trọng
        if (mucDo >= 3) return '🟢'; // Bình thường
        return '⚪'; // Thấp
    }
    
    thongKeTacVu() {
        const tongTacVu = this.tacVuHoanThanh.length;
        
        if (tongTacVu === 0) {
            console.log('\n📊 Chưa có tác vụ nào được hoàn thành');
            return;
        }
        
        const thoiGianTrungBinh = this.tacVuHoanThanh.reduce((sum, tv) => sum + tv.thoiGianThucTe, 0) / tongTacVu;
        const tacVuUuTienCao = this.tacVuHoanThanh.filter(tv => tv.mucDoUuTien >= 7).length;
        
        console.log('\n📊 THỐNG KÊ TÁC VỤ ĐÃ HOÀN THÀNH');
        console.log('===============================');
        console.log(`Tổng số tác vụ: ${tongTacVu}`);
        console.log(`Tác vụ ưu tiên cao (≥7): ${tacVuUuTienCao}`);
        console.log(`Thời gian trung bình: ${thoiGianTrungBinh.toFixed(1)} phút`);
        console.log(`Tác vụ đang xử lý: ${this.tacVuDangXuLy.length}`);
        console.log(`Tác vụ chờ xử lý: ${this.danhSachTacVu.length}`);
    }
}

// Sử dụng hệ thống
const heTongTacVu = new HeTongXuLyTacVuUuTien();

// Thêm các tác vụ với mức độ ưu tiên khác nhau
heTongTacVu.themTacVu('Sửa lỗi critical trên website', 10, 30, 'Nguyễn Văn An');
heTongTacVu.themTacVu('Viết báo cáo tuần', 4, 60, 'Trần Thị Bình');
heTongTacVu.themTacVu('Họp với khách hàng VIP', 8, 45, 'Lê Minh Cường');
heTongTacVu.themTacVu('Cập nhật database', 6, 90, 'Phạm Thị Dung');
heTongTacVu.themTacVu('Backup dữ liệu khẩn cấp', 9, 20, 'Hoàng Văn Em');

heTongTacVu.inDanhSachTacVu();

// Xử lý tác vụ
console.log('\n🚀 BẮT ĐẦU XỬ LÝ TÁC VỤ');
console.log('========================');

const tacVu1 = heTongTacVu.layTacVuTiepTheo();
heTongTacVu.hoanThanhTacVu(tacVu1.id, 'Đã sửa xong lỗi và test thành công');

const tacVu2 = heTongTacVu.layTacVuTiepTheo();
heTongTacVu.hoanThanhTacVu(tacVu2.id, 'Backup hoàn tất, dữ liệu an toàn');

heTongTacVu.thongKeTacVu();
```

### 2. Hệ Thống Xếp Hạng Game Realtime

```javascript
class BangXepHangGame {
    constructor(tenGame) {
        this.tenGame = tenGame;
        this.danhSachNguoiChoi = [];
        this.lichSuTranDau = [];
    }
    
    themNguoiChoi(tenNguoiChoi, diem = 1000, rank = 'Bronze') {
        const nguoiChoi = {
            ten: tenNguoiChoi,
            diem,
            rank,
            soTranThang: 0,
            soTranThua: 0,
            streakThang: 0,
            thoiGianCapNhat: new Date(),
            id: Date.now() + Math.random()
        };
        
        this.danhSachNguoiChoi.push(nguoiChoi);
        this.capNhatBangXepHang();
        
        console.log(`🎮 Người chơi mới: ${tenNguoiChoi} (${diem} điểm - ${rank})`);
        return nguoiChoi;
    }
    
    capNhatKetQuaTranDau(id1, id2, nguoiThang) {
        const nguoiChoi1 = this.danhSachNguoiChoi.find(nc => nc.id === id1);
        const nguoiChoi2 = this.danhSachNguoiChoi.find(nc => nc.id === id2);
        
        if (!nguoiChoi1 || !nguoiChoi2) return null;
        
        console.log(`\n⚔️ TRẬN ĐẤU: ${nguoiChoi1.ten} vs ${nguoiChoi2.ten}`);
        
        // Tính toán thay đổi điểm dựa trên ELO rating
        const diemThayDoi = this.tinhDiemELO(nguoiChoi1.diem, nguoiChoi2.diem, nguoiThang === id1);
        
        if (nguoiThang === id1) {
            console.log(`🏆 Người thắng: ${nguoiChoi1.ten}`);
            nguoiChoi1.diem += diemThayDoi;
            nguoiChoi1.soTranThang++;
            nguoiChoi1.streakThang++;
            
            nguoiChoi2.diem -= diemThayDoi;
            nguoiChoi2.soTranThua++;
            nguoiChoi2.streakThang = 0;
        } else {
            console.log(`🏆 Người thắng: ${nguoiChoi2.ten}`);
            nguoiChoi2.diem += diemThayDoi;
            nguoiChoi2.soTranThang++;
            nguoiChoi2.streakThang++;
            
            nguoiChoi1.diem -= diemThayDoi;
            nguoiChoi1.soTranThua++;
            nguoiChoi1.streakThang = 0;
        }
        
        // Cập nhật rank
        this.capNhatRank(nguoiChoi1);
        this.capNhatRank(nguoiChoi2);
        
        // Cập nhật thời gian
        nguoiChoi1.thoiGianCapNhat = new Date();
        nguoiChoi2.thoiGianCapNhat = new Date();
        
        console.log(`   ${nguoiChoi1.ten}: ${nguoiChoi1.diem} điểm (${nguoiChoi1.rank})`);
        console.log(`   ${nguoiChoi2.ten}: ${nguoiChoi2.diem} điểm (${nguoiChoi2.rank})`);
        
        // Lưu lịch sử
        this.lichSuTranDau.push({
            nguoiChoi1: { ...nguoiChoi1 },
            nguoiChoi2: { ...nguoiChoi2 },
            nguoiThang,
            diemThayDoi,
            thoiGian: new Date()
        });
        
        // Sắp xếp lại bảng xếp hạng
        this.capNhatBangXepHang();
        
        return { nguoiChoi1, nguoiChoi2, diemThayDoi };
    }
    
    tinhDiemELO(diemA, diemB, AThang) {
        const K = 32; // Hệ số K
        const xacSuatA = 1 / (1 + Math.pow(10, (diemB - diemA) / 400));
        const ketQuaA = AThang ? 1 : 0;
        
        return Math.round(K * (ketQuaA - xacSuatA));
    }
    
    capNhatRank(nguoiChoi) {
        const diem = nguoiChoi.diem;
        
        if (diem >= 2400) nguoiChoi.rank = 'Grandmaster';
        else if (diem >= 2100) nguoiChoi.rank = 'Master';
        else if (diem >= 1800) nguoiChoi.rank = 'Diamond';
        else if (diem >= 1500) nguoiChoi.rank = 'Platinum';
        else if (diem >= 1200) nguoiChoi.rank = 'Gold';
        else if (diem >= 900) nguoiChoi.rank = 'Silver';
        else nguoiChoi.rank = 'Bronze';
    }
    
    capNhatBangXepHang() {
        console.log('\n🔄 Cập nhật bảng xếp hạng bằng Heap Sort...');
        
        // Sử dụng heap sort để sắp xếp theo điểm số
        this.heapSortNguoiChoi();
        
        console.log('✅ Hoàn thành cập nhật bảng xếp hạng');
    }
    
    heapSortNguoiChoi() {
        const n = this.danhSachNguoiChoi.length;
        
        // Xây dựng max heap
        for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
            this.heapifyNguoiChoi(n, i);
        }
        
        // Trích xuất từng phần tử từ heap
        for (let i = n - 1; i > 0; i--) {
            // Hoán đổi root với phần tử cuối
            [this.danhSachNguoiChoi[0], this.danhSachNguoiChoi[i]] = 
            [this.danhSachNguoiChoi[i], this.danhSachNguoiChoi[0]];
            
            // Heapify heap bị giảm
            this.heapifyNguoiChoi(i, 0);
        }
    }
    
    heapifyNguoiChoi(heapSize, i) {
        let largest = i;
        let left = 2 * i + 1;
        let right = 2 * i + 2;
        
        // So sánh với con trái
        if (left < heapSize && this.soSanhNguoiChoi(this.danhSachNguoiChoi[left], this.danhSachNguoiChoi[largest]) > 0) {
            largest = left;
        }
        
        // So sánh với con phải
        if (right < heapSize && this.soSanhNguoiChoi(this.danhSachNguoiChoi[right], this.danhSachNguoiChoi[largest]) > 0) {
            largest = right;
        }
        
        // Hoán đổi nếu cần
        if (largest !== i) {
            [this.danhSachNguoiChoi[i], this.danhSachNguoiChoi[largest]] = 
            [this.danhSachNguoiChoi[largest], this.danhSachNguoiChoi[i]];
            
            // Đệ quy heapify
            this.heapifyNguoiChoi(heapSize, largest);
        }
    }
    
    soSanhNguoiChoi(nc1, nc2) {
        // Tiêu chí sắp xếp: Điểm cao > Streak thắng > Tỷ lệ thắng
        if (nc1.diem !== nc2.diem) {
            return nc1.diem - nc2.diem;
        }
        
        // Nếu điểm bằng nhau, so sánh streak
        if (nc1.streakThang !== nc2.streakThang) {
            return nc1.streakThang - nc2.streakThang;
        }
        
        // Nếu streak bằng nhau, so sánh tỷ lệ thắng
        const tyLeThang1 = nc1.soTranThang / (nc1.soTranThang + nc1.soTranThua) || 0;
        const tyLeThang2 = nc2.soTranThang / (nc2.soTranThang + nc2.soTranThua) || 0;
        
        return tyLeThang1 - tyLeThang2;
    }
    
    inBangXepHang(soLuong = 10) {
        console.log(`\n🏆 BẢNG XẾP HẠNG ${this.tenGame.toUpperCase()} (Top ${soLuong})`);
        console.log('='.repeat(60));
        
        this.danhSachNguoiChoi.slice(0, soLuong).forEach((nc, index) => {
            const xepHang = index + 1;
            const medal = this.layHuyChương(xepHang);
            const tyLeThang = ((nc.soTranThang / (nc.soTranThang + nc.soTranThua)) * 100).toFixed(1);
            const streakIcon = nc.streakThang > 0 ? `🔥${nc.streakThang}` : '';
            
            console.log(`${xepHang}. ${medal} ${nc.ten}`);
            console.log(`   ${this.layIconRank(nc.rank)} ${nc.rank} - ${nc.diem} điểm`);
            console.log(`   Thắng/Thua: ${nc.soTranThang}/${nc.soTranThua} (${tyLeThang}%) ${streakIcon}`);
            console.log(`   Cập nhật: ${nc.thoiGianCapNhat.toLocaleString('vi-VN')}`);
            console.log('   ' + '-'.repeat(50));
        });
    }
    
    layHuyChương(hang) {
        const huyChương = { 1: '🥇', 2: '🥈', 3: '🥉' };
        return huyChương[hang] || `#${hang}`;
    }
    
    layIconRank(rank) {
        const icons = {
            'Bronze': '🟤',
            'Silver': '⚪',
            'Gold': '🟡',
            'Platinum': '💎',
            'Diamond': '💍',
            'Master': '👑',
            'Grandmaster': '🌟'
        };
        return icons[rank] || '🎮';
    }
    
    timNguoiChoiTheoRank(rank) {
        return this.danhSachNguoiChoi.filter(nc => nc.rank === rank);
    }
    
    thongKeGame() {
        const thongKe = {
            tongNguoiChoi: this.danhSachNguoiChoi.length,
            tongTranDau: this.lichSuTranDau.length,
            diemTrungBinh: 0,
            rankPhoBien: {},
            streakCaoNhat: 0,
            nguoiCoStreakCaoNhat: null
        };
        
        // Tính điểm trung bình
        if (thongKe.tongNguoiChoi > 0) {
            thongKe.diemTrungBinh = this.danhSachNguoiChoi.reduce((sum, nc) => sum + nc.diem, 0) / thongKe.tongNguoiChoi;
        }
        
        // Thống kê rank
        this.danhSachNguoiChoi.forEach(nc => {
            thongKe.rankPhoBien[nc.rank] = (thongKe.rankPhoBien[nc.rank] || 0) + 1;
            
            if (nc.streakThang > thongKe.streakCaoNhat) {
                thongKe.streakCaoNhat = nc.streakThang;
                thongKe.nguoiCoStreakCaoNhat = nc.ten;
            }
        });
        
        console.log('\n📊 THỐNG KÊ GAME');
        console.log('================');
        console.log(`Tổng người chơi: ${thongKe.tongNguoiChoi}`);
        console.log(`Tổng trận đấu: ${thongKe.tongTranDau}`);
        console.log(`Điểm trung bình: ${thongKe.diemTrungBinh.toFixed(0)}`);
        console.log(`Streak cao nhất: ${thongKe.streakCaoNhat} (${thongKe.nguoiCoStreakCaoNhat})`);
        
        console.log('\nPhân bố rank:');
        Object.entries(thongKe.rankPhoBien).forEach(([rank, soLuong]) => {
            const phanTram = (soLuong / thongKe.tongNguoiChoi * 100).toFixed(1);
            console.log(`  ${this.layIconRank(rank)} ${rank}: ${soLuong} (${phanTram}%)`);
        });
        
        return thongKe;
    }
}

// Sử dụng hệ thống
const bangXepHang = new BangXepHangGame('League of Legends');

// Thêm người chơi
const player1 = bangXepHang.themNguoiChoi('DragonSlayer', 1200, 'Gold');
const player2 = bangXepHang.themNguoiChoi('ShadowHunter', 1150, 'Silver');
const player3 = bangXepHang.themNguoiChoi('MagicMaster', 1300, 'Gold');
const player4 = bangXepHang.themNguoiChoi('StormBringer', 1100, 'Silver');
const player5 = bangXepHang.themNguoiChoi('FirePhoenix', 1400, 'Platinum');

bangXepHang.inBangXepHang();

// Mô phỏng một số trận đấu
console.log('\n⚔️ MÔ PHỎNG TRẬN ĐẤU');
console.log('=====================');

bangXepHang.capNhatKetQuaTranDau(player1.id, player2.id, player1.id);
bangXepHang.capNhatKetQuaTranDau(player3.id, player4.id, player3.id);
bangXepHang.capNhatKetQuaTranDau(player1.id, player5.id, player5.id);
bangXepHang.capNhatKetQuaTranDau(player2.id, player3.id, player3.id);

bangXepHang.inBangXepHang();
bangXepHang.thongKeGame();
```

### 3. Hệ Thống Quản Lý Hàng Đợi Emergency Room

```javascript
class QuanLyHangDoiCapCuu {
    constructor(tenBenhVien) {
        this.tenBenhVien = tenBenhVien;
        this.danhSachBenhNhan = [];
        this.bacSiDangLam = [];
        this.lichSuKham = [];
        this.soThuTuBenhNhan = 1;
    }
    
    dangKyCapCuu(hoTen, tuoi, trieuChung, mucDoNguyHiem, coXetNghiem = false) {
        const benhNhan = {
            id: this.soThuTuBenhNhan++,
            hoTen,
            tuoi,
            trieuChung,
            mucDoNguyHiem, // 1-5: 1=nhẹ, 5=nguy kịch
            coXetNghiem,
            thoiGianDen: new Date(),
            thoiGianDuKienKham: null,
            trangThai: 'CHỜ KHÁM',
            diemUuTien: this.tinhDiemUuTien(tuoi, mucDoNguyHiem, coXetNghiem)
        };
        
        this.danhSachBenhNhan.push(benhNhan);
        this.capNhatHangDoiBangHeapSort();
        
        console.log(`🚑 Đăng ký cấp cứu: ${hoTen} (Mức độ: ${mucDoNguyHiem}/5, Điểm ưu tiên: ${benhNhan.diemUuTien})`);
        return benhNhan;
    }
    
    tinhDiemUuTien(tuoi, mucDoNguyHiem, coXetNghiem) {
        let diem = mucDoNguyHiem * 20; // Base score từ mức độ nguy hiểm
        
        // Thêm điểm cho người cao tuổi
        if (tuoi > 65) diem += 10;
        else if (tuoi < 5) diem += 15; // Trẻ em được ưu tiên cao hơn
        
        // Thêm điểm cho trường hợp đã có xét nghiệm
        if (coXetNghiem) diem += 5;
        
        return diem;
    }
    
    capNhatHangDoiBangHeapSort() {
        console.log('\n🔄 Cập nhật hàng đợi cấp cứu bằng Heap Sort...');
        
        this.heapSortBenhNhan();
        this.capNhatThoiGianDuKien();
        
        console.log('✅ Hoàn thành cập nhật hàng đợi');
    }
    
    heapSortBenhNhan() {
        const n = this.danhSachBenhNhan.length;
        
        // Xây dựng max heap dựa trên điểm ưu tiên
        for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
            this.heapifyBenhNhan(n, i);
        }
        
        // Sắp xếp theo thứ tự ưu tiên giảm dần
        for (let i = n - 1; i > 0; i--) {
            [this.danhSachBenhNhan[0], this.danhSachBenhNhan[i]] = 
            [this.danhSachBenhNhan[i], this.danhSachBenhNhan[0]];
            
            this.heapifyBenhNhan(i, 0);
        }
    }
    
    heapifyBenhNhan(heapSize, i) {
        let largest = i;
        let left = 2 * i + 1;
        let right = 2 * i + 2;
        
        if (left < heapSize && this.soSanhUuTienBenhNhan(this.danhSachBenhNhan[left], this.danhSachBenhNhan[largest]) > 0) {
            largest = left;
        }
        
        if (right < heapSize && this.soSanhUuTienBenhNhan(this.danhSachBenhNhan[right], this.danhSachBenhNhan[largest]) > 0) {
            largest = right;
        }
        
        if (largest !== i) {
            [this.danhSachBenhNhan[i], this.danhSachBenhNhan[largest]] = 
            [this.danhSachBenhNhan[largest], this.danhSachBenhNhan[i]];
            
            this.heapifyBenhNhan(heapSize, largest);
        }
    }
    
    soSanhUuTienBenhNhan(bn1, bn2) {
        // Tiêu chí: Điểm ưu tiên > Thời gian đến sớm hơn
        if (bn1.diemUuTien !== bn2.diemUuTien) {
            return bn1.diemUuTien - bn2.diemUuTien;
        }
        
        // Nếu điểm ưu tiên bằng nhau, ưu tiên người đến trước
        return bn2.thoiGianDen - bn1.thoiGianDen;
    }
    
    capNhatThoiGianDuKien() {
        let thoiGianTichLuy = new Date();
        
        this.danhSachBenhNhan.forEach((bn, index) => {
            if (bn.trangThai === 'CHỜ KHÁM') {
                // Ước tính thời gian khám dựa trên mức độ nguy hiểm
                const thoiGianKham = bn.mucDoNguyHiem >= 4 ? 45 : 
                                   bn.mucDoNguyHiem >= 3 ? 30 : 20;
                
                thoiGianTichLuy = new Date(thoiGianTichLuy.getTime() + thoiGianKham * 60000);
                bn.thoiGianDuKienKham = new Date(thoiGianTichLuy);
            }
        });
    }
    
    goiBenhNhanTiepTheo() {
        if (this.danhSachBenhNhan.length === 0) {
            console.log('📭 Không có bệnh nhân nào đang chờ');
            return null;
        }
        
        const benhNhan = this.danhSachBenhNhan.shift();
        benhNhan.trangThai = 'ĐANG KHÁM';
        benhNhan.thoiGianBatDauKham = new Date();
        
        console.log(`🩺 Gọi bệnh nhân: ${benhNhan.hoTen} (${benhNhan.id})`);
        console.log(`   Mức độ nguy hiểm: ${benhNhan.mucDoNguyHiem}/5`);
        console.log(`   Triệu chứng: ${benhNhan.trieuChung}`);
        console.log(`   Điểm ưu tiên: ${benhNhan.diemUuTien}`);
        
        // Cập nhật lại thời gian dự kiến cho những người còn lại
        this.capNhatThoiGianDuKien();
        
        return benhNhan;
    }
    
    hoanThanhKham(benhNhan, chuanDoan, dieuTri, tinhTrangRaVien) {
        benhNhan.trangThai = 'ĐÃ KHÁM';
        benhNhan.thoiGianKetThuc = new Date();
        benhNhan.chuanDoan = chuanDoan;
        benhNhan.dieuTri = dieuTri;
        benhNhan.tinhTrangRaVien = tinhTrangRaVien; // 'RA VIỆN', 'NHẬP VIỆN', 'CHUYỂN TUYẾN'
        
        const thoiGianKham = Math.floor((benhNhan.thoiGianKetThuc - benhNhan.thoiGianBatDauKham) / 60000);
        benhNhan.thoiGianKhamThucTe = thoiGianKham;
        
        this.lichSuKham.push({ ...benhNhan });
        
        console.log(`✅ Hoàn thành: ${benhNhan.hoTen}`);
        console.log(`   Chẩn đoán: ${chuanDoan}`);
        console.log(`   Điều trị: ${dieuTri}`);
        console.log(`   Tình trạng: ${tinhTrangRaVien}`);
        console.log(`   Thời gian khám: ${thoiGianKham} phút`);
        
        return benhNhan;
    }
    
    themTinhHuongKhanCap(hoTen, tuoi, trieuChung) {
        // Tình huống khẩn cấp - mức độ 5, điểm ưu tiên cao nhất
        const benhNhanKhanCap = this.dangKyCapCuu(hoTen, tuoi, trieuChung, 5, true);
        
        console.log(`🚨 TÌNH HUỐNG KHẨN CẤP: ${hoTen}`);
        console.log('🚑 Đã được ưu tiên tối đa trong hàng đợi');
        
        return benhNhanKhanCap;
    }
    
    inHangDoiCapCuu() {
        console.log(`\n🏥 HÀNG ĐỢI CẤP CỨU - ${this.tenBenhVien}`);
        console.log('='.repeat(60));
        
        if (this.danhSachBenhNhan.length === 0) {
            console.log('📭 Không có bệnh nhân nào đang chờ');
            return;
        }
        
        this.danhSachBenhNhan.forEach((bn, index) => {
            const thuTu = index + 1;
            const mauMucDo = this.layMauMucDoNguyHiem(bn.mucDoNguyHiem);
            const thoiGianCho = bn.thoiGianDuKienKham ? 
                `(~${bn.thoiGianDuKienKham.toLocaleTimeString('vi-VN')})` : '';
            
            console.log(`${thuTu}. ${mauMucDo} ${bn.hoTen} (${bn.id})`);
            console.log(`   Tuổi: ${bn.tuoi} | Mức độ: ${bn.mucDoNguyHiem}/5 | Điểm ưu tiên: ${bn.diemUuTien}`);
            console.log(`   Triệu chứng: ${bn.trieuChung}`);
            console.log(`   Đến lúc: ${bn.thoiGianDen.toLocaleTimeString('vi-VN')}`);
            console.log(`   Dự kiến khám: ${thoiGianCho}`);
            console.log(`   Xét nghiệm: ${bn.coXetNghiem ? 'Có' : 'Chưa'}`);
            console.log('   ' + '-'.repeat(50));
        });
    }
    
    layMauMucDoNguyHiem(mucDo) {
        const mauSac = {
            1: '🟢', // Nhẹ
            2: '🟡', // Vừa
            3: '🟠', // Nghiêm trọng
            4: '🔴', // Nguy hiểm
            5: '🚨'  // Nguy kịch
        };
        return mauSac[mucDo] || '⚪';
    }
    
    thongKeCapCuu() {
        const thongKe = {
            tongBenhNhan: this.lichSuKham.length,
            thoiGianKhamTrungBinh: 0,
            phanBoMucDo: {},
            tinhTrangRaVien: {},
            thoiGianChoTrungBinh: 0
        };
        
        if (thongKe.tongBenhNhan === 0) {
            console.log('\n📊 Chưa có dữ liệu thống kê');
            return thongKe;
        }
        
        // Tính thời gian khám trung bình
        thongKe.thoiGianKhamTrungBinh = this.lichSuKham.reduce((sum, bn) => sum + bn.thoiGianKhamThucTe, 0) / thongKe.tongBenhNhan;
        
        // Thống kê mức độ nguy hiểm
        this.lichSuKham.forEach(bn => {
            thongKe.phanBoMucDo[bn.mucDoNguyHiem] = (thongKe.phanBoMucDo[bn.mucDoNguyHiem] || 0) + 1;
            thongKe.tinhTrangRaVien[bn.tinhTrangRaVien] = (thongKe.tinhTrangRaVien[bn.tinhTrangRaVien] || 0) + 1;
        });
        
        console.log('\n📊 THỐNG KÊ CẤP CỨU');
        console.log('===================');
        console.log(`Tổng bệnh nhân đã khám: ${thongKe.tongBenhNhan}`);
        console.log(`Thời gian khám trung bình: ${thongKe.thoiGianKhamTrungBinh.toFixed(1)} phút`);
        console.log(`Bệnh nhân đang chờ: ${this.danhSachBenhNhan.length}`);
        
        console.log('\nPhân bố mức độ nguy hiểm:');
        Object.entries(thongKe.phanBoMucDo).forEach(([mucDo, soLuong]) => {
            const phanTram = (soLuong / thongKe.tongBenhNhan * 100).toFixed(1);
            console.log(`  ${this.layMauMucDoNguyHiem(parseInt(mucDo))} Mức ${mucDo}: ${soLuong} ca (${phanTram}%)`);
        });
        
        console.log('\nTình trạng ra viện:');
        Object.entries(thongKe.tinhTrangRaVien).forEach(([tinhTrang, soLuong]) => {
            const phanTram = (soLuong / thongKe.tongBenhNhan * 100).toFixed(1);
            console.log(`  ${tinhTrang}: ${soLuong} ca (${phanTram}%)`);
        });
        
        return thongKe;
    }
}

// Sử dụng hệ thống
const capCuu = new QuanLyHangDoiCapCuu('Bệnh viện Bạch Mai');

// Đăng ký bệnh nhân cấp cứu
capCuu.dangKyCapCuu('Nguyễn Văn An', 45, 'Đau ngực, khó thở', 4, true);
capCuu.dangKyCapCuu('Trần Thị Bình', 3, 'Sốt cao, co giật', 5, false);
capCuu.dangKyCapCuu('Lê Minh Cường', 67, 'Ngã, đau chân', 2, false);
capCuu.dangKyCapCuu('Phạm Thị Dung', 28, 'Đau bụng dữ dội', 3, true);
capCuu.dangKyCapCuu('Hoàng Văn Em', 72, 'Choáng váng, huyết áp cao', 4, true);

// Thêm tình huống khẩn cấp
capCuu.themTinhHuongKhanCap('Võ Thị Gấp', 55, 'Tai nạn giao thông nghiêm trọng');

capCuu.inHangDoiCapCuu();

// Mô phỏng quá trình khám
console.log('\n🩺 BẮT ĐẦU KHÁM CẤP CỨU');
console.log('========================');

const bn1 = capCuu.goiBenhNhanTiepTheo();
capCuu.hoanThanhKham(bn1, 'Chấn thương đa vị trí', 'Phẫu thuật cấp cứu', 'NHẬP VIỆN');

const bn2 = capCuu.goiBenhNhanTiepTheo();
capCuu.hoanThanhKham(bn2, 'Viêm ruột thừa cấp', 'Phẫu thuật nội soi', 'NHẬP VIỆN');

console.log('\n📋 HÀNG ĐỢI SAU KHI KHÁM:');
capCuu.inHangDoiCapCuu();
capCuu.thongKeCapCuu();
```

## Phân Tích Hiệu Suất

### So Sánh Heap Sort Với Các Thuật Toán Khác

```javascript
class PhanTichHieuSuatHeapSort {
    static demThaoTacHeapSort(mang) {
        let soLanSoSanh = 0;
        let soLanHoanDoi = 0;
        const mangSaoChep = [...mang];
        const n = mangSaoChep.length;
        
        // Hàm heapify với đếm thao tác
        function heapify(arr, heapSize, i) {
            let largest = i;
            let left = 2 * i + 1;
            let right = 2 * i + 2;
            
            if (left < heapSize) {
                soLanSoSanh++;
                if (arr[left] > arr[largest]) {
                    largest = left;
                }
            }
            
            if (right < heapSize) {
                soLanSoSanh++;
                if (arr[right] > arr[largest]) {
                    largest = right;
                }
            }
            
            if (largest !== i) {
                [arr[i], arr[largest]] = [arr[largest], arr[i]];
                soLanHoanDoi++;
                heapify(arr, heapSize, largest);
            }
        }
        
        // Xây dựng max heap
        for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
            heapify(mangSaoChep, n, i);
        }
        
        // Sắp xếp
        for (let i = n - 1; i > 0; i--) {
            [mangSaoChep[0], mangSaoChep[i]] = [mangSaoChep[i], mangSaoChep[0]];
            soLanHoanDoi++;
            heapify(mangSaoChep, i, 0);
        }
        
        return { soLanSoSanh, soLanHoanDoi, ketQua: mangSaoChep };
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
    
    static soSanhThuatToantang() {
        const testCases = [
            { ten: 'Mảng nhỏ (10 phần tử)', mang: [64, 34, 25, 12, 22, 11, 90, 88, 76, 50] },
            { ten: 'Mảng đã sắp xếp', mang: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
            { ten: 'Mảng ngược', mang: [10, 9, 8, 7, 6, 5, 4, 3, 2, 1] },
            { ten: 'Mảng ngẫu nhiên lớn', mang: Array.from({length: 50}, () => Math.floor(Math.random() * 100)) },
            { ten: 'Mảng có nhiều phần tử trùng', mang: [5, 2, 5, 2, 5, 2, 5, 2, 5, 2] }
        ];
        
        console.log('SO SÁNH HIỆU SUẤT: HEAP SORT vs QUICK SORT vs MERGE SORT');
        console.log('='.repeat(70));
        
        testCases.forEach(testCase => {
            console.log(`\n📊 ${testCase.ten} (${testCase.mang.length} phần tử)`);
            console.log('-'.repeat(60));
            
            const ketQuaHeap = this.demThaoTacHeapSort(testCase.mang);
            const ketQuaQuick = this.demThaoTacQuickSort(testCase.mang);
            const ketQuaMerge = this.demThaoTacMergeSort(testCase.mang);
            
            // Heap Sort
            console.log('🔵 HEAP SORT:');
            console.log(`   So sánh: ${ketQuaHeap.soLanSoSanh}`);
            console.log(`   Hoán đổi: ${ketQuaHeap.soLanHoanDoi}`);
            console.log(`   Tổng thao tác: ${ketQuaHeap.soLanSoSanh + ketQuaHeap.soLanHoanDoi}`);
            
            // Quick Sort
            console.log('🟠 QUICK SORT:');
            console.log(`   So sánh: ${ketQuaQuick.soLanSoSanh}`);
            console.log(`   Hoán đổi: ${ketQuaQuick.soLanHoanDoi}`);
            console.log(`   Tổng thao tác: ${ketQuaQuick.soLanSoSanh + ketQuaQuick.soLanHoanDoi}`);
            
            // Merge Sort
            console.log('🟢 MERGE SORT:');
            console.log(`   So sánh: ${ketQuaMerge.soLanSoSanh}`);
            console.log(`   Sao chép: ${ketQuaMerge.soLanSaoChep}`);
            console.log(`   Tổng thao tác: ${ketQuaMerge.soLanSoSanh + ketQuaMerge.soLanSaoChep}`);
            
            // Phân tích
            console.log('📈 PHÂN TÍCH:');
            const thuatToan = [
                { ten: 'Heap Sort', tong: ketQuaHeap.soLanSoSanh + ketQuaHeap.soLanHoanDoi },
                { ten: 'Quick Sort', tong: ketQuaQuick.soLanSoSanh + ketQuaQuick.soLanHoanDoi },
                { ten: 'Merge Sort', tong: ketQuaMerge.soLanSoSanh + ketQuaMerge.soLanSaoChep }
            ];
            
            const toiUu = thuatToan.reduce((min, current) => current.tong < min.tong ? current : min);
            console.log(`   🏆 Hiệu quả nhất: ${toiUu.ten} (${toiUu.tong} thao tác)`);
            
            // Đặc điểm của Heap Sort
            console.log('   🎯 Đặc điểm Heap Sort:');
            console.log('     - Độ phức tạp ổn định O(n log n)');
            console.log('     - Không cần thêm bộ nhớ (in-place)');
            console.log('     - Hiệu suất không phụ thuộc vào dữ liệu đầu vào');
        });
    }
    
    static phanTichDoPHTucTapTheoKichThuoc() {
        console.log('\n📏 PHÂN TÍCH HEAP SORT THEO KÍCH THƯỚC MẢNG');
        console.log('===========================================');
        
        const kichThuocMang = [10, 50, 100, 200, 500];
        
        console.log('Kích thước | So sánh | Hoán đổi | Tổng | Lý thuyết O(n log n)');
        console.log('-'.repeat(65));
        
        kichThuocMang.forEach(n => {
            const mang = Array.from({ length: n }, () => Math.floor(Math.random() * 1000));
            const ketQua = this.demThaoTacHeapSort(mang);
            const lyThuyet = Math.floor(n * Math.log2(n));
            
            console.log(`${n.toString().padStart(10)} | ${ketQua.soLanSoSanh.toString().padStart(7)} | ${ketQua.soLanHoanDoi.toString().padStart(8)} | ${(ketQua.soLanSoSanh + ketQua.soLanHoanDoi).toString().padStart(4)} | ${lyThuyet.toString().padStart(18)}`);
        });
        
        console.log('\n💡 Nhận xét:');
        console.log('- Heap Sort có độ phức tạp thời gian ổn định O(n log n)');
        console.log('- Số lần thao tác thực tế tương đối gần với lý thuyết');
        console.log('- Hiệu suất không thay đổi nhiều với các loại dữ liệu khác nhau');
    }
    
    static kiemTraTinhOndDefheapSort() {
        console.log('\n🎯 KIỂM TRA TÍNH ỔN ĐỊNH CỦA HEAP SORT');
        console.log('======================================');
        
        // Test với mảng có các phần tử trùng giá trị
        const testStability = [
            { gia: 5, ten: 'A' },
            { gia: 3, ten: 'B' },
            { gia: 5, ten: 'C' },
            { gia: 1, ten: 'D' },
            { gia: 3, ten: 'E' }
        ];
        
        console.log('Mảng gốc:', testStability.map(item => `${item.ten}(${item.gia})`).join(', '));
        
        // Heap sort theo giá trị
        const sorted = [...testStability];
        this.heapSortByValue(sorted);
        
        console.log('Sau heap sort:', sorted.map(item => `${item.ten}(${item.gia})`).join(', '));
        
        // Kiểm tra tính ổn định
        let isStable = true;
        for (let i = 0; i < sorted.length - 1; i++) {
            if (sorted[i].gia === sorted[i + 1].gia) {
                const originalIndexI = testStability.findIndex(item => item === sorted[i]);
                const originalIndexNext = testStability.findIndex(item => item === sorted[i + 1]);
                
                if (originalIndexI > originalIndexNext) {
                    isStable = false;
                    break;
                }
            }
        }
        
        console.log(`Tính ổn định: ${isStable ? '❌ Không ổn định' : '✅ Ổn định'}`);
        console.log('📝 Lưu ý: Heap Sort không phải là thuật toán ổn định');
    }
    
    static heapSortByValue(mang) {
        const n = mang.length;
        
        function heapify(arr, heapSize, i) {
            let largest = i;
            let left = 2 * i + 1;
            let right = 2 * i + 2;
            
            if (left < heapSize && arr[left].gia > arr[largest].gia) {
                largest = left;
            }
            
            if (right < heapSize && arr[right].gia > arr[largest].gia) {
                largest = right;
            }
            
            if (largest !== i) {
                [arr[i], arr[largest]] = [arr[largest], arr[i]];
                heapify(arr, heapSize, largest);
            }
        }
        
        // Xây dựng max heap
        for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
            heapify(mang, n, i);
        }
        
        // Sắp xếp
        for (let i = n - 1; i > 0; i--) {
            [mang[0], mang[i]] = [mang[i], mang[0]];
            heapify(mang, i, 0);
        }
    }
}

// Chạy các phân tích
PhanTichHieuSuatHeapSort.soSanhThuatToantang();
PhanTichHieuSuatHeapSort.phanTichDoPHTucTapTheoKichThuoc();
PhanTichHieuSuatHeapSort.kiemTraTinhOndDefheapSort();
```

## Biến Thể và Tối Ưu

### 1. Bottom-up Heap Construction (Floyd's Method)

```javascript
function heapSortFloyd(mang) {
    console.log('HEAP SORT VỚI FLOYD\'S METHOD');
    console.log('==============================');
    
    const n = mang.length;
    
    // Phương pháp Floyd để xây dựng heap hiệu quả hơn
    console.log('Xây dựng heap bằng Floyd\'s method...');
    buildMaxHeapFloyd(mang);
    
    console.log(`Max heap: [${mang.join(', ')}]`);
    
    // Sắp xếp
    for (let i = n - 1; i > 0; i--) {
        [mang[0], mang[i]] = [mang[i], mang[0]];
        maxHeapify(mang, i, 0);
    }
    
    return mang;
}

function buildMaxHeapFloyd(mang) {
    const n = mang.length;
    
    // Bắt đầu từ nút cha cuối cùng và heapify ngược lên
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        maxHeapify(mang, n, i);
    }
}

function maxHeapify(mang, heapSize, i) {
    let largest = i;
    let left = 2 * i + 1;
    let right = 2 * i + 2;
    
    if (left < heapSize && mang[left] > mang[largest]) {
        largest = left;
    }
    
    if (right < heapSize && mang[right] > mang[largest]) {
        largest = right;
    }
    
    if (largest !== i) {
        [mang[i], mang[largest]] = [mang[largest], mang[i]];
        maxHeapify(mang, heapSize, largest);
    }
}
```

### 2. Iterative Heap Sort

```javascript
function heapSortIterative(mang) {
    console.log('HEAP SORT KHÔNG ĐỆ QUY');
    console.log('========================');
    
    const n = mang.length;
    
    // Xây dựng max heap
    buildMaxHeapIterative(mang);
    
    // Sắp xếp
    for (let i = n - 1; i > 0; i--) {
        [mang[0], mang[i]] = [mang[i], mang[0]];
        heapifyIterative(mang, i, 0);
    }
    
    return mang;
}

function buildMaxHeapIterative(mang) {
    const n = mang.length;
    
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        heapifyIterative(mang, n, i);
    }
}

function heapifyIterative(mang, heapSize, startIndex) {
    let i = startIndex;
    
    while (true) {
        let largest = i;
        let left = 2 * i + 1;
        let right = 2 * i + 2;
        
        if (left < heapSize && mang[left] > mang[largest]) {
            largest = left;
        }
        
        if (right < heapSize && mang[right] > mang[largest]) {
            largest = right;
        }
        
        if (largest === i) {
            break; // Heap property đã được thỏa mãn
        }
        
        [mang[i], mang[largest]] = [mang[largest], mang[i]];
        i = largest; // Tiếp tục heapify xuống
    }
}
```

### 3. K-ary Heap Sort

```javascript
function kAryHeapSort(mang, k = 3) {
    console.log(`${k}-ARY HEAP SORT`);
    console.log('='.repeat(20));
    
    const n = mang.length;
    
    // Xây dựng k-ary max heap
    buildKAryMaxHeap(mang, k);
    
    // Sắp xếp
    for (let i = n - 1; i > 0; i--) {
        [mang[0], mang[i]] = [mang[i], mang[0]];
        kAryMaxHeapify(mang, i, 0, k);
    }
    
    return mang;
}

function buildKAryMaxHeap(mang, k) {
    const n = mang.length;
    
    // Bắt đầu từ nút cha cuối cùng
    for (let i = Math.floor((n - 2) / k); i >= 0; i--) {
        kAryMaxHeapify(mang, n, i, k);
    }
}

function kAryMaxHeapify(mang, heapSize, i, k) {
    let largest = i;
    
    // Kiểm tra tất cả k children
    for (let j = 1; j <= k; j++) {
        let child = k * i + j;
        
        if (child < heapSize && mang[child] > mang[largest]) {
            largest = child;
        }
    }
    
    if (largest !== i) {
        [mang[i], mang[largest]] = [mang[largest], mang[i]];
        kAryMaxHeapify(mang, heapSize, largest, k);
    }
}
```

### 4. Heap Sort Với Optimization

```javascript
class OptimizedHeapSort {
    static sort(mang) {
        const n = mang.length;
        
        if (n <= 1) return mang;
        
        console.log('OPTIMIZED HEAP SORT');
        console.log('===================');
        
        // Tối ưu cho mảng nhỏ - sử dụng insertion sort
        if (n <= 16) {
            console.log('Mảng nhỏ - sử dụng Insertion Sort');
            return this.insertionSort(mang);
        }
        
        // Heap sort thông thường cho mảng lớn
        this.buildMaxHeap(mang);
        
        // Tối ưu: dừng sớm nếu heap đã được sắp xếp
        for (let i = n - 1; i > 0; i--) {
            if (mang[0] <= mang[i]) {
                console.log('Phát hiện mảng đã sắp xếp - dừng sớm');
                break;
            }
            
            [mang[0], mang[i]] = [mang[i], mang[0]];
            this.maxHeapify(mang, i, 0);
        }
        
        return mang;
    }
    
    static insertionSort(mang) {
        for (let i = 1; i < mang.length; i++) {
            let key = mang[i];
            let j = i - 1;
            
            while (j >= 0 && mang[j] > key) {
                mang[j + 1] = mang[j];
                j--;
            }
            
            mang[j + 1] = key;
        }
        
        return mang;
    }
    
    static buildMaxHeap(mang) {
        const n = mang.length;
        
        for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
            this.maxHeapify(mang, n, i);
        }
    }
    
    static maxHeapify(mang, heapSize, i) {
        let largest = i;
        let left = 2 * i + 1;
        let right = 2 * i + 2;
        
        if (left < heapSize && mang[left] > mang[largest]) {
            largest = left;
        }
        
        if (right < heapSize && mang[right] > mang[largest]) {
            largest = right;
        }
        
        if (largest !== i) {
            [mang[i], mang[largest]] = [mang[largest], mang[i]];
            this.maxHeapify(mang, heapSize, largest);
        }
    }
}
```

## Ưu Điểm và Nhược Điểm

### Ưu Điểm

1. **Độ phức tạp thời gian ổn định**: O(n log n) trong mọi trường hợp
2. **In-place**: Chỉ cần O(1) bộ nhớ bổ sung
3. **Không phụ thuộc dữ liệu**: Hiệu suất nhất quán bất kể thứ tự đầu vào
4. **Đơn giản**: Dễ hiểu và triển khai
5. **Không có worst-case quadratic**: Không như Quick Sort
6. **Deterministic**: Thời gian chạy có thể dự đoán được

### Nhược Điểm

1. **Không ổn định**: Không bảo toàn thứ tự tương đối của các phần tử bằng nhau
2. **Cache performance kém**: Truy cập bộ nhớ không tuần tự
3. **Hằng số ẩn lớn**: Chậm hơn Quick Sort và Merge Sort trong thực tế
4. **Không adaptive**: Không tận dụng được dữ liệu đã sắp xếp một phần

## Độ Phức Tạp

| Trường hợp         | Thời gian       | Không gian | Ổn định | Nhận xét                    |
| ------------------ | :-------------: | :---------: | :-----: | :-------------------------- |
| **Tốt nhất**       | O(n log n)      | O(1)        | Không   | Xây dựng heap: O(n)        |
| **Trung bình**     | O(n log n)      | O(1)        | Không   | Consistent performance      |
| **Xấu nhất**       | O(n log n)      | O(1)        | Không   | Guaranteed worst-case       |

### Phân Tích Chi Tiết

- **Xây dựng heap**: O(n) với Floyd's method
- **Trích xuất n lần**: n × O(log n) = O(n log n)
- **Tổng cộng**: O(n) + O(n log n) = O(n log n)

## Khi Nào Nên Sử Dụng

### Phù Hợp Khi:
- Cần đảm bảo hiệu suất worst-case O(n log n)
- Bộ nhớ bị hạn chế (in-place sorting)
- Cần thuật toán đơn giản và đáng tin cậy
- Không cần tính ổn định
- Ứng dụng real-time với yêu cầu thời gian dự đoán được

### Không Phù Hợp Khi:
- Cần tính ổn định
- Cần hiệu suất tốt nhất trong thực tế (Quick Sort thường nhanh hơn)
- Làm việc với dữ liệu đã sắp xếp một phần (Insertion Sort tốt hơn)
- Cache performance quan trọng

## So Sánh Với Thuật Toán Khác

| Thuật toán      | Thời gian TB   | Thời gian Xấu nhất | Bộ nhớ | Ổn định | Ghi chú                |
| --------------- | :------------: | :----------------: | :----: | :-----: | :--------------------- |
| **Heap Sort**   | O(n log n)     | O(n log n)         | O(1)   | Không   | Consistent, in-place   |
| **Quick Sort**  | O(n log n)     | O(n²)              | O(log n)| Không   | Nhanh trung bình       |
| **Merge Sort**  | O(n log n)     | O(n log n)         | O(n)   | Có      | Ổn định, cần thêm RAM  |
| **Intro Sort**  | O(n log n)     | O(n log n)         | O(log n)| Không   | Hybrid, tốt nhất       |

## Tài Liệu Tham Khảo

- [Wikipedia - Heap Sort](https://vi.wikipedia.org/wiki/S%E1%BA%AFp_x%E1%BA%BFp_%C4%91%E1%BB%91ng)
- [GeeksforGeeks - Heap Sort](https://www.geeksforgeeks.org/heap-sort/)
- [Visualgo - Heap Sort](https://visualgo.net/en/sorting)
- [MIT OpenCourseWare - Heapsort](https://ocw.mit.edu/courses/electrical-engineering-and-computer-science/6-006-introduction-to-algorithms-fall-2011/lecture-videos/lecture-4-heaps-and-heap-sort/)

## Bài Tập Thực Hành

### Bài 1: Heap Sort Cho Chuỗi
Cài đặt Heap Sort để sắp xếp mảng chuỗi theo thứ tự từ điển.

### Bài 2: K Phần Tử Lớn Nhất
Sử dụng Min Heap để tìm k phần tử lớn nhất trong mảng mà không cần sắp xếp toàn bộ.

### Bài 3: Heap Sort Với Custom Comparator
Viết Heap Sort có thể sắp xếp các object theo tiêu chí tùy chỉnh.

### Bài 4: Phân Tích Cache Performance
So sánh cache performance của Heap Sort với Quick Sort và Merge Sort.

### Bài 5: Heap Sort Song Song
Cài đặt phiên bản parallel của Heap Sort cho multicore systems.

---

*Post ID: vfzrlllxtmu0k8s*  
*Category: Sorting Algorithms*  
*Created: 21/8/2025*  
*Updated: 29/8/2025*
