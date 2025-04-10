import { useState } from "react";

interface FlowItem {
  id: number;
  title: string;
  description: string;
}

interface FlowListProps {
  flows: FlowItem[];
  onSelectFlow: (id: number) => void;
  selectedFlowId: number | null;
}

export default function FlowList({ flows, onSelectFlow, selectedFlowId }: FlowListProps) {
  return (
    <div className="flex flex-col space-y-4 mb-6">
      <h2 className="text-2xl font-bold">Available Grammar Diagram</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {flows.map((flow) => (
          <div
            key={flow.id}
            className={`p-4 rounded-lg border cursor-pointer transition-all ${selectedFlowId === flow.id
                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                : "border-gray-200 hover:border-blue-300 dark:border-gray-700"
              }`}
            onClick={() => onSelectFlow(flow.id)}
          >
            <h3 className="font-semibold mb-2">{flow.title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{flow.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}