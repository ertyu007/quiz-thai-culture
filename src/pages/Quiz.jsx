import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { thaiCultureQuestions } from '../data/questions';
import { getAIExplanation, generateNewQuestion } from '../services/aiService';
import QuestionCard from '../components/QuestionCard';
import ResultCard from '../components/ResultCard';

const Quiz = () => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [explanation, setExplanation] = useState('');
  const [loading, setLoading] = useState(false);
  const [generatingQuestion, setGeneratingQuestion] = useState(false);

  useEffect(() => {
    // เริ่มต้นด้วยคำถามพื้นฐาน
    setQuestions(thaiCultureQuestions.slice(0, 3));
  }, []);

  const handleAnswer = async (selectedOption) => {
    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = selectedOption === currentQuestion.correctAnswer;
    
    const newUserAnswer = {
      questionId: currentQuestion.id,
      selectedOption,
      isCorrect,
      category: currentQuestion.category
    };
    
    setUserAnswers([...userAnswers, newUserAnswer]);
    
    // ขอคำอธิบายจาก AI
    setLoading(true);
    try {
      const aiExplanation = await getAIExplanation(
        currentQuestion, 
        selectedOption, 
        currentQuestion.correctAnswer
      );
      setExplanation(aiExplanation);
    } catch (error) {
      setExplanation(`คำตอบที่ถูกต้องคือ ${currentQuestion.correctAnswer} เพราะ ${currentQuestion.explanation}`);
    } finally {
      setLoading(false);
    }
    
    setShowResult(true);
  };

  const handleNextQuestion = async () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setShowResult(false);
      setExplanation('');
    } else {
      // เมื่อทำคำถามสุดท้ายแล้ว ให้ไปหน้าผลลัพธ์
      navigate('/result', { state: { userAnswers, questions } });
    }
  };

  // ฟังก์ชันสำหรับสร้างคำถามใหม่โดย AI
  const handleGenerateQuestion = async () => {
    setGeneratingQuestion(true);
    try {
      // สุ่มหมวดคำถาม
      const categories = ["ศิลปะ", "ประเพณี", "อาหาร", "ภาษา", "สถานที่"];
      const randomCategory = categories[Math.floor(Math.random() * categories.length)];
      
      const newQuestion = await generateNewQuestion(randomCategory);
      setQuestions([...questions, newQuestion]);
    } catch (error) {
      console.error('Error generating question:', error);
    } finally {
      setGeneratingQuestion(false);
    }
  };

  if (questions.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="text-4xl mb-4">🔄</div>
        <h2 className="text-2xl font-bold text-gray-800">กำลังโหลดคำถาม...</h2>
        <p className="text-gray-600 mt-2">AI กำลังสร้างคำถามสำหรับคุณ</p>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="bg-thai-green h-2.5 rounded-full transition-all duration-500" 
            style={{ width: `${((currentQuestionIndex + (showResult ? 1 : 0)) / questions.length) * 100}%` }}
          ></div>
        </div>
        <div className="flex justify-between mt-2 text-sm text-gray-600">
          <span>คำถามที่ {currentQuestionIndex + 1}</span>
          <span>{questions.length} คำถาม</span>
        </div>
      </div>

      {!showResult ? (
        <QuestionCard
          question={currentQuestion}
          onAnswer={handleAnswer}
          currentQuestion={currentQuestionIndex + 1}
          totalQuestions={questions.length}
        />
      ) : (
        <ResultCard
          isCorrect={userAnswers[userAnswers.length - 1]?.isCorrect}
          explanation={explanation}
          onNext={handleNextQuestion}
          loading={loading}
        />
      )}

      {/* ปุ่มสำหรับสร้างคำถามใหม่โดย AI */}
      <div className="text-center mt-8">
        <button
          onClick={handleGenerateQuestion}
          disabled={generatingQuestion}
          className={`inline-block bg-thai-orange text-white font-bold py-3 px-6 rounded-lg hover:bg-orange-700 transition-colors ${
            generatingQuestion ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {generatingQuestion ? 'กำลังสร้างคำถาม...' : 'สร้างคำถามใหม่โดย AI'}
        </button>
      </div>
    </div>
  );
};

export default Quiz;