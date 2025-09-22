use wasm_bindgen::prelude::*;
use js_sys::Array;
use std::collections::{HashMap, HashSet, VecDeque, BinaryHeap};
use std::cmp::Ordering;

#[derive(Debug, Clone, PartialEq)]
struct State {
    cost: f64,
    position: i32,
}

impl Eq for State {}

impl Ord for State {
    fn cmp(&self, other: &Self) -> Ordering {
        other.cost.partial_cmp(&self.cost).unwrap_or(Ordering::Equal)
    }
}

impl PartialOrd for State {
    fn partial_cmp(&self, other: &Self) -> Option<Ordering> {
        Some(self.cmp(other))
    }
}

/// Dijkstra's shortest path algorithm
#[wasm_bindgen]
pub fn dijkstra_shortest_path(
    vertices: &Array,
    edges: &Array,
    start: i32,
    end: i32
) -> Array {
    let mut graph: HashMap<i32, Vec<(i32, f64)>> = HashMap::new();

    // Initialize vertices
    for i in 0..vertices.length() {
        if let Some(vertex) = vertices.get(i).as_f64() {
            graph.insert(vertex as i32, Vec::new());
        }
    }

    // Add edges
    for i in 0..edges.length() {
        if let Some(edge_array) = edges.get(i).dyn_ref::<Array>() {
            if edge_array.length() >= 3 {
                let from = edge_array.get(0).as_f64().unwrap() as i32;
                let to = edge_array.get(1).as_f64().unwrap() as i32;
                let weight = edge_array.get(2).as_f64().unwrap();

                graph.entry(from).or_insert_with(Vec::new).push((to, weight));
                graph.entry(to).or_insert_with(Vec::new).push((from, weight));
            }
        }
    }

    // Dijkstra's algorithm
    let mut distances: HashMap<i32, f64> = HashMap::new();
    let mut previous: HashMap<i32, Option<i32>> = HashMap::new();
    let mut heap = BinaryHeap::new();

    for &vertex in graph.keys() {
        distances.insert(vertex, if vertex == start { 0.0 } else { f64::INFINITY });
        previous.insert(vertex, None);
    }

    heap.push(State { cost: 0.0, position: start });

    while let Some(State { cost, position }) = heap.pop() {
        if position == end {
            break;
        }

        if cost > *distances.get(&position).unwrap_or(&f64::INFINITY) {
            continue;
        }

        if let Some(neighbors) = graph.get(&position) {
            for &(neighbor, weight) in neighbors {
                let new_cost = cost + weight;
                if new_cost < *distances.get(&neighbor).unwrap_or(&f64::INFINITY) {
                    distances.insert(neighbor, new_cost);
                    previous.insert(neighbor, Some(position));
                    heap.push(State { cost: new_cost, position: neighbor });
                }
            }
        }
    }

    // Reconstruct path
    let mut path = Vec::new();
    let mut current = Some(end);
    while let Some(vertex) = current {
        path.push(vertex);
        current = *previous.get(&vertex).unwrap_or(&None);
    }

    if path[path.len() - 1] != start {
        return Array::new(); // No path found
    }

    path.reverse();

    let result = Array::new();
    let path_array: Array = path.iter().map(|&x| JsValue::from(x)).collect();
    let total_distance = *distances.get(&end).unwrap_or(&f64::INFINITY);

    result.push(&JsValue::from(path_array));
    result.push(&JsValue::from(total_distance));
    result
}

/// Breadth-First Search
#[wasm_bindgen]
pub fn bfs_graph_traversal(adjacency_list: &Array, start: i32) -> Array {
    let mut visited = HashSet::new();
    let mut queue = VecDeque::new();
    let mut result = Vec::new();

    queue.push_back(start);
    visited.insert(start);

    while let Some(vertex) = queue.pop_front() {
        result.push(vertex);

        if let Some(neighbors) = adjacency_list.get(vertex as u32).dyn_ref::<Array>() {
            for i in 0..neighbors.length() {
                if let Some(neighbor) = neighbors.get(i).as_f64() {
                    let neighbor = neighbor as i32;
                    if !visited.contains(&neighbor) {
                        visited.insert(neighbor);
                        queue.push_back(neighbor);
                    }
                }
            }
        }
    }

    result.iter().map(|&x| JsValue::from(x)).collect()
}

/// Depth-First Search
#[wasm_bindgen]
pub fn dfs_graph_traversal(adjacency_list: &Array, start: i32) -> Array {
    let mut visited = HashSet::new();
    let mut result = Vec::new();

    fn dfs_recursive(
        adjacency_list: &Array,
        vertex: i32,
        visited: &mut HashSet<i32>,
        result: &mut Vec<i32>
    ) {
        visited.insert(vertex);
        result.push(vertex);

        if let Some(neighbors) = adjacency_list.get(vertex as u32).dyn_ref::<Array>() {
            for i in 0..neighbors.length() {
                if let Some(neighbor) = neighbors.get(i).as_f64() {
                    let neighbor = neighbor as i32;
                    if !visited.contains(&neighbor) {
                        dfs_recursive(adjacency_list, neighbor, visited, result);
                    }
                }
            }
        }
    }

    dfs_recursive(adjacency_list, start, &mut visited, &mut result);
    result.iter().map(|&x| JsValue::from(x)).collect()
}

/// Topological Sort (Kahn's algorithm)
#[wasm_bindgen]
pub fn topological_sort(vertices: &Array, edges: &Array) -> Array {
    let mut graph: HashMap<i32, Vec<i32>> = HashMap::new();
    let mut in_degree: HashMap<i32, i32> = HashMap::new();

    // Initialize
    for i in 0..vertices.length() {
        if let Some(vertex) = vertices.get(i).as_f64() {
            let vertex = vertex as i32;
            graph.insert(vertex, Vec::new());
            in_degree.insert(vertex, 0);
        }
    }

    // Build graph and calculate in-degrees
    for i in 0..edges.length() {
        if let Some(edge_array) = edges.get(i).dyn_ref::<Array>() {
            if edge_array.length() >= 2 {
                let from = edge_array.get(0).as_f64().unwrap() as i32;
                let to = edge_array.get(1).as_f64().unwrap() as i32;

                graph.entry(from).or_insert_with(Vec::new).push(to);
                *in_degree.entry(to).or_insert(0) += 1;
            }
        }
    }

    let mut queue = VecDeque::new();
    let mut result = Vec::new();

    // Find vertices with in-degree 0
    for (&vertex, &degree) in &in_degree {
        if degree == 0 {
            queue.push_back(vertex);
        }
    }

    while let Some(vertex) = queue.pop_front() {
        result.push(vertex);

        if let Some(neighbors) = graph.get(&vertex) {
            for &neighbor in neighbors {
                if let Some(degree) = in_degree.get_mut(&neighbor) {
                    *degree -= 1;
                    if *degree == 0 {
                        queue.push_back(neighbor);
                    }
                }
            }
        }
    }

    result.iter().map(|&x| JsValue::from(x)).collect()
}

/// Detect cycle in directed graph
#[wasm_bindgen]
pub fn has_cycle_directed(vertices: &Array, edges: &Array) -> bool {
    let mut graph: HashMap<i32, Vec<i32>> = HashMap::new();

    // Initialize graph
    for i in 0..vertices.length() {
        if let Some(vertex) = vertices.get(i).as_f64() {
            graph.insert(vertex as i32, Vec::new());
        }
    }

    // Add edges
    for i in 0..edges.length() {
        if let Some(edge_array) = edges.get(i).dyn_ref::<Array>() {
            if edge_array.length() >= 2 {
                let from = edge_array.get(0).as_f64().unwrap() as i32;
                let to = edge_array.get(1).as_f64().unwrap() as i32;
                graph.entry(from).or_insert_with(Vec::new).push(to);
            }
        }
    }

    let mut visited = HashSet::new();
    let mut rec_stack = HashSet::new();

    fn has_cycle_dfs(
        graph: &HashMap<i32, Vec<i32>>,
        vertex: i32,
        visited: &mut HashSet<i32>,
        rec_stack: &mut HashSet<i32>
    ) -> bool {
        visited.insert(vertex);
        rec_stack.insert(vertex);

        if let Some(neighbors) = graph.get(&vertex) {
            for &neighbor in neighbors {
                if !visited.contains(&neighbor) {
                    if has_cycle_dfs(graph, neighbor, visited, rec_stack) {
                        return true;
                    }
                } else if rec_stack.contains(&neighbor) {
                    return true;
                }
            }
        }

        rec_stack.remove(&vertex);
        false
    }

    for &vertex in graph.keys() {
        if !visited.contains(&vertex) {
            if has_cycle_dfs(&graph, vertex, &mut visited, &mut rec_stack) {
                return true;
            }
        }
    }

    false
}

/// Find strongly connected components (Kosaraju's algorithm)
#[wasm_bindgen]
pub fn strongly_connected_components(vertices: &Array, edges: &Array) -> Array {
    let mut graph: HashMap<i32, Vec<i32>> = HashMap::new();
    let mut reverse_graph: HashMap<i32, Vec<i32>> = HashMap::new();

    // Initialize graphs
    for i in 0..vertices.length() {
        if let Some(vertex) = vertices.get(i).as_f64() {
            let vertex = vertex as i32;
            graph.insert(vertex, Vec::new());
            reverse_graph.insert(vertex, Vec::new());
        }
    }

    // Build graphs
    for i in 0..edges.length() {
        if let Some(edge_array) = edges.get(i).dyn_ref::<Array>() {
            if edge_array.length() >= 2 {
                let from = edge_array.get(0).as_f64().unwrap() as i32;
                let to = edge_array.get(1).as_f64().unwrap() as i32;

                graph.entry(from).or_insert_with(Vec::new).push(to);
                reverse_graph.entry(to).or_insert_with(Vec::new).push(from);
            }
        }
    }

    // Step 1: Get finishing times using DFS on original graph
    let mut visited = HashSet::new();
    let mut finish_stack = Vec::new();

    fn dfs_finish_time(
        graph: &HashMap<i32, Vec<i32>>,
        vertex: i32,
        visited: &mut HashSet<i32>,
        finish_stack: &mut Vec<i32>
    ) {
        visited.insert(vertex);

        if let Some(neighbors) = graph.get(&vertex) {
            for &neighbor in neighbors {
                if !visited.contains(&neighbor) {
                    dfs_finish_time(graph, neighbor, visited, finish_stack);
                }
            }
        }

        finish_stack.push(vertex);
    }

    for &vertex in graph.keys() {
        if !visited.contains(&vertex) {
            dfs_finish_time(&graph, vertex, &mut visited, &mut finish_stack);
        }
    }

    // Step 2: DFS on reverse graph in order of decreasing finish time
    visited.clear();
    let mut components = Vec::new();

    while let Some(vertex) = finish_stack.pop() {
        if !visited.contains(&vertex) {
            let mut component = Vec::new();
            dfs_component(&reverse_graph, vertex, &mut visited, &mut component);
            components.push(component);
        }
    }

    fn dfs_component(
        graph: &HashMap<i32, Vec<i32>>,
        vertex: i32,
        visited: &mut HashSet<i32>,
        component: &mut Vec<i32>
    ) {
        visited.insert(vertex);
        component.push(vertex);

        if let Some(neighbors) = graph.get(&vertex) {
            for &neighbor in neighbors {
                if !visited.contains(&neighbor) {
                    dfs_component(graph, neighbor, visited, component);
                }
            }
        }
    }

    // Convert to JS Array
    let result = Array::new();
    for component in components {
        let comp_array: Array = component.iter().map(|&x| JsValue::from(x)).collect();
        result.push(&JsValue::from(comp_array));
    }
    result
}

/// Minimum Spanning Tree - Kruskal's algorithm
#[wasm_bindgen]
pub fn minimum_spanning_tree_kruskal(vertices: &Array, edges: &Array) -> Array {
    let mut edge_list = Vec::new();

    // Collect all edges
    for i in 0..edges.length() {
        if let Some(edge_array) = edges.get(i).dyn_ref::<Array>() {
            if edge_array.length() >= 3 {
                let from = edge_array.get(0).as_f64().unwrap() as i32;
                let to = edge_array.get(1).as_f64().unwrap() as i32;
                let weight = edge_array.get(2).as_f64().unwrap();
                edge_list.push((weight, from, to));
            }
        }
    }

    // Sort edges by weight
    edge_list.sort_by(|a, b| a.0.partial_cmp(&b.0).unwrap());

    // Union-Find data structure
    let mut parent: HashMap<i32, i32> = HashMap::new();
    let mut rank: HashMap<i32, i32> = HashMap::new();

    for i in 0..vertices.length() {
        if let Some(vertex) = vertices.get(i).as_f64() {
            let vertex = vertex as i32;
            parent.insert(vertex, vertex);
            rank.insert(vertex, 0);
        }
    }

    fn find(parent: &mut HashMap<i32, i32>, x: i32) -> i32 {
        if parent[&x] != x {
            let parent_val = parent[&x];
            let root = find(parent, parent_val);
            parent.insert(x, root);
        }
        parent[&x]
    }

    fn union(parent: &mut HashMap<i32, i32>, rank: &mut HashMap<i32, i32>, x: i32, y: i32) -> bool {
        let root_x = find(parent, x);
        let root_y = find(parent, y);

        if root_x == root_y {
            return false;
        }

        if rank[&root_x] < rank[&root_y] {
            parent.insert(root_x, root_y);
        } else if rank[&root_x] > rank[&root_y] {
            parent.insert(root_y, root_x);
        } else {
            parent.insert(root_y, root_x);
            rank.insert(root_x, rank[&root_x] + 1);
        }
        true
    }

    let mut mst_edges = Vec::new();
    let mut total_weight = 0.0;

    for (weight, from, to) in edge_list {
        if union(&mut parent, &mut rank, from, to) {
            mst_edges.push((from, to, weight));
            total_weight += weight;

            if mst_edges.len() == vertices.length() as usize - 1 {
                break;
            }
        }
    }

    let result = Array::new();
    let edges_array = Array::new();

    for (from, to, weight) in mst_edges {
        let edge = Array::new();
        edge.push(&JsValue::from(from));
        edge.push(&JsValue::from(to));
        edge.push(&JsValue::from(weight));
        edges_array.push(&JsValue::from(edge));
    }

    result.push(&JsValue::from(edges_array));
    result.push(&JsValue::from(total_weight));
    result
}