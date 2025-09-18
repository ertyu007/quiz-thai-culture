// src/pages/Home.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [playerName, setPlayerName] = useState('');
  const [humorMode, setHumorMode] = useState(false); // เพิ่ม state สำหรับ humor mode
  const navigate = useNavigate();

  useEffect(() => {
    const savedName = localStorage.getItem('thaiGame_playerName');
    const savedHumor = localStorage.getItem('thaiGame_humorMode') === 'true';
    if (savedName) setPlayerName(savedName);
    setHumorMode(savedHumor); // โหลดค่า humor mode ที่บันทึกไว้
  }, []);

  const handleStartGame = () => {
    if (playerName.trim()) {
      localStorage.setItem('thaiGame_playerName', playerName.trim());
      localStorage.setItem('thaiGame_humorMode', humorMode); // บันทึก humor mode
      navigate('/game');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          นักเรียนไทยย้อนยุค
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          เกมผจญภัยในสมัยโบราณของไทย พร้อม AI ที่จะเล่าเรื่องราวและสอนวัฒนธรรมไทยให้คุณ
        </p>
      </div>

      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">เริ่มเกม</h2>
        
        <div className="mb-5">
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

        {/* เพิ่ม Toggle สำหรับ Humor Mode */}
        <div className="mb-6 bg-gray-50 p-4 rounded-lg">
          <h3 className="font-bold text-gray-800 mb-3">ตั้งค่าเกม</h3>
          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="humorMode"
                checked={humorMode}
                onChange={(e) => setHumorMode(e.target.checked)}
                className="rounded text-amber-600 focus:ring-amber-500 h-4 w-4"
              />
              <span className="ml-2 text-gray-700">โหมดขำขัน (เมื่อตอบผิด)</span>
            </label>
          </div>
        </div>

        <button
          onClick={handleStartGame}
          disabled={!playerName.trim()}
          className={`w-full py-3 rounded-lg font-semibold text-white transition-colors ${
            playerName.trim()
              ? 'bg-gradient-to-r from-amber-600 to-amber-800 hover:from-amber-700 hover:to-amber-900'
              : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          เริ่มผจญภัย!
        </button>
      </div>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
          <div className="text-4xl mb-4">🏯</div>
          <h3 className="text-xl font-bold mb-2">เรียนรู้วัฒนธรรม</h3>
          <p className="text-gray-600">
            ผ่านการเล่นเกม คุณจะได้เรียนรู้เกี่ยวกับวัฒนธรรม ประเพณี และชีวิตในสมัยโบราณของไทย
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
          <div className="text-4xl mb-4">🤖</div>
          <h3 className="text-xl font-bold mb-2">AI ช่วยสอน</h3>
          <p className="text-gray-600">
            ได้รับคำอธิบายทันทีเมื่อตอบผิด และสามารถถามคำถามเพิ่มเติมได้
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
          <div className="text-4xl mb-4">🔄</div>
          <h3 className="text-xl font-bold mb-2">คำถามไม่ซ้ำ</h3>
          <p className="text-gray-600">
            AI สร้างคำถามใหม่ทุกครั้ง ทำให้เล่นกี่รอบก็ไม่เบื่อ
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;