---
title: "Thuật Toán Lũy Thừa Nhanh (Fast Powering Algorithm)"
postId: "5apd2qwqhojg4r5"
category: "Math Algorithms"
created: "20/8/2025"
updated: "27/8/2025"
---

# Thuật Toán Lũy Thừa Nhanh (Fast Powering Algorithm)


**Lũy thừa của một số** cho biết số lần ta cần nhân số đó với chính nó trong một phép nhân.

Nó được viết dưới dạng một số nhỏ ở phía trên bên phải của số cơ sở.

## 📋 Mục Lục

1. [Giới Thiệu](#giới-thiệu)
2. [Thuật Toán Ngây Thơ](#thuật-toán-ngây-thơ)
3. [Thuật Toán Lũy Thừa Nhanh](#thuật-toán-lũy-thừa-nhanh)
4. [Cài Đặt Chi Tiết](#cài-đặt-chi-tiết)
5. [Ví Dụ Sử Dụng](#ví-dụ-sử-dụng)
6. [Phân Tích Độ Phức Tạp](#phân-tích-độ-phức-tạp)
7. [Ứng Dụng Thực Tế](#ứng-dụng-thực-tế)
8. [Các Biến Thể](#các-biến-thể)

## 🎯 Giới Thiệu

### Khái Niệm Lũy Thừa

Lũy thừa là phép toán quan trọng trong toán học:
- **a^n** = a × a × a × ... × a (n lần)
- **a**: Cơ số (base)
- **n**: Số mũ (exponent/power)

```javascript
/**
 * Demo khái niệm lũy thừa cơ bản
 */
function demoKhaiNiemLuyThua() {
    console.log('📚 KHÁI NIỆM LŨY THỪA CƠ BẢN:');
    console.log('=============================');
    
    // Các ví dụ cơ bản
    const viDu = [
        { co_so: 2, so_mu: 0, ket_qua: 1, giai_thich: "Bất kỳ số nào mũ 0 đều bằng 1" },
        { co_so: 2, so_mu: 1, ket_qua: 2, giai_thich: "2^1 = 2" },
        { co_so: 2, so_mu: 2, ket_qua: 4, giai_thich: "2^2 = 2 × 2" },
        { co_so: 2, so_mu: 3, ket_qua: 8, giai_thich: "2^3 = 2 × 2 × 2" },
        { co_so: 3, so_mu: 4, ket_qua: 81, giai_thich: "3^4 = 3 × 3 × 3 × 3" },
        { co_so: 5, so_mu: 2, ket_qua: 25, giai_thich: "5^2 = 5 × 5" }
    ];
    
    console.log('Cơ số | Số mũ | Kết quả | Giải thích');
    console.log('------|-------|---------|---------------------------');
    
    viDu.forEach(vd => {
        console.log(`${vd.co_so.toString().padStart(5)} | ${vd.so_mu.toString().padStart(5)} | ${vd.ket_qua.toString().padStart(7)} | ${vd.giai_thich}`);
    });
    
    // Ứng dụng thực tế
    console.log('\n🌟 ỨNG DỤNG THỰC TẾ:');
    console.log('- Tính diện tích hình vuông: cạnh^2');
    console.log('- Tính thể tích hình lập phương: cạnh^3');
    console.log('- Tăng trưởng mũ: vốn × (1 + lãi_suất)^năm');
    console.log('- Khoa học máy tính: 2^n (số lượng bit)');
    console.log('- Mật mã học: (số^khóa) mod p');
}

demoKhaiNiemLuyThua();
```

## 🐌 Thuật Toán Ngây Thơ

### Phương Pháp Cơ Bản

Cách đơn giản nhất để tính a^n là nhân a với chính nó n lần.

```javascript
/**
 * Thuật toán lũy thừa ngây thơ
 * @param {number} co_so - Số cơ sở
 * @param {number} so_mu - Số mũ
 * @return {number} - Kết quả lũy thừa
 */
function luyThuaNgayTho(co_so, so_mu) {
    console.log(`🐌 TÍNH ${co_so}^${so_mu} BẰNG THUẬT TOÁN NGÂY THƠ:`);
    
    if (so_mu === 0) {
        console.log(`   ${co_so}^0 = 1 (theo định nghĩa)`);
        return 1;
    }
    
    if (so_mu < 0) {
        throw new Error('Thuật toán này chỉ hỗ trợ số mũ không âm');
    }
    
    let ket_qua = 1;
    let buoc = 0;
    
    console.log(`   Bắt đầu với kết quả = 1`);
    
    for (let i = 0; i < so_mu; i++) {
        buoc++;
        const ket_qua_cu = ket_qua;
        ket_qua *= co_so;
        console.log(`   Bước ${buoc}: ${ket_qua_cu} × ${co_so} = ${ket_qua}`);
    }
    
    console.log(`   🎯 Kết quả cuối cùng: ${co_so}^${so_mu} = ${ket_qua}`);
    console.log(`   📊 Số phép nhân: ${so_mu}`);
    console.log(`   ⏰ Độ phức tạp thời gian: O(${so_mu})`);
    
    return ket_qua;
}

// Demo
luyThuaNgayTho(2, 8);
console.log('\n' + '='.repeat(50));
luyThuaNgayTho(3, 5);
```

### Vấn Đề của Thuật Toán Ngây Thơ

```javascript
/**
 * Phân tích vấn đề của thuật toán ngây thơ
 */
function phanTichVanDeNgayTho() {
    console.log('\n⚠️ VẤN ĐỀ CỦA THUẬT TOÁN NGÂY THƠ:');
    console.log('===================================');
    
    // Benchmark với các số mũ khác nhau
    const test_cases = [10, 20, 50, 100, 1000];
    
    console.log('Số mũ | Số phép toán | Thời gian ước tính');
    console.log('------|--------------|-------------------');
    
    test_cases.forEach(n => {
        const so_phep_toan = n;
        const thoi_gian_uoc_tinh = n * 0.001; // Giả sử mỗi phép toán mất 1ms
        
        console.log(`${n.toString().padStart(5)} | ${so_phep_toan.toString().padStart(12)} | ${thoi_gian_uoc_tinh.toFixed(3)}ms`);
    });
    
    console.log('\n🚨 NHẬN XÉT:');
    console.log('- Số phép toán tăng tuyến tính theo số mũ');
    console.log('- Với số mũ lớn (vd: 2^1000), thuật toán trở nên chậm chạp');
    console.log('- Không hiệu quả cho các ứng dụng thực tế');
    console.log('- Cần một thuật toán tốt hơn! 💡');
}

phanTichVanDeNgayTho();
```

## ⚡ Thuật Toán Lũy Thừa Nhanh

### Ý Tưởng Chính

Thuật toán lũy thừa nhanh sử dụng nguyên lý "chia để trị" (divide and conquer):

**Cho số mũ chẵn:**
```
X^Y = X^(Y/2) × X^(Y/2)
```

**Cho số mũ lẻ:**
```
X^Y = X^(Y//2) × X^(Y//2) × X
(trong đó Y//2 là phần nguyên của Y/2)
```

```javascript
/**
 * Minh họa ý tưởng thuật toán lũy thừa nhanh
 */
function minhHoaYTuongNhanh() {
    console.log('💡 Ý TƯỞNG THUẬT TOÁN LŨY THỪA NHANH:');
    console.log('====================================');
    
    console.log('🔢 VÍ DỤ: Tính 2^8');
    console.log('Cách ngây thơ: 2 × 2 × 2 × 2 × 2 × 2 × 2 × 2 (7 phép nhân)');
    console.log('');
    console.log('Cách thông minh:');
    console.log('2^8 = 2^4 × 2^4');
    console.log('2^4 = 2^2 × 2^2'); 
    console.log('2^2 = 2 × 2 = 4');
    console.log('');
    console.log('Tính từ dưới lên:');
    console.log('Bước 1: 2^2 = 4 (1 phép nhân)');
    console.log('Bước 2: 2^4 = 4 × 4 = 16 (1 phép nhân)');
    console.log('Bước 3: 2^8 = 16 × 16 = 256 (1 phép nhân)');
    console.log('Tổng cộng: 3 phép nhân thay vì 7!');
    
    console.log('\n🔢 VÍ DỤ: Tính 2^9 (số mũ lẻ)');
    console.log('2^9 = 2^4 × 2^4 × 2');
    console.log('2^4 = 16 (đã tính ở trên)');
    console.log('2^9 = 16 × 16 × 2 = 512');
    console.log('Tổng cộng: 4 phép nhân');
    
    console.log('\n📊 SO SÁNH:');
    console.log('Số mũ | Ngây thơ | Lũy thừa nhanh | Cải thiện');
    console.log('------|----------|----------------|----------');
    
    const comparisons = [
        { n: 4, naive: 3, fast: 2 },
        { n: 8, naive: 7, fast: 3 },
        { n: 16, naive: 15, fast: 4 },
        { n: 32, naive: 31, fast: 5 },
        { n: 64, naive: 63, fast: 6 },
        { n: 1024, naive: 1023, fast: 10 }
    ];
    
    comparisons.forEach(comp => {
        const improvement = (comp.naive / comp.fast).toFixed(1);
        console.log(`${comp.n.toString().padStart(5)} | ${comp.naive.toString().padStart(8)} | ${comp.fast.toString().padStart(14)} | ${improvement}x nhanh hơn`);
    });
}

minhHoaYTuongNhanh();
```

### Cài Đặt Đệ Quy

```javascript
/**
 * Thuật toán lũy thừa nhanh (phiên bản đệ quy)
 * Độ phức tạp: O(log n)
 * 
 * @param {number} co_so - Số cơ sở
 * @param {number} so_mu - Số mũ
 * @return {number} - Kết quả lũy thừa
 */
function luyThuaNhanh(co_so, so_mu) {
    // Base case: bất kỳ số nào mũ 0 đều bằng 1
    if (so_mu === 0) {
        return 1;
    }
    
    if (so_mu % 2 === 0) {
        // Nếu số mũ chẵn: x^n = x^(n/2) × x^(n/2)
        const multiplier = luyThuaNhanh(co_so, so_mu / 2);
        return multiplier * multiplier;
    }
    
    // Nếu số mũ lẻ: x^n = x^(n//2) × x^(n//2) × x
    const multiplier = luyThuaNhanh(co_so, Math.floor(so_mu / 2));
    return multiplier * multiplier * co_so;
}

/**
 * Phiên bản có debug để hiển thị quá trình tính toán
 */
function luyThuaNhanhDebug(co_so, so_mu, level = 0) {
    const indent = '  '.repeat(level);
    console.log(`${indent}🔍 Tính ${co_so}^${so_mu}`);
    
    // Base case
    if (so_mu === 0) {
        console.log(`${indent}✅ Base case: ${co_so}^0 = 1`);
        return 1;
    }
    
    if (so_mu % 2 === 0) {
        // Số mũ chẵn
        console.log(`${indent}📝 ${so_mu} là số chẵn → ${co_so}^${so_mu} = ${co_so}^${so_mu/2} × ${co_so}^${so_mu/2}`);
        const multiplier = luyThuaNhanhDebug(co_so, so_mu / 2, level + 1);
        const result = multiplier * multiplier;
        console.log(`${indent}🎯 ${co_so}^${so_mu/2} = ${multiplier} → ${multiplier} × ${multiplier} = ${result}`);
        return result;
    } else {
        // Số mũ lẻ
        const half_power = Math.floor(so_mu / 2);
        console.log(`${indent}📝 ${so_mu} là số lẻ → ${co_so}^${so_mu} = ${co_so}^${half_power} × ${co_so}^${half_power} × ${co_so}`);
        const multiplier = luyThuaNhanhDebug(co_so, half_power, level + 1);
        const result = multiplier * multiplier * co_so;
        console.log(`${indent}🎯 ${co_so}^${half_power} = ${multiplier} → ${multiplier} × ${multiplier} × ${co_so} = ${result}`);
        return result;
    }
}

// Demo thuật toán
console.log('\n⚡ DEMO THUẬT TOÁN LŨY THỪA NHANH:');
console.log('=================================');

console.log('🔍 TRƯỜNG HỢP 1: 2^8 (số mũ chẵn)');
luyThuaNhanhDebug(2, 8);

console.log('\n🔍 TRƯỜNG HỢP 2: 2^9 (số mũ lẻ)');
luyThuaNhanhDebug(2, 9);

console.log('\n🔍 TRƯỜNG HỢP 3: 3^5');
luyThuaNhanhDebug(3, 5);
```

### Cài Đặt Lặp (Iterative)

```javascript
/**
 * Thuật toán lũy thừa nhanh phiên bản lặp
 * Sử dụng binary exponentiation
 */
function luyThuaNhanhLap(co_so, so_mu) {
    console.log(`\n🔄 THUẬT TOÁN LŨY THỪA NHANH (PHIÊN BẢN LẶP):`);
    console.log(`Tính ${co_so}^${so_mu}`);
    
    if (so_mu === 0) return 1;
    
    let ket_qua = 1;
    let co_so_hien_tai = co_so;
    let so_mu_hien_tai = so_mu;
    let buoc = 0;
    
    console.log(`\nBiểu diễn nhị phân của ${so_mu}: ${so_mu.toString(2)}`);
    console.log(`Đọc từ phải sang trái:`);
    
    while (so_mu_hien_tai > 0) {
        buoc++;
        const bit = so_mu_hien_tai % 2;
        
        console.log(`\nBước ${buoc}:`);
        console.log(`  Số mũ hiện tại: ${so_mu_hien_tai}, bit cuối: ${bit}`);
        console.log(`  Cơ số hiện tại: ${co_so_hien_tai}`);
        console.log(`  Kết quả trước: ${ket_qua}`);
        
        if (bit === 1) {
            ket_qua *= co_so_hien_tai;
            console.log(`  Bit = 1 → nhân kết quả với cơ số: ${ket_qua}`);
        } else {
            console.log(`  Bit = 0 → không nhân`);
        }
        
        co_so_hien_tai *= co_so_hien_tai;
        so_mu_hien_tai = Math.floor(so_mu_hien_tai / 2);
        
        console.log(`  Cơ số mới (bình phương): ${co_so_hien_tai}`);
        console.log(`  Số mũ mới (chia 2): ${so_mu_hien_tai}`);
    }
    
    console.log(`\n🎯 Kết quả cuối cùng: ${ket_qua}`);
    return ket_qua;
}

// Demo phiên bản lặp
luyThuaNhanhLap(2, 10);
```

## 💾 Cài Đặt Chi Tiết

### Phiên Bản Cơ Bản (Theo Code Gốc)

```javascript
/**
 * Thuật toán lũy thừa nhanh
 * Cài đặt đệ quy để tính lũy thừa
 * 
 * Độ phức tạp: O(log(n))
 * 
 * @param {number} base - Số sẽ được nâng lên lũy thừa
 * @param {number} power - Số mũ
 * @return {number}
 */
export default function fastPowering(base, power) {
    if (power === 0) {
        // Bất kỳ số nào mũ 0 đều bằng 1
        return 1;
    }

    if (power % 2 === 0) {
        // Nếu số mũ chẵn...
        // ta có thể định nghĩa đệ quy kết quả qua lũy thừa nhỏ hơn một nửa:
        // x^8 = x^4 * x^4
        const multiplier = fastPowering(base, power / 2);
        return multiplier * multiplier;
    }

    // Nếu số mũ lẻ...
    // ta có thể định nghĩa đệ quy kết quả qua lũy thừa nhỏ hơn một nửa:
    // x^9 = x^4 * x^4 * x
    const multiplier = fastPowering(base, Math.floor(power / 2));
    return multiplier * multiplier * base;
}
```

### Phiên Bản Nâng Cao

```javascript
/**
 * Lớp FastPower với nhiều tính năng nâng cao
 */
class FastPower {
    constructor() {
        this.cache = new Map();
        this.computationSteps = [];
        this.enableLogging = false;
    }
    
    /**
     * Tính lũy thừa với cache và logging
     * @param {number} base 
     * @param {number} exponent 
     * @return {number}
     */
    power(base, exponent) {
        this.computationSteps = [];
        return this._powerWithCache(base, exponent);
    }
    
    /**
     * Tính lũy thừa với cache
     * @private
     */
    _powerWithCache(base, exponent) {
        const key = `${base}^${exponent}`;
        
        if (this.cache.has(key)) {
            this._log(`📋 Cache hit: ${key} = ${this.cache.get(key)}`);
            return this.cache.get(key);
        }
        
        const result = this._computePower(base, exponent);
        this.cache.set(key, result);
        
        return result;
    }
    
    /**
     * Tính toán lũy thừa thực tế
     * @private
     */
    _computePower(base, exponent) {
        this._log(`🔍 Tính ${base}^${exponent}`);
        
        // Xử lý trường hợp đặc biệt
        if (exponent === 0) {
            this._log(`✅ Base case: ${base}^0 = 1`);
            this.computationSteps.push({ base, exponent, result: 1, type: 'base_case' });
            return 1;
        }
        
        if (exponent === 1) {
            this._log(`✅ Base case: ${base}^1 = ${base}`);
            this.computationSteps.push({ base, exponent, result: base, type: 'base_case' });
            return base;
        }
        
        if (exponent < 0) {
            this._log(`🔄 Số mũ âm: ${base}^${exponent} = 1/(${base}^${-exponent})`);
            const positiveResult = this._computePower(base, -exponent);
            const result = 1 / positiveResult;
            this.computationSteps.push({ base, exponent, result, type: 'negative_exponent' });
            return result;
        }
        
        // Trường hợp chính
        if (exponent % 2 === 0) {
            this._log(`📝 ${exponent} chẵn → ${base}^${exponent} = ${base}^${exponent/2} × ${base}^${exponent/2}`);
            const halfPower = this._powerWithCache(base, exponent / 2);
            const result = halfPower * halfPower;
            
            this.computationSteps.push({ 
                base, 
                exponent, 
                result, 
                type: 'even',
                halfPower,
                operations: 1 
            });
            
            this._log(`🎯 ${base}^${exponent/2} = ${halfPower} → ${halfPower} × ${halfPower} = ${result}`);
            return result;
        } else {
            const halfExponent = Math.floor(exponent / 2);
            this._log(`📝 ${exponent} lẻ → ${base}^${exponent} = ${base}^${halfExponent} × ${base}^${halfExponent} × ${base}`);
            
            const halfPower = this._powerWithCache(base, halfExponent);
            const result = halfPower * halfPower * base;
            
            this.computationSteps.push({ 
                base, 
                exponent, 
                result, 
                type: 'odd',
                halfPower,
                operations: 2 
            });
            
            this._log(`🎯 ${base}^${halfExponent} = ${halfPower} → ${halfPower} × ${halfPower} × ${base} = ${result}`);
            return result;
        }
    }
    
    /**
     * Tính lũy thừa modular: (base^exponent) mod modulus
     * Quan trọng trong mật mã học
     */
    powerMod(base, exponent, modulus) {
        this._log(`🔐 Tính (${base}^${exponent}) mod ${modulus}`);
        
        if (modulus === 1) return 0;
        
        let result = 1;
        base = base % modulus;
        
        while (exponent > 0) {
            if (exponent % 2 === 1) {
                result = (result * base) % modulus;
            }
            
            exponent = Math.floor(exponent / 2);
            base = (base * base) % modulus;
        }
        
        return result;
    }
    
    /**
     * Tính ma trận lũy thừa
     * Cho ma trận vuông A, tính A^n
     */
    matrixPower(matrix, exponent) {
        const n = matrix.length;
        
        // Ma trận đơn vị
        const identity = Array(n).fill().map((_, i) => 
            Array(n).fill().map((_, j) => i === j ? 1 : 0)
        );
        
        if (exponent === 0) return identity;
        
        if (exponent === 1) return matrix;
        
        if (exponent % 2 === 0) {
            const halfPower = this.matrixPower(matrix, exponent / 2);
            return this._multiplyMatrices(halfPower, halfPower);
        } else {
            const halfPower = this.matrixPower(matrix, Math.floor(exponent / 2));
            const squared = this._multiplyMatrices(halfPower, halfPower);
            return this._multiplyMatrices(squared, matrix);
        }
    }
    
    /**
     * Nhân hai ma trận
     * @private
     */
    _multiplyMatrices(A, B) {
        const n = A.length;
        const result = Array(n).fill().map(() => Array(n).fill(0));
        
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                for (let k = 0; k < n; k++) {
                    result[i][j] += A[i][k] * B[k][j];
                }
            }
        }
        
        return result;
    }
    
    /**
     * Bật/tắt logging
     */
    setLogging(enabled) {
        this.enableLogging = enabled;
    }
    
    /**
     * Log helper
     * @private
     */
    _log(message) {
        if (this.enableLogging) {
            console.log(message);
        }
    }
    
    /**
     * Hiển thị thống kê tính toán
     */
    getStats() {
        const totalSteps = this.computationSteps.length;
        const totalOperations = this.computationSteps.reduce((sum, step) => 
            sum + (step.operations || 1), 0);
        
        const typeCount = this.computationSteps.reduce((acc, step) => {
            acc[step.type] = (acc[step.type] || 0) + 1;
            return acc;
        }, {});
        
        return {
            totalSteps,
            totalOperations,
            cacheSize: this.cache.size,
            typeBreakdown: typeCount,
            steps: this.computationSteps
        };
    }
    
    /**
     * Xóa cache
     */
    clearCache() {
        this.cache.clear();
        this.computationSteps = [];
    }
}

// Demo lớp FastPower
function demoFastPowerClass() {
    console.log('\n💻 DEMO LỚP FASTPOWER:');
    console.log('======================');
    
    const fp = new FastPower();
    fp.setLogging(true);
    
    // Test cơ bản
    console.log('\n1️⃣ TEST CƠ BẢN:');
    const result1 = fp.power(2, 10);
    console.log(`Kết quả: 2^10 = ${result1}`);
    
    // Test với số mũ âm
    console.log('\n2️⃣ TEST SỐ MŨ ÂM:');
    const result2 = fp.power(2, -3);
    console.log(`Kết quả: 2^(-3) = ${result2}`);
    
    // Test modular arithmetic
    console.log('\n3️⃣ TEST MODULAR:');
    const result3 = fp.powerMod(2, 10, 1000);
    console.log(`Kết quả: (2^10) mod 1000 = ${result3}`);
    
    // Hiển thị thống kê
    console.log('\n📊 THỐNG KÊ:');
    const stats = fp.getStats();
    console.log(`Tổng số bước: ${stats.totalSteps}`);
    console.log(`Tổng phép toán: ${stats.totalOperations}`);
    console.log(`Kích thước cache: ${stats.cacheSize}`);
    console.log(`Phân loại bước:`, stats.typeBreakdown);
}

demoFastPowerClass();
```

## 📊 Phân Tích Độ Phức Tạp

### So Sánh Độ Phức Tạp

```javascript
/**
 * Phân tích và so sánh độ phức tạp
 */
function phanTichDoPhucTap() {
    console.log('\n📊 PHÂN TÍCH ĐỘ PHỨC TẠP:');
    console.log('==========================');
    
    console.log('🔍 PHÂN TÍCH LÝ THUYẾT:');
    console.log('');
    console.log('📈 Thuật toán ngây thơ:');
    console.log('   - Thời gian: O(n) - tuyến tính');
    console.log('   - Không gian: O(1) - hằng số');
    console.log('   - Số phép nhân: n');
    console.log('');
    console.log('⚡ Thuật toán lũy thừa nhanh:');
    console.log('   - Thời gian: O(log n) - logarit');
    console.log('   - Không gian: O(log n) - cho stack đệ quy');
    console.log('   - Số phép nhân: ≤ 2×log₂(n)');
    console.log('');
    
    // Benchmark thực tế
    console.log('⏱️ BENCHMARK THỰC TẾ:');
    
    function countOperationsNaive(exponent) {
        return exponent;
    }
    
    function countOperationsFast(exponent) {
        if (exponent === 0) return 0;
        if (exponent === 1) return 0;
        
        let count = 0;
        while (exponent > 1) {
            count++;
            exponent = Math.floor(exponent / 2);
        }
        return count;
    }
    
    const testExponents = [2, 4, 8, 16, 32, 64, 128, 256, 512, 1024];
    
    console.log('\nSố mũ | Ngây thơ | Lũy thừa nhanh | Tỉ lệ cải thiện');
    console.log('------|----------|----------------|----------------');
    
    testExponents.forEach(exp => {
        const naiveOps = countOperationsNaive(exp);
        const fastOps = countOperationsFast(exp);
        const improvement = (naiveOps / Math.max(fastOps, 1)).toFixed(1);
        
        console.log(`${exp.toString().padStart(5)} | ${naiveOps.toString().padStart(8)} | ${fastOps.toString().padStart(14)} | ${improvement}x`);
    });
    
    // Biểu đồ tăng trưởng
    console.log('\n📈 BIỂU ĐỒ TĂNG TRƯỞNG (Số phép toán):');
    console.log('```');
    
    const maxExp = 64;
    const scale = 50 / maxExp; // Scale cho hiển thị
    
    for (let exp = 2; exp <= maxExp; exp *= 2) {
        const naiveOps = countOperationsNaive(exp);
        const fastOps = countOperationsFast(exp);
        
        const naiveBar = '█'.repeat(Math.max(1, naiveOps * scale));
        const fastBar = '▓'.repeat(Math.max(1, fastOps * scale * 5)); // Scale lên để thấy được
        
        console.log(`n=${exp.toString().padStart(2)}: Naive ${naiveBar} (${naiveOps})`);
        console.log(`     Fast   ${fastBar} (${fastOps})`);
        console.log('');
    }
    console.log('```');
}

phanTichDoPhucTap();
```

### Benchmark Hiệu Suất

```javascript
/**
 * Benchmark hiệu suất thực tế
 */
function benchmarkHieuSuat() {
    console.log('\n⏱️ BENCHMARK HIỆU SUẤT THỰC TẾ:');
    console.log('===============================');
    
    // Cài đặt các phiên bản để test
    function naivePower(base, exp) {
        if (exp === 0) return 1;
        let result = 1;
        for (let i = 0; i < exp; i++) {
            result *= base;
        }
        return result;
    }
    
    function fastPowerRecursive(base, exp) {
        if (exp === 0) return 1;
        if (exp % 2 === 0) {
            const half = fastPowerRecursive(base, exp / 2);
            return half * half;
        }
        const half = fastPowerRecursive(base, Math.floor(exp / 2));
        return half * half * base;
    }
    
    function fastPowerIterative(base, exp) {
        if (exp === 0) return 1;
        let result = 1;
        let currentBase = base;
        let currentExp = exp;
        
        while (currentExp > 0) {
            if (currentExp % 2 === 1) {
                result *= currentBase;
            }
            currentBase *= currentBase;
            currentExp = Math.floor(currentExp / 2);
        }
        return result;
    }
    
    // Test cases
    const testCases = [
        { base: 2, exp: 10 },
        { base: 3, exp: 15 },
        { base: 5, exp: 20 },
        { base: 2, exp: 30 }
    ];
    
    console.log('Base^Exp | Naive (ms) | Fast Rec (ms) | Fast Iter (ms) | Speedup');
    console.log('---------|------------|---------------|----------------|--------');
    
    testCases.forEach(({ base, exp }) => {
        const iterations = 100000;
        
        // Benchmark naive
        const startNaive = performance.now();
        for (let i = 0; i < iterations; i++) {
            naivePower(base, exp);
        }
        const timeNaive = performance.now() - startNaive;
        
        // Benchmark fast recursive
        const startFastRec = performance.now();
        for (let i = 0; i < iterations; i++) {
            fastPowerRecursive(base, exp);
        }
        const timeFastRec = performance.now() - startFastRec;
        
        // Benchmark fast iterative
        const startFastIter = performance.now();
        for (let i = 0; i < iterations; i++) {
            fastPowerIterative(base, exp);
        }
        const timeFastIter = performance.now() - startFastIter;
        
        const speedupRec = (timeNaive / timeFastRec).toFixed(1);
        const speedupIter = (timeNaive / timeFastIter).toFixed(1);
        
        console.log(`${base}^${exp.toString().padStart(2)} | ${timeNaive.toFixed(2).padStart(10)} | ${timeFastRec.toFixed(2).padStart(13)} | ${timeFastIter.toFixed(2).padStart(14)} | ${speedupRec}x / ${speedupIter}x`);
    });
    
    console.log('\n💡 NHẬN XÉT:');
    console.log('- Phiên bản iterative thường nhanh hơn recursive (ít overhead)');
    console.log('- Với số mũ lớn, sự khác biệt càng rõ rệt');
    console.log('- JavaScript engine đã tối ưu hóa Math.pow(), nhưng thuật toán này vẫn hữu ích cho modular arithmetic');
}

benchmarkHieuSuat();
```

## 🚀 Ứng Dụng Thực Tế

### 1. Hệ Thống Mật Mã RSA

```javascript
/**
 * Hệ thống mật mã RSA sử dụng fast powering
 */
class RSACrypto {
    constructor() {
        this.fastPower = new FastPower();
    }
    
    /**
     * Tạo khóa RSA đơn giản (chỉ để demo)
     */
    taoKhoa() {
        console.log('🔐 TẠO KHÓA RSA:');
        console.log('================');
        
        // Chọn hai số nguyên tố nhỏ (trong thực tế phải rất lớn)
        const p = 61;
        const q = 53;
        const n = p * q; // 3233
        const phi = (p - 1) * (q - 1); // 3120
        
        // Chọn e (thường là 65537, nhưng dùng số nhỏ để demo)
        const e = 17;
        
        // Tính d (khóa riêng)
        const d = this.timModInverse(e, phi);
        
        console.log(`p = ${p}, q = ${q}`);
        console.log(`n = p × q = ${n}`);
        console.log(`φ(n) = (p-1) × (q-1) = ${phi}`);
        console.log(`e = ${e} (khóa công khai)`);
        console.log(`d = ${d} (khóa riêng)`);
        
        return {
            khoaCongKhai: { n, e },
            khoaRieng: { n, d },
            thongTin: { p, q, phi }
        };
    }
    
    /**
     * Mã hóa thông điệp
     */
    maHoa(thongDiep, khoaCongKhai) {
        console.log(`\n🔒 MÃ HÓA THÔNG ĐIỆP:`);
        console.log(`Thông điệp: ${thongDiep}`);
        console.log(`Sử dụng khóa công khai (n=${khoaCongKhai.n}, e=${khoaCongKhai.e})`);
        
        const { n, e } = khoaCongKhai;
        
        // Chuyển thông điệp thành số (giản đơn)
        const soThongDiep = this.chuoiThanhSo(thongDiep);
        console.log(`Thông điệp dưới dạng số: ${soThongDiep}`);
        
        // Mã hóa: c = m^e mod n
        const banMa = this.fastPower.powerMod(soThongDiep, e, n);
        console.log(`Bản mã: ${soThongDiep}^${e} mod ${n} = ${banMa}`);
        
        return banMa;
    }
    
    /**
     * Giải mã thông điệp
     */
    giaiMa(banMa, khoaRieng) {
        console.log(`\n🔓 GIẢI MÃ THÔNG ĐIỆP:`);
        console.log(`Bản mã: ${banMa}`);
        console.log(`Sử dụng khóa riêng (n=${khoaRieng.n}, d=${khoaRieng.d})`);
        
        const { n, d } = khoaRieng;
        
        // Giải mã: m = c^d mod n
        const soThongDiep = this.fastPower.powerMod(banMa, d, n);
        console.log(`Thông điệp gốc (số): ${banMa}^${d} mod ${n} = ${soThongDiep}`);
        
        // Chuyển số về chuỗi
        const thongDiep = this.soThanhChuoi(soThongDiep);
        console.log(`Thông điệp gốc: "${thongDiep}"`);
        
        return thongDiep;
    }
    
    /**
     * Ký số (digital signature)
     */
    kyso(thongDiep, khoaRieng) {
        console.log(`\n✍️ KÝ SỐ THÔNG ĐIỆP:`);
        console.log(`Thông điệp: "${thongDiep}"`);
        
        const { n, d } = khoaRieng;
        const hash = this.tinhHash(thongDiep);
        
        console.log(`Hash của thông điệp: ${hash}`);
        
        // Ký: signature = hash^d mod n
        const chuKy = this.fastPower.powerMod(hash, d, n);
        console.log(`Chữ ký: ${hash}^${d} mod ${n} = ${chuKy}`);
        
        return chuKy;
    }
    
    /**
     * Xác thực chữ ký
     */
    xacThucChuKy(thongDiep, chuKy, khoaCongKhai) {
        console.log(`\n✅ XÁC THỰC CHỮ KÝ:`);
        console.log(`Thông điệp: "${thongDiep}"`);
        console.log(`Chữ ký: ${chuKy}`);
        
        const { n, e } = khoaCongKhai;
        const hashGoc = this.tinhHash(thongDiep);
        
        // Xác thực: hash = signature^e mod n
        const hashXacThuc = this.fastPower.powerMod(chuKy, e, n);
        
        console.log(`Hash gốc: ${hashGoc}`);
        console.log(`Hash từ chữ ký: ${chuKy}^${e} mod ${n} = ${hashXacThuc}`);
        
        const hopLe = hashGoc === hashXacThuc;
        console.log(`Kết quả xác thực: ${hopLe ? '✅ HỢP LỆ' : '❌ KHÔNG HỢP LỆ'}`);
        
        return hopLe;
    }
    
    // Helper methods
    chuoiThanhSo(chuoi) {
        let so = 0;
        for (let i = 0; i < chuoi.length; i++) {
            so = so * 256 + chuoi.charCodeAt(i);
        }
        return so;
    }
    
    soThanhChuoi(so) {
        let chuoi = '';
        while (so > 0) {
            chuoi = String.fromCharCode(so % 256) + chuoi;
            so = Math.floor(so / 256);
        }
        return chuoi;
    }
    
    tinhHash(chuoi) {
        // Hash đơn giản (không an toàn, chỉ để demo)
        let hash = 0;
        for (let i = 0; i < chuoi.length; i++) {
            hash = (hash * 31 + chuoi.charCodeAt(i)) % 1000;
        }
        return hash;
    }
    
    timModInverse(a, m) {
        // Thuật toán Extended Euclidean đơn giản
        for (let i = 1; i < m; i++) {
            if ((a * i) % m === 1) {
                return i;
            }
        }
        return 1;
    }
    
    /**
     * Demo đầy đủ hệ thống RSA
     */
    demoHeThongRSA() {
        console.log('🔐 DEMO HỆ THỐNG MẬT MÃ RSA');
        console.log('===========================');
        
        // 1. Tạo khóa
        const khoa = this.taoKhoa();
        
        // 2. Mã hóa
        const thongDiep = "Hello";
        const banMa = this.maHoa(thongDiep, khoa.khoaCongKhai);
        
        // 3. Giải mã
        const thongDiepGiaiMa = this.giaiMa(banMa, khoa.khoaRieng);
        
        // 4. Ký số
        const chuKy = this.kyso(thongDiep, khoa.khoaRieng);
        
        // 5. Xác thực
        this.xacThucChuKy(thongDiep, chuKy, khoa.khoaCongKhai);
        
        // 6. Test xác thực với thông điệp sai
        console.log('\n🧪 TEST VỚI THÔNG ĐIỆP SAI:');
        this.xacThucChuKy("Hello!", chuKy, khoa.khoaCongKhai);
        
        console.log('\n💡 LƯU Ý QUAN TRỌNG:');
        console.log('- Đây chỉ là demo đơn giản');
        console.log('- RSA thực tế sử dụng số nguyên tố rất lớn (2048+ bit)');
        console.log('- Cần padding schemes (OAEP, PSS) để bảo mật');
        console.log('- Hash function phải mạnh (SHA-256, SHA-3)');
    }
}

// Demo RSA
const rsa = new RSACrypto();
rsa.demoHeThongRSA();
```

### 2. Hệ Thống Tính Toán Số Học Lớn

```javascript
/**
 * Hệ thống tính toán với số nguyên lớn
 */
class BigIntegerMath {
    constructor() {
        this.cache = new Map();
    }
    
    /**
     * Tính lũy thừa với BigInt
     */
    powerBigInt(base, exponent) {
        console.log(`🔢 TÍNH LŨY THỪA VỚI SỐ LỚN:`);
        console.log(`${base}^${exponent}`);
        
        if (typeof base !== 'bigint') base = BigInt(base);
        if (typeof exponent !== 'bigint') exponent = BigInt(exponent);
        
        if (exponent === 0n) return 1n;
        if (exponent === 1n) return base;
        
        if (exponent % 2n === 0n) {
            const half = this.powerBigInt(base, exponent / 2n);
            return half * half;
        } else {
            const half = this.powerBigInt(base, exponent / 2n);
            return half * half * base;
        }
    }
    
    /**
     * Tính số Fibonacci thứ n bằng ma trận lũy thừa
     * F(n) = [[1,1],[1,0]]^n * [F(1), F(0)]
     */
    fibonacciMatrix(n) {
        console.log(`\n🌀 TÍNH FIBONACCI THỨ ${n} BẰNG MA TRẬN:`);
        
        if (n <= 0) return 0;
        if (n === 1) return 1;
        
        // Ma trận Fibonacci: [[1,1],[1,0]]
        const fibMatrix = [[1n, 1n], [1n, 0n]];
        
        // Tính ma trận^(n-1)
        const resultMatrix = this.matrixPowerBigInt(fibMatrix, BigInt(n - 1));
        
        // F(n) = element [0][0] của ma trận kết quả
        const result = resultMatrix[0][0];
        
        console.log(`F(${n}) = ${result}`);
        return result;
    }
    
    /**
     * Lũy thừa ma trận với BigInt
     */
    matrixPowerBigInt(matrix, exponent) {
        const n = matrix.length;
        
        // Ma trận đơn vị
        const identity = Array(n).fill().map((_, i) => 
            Array(n).fill().map((_, j) => i === j ? 1n : 0n)
        );
        
        if (exponent === 0n) return identity;
        if (exponent === 1n) return matrix;
        
        if (exponent % 2n === 0n) {
            const half = this.matrixPowerBigInt(matrix, exponent / 2n);
            return this.multiplyMatricesBigInt(half, half);
        } else {
            const half = this.matrixPowerBigInt(matrix, exponent / 2n);
            const squared = this.multiplyMatricesBigInt(half, half);
            return this.multiplyMatricesBigInt(squared, matrix);
        }
    }
    
    /**
     * Nhân ma trận BigInt
     */
    multiplyMatricesBigInt(A, B) {
        const n = A.length;
        const result = Array(n).fill().map(() => Array(n).fill(0n));
        
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                for (let k = 0; k < n; k++) {
                    result[i][j] += A[i][k] * B[k][j];
                }
            }
        }
        
        return result;
    }
    
    /**
     * Tính giai thừa bằng fast powering (cho factorial-like functions)
     */
    factorialPower(n, step = 1) {
        console.log(`\n📈 TÍNH DẠNG GIAI THỪA ${n}! (bước ${step}):`);
        
        if (n <= 1) return 1n;
        
        // Sử dụng chia để trị để tính nhanh hơn
        return this.factorialRange(1, n);
    }
    
    factorialRange(start, end) {
        if (start > end) return 1n;
        if (start === end) return BigInt(start);
        
        const mid = Math.floor((start + end) / 2);
        const left = this.factorialRange(start, mid);
        const right = this.factorialRange(mid + 1, end);
        
        return left * right;
    }
    
    /**
     * Tính số Catalan thứ n: C(n) = (2n)! / ((n+1)! * n!)
     */
    catalanNumber(n) {
        console.log(`\n🔺 TÍNH SỐ CATALAN THỨ ${n}:`);
        
        if (n <= 1) return 1n;
        
        // Công thức tối ưu: C(n) = C(2n, n) / (n+1)
        const binomial = this.binomialCoefficient(2 * n, n);
        const result = binomial / BigInt(n + 1);
        
        console.log(`C(${n}) = C(${2*n}, ${n}) / ${n+1} = ${binomial} / ${n+1} = ${result}`);
        return result;
    }
    
    /**
     * Tính hệ số nhị thức C(n, k) = n! / (k! * (n-k)!)
     */
    binomialCoefficient(n, k) {
        if (k > n) return 0n;
        if (k === 0 || k === n) return 1n;
        
        // Tối ưu: C(n, k) = C(n, n-k)
        if (k > n - k) k = n - k;
        
        let result = 1n;
        for (let i = 0; i < k; i++) {
            result = result * BigInt(n - i) / BigInt(i + 1);
        }
        
        return result;
    }
    
    /**
     * Tính số Stirling loại 2: S(n, k)
     * Số cách phân n phần tử vào k nhóm không rỗng
     */
    stirlingSecond(n, k) {
        console.log(`\n🎲 TÍNH SỐ STIRLING LOẠI 2 S(${n}, ${k}):`);
        
        if (n === 0 && k === 0) return 1n;
        if (n === 0 || k === 0) return 0n;
        if (k > n) return 0n;
        
        // Công thức: S(n,k) = k*S(n-1,k) + S(n-1,k-1)
        const dp = Array(n + 1).fill().map(() => Array(k + 1).fill(0n));
        
        dp[0][0] = 1n;
        
        for (let i = 1; i <= n; i++) {
            for (let j = 1; j <= Math.min(i, k); j++) {
                dp[i][j] = BigInt(j) * dp[i-1][j] + dp[i-1][j-1];
            }
        }
        
        const result = dp[n][k];
        console.log(`S(${n}, ${k}) = ${result}`);
        return result;
    }
    
    /**
     * Demo hệ thống số học lớn
     */
    demoHeThongSoHocLon() {
        console.log('🔢 DEMO HỆ THỐNG SỐ HỌC LỚN');
        console.log('============================');
        
        // 1. Lũy thừa số lớn
        console.log('\n1️⃣ LŨY THỪA SỐ LỚN:');
        const bigResult = this.powerBigInt(123, 45);
        console.log(`123^45 = ${bigResult}`);
        console.log(`Số chữ số: ${bigResult.toString().length}`);
        
        // 2. Fibonacci lớn
        console.log('\n2️⃣ FIBONACCI LỚN:');
        const fibonacci100 = this.fibonacciMatrix(100);
        console.log(`Số chữ số của F(100): ${fibonacci100.toString().length}`);
        
        // 3. Giai thừa lớn
        console.log('\n3️⃣ GIAI THỪA LỚN:');
        const factorial50 = this.factorialPower(50);
        console.log(`50! = ${factorial50}`);
        console.log(`Số chữ số: ${factorial50.toString().length}`);
        
        // 4. Số Catalan
        console.log('\n4️⃣ SỐ CATALAN:');
        for (let i = 0; i <= 10; i++) {
            const catalan = this.catalanNumber(i);
            console.log(`C(${i}) = ${catalan}`);
        }
        
        // 5. Hệ số nhị thức lớn
        console.log('\n5️⃣ HỆ SỐ NHỊ THỨC LỚN:');
        const bigBinomial = this.binomialCoefficient(100, 50);
        console.log(`C(100, 50) = ${bigBinomial}`);
        console.log(`Số chữ số: ${bigBinomial.toString().length}`);
        
        // 6. So sánh hiệu suất
        console.log('\n6️⃣ SO SÁNH HIỆU SUẤT:');
        
        console.time('Fibonacci(1000) bằng ma trận');
        this.fibonacciMatrix(1000);
        console.timeEnd('Fibonacci(1000) bằng ma trận');
        
        console.time('Lũy thừa 2^1000');
        this.powerBigInt(2, 1000);
        console.timeEnd('Lũy thừa 2^1000');
    }
}

// Demo hệ thống số học lớn
const bigMath = new BigIntegerMath();
bigMath.demoHeThongSoHocLon();
```

### 3. Hệ Thống Tính Toán Khoa Học

```javascript
/**
 * Hệ thống tính toán khoa học sử dụng fast powering
 */
class ScientificComputation {
    constructor() {
        this.fastPower = new FastPower();
    }
    
    /**
     * Tính lãi kép: A = P(1 + r)^t
     */
    laiKep(vonBanDau, laiSuat, soKy) {
        console.log(`💰 TÍNH LÃI KÉP:`);
        console.log(`Vốn ban đầu: $${vonBanDau.toLocaleString()}`);
        console.log(`Lãi suất: ${(laiSuat * 100).toFixed(2)}% mỗi kỳ`);
        console.log(`Số kỳ: ${soKy}`);
        
        const heSoTang = 1 + laiSuat;
        const heSoTongCong = this.fastPower.power(heSoTang, soKy);
        const soTienCuoi = vonBanDau * heSoTongCong;
        const laiThu = soTienCuoi - vonBanDau;
        
        console.log(`\nKết quả:`);
        console.log(`- Hệ số tăng trưởng: (1 + ${laiSuat})^${soKy} = ${heSoTongCong.toFixed(6)}`);
        console.log(`- Số tiền cuối kỳ: $${soTienCuoi.toLocaleString()}`);
        console.log(`- Lãi thu được: $${laiThu.toLocaleString()}`);
        console.log(`- Tỷ lệ tăng: ${((soTienCuoi / vonBanDau - 1) * 100).toFixed(2)}%`);
        
        return soTienCuoi;
    }
    
    /**
     * Mô hình tăng trưởng dân số: P(t) = P₀ × e^(rt)
     * Xấp xỉ e^x bằng chuỗi Taylor và fast powering
     */
    tangTruongDanSo(danSoBanDau, tyLeTangTruong, soNam) {
        console.log(`\n👥 MÔ HÌNH TĂNG TRƯỞNG DÂN SỐ:`);
        console.log(`Dân số ban đầu: ${danSoBanDau.toLocaleString()} người`);
        console.log(`Tỷ lệ tăng trưởng: ${(tyLeTangTruong * 100).toFixed(2)}%/năm`);
        console.log(`Thời gian: ${soNam} năm`);
        
        // Xấp xỉ e^(rt) bằng (1 + rt/n)^n với n lớn
        const n = 365; // Tính theo ngày
        const heSoNgay = (1 + tyLeTangTruong / n);
        const soNgay = soNam * n;
        
        const heSoTang = this.fastPower.power(heSoNgay, soNgay);
        const danSoCuoi = danSoBanDau * heSoTang;
        
        console.log(`\nKết quả:`);
        console.log(`- Hệ số tăng trưởng: (1 + ${tyLeTangTruong}/${n})^${soNgay} ≈ e^${tyLeTangTruong * soNam} = ${heSoTang.toFixed(6)}`);
        console.log(`- Dân số sau ${soNam} năm: ${Math.round(danSoCuoi).toLocaleString()} người`);
        console.log(`- Tăng thêm: ${Math.round(danSoCuoi - danSoBanDau).toLocaleString()} người`);
        console.log(`- Tỷ lệ tăng: ${((danSoCuoi / danSoBanDau - 1) * 100).toFixed(2)}%`);
        
        return danSoCuoi;
    }
    
    /**
     * Tính năng lượng phóng xạ: N(t) = N₀ × (1/2)^(t/T)
     */
    phanRaPhongXa(luongBanDau, chuKyBanRa, thoiGian) {
        console.log(`\n☢️ PHÂN RÃ PHÓNG XẠ:`);
        console.log(`Lượng chất ban đầu: ${luongBanDau} đơn vị`);
        console.log(`Chu kỳ bán rã: ${chuKyBanRa} năm`);
        console.log(`Thời gian: ${thoiGian} năm`);
        
        const soNuaChuKy = thoiGian / chuKyBanRa;
        const heSoPhanRa = this.fastPower.power(0.5, soNuaChuKy);
        const luongConLai = luongBanDau * heSoPhanRa;
        const luongPhanRa = luongBanDau - luongConLai;
        
        console.log(`\nKết quả:`);
        console.log(`- Số chu kỳ bán rã: ${thoiGian}/${chuKyBanRa} = ${soNuaChuKy.toFixed(2)}`);
        console.log(`- Hệ số phân rã: (1/2)^${soNuaChuKy.toFixed(2)} = ${heSoPhanRa.toFixed(6)}`);
        console.log(`- Lượng còn lại: ${luongConLai.toFixed(4)} đơn vị`);
        console.log(`- Lượng đã phân rã: ${luongPhanRa.toFixed(4)} đơn vị`);
        console.log(`- Phần trăm còn lại: ${(heSoPhanRa * 100).toFixed(2)}%`);
        
        return luongConLai;
    }
    
    /**
     * Tính cường độ ánh sáng qua môi trường: I = I₀ × e^(-αx)
     */
    cuongDoAnhSang(cuongDoBanDau, heSoHapThu, doDày) {
        console.log(`\n💡 CƯỜNG ĐỘ ÁNH SÁNG QUA MÔI TRƯỜNG:`);
        console.log(`Cường độ ban đầu: ${cuongDoBanDau} lumen`);
        console.log(`Hệ số hấp thụ: ${heSoHapThu} /cm`);
        console.log(`Độ dày môi trường: ${doDày} cm`);
        
        // Xấp xỉ e^(-αx) bằng (1 - αx/n)^n
        const n = 1000;
        const heSo = 1 - (heSoHapThu * doDày) / n;
        const cuongDoSauMoiTruong = cuongDoBanDau * this.fastPower.power(heSo, n);
        const tyLeMatMat = 1 - cuongDoSauMoiTruong / cuongDoBanDau;
        
        console.log(`\nKết quả:`);
        console.log(`- Cường độ sau môi trường: ${cuongDoSauMoiTruong.toFixed(4)} lumen`);
        console.log(`- Tỷ lệ mất mát: ${(tyLeMatMat * 100).toFixed(2)}%`);
        console.log(`- Tỷ lệ truyền qua: ${((1 - tyLeMatMat) * 100).toFixed(2)}%`);
        
        return cuongDoSauMoiTruong;
    }
    
    /**
     * Mô hình lan truyền dịch bệnh: I(t) = I₀ × R₀^(t/T)
     */
    lanTruyenDichBenh(soCabanDau, heSoLanTruyen, chuKyLanTruyen, soNgay) {
        console.log(`\n🦠 MÔ HÌNH LAN TRUYỀN DỊCH BỆNH:`);
        console.log(`Số ca ban đầu: ${soCabanDau}`);
        console.log(`Hệ số lan truyền R₀: ${heSoLanTruyen}`);
        console.log(`Chu kỳ lan truyền: ${chuKyLanTruyen} ngày`);
        console.log(`Thời gian dự báo: ${soNgay} ngày`);
        
        const soChuKy = soNgay / chuKyLanTruyen;
        const soCaDuBao = soCabanDau * this.fastPower.power(heSoLanTruyen, soChuKy);
        
        console.log(`\nKết quả dự báo:`);
        console.log(`- Số chu kỳ lan truyền: ${soChuKy.toFixed(2)}`);
        console.log(`- Số ca sau ${soNgay} ngày: ${Math.round(soCaDuBao).toLocaleString()}`);
        console.log(`- Tỷ lệ tăng: ${((soCaDuBao / soCabanDau - 1) * 100).toFixed(0)}%`);
        
        // Tính số ca tích lũy
        let soCaTichLuy = soCabanDau;
        if (heSoLanTruyen !== 1) {
            soCaTichLuy = soCabanDau * (this.fastPower.power(heSoLanTruyen, soChuKy) - 1) / (heSoLanTruyen - 1);
        } else {
            soCaTichLuy = soCabanDau * soChuKy;
        }
        
        console.log(`- Tổng số ca tích lũy: ${Math.round(soCaTichLuy).toLocaleString()}`);
        
        return {
            soCaDuBao: Math.round(soCaDuBao),
            soCaTichLuy: Math.round(soCaTichLuy)
        };
    }
    
    /**
     * Demo toàn bộ hệ thống tính toán khoa học
     */
    demoHeThongKhoaHoc() {
        console.log('🔬 DEMO HỆ THỐNG TÍNH TOÁN KHOA HỌC');
        console.log('===================================');
        
        // 1. Tài chính
        console.log('\n📊 1. ỨNG DỤNG TÀI CHÍNH:');
        this.laiKep(100000, 0.08, 20); // 100k USD, 8%/năm, 20 năm
        
        // 2. Dân số học
        console.log('\n📊 2. ỨNG DỤNG DÂN SỐ HỌC:');
        this.tangTruongDanSo(1000000, 0.02, 50); // 1 triệu người, 2%/năm, 50 năm
        
        // 3. Vật lý hạt nhân
        console.log('\n📊 3. ỨNG DỤNG VẬT LÝ HẠT NHÂN:');
        this.phanRaPhongXa(100, 5730, 11460); // Carbon-14, 2 chu kỳ bán rã
        
        // 4. Quang học
        console.log('\n📊 4. ỨNG DỤNG QUANG HỌC:');
        this.cuongDoAnhSang(1000, 0.1, 50); // 1000 lumen, α=0.1, dày 50cm
        
        // 5. Y học dịch tễ
        console.log('\n📊 5. ỨNG DỤNG Y HỌC DỊCH TỄ:');
        this.lanTruyenDichBenh(10, 2.5, 5, 30); // 10 ca, R₀=2.5, chu kỳ 5 ngày, dự báo 30 ngày
        
        console.log('\n💡 TỔNG KẾT:');
        console.log('- Fast powering là công cụ mạnh mẽ trong tính toán khoa học');
        console.log('- Giúp mô hình hóa các quá trình tăng trưởng/giảm mũ');
        console.log('- Hiệu quả với các số mũ lớn trong thực tế');
        console.log('- Ứng dụng rộng rãi từ tài chính đến vật lý');
    }
}

// Demo hệ thống khoa học
const sciComp = new ScientificComputation();
sciComp.demoHeThongKhoaHoc();
```

## 🔄 Các Biến Thể

### Binary Exponentiation với Modulo

```javascript
/**
 * Các biến thể của thuật toán lũy thừa nhanh
 */
class FastPoweringVariants {
    /**
     * Lũy thừa modular: (base^exp) mod m
     * Quan trọng trong mật mã học và lý thuyết số
     */
    powerMod(base, exp, mod) {
        console.log(`🔐 LŨY THỪA MODULAR: (${base}^${exp}) mod ${mod}`);
        
        if (mod === 1) return 0;
        
        let result = 1;
        base = base % mod;
        let currentExp = exp;
        let step = 0;
        
        console.log(`Bước | Exp | Base | Result | Nhận xét`);
        console.log('-----|-----|------|--------|----------');
        
        while (currentExp > 0) {
            step++;
            
            if (currentExp % 2 === 1) {
                result = (result * base) % mod;
                console.log(`${step.toString().padStart(4)} | ${currentExp.toString().padStart(3)} | ${base.toString().padStart(4)} | ${result.toString().padStart(6)} | Exp lẻ, nhân result`);
            } else {
                console.log(`${step.toString().padStart(4)} | ${currentExp.toString().padStart(3)} | ${base.toString().padStart(4)} | ${result.toString().padStart(6)} | Exp chẵn, bỏ qua`);
            }
            
            currentExp = Math.floor(currentExp / 2);
            base = (base * base) % mod;
        }
        
        console.log(`\n🎯 Kết quả: (${arguments[0]}^${arguments[1]}) mod ${mod} = ${result}`);
        return result;
    }
    
    /**
     * Lũy thừa ma trận nhanh
     */
    matrixPower(matrix, exp) {
        console.log(`\n📐 LŨY THỪA MA TRẬN:`);
        this.printMatrix('Ma trận gốc', matrix);
        console.log(`Lũy thừa: ${exp}`);
        
        const n = matrix.length;
        
        // Ma trận đơn vị
        const identity = Array(n).fill().map((_, i) => 
            Array(n).fill().map((_, j) => i === j ? 1 : 0)
        );
        
        if (exp === 0) {
            this.printMatrix('Kết quả (ma trận đơn vị)', identity);
            return identity;
        }
        
        if (exp === 1) {
            this.printMatrix('Kết quả', matrix);
            return matrix;
        }
        
        if (exp % 2 === 0) {
            const halfPower = this.matrixPower(matrix, exp / 2);
            const result = this.multiplyMatrices(halfPower, halfPower);
            this.printMatrix(`Kết quả A^${exp}`, result);
            return result;
        } else {
            const halfPower = this.matrixPower(matrix, Math.floor(exp / 2));
            const squared = this.multiplyMatrices(halfPower, halfPower);
            const result = this.multiplyMatrices(squared, matrix);
            this.printMatrix(`Kết quả A^${exp}`, result);
            return result;
        }
    }
    
    /**
     * Lũy thừa với cơ số thực, số mũ nguyên
     */
    realBasePower(base, exp) {
        console.log(`\n🔢 LŨY THỪA CƠ SỞ THỰC: ${base}^${exp}`);
        
        if (exp === 0) return 1.0;
        if (exp < 0) return 1.0 / this.realBasePower(base, -exp);
        
        if (exp % 2 === 0) {
            const half = this.realBasePower(base, exp / 2);
            const result = half * half;
            console.log(`${base}^${exp/2} = ${half.toFixed(6)} → ${half.toFixed(6)}² = ${result.toFixed(6)}`);
            return result;
        } else {
            const half = this.realBasePower(base, Math.floor(exp / 2));
            const result = half * half * base;
            console.log(`${base}^${Math.floor(exp/2)} = ${half.toFixed(6)} → ${half.toFixed(6)}² × ${base} = ${result.toFixed(6)}`);
            return result;
        }
    }
    
    /**
     * Lũy thừa với BigInt (số rất lớn)
     */
    bigIntPower(base, exp) {
        console.log(`\n🔢 LŨY THỪA SỐ LỚN: ${base}^${exp}`);
        
        if (typeof base !== 'bigint') base = BigInt(base);
        if (typeof exp !== 'bigint') exp = BigInt(exp);
        
        if (exp === 0n) return 1n;
        if (exp === 1n) return base;
        
        if (exp % 2n === 0n) {
            const half = this.bigIntPower(base, exp / 2n);
            return half * half;
        } else {
            const half = this.bigIntPower(base, exp / 2n);
            return half * half * base;
        }
    }
    
    /**
     * Lũy thừa trong trường hữu hạn GF(p)
     */
    galoisFieldPower(base, exp, prime) {
        console.log(`\n🧮 LŨY THỪA TRONG TRƯỜNG GALOIS GF(${prime}):`);
        console.log(`${base}^${exp} trong GF(${prime})`);
        
        // Trong GF(p), a^(p-1) ≡ 1 (định lý Fermat nhỏ)
        exp = exp % (prime - 1);
        console.log(`Tối ưu hóa: ${arguments[1]} mod ${prime-1} = ${exp}`);
        
        return this.powerMod(base, exp, prime);
    }
    
    // Helper methods
    printMatrix(title, matrix) {
        console.log(`${title}:`);
        matrix.forEach(row => {
            console.log(`  [${row.map(x => x.toString().padStart(4)).join(', ')}]`);
        });
    }
    
    multiplyMatrices(A, B) {
        const n = A.length;
        const result = Array(n).fill().map(() => Array(n).fill(0));
        
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                for (let k = 0; k < n; k++) {
                    result[i][j] += A[i][k] * B[k][j];
                }
            }
        }
        
        return result;
    }
    
    /**
     * Demo tất cả các biến thể
     */
    demoAllVariants() {
        console.log('🔄 DEMO TẤT CẢ CÁC BIẾN THỂ');
        console.log('===========================');
        
        // 1. Modular exponentiation
        this.powerMod(3, 10, 7);
        
        // 2. Matrix exponentiation
        const fibMatrix = [[1, 1], [1, 0]];
        this.matrixPower(fibMatrix, 10);
        
        // 3. Real base
        this.realBasePower(1.5, 10);
        
        // 4. BigInt
        const bigResult = this.bigIntPower(2, 100);
        console.log(`\n🔢 BigInt result: 2^100 = ${bigResult}`);
        console.log(`Số chữ số: ${bigResult.toString().length}`);
        
        // 5. Galois Field
        this.galoisFieldPower(3, 100, 7);
        
        console.log('\n💡 NHẬN XÉT:');
        console.log('- Mỗi biến thể phù hợp với ứng dụng cụ thể');
        console.log('- Modular: Mật mã học, lý thuyết số');
        console.log('- Matrix: Fibonacci, Linear recurrence');
        console.log('- BigInt: Tính toán độ chính xác cao');
        console.log('- Galois Field: Mã hóa, sửa lỗi');
    }
}

// Demo các biến thể
const variants = new FastPoweringVariants();
variants.demoAllVariants();
```

## 🧪 Test Cases Toàn Diện

```javascript
/**
 * Test cases toàn diện cho fast powering
 */
function chayTestToanDien() {
    console.log('\n🧪 TEST CASES TOÀN DIỆN FAST POWERING');
    console.log('====================================');
    
    const testSuites = [
        {
            ten: 'Trường hợp cơ bản',
            tests: [
                { base: 2, exp: 0, expected: 1, moTa: 'Bất kỳ số nào mũ 0' },
                { base: 5, exp: 1, expected: 5, moTa: 'Số mũ 1' },
                { base: 2, exp: 2, expected: 4, moTa: 'Lũy thừa đơn giản' },
                { base: 3, exp: 3, expected: 27, moTa: '3³' },
                { base: 10, exp: 3, expected: 1000, moTa: '10³' }
            ]
        },
        {
            ten: 'Số mũ lớn',
            tests: [
                { base: 2, exp: 10, expected: 1024, moTa: '2¹⁰' },
                { base: 2, exp: 16, expected: 65536, moTa: '2¹⁶' },
                { base: 3, exp: 10, expected: 59049, moTa: '3¹⁰' },
                { base: 5, exp: 7, expected: 78125, moTa: '5⁷' }
            ]
        },
        {
            ten: 'Trường hợp đặc biệt',
            tests: [
                { base: 1, exp: 100, expected: 1, moTa: '1 mũ bất kỳ' },
                { base: 0, exp: 5, expected: 0, moTa: '0 mũ dương' },
                { base: -2, exp: 3, expected: -8, moTa: 'Cơ số âm, mũ lẻ' },
                { base: -2, exp: 4, expected: 16, moTa: 'Cơ số âm, mũ chẵn' }
            ]
        }
    ];
    
    let tongTest = 0;
    let testThanhCong = 0;
    
    testSuites.forEach(suite => {
        console.log(`\n📝 Test Suite: ${suite.ten}`);
        console.log('-'.repeat(40));
        
        suite.tests.forEach(test => {
            tongTest++;
            
            try {
                const ketQua = fastPowering(test.base, test.exp);
                const thanhCong = ketQua === test.expected;
                
                if (thanhCong) {
                    testThanhCong++;
                    console.log(`   ✅ ${test.moTa}: ${test.base}^${test.exp} = ${ketQua}`);
                } else {
                    console.log(`   ❌ ${test.moTa}: ${test.base}^${test.exp} = ${ketQua}, expected ${test.expected}`);
                }
            } catch (error) {
                console.log(`   ❌ ${test.moTa}: Lỗi ${error.message}`);
            }
        });
    });
    
    // Performance comparison
    console.log('\n⏱️ SO SÁNH HIỆU SUẤT:');
    console.log('-'.repeat(30));
    
    function naivePower(base, exp) {
        let result = 1;
        for (let i = 0; i < exp; i++) {
            result *= base;
        }
        return result;
    }
    
    const perfTests = [
        { base: 2, exp: 20 },
        { base: 3, exp: 15 },
        { base: 5, exp: 10 }
    ];
    
    perfTests.forEach(test => {
        const iterations = 10000;
        
        // Test naive
        const startNaive = performance.now();
        for (let i = 0; i < iterations; i++) {
            naivePower(test.base, test.exp);
        }
        const timeNaive = performance.now() - startNaive;
        
        // Test fast
        const startFast = performance.now();
        for (let i = 0; i < iterations; i++) {
            fastPowering(test.base, test.exp);
        }
        const timeFast = performance.now() - startFast;
        
        const speedup = (timeNaive / timeFast).toFixed(1);
        console.log(`${test.base}^${test.exp}: Naive ${timeNaive.toFixed(2)}ms, Fast ${timeFast.toFixed(2)}ms (${speedup}x nhanh hơn)`);
    });
    
    // Accuracy test với số lớn
    console.log('\n🎯 TEST ĐỘ CHÍNH XÁC VỚI SỐ LỚN:');
    
    const accuracyTests = [
        { base: 2, exp: 30 },
        { base: 3, exp: 20 },
        { base: 7, exp: 15 }
    ];
    
    accuracyTests.forEach(test => {
        const fastResult = fastPowering(test.base, test.exp);
        const mathResult = Math.pow(test.base, test.exp);
        const accurate = Math.abs(fastResult - mathResult) < 1e-10;
        
        console.log(`${test.base}^${test.exp}: Fast=${fastResult}, Math.pow=${mathResult} ${accurate ? '✅' : '❌'}`);
    });
    
    // Tóm tắt
    console.log('\n' + '='.repeat(50));
    console.log('📊 TỔNG KẾT TEST:');
    console.log(`   Tổng số test: ${tongTest}`);
    console.log(`   Thành công: ${testThanhCong}`);
    console.log(`   Thất bại: ${tongTest - testThanhCong}`);
    console.log(`   Tỉ lệ thành công: ${(testThanhCong / tongTest * 100).toFixed(2)}%`);
    
    if (testThanhCong === tongTest) {
        console.log('🎉 TẤT CẢ TEST CASES ĐỀU THÀNH CÔNG!');
    } else {
        console.log('⚠️ CÓ TEST CASES THẤT BẠI!');
    }
}

// Hàm cơ bản cho test (copy từ code gốc)
function fastPowering(base, power) {
    if (power === 0) {
        return 1;
    }

    if (power % 2 === 0) {
        const multiplier = fastPowering(base, power / 2);
        return multiplier * multiplier;
    }

    const multiplier = fastPowering(base, Math.floor(power / 2));
    return multiplier * multiplier * base;
}

// Chạy test toàn diện
chayTestToanDien();
```

## 📚 Tài Liệu Tham Khảo

1. **Tài liệu học thuật:**
   - [Wikipedia - Exponentiation by Squaring](https://en.wikipedia.org/wiki/Exponentiation_by_squaring)
   - [YouTube - Fast Powering](https://www.youtube.com/watch?v=LUWavfN9zEo)
   - "Introduction to Algorithms" by Cormen et al.

2. **Ứng dụng thực tế:**
   - Mật mã học (RSA, Diffie-Hellman)
   - Lý thuyết số (modular arithmetic)
   - Tính toán khoa học (compound interest, growth models)
   - Computer graphics (matrix transformations)

3. **Chủ đề liên quan:**
   - Binary representation
   - Divide and conquer algorithms
   - Modular arithmetic
   - Matrix operations

## 🎯 Kết Luận

Thuật toán lũy thừa nhanh là một trong những thuật toán cơ bản nhất và quan trọng nhất trong khoa học máy tính:

**Ưu điểm chính:**
- ✅ Giảm độ phức tạp từ O(n) xuống O(log n)
- ✅ Ứng dụng rộng rãi trong mật mã học
- ✅ Cài đặt đơn giản với đệ quy hoặc lặp
- ✅ Hiệu quả với số mũ lớn

**Ứng dụng quan trọng:**
- 🔐 Mật mã RSA và các hệ thống bảo mật
- 🧮 Tính toán với số nguyên lớn
- 📊 Mô hình tăng trưởng trong khoa học
- 🎮 Tối ưu hóa trong game development

**Khuyến nghị:**
- Sử dụng phiên bản iterative cho hiệu suất tốt nhất
- Kết hợp với modular arithmetic trong mật mã
- Áp dụng cho ma trận trong các bài toán đệ quy tuyến tính
- Sử dụng BigInt cho tính toán độ chính xác cao

\---

*Fast powering là nền tảng cho nhiều thuật toán nâng cao và ứng dụng thực tế quan trọng! ⚡*

---

*Post ID: 5apd2qwqhojg4r5*  
*Category: Math Algorithms*  
*Created: 20/8/2025*  
*Updated: 27/8/2025*
