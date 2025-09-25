#include "hash_tables.h"
#include <stdexcept>
#include <sstream>

namespace DataStructures {

    HashTable::HashTable() : bucket_count(DEFAULT_SIZE), table_size(0) {
        buckets.resize(bucket_count);
    }

    HashTable::HashTable(size_t initial_size) : bucket_count(initial_size), table_size(0) {
        buckets.resize(bucket_count);
    }

    size_t HashTable::hash(const std::string& key) const {
        std::hash<std::string> hasher;
        return hasher(key) % bucket_count;
    }

    void HashTable::resize() {
        auto old_buckets = buckets;
        bucket_count *= 2;
        buckets.clear();
        buckets.resize(bucket_count);
        table_size = 0;

        for (const auto& bucket : old_buckets) {
            for (const auto& node : bucket) {
                put(node.key, node.value);
            }
        }
    }

    double HashTable::load_factor() const {
        return static_cast<double>(table_size) / bucket_count;
    }

    void HashTable::put(const std::string& key, int value) {
        if (load_factor() > 0.75) {
            resize();
        }

        size_t index = hash(key);
        auto& bucket = buckets[index];

        for (auto& node : bucket) {
            if (node.key == key) {
                node.value = value;
                return;
            }
        }

        bucket.emplace_back(key, value);
        table_size++;
    }

    int HashTable::get(const std::string& key) const {
        size_t index = hash(key);
        const auto& bucket = buckets[index];

        for (const auto& node : bucket) {
            if (node.key == key) {
                return node.value;
            }
        }

        throw std::runtime_error("Key not found: " + key);
    }

    bool HashTable::remove(const std::string& key) {
        size_t index = hash(key);
        auto& bucket = buckets[index];

        for (auto it = bucket.begin(); it != bucket.end(); ++it) {
            if (it->key == key) {
                bucket.erase(it);
                table_size--;
                return true;
            }
        }

        return false;
    }

    bool HashTable::contains_key(const std::string& key) const {
        size_t index = hash(key);
        const auto& bucket = buckets[index];

        for (const auto& node : bucket) {
            if (node.key == key) {
                return true;
            }
        }

        return false;
    }

    size_t HashTable::size() const {
        return table_size;
    }

    bool HashTable::empty() const {
        return table_size == 0;
    }

    void HashTable::clear() {
        for (auto& bucket : buckets) {
            bucket.clear();
        }
        table_size = 0;
    }

    std::vector<std::string> HashTable::keys() const {
        std::vector<std::string> result;
        for (const auto& bucket : buckets) {
            for (const auto& node : bucket) {
                result.push_back(node.key);
            }
        }
        return result;
    }

    std::vector<int> HashTable::values() const {
        std::vector<int> result;
        for (const auto& bucket : buckets) {
            for (const auto& node : bucket) {
                result.push_back(node.value);
            }
        }
        return result;
    }

    std::string HashTable::to_string() const {
        if (empty()) {
            return "{}";
        }

        std::ostringstream oss;
        oss << "{ ";
        bool first = true;

        for (const auto& bucket : buckets) {
            for (const auto& node : bucket) {
                if (!first) oss << ", ";
                oss << "\"" << node.key << "\": " << node.value;
                first = false;
            }
        }

        oss << " } (size: " << table_size << ", buckets: " << bucket_count
            << ", load factor: " << std::fixed << load_factor() << ")";
        return oss.str();
    }

    HashTable HashTable::copy() const {
        HashTable new_table(bucket_count);
        for (const auto& bucket : buckets) {
            for (const auto& node : bucket) {
                new_table.put(node.key, node.value);
            }
        }
        return new_table;
    }

    double HashTable::get_load_factor() const {
        return load_factor();
    }

    size_t HashTable::get_bucket_count() const {
        return bucket_count;
    }
}