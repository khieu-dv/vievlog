#pragma once
#include <emscripten/bind.h>
#include <memory>
#include <vector>
#include <string>

namespace DataStructures {
    struct TreeNode {
        int value;
        std::shared_ptr<TreeNode> left;
        std::shared_ptr<TreeNode> right;

        TreeNode(int val) : value(val), left(nullptr), right(nullptr) {}
    };

    class BinarySearchTree {
    private:
        std::shared_ptr<TreeNode> root;
        size_t tree_size;

        // Helper methods
        std::shared_ptr<TreeNode> insert_recursive(std::shared_ptr<TreeNode> node, int value);
        std::shared_ptr<TreeNode> remove_recursive(std::shared_ptr<TreeNode> node, int value);
        std::shared_ptr<TreeNode> find_min(std::shared_ptr<TreeNode> node);
        bool search_recursive(std::shared_ptr<TreeNode> node, int value) const;
        void inorder_recursive(std::shared_ptr<TreeNode> node, std::vector<int>& result) const;
        void preorder_recursive(std::shared_ptr<TreeNode> node, std::vector<int>& result) const;
        void postorder_recursive(std::shared_ptr<TreeNode> node, std::vector<int>& result) const;
        int height_recursive(std::shared_ptr<TreeNode> node) const;

    public:
        // Constructor
        BinarySearchTree();

        // Core operations
        void insert(int value);
        void remove(int value);
        bool search(int value) const;
        bool contains(int value) const; // alias for search

        // Properties
        size_t size() const;
        bool empty() const;
        int height() const;
        void clear();

        // Traversals
        std::vector<int> inorder() const;
        std::vector<int> preorder() const;
        std::vector<int> postorder() const;

        // Tree operations
        int find_min() const;
        int find_max() const;

        // Utility
        std::string to_string() const;
    };
}