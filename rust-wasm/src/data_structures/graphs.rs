use wasm_bindgen::prelude::*;
use js_sys::Array;
use std::collections::{HashMap, HashSet, VecDeque, BinaryHeap};
use std::cmp::Ordering;

/// Graph using adjacency list representation
#[wasm_bindgen]
pub struct Graph {
    adjacency_list: HashMap<i32, Vec<i32>>,
    is_directed: bool,
}

#[wasm_bindgen]
impl Graph {
    #[wasm_bindgen(constructor)]
    pub fn new(is_directed: bool) -> Graph {
        Graph {
            adjacency_list: HashMap::new(),
            is_directed,
        }
    }

    #[wasm_bindgen]
    pub fn add_vertex(&mut self, vertex: i32) {
        self.adjacency_list.entry(vertex).or_insert(Vec::new());
    }

    #[wasm_bindgen]
    pub fn add_edge(&mut self, from: i32, to: i32) {
        self.adjacency_list
            .entry(from)
            .or_insert(Vec::new())
            .push(to);

        if !self.is_directed {
            self.adjacency_list
                .entry(to)
                .or_insert(Vec::new())
                .push(from);
        }
    }

    #[wasm_bindgen]
    pub fn remove_vertex(&mut self, vertex: i32) -> bool {
        if !self.adjacency_list.contains_key(&vertex) {
            return false;
        }

        // Remove all edges to this vertex
        let vertices_to_update: Vec<i32> = self.adjacency_list.keys().cloned().collect();
        for v in vertices_to_update {
            if let Some(neighbors) = self.adjacency_list.get_mut(&v) {
                neighbors.retain(|&x| x != vertex);
            }
        }

        // Remove the vertex itself
        self.adjacency_list.remove(&vertex);
        true
    }

    #[wasm_bindgen]
    pub fn remove_edge(&mut self, from: i32, to: i32) -> bool {
        let mut removed = false;

        if let Some(neighbors) = self.adjacency_list.get_mut(&from) {
            if let Some(pos) = neighbors.iter().position(|&x| x == to) {
                neighbors.remove(pos);
                removed = true;
            }
        }

        if !self.is_directed {
            if let Some(neighbors) = self.adjacency_list.get_mut(&to) {
                if let Some(pos) = neighbors.iter().position(|&x| x == from) {
                    neighbors.remove(pos);
                }
            }
        }

        removed
    }

    #[wasm_bindgen]
    pub fn has_vertex(&self, vertex: i32) -> bool {
        self.adjacency_list.contains_key(&vertex)
    }

    #[wasm_bindgen]
    pub fn has_edge(&self, from: i32, to: i32) -> bool {
        self.adjacency_list
            .get(&from)
            .map_or(false, |neighbors| neighbors.contains(&to))
    }

    #[wasm_bindgen]
    pub fn get_neighbors(&self, vertex: i32) -> Array {
        match self.adjacency_list.get(&vertex) {
            Some(neighbors) => neighbors.iter().map(|&x| JsValue::from(x)).collect(),
            None => Array::new(),
        }
    }

    #[wasm_bindgen]
    pub fn get_vertices(&self) -> Array {
        self.adjacency_list
            .keys()
            .map(|&x| JsValue::from(x))
            .collect()
    }

    #[wasm_bindgen]
    pub fn vertex_count(&self) -> usize {
        self.adjacency_list.len()
    }

    #[wasm_bindgen]
    pub fn edge_count(&self) -> usize {
        let total_edges: usize = self.adjacency_list.values().map(|v| v.len()).sum();
        if self.is_directed {
            total_edges
        } else {
            total_edges / 2
        }
    }

    #[wasm_bindgen]
    pub fn degree(&self, vertex: i32) -> Option<usize> {
        self.adjacency_list.get(&vertex).map(|neighbors| neighbors.len())
    }

    #[wasm_bindgen]
    pub fn dfs_traversal(&self, start: i32) -> Array {
        let mut visited = HashSet::new();
        let mut result = Vec::new();
        self.dfs_recursive(start, &mut visited, &mut result);
        result.iter().map(|&x| JsValue::from(x)).collect()
    }

    fn dfs_recursive(&self, vertex: i32, visited: &mut HashSet<i32>, result: &mut Vec<i32>) {
        if visited.contains(&vertex) || !self.adjacency_list.contains_key(&vertex) {
            return;
        }

        visited.insert(vertex);
        result.push(vertex);

        if let Some(neighbors) = self.adjacency_list.get(&vertex) {
            for &neighbor in neighbors {
                self.dfs_recursive(neighbor, visited, result);
            }
        }
    }

    #[wasm_bindgen]
    pub fn bfs_traversal(&self, start: i32) -> Array {
        if !self.adjacency_list.contains_key(&start) {
            return Array::new();
        }

        let mut visited = HashSet::new();
        let mut queue = VecDeque::new();
        let mut result = Vec::new();

        queue.push_back(start);
        visited.insert(start);

        while let Some(vertex) = queue.pop_front() {
            result.push(vertex);

            if let Some(neighbors) = self.adjacency_list.get(&vertex) {
                for &neighbor in neighbors {
                    if !visited.contains(&neighbor) {
                        visited.insert(neighbor);
                        queue.push_back(neighbor);
                    }
                }
            }
        }

        result.iter().map(|&x| JsValue::from(x)).collect()
    }

    #[wasm_bindgen]
    pub fn has_path(&self, from: i32, to: i32) -> bool {
        if from == to {
            return self.adjacency_list.contains_key(&from);
        }

        let mut visited = HashSet::new();
        let mut queue = VecDeque::new();

        queue.push_back(from);
        visited.insert(from);

        while let Some(vertex) = queue.pop_front() {
            if let Some(neighbors) = self.adjacency_list.get(&vertex) {
                for &neighbor in neighbors {
                    if neighbor == to {
                        return true;
                    }
                    if !visited.contains(&neighbor) {
                        visited.insert(neighbor);
                        queue.push_back(neighbor);
                    }
                }
            }
        }

        false
    }

    #[wasm_bindgen]
    pub fn shortest_path(&self, from: i32, to: i32) -> Array {
        if from == to {
            if self.adjacency_list.contains_key(&from) {
                return [JsValue::from(from)].iter().cloned().collect();
            } else {
                return Array::new();
            }
        }

        let mut queue = VecDeque::new();
        let mut visited = HashSet::new();
        let mut parent = HashMap::new();

        queue.push_back(from);
        visited.insert(from);

        while let Some(vertex) = queue.pop_front() {
            if vertex == to {
                // Reconstruct path
                let mut path = Vec::new();
                let mut current = to;
                path.push(current);

                while let Some(&p) = parent.get(&current) {
                    path.push(p);
                    current = p;
                }

                path.reverse();
                return path.iter().map(|&x| JsValue::from(x)).collect();
            }

            if let Some(neighbors) = self.adjacency_list.get(&vertex) {
                for &neighbor in neighbors {
                    if !visited.contains(&neighbor) {
                        visited.insert(neighbor);
                        parent.insert(neighbor, vertex);
                        queue.push_back(neighbor);
                    }
                }
            }
        }

        Array::new() // No path found
    }

    #[wasm_bindgen]
    pub fn is_connected(&self) -> bool {
        if self.adjacency_list.is_empty() {
            return true;
        }

        let first_vertex = *self.adjacency_list.keys().next().unwrap();
        let traversal = self.dfs_traversal(first_vertex);
        traversal.length() as usize == self.adjacency_list.len()
    }

    #[wasm_bindgen]
    pub fn has_cycle(&self) -> bool {
        let mut visited = HashSet::new();
        let mut rec_stack = HashSet::new();

        for &vertex in self.adjacency_list.keys() {
            if !visited.contains(&vertex) {
                if self.has_cycle_dfs(vertex, &mut visited, &mut rec_stack) {
                    return true;
                }
            }
        }

        false
    }

    fn has_cycle_dfs(&self, vertex: i32, visited: &mut HashSet<i32>, rec_stack: &mut HashSet<i32>) -> bool {
        visited.insert(vertex);
        rec_stack.insert(vertex);

        if let Some(neighbors) = self.adjacency_list.get(&vertex) {
            for &neighbor in neighbors {
                if !visited.contains(&neighbor) {
                    if self.has_cycle_dfs(neighbor, visited, rec_stack) {
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

    #[wasm_bindgen]
    pub fn topological_sort(&self) -> Array {
        if !self.is_directed {
            return Array::new(); // Topological sort only makes sense for directed graphs
        }

        let mut in_degree = HashMap::new();

        // Initialize in-degree for all vertices
        for &vertex in self.adjacency_list.keys() {
            in_degree.insert(vertex, 0);
        }

        // Calculate in-degrees
        for neighbors in self.adjacency_list.values() {
            for &neighbor in neighbors {
                *in_degree.entry(neighbor).or_insert(0) += 1;
            }
        }

        // Find all vertices with in-degree 0
        let mut queue = VecDeque::new();
        for (&vertex, &degree) in &in_degree {
            if degree == 0 {
                queue.push_back(vertex);
            }
        }

        let mut result = Vec::new();

        while let Some(vertex) = queue.pop_front() {
            result.push(vertex);

            if let Some(neighbors) = self.adjacency_list.get(&vertex) {
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

        if result.len() == self.adjacency_list.len() {
            result.iter().map(|&x| JsValue::from(x)).collect()
        } else {
            Array::new() // Graph has a cycle
        }
    }
}

/// Weighted Graph for algorithms like Dijkstra
#[wasm_bindgen]
pub struct WeightedGraph {
    adjacency_list: HashMap<i32, Vec<(i32, f64)>>, // (neighbor, weight)
    is_directed: bool,
}

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

#[wasm_bindgen]
impl WeightedGraph {
    #[wasm_bindgen(constructor)]
    pub fn new(is_directed: bool) -> WeightedGraph {
        WeightedGraph {
            adjacency_list: HashMap::new(),
            is_directed,
        }
    }

    #[wasm_bindgen]
    pub fn add_vertex(&mut self, vertex: i32) {
        self.adjacency_list.entry(vertex).or_insert(Vec::new());
    }

    #[wasm_bindgen]
    pub fn add_edge(&mut self, from: i32, to: i32, weight: f64) {
        self.adjacency_list
            .entry(from)
            .or_insert(Vec::new())
            .push((to, weight));

        if !self.is_directed {
            self.adjacency_list
                .entry(to)
                .or_insert(Vec::new())
                .push((from, weight));
        }
    }

    #[wasm_bindgen]
    pub fn dijkstra(&self, start: i32) -> Array {
        let mut distances = HashMap::new();
        let mut heap = BinaryHeap::new();

        // Initialize distances
        for &vertex in self.adjacency_list.keys() {
            distances.insert(vertex, if vertex == start { 0.0 } else { f64::INFINITY });
        }

        heap.push(State { cost: 0.0, position: start });

        while let Some(State { cost, position }) = heap.pop() {
            if cost > *distances.get(&position).unwrap_or(&f64::INFINITY) {
                continue;
            }

            if let Some(neighbors) = self.adjacency_list.get(&position) {
                for &(neighbor, weight) in neighbors {
                    let new_cost = cost + weight;
                    if new_cost < *distances.get(&neighbor).unwrap_or(&f64::INFINITY) {
                        distances.insert(neighbor, new_cost);
                        heap.push(State { cost: new_cost, position: neighbor });
                    }
                }
            }
        }

        // Convert to array format: [[vertex, distance], ...]
        let mut result = Vec::new();
        for (vertex, distance) in distances {
            let pair = Array::new();
            pair.push(&JsValue::from(vertex));
            pair.push(&JsValue::from(distance));
            result.push(JsValue::from(pair));
        }

        result.iter().cloned().collect()
    }

    #[wasm_bindgen]
    pub fn shortest_path_with_weights(&self, from: i32, to: i32) -> Array {
        let mut distances = HashMap::new();
        let mut previous = HashMap::new();
        let mut heap = BinaryHeap::new();

        // Initialize
        for &vertex in self.adjacency_list.keys() {
            distances.insert(vertex, if vertex == from { 0.0 } else { f64::INFINITY });
            previous.insert(vertex, None);
        }

        heap.push(State { cost: 0.0, position: from });

        while let Some(State { cost, position }) = heap.pop() {
            if position == to {
                break;
            }

            if cost > *distances.get(&position).unwrap_or(&f64::INFINITY) {
                continue;
            }

            if let Some(neighbors) = self.adjacency_list.get(&position) {
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
        if *distances.get(&to).unwrap_or(&f64::INFINITY) == f64::INFINITY {
            return Array::new(); // No path
        }

        let mut path = Vec::new();
        let mut current = Some(to);
        while let Some(vertex) = current {
            path.push(vertex);
            current = *previous.get(&vertex).unwrap_or(&None);
        }

        path.reverse();

        // Return path with total distance
        let result = Array::new();
        let path_array: Array = path.iter().map(|&x| JsValue::from(x)).collect();
        let total_distance = *distances.get(&to).unwrap();

        result.push(&JsValue::from(path_array));
        result.push(&JsValue::from(total_distance));
        result
    }

    #[wasm_bindgen]
    pub fn get_vertices(&self) -> Array {
        self.adjacency_list
            .keys()
            .map(|&x| JsValue::from(x))
            .collect()
    }

    #[wasm_bindgen]
    pub fn get_edges(&self) -> Array {
        let mut result = Vec::new();

        for (&from, neighbors) in &self.adjacency_list {
            for &(to, weight) in neighbors {
                if self.is_directed || from <= to { // Avoid duplicates in undirected graphs
                    let edge = Array::new();
                    edge.push(&JsValue::from(from));
                    edge.push(&JsValue::from(to));
                    edge.push(&JsValue::from(weight));
                    result.push(JsValue::from(edge));
                }
            }
        }

        result.iter().cloned().collect()
    }
}