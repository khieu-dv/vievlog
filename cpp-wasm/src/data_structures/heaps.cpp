#include "heaps.h"
#include <stdexcept>
#include <sstream>
#include <algorithm>

namespace DataStructures {

    Heap::Heap() : heap_type(HeapType::MIN_HEAP) {}

    Heap::Heap(HeapType type) : heap_type(type) {}

    Heap::Heap(const std::vector<int>& values, HeapType type) : heap_type(type) {
        build_heap(values);
    }

    void Heap::heapify_up(size_t index) {
        if (index == 0) return;

        size_t parent_idx = parent(index);
        if (compare(data[index], data[parent_idx])) {
            std::swap(data[index], data[parent_idx]);
            heapify_up(parent_idx);
        }
    }

    void Heap::heapify_down(size_t index) {
        size_t left = left_child(index);
        size_t right = right_child(index);
        size_t target = index;

        if (left < data.size() && compare(data[left], data[target])) {
            target = left;
        }

        if (right < data.size() && compare(data[right], data[target])) {
            target = right;
        }

        if (target != index) {
            std::swap(data[index], data[target]);
            heapify_down(target);
        }
    }

    size_t Heap::parent(size_t index) const {
        return (index - 1) / 2;
    }

    size_t Heap::left_child(size_t index) const {
        return 2 * index + 1;
    }

    size_t Heap::right_child(size_t index) const {
        return 2 * index + 2;
    }

    bool Heap::compare(int a, int b) const {
        if (heap_type == HeapType::MIN_HEAP) {
            return a < b;
        } else {
            return a > b;
        }
    }

    void Heap::insert(int value) {
        data.push_back(value);
        heapify_up(data.size() - 1);
    }

    int Heap::extract() {
        if (data.empty()) {
            throw std::runtime_error("Cannot extract from empty heap");
        }

        int root = data[0];
        data[0] = data.back();
        data.pop_back();

        if (!data.empty()) {
            heapify_down(0);
        }

        return root;
    }

    int Heap::peek() const {
        if (data.empty()) {
            throw std::runtime_error("Cannot peek empty heap");
        }
        return data[0];
    }

    size_t Heap::size() const {
        return data.size();
    }

    bool Heap::empty() const {
        return data.empty();
    }

    void Heap::clear() {
        data.clear();
    }

    HeapType Heap::get_type() const {
        return heap_type;
    }

    std::vector<int> Heap::to_vector() const {
        return data;
    }

    std::string Heap::to_string() const {
        if (data.empty()) {
            return (heap_type == HeapType::MIN_HEAP) ? "MinHeap: []" : "MaxHeap: []";
        }

        std::ostringstream oss;
        oss << (heap_type == HeapType::MIN_HEAP ? "MinHeap: [" : "MaxHeap: [");
        for (size_t i = 0; i < data.size(); ++i) {
            if (i > 0) oss << ", ";
            oss << data[i];
        }
        oss << "] (root: " << data[0] << ", size: " << data.size() << ")";
        return oss.str();
    }

    bool Heap::is_valid_heap() const {
        for (size_t i = 0; i < data.size(); ++i) {
            size_t left = left_child(i);
            size_t right = right_child(i);

            if (left < data.size() && compare(data[left], data[i])) {
                return false;
            }
            if (right < data.size() && compare(data[right], data[i])) {
                return false;
            }
        }
        return true;
    }

    Heap Heap::copy() const {
        Heap new_heap(heap_type);
        new_heap.data = this->data;
        return new_heap;
    }

    void Heap::build_heap(const std::vector<int>& values) {
        data = values;

        if (data.size() <= 1) return;

        for (int i = static_cast<int>(data.size() / 2) - 1; i >= 0; --i) {
            heapify_down(static_cast<size_t>(i));
        }
    }

    std::vector<int> Heap::heap_sort() const {
        Heap temp_heap = copy();
        std::vector<int> result;
        result.reserve(temp_heap.size());

        while (!temp_heap.empty()) {
            result.push_back(temp_heap.extract());
        }

        return result;
    }
}