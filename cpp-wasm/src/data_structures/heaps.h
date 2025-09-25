#pragma once
#include <emscripten/bind.h>
#include <vector>
#include <string>
#include <functional>

namespace DataStructures {
    enum class HeapType {
        MIN_HEAP,
        MAX_HEAP
    };

    class Heap {
    private:
        std::vector<int> data;
        HeapType heap_type;

        void heapify_up(size_t index);
        void heapify_down(size_t index);
        size_t parent(size_t index) const;
        size_t left_child(size_t index) const;
        size_t right_child(size_t index) const;
        bool compare(int a, int b) const;

    public:
        // Constructors
        Heap();
        Heap(HeapType type);
        Heap(const std::vector<int>& values, HeapType type = HeapType::MIN_HEAP);

        // Core operations
        void insert(int value);
        int extract();
        int peek() const;

        // Properties
        size_t size() const;
        bool empty() const;
        void clear();
        HeapType get_type() const;

        // Utility
        std::vector<int> to_vector() const;
        std::string to_string() const;
        bool is_valid_heap() const;

        // Advanced operations
        Heap copy() const;
        void build_heap(const std::vector<int>& values);
        std::vector<int> heap_sort() const;
    };

    class MinHeap : public Heap {
    public:
        MinHeap() : Heap(HeapType::MIN_HEAP) {}
        MinHeap(const std::vector<int>& values) : Heap(values, HeapType::MIN_HEAP) {}
    };

    class MaxHeap : public Heap {
    public:
        MaxHeap() : Heap(HeapType::MAX_HEAP) {}
        MaxHeap(const std::vector<int>& values) : Heap(values, HeapType::MAX_HEAP) {}
    };
}