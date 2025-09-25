#include "linked_lists.h"
#include <stdexcept>
#include <sstream>

namespace DataStructures {

    LinkedList::LinkedList() : head(nullptr), list_size(0) {}

    void LinkedList::push_front(int value) {
        auto new_node = std::make_shared<ListNode>(value);
        new_node->next = head;
        head = new_node;
        list_size++;
    }

    void LinkedList::push_back(int value) {
        auto new_node = std::make_shared<ListNode>(value);

        if (!head) {
            head = new_node;
        } else {
            auto current = head;
            while (current->next) {
                current = current->next;
            }
            current->next = new_node;
        }
        list_size++;
    }

    int LinkedList::pop_front() {
        if (!head) {
            throw std::runtime_error("Cannot pop from empty list");
        }

        int value = head->value;
        head = head->next;
        list_size--;
        return value;
    }

    int LinkedList::pop_back() {
        if (!head) {
            throw std::runtime_error("Cannot pop from empty list");
        }

        if (!head->next) {
            int value = head->value;
            head = nullptr;
            list_size--;
            return value;
        }

        auto current = head;
        while (current->next->next) {
            current = current->next;
        }

        int value = current->next->value;
        current->next = nullptr;
        list_size--;
        return value;
    }

    void LinkedList::insert(size_t index, int value) {
        if (index > list_size) {
            throw std::out_of_range("Index out of range");
        }

        if (index == 0) {
            push_front(value);
            return;
        }

        auto new_node = std::make_shared<ListNode>(value);
        auto current = head;

        for (size_t i = 0; i < index - 1; ++i) {
            current = current->next;
        }

        new_node->next = current->next;
        current->next = new_node;
        list_size++;
    }

    void LinkedList::remove(size_t index) {
        if (index >= list_size) {
            throw std::out_of_range("Index out of range");
        }

        if (index == 0) {
            pop_front();
            return;
        }

        auto current = head;
        for (size_t i = 0; i < index - 1; ++i) {
            current = current->next;
        }

        current->next = current->next->next;
        list_size--;
    }

    void LinkedList::clear() {
        head = nullptr;
        list_size = 0;
    }

    int LinkedList::get(size_t index) const {
        if (index >= list_size) {
            throw std::out_of_range("Index out of range");
        }

        auto current = head;
        for (size_t i = 0; i < index; ++i) {
            current = current->next;
        }
        return current->value;
    }

    int LinkedList::front() const {
        if (!head) {
            throw std::runtime_error("List is empty");
        }
        return head->value;
    }

    int LinkedList::back() const {
        if (!head) {
            throw std::runtime_error("List is empty");
        }

        auto current = head;
        while (current->next) {
            current = current->next;
        }
        return current->value;
    }

    int LinkedList::find(int value) const {
        auto current = head;
        size_t index = 0;

        while (current) {
            if (current->value == value) {
                return index;
            }
            current = current->next;
            index++;
        }
        return -1;
    }

    bool LinkedList::contains(int value) const {
        return find(value) != -1;
    }

    size_t LinkedList::size() const {
        return list_size;
    }

    bool LinkedList::empty() const {
        return list_size == 0;
    }

    std::vector<int> LinkedList::to_vector() const {
        std::vector<int> result;
        auto current = head;

        while (current) {
            result.push_back(current->value);
            current = current->next;
        }
        return result;
    }

    std::string LinkedList::to_string() const {
        if (!head) {
            return "[]";
        }

        std::ostringstream oss;
        oss << "[";
        auto current = head;
        bool first = true;

        while (current) {
            if (!first) oss << " -> ";
            oss << current->value;
            current = current->next;
            first = false;
        }
        oss << "]";
        return oss.str();
    }

    void LinkedList::reverse() {
        std::shared_ptr<ListNode> prev = nullptr;
        auto current = head;

        while (current) {
            auto next = current->next;
            current->next = prev;
            prev = current;
            current = next;
        }
        head = prev;
    }

    void LinkedList::remove_value(int value) {
        while (head && head->value == value) {
            head = head->next;
            list_size--;
        }

        if (!head) return;

        auto current = head;
        while (current->next) {
            if (current->next->value == value) {
                current->next = current->next->next;
                list_size--;
            } else {
                current = current->next;
            }
        }
    }

    void LinkedList::remove_duplicates() {
        if (!head) return;

        auto current = head;
        while (current && current->next) {
            if (current->value == current->next->value) {
                current->next = current->next->next;
                list_size--;
            } else {
                current = current->next;
            }
        }
    }
}