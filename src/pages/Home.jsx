// src/pages/Home.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [playerName, setPlayerName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const savedName = localStorage.getItem('thaiGame_playerName');
    if (savedName) setPlayerName(savedName);
  }, []);

  const handleStartGame = () => {
    if (playerName.trim()) {
      localStorage.setItem('thaiGame_playerName', playerName.trim());
      navigate('/game');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          นักเรียนไทยย้อนยุค
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto px-2">
          เกมผจญภัยในสมัยโบราณของไทย พร้อม AI ที่จะเล่าเรื่องราวและสอนวัฒนธรรมไทยให้คุณ
        </p>
      </div>

      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8 transition-all duration-300 hover:shadow-xl">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">เริ่มเกม</h2>

        <div className="mb-6">
          <label htmlFor="playerName" className="block text-gray-700 font-medium mb-2">
            ชื่อของคุณ:
          </label>
          <input
            type="text"
            id="playerName"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="ใส่ชื่อของคุณ..."
            className="w-full px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
            maxLength="20"
          />
        </div>

        <button
          onClick={handleStartGame}
          disabled={!playerName.trim()}
          className={`w-full py-3 sm:py-3.5 rounded-lg font-semibold text-white transition-all duration-300 flex items-center justify-center ${
            playerName.trim()
              ? 'bg-gradient-to-r from-amber-600 to-amber-800 hover:from-amber-700 hover:to-amber-900 transform hover:-translate-y-0.5 shadow-md hover:shadow-lg'
              : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          เริ่มผจญภัย!
        </button>
      </div>
    </div>
  );
};

export default Home;