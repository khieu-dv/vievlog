#include <emscripten/bind.h>
#include "data_structures/arrays.h"
#include "data_structures/linked_lists.h"
#include "data_structures/stacks.h"
#include "data_structures/queues.h"
#include "data_structures/trees.h"
#include "data_structures/hash_tables.h"
#include "data_structures/heaps.h"
#include "data_structures/graphs.h"
#include "algorithms/sorting.h"
#include "algorithms/searching.h"
#include "algorithms/graph_algorithms.h"
#include "algorithms/dynamic_programming.h"
#include "math.h"

using namespace emscripten;
using namespace DataStructures;
using namespace Algorithms;

EMSCRIPTEN_BINDINGS(cpp_wasm_module) {
    // Math utilities
    function("add", &add);
    function("subtract", &subtract);
    function("multiply", &multiply);
    function("divide", &divide);
    function("power", &power);
    function("sqrt", &sqrt);

    // Arrays (CppVector)
    class_<CppVector>("CppVector")
        .constructor<>()
        .constructor<size_t>()
        .function("push", &CppVector::push)
        .function("pop", &CppVector::pop)
        .function("get", &CppVector::get)
        .function("set", &CppVector::set)
        .function("insert", &CppVector::insert)
        .function("remove", &CppVector::remove)
        .function("find", &CppVector::find)
        .function("size", &CppVector::size)
        .function("empty", &CppVector::empty)
        .function("clear", &CppVector::clear)
        .function("contains", &CppVector::contains)
        .function("to_string", &CppVector::to_string)
        .function("copy", &CppVector::copy)
        .function("reverse", &CppVector::reverse)
        .function("sort", &CppVector::sort);

    // Linked Lists
    class_<LinkedList>("LinkedList")
        .constructor<>()
        .function("push_front", &LinkedList::push_front)
        .function("push_back", &LinkedList::push_back)
        .function("pop_front", &LinkedList::pop_front)
        .function("pop_back", &LinkedList::pop_back)
        .function("insert", &LinkedList::insert)
        .function("remove", &LinkedList::remove)
        .function("get", &LinkedList::get)
        .function("set", &LinkedList::set)
        .function("find", &LinkedList::find)
        .function("size", &LinkedList::size)
        .function("empty", &LinkedList::empty)
        .function("clear", &LinkedList::clear)
        .function("contains", &LinkedList::contains)
        .function("reverse", &LinkedList::reverse)
        .function("to_string", &LinkedList::to_string)
        .function("copy", &LinkedList::copy);

    // Stack
    class_<Stack>("Stack")
        .constructor<>()
        .function("push", &Stack::push)
        .function("pop", &Stack::pop)
        .function("peek", &Stack::peek)
        .function("top", &Stack::top)
        .function("size", &Stack::size)
        .function("empty", &Stack::empty)
        .function("clear", &Stack::clear)
        .function("contains", &Stack::contains)
        .function("to_string", &Stack::to_string)
        .function("copy", &Stack::copy);

    // Queue
    class_<Queue>("Queue")
        .constructor<>()
        .function("enqueue", &Queue::enqueue)
        .function("dequeue", &Queue::dequeue)
        .function("front", &Queue::front)
        .function("back", &Queue::back)
        .function("size", &Queue::size)
        .function("empty", &Queue::empty)
        .function("clear", &Queue::clear)
        .function("contains", &Queue::contains)
        .function("to_string", &Queue::to_string)
        .function("copy", &Queue::copy);

    // Binary Search Tree
    class_<BinarySearchTree>("BinarySearchTree")
        .constructor<>()
        .function("insert", &BinarySearchTree::insert)
        .function("remove", &BinarySearchTree::remove)
        .function("search", &BinarySearchTree::search)
        .function("contains", &BinarySearchTree::contains)
        .function("size", &BinarySearchTree::size)
        .function("empty", &BinarySearchTree::empty)
        .function("height", &BinarySearchTree::height)
        .function("clear", &BinarySearchTree::clear)
        .function("find_min", &BinarySearchTree::find_min)
        .function("find_max", &BinarySearchTree::find_max)
        .function("to_string", &BinarySearchTree::to_string);

    // Hash Table
    class_<HashTable>("HashTable")
        .constructor<>()
        .constructor<size_t>()
        .function("put", &HashTable::put)
        .function("get", &HashTable::get)
        .function("remove", &HashTable::remove)
        .function("contains_key", &HashTable::contains_key)
        .function("size", &HashTable::size)
        .function("empty", &HashTable::empty)
        .function("clear", &HashTable::clear)
        .function("to_string", &HashTable::to_string)
        .function("copy", &HashTable::copy)
        .function("get_load_factor", &HashTable::get_load_factor)
        .function("get_bucket_count", &HashTable::get_bucket_count);

    // Heap Types
    enum_<HeapType>("HeapType")
        .value("MIN_HEAP", HeapType::MIN_HEAP)
        .value("MAX_HEAP", HeapType::MAX_HEAP);

    // Heap
    class_<Heap>("Heap")
        .constructor<>()
        .constructor<HeapType>()
        .function("insert", &Heap::insert)
        .function("extract", &Heap::extract)
        .function("peek", &Heap::peek)
        .function("size", &Heap::size)
        .function("empty", &Heap::empty)
        .function("clear", &Heap::clear)
        .function("get_type", &Heap::get_type)
        .function("to_string", &Heap::to_string)
        .function("is_valid_heap", &Heap::is_valid_heap)
        .function("copy", &Heap::copy);

    // MinHeap
    class_<MinHeap, base<Heap>>("MinHeap")
        .constructor<>();

    // MaxHeap
    class_<MaxHeap, base<Heap>>("MaxHeap")
        .constructor<>();

    // Graph
    class_<Graph>("Graph")
        .constructor<>()
        .constructor<bool>()
        .function("add_vertex", &Graph::add_vertex)
        .function("remove_vertex", &Graph::remove_vertex)
        .function("add_edge", &Graph::add_edge)
        .function("remove_edge", &Graph::remove_edge)
        .function("vertex_count", &Graph::vertex_count)
        .function("edge_count", &Graph::edge_count)
        .function("has_vertex", &Graph::has_vertex)
        .function("has_edge", &Graph::has_edge)
        .function("get_edge_weight", &Graph::get_edge_weight)
        .function("empty", &Graph::empty)
        .function("clear", &Graph::clear)
        .function("depth_first_search", &Graph::depth_first_search)
        .function("breadth_first_search", &Graph::breadth_first_search)
        .function("topological_sort", &Graph::topological_sort)
        .function("has_cycle", &Graph::has_cycle)
        .function("is_connected", &Graph::is_connected)
        .function("get_degree", &Graph::get_degree)
        .function("to_string", &Graph::to_string)
        .function("copy", &Graph::copy)
        .function("get_transpose", &Graph::get_transpose)
        .function("is_directed_graph", &Graph::is_directed_graph);

    // Sorting algorithms
    class_<Sorting>("Sorting")
        .class_function("bubble_sort", &Sorting::bubble_sort)
        .class_function("selection_sort", &Sorting::selection_sort)
        .class_function("insertion_sort", &Sorting::insertion_sort)
        .class_function("merge_sort", &Sorting::merge_sort)
        .class_function("quick_sort", &Sorting::quick_sort)
        .class_function("heap_sort", &Sorting::heap_sort)
        .class_function("counting_sort", &Sorting::counting_sort)
        .class_function("radix_sort", &Sorting::radix_sort)
        .class_function("is_sorted", &Sorting::is_sorted)
        .class_function("get_algorithm_info", &Sorting::get_algorithm_info);

    // Search Result
    value_object<SearchResult>("SearchResult")
        .field("index", &SearchResult::index)
        .field("found", &SearchResult::found)
        .field("comparisons", &SearchResult::comparisons);

    // Searching algorithms
    class_<Searching>("Searching")
        .class_function("linear_search", &Searching::linear_search)
        .class_function("binary_search", &Searching::binary_search)
        .class_function("jump_search", &Searching::jump_search)
        .class_function("interpolation_search", &Searching::interpolation_search)
        .class_function("exponential_search", &Searching::exponential_search)
        .class_function("ternary_search", &Searching::ternary_search)
        .class_function("find_all_occurrences", &Searching::find_all_occurrences)
        .class_function("count_occurrences", &Searching::count_occurrences)
        .class_function("is_sorted", &Searching::is_sorted)
        .class_function("get_algorithm_info", &Searching::get_algorithm_info);

    // Path Result
    value_object<PathResult>("PathResult")
        .field("path", &PathResult::path)
        .field("distance", &PathResult::distance)
        .field("found", &PathResult::found);

    // MST Edge
    value_object<MST_Edge>("MST_Edge")
        .field("from", &MST_Edge::from)
        .field("to", &MST_Edge::to)
        .field("weight", &MST_Edge::weight);

    // Graph algorithms
    class_<GraphAlgorithms>("GraphAlgorithms")
        .class_function("dijkstra_shortest_path", &GraphAlgorithms::dijkstra_shortest_path)
        .class_function("dijkstra_all_distances", &GraphAlgorithms::dijkstra_all_distances)
        .class_function("bellman_ford", &GraphAlgorithms::bellman_ford)
        .class_function("kruskal_mst", &GraphAlgorithms::kruskal_mst)
        .class_function("prim_mst", &GraphAlgorithms::prim_mst)
        .class_function("depth_first_search", &GraphAlgorithms::depth_first_search)
        .class_function("breadth_first_search", &GraphAlgorithms::breadth_first_search)
        .class_function("topological_sort", &GraphAlgorithms::topological_sort)
        .class_function("is_bipartite", &GraphAlgorithms::is_bipartite)
        .class_function("has_cycle", &GraphAlgorithms::has_cycle)
        .class_function("is_connected", &GraphAlgorithms::is_connected)
        .class_function("strongly_connected_components", &GraphAlgorithms::strongly_connected_components)
        .class_function("has_path", &GraphAlgorithms::has_path)
        .class_function("all_paths", &GraphAlgorithms::all_paths)
        .class_function("shortest_distance", &GraphAlgorithms::shortest_distance)
        .class_function("get_algorithm_info", &GraphAlgorithms::get_algorithm_info);

    // Dynamic Programming algorithms
    class_<DynamicProgramming>("DynamicProgramming")
        .class_function("fibonacci", &DynamicProgramming::fibonacci)
        .class_function("fibonacci_memoized", &DynamicProgramming::fibonacci_memoized)
        .class_function("fibonacci_sequence", &DynamicProgramming::fibonacci_sequence)
        .class_function("factorial", &DynamicProgramming::factorial)
        .class_function("pascal_triangle", &DynamicProgramming::pascal_triangle)
        .class_function("longest_common_subsequence", &DynamicProgramming::longest_common_subsequence)
        .class_function("edit_distance", &DynamicProgramming::edit_distance)
        .class_function("longest_increasing_subsequence", &DynamicProgramming::longest_increasing_subsequence)
        .class_function("is_subsequence", &DynamicProgramming::is_subsequence)
        .class_function("maximum_subarray_sum", &DynamicProgramming::maximum_subarray_sum)
        .class_function("maximum_product_subarray", &DynamicProgramming::maximum_product_subarray)
        .class_function("coin_change", &DynamicProgramming::coin_change)
        .class_function("coin_change_ways", &DynamicProgramming::coin_change_ways)
        .class_function("knapsack_01", &DynamicProgramming::knapsack_01)
        .class_function("knapsack_unbounded", &DynamicProgramming::knapsack_unbounded)
        .class_function("unique_paths", &DynamicProgramming::unique_paths)
        .class_function("unique_paths_with_obstacles", &DynamicProgramming::unique_paths_with_obstacles)
        .class_function("minimum_path_sum", &DynamicProgramming::minimum_path_sum)
        .class_function("get_algorithm_info", &DynamicProgramming::get_algorithm_info);

    // Vector bindings for JavaScript interop
    register_vector<int>("VectorInt");
    register_vector<std::string>("VectorString");
    register_vector<std::vector<int>>("VectorVectorInt");
}