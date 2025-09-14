const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

// ตรวจสอบ API Key
const getApiKey = () => {
  const apiKey = process.env.REACT_APP_GROQ_API_KEY;
  if (!apiKey) {
    throw new Error('API Key ไม่ได้ตั้งค่า กรุณาตรวจสอบ Environment Variables');
  }
  return apiKey;
};

// ฟังก์ชันสำหรับอธิบายคำตอบโดย AI
export const getAIExplanation = async (question, userAnswer, correctAnswer) => {
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
            content: "คุณเป็นครูสอนวัฒนธรรมไทย ตอบคำถามอย่างกระชับ เข้าใจง่าย และเป็นประโยชน์"
          },
          {
            role: "user",
            content: `คำถาม: ${question.question}\nคำตอบของผู้เล่น: ${userAnswer}\nคำตอบที่ถูกต้อง: ${correctAnswer}\n\nกรุณาอธิบายคำตอบที่ถูกต้องอย่างกระชับ`
          }
        ]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    const result = await response.json();
    return result.choices[0].message.content;
  } catch (error) {
    console.error('Error getting AI explanation:', error);
    return `คำตอบที่ถูกต้องคือ ${correctAnswer} เพราะ ${question.explanation}`;
  }
};

// ฟังก์ชันสำหรับสร้างคำถามใหม่โดย AI
export const generateNewQuestion = async (category) => {
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
            content: "คุณเป็นผู้เชี่ยวชาญด้านวัฒนธรรมไทย สร้างคำถามแบบปรนัย 4 ตัวเลือกเกี่ยวกับวัฒนธรรมไทย ตอบเป็น JSON ตามรูปแบบที่กำหนด"
          },
          {
            role: "user",
            content: `สร้างคำถามแบบปรนัย 4 ตัวเลือกเกี่ยวกับ ${category} ของไทย พร้อมคำตอบที่ถูกต้องและคำอธิบาย ตอบเป็น JSON ตามรูปแบบนี้:\n{\n  "question": "คำถาม",\n  "options": ["A. ตัวเลือก 1", "B. ตัวเลือก 2", "C. ตัวเลือก 3", "D. ตัวเลือก 4"],\n  "correctAnswer": "A",\n  "explanation": "คำอธิบาย"\n}`
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
    
    const questionData = JSON.parse(jsonString);
    
    return {
      id: Date.now(),
      category: category,
      question: questionData.question,
      options: questionData.options,
      correctAnswer: questionData.correctAnswer,
      explanation: questionData.explanation
    };
  } catch (error) {
    console.error('Error generating new question:', error);
    return {
      id: Date.now(),
      category: category,
      question: `คำถามเกี่ยวกับ ${category} (สร้างโดย AI)`,
      options: [
        "A. ตัวเลือกที่ 1",
        "B. ตัวเลือกที่ 2",
        "C. ตัวเลือกที่ 3",
        "D. ตัวเลือกที่ 4"
      ],
      correctAnswer: "A",
      explanation: "นี่คือคำถามสำรองเมื่อระบบ AI ไม่สามารถสร้างคำถามได้"
    };
  }
};

// ฟังก์ชันสำหรับวิเคราะห์ผลการสอบโดย AI
export const getAIAnalysis = async (results) => {
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
            content: "คุณเป็นผู้เชี่ยวชาญด้านการศึกษา วิเคราะห์ผลการทดสอบและให้คำแนะนำอย่างละเอียด ตอบเป็น JSON ตามรูปแบบที่กำหนด"
          },
          {
            role: "user",
            content: `ผลการทดสอบ: ${JSON.stringify(results)}\n\nกรุณาวิเคราะห์ผลการทดสอบ สรุปจุดแข็ง จุดอ่อน และคำแนะนำในการพัฒนา ตอบเป็น JSON ตามรูปแบบนี้:\n{\n  "summary": "สรุปผลการทดสอบ",\n  "strengths": ["จุดแข็ง 1", "จุดแข็ง 2"],\n  "weaknesses": ["จุดอ่อน 1", "จุดอ่อน 2"],\n  "recommendations": ["คำแนะนำ 1", "คำแนะนำ 2"]\n}`
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
    console.error('Error getting AI analysis:', error);
    return {
      summary: "ไม่สามารถวิเคราะห์ผลได้ในขณะนี้",
      strengths: [],
      weaknesses: [],
      recommendations: []
    };
  }
};

// ฟังก์ชันสำหรับถามคำถามครู AI
export const askAITeacher = async (question) => {
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
            content: "คุณเป็นครูสอนวัฒนธรรมไทย ตอบคำถามอย่างกระชับ เข้าใจง่าย และเป็นประโยชน์"
          },
          {
            role: "user",
            content: question
          }
        ]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    const result = await response.json();
    return result.choices[0].message.content;
  } catch (error) {
    console.error('Error asking AI teacher:', error);
    return "ขออภัย ไม่สามารถตอบคำถามได้ในขณะนี้ กรุณาตรวจสอบการเชื่อมต่ออินเทอร์เน็ตและ API Key";
  }
};