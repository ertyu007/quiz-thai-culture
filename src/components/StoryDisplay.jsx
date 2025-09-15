// src/components/StoryDisplay.jsx
import React from 'react';

const countItems = (items) => {
  return items.reduce((acc, item) => {
    acc[item] = (acc[item] || 0) + 1;
    return acc;
  }, {});
};

const StoryDisplay = ({ storyText, items = [] }) => {
  const uniqueItems = [...new Set(items)];
  const itemCounts = countItems(items);

  return (
    <div className="prose max-w-none mb-6">
      <p className="text-lg text-gray-800 whitespace-pre-line mb-4">{storyText}</p>

      {uniqueItems.length > 0 && (
        <div className="bg-blue-50 rounded-lg p-3">
          <h4 className="font-semibold text-blue-800 mb-1">ไอเท็มที่ได้รับ:</h4>
          <ul className="text-blue-700 list-disc list-inside">
            {uniqueItems.map((item, index) => (
              <li key={index} className="flex items-center">
                <span>{item}</span>
                {itemCounts[item] > 1 && (
                  <span className="text-xs bg-blue-100 text-blue-600 rounded-full px-2 py-0.5 ml-2">
                    x{itemCounts[item]}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default StoryDisplay;