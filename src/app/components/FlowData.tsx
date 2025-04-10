"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import FlowList from "./FlowList";
import FlowDiagram from "./Flow";

interface FlowItem {
  id: number;
  title: string;
  description: string;
}

interface FlowProps {
  category?: number;
}

export default function Flow({ category = 0 }: FlowProps) {
  const [flows, setFlows] = useState<FlowItem[]>([]);
  const [selectedFlowId, setSelectedFlowId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // In a real application, this would fetch from an API
    const fetchFlows = async () => {
      try {
        setLoading(true);
        // Replace with actual API call
        // const response = await axios.get('/api/flows');
        // setFlows(response.data);
        
        // Mock data for example
        const mockFlows: FlowItem[] = Array.from({ length: 10 }, (_, i) => ({
          id: i,
          title: `Flow ${i + 1}`,
          description: `This is a description for Flow ${i + 1}. Click to view the diagram.`
        }));
        
        setFlows(mockFlows);
        setError(null);
      } catch (err) {
        setError("Failed to load flows. Please try again later.");
        console.error("Error fetching flows:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFlows();
  }, [category]);

  const handleSelectFlow = (id: number) => {
    setSelectedFlowId(id);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold mb-6">Flow Diagrams</h1>
      
      <FlowList 
        flows={flows} 
        onSelectFlow={handleSelectFlow} 
        selectedFlowId={selectedFlowId} 
      />
      
      {selectedFlowId !== null && (
        <div className="mt-6">
          <h2 className="text-2xl font-bold mb-4">{flows[selectedFlowId]?.title}</h2>
          <FlowDiagram 
            category={selectedFlowId} 
            // visible={true} 
          />
        </div>
      )}
      
      {selectedFlowId === null && (
        <div className="flex items-center justify-center h-64 border border-dashed border-gray-300 rounded-lg">
          <p className="text-gray-500">Select a flow to view its diagram</p>
        </div>
      )}
    </div>
  );
}