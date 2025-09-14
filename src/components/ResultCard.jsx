import React from 'react';

const ResultCard = ({ isCorrect, explanation, onNext, loading }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-2xl mx-auto">
      <div className="text-center mb-6">
        <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${
          isCorrect ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
        }`}>
          {isCorrect ? (
            <span className="text-3xl">✓</span>
          ) : (
            <span className="text-3xl">✗</span>
          )}
        </div>
        <h2 className={`text-2xl font-bold ${
          isCorrect ? 'text-green-600' : 'text-red-600'
        }`}>
          {isCorrect ? 'คำตอบถูกต้อง!' : 'คำตอบผิด!'}
        </h2>
      </div>

      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <h3 className="font-semibold text-gray-700 mb-2">คำอธิบาย:</h3>
        <p className="text-gray-800">{explanation || 'กำลังโหลดคำอธิบายจาก AI...'}</p>
      </div>

      <button
        onClick={onNext}
        disabled={loading}
        className={`w-full py-3 rounded-lg font-semibold text-white transition-colors ${
          loading
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-thai-blue hover:bg-blue-800'
        }`}
      >
        {loading ? 'กำลังโหลด...' : 'คำถามต่อไป'}
      </button>
    </div>
  );
};

export default ResultCard;