#pragma once
#include <emscripten/bind.h>
#include <vector>
#include <string>

namespace DataStructures {
    class CppVector {
    private:
        std::vector<int> data;

    public:
        // Constructor
        CppVector();
        explicit CppVector(size_t capacity);

        // Basic operations
        void push(int value);
        int pop();
        int get(size_t index) const;
        void set(size_t index, int value);
        void insert(size_t index, int value);
        void remove(size_t index);
        void clear();

        // Properties
        size_t size() const;
        size_t capacity() const;
        bool empty() const;

        // Search operations
        int find(int value) const;
        bool contains(int value) const;

        // Utility
        std::vector<int> to_vector() const;
        void from_vector(const std::vector<int>& vec);
        void reserve(size_t new_capacity);
        void resize(size_t new_size);

        // Display
        std::string to_string() const;
    };
}