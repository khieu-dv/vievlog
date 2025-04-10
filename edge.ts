import type { BuiltInEdge, Edge, EdgeTypes } from "@xyflow/react";

export const initialEdges = [
  // Connecting Present Tenses nodes vertically
  { 
    "id": "t9t2nzqalnip1u6->8xsebgfczuwztxj", 
    "source": "t9t2nzqalnip1u6", 
    "target": "8xsebgfczuwztxj", 
    "type": "button-edge",
    "animated": true,
    "style": { "stroke": "#1890ff", "strokeWidth": 2 }
  },
  { 
    "id": "8xsebgfczuwztxj->vgdvw9yjs3crwu6", 
    "source": "8xsebgfczuwztxj", 
    "target": "vgdvw9yjs3crwu6", 
    "type": "button-edge",
    "animated": true,
    "style": { "stroke": "#1890ff", "strokeWidth": 2 }
  },
  
  { 
    "id": "vgdvw9yjs3crwu6->kdq4byyl0kvh0vr", 
    "source": "vgdvw9yjs3crwu6", 
    "target": "kdq4byyl0kvh0vr", 
    "type": "button-edge",
    "animated": true,
    "style": { "stroke": "#1890ff", "strokeWidth": 2 }
  },

  { 
    "id": "kdq4byyl0kvh0vr->muejjpewad9d1aa", 
    "source": "kdq4byyl0kvh0vr", 
    "target": "muejjpewad9d1aa", 
    "type": "button-edge",
    "animated": true,
    "style": { "stroke": "#1890ff", "strokeWidth": 2 }
  },

  { 
    "id": "muejjpewad9d1aa->iulo5z9xjsp583o", 
    "source": "muejjpewad9d1aa", 
    "target": "iulo5z9xjsp583o", 
    "type": "button-edge",
    "animated": true,
    "style": { "stroke": "#1890ff", "strokeWidth": 2 }
  },

  { 
    "id": "iulo5z9xjsp583o->7646dv2tewzilh2", 
    "source": "iulo5z9xjsp583o", 
    "target": "7646dv2tewzilh2", 
    "type": "button-edge",
    "animated": false,
    "style": { "stroke": "#722ed1", "strokeWidth": 1, strokeDasharray: "5,5" }
  },
  
  // Connecting Time Expressions nodes vertically
  { 
    "id": "muejjpewad9d1aa->iulo5z9xjsp583o", 
    "source": "muejjpewad9d1aa", 
    "target": "iulo5z9xjsp583o", 
    "type": "button-edge",
    "animated": true,
    "style": { "stroke": "#52c41a", "strokeWidth": 2 }
  },
  
  // Connecting Negative Expressions nodes vertically
  { 
    "id": "7646dv2tewzilh2->1fyv8wkulqmmd27", 
    "source": "7646dv2tewzilh2", 
    "target": "1fyv8wkulqmmd27", 
    "type": "button-edge",
    "animated": true,
    "style": { "stroke": "#fa8c16", "strokeWidth": 2 }
  },
  { 
    "id": "muejjpewad9d1aa->49mwstbx5qb4iyj", 
    "source": "muejjpewad9d1aa", 
    "target": "49mwstbx5qb4iyj", 
    "type": "button-edge",
    "animated": true,
    "style": { "stroke": "#fa8c16", "strokeWidth": 2 }
  },
  
  
  // Connecting between categories (optional, for showing relationships)
  { 
    "id": "iulo5z9xjsp583o->7646dv2tewzilh2", 
    "source": "iulo5z9xjsp583o", 
    "target": "7646dv2tewzilh2", 
    "type": "button-edge",
    "animated": false,
    "style": { "stroke": "#722ed1", "strokeWidth": 1, strokeDasharray: "5,5" }
  },
  { 
    "id": "1fyv8wkulqmmd27->505j49krbyb2ict", 
    "source": "1fyv8wkulqmmd27", 
    "target": "505j49krbyb2ict", 
    "type": "button-edge",
    "animated": false,
    "style": { "stroke": "#722ed1", "strokeWidth": 1, strokeDasharray: "5,5" }
  },
] satisfies Edge[];

