const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

// ตรวจสอบ API Key
const getApiKey = () => {
  const apiKey = process.env.REACT_APP_GROQ_API_KEY;
  if (!apiKey) {
    throw new Error('API Key ไม่ได้ตั้งค่า');
  }
  return apiKey;
};

// ฟังก์ชันสำหรับสร้างเนื้อเรื่องเริ่มต้น
export const initializeStory = async (playerName) => {
  try {
    const apiKey = getApiKey();
    
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        messages: [
          {
            role: "system",
            content: "คุณเป็นนักเขียนเนื้อเรื่องผจญภัยในสมัยโบราณของไทย สร้างเนื้อเรื่องที่มีตัวเลือก 2-3 ตัวเลือก ตอบเป็น JSON ตามรูปแบบที่กำหนด"
          },
          {
            role: "user",
            content: `สร้างฉากเปิดเกมสำหรับนักเรียนไทยชื่อ "${playerName}" ในสมัยรัชกาลที่ 5-6 ซึ่งต้องไปช่วยงานวัดในงานประเพณีสงกรานต์ ตอบเป็น JSON ตามรูปแบบนี้:\n{\n  "text": "ข้อความเนื้อเรื่อง",\n  "choices": [\n    {"id": "choice1", "text": "ตัวเลือก 1"},\n    {"id": "choice2", "text": "ตัวเลือก 2"},\n    {"id": "choice3", "text": "ตัวเลือก 3"}\n  ],\n  "context": {"scene": "opening", "playerName": "${playerName}"}\n}`
          }
        ]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    const result = await response.json();
    const aiResponse = result.choices[0].message.content;
    
    // แยก JSON จากคำตอบของ AI
    const jsonStart = aiResponse.indexOf('{');
    const jsonEnd = aiResponse.lastIndexOf('}') + 1;
    const jsonString = aiResponse.substring(jsonStart, jsonEnd);
    
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('Error initializing story:', error);
    return {
      text: `สวัสดี ${playerName}! คุณคือนักเรียนไทยในสมัยโบราณ วันนี้ครูให้ไปช่วยงานวัดประจำปี...`,
      choices: [
        { id: 'help_prepare', text: "ไปช่วยเตรียมของสำหรับงานวัด" },
        { id: 'explore_temple', text: "ไปสำรวจวัดก่อนเริ่มงาน" },
        { id: 'find_friends', text: "ไปหาเพื่อนๆ ที่มาช่วยงาน" }
      ],
      context: { scene: "opening", playerName }
    };
  }
};

// ฟังก์ชันสำหรับดำเนินเรื่องตามตัวเลือก
export const makeChoice = async (choiceId, context) => {
  try {
    const apiKey = getApiKey();
    
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        messages: [
          {
            role: "system",
            content: "คุณเป็นนักเขียนเนื้อเรื่องผจญภัยในสมัยโบราณของไทย ดำเนินเรื่องตามตัวเลือกของผู้เล่น สร้างเนื้อเรื่องที่มีตัวเลือก 2-3 ตัวเลือก ตอบเป็น JSON ตามรูปแบบที่กำหนด"
          },
          {
            role: "user",
            content: `ดำเนินเรื่องต่อจาก context: ${JSON.stringify(context)}\n\nผู้เล่นเลือก: ${choiceId}\n\nตอบเป็น JSON ตามรูปแบบนี้:\n{\n  "story": {\n    "text": "ข้อความเนื้อเรื่อง",\n    "choices": [\n      {"id": "choice1", "text": "ตัวเลือก 1"},\n      {"id": "choice2", "text": "ตัวเลือก 2"}\n    ],\n    "context": {"scene": "next_scene", "playerName": "ชื่อผู้เล่น"}\n  },\n  "stats": {\n    "xp": 10,\n    "items": ["ไอเทมที่ได้รับ"]\n  },\n  "gameEnded": false,\n  "ending": null\n}`
          }
        ]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    const result = await response.json();
    const aiResponse = result.choices[0].message.content;
    
    // แยก JSON จากคำตอบของ AI
    const jsonStart = aiResponse.indexOf('{');
    const jsonEnd = aiResponse.lastIndexOf('}') + 1;
    const jsonString = aiResponse.substring(jsonStart, jsonEnd);
    
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('Error making choice:', error);
    return {
      story: {
        text: "คุณได้ทำการเลือกของคุณ... และเรื่องราวก็ดำเนินต่อไป",
        choices: [
          { id: 'continue1', text: "ดำเนินเรื่องต่อ" },
          { id: 'continue2', text: "สำรวจบริเวณ" }
        ],
        context: { ...context, previousChoice: choiceId }
      },
      stats: { xp: 5, items: [] },
      gameEnded: false,
      ending: null
    };
  }
};

// ฟังก์ชันสำหรับรับสถิติผู้เล่น
export const getPlayerProgress = () => {
  const stats = localStorage.getItem('playerStats');
  return stats ? JSON.parse(stats) : { xp: 0, items: [] };
};