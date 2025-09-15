// src/components/PlayerStats.jsx
import React from 'react';

const PlayerStats = ({ playerName, xp }) => {
  return (
    <div className="mb-4 flex justify-between items-center bg-amber-50 p-3 rounded-lg">
      <div className="text-gray-700">
        <span className="font-semibold">ผู้เล่น:</span> {playerName}
      </div>
      <div className="bg-amber-200 text-amber-800 px-3 py-1 rounded-full text-sm font-semibold">
        XP: {xp}
      </div>
    </div>
  );
};

export default PlayerStats;