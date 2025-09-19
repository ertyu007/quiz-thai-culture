// src/components/Header.jsx
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSettings } from '../contexts/SettingsContext';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { soundEnabled, musicEnabled, autoSave } = useSettings();

  const handleGoHome = () => {
    navigate('/');
  };

  const isGamePage = location.pathname === '/game';

  return (
    <header className="bg-gradient-to-r from-amber-700 to-amber-900 text-white py-4 px-4 shadow-lg sticky top-0 z-40">
      <div className="container mx-auto flex justify-between items-center">
        <h1
          className="text-xl md:text-2xl font-bold flex items-center cursor-pointer hover:opacity-90 transition-opacity"
          onClick={handleGoHome}
        >
          <span className="mr-2">📜</span>
          นักเรียนไทยย้อนยุค
        </h1>

        <div className="flex items-center space-x-2">
          {isGamePage && (
            <div className="hidden md:flex items-center space-x-3 mr-4">
              <div className={`text-xs px-2 py-1 rounded ${soundEnabled ? 'bg-green-600' : 'bg-gray-600'}`}>
                {soundEnabled ? '🔊' : '🔇'}
              </div>
              <div className={`text-xs px-2 py-1 rounded ${musicEnabled ? 'bg-green-600' : 'bg-gray-600'}`}>
                {musicEnabled ? '🎵' : '🎵̸'}
              </div>
              <div className={`text-xs px-2 py-1 rounded ${autoSave ? 'bg-green-600' : 'bg-gray-600'}`}>
                {autoSave ? '💾' : '💾̸'}
              </div>
            </div>
          )}

          <button
            onClick={handleGoHome}
            className="bg-amber-200 text-amber-900 hover:bg-amber-300 px-3 py-1 rounded-full text-sm font-semibold transition-colors flex items-center"
          >
            <span className="mr-1">🏠</span>
            หน้าแรก
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;