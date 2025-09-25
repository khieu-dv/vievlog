#include "arrays.h"
#include <stdexcept>
#include <algorithm>
#include <sstream>

namespace DataStructures {

    CppVector::CppVector() : data() {}

    CppVector::CppVector(size_t capacity) {
        data.reserve(capacity);
    }

    void CppVector::push(int value) {
        data.push_back(value);
    }

    int CppVector::pop() {
        if (data.empty()) {
            throw std::runtime_error("Cannot pop from empty vector");
        }
        int value = data.back();
        data.pop_back();
        return value;
    }

    int CppVector::get(size_t index) const {
        if (index >= data.size()) {
            throw std::out_of_range("Index out of range");
        }
        return data[index];
    }

    void CppVector::set(size_t index, int value) {
        if (index >= data.size()) {
            throw std::out_of_range("Index out of range");
        }
        data[index] = value;
    }

    void CppVector::insert(size_t index, int value) {
        if (index > data.size()) {
            throw std::out_of_range("Index out of range");
        }
        data.insert(data.begin() + index, value);
    }

    void CppVector::remove(size_t index) {
        if (index >= data.size()) {
            throw std::out_of_range("Index out of range");
        }
        data.erase(data.begin() + index);
    }

    void CppVector::clear() {
        data.clear();
    }

    size_t CppVector::size() const {
        return data.size();
    }

    size_t CppVector::capacity() const {
        return data.capacity();
    }

    bool CppVector::empty() const {
        return data.empty();
    }

    int CppVector::find(int value) const {
        auto it = std::find(data.begin(), data.end(), value);
        return (it != data.end()) ? std::distance(data.begin(), it) : -1;
    }

    bool CppVector::contains(int value) const {
        return find(value) != -1;
    }

    std::vector<int> CppVector::to_vector() const {
        return data;
    }

    void CppVector::from_vector(const std::vector<int>& vec) {
        data = vec;
    }

    void CppVector::reserve(size_t new_capacity) {
        data.reserve(new_capacity);
    }

    void CppVector::resize(size_t new_size) {
        data.resize(new_size);
    }

    std::string CppVector::to_string() const {
        if (data.empty()) {
            return "[]";
        }

        std::ostringstream oss;
        oss << "[";
        for (size_t i = 0; i < data.size(); ++i) {
            if (i > 0) oss << ", ";
            oss << data[i];
        }
        oss << "]";
        return oss.str();
    }
}