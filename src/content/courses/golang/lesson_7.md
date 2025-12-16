

# 🎓 **Bài 7: Maps và Structs**


## 🎯 **Mục tiêu bài học**

* Hiểu khái niệm và cách sử dụng **map** 
* Biết cách **khởi tạo**, **truy cập**, **thêm**, **xóa phần tử**, và **kiểm tra khóa tồn tại** trong map.
* Nắm vững cách định nghĩa và sử dụng **struct** 
* Áp dụng map và struct để xây dựng chương trình có tính thực tiễn cao


## 📝 **Nội dung chi tiết**


### 🧠 **1. Map là gì?**

**Khái niệm:**

Map trong Go là **cấu trúc dữ liệu ánh xạ** (dictionary/hash table) giữa **key (khóa)** và **value (giá trị)**.

* Key phải là kiểu **so sánh được** (int, string, bool...).
* Value có thể là bất kỳ kiểu dữ liệu nào.


**Cú pháp khởi tạo map:**

```go
m := make(map[string]int) 
```


### 🧠 **2. Struct là gì?**

**Khái niệm:**

Struct (cấu trúc) trong Go là **kiểu dữ liệu tùy chỉnh** do người dùng định nghĩa, để gom nhóm các **thuộc tính liên quan** đến cùng một đối tượng.

Ví dụ: struct `SinhVien` có tên, tuổi, điểm...

**Cú pháp khai báo:**

```go
type SinhVien struct {
    Ten  string
    Tuoi int
    Diem float64
}
```



### 🔄 **Struct kết hợp với Map:**

```go
type SinhVien struct {
    Ten  string
    Tuoi int
    Diem float64
}

func main() {
    ds := make(map[string]SinhVien)

    ds["sv001"] = SinhVien{"Lan", 20, 8.5}
    ds["sv002"] = SinhVien{Ten: "Minh", Tuoi: 21, Diem: 9.2}

    for ma, sv := range ds {
        fmt.Printf("Mã: %s - Tên: %s - Tuổi: %d - Điểm: %.2f\n", ma, sv.Ten, sv.Tuoi, sv.Diem)
    }
}
```



## 🏆 **Bài tập thực hành**


### ✅ **Bài tập 1: Từ điển Anh - Việt**

**Đề bài:**

Viết chương trình từ điển đơn giản dùng `map[string]string`, cho phép:

* Thêm từ mới
* Tra cứu nghĩa
* Xóa từ


### ✅ **Bài tập 2: Quản lý sinh viên**

**Đề bài:**

Tạo chương trình quản lý sinh viên:

* Sử dụng `struct SinhVien` gồm tên, tuổi, điểm.
* Lưu danh sách sinh viên vào `map[string]SinhVien` với key là mã SV.
* In toàn bộ danh sách.


## 🔑 **Những điểm quan trọng cần lưu ý**

| 🔍 Chủ đề     | ❗ Lưu ý                                                                                                          |
| ------------- | ---------------------------------------------------------------------------------------------------------------- |
| Map           | Key không tồn tại → trả về giá trị zero                                             |
| Map           | Không thể dùng slice, struct làm key                                                                             |
| Struct        | Có thể truyền struct theo giá trị hoặc con trỏ (`*Struct`)                                                       |
| Struct và Map | Map không thể chứa trực tiếp struct có field unexported |
| Khởi tạo      | Có thể dùng `make()` cho map                                                 |


## 📝 **Bài tập về nhà**


### 🧪 **Bài tập 1: Quản lý danh bạ**

**Yêu cầu:**

Tạo chương trình quản lý danh bạ điện thoại:

* Dùng `map[string]string` để lưu tên → số điện thoại
* Cho phép người dùng:

  * Thêm liên hệ
  * Tra cứu số theo tên
  * In toàn bộ danh bạ



### 🧪 **Bài tập 2: Danh sách học sinh**

**Yêu cầu:**

Viết chương trình sử dụng `struct` để mô tả học sinh gồm tên, tuổi, điểm trung bình. Lưu danh sách học sinh trong slice hoặc map.

* In học sinh có điểm trung bình > 8
* Tìm học sinh có điểm cao nhất
