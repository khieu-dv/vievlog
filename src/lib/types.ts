// lib/types.ts
export interface Message {
    id: string;
    content: string; // Đảm bảo trường này khớp với 'content' trong các chỗ khác
    sender: string;
    roomId: string;
    timestamp: number;
  }
  
  // Thêm interface cho Server IO
  export interface NextApiResponseServerIO extends Response {
    socket: {
      server: any;
    };
  }
  
  export interface User {
    id: string;
    name: string;
  }
  
  export interface Room {
    id: string;
    name: string;
  }