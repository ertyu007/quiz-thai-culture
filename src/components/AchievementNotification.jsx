// src/components/AchievementNotification.jsx
import React, { useEffect } from 'react';

const AchievementNotification = ({ achievement, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000); // ปิดอัตโนมัติหลัง 5 วินาที

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-4 right-4 z-50 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white p-4 rounded-lg shadow-lg animate-fadeInDown">
      <div className="flex items-start">
        <span className="text-2xl mr-3">{achievement.icon || '🏆'}</span>
        <div>
          <h3 className="font-bold text-lg">Achievement ใหม่!</h3>
          <p className="font-semibold">{achievement.title}</p>
          <p className="text-sm opacity-90">{achievement.description}</p>
        </div>
        <button 
          onClick={onClose}
          className="ml-4 text-white hover:text-gray-200 self-start"
          aria-label="ปิด"
        >
          &times;
        </button>
      </div>
    </div>
  );
};

export default AchievementNotification;