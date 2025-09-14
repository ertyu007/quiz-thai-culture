import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { getAIAnalysis } from '../services/aiService';

const Result = () => {
  const location = useLocation();
  const { userAnswers, questions } = location.state || {};
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userAnswers && questions) {
      // วิเคราะห์ผลด้วย AI
      getAIAnalysis(userAnswers)
        .then(result => {
          setAnalysis(result);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [userAnswers, questions]);

  if (!userAnswers || !questions) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-800">ไม่พบข้อมูลผลลัพธ์</h2>
        <Link to="/" className="text-thai-blue hover:underline mt-4 inline-block">
          กลับไปหน้าแรก
        </Link>
      </div>
    );
  }

  const correctAnswers = userAnswers.filter(answer => answer.isCorrect).length;
  const score = Math.round((correctAnswers / questions.length) * 100);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
          ผลลัพธ์การทดสอบ
        </h1>
        
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-6">
          <div className="text-6xl font-bold mb-2">
            {score}<span className="text-2xl">%</span>
          </div>
          <div className="text-gray-600 mb-4">
            คุณตอบถูก {correctAnswers} จาก {questions.length} คำถาม
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
            <div 
              className={`h-4 rounded-full ${
                score >= 70 ? 'bg-green-500' : score >= 50 ? 'bg-yellow-500' : 'bg-red-500'
              }`} 
              style={{ width: `${score}%` }}
            ></div>
          </div>
          
          <div className={`text-lg font-semibold ${
            score >= 70 ? 'text-green-600' : score >= 50 ? 'text-yellow-600' : 'text-red-600'
          }`}>
            {score >= 70 ? 'เก่งมาก!' : score >= 50 ? 'ดีมาก!' : 'ต้องพัฒนาเพิ่มเติม'}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="text-4xl mb-4">🤖</div>
          <h2 className="text-2xl font-bold text-gray-800">AI กำลังวิเคราะห์ผลของคุณ...</h2>
          <p className="text-gray-600 mt-2">กรุณารอสักครู่</p>
        </div>
      ) : analysis ? (
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <span className="mr-2">📊</span>
              สรุปผลจาก AI
            </h2>
            <p className="text-gray-700 mb-4">{analysis.summary}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <h3 className="font-semibold text-green-600 mb-2">จุดแข็ง</h3>
                <ul className="space-y-2">
                  {analysis.strengths.map((strength, index) => (
                    <li key={index} className="flex items-center">
                      <span className="text-green-500 mr-2">✓</span>
                      {strength}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-red-600 mb-2">ควรปรับปรุง</h3>
                <ul className="space-y-2">
                  {analysis.weaknesses.map((weakness, index) => (
                    <li key={index} className="flex items-center">
                      <span className="text-red-500 mr-2">✗</span>
                      {weakness}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <span className="mr-2">💡</span>
              คำแนะนำเพิ่มเติม
            </h2>
            <ul className="space-y-3">
              {analysis.recommendations.map((rec, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-thai-orange mr-2 mt-1">➤</span>
                  <span className="text-gray-700">{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-800">ไม่สามารถวิเคราะห์ผลได้</h2>
        </div>
      )}

      <div className="text-center mt-12">
        <Link
          to="/"
          className="inline-block bg-thai-blue text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors mr-4"
        >
          กลับหน้าหลัก
        </Link>
        <Link
          to="/quiz"
          className="inline-block bg-thai-green text-white font-bold py-3 px-6 rounded-lg hover:bg-green-700 transition-colors"
        >
          เล่นอีกครั้ง
        </Link>
      </div>
    </div>
  );
};

export default Result;