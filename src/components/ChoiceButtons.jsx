// src/components/ChoiceButtons.jsx
import React from 'react';

const ChoiceButtons = ({ choices, onChoose, loading, requirementNotMet }) => {
  const getChoiceLabel = (id, index) => {
    if (id && id.startsWith('choice') && id.length > 6) {
      return String.fromCharCode(65 + index);
    }
    if (id && id.length === 1) {
      return id.toUpperCase();
    }
    if (id === 'go_home') return '🏠';
    if (id === 'try_again') return '🔄';
    if (id === 'continue_anyway') return '➡️';
    return String.fromCharCode(65 + index);
  };

  return (
    <div className="space-y-3">
      {choices.map((choice, index) => (
        <button
          key={choice.id || index}
          onClick={() => onChoose(choice.id)}
          disabled={loading || requirementNotMet}
          className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 text-base sm:text-lg ${
            loading || requirementNotMet
              ? 'bg-gray-100 border-gray-300 cursor-not-allowed opacity-70'
              : 'bg-amber-50 border-amber-200 hover:bg-amber-100 hover:border-amber-300 active:scale-[0.98]'
          }`}
        >
          <div className="flex items-center">
            <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center mr-3 flex-shrink-0 ${
              loading || requirementNotMet ? 'bg-gray-300 text-gray-500' : 'bg-amber-200 text-amber-800'
            }`}>
              {getChoiceLabel(choice.id, index)}
            </div>
            <span className="flex-1">{choice.text}</span>
            {choice.requiredItems && choice.requiredItems.length > 0 && (
              <span className="ml-2 text-xs bg-gray-200 text-gray-600 rounded-full px-2 py-1 whitespace-nowrap">
                🔒 ต้องการ: {choice.requiredItems.join(', ')}
              </span>
            )}
            {choice.requiredXp > 0 && (
              <span className="ml-2 text-xs bg-gray-200 text-gray-600 rounded-full px-2 py-1 whitespace-nowrap">
                🔒 XP ≥ {choice.requiredXp}
              </span>
            )}
          </div>
        </button>
      ))}
    </div>
  );
};

export default ChoiceButtons;