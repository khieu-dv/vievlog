// lib/flowService.ts

export interface FlowItem {
  id: number;
  title: string;
  description: string;
}

// Mock data - replace with actual API calls in production
const mockFlows: FlowItem[] = [
  { id: 1, title: "Beginner I", description: "Korean Grammar in Use" },
  { id: 2, title: "Beginner II", description: "Korean Grammar in Use" },
  // { id: 3, title: "Intermetidate I", description: "Korean Grammar in Use" },
  // { id: 4, title: "Intermetidate II", description: "Korean Grammar in Use" },
  // { id: 5, title: "Advance I", description: "Korean Grammar in Use" },
  // { id: 6, title: "Advance II", description: "Korean Grammar in Use" },
];

export async function getFlows(): Promise<FlowItem[]> {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // In production, replace with real API call:
  // const response = await fetch('/api/flows');
  // return response.json();
  
  return mockFlows;
}

export async function getFlowById(id: number): Promise<FlowItem | null> {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // In production, replace with real API call:
  // const response = await fetch(`/api/flows/${id}`);
  // return response.json();
  
  return mockFlows.find(flow => flow.id === id) || null;
}
