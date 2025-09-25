#pragma once
#include <emscripten/bind.h>
#include <vector>
#include <list>
#include <string>
#include <functional>

namespace DataStructures {
    template<typename K, typename V>
    struct HashNode {
        K key;
        V value;

        HashNode(const K& k, const V& v) : key(k), value(v) {}
    };

    class HashTable {
    private:
        static const size_t DEFAULT_SIZE = 16;
        std::vector<std::list<HashNode<std::string, int>>> buckets;
        size_t bucket_count;
        size_t table_size;

        size_t hash(const std::string& key) const;
        void resize();
        double load_factor() const;

    public:
        // Constructor
        HashTable();
        HashTable(size_t initial_size);

        // Core operations
        void put(const std::string& key, int value);
        int get(const std::string& key) const;
        bool remove(const std::string& key);
        bool contains_key(const std::string& key) const;

        // Properties
        size_t size() const;
        bool empty() const;
        void clear();

        // Utility
        std::vector<std::string> keys() const;
        std::vector<int> values() const;
        std::string to_string() const;

        // Advanced operations
        HashTable copy() const;
        double get_load_factor() const;
        size_t get_bucket_count() const;
    };
}