// src/components/MiniGameCoinToss.jsx
import React, { useState, useEffect } from 'react';

const MiniGameCoinToss = ({ onComplete, playerName }) => {
  const [gameState, setGameState] = useState('intro'); // intro, playing, result
  const [coinsThrown, setCoinsThrown] = useState(0);
  const [hits, setHits] = useState(0);
  const [message, setMessage] = useState('พร้อมปาเหรียญหรือยัง?');
  const [isAnimating, setIsAnimating] = useState(false);

  const totalCoins = 5;

  const throwCoin = () => {
    if (gameState !== 'playing' || coinsThrown >= totalCoins || isAnimating) return;

    setIsAnimating(true);
    setMessage('เหรียญกำลังบิน...');
    
    // Simulate coin flight
    setTimeout(() => {
      const isHit = Math.random() > 0.5; // 50% chance to hit
      const newHits = isHit ? hits + 1 : hits;
      const newCoinsThrown = coinsThrown + 1;
      
      setHits(newHits);
      setCoinsThrown(newCoinsThrown);
      setMessage(isHit ? 'โดนจาน! 🎉' : 'พลาด... 😅');
      setIsAnimating(false);
      
      // Check if game is over
      if (newCoinsThrown >= totalCoins) {
        setTimeout(() => {
          setGameState('result');
          setMessage(`จบเกม! คุณปาเหรียญเข้าจาน ${newHits} จาก ${totalCoins} ลูก`);
        }, 1500);
      }
    }, 1000); // 1 second animation
  };

  const startGame = () => {
    setGameState('playing');
    setCoinsThrown(0);
    setHits(0);
    setMessage('คลิกปุ่มเพื่อปาเหรียญ!');
  };

  const finishGame = () => {
    // Calculate reward based on hits
    let xpReward = 0;
    let itemReward = null;
    
    if (hits >= 4) {
      xpReward = 10;
      itemReward = 'เหรียญโชคดี';
    } else if (hits >= 2) {
      xpReward = 5;
      itemReward = 'เหรียญธรรมดา';
    } else {
      xpReward = 2;
      itemReward = 'เหรียญเสีย';
    }
    
    onComplete({
      xp: xpReward,
      items: itemReward ? [itemReward] : [],
      message: `คุณได้รับ ${xpReward} XP ${itemReward ? `และ ${itemReward}` : ''}`
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-center text-amber-800 mb-4">เกมปาเหรียญใส่จาน</h2>
      
      <div className="text-center mb-6">
        <div className="relative h-32 mb-4">
          {/* Target */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-24 h-24 rounded-full border-4 border-red-500 flex items-center justify-center">
              <div className="w-16 h-16 rounded-full border-2 border-red-400"></div>
              <div className="w-8 h-8 rounded-full border-2 border-red-300 absolute"></div>
            </div>
          </div>
          
          {/* Coin (animated) */}
          {isAnimating && (
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 animate-bounce">
              <div className="w-8 h-8 rounded-full bg-yellow-500 border-2 border-yellow-600 flex items-center justify-center text-xs font-bold">
                ฿
              </div>
            </div>
          )}
        </div>
        
        <p className="text-lg text-gray-700 mb-2">{message}</p>
        <p className="text-gray-500">
          {gameState === 'playing' && `ปาเหรียญ: ${coinsThrown}/${totalCoins}`}
        </p>
      </div>

      <div className="text-center">
        {gameState === 'intro' && (
          <button
            onClick={startGame}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-full transition-colors"
          >
            เริ่มเล่น!
          </button>
        )}
        
        {gameState === 'playing' && (
          <button
            onClick={throwCoin}
            disabled={isAnimating || coinsThrown >= totalCoins}
            className={`font-bold py-3 px-6 rounded-full transition-colors ${
              isAnimating || coinsThrown >= totalCoins
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-amber-600 hover:bg-amber-700 text-white'
            }`}
          >
            {isAnimating ? 'กำลังปา...' : 'ปาเหรียญ!'}
          </button>
        )}
        
        {gameState === 'result' && (
          <div>
            <div className="mb-4">
              <p className="text-xl font-semibold text-amber-700">
                คะแนน: {hits}/{totalCoins}
              </p>
              <p className="text-gray-600 mt-2">
                {hits >= 4 ? 'ยอดเยี่ยมมาก! 🏆' : 
                 hits >= 2 ? 'ดีเลย! 👍' : 
                 'ไม่เป็นไร ครั้งหน้าจะดีกว่านี้! 💪'}
              </p>
            </div>
            <button
              onClick={finishGame}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full transition-colors"
            >
              รับรางวัล & กลับเกมหลัก
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MiniGameCoinToss;