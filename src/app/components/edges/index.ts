import { useEffect, useState } from 'react';
import type { BuiltInEdge, Edge, EdgeTypes } from "@xyflow/react";
import ButtonEdge, { type ButtonEdge as ButtonEdgeType } from "./ButtonEdge";

// Interface cho dữ liệu Pocketbase
interface PocketbaseEdgeData {
  id: string;
  source: string;
  target: string;
  type: string;
  animated: boolean;
  style: {
    stroke: string;
    strokeWidth: number;
    strokeDasharray?: string;
  };
}

interface PocketbaseEdgeRecord {
  collectionId: string;
  collectionName: string;
  created: string;
  data: PocketbaseEdgeData;
  id: string;
  updated: string;
}

interface PocketbaseCategory {
  category: number;
  collectionId: string;
  collectionName: string;
  created: string;
  edge: string[];
  expand: {
    edge: PocketbaseEdgeRecord[];
  };
  id: string;
  title: string;
  updated: string;
}

interface PocketbaseResponse {
  page: number;
  perPage: number;
  totalItems: number;
  totalPages: number;
  items: PocketbaseCategory[];
}

// Empty initial edges array (will be populated by the API)
export const initialEdges: Edge[] = [];

// Hook để fetch và quản lý dữ liệu edges từ API
export const useEdgesData = (category: number = 0) => {
  const [edges, setEdges] = useState<Edge[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEdges = async () => {
      try {
        setLoading(true);
        // Sử dụng category = 1 nếu category = 0 (default value)
        const categoryId = category || 1;
        
        const response = await fetch(
          `https://pocketbase.vietopik.com/api/collections/grammarEdgeCategories/records?expand=edge&filter=category=${categoryId}`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch edges data');
        }

        const data: PocketbaseResponse = await response.json();

        if (data.items.length > 0 && data.items[0].expand.edge) {
          // Transform the Pocketbase edge data to the format expected by @xyflow/react
          const transformedEdges = data.items[0].expand.edge.map(edgeRecord => ({
            ...edgeRecord.data
          }));

          setEdges(transformedEdges);
        } else {
          setEdges([]);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        console.error('Error fetching edges:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEdges();
  }, [category]);

  return { edges, loading, error };
};

export const edgeTypes = {
  // Add your custom edge types here!
  "button-edge": ButtonEdge,
} satisfies EdgeTypes;

// Append the types of your custom edges to the BuiltInEdge type
export type CustomEdgeType = BuiltInEdge | ButtonEdgeType;