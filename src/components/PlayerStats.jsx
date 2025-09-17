// src/components/PlayerStats.jsx
import React from 'react';

const PlayerStats = ({ playerName, xp, unlockedAchievements = [] }) => {
  return (
    <div className="mb-4 flex justify-between items-center bg-amber-50 p-3 rounded-lg">
      <div className="text-gray-700">
        <span className="font-semibold">ผู้เล่น:</span> {playerName}
      </div>
      <div className="flex items-center space-x-2">
        <div className="bg-amber-200 text-amber-800 px-3 py-1 rounded-full text-sm font-semibold">
          XP: {xp}
        </div>
        <div className="bg-green-200 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
          Achievements: {unlockedAchievements.length}
        </div>
      </div>
    </div>
  );
};

export default PlayerStats;