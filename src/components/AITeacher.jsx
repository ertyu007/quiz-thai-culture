import React, { useState } from 'react';
import { askAITeacher } from '../services/aiService';

const AITeacher = () => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (question.trim() && !loading) {
      setLoading(true);
      setAnswer('');
      try {
        const aiAnswer = await askAITeacher(question);
        setAnswer(aiAnswer);
      } catch (error) {
        setAnswer('ขออภัย ไม่สามารถตอบคำถามได้ในขณะนี้');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-2xl mx-auto mt-8">
      <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
        <span className="mr-2">🤖</span>
        ถาม AI ครูไทย
      </h2>
      
      <form onSubmit={handleSubmit} className="flex">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="เช่น 'อธิบายพิธีลอยกระทงให้หน่อย'..."
          className="flex-grow px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-thai-blue"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !question.trim()}
          className={`px-6 py-2 rounded-r-lg font-semibold text-white transition-colors ${
            loading || !question.trim()
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-thai-orange hover:bg-orange-700'
          }`}
        >
          ถาม
        </button>
      </form>
      
      <div className="mt-4 text-sm text-gray-500">
        ตัวอย่าง: "วัดพระแก้วอยู่ที่ไหน?", "อาหารไทยมีกี่ประเภท?", "อธิบายประเพณีสงกรานต์"
      </div>
      
      {answer && (
        <div className="mt-6 bg-blue-50 rounded-lg p-4">
          <h3 className="font-semibold text-gray-700 mb-2">คำตอบจาก AI:</h3>
          <p className="text-gray-800 whitespace-pre-wrap">{answer}</p>
        </div>
      )}
    </div>
  );
};

export default AITeacher;