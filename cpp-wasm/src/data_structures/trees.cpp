#include "trees.h"
#include <stdexcept>
#include <sstream>
#include <algorithm>

namespace DataStructures {

    BinarySearchTree::BinarySearchTree() : root(nullptr), tree_size(0) {}

    std::shared_ptr<TreeNode> BinarySearchTree::insert_recursive(std::shared_ptr<TreeNode> node, int value) {
        if (!node) {
            tree_size++;
            return std::make_shared<TreeNode>(value);
        }

        if (value < node->value) {
            node->left = insert_recursive(node->left, value);
        } else if (value > node->value) {
            node->right = insert_recursive(node->right, value);
        }
        // If value == node->value, we don't insert duplicates

        return node;
    }

    std::shared_ptr<TreeNode> BinarySearchTree::remove_recursive(std::shared_ptr<TreeNode> node, int value) {
        if (!node) {
            return node;
        }

        if (value < node->value) {
            node->left = remove_recursive(node->left, value);
        } else if (value > node->value) {
            node->right = remove_recursive(node->right, value);
        } else {
            // Node to be deleted found
            tree_size--;

            // Case 1: No child
            if (!node->left && !node->right) {
                return nullptr;
            }
            // Case 2: One child
            else if (!node->left) {
                return node->right;
            } else if (!node->right) {
                return node->left;
            }
            // Case 3: Two children
            else {
                auto min_right = find_min(node->right);
                node->value = min_right->value;
                node->right = remove_recursive(node->right, min_right->value);
                tree_size++; // Compensate for the decrement in recursive call
            }
        }

        return node;
    }

    std::shared_ptr<TreeNode> BinarySearchTree::find_min(std::shared_ptr<TreeNode> node) {
        while (node && node->left) {
            node = node->left;
        }
        return node;
    }

    bool BinarySearchTree::search_recursive(std::shared_ptr<TreeNode> node, int value) const {
        if (!node) {
            return false;
        }

        if (value == node->value) {
            return true;
        } else if (value < node->value) {
            return search_recursive(node->left, value);
        } else {
            return search_recursive(node->right, value);
        }
    }

    void BinarySearchTree::inorder_recursive(std::shared_ptr<TreeNode> node, std::vector<int>& result) const {
        if (!node) return;

        inorder_recursive(node->left, result);
        result.push_back(node->value);
        inorder_recursive(node->right, result);
    }

    void BinarySearchTree::preorder_recursive(std::shared_ptr<TreeNode> node, std::vector<int>& result) const {
        if (!node) return;

        result.push_back(node->value);
        preorder_recursive(node->left, result);
        preorder_recursive(node->right, result);
    }

    void BinarySearchTree::postorder_recursive(std::shared_ptr<TreeNode> node, std::vector<int>& result) const {
        if (!node) return;

        postorder_recursive(node->left, result);
        postorder_recursive(node->right, result);
        result.push_back(node->value);
    }

    int BinarySearchTree::height_recursive(std::shared_ptr<TreeNode> node) const {
        if (!node) {
            return -1;
        }

        int left_height = height_recursive(node->left);
        int right_height = height_recursive(node->right);

        return 1 + std::max(left_height, right_height);
    }

    void BinarySearchTree::insert(int value) {
        root = insert_recursive(root, value);
    }

    void BinarySearchTree::remove(int value) {
        root = remove_recursive(root, value);
    }

    bool BinarySearchTree::search(int value) const {
        return search_recursive(root, value);
    }

    bool BinarySearchTree::contains(int value) const {
        return search(value);
    }

    size_t BinarySearchTree::size() const {
        return tree_size;
    }

    bool BinarySearchTree::empty() const {
        return tree_size == 0;
    }

    int BinarySearchTree::height() const {
        return height_recursive(root);
    }

    void BinarySearchTree::clear() {
        root = nullptr;
        tree_size = 0;
    }

    std::vector<int> BinarySearchTree::inorder() const {
        std::vector<int> result;
        inorder_recursive(root, result);
        return result;
    }

    std::vector<int> BinarySearchTree::preorder() const {
        std::vector<int> result;
        preorder_recursive(root, result);
        return result;
    }

    std::vector<int> BinarySearchTree::postorder() const {
        std::vector<int> result;
        postorder_recursive(root, result);
        return result;
    }

    int BinarySearchTree::find_min() const {
        if (!root) {
            throw std::runtime_error("Tree is empty");
        }
        auto min_node = find_min(root);
        return min_node->value;
    }

    int BinarySearchTree::find_max() const {
        if (!root) {
            throw std::runtime_error("Tree is empty");
        }

        auto current = root;
        while (current->right) {
            current = current->right;
        }
        return current->value;
    }

    std::string BinarySearchTree::to_string() const {
        if (!root) {
            return "Empty tree";
        }

        auto inorder_vals = inorder();
        std::ostringstream oss;
        oss << "BST (inorder): [";
        for (size_t i = 0; i < inorder_vals.size(); ++i) {
            if (i > 0) oss << ", ";
            oss << inorder_vals[i];
        }
        oss << "] (size: " << tree_size << ", height: " << height() << ")";
        return oss.str();
    }
}