#pragma once
#include <emscripten/bind.h>
#include <memory>
#include <string>
#include <vector>

namespace DataStructures {
    struct ListNode {
        int value;
        std::shared_ptr<ListNode> next;

        ListNode(int val) : value(val), next(nullptr) {}
    };

    class LinkedList {
    private:
        std::shared_ptr<ListNode> head;
        size_t list_size;

    public:
        // Constructor
        LinkedList();

        // Basic operations
        void push_front(int value);
        void push_back(int value);
        int pop_front();
        int pop_back();
        void insert(size_t index, int value);
        void remove(size_t index);
        void clear();

        // Access
        int get(size_t index) const;
        int front() const;
        int back() const;

        // Search
        int find(int value) const;
        bool contains(int value) const;

        // Properties
        size_t size() const;
        bool empty() const;

        // Utility
        std::vector<int> to_vector() const;
        std::string to_string() const;
        void reverse();

        // Advanced operations
        void remove_value(int value);
        void remove_duplicates();
    };
}