// src/components/Header.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <header className="bg-gradient-to-r from-amber-700 to-amber-900 text-white py-4 px-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <h1
          className="text-xl md:text-2xl font-bold flex items-center cursor-pointer hover:opacity-90 transition-opacity"
          onClick={handleGoHome}
        >
          <span className="mr-2">📜</span>
          นักเรียนไทยย้อนยุค
        </h1>
        <button
          onClick={handleGoHome}
          className="bg-amber-200 text-amber-900 hover:bg-amber-300 px-3 py-1 rounded-full text-sm font-semibold transition-colors"
        >
          หน้าแรก
        </button>
      </div>
    </header>
  );
};

export default Header;