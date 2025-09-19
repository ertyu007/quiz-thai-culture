// src/pages/Home.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSettings } from '../contexts/SettingsContext';

const Home = () => {
  const [playerName, setPlayerName] = useState('');
  const [humorMode, setHumorMode] = useState(false);
  const [adaptiveStory, setAdaptiveStory] = useState(true);
  const navigate = useNavigate();
  const { soundEnabled } = useSettings();

  useEffect(() => {
    const savedName = localStorage.getItem('thaiGame_playerName');
    const savedHumor = localStorage.getItem('thaiGame_humorMode') === 'true';
    const savedAdaptive = localStorage.getItem('thaiGame_adaptiveStory') !== 'false';

    if (savedName) setPlayerName(savedName);
    setHumorMode(savedHumor);
    setAdaptiveStory(savedAdaptive);
  }, []);

  const handleStartGame = () => {
    if (playerName.trim()) {
      localStorage.setItem('thaiGame_playerName', playerName.trim());
      localStorage.setItem('thaiGame_humorMode', humorMode);
      localStorage.setItem('thaiGame_adaptiveStory', adaptiveStory);
      navigate('/game');
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <motion.div
      className="container mx-auto px-4 py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="text-center mb-12"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          className="text-4xl md:text-5xl font-bold text-gray-800 mb-4"
          variants={itemVariants}
        >
          นักเรียนไทยย้อนยุค
        </motion.h1>
        <motion.p
          className="text-xl text-gray-600 max-w-2xl mx-auto"
          variants={itemVariants}
        >
          เกมผจญภัยในสมัยโบราณของไทย พร้อม AI ที่จะเล่าเรื่องราวและสอนวัฒนธรรมไทยให้คุณ
        </motion.p>
      </motion.div>

      <motion.div
        className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8 mb-12"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
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
            <label className="flex items-center">
              <input
                type="checkbox"
                name="adaptiveStory"
                checked={adaptiveStory}
                onChange={(e) => setAdaptiveStory(e.target.checked)}
                className="rounded text-amber-600 focus:ring-amber-500 h-4 w-4"
              />
              <span className="ml-2 text-gray-700">เรื่องราวปรับตามการเล่น</span>
            </label>
          </div>
        </div>

        <button
          onClick={handleStartGame}
          disabled={!playerName.trim()}
          className={`w-full py-3 rounded-lg font-semibold text-white transition-all ${playerName.trim()
              ? 'bg-gradient-to-r from-amber-600 to-amber-800 hover:from-amber-700 hover:to-amber-900 transform hover:scale-105'
              : 'bg-gray-400 cursor-not-allowed'
            }`}
        >
          เริ่มผจญภัย!
        </button>
      </motion.div>

      <motion.div
        className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
          variants={itemVariants}
          whileHover={{ y: -5 }}
        >
          <div className="text-4xl mb-4">🏯</div>
          <h3 className="text-xl font-bold mb-2">เรียนรู้วัฒนธรรม</h3>
          <p className="text-gray-600">
            ผ่านการเล่นเกม คุณจะได้เรียนรู้เกี่ยวกับวัฒนธรรม ประเพณี และชีวิตในสมัยโบราณของไทย
          </p>
        </motion.div>

        <motion.div
          className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
          variants={itemVariants}
          whileHover={{ y: -5 }}
        >
          <div className="text-4xl mb-4">🤖</div>
          <h3 className="text-xl font-bold mb-2">AI ช่วยสอน</h3>
          <p className="text-gray-600">
            ได้รับคำอธิบายทันทีเมื่อตอบผิด และสามารถถามคำถามเพิ่มเติมได้
          </p>
        </motion.div>

        <motion.div
          className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
          variants={itemVariants}
          whileHover={{ y: -5 }}
        >
          <div className="text-4xl mb-4">🔄</div>
          <h3 className="text-xl font-bold mb-2">คำถามไม่ซ้ำ</h3>
          <p className="text-gray-600">
            AI สร้างคำถามใหม่ทุกครั้ง ทำให้เล่นกี่รอบก็ไม่เบื่อ
          </p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Home;