// src/pages/Home.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [playerName, setPlayerName] = useState('');
  const [settings, setSettings] = useState({
    humorMode: false,
    adaptiveStory: true
  });
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const savedName = localStorage.getItem('thaiGame_playerName');
    const savedHumor = localStorage.getItem('thaiGame_humorMode') === 'true';
    const savedAdaptive = localStorage.getItem('thaiGame_adaptiveStory') === 'true';

    if (savedName) setPlayerName(savedName);
    setSettings({
      humorMode: savedHumor,
      adaptiveStory: savedAdaptive
    });
  }, []);

  const handleStartGame = () => {
    if (playerName.trim()) {
      setIsLoading(true);
      localStorage.setItem('thaiGame_playerName', playerName.trim());
      localStorage.setItem('thaiGame_humorMode', settings.humorMode);
      localStorage.setItem('thaiGame_adaptiveStory', settings.adaptiveStory);

      setTimeout(() => {
        navigate('/game');
      }, 300);
    }
  };

  const handleSettingChange = (e) => {
    const { name, checked } = e.target;
    setSettings(prev => ({ ...prev, [name]: checked }));
  };

  return (
    <div className="container mx-auto px-4 py-6 sm:py-8">
      <div className="text-center mb-8 sm:mb-12">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-3 sm:mb-4">
          นักเรียนไทยย้อนยุค
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-2">
          เกมผจญภัยในสมัยโบราณของไทย พร้อม AI ที่จะเล่าเรื่องราวและสอนวัฒนธรรมไทยให้คุณ
        </p>
      </div>

      <div className="max-w-md sm:max-w-lg mx-auto bg-white rounded-xl shadow-lg p-6 sm:p-8 transition-all duration-300 hover:shadow-xl">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-5 sm:mb-6 text-center">เริ่มเกม</h2>

        <div className="mb-5 sm:mb-6">
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
            disabled={isLoading}
          />
        </div>

        <div className="mb-6 sm:mb-7 bg-gray-50 p-4 rounded-lg">
          <h3 className="font-bold text-gray-800 mb-3">ตั้งค่าเกม</h3>
          <div className="space-y-3">
            <label className="flex items-start sm:items-center">
              <input
                type="checkbox"
                name="humorMode"
                checked={settings.humorMode}
                onChange={handleSettingChange}
                className="mt-1 sm:mt-0 rounded text-amber-600 focus:ring-amber-500 h-4 w-4"
                disabled={isLoading}
              />
              <span className="ml-2 sm:ml-3 text-gray-700 text-sm sm:text-base">
                โหมดขำขัน (เมื่อตอบผิด)
              </span>
            </label>
            <label className="flex items-start sm:items-center">
              <input
                type="checkbox"
                name="adaptiveStory"
                checked={settings.adaptiveStory}
                onChange={handleSettingChange}
                className="mt-1 sm:mt-0 rounded text-amber-600 focus:ring-amber-500 h-4 w-4"
                disabled={isLoading}
              />
              <span className="ml-2 sm:ml-3 text-gray-700 text-sm sm:text-base">
                เนื้อเรื่องปรับตามพฤติกรรม
              </span>
            </label>
          </div>
        </div>

        <button
          onClick={handleStartGame}
          disabled={!playerName.trim() || isLoading}
          className={`w-full py-3 sm:py-3.5 rounded-lg font-semibold text-white transition-all duration-300 flex items-center justify-center ${
            playerName.trim() && !isLoading
              ? 'bg-gradient-to-r from-amber-600 to-amber-800 hover:from-amber-700 hover:to-amber-900 transform hover:-translate-y-0.5 shadow-md hover:shadow-lg'
              : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              กำลังเริ่ม...
            </>
          ) : (
            'เริ่มผจญภัย!'
          )}
        </button>
      </div>

      <div className="mt-12 sm:mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
        <div className="bg-white rounded-xl shadow-lg p-5 sm:p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">🏯</div>
          <h3 className="text-lg sm:text-xl font-bold mb-2">เรียนรู้วัฒนธรรม</h3>
          <p className="text-gray-600 text-sm sm:text-base">
            ผ่านการเล่นเกม คุณจะได้เรียนรู้เกี่ยวกับวัฒนธรรม ประเพณี และชีวิตในสมัยโบราณของไทย
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-5 sm:p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">🤖</div>
          <h3 className="text-lg sm:text-xl font-bold mb-2">AI Storyteller</h3>
          <p className="text-gray-600 text-sm sm:text-base">
            ระบบ AI จะเล่าเรื่องราวและสร้างเหตุการณ์ใหม่ให้คุณเสมอ ทำให้เกมไม่ซ้ำซาก
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-5 sm:p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">🎲</div>
          <h3 className="text-lg sm:text-xl font-bold mb-2">การตัดสินใจ</h3>
          <p className="text-gray-600 text-sm sm:text-base">
            ตัวเลือกของคุณจะส่งผลต่อเนื้อเรื่องและผลลัพธ์ของเกม คุณจะจบเกมแบบไหน?
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;