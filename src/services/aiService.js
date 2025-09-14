// services/aiService.js
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

export const getAIExplanation = async (question, userAnswer, correctAnswer) => {
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
  
  const data = await response.json();
  return data.choices[0].message.content;
};