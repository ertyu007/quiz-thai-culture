// src/components/PlayerStats.jsx
import React from 'react';

const PlayerStats = ({ playerName, xp, items = [], unlockedAchievements = [] }) => {
  return (
    <div className="mb-4 flex flex-wrap justify-between items-center bg-amber-50 p-3 rounded-lg">
      <div className="text-gray-700 mb-2 sm:mb-0">
        <span className="font-semibold">ผู้เล่น:</span> {playerName}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <div className="bg-amber-200 text-amber-800 px-3 py-1 rounded-full text-sm font-semibold">
          XP: {xp}
        </div>
        <div className="bg-blue-200 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
          ไอเท็ม: {items.length}
        </div>
        <div className="bg-green-200 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
          Achievements: {unlockedAchievements.length}
        </div>
      </div>
    </div>
  );
};

export default PlayerStats;