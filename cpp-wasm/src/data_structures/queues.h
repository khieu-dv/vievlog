#pragma once
#include <emscripten/bind.h>
#include <queue>
#include <vector>
#include <string>

namespace DataStructures {
    class Queue {
    private:
        std::queue<int> data;

    public:
        // Constructor
        Queue();

        // Core operations
        void enqueue(int value);
        int dequeue();
        int front() const;
        int back() const;

        // Properties
        size_t size() const;
        bool empty() const;
        void clear();

        // Utility
        std::vector<int> to_vector() const;
        std::string to_string() const;

        // Advanced operations
        bool contains(int value) const;
        Queue copy() const;
    };
}