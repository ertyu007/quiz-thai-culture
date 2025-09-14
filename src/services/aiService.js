const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

export const getAIExplanation = async (question, userAnswer, correctAnswer) => {
  try {
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.REACT_APP_GROQ_API_KEY}`,
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
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error getting AI explanation:', error);
    return `คำตอบที่ถูกต้องคือ ${correctAnswer} เพราะ ${question.explanation}`;
  }
};

export const generateNewQuestion = async (category) => {
  try {
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.REACT_APP_GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        messages: [
          {
            role: "system",
            content: "คุณเป็นผู้เชี่ยวชาญด้านวัฒนธรรมไทย สร้างคำถามแบบปรนัย 4 ตัวเลือกเกี่ยวกับวัฒนธรรมไทย"
          },
          {
            role: "user",
            content: `สร้างคำถามแบบปรนัย 4 ตัวเลือกเกี่ยวกับ ${category} ของไทย พร้อมคำตอบที่ถูกต้องและคำอธิบาย`
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // const data = await response.json();
    
    // ประมวลผลคำตอบจาก AI เพื่อสร้าง object คำถาม
    // ในโปรเจคจริง ควรใช้การประมวลผลที่ซับซ้อนกว่านี้
    return {
      id: Math.floor(Math.random() * 1000),
      category: category,
      question: `คำถามใหม่เกี่ยวกับ ${category} (สร้างโดย AI)`,
      options: [
        "A. ตัวเลือกที่ 1",
        "B. ตัวเลือกที่ 2", 
        "C. ตัวเลือกที่ 3",
        "D. ตัวเลือกที่ 4"
      ],
      correctAnswer: "A",
      explanation: "คำอธิบายจาก AI"
    };
  } catch (error) {
    console.error('Error generating new question:', error);
    return {
      id: Math.floor(Math.random() * 1000),
      category: category,
      question: `คำถามเกี่ยวกับ ${category}`,
      options: [
        "A. ตัวเลือกที่ 1",
        "B. ตัวเลือกที่ 2",
        "C. ตัวเลือกที่ 3", 
        "D. ตัวเลือกที่ 4"
      ],
      correctAnswer: "A",
      explanation: "คำอธิบายสำหรับคำถาม"
    };
  }
};

export const getAIAnalysis = async (results) => {
  try {
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.REACT_APP_GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        messages: [
          {
            role: "system",
            content: "คุณเป็นผู้เชี่ยวชาญด้านการศึกษา วิเคราะห์ผลการทดสอบและให้คำแนะนำอย่างละเอียด"
          },
          {
            role: "user",
            content: `ผลการทดสอบ: ${JSON.stringify(results)}\n\nกรุณาวิเคราะห์ผลการทดสอบ สรุปจุดแข็ง จุดอ่อน และคำแนะนำในการพัฒนา`
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // const data = await response.json();
    
    // ประมวลผลคำตอบจาก AI
    // ในโปรเจคจริง ควรใช้การประมวลผลที่ซับซ้อนกว่านี้
    return {
      summary: "AI วิเคราะห์ผลการทดสอบของคุณ",
      strengths: ["จุดแข็ง 1", "จุดแข็ง 2"],
      weaknesses: ["จุดอ่อน 1", "จุดอ่อน 2"],
      recommendations: [
        "คำแนะนำ 1",
        "คำแนะนำ 2"
      ]
    };
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

export const askAITeacher = async (question) => {
  try {
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.REACT_APP_GROQ_API_KEY}`,
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
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error asking AI teacher:', error);
    return "ขออภัย ไม่สามารถตอบคำถามได้ในขณะนี้";
  }
};