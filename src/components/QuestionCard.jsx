import React, { useState } from 'react';

const QuestionCard = ({ question, onAnswer, currentQuestion, totalQuestions }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const handleOptionSelect = (option) => {
    if (!submitted) {
      setSelectedOption(option);
    }
  };

  const handleSubmit = () => {
    if (selectedOption) {
      setSubmitted(true);
      onAnswer(selectedOption);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-2xl mx-auto">
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="bg-thai-orange text-white px-3 py-1 rounded-full text-sm font-semibold">
            {question.category}
          </span>
          <span className="text-gray-500">
            {currentQuestion} / {totalQuestions}
          </span>
        </div>
        <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-6">
          {question.question}
        </h2>
      </div>

      <div className="space-y-3 mb-6">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleOptionSelect(option.charAt(0))}
            className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${
              selectedOption === option.charAt(0)
                ? 'border-thai-blue bg-blue-50'
                : 'border-gray-200 hover:border-thai-green hover:bg-green-50'
            } ${submitted ? 'cursor-not-allowed' : 'cursor-pointer'}`}
            disabled={submitted}
          >
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                selectedOption === option.charAt(0)
                  ? 'bg-thai-blue text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}>
                {option.charAt(0)}
              </div>
              <span>{option.substring(3)}</span>
            </div>
          </button>
        ))}
      </div>

      <button
        onClick={handleSubmit}
        disabled={!selectedOption || submitted}
        className={`w-full py-3 rounded-lg font-semibold text-white transition-colors ${
          selectedOption && !submitted
            ? 'bg-thai-green hover:bg-green-700'
            : 'bg-gray-400 cursor-not-allowed'
        }`}
      >
        {submitted ? 'กำลังประมวลผล...' : 'ส่งคำตอบ'}
      </button>
    </div>
  );
};

export default QuestionCard;