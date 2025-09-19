// src/components/PlayerStats.jsx
import React from 'react';

const PlayerStats = ({ playerName, xp, unlockedAchievements = [], onShowProgress }) => {
  return (
    <div className="mb-4 flex flex-col sm:flex-row justify-between items-center bg-amber-50 p-3 rounded-lg space-y-2 sm:space-y-0">
      <div className="text-gray-700">
        <span className="font-semibold">ผู้เล่น:</span> {playerName}
      </div>
      <div className="flex items-center space-x-2">
        <div className="bg-amber-200 text-amber-800 px-3 py-1 rounded-full text-sm font-semibold">
          XP: {xp}
        </div>
        <button
          onClick={onShowProgress}
          className="bg-green-200 text-green-800 px-3 py-1 rounded-full text-sm font-semibold hover:bg-green-300 transition-colors flex items-center"
        >
          <span className="mr-1">🏆</span>
          Achievements: {unlockedAchievements.length}
          <span className="ml-1 text-xs">📊</span>
        </button>
      </div>
    </div>
  );
};

export default PlayerStats;