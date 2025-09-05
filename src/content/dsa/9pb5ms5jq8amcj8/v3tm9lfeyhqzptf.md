---
title: "Bảng Băm (Hash Table)"
postId: "v3tm9lfeyhqzptf"
category: "Data Structures"
created: "19/8/2025"
updated: "2/9/2025"
---

# Bảng Băm (Hash Table)


## 🎯 Mục Tiêu Bài Học

Sau bài học này, bạn sẽ:
- Hiểu **Bảng Băm** là gì và cách nó hoạt động.
- Biết các khái niệm chính: Hàm băm, Thùng chứa, Va chạm, Tỷ lệ tải.
- Biết cách viết code cho Bảng Băm bằng JavaScript.
- Áp dụng Bảng Băm vào bài toán thực tế như bộ nhớ đệm hay đếm số lần xuất hiện.
- So sánh Bảng Băm với Mảng và Danh Sách Liên Kết.

## 📝 Nội Dung Chi Tiết

### Bảng Băm (Hash Table) Là Gì?

**Bảng Băm** là cách lưu dữ liệu theo cặp khóa-giá trị (key-value), cho phép tìm kiếm nhanh với tốc độ trung bình O(1). Nó dùng **hàm băm** để biến khóa thành số chỉ vị trí trong mảng, giúp lấy dữ liệu ngay mà không cần tìm lâu.

**Ví dụ dễ hiểu**:
- **Danh bạ điện thoại**: "An" → "0901234567".
- **Từ điển**: "hello" → "xin chào".
- **Hệ thống đăng nhập**: "tên người dùng" → mật khẩu.

![Hash Table](https://www.vievlog.com/dsa/images/hash-table.jpeg)

**Xử lý va chạm bằng danh sách liên kết:**

![Hash Collision](https://www.vievlog.com/dsa/images/collision-resolution.jpeg)

### Nguyên Tắc Hoạt Động

**1. Hàm băm (Hash Function)**:
- Biến khóa thành số (hash value), rồi lấy dư với kích thước bảng để tìm vị trí.
- Ví dụ: hash("An") = 1247, vị trí = 1247 % 10 = 7 (lưu ở bucket[7]).

**2. Thùng chứa (Bucket)**:
- Mỗi vị trí trong mảng là một thùng, có thể chứa nhiều cặp key-value nếu va chạm.

**3. Va chạm (Collision)**:
- Xảy ra khi hai key có cùng vị trí.
- **Giải pháp**: Dùng Danh Sách Liên Kết để lưu nhiều phần tử trong một thùng.

### Tại Sao Bảng Băm Lại Nhanh?

**Ưu điểm tốc độ**:
- Truy cập trực tiếp đến vị trí, không cần tìm tuần tự như Mảng hay Danh Sách Liên Kết.

| Cấu trúc | Tìm kiếm | Thêm | Xóa |
|----------|----------|------|-----|
| Mảng | Chậm (O(n)) | Chậm (O(n)) | Chậm (O(n)) |
| Danh Sách Liên Kết | Chậm (O(n)) | Nhanh (O(1)) | Chậm (O(n)) |
| Bảng Băm | **Nhanh (O(1))** | **Nhanh (O(1))** | **Nhanh (O(1))** |

**Ví dụ**:
- Mảng: Tìm số điện thoại trong 10.000 tên → có thể tìm 10.000 lần.
- Bảng Băm: hash(tên) → lấy ngay vị trí.

### Cài Đặt Bảng Băm Bằng JavaScript

```javascript
import LinkedList from '../linked-list/LinkedList';

class HashTable {
  constructor(hashTableSize = 32) {
    this.buckets = Array(hashTableSize)
      .fill(null)
      .map(() => new LinkedList());
    this.keys = {};
  }

  hash(key) {
    const hash = Array.from(key).reduce(
      (hashAccumulator, keySymbol) => (
        hashAccumulator + keySymbol.charCodeAt(0)
      ),
      0,
    );
    return hash % this.buckets.length;
  }

  set(key, value) {
    const keyHash = this.hash(key);
    this.keys[key] = keyHash;
    const bucketLinkedList = this.buckets[keyHash];
    const node = bucketLinkedList.find({ 
      callback: (nodeValue) => nodeValue.key === key 
    });
    if (!node) {
      bucketLinkedList.append({ key, value });
    } else {
      node.value.value = value;
    }
  }

  get(key) {
    const bucketLinkedList = this.buckets[this.hash(key)];
    const node = bucketLinkedList.find({ 
      callback: (nodeValue) => nodeValue.key === key 
    });
    return node ? node.value.value : undefined;
  }

  delete(key) {
    const keyHash = this.hash(key);
    delete this.keys[key];
    const bucketLinkedList = this.buckets[keyHash];
    const node = bucketLinkedList.find({ 
      callback: (nodeValue) => nodeValue.key === key 
    });
    if (node) {
      return bucketLinkedList.delete(node.value);
    }
    return null;
  }

  has(key) {
    return Object.hasOwnProperty.call(this.keys, key);
  }

  getKeys() {
    return Object.keys(this.keys);
  }

  getValues() {
    return this.buckets.reduce((values, bucket) => {
      const bucketValues = bucket.toArray()
        .map((linkedListNode) => linkedListNode.value.value);
      return values.concat(bucketValues);
    }, []);
  }

  size() {
    return this.getKeys().length;
  }

  clear() {
    this.buckets = Array(this.buckets.length)
      .fill(null)
      .map(() => new LinkedList());
    this.keys = {};
  }
}
```

### Tỷ Lệ Tải (Load Factor) Và Hiệu Suất

**Tỷ lệ tải** = Số phần tử / Số thùng chứa.

**Ví dụ**: 7 phần tử trong 10 thùng = 0.7 (70%).

**Mẹo**: Giữ dưới 0.75 để tránh va chạm nhiều, giúp giữ tốc độ nhanh.

| Tiêu chí | Bảng Băm | Mảng | Danh Sách Liên Kết |
|----------|----------|------|--------------------|
| Tìm kiếm | Nhanh (O(1)) | Chậm (O(n)) | Chậm (O(n)) |
| Thêm | Nhanh (O(1)) | Chậm (O(n)) | Nhanh (O(1)) |
| Xóa | Nhanh (O(1)) | Chậm (O(n)) | Chậm (O(n)) |
| Bộ nhớ | Nhiều | Ít | Trung bình |
| Thứ tự | Không | Có | Có |

## 🏆 Bài Tập Thực Hành

### Bài Tập 1: Hệ Thống Quản Lý Sinh Viên

**Mô tả**: Xây dựng hệ thống lưu thông tin sinh viên:
- Thêm sinh viên (MSSV, tên, điểm).
- Tìm sinh viên theo MSSV.
- Cập nhật điểm.
- Xóa sinh viên.
- Liệt kê theo học lực.

```javascript
class QuanLySinhVien {
  constructor() {
    this.danhSach = new HashTable();
  }

  xacDinhHocLuc(diemTB) {
    if (diemTB >= 9.0) return "Xuất sắc";
    if (diemTB >= 8.0) return "Giỏi";
    if (diemTB >= 7.0) return "Khá";
    if (diemTB >= 5.0) return "Trung bình";
    return "Yếu";
  }

  themSinhVien(mssv, hoTen, diemTB) {
    if (!mssv || !hoTen || diemTB < 0 || diemTB > 10) {
      throw new Error("Thông tin sinh viên không hợp lệ");
    }
    const hocLuc = this.xacDinhHocLuc(diemTB);
    const thongTin = { hoTen, diemTB, hocLuc };
    this.danhSach.set(mssv, thongTin);
    console.log(`✅ Đã thêm sinh viên ${hoTen} (${mssv}) - Học lực: ${hocLuc}`);
  }

  timSinhVien(mssv) {
    const thongTin = this.danhSach.get(mssv);
    if (thongTin) {
      console.log(`🔍 Thông tin sinh viên ${mssv}:`);
      console.log(`   - Họ tên: ${thongTin.hoTen}`);
      console.log(`   - Điểm TB: ${thongTin.diemTB}`);
      console.log(`   - Học lực: ${thongTin.hocLuc}`);
      return thongTin;
    } else {
      console.log(`❌ Không tìm thấy sinh viên có MSSV: ${mssv}`);
      return null;
    }
  }

  capNhatDiem(mssv, diemMoi) {
    const thongTin = this.danhSach.get(mssv);
    if (!thongTin) {
      console.log(`❌ Không tìm thấy sinh viên ${mssv}`);
      return false;
    }
    if (diemMoi < 0 || diemMoi > 10) {
      console.log(`❌ Điểm không hợp lệ: ${diemMoi}`);
      return false;
    }
    const diemCu = thongTin.diemTB;
    thongTin.diemTB = diemMoi;
    thongTin.hocLuc = this.xacDinhHocLuc(diemMoi);
    this.danhSach.set(mssv, thongTin);
    console.log(`🔄 Đã cập nhật điểm cho ${thongTin.hoTen}: ${diemCu} → ${diemMoi}`);
    console.log(`   Học lực: ${thongTin.hocLuc}`);
    return true;
  }

  xoaSinhVien(mssv) {
    const thongTin = this.danhSach.get(mssv);
    if (thongTin) {
      this.danhSach.delete(mssv);
      console.log(`🗑️ Đã xóa sinh viên ${thongTin.hoTen} (${mssv})`);
      return true;
    } else {
      console.log(`❌ Không tìm thấy sinh viên ${mssv} để xóa`);
      return false;
    }
  }

  lietKeTheoHocLuc() {
    const phanLoai = {
      "Xuất sắc": [],
      "Giỏi": [],
      "Khá": [],
      "Trung bình": [],
      "Yếu": []
    };
    const tatCaMSSV = this.danhSach.getKeys();
    tatCaMSSV.forEach(mssv => {
      const thongTin = this.danhSach.get(mssv);
      phanLoai[thongTin.hocLuc].push({ mssv, ...thongTin });
    });
    console.log(`\n📊 Thống kê sinh viên theo học lực (Tổng: ${tatCaMSSV.length}):`);
    Object.keys(phanLoai).forEach(hocLuc => {
      const danhSach = phanLoai[hocLuc];
      console.log(`\n${hocLuc}: ${danhSach.length} sinh viên`);
      if (danhSach.length > 0) {
        danhSach
          .sort((a, b) => b.diemTB - a.diemTB)
          .forEach((sv, index) => {
            console.log(`   ${index + 1}. ${sv.hoTen} (${sv.mssv}) - Điểm TB: ${sv.diemTB}`);
          });
      }
    });
  }

  thongKe() {
    const tongSo = this.danhSach.size();
    console.log(`\n📈 Thống kê tổng quan:`);
    console.log(`- Tổng số sinh viên: ${tongSo}`);
    if (tongSo > 0) {
      let tongDiem = 0;
      const tatCaDiem = this.danhSach.getValues().map(sv => {
        tongDiem += sv.diemTB;
        return sv.diemTB;
      });
      const diemTBChung = (tongDiem / tongSo).toFixed(2);
      const diemCaoNhat = Math.max(...tatCaDiem);
      const diemThapNhat = Math.min(...tatCaDiem);
      console.log(`- Điểm TB chung: ${diemTBChung}`);
      console.log(`- Điểm cao nhất: ${diemCaoNhat}`);
      console.log(`- Điểm thấp nhất: ${diemThapNhat}`);
    }
  }
}

const qlsv = new QuanLySinhVien();
qlsv.themSinhVien("SV001", "Nguyễn Văn An", 8.5);
qlsv.themSinhVien("SV002", "Trần Thị Bình", 9.2);
qlsv.themSinhVien("SV003", "Lê Văn Cường", 7.8);
qlsv.themSinhVien("SV004", "Phạm Thị Dung", 6.5);
qlsv.themSinhVien("SV005", "Hoàng Văn Em", 4.3);
qlsv.timSinhVien("SV002");
qlsv.timSinhVien("SV999");
qlsv.capNhatDiem("SV003", 8.7);
qlsv.thongKe();
qlsv.lietKeTheoHocLuc();
qlsv.xoaSinhVien("SV005");
qlsv.lietKeTheoHocLuc();
```

### Bài Tập 2: Hệ Thống Theo Dõi Truy Cập Website

**Mô tả**: Xây dựng hệ thống theo dõi truy cập website:
- Ghi lại truy cập (IP, thời gian, URL).
- Đếm số lần truy cập theo IP.
- Tìm IP truy cập nhiều nhất.
- Phát hiện IP bất thường (quá nhiều request).
- Lọc theo thời gian.

```javascript
class WebTrafficAnalyzer {
  constructor() {
    this.thongKeIP = new HashTable(); // IP -> {count, lastAccess, timeList}
    this.lichSuTruyCap = []; // Lưu toàn bộ lịch sử
    this.nguyCoGiamSat = 100; // Ngưỡng cảnh báo: 100 request/phút
  }

  ghiTruyCap(ip, url, timestamp = Date.now()) {
    const record = { ip, url, timestamp, time: new Date(timestamp).toLocaleString() };
    this.lichSuTruyCap.push(record);
    let thongTinIP = this.thongKeIP.get(ip);
    if (!thongTinIP) {
      thongTinIP = {
        soLanTruyCap: 0,
        lanCuoiTruyCap: timestamp,
        danhSachThoiGian: [],
        cacURL: new HashTable() // Đếm URL được truy cập
      };
    }
    thongTinIP.soLanTruyCap++;
    thongTinIP.lanCuoiTruyCap = timestamp;
    thongTinIP.danhSachThoiGian.push(timestamp);
    const soLanTruyCapURL = thongTinIP.cacURL.get(url) || 0;
    thongTinIP.cacURL.set(url, soLanTruyCapURL + 1);
    this.thongKeIP.set(ip, thongTinIP);
    this.kiemTraBatThuong(ip, thongTinIP);
    console.log(`📝 Ghi truy cập: ${ip} → ${url} (${new Date(timestamp).toLocaleTimeString()})`);
  }

  kiemTraBatThuong(ip, thongTinIP) {
    const hienTai = Date.now();
    const motPhutTruoc = hienTai - 60000;
    const requestTrongPhut = thongTinIP.danhSachThoiGian.filter(
      timestamp => timestamp > motPhutTruoc
    ).length;
    if (requestTrongPhut > this.nguyCoGiamSat) {
      console.warn(`⚠️ CẢNH BÁO: IP ${ip} có ${requestTrongPhut} requests trong 1 phút!`);
    }
  }

  thongKeTheoIP() {
    const danhSachIP = this.thongKeIP.getKeys();
    const ketQua = [];
    danhSachIP.forEach(ip => {
      const thongTin = this.thongKeIP.get(ip);
      const lanCuoi = new Date(thongTin.lanCuoiTruyCap).toLocaleString();
      ketQua.push({
        ip,
        soLanTruyCap: thongTin.soLanTruyCap,
        lanCuoiTruyCap: lanCuoi,
        soURL: thongTin.cacURL.size()
      });
    });
    ketQua.sort((a, b) => b.soLanTruyCap - a.soLanTruyCap);
    console.log(`\n📊 Thống kê truy cập theo IP (${ketQua.length} IPs):`);
    console.log('Rank  | IP Address      | Requests | URLs | Last Access');
    console.log('------|-----------------|----------|------|------------------');
    ketQua.slice(0, 10).forEach((item, index) => {
      console.log(
        `${String(index + 1).padStart(4)}  | ` +
        `${item.ip.padEnd(15)} | ` +
        `${String(item.soLanTruyCap).padStart(8)} | ` +
        `${String(item.soURL).padStart(4)} | ` +
        `${item.lanCuoiTruyCap}`
      );
    });
    return ketQua;
  }

  layTopIP(soLuong = 5) {
    const thongKe = this.thongKeTheoIP();
    const top = thongKe.slice(0, soLuong);
    console.log(`\n🏆 Top ${soLuong} IP truy cập nhiều nhất:`);
    top.forEach((item, index) => {
      console.log(`${index + 1}. ${item.ip}: ${item.soLanTruyCap} requests`);
    });
    return top;
  }

  phanTichURLTheoIP(ip) {
    const thongTinIP = this.thongKeIP.get(ip);
    if (!thongTinIP) {
      console.log(`❌ Không tìm thấy dữ liệu cho IP: ${ip}`);
      return null;
    }
    console.log(`\n🔍 Phân tích URL cho IP ${ip}:`);
    console.log(`- Tổng số requests: ${thongTinIP.soLanTruyCap}`);
    console.log(`- Số URL khác nhau: ${thongTinIP.cacURL.size()}`);
    console.log(`- Lần truy cập cuối: ${new Date(thongTinIP.lanCuoiTruyCap).toLocaleString()}`);
    console.log('\nTop URLs:');
    const danhSachURL = thongTinIP.cacURL.getKeys().map(url => ({
      url,
      soLan: thongTinIP.cacURL.get(url)
    })).sort((a, b) => b.soLan - a.soLan);
    danhSachURL.slice(0, 10).forEach((item, index) => {
      console.log(`  ${index + 1}. ${item.url}: ${item.soLan} lần`);
    });
    return {
      tongSoRequests: thongTinIP.soLanTruyCap,
      soURL: thongTinIP.cacURL.size(),
      topURLs: danhSachURL
    };
  }

  locTheoThoiGian(tuThoiGian, denThoiGian) {
    const ketQua = this.lichSuTruyCap.filter(record => 
      record.timestamp >= tuThoiGian && record.timestamp <= denThoiGian
    );
    console.log(`\n📅 Lọc truy cập từ ${new Date(tuThoiGian).toLocaleString()} đến ${new Date(denThoiGian).toLocaleString()}:`);
    console.log(`- Tổng số requests: ${ketQua.length}`);
    if (ketQua.length > 0) {
      const ipStats = new HashTable();
      ketQua.forEach(record => {
        const count = ipStats.get(record.ip) || 0;
        ipStats.set(record.ip, count + 1);
      });
      console.log(`- Số IP khác nhau: ${ipStats.size()}`);
      const topIPTrongKhoang = ipStats.getKeys().map(ip => ({
        ip,
        count: ipStats.get(ip)
      })).sort((a, b) => b.count - a.count);
      console.log('\nTop IP trong khoảng thời gian:');
      topIPTrongKhoang.slice(0, 5).forEach((item, index) => {
        console.log(`  ${index + 1}. ${item.ip}: ${item.count} requests`);
      });
    }
    return ketQua;
  }

  tomTatTongQuan() {
    console.log(`\n📈 Tóm tắt hệ thống theo dõi website:`);
    console.log(`- Tổng số requests: ${this.lichSuTruyCap.length}`);
    console.log(`- Tổng số IP khác nhau: ${this.thongKeIP.size()}`);
    if (this.lichSuTruyCap.length > 0) {
      const cuoi = this.lichSuTruyCap[this.lichSuTruyCap.length - 1];
      const dau = this.lichSuTruyCap[0];
      const khoangThoiGian = (cuoi.timestamp - dau.timestamp) / 1000 / 60;
      console.log(`- Khoảng thời gian: ${khoangThoiGian.toFixed(1)} phút`);
      console.log(`- Tốc độ trung bình: ${(this.lichSuTruyCap.length / khoangThoiGian).toFixed(1)} requests/phút`);
    }
  }

  static moPhongTraffic() {
    const analyzer = new WebTrafficAnalyzer();
    const cacIP = [
      '192.168.1.10', '192.168.1.11', '192.168.1.12',
      '10.0.0.5', '10.0.0.8', '203.123.45.67',
      '118.69.83.102', '14.160.33.45'
    ];
    const cacURL = [
      '/', '/home', '/products', '/about', '/contact',
      '/login', '/register', '/api/users', '/api/products', '/search'
    ];
    console.log('🔄 Đang mô phỏng traffic website...');
    const hienTai = Date.now();
    for (let i = 0; i < 500; i++) {
      const ip = cacIP[Math.floor(Math.random() * cacIP.length)];
      const url = cacURL[Math.floor(Math.random() * cacURL.length)];
      const timestamp = hienTai - Math.random() * 600000;
      analyzer.ghiTruyCap(ip, url, timestamp);
    }
    console.log('\n🤖 Mô phỏng hoạt động bot...');
    const botIP = '45.76.123.89';
    for (let i = 0; i < 150; i++) {
      analyzer.ghiTruyCap(botIP, '/api/products', hienTai - Math.random() * 60000);
    }
    return analyzer;
  }
}

const webAnalyzer = WebTrafficAnalyzer.moPhongTraffic();
webAnalyzer.tomTatTongQuan();
webAnalyzer.layTopIP(5);
webAnalyzer.phanTichURLTheoIP('45.76.123.89');
const nampPhutTruoc = Date.now() - 300000;
webAnalyzer.locTheoThoiGian(nampPhutTruoc, Date.now());
```

## 🔑 Những Điểm Quan Trọng

### Hiệu Suất Và Tối Ưu

1. **Tỷ lệ tải**: Giữ dưới 0.75 để tránh va chạm nhiều.
2. **Hàm băm**: Chọn hàm phân bố đều để giảm va chạm.
3. **Mở rộng**: Tăng kích thước bảng khi tỷ lệ tải cao.
4. **Bộ nhớ**: Bảng Băm tốn bộ nhớ hơn Mảng.

### Các Lỗi Thường Gặp

1. **Va chạm sai**: Không xử lý đúng va chạm.
2. **Hàm băm kém**: Gây nhiều va chạm, chậm về O(n).
3. **Khóa thay đổi**: Không dùng đối tượng thay đổi làm khóa.
4. **Rò rỉ bộ nhớ**: Không xóa khóa cũ.
5. **Chuyển loại sai**: JavaScript chuyển khóa thành chuỗi, gây nhầm lẫn.

### So Sánh Với Cấu Trúc Khác

| Tình huống | Bảng Băm | Mảng | Danh Sách Liên Kết |
|------------|----------|------|--------------------|
| Tìm kiếm nhanh | Tốt nhất | Chậm | Chậm |
| Thêm/xóa nhanh | Tốt nhất | Chậm | Tốt |
| Bộ nhớ | Nhiều | Ít | Trung bình |
| Thứ tự | Không | Có | Có |

### Khi Nào Nên Sử Dụng Bảng Băm

**Nên dùng khi**:
- Cần tìm kiếm nhanh O(1).
- Làm bộ nhớ đệm, từ điển, cơ sở dữ liệu.
- Đếm số lần xuất hiện.
- Kiểm tra tồn tại nhanh.
- Lưu cặp key-value với key cố định.

**Không nên dùng khi**:
- Cần thứ tự dữ liệu.
- Bộ nhớ hạn chế.
- Dữ liệu ít (< 50-100 phần tử).
- Duyệt theo thứ tự thường xuyên.
- Khóa thay đổi nhiều.

### Mẹo Sử Dụng

1. **Hàm băm tốt**: Dùng hàm phân bố đều như DJB2.
2. **Kiểm tra tỷ lệ tải**: Mở rộng bảng khi cần.
3. **Xử lý va chạm đúng**: Dùng Danh Sách Liên Kết.
4. **Khóa phù hợp**: Tránh đối tượng thay đổi làm khóa.
5. **Quản lý bộ nhớ**: Xóa khóa cũ để tránh rò rỉ.

## 📝 Bài Tập Về Nhà

### Bài Tập 1: Hệ Thống Quản Lý Thư Viện Sách

**Mô tả**: Xây dựng hệ thống quản lý sách:
- Thêm, tìm kiếm, cập nhật sách (ISBN, tên, tác giả, thể loại, số lượng).
- Quản lý mượn/trả (theo dõi ngày mượn, hạn trả).
- Thống kê sách mượn nhiều, tác giả phổ biến.
- Tìm sách theo tác giả, thể loại, tình trạng.
- Cảnh báo sách quá hạn, sắp hết.

**Yêu cầu**:
- Sử dụng Bảng Băm (key: ISBN).
- Bảng phụ cho tác giả và thể loại.
- Xử lý va chạm bằng Danh Sách Liên Kết.
- Kiểm tra dữ liệu đầu vào.
- Nhập/xuất JSON.

**Dữ liệu mẫu**: 100+ sách, 15+ tác giả, 8+ thể loại, mượn/trả trong 3 tháng.

### Bài Tập 2: Hệ Thống Phân Tích Từ Khóa SEO

**Mô tả**: Xây dựng công cụ phân tích từ khóa:
- Thu thập nội dung (mô phỏng văn bản).
- Đếm từ/cụm từ (1-3 từ).
- Lọc ký tự đặc biệt, từ dừng.
- Phân tích từ xuất hiện cùng nhau.
- Xếp hạng từ khóa (TF-IDF đơn giản).
- Xuất báo cáo.

**Yêu cầu**:
- Bảng Băm chính cho từ khóa và tần suất.
- Bảng phụ cho ma trận đồng xuất hiện.
- Hỗ trợ tiếng Việt.
- Tối ưu cho văn bản lớn (5.000+ từ).
- Tiết kiệm bộ nhớ.

**Chức năng thêm**: Phát hiện từ khóa tăng đột biến, nhóm từ tương đồng, gợi ý từ liên quan, phân tích cảm xúc cơ bản.



---

*Post ID: v3tm9lfeyhqzptf*  
*Category: Data Structures*  
*Created: 19/8/2025*  
*Updated: 2/9/2025*
