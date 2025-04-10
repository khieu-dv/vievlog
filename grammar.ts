

import type { BuiltInNode, Node, NodeTypes } from "@xyflow/react";

export const initialNodes = [
  // Present Tenses - Arranged in a vertical flow with better spacing
  {
    id: "a",
    position: { "x": 100, "y": 50 },
    data: {
      "label": "01 Present Tense A/V-(스)ㅂ니다",
      "description": "Present Tense A/V-(스)ㅂ니다",
      "url_html": "https://viedesk.sgp1.cdn.digitaloceanspaces.com/topik/35/topik1/listening/index-format.html",
      "url_pdf": "https://viedesk.sgp1.cdn.digitaloceanspaces.com/kiip/beginner1/book/lession_2_2.pdf"
    },
    style: { 
      "background": "#e6f7ff",
      "border": "1px solid #1890ff",
      "borderRadius": "8px",
      "padding": "10px"
    }
  },
  {
    id: "b",
    position: { "x": 100, "y": 150 },
    data: {
      "label": "02 Present Tense A/V-아/어요",
      "description": "Present Tense A/V-아/어요",
      "url_html": "https://viedesk.sgp1.cdn.digitaloceanspaces.com/topik/35/topik1/listening/index-format.html",
      "url_pdf": "https://viedesk.sgp1.cdn.digitaloceanspaces.com/kiip/beginner1/book/lession_2_2.pdf"
    },
    style: { 
      "background": "#e6f7ff",
      "border": "1px solid #1890ff",
      "borderRadius": "8px",
      "padding": "10px"
    }
  },
  {
    id: "c",
    position: { "x": 100, "y": 250 },
    data: {
      "label": "03 Past Tense A/V-았/었어요",
      "description": "Past Tense A/V-았/었어요",
      "url_html": "https://viedesk.sgp1.cdn.digitaloceanspaces.com/topik/41/topik1/listening/index-format.html",
      "url_pdf": "https://viedesk.sgp1.cdn.digitaloceanspaces.com/kiip/beginner1/book/lession_2_2.pdf"
    },
    style: { 
      "background": "#e6f7ff",
      "border": "1px solid #1890ff",
      "borderRadius": "8px",
      "padding": "10px"
    }
  },
  {
    id: "d",
    position: { "x": 100, "y": 350 },
    data: {
      "label": "04 Future Tense V-(으)ㄹ 거예요①....",
      "description": "Future Tense V-(으)ㄹ 거예요①....",
      "url_html": "https://viedesk.sgp1.cdn.digitaloceanspaces.com/topik/47/topik1/listening/index-format.html",
      "url_pdf": "https://viedesk.sgp1.cdn.digitaloceanspaces.com/kiip/beginner1/book/lession_2_2.pdf"
    },
    style: { 
      "background": "#e6f7ff",
      "border": "1px solid #1890ff",
      "borderRadius": "8px",
      "padding": "10px"
    }
  },

  // Time Expressions - Positioned to the right with appropriate spacing
  {
    id: "e",
    position: { "x": 300, "y": 50 },
    data: {
      "label": "01 N전에, V-기 전에",
      "description": "N전에, V-기 전에",
      "url_html": "https://viedesk.sgp1.cdn.digitaloceanspaces.com/topik/35/topik1/listening/index-format.html",
      "url_pdf": "https://viedesk.sgp1.cdn.digitaloceanspaces.com/kiip/beginner1/book/lession_2_2.pdf"
    },
    style: { 
      "background": "#f6ffed",
      "border": "1px solid #52c41a",
      "borderRadius": "8px",
      "padding": "10px"
    }
  },
  {
    id: "f",
    position: { "x": 300, "y": 150 },
    data: {
      "label": "02 N 후에, V-(으)ㄴ 후에",
      "description": "N 후에, V-(으)ㄴ 후에",
      "url_html": "https://viedesk.sgp1.cdn.digitaloceanspaces.com/topik/35/topik1/listening/index-format.html",
      "url_pdf": "https://viedesk.sgp1.cdn.digitaloceanspaces.com/kiip/beginner1/book/lession_2_2.pdf"
    },
    style: { 
      "background": "#f6ffed",
      "border": "1px solid #52c41a",
      "borderRadius": "8px",
      "padding": "10px"
    }
  },

  // Negative Expressions - Positioned to the right with appropriate spacing
  {
    id: "g",
    position: { "x": 500, "y": 50 },
    data: {
      "label": "01 Word Negation",
      "description": "Word Negation",
      "url_html": "https://viedesk.sgp1.cdn.digitaloceanspaces.com/topik/35/topik1/listening/index-format.html",
      "url_pdf": "https://viedesk.sgp1.cdn.digitaloceanspaces.com/kiip/beginner1/book/lession_3.pdf"
    },
    style: { 
      "background": "#fff2e8",
      "border": "1px solid #fa8c16",
      "borderRadius": "8px",
      "padding": "10px"
    }
  },
  {
    id: "h",
    position: { "x": 500, "y": 150 },
    data: {
      "label": "02 안A/V-아/어요 (A/V-지 않아요)",
      "description": "안A/V-아/어요 (A/V-지 않아요)",
      "url_html": "https://viedesk.sgp1.cdn.digitaloceanspaces.com/topik/35/topik1/listening/index-format.html",
      "url_pdf": "https://viedesk.sgp1.cdn.digitaloceanspaces.com/kiip/beginner1/book/lession_4.pdf"
    },
    style: { 
      "background": "#fff2e8",
      "border": "1px solid #fa8c16",
      "borderRadius": "8px",
      "padding": "10px"
    }
  },
  {
    id: "i",
    position: { "x": 500, "y": 250 },
    data: {
      "label": "08못 V-아/어요 (V-지 못해요)",
      "description": "못 V-아/어요 (V-지 못해요)",
      "url_html": "https://viedesk.sgp1.cdn.digitaloceanspaces.com/topik/35/topik1/listening/index-format.html",
      "url_pdf": "https://viedesk.sgp1.cdn.digitaloceanspaces.com/kiip/beginner1/book/lession_5.pdf"
    },
    style: { 
      "background": "#fff2e8",
      "border": "1px solid #fa8c16",
      "borderRadius": "8px",
      "padding": "10px"
    }
  },
] satisfies Node[];

