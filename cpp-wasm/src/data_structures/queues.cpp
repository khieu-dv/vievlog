#include "queues.h"
#include <stdexcept>
#include <sstream>
#include <deque>

namespace DataStructures {

    Queue::Queue() : data() {}

    void Queue::enqueue(int value) {
        data.push(value);
    }

    int Queue::dequeue() {
        if (data.empty()) {
            throw std::runtime_error("Cannot dequeue from empty queue");
        }
        int value = data.front();
        data.pop();
        return value;
    }

    int Queue::front() const {
        if (data.empty()) {
            throw std::runtime_error("Queue is empty");
        }
        return data.front();
    }

    int Queue::back() const {
        if (data.empty()) {
            throw std::runtime_error("Queue is empty");
        }
        return data.back();
    }

    size_t Queue::size() const {
        return data.size();
    }

    bool Queue::empty() const {
        return data.empty();
    }

    void Queue::clear() {
        while (!data.empty()) {
            data.pop();
        }
    }

    std::vector<int> Queue::to_vector() const {
        std::vector<int> result;
        std::queue<int> temp = data;

        while (!temp.empty()) {
            result.push_back(temp.front());
            temp.pop();
        }
        return result;
    }

    std::string Queue::to_string() const {
        if (data.empty()) {
            return "[]";
        }

        auto vec = to_vector();
        std::ostringstream oss;
        oss << "[";
        for (size_t i = 0; i < vec.size(); ++i) {
            if (i > 0) oss << ", ";
            oss << vec[i];
        }
        oss << "] (front: " << vec.front() << ", back: " << vec.back() << ")";
        return oss.str();
    }

    bool Queue::contains(int value) const {
        std::queue<int> temp = data;

        while (!temp.empty()) {
            if (temp.front() == value) {
                return true;
            }
            temp.pop();
        }
        return false;
    }

    Queue Queue::copy() const {
        Queue new_queue;
        new_queue.data = this->data;
        return new_queue;
    }
}