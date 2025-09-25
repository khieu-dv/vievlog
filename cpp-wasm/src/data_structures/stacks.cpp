#include "stacks.h"
#include <stdexcept>
#include <sstream>
#include <algorithm>

namespace DataStructures {

    Stack::Stack() : data() {}

    void Stack::push(int value) {
        data.push_back(value);
    }

    int Stack::pop() {
        if (data.empty()) {
            throw std::runtime_error("Cannot pop from empty stack");
        }
        int value = data.back();
        data.pop_back();
        return value;
    }

    int Stack::peek() const {
        if (data.empty()) {
            throw std::runtime_error("Cannot peek empty stack");
        }
        return data.back();
    }

    int Stack::top() const {
        return peek();
    }

    size_t Stack::size() const {
        return data.size();
    }

    bool Stack::empty() const {
        return data.empty();
    }

    void Stack::clear() {
        data.clear();
    }

    std::vector<int> Stack::to_vector() const {
        return data;
    }

    std::string Stack::to_string() const {
        if (data.empty()) {
            return "[]";
        }

        std::ostringstream oss;
        oss << "[";
        for (size_t i = 0; i < data.size(); ++i) {
            if (i > 0) oss << ", ";
            oss << data[i];
        }
        oss << "] (top: " << data.back() << ")";
        return oss.str();
    }

    bool Stack::contains(int value) const {
        return std::find(data.begin(), data.end(), value) != data.end();
    }

    Stack Stack::copy() const {
        Stack new_stack;
        new_stack.data = this->data;
        return new_stack;
    }
}