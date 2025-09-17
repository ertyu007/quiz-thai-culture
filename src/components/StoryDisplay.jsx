// src/components/StoryDisplay.jsx
import React from 'react';

const StoryDisplay = ({ storyText }) => {
  return (
    <div className="prose max-w-none mb-6">
      <p className="text-lg text-gray-800 whitespace-pre-line">{storyText}</p>
    </div>
  );
};

export default StoryDisplay;