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

  useEffect(() => {
    // ในโปรเจคจริง คุณอาจดึงคำถามจาก API หรือ AI
    setQuestions(thaiCultureQuestions.slice(0, 5));
  }, []);

  const handleAnswer = (selectedOption) => {
    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = selectedOption === currentQuestion.correctAnswer;
    
    const newUserAnswer = {
      questionId: currentQuestion.id,
      selectedOption,
      isCorrect
    };
    
    setUserAnswers([...userAnswers, newUserAnswer]);
    
    // ขอคำอธิบายจาก AI
    setLoading(true);
    getAIExplanation(currentQuestion, selectedOption, currentQuestion.correctAnswer)
      .then(aiExplanation => {
        setExplanation(aiExplanation);
        setLoading(false);
      });
    
    setShowResult(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setShowResult(false);
      setExplanation('');
    } else {
      // ส่งผลลัพธ์ไปหน้า Result
      navigate('/result', { state: { userAnswers, questions } });
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
    </div>
  );
};

export default Quiz;