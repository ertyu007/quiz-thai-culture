// ไฟล์นี้จะใช้สำหรับเชื่อมต่อกับ Groq API
// ในตอนนี้เราจะใช้ Mock Data แทน

export const getAIExplanation = (question, userAnswer, correctAnswer) => {
  // ในโปรเจคจริง คุณจะต้องเรียก API ของ Groq ที่นี่
  return new Promise((resolve) => {
    setTimeout(() => {
      const explanations = [
        `คำตอบที่ถูกต้องคือ ${correctAnswer} เพราะ ${question.explanation}`,
        `คุณตอบว่า ${userAnswer} แต่จริงๆ แล้ว ${question.explanation}`,
        `คำตอบที่ถูกคือ ${correctAnswer} ซึ่งเกี่ยวข้องกับ ${question.category} ของไทย`
      ];
      
      resolve(explanations[Math.floor(Math.random() * explanations.length)]);
    }, 1000);
  });
};

export const generateNewQuestion = (category) => {
  // ในโปรเจคจริง คุณจะใช้ Groq API เพื่อสร้างคำถามใหม่
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockQuestions = [
        {
          id: Math.floor(Math.random() * 1000),
          category: category,
          question: `คำถามใหม่เกี่ยวกับ ${category}`,
          options: [
            "A. ตัวเลือกที่ 1",
            "B. ตัวเลือกที่ 2",
            "C. ตัวเลือกที่ 3",
            "D. ตัวเลือกที่ 4"
          ],
          correctAnswer: "A",
          explanation: "นี่คือคำอธิบายสำหรับคำถามใหม่"
        }
      ];
      
      resolve(mockQuestions[0]);
    }, 1500);
  });
};

export const getAIAnalysis = (results) => {
  // ในโปรเจคจริง คุณจะใช้ Groq API เพื่อวิเคราะห์ผล
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        summary: "คุณมีความรู้ดีเกี่ยวกับวัฒนธรรมไทย โดยเฉพาะในเรื่องอาหารและศิลปะ แต่ควรเรียนรู้เพิ่มเติมเกี่ยวกับประเพณี",
        strengths: ["อาหารไทย", "ศิลปะไทย"],
        weaknesses: ["ประเพณี", "สถานที่สำคัญ"],
        recommendations: [
          "ลองศึกษาเพิ่มเติมเกี่ยวกับประเพณีสงกรานต์",
          "เรียนรู้เกี่ยวกับสถานที่สำคัญในประเทศไทย"
        ]
      });
    }, 2000);
  });
};