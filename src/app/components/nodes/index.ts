"use client"; // Thêm dòng này ở đầu file

import { useEffect, useState } from 'react';
import type { BuiltInNode, Node, NodeTypes } from '@xyflow/react';
import PositionLoggerNode, {
  type PositionLoggerNode as PositionLoggerNodeType,
} from './PositionLoggerNode';

// Define the grammar item type based on your API response
interface GrammarItem {
  id: string;
  position: { x: number; y: number };
  data: {
    label: string;
    description: string;
    url_html: string;
    url_pdf: string;
  };
  style: {
    background: string;
    border: string;
    borderRadius: string;
    padding: string;
  };
  category: number;
  collectionId?: string;
  collectionName?: string;
  created?: string;
  updated?: string;
}

interface PocketBaseResponse {
  page: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
  items: GrammarItem[];
}

// Export initialNodes as a mutable array
export let initialNodes: Node[] = [];

// Function to fetch nodes by category
export const fetchNodesByCategory = async (category: number = 0): Promise<Node[]> => {
  try {
    const response = await fetch(`https://pocketbase.vietopik.com/api/collections/grammars/records?perPage=300&filter=category=${category}`);
    const data: PocketBaseResponse = await response.json();
    
    // Transform API data to match the node structure expected by React Flow
    return data.items.map((item: GrammarItem) => ({
      id: item.id,
      position: item.position,
      data: item.data,
      style: item.style,
    }));
  } catch (error) {
    console.error(`Failed to fetch grammar nodes for category ${category}:`, error);
    return [];
  }
};

// Initialize nodes with a specific category (defaults to 0)
export const initializeNodes = async (category: number = 0): Promise<void> => {
  const nodes = await fetchNodesByCategory(category);
  
  // Clear the array and push new items
  initialNodes.splice(0, initialNodes.length);
  initialNodes.push(...nodes);
};

// Hook for components that need to wait for the data with category filtering
export const useNodesData = (category: number = 0) => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const fetchedNodes = await fetchNodesByCategory(category);
        setNodes(fetchedNodes);
      } catch (error) {
        console.error(`Failed to fetch grammar nodes for category ${category}:`, error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [category]); // Re-fetch when category changes
  
  return { nodes, loading };
};

export const nodeTypes = {
  'position-logger': PositionLoggerNode,
} satisfies NodeTypes;

export type CustomNodeType = BuiltInNode | PositionLoggerNodeType;