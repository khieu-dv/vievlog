#pragma once
#include <emscripten/bind.h>
#include <vector>
#include <string>

namespace DataStructures {
    class Stack {
    private:
        std::vector<int> data;

    public:
        // Constructor
        Stack();

        // Core operations
        void push(int value);
        int pop();
        int peek() const;
        int top() const; // alias for peek

        // Properties
        size_t size() const;
        bool empty() const;
        void clear();

        // Utility
        std::vector<int> to_vector() const;
        std::string to_string() const;

        // Advanced operations
        bool contains(int value) const;
        Stack copy() const;
    };
}